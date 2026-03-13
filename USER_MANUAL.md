# Codex Project Bot GUI - User Manual (Beginner Friendly)

This guide explains the bot in simple words.
Use this if you are new and want clear steps.

## 1) What This Bot Does

This bot helps you manage coding work from a browser UI.

You can:
- scan a project
- create a task run
- start/stop automation (autopilot)
- chat with the bot
- run Codex CLI commands
- manage workspaces and profiles
- keep reports and project memory docs organized

## 2) Before You Start

1. Install Node.js on your machine.
2. Open Terminal.
3. Go to this folder:
   - `/Users/macbook/Desktop/Codex-Project-Bot-GUI`
4. Start the app:
   - `npm start`
5. Open browser:
   - `http://localhost:4311`

## 3) Quick First Run (Fast Start)

1. Open **Settings** tab.
2. Fill:
   - `Agent Workspace Root` (where bot stores reports/runs)
   - `Target Project` (your code folder)
3. Click **Save Workspace Settings**.
4. Open **New Run** tab.
5. Choose a Quick Start preset or Job Type.
6. Write your request in plain English.
7. Click **Create Run**.
8. Go to **Dashboard** tab.
9. Click **Start Autopilot**.
10. Watch progress in status/log/prompt/summary cards.

## 4) Screen Overview (Tabs)

The top tabs are:
1. Dashboard
2. New Run
3. History
4. Agents
5. Codex CLI
6. Chat
7. Settings

---

## 5) Dashboard Tab

### Main Use
Use this tab to control and monitor one run.

### Features
- Current run info card
- Progress card and progress bar
- Next phase card
- Target project card
- Autopilot controls
- Run status panel
- Live log panel with search
- Next prompt panel
- Run summary panel
- Git diff viewer

### Autopilot Controls (Sub-features)
- `Loaded Run Folder`
- `Quality Preset`
- `Auto-Refresh (seconds)`
- Advanced settings:
  - model
  - reasoning depth
  - max cycles
  - quiet output
  - auto refresh toggle

### Buttons
- **Start Autopilot**
- **Stop Run**
- **Refresh**
- **Copy Run Path**
- **Copy Next Prompt**

### Step-by-step: Monitor a run
1. Make sure run path is loaded in `Loaded Run Folder`.
2. Choose your quality preset.
3. Click **Start Autopilot**.
4. Read:
   - `Run Status` for phase progress
   - `Live Log` for output/errors
   - `Next Prompt` for continuation handoff
   - `Run Summary` for results
5. Click **Stop Run** if needed.

---

## 6) New Run Tab

### Main Use
Create a new bot job.

### Features
- Quick Start presets (one-click prompt starter)
- Job Type cards (mode selection)
- Task description box
- optional scope field
- optional references field
- Prompt Coach tools
- Advanced Scope Contract controls

### Quick Start Presets
1. Scan Project
2. Full System Atlas
3. Deep Audit
4. Full System Audit
5. Fix Backlog
6. Revamp Page
7. Audit Frontend
8. Audit Backend
9. Sync Contracts
10. Clean Dead Code
11. Speed Up App
12. Release Check

### Prompt Coach Tools
- **Use Suggested Prompt**
- **Insert Prompt Template**
- **Add Safety Rules**
- **Clear**

### Advanced Scope Contract (important)
- `Scope Level`
- `Scope Targets`
- `Enforce full-system required atlas docs`
- `Project Surfaces Override (JSON)`
- `Dev Ignore Override`
- `Required Atlas Docs Override`

### Scope Levels (simple meaning)
- `module`: one small part
- `panel-fe`: one frontend panel
- `panel-be`: one backend panel
- `panel-fullstack`: one panel + its backend
- `multi-panel-fe`: many frontend panels
- `multi-panel-fullstack`: many panels + backend
- `full-system`: complete system

### Step-by-step: Create a run
1. Pick a Quick Start or Job Type.
2. Fill `What Should Codex Do?`.
3. Optional: set `Scope`.
4. Optional: add `Extra Reference Files`.
5. Optional: open Advanced Scope Contract and set precise boundaries.
6. Click **Create Run**.
7. Move to Dashboard and click **Start Autopilot**.

---

## 7) History Tab

### Main Use
See old runs and reopen them.

### Features
- list of all runs
- status badge (running/done/failed)
- progress indicator
- summary preview
- load run into dashboard

### Step-by-step: Reopen old run
1. Open **History**.
2. Click **Refresh**.
3. Expand a run card.
4. Click **Load in Dashboard**.
5. Go to Dashboard and continue.

---

## 8) Agents Tab (Multi-Agent)

### Main Use
Control multiple runs at once.

### Features
- run list with checkboxes
- fleet summary
- per-run actions: start/stop/open
- batch actions:
  - select all
  - clear selection
  - start selected
  - stop selected

### Step-by-step: Start many runs
1. Open **Agents**.
2. Click **Refresh**.
3. Select runs (or click **Select All**).
4. Click **Start Selected**.
5. Watch status updates.

---

## 9) Codex CLI Tab

### Main Use
Run Codex CLI commands from GUI.

### Features
- Quick commands:
  - Login status
  - Features list
  - MCP list
  - Help
- Full command builder:
  - command/subcommand
  - prompt/slash command
  - model/profile/provider
  - sandbox/approval
  - cd path
  - config overrides
  - feature flags
  - image paths
  - timeout
- output panels:
  - CLI Surface
  - Command Result

