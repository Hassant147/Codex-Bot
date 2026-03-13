# Phase 0: Refresh Atlas and Inventory

Run Mode: `full-enhance`
Run Directory: `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz/docs/project-bot/runs/20260311-165300-full-enhance`
Workspace Root: `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz`
Target Project: `/Users/macbook/Desktop/Huz`
Scoped Directory/Module: `/Users/macbook/Desktop/Huz`

## Original Request
Fix the full March 11, 2026 booking-contract drift campaign across Huz admin frontend, operator frontend, web frontend, and backend.

This is not a report-only task. Implement the fixes end to end.

Primary source of truth for scope and confirmed mismatches:
- /Users/macbook/Desktop/Huz/docs/codex_reports/BOOKING_FRONTEND_BACKEND_AUDIT_2026-03-11.md
- /Users/macbook/Desktop/Huz/docs/codex_reports/BOOKING_CONTRACT_AUDIT_2026-03-11.md
- /Users/macbook/Desktop/Huz/docs/qa/DEEP_SCAN_REPORT.md
- /Users/macbook/Desktop/Huz/docs/qa/BUG_BACKLOG.md
- /Users/macbook/Desktop/Huz/docs/atlas/PROJECT_BLUEPRINT.md
- /Users/macbook/Desktop/Huz/docs/atlas/SYSTEM_BLUEPRINT.md
- /Users/macbook/Desktop/Huz/docs/atlas/MODULE_MAP.md
- /Users/macbook/Desktop/Huz/docs/atlas/ROUTES_AND_ENTRYPOINTS.md
- /Users/macbook/Desktop/Huz/docs/atlas/API_SURFACE.md
- /Users/macbook/Desktop/Huz/docs/atlas/API_CONTRACT_REGISTRY.md
- /Users/macbook/Desktop/Huz/docs/atlas/CHANGE_MAP.md

Scope includes:
- /Users/macbook/Desktop/Huz/Huz-Admin-Frontend
- /Users/macbook/Desktop/Huz/Huz-Operator-Frontend
- /Users/macbook/Desktop/Huz/Huz-Web-Frontend
- /Users/macbook/Desktop/Huz/Huz-Backend

Keep the previously excluded module excluded:
- admin access-operator-profile

Execution contract:
- Treat the March 11 booking audit findings as an implementation backlog, not as optional suggestions.
- Fix every confirmed mismatch from high risk to low risk in dependency order.
- If you discover adjacent booking-contract drift while implementing these fixes, either fix it in the same campaign if it blocks correctness, or record it explicitly in backlog/docs before closing.
- Do not stop after only the first easy batch. This campaign should drive through the listed remediation waves until all confirmed March 11 findings are fixed or a concrete blocker is verified.
- Prefer frontend-consumer fixes when the backend contract is already correct and intentionally stricter.
- If a backend contract is unsafe or incomplete, fix backend and all consumers together.
- Keep route identity, state ownership, and payload-shape handling explicit. Do not rely on hidden localStorage coupling where route params or component state should own identity.

Mandatory remediation waves:

Wave 1: Refresh booking atlas context and import the latest March 11 audit truth
- Reconcile the bot workspace atlas/backlog/docs with the current project-local March 11 booking audit and QA docs.
- Ensure the bot workspace reflects admin, operator, web, and backend booking surfaces before implementation decisions.

Wave 2: Fix the highest-risk contract and payload-shape drift
- Admin booking list must become page-aware and search-aware against the backend contract instead of searching only local first-page results.
- Admin complaints list must become page-aware against the backend paginated contract.
- Admin receivables views must correctly consume paginated payloads where the endpoint is paginated.
- Super-admin partner settlement review must stop losing payment proofs because it refetches a contract that hides payment_detail.

Wave 3: Fix booking workflow state ownership drift
- Admin pending-action workflow must honor operator_can_act and stop exposing actions the backend will reject.
- Admin booking fulfillment subflows must stop depending on global localStorage("bookingNumber") as the source of truth when route identity or component-owned state should carry booking identity.
- Remove or reduce stale booking-localStorage coupling where it causes contract drift or weak state ownership.

