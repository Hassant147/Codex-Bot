import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { buildCliArgs } from './command-builder.mjs';

function sanitizeOutput(value = '') {
  return String(value || '').replace(/\u0000/g, '').trim();
}

export function parseCommands(helpOutput = '') {
  const commands = [];
  let inCommands = false;
  for (const line of String(helpOutput || '').split('\n')) {
    if (/^commands:$/i.test(line.trim())) {
      inCommands = true;
      continue;
    }
    if (!inCommands) continue;
    const match = line.match(/^\s{2}([a-z0-9-]+)\s{2,}/i);
    if (!match) {
      if (line.trim()) continue;
      break;
    }
    commands.push(match[1]);
  }
  return commands;
}

export function parseAuthStatus(output = '') {
  const raw = sanitizeOutput(output);
  const lower = raw.toLowerCase();
  const loggedIn = lower.includes('logged in') && !lower.includes('not logged in');
  const methodMatch = raw.match(/logged in using\s+(.+)$/i);
  const method = methodMatch ? methodMatch[1].trim() : '';
  let provider = 'unknown';
  if (/chatgpt/i.test(method) || /chatgpt/i.test(raw)) provider = 'chatgpt';
  else if (/api key/i.test(method) || /api key/i.test(raw)) provider = 'api-key';
  return {
    loggedIn,
    method,
    provider,
    raw
  };
}

