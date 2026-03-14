# Phase 2: Write Findings and Backlog

Run Mode: `deep-scan`
Run Directory: `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/default/docs/project-bot/runs/20260314-155333-deep-scan`
Workspace Root: `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/default`
Target Project: `/tmp/codex-gui-smoke-fon9C8`
Scoped Directory/Module: use the request and target project path to determine scope.

## Original Request
Smoke test multi-agent orchestration. Keep changes minimal and safe.
Global Instructions:
Keep reports and durable project memory outside the target repo.
Refresh affected docs when routes, APIs, contracts, state, or module structure change.
Keep findings traceable and preserve operator-readable summaries.

## Goal
Produce durable reports and backlog entries so future work can execute without rescanning the full codebase.

## Scope Contract
- Scope Level: `module`
- Scoped Directory/Module: use the request and target project path to determine scope.
- Full-System Required Docs Enforcement: `enabled`

### Scope Targets
- `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/default/src`
- `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/default/server`
- `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/default/docs`

### Project Surfaces
- codex-gui-smoke-fon9C8 | `/tmp/codex-gui-smoke-fon9C8` | kind: `panel-fullstack`

### Dev-Only Ignore Policy (exclude non-dev/non-required files)
- `node_modules/**`
- `dist/**`
- `build/**`
- `coverage/**`
- `.git/**`
- `.cache/**`
- `.next/**`
- `.turbo/**`
- `.idea/**`
- `.vscode/**`
- `logs/**`
- `tmp/**`
- `temp/**`
- `*.min.js`
- `*.map`
- `*.log`
- `*.lock`

### Required Atlas Docs For This Run
- `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/default/docs/atlas/PROJECT_BLUEPRINT.md`
- `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/default/docs/atlas/MODULE_MAP.md`
- `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/default/docs/atlas/ROUTES_AND_ENTRYPOINTS.md`
- `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/default/docs/atlas/API_SURFACE.md`
- `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/default/docs/atlas/CHANGE_MAP.md`

## Already Completed Phases
- None

## Required Context Before You Start
- Read `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/default/docs/project-bot/config.json`.
- Read `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/default/docs/project-bot/OPERATOR_PROFILE.md`.
- Read `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/default/docs/atlas/PROJECT_BLUEPRINT.md`.
- Read `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/default/docs/atlas/MODULE_MAP.md`.
- Read `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/default/docs/atlas/ROUTES_AND_ENTRYPOINTS.md`.
- Read `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/default/docs/atlas/API_SURFACE.md`.
- Read `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/default/docs/atlas/CHANGE_MAP.md`.
- Read `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/default/docs/project-bot/runs/20260314-155333-deep-scan/TASK.md`.

## Design Guides For This Run
- No design guides configured for this run.

## Extra Reference Docs
- `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/default/docs/atlas/PROJECT_BLUEPRINT.md`
- `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/default/docs/atlas/SYSTEM_BLUEPRINT.md`
- `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/default/docs/atlas/FILE_MAP_DEV_ONLY.md`
- `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/default/docs/atlas/PANEL_MODULE_INDEX.md`
- `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/default/docs/atlas/FRONTEND_BLUEPRINT.md`
- `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/default/docs/atlas/BACKEND_BLUEPRINT.md`
- `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/default/docs/atlas/MODULE_MAP.md`
- `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/default/docs/atlas/ROUTES_AND_ENTRYPOINTS.md`
- `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/default/docs/atlas/ROUTE_MATRIX.md`
- `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/default/docs/atlas/STATE_MANAGEMENT_MAP.md`
- `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/default/docs/atlas/API_SURFACE.md`
- `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/default/docs/atlas/API_CONTRACT_REGISTRY.md`
- `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/default/docs/atlas/BACKEND_SCHEMA_MAP.md`
- `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/default/docs/atlas/DEPENDENCY_GRAPH.md`
- `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/default/docs/atlas/SECURITY_THREAT_MAP.md`
- `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/default/docs/atlas/TRACEABILITY_MAP.md`
- `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/default/docs/qa/DEEP_SCAN_REPORT.md`
- `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/default/docs/qa/FULL_AUDIT_REPORT.md`
- `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/default/docs/qa/BUG_BACKLOG.md`

## Hard Rules
- Do not ask the user follow-up questions unless absolutely blocked.
- Stay inside the target project and explicitly requested supporting docs.
- Write reports, atlas updates, backlog entries, summaries, and bot memory files to the agent workspace paths listed in this prompt unless the task explicitly requires a project-local file.
- Follow the operating style, scope discipline, and reporting rules in `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/default/docs/project-bot/OPERATOR_PROFILE.md`.
- If this phase changes code, update the relevant atlas docs in the same phase so future runs do not need a full rescan.
- Keep summaries durable in docs/files, not only in the final chat message.
- Do not execute future phases early.

## This Phase Required Work
- Update the deep scan report with findings grouped by module or concern.
- Update the bug backlog with prioritized, actionable items and verification steps.
- Capture the scope scanned, files examined, and remaining blind spots.

## Atlas Update Requirement (Mandatory On Any Code Change)
- Refresh all required atlas docs listed in this prompt when touched structures/contracts change.
- Always refresh `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/default/docs/atlas/PROJECT_BLUEPRINT.md`, `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/default/docs/atlas/MODULE_MAP.md`, `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/default/docs/atlas/ROUTES_AND_ENTRYPOINTS.md`, and `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/default/docs/atlas/API_SURFACE.md` when their surfaces are impacted.
- Append a new entry to `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/default/docs/atlas/CHANGE_MAP.md` describing what changed and which atlas docs were refreshed.

## Additional Docs To Maintain In This Phase
- Update `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/default/docs/qa/DEEP_SCAN_REPORT.md` when this phase produces relevant findings, deletions, design decisions, backlog changes, or verification notes.
- Update `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/default/docs/qa/BUG_BACKLOG.md` when this phase produces relevant findings, deletions, design decisions, backlog changes, or verification notes.

## Run Summary Requirement
- Append a new section to `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/default/docs/project-bot/runs/20260314-155333-deep-scan/RUN_SUMMARY.md` using this exact structure:
  - `## Phase X - Title`
  - `### Changes Made`
  - `### How It Was Implemented`
  - `### Files Touched`
  - `### Verification`

## Phase Completion Step
After finishing this phase, run:

`node /Users/macbook/.codex/skills/project-autopilot-manager/scripts/project_orchestrate.mjs complete --run /Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/default/docs/project-bot/runs/20260314-155333-deep-scan --phase 2`
`node /Users/macbook/.codex/skills/project-autopilot-manager/scripts/project_orchestrate.mjs next --run /Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/default/docs/project-bot/runs/20260314-155333-deep-scan`

Then print the contents of `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/default/docs/project-bot/runs/20260314-155333-deep-scan/NEXT_PROMPT.md` in your final response.
