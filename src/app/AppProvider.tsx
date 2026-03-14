import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  startTransition
} from 'react';
import { ApiError, api } from './api';
import type {
  AccountPayload,
  BannerState,
  BootstrapPayload,
  ChatThread,
  CliCommandPreview,
  CliRunResult,
  ExecutionProfile,
  ProjectProfile,
  RunSnapshot,
  TabId,
  WorkspaceConfig,
  WorkspaceSummary
} from './types';

interface AppContextValue {
  bootstrapped: boolean;
  selectedTab: TabId;
  bootstrap: BootstrapPayload | null;
  workspace: WorkspaceConfig | null;
  workspaces: WorkspaceSummary[];
  profiles: ProjectProfile[];
  runs: RunSnapshot[];
  currentRun: RunSnapshot | null;
  accounts: AccountPayload | null;
  chatThreads: ChatThread[];
  activeThread: ChatThread | null;
  cliPreview: CliCommandPreview | null;
  cliResult: CliRunResult | null;
  banner: BannerState | null;
  accountNotice: BannerState | null;
  loadingLabel: string;
  setSelectedTab: (tab: TabId) => void;
  setBanner: (banner: BannerState | null) => void;
  setAccountNotice: (banner: BannerState | null) => void;
  refreshBootstrap: (workspaceRoot?: string) => Promise<void>;
  saveWorkspace: (payload: Partial<WorkspaceConfig>) => Promise<void>;
  createWorkspace: (name: string) => Promise<void>;
  saveProfile: (payload: Partial<ProjectProfile>) => Promise<void>;
  deleteProfile: (profileId: string) => Promise<void>;
  loadRun: (runId: string) => Promise<void>;
  createRun: (payload: Record<string, unknown>) => Promise<void>;
  startRun: (runId: string, executionProfile?: Partial<ExecutionProfile>) => Promise<void>;
  pauseRun: (runId: string) => Promise<void>;
  resumeRun: (runId: string, executionProfile?: Partial<ExecutionProfile>) => Promise<void>;
  stopRun: (runId: string) => Promise<void>;
  loginAccount: (name: string, apiKey: string, saveProfile: boolean) => Promise<void>;
  saveCurrentChatgptSession: (name: string) => Promise<void>;
  switchAccount: (accountId: string, runId?: string) => Promise<void>;
  verifyCurrentSession: () => Promise<void>;
  checkCurrentUsage: () => Promise<void>;
  refreshAccounts: (silent?: boolean) => Promise<void>;
  logoutAccount: () => Promise<void>;
  deleteAccount: (accountId: string) => Promise<void>;
  previewCli: (payload: Record<string, unknown>) => Promise<void>;
  runCli: (payload: Record<string, unknown>) => Promise<void>;
  loadChatThreads: () => Promise<void>;
  createChatThread: (title: string) => Promise<void>;
  openChatThread: (threadId: string) => Promise<void>;
  sendChatMessage: (threadId: string, message: string) => Promise<void>;
}

const AppContext = createContext<AppContextValue | null>(null);

function patchRuntimeRun(current: RunSnapshot | null, next: RunSnapshot['runtime']): RunSnapshot | null {
  if (!current) return current;
  return {
    ...current,
    runtime: next
  };
}

function patchCoordinationRun(current: RunSnapshot | null, next: RunSnapshot['coordination']): RunSnapshot | null {
  if (!current) return current;
  return {
    ...current,
    coordination: next,
    preflight: next?.preflight || current.preflight
  };
}

