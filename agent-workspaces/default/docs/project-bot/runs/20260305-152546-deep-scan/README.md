# Project Bot Run

- Run directory: `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/default/docs/project-bot/runs/20260305-152546-deep-scan`
- Mode: `deep-scan`
- Target project: `/Users/macbook/Desktop/Huz/Huz-Web-Frontend`
- Agent workspace: `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/default`
- External docs policy: `Prefer agent workspace docs`

Commands:
- `node /Users/macbook/.codex/skills/project-autopilot-manager/scripts/project_orchestrate.mjs status --run /Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/default/docs/project-bot/runs/20260305-152546-deep-scan`
- `node /Users/macbook/.codex/skills/project-autopilot-manager/scripts/project_orchestrate.mjs complete --run /Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/default/docs/project-bot/runs/20260305-152546-deep-scan --phase <id>`
- `node /Users/macbook/.codex/skills/project-autopilot-manager/scripts/project_orchestrate.mjs next --run /Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/default/docs/project-bot/runs/20260305-152546-deep-scan`
- `node /Users/macbook/.codex/skills/project-autopilot-manager/scripts/project_orchestrate.mjs refresh-run --run /Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/default/docs/project-bot/runs/20260305-152546-deep-scan`

Use the shared autopilot runner with:
- `ORCH_DIR_OVERRIDE=/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/default/docs/project-bot/runs/20260305-152546-deep-scan /Users/macbook/Desktop/Huz/scripts/run-orchestration-autopilot.sh /Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/default`
