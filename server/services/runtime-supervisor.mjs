import fs from 'node:fs/promises';
import path from 'node:path';
import { EventEmitter } from 'node:events';
import { spawn } from 'node:child_process';
import {
  AUTOPILOT,
  HEALTH_CHECK_INTERVAL_MS,
  RUNTIME_COMMAND_FILE,
  RUNTIME_HEARTBEAT_FILE,
  SUB_AGENT_RUNNER
} from '../config.mjs';
import { ensureDir, writeJson } from '../utils/fs.mjs';
import { buildAutopilotCommand, buildAutopilotEnvironment } from './command-builder.mjs';
import {
  applyPatch as applyGitPatch,
  ensureAgentWorktree,
  listChangedFiles,
  reversePatch,
  validateMultiAgentPreflight,
  writeWorktreePatch
} from './git-service.mjs';
import {
  appendAgentEvent,
  agentPromptPath,
  agentRoot,
  buildMergeGateDecision,
  collectAssignmentOwnershipOverlaps,
  collectOwnershipViolations,
  ensureMultiAgentArtifacts,
  normalizeMultiAgentConfig,
  planAssignments,
  readAgentAssignment,
  readAgentStatus,
  readCoordinationState,
  readMergeReport,
  readSubAgentDetail,
  updateAgentStatus,
  updateCoordinationState,
  writeAgentAssignment,
  writeAgentPrompt,
  writeAgentWorktree,
  writeMergeReport
} from './multi-agent-service.mjs';

function runtimeRoot(runDir) {
  return path.join(path.resolve(runDir), 'runtime');
}

function heartbeatPath(runDir) {
  return path.join(runtimeRoot(runDir), RUNTIME_HEARTBEAT_FILE);
}

function commandPath(runDir) {
  return path.join(runtimeRoot(runDir), RUNTIME_COMMAND_FILE);
}

export function detectBlockingIssue(line = '') {
  const text = String(line || '').trim();
  const lower = text.toLowerCase();
  if (!text) return null;
  if (
    lower.includes('insufficient_quota')
    || lower.includes('current quota')
    || lower.includes('usage limit')
    || lower.includes('credits')
    || lower.includes('limit reached')
  ) {
    return { kind: 'quota', message: text };
  }
  if (
    lower.includes('not logged in')
    || lower.includes('logged out')
    || lower.includes('unauthorized')
    || lower.includes('invalid api key')
    || lower.includes('authentication')
    || lower.includes('auth')
  ) {
    return { kind: 'auth', message: text };
  }
  return null;
}

function splitLines(buffer, chunk) {
  const lines = `${buffer}${chunk}`.split('\n');
  return {
    lines: lines.slice(0, -1),
    remainder: lines.at(-1) || ''
  };
}

async function runCommand(command, args = [], options = {}) {
  return await new Promise((resolve) => {
    const child = spawn(command, args, {
      cwd: options.cwd || process.cwd(),
      env: { ...process.env, ...(options.env || {}) },
      stdio: ['ignore', 'pipe', 'pipe']
    });
    let stdout = '';
    let stderr = '';
    child.stdout.on('data', (chunk) => {
      stdout += chunk.toString('utf8');
    });
    child.stderr.on('data', (chunk) => {
      stderr += chunk.toString('utf8');
    });
    child.on('close', (code) => {
      resolve({
        code: code ?? 0,
        stdout: stdout.trim(),
        stderr: stderr.trim()
      });
    });
  });
}

async function resolveTestCommand(projectPath) {
  const packageJson = path.join(path.resolve(projectPath), 'package.json');
  try {
    await fs.access(packageJson);
  } catch {
    return null;
  }
  const pnpmLock = path.join(path.resolve(projectPath), 'pnpm-lock.yaml');
  const yarnLock = path.join(path.resolve(projectPath), 'yarn.lock');
  try {
    await fs.access(pnpmLock);
    return { command: 'pnpm', args: ['test'], label: 'pnpm test' };
  } catch {
    // ignore
  }
  try {
    await fs.access(yarnLock);
    return { command: 'yarn', args: ['test'], label: 'yarn test' };
  } catch {
    // ignore
  }
  return { command: 'npm', args: ['test'], label: 'npm test' };
}

function managerSource() {
  return 'manager';
}

function workerSource(agentId) {
  return `worker:${agentId}`;
}

function buildWorkerPrompt({ state, assignment, worktree, runDir }) {
  return [
    `You are ${assignment.agentId} in a coordinated multi-agent Codex run.`,
    `Run directory: ${runDir}`,
    `Target project: ${state.projectPath}`,
    `Assigned worktree: ${worktree.path}`,
    '',
    'Ownership boundaries:',
    ...assignment.ownership.map((item) => `- ${item}`),
    '',
    'Hard rules:',
    '- Modify only files inside the ownership boundaries listed above.',
    '- If you discover work outside your lane, document it in your final response instead of editing it.',
    '- Do not create commits or branches manually.',
    '- Run focused verification when possible, but avoid broad unrelated cleanup.',
    '',
    'Primary task:',
    state.request || 'Complete the assigned implementation slice.',
    '',
    'Finish by printing a concise summary of changes made, verification performed, and any deferred work.'
  ].join('\n');
}

