import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { ACCOUNTS_STORE_PATH } from '../config.mjs';
import { normalizeAuthStorageCapabilities } from './codex-service.mjs';
import { ensureDir, readJson, writeJson } from '../utils/fs.mjs';
import { randomId } from '../utils/id.mjs';

function normalizeSnapshot(raw = '') {
  return String(raw || '').trim();
}

function normalizeUsageWindow(window = null) {
  if (!window || typeof window !== 'object') return null;
  return {
    usedPercent: Number.isFinite(Number(window.usedPercent)) ? Number(window.usedPercent) : null,
    leftPercent: Number.isFinite(Number(window.leftPercent)) ? Number(window.leftPercent) : null,
    windowMinutes: Number.isFinite(Number(window.windowMinutes)) ? Number(window.windowMinutes) : null,
    resetAt: typeof window.resetAt === 'string' && window.resetAt ? window.resetAt : null
  };
}

function normalizeUsageSnapshot(snapshot = null) {
  if (!snapshot || typeof snapshot !== 'object') return null;
  return {
    source: snapshot.source === 'saved-account-cache'
      ? 'saved-account-cache'
      : snapshot.source === 'cli-probe'
        ? 'cli-probe'
        : 'session-log',
    sessionFile: String(snapshot.sessionFile || ''),
    capturedAt: typeof snapshot.capturedAt === 'string' && snapshot.capturedAt ? snapshot.capturedAt : null,
    accountEmail: String(snapshot.accountEmail || '').trim(),
    accountId: String(snapshot.accountId || '').trim(),
    planType: String(snapshot.planType || '').trim(),
    freshForCurrentLogin: Boolean(snapshot.freshForCurrentLogin),
    primary: normalizeUsageWindow(snapshot.primary),
    secondary: normalizeUsageWindow(snapshot.secondary),
    credits: snapshot.credits && typeof snapshot.credits === 'object' ? snapshot.credits : null
  };
}

function toSavedUsageSnapshot(snapshot = null) {
  const normalized = normalizeUsageSnapshot(snapshot);
  if (!normalized) return null;
  return {
    ...normalized,
    source: 'saved-account-cache',
    freshForCurrentLogin: false
  };
}

function fingerprintSnapshot(raw = '') {
  return crypto.createHash('sha256').update(normalizeSnapshot(raw), 'utf8').digest('hex');
}

function emptyIdentity() {
  return {
    identityEmail: '',
    identitySubject: '',
    identityAccountId: ''
  };
}

function decodeJwtPayload(token = '') {
  const parts = String(token || '').split('.');
  if (parts.length < 2) return null;
  try {
    const payload = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const padded = payload + '='.repeat((4 - (payload.length % 4)) % 4);
    return JSON.parse(Buffer.from(padded, 'base64').toString('utf8'));
  } catch {
    return null;
  }
}

function extractSnapshotIdentity(raw = '') {
  const snapshot = normalizeSnapshot(raw);
  if (!snapshot) return emptyIdentity();
  try {
    const parsed = JSON.parse(snapshot);
    const idTokenPayload = decodeJwtPayload(parsed?.tokens?.id_token);
    return {
      identityEmail: String(idTokenPayload?.email || '').trim(),
      identitySubject: String(idTokenPayload?.sub || '').trim(),
      identityAccountId: String(parsed?.tokens?.account_id || idTokenPayload?.account_id || '').trim()
    };
  } catch {
    return emptyIdentity();
  }
}

function normalizeAccount(account = {}) {
  const provider = account.provider === 'api-key'
    ? 'api-key'
    : account.provider === 'chatgpt'
      ? 'chatgpt'
      : 'unknown';
  const kind = account.kind || (provider === 'chatgpt' ? 'chatgpt-snapshot' : 'api-key');
  return {
    id: String(account.id || ''),
    name: String(account.name || '').trim() || 'Account',
    provider,
    kind,
    createdAt: account.createdAt || new Date(0).toISOString(),
    updatedAt: account.updatedAt || new Date(0).toISOString(),
    verifiedAt: account.verifiedAt || null,
    lastCheckMessage: String(account.lastCheckMessage || ''),
    available: account.available !== false,
    snapshotFingerprint: String(account.snapshotFingerprint || ''),
    identityEmail: String(account.identityEmail || '').trim(),
    identitySubject: String(account.identitySubject || '').trim(),
    identityAccountId: String(account.identityAccountId || '').trim(),
    lastKnownUsage: normalizeUsageSnapshot(account.lastKnownUsage)
  };
}

