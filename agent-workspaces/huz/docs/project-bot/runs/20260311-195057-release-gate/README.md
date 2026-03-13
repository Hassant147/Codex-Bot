# Project Bot Run

- Run directory: `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz/docs/project-bot/runs/20260311-195057-release-gate`
- Mode: `release-gate`
- Target project: `/Users/macbook/Desktop/Huz`
- Scope level: `full-system`
- Scope targets: `/Users/macbook/Desktop/Huz/Huz-Admin-Frontend`, `/Users/macbook/Desktop/Huz/Huz-Operator-Frontend`, `/Users/macbook/Desktop/Huz/Huz-Web-Frontend`, `/Users/macbook/Desktop/Huz/Huz-Backend`
- Agent workspace: `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz`
- External docs policy: `Prefer agent workspace docs`
- Full-system required docs: `enabled`

Commands:
- `node /Users/macbook/.codex/skills/project-autopilot-manager/scripts/project_orchestrate.mjs status --run /Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz/docs/project-bot/runs/20260311-195057-release-gate`
- `node /Users/macbook/.codex/skills/project-autopilot-manager/scripts/project_orchestrate.mjs complete --run /Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz/docs/project-bot/runs/20260311-195057-release-gate --phase <id>`
- `node /Users/macbook/.codex/skills/project-autopilot-manager/scripts/project_orchestrate.mjs next --run /Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz/docs/project-bot/runs/20260311-195057-release-gate`
- `node /Users/macbook/.codex/skills/project-autopilot-manager/scripts/project_orchestrate.mjs refresh-run --run /Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz/docs/project-bot/runs/20260311-195057-release-gate`

Use the shared autopilot runner with:
- `ORCH_DIR_OVERRIDE=/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz/docs/project-bot/runs/20260311-195057-release-gate /Users/macbook/Desktop/Huz/scripts/run-orchestration-autopilot.sh /Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz`
