#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="${1:-/Users/macbook/Desktop/Huz}"
MAX_CYCLES="${MAX_CYCLES:-12}"
MODE="${MODE:-full-auto}"
MODEL="${MODEL:-}"
EFFORT="${EFFORT:-}"
CODEX_BIN="${CODEX_BIN:-}"
QUIET_AGENT_OUTPUT="${QUIET_AGENT_OUTPUT:-0}"
ORCH_DIR_OVERRIDE="${ORCH_DIR_OVERRIDE:-}"
CODEX_PROFILE="${CODEX_PROFILE:-}"
CODEX_SEARCH="${CODEX_SEARCH:-0}"
CODEX_ADD_DIRS="${CODEX_ADD_DIRS:-}"
CODEX_CONFIG_OVERRIDES="${CODEX_CONFIG_OVERRIDES:-}"
CODEX_ENABLE_FEATURES="${CODEX_ENABLE_FEATURES:-}"

if [[ -n "${ORCH_DIR_OVERRIDE}" ]]; then
  ORCH_DIR="${ORCH_DIR_OVERRIDE}"
else
  ORCH_DIR="${ROOT_DIR}/docs/orchestration"
fi

NEXT_PROMPT_FILE="${ORCH_DIR}/NEXT_PROMPT.md"
STATE_FILE="${ORCH_DIR}/state.json"
RUN_SUMMARY_FILE="${ORCH_DIR}/RUN_SUMMARY.md"
LOG_DIR="${ORCH_DIR}/logs/$(date +%Y%m%d-%H%M%S)"

if [[ -z "${CODEX_BIN}" ]]; then
  if command -v codex >/dev/null 2>&1; then
    CODEX_BIN="$(command -v codex)"
  elif [[ -x "/Applications/Codex.app/Contents/Resources/codex" ]]; then
    CODEX_BIN="/Applications/Codex.app/Contents/Resources/codex"
  else
    echo "Unable to find Codex CLI."
    echo "Set CODEX_BIN=/absolute/path/to/codex and rerun."
    exit 1
  fi
fi

if [[ ! -f "${NEXT_PROMPT_FILE}" || ! -f "${STATE_FILE}" ]]; then
  echo "Missing orchestration files in ${ORCH_DIR}."
  echo "Run orchestration init/start-run first."
  exit 1
fi

mkdir -p "${LOG_DIR}"

phase_cursor() {
  node -e 'const fs=require("fs");const p=process.argv[1];const s=JSON.parse(fs.readFileSync(p,"utf8"));process.stdout.write(String(s.phaseCursor));' "${STATE_FILE}"
}

project_path() {
  node -e 'const fs=require("fs");const p=process.argv[1];const s=JSON.parse(fs.readFileSync(p,"utf8"));process.stdout.write(String(s.projectPath||""));' "${STATE_FILE}"
}

phase_snapshot() {
  node -e 'const fs=require("fs");const p=process.argv[1];const s=JSON.parse(fs.readFileSync(p,"utf8"));const phases=s.phases||[];const total=phases.length;const completed=phases.filter(x=>x.status==="completed").length;const next=phases.find(x=>x.status!=="completed");if(!next){process.stdout.write(`${completed}|${total}|done|Complete`);process.exit(0);}process.stdout.write(`${completed}|${total}|${next.id}|${next.title}`);' "${STATE_FILE}"
}

all_done() {
  node -e 'const fs=require("fs");const p=process.argv[1];const s=JSON.parse(fs.readFileSync(p,"utf8"));process.exit(s.phases.every(x=>x.status==="completed")?0:1);' "${STATE_FILE}"
}

progress_bar() {
  local completed="$1"
  local total="$2"
  local filled="" empty="" i

  for ((i=0; i<completed; i++)); do
    filled+="#"
  done

  for ((i=completed; i<total; i++)); do
    empty+="-"
  done

  printf '[%s%s]' "${filled}" "${empty}"
}

