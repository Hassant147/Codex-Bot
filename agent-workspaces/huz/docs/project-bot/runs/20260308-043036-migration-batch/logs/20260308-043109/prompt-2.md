Use $project-autopilot-manager in `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz`.
Read `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz/docs/project-bot/runs/20260308-043036-migration-batch/state.json` and `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz/docs/project-bot/runs/20260308-043036-migration-batch/prompts/phase-01.md`.
Execute only Phase 1 (Plan Migration Steps) against target project `/Users/macbook/Desktop/Huz`.
At the end, run:
1. `node /Users/macbook/.codex/skills/project-autopilot-manager/scripts/project_orchestrate.mjs complete --run /Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz/docs/project-bot/runs/20260308-043036-migration-batch --phase 1`
2. `node /Users/macbook/.codex/skills/project-autopilot-manager/scripts/project_orchestrate.mjs next --run /Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz/docs/project-bot/runs/20260308-043036-migration-batch`
Then print `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz/docs/project-bot/runs/20260308-043036-migration-batch/NEXT_PROMPT.md`.
