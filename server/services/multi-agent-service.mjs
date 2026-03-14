import fs from 'node:fs/promises';
import path from 'node:path';
import { MAX_EVENTS } from '../config.mjs';
import {
  appendJsonLine,
  ensureDir,
  exists,
  readJson,
  readJsonLines,
  writeJson
} from '../utils/fs.mjs';
import { randomId, slugify } from '../utils/id.mjs';

export const DEFAULT_MULTI_AGENT_CONFIG = Object.freeze({
  enabled: false,
  workerCount: 3,
  writeMode: 'scoped',
  isolation: 'worktree',
  mergeGate: 'manager_tests'
});

const IGNORED_ROOT_ENTRIES = new Set([
  '.git',
  'node_modules',
  'dist',
  'coverage',
  '.next',
  '.turbo',
  '.cache',
  'agent-workspaces'
]);

const PREFERRED_SCOPE_ORDER = ['server', 'src', 'app', 'tests', 'bin', 'docs'];

export function normalizeMultiAgentConfig(input = {}) {
  const enabled = input?.enabled === true || input?.useExperimentalMultiAgent === true;
  return {
    enabled,
    workerCount: Number(input?.workerCount) === 2 ? 2 : 3,
    writeMode: 'scoped',
    isolation: 'worktree',
    mergeGate: 'manager_tests'
  };
}

export function runtimeRoot(runDir) {
  return path.join(path.resolve(runDir), 'runtime');
}

export function coordinationPath(runDir) {
  return path.join(runtimeRoot(runDir), 'coordination.json');
}

export function agentsRoot(runDir) {
  return path.join(runtimeRoot(runDir), 'agents');
}

export function agentsIndexPath(runDir) {
  return path.join(agentsRoot(runDir), 'index.json');
}

export function agentRoot(runDir, agentId) {
  return path.join(agentsRoot(runDir), agentId);
}

export function agentStatusPath(runDir, agentId) {
  return path.join(agentRoot(runDir, agentId), 'status.json');
}

export function agentEventsPath(runDir, agentId) {
  return path.join(agentRoot(runDir, agentId), 'events.jsonl');
}

export function agentAssignmentPath(runDir, agentId) {
  return path.join(agentRoot(runDir, agentId), 'assignment.json');
}

export function agentPromptPath(runDir, agentId) {
  return path.join(agentRoot(runDir, agentId), 'prompt.md');
}

export function agentWorktreePath(runDir, agentId) {
  return path.join(agentRoot(runDir, agentId), 'worktree.json');
}

export function mergeReportPath(runDir) {
  return path.join(runtimeRoot(runDir), 'merge-report.json');
}

export function worktreesRoot(runDir) {
  return path.join(path.resolve(runDir), 'worktrees');
}

export function buildWorktreePath(runDir, agentId) {
  return path.join(worktreesRoot(runDir), agentId);
}

export function buildWorktreeBranchName(runId, agentId) {
  return slugify(`codex-${runId}-${agentId}`);
}

function compareScopePriority(left, right) {
  const leftIndex = PREFERRED_SCOPE_ORDER.indexOf(left);
  const rightIndex = PREFERRED_SCOPE_ORDER.indexOf(right);
  if (leftIndex !== -1 || rightIndex !== -1) {
    if (leftIndex === -1) return 1;
    if (rightIndex === -1) return -1;
    return leftIndex - rightIndex;
  }
  return left.localeCompare(right);
}

function normalizeRelativePath(value = '') {
  return String(value || '').replace(/\\/g, '/').replace(/^\.\/+/, '').replace(/\/+$/, '') || '.';
}

function toProjectRelative(projectPath, target) {
  const resolvedProjectPath = path.resolve(projectPath);
  const absoluteTarget = path.isAbsolute(target)
    ? path.resolve(target)
    : path.resolve(resolvedProjectPath, target);
  const relative = normalizeRelativePath(path.relative(resolvedProjectPath, absoluteTarget));
  return relative.startsWith('..') ? '' : relative;
}

