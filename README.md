# Codex Project Bot GUI

Local-desktop control surface for the Codex project-bot workflow. The app now uses a modular `React + TypeScript + Vite` client and a modular Node/Express backend with a persistent runtime supervisor, SSE-based live run updates, and a local account center for manual API-key and browser-login account switching.

## Architecture

- `src/`: React/Vite client with modular feature areas for dashboard, run wizard, history, agents, CLI, chat, and settings.
- `server/`: Express API, workspace/profile services, Codex/CLI services, runtime supervisor, chat service, and compatibility aliases.
- `bin/run-orchestration-autopilot.sh`: existing execution engine wrapper used by the runtime supervisor.
- `agent-workspaces/`: durable external docs, runs, chat history, account metadata, and workspace state.

## Core Product Changes

- Guided home dashboard with clear `Create`, `Start`, `Pause`, `Resume`, `Stop`, `View Details`, and `Switch Account` actions.
- Three-step run wizard that defaults to plain-language outcomes and keeps advanced modes behind an expandable section.
- Manual `Multi-Agent Mode` in the wizard with one manager plus `2` or `3` isolated Git worktree workers.
- Persistent per-run runtime state under `runtime/status.json`, `runtime/events.jsonl`, `runtime/heartbeat.json`, and `runtime/command.json`.
- Coordinated multi-agent runtime artifacts under `runtime/coordination.json`, `runtime/agents/*`, and `runtime/merge-report.json`.
- SSE live updates for run status and ordered runtime/log events.
- Account center with provider-aware session detection, manual API-key profile switching, and saved ChatGPT browser-login snapshots backed by the macOS keychain.
- Unified command preview and execution model across dashboard, agents, and CLI surfaces.

## Scripts

```bash
npm run dev        # Vite client + Node API in parallel
npm run build      # Production client build
npm run serve      # Start the Node server against the built client
npm start          # Build then serve
npm test           # Unit + integration tests (Vitest)
npm run test:e2e   # Playwright smoke tests
```

The production app serves on `http://localhost:4311`.

## Notes

- The GUI still uses the existing global project-bot engine at `/Users/macbook/.codex/skills/project-autopilot-manager/scripts/project_orchestrate.mjs`.
- Reports and durable bot memory remain outside the target repo by default.
- The default workspace seed is now generic; project-specific paths must be set explicitly in Settings or the run wizard.
- Multi-agent start is blocked unless the target project is a Git repo with a clean working tree; single-agent behavior is unchanged.
- Browser-login account switching depends on Codex exposing a readable `~/.codex/auth.json` on the current machine.
- Browser-login switching is manual only. The app does not auto-rotate accounts after usage limits are hit.
- Exact remaining Codex quota is not shown for every saved account. Use Codex `/status` for the active session.