### Step-by-step: Run a quick CLI check
1. Open **Codex CLI**.
2. Click **Login Status**.
3. Read output in `Command Result`.

---

## 10) Chat Tab

### Main Use
Chat with bot and optionally trigger automation runs.

### Features
- context selector (current workspace or saved profile)
- chat model + thinking level
- automation enable/disable toggle
- chat threads list
- conversation area
- message box
- **Prompt Compiler Preview** (new)
- quick button: **Run Deep Audit**

### Prompt Compiler Preview (what it does)
It shows what bot understood before you send message:
- detected mode
- scope level
- scope
- scope targets

### Step-by-step: Use Preview then Send
1. Write your message in Chat.
2. Click **Preview Intent**.
3. Read preview result.
4. If correct, click **Send Message**.
5. If message triggers automation, bot starts run + autopilot.

### Good message example
`Please run full system deep audit for this project and start autopilot. Scope targets: Web-Frontend, API-Backend`

---

## 11) Settings Tab

This is your control center for configuration.

### A) Agent Workspace
Use this first.

Fields:
- `Agent Workspace Root`
- `Target Project`
- Design guides list
- Blueprint sources list
- advanced scope/atlas defaults

Buttons:
- **Reload**
- **Save Workspace Settings**

### B) Scope & Atlas Defaults (Advanced)
Fields:
- `Default Scope Level`
- `Enable full-system required docs by default`
- `Project Surfaces (JSON array)`
- `Dev Ignore Patterns`
- `Required Atlas Docs`

These become defaults for new runs.

### C) Project Profiles
Save reusable setups.

Features:
- save current form as profile
- apply selected profile
- apply + save workspace in one click
- delete profile
- quick Huz preset button

### D) Global Instructions
Rules appended to every new run.

Example:
- always use specific coding style
- never remove comments
- always update docs after code changes

### E) Desktop Notifications
Enable browser alerts for run/phase events.

### F) Codex CLI Account
Features:
- view CLI version
- view login state
- view usage/limits (if available)
- login by API key
- logout

### G) Workspace Library
Create and switch between multiple named workspaces.

### H) Migration Tool
Import old runs from another workspace root.

### Step-by-step: Save a profile
1. Fill settings form.
2. Enter `Profile Name`.
3. Click **Save Current as Profile**.
4. Later, select it and click **Apply to Form**.

---

## 12) Run Modes (All Job Types)

These are available in Job Type selection:
1. System Atlas
2. Full System Atlas
3. Deep Scan
4. Full System Deep Audit
5. Plan Batch
6. Fix Backlog
7. Feature Delivery
8. Contract Sync
9. Design Revamp
10. UI Parity
11. Performance Pass
12. Responsive Hardening
13. Dead Code Prune
14. Test Hardening
15. Regression Hunt
16. Release Gate
17. Backend Audit
18. Backend Optimize
19. Security Audit
20. Migration Batch
21. Project Summary
22. Improvement Report
23. Change Journal
24. Full Enhance

Tip:
- If unsure, start with `Deep Scan` or `System Atlas`.

---

## 13) Quality Presets

1. `Max Quality` - strongest quality, slower
2. `Balanced` - good default
3. `Fast Sweep` - faster/lighter
4. `Custom` - manual setup

---

## 14) Common Beginner Workflows

### Workflow A: Audit project without code changes
1. New Run
2. Choose `Deep Audit` quick preset
3. Write request: "Report only first"
4. Create Run
5. Start Autopilot
6. Read Run Summary

### Workflow B: Full system blueprint setup
1. New Run
2. Choose `Full System Atlas`
3. Set scope level to `full-system`
4. Create Run
5. Start Autopilot
6. Review generated atlas docs

### Workflow C: Fix known backlog item
1. New Run
2. Choose `Fix Backlog`
3. Set scope to target module
4. Create Run
5. Start Autopilot
6. Check summary + diff

### Workflow D: Chat-driven run
1. Open Chat
2. Write request with clear action words (`run`, `start`, `perform`)
3. Click **Preview Intent**
4. If correct, click **Send Message**
5. Open Dashboard to monitor

---

## 15) Simple Troubleshooting

### Problem: "No run loaded"
Fix:
1. Go to History
2. Load a run
3. Return to Dashboard

### Problem: Chat did not start automation
Fix:
1. Ensure chat automation toggle is ON
2. Use action words like `Please run...`
3. Use Preview Intent first

### Problem: Workspace config error
Fix:
1. Open Settings
2. Fill workspace root + project path
3. Save Workspace Settings
4. Retry

### Problem: No logs changing
Fix:
1. Confirm run is active
2. Click Refresh
3. Check auto-refresh toggle and seconds

### Problem: CLI commands fail
Fix:
1. Open Settings > Codex CLI Account
2. Check login status
3. Sign in with API key if needed

---

## 16) Best Practices (Easy Rules)

1. Always save workspace settings before first run.
2. Use clear requests in plain English.
3. Keep scope focused when possible.
4. Use Preview Intent in Chat before sending.
5. Read Run Summary before starting next task.
6. Save good setups as Project Profiles.

---

## 17) Glossary (Simple Words)

- **Run**: one bot task instance.
- **Autopilot**: automatic phase execution loop.
- **Scope**: where bot should work.
- **Atlas docs**: system memory docs (maps/blueprints/reports).
- **Profile**: saved settings set (workspace + project + preferences).
- **Quick Start**: one-click starter template.

---

If you want, the next step can be a second manual called **"Only 10 Minute Setup Guide"** that is shorter and checklist-style.
