# Operator Profile

This file defines the default working style for this bot. Every run should read this file before it plans, edits code, or writes reports.

## Core Operating Style
- Work in one explicitly scoped target project at a time.
- Treat the platform as a connected system when frontend, backend, or contract work overlaps.
- Execute in bounded phases with durable written outputs after each phase.
- Prefer module-by-module work over random scattered fixes.
- Reuse the existing atlas docs first, then read only the extra code needed for accuracy.

## Scope Rules
- The target project is the primary code-editing location.
- Only touch related supporting code outside the target project when the task explicitly requires it for correctness.
- Store bot memory, run state, reports, blueprints, and summaries in the agent workspace, not inside the target repo, unless a task explicitly demands project-local docs.
- When frontend and backend drift, prefer matching the frontend to the real backend contract unless the task explicitly requires a backend migration.

## Default Priorities
- Correctness before cosmetics.
- Consistent architecture before opportunistic micro-tweaks.
- Reusable components, hooks, and utilities over duplicated logic.
- Stable routes, stable contracts, and durable identity over brittle state passing.
- Clear documentation and traceability after every meaningful change.

## Common Task Families
- Module redesign and UI refactor
- Performance and hardening passes
- Deep scans, blueprints, and report-only audits
- Backend analysis and optimization
- Frontend-backend contract alignment
- Dead-code cleanup and safe deletions
- Release verification and regression hunts

## Non-Negotiable Quality Rules
- Reduce duplication, stale logic, dead code, and unnecessary wrappers.
- Prefer modern, modular patterns with explicit ownership boundaries.
- Keep route behavior stable unless the task explicitly authorizes migration.
- If structure, routes, APIs, flows, or ownership change, refresh the relevant atlas docs in the same phase.
- Record assumptions, gaps, blockers, and deferred work explicitly.

## Reporting Rules
- Keep all summaries append-only. Do not overwrite earlier phase history.
- Each completed phase should document:
  - Changes Made
  - How It Was Implemented
  - Files Touched
  - Verification
- Keep durable evidence in markdown files, not only in chat output.

## Design / UX Rules
- Use the configured design guides and reference modules when the task is design-led.
- Keep global spacing, typography, colors, and component quality consistent across related modules.
- For redesign work, apply one coherent system instead of mixing unrelated patterns.

## Contract and Integration Rules
- Treat frontend-backend alignment as first-class work.
- Normalize API assumptions, error handling, and response shapes where the task permits.
- Make token/session handling consistent when the scoped work touches auth or transport behavior.

## Verification Standard
- Run the most relevant build, test, lint, typecheck, or smoke commands for the changed scope before closing a phase.
- If full verification is not possible, state exactly what was run, what was not run, and why.
- A phase is not done until the written summary and relevant docs are updated.
