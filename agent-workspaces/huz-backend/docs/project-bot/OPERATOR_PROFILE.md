# Operator Profile

This file captures the default working style for the project bot. Every run should read this file before planning or changing code.

## Working Style
- Work in clearly scoped phases with durable written outputs.
- Prefer module-by-module execution instead of scattered random fixes.
- Treat frontend and backend as one connected system map when integration is involved.
- Use existing atlas docs first, then read only the extra code needed for accuracy.

## Scope Rules
- The target project is the only place code changes should happen unless the task explicitly requires a related supporting change.
- Keep the bot workspace as the long-term memory layer. Store reports, atlas docs, backlogs, summaries, and run state here instead of inside the target repo when possible.
- Match frontend to backend contracts when drift is found, unless the task explicitly says to refactor the backend contract itself.

## Quality Rules
- Reduce duplication, stale logic, dead code, and brittle state flows.
- Prefer modern modular patterns, reusable primitives, and clear ownership boundaries.
- Keep routes stable unless the task explicitly requires a migration.
- If code changes affect structure, routes, APIs, or ownership, refresh the relevant atlas docs in the same phase.

## Reporting Rules
- Keep summaries append-only. Do not overwrite prior phase history.
- Each completed phase should document: changes made, implementation approach, files touched, and verification.
- Record assumptions, gaps, blockers, and any deferred work explicitly.

## Common Task Families
- Module redesign and refactor
- Performance and hardening passes
- Report-only audits and blueprints
- Backend analysis or optimization
- Frontend-backend contract alignment
- Cleanup of proven-unused files and dead code
