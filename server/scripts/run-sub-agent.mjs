import fs from 'node:fs/promises';
import { spawn } from 'node:child_process';

function getArg(flag) {
  const index = process.argv.indexOf(flag);
  return index === -1 ? '' : String(process.argv[index + 1] || '');
}

function detectCodexBinary() {
  if (process.env.CODEX_BIN) return process.env.CODEX_BIN;
  return 'codex';
}

async function main() {
  const promptFile = getArg('--prompt-file');
  const cwd = getArg('--cwd') || process.cwd();
  const lastMessageFile = getArg('--last-message-file');
  const prompt = await fs.readFile(promptFile, 'utf8');

  const args = ['exec', '--skip-git-repo-check', '-C', cwd];
  if (lastMessageFile) args.push('--output-last-message', lastMessageFile);
  if (process.env.MODEL) args.push('-m', process.env.MODEL);
  if (process.env.CODEX_PROFILE) args.push('-p', process.env.CODEX_PROFILE);
  if (process.env.CODEX_SEARCH === '1') args.push('--search');

  for (const override of String(process.env.CODEX_CONFIG_OVERRIDES || '').split('\n').map((line) => line.trim()).filter(Boolean)) {
    args.push('-c', override);
  }
  for (const addDir of String(process.env.CODEX_ADD_DIRS || '').split('\n').map((line) => line.trim()).filter(Boolean)) {
    args.push('--add-dir', addDir);
  }
  if (process.env.EFFORT) args.push('-c', `model_reasoning_effort="${process.env.EFFORT}"`);
  if (process.env.SUB_AGENT_MODE === 'dangerous') {
    args.push('--dangerously-bypass-approvals-and-sandbox');
  } else {
    args.push('--full-auto');
  }
  args.push('-');

  const child = spawn(detectCodexBinary(), args, {
    cwd,
    env: process.env,
    stdio: ['pipe', 'pipe', 'pipe']
  });

  child.stdout.pipe(process.stdout);
  child.stderr.pipe(process.stderr);
  child.stdin.write(prompt);
  child.stdin.end();

  child.on('close', (code) => {
    process.exit(code ?? 0);
  });
}

main().catch((error) => {
  console.error(error.message || String(error));
  process.exit(1);
});
