import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { RunService } from '../server/services/run-service.mjs';

const tempRoots: string[] = [];

async function createTempRun(phases: Array<{ id: number; title: string; status: string }>) {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'codex-gui-run-'));
  tempRoots.push(root);
  const runDir = path.join(root, 'docs', 'project-bot', 'runs', 'demo-run');
  await fs.mkdir(runDir, { recursive: true });
  await fs.writeFile(path.join(runDir, 'state.json'), JSON.stringify({
    version: 1,
    workspaceRoot: root,
    projectPath: '/tmp/repo',
    mode: 'project-summary',
    phases
  }, null, 2));
  return { root, runDir };
}

afterEach(async () => {
  while (tempRoots.length) {
    const target = tempRoots.pop();
    if (!target) break;
    await fs.rm(target, { recursive: true, force: true });
  }
});

describe('run service', () => {
  it('hydrates legacy completed runs into completed runtime state', async () => {
    const { runDir } = await createTempRun([
      { id: 0, title: 'One', status: 'completed' },
      { id: 1, title: 'Two', status: 'completed' }
    ]);
    const service = new RunService({ workspaceService: {} });
    const snapshot = await service.getRunSnapshot(runDir);

    expect(snapshot.summary.done).toBe(true);
    expect(snapshot.runtime.state).toBe('completed');
  });

  it('creates draft runtime for unfinished runs', async () => {
    const { runDir } = await createTempRun([
      { id: 0, title: 'One', status: 'completed' },
      { id: 1, title: 'Two', status: 'pending' }
    ]);
    const service = new RunService({ workspaceService: {} });
    const snapshot = await service.getRunSnapshot(runDir);

    expect(snapshot.summary.done).toBe(false);
    expect(snapshot.runtime.state).toBe('draft');
  });
});