function patchAgentRun(current: RunSnapshot | null, next: RunSnapshot['subAgents'][number]): RunSnapshot | null {
  if (!current) return current;
  return {
    ...current,
    subAgents: [
      ...current.subAgents.filter((agent) => agent.agentId !== next.agentId),
      next
    ].sort((left, right) => left.agentId.localeCompare(right.agentId))
  };
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [bootstrapped, setBootstrapped] = useState(false);
  const [selectedTab, setSelectedTab] = useState<TabId>('dashboard');
  const [bootstrap, setBootstrap] = useState<BootstrapPayload | null>(null);
  const [workspace, setWorkspace] = useState<WorkspaceConfig | null>(null);
  const [workspaces, setWorkspaces] = useState<WorkspaceSummary[]>([]);
  const [profiles, setProfiles] = useState<ProjectProfile[]>([]);
  const [runs, setRuns] = useState<RunSnapshot[]>([]);
  const [currentRun, setCurrentRun] = useState<RunSnapshot | null>(null);
  const [accounts, setAccounts] = useState<AccountPayload | null>(null);
  const [chatThreads, setChatThreads] = useState<ChatThread[]>([]);
  const [activeThread, setActiveThread] = useState<ChatThread | null>(null);
  const [cliPreview, setCliPreview] = useState<CliCommandPreview | null>(null);
  const [cliResult, setCliResult] = useState<CliRunResult | null>(null);
  const [banner, setBanner] = useState<BannerState | null>(null);
  const [accountNotice, setAccountNotice] = useState<BannerState | null>(null);
  const [loadingLabel, setLoadingLabel] = useState('');
  const currentWorkspaceRoot = workspace?.workspaceRoot || bootstrap?.workspace.workspaceRoot || '';
  const streamRef = useRef<EventSource | null>(null);

  const showSuccess = (message: string) => setBanner({ tone: 'success', message });
  const showError = (message: string) => setBanner({ tone: 'error', message });
  const showAccountSuccess = (message: string) => setAccountNotice({ tone: 'success', message });
  const showAccountWarning = (message: string) => setAccountNotice({ tone: 'warning', message });
  const showAccountError = (message: string) => setAccountNotice({ tone: 'error', message });

  function getErrorMessage(error: unknown) {
    if (error instanceof ApiError && error.details?.preflight) {
      const preflight = error.details.preflight as {
        issues?: Array<{ message?: string }>;
        fallback?: string;
      };
      const issueText = Array.isArray(preflight.issues)
        ? preflight.issues.map((issue) => issue.message).filter(Boolean).join(' ')
        : '';
      return [issueText || error.message, preflight.fallback === 'single_agent' ? 'Switch Multi-Agent Mode off to continue with a single-agent run.' : '']
        .filter(Boolean)
        .join(' ');
    }
    if (error instanceof Error && error.message) return error.message;
    return 'Request failed.';
  }

  async function refreshBootstrap(workspaceRoot = currentWorkspaceRoot || '', options: { silent?: boolean } = {}) {
    const root = workspaceRoot || currentWorkspaceRoot || '';
    if (!options.silent) setLoadingLabel('Loading workspace');
    try {
      const payload = await api.bootstrap(root);
      startTransition(() => {
        setBootstrap(payload);
        setWorkspace(payload.workspace);
        setWorkspaces(payload.workspaces);
        setProfiles(payload.projectProfiles);
        setRuns(payload.runs);
        setCurrentRun(payload.currentRun);
        setAccounts(payload.accounts);
      });
      setBootstrapped(true);
    } catch (error) {
      showError(getErrorMessage(error));
    } finally {
      if (!options.silent) setLoadingLabel('');
    }
  }

  async function loadRunsOnly(options: { silent?: boolean } = {}) {
    if (!currentWorkspaceRoot) return;
    try {
      const payload = await api.listRuns(currentWorkspaceRoot);
      setRuns(payload.runs);
    } catch (error) {
      if (!options.silent) showError(getErrorMessage(error));
    }
  }

  async function saveWorkspace(payload: Partial<WorkspaceConfig>) {
    if (!currentWorkspaceRoot && !payload.workspaceRoot) return;
    setLoadingLabel('Saving workspace');
    try {
      const result = await api.saveWorkspace({
        ...payload,
        workspaceRoot: payload.workspaceRoot || currentWorkspaceRoot
      });
      setWorkspace(result.workspace);
      showSuccess('Workspace settings saved.');
      await refreshBootstrap(result.workspace.workspaceRoot, { silent: true });
    } catch (error) {
      showError(getErrorMessage(error));
    } finally {
      setLoadingLabel('');
    }
  }

  async function createWorkspace(name: string) {
    if (!workspace) return;
    setLoadingLabel('Creating workspace');
    try {
      const result = await api.createWorkspace({
        name,
        projectPath: workspace.projectPath,
        globalRules: workspace.globalRules,
        scopeLevelDefault: workspace.scopeLevelDefault,
        executionProfile: workspace.executionProfile,
        requiredAtlasDocs: workspace.requiredAtlasDocs
      });
      setWorkspace(result.workspace);
      showSuccess('Workspace created.');
      await refreshBootstrap(result.workspace.workspaceRoot, { silent: true });
    } catch (error) {
      showError(getErrorMessage(error));
    } finally {
      setLoadingLabel('');
    }
  }

  async function saveProfile(payload: Partial<ProjectProfile>) {
    try {
      const result = await api.saveProfile({
        ...payload,
        workspaceRoot: payload.workspaceRoot || currentWorkspaceRoot,
        projectPath: payload.projectPath || workspace?.projectPath || '',
        globalRules: payload.globalRules || workspace?.globalRules || '',
        executionProfile: payload.executionProfile || workspace?.executionProfile
      });
      setProfiles((prev) => [...prev.filter((item) => item.id !== result.profile.id), result.profile].sort((left, right) => left.name.localeCompare(right.name)));
      showSuccess('Project profile saved.');
    } catch (error) {
      showError(getErrorMessage(error));
    }
  }

  async function deleteProfile(profileId: string) {
    try {
      await api.deleteProfile(profileId);
      setProfiles((prev) => prev.filter((item) => item.id !== profileId));
      showSuccess('Project profile deleted.');
    } catch (error) {
      showError(getErrorMessage(error));
    }
  }

  async function loadRun(runId: string) {
    if (!currentWorkspaceRoot) return;
    setLoadingLabel('Loading run');
    try {
      const payload = await api.getRun(currentWorkspaceRoot, runId);
      setCurrentRun(payload.run);
      setRuns((prev) => prev.map((item) => item.runId === payload.run.runId ? payload.run : item));
    } catch (error) {
      showError(getErrorMessage(error));
    } finally {
      setLoadingLabel('');
    }
  }

  async function createRun(payload: Record<string, unknown>) {
    setLoadingLabel('Creating run');
    try {
      const result = await api.createRun({
        workspaceRoot: currentWorkspaceRoot,
        ...payload
      });
      setCurrentRun(result.run);
      showSuccess('Run created.');
      setSelectedTab('dashboard');
      await loadRunsOnly({ silent: true });
    } catch (error) {
      showError(getErrorMessage(error));
    } finally {
      setLoadingLabel('');
    }
  }

  function executionProfileForRun(runId: string, executionProfile?: Partial<ExecutionProfile>) {
    const run = currentRun?.runId === runId
      ? currentRun
      : runs.find((item) => item.runId === runId) || null;
    const baseProfile = workspace?.executionProfile || null;
    return {
      ...(baseProfile || {}),
      ...(executionProfile || {}),
      multiAgent: {
        ...(baseProfile?.multiAgent || { enabled: false, workerCount: 3, writeMode: 'scoped', isolation: 'worktree', mergeGate: 'manager_tests' }),
        ...(run?.state.multiAgent || {}),
        ...(executionProfile?.multiAgent || {})
      }
    };
  }

  async function startRun(runId: string, executionProfile?: Partial<ExecutionProfile>) {
    if (!currentWorkspaceRoot) return;
    try {
      const result = await api.startRun(currentWorkspaceRoot, runId, executionProfileForRun(runId, executionProfile), accounts?.activeAccountId || '');
      setCurrentRun(result.run);
      showSuccess('Run started.');
      await loadRunsOnly({ silent: true });
    } catch (error) {
      showError(getErrorMessage(error));
    }
  }

  async function pauseRun(runId: string) {
    if (!currentWorkspaceRoot) return;
    try {
      const result = await api.pauseRun(currentWorkspaceRoot, runId);
      setCurrentRun(result.run);
      showSuccess('Run pause requested.');
      await loadRunsOnly({ silent: true });
    } catch (error) {
      showError(getErrorMessage(error));
    }
  }

  async function resumeRun(runId: string, executionProfile?: Partial<ExecutionProfile>) {
    if (!currentWorkspaceRoot) return;
    try {
      const result = await api.resumeRun(currentWorkspaceRoot, runId, executionProfileForRun(runId, executionProfile), accounts?.activeAccountId || '');
      setCurrentRun(result.run);
      showSuccess('Run resumed.');
      await loadRunsOnly({ silent: true });
    } catch (error) {
      showError(getErrorMessage(error));
    }
  }

  async function stopRun(runId: string) {
    if (!currentWorkspaceRoot) return;
    try {
      const result = await api.stopRun(currentWorkspaceRoot, runId);
      setCurrentRun(result.run);
      showSuccess('Run stop requested.');
      await loadRunsOnly({ silent: true });
    } catch (error) {
      showError(getErrorMessage(error));
    }
  }

  async function loginAccount(name: string, apiKey: string, saveProfile: boolean) {
    setLoadingLabel('Saving API key account');
    try {
      const result = await api.loginAccount({ name, apiKey, saveProfile });
      setAccounts(result);
      showAccountSuccess(`Saved and signed in with ${name || 'API key account'}.`);
      showSuccess('Account signed in.');
    } catch (error) {
      showAccountError(getErrorMessage(error));
      showError(getErrorMessage(error));
    } finally {
      setLoadingLabel('');
    }
  }

  async function saveCurrentChatgptSession(name: string) {
    setLoadingLabel('Saving browser login');
    try {
      const result = await api.saveCurrentChatgptSession({ name });
      setAccounts(result);
      const savedName = typeof result.savedAccount === 'object' && result.savedAccount && 'name' in result.savedAccount
        ? String((result.savedAccount as { name?: string }).name || name || 'browser login')
        : name || 'browser login';
      showAccountSuccess(`Saved browser login snapshot: ${savedName}.`);
      showSuccess('Browser login saved.');
    } catch (error) {
      showAccountError(getErrorMessage(error));
      showError(getErrorMessage(error));
    } finally {
      setLoadingLabel('');
    }
  }

  async function switchAccount(accountId: string, runId?: string) {
    setLoadingLabel('Switching account');
    try {
      const result = await api.switchAccount({ accountId, runId, workspaceRoot: currentWorkspaceRoot });
      setAccounts(result);
      const switchedName = typeof result.account === 'object' && result.account && 'name' in result.account
        ? String((result.account as { name?: string }).name || 'saved account')
        : 'saved account';
      showAccountSuccess(`Switched to ${switchedName}.`);
      showSuccess('Account switched.');
      if (runId) {
        await loadRun(runId);
      }
    } catch (error) {
      showAccountError(getErrorMessage(error));
      showError(getErrorMessage(error));
    } finally {
      setLoadingLabel('');
    }
  }

  async function verifyCurrentSession() {
    setLoadingLabel('Verifying current session');
    try {
      const result = await api.verifyCurrentSession();
      setAccounts(result);
      if (result.currentSession.loggedIn) {
        showAccountSuccess(`Verified current session: ${result.currentSession.method || 'Codex account'}.`);
      } else {
        showAccountWarning('No active Codex account is logged in right now.');
      }
      showSuccess('Current account verified.');
    } catch (error) {
      showAccountError(getErrorMessage(error));
      showError(getErrorMessage(error));
    } finally {
      setLoadingLabel('');
    }
  }

  async function checkCurrentUsage() {
    setLoadingLabel('Checking current limit');
    try {
      const result = await api.checkCurrentUsage();
      setAccounts(result);
      if (result.currentUsage?.freshForCurrentLogin) {
        const left = result.currentUsage.primary?.leftPercent;
        showAccountSuccess(
          Number.isFinite(left)
            ? `Current 5h limit snapshot updated: ${left}% left.`
            : 'Current limit snapshot updated.'
        );
      } else if (result.currentUsage) {
        showAccountWarning('No fresh live snapshot for this account yet. Showing the last saved snapshot for the selected account.');
      } else {
        showAccountWarning('No limit data was returned for this account. The app already ran an automatic CLI check, but Codex did not emit a rate-limit event.');
      }
    } catch (error) {
      showAccountError(getErrorMessage(error));
      showError(getErrorMessage(error));
    } finally {
      setLoadingLabel('');
    }
  }

  async function refreshAccounts(silent = false) {
    if (!silent) setLoadingLabel('Refreshing account status');
    try {
      const result = await api.listAccounts();
      setAccounts(result);
      if (!silent) {
        showAccountSuccess('Account status updated.');
        showSuccess('Account status updated.');
      }
    } catch (error) {
      if (!silent) {
        showAccountError(getErrorMessage(error));
        showError(getErrorMessage(error));
      }
    } finally {
      if (!silent) setLoadingLabel('');
    }
  }

  async function logoutAccount() {
    setLoadingLabel('Signing out');
    try {
      const result = await api.logoutAccount();
      setAccounts(result);
      showAccountWarning('Signed out. Saved snapshots remain available for later switching.');
      showSuccess('Signed out.');
    } catch (error) {
      showAccountError(getErrorMessage(error));
      showError(getErrorMessage(error));
    } finally {
      setLoadingLabel('');
    }
  }

  async function deleteAccount(accountId: string) {
    setLoadingLabel('Removing saved account');
    try {
      await api.deleteAccount(accountId);
      setAccounts(await api.listAccounts());
      showAccountWarning('Saved account removed.');
      showSuccess('Account profile removed.');
    } catch (error) {
      showAccountError(getErrorMessage(error));
      showError(getErrorMessage(error));
    } finally {
      setLoadingLabel('');
    }
  }

  async function previewCli(payload: Record<string, unknown>) {
    try {
      setCliPreview(await api.previewCli(payload));
    } catch (error) {
      showError(getErrorMessage(error));
    }
  }

  async function runCli(payload: Record<string, unknown>) {
    try {
      setCliResult(await api.runCli(payload));
    } catch (error) {
      showError(getErrorMessage(error));
    }
  }

  async function loadChatThreads() {
    try {
      const payload = await api.listChatThreads();
      setChatThreads(payload.threads);
      if (!activeThread && payload.threads[0]) {
        setActiveThread(payload.threads[0]);
      }
    } catch (error) {
      showError(getErrorMessage(error));
    }
  }

  async function createChatThread(title: string) {
    try {
      const result = await api.createChatThread({
        title,
        workspaceRoot: currentWorkspaceRoot,
        projectPath: workspace?.projectPath || '',
        model: workspace?.executionProfile.model || ''
      });
      setChatThreads((prev) => [result.thread, ...prev]);
      setActiveThread(result.thread);
      showSuccess('Chat thread created.');
    } catch (error) {
      showError(getErrorMessage(error));
    }
  }

  async function openChatThread(threadId: string) {
    try {
      const result = await api.getChatThread(threadId);
      setActiveThread(result.thread);
    } catch (error) {
      showError(getErrorMessage(error));
    }
  }

  async function sendChatMessage(threadId: string, message: string) {
    try {
      const result = await api.sendChatMessage(threadId, message);
      setActiveThread(result.thread);
      setChatThreads((prev) => prev.map((thread) => thread.id === result.thread.id ? result.thread : thread));
    } catch (error) {
      showError(getErrorMessage(error));
    }
  }

  useEffect(() => {
    void refreshBootstrap();
    void loadChatThreads();
  }, []);

  useEffect(() => {
    if (!banner) return;
    const timeout = window.setTimeout(() => setBanner(null), 8000);
    return () => window.clearTimeout(timeout);
  }, [banner]);

  useEffect(() => {
    if (!currentWorkspaceRoot) return;
    const interval = window.setInterval(() => {
      void loadRunsOnly({ silent: true });
    }, 30000);
    return () => window.clearInterval(interval);
  }, [currentWorkspaceRoot]);

  useEffect(() => {
    if (!currentRun || !currentWorkspaceRoot) return;
    streamRef.current?.close();
    const stream = new EventSource(`/api/runs/${encodeURIComponent(currentRun.runId)}/stream?workspaceRoot=${encodeURIComponent(currentWorkspaceRoot)}`);
    stream.addEventListener('snapshot', (event) => {
      const payload = JSON.parse((event as MessageEvent<string>).data) as RunSnapshot;
      setCurrentRun(payload);
    });
    stream.addEventListener('update', (event) => {
      const payload = JSON.parse((event as MessageEvent<string>).data) as RunSnapshot['runtime'] | { type: string; payload?: unknown; message?: string };
      if ('type' in payload && payload.type === 'runtime' && payload.payload) {
        setCurrentRun((prev) => patchRuntimeRun(prev, payload.payload as RunSnapshot['runtime']));
        void loadRunsOnly({ silent: true });
        if (['completed', 'waiting_auth', 'failed', 'stopped', 'paused'].includes((payload.payload as RunSnapshot['runtime']).state)) {
          void loadRun(currentRun.runId);
        }
        return;
      }
      if ('type' in payload && payload.type === 'coordination' && payload.payload) {
        setCurrentRun((prev) => patchCoordinationRun(prev, payload.payload as RunSnapshot['coordination']));
        const nextCoordination = payload.payload as RunSnapshot['coordination'];
        if (nextCoordination && ['completed', 'waiting_auth', 'paused', 'blocked', 'failed'].includes(nextCoordination.status)) {
          void loadRun(currentRun.runId);
        }
        return;
      }
      if ('type' in payload && payload.type === 'agent' && payload.payload) {
        setCurrentRun((prev) => patchAgentRun(prev, payload.payload as RunSnapshot['subAgents'][number]));
        return;
      }
      setCurrentRun((prev) => {
        if (!prev) return prev;
        const nextEvent = payload as unknown as RunSnapshot['events'][number];
        return {
          ...prev,
          events: [...prev.events, nextEvent].slice(-300)
        };
      });
    });
    stream.onerror = () => {
      stream.close();
    };
    streamRef.current = stream;
    return () => {
      stream.close();
    };
  }, [currentRun?.runId, currentWorkspaceRoot]);

  const value = useMemo<AppContextValue>(() => ({
    bootstrapped,
    selectedTab,
    bootstrap,
    workspace,
    workspaces,
    profiles,
    runs,
    currentRun,
    accounts,
    chatThreads,
    activeThread,
    cliPreview,
    cliResult,
    banner,
    accountNotice,
    loadingLabel,
    setSelectedTab,
    setBanner,
    setAccountNotice,
    refreshBootstrap,
    saveWorkspace,
    createWorkspace,
    saveProfile,
    deleteProfile,
    loadRun,
    createRun,
    startRun,
    pauseRun,
    resumeRun,
    stopRun,
    loginAccount,
    saveCurrentChatgptSession,
    switchAccount,
    verifyCurrentSession,
    checkCurrentUsage,
    refreshAccounts,
    logoutAccount,
    deleteAccount,
    previewCli,
    runCli,
    loadChatThreads,
    createChatThread,
    openChatThread,
    sendChatMessage
  }), [
    bootstrapped,
    selectedTab,
    bootstrap,
    workspace,
    workspaces,
    profiles,
    runs,
    currentRun,
    accounts,
    chatThreads,
    activeThread,
    cliPreview,
    cliResult,
    banner,
    accountNotice,
    loadingLabel
  ]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const value = useContext(AppContext);
  if (!value) throw new Error('useApp must be used inside AppProvider.');
  return value;
}
