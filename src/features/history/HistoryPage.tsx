import { useApp } from '../../app/AppProvider';
import { PageHeader } from '../../shared-ui/PageHeader';
import { SectionCard } from '../../shared-ui/SectionCard';
import { EmptyState } from '../../shared-ui/EmptyState';
import { StatusPill } from '../../shared-ui/StatusPill';

export function HistoryPage() {
  const { bootstrap, runs, loadRun, setSelectedTab } = useApp();
  const modeLabel = new Map((bootstrap?.modes || []).map((mode) => [mode.id, mode.label]));

  return (
    <div className="page-stack">
      <PageHeader title="History" subtitle="Load any prior run and continue from its saved state." />
      <SectionCard title="Saved Runs" description="Newest runs appear first.">
        {runs.length ? (
          <div className="run-list">
            {runs.map((run) => (
              <article key={run.runId} className="run-card">
                <div className="run-card-top">
                  <div>
                    <strong>{modeLabel.get(run.state.mode) || run.state.mode}</strong>
                    <p>{run.state.projectPath || 'No project set'}</p>
                  </div>
                  <StatusPill tone={run.runtime.state === 'completed' ? 'success' : run.runtime.state === 'failed' ? 'error' : 'neutral'}>
                    {run.runtime.state}
                  </StatusPill>
                </div>
                <p className="run-progress">{run.summary.completed}/{run.summary.total} phases completed</p>
                <p className="run-progress">{run.updatedAt ? `Updated ${new Date(run.updatedAt).toLocaleString()}` : `Run ID ${run.runId}`}</p>
                <div className="button-row">
                  <button type="button" className="btn btn-primary" onClick={() => void loadRun(run.runId).then(() => setSelectedTab('dashboard'))}>
                    View Details
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <EmptyState title="No runs yet" body="Use the create-run wizard to generate your first tracked run." />
        )}
      </SectionCard>
    </div>
  );
}
