import fs from 'node:fs/promises';
import path from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import {
  buildWorktreeBranchName,
  buildWorktreePath
} from './multi-agent-service.mjs';

const execFileAsync = promisify(execFile);

async function runGit(args, options = {}) {
  try {
    const result = await execFileAsync('git', args, {
      cwd: options.cwd,
      env: { ...process.env, ...(options.env || {}) },
      maxBuffer: 10 * 1024 * 1024
    });
    return {
      code: 0,
      stdout: String(result.stdout || '').trim(),
      stderr: String(result.stderr || '').trim()
    };
  } catch (error) {
    return {
      code: Number(error.code || 1),
      stdout: String(error.stdout || '').trim(),
      stderr: String(error.stderr || error.message || '').trim()
    };
  }
}

export async function getRepoRoot(projectPath) {
  const result = await runGit(['rev-parse', '--show-toplevel'], {
    cwd: path.resolve(projectPath)
  });
  return result.code === 0 ? result.stdout : '';
}

export async function validateMultiAgentPreflight(projectPath) {
  const repoRoot = await getRepoRoot(projectPath);
  const issues = [];
  if (!repoRoot) {
    issues.push({
      code: 'not_git_repo',
      message: 'Multi-agent mode requires the target project to be a Git repository.'
    });
  }

  let cleanWorkingTree = false;
  if (repoRoot) {
    const status = await runGit(['status', '--porcelain'], { cwd: repoRoot });
    cleanWorkingTree = status.code === 0 && !status.stdout.trim();
    if (!cleanWorkingTree) {
      issues.push({
        code: 'dirty_worktree',
        message: 'Multi-agent mode requires a clean working tree before start.'
      });
    }
  }

  return {
    ok: issues.length === 0,
    repoRoot: repoRoot || null,
    isGitRepo: Boolean(repoRoot),
    cleanWorkingTree,
    issues,
    fallback: 'single_agent',
    checkedAt: new Date().toISOString()
  };
}

async function worktreeExists(worktreePath) {
  const result = await fs.stat(worktreePath).catch(() => null);
  return Boolean(result);
}

export async function ensureAgentWorktree({ projectPath, runDir, runId, agentId }) {
  const repoRoot = await getRepoRoot(projectPath);
  if (!repoRoot) {
    throw new Error('Target project is not a Git repository.');
  }

  const worktreePath = buildWorktreePath(runDir, agentId);
  const branchName = buildWorktreeBranchName(runId, agentId);
  const baseRefResult = await runGit(['rev-parse', 'HEAD'], { cwd: repoRoot });
  if (baseRefResult.code !== 0 || !baseRefResult.stdout) {
    throw new Error(baseRefResult.stderr || 'Unable to determine Git base ref.');
  }
  const baseRef = baseRefResult.stdout;

  if (!(await worktreeExists(worktreePath))) {
    const addResult = await runGit(['worktree', 'add', '--force', '-b', branchName, worktreePath, baseRef], {
      cwd: repoRoot
    });
    if (addResult.code !== 0) {
      throw new Error(addResult.stderr || addResult.stdout || `Unable to create worktree for ${agentId}.`);
    }
  }

  return {
    path: worktreePath,
    branchName,
    baseRef,
    repoRoot
  };
}

export async function listChangedFiles(worktreePath) {
  const result = await runGit(['diff', '--name-only'], {
    cwd: path.resolve(worktreePath)
  });
  if (result.code !== 0) {
    throw new Error(result.stderr || result.stdout || 'Unable to inspect changed files.');
  }
  return result.stdout
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
}

export async function writeWorktreePatch({ worktreePath, outputPath }) {
  const result = await runGit(['diff', '--binary'], {
    cwd: path.resolve(worktreePath)
  });
  if (result.code !== 0) {
    throw new Error(result.stderr || result.stdout || 'Unable to generate worktree patch.');
  }
  await fs.mkdir(path.dirname(path.resolve(outputPath)), { recursive: true });
  await fs.writeFile(path.resolve(outputPath), `${result.stdout}\n`, 'utf8');
  return path.resolve(outputPath);
}

export async function applyPatch(repoRoot, patchPath) {
  const check = await runGit(['apply', '--check', path.resolve(patchPath)], { cwd: path.resolve(repoRoot) });
  if (check.code !== 0) {
    throw new Error(check.stderr || check.stdout || 'Patch check failed.');
  }
  const apply = await runGit(['apply', path.resolve(patchPath)], { cwd: path.resolve(repoRoot) });
  if (apply.code !== 0) {
    throw new Error(apply.stderr || apply.stdout || 'Patch apply failed.');
  }
}

export async function reversePatch(repoRoot, patchPath) {
  const result = await runGit(['apply', '-R', path.resolve(patchPath)], { cwd: path.resolve(repoRoot) });
  if (result.code !== 0) {
    throw new Error(result.stderr || result.stdout || 'Patch revert failed.');
  }
}

export { runGit };