function parseTomlSectionKeys(raw = '', sectionName) {
  const matches = [];
  const regex = new RegExp(`\\[${sectionName}\\.(.+?)\\]`, 'g');
  let match;
  while ((match = regex.exec(raw))) {
    matches.push(match[1].replace(/["']/g, ''));
  }
  return matches;
}

export function defaultAuthStorageCapabilities(authFilePath = path.join(os.homedir(), '.codex', 'auth.json')) {
  return {
    authFilePath,
    authFileExists: false,
    supportsChatgptSnapshots: false
  };
}

export function normalizeAuthStorageCapabilities(value = null, authFilePath = path.join(os.homedir(), '.codex', 'auth.json')) {
  const fallback = defaultAuthStorageCapabilities(authFilePath);
  return {
    authFilePath: String(value?.authFilePath || fallback.authFilePath),
    authFileExists: Boolean(value?.authFileExists),
    supportsChatgptSnapshots: Boolean(value?.supportsChatgptSnapshots)
  };
}

function toPercentLeft(usedPercent) {
  if (usedPercent === null || usedPercent === undefined || usedPercent === '') return null;
  const numeric = Number(usedPercent);
  if (!Number.isFinite(numeric)) return null;
  return Math.max(0, Math.min(100, Math.round((100 - numeric) * 10) / 10));
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

function firstNonEmpty(...values) {
  for (const value of values) {
    const normalized = String(value || '').trim();
    if (normalized) return normalized;
  }
  return '';
}

export function parseAuthSnapshot(raw = '') {
  const fallback = {
    authMode: '',
    accountEmail: '',
    accountId: '',
    accountSubject: '',
    planType: '',
    lastRefreshAt: null,
    lastRefreshMs: null
  };
  const snapshot = String(raw || '').trim();
  if (!snapshot) return fallback;
  try {
    const parsed = JSON.parse(snapshot);
    const idTokenPayload = decodeJwtPayload(parsed?.tokens?.id_token);
    const accessTokenPayload = decodeJwtPayload(parsed?.tokens?.access_token);
    const lastRefreshRaw = firstNonEmpty(parsed?.last_refresh, parsed?.lastRefresh);
    const lastRefreshMs = lastRefreshRaw ? Date.parse(lastRefreshRaw) : Number.NaN;
    return {
      authMode: firstNonEmpty(parsed?.auth_mode, parsed?.authMode),
      accountEmail: firstNonEmpty(idTokenPayload?.email, accessTokenPayload?.email, parsed?.email),
      accountId: firstNonEmpty(parsed?.tokens?.account_id, idTokenPayload?.account_id, accessTokenPayload?.account_id),
      accountSubject: firstNonEmpty(idTokenPayload?.sub, accessTokenPayload?.sub),
      planType: firstNonEmpty(
        idTokenPayload?.['https://api.openai.com/auth.chatgpt_plan_type'],
        accessTokenPayload?.['https://api.openai.com/auth.chatgpt_plan_type'],
        parsed?.plan_type
      ),
      lastRefreshAt: Number.isFinite(lastRefreshMs) ? new Date(lastRefreshMs).toISOString() : null,
      lastRefreshMs: Number.isFinite(lastRefreshMs) ? lastRefreshMs : null
    };
  } catch {
    return fallback;
  }
}

function toIsoFromUnixSeconds(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric) || numeric <= 0) return null;
  return new Date(numeric * 1000).toISOString();
}

function parseRateLimitWindow(window = null) {
  if (!window || typeof window !== 'object') return null;
  const usedPercent = Number.isFinite(Number(window.used_percent)) ? Number(window.used_percent) : null;
  const resetSeconds = Number.isFinite(Number(window.resets_at))
    ? Number(window.resets_at)
    : Number.isFinite(Number(window.reset_at))
      ? Number(window.reset_at)
      : null;
  return {
    usedPercent,
    leftPercent: toPercentLeft(usedPercent),
    windowMinutes: Number.isFinite(Number(window.window_minutes)) ? Number(window.window_minutes) : null,
    resetAt: toIsoFromUnixSeconds(resetSeconds)
  };
}

export function parseUsageSnapshotFromSessionText(text = '', metadata = {}) {
  const lines = String(text || '')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  for (let index = lines.length - 1; index >= 0; index -= 1) {
    try {
      const event = JSON.parse(lines[index]);
      const payload = event?.payload;
      const rateLimits = payload?.type === 'token_count'
        ? payload?.rate_limits
        : event?.type === 'token_count'
          ? event?.rate_limits
          : null;
      if (!rateLimits || typeof rateLimits !== 'object') continue;

      return {
        source: 'session-log',
        sessionFile: String(metadata?.sessionFile || ''),
        capturedAt: firstNonEmpty(event?.timestamp, payload?.timestamp) || null,
        accountEmail: '',
        accountId: '',
        planType: firstNonEmpty(rateLimits?.plan_type),
        freshForCurrentLogin: false,
        primary: parseRateLimitWindow(rateLimits?.primary),
        secondary: parseRateLimitWindow(rateLimits?.secondary),
        credits: rateLimits?.credits && typeof rateLimits.credits === 'object' ? rateLimits.credits : null
      };
    } catch {
      continue;
    }
  }

  return null;
}

function parseCodexRateLimitsLine(line = '') {
  const rawLine = String(line || '').trim();
  if (!rawLine || !rawLine.includes('"type":"codex.rate_limits"')) return null;
  const jsonStart = rawLine.indexOf('{"type":"codex.rate_limits"');
  if (jsonStart < 0) return null;
  const jsonText = rawLine.slice(jsonStart);
  try {
    const event = JSON.parse(jsonText);
    if (!event || event.type !== 'codex.rate_limits' || typeof event.rate_limits !== 'object') return null;
    const timestampMatch = rawLine.match(/^(\d{4}-\d{2}-\d{2}T[^ ]+Z)\s/);
    return {
      capturedAt: timestampMatch?.[1] || null,
      planType: firstNonEmpty(event.plan_type),
      primary: parseRateLimitWindow(event.rate_limits?.primary),
      secondary: parseRateLimitWindow(event.rate_limits?.secondary),
      credits: event.credits && typeof event.credits === 'object' ? event.credits : null
    };
  } catch {
    return null;
  }
}

export function parseUsageSnapshotFromCliTrace(text = '', metadata = {}) {
  const lines = String(text || '')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  for (let index = lines.length - 1; index >= 0; index -= 1) {
    const parsed = parseCodexRateLimitsLine(lines[index]);
    if (!parsed) continue;
    return {
      source: 'cli-probe',
      sessionFile: '',
      capturedAt: parsed.capturedAt || new Date().toISOString(),
      accountEmail: firstNonEmpty(metadata?.accountEmail),
      accountId: firstNonEmpty(metadata?.accountId),
      planType: parsed.planType || firstNonEmpty(metadata?.planType),
      freshForCurrentLogin: true,
      primary: parsed.primary,
      secondary: parsed.secondary,
      credits: parsed.credits
    };
  }

  return null;
}

async function pathExists(targetPath) {
  try {
    await fs.access(targetPath);
    return true;
  } catch {
    return false;
  }
}

function codexBinaryNames(platform = process.platform) {
  if (platform === 'win32') return ['codex.exe', 'codex.cmd', 'codex.bat', 'codex'];
  return ['codex'];
}

function codexExtensionSubpaths(platform = process.platform, arch = process.arch) {
  if (platform === 'darwin') {
    if (arch === 'arm64') return ['bin/macos-aarch64/codex', 'bin/macos-arm64/codex'];
    return ['bin/macos-x86_64/codex', 'bin/macos-x64/codex'];
  }
  if (platform === 'linux') {
    if (arch === 'arm64') return ['bin/linux-aarch64/codex', 'bin/linux-arm64/codex'];
    return ['bin/linux-x64/codex'];
  }
  if (platform === 'win32') {
    if (arch === 'arm64') return ['bin/windows-aarch64/codex.exe', 'bin/win32-arm64/codex.exe'];
    return ['bin/windows-x64/codex.exe', 'bin/win32-x64/codex.exe'];
  }
  return [];
}

async function findExtensionBinaryCandidates({ homeDir, platform, arch }) {
  const extensionRoots = [
    path.join(homeDir, '.vscode', 'extensions'),
    path.join(homeDir, '.vscode-insiders', 'extensions'),
    path.join(homeDir, '.cursor', 'extensions')
  ];
  const subpaths = codexExtensionSubpaths(platform, arch);
  const candidates = [];

  for (const root of extensionRoots) {
    const entries = await fs.readdir(root, { withFileTypes: true }).catch(() => []);
    const matchingDirs = entries
      .filter((entry) => entry.isDirectory() && /^openai\.chatgpt-/i.test(entry.name))
      .sort((left, right) => right.name.localeCompare(left.name, undefined, { numeric: true, sensitivity: 'base' }));

    for (const entry of matchingDirs) {
      for (const subpath of subpaths) {
        candidates.push(path.join(root, entry.name, subpath));
      }
    }
  }

  return candidates;
}

export async function findCodexBinary({
  env = process.env,
  homeDir = os.homedir(),
  platform = process.platform,
  arch = process.arch
} = {}) {
  const candidates = [];
  const envBinary = String(env.CODEX_BINARY || '').trim();
  if (envBinary) candidates.push(envBinary);

  const pathEntries = String(env.PATH || '')
    .split(path.delimiter)
    .map((entry) => entry.trim())
    .filter(Boolean);

  for (const entry of pathEntries) {
    for (const binaryName of codexBinaryNames(platform)) {
      candidates.push(path.join(entry, binaryName));
    }
  }

  candidates.push(...await findExtensionBinaryCandidates({ homeDir, platform, arch }));

  const uniqueCandidates = [...new Set(candidates)];
  for (const candidate of uniqueCandidates) {
    if (await pathExists(candidate)) return candidate;
  }

  return envBinary || 'codex';
}

async function listFilesRecursive(rootPath) {
  const files = [];
  const pending = [rootPath];

  while (pending.length) {
    const currentPath = pending.pop();
    const entries = await fs.readdir(currentPath, { withFileTypes: true }).catch(() => []);
    for (const entry of entries) {
      const nextPath = path.join(currentPath, entry.name);
      if (entry.isDirectory()) {
        pending.push(nextPath);
      } else if (entry.isFile()) {
        files.push(nextPath);
      }
    }
  }

  return files;
}

async function readFileTail(targetPath, maxBytes = 256000) {
  const stats = await fs.stat(targetPath);
  const readLength = Math.min(stats.size, maxBytes);
  const handle = await fs.open(targetPath, 'r');
  try {
    const buffer = Buffer.alloc(readLength);
    await handle.read(buffer, 0, readLength, Math.max(0, stats.size - readLength));
    return buffer.toString('utf8');
  } finally {
    await handle.close();
  }
}

export class CodexService {
  constructor({ authFilePath, sessionsRoot } = {}) {
    this.binary = process.env.CODEX_BINARY || 'codex';
    this.authFilePath = authFilePath || path.join(os.homedir(), '.codex', 'auth.json');
    this.sessionsRoot = sessionsRoot || path.join(os.homedir(), '.codex', 'sessions');
  }

  getAuthFilePath() {
    return this.authFilePath;
  }

  getSessionsRoot() {
    return this.sessionsRoot;
  }

  async getAuthStorage() {
    const authFilePath = this.getAuthFilePath();
    const authFileExists = await fs.access(authFilePath).then(() => true).catch(() => false);
    return normalizeAuthStorageCapabilities({
      authFilePath,
      authFileExists,
      supportsChatgptSnapshots: authFileExists
    }, authFilePath);
  }

  async run(args = [], options = {}) {
    const binary = await findCodexBinary();
    this.binary = binary;
    return await new Promise((resolve) => {
      const child = spawn(binary, args, {
        cwd: options.cwd || process.cwd(),
        env: { ...process.env, ...(options.env || {}) },
        stdio: ['pipe', 'pipe', 'pipe']
      });
      let stdout = '';
      let stderr = '';
      let timedOut = false;
      const timeoutMs = Number(options.timeoutMs || 0);
      const timeoutHandle = timeoutMs > 0
        ? setTimeout(() => {
          timedOut = true;
          child.kill('SIGTERM');
        }, timeoutMs)
        : null;

      child.stdout.on('data', (chunk) => {
        stdout += chunk.toString('utf8');
      });
      child.stderr.on('data', (chunk) => {
        stderr += chunk.toString('utf8');
      });
      child.on('error', (error) => {
        stderr += `\n${error.message || String(error)}`;
      });
      child.on('close', (code) => {
        if (timeoutHandle) clearTimeout(timeoutHandle);
        resolve({
          code: code ?? 0,
          stdout: sanitizeOutput(stdout),
          stderr: sanitizeOutput(stderr),
          timedOut
        });
      });
      if (typeof options.stdinText === 'string') {
        child.stdin.write(options.stdinText);
      }
      child.stdin.end();
    });
  }

  async getCapabilities() {
    const help = await this.run(['--help'], { timeoutMs: 10000 });
    const version = await this.run(['--version'], { timeoutMs: 10000 });
    const status = await this.run(['login', 'status'], { timeoutMs: 10000 });
    const authStorage = normalizeAuthStorageCapabilities(await this.getAuthStorage(), this.getAuthFilePath());
    const commands = parseCommands(help.stdout || help.stderr);
    const configPath = path.join(os.homedir(), '.codex', 'config.toml');
    const configRaw = await fs.readFile(configPath, 'utf8').catch(() => '');
    return {
      available: help.code === 0,
      binary: this.binary,
      version: sanitizeOutput(version.stdout || version.stderr),
      commands,
      auth: parseAuthStatus(status.stdout || status.stderr),
      profiles: parseTomlSectionKeys(configRaw, 'profiles'),
      models: parseTomlSectionKeys(configRaw, 'models'),
      authStorage
    };
  }

  async getCurrentUsageSnapshot(options = {}) {
    const authRaw = await fs.readFile(this.getAuthFilePath(), 'utf8').catch(() => '');
    if (!authRaw) return null;

    const authSnapshot = parseAuthSnapshot(authRaw);
    const sessionFiles = (await listFilesRecursive(this.getSessionsRoot()).catch(() => []))
      .filter((sessionFile) => sessionFile.endsWith('.jsonl'));
    if (!sessionFiles.length) return null;

    const sessionEntries = (await Promise.all(sessionFiles.map(async (sessionFile) => {
      const stats = await fs.stat(sessionFile).catch(() => null);
      if (!stats?.isFile()) return null;
      return {
        sessionFile,
        mtimeMs: stats.mtimeMs
      };
    }))).filter(Boolean)
      .sort((left, right) => right.mtimeMs - left.mtimeMs);

    const explicitFreshAfterMs = Number(options?.freshAfterMs);
    const freshnessCutoffMs = Math.max(
      authSnapshot.lastRefreshMs || 0,
      Number.isFinite(explicitFreshAfterMs) ? explicitFreshAfterMs : 0
    );
    let latestSnapshot = null;

    for (const entry of sessionEntries.slice(0, 25)) {
      const rawText = await readFileTail(entry.sessionFile).catch(() => '');
      const parsed = parseUsageSnapshotFromSessionText(rawText, { sessionFile: entry.sessionFile });
      if (!parsed) continue;
      const freshForCurrentLogin = freshnessCutoffMs > 0 ? entry.mtimeMs >= freshnessCutoffMs : true;
      const snapshot = {
        ...parsed,
        accountEmail: freshForCurrentLogin ? (authSnapshot.accountEmail || parsed.accountEmail) : parsed.accountEmail,
        accountId: freshForCurrentLogin ? (authSnapshot.accountId || parsed.accountId) : parsed.accountId,
        planType: parsed.planType || authSnapshot.planType,
        capturedAt: parsed.capturedAt || new Date(entry.mtimeMs).toISOString(),
        freshForCurrentLogin
      };
      if (!latestSnapshot) latestSnapshot = snapshot;
      if (snapshot.freshForCurrentLogin) {
        return snapshot;
      }
    }

    return latestSnapshot;
  }

  async probeCurrentUsageViaCli(options = {}) {
    const authRaw = await fs.readFile(this.getAuthFilePath(), 'utf8').catch(() => '');
    if (!authRaw) return null;
    const authSnapshot = parseAuthSnapshot(authRaw);
    const binary = await findCodexBinary();
    this.binary = binary;

    const prompt = String(options.prompt || 'Reply with exactly OK');
    const maxBufferedChars = Number(options.maxBufferedChars || 250000);
    const timeoutMs = Number(options.timeoutMs || 20000);
    let output = '';
    let foundSnapshot = null;

    await new Promise((resolve) => {
      const child = spawn(binary, ['exec', '--skip-git-repo-check', prompt], {
        cwd: options.cwd || process.cwd(),
        env: {
          ...process.env,
          ...(options.env || {}),
          RUST_LOG: options.rustLog || 'tungstenite::protocol=trace,codex_api::endpoint::responses_websocket=trace'
        },
        stdio: ['ignore', 'pipe', 'pipe']
      });
      let timedOut = false;
      let settled = false;
      const timeoutHandle = timeoutMs > 0
        ? setTimeout(() => {
          timedOut = true;
          child.kill('SIGTERM');
        }, timeoutMs)
        : null;

      const ingest = (chunk) => {
        const text = chunk.toString('utf8');
        output += text;
        if (output.length > maxBufferedChars) {
          output = output.slice(-maxBufferedChars);
        }
        if (!foundSnapshot) {
          foundSnapshot = parseUsageSnapshotFromCliTrace(output, authSnapshot);
          if (foundSnapshot) {
            child.kill('SIGTERM');
          }
        }
      };

      child.stdout.on('data', ingest);
      child.stderr.on('data', ingest);
      child.on('error', () => {});
      child.on('close', () => {
        if (settled) return;
        settled = true;
        if (timeoutHandle) clearTimeout(timeoutHandle);
        if (!foundSnapshot && !timedOut) {
          foundSnapshot = parseUsageSnapshotFromCliTrace(output, authSnapshot);
        }
        resolve();
      });
    });

    return foundSnapshot;
  }

  async loginWithApiKey(apiKey) {
    const result = await this.run(['login', '--with-api-key'], {
      stdinText: `${apiKey}\n`,
      timeoutMs: 20000
    });
    if (result.code !== 0) {
      throw new Error(result.stderr || result.stdout || 'Codex login failed.');
    }
    return this.getCapabilities();
  }

  async logout() {
    const result = await this.run(['logout'], { timeoutMs: 15000 });
    if (result.code !== 0) {
      throw new Error(result.stderr || result.stdout || 'Codex logout failed.');
    }
    return this.getCapabilities();
  }

  previewCliCommand(payload = {}) {
    return {
      binary: this.binary,
      args: buildCliArgs(payload)
    };
  }

  async runCliCommand(payload = {}) {
    const args = buildCliArgs(payload);
    const result = await this.run(args, {
      timeoutMs: Number(payload.timeoutMs || 30000)
    });
    return {
      ok: result.code === 0,
      binary: this.binary,
      args,
      ...result
    };
  }

  async runChatConversation(prompt, options = {}) {
    const args = ['exec', '--skip-git-repo-check'];
    if (options.cwd) args.push('-C', options.cwd);
    if (options.model) args.push('-m', options.model);
    if (options.profile) args.push('-p', options.profile);
    args.push(prompt);
    return this.run(args, { timeoutMs: 45000 });
  }
}
