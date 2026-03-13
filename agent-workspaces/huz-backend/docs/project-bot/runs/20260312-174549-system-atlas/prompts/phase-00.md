# Phase 0: Inventory Scope

Run Mode: `system-atlas`
Run Directory: `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz-backend/docs/project-bot/runs/20260312-174549-system-atlas`
Workspace Root: `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz-backend`
Target Project: `/Users/macbook/Desktop/Huz/Huz-Backend`
Scoped Directory/Module: `/Users/macbook/Desktop/Huz/Huz-Backend`

## Original Request
Team mission: Audit the entire Huz-Backend repository deeply. Act as a project manager, Django architect, Python performance specialist, security reviewer, QA engineer, and implementation engineer. First perform a full backend audit for performance bottlenecks, optimization issues, N+1 queries, ORM misuse, inefficient loops, unnecessary database or network work, cache gaps, slow request paths, dead code, risky patterns, security flaws, and anything clearly wrong. Then create a prioritized remediation plan and implement the safe backend fixes in parallel. Important constraint: only document and fix issues that can be resolved entirely inside Huz-Backend. If an issue requires edits in any other repository, consumer application, or downstream client, do not implement that part. Document it clearly as out-of-scope and skip code changes. Keep all changes scoped to Huz-Backend, verify each batch, and finish with a final summary of issues found, fixes implemented, skipped out-of-scope items, and verification results.

You are the Project Manager in coordinated team "Huz Backend Strict Backend Audit and Fix".
Assigned lane: Global coordination
Primary objective: Map the repo, establish safe work lanes, and refresh the system memory before any parallel work starts.
Execution phase: discovery
Mode: system-atlas
Scope level: panel-be
Scope: /Users/macbook/Desktop/Huz/Huz-Backend
Scope targets: system-atlas

Team coordination contract:
- Work only inside your assigned lane.
- Ownership boundaries: coordination:global
- This is a report-only run. Do not modify product code; workspace docs and reports are allowed.
- Read atlas docs, QA reports, and BUG_BACKLOG before making major decisions.
- If you discover issues outside your lane, document them clearly in RUN_SUMMARY or BUG_BACKLOG instead of implementing them here.
- You are the first wave. Establish a clean foundation for downstream agents.

Discovery contract:
- Build or refresh the atlas needed for downstream work.
- Define safe implementation boundaries in the run summary so later agents can avoid collisions.
- Name the recommended lanes, major risks, and the highest-risk files or flows.

Original operator request:
Audit the entire Huz-Backend repository deeply. Act as a project manager, Django architect, Python performance specialist, security reviewer, QA engineer, and implementation engineer. First perform a full backend audit for performance bottlenecks, optimization issues, N+1 queries, ORM misuse, inefficient loops, unnecessary database or network work, cache gaps, slow request paths, dead code, risky patterns, security flaws, and anything clearly wrong. Then create a prioritized remediation plan and implement the safe backend fixes in parallel. Important constraint: only document and fix issues that can be resolved entirely inside Huz-Backend. If an issue requires edits in any other repository, consumer application, or downstream client, do not implement that part. Document it clearly as out-of-scope and skip code changes. Keep all changes scoped to Huz-Backend, verify each batch, and finish with a final summary of issues found, fixes implemented, skipped out-of-scope items, and verification results.

Global Instructions (always apply):
Always maintain full-system project memory in docs for the selected scope level.
Exclude non-dev and non-required files from deep mapping and auditing.
When code changes touch modules/routes/APIs/contracts/schema/security/state, refresh relevant atlas docs in the same run.
Keep audit findings traceable with status updates (open, fixed, verified) when remediation occurs.
For full-system or multi-panel fullstack scope, ensure frontend panels and backend structure/contracts are mapped together.

## Goal
Scan the requested project scope and identify the major modules, entrypoints, routes, APIs, and ownership boundaries.

## Scope Contract
- Scope Level: `panel-be`
- Scoped Directory/Module: `/Users/macbook/Desktop/Huz/Huz-Backend`
- Full-System Required Docs Enforcement: `disabled`

### Scope Targets
- `/Users/macbook/Desktop/Codex-Project-Bot-GUI/system-atlas`

### Project Surfaces
- Huz-Backend | `/Users/macbook/Desktop/Huz/Huz-Backend` | kind: `panel-be`

### Dev-Only Ignore Policy (exclude non-dev/non-required files)
- `node_modules/**`
- `dist/**`
- `build/**`
- `coverage/**`
- `.git/**`
- `*.log`

### Required Atlas Docs For This Run
- `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz-backend/docs/atlas/PROJECT_BLUEPRINT.md`
- `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz-backend/docs/atlas/MODULE_MAP.md`
- `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz-backend/docs/atlas/ROUTES_AND_ENTRYPOINTS.md`
- `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz-backend/docs/atlas/API_SURFACE.md`
- `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz-backend/docs/atlas/CHANGE_MAP.md`

## Already Completed Phases
- None

