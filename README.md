# Codex Project Bot GUI

Standalone local GUI for the Codex project bot. This app lives outside the `Huz` workspace and controls the project-bot workflow through a browser.

Beginner manual:
- See `USER_MANUAL.md` for full step-by-step usage.

Storage model:
- The GUI uses a separate agent workspace for memory and reports.
- The default agent workspace is `/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/default`
- The target project is only the repo Codex edits.
- This keeps bot docs, run state, and summaries out of the project repo.

## Start

```bash
cd /Users/macbook/Desktop/Codex-Project-Bot-GUI
npm start
```

Then open:

- http://localhost:4311

## What It Can Do

- Initialize a project-bot workspace
- Start a new project-bot run in any supported mode
- Show a guided mode helper so non-technical users can choose the right job type
- Offer prompt-coaching helpers, starter prompts, and a structured prompt template
- Offer one-click quick-start presets for common jobs like scans, backlog fixing, revamps, audits, cleanup, and release checks
- Offer a workspace library so you can create separate agent workspaces per project and switch between them with one click
- Offer an old-run migration tool that imports previous runs into the current agent workspace
- Show recent runs, reopen them, and restart autopilot from the GUI
- Build coordinated multi-agent team plans from one master prompt, with per-agent run prompts, ownership lanes, and dependency waves
- Auto-advance a team campaign so ready agents start in order as earlier waves finish
- Show recent summary previews so you can browse older run outcomes without loading each run
- Launch autopilot for the current run
- Stop the active autopilot process started by this GUI
- Choose a model, reasoning depth, quality preset, quiet mode, refresh rate, and max cycles
- Enforce a stored “Force External Docs” policy so reports and bot memory stay outside the project repo by default
- Show run status, next prompt, run summary, and the latest log tail

## Notes

- The GUI uses the existing global project-bot engine at:
  - `/Users/macbook/.codex/skills/project-autopilot-manager/scripts/project_orchestrate.mjs`
- It ships with its own local autopilot runner under `bin/`.
- No npm dependencies are required beyond Node.js.
