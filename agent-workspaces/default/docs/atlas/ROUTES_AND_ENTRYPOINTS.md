# Routes and Entrypoints

Last refreshed: 2026-03-13

## Frontend entrypoints

- `index.html`: Vite HTML entry
- `src/main.tsx`: React mount
- `src/app/App.tsx`: top-level screen selection
- `src/features/app-shell/AppShell.tsx`: persistent shell, tabs, top-bar health pills

## Frontend navigation surfaces

| Surface | Component | Purpose |
| --- | --- | --- |
| Dashboard | `src/features/dashboard/DashboardPage.tsx` | Current run, agent fleet, live timeline, account health, recovery actions |
| Create Run | `src/features/run-wizard/RunWizardPage.tsx` | 3-step non-technical run creation flow with manual multi-agent toggle |
| History | `src/features/history/HistoryPage.tsx` | Reopen saved runs |
| Agents | `src/features/agents/AgentsPage.tsx` | Current-run fleet view plus batch start, pause, and stop across saved runs |
| Codex CLI | `src/features/cli/CliPage.tsx` | Shared command preview and CLI execution |
| Chat | `src/features/chat/ChatPage.tsx` | Local workspace-aware chat threads |
| Settings | `src/features/settings/SettingsPage.tsx` | Workspace defaults, saved workspaces, profiles, account center |

## Backend entrypoints

- `server/index.mjs`: server startup
- `server/app.mjs`: Express app composition, static hosting, error handler
- `server/routes/api-router.mjs`: API routes and service wiring

## Primary API routes

### App bootstrap
- `GET /api/app/bootstrap`

### Workspace and profiles
- `POST /api/workspace`
- `GET /api/workspaces`
- `POST /api/workspaces`
- `GET /api/profiles`
- `POST /api/profiles`
- `DELETE /api/profiles/:id`

### Runs
- `GET /api/runs`
- `POST /api/runs`
- `GET /api/runs/:runId`
- `GET /api/runs/:runId/stream`
- `GET /api/runs/:runId/agents`
- `GET /api/runs/:runId/agents/:agentId`
- `POST /api/runs/:runId/start`
- `POST /api/runs/:runId/pause`
- `POST /api/runs/:runId/resume`
- `POST /api/runs/:runId/stop`

### Accounts and Codex
- `GET /api/accounts`
- `POST /api/accounts/login`
- `POST /api/accounts/switch`
- `POST /api/accounts/logout`
- `DELETE /api/accounts/:accountId`
- `GET /api/codex/capabilities`
- `POST /api/cli/preview`
- `POST /api/cli/run`

### Chat
- `GET /api/chat/threads`
- `POST /api/chat/threads`
- `GET /api/chat/threads/:threadId`
- `POST /api/chat/threads/:threadId/messages`

## Compatibility aliases

The server still exposes temporary aliases for older consumers, including:
- `/api/meta`
- `/api/recent-runs`
- `/api/latest-run`
- `/api/start-run`
- `/api/start-autopilot`
- `/api/stop-autopilot`
- `/api/run`
- `/api/codex/status`

These exist only to preserve parity while the new SPA replaces the old shell.
