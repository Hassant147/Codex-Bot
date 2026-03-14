import { describe, expect, it } from 'vitest';
import { buildAutopilotEnvironment, buildCliArgs, buildProjectBotArgs } from '../server/services/command-builder.mjs';

describe('command builder', () => {
  it('builds project bot args with force external docs', () => {
    const args = buildProjectBotArgs({
      projectBotScript: '/tmp/project-orchestrate.mjs',
      workspaceRoot: '/tmp/ws',
      mode: 'fix-backlog',
      request: 'Fix the next bug',
      projectPath: '/tmp/repo',
      scopeTargets: ['web', 'api'],
      designGuides: ['/tmp/guide.md']
    });

    expect(args).toContain('--force-external-docs');
    expect(args).toContain('/tmp/project-orchestrate.mjs');
    expect(args).toContain('fix-backlog');
    expect(args).toContain('web,api');
  });

  it('builds autopilot environment from execution profile', () => {
    const env = buildAutopilotEnvironment({
      runDir: '/tmp/ws/runs/demo',
      workspaceRoot: '/tmp/ws',
      profile: {
        model: 'gpt-5.4',
        effort: 'high',
        maxCycles: 9,
        quiet: true,
        profile: 'prod',
        searchEnabled: true,
        extraAddDirs: ['/tmp/repo-a', '/tmp/repo-b'],
        configOverrides: ['model_reasoning_effort="high"'],
        autoAddRelatedRepos: true,
        multiAgent: {
          enabled: true,
          workerCount: 3,
          writeMode: 'scoped',
          isolation: 'worktree',
          mergeGate: 'manager_tests'
        }
      }
    });

    expect(env.env.MAX_CYCLES).toBe('9');
    expect(env.env.MODEL).toBe('gpt-5.4');
    expect(env.env.CODEX_PROFILE).toBe('prod');
    expect(env.env.CODEX_SEARCH).toBe('1');
    expect(env.env.CODEX_ADD_DIRS).toContain('/tmp/repo-a');
  });

  it('builds cli args using the same normalized payload model', () => {
    const args = buildCliArgs({
      command: 'exec',
      prompt: 'Hello',
      cwd: '/tmp/repo',
      model: 'gpt-5.3-codex',
      profile: 'ops',
      searchEnabled: true,
      extraAddDirs: ['/tmp/a'],
      configOverrides: ['model_reasoning_effort="medium"'],
      extraArgs: '--json'
    });

    expect(args).toEqual([
      '-c',
      'model_reasoning_effort="medium"',
      '-m',
      'gpt-5.3-codex',
      '-p',
      'ops',
      '--search',
      '--add-dir',
      '/tmp/a',
      '-C',
      '/tmp/repo',
      'exec',
      '--skip-git-repo-check',
      '--json',
      'Hello'
    ]);
  });
});
