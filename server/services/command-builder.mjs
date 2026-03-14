import path from 'node:path';

export function buildProjectBotArgs(payload = {}) {
  const args = [
    'node',
    payload.projectBotScript,
    'start-run',
    '--root',
    payload.workspaceRoot,
    '--mode',
    payload.mode,
    '--request',
    payload.request
  ];
  if (payload.projectPath) args.push('--project', payload.projectPath);
  if (payload.scope) args.push('--scope', payload.scope);
  if (payload.scopeLevel) args.push('--scope-level', payload.scopeLevel);
  if (payload.scopeTargets?.length) args.push('--scope-targets', payload.scopeTargets.join(','));
  if (payload.requiredAtlasDocs?.length) args.push('--required-atlas-docs', payload.requiredAtlasDocs.join(','));
  if (payload.devIgnore?.length) args.push('--dev-ignore', payload.devIgnore.join(','));
  if (payload.designGuides?.length) args.push('--design-guides', payload.designGuides.join(','));
  if (payload.references?.length) args.push('--references', payload.references.join(','));
  args.push('--force-external-docs');
  return args;
}

export function buildAutopilotCommand({ scriptPath, workspaceRoot }) {
  return {
    command: scriptPath,
    args: [workspaceRoot]
  };
}

export function buildAutopilotEnvironment({
  runDir,
  profile,
  workspaceRoot
}) {
  const env = {
    ORCH_DIR_OVERRIDE: path.resolve(runDir),
    MAX_CYCLES: String(profile.maxCycles || 12),
    QUIET_AGENT_OUTPUT: profile.quiet ? '1' : '0'
  };
  if (profile.model) env.MODEL = profile.model;
  if (profile.effort) env.EFFORT = profile.effort;
  if (profile.profile) env.CODEX_PROFILE = profile.profile;
  if (profile.searchEnabled) env.CODEX_SEARCH = '1';
  if (profile.extraAddDirs?.length) env.CODEX_ADD_DIRS = profile.extraAddDirs.join('\n');
  if (profile.configOverrides?.length) env.CODEX_CONFIG_OVERRIDES = profile.configOverrides.join('\n');
  return {
    workspaceRoot,
    env
  };
}

export function tokenizeCliArgs(input = '') {
  const value = String(input || '').trim();
  if (!value) return [];
  const parts = [];
  let current = '';
  let quote = '';
  let escape = false;
  for (const char of value) {
    if (escape) {
      current += char;
      escape = false;
      continue;
    }
    if (char === '\\') {
      escape = true;
      continue;
    }
    if (quote) {
      if (char === quote) quote = '';
      else current += char;
      continue;
    }
    if (char === '"' || char === '\'') {
      quote = char;
      continue;
    }
    if (/\s/.test(char)) {
      if (current) {
        parts.push(current);
        current = '';
      }
      continue;
    }
    current += char;
  }
  if (current) parts.push(current);
  return parts;
}

export function buildCliArgs(payload = {}) {
  const args = [];
  for (const override of payload.configOverrides || []) {
    args.push('-c', override);
  }
  if (payload.model) args.push('-m', payload.model);
  if (payload.profile) args.push('-p', payload.profile);
  if (payload.sandbox) args.push('-s', payload.sandbox);
  if (payload.approval) args.push('-a', payload.approval);
  if (payload.localProvider) args.push('--local-provider', payload.localProvider);
  if (payload.searchEnabled) args.push('--search');
  if (payload.fullAuto) args.push('--full-auto');
  if (payload.noAltScreen) args.push('--no-alt-screen');
  if (payload.dangerouslyBypass) args.push('--dangerously-bypass-approvals-and-sandbox');
  for (const addDir of payload.extraAddDirs || []) {
    args.push('--add-dir', addDir);
  }
  if (payload.cwd) args.push('-C', payload.cwd);
  if (payload.command) args.push(payload.command);
  if (payload.command === 'exec') args.push('--skip-git-repo-check');
  if (payload.subcommand) args.push(payload.subcommand);
  args.push(...tokenizeCliArgs(payload.extraArgs));
  if (payload.prompt) args.push(payload.prompt);
  return args;
}
