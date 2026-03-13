# Phase 0: Map Migration Surface

Run Mode: `migration-batch`
Run Directory: `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz/docs/project-bot/runs/20260308-043036-migration-batch`
Workspace Root: `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz`
Target Project: `/Users/macbook/Desktop/Huz`
Scoped Directory/Module: `/Users/macbook/Desktop/Huz/Huz-Web-Frontend/src`

## Original Request
Refactor the remaining Huz-Web-Frontend pages that still use separate mobile implementations into one responsive page per route.

Project root: /Users/macbook/Desktop/Huz
Primary target repo: /Users/macbook/Desktop/Huz/Huz-Web-Frontend
Scoped code area: /Users/macbook/Desktop/Huz/Huz-Web-Frontend/src

Required targets:
- Listing: src/pages/ListingPage/ListingPage.js and src/pages/ListingPage/ListingMobileScreen.jsx
- Booking setup: src/pages/UserSetting/MyApplication/Booking/booking.jsx and src/pages/UserSetting/MyApplication/Mobile/mobilebooking.jsx
- Booking status: src/pages/UserSetting/MyApplication/Booking/bookingstatus.jsx and src/pages/UserSetting/MyApplication/Mobile/bookingstatus.jsx
- Payment methods: src/pages/UserSetting/PaymentMethods/paymentMethods.jsx and src/pages/UserSetting/PaymentMethods/Mobile/paymentmethod.jsx
- Remaining payment: src/pages/UserSetting/RemainingPayment/remainingPayment.jsx and src/pages/UserSetting/RemainingPayment/Mobile/remainingPayment.jsx
- Traveler details: src/pages/UserSetting/Datatable/datatable.jsx and src/pages/UserSetting/Datatable/Mobile/datatable.jsx
- Messages: src/pages/UserSetting/Message/messagePage.jsx and src/pages/UserSetting/Mobile/Message/messagepageview.jsx
- Payment and wallet: src/pages/UserSetting/Payment&Wallet/payment&wallet.jsx and src/pages/UserSetting/Payment&Wallet/Mobile/paymentwallet.jsx
- Operator response: src/pages/UserSetting/OperatorResponse/operatorresponse.jsx and src/pages/UserSetting/OperatorResponse/Mobile/operatorresponse.jsx
- Wishlist: src/pages/UserSetting/Wishlist/index.jsx, src/pages/UserSetting/Wishlist/wishlist.jsx, and src/pages/UserSetting/Wishlist/wishlistMobile.jsx
- Route-level mobile-only cases in src/routes/AppRoutes.jsx, including /payment-wallet-mobile and /booking-page
- Inline mobile branch in src/pages/HajjGuidance/HajjGuidance.jsx

Implementation rules:
- Use one consistent Huz theme, layout system, spacing rhythm, and visual language across all affected pages.
- Follow /Users/macbook/Desktop/Huz/HOMEPAGE_DEVELOPMENT_CUSTOMIZATION_GUIDE.md as a reference guide only.
- Enforce one page, one responsive design. Do not preserve separate mobile-only page trees for normal rendering.
- Prefer reusable shared components, section primitives, and modular responsive layouts instead of duplicated JSX.
- Keep routes, business logic, data flow, and user-facing features stable unless a mobile-only route must become a compatibility alias to the unified responsive page.
- Keep the work clean, optimized, aligned, maintainable, and consistent with modern React and JavaScript practices already suitable for this repo.
- Preserve feature parity across breakpoints. Do not remove fields, actions, states, or payment/message flow behavior.
- Remove dead mobile wrappers only when the shared responsive page has absorbed their behavior safely.
- Keep the scope focused on responsive unification and structural cleanup, not unrelated redesign.

Important constraints:
- Do not run npm install, npm ci, npm run build, npm test, or other heavy verification/build commands in this run.
- Verify by code inspection, route/component dependency tracing, and scoped static consistency checks only.
- Update the bot workspace docs and run summaries as the run progresses.

Execution priority:
1. Booking and payment flow pages first.
2. Remaining user-setting pages next.
3. Listing, wishlist, HajjGuidance, and route cleanup after the flow-critical pages.

Completion standard:
The task is complete only when the listed routes no longer depend on separate mobile page implementations for normal rendering and responsive behavior is handled by shared page structures.

## Goal
Identify every module, contract, and dependency touched by the migration.

