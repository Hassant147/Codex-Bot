import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { AccountService } from '../server/services/account-service.mjs';

const cleanupPaths = [];

afterEach(async () => {
  await Promise.all(cleanupPaths.splice(0).map((targetPath) => fs.rm(targetPath, { recursive: true, force: true })));
});

describe('account service', () => {
  it('normalizes missing auth storage in listed account payloads', async () => {
    const tempRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'account-service-'));
    cleanupPaths.push(tempRoot);

    const service = new AccountService({
      keychainService: {
        save: async () => {},
        read: async () => '',
        remove: async () => {}
      },
      codexService: {
        getAuthFilePath: () => path.join(tempRoot, '.codex', 'auth.json'),
        getCurrentUsageSnapshot: async () => null,
        getCapabilities: async () => ({
          available: true,
          binary: 'codex',
          version: '1.0.0',
          commands: ['exec'],
          auth: { loggedIn: false, method: '', provider: 'unknown', raw: '' },
          profiles: [],
          models: [],
          authStorage: null
        })
      },
      accountsStorePath: path.join(tempRoot, 'accounts.json')
    });

    const payload = await service.listAccounts();

    expect(payload.capabilities.authStorage).toEqual({
      authFilePath: path.join(tempRoot, '.codex', 'auth.json'),
      authFileExists: false,
      supportsChatgptSnapshots: false
    });
  });

  it('hydrates saved browser snapshots with verified identity metadata', async () => {
    const tempRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'account-service-'));
    cleanupPaths.push(tempRoot);

    const idPayload = {
      email: 'demo@example.com',
      sub: 'auth0|demo-subject'
    };
    const idToken = [
      Buffer.from(JSON.stringify({ alg: 'RS256', typ: 'JWT' })).toString('base64url'),
      Buffer.from(JSON.stringify(idPayload)).toString('base64url'),
      'signature'
    ].join('.');
    const authSnapshot = JSON.stringify({
      auth_mode: 'chatgpt',
      tokens: {
        id_token: idToken,
        account_id: 'account-uuid-1234'
      }
    }, null, 2);

    const service = new AccountService({
      keychainService: {
        save: async () => {},
        read: async () => authSnapshot,
        remove: async () => {}
      },
      codexService: {
        getAuthFilePath: () => path.join(tempRoot, '.codex', 'auth.json'),
        getCurrentUsageSnapshot: async () => null,
        getCapabilities: async () => ({
          available: true,
          binary: 'codex',
          version: '1.0.0',
          commands: ['exec'],
          auth: { loggedIn: true, method: 'ChatGPT', provider: 'chatgpt', raw: 'Logged in using ChatGPT' },
          profiles: [],
          models: [],
          authStorage: {
            authFilePath: path.join(tempRoot, '.codex', 'auth.json'),
            authFileExists: true,
            supportsChatgptSnapshots: true
          }
        })
      },
      accountsStorePath: path.join(tempRoot, 'accounts.json')
    });

    await service.writeState({
      version: 2,
      activeAccountId: 'account-1',
      accounts: [{
        id: 'account-1',
        name: 'Browser Login',
        provider: 'chatgpt',
        kind: 'chatgpt-snapshot',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        verifiedAt: null,
        lastCheckMessage: '',
        available: true,
        snapshotFingerprint: 'fingerprint'
      }]
    });

    const payload = await service.listAccounts();

    expect(payload.accounts[0]).toMatchObject({
      identityEmail: 'demo@example.com',
      identitySubject: 'auth0|demo-subject',
      identityAccountId: 'account-uuid-1234'
    });
  });

  it('uses the active account switch time when checking usage freshness', async () => {
    const tempRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'account-service-'));
    cleanupPaths.push(tempRoot);

    let usageOptions = null;
    const updatedAt = '2026-03-14T00:49:34.900Z';
    const service = new AccountService({
      keychainService: {
        save: async () => {},
        read: async () => '',
        remove: async () => {}
      },
      codexService: {
        getAuthFilePath: () => path.join(tempRoot, '.codex', 'auth.json'),
        getCurrentUsageSnapshot: async (options = {}) => {
          usageOptions = options;
          return null;
        },
        getCapabilities: async () => ({
          available: true,
          binary: 'codex',
          version: '1.0.0',
          commands: ['exec'],
          auth: { loggedIn: true, method: 'API key', provider: 'api-key', raw: 'Logged in using API key' },
          profiles: [],
          models: [],
          authStorage: {
            authFilePath: path.join(tempRoot, '.codex', 'auth.json'),
            authFileExists: false,
            supportsChatgptSnapshots: false
          }
        })
      },
      accountsStorePath: path.join(tempRoot, 'accounts.json')
    });

    await service.writeState({
      version: 2,
      activeAccountId: 'account-1',
      accounts: [{
        id: 'account-1',
        name: 'Primary API Key',
        provider: 'api-key',
        kind: 'api-key',
        createdAt: '2026-03-14T00:00:00.000Z',
        updatedAt,
        verifiedAt: null,
        lastCheckMessage: '',
        available: true,
        snapshotFingerprint: '',
        identityEmail: '',
        identitySubject: '',
        identityAccountId: ''
      }]
    });

    await service.listAccounts();

    expect(usageOptions).toEqual({
      freshAfterMs: Date.parse(updatedAt)
    });
  });

  it('returns the selected account cached usage when no fresh live snapshot exists', async () => {
    const tempRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'account-service-'));
    cleanupPaths.push(tempRoot);

    const service = new AccountService({
      keychainService: {
        save: async () => {},
        read: async () => '',
        remove: async () => {}
      },
      codexService: {
        getAuthFilePath: () => path.join(tempRoot, '.codex', 'auth.json'),
        getCurrentUsageSnapshot: async () => ({
          source: 'session-log',
          sessionFile: '/tmp/stale.jsonl',
          capturedAt: '2026-03-14T00:36:47.717Z',
          accountEmail: '',
          accountId: '',
          planType: 'plus',
          freshForCurrentLogin: false,
          primary: { usedPercent: 27, leftPercent: 73, windowMinutes: 300, resetAt: '2026-03-14T03:54:59.000Z' },
          secondary: { usedPercent: 8, leftPercent: 92, windowMinutes: 10080, resetAt: '2026-03-20T22:54:59.000Z' },
          credits: null
        }),
        getCapabilities: async () => ({
          available: true,
          binary: 'codex',
          version: '1.0.0',
          commands: ['exec'],
          auth: { loggedIn: true, method: 'API key', provider: 'api-key', raw: 'Logged in using API key' },
          profiles: [],
          models: [],
          authStorage: {
            authFilePath: path.join(tempRoot, '.codex', 'auth.json'),
            authFileExists: false,
            supportsChatgptSnapshots: false
          }
        })
      },
      accountsStorePath: path.join(tempRoot, 'accounts.json')
    });

    await service.writeState({
      version: 2,
      activeAccountId: 'account-1',
      accounts: [{
        id: 'account-1',
        name: 'Primary API Key',
        provider: 'api-key',
        kind: 'api-key',
        createdAt: '2026-03-14T00:00:00.000Z',
        updatedAt: '2026-03-14T00:49:34.900Z',
        verifiedAt: null,
        lastCheckMessage: '',
        available: true,
        snapshotFingerprint: '',
        identityEmail: '',
        identitySubject: '',
        identityAccountId: '',
        lastKnownUsage: {
          source: 'saved-account-cache',
          sessionFile: '/tmp/account-1.jsonl',
          capturedAt: '2026-03-14T00:20:00.000Z',
          accountEmail: 'account-1@example.com',
          accountId: 'acct_1',
          planType: 'plus',
          freshForCurrentLogin: false,
          primary: { usedPercent: 10, leftPercent: 90, windowMinutes: 300, resetAt: '2026-03-14T03:00:00.000Z' },
          secondary: null,
          credits: null
        }
      }]
    });

    const payload = await service.listAccounts();

    expect(payload.currentUsage).toMatchObject({
      source: 'saved-account-cache',
      accountEmail: 'account-1@example.com',
      primary: {
        leftPercent: 90
      }
    });
  });

  it('stores a fresh live usage snapshot on the active account', async () => {
    const tempRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'account-service-'));
    cleanupPaths.push(tempRoot);

    const service = new AccountService({
      keychainService: {
        save: async () => {},
        read: async () => '',
        remove: async () => {}
      },
      codexService: {
        getAuthFilePath: () => path.join(tempRoot, '.codex', 'auth.json'),
        getCurrentUsageSnapshot: async () => ({
          source: 'session-log',
          sessionFile: '/tmp/live.jsonl',
          capturedAt: '2026-03-14T01:10:00.000Z',
          accountEmail: 'fresh@example.com',
          accountId: 'acct_live',
          planType: 'plus',
          freshForCurrentLogin: true,
          primary: { usedPercent: 15, leftPercent: 85, windowMinutes: 300, resetAt: '2026-03-14T03:54:59.000Z' },
          secondary: { usedPercent: 5, leftPercent: 95, windowMinutes: 10080, resetAt: '2026-03-20T22:54:59.000Z' },
          credits: null
        }),
        getCapabilities: async () => ({
          available: true,
          binary: 'codex',
          version: '1.0.0',
          commands: ['exec'],
          auth: { loggedIn: true, method: 'API key', provider: 'api-key', raw: 'Logged in using API key' },
          profiles: [],
          models: [],
          authStorage: {
            authFilePath: path.join(tempRoot, '.codex', 'auth.json'),
            authFileExists: false,
            supportsChatgptSnapshots: false
          }
        })
      },
      accountsStorePath: path.join(tempRoot, 'accounts.json')
    });

    await service.writeState({
      version: 2,
      activeAccountId: 'account-1',
      accounts: [{
        id: 'account-1',
        name: 'Primary API Key',
        provider: 'api-key',
        kind: 'api-key',
        createdAt: '2026-03-14T00:00:00.000Z',
        updatedAt: '2026-03-14T00:49:34.900Z',
        verifiedAt: null,
        lastCheckMessage: '',
        available: true,
        snapshotFingerprint: '',
        identityEmail: '',
        identitySubject: '',
        identityAccountId: ''
      }]
    });

    const payload = await service.listAccounts();

    expect(payload.currentUsage).toMatchObject({
      source: 'session-log',
      accountEmail: 'fresh@example.com',
      primary: {
        leftPercent: 85
      }
    });

    const state = await service.readState();
    expect(state.accounts[0].lastKnownUsage).toMatchObject({
      source: 'saved-account-cache',
      accountEmail: 'fresh@example.com',
      primary: {
        leftPercent: 85
      }
    });
  });

  it('runs a CLI usage probe and returns a fresh snapshot for the active account', async () => {
    const tempRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'account-service-'));
    cleanupPaths.push(tempRoot);

    const service = new AccountService({
      keychainService: {
        save: async () => {},
        read: async () => '',
        remove: async () => {}
      },
      codexService: {
        getAuthFilePath: () => path.join(tempRoot, '.codex', 'auth.json'),
        probeCurrentUsageViaCli: async () => ({
          source: 'cli-probe',
          sessionFile: '',
          capturedAt: '2026-03-14T01:20:00.000Z',
          accountEmail: 'probe@example.com',
          accountId: 'acct_probe',
          planType: 'plus',
          freshForCurrentLogin: true,
          primary: { usedPercent: 12, leftPercent: 88, windowMinutes: 300, resetAt: '2026-03-14T03:54:59.000Z' },
          secondary: { usedPercent: 4, leftPercent: 96, windowMinutes: 10080, resetAt: '2026-03-20T22:54:59.000Z' },
          credits: null
        }),
        getCurrentUsageSnapshot: async () => null,
        getCapabilities: async () => ({
          available: true,
          binary: 'codex',
          version: '1.0.0',
          commands: ['exec'],
          auth: { loggedIn: true, method: 'API key', provider: 'api-key', raw: 'Logged in using API key' },
          profiles: [],
          models: [],
          authStorage: {
            authFilePath: path.join(tempRoot, '.codex', 'auth.json'),
            authFileExists: false,
            supportsChatgptSnapshots: false
          }
        })
      },
      accountsStorePath: path.join(tempRoot, 'accounts.json')
    });

    await service.writeState({
      version: 2,
      activeAccountId: 'account-1',
      accounts: [{
        id: 'account-1',
        name: 'Primary API Key',
        provider: 'api-key',
        kind: 'api-key',
        createdAt: '2026-03-14T00:00:00.000Z',
        updatedAt: '2026-03-14T00:49:34.900Z',
        verifiedAt: null,
        lastCheckMessage: '',
        available: true,
        snapshotFingerprint: '',
        identityEmail: '',
        identitySubject: '',
        identityAccountId: ''
      }]
    });

    const payload = await service.checkCurrentUsage();

    expect(payload.currentUsage).toMatchObject({
      source: 'cli-probe',
      accountEmail: 'probe@example.com',
      primary: {
        leftPercent: 88
      }
    });

    const state = await service.readState();
    expect(state.accounts[0].lastKnownUsage).toMatchObject({
      source: 'saved-account-cache',
      accountEmail: 'probe@example.com',
      primary: {
        leftPercent: 88
      }
    });
  });
});
