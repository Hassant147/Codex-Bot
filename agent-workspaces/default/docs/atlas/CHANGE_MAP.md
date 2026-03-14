# Change Map

Every code-changing run should append what changed and which atlas docs were refreshed.

## Entries

### Date: 2026-03-13
- Scope: corporate productization rewrite for the Codex Project Bot GUI itself.
- Files changed:
  - `src/**`
  - `server/**`
  - `index.html`
  - `package.json`
  - `tsconfig.json`
  - `vite.config.ts`
  - `playwright.config.ts`
  - `README.md`
  - `USER_MANUAL.md`
  - `agent-workspaces/default/docs/project-bot/config.json`
  - `agent-workspaces/default/docs/project-bot/LATEST_RUN.txt`
- Atlas docs refreshed:
  - `docs/atlas/PROJECT_BLUEPRINT.md`
  - `docs/atlas/SYSTEM_BLUEPRINT.md`
  - `docs/atlas/ROUTES_AND_ENTRYPOINTS.md`
  - `docs/atlas/MODULE_MAP.md`
  - `docs/atlas/API_SURFACE.md`
  - `docs/atlas/CHANGE_MAP.md`
- Notes:
  - Replaced the old static shell with a modular `React + TypeScript + Vite` SPA.
  - Rebuilt the backend as domain services around workspace, runs, runtime, accounts, chat, CLI, and orchestration.
  - Added persistent runtime files, SSE live monitoring, provider-aware account recovery, workspace switching, and a beginner-oriented run wizard.
  - Removed shipped Huz-specific defaults from the default workspace seed and replaced old atlas content with product-accurate documentation.

### Date: 2026-03-13
- Scope: coordinated multi-agent runtime, API, and operator-surface upgrade for the Codex Project Bot GUI itself.
- Files changed:
  - `src/app/**`
  - `src/features/dashboard/**`
  - `src/features/run-wizard/**`
  - `src/features/agents/**`
  - `src/styles.css`
  - `server/app.mjs`
  - `server/config.mjs`
  - `server/routes/api-router.mjs`
  - `server/services/workspace-service.mjs`
  - `server/services/run-service.mjs`
  - `server/services/runtime-supervisor.mjs`
  - `server/services/command-builder.mjs`
  - `server/services/multi-agent-service.mjs`
  - `server/services/git-service.mjs`
  - `server/scripts/run-sub-agent.mjs`
  - `tests/**`
  - `README.md`
  - `USER_MANUAL.md`
  - `agent-workspaces/default/docs/project-bot/config.json`
- Atlas docs refreshed:
  - `docs/atlas/PROJECT_BLUEPRINT.md`
  - `docs/atlas/SYSTEM_BLUEPRINT.md`
  - `docs/atlas/ROUTES_AND_ENTRYPOINTS.md`
  - `docs/atlas/MODULE_MAP.md`
  - `docs/atlas/API_SURFACE.md`
  - `docs/atlas/CHANGE_MAP.md`
- Notes:
  - Replaced the old experimental multi-agent flag with explicit per-run `multiAgent` config and persisted that config on run snapshots.
  - Added manager-plus-workers orchestration with Git preflight, isolated worktrees, per-agent runtime artifacts, ownership checks, retry-once worker recovery, and manager-reviewed merge gating.
  - Extended the dashboard, wizard, and agents surfaces so operators can enable multi-agent mode manually and monitor one coordinated internal fleet without changing the top-level run model.
