# Project Bot Workspace

This directory stores reusable Codex project-bot state.

Core files:
- `config.json`: workspace defaults (including the external docs policy)
- `OPERATOR_PROFILE.md`: the default working style and non-negotiable rules for every run
- `LATEST_RUN.txt`: absolute path to the most recent run
- `runs/<run-id>/`: per-run prompts, state, and summaries

Use:
- `node /Users/macbook/.codex/skills/project-autopilot-manager/scripts/project_orchestrate.mjs init-workspace ...`
- `node /Users/macbook/.codex/skills/project-autopilot-manager/scripts/project_orchestrate.mjs start-run ...`
- `node /Users/macbook/.codex/skills/project-autopilot-manager/scripts/project_orchestrate.mjs status --run <run-dir>`
- `node /Users/macbook/.codex/skills/project-autopilot-manager/scripts/project_orchestrate.mjs complete --run <run-dir> --phase <id>`
- `node /Users/macbook/.codex/skills/project-autopilot-manager/scripts/project_orchestrate.mjs next --run <run-dir>`
- `node /Users/macbook/.codex/skills/project-autopilot-manager/scripts/project_orchestrate.mjs refresh-run --run <run-dir>`