async function listChildScopes(projectPath, scope) {
  const relativeScope = normalizeRelativePath(scope);
  const absoluteScope = relativeScope === '.'
    ? path.resolve(projectPath)
    : path.resolve(projectPath, relativeScope);
  const stat = await fs.stat(absoluteScope).catch(() => null);
  if (!stat?.isDirectory()) return [];
  const entries = await fs.readdir(absoluteScope, { withFileTypes: true }).catch(() => []);
  return entries
    .filter((entry) => !entry.name.startsWith('.'))
    .filter((entry) => !IGNORED_ROOT_ENTRIES.has(entry.name))
    .filter((entry) => entry.isDirectory() || entry.isFile())
    .map((entry) => normalizeRelativePath(path.join(relativeScope === '.' ? '' : relativeScope, entry.name)))
    .sort(compareScopePriority);
}

export async function discoverOwnershipCandidates(projectPath) {
  const entries = await fs.readdir(path.resolve(projectPath), { withFileTypes: true }).catch(() => []);
  const candidates = entries
    .filter((entry) => !entry.name.startsWith('.'))
    .filter((entry) => !IGNORED_ROOT_ENTRIES.has(entry.name))
    .filter((entry) => entry.isDirectory() || entry.isFile())
    .map((entry) => normalizeRelativePath(entry.name))
    .sort(compareScopePriority);
  return candidates.length ? candidates : ['.'];
}

function unique(items = []) {
  return [...new Set(items.filter(Boolean).map((item) => normalizeRelativePath(item)))];
}

function scopesOverlap(leftScope = '', rightScope = '') {
  const left = normalizeRelativePath(leftScope);
  const right = normalizeRelativePath(rightScope);
  if (left === '.' || right === '.') return true;
  return left === right
    || left.startsWith(`${right}/`)
    || right.startsWith(`${left}/`);
}

function collapseOverlappingScopes(scopes = []) {
  const ordered = unique(scopes).sort((left, right) => {
    const leftDepth = left === '.' ? -1 : left.split('/').length;
    const rightDepth = right === '.' ? -1 : right.split('/').length;
    if (leftDepth !== rightDepth) return leftDepth - rightDepth;
    return compareScopePriority(left, right);
  });
  const selected = [];
  for (const scope of ordered) {
    if (selected.some((existing) => scopesOverlap(existing, scope))) continue;
    selected.push(scope);
  }
  return selected;
}

function laneTitle(index, ownership) {
  if (!ownership.length) return `Worker lane ${index + 1}: unassigned`;
  const primary = ownership[0] === '.'
    ? 'repository root'
    : ownership[0].split('/').slice(-1)[0];
  return `Worker lane ${index + 1}: ${primary}`;
}

export async function planAssignments({
  projectPath,
  request,
  scope = '',
  scopeTargets = [],
  workerCount = 3
}) {
  let candidates = collapseOverlappingScopes(scopeTargets.map((target) => toProjectRelative(projectPath, target)));
  if (!candidates.length && scope) {
    const scoped = toProjectRelative(projectPath, scope);
    if (scoped) candidates = [scoped];
  }
  if (!candidates.length) {
    candidates = await discoverOwnershipCandidates(projectPath);
  }

  while (candidates.length < workerCount) {
    const expandable = [...candidates]
      .sort((left, right) => left.split('/').length - right.split('/').length)
      .find((candidate) => candidate !== '.');
    if (!expandable) break;
    const expandedChildren = await listChildScopes(projectPath, expandable);
    if (expandedChildren.length <= 1) break;
    candidates = collapseOverlappingScopes(candidates.flatMap((candidate) => (
      candidate === expandable ? expandedChildren : [candidate]
    )));
  }

  const groups = Array.from({ length: workerCount }, () => []);
  candidates.forEach((candidate, index) => {
    groups[index % workerCount].push(candidate);
  });

  return groups.map((ownership, index) => {
    const normalizedOwnership = collapseOverlappingScopes(ownership);
    return {
      agentId: `worker-${index + 1}`,
      title: laneTitle(index, normalizedOwnership),
      objective: normalizedOwnership.length
        ? `Implement the assigned slice of the coordinated request without touching files outside ${normalizedOwnership.join(', ')}. Original request: ${String(request || '').trim()}`
        : 'No ownership lane was assigned. Stay read-only and report lane-assignment gaps instead of editing files.',
      ownership: normalizedOwnership,
      promptFile: ''
    };
  });
}

