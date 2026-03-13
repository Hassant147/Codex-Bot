#!/usr/bin/env bash

set -euo pipefail

WORKSPACE_ROOT="/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz"
PROJECT_ROOT="/Users/macbook/Desktop/Huz"
ORCH="node /Users/macbook/.codex/skills/project-autopilot-manager/scripts/project_orchestrate.mjs"
RUNNER="/Users/macbook/Desktop/Huz/scripts/run-project-bot.sh"
MASTER_REQUEST="$WORKSPACE_ROOT/docs/project-bot/BOOKING_CONTRACT_REMEDIATION_MASTER_REQUEST_2026-03-11.md"
RUNS_ROOT="$WORKSPACE_ROOT/docs/project-bot/runs"
STATUS_DIR="$WORKSPACE_ROOT/docs/project-bot/campaigns/booking-contract-2026-03-11"
STATUS_FILE="$STATUS_DIR/STATUS.md"
LOG_FILE="$STATUS_DIR/supervisor.log"

mkdir -p "$STATUS_DIR"

log() {
  local message="$1"
  printf '%s %s\n' "$(date '+%Y-%m-%d %H:%M:%S')" "$message" | tee -a "$LOG_FILE"
}

write_status() {
  local stage="$1"
  local run_dir="$2"
  cat > "$STATUS_FILE" <<EOF
# Booking Contract Campaign Status

- Updated: $(date '+%Y-%m-%d %H:%M:%S')
- Stage: $stage
- Active run: $run_dir
- Workspace: $WORKSPACE_ROOT
- Project: $PROJECT_ROOT
- Log: $LOG_FILE
EOF
}

run_complete() {
  node - "$1" <<'NODE'
const fs = require("fs");
const state = JSON.parse(fs.readFileSync(process.argv[2], "utf8"));
process.exit(state.phases.every((phase) => phase.status === "completed") ? 0 : 1);
NODE
}

refresh_and_run_until_complete() {
  local label="$1"
  local run_dir="$2"
  local state_file="$run_dir/state.json"

  while true; do
    if run_complete "$state_file"; then
      log "$label already complete: $run_dir"
      write_status "$label complete" "$run_dir"
      return 0
    fi

    write_status "$label running" "$run_dir"
    log "Refreshing prompts for $label: $run_dir"
    $ORCH refresh-run --run "$run_dir" >> "$LOG_FILE" 2>&1 || true

    log "Starting autopilot for $label"
    if MAX_IDLE_ROUNDS=12 IDLE_SLEEP_SECONDS=2 "$RUNNER" "$run_dir" >> "$LOG_FILE" 2>&1; then
      if run_complete "$state_file"; then
        log "$label completed successfully."
        write_status "$label complete" "$run_dir"
        return 0
      fi
    fi

    log "$label did not complete on this autopilot pass. Retrying in 10 seconds."
    sleep 10
  done
}

start_run() {
  local mode="$1"
  local request_file="$2"
  local scope_level="$3"
  local scope_targets="$4"
  local references="$5"
  local request

  request="$(cat "$request_file")"
  $ORCH start-run \
    --root "$WORKSPACE_ROOT" \
    --mode "$mode" \
    --request "$request" \
    --project "$PROJECT_ROOT" \
    --scope "$PROJECT_ROOT" \
    --scope-level "$scope_level" \
    --scope-targets "$scope_targets" \
    --references "$references" >> "$LOG_FILE" 2>&1

  cat "$WORKSPACE_ROOT/docs/project-bot/LATEST_RUN.txt"
}

get_or_create_run() {
  local key="$1"
  local mode="$2"
  local request_file="$3"
  local scope_level="$4"
  local scope_targets="$5"
  local references="$6"
  local run_file="$STATUS_DIR/${key}.run"

  if [[ -f "$run_file" ]]; then
    cat "$run_file"
    return 0
  fi

  local run_dir
  run_dir="$(start_run "$mode" "$request_file" "$scope_level" "$scope_targets" "$references")"
  printf '%s\n' "$run_dir" > "$run_file"
  cat "$run_file"
}

main() {
  local common_refs
  local batch01_run
  local batch02_run
  local batch03_run
  local batch04_run
  local batch05_run

  common_refs="$MASTER_REQUEST,$WORKSPACE_ROOT/docs/qa/BUG_BACKLOG.md,$WORKSPACE_ROOT/docs/qa/DEEP_SCAN_REPORT.md,$WORKSPACE_ROOT/docs/atlas/API_SURFACE.md,$PROJECT_ROOT/docs/codex_reports/BOOKING_FRONTEND_BACKEND_AUDIT_2026-03-11.md,$PROJECT_ROOT/docs/codex_reports/BOOKING_CONTRACT_AUDIT_2026-03-11.md"

  log "Booking contract remediation campaign supervisor started."

  batch01_run="$RUNS_ROOT/20260311-165731-fix-backlog"
  printf '%s\n' "$batch01_run" > "$STATUS_DIR/batch01.run"
  refresh_and_run_until_complete "Batch 01" "$batch01_run"

  batch02_run="$(get_or_create_run \
    "batch02" \
    "fix-backlog" \
    "$WORKSPACE_ROOT/docs/project-bot/BOOKING_CONTRACT_BATCH_02_2026-03-11.md" \
    "multi-panel-fullstack" \
    "$PROJECT_ROOT/Huz-Admin-Frontend,$PROJECT_ROOT/Huz-Backend" \
    "$common_refs")"
  refresh_and_run_until_complete "Batch 02" "$batch02_run"

  batch03_run="$(get_or_create_run \
    "batch03" \
    "fix-backlog" \
    "$WORKSPACE_ROOT/docs/project-bot/BOOKING_CONTRACT_BATCH_03_2026-03-11.md" \
    "multi-panel-fullstack" \
    "$PROJECT_ROOT/Huz-Admin-Frontend,$PROJECT_ROOT/Huz-Operator-Frontend,$PROJECT_ROOT/Huz-Backend" \
    "$common_refs")"
  refresh_and_run_until_complete "Batch 03" "$batch03_run"

  batch04_run="$(get_or_create_run \
    "batch04" \
    "fix-backlog" \
    "$WORKSPACE_ROOT/docs/project-bot/BOOKING_CONTRACT_BATCH_04_2026-03-11.md" \
    "multi-panel-fullstack" \
    "$PROJECT_ROOT/Huz-Operator-Frontend,$PROJECT_ROOT/Huz-Web-Frontend,$PROJECT_ROOT/Huz-Backend" \
    "$common_refs")"
  refresh_and_run_until_complete "Batch 04" "$batch04_run"

  batch05_run="$(get_or_create_run \
    "batch05" \
    "release-gate" \
    "$WORKSPACE_ROOT/docs/project-bot/BOOKING_CONTRACT_BATCH_05_FINALIZE_2026-03-11.md" \
    "full-system" \
    "$PROJECT_ROOT/Huz-Admin-Frontend,$PROJECT_ROOT/Huz-Operator-Frontend,$PROJECT_ROOT/Huz-Web-Frontend,$PROJECT_ROOT/Huz-Backend" \
    "$common_refs")"
  refresh_and_run_until_complete "Batch 05 Finalize" "$batch05_run"

  write_status "Campaign complete" "$batch05_run"
  log "Booking contract remediation campaign complete."
}

main "$@"
