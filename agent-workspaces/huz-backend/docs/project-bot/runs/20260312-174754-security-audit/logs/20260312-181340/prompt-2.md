Use $project-autopilot-manager in `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz-backend`.
Read `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz-backend/docs/project-bot/runs/20260312-174754-security-audit/state.json` and `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz-backend/docs/project-bot/runs/20260312-174754-security-audit/prompts/phase-01.md`.
Execute only Phase 1 (Analyze Security Risks) against target project `/Users/macbook/Desktop/Huz/Huz-Backend`.
At the end, run:
1. `node /Users/macbook/.codex/skills/project-autopilot-manager/scripts/project_orchestrate.mjs complete --run /Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz-backend/docs/project-bot/runs/20260312-174754-security-audit --phase 1`
2. `node /Users/macbook/.codex/skills/project-autopilot-manager/scripts/project_orchestrate.mjs next --run /Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz-backend/docs/project-bot/runs/20260312-174754-security-audit`
Then print `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz-backend/docs/project-bot/runs/20260312-174754-security-audit/NEXT_PROMPT.md`.
