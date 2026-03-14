# System Blueprint

Last refreshed: 2026-03-13

## System surfaces

| Surface | Path | Responsibility |
| --- | --- | --- |
| Product shell | `src/` | Operator-facing SPA with dashboard, run wizard, history, agents, CLI, chat, and settings |
| Local API | `server/` | Versioned local endpoints, compatibility aliases, SSE stream, and domain services |
| Durable workspace data | `agent-workspaces/` | Workspace config, run history, runtime files, project profiles, chat threads, and accounts metadata |
| External execution engine | `/Users/macbook/.codex/skills/project-autopilot-manager/scripts/project_orchestrate.mjs` | Creates bounded project-bot runs and workspace docs |
| Autopilot wrapper | `bin/run-orchestration-autopilot.sh` | Executes the legacy single-agent run directory through the existing orchestration loop |
| Sub-agent runner | `server/scripts/run-sub-agent.mjs` | Launches manager and worker Codex agents for coordinated runs |
| Codex CLI | local `codex` binary | Auth state, CLI command execution, and chat conversation execution |
| Keychain integration | `server/services/keychain-service.mjs` | Saves and retrieves API-key secrets for manual account switching |

## Runtime topology

1. The browser loads the built SPA from the local Node server.
2. The SPA requests `/api/app/bootstrap` and hydrates the central typed state.
3. When an operator starts or resumes a run, the API asks `RuntimeSupervisor` to launch either the legacy autopilot wrapper or a coordinated manager-plus-workers fleet.
4. `RuntimeSupervisor` stores command preview plus heartbeat/status/event files under the run directory and, for multi-agent runs, independent manager/worker runtime artifacts.
5. The browser receives live updates through `/api/runs/:runId/stream`.
6. If any worker or the manager detects quota or auth failure, the whole coordinated run transitions to `waiting_auth` and remains recoverable.

## Persistent artifacts per run

- `runtime/status.json`: current runtime state and last-known health
- `runtime/events.jsonl`: ordered event and log timeline
- `runtime/heartbeat.json`: latest heartbeat timestamp and PID
- `runtime/command.json`: exact launch command and environment snapshot
- `runtime/coordination.json`: coordinated fleet status, active phase, and preflight result
- `runtime/agents/index.json`: manager/worker registry for the run
- `runtime/agents/<agentId>/*`: per-agent status, assignment, events, and worktree metadata
- `runtime/merge-report.json`: manager acceptance/rejection results and verification evidence

## Product design principles

- Keep the operator path non-technical by default.
- Keep all primary surfaces visible for advanced users.
- Keep runtime truth on disk, not only in memory.
- Keep GUI actions aligned with the same command builder used by CLI surfaces.
- Keep account recovery manual, explicit, and resumable.
- Keep single-agent behavior unchanged unless the operator explicitly enables multi-agent mode.