async function readTextFile(targetPath) {
  try {
    return await fs.readFile(targetPath, 'utf8');
  } catch {
    return null;
  }
}

async function writeTextAtomic(targetPath, value) {
  await ensureDir(path.dirname(targetPath));
  const tempPath = `${targetPath}.tmp-${Date.now()}`;
  await fs.writeFile(tempPath, value, 'utf8');
  await fs.chmod(tempPath, 0o600).catch(() => {});
  await fs.rename(tempPath, targetPath);
}

export class AccountService {
  constructor({ keychainService, codexService, accountsStorePath = ACCOUNTS_STORE_PATH, authFilePath }) {
    this.keychain = keychainService;
    this.codex = codexService;
    this.accountsStorePath = accountsStorePath;
    this.authFilePath = authFilePath || this.codex.getAuthFilePath();
  }

  async readState() {
    const raw = await readJson(this.accountsStorePath, { version: 2, activeAccountId: '', accounts: [] });
    return {
      version: 2,
      activeAccountId: String(raw?.activeAccountId || ''),
      accounts: Array.isArray(raw?.accounts) ? raw.accounts.map(normalizeAccount) : []
    };
  }

  async writeState(state) {
    await writeJson(this.accountsStorePath, {
      version: 2,
      activeAccountId: state.activeAccountId || '',
      accounts: (state.accounts || []).map(normalizeAccount)
    });
  }

  verificationMessage(capabilities) {
    if (!capabilities?.auth?.loggedIn) return 'Verification failed. No active Codex session detected.';
    return `Verified via ${capabilities.auth.method || 'codex login status'}.`;
  }

  async currentChatgptFingerprint() {
    const raw = await readTextFile(this.authFilePath);
    if (!raw) return '';
    return fingerprintSnapshot(raw);
  }

  resolveActiveAccountId(state, capabilities, currentFingerprint = '') {
    const accounts = state.accounts || [];
    if (!capabilities?.auth?.loggedIn) return '';
    if (capabilities.auth.provider === 'chatgpt') {
      return accounts.find((account) =>
        account.kind === 'chatgpt-snapshot' && account.snapshotFingerprint === currentFingerprint
      )?.id || '';
    }
    if (capabilities.auth.provider === 'api-key') {
      return accounts.find((account) =>
        account.id === state.activeAccountId && account.kind === 'api-key'
      )?.id || '';
    }
    return '';
  }

  patchAccount(state, accountId, updates = {}) {
    return {
      ...state,
      accounts: state.accounts.map((account) => (
        account.id === accountId
          ? normalizeAccount({ ...account, ...updates })
          : account
      ))
    };
  }

  async writeAuthSnapshot(snapshot) {
    await writeTextAtomic(this.authFilePath, normalizeSnapshot(snapshot));
  }

  async restoreAuthSnapshot(previousRaw) {
    if (typeof previousRaw === 'string') {
      await writeTextAtomic(this.authFilePath, previousRaw);
      return;
    }
    await fs.rm(this.authFilePath, { force: true }).catch(() => {});
  }

  async verifySnapshotSwitch(expectedProvider) {
    const capabilities = await this.codex.getCapabilities();
    if (!capabilities.auth.loggedIn || capabilities.auth.provider !== expectedProvider) {
      throw new Error(
        expectedProvider === 'chatgpt'
          ? 'Saved browser login is no longer valid. Sign in again in Codex and save a fresh snapshot.'
          : 'Saved account verification failed.'
      );
    }
    return capabilities;
  }