build_codex_cmd() {
  local last_message_file="$1"
  local target_project

  # Allow orchestrations launched from workspace docs folders without requiring a trusted git root.
  CODEX_CMD=("${CODEX_BIN}" exec -C "${ROOT_DIR}" --skip-git-repo-check --output-last-message "${last_message_file}")

  target_project="$(project_path)"
  if [[ -n "${target_project}" && "${target_project}" != "${ROOT_DIR}" ]]; then
    CODEX_CMD+=(--add-dir "${target_project}")
  fi

  if [[ -n "${CODEX_PROFILE}" ]]; then
    CODEX_CMD+=(-p "${CODEX_PROFILE}")
  fi

  if [[ "${CODEX_SEARCH}" == "1" ]]; then
    CODEX_CMD+=(--search)
  fi

  while IFS= read -r add_dir; do
    [[ -z "${add_dir}" ]] && continue
    CODEX_CMD+=(--add-dir "${add_dir}")
  done <<< "${CODEX_ADD_DIRS}"

  while IFS= read -r override; do
    [[ -z "${override}" ]] && continue
    CODEX_CMD+=(-c "${override}")
  done <<< "${CODEX_CONFIG_OVERRIDES}"

  while IFS= read -r feature; do
    [[ -z "${feature}" ]] && continue
    CODEX_CMD+=(--enable "${feature}")
  done <<< "${CODEX_ENABLE_FEATURES}"

  if [[ "${MODE}" == "dangerous" ]]; then
    CODEX_CMD+=(--dangerously-bypass-approvals-and-sandbox)
  else
    CODEX_CMD+=(--full-auto)
  fi

  if [[ -n "${MODEL}" ]]; then
    CODEX_CMD+=(-m "${MODEL}")
  fi

  if [[ -n "${EFFORT}" ]]; then
    CODEX_CMD+=(-c "model_reasoning_effort=\"${EFFORT}\"")
  fi
}

echo "Autopilot start"
echo "Root: ${ROOT_DIR}"
echo "Logs: ${LOG_DIR}"
echo "Mode: ${MODE}"
echo "Codex: ${CODEX_BIN}"
echo "Model: ${MODEL:-<config-default>}"
echo "Effort: ${EFFORT:-<config-default>}"
echo "Profile: ${CODEX_PROFILE:-<config-default>}"
echo "Search: ${CODEX_SEARCH}"
echo "Quiet agent output: ${QUIET_AGENT_OUTPUT}"
echo "Max cycles: ${MAX_CYCLES}"
echo "Run summary: ${RUN_SUMMARY_FILE}"

for ((cycle=1; cycle<=MAX_CYCLES; cycle++)); do
  if all_done; then
    echo "All phases completed."
    break
  fi

  IFS='|' read -r before_completed total_phases before_cursor before_title <<< "$(phase_snapshot)"
  before_cursor="$(phase_cursor)"
  prompt_snapshot="${LOG_DIR}/prompt-${cycle}.md"
  stdout_log="${LOG_DIR}/stdout-${cycle}.log"
  last_message="${LOG_DIR}/last-message-${cycle}.txt"

  cp "${NEXT_PROMPT_FILE}" "${prompt_snapshot}"

  echo ""
  echo "=== Cycle ${cycle} ==="
  echo "Progress: $(progress_bar "${before_completed}" "${total_phases}") ${before_completed}/${total_phases} complete"
  echo "Current: Phase ${before_cursor} - ${before_title}"
  echo "Prompt: ${prompt_snapshot}"
  echo "Log: ${stdout_log}"
  echo "Last message: ${last_message}"

  declare -a CODEX_CMD=()
  build_codex_cmd "${last_message}"
  if [[ "${QUIET_AGENT_OUTPUT}" == "1" ]]; then
    echo "Agent output hidden. Writing full output to log."
    "${CODEX_CMD[@]}" - < "${prompt_snapshot}" > "${stdout_log}" 2>&1
  else
    echo "Agent output streaming below."
    "${CODEX_CMD[@]}" - < "${prompt_snapshot}" 2>&1 | tee "${stdout_log}"
  fi

  IFS='|' read -r after_completed _ after_cursor after_title <<< "$(phase_snapshot)"
  echo "Completed: Phase ${before_cursor} - ${before_title}"

  if [[ "${after_cursor}" == "${before_cursor}" ]]; then
    echo "Phase cursor did not advance. Stopping to avoid infinite loop."
    echo "Inspect: ${stdout_log}"
    exit 2
  fi

  if [[ "${after_cursor}" == "done" ]]; then
    echo "Progress: $(progress_bar "${after_completed}" "${total_phases}") ${after_completed}/${total_phases} complete"
    echo "Next: None. Orchestration complete."
  else
    echo "Progress: $(progress_bar "${after_completed}" "${total_phases}") ${after_completed}/${total_phases} complete"
    echo "Next: Phase ${after_cursor} - ${after_title}"
  fi
done

echo ""
echo "Autopilot finished."
echo "Next prompt file: ${NEXT_PROMPT_FILE}"
echo "Status command:"
if [[ -n "${ORCH_DIR_OVERRIDE}" ]]; then
  echo "node /Users/macbook/.codex/skills/project-autopilot-manager/scripts/project_orchestrate.mjs status --run ${ORCH_DIR}"
else
  echo "Check the status tool appropriate to your orchestration root."
fi

if all_done; then
  echo ""
  echo "=== Final Summary ==="
  if [[ -f "${RUN_SUMMARY_FILE}" ]]; then
    cat "${RUN_SUMMARY_FILE}"
  else
    echo "Run summary file not found: ${RUN_SUMMARY_FILE}"
  fi
fi
