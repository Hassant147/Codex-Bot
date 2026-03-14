import path from 'node:path';
import { spawn } from 'node:child_process';
import { PROJECT_BOT } from '../config.mjs';
import { buildProjectBotArgs } from './command-builder.mjs';

function runCommand(args = [], options = {}) {
  return new Promise((resolve) => {
    const child = spawn(args[0], args.slice(1), {
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

export class ProjectBotService {
  async initWorkspace(payload) {
    const args = [
      'node',
      PROJECT_BOT,
      'init-workspace',
      '--root',
      payload.workspaceRoot,
      '--project',
      payload.projectPath || ''
    ];
    if (payload.designGuides?.length) args.push('--design-guides', payload.designGuides.join(','));
    if (payload.blueprintSources?.length) args.push('--blueprint-sources', payload.blueprintSources.join(','));
    args.push('--force-external-docs');
    const result = await runCommand(args);
    if (result.code !== 0) throw new Error(result.stderr || result.stdout || 'Workspace initialization failed.');
    return result;
  }

  async startRun(payload = {}) {
    const args = buildProjectBotArgs({
      ...payload,
      projectBotScript: PROJECT_BOT
    });
    const result = await runCommand(args, { cwd: path.resolve(payload.workspaceRoot) });
    if (result.code !== 0) {
      throw new Error(result.stderr || result.stdout || 'Failed to create run.');
    }
    return result;
  }
}
