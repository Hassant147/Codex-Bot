# Module Map

Last refreshed: 2026-03-13

| Module | Path | Responsibility |
| --- | --- | --- |
| App bootstrap and typed state | `src/app/` | Shared types, API client, bootstrap, state coordination, SSE lifecycle |
| Shell chrome | `src/features/app-shell/` | Primary navigation, top-bar pills, banners, loading rail |
| Dashboard | `src/features/dashboard/` | Current run controls, agent fleet, account recovery, timeline, summary, next prompt |
| Run wizard | `src/features/run-wizard/` | Guided run creation with outcome templates, scope review, and manual multi-agent mode selection |
| History | `src/features/history/` | Saved-run browsing and reload into dashboard |
| Agents | `src/features/agents/` | Current-run fleet inspection plus multi-run batch controls |
| CLI surface | `src/features/cli/` | Shared command preview and manual CLI execution |
| Chat surface | `src/features/chat/` | Local thread management and assistant conversations |
| Settings and account center | `src/features/settings/` | Workspace defaults, workspace switching, profiles, saved accounts |
| Shared UI system | `src/shared-ui/` | Cards, headers, status pills, empty states, timeline renderer |
| API router | `server/routes/api-router.mjs` | Public HTTP surface and compatibility mappings |
| Workspace service | `server/services/workspace-service.mjs` | Workspace config, saved workspaces, profiles, latest-run metadata |
| Run service | `server/services/run-service.mjs` | Runtime state files, coordinated run snapshots, per-agent detail lookup, run listing |
| Runtime supervisor | `server/services/runtime-supervisor.mjs` | Single-agent autopilot lifecycle plus manager/worker orchestration, heartbeat aggregation, merge gating, SSE emission |
| Multi-agent service | `server/services/multi-agent-service.mjs` | Coordination artifact paths, assignment planning, ownership enforcement, merge-gate helpers, agent snapshot readers |
| Git service | `server/services/git-service.mjs` | Git repo preflight, worktree creation, diff collection, patch apply/revert |
| Project-bot service | `server/services/project-bot-service.mjs` | Workspace initialization and run creation through the external engine |
| Command builder | `server/services/command-builder.mjs` | Shared run and CLI command construction |
| Codex service | `server/services/codex-service.mjs` | CLI capability checks, login parsing, CLI execution, chat execution |
| Account service | `server/services/account-service.mjs` | Account profiles, active-account switching, login/logout coordination |
| Chat service | `server/services/chat-service.mjs` | Local thread storage and assistant message persistence |
| Keychain service | `server/services/keychain-service.mjs` | Secret storage on macOS |
| Sub-agent runner | `server/scripts/run-sub-agent.mjs` | One-shot Codex worker/manager launcher for coordinated runs |