  async refreshListedAccounts(stateOverride = null) {
    const state = stateOverride || await this.readState();
    const hydratedState = await this.hydrateSnapshotMetadata(state);
    const capabilities = await this.codex.getCapabilities();
    capabilities.authStorage = normalizeAuthStorageCapabilities(capabilities.authStorage, this.authFilePath);
    const currentFingerprint = capabilities.auth.provider === 'chatgpt'
      ? await this.currentChatgptFingerprint()
      : '';
    const activeAccountId = this.resolveActiveAccountId(hydratedState, capabilities, currentFingerprint);
    let nextState = hydratedState;
    let activeAccount = (nextState.accounts || []).find((account) => account.id === activeAccountId) || null;
    const activeAccountUpdatedMs = Date.parse(activeAccount?.updatedAt || '');
    const detectedUsage = await this.codex.getCurrentUsageSnapshot({
      freshAfterMs: Number.isFinite(activeAccountUpdatedMs) ? activeAccountUpdatedMs : 0
    });
    if (activeAccountId && detectedUsage?.freshForCurrentLogin) {
      const savedUsage = toSavedUsageSnapshot(detectedUsage);
      const currentSavedUsage = normalizeUsageSnapshot(activeAccount?.lastKnownUsage);
      if (JSON.stringify(currentSavedUsage) !== JSON.stringify(savedUsage)) {
        nextState = this.patchAccount(nextState, activeAccountId, { lastKnownUsage: savedUsage });
        await this.writeState(nextState);
        activeAccount = (nextState.accounts || []).find((account) => account.id === activeAccountId) || activeAccount;
      }
    }
    const currentUsage = detectedUsage?.freshForCurrentLogin
      ? detectedUsage
      : normalizeUsageSnapshot(activeAccount?.lastKnownUsage);
    return {
      activeAccountId,
      accounts: nextState.accounts || [],
      currentSession: capabilities.auth,
      capabilities,
      currentUsage
    };
  }

  async hydrateSnapshotMetadata(state) {
    let changed = false;
    const accounts = await Promise.all((state.accounts || []).map(async (account) => {
      if (account.kind !== 'chatgpt-snapshot') return account;
      try {
        const snapshot = normalizeSnapshot(await this.keychain.read(account.id));
        if (!snapshot) return account;
        const identity = extractSnapshotIdentity(snapshot);
        if (
          account.identityEmail === identity.identityEmail
          && account.identitySubject === identity.identitySubject
          && account.identityAccountId === identity.identityAccountId
        ) {
          return account;
        }
        changed = true;
        return normalizeAccount({ ...account, ...identity });
      } catch {
        return account;
      }
    }));
    if (!changed) return state;
    const nextState = { ...state, accounts };
    await this.writeState(nextState);
    return nextState;
  }

  async listAccounts() {
    return await this.refreshListedAccounts();
  }

  async login({ name, apiKey, saveProfile = true }) {
    const capabilities = await this.codex.loginWithApiKey(apiKey);
    let savedAccount = null;
    if (saveProfile) {
      const state = await this.readState();
      savedAccount = {
        id: randomId('account'),
        name: String(name || '').trim() || 'API Key Account',
        provider: 'api-key',
        kind: 'api-key',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        verifiedAt: new Date().toISOString(),
        lastCheckMessage: this.verificationMessage(capabilities),
        available: true,
        snapshotFingerprint: '',
        ...emptyIdentity()
      };
      await this.keychain.save(savedAccount.id, apiKey);
      await this.writeState({
        version: 2,
        activeAccountId: savedAccount.id,
        accounts: [...(state.accounts || []).filter((item) => item.id !== savedAccount.id), savedAccount]
      });
    }
    return {
      ...(await this.listAccounts()),
      savedAccount
    };
  }

  async saveCurrentChatgptSession(name) {
    const capabilities = await this.codex.getCapabilities();
    if (!capabilities.auth.loggedIn || capabilities.auth.provider !== 'chatgpt') {
      throw new Error('Sign in to Codex with your browser-based ChatGPT account before saving a browser session snapshot.');
    }
    if (!capabilities.authStorage?.supportsChatgptSnapshots) {
      throw new Error('Codex browser-session snapshots require a readable ~/.codex/auth.json on this machine.');
    }

    const snapshot = normalizeSnapshot(await readTextFile(this.authFilePath));
    if (!snapshot) {
      throw new Error('Could not read ~/.codex/auth.json for the current ChatGPT session.');
    }

    const state = await this.readState();
    const now = new Date().toISOString();
    const snapshotFingerprint = fingerprintSnapshot(snapshot);
    const identity = extractSnapshotIdentity(snapshot);
    const existing = state.accounts.find((account) =>
      account.kind === 'chatgpt-snapshot' && account.snapshotFingerprint === snapshotFingerprint
    );
    const savedAccount = normalizeAccount({
      ...(existing || {}),
      id: existing?.id || randomId('account'),
      name: String(name || '').trim() || existing?.name || 'Browser Login',
      provider: 'chatgpt',
      kind: 'chatgpt-snapshot',
      createdAt: existing?.createdAt || now,
      updatedAt: now,
      verifiedAt: now,
      lastCheckMessage: this.verificationMessage(capabilities),
      available: true,
      snapshotFingerprint,
      ...identity
    });

    await this.keychain.save(savedAccount.id, snapshot);
    await this.writeState({
      version: 2,
      activeAccountId: savedAccount.id,
      accounts: [...state.accounts.filter((account) => account.id !== savedAccount.id), savedAccount]
    });

    return {
      ...(await this.listAccounts()),
      savedAccount
    };
  }

