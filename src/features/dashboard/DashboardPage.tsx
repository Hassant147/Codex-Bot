import { useApp } from '../../app/AppProvider';
import { PageHeader } from '../../shared-ui/PageHeader';
import { SectionCard } from '../../shared-ui/SectionCard';
import { StatusPill } from '../../shared-ui/StatusPill';
import { EmptyState } from '../../shared-ui/EmptyState';
import { Timeline } from '../../shared-ui/Timeline';

function toneForState(state?: string) {
  if (state === 'completed') return 'success';
  if (state === 'waiting_auth' || state === 'paused') return 'warning';
  if (state === 'failed') return 'error';
  return 'neutral';
}

function toneForAgent(agent: { health: string; status: string }) {
  if (agent.health === 'complete' || agent.status === 'completed') return 'success';
  if (agent.health === 'blocked' || agent.status === 'waiting_auth' || agent.status === 'paused') return 'warning';
  if (agent.health === 'error' || agent.status === 'failed') return 'error';
  return 'neutral';
}

export function DashboardPage() {
  const {
    currentRun,
    accounts,
    setSelectedTab,
    startRun,
    pauseRun,
    resumeRun,
    stopRun,
    switchAccount,
    refreshAccounts
  } = useApp();

  const showStart = currentRun && ['draft', 'stopped', 'failed'].includes(currentRun.runtime.state);
  const showPause = currentRun && ['running', 'starting', 'queued'].includes(currentRun.runtime.state);
  const showResume = currentRun && ['paused', 'waiting_auth'].includes(currentRun.runtime.state);
  const currentAccountOptions = accounts?.accounts || [];
  const activeSavedAccount = currentAccountOptions.find((account) => account.id === accounts?.activeAccountId) || null;

  if (!currentRun) {
    return (
      <div className="page-stack">
        <PageHeader
          title="Operations Home"
          subtitle="Create a guided run, confirm account readiness, and start from one clear path."
          actions={(
            <button type="button" className="btn btn-primary" onClick={() => setSelectedTab('create-run')}>
              Create
            </button>
          )}
        />

        <div className="dashboard-empty-grid">
          <SectionCard
            title="Start Here"
            description="The fastest path for a non-technical operator."
            accent="brand"
            surface="primary"
            className="dashboard-primary-card"
          >
            <EmptyState
              title="Create your next run"
              body="Use the guided wizard to choose an outcome, confirm the target project, and launch a clean tracked run."
              tone="primary"
              actions={(
                <div className="button-row">
                  <button type="button" className="btn btn-primary" onClick={() => setSelectedTab('create-run')}>
                    Create Run
                  </button>
                  <button type="button" className="btn btn-secondary" onClick={() => setSelectedTab('create-run')}>
                    Open Wizard
                  </button>
                  <button type="button" className="btn btn-ghost" onClick={() => setSelectedTab('settings')}>
                    View Account Readiness
                  </button>
                </div>
              )}
            />
          </SectionCard>

          <SectionCard
            title="Account Health"
            description="Make sure Codex is ready before you start work."
            accent={accounts?.currentSession.loggedIn ? 'success' : 'warning'}
            surface="operational"
          >
            <div className="metric-list">
              <div>
                <span>Current session</span>
                <strong>{accounts?.currentSession.loggedIn ? accounts.currentSession.method || 'Signed in' : 'Signed out'}</strong>
              </div>
              <div>
                <span>Status</span>
                <strong>{accounts?.currentSession.loggedIn ? 'Ready' : 'Action required'}</strong>
              </div>
              <div>
                <span>Saved profiles</span>
                <strong>{currentAccountOptions.length}</strong>
              </div>
              <div>
                <span>Active saved account</span>
                <strong>{activeSavedAccount?.name || 'Manual / unsaved'}</strong>
              </div>
            </div>
            <p className="helper-copy">If credits or login expire later, the run pauses and you can recover it from this dashboard.</p>
          </SectionCard>
        </div>

        <SectionCard
          title="How It Works"
          description="The product keeps the operator path simple."
          surface="supporting"
        >
          <ol className="simple-list dashboard-quick-steps">
            <li>Create a run from the wizard.</li>
            <li>Start it from the dashboard and follow live progress.</li>
            <li>Recover the same run if account or quota issues pause it.</li>
          </ol>
        </SectionCard>
      </div>
    );
  }

  return (
    <div className="page-stack">
      <PageHeader
        title="Operations Home"
        subtitle="Start work, follow live progress, and recover blocked runs from one clear surface."
        actions={(
          <button type="button" className="btn btn-primary" onClick={() => setSelectedTab('create-run')}>
            Create
          </button>
        )}
      />

      <div className="hero-grid has-run">
        <SectionCard
          title="Current Run"
          description="The run you are actively watching or recovering."
          accent="brand"
          surface="primary"
          className="hero-card-main"
          footer={currentRun ? (
            <div className="button-row">
              {showStart ? <button type="button" className="btn btn-primary" onClick={() => startRun(currentRun.runId)}>Start</button> : null}
              {showPause ? <button type="button" className="btn btn-secondary" onClick={() => pauseRun(currentRun.runId)}>Pause</button> : null}
              {showResume ? <button type="button" className="btn btn-primary" onClick={() => resumeRun(currentRun.runId)}>Resume</button> : null}
              {currentRun.runtime.state !== 'completed' ? (
                <button type="button" className="btn btn-danger" onClick={() => stopRun(currentRun.runId)}>
                  Stop
                </button>
              ) : null}
              <button type="button" className="btn btn-ghost" onClick={() => setSelectedTab('history')}>View Details</button>
            </div>
          ) : (
            <button type="button" className="btn btn-primary" onClick={() => setSelectedTab('create-run')}>Create a run</button>
          )}
        >
          {currentRun ? (
            <div className="metric-list">
              <div>
                <span>State</span>
                <strong>{currentRun.runtime.state}</strong>
              </div>
              <div>
                <span>Progress</span>
                <strong>{currentRun.summary.completed}/{currentRun.summary.total}</strong>
              </div>
              <div>
                <span>Target</span>
                <strong>{currentRun.state.projectPath || 'Not set'}</strong>
              </div>
              <div>
                <span>Next phase</span>
                <strong>{currentRun.summary.nextPhase?.title || 'Finished'}</strong>
              </div>
            </div>
          ) : (
            <EmptyState title="No run loaded" body="Create a run from the guided wizard, then return here to watch it live." />
          )}
        </SectionCard>

        <SectionCard
          title="Create New Run"
          description="Use the guided wizard instead of the full control surface."
          accent="neutral"
          surface="supporting"
          footer={<button type="button" className="btn btn-primary" onClick={() => setSelectedTab('create-run')}>Open Wizard</button>}
        >
          <ul className="simple-list">
            <li>Choose the outcome you want in plain language.</li>
            <li>Confirm project scope and execution profile.</li>
            <li>Review the final request before creating the run.</li>
          </ul>
        </SectionCard>

        <SectionCard
          title="Account Health"
          description="See whether Codex is ready, blocked, or needs a manual account switch."
          accent={accounts?.currentSession.loggedIn ? 'success' : 'warning'}
          surface="operational"
          footer={<button type="button" className="btn btn-ghost" onClick={() => setSelectedTab('settings')}>Switch Account</button>}
        >
          <div className="metric-list">
            <div>
              <span>Current session</span>
              <strong>{accounts?.currentSession.loggedIn ? accounts.currentSession.method || 'Signed in' : 'Signed out'}</strong>
            </div>
            <div>
              <span>Saved profiles</span>
              <strong>{currentAccountOptions.length}</strong>
            </div>
            <div>
              <span>Status</span>
              <strong>{accounts?.currentSession.loggedIn ? 'Ready' : 'Action required'}</strong>
            </div>
            <div>
              <span>Active saved account</span>
              <strong>{activeSavedAccount?.name || 'Manual / unsaved'}</strong>
            </div>
          </div>
        </SectionCard>
      </div>

      {currentRun?.runtime.state === 'waiting_auth' ? (
        <SectionCard
          title="Run Recovery"
          description="Run paused for account recovery."
          accent="warning"
          surface="operational"
          className="recovery-card"
          footer={(
            <div className="button-row">
              {activeSavedAccount ? (
                <button type="button" className="btn btn-primary" onClick={() => refreshAccounts().then(() => switchAccount(activeSavedAccount.id, currentRun.runId))}>
                  Reconnect Active Account
                </button>
              ) : null}
              {currentAccountOptions.map((account) => (
                <button
                  key={account.id}
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => switchAccount(account.id, currentRun.runId)}
                >
                  Switch to {account.name}
                </button>
              ))}
              <button type="button" className="btn btn-primary" onClick={() => resumeRun(currentRun.runId)}>
                Resume
              </button>
              <button type="button" className="btn btn-ghost" onClick={() => refreshAccounts()}>
                Recheck Status
              </button>
            </div>
          )}
        >
          <p className="status-copy">
            <StatusPill tone={toneForState(currentRun.runtime.state)}>{currentRun.runtime.state}</StatusPill>
            <span>{currentRun.runtime.blockingIssue?.message || 'The runtime requested account recovery.'}</span>
          </p>
        </SectionCard>
      ) : null}

      {currentRun?.state.multiAgent?.enabled ? (
        <SectionCard
          title="Agent Fleet"
          description="Manager and scoped workers executing inside one coordinated run."
          accent={currentRun.coordination?.status === 'waiting_auth' || currentRun.coordination?.status === 'blocked' ? 'warning' : 'brand'}
          surface="operational"
        >
          <div className="fleet-summary">
            <div className="review-card">
              <span>Fleet status</span>
              <strong>{currentRun.coordination?.status || 'idle'}</strong>
            </div>
            <div className="review-card">
              <span>Current phase</span>
              <strong>{currentRun.coordination?.activePhase || 'ready'}</strong>
            </div>
            <div className="review-card">
              <span>Workers</span>
              <strong>{currentRun.state.multiAgent.workerCount}</strong>
            </div>
          </div>
          <div className="fleet-grid">
            {currentRun.subAgents.length ? currentRun.subAgents.map((agent) => (
              <article key={agent.agentId} className="fleet-card">
                <div className="fleet-card-top">
                  <strong>{agent.label}</strong>
                  <StatusPill tone={toneForAgent(agent)}>{agent.status}</StatusPill>
                </div>
                <div className="fleet-meta">
                  <span>{agent.phase}</span>
                  <span>{agent.health}</span>
                </div>
                <p className="fleet-ownership">
                  {agent.ownership.length ? agent.ownership.join(', ') : 'Global coordination and merge gate'}
                </p>
              </article>
            )) : (
              <EmptyState title="Fleet not started yet" body="Create and start the run to see manager and worker health here." />
            )}
          </div>
        </SectionCard>
      ) : null}

      <div className="dashboard-grid">
        <SectionCard title="Live Timeline" description="One ordered timeline for runtime events and log output." surface="operational">
          {currentRun ? <Timeline events={currentRun.events} /> : <EmptyState title="No timeline yet" body="Start a run to see status changes and output here." />}
        </SectionCard>
        <SectionCard title="Run Summary" description="Readable phase output and completion notes." surface="supporting">
          {currentRun?.runSummary ? <pre className="code-panel">{currentRun.runSummary}</pre> : <EmptyState title="No summary yet" body="Summaries appear once the run starts producing results." />}
        </SectionCard>
      </div>

      <SectionCard title="Next Prompt" description="Continuation prompt preserved for manual recovery or handoff." surface="supporting">
        {currentRun?.nextPrompt ? <pre className="code-panel">{currentRun.nextPrompt}</pre> : <EmptyState title="No next prompt yet" body="Prompt handoff will appear as the run advances." />}
      </SectionCard>
    </div>
  );
}
