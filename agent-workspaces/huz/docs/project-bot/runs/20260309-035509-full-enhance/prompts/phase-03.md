# Phase 3: Implement Highest-Priority Batch

Run Mode: `full-enhance`
Run Directory: `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz/docs/project-bot/runs/20260309-035509-full-enhance`
Workspace Root: `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz`
Target Project: `/Users/macbook/Desktop/Huz`
Scoped Directory/Module: use the request and target project path to determine scope.

## Original Request
Clean the Huz project safely: remove proven-unused frontend legacy code, unused FE/BE files/assets/dependencies where safe, reduce duplicated logic on backend and frontend, keep backend compatibility endpoints unless proven dead, and refresh workspace docs with verification.

## Goal
Execute the highest-priority improvement batch for the scoped project.

## Scope Contract
- Scope Level: `module`
- Scoped Directory/Module: use the request and target project path to determine scope.
- Full-System Required Docs Enforcement: `enabled`

### Scope Targets
- No explicit scope targets were provided.

### Project Surfaces
- Huz-Web-Frontend | `/Users/macbook/Desktop/Huz/Huz-Web-Frontend` | kind: `panel-fe`

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
- Phase 0: Refresh Atlas and Inventory
- Phase 1: Deep Scan and Backlog
- Phase 2: Plan Execution Batches

## Required Context Before You Start
- Read `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz/docs/project-bot/config.json`.
- Read `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz/docs/project-bot/OPERATOR_PROFILE.md`.
- Read `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz/docs/atlas/PROJECT_BLUEPRINT.md`.
- Read `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz/docs/atlas/MODULE_MAP.md`.
- Read `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz/docs/atlas/ROUTES_AND_ENTRYPOINTS.md`.
- Read `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz/docs/atlas/API_SURFACE.md`.
- Read `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz/docs/atlas/CHANGE_MAP.md`.
- Read `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz/docs/project-bot/runs/20260309-035509-full-enhance/TASK.md`.

## Design Guides For This Run
- `/Users/macbook/Desktop/Huz/UI_DESIGN_SYSTEM_GUIDE.md`
- `/Users/macbook/Desktop/Huz/HOMEPAGE_DEVELOPMENT_CUSTOMIZATION_GUIDE.md`

## Extra Reference Docs
- `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz/docs/atlas/PROJECT_BLUEPRINT.md`
- `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz/docs/atlas/MODULE_MAP.md`
- `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz/docs/atlas/ROUTES_AND_ENTRYPOINTS.md`
- `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz/docs/atlas/API_SURFACE.md`
- `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz/docs/qa/DEEP_SCAN_REPORT.md`
- `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz/docs/qa/BUG_BACKLOG.md`

## Hard Rules
- Do not ask the user follow-up questions unless absolutely blocked.
- Stay inside the target project and explicitly requested supporting docs.
- Write reports, atlas updates, backlog entries, summaries, and bot memory files to the agent workspace paths listed in this prompt unless the task explicitly requires a project-local file.
- Follow the operating style, scope discipline, and reporting rules in `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz/docs/project-bot/OPERATOR_PROFILE.md`.
- If this phase changes code, update the relevant atlas docs in the same phase so future runs do not need a full rescan.
- Keep summaries durable in docs/files, not only in the final chat message.
- Do not execute future phases early.

## This Phase Required Work
- Implement the selected fixes or enhancements across the necessary modules.
- Keep changes cohesive and avoid scattering unrelated edits.
- If new mismatches are uncovered, fix them or record them in the backlog before moving on.

## Atlas Update Requirement (Mandatory On Any Code Change)
- Refresh all required atlas docs listed in this prompt when touched structures/contracts change.
- Always refresh `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz/docs/atlas/PROJECT_BLUEPRINT.md`, `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz/docs/atlas/MODULE_MAP.md`, `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz/docs/atlas/ROUTES_AND_ENTRYPOINTS.md`, and `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz/docs/atlas/API_SURFACE.md` when their surfaces are impacted.
- Append a new entry to `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz/docs/atlas/CHANGE_MAP.md` describing what changed and which atlas docs were refreshed.

## Additional Docs To Maintain In This Phase
- Update `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz/docs/qa/DEEP_SCAN_REPORT.md` when this phase produces relevant findings, deletions, design decisions, backlog changes, or verification notes.
- Update `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz/docs/qa/BUG_BACKLOG.md` when this phase produces relevant findings, deletions, design decisions, backlog changes, or verification notes.

## Run Summary Requirement
- Append a new section to `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz/docs/project-bot/runs/20260309-035509-full-enhance/RUN_SUMMARY.md` using this exact structure:
  - `## Phase X - Title`
  - `### Changes Made`
  - `### How It Was Implemented`
  - `### Files Touched`
  - `### Verification`

## Phase Completion Step
After finishing this phase, run:

`node /Users/macbook/.codex/skills/project-autopilot-manager/scripts/project_orchestrate.mjs complete --run /Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz/docs/project-bot/runs/20260309-035509-full-enhance --phase 3`
`node /Users/macbook/.codex/skills/project-autopilot-manager/scripts/project_orchestrate.mjs next --run /Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz/docs/project-bot/runs/20260309-035509-full-enhance`

Then print the contents of `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz/docs/project-bot/runs/20260309-035509-full-enhance/NEXT_PROMPT.md` in your final response.
