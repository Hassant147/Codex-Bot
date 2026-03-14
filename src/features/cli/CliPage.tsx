import { useMemo, useState } from 'react';
import { useApp } from '../../app/AppProvider';
import { PageHeader } from '../../shared-ui/PageHeader';
import { SectionCard } from '../../shared-ui/SectionCard';

export function CliPage() {
  const { capabilities, cliPreview, cliResult, previewCli, runCli, workspace } = useApp();
  const [command, setCommand] = useState('exec');
  const [subcommand, setSubcommand] = useState('');
  const [prompt, setPrompt] = useState('');
  const [cwd, setCwd] = useState(workspace?.projectPath || '');
  const [model, setModel] = useState(workspace?.executionProfile.model || '');
  const [extraArgs, setExtraArgs] = useState('');

  const payload = useMemo(() => ({
    command,
    subcommand,
    prompt,
    cwd,
    model,
    extraArgs,
    profile: workspace?.executionProfile.profile || '',
    searchEnabled: workspace?.executionProfile.searchEnabled || false
  }), [command, subcommand, prompt, cwd, model, extraArgs, workspace]);

  return (
    <div className="page-stack">
      <PageHeader title="Codex CLI" subtitle="Preview the exact command before you execute it." />
      <div className="dashboard-grid">
        <SectionCard
          title="Command Builder"
          description="Use the shared command builder used by dashboard and agents."
          footer={(
            <div className="button-row">
              <button type="button" className="btn btn-secondary" onClick={() => void previewCli(payload)}>Preview</button>
              <button type="button" className="btn btn-primary" onClick={() => void runCli(payload)}>Run</button>
            </div>
          )}
        >
          <div className="form-grid">
            <label>
              <span>Command</span>
              <select value={command} onChange={(event) => setCommand(event.target.value)}>
                {capabilities?.commands.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </label>
            <label>
              <span>Subcommand</span>
              <input value={subcommand} onChange={(event) => setSubcommand(event.target.value)} />
            </label>
            <label>
              <span>Project path</span>
              <input value={cwd} onChange={(event) => setCwd(event.target.value)} />
            </label>
            <label>
              <span>Model</span>
              <input value={model} onChange={(event) => setModel(event.target.value)} />
            </label>
          </div>
          <label>
            <span>Prompt</span>
            <textarea rows={8} value={prompt} onChange={(event) => setPrompt(event.target.value)} />
          </label>
          <label>
            <span>Extra args</span>
            <input value={extraArgs} onChange={(event) => setExtraArgs(event.target.value)} />
          </label>
        </SectionCard>

        <SectionCard title="Preview" description="Exact command line before execution.">
          <pre className="code-panel">{cliPreview ? `${cliPreview.binary} ${cliPreview.args.join(' ')}` : 'Preview a command to inspect it here.'}</pre>
        </SectionCard>
      </div>

      <SectionCard title="Result" description="Raw stdout and stderr from the executed command.">
        <pre className="code-panel">{cliResult ? `exit ${cliResult.code}\n\nSTDOUT\n${cliResult.stdout || '(empty)'}\n\nSTDERR\n${cliResult.stderr || '(empty)'}` : 'Run a command to see output.'}</pre>
      </SectionCard>
    </div>
  );
}