## Scope Contract
- Scope Level: `panel-fe`
- Scoped Directory/Module: `/Users/macbook/Desktop/Huz/Huz-Web-Frontend/src`
- Full-System Required Docs Enforcement: `enabled`

### Scope Targets
- `/Users/macbook/Desktop/Huz/Huz-Web-Frontend/src/pages/ListingPage`
- `/Users/macbook/Desktop/Huz/Huz-Web-Frontend/src/pages/UserSetting`
- `/Users/macbook/Desktop/Huz/Huz-Web-Frontend/src/pages/HajjGuidance`
- `/Users/macbook/Desktop/Huz/Huz-Web-Frontend/src/routes/AppRoutes.jsx`

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
- None

## Required Context Before You Start
- Read `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz/docs/project-bot/config.json`.
- Read `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz/docs/project-bot/OPERATOR_PROFILE.md`.
- Read `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz/docs/atlas/PROJECT_BLUEPRINT.md`.
- Read `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz/docs/atlas/MODULE_MAP.md`.
- Read `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz/docs/atlas/ROUTES_AND_ENTRYPOINTS.md`.
- Read `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz/docs/atlas/API_SURFACE.md`.
- Read `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz/docs/atlas/CHANGE_MAP.md`.
- Read `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz/docs/project-bot/runs/20260308-043036-migration-batch/TASK.md`.

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
- `/Users/macbook/Desktop/Huz/docs/codex_reports/PACKAGE_FLOW_AUDIT_2026-03-07.md`
- `/Users/macbook/Desktop/Huz/docs/codex_reports/API_ALIGNMENT_BLUEPRINT_2026-03-07.md`
- `/Users/macbook/Desktop/Huz/Huz-Web-Frontend/docs/CLEANUP_SUMMARY.md`

## Hard Rules
- Do not ask the user follow-up questions unless absolutely blocked.
- Stay inside the target project and explicitly requested supporting docs.
- Write reports, atlas updates, backlog entries, summaries, and bot memory files to the agent workspace paths listed in this prompt unless the task explicitly requires a project-local file.
- Follow the operating style, scope discipline, and reporting rules in `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz/docs/project-bot/OPERATOR_PROFILE.md`.
- If this phase changes code, update the relevant atlas docs in the same phase so future runs do not need a full rescan.
- Keep summaries durable in docs/files, not only in the final chat message.
- Do not execute future phases early.

## This Phase Required Work
- Read the atlas docs and inspect the current implementation surface of the migration target.
- Map the current pattern, the desired pattern, and the modules that must move together.
- Call out compatibility risks and rollback requirements before editing code.

## Atlas Update Requirement (Mandatory On Any Code Change)
- Refresh all required atlas docs listed in this prompt when touched structures/contracts change.
- Always refresh `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz/docs/atlas/PROJECT_BLUEPRINT.md`, `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz/docs/atlas/MODULE_MAP.md`, `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz/docs/atlas/ROUTES_AND_ENTRYPOINTS.md`, and `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz/docs/atlas/API_SURFACE.md` when their surfaces are impacted.
- Append a new entry to `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz/docs/atlas/CHANGE_MAP.md` describing what changed and which atlas docs were refreshed.

## Additional Docs To Maintain In This Phase
- Update `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz/docs/qa/BUG_BACKLOG.md` when this phase produces relevant findings, deletions, design decisions, backlog changes, or verification notes.
- Update `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz/docs/qa/DEEP_SCAN_REPORT.md` when this phase produces relevant findings, deletions, design decisions, backlog changes, or verification notes.

## Run Summary Requirement
- Append a new section to `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz/docs/project-bot/runs/20260308-043036-migration-batch/RUN_SUMMARY.md` using this exact structure:
  - `## Phase X - Title`
  - `### Changes Made`
  - `### How It Was Implemented`
  - `### Files Touched`
  - `### Verification`

## Phase Completion Step
After finishing this phase, run:

`node /Users/macbook/.codex/skills/project-autopilot-manager/scripts/project_orchestrate.mjs complete --run /Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz/docs/project-bot/runs/20260308-043036-migration-batch --phase 0`
`node /Users/macbook/.codex/skills/project-autopilot-manager/scripts/project_orchestrate.mjs next --run /Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz/docs/project-bot/runs/20260308-043036-migration-batch`

Then print the contents of `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz/docs/project-bot/runs/20260308-043036-migration-batch/NEXT_PROMPT.md` in your final response.
