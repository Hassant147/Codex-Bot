import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import {
  CodexService,
  findCodexBinary,
  normalizeAuthStorageCapabilities,
  parseAuthSnapshot,
  parseAuthStatus,
  parseUsageSnapshotFromCliTrace,
  parseUsageSnapshotFromSessionText
} from '../server/services/codex-service.mjs';
import { detectBlockingIssue } from '../server/services/runtime-supervisor.mjs';

const cleanupPaths = [];

function encodeJwt(payload) {
  return `header.${Buffer.from(JSON.stringify(payload)).toString('base64url')}.signature`;
}

afterEach(async () => {
  await Promise.all(cleanupPaths.splice(0).map((targetPath) => fs.rm(targetPath, { recursive: true, force: true })));
});

describe('account and runtime parsing', () => {
  it('parses ChatGPT login state with provider awareness', () => {
    const status = parseAuthStatus('Logged in using ChatGPT');
    expect(status.loggedIn).toBe(true);
    expect(status.provider).toBe('chatgpt');
  });

  it('parses api key login state with provider awareness', () => {
    const status = parseAuthStatus('Logged in using API key');
    expect(status.loggedIn).toBe(true);
    expect(status.provider).toBe('api-key');
  });

  it('detects quota blocking issues from runtime output', () => {
    expect(detectBlockingIssue('Error: exceeded your current quota.')).toEqual({
      kind: 'quota',
      message: 'Error: exceeded your current quota.'
    });
  });

  it('detects auth blocking issues from runtime output', () => {
    expect(detectBlockingIssue('Not logged in and authentication is required.')).toEqual({
      kind: 'auth',
      message: 'Not logged in and authentication is required.'
    });
  });

  it('normalizes auth storage capabilities when the source value is missing', () => {
    expect(normalizeAuthStorageCapabilities(null, '/tmp/auth.json')).toEqual({
      authFilePath: '/tmp/auth.json',
      authFileExists: false,
      supportsChatgptSnapshots: false
    });
  });

  it('finds the Codex binary in the VS Code extension install when PATH is missing it', async () => {
    const homeDir = await fs.mkdtemp(path.join(os.tmpdir(), 'codex-binary-'));
    cleanupPaths.push(homeDir);

    const binaryPath = path.join(
      homeDir,
      '.vscode',
      'extensions',
      'openai.chatgpt-26.311.21342-darwin-arm64',
      'bin',
      'macos-aarch64',
      'codex'
    );
    await fs.mkdir(path.dirname(binaryPath), { recursive: true });
    await fs.writeFile(binaryPath, '');

    const resolved = await findCodexBinary({
      env: { PATH: '' },
      homeDir,
      platform: 'darwin',
      arch: 'arm64'
    });

    expect(resolved).toBe(binaryPath);
  });

  it('parses the current auth snapshot identity', () => {
    const snapshot = parseAuthSnapshot(JSON.stringify({
      auth_mode: 'chatgpt',
      last_refresh: '2026-03-14T00:15:00.000Z',
      tokens: {
        account_id: 'acct_demo_123',
        id_token: encodeJwt({
          email: 'tester@example.com',
          sub: 'user_123',
          'https://api.openai.com/auth.chatgpt_plan_type': 'plus'
        })
      }
    }));

    expect(snapshot).toMatchObject({
      authMode: 'chatgpt',
      accountEmail: 'tester@example.com',
      accountId: 'acct_demo_123',
      accountSubject: 'user_123',
      planType: 'plus'
    });
    expect(snapshot.lastRefreshAt).toBe('2026-03-14T00:15:00.000Z');
  });

  it('parses the latest rate-limit snapshot from a session log tail', () => {
    const snapshot = parseUsageSnapshotFromSessionText([
      JSON.stringify({ timestamp: '2026-03-14T00:24:00.000Z', type: 'event_msg', payload: { type: 'info' } }),
      JSON.stringify({
        timestamp: '2026-03-14T00:25:06.261Z',
        type: 'event_msg',
        payload: {
          type: 'token_count',
          rate_limits: {
            primary: { used_percent: 16, window_minutes: 300, resets_at: 1773460499 },
            secondary: { used_percent: 5, window_minutes: 10080, resets_at: 1774047299 },
            credits: null,
            plan_type: 'plus'
          }
        }
      })
    ].join('\n'));

    expect(snapshot).toMatchObject({
      source: 'session-log',
      planType: 'plus',
      primary: {
        usedPercent: 16,
        leftPercent: 84,
        windowMinutes: 300,
        resetAt: '2026-03-14T03:54:59.000Z'
      },
      secondary: {
        usedPercent: 5,
        leftPercent: 95,
        windowMinutes: 10080,
        resetAt: '2026-03-20T22:54:59.000Z'
      }
    });
  });

  it('parses a CLI trace codex.rate_limits event into a usage snapshot', () => {
    const snapshot = parseUsageSnapshotFromCliTrace(
      '2026-03-14T01:37:00.728488Z TRACE tungstenite::protocol: Received message {"type":"codex.rate_limits","plan_type":"plus","rate_limits":{"allowed":true,"limit_reached":false,"primary":{"used_percent":5,"window_minutes":300,"reset_after_seconds":12846,"reset_at":1773465066},"secondary":{"used_percent":1,"window_minutes":10080,"reset_after_seconds":599646,"reset_at":1774051866}},"code_review_rate_limits":null,"additional_rate_limits":null,"credits":null,"promo":null}',
      {
        accountEmail: 'tester@example.com',
        accountId: 'acct_demo_123',
        planType: 'plus'
      }
    );

    expect(snapshot).toMatchObject({
      source: 'cli-probe',
      accountEmail: 'tester@example.com',
      accountId: 'acct_demo_123',
      planType: 'plus',
      freshForCurrentLogin: true,
      primary: {
        usedPercent: 5,
        leftPercent: 95,
        windowMinutes: 300,
        resetAt: '2026-03-14T05:11:06.000Z'
      },
      secondary: {
        usedPercent: 1,
        leftPercent: 99,
        windowMinutes: 10080,
        resetAt: '2026-03-21T00:11:06.000Z'
      }
    });
  });

  it('returns the freshest local usage snapshot for the current login', async () => {
    const tempRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'codex-usage-'));
    cleanupPaths.push(tempRoot);

    const authFilePath = path.join(tempRoot, 'auth.json');
    const sessionsRoot = path.join(tempRoot, 'sessions');
    const sessionFile = path.join(sessionsRoot, '2026', '03', '14', 'session.jsonl');
    await fs.mkdir(path.dirname(sessionFile), { recursive: true });

    await fs.writeFile(authFilePath, JSON.stringify({
      auth_mode: 'chatgpt',
      last_refresh: '2026-03-14T00:15:00.000Z',
      tokens: {
        account_id: 'acct_demo_123',
        id_token: encodeJwt({
          email: 'tester@example.com',
          sub: 'user_123',
          'https://api.openai.com/auth.chatgpt_plan_type': 'plus'
        })
      }
    }));

    await fs.writeFile(sessionFile, JSON.stringify({
      timestamp: '2026-03-14T00:25:06.261Z',
      type: 'event_msg',
      payload: {
        type: 'token_count',
        rate_limits: {
          primary: { used_percent: 16, window_minutes: 300, resets_at: 1773460499 },
          secondary: { used_percent: 5, window_minutes: 10080, resets_at: 1774047299 },
          credits: null,
          plan_type: 'plus'
        }
      }
    }));

    const sessionMtime = new Date('2026-03-14T00:26:00.000Z');
    await fs.utimes(sessionFile, sessionMtime, sessionMtime);

    const service = new CodexService({ authFilePath, sessionsRoot });
    const snapshot = await service.getCurrentUsageSnapshot();

    expect(snapshot).toMatchObject({
      source: 'session-log',
      accountEmail: 'tester@example.com',
      accountId: 'acct_demo_123',
      planType: 'plus',
      freshForCurrentLogin: true,
      primary: {
        leftPercent: 84
      },
      secondary: {
        leftPercent: 95
      }
    });
  });

  it('marks pre-switch session snapshots as stale for the newly active account', async () => {
    const tempRoot = await fs.mkdtemp(path.join(os.tmpdir(), 'codex-usage-'));
    cleanupPaths.push(tempRoot);

    const authFilePath = path.join(tempRoot, 'auth.json');
    const sessionsRoot = path.join(tempRoot, 'sessions');
    const sessionFile = path.join(sessionsRoot, '2026', '03', '14', 'session.jsonl');
    await fs.mkdir(path.dirname(sessionFile), { recursive: true });

    await fs.writeFile(authFilePath, JSON.stringify({
      auth_mode: 'chatgpt',
      last_refresh: '2026-03-14T00:15:00.000Z',
      tokens: {
        account_id: 'acct_demo_456',
        id_token: encodeJwt({
          email: 'fresh@example.com',
          sub: 'user_456',
          'https://api.openai.com/auth.chatgpt_plan_type': 'plus'
        })
      }
    }));

    await fs.writeFile(sessionFile, JSON.stringify({
      timestamp: '2026-03-14T00:25:06.261Z',
      type: 'event_msg',
      payload: {
        type: 'token_count',
        rate_limits: {
          primary: { used_percent: 16, window_minutes: 300, resets_at: 1773460499 },
          secondary: { used_percent: 5, window_minutes: 10080, resets_at: 1774047299 },
          credits: null,
          plan_type: 'plus'
        }
      }
    }));

    const sessionMtime = new Date('2026-03-14T00:26:00.000Z');
    await fs.utimes(sessionFile, sessionMtime, sessionMtime);

    const service = new CodexService({ authFilePath, sessionsRoot });
    const snapshot = await service.getCurrentUsageSnapshot({
      freshAfterMs: Date.parse('2026-03-14T00:30:00.000Z')
    });

    expect(snapshot).toMatchObject({
      source: 'session-log',
      accountEmail: '',
      accountId: '',
      planType: 'plus',
      freshForCurrentLogin: false,
      primary: {
        leftPercent: 84
      },
      secondary: {
        leftPercent: 95
      }
    });
  });
});
