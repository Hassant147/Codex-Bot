import fs from 'node:fs/promises';
import path from 'node:path';
import {
  EVENTS_FILE_NAME,
  MAX_EVENTS,
  RUNTIME_STATUS_FILE
} from '../config.mjs';
import { appendJsonLine, ensureDir, exists, readJson, readJsonLines, writeJson } from '../utils/fs.mjs';
import {
  ensureMultiAgentArtifacts,
  normalizeMultiAgentConfig,
  readCoordinationState,
  readMergeReport,
  readSubAgentDetail,
  readSubAgentSummaries
} from './multi-agent-service.mjs';
import { randomId } from '../utils/id.mjs';

export const RUN_STATES = ['draft', 'queued', 'starting', 'running', 'paused', 'waiting_auth', 'stopping', 'stopped', 'failed', 'completed'];

function runsRoot(workspaceRoot) {
  return path.join(path.resolve(workspaceRoot), 'docs', 'project-bot', 'runs');
}

function runtimeRoot(runDir) {
  return path.join(path.resolve(runDir), 'runtime');
}

function runtimeStatusPath(runDir) {
  return path.join(runtimeRoot(runDir), RUNTIME_STATUS_FILE);
}

function runtimeEventsPath(runDir) {
  return path.join(runtimeRoot(runDir), EVENTS_FILE_NAME);
}

export function summarizeState(state = {}) {
  const phases = Array.isArray(state.phases) ? state.phases : [];
  const completed = phases.filter((phase) => phase.status === 'completed').length;
  const total = phases.length;
  const nextPhase = phases.find((phase) => phase.status !== 'completed') || null;
  return {
    total,
    completed,
    nextPhase: nextPhase ? { id: nextPhase.id, title: nextPhase.title } : null,
    done: Boolean(total > 0 && completed === total)
  };
}

export class RunService {
  constructor({ workspaceService }) {
    this.workspaceService = workspaceService;
  }

  async ensureRuntime(runDir) {
    await ensureDir(runtimeRoot(runDir));
    if (!(await exists(runtimeStatusPath(runDir)))) {
      const state = await readJson(path.join(path.resolve(runDir), 'state.json'), null);
      const inferredState = state && summarizeState(state).done ? 'completed' : 'draft';
      const status = this.createRuntimeStatus(runDir, { state: inferredState });
      await writeJson(runtimeStatusPath(runDir), status);
    }
  }

  createRuntimeStatus(runDir, patch = {}) {
    return {
      id: randomId('runtime'),
      runDir: path.resolve(runDir),
      state: 'draft',
      blockingIssue: null,
      pid: null,
      lastExitCode: null,
      lastUpdatedAt: new Date().toISOString(),
      heartbeatAt: null,
      ...patch
    };
  }

  async readRuntimeStatus(runDir) {
    await this.ensureRuntime(runDir);
    return await readJson(runtimeStatusPath(runDir), this.createRuntimeStatus(runDir));
  }

  async writeRuntimeStatus(runDir, patch = {}) {
    const current = await this.readRuntimeStatus(runDir);
    const next = {
      ...current,
      ...patch,
      lastUpdatedAt: new Date().toISOString()
    };
    await writeJson(runtimeStatusPath(runDir), next);
    return next;
  }

  async appendRuntimeEvent(runDir, event) {
    const entry = {
      id: randomId('event'),
      createdAt: new Date().toISOString(),
      ...event
    };
    await appendJsonLine(runtimeEventsPath(runDir), entry);
    return entry;
  }

  async readRuntimeEvents(runDir, limit = MAX_EVENTS) {
    return await readJsonLines(runtimeEventsPath(runDir), limit);
  }

