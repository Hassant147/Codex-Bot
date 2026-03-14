export type Tone = 'neutral' | 'success' | 'warning' | 'error';

export type TabId =
  | 'dashboard'
  | 'create-run'
  | 'history'
  | 'agents'
  | 'cli'
  | 'chat'
  | 'settings';

export interface TabMeta {
  id: TabId;
  label: string;
}

export interface ExecutionProfile {
  model: string;
  effort: string;
  maxCycles: number;
  quiet: boolean;
  profile: string;
  searchEnabled: boolean;
  extraAddDirs: string[];
  configOverrides: string[];
  autoAddRelatedRepos: boolean;
  multiAgent: MultiAgentConfig;
}

export interface MultiAgentConfig {
  enabled: boolean;
  workerCount: 2 | 3;
  writeMode: 'scoped';
  isolation: 'worktree';
  mergeGate: 'manager_tests';
}

export interface WorkspaceConfig {
  version: number;
  workspaceRoot: string;
  projectPath: string;
  designGuides: string[];
  blueprintSources: string[];
  globalRules: string;
  scopeLevelDefault: string;
  requiredAtlasDocs: string[];
  fullSystemRequiredDocs: boolean;
  executionProfile: ExecutionProfile;
}

export interface WorkspaceSummary {
  id: string;
  name: string;
  workspaceRoot: string;
  projectPath: string;
  updatedAt: string;
  executionProfile: ExecutionProfile;
}

export interface ProjectProfile {
  id: string;
  name: string;
  workspaceRoot: string;
  projectPath: string;
  scopeLevelDefault: string;
  globalRules: string;
  executionProfile: ExecutionProfile;
  updatedAt: string;
}

export interface ModeMeta {
  id: string;
  label: string;
  summary: string;
  bestFor: string;
}

export interface RunTemplate {
  id: string;
  label: string;
  modeId: string;
  request: string;
}

export interface ScopeLevel {
  id: string;
  label: string;
}

export interface QualityPreset {
  id: string;
  label: string;
  effort: string;
  maxCycles: number;
  quiet: boolean;
}

export type RuntimeState =
  | 'draft'
  | 'queued'
  | 'starting'
  | 'running'
  | 'paused'
  | 'waiting_auth'
  | 'stopping'
  | 'stopped'
  | 'failed'
  | 'completed';

export interface BlockingIssue {
  kind: 'auth' | 'quota';
  message: string;
}

export interface RunRuntimeState {
  id: string;
  runDir: string;
  state: RuntimeState;
  blockingIssue: BlockingIssue | null;
  pid: number | null;
  lastExitCode: number | null;
  lastUpdatedAt: string;
  heartbeatAt: string | null;
  activeAccountId?: string;
}

export interface RunPreflightIssue {
  code: 'not_git_repo' | 'dirty_worktree';
  message: string;
}

export interface RunPreflightResult {
  ok: boolean;
  repoRoot: string | null;
  isGitRepo: boolean;
  cleanWorkingTree: boolean;
  issues: RunPreflightIssue[];
  fallback: 'single_agent';
  checkedAt: string;
}

export type SubAgentRole = 'manager' | 'worker';

export type SubAgentStatus =
  | 'pending'
  | 'planning'
  | 'queued'
  | 'running'
  | 'reviewing'
  | 'merging'
  | 'paused'
  | 'waiting_auth'
  | 'blocked'
  | 'failed'
  | 'completed';

export type SubAgentHealth = 'idle' | 'active' | 'blocked' | 'error' | 'complete';

export interface SubAgentAssignment {
  agentId: string;
  title: string;
  objective: string;
  ownership: string[];
  promptFile: string;
}

export interface SubAgentRuntimeState {
  agentId: string;
  role: SubAgentRole;
  status: SubAgentStatus;
  phase: string;
  health: SubAgentHealth;
  pid: number | null;
  retryCount: number;
  heartbeatAt: string | null;
  lastUpdatedAt: string;
  blockingIssue: BlockingIssue | null;
  changedFiles: string[];
  worktreePath: string;
}

export interface SubAgentSummary {
  agentId: string;
  role: SubAgentRole;
  label: string;
  status: SubAgentStatus;
  phase: string;
  health: SubAgentHealth;
  ownership: string[];
  heartbeatAt: string | null;
  blockingIssue: BlockingIssue | null;
  retryCount: number;
  worktreePath: string;
}

export interface SubAgentDetail {
  summary: SubAgentSummary;
  assignment: SubAgentAssignment | null;
  runtime: SubAgentRuntimeState | null;
  events: RunEvent[];
  worktree: {
    path: string;
    branchName: string;
    baseRef: string;
    repoRoot: string;
  } | null;
}

