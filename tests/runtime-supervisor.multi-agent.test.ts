import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { EventEmitter } from 'node:events';
import { PassThrough } from 'node:stream';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { RunService } from '../server/services/run-service.mjs';
import { RuntimeSupervisor } from '../server/services/runtime-supervisor.mjs';

const tempRoots: string[] = [];

class FakeChild extends EventEmitter {
  stdout = new PassThrough();
  stderr = new PassThrough();
  pid: number;
  private closed = false;
  private timer: NodeJS.Timeout | null = null;
  private exitCode: number;

  constructor(plan: {
    stdout?: string;
    stderr?: string;
    code?: number;
    delay?: number;
    lastMessageFile?: string;
    lastMessage?: string;
    hold?: boolean;
  }) {
    super();
    this.pid = Math.floor(Math.random() * 100000) + 1000;
    this.exitCode = plan.code ?? 0;
    this.timer = setTimeout(async () => {
      if (plan.stdout) this.stdout.write(`${plan.stdout}\n`);
      if (plan.stderr) this.stderr.write(`${plan.stderr}\n`);
      if (plan.lastMessageFile && typeof plan.lastMessage === 'string') {
        await fs.mkdir(path.dirname(plan.lastMessageFile), { recursive: true });
        await fs.writeFile(plan.lastMessageFile, plan.lastMessage, 'utf8');
      }
      if (!plan.hold) this.close(this.exitCode);
    }, plan.delay ?? 10);
  }

  kill() {
    this.close(0);
  }

  close(code: number) {
    if (this.closed) return;
    this.closed = true;
    if (this.timer) clearTimeout(this.timer);
    this.emit('close', code);
  }
}

async function createTempRun() {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'codex-gui-runtime-'));
  tempRoots.push(root);
  const projectRoot = path.join(root, 'project');
  const runDir = path.join(root, 'docs', 'project-bot', 'runs', 'demo-run');
  await fs.mkdir(projectRoot, { recursive: true });
  await fs.mkdir(path.join(projectRoot, 'src'), { recursive: true });
  await fs.mkdir(path.join(projectRoot, 'server'), { recursive: true });
  await fs.writeFile(path.join(projectRoot, 'package.json'), JSON.stringify({ name: 'demo' }, null, 2));
  await fs.mkdir(runDir, { recursive: true });
  await fs.writeFile(path.join(runDir, 'state.json'), JSON.stringify({
    version: 1,
    workspaceRoot: root,
    projectPath: projectRoot,
    mode: 'feature-delivery',
    request: 'Implement coordinated multi-agent runtime orchestration.',
    phases: [
      { id: 0, title: 'Execute feature', status: 'pending' }
    ]
  }, null, 2));
  return { root, projectRoot, runDir };
}

function parseArg(args: string[], flag: string) {
  const index = args.indexOf(flag);
  return index === -1 ? '' : args[index + 1];
}

function parseAgentId(args: string[]) {
  const promptFile = parseArg(args, '--prompt-file');
  const match = promptFile.match(/agents\/([^/]+)\/prompt\.md$/);
  return match ? match[1] : '';
}

function createSpawnStub(
  planner: (agentId: string, attempt: number, command: string, args: string[]) => {
    stdout?: string;
    stderr?: string;
    code?: number;
    delay?: number;
    lastMessage?: string;
    hold?: boolean;
  }
) {
  const attempts = new Map<string, number>();
  return vi.fn((command: string, args: string[]) => {
    const agentId = parseAgentId(args) || 'single';
    const attempt = attempts.get(agentId) || 0;
    attempts.set(agentId, attempt + 1);
    const plan = planner(agentId, attempt, command, args);
    return new FakeChild({
      ...plan,
      lastMessageFile: parseArg(args, '--last-message-file')
    });
  });
}

function buildGitService(projectRoot: string) {
  return {
    validateMultiAgentPreflight: vi.fn().mockResolvedValue({
      ok: true,
      repoRoot: projectRoot,
      isGitRepo: true,
      cleanWorkingTree: true,
      issues: [],
      fallback: 'single_agent',
      checkedAt: new Date().toISOString()
    }),
    ensureAgentWorktree: vi.fn().mockImplementation(async ({ runDir, agentId }) => ({
      path: path.join(runDir, 'worktrees', agentId),
      branchName: `branch-${agentId}`,
      baseRef: 'HEAD',
      repoRoot: projectRoot
    })),
    listChangedFiles: vi.fn().mockImplementation(async (worktreePath: string) => (
      worktreePath.includes('worker-1')
        ? ['server/runtime-supervisor.mjs']
        : ['src/features/dashboard/DashboardPage.tsx']
    )),
    writeWorktreePatch: vi.fn().mockImplementation(async ({ outputPath }) => {
      await fs.mkdir(path.dirname(outputPath), { recursive: true });
      await fs.writeFile(outputPath, 'diff --git a/demo b/demo\n', 'utf8');
    }),
    applyPatch: vi.fn().mockResolvedValue(undefined),
    reversePatch: vi.fn().mockResolvedValue(undefined)
  };
}