function buildManagerReviewPrompt({
  state,
  assignment,
  changedFiles,
  patchPath,
  testResult
}) {
  return [
    'You are the manager agent for a coordinated multi-agent Codex run.',
    'Review the worker output and decide whether it should be accepted.',
    '',
    `Target project: ${state.projectPath}`,
    `Worker: ${assignment.agentId}`,
    `Ownership boundaries: ${assignment.ownership.join(', ') || '(none)'}`,
    `Candidate patch file: ${patchPath}`,
    '',
    'Changed files:',
    ...(changedFiles.length ? changedFiles.map((filePath) => `- ${filePath}`) : ['- No file changes detected.']),
    '',
    `Verification command: ${testResult.command}`,
    `Verification outcome: ${testResult.passed ? 'PASS' : 'FAIL'}`,
    testResult.output ? `Verification output:\n${testResult.output}` : 'Verification output: (none)',
    '',
    'Rules:',
    '- Do not modify files.',
    '- Reply with exactly one line starting with either ACCEPT: or REJECT:.',
    '- Reject when scope ownership, verification, or handoff quality is not sufficient.'
  ].join('\n');
}

function parseManagerDecision(output = '') {
  const text = String(output || '').trim();
  if (!text) return false;
  if (/^accept\s*:/i.test(text)) return true;
  if (/^reject\s*:/i.test(text)) return false;
  return false;
}

export class RuntimeSupervisor {
  constructor({
    runService,
    spawnProcess = spawn,
    gitService = {
      validateMultiAgentPreflight,
      ensureAgentWorktree,
      listChangedFiles,
      writeWorktreePatch,
      applyPatch: applyGitPatch,
      reversePatch
    },
    commandRunner = runCommand,
    subAgentRunnerPath = SUB_AGENT_RUNNER
  }) {
    this.runService = runService;
    this.spawnProcess = spawnProcess;
    this.gitService = gitService;
    this.commandRunner = commandRunner;
    this.subAgentRunnerPath = subAgentRunnerPath;
    this.active = new Map();
    this.events = new EventEmitter();
    this.events.setMaxListeners(200);
  }

  subscribe(runDir, listener) {
    const channel = path.resolve(runDir);
    this.events.on(channel, listener);
    return () => this.events.off(channel, listener);
  }

  emit(runDir, payload) {
    this.events.emit(path.resolve(runDir), payload);
  }

  async emitAgentUpdate(runDir, agentId) {
    const detail = await readSubAgentDetail(runDir, agentId);
    if (detail?.summary) {
      this.emit(runDir, { type: 'agent', payload: detail.summary });
    }
  }

  async emitCoordinationUpdate(runDir) {
    const coordination = await readCoordinationState(runDir);
    if (coordination) {
      this.emit(runDir, { type: 'coordination', payload: coordination });
    }
  }

  async appendRunAndAgentEvent(runDir, agentId, event) {
    const source = agentId === 'manager' ? managerSource() : workerSource(agentId);
    const entry = await this.runService.appendRuntimeEvent(runDir, {
      ...event,
      source
    });
    await appendAgentEvent(runDir, agentId, {
      ...event,
      source
    });
    this.emit(runDir, entry);
    return entry;
  }

  async writeAggregatedHeartbeat(runDir) {
    const snapshot = await this.runService.getRunSnapshot(runDir);
    const heartbeatAt = new Date().toISOString();
    await writeJson(heartbeatPath(runDir), {
      runDir: path.resolve(runDir),
      heartbeatAt,
      agents: snapshot.subAgents.map((agent) => ({
        agentId: agent.agentId,
        status: agent.status,
        phase: agent.phase,
        heartbeatAt: agent.heartbeatAt,
        worktreePath: agent.worktreePath
      }))
    });
    const status = await this.runService.writeRuntimeStatus(runDir, {
      heartbeatAt
    });
    this.emit(runDir, { type: 'runtime', payload: status });
  }

  async recoverRuns(runDirs = []) {
    for (const runDir of runDirs) {
      await this.runService.markRecoveredRun(runDir, 'stopped');
    }
  }

  async startRun(runDir, { workspaceRoot, executionProfile, activeAccountId = '' }) {
    const resolvedRunDir = path.resolve(runDir);
    if (this.active.has(resolvedRunDir)) throw new Error('Run is already active.');
    await ensureDir(runtimeRoot(resolvedRunDir));
    const runtime = await this.runService.readRuntimeStatus(resolvedRunDir);
    if (runtime.state === 'completed') throw new Error('Completed runs cannot be restarted.');

    const snapshot = await this.runService.getRunSnapshot(resolvedRunDir);
    const multiAgent = normalizeMultiAgentConfig(executionProfile?.multiAgent || snapshot.state.multiAgent || {});
    if (multiAgent.enabled) {
      await this.runService.initializeRunConfiguration(resolvedRunDir, { multiAgent });
      return await this.startMultiAgentRun(resolvedRunDir, {
        workspaceRoot,
        executionProfile: {
          ...executionProfile,
          multiAgent
        },
        activeAccountId
      });
    }

    return await this.startSingleAgentRun(resolvedRunDir, {
      workspaceRoot,
      executionProfile,
      activeAccountId
    });
  }

