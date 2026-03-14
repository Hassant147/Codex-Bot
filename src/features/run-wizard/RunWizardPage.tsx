import { useEffect, useMemo, useState } from 'react';
import { useApp } from '../../app/AppProvider';
import { PageHeader } from '../../shared-ui/PageHeader';
import { SectionCard } from '../../shared-ui/SectionCard';
import type { MultiAgentConfig } from '../../app/types';

const DEFAULT_MULTI_AGENT: MultiAgentConfig = {
  enabled: false,
  workerCount: 3,
  writeMode: 'scoped',
  isolation: 'worktree',
  mergeGate: 'manager_tests'
};

export function RunWizardPage() {
  const { bootstrap, workspace, createRun, saveWorkspace } = useApp();
  const [step, setStep] = useState(0);
  const [templateId, setTemplateId] = useState(bootstrap?.runTemplates[0]?.id || '');
  const selectedTemplate = useMemo(
    () => bootstrap?.runTemplates.find((template) => template.id === templateId) || bootstrap?.runTemplates[0] || null,
    [bootstrap?.runTemplates, templateId]
  );
  const [modeId, setModeId] = useState(selectedTemplate?.modeId || bootstrap?.modes[0]?.id || 'deep-scan');
  const [requestText, setRequestText] = useState(selectedTemplate?.request || '');
  const [scope, setScope] = useState('');
  const [scopeLevel, setScopeLevel] = useState(workspace?.scopeLevelDefault || 'module');
  const [scopeTargets, setScopeTargets] = useState('');
  const [projectPath, setProjectPath] = useState(workspace?.projectPath || '');
  const [workspaceRoot, setWorkspaceRoot] = useState(workspace?.workspaceRoot || '');
  const [multiAgent, setMultiAgent] = useState<MultiAgentConfig>(workspace?.executionProfile.multiAgent || DEFAULT_MULTI_AGENT);
  const canCreate = Boolean(workspaceRoot.trim() && projectPath.trim() && requestText.trim());

  const applyTemplate = (nextTemplateId: string) => {
    setTemplateId(nextTemplateId);
    const template = bootstrap?.runTemplates.find((item) => item.id === nextTemplateId);
    if (!template) return;
    setModeId(template.modeId);
    setRequestText(template.request);
  };

  useEffect(() => {
    if (!bootstrap?.runTemplates.length) return;
    if (!templateId) {
      const template = bootstrap.runTemplates[0];
      setTemplateId(template.id);
      setModeId(template.modeId);
      setRequestText((current) => current || template.request);
    }
  }, [bootstrap, templateId]);

  useEffect(() => {
    if (workspace?.workspaceRoot && !workspaceRoot) setWorkspaceRoot(workspace.workspaceRoot);
    if (workspace?.projectPath && !projectPath) setProjectPath(workspace.projectPath);
    if (workspace?.scopeLevelDefault && !scopeLevel) setScopeLevel(workspace.scopeLevelDefault);
  }, [workspace, workspaceRoot, projectPath, scopeLevel]);

  useEffect(() => {
    if (workspace?.executionProfile?.multiAgent) {
      setMultiAgent(workspace.executionProfile.multiAgent);
    }
  }, [workspace]);

  async function handleCreateRun() {
    await saveWorkspace({
      ...workspace,
      workspaceRoot,
      projectPath
    });
    await createRun({
      workspaceRoot,
      projectPath,
      mode: modeId,
      request: requestText,
      scope,
      scopeLevel,
      scopeTargets,
      multiAgent
    });
  }

  return (
    <div className="page-stack wizard-stack">
      <PageHeader
        title="Create Run"
        subtitle="A guided three-step wizard for non-technical operators."
      />

      <div className="wizard-steps">
        {['Choose outcome', 'Confirm scope', 'Review + start'].map((label, index) => (
          <button key={label} type="button" className={step === index ? 'wizard-step active' : 'wizard-step'} onClick={() => setStep(index)}>
            <span>{index + 1}</span>
            {label}
          </button>
        ))}
      </div>

      {step === 0 ? (
        <SectionCard title="Choose Outcome" description="Start from plain-language goals first." surface="primary" className="wizard-stage-card">
          <div className="template-grid">
            {bootstrap?.runTemplates.map((template) => (
              <button
                key={template.id}
                type="button"
                className={templateId === template.id ? 'template-card active' : 'template-card'}
                onClick={() => applyTemplate(template.id)}
              >
                <strong>{template.label}</strong>
                <span>{template.request}</span>
              </button>
            ))}
          </div>
          <details className="details-panel">
            <summary>Advanced job types</summary>
            <div className="advanced-mode-list">
              {bootstrap?.modes.map((mode) => (
                <button
                  key={mode.id}
                  type="button"
                  className={modeId === mode.id ? 'mode-card active' : 'mode-card'}
                  onClick={() => setModeId(mode.id)}
                >
                  <strong>{mode.label}</strong>
                  <span>{mode.summary}</span>
                </button>
              ))}
            </div>
          </details>
        </SectionCard>
      ) : null}

      {step === 1 ? (
        <SectionCard title="Confirm Scope" description="Confirm where the run should operate and how broad it should be." surface="operational" className="wizard-stage-card">
          <div className="form-grid">
            <label>
              <span>Workspace Root</span>
              <input value={workspaceRoot} onChange={(event) => setWorkspaceRoot(event.target.value)} />
            </label>
            <label>
              <span>Target Project</span>
              <input value={projectPath} onChange={(event) => setProjectPath(event.target.value)} />
            </label>
            <label>
              <span>Scope Level</span>
              <select value={scopeLevel} onChange={(event) => setScopeLevel(event.target.value)}>
                {bootstrap?.scopeLevels.map((level) => (
                  <option key={level.id} value={level.id}>{level.label}</option>
                ))}
              </select>
            </label>
            <label>
              <span>Scope Targets</span>
              <input
                placeholder="Comma-separated panels, folders, or modules"
                value={scopeTargets}
                onChange={(event) => setScopeTargets(event.target.value)}
              />
            </label>
          </div>
          <label>
            <span>Optional focused scope</span>
            <textarea value={scope} onChange={(event) => setScope(event.target.value)} rows={4} />
          </label>
          <div className="multi-agent-panel">
            <label className="multi-agent-toggle">
              <input
                type="checkbox"
                checked={multiAgent.enabled}
                onChange={(event) => setMultiAgent((current) => ({
                  ...current,
                  enabled: event.target.checked
                }))}
              />
              <div>
                <strong>Multi-Agent Mode</strong>
                <p>Manual premium toggle. Uses one manager plus 2-3 isolated Git worktrees.</p>
              </div>
            </label>
            {multiAgent.enabled ? (
              <label>
                <span>Worker count</span>
                <select
                  value={multiAgent.workerCount}
                  onChange={(event) => setMultiAgent((current) => ({
                    ...current,
                    workerCount: event.target.value === '2' ? 2 : 3
                  }))}
                >
                  <option value="2">2 workers</option>
                  <option value="3">3 workers</option>
                </select>
              </label>
            ) : null}
          </div>
        </SectionCard>
      ) : null}

      {step === 2 ? (
        <SectionCard title="Review + Start" description="Make the final request readable and explicit before creating the run." surface="operational" className="wizard-stage-card">
          <div className="review-grid">
            <div className="review-card">
              <span>Mode</span>
              <strong>{modeId}</strong>
            </div>
            <div className="review-card">
              <span>Workspace</span>
              <strong>{workspaceRoot || 'Not set'}</strong>
            </div>
            <div className="review-card">
              <span>Project</span>
              <strong>{projectPath || 'Not set'}</strong>
            </div>
            <div className="review-card">
              <span>Scope level</span>
              <strong>{scopeLevel}</strong>
            </div>
            <div className="review-card">
              <span>Execution mode</span>
              <strong>{multiAgent.enabled ? `Multi-agent (${multiAgent.workerCount} workers)` : 'Single-agent'}</strong>
            </div>
          </div>
          <label>
            <span>Final request</span>
            <textarea value={requestText} onChange={(event) => setRequestText(event.target.value)} rows={8} />
          </label>
          {multiAgent.enabled ? (
            <p className="status-copy">
              Multi-agent start requires a Git repository and a clean working tree. If preflight blocks the run, switch this toggle off and retry in single-agent mode.
            </p>
          ) : null}
          {!canCreate ? (
            <p className="status-copy">Set a workspace root, target project, and final request before creating the run.</p>
          ) : null}
        </SectionCard>
      ) : null}

      <div className="wizard-footer">
        <button type="button" className="btn btn-ghost" disabled={step === 0} onClick={() => setStep((value) => Math.max(value - 1, 0))}>
          Back
        </button>
        {step < 2 ? (
          <button type="button" className="btn btn-primary" onClick={() => setStep((value) => Math.min(value + 1, 2))}>
            Next
          </button>
        ) : (
          <button type="button" className="btn btn-primary" disabled={!canCreate} onClick={() => void handleCreateRun()}>
            Create
          </button>
        )}
      </div>
    </div>
  );
}
