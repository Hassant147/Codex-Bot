# API Surface

Last refreshed: 2026-03-13

## Core contracts

The local API is built around these shared data models:
- `WorkspaceConfig`
- `WorkspaceSummary`
- `ProjectProfile`
- `ExecutionProfile`
- `MultiAgentConfig`
- `RunSnapshot`
- `RunRuntimeState`
- `RunEvent`
- `CoordinationState`
- `SubAgentSummary`
- `SubAgentDetail`
- `MergeReport`
- `AccountPayload`
- `CliCapabilities`
- `ChatThread`

## Bootstrap contract

`GET /api/app/bootstrap` returns:
- UI tab metadata
- mode catalog
- run templates
- scope levels
- quality presets
- current workspace config
- saved workspaces
- project profiles
- run history
- account state
- Codex capabilities
- current run snapshot

## Run contracts

### Create a run
`POST /api/runs`

Important inputs:
- `workspaceRoot`
- `projectPath`
- `mode`
- `request`
- `scope`
- `scopeLevel`
- `scopeTargets`
- `multiAgent.enabled`
- `multiAgent.workerCount`
- `requiredAtlasDocs`
- `references`

### Monitor a run
- `GET /api/runs/:runId`
- `GET /api/runs/:runId/stream`
- `GET /api/runs/:runId/agents`
- `GET /api/runs/:runId/agents/:agentId`

The SSE stream emits:
- `snapshot`: full run snapshot
- `update`: runtime state update, coordination update, agent summary update, or timeline event
- `ping`: keepalive

### Control a run
- `POST /api/runs/:runId/start`
- `POST /api/runs/:runId/pause`
- `POST /api/runs/:runId/resume`
- `POST /api/runs/:runId/stop`

Run-control requests accept an execution profile so every surface can launch Codex with the same normalized settings.
When multi-agent start fails preflight, the error payload includes a `preflight` object describing Git-repo and clean-worktree requirements plus the single-agent fallback path.

## Account contracts

- `GET /api/accounts`
- `POST /api/accounts/login`
- `POST /api/accounts/switch`
- `POST /api/accounts/logout`
- `DELETE /api/accounts/:accountId`

Important behaviors:
- login can save an API-key profile locally
- switching a saved account can append an audit event to the paused run timeline
- account status is provider-aware and distinguishes `ChatGPT`, `API key`, and `unknown`

## CLI contracts

- `GET /api/codex/capabilities`
- `POST /api/cli/preview`
- `POST /api/cli/run`

The preview endpoint returns the exact binary and args that the UI is about to execute.

## Chat contracts

- `GET /api/chat/threads`
- `POST /api/chat/threads`
- `GET /api/chat/threads/:threadId`
- `POST /api/chat/threads/:threadId/messages`

Chat threads are stored locally and tied to the selected workspace/project context.