  async switchAccount(accountId) {
    const state = await this.readState();
    const account = state.accounts.find((item) => item.id === accountId);
    if (!account) throw new Error('Account profile not found.');
    let capabilities;
    if (account.kind === 'api-key') {
      const secret = await this.keychain.read(account.id);
      capabilities = await this.codex.loginWithApiKey(secret);
    } else if (account.kind === 'chatgpt-snapshot') {
      const snapshot = normalizeSnapshot(await this.keychain.read(account.id));
      if (!snapshot) {
        throw new Error('Saved browser session snapshot is missing. Remove it and save a fresh one.');
      }
      const previousRaw = await readTextFile(this.authFilePath);
      try {
        await this.writeAuthSnapshot(snapshot);
        capabilities = await this.verifySnapshotSwitch('chatgpt');
      } catch (error) {
        await this.restoreAuthSnapshot(previousRaw);
        throw error;
      }
    } else {
      throw new Error('This account type cannot be switched automatically.');
    }

    const nextState = this.patchAccount({
      ...state,
      activeAccountId: account.id
    }, account.id, {
      updatedAt: new Date().toISOString(),
      verifiedAt: new Date().toISOString(),
      lastCheckMessage: this.verificationMessage(capabilities),
      available: true
    });
    await this.writeState(nextState);
    return {
      ...(await this.refreshListedAccounts(nextState)),
      account
    };
  }

  async verifyCurrentSession() {
    const state = await this.readState();
    const capabilities = await this.codex.getCapabilities();
    const currentFingerprint = capabilities.auth.provider === 'chatgpt'
      ? await this.currentChatgptFingerprint()
      : '';
    const resolvedActiveAccountId = this.resolveActiveAccountId(state, capabilities, currentFingerprint) || state.activeAccountId || '';
    let nextState = state;
    if (resolvedActiveAccountId) {
      nextState = this.patchAccount({
        ...state,
        activeAccountId: resolvedActiveAccountId
      }, resolvedActiveAccountId, {
        verifiedAt: new Date().toISOString(),
        lastCheckMessage: this.verificationMessage(capabilities),
        available: capabilities.auth.loggedIn
      });
      await this.writeState(nextState);
    }
    return await this.refreshListedAccounts(nextState);
  }

  async checkCurrentUsage() {
    const probeUsage = await this.codex.probeCurrentUsageViaCli({
      timeoutMs: 15000
    }).catch(() => null);
    const listed = await this.refreshListedAccounts();
    if (!probeUsage) return listed;
    if (!listed.activeAccountId) {
      return {
        ...listed,
        currentUsage: probeUsage
      };
    }
    const state = await this.readState();
    const nextState = this.patchAccount({
      ...state,
      activeAccountId: listed.activeAccountId
    }, listed.activeAccountId, {
      lastKnownUsage: toSavedUsageSnapshot(probeUsage)
    });
    await this.writeState(nextState);
    return {
      ...listed,
      accounts: nextState.accounts || listed.accounts,
      currentUsage: probeUsage
    };
  }

  async logout() {
    await this.codex.logout();
    const state = await this.readState();
    await this.writeState({ ...state, activeAccountId: '' });
    return await this.listAccounts();
  }

  async removeAccount(accountId) {
    const state = await this.readState();
    await this.keychain.remove(accountId);
    await this.writeState({
      ...state,
      activeAccountId: state.activeAccountId === accountId ? '' : state.activeAccountId,
      accounts: state.accounts.filter((item) => item.id !== accountId)
    });
    return { ok: true };
  }
}