Wave 4: Align late-stage workflow and permission behavior
- Remove or correctly gate edit/update entrypoints that remain exposed on completed bookings when backend create/update rules do not allow those mutations.
- Check the related delete/document paths too; if completed-state mutation is still possible through delete paths or other side routes, close that gap.
- Add or surface the missing reported-traveler UX for issue_status=REPORTED where the backend already supports it.
- Keep admin and operator workflow screens aligned with backend booking_status and issue_status rules.

Wave 5: Fix operator dashboard and bookings-module truthfulness
- Recent Bookings must reflect the correct workflow bucket behavior and not silently degrade into a misleading READY-only queue.
- Booking search copy and behavior must match the real backend filter contract; either implement the promised search capability end to end or correct the UI promise.

Wave 6: Fix low-risk but real web/support drift
- Support history attachments and audio must resolve against the API origin, not the frontend origin, so split-origin deployments remain correct.
- Recheck any nearby booking/support media helpers for the same issue and fix them if they are part of the same contract surface.

Wave 7: Regression hardening and verification
- Run the relevant validations for each touched surface:
  - Huz-Admin-Frontend build or equivalent scoped verification
  - Huz-Operator-Frontend build or equivalent scoped verification
  - Huz-Web-Frontend build or equivalent scoped verification
  - Huz-Backend targeted checks/tests relevant to touched booking/support/payment flows
- If current test coverage is weak around the changed contract surfaces, add focused tests where the risk is high enough to justify them.

Wave 8: Final documentation and closure
- Update the bot workspace atlas, change map, deep scan report, and backlog to reflect what was fixed, what remains, and any blockers.
- If the project-local booking audit or backlog docs are still being used as active repo memory and the implementation materially changes their status, refresh those project-local docs too.
- Do not leave the campaign marked complete if March 11 findings remain open without explicit blocker notes.

Priority order inside implementation:
1. Pagination/payload-shape correctness
2. Settlement proof visibility
3. Workflow-state ownership and route identity
4. Late-stage mutation and reported-traveler workflow alignment
5. Operator truthfulness issues
6. Web support media-origin fix
7. Verification, tests, and docs

Success criteria:
- All confirmed March 11 booking mismatch findings are either fixed in code or explicitly blocked with proof.
- Admin/operator/web consumers match live backend contract shapes and workflow rules.
- No first-page-only list views remain in the scoped booking/complaints/receivables surfaces where the backend is paginated.
- No settlement review screen falsely reports missing payment proof because of hidden payment_detail refetch behavior.
- No booking subflow in the fixed scope relies on a stale localStorage booking number when route-owned identity should be used.
- Completed/ready-for-travel workflow UIs no longer advertise illegal mutations.
- Reported-traveler handling is surfaced where backend support exists.
- Builds/tests/checks for touched surfaces are recorded.
- Atlas/backlog/change history are refreshed for future runs.

## Goal
Refresh the project blueprint and identify the current module layout before enhancement work begins.

## Scope Contract
- Scope Level: `multi-panel-fullstack`
- Scoped Directory/Module: `/Users/macbook/Desktop/Huz`
- Full-System Required Docs Enforcement: `enabled`

### Scope Targets
- `/Users/macbook/Desktop/Huz/Huz-Admin-Frontend`
- `/Users/macbook/Desktop/Huz/Huz-Operator-Frontend`
- `/Users/macbook/Desktop/Huz/Huz-Web-Frontend`
- `/Users/macbook/Desktop/Huz/Huz-Backend`

