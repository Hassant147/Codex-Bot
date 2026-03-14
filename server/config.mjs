import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export const ROOT_DIR = path.resolve(__dirname, '..');
export const DIST_DIR = path.join(ROOT_DIR, 'dist');
export const PROJECT_BOT = '/Users/macbook/.codex/skills/project-autopilot-manager/scripts/project_orchestrate.mjs';
export const AUTOPILOT = path.join(ROOT_DIR, 'bin', 'run-orchestration-autopilot.sh');
export const SUB_AGENT_RUNNER = path.join(ROOT_DIR, 'server', 'scripts', 'run-sub-agent.mjs');
export const PORT = Number(process.env.PORT || 4311);
export const DEFAULT_WORKSPACE_ROOT = path.join(ROOT_DIR, 'agent-workspaces', 'default');
export const AGENT_WORKSPACES_ROOT = path.join(ROOT_DIR, 'agent-workspaces');
export const PROJECT_PROFILES_PATH = path.join(ROOT_DIR, 'agent-workspaces', 'project-profiles.json');
export const CHAT_STORE_PATH = path.join(ROOT_DIR, 'agent-workspaces', 'chat-store.json');
export const ACCOUNTS_STORE_PATH = path.join(ROOT_DIR, 'agent-workspaces', 'accounts.json');
export const KEYCHAIN_SERVICE_NAME = 'codex-project-bot-gui';
export const EVENTS_FILE_NAME = 'events.jsonl';
export const RUNTIME_STATUS_FILE = 'status.json';
export const RUNTIME_COMMAND_FILE = 'command.json';
export const RUNTIME_HEARTBEAT_FILE = 'heartbeat.json';
export const HEALTH_CHECK_INTERVAL_MS = 3000;
export const MAX_EVENTS = 300;
export const DEFAULT_GLOBAL_RULES = [
  'Keep reports and durable project memory outside the target repo.',
  'Refresh affected docs when routes, APIs, contracts, state, or module structure change.',
  'Keep findings traceable and preserve operator-readable summaries.'
].join('\n');
