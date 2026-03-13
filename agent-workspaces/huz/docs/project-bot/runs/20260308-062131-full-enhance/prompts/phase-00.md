# Phase 0: Refresh Atlas and Inventory

Run Mode: `full-enhance`
Run Directory: `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz/docs/project-bot/runs/20260308-062131-full-enhance`
Workspace Root: `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz`
Target Project: `/Users/macbook/Desktop/Huz`
Scoped Directory/Module: `Huz-Web-Frontend remaining routes and shared page system`

## Original Request
Analyze the project, create a prioritized backlog, execute the highest-value batch safely, verify it, and refresh the docs.

Compiled automation contract:
- Scope level: multi-panel-fe
- Scope: Huz-Web-Frontend remaining routes and shared page system
- Scope targets: Huz-Web-Frontend, public-marketing-pages, static-site-pages, auth-pages, protected-user-pages, shared-layout-system
- Keep atlas, maps, and audit files synchronized with any implementation changes.

Large-task campaign contract (mandatory):
- Treat this as a multi-run execution campaign, not a one-shot rewrite.
- This run must complete one bounded implementation batch (target <= 8 pages or one backend domain).
- Keep frontend and backend contracts synchronized for touched flows.
- Update BUG_BACKLOG with completed items, deferred items, and the exact next batch recommendation.
- Include concrete verification commands and outcomes in RUN_SUMMARY for every batch.
- Do not claim full completion unless the backlog for this scope is explicitly clear.

Original user request: Please start a multi-run full frontend revamp campaign for Huz-Web-Frontend.

Scope: Huz-Web-Frontend remaining routes and shared page system
Scope targets: Huz-Web-Frontend, public-marketing-pages, static-site-pages, auth-pages, protected-user-pages, shared-layout-system

Mission:
- Revamp all remaining Huz web frontend pages with one consistent Huz theme across desktop and mobile using a single responsive design system.
- Homepage is reference-only. Use HOMEPAGE_DEVELOPMENT_CUSTOMIZATION_GUIDE.md and UI_DESIGN_SYSTEM_GUIDE.md as the design contract, and use the already-aligned pages as reference implementations instead of reinventing them.
- Cover every route cluster in src/routes/AppRoutes.jsx, including public marketing pages, static site pages, auth pages, and protected account pages. This includes the static/policy/generic route system and all remaining user-setting routes.
- Treat HomePage, ListingPage, PackageDetailPage, Booking, PaymentMethods, AuthLayout, and PersonalDetails as reference-quality foundations. Only touch them when extracting reusable primitives, shared layout pieces, or consistency fixes needed by the broader revamp.

Mandatory execution rules:
- Use one consistent theme, layout rhythm, spacing system, card language, CTA hierarchy, and surface treatment across the app.
- One design for both mobile and desktop. Do not maintain separate mobile/desktop page implementations unless the mobile file is only a thin compatibility wrapper around shared responsive content.
- Prefer reusable, modular, data-driven architecture. Extend shared primitives such as BrandPageShell, homepage layout tokens, shared UI components, and static content abstractions instead of page-specific shells.
- Strong modern React + JavaScript approach only. Remove brittle legacy duplication, isolate page logic cleanly, and keep component ownership obvious.
- Keep routes stable.
- Keep the app optimized, clean, aligned, sorted, and efficient.
- Old, unused, dead, duplicate, or placeholder code/files may be deleted only after replacement is proven safe.
- Do not run build. Do not run npm install. Do not modify lockfiles. Verification must rely on static inspection, route/import consistency checks, targeted grep/search, and clear manual reasoning notes. Explicitly record that no build was run.

High-priority design/architecture goals:
- Replace placeholder or one-off static page implementations with a shared branded content system that preserves route-specific content while reducing duplicated JSX/CSS.
- Unify public/static/auth/account pages under the same design principles already established by the newer branded pages.
- Improve performance by reducing duplicate render trees, duplicate layout wrappers, duplicate mobile variants, and unnecessary page-level assets/code paths.
- Centralize repeated content structures so the many static pages stay maintainable and light.
- Make every page feel like the same product.

Expected outcomes:
- All relevant pages in Huz-Web-Frontend are either revamped directly or migrated onto shared reusable primitives.
- Static site pages are consolidated into an efficient modular system.
- Dead files/components left behind by the revamp are removed when proven unused.
- Atlas docs, backlog, and run summaries are refreshed as the work progresses.
- The run proceeds in bounded batches until the revamp scope is fully covered.

Global Instructions (always apply):
Always maintain full-system project memory in docs for the selected scope level.
Exclude non-dev and non-required files from deep mapping and auditing.
When code changes touch modules/routes/APIs/contracts/schema/security/state, refresh relevant atlas docs in the same run.
Keep audit findings traceable with status updates (open, fixed, verified) when remediation occurs.
For full-system or multi-panel fullstack scope, ensure frontend panels and backend structure/contracts are mapped together.

## Goal
Refresh the project blueprint and identify the current module layout before enhancement work begins.

## Scope Contract
- Scope Level: `multi-panel-fe`
- Scoped Directory/Module: `Huz-Web-Frontend remaining routes and shared page system`
- Full-System Required Docs Enforcement: `enabled`

### Scope Targets
- `/Users/macbook/Desktop/Codex-Project-Bot-GUI/Huz-Web-Frontend`
- `/Users/macbook/Desktop/Codex-Project-Bot-GUI/public-marketing-pages`
- `/Users/macbook/Desktop/Codex-Project-Bot-GUI/static-site-pages`
- `/Users/macbook/Desktop/Codex-Project-Bot-GUI/auth-pages`
- `/Users/macbook/Desktop/Codex-Project-Bot-GUI/protected-user-pages`
- `/Users/macbook/Desktop/Codex-Project-Bot-GUI/shared-layout-system`

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
- Read `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz/docs/project-bot/runs/20260308-062131-full-enhance/TASK.md`.

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
- Append a new section to `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz/docs/project-bot/runs/20260308-062131-full-enhance/RUN_SUMMARY.md` using this exact structure:
  - `## Phase X - Title`
  - `### Changes Made`
  - `### How It Was Implemented`
  - `### Files Touched`
  - `### Verification`

## Phase Completion Step
After finishing this phase, run:

`node /Users/macbook/.codex/skills/project-autopilot-manager/scripts/project_orchestrate.mjs complete --run /Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz/docs/project-bot/runs/20260308-062131-full-enhance --phase 0`
`node /Users/macbook/.codex/skills/project-autopilot-manager/scripts/project_orchestrate.mjs next --run /Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz/docs/project-bot/runs/20260308-062131-full-enhance`

Then print the contents of `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz/docs/project-bot/runs/20260308-062131-full-enhance/NEXT_PROMPT.md` in your final response.