export function collectAssignmentOwnershipOverlaps(assignments = []) {
  const overlaps = [];
  for (let leftIndex = 0; leftIndex < assignments.length; leftIndex += 1) {
    const left = assignments[leftIndex];
    const leftScopes = Array.isArray(left?.ownership) ? left.ownership.map((item) => normalizeRelativePath(item)) : [];
    if (!leftScopes.length) continue;
    for (let rightIndex = leftIndex + 1; rightIndex < assignments.length; rightIndex += 1) {
      const right = assignments[rightIndex];
      const rightScopes = Array.isArray(right?.ownership) ? right.ownership.map((item) => normalizeRelativePath(item)) : [];
      if (!rightScopes.length) continue;
      let collision = null;
      for (const leftScope of leftScopes) {
        for (const rightScope of rightScopes) {
          if (!scopesOverlap(leftScope, rightScope)) continue;
          collision = { leftScope, rightScope };
          break;
        }
        if (collision) break;
      }
      if (!collision) continue;
      overlaps.push({
        leftAgentId: String(left?.agentId || ''),
        rightAgentId: String(right?.agentId || ''),
        leftScope: collision.leftScope,
        rightScope: collision.rightScope
      });
    }
  }
  return overlaps;
}

export function isPathOwnedByAssignment(filePath, ownership = []) {
  const normalizedPath = normalizeRelativePath(filePath);
  return ownership.some((scope) => {
    const normalizedScope = normalizeRelativePath(scope);
    return normalizedScope === '.'
      || normalizedPath === normalizedScope
      || normalizedPath.startsWith(`${normalizedScope}/`);
  });
}

export function collectOwnershipViolations(changedFiles = [], ownership = []) {
  return changedFiles.filter((filePath) => !isPathOwnedByAssignment(filePath, ownership));
}

export function buildMergeGateDecision({
  ownershipViolations = [],
  conflictingFiles = [],
  testsPassed = false,
  managerAccepted = false
} = {}) {
  const reasons = [];
  if (ownershipViolations.length) reasons.push('ownership_violation');
  if (conflictingFiles.length) reasons.push('conflict_detected');
  if (!testsPassed) reasons.push('tests_failed');
  if (!managerAccepted) reasons.push('manager_rejected');
  return {
    accepted: reasons.length === 0,
    reasons
  };
}

function buildCoordinationState(config, managerId, workerIds) {
  return {
    enabled: true,
    status: 'idle',
    managerId,
    workerIds,
    activePhase: 'ready',
    mergeGate: config.mergeGate,
    startedAt: null,
    updatedAt: new Date().toISOString(),
    preflight: null
  };
}

function buildManagerStatus(runDir) {
  return {
    agentId: 'manager',
    role: 'manager',
    status: 'pending',
    phase: 'ready',
    health: 'idle',
    pid: null,
    retryCount: 0,
    heartbeatAt: null,
    lastUpdatedAt: new Date().toISOString(),
    blockingIssue: null,
    changedFiles: [],
    worktreePath: buildWorktreePath(runDir, 'manager')
  };
}

function buildWorkerStatus(runDir, agentId) {
  return {
    agentId,
    role: 'worker',
    status: 'pending',
    phase: 'ready',
    health: 'idle',
    pid: null,
    retryCount: 0,
    heartbeatAt: null,
    lastUpdatedAt: new Date().toISOString(),
    blockingIssue: null,
    changedFiles: [],
    worktreePath: buildWorktreePath(runDir, agentId)
  };
}