export interface CoordinationState {
  enabled: boolean;
  status: 'idle' | 'planning' | 'running' | 'reviewing' | 'paused' | 'waiting_auth' | 'blocked' | 'failed' | 'completed';
  managerId: string;
  workerIds: string[];
  activePhase: string;
  mergeGate: MultiAgentConfig['mergeGate'];
  startedAt: string | null;
  updatedAt: string;
  preflight: RunPreflightResult | null;
}

export interface MergeReport {
  status: 'pending' | 'accepted' | 'rejected';
  reviewedBy: string;
  summary: string;
  acceptedAgents: string[];
  rejectedAgents: Array<{ agentId: string; reason: string }>;
  tests: Array<{ agentId: string; command: string; passed: boolean; output: string }>;
  generatedAt: string;
}

export interface PhaseInfo {
  id: number;
  title: string;
  status: string;
}

export interface RunStateFile {
  version: number;
  workspaceRoot: string;
  projectPath: string;
  mode: string;
  multiAgent?: MultiAgentConfig;
  modeTitle?: string;
  description?: string;
  scope?: string;
  request?: string;
  updatedAt?: string;
  phases: PhaseInfo[];
}

export interface RunSummaryMeta {
  total: number;
  completed: number;
  nextPhase: { id: number; title: string } | null;
  done: boolean;
}

export interface RunEvent {
  id: string;
  createdAt: string;
  type: 'system' | 'log' | 'audit';
  source: string;
  level: 'info' | 'warning' | 'error';
  message: string;
}

export interface RunSnapshot {
  runId: string;
  runDir: string;
  state: RunStateFile;
  summary: RunSummaryMeta;
  runtime: RunRuntimeState;
  events: RunEvent[];
  runSummary: string;
  nextPrompt: string;
  coordination: CoordinationState | null;
  subAgents: SubAgentSummary[];
  mergeReport: MergeReport | null;
  preflight: RunPreflightResult | null;
  updatedAt?: string;
}

export interface AccountProfile {
  id: string;
  name: string;
  provider: 'api-key' | 'chatgpt' | 'unknown';
  kind: 'api-key' | 'chatgpt-snapshot';
  createdAt: string;
  updatedAt: string;
  verifiedAt: string | null;
  lastCheckMessage: string;
  available: boolean;
  snapshotFingerprint: string;
  identityEmail: string;
  identitySubject: string;
  identityAccountId: string;
  lastKnownUsage?: CurrentUsageSnapshot | null;
}

export interface AccountSession {
  loggedIn: boolean;
  method: string;
  provider: 'api-key' | 'chatgpt' | 'unknown';
  raw: string;
}

export interface UsageWindow {
  usedPercent: number | null;
  leftPercent: number | null;
  windowMinutes: number | null;
  resetAt: string | null;
}

export interface UsageCredits {
  [key: string]: unknown;
}

export interface CurrentUsageSnapshot {
  source: 'session-log' | 'saved-account-cache' | 'cli-probe';
  sessionFile: string;
  capturedAt: string | null;
  accountEmail: string;
  accountId: string;
  planType: string;
  freshForCurrentLogin: boolean;
  primary: UsageWindow | null;
  secondary: UsageWindow | null;
  credits: UsageCredits | null;
}

export interface AccountPayload {
  activeAccountId: string;
  accounts: AccountProfile[];
  currentSession: AccountSession;
  capabilities: CliCapabilities;
  currentUsage: CurrentUsageSnapshot | null;
}

export interface AuthStorageCapabilities {
  authFilePath: string;
  authFileExists: boolean;
  supportsChatgptSnapshots: boolean;
}

export interface CliCapabilities {
  available: boolean;
  binary: string;
  version: string;
  commands: string[];
  auth: AccountSession;
  profiles: string[];
  models: string[];
  authStorage: AuthStorageCapabilities;
}

export interface CliCommandPreview {
  binary: string;
  args: string[];
}

export interface CliRunResult extends CliCommandPreview {
  ok: boolean;
  code: number;
  stdout: string;
  stderr: string;
  timedOut: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
}

export interface ChatThread {
  id: string;
  title: string;
  workspaceRoot: string;
  projectPath: string;
  model: string;
  createdAt: string;
  updatedAt: string;
  messages: ChatMessage[];
}

export interface BootstrapPayload {
  tabs: TabMeta[];
  modes: ModeMeta[];
  runTemplates: RunTemplate[];
  scopeLevels: ScopeLevel[];
  qualityPresets: QualityPreset[];
  workspace: WorkspaceConfig;
  workspaces: WorkspaceSummary[];
  projectProfiles: ProjectProfile[];
  latestRun: string;
  runs: RunSnapshot[];
  accounts: AccountPayload;
  capabilities: CliCapabilities;
  currentRun: RunSnapshot | null;
}

export interface BannerState {
  tone: Tone;
  message: string;
}
