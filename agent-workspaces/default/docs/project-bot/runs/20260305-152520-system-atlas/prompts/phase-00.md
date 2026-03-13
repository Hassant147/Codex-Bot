# Phase 0: Inventory Scope

Run Mode: `system-atlas`
Run Directory: `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/default/docs/project-bot/runs/20260305-152520-system-atlas`
Workspace Root: `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/default`
Target Project: `/Users/macbook/Desktop/Huz/Huz-Web-Frontend`
Scoped Directory/Module: `/Users/macbook/Desktop/Huz`

## Original Request
Refresh full system atlas and fill blueprint/module/routes/api/change map docs.

## Goal
Scan the requested project scope and identify the major modules, entrypoints, routes, APIs, and ownership boundaries.

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
- Read `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/default/docs/project-bot/runs/20260305-152520-system-atlas/TASK.md`.

## Design Guides For This Run
- `/Users/macbook/Desktop/Huz/UI_DESIGN_SYSTEM_GUIDE.md`
- `/Users/macbook/Desktop/Huz/HOMEPAGE_DEVELOPMENT_CUSTOMIZATION_GUIDE.md`

## Extra Reference Docs
- `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/default/docs/atlas/PROJECT_BLUEPRINT.md`
- `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/default/docs/atlas/MODULE_MAP.md`
- `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/default/docs/atlas/ROUTES_AND_ENTRYPOINTS.md`
- `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/default/docs/atlas/API_SURFACE.md`
- `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/default/docs/qa/DEEP_SCAN_REPORT.md`
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
- Inspect only the directories and files needed to map the requested scope accurately.
- Capture major modules, routes, service layers, data flows, and integration boundaries.
- Collect evidence for stale docs, missing map sections, or structural ambiguity.

## Atlas Update Requirement (Mandatory On Any Code Change)
- Refresh `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/default/docs/atlas/PROJECT_BLUEPRINT.md` if architecture, flows, or module responsibilities changed.
- Refresh `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/default/docs/atlas/MODULE_MAP.md` if module boundaries, files, or responsibilities changed.
- Refresh `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/default/docs/atlas/ROUTES_AND_ENTRYPOINTS.md` if routes, entrypoints, or navigation surfaces changed.
- Refresh `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/default/docs/atlas/API_SURFACE.md` if endpoints, service functions, request shapes, or response shapes changed.
- Append a new entry to `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/default/docs/atlas/CHANGE_MAP.md` describing what changed and which atlas docs were refreshed.

## Additional Docs To Maintain In This Phase
- Update `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/default/docs/qa/DEEP_SCAN_REPORT.md` when this phase produces relevant findings, deletions, design decisions, backlog changes, or verification notes.

## Run Summary Requirement
- Append a new section to `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/default/docs/project-bot/runs/20260305-152520-system-atlas/RUN_SUMMARY.md` using this exact structure:
  - `## Phase X - Title`
  - `### Changes Made`
  - `### How It Was Implemented`
  - `### Files Touched`
  - `### Verification`

## Phase Completion Step
After finishing this phase, run:

`node /Users/macbook/.codex/skills/project-autopilot-manager/scripts/project_orchestrate.mjs complete --run /Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/default/docs/project-bot/runs/20260305-152520-system-atlas --phase 0`
`node /Users/macbook/.codex/skills/project-autopilot-manager/scripts/project_orchestrate.mjs next --run /Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/default/docs/project-bot/runs/20260305-152520-system-atlas`

Then print the contents of `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/default/docs/project-bot/runs/20260305-152520-system-atlas/NEXT_PROMPT.md` in your final response.
