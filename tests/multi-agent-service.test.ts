import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import {
  buildMergeGateDecision,
  buildWorktreePath,
  collectAssignmentOwnershipOverlaps,
  collectOwnershipViolations,
  planAssignments
} from '../server/services/multi-agent-service.mjs';

const tempRoots: string[] = [];

async function createProjectRoot() {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'codex-gui-ma-'));
  tempRoots.push(root);
  await fs.mkdir(path.join(root, 'server'), { recursive: true });
  await fs.mkdir(path.join(root, 'src'), { recursive: true });
  await fs.mkdir(path.join(root, 'tests'), { recursive: true });
  await fs.writeFile(path.join(root, 'package.json'), JSON.stringify({ name: 'demo' }, null, 2));
  return root;
}

afterEach(async () => {
  while (tempRoots.length) {
    const target = tempRoots.pop();
    if (!target) break;
    await fs.rm(target, { recursive: true, force: true });
  }
});

describe('multi-agent planning helpers', () => {
  it('generates non-overlapping worker assignments from project scopes', async () => {
    const projectRoot = await createProjectRoot();
    const assignments = await planAssignments({
      projectPath: projectRoot,
      request: 'Implement coordinated multi-agent orchestration.',
      workerCount: 3
    });

    expect(assignments).toHaveLength(3);
    const ownership = assignments.flatMap((assignment) => assignment.ownership);
    expect(new Set(ownership).size).toBe(ownership.length);
    expect(assignments.every((assignment) => assignment.ownership.length > 0)).toBe(true);
  });

  it('collapses parent-child scope targets into non-overlapping lanes', async () => {
    const projectRoot = await createProjectRoot();
    const assignments = await planAssignments({
      projectPath: projectRoot,
      request: 'Test scope collisions.',
      scopeTargets: ['src', 'src/features'],
      workerCount: 2
    });
    const overlaps = collectAssignmentOwnershipOverlaps(assignments);
    expect(overlaps).toEqual([]);
  });

  it('detects ownership collisions between worker assignments', () => {
    expect(collectAssignmentOwnershipOverlaps([
      { agentId: 'worker-1', ownership: ['src'] },
      { agentId: 'worker-2', ownership: ['src/features'] }
    ])).toEqual([
      {
        leftAgentId: 'worker-1',
        rightAgentId: 'worker-2',
        leftScope: 'src',
        rightScope: 'src/features'
      }
    ]);
  });

  it('detects out-of-scope file changes', () => {
    expect(collectOwnershipViolations([
      'server/routes/api-router.mjs',
      'src/features/dashboard/DashboardPage.tsx'
    ], ['server'])).toEqual(['src/features/dashboard/DashboardPage.tsx']);
  });

  it('builds deterministic worktree paths under the run directory', () => {
    expect(buildWorktreePath('/tmp/ws/run-123', 'worker-2')).toBe('/tmp/ws/run-123/worktrees/worker-2');
  });

  it('accepts merge-gate decisions only when every guard passes', () => {
    expect(buildMergeGateDecision({
      ownershipViolations: [],
      conflictingFiles: [],
      testsPassed: true,
      managerAccepted: true
    })).toEqual({
      accepted: true,
      reasons: []
    });

    expect(buildMergeGateDecision({
      ownershipViolations: ['src/app/AppProvider.tsx'],
      conflictingFiles: [],
      testsPassed: true,
      managerAccepted: true
    })).toEqual({
      accepted: false,
      reasons: ['ownership_violation']
    });
  });
});