  async startSingleAgentRun(runDir, { workspaceRoot, executionProfile, activeAccountId = '' }) {
    const command = buildAutopilotCommand({
      scriptPath: AUTOPILOT,
      workspaceRoot
    });
    const launch = buildAutopilotEnvironment({
      runDir,
      profile: executionProfile,
      workspaceRoot
    });
    const commandPreview = {
      mode: 'single-agent',
      command: command.command,
      args: command.args,
      env: {
        ...launch.env
      }
    };
    await writeJson(commandPath(runDir), commandPreview);
    await this.runService.writeRuntimeStatus(runDir, {
      state: 'queued',
      blockingIssue: null,
      activeAccountId,
      lastExitCode: null
    });
    const queuedEvent = await this.runService.appendRuntimeEvent(runDir, {
      type: 'system',
      source: 'runtime',
      level: 'info',
      message: 'Run queued.'
    });
    this.emit(runDir, queuedEvent);

    const child = this.spawnProcess(command.command, command.args, {
      cwd: process.cwd(),
      env: {
        ...process.env,
        ...launch.env
      },
      stdio: ['ignore', 'pipe', 'pipe']
    });

    let stdoutBuffer = '';
    let stderrBuffer = '';
    const info = {
      type: 'single',
      child,
      stopReason: '',
      blockingIssue: null,
      heartbeat: setInterval(async () => {
        await writeJson(heartbeatPath(runDir), {
          runDir,
          pid: child.pid,
          heartbeatAt: new Date().toISOString()
        });
        const status = await this.runService.writeRuntimeStatus(runDir, {
          heartbeatAt: new Date().toISOString()
        });
        this.emit(runDir, { type: 'runtime', payload: status });
      }, HEALTH_CHECK_INTERVAL_MS)
    };

    this.active.set(runDir, info);
    const startedStatus = await this.runService.writeRuntimeStatus(runDir, {
      state: 'starting',
      pid: child.pid,
      blockingIssue: null
    });
    this.emit(runDir, { type: 'runtime', payload: startedStatus });
    const startedEvent = await this.runService.appendRuntimeEvent(runDir, {
      type: 'system',
      source: 'runtime',
      level: 'info',
      message: `Run started with PID ${child.pid}.`
    });
    this.emit(runDir, startedEvent);
    const runningStatus = await this.runService.writeRuntimeStatus(runDir, {
      state: 'running',
      pid: child.pid
    });
    this.emit(runDir, { type: 'runtime', payload: runningStatus });

    const handleChunk = async (source, chunk) => {
      const currentBuffer = source === 'stdout' ? stdoutBuffer : stderrBuffer;
      const { lines, remainder } = splitLines(currentBuffer, chunk.toString('utf8'));
      if (source === 'stdout') stdoutBuffer = remainder;
      else stderrBuffer = remainder;
      for (const line of lines) {
        const issue = detectBlockingIssue(line);
        if (issue) info.blockingIssue = issue;
        const entry = await this.runService.appendRuntimeEvent(runDir, {
          type: 'log',
          source,
          level: source === 'stderr' ? 'error' : 'info',
          message: line
        });
        this.emit(runDir, entry);
      }
    };

    child.stdout.on('data', (chunk) => {
      void handleChunk('stdout', chunk);
    });
    child.stderr.on('data', (chunk) => {
      void handleChunk('stderr', chunk);
    });

    child.on('close', async (code) => {
      clearInterval(info.heartbeat);
      this.active.delete(runDir);
      const latestSnapshot = await this.runService.getRunSnapshot(runDir).catch(() => ({
        summary: {
          done: false
        }
      }));
      const nextPatch = {
        pid: null,
        lastExitCode: code ?? 0,
        blockingIssue: null
      };
      let message = 'Run stopped.';
      if (info.stopReason === 'pause') {
        nextPatch.state = 'paused';
        message = 'Run paused by user.';
      } else if (info.stopReason === 'stop') {
        nextPatch.state = 'stopped';
        message = 'Run stopped by user.';
      } else if (info.blockingIssue) {
        nextPatch.state = 'waiting_auth';
        nextPatch.blockingIssue = info.blockingIssue;
        message = `Run paused for account recovery: ${info.blockingIssue.message}`;
      } else if (latestSnapshot.summary.done && (code ?? 0) === 0) {
        nextPatch.state = 'completed';
        message = 'Run completed.';
      } else if ((code ?? 0) === 0) {
        nextPatch.state = 'stopped';
        message = 'Run exited before all phases completed.';
      } else {
        nextPatch.state = 'failed';
        message = 'Run failed.';
      }
      const status = await this.runService.writeRuntimeStatus(runDir, nextPatch);
      this.emit(runDir, { type: 'runtime', payload: status });
      const entry = await this.runService.appendRuntimeEvent(runDir, {
        type: 'system',
        source: 'runtime',
        level: nextPatch.state === 'failed' ? 'error' : 'info',
        message
      });
      this.emit(runDir, entry);
    });
  }

