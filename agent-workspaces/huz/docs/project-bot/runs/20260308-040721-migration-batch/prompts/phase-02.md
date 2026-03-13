# Phase 2: Execute and Verify Migration

Run Mode: `migration-batch`
Run Directory: `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz/docs/project-bot/runs/20260308-040721-migration-batch`
Workspace Root: `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz`
Target Project: `/Users/macbook/Desktop/Huz`
Scoped Directory/Module: `/Users/macbook/Desktop/Huz/Huz-Web-Frontend/src`

## Original Request
Convert the remaining desktop/mobile split pages in Huz-Web-Frontend into single responsive implementations that follow the one-page, one-responsive-design rule.

Primary target: /Users/macbook/Desktop/Huz/Huz-Web-Frontend
Scoped code area: /Users/macbook/Desktop/Huz/Huz-Web-Frontend/src

Required migration targets:
- Listing: src/pages/ListingPage/ListingPage.js + src/pages/ListingPage/ListingMobileScreen.jsx
- Booking setup: src/pages/UserSetting/MyApplication/Booking/booking.jsx + src/pages/UserSetting/MyApplication/Mobile/mobilebooking.jsx
- Booking status: src/pages/UserSetting/MyApplication/Booking/bookingstatus.jsx + src/pages/UserSetting/MyApplication/Mobile/bookingstatus.jsx
- Payment methods: src/pages/UserSetting/PaymentMethods/paymentMethods.jsx + src/pages/UserSetting/PaymentMethods/Mobile/paymentmethod.jsx
- Remaining payment: src/pages/UserSetting/RemainingPayment/remainingPayment.jsx + src/pages/UserSetting/RemainingPayment/Mobile/remainingPayment.jsx
- Traveler details: src/pages/UserSetting/Datatable/datatable.jsx + src/pages/UserSetting/Datatable/Mobile/datatable.jsx
- Messages: src/pages/UserSetting/Message/messagePage.jsx + src/pages/UserSetting/Mobile/Message/messagepageview.jsx
- Payment & Wallet: src/pages/UserSetting/Payment&Wallet/payment&wallet.jsx + src/pages/UserSetting/Payment&Wallet/Mobile/paymentwallet.jsx
- Operator response: src/pages/UserSetting/OperatorResponse/operatorresponse.jsx + src/pages/UserSetting/OperatorResponse/Mobile/operatorresponse.jsx
- Wishlist switcher: src/pages/UserSetting/Wishlist/index.jsx, src/pages/UserSetting/Wishlist/wishlist.jsx, src/pages/UserSetting/Wishlist/wishlistMobile.jsx
- Route-level mobile-only cases in src/routes/AppRoutes.jsx, including /payment-wallet-mobile and /booking-page pointing at a mobile-oriented invoice page
- Inline mobile branch inside src/pages/HajjGuidance/HajjGuidance.jsx

Migration rules:
- Keep routes, business logic, API usage, and user-facing flows stable unless a route must become a compatibility alias to the unified responsive page.
- Replace duplicated mobile-only page implementations with shared responsive pages/components wherever safe.
- Preserve feature parity across desktop and mobile; do not drop fields, actions, status states, payment steps, or message capabilities.
- Prefer one source of truth per page. Temporary wrappers are acceptable only when needed to preserve route compatibility during the migration.
- Remove dead mobile-only branches/files only when proven safe after the shared responsive page is in place.
- Do not broaden into unrelated visual redesign. This is a responsive unification and duplication-reduction pass.
- Use existing design guides and current Huz visual language; keep UI direction stable while fixing structure.

Execution priority:
1. Booking and payment flow pages first.
2. Remaining user-setting pages next.
3. Listing, wishlist, and HajjGuidance cleanup after the flow-critical pages.

Verification requirements:
- Run the relevant frontend build and any scoped validation available.
- Smoke-check the affected routes/components at mobile, tablet, and desktop assumptions.
- Update backlog/report status for each migrated page group.
- Refresh atlas/change docs for any route, ownership, or module-structure changes.

Completion standard:
This migration is only complete when the listed split pages no longer depend on separate mobile page implementations for normal rendering, and the responsive behavior is handled by a shared page structure instead.

## Goal
Apply the migration batch and confirm the new pattern is stable.

## Scope Contract
- Scope Level: `module`
- Scoped Directory/Module: `/Users/macbook/Desktop/Huz/Huz-Web-Frontend/src`
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
- None

## Required Context Before You Start
- Read `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz/docs/project-bot/config.json`.
- Read `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz/docs/project-bot/OPERATOR_PROFILE.md`.
- Read `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz/docs/atlas/PROJECT_BLUEPRINT.md`.
- Read `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz/docs/atlas/MODULE_MAP.md`.
- Read `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz/docs/atlas/ROUTES_AND_ENTRYPOINTS.md`.
- Read `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz/docs/atlas/API_SURFACE.md`.
- Read `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz/docs/atlas/CHANGE_MAP.md`.
- Read `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz/docs/project-bot/runs/20260308-040721-migration-batch/TASK.md`.

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
- Implement the migration changes across the scoped modules.
- Run the relevant build, test, lint, and contract checks.
- Refresh atlas and change map docs to reflect the migrated structure.

## Atlas Update Requirement (Mandatory On Any Code Change)
- Refresh all required atlas docs listed in this prompt when touched structures/contracts change.
- Always refresh `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz/docs/atlas/PROJECT_BLUEPRINT.md`, `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz/docs/atlas/MODULE_MAP.md`, `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz/docs/atlas/ROUTES_AND_ENTRYPOINTS.md`, and `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz/docs/atlas/API_SURFACE.md` when their surfaces are impacted.
- Append a new entry to `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz/docs/atlas/CHANGE_MAP.md` describing what changed and which atlas docs were refreshed.

## Additional Docs To Maintain In This Phase
- Update `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz/docs/qa/BUG_BACKLOG.md` when this phase produces relevant findings, deletions, design decisions, backlog changes, or verification notes.
- Update `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz/docs/qa/DEEP_SCAN_REPORT.md` when this phase produces relevant findings, deletions, design decisions, backlog changes, or verification notes.

## Run Summary Requirement
- Append a new section to `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz/docs/project-bot/runs/20260308-040721-migration-batch/RUN_SUMMARY.md` using this exact structure:
  - `## Phase X - Title`
  - `### Changes Made`
  - `### How It Was Implemented`
  - `### Files Touched`
  - `### Verification`

## Phase Completion Step
After finishing this phase, run:

`node /Users/macbook/.codex/skills/project-autopilot-manager/scripts/project_orchestrate.mjs complete --run /Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz/docs/project-bot/runs/20260308-040721-migration-batch --phase 2`
`node /Users/macbook/.codex/skills/project-autopilot-manager/scripts/project_orchestrate.mjs next --run /Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz/docs/project-bot/runs/20260308-040721-migration-batch`

Then print the contents of `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz/docs/project-bot/runs/20260308-040721-migration-batch/NEXT_PROMPT.md` in your final response.
