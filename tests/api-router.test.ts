import express from 'express';
import request from 'supertest';
import { describe, expect, it, vi } from 'vitest';
import { createApiRouter } from '../server/routes/api-router.mjs';

function buildAccountPayload(overrides = {}) {
  return {
    activeAccountId: '',
    accounts: [],
    currentSession: { loggedIn: false, method: '', provider: 'unknown', raw: '' },
    capabilities: {
      available: true,
      binary: 'codex',
      version: '1',
      commands: [],
      auth: { loggedIn: false, method: '', provider: 'unknown', raw: '' },
      profiles: [],
      models: [],
      authStorage: {
        authFilePath: '/Users/demo/.codex/auth.json',
        authFileExists: true,
        supportsChatgptSnapshots: true
      }
    },
    currentUsage: null,
    ...overrides
  };
}

function buildApp() {
  const runSnapshot = {
    runId: 'demo-run',
    runDir: '/tmp/ws/docs/project-bot/runs/demo-run',
    state: {
      version: 1,
      workspaceRoot: '/tmp/ws',
      projectPath: '/tmp/repo',
      mode: 'project-summary',
      multiAgent: {
        enabled: false,
        workerCount: 3,
        writeMode: 'scoped',
        isolation: 'worktree',
        mergeGate: 'manager_tests'
      },
      phases: []
    },
    summary: {
      total: 0,
      completed: 0,
      nextPhase: null,
      done: false
    },
    runtime: {
      id: 'runtime-1',
      runDir: '/tmp/ws/docs/project-bot/runs/demo-run',
      state: 'draft',
      blockingIssue: null,
      pid: null,
      lastExitCode: null,
      lastUpdatedAt: new Date().toISOString(),
      heartbeatAt: null
    },
    events: [],
    runSummary: '',
    nextPrompt: '',
    coordination: null,
    subAgents: [],
    mergeReport: null,
    preflight: null
  };
  const app = express();
  app.use(express.json());
  app.use('/api', createApiRouter({
    workspaceService: {
      bootstrapMetadata: vi.fn().mockResolvedValue({
        tabs: [{ id: 'dashboard', label: 'Dashboard' }],
        modes: [],
        runTemplates: [],
        scopeLevels: [],
        qualityPresets: [],
        workspace: {
          version: 2,
          workspaceRoot: '/tmp/ws',
          projectPath: '/tmp/repo',
          designGuides: [],
          blueprintSources: [],
          globalRules: '',
          scopeLevelDefault: 'module',
          requiredAtlasDocs: [],
          fullSystemRequiredDocs: true,
          executionProfile: {
            model: '',
            effort: 'high',
            maxCycles: 12,
            quiet: true,
            profile: '',
            searchEnabled: false,
            extraAddDirs: [],
            configOverrides: [],
            autoAddRelatedRepos: true,
            multiAgent: {
              enabled: false,
              workerCount: 3,
              writeMode: 'scoped',
              isolation: 'worktree',
              mergeGate: 'manager_tests'
            }
          }
        },
        workspaces: [],
        projectProfiles: [],
        latestRun: ''
      }),
      getWorkspaceConfig: vi.fn().mockResolvedValue({
        workspaceRoot: '/tmp/ws',
        projectPath: '/tmp/repo',
        executionProfile: {
          model: '',
          effort: 'high',
          maxCycles: 12,
          quiet: true,
          profile: '',
          searchEnabled: false,
          extraAddDirs: [],
          configOverrides: [],
          autoAddRelatedRepos: true,
          multiAgent: {
            enabled: false,
            workerCount: 3,
            writeMode: 'scoped',
            isolation: 'worktree',
            mergeGate: 'manager_tests'
          }
        },
        scopeLevelDefault: 'module',
        designGuides: [],
        blueprintSources: [],
        requiredAtlasDocs: [],
        globalRules: ''
      }),
      listSavedWorkspaces: vi.fn().mockResolvedValue([]),
      listProjectProfiles: vi.fn().mockResolvedValue([])
    },
    runService: {
      listRuns: vi.fn().mockResolvedValue([runSnapshot]),
      getRunSnapshot: vi.fn().mockResolvedValue(runSnapshot),
      initializeRunConfiguration: vi.fn().mockResolvedValue(runSnapshot),
      getRunAgents: vi.fn().mockResolvedValue([]),
      getRunAgentDetail: vi.fn().mockResolvedValue(null),
      appendRuntimeEvent: vi.fn().mockResolvedValue(undefined)
    },
    runtimeSupervisor: {
      subscribe: vi.fn(),
      startRun: vi.fn().mockResolvedValue(undefined),
      pauseRun: vi.fn().mockResolvedValue(undefined),
      resumeRun: vi.fn().mockResolvedValue(undefined),
      stopRun: vi.fn().mockResolvedValue(undefined)
    },
    accountService: {
      listAccounts: vi.fn().mockResolvedValue(buildAccountPayload()),
      login: vi.fn().mockResolvedValue(buildAccountPayload({
        activeAccountId: 'account-api',
        accounts: [],
        currentSession: { loggedIn: true, method: 'API key', provider: 'api-key', raw: 'Logged in using API key' },
        capabilities: buildAccountPayload().capabilities
      })),
      saveCurrentChatgptSession: vi.fn().mockResolvedValue(buildAccountPayload({
        activeAccountId: 'account-chatgpt',
        accounts: [],
        currentSession: { loggedIn: true, method: 'ChatGPT', provider: 'chatgpt', raw: 'Logged in using ChatGPT' },
        capabilities: {
          ...buildAccountPayload().capabilities,
          auth: { loggedIn: true, method: 'ChatGPT', provider: 'chatgpt', raw: 'Logged in using ChatGPT' }
        }
      })),
      switchAccount: vi.fn().mockResolvedValue({
        activeAccountId: 'account-chatgpt',
        accounts: [],
        currentSession: { loggedIn: true, method: 'ChatGPT', provider: 'chatgpt', raw: 'Logged in using ChatGPT' },
        capabilities: {
          ...buildAccountPayload().capabilities,
          auth: { loggedIn: true, method: 'ChatGPT', provider: 'chatgpt', raw: 'Logged in using ChatGPT' }
        },
        currentUsage: null,
        account: { id: 'account-chatgpt', name: 'Browser Login' }
      }),
      verifyCurrentSession: vi.fn().mockResolvedValue(buildAccountPayload({
        activeAccountId: 'account-chatgpt',
        accounts: [],
        currentSession: { loggedIn: true, method: 'ChatGPT', provider: 'chatgpt', raw: 'Logged in using ChatGPT' },
        capabilities: {
          ...buildAccountPayload().capabilities,
          auth: { loggedIn: true, method: 'ChatGPT', provider: 'chatgpt', raw: 'Logged in using ChatGPT' }
        }
      })),
      checkCurrentUsage: vi.fn().mockResolvedValue(buildAccountPayload({
        activeAccountId: 'account-chatgpt',
        currentSession: { loggedIn: true, method: 'ChatGPT', provider: 'chatgpt', raw: 'Logged in using ChatGPT' },
        capabilities: {
          ...buildAccountPayload().capabilities,
          auth: { loggedIn: true, method: 'ChatGPT', provider: 'chatgpt', raw: 'Logged in using ChatGPT' }
        },
        currentUsage: {
          source: 'session-log',
          sessionFile: '/Users/demo/.codex/sessions/demo.jsonl',
          capturedAt: '2026-03-14T00:25:06.261Z',
          accountEmail: 'demo@example.com',
          accountId: 'acct_demo_123',
          planType: 'plus',
          freshForCurrentLogin: true,
          primary: { usedPercent: 16, leftPercent: 84, windowMinutes: 300, resetAt: '2026-03-14T03:54:59.000Z' },
          secondary: { usedPercent: 5, leftPercent: 95, windowMinutes: 10080, resetAt: '2026-03-20T22:54:59.000Z' },
          credits: null
        }
      })),
      logout: vi.fn().mockResolvedValue(buildAccountPayload()),
      removeAccount: vi.fn().mockResolvedValue({ ok: true })
    },
    projectBotService: {
      initWorkspace: vi.fn(),
      startRun: vi.fn()
    },
    codexService: {
      getCapabilities: vi.fn().mockResolvedValue({
        available: true,
        binary: 'codex',
        version: '1',
        commands: ['exec'],
        auth: { loggedIn: true, method: 'ChatGPT', provider: 'chatgpt', raw: 'Logged in using ChatGPT' },
        profiles: [],
        models: [],
        authStorage: {
          authFilePath: '/Users/demo/.codex/auth.json',
          authFileExists: true,
          supportsChatgptSnapshots: true
        }
      }),
      previewCliCommand: vi.fn().mockReturnValue({
        binary: 'codex',
        args: ['exec', '--skip-git-repo-check', 'Hello']
      }),
      runCliCommand: vi.fn()
    },
    chatService: {
      listThreads: vi.fn().mockResolvedValue([]),
      createThread: vi.fn(),
      getThread: vi.fn(),
      sendMessage: vi.fn()
    }
  }));
  return app;
}