### Project Surfaces
- Huz-Web-Frontend | `/Users/macbook/Desktop/Huz/Huz-Web-Frontend` | kind: `panel-fe`
- Huz-Admin-Frontend | `/Users/macbook/Desktop/Huz/Huz-Admin-Frontend` | kind: `panel-fe`
- Huz-Operator-Frontend | `/Users/macbook/Desktop/Huz/Huz-Operator-Frontend` | kind: `panel-fe`
- Huz-Backend | `/Users/macbook/Desktop/Huz/Huz-Backend` | kind: `panel-be`

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
- `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz/docs/atlas/SYSTEM_BLUEPRINT.md`
- `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz/docs/atlas/FILE_MAP_DEV_ONLY.md`
- `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz/docs/atlas/PANEL_MODULE_INDEX.md`
- `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz/docs/atlas/FRONTEND_BLUEPRINT.md`
- `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz/docs/atlas/BACKEND_BLUEPRINT.md`
- `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz/docs/atlas/PROJECT_BLUEPRINT.md`
- `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz/docs/atlas/MODULE_MAP.md`
- `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz/docs/atlas/ROUTES_AND_ENTRYPOINTS.md`
- `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz/docs/atlas/ROUTE_MATRIX.md`
- `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz/docs/atlas/STATE_MANAGEMENT_MAP.md`
- `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz/docs/atlas/API_SURFACE.md`
- `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz/docs/atlas/API_CONTRACT_REGISTRY.md`
- `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz/docs/atlas/BACKEND_SCHEMA_MAP.md`
- `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz/docs/atlas/DEPENDENCY_GRAPH.md`
- `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz/docs/atlas/SECURITY_THREAT_MAP.md`
- `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz/docs/atlas/TRACEABILITY_MAP.md`
- `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz/docs/atlas/CHANGE_MAP.md`

## Already Completed Phases
- None

## Required Context Before You Start
- Read `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz/docs/project-bot/config.json`.
- Read `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz/docs/project-bot/OPERATOR_PROFILE.md`.
- Read `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz/docs/atlas/PROJECT_BLUEPRINT.md`.
- Read `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz/docs/atlas/MODULE_MAP.md`.
- Read `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz/docs/atlas/ROUTES_AND_ENTRYPOINTS.md`.
- Read `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz/docs/atlas/API_SURFACE.md`.
- Read `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz/docs/atlas/CHANGE_MAP.md`.
- Read `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz/docs/project-bot/runs/20260311-165300-full-enhance/TASK.md`.

## Design Guides For This Run
- `/Users/macbook/Desktop/Huz/UI_DESIGN_SYSTEM_GUIDE.md`
- `/Users/macbook/Desktop/Huz/HOMEPAGE_DEVELOPMENT_CUSTOMIZATION_GUIDE.md`

## Extra Reference Docs
- `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz/docs/atlas/PROJECT_BLUEPRINT.md`
- `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz/docs/atlas/SYSTEM_BLUEPRINT.md`
- `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz/docs/atlas/FILE_MAP_DEV_ONLY.md`
- `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz/docs/atlas/PANEL_MODULE_INDEX.md`
- `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz/docs/atlas/FRONTEND_BLUEPRINT.md`
- `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz/docs/atlas/BACKEND_BLUEPRINT.md`
- `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz/docs/atlas/MODULE_MAP.md`
- `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz/docs/atlas/ROUTES_AND_ENTRYPOINTS.md`
- `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz/docs/atlas/ROUTE_MATRIX.md`
- `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz/docs/atlas/STATE_MANAGEMENT_MAP.md`
- `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz/docs/atlas/API_SURFACE.md`
- `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz/docs/atlas/API_CONTRACT_REGISTRY.md`
- `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz/docs/atlas/BACKEND_SCHEMA_MAP.md`
- `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz/docs/atlas/DEPENDENCY_GRAPH.md`
- `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz/docs/atlas/SECURITY_THREAT_MAP.md`
- `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz/docs/atlas/TRACEABILITY_MAP.md`
- `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz/docs/qa/DEEP_SCAN_REPORT.md`
- `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz/docs/qa/FULL_AUDIT_REPORT.md`
- `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz/docs/qa/BUG_BACKLOG.md`
- `/Users/macbook/Desktop/Huz/docs/codex_reports/BOOKING_FRONTEND_BACKEND_AUDIT_2026-03-11.md`
- `/Users/macbook/Desktop/Huz/docs/codex_reports/BOOKING_CONTRACT_AUDIT_2026-03-11.md`
- `/Users/macbook/Desktop/Huz/docs/qa/DEEP_SCAN_REPORT.md`
- `/Users/macbook/Desktop/Huz/docs/qa/BUG_BACKLOG.md`
- `/Users/macbook/Desktop/Huz/docs/atlas/PROJECT_BLUEPRINT.md`
- `/Users/macbook/Desktop/Huz/docs/atlas/SYSTEM_BLUEPRINT.md`
- `/Users/macbook/Desktop/Huz/docs/atlas/MODULE_MAP.md`
- `/Users/macbook/Desktop/Huz/docs/atlas/ROUTES_AND_ENTRYPOINTS.md`
- `/Users/macbook/Desktop/Huz/docs/atlas/API_SURFACE.md`
- `/Users/macbook/Desktop/Huz/docs/atlas/API_CONTRACT_REGISTRY.md`
- `/Users/macbook/Desktop/Huz/docs/atlas/CHANGE_MAP.md`