  buildSubAgentLaunch({ runDir, workspaceRoot, executionProfile, promptFile, cwd, lastMessageFile }) {
    const launch = buildAutopilotEnvironment({
      runDir,
      profile: executionProfile,
      workspaceRoot
    });
    const addDirs = String(launch.env.CODEX_ADD_DIRS || '')
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);
    addDirs.push(path.resolve(runDir));
    return {
      command: 'node',
      args: [
        this.subAgentRunnerPath,
        '--prompt-file',
        promptFile,
        '--cwd',
        cwd,
        '--last-message-file',
        lastMessageFile
      ],
      env: {
        ...launch.env,
        CODEX_ADD_DIRS: [...new Set(addDirs)].join('\n')
      }
    };
  }

  async startMultiAgentRun(runDir, { workspaceRoot, executionProfile, activeAccountId = '' }) {
    const snapshot = await this.runService.getRunSnapshot(runDir);
    const state = snapshot.state;
    const multiAgent = normalizeMultiAgentConfig(executionProfile?.multiAgent || state.multiAgent || {});
    const preflight = await this.gitService.validateMultiAgentPreflight(state.projectPath);
    await ensureMultiAgentArtifacts(runDir, multiAgent);
    await updateCoordinationState(runDir, {
      status: preflight.ok ? 'planning' : 'blocked',
      activePhase: preflight.ok ? 'planning' : 'preflight_failed',
      preflight,
      startedAt: snapshot.coordination?.startedAt || new Date().toISOString()
    });
    await this.emitCoordinationUpdate(runDir);

    if (!preflight.ok) {
      const error = new Error(preflight.issues.map((issue) => issue.message).join(' '));
      error.statusCode = 400;
      error.preflight = preflight;
      throw error;
    }

    const coordination = await readCoordinationState(runDir);
    const workerIds = coordination?.workerIds || Array.from({ length: multiAgent.workerCount }, (_item, index) => `worker-${index + 1}`);
    const existingAssignments = await Promise.all(workerIds.map((agentId) => readAgentAssignment(runDir, agentId)));
    const assignmentsPlanned = existingAssignments.every((assignment) => Array.isArray(assignment?.ownership) && assignment.ownership.length > 0);
    const plannedAssignments = assignmentsPlanned
      ? existingAssignments
      : await planAssignments({
        projectPath: state.projectPath,
        request: state.request,
        scope: state.scope || '',
        scopeTargets: Array.isArray(state.scopeTargets) ? state.scopeTargets : [],
        workerCount: multiAgent.workerCount
      });
    const assignmentOverlaps = collectAssignmentOwnershipOverlaps(plannedAssignments);
    if (assignmentOverlaps.length) {
      const overlapSummary = assignmentOverlaps
        .map((overlap) => `${overlap.leftAgentId}:${overlap.leftScope} <> ${overlap.rightAgentId}:${overlap.rightScope}`)
        .slice(0, 3)
        .join('; ');
      const message = `Multi-agent lane collision detected. ${overlapSummary}`;
      await updateCoordinationState(runDir, {
        status: 'blocked',
        activePhase: 'assignment_conflict'
      });
      await this.emitCoordinationUpdate(runDir);
      await this.runService.appendRuntimeEvent(runDir, {
        type: 'system',
        source: 'runtime',
        level: 'error',
        message
      });
      const error = new Error(`${message} Update scope targets or reduce worker count to remove overlap.`);
      error.statusCode = 400;
      throw error;
    }

    const managerWorktree = await this.gitService.ensureAgentWorktree({
      projectPath: state.projectPath,
      runDir,
      runId: path.basename(runDir),
      agentId: 'manager'
    });
    await writeAgentWorktree(runDir, 'manager', managerWorktree);
    await writeAgentAssignment(runDir, 'manager', {
      agentId: 'manager',
      title: 'Manager review and merge gate',
      objective: 'Review worker output, run tests, and accept or reject patches.',
      ownership: [],
      promptFile: agentPromptPath(runDir, 'manager')
    });
    await updateAgentStatus(runDir, 'manager', {
      status: 'planning',
      phase: 'planning',
      health: 'active',
      pid: null,
      blockingIssue: null
    });
    await this.emitAgentUpdate(runDir, 'manager');

    const commandPreview = {
      mode: 'multi-agent',
      manager: null,
      workers: []
    };

    for (const assignment of plannedAssignments) {
      const worktree = await this.gitService.ensureAgentWorktree({
        projectPath: state.projectPath,
        runDir,
        runId: path.basename(runDir),
        agentId: assignment.agentId
      });
      const prompt = buildWorkerPrompt({
        state,
        assignment,
        worktree,
        runDir
      });
      const promptFile = await writeAgentPrompt(runDir, assignment.agentId, prompt);
      const savedAssignment = await writeAgentAssignment(runDir, assignment.agentId, {
        ...assignment,
        promptFile
      });
      await writeAgentWorktree(runDir, assignment.agentId, worktree);
      await updateAgentStatus(runDir, assignment.agentId, {
        status: 'pending',
        phase: 'ready',
        health: 'idle',
        pid: null,
        heartbeatAt: null,
        blockingIssue: null,
        changedFiles: [],
        worktreePath: worktree.path
      });
      await this.emitAgentUpdate(runDir, assignment.agentId);
      commandPreview.workers.push(this.buildSubAgentLaunch({
        runDir,
        workspaceRoot,
        executionProfile,
        promptFile,
        cwd: worktree.path,
        lastMessageFile: path.join(agentRoot(runDir, assignment.agentId), 'last-message.txt')
      }));
      await writeAgentAssignment(runDir, assignment.agentId, savedAssignment);
    }

    await writeJson(commandPath(runDir), commandPreview);
    await this.runService.writeRuntimeStatus(runDir, {
      state: 'queued',
      pid: null,
      blockingIssue: null,
      activeAccountId,
      lastExitCode: null
    });
    const queuedEvent = await this.runService.appendRuntimeEvent(runDir, {
      type: 'system',
      source: 'runtime',
      level: 'info',
      message: `Multi-agent run queued with manager plus ${multiAgent.workerCount} workers.`
    });
    this.emit(runDir, queuedEvent);

    const info = {
      type: 'multi',
      stopReason: '',
      blockingIssue: null,
      finalizing: false,
      finalized: false,
      finalState: 'running',
      finalCoordinationStatus: 'running',
      finalMessage: '',
      finalLevel: 'info',
      agents: new Map(),
      reviewStarted: false,
      mergedFiles: new Set(),
      acceptedAgents: new Set((await readMergeReport(runDir))?.acceptedAgents || []),
      workerIds,
      projectPath: state.projectPath,
      repoRoot: preflight.repoRoot || state.projectPath,
      workspaceRoot,
      executionProfile,
      activeAccountId
    };

    for (const acceptedAgentId of info.acceptedAgents) {
      const acceptedStatus = await readAgentStatus(runDir, acceptedAgentId);
      for (const filePath of acceptedStatus?.changedFiles || []) {
        info.mergedFiles.add(filePath);
      }
    }

    this.active.set(runDir, info);
    const startingStatus = await this.runService.writeRuntimeStatus(runDir, {
      state: 'starting',
      pid: null,
      blockingIssue: null
    });
    this.emit(runDir, { type: 'runtime', payload: startingStatus });
    const runningStatus = await this.runService.writeRuntimeStatus(runDir, {
      state: 'running',
      pid: null
    });
    this.emit(runDir, { type: 'runtime', payload: runningStatus });
    await updateCoordinationState(runDir, {
      status: 'running',
      activePhase: 'worker_execution',
      preflight
    });
    await this.emitCoordinationUpdate(runDir);
    await this.writeAggregatedHeartbeat(runDir);

    for (const workerId of workerIds) {
      if (info.acceptedAgents.has(workerId)) continue;
      void this.runWorkerTask(runDir, info, workerId).catch(async (error) => {
        await this.freezeMultiAgentRun(runDir, info, {
          state: 'paused',
          coordinationStatus: 'blocked',
          message: error.message || `Worker ${workerId} failed.`,
          level: 'error'
        });
      });
    }

    const pendingStatuses = await Promise.all(workerIds.map((workerId) => readAgentStatus(runDir, workerId)));
    if (pendingStatuses.every((status) => status?.status === 'completed' || info.acceptedAgents.has(status?.agentId))) {
      void this.queueManagerReviewIfReady(runDir, info);
    }
  }

  async executeAgentProcess(runDir, runInfo, { agentId, launch, phase }) {
    await updateAgentStatus(runDir, agentId, {
      status: 'queued',
      phase,
      health: 'active',
      blockingIssue: null
    });
    await this.emitAgentUpdate(runDir, agentId);

    const child = this.spawnProcess(launch.command, launch.args, {
      cwd: process.cwd(),
      env: {
        ...process.env,
        ...launch.env
      },
      stdio: ['ignore', 'pipe', 'pipe']
    });

    let stdoutBuffer = '';
    let stderrBuffer = '';
    const agentRuntime = {
      agentId,
      child,
      role: agentId === 'manager' ? 'manager' : 'worker',
      blockingIssue: null,
      heartbeat: setInterval(async () => {
        await updateAgentStatus(runDir, agentId, {
          pid: child.pid,
          heartbeatAt: new Date().toISOString(),
          status: 'running',
          phase,
          health: 'active'
        });
        await this.emitAgentUpdate(runDir, agentId);
        await this.writeAggregatedHeartbeat(runDir);
      }, HEALTH_CHECK_INTERVAL_MS)
    };
    runInfo.agents.set(agentId, agentRuntime);

    await updateAgentStatus(runDir, agentId, {
      status: 'running',
      phase,
      pid: child.pid,
      health: 'active'
    });
    await this.emitAgentUpdate(runDir, agentId);
    await this.appendRunAndAgentEvent(runDir, agentId, {
      type: 'system',
      level: 'info',
      message: `${agentId === 'manager' ? 'Manager' : agentId} started with PID ${child.pid}.`
    });

    const handleChunk = async (source, chunk) => {
      const currentBuffer = source === 'stdout' ? stdoutBuffer : stderrBuffer;
      const { lines, remainder } = splitLines(currentBuffer, chunk.toString('utf8'));
      if (source === 'stdout') stdoutBuffer = remainder;
      else stderrBuffer = remainder;
      for (const line of lines) {
        const issue = detectBlockingIssue(line);
        if (issue) agentRuntime.blockingIssue = issue;
        const entry = {
          type: 'log',
          level: source === 'stderr' ? 'error' : 'info',
          message: line
        };
        await this.appendRunAndAgentEvent(runDir, agentId, entry);
      }
    };

    child.stdout.on('data', (chunk) => {
      void handleChunk('stdout', chunk);
    });
    child.stderr.on('data', (chunk) => {
      void handleChunk('stderr', chunk);
    });

    return await new Promise((resolve) => {
      child.on('close', async (code) => {
        clearInterval(agentRuntime.heartbeat);
        runInfo.agents.delete(agentId);
        await updateAgentStatus(runDir, agentId, {
          pid: null,
          heartbeatAt: new Date().toISOString()
        });
        await this.emitAgentUpdate(runDir, agentId);
        await this.writeAggregatedHeartbeat(runDir);
        if (runInfo.finalizing && runInfo.agents.size === 0) {
          await this.finalizeMultiAgentRun(runDir, runInfo);
        }
        resolve({
          code: code ?? 0,
          blockingIssue: agentRuntime.blockingIssue
        });
      });
    });
  }

  async runWorkerTask(runDir, runInfo, agentId, attempt = 0) {
    if (runInfo.finalizing) return;
    const assignment = await readAgentAssignment(runDir, agentId);
    const status = await readAgentStatus(runDir, agentId);
    if (!assignment || !status) return;
    if (status.status === 'completed' || runInfo.acceptedAgents.has(agentId)) {
      return;
    }
    if (!Array.isArray(assignment.ownership) || assignment.ownership.length === 0) {
      runInfo.acceptedAgents.add(agentId);
      await updateAgentStatus(runDir, agentId, {
        status: 'completed',
        phase: 'skipped_unassigned',
        health: 'complete',
        changedFiles: []
      });
      await this.emitAgentUpdate(runDir, agentId);
      await this.appendRunAndAgentEvent(runDir, agentId, {
        type: 'system',
        level: 'info',
        message: `${agentId} has no ownership lane and was marked complete without code changes.`
      });
      await this.queueManagerReviewIfReady(runDir, runInfo);
      return;
    }
    const launch = this.buildSubAgentLaunch({
      runDir,
      workspaceRoot: runInfo.workspaceRoot,
      executionProfile: runInfo.executionProfile,
      promptFile: assignment.promptFile,
      cwd: status.worktreePath,
      lastMessageFile: path.join(agentRoot(runDir, agentId), 'last-message.txt')
    });
    const result = await this.executeAgentProcess(runDir, runInfo, {
      agentId,
      launch,
      phase: attempt > 0 ? `retry-${attempt}` : 'implementation'
    });

    if (runInfo.finalizing) return;

    if (result.blockingIssue) {
      await updateAgentStatus(runDir, agentId, {
        status: 'waiting_auth',
        phase: 'waiting_auth',
        health: 'blocked',
        blockingIssue: result.blockingIssue
      });
      await this.emitAgentUpdate(runDir, agentId);
      await this.freezeMultiAgentRun(runDir, runInfo, {
        state: 'waiting_auth',
        coordinationStatus: 'waiting_auth',
        message: `Run paused for account recovery: ${result.blockingIssue.message}`,
        blockingIssue: result.blockingIssue,
        level: 'warning'
      });
      return;
    }

    if (result.code !== 0 && attempt < 1) {
      await updateAgentStatus(runDir, agentId, {
        status: 'queued',
        phase: 'retrying',
        health: 'active',
        retryCount: attempt + 1
      });
      await this.emitAgentUpdate(runDir, agentId);
      await this.appendRunAndAgentEvent(runDir, agentId, {
        type: 'system',
        level: 'warning',
        message: `${agentId} exited unexpectedly and will be retried once.`
      });
      return await this.runWorkerTask(runDir, runInfo, agentId, attempt + 1);
    }

    if (result.code !== 0) {
      await updateAgentStatus(runDir, agentId, {
        status: 'failed',
        phase: 'operator_attention',
        health: 'error',
        retryCount: attempt
      });
      await this.emitAgentUpdate(runDir, agentId);
      await this.freezeMultiAgentRun(runDir, runInfo, {
        state: 'paused',
        coordinationStatus: 'blocked',
        message: `${agentId} failed twice and the coordinated run is now operator-blocked.`,
        level: 'error'
      });
      return;
    }

    const changedFiles = await this.gitService.listChangedFiles(status.worktreePath);
    const ownershipViolations = collectOwnershipViolations(changedFiles, assignment.ownership);
    if (ownershipViolations.length) {
      await updateAgentStatus(runDir, agentId, {
        status: 'failed',
        phase: 'ownership_rejected',
        health: 'error',
        changedFiles
      });
      await this.emitAgentUpdate(runDir, agentId);
      await this.freezeMultiAgentRun(runDir, runInfo, {
        state: 'paused',
        coordinationStatus: 'blocked',
        message: `Manager rejected ${agentId} for out-of-scope changes: ${ownershipViolations.join(', ')}`,
        level: 'error'
      });
      return;
    }

    await updateAgentStatus(runDir, agentId, {
      status: 'completed',
      phase: 'awaiting_merge',
      health: 'complete',
      changedFiles
    });
    await this.emitAgentUpdate(runDir, agentId);
    await this.appendRunAndAgentEvent(runDir, agentId, {
      type: 'system',
      level: 'info',
      message: `${agentId} finished and is waiting for manager review.`
    });
    await this.queueManagerReviewIfReady(runDir, runInfo);
  }

  async queueManagerReviewIfReady(runDir, runInfo) {
    if (runInfo.reviewStarted || runInfo.finalizing) return;
    const workerStatuses = await Promise.all(runInfo.workerIds.map((agentId) => readAgentStatus(runDir, agentId)));
    const hasPendingWorker = workerStatuses.some((status) => status && status.status !== 'completed' && !runInfo.acceptedAgents.has(status.agentId));
    const activeWorkers = [...runInfo.agents.values()].some((entry) => entry.role === 'worker');
    if (hasPendingWorker || activeWorkers) return;
    runInfo.reviewStarted = true;
    void this.runManagerReviewAndMerge(runDir, runInfo).catch(async (error) => {
      await this.freezeMultiAgentRun(runDir, runInfo, {
        state: 'paused',
        coordinationStatus: 'blocked',
        message: error.message || 'Manager review failed.',
        level: 'error'
      });
    });
  }

  async runScopedTests(projectPath) {
    const command = await resolveTestCommand(projectPath);
    if (!command) {
      return {
        passed: true,
        command: 'no-op',
        output: 'No automatic test command was detected for this project.'
      };
    }
    const result = await this.commandRunner(command.command, command.args, {
      cwd: projectPath
    });
    return {
      passed: result.code === 0,
      command: command.label,
      output: [result.stdout, result.stderr].filter(Boolean).join('\n').trim()
    };
  }

  async runManagerReviewProcess(runDir, runInfo, { state, assignment, changedFiles, patchPath, testResult }) {
    const prompt = buildManagerReviewPrompt({
      state,
      assignment,
      changedFiles,
      patchPath,
      testResult
    });
    const promptFile = await writeAgentPrompt(runDir, 'manager', prompt);
    const managerStatus = await readAgentStatus(runDir, 'manager');
    const launch = this.buildSubAgentLaunch({
      runDir,
      workspaceRoot: runInfo.workspaceRoot,
      executionProfile: runInfo.executionProfile,
      promptFile,
      cwd: managerStatus?.worktreePath || runInfo.projectPath,
      lastMessageFile: path.join(agentRoot(runDir, 'manager'), 'last-message.txt')
    });
    const result = await this.executeAgentProcess(runDir, runInfo, {
      agentId: 'manager',
      launch,
      phase: 'reviewing'
    });
    if (result.blockingIssue) {
      await updateAgentStatus(runDir, 'manager', {
        status: 'waiting_auth',
        phase: 'waiting_auth',
        health: 'blocked',
        blockingIssue: result.blockingIssue
      });
      await this.emitAgentUpdate(runDir, 'manager');
      await this.freezeMultiAgentRun(runDir, runInfo, {
        state: 'waiting_auth',
        coordinationStatus: 'waiting_auth',
        message: `Run paused for account recovery: ${result.blockingIssue.message}`,
        blockingIssue: result.blockingIssue,
        level: 'warning'
      });
      return {
        accepted: false,
        output: result.blockingIssue.message
      };
    }
    const lastMessage = await fs.readFile(path.join(agentRoot(runDir, 'manager'), 'last-message.txt'), 'utf8').catch(() => '');
    if (result.code !== 0) {
      return {
        accepted: false,
        output: lastMessage || 'Manager review exited with a non-zero status.'
      };
    }
    return {
      accepted: parseManagerDecision(lastMessage),
      output: lastMessage
    };
  }

  async runManagerReviewAndMerge(runDir, runInfo) {
    if (runInfo.finalizing) return;
    const snapshot = await this.runService.getRunSnapshot(runDir);
    await updateCoordinationState(runDir, {
      status: 'reviewing',
      activePhase: 'merge_gate'
    });
    await this.emitCoordinationUpdate(runDir);
    await updateAgentStatus(runDir, 'manager', {
      status: 'reviewing',
      phase: 'merge_gate',
      health: 'active'
    });
    await this.emitAgentUpdate(runDir, 'manager');

    const existingReport = await readMergeReport(runDir);
    const nextReport = {
      ...existingReport,
      tests: Array.isArray(existingReport?.tests) ? [...existingReport.tests] : [],
      acceptedAgents: Array.isArray(existingReport?.acceptedAgents) ? [...existingReport.acceptedAgents] : [],
      rejectedAgents: Array.isArray(existingReport?.rejectedAgents) ? [...existingReport.rejectedAgents] : []
    };
    const markAccepted = (agentId) => {
      runInfo.acceptedAgents.add(agentId);
      if (!nextReport.acceptedAgents.includes(agentId)) {
        nextReport.acceptedAgents.push(agentId);
      }
    };

    for (const agentId of runInfo.workerIds) {
      if (runInfo.acceptedAgents.has(agentId)) continue;
      const assignment = await readAgentAssignment(runDir, agentId);
      const status = await readAgentStatus(runDir, agentId);
      if (!assignment || !status || status.status !== 'completed') continue;
      const changedFiles = Array.isArray(status.changedFiles) ? status.changedFiles : [];
      if (!changedFiles.length) {
        markAccepted(agentId);
        await updateAgentStatus(runDir, agentId, {
          phase: 'merged_no_changes',
          health: 'complete'
        });
        await this.emitAgentUpdate(runDir, agentId);
        await this.appendRunAndAgentEvent(runDir, 'manager', {
          type: 'system',
          level: 'info',
          message: `Manager accepted ${agentId} with no file changes.`
        });
        continue;
      }
      const ownershipViolations = collectOwnershipViolations(changedFiles, assignment.ownership);
      const conflictingFiles = changedFiles.filter((filePath) => runInfo.mergedFiles.has(filePath));
      const patchPath = path.join(agentRoot(runDir, agentId), 'candidate.patch');
      await this.gitService.writeWorktreePatch({
        worktreePath: status.worktreePath,
        outputPath: patchPath
      });

      let applied = false;
      if (!ownershipViolations.length && !conflictingFiles.length && changedFiles.length) {
        await this.gitService.applyPatch(runInfo.repoRoot, patchPath);
        applied = true;
      }

      const testResult = ownershipViolations.length || conflictingFiles.length
        ? {
          passed: false,
          command: 'skipped',
          output: 'Verification skipped because merge-gate validation failed before tests.'
        }
        : await this.runScopedTests(runInfo.projectPath);
      nextReport.tests.push({
        agentId,
        command: testResult.command,
        passed: testResult.passed,
        output: testResult.output
      });

      const managerReview = (!ownershipViolations.length && !conflictingFiles.length && testResult.passed)
        ? await this.runManagerReviewProcess(runDir, runInfo, {
          state: snapshot.state,
          assignment,
          changedFiles,
          patchPath,
          testResult
        })
        : { accepted: false, output: 'Manager review skipped because an earlier merge gate failed.' };

      const decision = buildMergeGateDecision({
        ownershipViolations,
        conflictingFiles,
        testsPassed: testResult.passed,
        managerAccepted: managerReview.accepted
      });

      if (decision.accepted) {
        markAccepted(agentId);
        for (const filePath of changedFiles) {
          runInfo.mergedFiles.add(filePath);
        }
        await updateAgentStatus(runDir, agentId, {
          phase: 'merged',
          health: 'complete'
        });
        await this.emitAgentUpdate(runDir, agentId);
        await this.appendRunAndAgentEvent(runDir, 'manager', {
          type: 'system',
          level: 'info',
          message: `Manager accepted ${agentId} after tests: ${testResult.command}.`
        });
        continue;
      }

      if (applied) {
        await this.gitService.reversePatch(runInfo.repoRoot, patchPath);
      }
      if (!nextReport.rejectedAgents.some((entry) => entry.agentId === agentId)) {
        nextReport.rejectedAgents.push({
          agentId,
          reason: decision.reasons.join(', ') || managerReview.output || 'manager_rejected'
        });
      }
      await writeMergeReport(runDir, {
        ...nextReport,
        status: 'rejected',
        summary: managerReview.output || `Manager rejected ${agentId}.`
      });
      await updateAgentStatus(runDir, agentId, {
        status: 'failed',
        phase: 'manager_rejected',
        health: 'error'
      });
      await this.emitAgentUpdate(runDir, agentId);
      await this.freezeMultiAgentRun(runDir, runInfo, {
        state: 'paused',
        coordinationStatus: 'blocked',
        message: managerReview.output || `Manager rejected ${agentId}.`,
        level: 'error'
      });
      return;
    }

    await writeMergeReport(runDir, {
      ...nextReport,
      status: 'accepted',
      summary: `Manager accepted ${runInfo.acceptedAgents.size} worker lanes after merge-gate checks.`
    });
    await updateAgentStatus(runDir, 'manager', {
      status: 'completed',
      phase: 'complete',
      health: 'complete'
    });
    await this.emitAgentUpdate(runDir, 'manager');
    await updateCoordinationState(runDir, {
      status: 'completed',
      activePhase: 'complete'
    });
    await this.emitCoordinationUpdate(runDir);
    runInfo.finalizing = true;
    runInfo.finalState = 'completed';
    runInfo.finalCoordinationStatus = 'completed';
    runInfo.finalMessage = 'Multi-agent run completed after manager review and merge gating.';
    runInfo.finalLevel = 'info';
    await this.finalizeMultiAgentRun(runDir, runInfo);
  }

  async freezeMultiAgentRun(runDir, runInfo, {
    state,
    coordinationStatus,
    message,
    blockingIssue = null,
    level = 'warning'
  }) {
    if (runInfo.finalized) return;
    runInfo.finalizing = true;
    runInfo.stopReason = state === 'waiting_auth' ? 'waiting_auth' : 'pause';
    runInfo.blockingIssue = blockingIssue;
    runInfo.finalState = state;
    runInfo.finalCoordinationStatus = coordinationStatus;
    runInfo.finalMessage = message;
    runInfo.finalLevel = level;
    const status = await this.runService.writeRuntimeStatus(runDir, {
      state: 'stopping',
      pid: null,
      blockingIssue
    });
    this.emit(runDir, { type: 'runtime', payload: status });
    await updateCoordinationState(runDir, {
      status: coordinationStatus,
      activePhase: state === 'waiting_auth' ? 'waiting_auth' : 'operator_attention'
    });
    await this.emitCoordinationUpdate(runDir);
    for (const [agentId, agentRuntime] of runInfo.agents.entries()) {
      await updateAgentStatus(runDir, agentId, {
        status: state === 'waiting_auth' ? 'waiting_auth' : 'paused',
        phase: state === 'waiting_auth' ? 'waiting_auth' : 'operator_attention',
        health: state === 'waiting_auth' ? 'blocked' : 'error',
        blockingIssue
      });
      await this.emitAgentUpdate(runDir, agentId);
      agentRuntime.child.kill('SIGTERM');
    }
    if (!runInfo.agents.size) {
      await this.finalizeMultiAgentRun(runDir, runInfo);
    }
  }

  async finalizeMultiAgentRun(runDir, runInfo) {
    if (runInfo.finalized) return;
    runInfo.finalized = true;
    this.active.delete(runDir);
    const status = await this.runService.writeRuntimeStatus(runDir, {
      state: runInfo.finalState,
      pid: null,
      lastExitCode: runInfo.finalState === 'completed' ? 0 : 1,
      blockingIssue: runInfo.blockingIssue || null
    });
    this.emit(runDir, { type: 'runtime', payload: status });
    await updateCoordinationState(runDir, {
      status: runInfo.finalCoordinationStatus,
      activePhase: runInfo.finalState === 'completed' ? 'complete' : 'operator_attention'
    });
    await this.emitCoordinationUpdate(runDir);
    const entry = await this.runService.appendRuntimeEvent(runDir, {
      type: 'system',
      source: 'runtime',
      level: runInfo.finalLevel,
      message: runInfo.finalMessage
    });
    this.emit(runDir, entry);
  }

  async pauseRun(runDir) {
    const resolvedRunDir = path.resolve(runDir);
    const info = this.active.get(resolvedRunDir);
    if (!info) throw new Error('Run is not active.');
    if (info.type === 'single') {
      info.stopReason = 'pause';
      const status = await this.runService.writeRuntimeStatus(resolvedRunDir, { state: 'stopping' });
      this.emit(resolvedRunDir, { type: 'runtime', payload: status });
      info.child.kill('SIGTERM');
      return;
    }
    await this.freezeMultiAgentRun(resolvedRunDir, info, {
      state: 'paused',
      coordinationStatus: 'paused',
      message: 'Run paused by user.',
      level: 'info'
    });
  }

  async stopRun(runDir) {
    const resolvedRunDir = path.resolve(runDir);
    const info = this.active.get(resolvedRunDir);
    if (!info) throw new Error('Run is not active.');
    if (info.type === 'single') {
      info.stopReason = 'stop';
      const status = await this.runService.writeRuntimeStatus(resolvedRunDir, { state: 'stopping' });
      this.emit(resolvedRunDir, { type: 'runtime', payload: status });
      info.child.kill('SIGTERM');
      return;
    }
    info.finalizing = true;
    info.finalState = 'stopped';
    info.finalCoordinationStatus = 'paused';
    info.finalMessage = 'Run stopped by user.';
    info.finalLevel = 'info';
    const status = await this.runService.writeRuntimeStatus(resolvedRunDir, { state: 'stopping' });
    this.emit(resolvedRunDir, { type: 'runtime', payload: status });
    for (const [agentId, agentRuntime] of info.agents.entries()) {
      await updateAgentStatus(resolvedRunDir, agentId, {
        status: 'paused',
        phase: 'stopped',
        health: 'error'
      });
      await this.emitAgentUpdate(resolvedRunDir, agentId);
      agentRuntime.child.kill('SIGTERM');
    }
    if (!info.agents.size) {
      await this.finalizeMultiAgentRun(resolvedRunDir, info);
    }
  }

  async resumeRun(runDir, options) {
    const resolvedRunDir = path.resolve(runDir);
    const runtime = await this.runService.readRuntimeStatus(resolvedRunDir);
    if (!['paused', 'waiting_auth', 'stopped', 'failed', 'draft'].includes(runtime.state)) {
      throw new Error('Only paused, waiting_auth, stopped, failed, or draft runs can be resumed.');
    }
    await this.runService.appendRuntimeEvent(resolvedRunDir, {
      type: 'system',
      source: 'runtime',
      level: 'info',
      message: runtime.state === 'waiting_auth'
        ? 'Run resumed after account recovery.'
        : 'Run resumed.'
    });
    return await this.startRun(resolvedRunDir, options);
  }
}