  async getRunSnapshot(runDir) {
    const resolvedRunDir = path.resolve(runDir);
    const state = await readJson(path.join(resolvedRunDir, 'state.json'), null);
    if (!state) throw new Error('Run not found.');
    const multiAgent = normalizeMultiAgentConfig(state.multiAgent || {});
    if (multiAgent.enabled) {
      await ensureMultiAgentArtifacts(resolvedRunDir, multiAgent);
    }
    await this.ensureRuntime(resolvedRunDir);
    const summaryMeta = summarizeState(state);
    let runtime = await this.readRuntimeStatus(resolvedRunDir);
    if (summaryMeta.done && runtime.state === 'draft' && !runtime.pid) {
      runtime = await this.writeRuntimeStatus(resolvedRunDir, { state: 'completed' });
    }
    const events = await this.readRuntimeEvents(resolvedRunDir);
    const summary = await fs.readFile(path.join(resolvedRunDir, 'RUN_SUMMARY.md'), 'utf8').catch(() => '');
    const nextPrompt = await fs.readFile(path.join(resolvedRunDir, 'NEXT_PROMPT.md'), 'utf8').catch(() => '');
    const coordination = multiAgent.enabled ? await readCoordinationState(resolvedRunDir) : null;
    return {
      runId: path.basename(resolvedRunDir),
      runDir: resolvedRunDir,
      state: {
        ...state,
        multiAgent
      },
      summary: summaryMeta,
      runtime,
      events,
      runSummary: summary,
      nextPrompt,
      coordination,
      subAgents: multiAgent.enabled ? await readSubAgentSummaries(resolvedRunDir) : [],
      mergeReport: multiAgent.enabled ? await readMergeReport(resolvedRunDir) : null,
      preflight: coordination?.preflight || null
    };
  }

  async listRuns(workspaceRoot, limit = 40) {
    const root = runsRoot(workspaceRoot);
    if (!(await exists(root))) return [];
    const entries = await fs.readdir(root, { withFileTypes: true });
    const runDirs = entries.filter((entry) => entry.isDirectory()).map((entry) => path.join(root, entry.name));
    const snapshots = [];
    for (const runDir of runDirs) {
      try {
        const snapshot = await this.getRunSnapshot(runDir);
        const stateStat = await fs.stat(path.join(runDir, 'state.json'));
        snapshots.push({
          ...snapshot,
          updatedAt: stateStat.mtime.toISOString()
        });
      } catch {
        // Ignore broken runs.
      }
    }
    return snapshots
      .sort((left, right) => Date.parse(right.updatedAt || 0) - Date.parse(left.updatedAt || 0))
      .slice(0, limit);
  }

  async createDraftRuntime(runDir) {
    await this.ensureRuntime(runDir);
    await this.writeRuntimeStatus(runDir, { state: 'draft', blockingIssue: null, pid: null, lastExitCode: null });
    await this.appendRuntimeEvent(runDir, {
      type: 'system',
      source: 'runtime',
      level: 'info',
      message: 'Run created and ready to start.'
    });
  }

  async markRecoveredRun(runDir, state) {
    const runtime = await this.readRuntimeStatus(runDir);
    if (['starting', 'queued', 'running', 'stopping'].includes(runtime.state)) {
      await this.writeRuntimeStatus(runDir, { state, pid: null });
      await this.appendRuntimeEvent(runDir, {
        type: 'system',
        source: 'runtime',
        level: 'warning',
        message: `Runtime recovered after server restart. Marked as ${state}.`
      });
    }
  }

  async initializeRunConfiguration(runDir, { multiAgent } = {}) {
    const resolvedRunDir = path.resolve(runDir);
    const statePath = path.join(resolvedRunDir, 'state.json');
    const currentState = await readJson(statePath, null);
    if (!currentState) throw new Error('Run state file not found.');
    const normalizedMultiAgent = normalizeMultiAgentConfig(multiAgent || currentState.multiAgent || {});
    await writeJson(statePath, {
      ...currentState,
      multiAgent: normalizedMultiAgent
    });
    if (normalizedMultiAgent.enabled) {
      await ensureMultiAgentArtifacts(resolvedRunDir, normalizedMultiAgent);
    }
    return await this.getRunSnapshot(resolvedRunDir);
  }

  async getRunAgents(runDir) {
    return await readSubAgentSummaries(path.resolve(runDir));
  }

  async getRunAgentDetail(runDir, agentId) {
    return await readSubAgentDetail(path.resolve(runDir), agentId);
  }
}