## Hard Rules
- Do not ask the user follow-up questions unless absolutely blocked.
- Stay inside the target project and explicitly requested supporting docs.
- Write reports, atlas updates, backlog entries, summaries, and bot memory files to the agent workspace paths listed in this prompt unless the task explicitly requires a project-local file.
- Follow the operating style, scope discipline, and reporting rules in `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz/docs/project-bot/OPERATOR_PROFILE.md`.
- If this phase changes code, update the relevant atlas docs in the same phase so future runs do not need a full rescan.
- Keep summaries durable in docs/files, not only in the final chat message.
- Do not execute future phases early.

## This Phase Required Work
- Read the current atlas docs and refresh stale areas that block reliable execution.
- Inventory the project scope, critical modules, routes, APIs, and major dependencies.
- Capture baseline commands and verification constraints.

## Atlas Update Requirement (Mandatory On Any Code Change)
- Refresh all required atlas docs listed in this prompt when touched structures/contracts change.
- Always refresh `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz/docs/atlas/PROJECT_BLUEPRINT.md`, `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz/docs/atlas/MODULE_MAP.md`, `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz/docs/atlas/ROUTES_AND_ENTRYPOINTS.md`, and `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz/docs/atlas/API_SURFACE.md` when their surfaces are impacted.
- Append a new entry to `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz/docs/atlas/CHANGE_MAP.md` describing what changed and which atlas docs were refreshed.

## Additional Docs To Maintain In This Phase
- Update `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz/docs/qa/DEEP_SCAN_REPORT.md` when this phase produces relevant findings, deletions, design decisions, backlog changes, or verification notes.
- Update `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz/docs/qa/BUG_BACKLOG.md` when this phase produces relevant findings, deletions, design decisions, backlog changes, or verification notes.

## Run Summary Requirement
- Append a new section to `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz/docs/project-bot/runs/20260311-165300-full-enhance/RUN_SUMMARY.md` using this exact structure:
  - `## Phase X - Title`
  - `### Changes Made`
  - `### How It Was Implemented`
  - `### Files Touched`
  - `### Verification`

## Phase Completion Step
After finishing this phase, run:

`node /Users/macbook/.codex/skills/project-autopilot-manager/scripts/project_orchestrate.mjs complete --run /Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz/docs/project-bot/runs/20260311-165300-full-enhance --phase 0`
`node /Users/macbook/.codex/skills/project-autopilot-manager/scripts/project_orchestrate.mjs next --run /Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz/docs/project-bot/runs/20260311-165300-full-enhance`

Then print the contents of `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz/docs/project-bot/runs/20260311-165300-full-enhance/NEXT_PROMPT.md` in your final response.