function buildMergeReport() {
  return {
    status: 'pending',
    reviewedBy: 'manager',
    summary: 'No worker output has been reviewed yet.',
    acceptedAgents: [],
    rejectedAgents: [],
    tests: [],
    generatedAt: new Date().toISOString()
  };
}

function summarizeAgent(status = {}, assignment = null) {
  return {
    agentId: status.agentId || assignment?.agentId || '',
    role: status.role || 'worker',
    label: status.role === 'manager' ? 'Manager' : `Worker ${String(status.agentId || '').replace('worker-', '') || ''}`.trim(),
    status: status.status || 'pending',
    phase: status.phase || 'ready',
    health: status.health || 'idle',
    ownership: Array.isArray(assignment?.ownership) ? assignment.ownership : [],
    heartbeatAt: status.heartbeatAt || null,
    blockingIssue: status.blockingIssue || null,
    retryCount: Number(status.retryCount || 0),
    worktreePath: status.worktreePath || ''
  };
}

export async function persistRunMultiAgentState(runDir, config) {
  const statePath = path.join(path.resolve(runDir), 'state.json');
  const currentState = await readJson(statePath, null);
  if (!currentState) return null;
  const nextState = {
    ...currentState,
    multiAgent: normalizeMultiAgentConfig(config)
  };
  await writeJson(statePath, nextState);
  return nextState;
}

export async function ensureMultiAgentArtifacts(runDir, config = DEFAULT_MULTI_AGENT_CONFIG) {
  const normalizedConfig = normalizeMultiAgentConfig(config);
  if (!normalizedConfig.enabled) return null;
  const workerIds = Array.from({ length: normalizedConfig.workerCount }, (_item, index) => `worker-${index + 1}`);
  const agentIds = ['manager', ...workerIds];
  await ensureDir(agentsRoot(runDir));
  await ensureDir(worktreesRoot(runDir));

  if (!(await exists(coordinationPath(runDir)))) {
    await writeJson(coordinationPath(runDir), buildCoordinationState(normalizedConfig, 'manager', workerIds));
  }

  if (!(await exists(agentsIndexPath(runDir)))) {
    await writeJson(agentsIndexPath(runDir), {
      managerId: 'manager',
      agents: agentIds.map((agentId) => ({
        agentId,
        role: agentId === 'manager' ? 'manager' : 'worker'
      }))
    });
  }

  if (!(await exists(mergeReportPath(runDir)))) {
    await writeJson(mergeReportPath(runDir), buildMergeReport());
  }

  for (const agentId of agentIds) {
    const statusPath = agentStatusPath(runDir, agentId);
    const assignmentPath = agentAssignmentPath(runDir, agentId);
    const promptPath = agentPromptPath(runDir, agentId);
    const worktreeMetaPath = agentWorktreePath(runDir, agentId);

    if (!(await exists(statusPath))) {
      await writeJson(
        statusPath,
        agentId === 'manager' ? buildManagerStatus(runDir) : buildWorkerStatus(runDir, agentId)
      );
    }
    if (!(await exists(assignmentPath))) {
      await writeJson(assignmentPath, {
        agentId,
        title: agentId === 'manager' ? 'Manager review and merge gate' : `Worker lane ${agentId.replace('worker-', '')}`,
        objective: agentId === 'manager'
          ? 'Review worker output, enforce scope ownership, run tests, and accept or reject changes.'
          : 'Await manager planning before writing code.',
        ownership: [],
        promptFile: promptPath
      });
    }
    if (!(await exists(promptPath))) {
      await fs.writeFile(promptPath, '', 'utf8');
    }
    if (!(await exists(worktreeMetaPath))) {
      await writeJson(worktreeMetaPath, {
        path: buildWorktreePath(runDir, agentId),
        branchName: '',
        baseRef: '',
        repoRoot: ''
      });
    }
  }

  return {
    coordination: await readCoordinationState(runDir),
    subAgents: await readSubAgentSummaries(runDir)
  };
}

