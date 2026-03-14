import { useState } from 'react';
import { useApp } from '../../app/AppProvider';
import { PageHeader } from '../../shared-ui/PageHeader';
import { SectionCard } from '../../shared-ui/SectionCard';
import { StatusPill } from '../../shared-ui/StatusPill';

function toneForAgent(agent: { health: string; status: string }) {
  if (agent.health === 'complete' || agent.status === 'completed') return 'success';
  if (agent.health === 'blocked' || agent.status === 'waiting_auth' || agent.status === 'paused') return 'warning';
  if (agent.health === 'error' || agent.status === 'failed') return 'error';
  return 'neutral';
}

export function AgentsPage() {
  const { bootstrap, currentRun, runs, startRun, pauseRun, stopRun } = useApp();
  const [selected, setSelected] = useState<string[]>([]);
  const modeLabel = new Map((bootstrap?.modes || []).map((mode) => [mode.id, mode.label]));

  const toggle = (runId: string) => {
    setSelected((prev) => prev.includes(runId) ? prev.filter((item) => item !== runId) : [...prev, runId]);
  };

  return (
    <div className="page-stack">
      <PageHeader title="Agents" subtitle="Inspect the current run fleet first, then use saved-run batch controls below it." />
      <SectionCard
        title="Current Run Fleet"
        description="Manager and worker ownership for the run you are actively supervising."
        surface="supporting"
      >
        {currentRun?.state.multiAgent?.enabled ? (
          <div className="fleet-grid">
            {currentRun.subAgents.map((agent) => (
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
            ))}
          </div>
        ) : (
          <p className="inline-notice">No coordinated run loaded. Multi-agent fleet details appear here only when the current run was created with Multi-Agent Mode enabled.</p>
        )}
      </SectionCard>
      <SectionCard
        title="Batch Controls"
        description="Select runs and start, pause, or stop them together."
        surface="operational"
        footer={(
          <div className="button-row">
            <button type="button" className="btn btn-primary" onClick={() => Promise.all(selected.map((runId) => startRun(runId))).catch(console.error)}>Start</button>
            <button type="button" className="btn btn-secondary" onClick={() => Promise.all(selected.map((runId) => pauseRun(runId))).catch(console.error)}>Pause</button>
            <button type="button" className="btn btn-danger" onClick={() => Promise.all(selected.map((runId) => stopRun(runId))).catch(console.error)}>Stop</button>
          </div>
        )}
      >
        <div className="agent-grid">
          {runs.map((run) => (
            <label key={run.runId} className="agent-row">
              <div className="agent-row-main">
                <input type="checkbox" checked={selected.includes(run.runId)} onChange={() => toggle(run.runId)} />
                <div>
                  <strong>{modeLabel.get(run.state.mode) || run.state.mode}</strong>
                  <p>{run.runId}</p>
                </div>
              </div>
              <StatusPill tone={run.runtime.state === 'completed' ? 'success' : run.runtime.state === 'failed' ? 'error' : 'neutral'}>
                {run.runtime.state}
              </StatusPill>
            </label>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