async function waitFor(assertion: () => Promise<void>, timeoutMs = 3000) {
  const startedAt = Date.now();
  let lastError: unknown;
  while (Date.now() - startedAt < timeoutMs) {
    try {
      await assertion();
      return;
    } catch (error) {
      lastError = error;
      await new Promise((resolve) => setTimeout(resolve, 25));
    }
  }
  throw lastError;
}

afterEach(async () => {
  while (tempRoots.length) {
    const target = tempRoots.pop();
    if (!target) break;
    await fs.rm(target, { recursive: true, force: true });
  }
});

describe('runtime supervisor multi-agent flow', () => {
  it('blocks startup when pre-planned worker lanes overlap', async () => {
    const { root, projectRoot, runDir } = await createTempRun();
    const runService = new RunService({ workspaceService: {} });
    await runService.initializeRunConfiguration(runDir, {
      multiAgent: { enabled: true, workerCount: 2, writeMode: 'scoped', isolation: 'worktree', mergeGate: 'manager_tests' }
    });
    const workerOneAssignmentPath = path.join(runDir, 'runtime', 'agents', 'worker-1', 'assignment.json');
    const workerTwoAssignmentPath = path.join(runDir, 'runtime', 'agents', 'worker-2', 'assignment.json');
    await fs.writeFile(workerOneAssignmentPath, JSON.stringify({
      agentId: 'worker-1',
      title: 'lane 1',
      objective: 'lane 1',
      ownership: ['src'],
      promptFile: path.join(runDir, 'runtime', 'agents', 'worker-1', 'prompt.md')
    }, null, 2));
    await fs.writeFile(workerTwoAssignmentPath, JSON.stringify({
      agentId: 'worker-2',
      title: 'lane 2',
      objective: 'lane 2',
      ownership: ['src/features'],
      promptFile: path.join(runDir, 'runtime', 'agents', 'worker-2', 'prompt.md')
    }, null, 2));
    const supervisor = new RuntimeSupervisor({
      runService,
      gitService: buildGitService(projectRoot),
      spawnProcess: createSpawnStub(() => ({ code: 0 }))
    });

    await expect(supervisor.startRun(runDir, {
      workspaceRoot: root,
      executionProfile: {
        maxCycles: 1,
        multiAgent: { enabled: true, workerCount: 2, writeMode: 'scoped', isolation: 'worktree', mergeGate: 'manager_tests' }
      }
    })).rejects.toThrow(/lane collision/i);

    const snapshot = await runService.getRunSnapshot(runDir);
    expect(snapshot.coordination?.status).toBe('blocked');
    expect(snapshot.coordination?.activePhase).toBe('assignment_conflict');
  });

  it('rejects non-git repositories with preflight details', async () => {
    const { root, projectRoot, runDir } = await createTempRun();
    const runService = new RunService({ workspaceService: {} });
    const gitService = buildGitService(projectRoot);
    gitService.validateMultiAgentPreflight.mockResolvedValueOnce({
      ok: false,
      repoRoot: null,
      isGitRepo: false,
      cleanWorkingTree: false,
      issues: [{ code: 'not_git_repo', message: 'Multi-agent mode requires the target project to be a Git repository.' }],
      fallback: 'single_agent',
      checkedAt: new Date().toISOString()
    });
    const supervisor = new RuntimeSupervisor({
      runService,
      gitService,
      spawnProcess: createSpawnStub(() => ({ code: 0 }))
    });

    let captured: unknown;
    try {
      await supervisor.startRun(runDir, {
        workspaceRoot: root,
        executionProfile: {
          maxCycles: 1,
          multiAgent: { enabled: true, workerCount: 2, writeMode: 'scoped', isolation: 'worktree', mergeGate: 'manager_tests' }
        }
      });
    } catch (error) {
      captured = error;
    }

    expect(captured).toBeTruthy();
    expect((captured as { preflight?: { issues?: Array<{ code?: string }> } }).preflight?.issues?.[0]?.code).toBe('not_git_repo');
    const snapshot = await runService.getRunSnapshot(runDir);
    expect(snapshot.preflight?.issues[0]?.code).toBe('not_git_repo');
  });

  it('rejects dirty worktrees for multi-agent runs but still allows single-agent fallback', async () => {
    const { root, projectRoot, runDir } = await createTempRun();
    const runService = new RunService({ workspaceService: {} });
    const gitService = buildGitService(projectRoot);
    gitService.validateMultiAgentPreflight.mockResolvedValueOnce({
      ok: false,
      repoRoot: projectRoot,
      isGitRepo: true,
      cleanWorkingTree: false,
      issues: [{ code: 'dirty_worktree', message: 'Multi-agent mode requires a clean working tree before start.' }],
      fallback: 'single_agent',
      checkedAt: new Date().toISOString()
    });
    const spawnProcess = createSpawnStub(() => ({ code: 0 }));
    const supervisor = new RuntimeSupervisor({
      runService,
      gitService,
      spawnProcess
    });

    await expect(supervisor.startRun(runDir, {
      workspaceRoot: root,
      executionProfile: {
        maxCycles: 1,
        multiAgent: { enabled: true, workerCount: 2, writeMode: 'scoped', isolation: 'worktree', mergeGate: 'manager_tests' }
      }
    })).rejects.toMatchObject({
      preflight: {
        issues: [{ code: 'dirty_worktree' }]
      }
    });

    await supervisor.startRun(runDir, {
      workspaceRoot: root,
      executionProfile: {
        maxCycles: 1,
        multiAgent: { enabled: false, workerCount: 3, writeMode: 'scoped', isolation: 'worktree', mergeGate: 'manager_tests' }
      }
    });

    await waitFor(async () => {
      const snapshot = await runService.getRunSnapshot(runDir);
      expect(['running', 'stopped', 'starting', 'queued']).toContain(snapshot.runtime.state);
    });
  });

  it('pauses the full coordinated run when a worker hits authentication failure', async () => {
    const { root, projectRoot, runDir } = await createTempRun();
    const runService = new RunService({ workspaceService: {} });
    const supervisor = new RuntimeSupervisor({
      runService,
      gitService: buildGitService(projectRoot),
      spawnProcess: createSpawnStub((agentId) => {
        if (agentId === 'worker-1') {
          return {
            stderr: 'Not logged in and authentication is required.',
            code: 1
          };
        }
        if (agentId.startsWith('worker-')) {
          return {
            stdout: `${agentId} still running`,
            hold: true
          };
        }
        return { lastMessage: 'ACCEPT: ready', code: 0 };
      })
    });

    await supervisor.startRun(runDir, {
      workspaceRoot: root,
      executionProfile: {
        maxCycles: 1,
        multiAgent: { enabled: true, workerCount: 2, writeMode: 'scoped', isolation: 'worktree', mergeGate: 'manager_tests' }
      }
    });

    await waitFor(async () => {
      const snapshot = await runService.getRunSnapshot(runDir);
      expect(snapshot.runtime.state).toBe('waiting_auth');
      expect(snapshot.coordination?.status).toBe('waiting_auth');
    });
  });

  it('retries transient worker failure once and completes after resume from waiting_auth', async () => {
    const { root, projectRoot, runDir } = await createTempRun();
    const runService = new RunService({ workspaceService: {} });
    const gitService = buildGitService(projectRoot);
    let phase = 'auth-block';
    const spawnProcess = createSpawnStub((agentId, attempt) => {
      if (phase === 'auth-block') {
        if (agentId === 'worker-1') {
          return {
            stderr: 'Error: exceeded your current quota.',
            code: 1
          };
        }
        if (agentId === 'worker-2') {
          return {
            stdout: 'worker-2 waiting',
            hold: true
          };
        }
      }

      if (phase === 'resume-success') {
        if (agentId === 'worker-1' && attempt === 1) {
          return {
            stderr: 'temporary worker failure',
            code: 1
          };
        }
        if (agentId.startsWith('worker-')) {
          return {
            stdout: `${agentId} complete`,
            code: 0
          };
        }
        return {
          lastMessage: 'ACCEPT: merge gate passed.',
          code: 0
        };
      }

      return { code: 0 };
    });
    const supervisor = new RuntimeSupervisor({
      runService,
      gitService,
      spawnProcess,
      commandRunner: vi.fn().mockResolvedValue({
        code: 0,
        stdout: 'tests passed',
        stderr: ''
      })
    });

    await supervisor.startRun(runDir, {
      workspaceRoot: root,
      executionProfile: {
        maxCycles: 1,
        multiAgent: { enabled: true, workerCount: 2, writeMode: 'scoped', isolation: 'worktree', mergeGate: 'manager_tests' }
      }
    });

    await waitFor(async () => {
      const snapshot = await runService.getRunSnapshot(runDir);
      expect(snapshot.runtime.state).toBe('waiting_auth');
    });

    phase = 'resume-success';
    await supervisor.resumeRun(runDir, {
      workspaceRoot: root,
      executionProfile: {
        maxCycles: 1,
        multiAgent: { enabled: true, workerCount: 2, writeMode: 'scoped', isolation: 'worktree', mergeGate: 'manager_tests' }
      }
    });

    await waitFor(async () => {
      const snapshot = await runService.getRunSnapshot(runDir);
      expect(snapshot.runtime.state).toBe('completed');
      expect(snapshot.mergeReport?.status).toBe('accepted');
      const worker = snapshot.subAgents.find((agent) => agent.agentId === 'worker-1');
      expect(worker?.retryCount).toBe(1);
    }, 5000);
  });
});