describe('api router', () => {
  it('returns bootstrap payload', async () => {
    const app = buildApp();
    const response = await request(app).get('/api/app/bootstrap');
    expect(response.status).toBe(200);
    expect(response.body.workspace.workspaceRoot).toBe('/tmp/ws');
  });

  it('returns CLI preview payload', async () => {
    const app = buildApp();
    const response = await request(app)
      .post('/api/cli/preview')
      .send({ command: 'exec', prompt: 'Hello' });
    expect(response.status).toBe(200);
    expect(response.body.binary).toBe('codex');
    expect(response.body.args).toContain('Hello');
  });

  it('supports the run lifecycle endpoints', async () => {
    const app = buildApp();

    const start = await request(app).post('/api/runs/demo-run/start').send({
      workspaceRoot: '/tmp/ws',
      executionProfile: { maxCycles: 4 }
    });
    const pause = await request(app).post('/api/runs/demo-run/pause').send({
      workspaceRoot: '/tmp/ws'
    });
    const resume = await request(app).post('/api/runs/demo-run/resume').send({
      workspaceRoot: '/tmp/ws',
      executionProfile: { maxCycles: 4 }
    });
    const stop = await request(app).post('/api/runs/demo-run/stop').send({
      workspaceRoot: '/tmp/ws'
    });

    expect(start.status).toBe(200);
    expect(pause.status).toBe(200);
    expect(resume.status).toBe(200);
    expect(stop.status).toBe(200);
  });

  it('supports browser-session save and verify endpoints', async () => {
    const app = buildApp();

    const saveSnapshot = await request(app)
      .post('/api/accounts/save-chatgpt-session')
      .send({ name: 'Browser Login' });
    const verify = await request(app)
      .post('/api/accounts/verify')
      .send({});

    expect(saveSnapshot.status).toBe(200);
    expect(verify.status).toBe(200);
    expect(saveSnapshot.body.currentSession.provider).toBe('chatgpt');
    expect(verify.body.currentSession.loggedIn).toBe(true);
  });

  it('returns the current usage snapshot endpoint', async () => {
    const app = buildApp();

    const usage = await request(app)
      .post('/api/accounts/usage')
      .send({});

    expect(usage.status).toBe(200);
    expect(usage.body.currentUsage.accountEmail).toBe('demo@example.com');
    expect(usage.body.currentUsage.primary.leftPercent).toBe(84);
  });
});
