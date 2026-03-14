import type { ReactNode } from 'react';
import { useApp } from '../../app/AppProvider';
import type { RuntimeState, TabId } from '../../app/types';
import { StatusPill } from '../../shared-ui/StatusPill';

function toneForRuntime(state?: RuntimeState) {
  switch (state) {
    case 'completed':
      return 'success';
    case 'waiting_auth':
    case 'paused':
      return 'warning';
    case 'failed':
      return 'error';
    case 'running':
    case 'starting':
    case 'queued':
      return 'neutral';
    default:
      return 'neutral';
  }
}

function toneForSession(loggedIn?: boolean) {
  return loggedIn ? 'success' : 'warning';
}

function workspaceLabel(workspaceRoot = '') {
  if (!workspaceRoot) return 'Workspace not set';
  const parts = workspaceRoot.split('/').filter(Boolean);
  return parts.at(-1) || workspaceRoot;
}

export function AppShell({ children }: { children: ReactNode }) {
  const { bootstrap, workspace, selectedTab, setSelectedTab, currentRun, accounts, banner, loadingLabel } = useApp();
  const tabs = bootstrap?.tabs || [];

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand-lockup">
          <div className="brand-mark">CP</div>
          <div>
            <p className="eyebrow">Professional Run Console</p>
            <strong>Codex Project Bot</strong>
            <p className="brand-meta">Workspace: {workspaceLabel(workspace?.workspaceRoot)}</p>
          </div>
        </div>
        <nav className="nav-tabs" aria-label="Primary">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={selectedTab === tab.id ? 'tab-button active' : 'tab-button'}
              onClick={() => setSelectedTab(tab.id as TabId)}
            >
              {tab.label}
            </button>
          ))}
        </nav>
        <div className="topbar-pills">
          <StatusPill tone={toneForSession(accounts?.currentSession.loggedIn)}>
            {accounts?.currentSession.loggedIn ? `Signed in · ${accounts.currentSession.method || 'Codex'}` : 'Account attention needed'}
          </StatusPill>
          <StatusPill tone={toneForRuntime(currentRun?.runtime.state)}>
            {currentRun ? `${currentRun.runtime.state} · current run` : 'No active run'}
          </StatusPill>
        </div>
      </header>
      {banner ? <div className={`banner tone-${banner.tone}`}>{banner.message}</div> : null}
      {loadingLabel ? <div className="loading-rail">{loadingLabel}…</div> : null}
      <main className="page-shell">{children}</main>
    </div>
  );
}
