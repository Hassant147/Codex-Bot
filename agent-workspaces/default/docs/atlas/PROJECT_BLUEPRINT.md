# Project Blueprint

Last refreshed: 2026-03-13

## Project purpose

Codex Project Bot GUI is a local-desktop operations product for managing Codex-powered project runs without requiring operators to work directly in the terminal. The product wraps the existing project-bot orchestration engine with a modular browser UI, a local Node API, persistent runtime state, and account recovery controls.

## High-level architecture

- Client: `React + TypeScript + Vite` single-page app under `src/`
- Server: local `Node + Express` API under `server/`
- Runtime: `RuntimeSupervisor` manages either one single-agent autopilot process or one coordinated manager-plus-workers fleet and emits SSE updates
- Execution engine: existing project-bot scripts and Codex CLI remain the execution core
- Durable state: local workspace docs, runs, timelines, chat threads, profiles, and runtime files under `agent-workspaces/`
- Secrets: saved API-key credentials are stored through the local macOS keychain integration

## Critical flows

### 1. App bootstrap
- `src/main.tsx` mounts the SPA.
- `src/app/AppProvider.tsx` loads `/api/app/bootstrap`.
- Bootstrap returns workspace config, saved workspaces, run history, current run, account state, and CLI capabilities.

### 2. Guided run creation
- `src/features/run-wizard/RunWizardPage.tsx` provides a 3-step flow:
  - choose outcome
  - confirm scope
  - review and create
- The wizard also exposes a manual `Multi-Agent Mode` toggle with `2` or `3` workers.
- The server creates a run through `ProjectBotService`, then attaches runtime metadata through `RunService`.

### 3. Live run monitoring
- `src/features/dashboard/DashboardPage.tsx` shows the current run, account health, and one ordered timeline.
- `/api/runs/:runId/stream` delivers SSE updates from `RuntimeSupervisor`.
- Runtime state is persisted to `runtime/status.json`, `runtime/events.jsonl`, `runtime/heartbeat.json`, and `runtime/command.json`.
- Multi-agent runs also persist `runtime/coordination.json`, per-agent status/event/assignment/worktree files, and `runtime/merge-report.json`.

### 3a. Coordinated multi-agent execution
- `server/services/runtime-supervisor.mjs` validates Git preflight, creates isolated worktrees, plans non-overlapping worker assignments, and pauses the entire run on quota/auth or repeated worker failure.
- `server/services/multi-agent-service.mjs` is the shared source of truth for coordination state, sub-agent summaries, assignment ownership, and merge-gate helpers.
- `server/services/git-service.mjs` owns Git preflight checks, worktree creation, diff enumeration, and manager patch application/reversal.

### 4. Pause, resume, and recovery
- Runs move through a strict lifecycle: `draft`, `queued`, `starting`, `running`, `paused`, `waiting_auth`, `stopping`, `stopped`, `failed`, `completed`.
- Quota or authentication errors detected from runtime output move the run into `waiting_auth`.
- Operators can recheck account status, reconnect the active account, switch saved accounts, and resume the same run.

### 5. Shared command execution
- The same command-building logic is used by the dashboard runtime path, the CLI screen, and other launch surfaces.
- `src/features/cli/CliPage.tsx` exposes the exact preview of the generated command before execution.

### 6. Account management
- `src/features/settings/SettingsPage.tsx` hosts the account center.
- `AccountService` manages saved profiles and active account state.
- `CodexService` parses provider-aware login status for `ChatGPT`, `API key`, or `unknown`.

## Ownership boundaries

- `src/app/*`: app bootstrap, global state, API client, shared types
- `src/features/*`: page-level product modules, including the current-run fleet view in `agents` and the multi-agent dashboard panel
- `src/shared-ui/*`: reusable UI system
- `server/routes/*`: HTTP API contract
- `server/services/*`: workspace, run, runtime, CLI, account, chat, and orchestration logic
- `agent-workspaces/*`: local product memory and operator data

## Product constraints

- This is a local-desktop product, not a hosted SaaS service.
- The project intentionally preserves compatibility aliases for older endpoints while the new SPA becomes the primary shell.
- Durable docs and run artifacts are stored outside the target project by default.
- Multi-agent mode is opt-in and blocked unless the target project is a clean Git working tree.
