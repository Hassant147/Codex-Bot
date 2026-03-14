import { useEffect, useState } from 'react';
import { useApp } from '../../app/AppProvider';
import { PageHeader } from '../../shared-ui/PageHeader';
import { SectionCard } from '../../shared-ui/SectionCard';
import { StatusPill } from '../../shared-ui/StatusPill';

function shortFingerprint(fingerprint = '') {
  if (!fingerprint) return 'No fingerprint';
  return `${fingerprint.slice(0, 8)}...${fingerprint.slice(-6)}`;
}

function shortAccountId(accountId = '') {
  if (!accountId) return 'Unavailable';
  return `${accountId.slice(0, 8)}...${accountId.slice(-6)}`;
}

function formatPercentLeft(value: number | null | undefined) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return 'Unavailable';
  return `${numeric}% left`;
}

function formatDateTime(value = '') {
  if (!value) return 'Unavailable';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return 'Unavailable';
  return parsed.toLocaleString();
}

const FALLBACK_AUTH_STORAGE = {
  authFilePath: '~/.codex/auth.json',
  authFileExists: false,
  supportsChatgptSnapshots: false
};

export function SettingsPage() {
  const {
    workspace,
    saveWorkspace,
    workspaces,
    createWorkspace,
    profiles,
    saveProfile,
    deleteProfile,
    accounts,
    loginAccount,
    saveCurrentChatgptSession,
    switchAccount,
    verifyCurrentSession,
    checkCurrentUsage,
    refreshAccounts,
    refreshBootstrap,
    logoutAccount,
    deleteAccount,
    accountNotice
  } = useApp();
  const [workspaceName, setWorkspaceName] = useState('new-workspace');
  const [profileName, setProfileName] = useState('New Profile');
  const [chatgptAccountName, setChatgptAccountName] = useState('Browser Login');
  const [apiKeyName, setApiKeyName] = useState('Primary API Key');
  const [apiKey, setApiKey] = useState('');
  const [workspaceDraft, setWorkspaceDraft] = useState(workspace);

  const authStorage = accounts?.capabilities?.authStorage || FALLBACK_AUTH_STORAGE;
  const browserAccounts = accounts?.accounts.filter((account) => account.kind === 'chatgpt-snapshot') || [];
  const apiKeyAccounts = accounts?.accounts.filter((account) => account.kind === 'api-key') || [];
  const activeSavedAccount = accounts?.accounts.find((account) => account.id === accounts?.activeAccountId) || null;
  const currentUsage = accounts?.currentUsage || null;
  const canSaveBrowserSession = Boolean(
    authStorage.supportsChatgptSnapshots
      && accounts?.currentSession.loggedIn
      && accounts?.currentSession.provider === 'chatgpt'
  );
  const browserSaveReason = !authStorage.supportsChatgptSnapshots
    ? `Browser snapshots are unavailable because ${authStorage.authFilePath} is not readable on this machine.`
    : !accounts?.currentSession.loggedIn
      ? 'Verify or recheck the current Codex session first.'
      : accounts?.currentSession.provider !== 'chatgpt'
        ? 'The active Codex session is not a browser-based ChatGPT login.'
        : 'Ready to save the current browser login.';

  useEffect(() => {
    setWorkspaceDraft(workspace);
  }, [workspace]);

  if (!workspace || !workspaceDraft) return null;

  return (
    <div className="page-stack">
      <PageHeader title="Settings" subtitle="Manage workspace defaults, account health, saved sessions, and reusable setup profiles." />

      <div className="dashboard-grid settings-grid">
        <SectionCard
          title="Workspace Defaults"
          description="Stored defaults for new runs, dashboard launches, and CLI actions."
          surface="primary"
          footer={<button type="button" className="btn btn-primary" onClick={() => void saveWorkspace(workspaceDraft)}>Save Workspace</button>}
        >
          <div className="form-grid">
            <label>
              <span>Workspace Root</span>
              <input value={workspaceDraft.workspaceRoot} onChange={(event) => setWorkspaceDraft({ ...workspaceDraft, workspaceRoot: event.target.value })} />
            </label>
            <label>
              <span>Project Path</span>
              <input value={workspaceDraft.projectPath} onChange={(event) => setWorkspaceDraft({ ...workspaceDraft, projectPath: event.target.value })} />
            </label>
            <label>
              <span>Default Scope Level</span>
              <input value={workspaceDraft.scopeLevelDefault} onChange={(event) => setWorkspaceDraft({ ...workspaceDraft, scopeLevelDefault: event.target.value })} />
            </label>
            <label>
              <span>Codex Profile</span>
              <input value={workspaceDraft.executionProfile.profile} onChange={(event) => setWorkspaceDraft({
                ...workspaceDraft,
                executionProfile: { ...workspaceDraft.executionProfile, profile: event.target.value }
              })} />
            </label>
            <label className="multi-agent-toggle-inline">
              <span>Default Multi-Agent</span>
              <input
                type="checkbox"
                checked={workspaceDraft.executionProfile.multiAgent.enabled}
                onChange={(event) => setWorkspaceDraft({
                  ...workspaceDraft,
                  executionProfile: {
                    ...workspaceDraft.executionProfile,
                    multiAgent: {
                      ...workspaceDraft.executionProfile.multiAgent,
                      enabled: event.target.checked
                    }
                  }
                })}
              />
            </label>
            <label>
              <span>Default Workers</span>
              <select
                value={workspaceDraft.executionProfile.multiAgent.workerCount}
                onChange={(event) => setWorkspaceDraft({
                  ...workspaceDraft,
                  executionProfile: {
                    ...workspaceDraft.executionProfile,
                    multiAgent: {
                      ...workspaceDraft.executionProfile.multiAgent,
                      workerCount: event.target.value === '2' ? 2 : 3
                    }
                  }
                })}
              >
                <option value="2">2 workers</option>
                <option value="3">3 workers</option>
              </select>
            </label>
          </div>
          <label>
            <span>Global Rules</span>
            <textarea rows={6} value={workspaceDraft.globalRules} onChange={(event) => setWorkspaceDraft({ ...workspaceDraft, globalRules: event.target.value })} />
          </label>
        </SectionCard>

        <SectionCard
          title="Current Account Health"
          description="Check the active Codex session and its latest local usage snapshot before starting or resuming a run."
          accent={accounts?.currentSession.loggedIn ? 'success' : 'warning'}
          surface="operational"
          footer={(
            <div className="button-row">
              <button type="button" className="btn btn-primary" onClick={() => void checkCurrentUsage()}>
                Check Current Limit
              </button>
              <button type="button" className="btn btn-primary" onClick={() => void verifyCurrentSession()}>
                Verify Current Session
              </button>
              <button type="button" className="btn btn-secondary" onClick={() => void refreshAccounts()}>
                Recheck Status
              </button>
              <button type="button" className="btn btn-ghost" onClick={() => void logoutAccount()}>
                Log Out
              </button>
            </div>
          )}
        >
          <p className="status-copy">
            <StatusPill tone={accounts?.currentSession.loggedIn ? 'success' : 'warning'}>
              {accounts?.currentSession.loggedIn ? 'Ready' : 'Action required'}
            </StatusPill>
            <span>{accounts?.currentSession.method || 'No active Codex session detected.'}</span>
          </p>

          <div className="account-summary-grid">
            <article className="mini-card">
              <span>Active saved account</span>
              <strong>{activeSavedAccount?.name || 'Not matched yet'}</strong>
            </article>
            <article className="mini-card">
              <span>Browser snapshots</span>
              <strong>{browserAccounts.length}</strong>
            </article>
            <article className="mini-card">
              <span>API key profiles</span>
              <strong>{apiKeyAccounts.length}</strong>
            </article>
            <article className="mini-card">
              <span>Codex binary</span>
              <strong>{accounts?.capabilities?.available ? accounts.capabilities.binary : 'Unavailable'}</strong>
            </article>
            <article className="mini-card">
              <span>Browser snapshot support</span>
              <strong>{authStorage.supportsChatgptSnapshots ? 'Supported' : 'Unavailable'}</strong>
            </article>
            <article className="mini-card">
              <span>Auth storage path</span>
              <strong>{authStorage.authFilePath}</strong>
            </article>
          </div>

          {accountNotice ? (
            <div className={`account-notice tone-${accountNotice.tone}`}>
              <strong>Account action</strong>
              <p>{accountNotice.message}</p>
            </div>
          ) : null}

          <div className="quick-steps">
            <strong>Simple flow</strong>
            <ol>
              <li>Switch to the account you want to use.</li>
              <li>Click <code>Check Current Limit</code>.</li>
              <li>The app now runs an automatic CLI limit probe for the selected account.</li>
            </ol>
          </div>

          <div className={`usage-note tone-${currentUsage?.freshForCurrentLogin ? 'success' : 'warning'}`}>
            <strong>Current limit snapshot</strong>
            {currentUsage ? (
              <p>
                {currentUsage.freshForCurrentLogin
                  ? `Showing the latest local Codex usage snapshot for ${currentUsage.accountEmail || 'the active account'}.`
                  : 'No fresh live snapshot exists for this account right now. Showing the last saved snapshot for the selected account.'}
              </p>
            ) : (
              <p>No account-specific usage snapshot yet. The automatic CLI probe did not produce a rate-limit event for this account.</p>
            )}
          </div>

          {currentUsage ? (
            <div className="usage-grid">
              <article className="mini-card">
                <span>Account email</span>
                <strong>{currentUsage.accountEmail || 'Unavailable'}</strong>
              </article>
              <article className="mini-card">
                <span>Plan</span>
                <strong>{currentUsage.planType || 'Unavailable'}</strong>
              </article>
              <article className="mini-card">
                <span>Snapshot time</span>
                <strong>{formatDateTime(currentUsage.capturedAt || '')}</strong>
              </article>
              <article className="mini-card">
                <span>5h limit</span>
                <strong>{formatPercentLeft(currentUsage.primary?.leftPercent)}</strong>
              </article>
              <article className="mini-card">
                <span>5h reset</span>
                <strong>{formatDateTime(currentUsage.primary?.resetAt || '')}</strong>
              </article>
              <article className="mini-card">
                <span>Weekly limit</span>
                <strong>{formatPercentLeft(currentUsage.secondary?.leftPercent)}</strong>
              </article>
              <article className="mini-card">
                <span>Weekly reset</span>
                <strong>{formatDateTime(currentUsage.secondary?.resetAt || '')}</strong>
              </article>
              <article className="mini-card">
                <span>Local source</span>
                <strong>{currentUsage.source}</strong>
              </article>
            </div>
          ) : null}

          <p className="helper-copy">If a run pauses for quota or authentication, recover it from the dashboard by reconnecting or switching accounts, then resume the same run.</p>
          <div className="button-row">
            <a className="btn btn-secondary" href="https://chatgpt.com/codex/settings/usage" target="_blank" rel="noreferrer">
              Open Usage Dashboard
            </a>
          </div>
        </SectionCard>
      </div>

      <SectionCard
        title="Browser Login Snapshots"
        description="Save the current ChatGPT browser login so you can switch back to it later."
        surface="operational"
        footer={(
          <div className="button-row">
            <button
              type="button"
              className="btn btn-primary"
              disabled={!canSaveBrowserSession}
              onClick={() => void saveCurrentChatgptSession(chatgptAccountName)}
            >
              Save Current Browser Login
            </button>
          </div>
        )}
      >
        <div className="form-grid">
          <label>
            <span>Snapshot name</span>
            <input value={chatgptAccountName} onChange={(event) => setChatgptAccountName(event.target.value)} />
          </label>
        </div>
        <p className="helper-copy">{browserSaveReason}</p>
        <div className="account-list">
          {browserAccounts.length ? browserAccounts.map((account) => (
            <article key={account.id} className="account-card">
              <div>
                <strong>{account.name}</strong>
                <p>Browser login snapshot {accounts?.activeAccountId === account.id ? '· active' : ''}</p>
                <div className="account-identity-list">
                  <p><span>Verified email</span><strong>{account.identityEmail || 'Unavailable'}</strong></p>
                  <p><span>OpenAI account ID</span><strong>{shortAccountId(account.identityAccountId)}</strong></p>
                </div>
                <p>Snapshot ID: {shortFingerprint(account.snapshotFingerprint)}</p>
                <p>{account.lastCheckMessage || 'Not verified yet.'}</p>
              </div>
              <div className="button-row">
                <button type="button" className="btn btn-secondary" onClick={() => void switchAccount(account.id)}>
                  {accounts?.activeAccountId === account.id ? 'Active Now' : 'Switch Account'}
                </button>
                <button type="button" className="btn btn-ghost" onClick={() => void deleteAccount(account.id)}>Remove</button>
              </div>
            </article>
          )) : (
            <p className="inline-notice">No browser-login snapshots saved yet.</p>
          )}
        </div>
      </SectionCard>

      <SectionCard
        title="API Key Profiles"
        description="Keep API-key accounts as fallbacks or usage-based billing profiles."
        surface="supporting"
        footer={(
          <div className="button-row">
            <button type="button" className="btn btn-primary" onClick={() => void loginAccount(apiKeyName, apiKey, true)}>
              Save + Sign In
            </button>
          </div>
        )}
      >
        <div className="form-grid">
          <label>
            <span>Profile name</span>
            <input value={apiKeyName} onChange={(event) => setApiKeyName(event.target.value)} />
          </label>
          <label>
            <span>API key</span>
            <input type="password" value={apiKey} onChange={(event) => setApiKey(event.target.value)} />
          </label>
        </div>
        <div className="account-list">
          {apiKeyAccounts.length ? apiKeyAccounts.map((account) => (
            <article key={account.id} className="account-card">
              <div>
                <strong>{account.name}</strong>
                <p>API key profile {accounts?.activeAccountId === account.id ? '· active' : ''}</p>
                <p>{account.lastCheckMessage || 'Not verified yet.'}</p>
              </div>
              <div className="button-row">
                <button type="button" className="btn btn-secondary" onClick={() => void switchAccount(account.id)}>
                  {accounts?.activeAccountId === account.id ? 'Active Now' : 'Switch Account'}
                </button>
                <button type="button" className="btn btn-ghost" onClick={() => void deleteAccount(account.id)}>Remove</button>
              </div>
            </article>
          )) : (
            <p className="inline-notice">No API-key profiles saved yet.</p>
          )}
        </div>
      </SectionCard>

      <div className="dashboard-grid">
        <SectionCard
          title="Workspace Library"
          description="Separate durable workspaces for each project or client."
          surface="supporting"
          footer={(
            <div className="button-row">
              <input value={workspaceName} onChange={(event) => setWorkspaceName(event.target.value)} />
              <button type="button" className="btn btn-primary" onClick={() => void createWorkspace(workspaceName)}>Create</button>
            </div>
          )}
        >
          <div className="simple-grid">
            {workspaces.map((item) => (
              <article key={item.id} className="mini-card">
                <strong>{item.name}</strong>
                <p>{item.projectPath || 'No project set'}</p>
                <div className="button-row">
                  <button type="button" className="btn btn-secondary" onClick={() => void refreshBootstrap(item.workspaceRoot)}>
                    Open
                  </button>
                </div>
              </article>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          title="Project Profiles"
          description="Reusable workspace and project combinations for faster setup."
          surface="supporting"
          footer={<button type="button" className="btn btn-primary" onClick={() => void saveProfile({ name: profileName })}>Save Current as Profile</button>}
        >
          <div className="button-row">
            <input value={profileName} onChange={(event) => setProfileName(event.target.value)} />
          </div>
          <div className="simple-grid">
            {profiles.map((profile) => (
              <article key={profile.id} className="mini-card">
                <strong>{profile.name}</strong>
                <p>{profile.projectPath}</p>
                <div className="button-row">
                  <button type="button" className="btn btn-secondary" onClick={() => void saveWorkspace({
                    ...workspaceDraft,
                    workspaceRoot: profile.workspaceRoot,
                    projectPath: profile.projectPath,
                    scopeLevelDefault: profile.scopeLevelDefault,
                    globalRules: profile.globalRules,
                    executionProfile: profile.executionProfile
                  })}>
                    Apply
                  </button>
                  <button type="button" className="btn btn-ghost" onClick={() => void deleteProfile(profile.id)}>Delete</button>
                </div>
              </article>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
