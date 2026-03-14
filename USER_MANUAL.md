# Codex Project Bot GUI User Manual

This app is a local desktop control surface for running Codex project-bot work in a way that is readable for non-technical operators.

## What the app does

You can use the GUI to:
- create a bot run from a guided wizard
- start, pause, resume, and stop that run
- watch live timeline updates while the run is executing
- switch accounts if credits or authentication fail
- reopen old runs from history
- run Codex CLI commands from a safer preview screen
- keep workspace settings, project profiles, and local chat threads in one place

## Start the app

1. Open Terminal.
2. Go to the project folder:
   - `/Users/macbook/Desktop/Codex-Project-Bot-GUI`
3. Install dependencies if needed:
   - `npm install`
4. Start the app:
   - `npm start`
5. Open:
   - `http://localhost:4311`

## Main tabs

The product has seven main tabs:
1. Dashboard
2. Create Run
3. History
4. Agents
5. Codex CLI
6. Chat
7. Settings

## First-time setup

1. Open **Settings**.
2. In **Workspace**, set:
   - `Workspace Root`: where run history, docs, and runtime files are stored
   - `Project Path`: the codebase the bot should work on
3. Click **Save Workspace**.
4. In **Account Center**, choose one of these account setups:
   - save the current browser-based ChatGPT login as a reusable snapshot
   - enter an API key if you want the app to manage Codex sign-in for you
5. If you are using browser-login accounts:
   - sign in to Codex normally with your browser first
   - enter a snapshot name
   - click **Save Current Browser Login**
6. If you are using API keys:
   - enter a profile name and API key
   - click **Save + Sign In**
7. Click **Verify Current Session** to confirm the app sees the active Codex account.

## Create your first run

1. Open **Create Run**.
2. Step 1: choose a plain-language outcome.
3. Step 2: confirm workspace, project, and scope.
4. Step 3: review the final request.
5. Click **Create**.
6. The app returns you to **Dashboard** with the new run loaded.

### Multi-Agent Mode

Inside **Create Run**, you can manually enable **Multi-Agent Mode**.

What it does:
- keeps one main run visible in the product
- adds one manager plus `2` or `3` scoped workers under that run
- isolates workers in separate Git worktrees

Important limits in v1:
- default is `off`
- only `2` or `3` workers are supported
- the target project must be a Git repo with a clean working tree before start
- if that preflight fails, turn the toggle off and use a single-agent run instead

## Dashboard

The dashboard is the main working screen.

You will see:
- `Current Run`: status, progress, target project, next phase
- `Agent Fleet`: manager, workers, ownership, phase, and health when multi-agent mode is enabled
- `Create New Run`: shortcut back to the wizard
- `Account Health`: whether Codex is ready or blocked
- `Live Timeline`: one ordered list of status changes and runtime output
- `Run Summary`: readable completion notes
- `Next Prompt`: handoff text for manual continuation if needed

Main buttons:
- `Create`
- `Start`
- `Pause`
- `Resume`
- `Stop`
- `View Details`
- `Switch Account`

## If credits run out or login fails

When the runtime detects a quota or authentication problem, the run changes to `waiting_auth`.

What to do:
1. Stay on **Dashboard**.
2. Use one of these actions:
   - `Reconnect`: try the currently active saved account again
   - `Switch to <account name>`: move to another saved account
   - `Recheck Status`: refresh current Codex login state
   - `Resume`: continue the same run after recovery
3. The app keeps the same run folder and saved phase state. It does not create a new run just because you re-credited or changed account.
4. If you switched to a different browser-login snapshot in **Settings**, return to **Dashboard** and click **Resume**.

## History

Use **History** to reopen earlier runs.

Each run card shows:
- run type
- target project
- current state
- completed phases
- last update time

Click **View Details** to load that run back into Dashboard.

## Agents

Use **Agents** for two things:
- inspect the current run fleet when multi-agent mode is enabled
- run simple batch control across multiple saved runs

You can:
- select several runs
- start them together
- pause them together
- stop them together

## Codex CLI

Use **Codex CLI** when you want to run a CLI command from the GUI.

The screen shows:
- a command builder
- the exact command preview before execution
- the final stdout/stderr result

This keeps GUI actions aligned with the actual CLI command being sent.

## Chat

Use **Chat** for local workspace-aware conversations.

You can:
- create threads
- reopen threads
- keep messages stored locally with the workspace

## Settings

Use **Settings** to manage:
- workspace defaults
- saved workspaces
- reusable project profiles
- account sign-in and account switching

Useful actions:
- `Save Workspace`
- `Open` on a saved workspace
- `Save Current as Profile`
- `Save Current Browser Login`
- `Verify Current Session`
- `Switch Account`
- `Recheck Status`
- `Log Out`

### Browser-login account snapshots

Use this when you sign in to Codex with the browser flow instead of an API key.

How it works:
- the app saves the current Codex browser-login session as a named local snapshot
- switching later restores that saved session
- the app verifies the restored session before marking it active
- if verification fails, the app restores the previous session instead of leaving Codex broken

Important limits:
- this depends on Codex exposing a readable `~/.codex/auth.json`
- switching is manual only
- exact remaining limit numbers are not shown for every saved account
- use Codex `/status` for the currently active account if you need up-to-date limit information

## Where live runtime data is stored

Each run stores runtime files under:
- `runtime/status.json`
- `runtime/events.jsonl`
- `runtime/heartbeat.json`
- `runtime/command.json`
- `runtime/coordination.json`
- `runtime/agents/index.json`
- `runtime/agents/<agentId>/status.json`
- `runtime/agents/<agentId>/events.jsonl`
- `runtime/agents/<agentId>/assignment.json`
- `runtime/agents/<agentId>/worktree.json`
- `runtime/merge-report.json`

These files let the app recover status, show live history, and resume the same run after interruptions.

## If something looks wrong

Check these first:
1. Confirm the workspace root and project path in **Settings**.
2. Confirm Codex login state in **Account Center**.
3. Reopen the run from **History**.
4. Read the latest messages in the **Live Timeline**.
5. Use **Recheck Status** before trying again.