export async function readCoordinationState(runDir) {
  return await readJson(coordinationPath(runDir), null);
}

export async function writeCoordinationState(runDir, nextState) {
  const value = {
    ...nextState,
    updatedAt: new Date().toISOString()
  };
  await writeJson(coordinationPath(runDir), value);
  return value;
}

export async function updateCoordinationState(runDir, patch = {}) {
  const current = await readCoordinationState(runDir);
  return await writeCoordinationState(runDir, {
    ...(current || buildCoordinationState(DEFAULT_MULTI_AGENT_CONFIG, 'manager', [])),
    ...patch
  });
}

export async function readAgentIndex(runDir) {
  return await readJson(agentsIndexPath(runDir), { managerId: 'manager', agents: [] });
}

export async function readAgentStatus(runDir, agentId) {
  return await readJson(agentStatusPath(runDir, agentId), null);
}

export async function writeAgentStatus(runDir, agentId, nextState) {
  const value = {
    ...nextState,
    lastUpdatedAt: new Date().toISOString()
  };
  await writeJson(agentStatusPath(runDir, agentId), value);
  return value;
}

export async function updateAgentStatus(runDir, agentId, patch = {}) {
  const current = await readAgentStatus(runDir, agentId);
  return await writeAgentStatus(runDir, agentId, {
    ...(current || buildWorkerStatus(runDir, agentId)),
    ...patch
  });
}

export async function appendAgentEvent(runDir, agentId, event) {
  const entry = {
    id: randomId('agent-event'),
    createdAt: new Date().toISOString(),
    ...event
  };
  await appendJsonLine(agentEventsPath(runDir, agentId), entry);
  return entry;
}

export async function readAgentEvents(runDir, agentId, limit = MAX_EVENTS) {
  return await readJsonLines(agentEventsPath(runDir, agentId), limit);
}

export async function readAgentAssignment(runDir, agentId) {
  return await readJson(agentAssignmentPath(runDir, agentId), null);
}

export async function writeAgentAssignment(runDir, agentId, assignment) {
  const value = {
    ...assignment,
    agentId,
    promptFile: assignment?.promptFile || agentPromptPath(runDir, agentId)
  };
  await writeJson(agentAssignmentPath(runDir, agentId), value);
  return value;
}

export async function writeAgentPrompt(runDir, agentId, prompt) {
  await ensureDir(agentRoot(runDir, agentId));
  await fs.writeFile(agentPromptPath(runDir, agentId), String(prompt || ''), 'utf8');
  return agentPromptPath(runDir, agentId);
}

export async function readAgentWorktree(runDir, agentId) {
  return await readJson(agentWorktreePath(runDir, agentId), null);
}

export async function writeAgentWorktree(runDir, agentId, worktree) {
  await writeJson(agentWorktreePath(runDir, agentId), worktree);
  return worktree;
}

export async function readMergeReport(runDir) {
  return await readJson(mergeReportPath(runDir), null);
}

export async function writeMergeReport(runDir, report) {
  const value = {
    ...buildMergeReport(),
    ...report,
    generatedAt: new Date().toISOString()
  };
  await writeJson(mergeReportPath(runDir), value);
  return value;
}

export async function readSubAgentSummaries(runDir) {
  const index = await readAgentIndex(runDir);
  const summaries = [];
  for (const agent of index.agents || []) {
    const status = await readAgentStatus(runDir, agent.agentId);
    const assignment = await readAgentAssignment(runDir, agent.agentId);
    if (!status) continue;
    summaries.push(summarizeAgent(status, assignment));
  }
  return summaries;
}

export async function readSubAgentDetail(runDir, agentId) {
  const status = await readAgentStatus(runDir, agentId);
  if (!status) return null;
  const assignment = await readAgentAssignment(runDir, agentId);
  return {
    summary: summarizeAgent(status, assignment),
    assignment,
    runtime: status,
    events: await readAgentEvents(runDir, agentId),
    worktree: await readAgentWorktree(runDir, agentId)
  };
}
