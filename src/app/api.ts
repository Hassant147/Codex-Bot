import type {
  AccountPayload,
  BootstrapPayload,
  ChatThread,
  CliCommandPreview,
  CliRunResult,
  ProjectProfile,
  RunPreflightResult,
  RunSnapshot,
  SubAgentDetail,
  SubAgentSummary,
  WorkspaceConfig,
  WorkspaceSummary
} from './types';

export class ApiError extends Error {
  details: Record<string, unknown>;

  constructor(message: string, details: Record<string, unknown> = {}) {
    super(message);
    this.name = 'ApiError';
    this.details = details;
  }
}

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json'
    },
    ...options
  });
  const payload = await response.json();
  if (!response.ok) {
    throw new ApiError(payload.error || 'Request failed.', payload);
  }
  return payload as T;
}

export const api = {
  bootstrap: (workspaceRoot: string) =>
    request<BootstrapPayload>(`/api/app/bootstrap?workspaceRoot=${encodeURIComponent(workspaceRoot)}`),
  saveWorkspace: (payload: Partial<WorkspaceConfig>) =>
    request<{ workspace: WorkspaceConfig }>('/api/workspace', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),
  createWorkspace: (payload: {
    name: string;
    projectPath: string;
    globalRules: string;
    scopeLevelDefault: string;
    executionProfile: WorkspaceConfig['executionProfile'];
    requiredAtlasDocs: string[];
  }) =>
    request<{ workspace: WorkspaceConfig }>('/api/workspaces', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),
  listWorkspaces: () => request<{ workspaces: WorkspaceSummary[] }>('/api/workspaces'),
  listProfiles: () => request<{ profiles: ProjectProfile[] }>('/api/profiles'),
  saveProfile: (payload: Partial<ProjectProfile>) =>
    request<{ profile: ProjectProfile }>('/api/profiles', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),
  deleteProfile: (profileId: string) =>
    request<{ ok: true }>(`/api/profiles/${encodeURIComponent(profileId)}`, {
      method: 'DELETE'
    }),
  listRuns: (workspaceRoot: string) =>
    request<{ runs: RunSnapshot[] }>(`/api/runs?workspaceRoot=${encodeURIComponent(workspaceRoot)}`),
  getRun: (workspaceRoot: string, runId: string) =>
    request<{ run: RunSnapshot }>(`/api/runs/${encodeURIComponent(runId)}?workspaceRoot=${encodeURIComponent(workspaceRoot)}`),
  listRunAgents: (workspaceRoot: string, runId: string) =>
    request<{ agents: SubAgentSummary[] }>(`/api/runs/${encodeURIComponent(runId)}/agents?workspaceRoot=${encodeURIComponent(workspaceRoot)}`),
  getRunAgent: (workspaceRoot: string, runId: string, agentId: string) =>
    request<{ agent: SubAgentDetail }>(`/api/runs/${encodeURIComponent(runId)}/agents/${encodeURIComponent(agentId)}?workspaceRoot=${encodeURIComponent(workspaceRoot)}`),
  createRun: (payload: Record<string, unknown>) =>
    request<{ run: RunSnapshot }>('/api/runs', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),
  startRun: (workspaceRoot: string, runId: string, executionProfile: unknown, activeAccountId = '') =>
    request<{ run: RunSnapshot }>(`/api/runs/${encodeURIComponent(runId)}/start`, {
      method: 'POST',
      body: JSON.stringify({ workspaceRoot, executionProfile, activeAccountId })
    }),
  pauseRun: (workspaceRoot: string, runId: string) =>
    request<{ run: RunSnapshot }>(`/api/runs/${encodeURIComponent(runId)}/pause`, {
      method: 'POST',
      body: JSON.stringify({ workspaceRoot })
    }),
  resumeRun: (workspaceRoot: string, runId: string, executionProfile: unknown, activeAccountId = '') =>
    request<{ run: RunSnapshot }>(`/api/runs/${encodeURIComponent(runId)}/resume`, {
      method: 'POST',
      body: JSON.stringify({ workspaceRoot, executionProfile, activeAccountId })
    }),
  stopRun: (workspaceRoot: string, runId: string) =>
    request<{ run: RunSnapshot }>(`/api/runs/${encodeURIComponent(runId)}/stop`, {
      method: 'POST',
      body: JSON.stringify({ workspaceRoot })
    }),
  listAccounts: () => request<AccountPayload>('/api/accounts'),
  loginAccount: (payload: { name: string; apiKey: string; saveProfile?: boolean }) =>
    request<AccountPayload & { savedAccount?: unknown }>('/api/accounts/login', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),
  saveCurrentChatgptSession: (payload: { name: string }) =>
    request<AccountPayload & { savedAccount?: unknown }>('/api/accounts/save-chatgpt-session', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),
  switchAccount: (payload: { accountId: string; runId?: string; workspaceRoot?: string }) =>
    request<AccountPayload & { account?: unknown }>('/api/accounts/switch', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),
  verifyCurrentSession: () =>
    request<AccountPayload>('/api/accounts/verify', {
      method: 'POST',
      body: JSON.stringify({})
    }),
  checkCurrentUsage: () =>
    request<AccountPayload>('/api/accounts/usage', {
      method: 'POST',
      body: JSON.stringify({})
    }),
  logoutAccount: () =>
    request<AccountPayload>('/api/accounts/logout', {
      method: 'POST',
      body: JSON.stringify({})
    }),
  deleteAccount: (accountId: string) =>
    request<{ ok: true }>(`/api/accounts/${encodeURIComponent(accountId)}`, {
      method: 'DELETE'
    }),
  getCapabilities: () => request('/api/codex/capabilities'),
  previewCli: (payload: Record<string, unknown>) =>
    request<CliCommandPreview>('/api/cli/preview', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),
  runCli: (payload: Record<string, unknown>) =>
    request<CliRunResult>('/api/cli/run', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),
  listChatThreads: () => request<{ threads: ChatThread[] }>('/api/chat/threads'),
  createChatThread: (payload: Record<string, unknown>) =>
    request<{ thread: ChatThread }>('/api/chat/threads', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),
  getChatThread: (threadId: string) =>
    request<{ thread: ChatThread }>(`/api/chat/threads/${encodeURIComponent(threadId)}`),
  sendChatMessage: (threadId: string, message: string) =>
    request<{ thread: ChatThread }>(`/api/chat/threads/${encodeURIComponent(threadId)}/messages`, {
      method: 'POST',
      body: JSON.stringify({ message })
    })
};