## Required Context Before You Start
- Read `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz-backend/docs/project-bot/config.json`.
- Read `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz-backend/docs/project-bot/OPERATOR_PROFILE.md`.
- Read `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz-backend/docs/atlas/PROJECT_BLUEPRINT.md`.
- Read `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz-backend/docs/atlas/MODULE_MAP.md`.
- Read `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz-backend/docs/atlas/ROUTES_AND_ENTRYPOINTS.md`.
- Read `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz-backend/docs/atlas/API_SURFACE.md`.
- Read `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz-backend/docs/atlas/CHANGE_MAP.md`.
- Read `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz-backend/docs/project-bot/runs/20260312-174549-system-atlas/TASK.md`.

## Design Guides For This Run
- `/Users/macbook/Desktop/Huz/UI_DESIGN_SYSTEM_GUIDE.md`
- `/Users/macbook/Desktop/Huz/HOMEPAGE_DEVELOPMENT_CUSTOMIZATION_GUIDE.md`

## Extra Reference Docs
- `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz-backend/docs/atlas/SYSTEM_BLUEPRINT.md`
- `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz-backend/docs/atlas/FILE_MAP_DEV_ONLY.md`
- `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz-backend/docs/atlas/PANEL_MODULE_INDEX.md`
- `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz-backend/docs/atlas/FRONTEND_BLUEPRINT.md`
- `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz-backend/docs/atlas/BACKEND_BLUEPRINT.md`
- `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz-backend/docs/atlas/PROJECT_BLUEPRINT.md`
- `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz-backend/docs/atlas/MODULE_MAP.md`
- `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz-backend/docs/atlas/ROUTES_AND_ENTRYPOINTS.md`
- `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz-backend/docs/atlas/API_SURFACE.md`
- `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz-backend/docs/atlas/CHANGE_MAP.md`
- `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz-backend/docs/atlas/ROUTE_MATRIX.md`
- `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz-backend/docs/atlas/STATE_MANAGEMENT_MAP.md`
- `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz-backend/docs/atlas/API_CONTRACT_REGISTRY.md`
- `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz-backend/docs/atlas/BACKEND_SCHEMA_MAP.md`
- `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz-backend/docs/atlas/DEPENDENCY_GRAPH.md`
- `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz-backend/docs/atlas/SECURITY_THREAT_MAP.md`
- `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz-backend/docs/atlas/TRACEABILITY_MAP.md`
- `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz-backend/docs/qa/FULL_AUDIT_REPORT.md`
- `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz-backend/docs/qa/DEEP_SCAN_REPORT.md`
- `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz-backend/docs/qa/BUG_BACKLOG.md`

## Hard Rules
- Do not ask the user follow-up questions unless absolutely blocked.
- Stay inside the target project and explicitly requested supporting docs.
- Write reports, atlas updates, backlog entries, summaries, and bot memory files to the agent workspace paths listed in this prompt unless the task explicitly requires a project-local file.
- Follow the operating style, scope discipline, and reporting rules in `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz-backend/docs/project-bot/OPERATOR_PROFILE.md`.
- If this phase changes code, update the relevant atlas docs in the same phase so future runs do not need a full rescan.
- Keep summaries durable in docs/files, not only in the final chat message.
- Do not execute future phases early.

## This Phase Required Work
- Inspect only the directories and files needed to map the requested scope accurately.
- Capture major modules, routes, service layers, data flows, and integration boundaries.
- Collect evidence for stale docs, missing map sections, or structural ambiguity.

## Atlas Update Requirement (Mandatory On Any Code Change)
- Refresh all required atlas docs listed in this prompt when touched structures/contracts change.
- Always refresh `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz-backend/docs/atlas/PROJECT_BLUEPRINT.md`, `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz-backend/docs/atlas/MODULE_MAP.md`, `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz-backend/docs/atlas/ROUTES_AND_ENTRYPOINTS.md`, and `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz-backend/docs/atlas/API_SURFACE.md` when their surfaces are impacted.
- Append a new entry to `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz-backend/docs/atlas/CHANGE_MAP.md` describing what changed and which atlas docs were refreshed.

## Additional Docs To Maintain In This Phase
- Update `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz-backend/docs/qa/DEEP_SCAN_REPORT.md` when this phase produces relevant findings, deletions, design decisions, backlog changes, or verification notes.

## Run Summary Requirement
- Append a new section to `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz-backend/docs/project-bot/runs/20260312-174549-system-atlas/RUN_SUMMARY.md` using this exact structure:
  - `## Phase X - Title`
  - `### Changes Made`
  - `### How It Was Implemented`
  - `### Files Touched`
  - `### Verification`

## Phase Completion Step
After finishing this phase, run:

`node /Users/macbook/.codex/skills/project-autopilot-manager/scripts/project_orchestrate.mjs complete --run /Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz-backend/docs/project-bot/runs/20260312-174549-system-atlas --phase 0`
`node /Users/macbook/.codex/skills/project-autopilot-manager/scripts/project_orchestrate.mjs next --run /Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz-backend/docs/project-bot/runs/20260312-174549-system-atlas`

Then print the contents of `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz-backend/docs/project-bot/runs/20260312-174549-system-atlas/NEXT_PROMPT.md` in your final response.
