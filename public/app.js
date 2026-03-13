/* ─── Element References ─── */
const els = {
  workspaceRoot: document.querySelector('#workspaceRoot'),
  projectPath: document.querySelector('#projectPath'),
  designGuides: document.querySelector('#designGuides'),
  blueprintSources: document.querySelector('#blueprintSources'),
  workspaceScopeLevelDefault: document.querySelector('#scopeLevelDefault'),
  workspaceProjectSurfaces: document.querySelector('#projectSurfaces'),
  workspaceDevIgnorePatterns: document.querySelector('#devIgnorePatterns'),
  workspaceRequiredAtlasDocs: document.querySelector('#requiredAtlasDocs'),
  workspaceFullSystemRequiredDocs: document.querySelector('#fullSystemRequiredDocs'),
  workspaceCodexProfile: document.querySelector('#workspaceCodexProfile'),
  workspaceCodexSearchEnabled: document.querySelector('#workspaceCodexSearchEnabled'),
  workspaceCodexExtraAddDirs: document.querySelector('#workspaceCodexExtraAddDirs'),
  workspaceCodexConfigOverrides: document.querySelector('#workspaceCodexConfigOverrides'),
  workspaceCodexAutoAddRelatedRepos: document.querySelector('#workspaceCodexAutoAddRelatedRepos'),
  workspaceCodexUseExperimentalMultiAgent: document.querySelector('#workspaceCodexUseExperimentalMultiAgent'),
  workspaceCodexBrowserNote: document.querySelector('#workspaceCodexBrowserNote'),
  refreshMeta: document.querySelector('#refreshMeta'),
  initWorkspace: document.querySelector('#initWorkspace'),
  refreshWorkspaces: document.querySelector('#refreshWorkspaces'),
  newWorkspaceName: document.querySelector('#newWorkspaceName'),
  createWorkspace: document.querySelector('#createWorkspace'),
  savedWorkspacesList: document.querySelector('#savedWorkspacesList'),
  refreshProjectProfiles: document.querySelector('#refreshProjectProfiles'),
  projectProfileName: document.querySelector('#projectProfileName'),
  projectProfileSelect: document.querySelector('#projectProfileSelect'),
  saveCurrentAsProfile: document.querySelector('#saveCurrentAsProfile'),
  applyProjectProfile: document.querySelector('#applyProjectProfile'),
  applyProfileAndInit: document.querySelector('#applyProfileAndInit'),
  deleteProjectProfile: document.querySelector('#deleteProjectProfile'),
  useHuzPreset: document.querySelector('#useHuzPreset'),
  projectProfilesList: document.querySelector('#projectProfilesList'),
  migrationSourceRoot: document.querySelector('#migrationSourceRoot'),
  migrateRuns: document.querySelector('#migrateRuns'),
  refreshHistory: document.querySelector('#refreshHistory'),
  cleanupDuplicateRuns: document.querySelector('#cleanupDuplicateRuns'),
  historyList: document.querySelector('#historyList'),
  refreshAgents: document.querySelector('#refreshAgents'),
  teamName: document.querySelector('#teamName'),
  teamScope: document.querySelector('#teamScope'),
  teamMasterPrompt: document.querySelector('#teamMasterPrompt'),
  teamCreate: document.querySelector('#teamCreate'),
  teamRefresh: document.querySelector('#teamRefresh'),
  teamStartReady: document.querySelector('#teamStartReady'),
  teamStopActive: document.querySelector('#teamStopActive'),
  teamSummary: document.querySelector('#teamSummary'),
  teamList: document.querySelector('#teamList'),
  teamDetails: document.querySelector('#teamDetails'),
  agentSelectAll: document.querySelector('#agentSelectAll'),
  agentClearSelection: document.querySelector('#agentClearSelection'),
  agentStartSelected: document.querySelector('#agentStartSelected'),
  agentStopSelected: document.querySelector('#agentStopSelected'),
  agentsSummary: document.querySelector('#agentsSummary'),
  agentsList: document.querySelector('#agentsList'),
  refreshCliCapabilities: document.querySelector('#refreshCliCapabilities'),
  cliQuickStatus: document.querySelector('#cliQuickStatus'),
  cliQuickFeatures: document.querySelector('#cliQuickFeatures'),
  cliQuickMcp: document.querySelector('#cliQuickMcp'),
  cliQuickHelp: document.querySelector('#cliQuickHelp'),
  cliCommand: document.querySelector('#cliCommand'),
  cliSubcommand: document.querySelector('#cliSubcommand'),
  cliTimeoutSeconds: document.querySelector('#cliTimeoutSeconds'),
  cliPrompt: document.querySelector('#cliPrompt'),
  cliSlashCommand: document.querySelector('#cliSlashCommand'),
  cliExtraArgs: document.querySelector('#cliExtraArgs'),
  cliModelPicker: document.querySelector('#cliModelPicker'),
  cliModel: document.querySelector('#cliModel'),
  cliProfile: document.querySelector('#cliProfile'),
  cliLocalProvider: document.querySelector('#cliLocalProvider'),
  cliSandbox: document.querySelector('#cliSandbox'),
  cliApproval: document.querySelector('#cliApproval'),
  cliCd: document.querySelector('#cliCd'),
  cliConfigOverrides: document.querySelector('#cliConfigOverrides'),
  cliAddDirs: document.querySelector('#cliAddDirs'),
  cliEnableFeatures: document.querySelector('#cliEnableFeatures'),
  cliDisableFeatures: document.querySelector('#cliDisableFeatures'),
  cliImagePaths: document.querySelector('#cliImagePaths'),
  cliUseSearch: document.querySelector('#cliUseSearch'),
  cliUseOss: document.querySelector('#cliUseOss'),
  cliFullAuto: document.querySelector('#cliFullAuto'),
  cliNoAltScreen: document.querySelector('#cliNoAltScreen'),
  cliDangerousBypass: document.querySelector('#cliDangerousBypass'),
  cliRunCommand: document.querySelector('#cliRunCommand'),
  cliResetForm: document.querySelector('#cliResetForm'),
  cliSurfaceView: document.querySelector('#cliSurfaceView'),
  cliResultView: document.querySelector('#cliResultView'),
  chatProfileContext: document.querySelector('#chatProfileContext'),
  chatModelPicker: document.querySelector('#chatModelPicker'),
  chatModel: document.querySelector('#chatModel'),
  chatEffort: document.querySelector('#chatEffort'),
  chatAutomationToggle: document.querySelector('#chatAutomationToggle'),
  chatCampaignPolicy: document.querySelector('#chatCampaignPolicy'),
  chatCampaignFollowupRuns: document.querySelector('#chatCampaignFollowupRuns'),
  chatCampaignPagesPerRun: document.querySelector('#chatCampaignPagesPerRun'),
  chatCampaignFollowupMode: document.querySelector('#chatCampaignFollowupMode'),
  chatContextSummary: document.querySelector('#chatContextSummary'),
  chatNewThread: document.querySelector('#chatNewThread'),
  chatRefreshThreads: document.querySelector('#chatRefreshThreads'),
  chatQuickDeepAudit: document.querySelector('#chatQuickDeepAudit'),
  chatThreadsList: document.querySelector('#chatThreadsList'),
  chatThreadTitle: document.querySelector('#chatThreadTitle'),
  chatThreadMeta: document.querySelector('#chatThreadMeta'),
  chatMessages: document.querySelector('#chatMessages'),
  chatInput: document.querySelector('#chatInput'),
  chatIntentPreview: document.querySelector('#chatIntentPreview'),
  chatPreviewIntent: document.querySelector('#chatPreviewIntent'),
  chatSend: document.querySelector('#chatSend'),
  mode: document.querySelector('#mode'),
  scopeLevel: document.querySelector('#scopeLevel'),
  scope: document.querySelector('#scope'),
  scopeTargets: document.querySelector('#scopeTargets'),
  runProjectSurfaces: document.querySelector('#runProjectSurfaces'),
  runDevIgnore: document.querySelector('#runDevIgnore'),
  runRequiredAtlasDocs: document.querySelector('#runRequiredAtlasDocs'),
  runFullSystemRequiredDocs: document.querySelector('#runFullSystemRequiredDocs'),
  request: document.querySelector('#request'),
  references: document.querySelector('#references'),
  useStarterPrompt: document.querySelector('#useStarterPrompt'),
  quickStartList: document.querySelector('#quickStartList'),
  jobTypeGrid: document.querySelector('#jobTypeGrid'),
  modeGuideCard: document.querySelector('#modeGuideCard'),
  insertFramework: document.querySelector('#insertFramework'),
  appendGuardrails: document.querySelector('#appendGuardrails'),
  clearRequest: document.querySelector('#clearRequest'),
  modeTitle: document.querySelector('#modeTitle'),
  modeSummary: document.querySelector('#modeSummary'),
  modeBestFor: document.querySelector('#modeBestFor'),
  startRun: document.querySelector('#startRun'),
  copyRunDir: document.querySelector('#copyRunDir'),
  copyNextPrompt: document.querySelector('#copyNextPrompt'),
  runDir: document.querySelector('#runDir'),
  qualityPreset: document.querySelector('#qualityPreset'),
  modelPicker: document.querySelector('#modelPicker'),
  modelInput: document.querySelector('#modelInput'),
  modelSuggestions: document.querySelector('#modelSuggestions'),
  effort: document.querySelector('#effort'),
  maxCycles: document.querySelector('#maxCycles'),
  quiet: document.querySelector('#quiet'),
  autopilotProfile: document.querySelector('#autopilotProfile'),
  autopilotSearch: document.querySelector('#autopilotSearch'),
  autopilotAddDirs: document.querySelector('#autopilotAddDirs'),
  autopilotConfigOverrides: document.querySelector('#autopilotConfigOverrides'),
  autopilotAutoAddRelatedRepos: document.querySelector('#autopilotAutoAddRelatedRepos'),
  autopilotExperimentalMultiAgent: document.querySelector('#autopilotExperimentalMultiAgent'),
  autopilotBrowserToolsNote: document.querySelector('#autopilotBrowserToolsNote'),
  autoRefresh: document.querySelector('#autoRefresh'),
  refreshSeconds: document.querySelector('#refreshSeconds'),
  startAutopilot: document.querySelector('#startAutopilot'),
  stopAutopilot: document.querySelector('#stopAutopilot'),
  refreshRun: document.querySelector('#refreshRun'),
  autopilotState: document.querySelector('#autopilotState'),
  phaseProgress: document.querySelector('#phaseProgress'),
  progressBar: document.querySelector('#progressBar'),
  statusView: document.querySelector('#statusView'),
  logPath: document.querySelector('#logPath'),
  logView: document.querySelector('#logView'),
  logSearch: document.querySelector('#logSearch'),
  logSearchCount: document.querySelector('#logSearchCount'),
  logAutoScrollBadge: document.querySelector('#logAutoScrollBadge'),
  promptView: document.querySelector('#promptView'),
  summaryView: document.querySelector('#summaryView'),
  currentRunShort: document.querySelector('#currentRunShort'),
  progressCardValue: document.querySelector('#progressCardValue'),
  nextPhaseCardValue: document.querySelector('#nextPhaseCardValue'),
  targetProjectShort: document.querySelector('#targetProjectShort'),
  responseBanner: document.querySelector('#responseBanner'),
  globalRules: document.querySelector('#globalRules'),
  saveGlobalRules: document.querySelector('#saveGlobalRules'),
  refreshCodexStatus: document.querySelector('#refreshCodexStatus'),
  codexCliVersion: document.querySelector('#codexCliVersion'),
  codexAuthState: document.querySelector('#codexAuthState'),
  codexAuthHint: document.querySelector('#codexAuthHint'),
  codexUsageState: document.querySelector('#codexUsageState'),
  codexUsageHint: document.querySelector('#codexUsageHint'),
  codexApiKey: document.querySelector('#codexApiKey'),
  codexLoginApiKey: document.querySelector('#codexLoginApiKey'),
  codexLogout: document.querySelector('#codexLogout'),
  codexStatusRaw: document.querySelector('#codexStatusRaw'),
  codexUsageRaw: document.querySelector('#codexUsageRaw'),
  enableNotifications: document.querySelector('#enableNotifications'),
  notificationStatus: document.querySelector('#notificationStatus'),
  loadDiff: document.querySelector('#loadDiff'),
  diffView: document.querySelector('#diffView'),
  diffStat: document.querySelector('#diffStat'),
  filePickerModal: document.querySelector('#filePickerModal'),
  filePickerBreadcrumb: document.querySelector('#filePickerBreadcrumb'),
  filePickerList: document.querySelector('#filePickerList'),
  filePickerCancel: document.querySelector('#filePickerCancel'),
  filePickerSelect: document.querySelector('#filePickerSelect'),
  themeToggle: document.querySelector('#themeToggle')
};

/* ─── Theme Toggle ─── */
function applyThemeUi(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  const isLight = theme === 'light';
  els.themeToggle.textContent = isLight ? '☀️' : '🌙';
  els.themeToggle.setAttribute('aria-label', isLight ? 'Switch to dark theme' : 'Switch to light theme');
  els.themeToggle.setAttribute('title', isLight ? 'Switch to dark theme' : 'Switch to light theme');
}

function initTheme() {
  const saved = localStorage.getItem('codex-theme') || 'light';
  applyThemeUi(saved);
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'light' ? 'dark' : 'light';
  applyThemeUi(next);
  localStorage.setItem('codex-theme', next);
}

els.themeToggle.addEventListener('click', toggleTheme);
initTheme();

/* ─── State ─── */
let currentRunDir = '';
let pollingHandle = null;
let cachedModes = [];
let cachedScopeLevels = [];
let cachedPresets = [];
let cachedModels = [];
let cachedDefaultModel = 'gpt-5.4';
let cachedQuickStarts = [];
let cachedWorkspaces = [];
let nextPromptCache = '';
let rawLogContent = '';
let logAutoScroll = true;
let filePickerTargetInput = null;
let filePickerCurrentDir = '';
let previousAutopilotActive = false;
let previousCompletedCount = 0;
const DEFAULT_MIGRATION_SOURCE_ROOT = '/Users/macbook/Desktop/Huz';
const DEFAULT_HUZ_PROJECT_ROOT = '/Users/macbook/Desktop/Huz';
const DEFAULT_HUZ_DESIGN_GUIDES = [
  '/Users/macbook/Desktop/Huz/UI_DESIGN_SYSTEM_GUIDE.md',
  '/Users/macbook/Desktop/Huz/HOMEPAGE_DEVELOPMENT_CUSTOMIZATION_GUIDE.md'
];
const DEFAULT_HUZ_RELATED_DIRS = [
  '/Users/macbook/Desktop/Huz/Huz-Backend',
  '/Users/macbook/Desktop/Huz/Huz-Admin-Frontend',
  '/Users/macbook/Desktop/Huz/Huz-Operator-Frontend'
];
let agentSelection = new Set();
let cachedAgentRuns = [];
let cachedTeams = [];
let cachedCliCapabilities = null;
let cachedProjectProfiles = [];
let cachedChatThreads = [];
let activeChatThreadId = '';
let activeTeamId = '';

/* ─── Tab Navigation ─── */
const tabButtons = document.querySelectorAll('.tab-btn');
const tabPanels = document.querySelectorAll('.tab-panel');
const validTabs = new Set([...tabButtons].map(btn => btn.dataset.tab));

function switchTab(tabId, options = {}) {
  if (!validTabs.has(tabId)) return;
  const { persist = true } = options;
  tabButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.tab === tabId));
  tabPanels.forEach(panel => panel.classList.toggle('active', panel.id === `tab-${tabId}`));
  if (persist) localStorage.setItem('codex-active-tab', tabId);
}
tabButtons.forEach(btn => btn.addEventListener('click', () => switchTab(btn.dataset.tab)));
const savedTab = localStorage.getItem('codex-active-tab');
if (savedTab && validTabs.has(savedTab)) switchTab(savedTab, { persist: false });

function focusElementById(elementId) {
  if (!elementId) return;
  const target = document.querySelector(`#${elementId}`);
  if (!target) return;
  target.focus({ preventScroll: true });
  target.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function initQuickNav() {
  const quickButtons = document.querySelectorAll('.quick-nav-btn');
  quickButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const nextTab = btn.dataset.goTab;
      const focusTarget = btn.dataset.focusTarget;
      if (nextTab) switchTab(nextTab);
      if (focusTarget) {
        // Wait for tab animation so focus targets are visible before scrolling.
        setTimeout(() => focusElementById(focusTarget), 80);
      }
    });
  });
}
initQuickNav();

/* ─── API Helper ─── */
function workspaceQuery(pathname) {
  const root = workspaceRootValue();
  if (!root) return pathname;
  return `${pathname}?workspaceRoot=${encodeURIComponent(root)}`;
}

async function api(path, options = {}) {
  const response = await fetch(path, { headers: { 'Content-Type': 'application/json' }, ...options });
  const payload = await response.json();
  if (!response.ok) throw new Error(payload.error || payload.stderr || payload.stdout || 'Request failed.');
  return payload;
}

/* ─── Toast ─── */
function showBanner(message, type = 'success') {
  els.responseBanner.textContent = message;
  els.responseBanner.className = `response-banner ${type} visible`;
  clearTimeout(showBanner._timer);
  showBanner._timer = setTimeout(() => els.responseBanner.classList.remove('visible'), 4000);
}

/* ─── Clipboard ─── */
async function copyText(text, successMessage) {
  if (!text) throw new Error('Nothing to copy yet.');
  await navigator.clipboard.writeText(text);
  showBanner(successMessage);
}

/* ─── Helpers ─── */
function shortenPath(value) {
  if (!value) return 'None';
  const c = String(value).trim();
  return c.length <= 46 ? c : `…${c.slice(-43)}`;
}
function pathEquals(l, r) { return String(l || '').trim() === String(r || '').trim(); }
function workspaceRootValue() { return els.workspaceRoot.value.trim(); }
function projectPathValue() { return els.projectPath.value.trim(); }
function resolvedRunDir() { return els.runDir.value.trim() || currentRunDir; }

/* ─── Desktop Notifications ─── */
function updateNotificationStatus() {
  if (!('Notification' in window)) {
    els.notificationStatus.textContent = 'Not supported in this browser';
    els.enableNotifications.disabled = true;
    return;
  }
  const perm = Notification.permission;
  if (perm === 'granted') {
    els.notificationStatus.textContent = 'Enabled ✓';
    els.enableNotifications.checked = true;
  } else if (perm === 'denied') {
    els.notificationStatus.textContent = 'Blocked by browser — check browser settings';
    els.enableNotifications.disabled = true;
  } else {
    els.notificationStatus.textContent = 'Click to request permission';
  }
}

function requestNotificationPermission() {
  if (!('Notification' in window)) return;
  if (Notification.permission === 'default') {
    Notification.requestPermission().then(updateNotificationStatus);
  }
}

function sendDesktopNotification(title, body) {
  if (!els.enableNotifications.checked) return;
  if (Notification.permission !== 'granted') return;
  try { new Notification(title, { body, icon: '⚡' }); } catch { }
}

els.enableNotifications.addEventListener('change', () => {
  if (els.enableNotifications.checked) requestNotificationPermission();
});
updateNotificationStatus();

/* ─── Mode Options ─── */
function setModeOptions(modes) {
  cachedModes = modes;
  els.mode.innerHTML = '';
  for (const m of modes) {
    const o = document.createElement('option');
    o.value = m.id; o.textContent = `${m.label} (${m.id})`;
    els.mode.appendChild(o);
  }
  renderJobTypeCards();
  updateModeGuide();
}

function renderJobTypeCards() {
  if (!els.jobTypeGrid) return;
  els.jobTypeGrid.innerHTML = '';
  for (const m of cachedModes) {
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'job-card';
    if (els.mode.value === m.id) card.classList.add('selected');
    card.innerHTML = `<span class="job-card-title">${m.label}</span><span class="job-card-desc">${m.summary}</span><span class="job-card-best">Best for: ${m.bestFor}</span>`;
    card.addEventListener('click', () => {
      els.mode.value = m.id;
      els.jobTypeGrid.querySelectorAll('.job-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      updateModeGuide();
    });
    els.jobTypeGrid.appendChild(card);
  }
}

function updateModeGuide() {
  const sel = cachedModes.find(m => m.id === els.mode.value);
  if (!sel) { els.modeGuideCard.style.display = 'none'; return; }
  els.modeGuideCard.style.display = '';
  els.modeTitle.textContent = sel.label;
  els.modeSummary.textContent = sel.summary;
  els.modeBestFor.textContent = `Best for: ${sel.bestFor}`;
  if (sel.id && sel.id.startsWith('full-system') && els.scopeLevel) {
    setSelectValueSafe(els.scopeLevel, 'full-system', 'full-system');
  }
}

const SCOPE_LEVEL_LABELS = {
  module: 'Module',
  'panel-fe': 'Panel Frontend',
  'panel-be': 'Panel Backend',
  'panel-fullstack': 'Panel Fullstack',
  'multi-panel-fe': 'Multi-Panel Frontend',
  'multi-panel-fullstack': 'Multi-Panel Fullstack',
  'full-system': 'Full System'
};

function selectValueExists(selectEl, value) {
  if (!selectEl) return false;
  return [...selectEl.options].some((option) => option.value === String(value || '').trim());
}

function setSelectValueSafe(selectEl, value, fallback = '') {
  if (!selectEl || !selectEl.options.length) return;
  const target = String(value || '').trim();
  if (target && selectValueExists(selectEl, target)) {
    selectEl.value = target;
    return;
  }
  const normalizedFallback = String(fallback || '').trim();
  if (normalizedFallback && selectValueExists(selectEl, normalizedFallback)) {
    selectEl.value = normalizedFallback;
    return;
  }
  selectEl.value = selectEl.options[0].value;
}

function listTextFromValue(value) {
  if (Array.isArray(value)) {
    return value.map((entry) => String(entry || '').trim()).filter(Boolean).join('\n');
  }
  return String(value || '')
    .split(/\r?\n|,/)
    .map((entry) => entry.trim())
    .filter(Boolean)
    .join('\n');
}

function prettyJsonArray(value, fallback = '[]') {
  if (Array.isArray(value)) {
    return JSON.stringify(value, null, 2);
  }
  const text = String(value || '').trim();
  if (!text) return fallback;
  try {
    const parsed = JSON.parse(text);
    if (!Array.isArray(parsed)) return fallback;
    return JSON.stringify(parsed, null, 2);
  } catch {
    return fallback;
  }
}

function parseJsonArrayField(rawValue, label, options = {}) {
  const allowEmpty = options.allowEmpty !== false;
  const text = String(rawValue || '').trim();
  if (!text) {
    return allowEmpty ? [] : null;
  }
  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error(`${label} must be valid JSON array text.`);
  }
  if (!Array.isArray(parsed)) {
    throw new Error(`${label} must be a JSON array.`);
  }
  return parsed;
}

function setScopeLevelOptions(levels) {
  const normalized = [...new Set((Array.isArray(levels) ? levels : [])
    .map((entry) => String(entry || '').trim())
    .filter(Boolean))];
  cachedScopeLevels = normalized.length ? normalized : ['module'];

  const targets = [els.workspaceScopeLevelDefault, els.scopeLevel];
  for (const selectEl of targets) {
    if (!selectEl) continue;
    const previous = String(selectEl.value || '').trim();
    selectEl.innerHTML = '';
    for (const level of cachedScopeLevels) {
      const option = document.createElement('option');
      option.value = level;
      option.textContent = SCOPE_LEVEL_LABELS[level] ? `${SCOPE_LEVEL_LABELS[level]} (${level})` : level;
      selectEl.appendChild(option);
    }
    setSelectValueSafe(selectEl, previous, cachedScopeLevels[0]);
  }
}

function syncRunScopeDefaultsFromWorkspace(options = {}) {
  const force = Boolean(options.force);
  if (els.scopeLevel && els.workspaceScopeLevelDefault) {
    setSelectValueSafe(
      els.scopeLevel,
      force ? els.workspaceScopeLevelDefault.value : (els.scopeLevel.value || els.workspaceScopeLevelDefault.value),
      els.workspaceScopeLevelDefault.value || cachedScopeLevels[0] || 'module'
    );
  }
  if (els.runProjectSurfaces && els.workspaceProjectSurfaces && (force || !els.runProjectSurfaces.value.trim())) {
    els.runProjectSurfaces.value = String(els.workspaceProjectSurfaces.value || '').trim();
  }
  if (els.runDevIgnore && els.workspaceDevIgnorePatterns && (force || !els.runDevIgnore.value.trim())) {
    els.runDevIgnore.value = String(els.workspaceDevIgnorePatterns.value || '').trim();
  }
  if (els.runRequiredAtlasDocs && els.workspaceRequiredAtlasDocs && (force || !els.runRequiredAtlasDocs.value.trim())) {
    els.runRequiredAtlasDocs.value = String(els.workspaceRequiredAtlasDocs.value || '').trim();
  }
  if (els.runFullSystemRequiredDocs && els.workspaceFullSystemRequiredDocs && (force || !els.runFullSystemRequiredDocs.checked)) {
    els.runFullSystemRequiredDocs.checked = Boolean(els.workspaceFullSystemRequiredDocs.checked);
  }
}

function syncAutopilotCodexDefaultsFromWorkspace(options = {}) {
  const force = Boolean(options.force);
  if (els.autopilotProfile && els.workspaceCodexProfile && (force || !els.autopilotProfile.value.trim())) {
    els.autopilotProfile.value = String(els.workspaceCodexProfile.value || '').trim();
  }
  if (els.autopilotSearch && els.workspaceCodexSearchEnabled && (force || !els.autopilotSearch.checked)) {
    els.autopilotSearch.checked = Boolean(els.workspaceCodexSearchEnabled.checked);
  }
  if (els.autopilotAddDirs && els.workspaceCodexExtraAddDirs && (force || !els.autopilotAddDirs.value.trim())) {
    els.autopilotAddDirs.value = String(els.workspaceCodexExtraAddDirs.value || '').trim();
  }
  if (els.autopilotConfigOverrides && els.workspaceCodexConfigOverrides && (force || !els.autopilotConfigOverrides.value.trim())) {
    els.autopilotConfigOverrides.value = String(els.workspaceCodexConfigOverrides.value || '').trim();
  }
  if (els.autopilotAutoAddRelatedRepos && els.workspaceCodexAutoAddRelatedRepos && (force || !els.autopilotAutoAddRelatedRepos.checked)) {
    els.autopilotAutoAddRelatedRepos.checked = Boolean(els.workspaceCodexAutoAddRelatedRepos.checked);
  }
  if (els.autopilotExperimentalMultiAgent && els.workspaceCodexUseExperimentalMultiAgent && (force || !els.autopilotExperimentalMultiAgent.checked)) {
    els.autopilotExperimentalMultiAgent.checked = Boolean(els.workspaceCodexUseExperimentalMultiAgent.checked);
  }
}

function hasPlaywrightMcp() {
  return Boolean(cachedCliCapabilities?.mcpServers?.some((server) => {
    const name = String(server?.name || '').trim().toLowerCase();
    const status = String(server?.status || '').trim().toLowerCase();
    return name === 'playwright' && status === 'enabled';
  }));
}

function updateBrowserToolNotes() {
  const text = hasPlaywrightMcp()
    ? 'Browser MCP: Playwright is detected in Codex CLI. Max Codex runs can use browser tools when the model needs them.'
    : 'Browser MCP: Playwright MCP is not currently detected from Codex CLI capabilities.';
  if (els.autopilotBrowserToolsNote) {
    els.autopilotBrowserToolsNote.textContent = text;
  }
  if (els.workspaceCodexBrowserNote) {
    els.workspaceCodexBrowserNote.textContent = text;
  }
}

/* ─── Simplified Model Picker (datalist combo) ─── */
function knownModelOptions() {
  return cachedModels.filter((model) => {
    const value = String(model?.value || '').trim();
    return value && value !== 'custom';
  });
}

function syncModelPickerToInput(selectEl, inputEl) {
  if (!selectEl || !inputEl) return;
  const value = String(inputEl.value || '').trim();
  if (!value) {
    setSelectValueSafe(selectEl, '', '');
    return;
  }
  if (selectValueExists(selectEl, value)) {
    selectEl.value = value;
    return;
  }
  setSelectValueSafe(selectEl, 'custom', '');
}

function populateModelPicker(selectEl, models, currentValue = '') {
  if (!selectEl) return;
  const selectedValue = String(currentValue || '').trim();
  selectEl.innerHTML = '';

  const autoOption = document.createElement('option');
  autoOption.value = '';
  autoOption.textContent = 'Use workspace default';
  selectEl.appendChild(autoOption);

  for (const model of models) {
    const option = document.createElement('option');
    option.value = model.value;
    option.textContent = model.label;
    selectEl.appendChild(option);
  }

  if (selectedValue && selectValueExists(selectEl, selectedValue)) {
    selectEl.value = selectedValue;
    return;
  }
  if (selectedValue) {
    setSelectValueSafe(selectEl, 'custom', '');
    return;
  }
  setSelectValueSafe(selectEl, '', '');
}

function syncAllModelPickers() {
  syncModelPickerToInput(els.modelPicker, els.modelInput);
  syncModelPickerToInput(els.chatModelPicker, els.chatModel);
  syncModelPickerToInput(els.cliModelPicker, els.cliModel);
}

function setModelOptions(models) {
  cachedModels = Array.isArray(models) ? models : [];
  els.modelSuggestions.innerHTML = '';
  for (const m of knownModelOptions()) {
    const o = document.createElement('option');
    o.value = m.value;
    o.textContent = m.label;
    els.modelSuggestions.appendChild(o);
  }
  if (els.chatModel && !els.chatModel.value.trim()) {
    els.chatModel.value = modelValue();
  }
  populateModelPicker(els.modelPicker, cachedModels, modelValue());
  populateModelPicker(els.chatModelPicker, cachedModels, chatModelValue());
  populateModelPicker(els.cliModelPicker, cachedModels, els.cliModel?.value || '');
  syncAllModelPickers();
}

function modelValue() {
  return els.modelInput.value.trim() || cachedDefaultModel;
}

function modelOverrideValue() {
  return (els.modelInput?.value || '').trim();
}

function applyModelPickerSelection(selectEl, inputEl, options = {}) {
  if (!selectEl || !inputEl) return;
  const onKnownSelection = typeof options.onKnownSelection === 'function'
    ? options.onKnownSelection
    : null;
  const onAnySelection = typeof options.onAnySelection === 'function'
    ? options.onAnySelection
    : null;
  const selectedValue = String(selectEl.value || '').trim();

  if (!selectedValue) {
    inputEl.value = '';
  }
  if (selectedValue && selectedValue !== 'custom') {
    inputEl.value = selectedValue;
    if (onKnownSelection) onKnownSelection(selectedValue);
  }

  syncModelPickerToInput(selectEl, inputEl);
  if (onAnySelection) onAnySelection();

  if (selectedValue === 'custom') {
    inputEl.focus();
    inputEl.select();
  }
}

/* ─── Quality Presets ─── */
function setQualityPresets(presets) {
  cachedPresets = presets;
  els.qualityPreset.innerHTML = '';
  for (const p of presets) {
    const o = document.createElement('option');
    o.value = p.id; o.textContent = p.label;
    els.qualityPreset.appendChild(o);
  }
}

function applyPresetById(presetId) {
  const p = cachedPresets.find(e => e.id === presetId);
  if (!p) return;
  els.qualityPreset.value = p.id;
  if (p.useWorkspaceDefaultModel) {
    els.modelInput.value = '';
  } else if (p.model) {
    els.modelInput.value = p.model;
  }
  if (p.id !== 'custom') {
    els.effort.value = p.effort;
    els.maxCycles.value = String(p.maxCycles);
    els.quiet.checked = Boolean(p.quiet);
    if (els.autopilotSearch) {
      els.autopilotSearch.checked = Boolean(p.search);
    }
    if (els.autopilotAutoAddRelatedRepos) {
      els.autopilotAutoAddRelatedRepos.checked = Boolean(p.autoAddRelatedRepos);
    }
  }
  syncAllModelPickers();
}

/* ─── Quick Starts ─── */
const QS_ICONS = { 'scan-project': '🔍', 'deep-audit': '🔬', 'fix-backlog': '🔧', 'revamp-page': '🎨', 'audit-frontend': '🖥️', 'audit-backend': '⚙️', 'sync-contracts': '🔗', 'cleanup-dead-code': '🧹', 'performance-pass': '⚡', 'ship-check': '🚢' };

function setQuickStarts(qs) {
  cachedQuickStarts = qs;
  renderQuickStarts();
}

function renderQuickStarts() {
  if (!els.quickStartList) return;
  if (!cachedQuickStarts.length) { els.quickStartList.innerHTML = '<div class="empty-state">No quick starts available.</div>'; return; }
  els.quickStartList.innerHTML = '';
  for (const q of cachedQuickStarts) {
    const card = document.createElement('button');
    card.type = 'button'; card.className = 'preset-card';
    card.innerHTML = `<span class="preset-card-title">${QS_ICONS[q.id] || '▶️'} ${q.label}</span><span class="preset-card-desc">${q.description}</span>`;
    card.addEventListener('click', () => { applyQuickStart(q.id); });
    els.quickStartList.appendChild(card);
  }
}

function applyQuickStart(id) {
  const s = cachedQuickStarts.find(e => e.id === id);
  if (!s) return;
  els.mode.value = s.mode;
  renderJobTypeCards(); updateModeGuide();
  els.request.value = s.starter;
  showBanner(`${s.label} preset applied!`);
}

/* ─── Workspaces ─── */
function setSavedWorkspaces(ws) { cachedWorkspaces = ws; renderWorkspaceList(); }

function renderWorkspaceList() {
  if (!els.savedWorkspacesList) return;
  if (!cachedWorkspaces.length) { els.savedWorkspacesList.innerHTML = '<div class="empty-state">No saved workspaces yet.</div>'; return; }
  els.savedWorkspacesList.innerHTML = '';
  for (const ws of cachedWorkspaces) {
    const btn = document.createElement('button');
    btn.type = 'button'; btn.className = 'workspace-button';
    if (pathEquals(workspaceRootValue(), ws.workspaceRoot)) btn.classList.add('active-workspace');
    btn.innerHTML = `<strong>${ws.name}</strong><span>${shortenPath(ws.workspaceRoot)}</span><span>${ws.runCount} run${ws.runCount === 1 ? '' : 's'}</span>`;
    btn.addEventListener('click', async () => { els.workspaceRoot.value = ws.workspaceRoot; await loadMeta(); showBanner(`Switched to workspace: ${ws.name}`); });
    els.savedWorkspacesList.appendChild(btn);
  }
}

/* ─── Project Profiles ─── */
function formatTimestamp(value) {
  const timestamp = Date.parse(String(value || '').trim());
  if (Number.isNaN(timestamp)) return 'Unknown';
  return new Date(timestamp).toLocaleString();
}

function profileById(profileId) {
  return cachedProjectProfiles.find((profile) => String(profile?.id || '').trim() === String(profileId || '').trim()) || null;
}

function selectedProjectProfile() {
  return profileById(els.projectProfileSelect?.value);
}

function setProjectProfiles(profiles) {
  cachedProjectProfiles = Array.isArray(profiles) ? profiles : [];
  renderProjectProfiles();
  refreshChatProfileContextOptions();
}

function renderProjectProfiles() {
  if (!els.projectProfileSelect || !els.projectProfilesList) return;

  const previousSelectedId = els.projectProfileSelect.value;
  const selectedId = cachedProjectProfiles.some((profile) => pathEquals(profile.id, previousSelectedId))
    ? previousSelectedId
    : '';

  els.projectProfileSelect.innerHTML = '';
  const placeholder = document.createElement('option');
  placeholder.value = '';
  placeholder.textContent = cachedProjectProfiles.length ? 'Select a profile...' : 'No profiles saved yet';
  els.projectProfileSelect.appendChild(placeholder);

  for (const profile of cachedProjectProfiles) {
    const option = document.createElement('option');
    option.value = profile.id;
    option.textContent = `${profile.name} (${shortenPath(profile.projectPath)})`;
    els.projectProfileSelect.appendChild(option);
  }
  if (selectedId) {
    els.projectProfileSelect.value = selectedId;
  }

  if (!cachedProjectProfiles.length) {
    els.projectProfilesList.innerHTML = '<div class="empty-state">No profiles yet. Save your current settings as the first profile.</div>';
    return;
  }

  els.projectProfilesList.innerHTML = '';
  for (const profile of cachedProjectProfiles) {
    const item = document.createElement('button');
    item.type = 'button';
    item.className = 'workspace-button';
    if (pathEquals(els.projectProfileSelect.value, profile.id)) {
      item.classList.add('active-workspace');
    }

    const title = document.createElement('strong');
    title.textContent = profile.name || 'Unnamed';
    const workspaceText = document.createElement('span');
    workspaceText.textContent = `Workspace: ${shortenPath(profile.workspaceRoot)}`;
    const projectText = document.createElement('span');
    projectText.textContent = `Project: ${shortenPath(profile.projectPath)}`;
    const updatedText = document.createElement('span');
    updatedText.textContent = `Updated: ${formatTimestamp(profile.updatedAt || profile.createdAt)}`;

    item.append(title, workspaceText, projectText, updatedText);
    item.addEventListener('click', async () => {
      els.projectProfileSelect.value = profile.id;
      els.projectProfileName.value = profile.name || '';
      renderProjectProfiles();
      try {
        await applySelectedProfile(false);
      } catch (error) {
        showBanner(error.message, 'error');
      }
    });

    els.projectProfilesList.appendChild(item);
  }
}

function applyProfileToForm(profile) {
  if (!profile) return;
  els.workspaceRoot.value = profile.workspaceRoot || els.workspaceRoot.value;
  els.projectPath.value = profile.projectPath || els.projectPath.value;
  els.designGuides.value = Array.isArray(profile.designGuides)
    ? profile.designGuides.join(',')
    : String(profile.designGuides || '');
  els.blueprintSources.value = Array.isArray(profile.blueprintSources)
    ? profile.blueprintSources.join(',')
    : String(profile.blueprintSources || '');
  if (els.workspaceScopeLevelDefault) {
    setSelectValueSafe(
      els.workspaceScopeLevelDefault,
      profile.scopeLevelDefault || els.workspaceScopeLevelDefault.value || cachedScopeLevels[0] || 'module',
      cachedScopeLevels[0] || 'module'
    );
  }
  if (els.workspaceProjectSurfaces) {
    const surfacesValue = Object.hasOwn(profile, 'projectSurfaces')
      ? profile.projectSurfaces
      : els.workspaceProjectSurfaces.value;
    els.workspaceProjectSurfaces.value = prettyJsonArray(surfacesValue, els.workspaceProjectSurfaces.value || '[]');
  }
  if (els.workspaceDevIgnorePatterns) {
    const devIgnore = Object.hasOwn(profile, 'devIgnorePatterns')
      ? profile.devIgnorePatterns
      : (Object.hasOwn(profile, 'devIgnore') ? profile.devIgnore : els.workspaceDevIgnorePatterns.value);
    els.workspaceDevIgnorePatterns.value = listTextFromValue(devIgnore);
  }
  if (els.workspaceRequiredAtlasDocs) {
    els.workspaceRequiredAtlasDocs.value = listTextFromValue(profile.requiredAtlasDocs || els.workspaceRequiredAtlasDocs.value);
  }
  if (els.workspaceFullSystemRequiredDocs && Object.hasOwn(profile, 'fullSystemRequiredDocs')) {
    els.workspaceFullSystemRequiredDocs.checked = profile.fullSystemRequiredDocs !== false;
  }
  renderAllFileTagLists();
  syncRunScopeDefaultsFromWorkspace({ force: true });
  if (Object.hasOwn(profile, 'globalRules')) {
    els.globalRules.value = profile.globalRules || '';
  }
  if (els.workspaceCodexProfile && Object.hasOwn(profile, 'preferredCodexProfile')) {
    els.workspaceCodexProfile.value = profile.preferredCodexProfile || '';
  }
  if (els.workspaceCodexSearchEnabled && Object.hasOwn(profile, 'preferredCodexSearch') && profile.preferredCodexSearch !== null) {
    els.workspaceCodexSearchEnabled.checked = Boolean(profile.preferredCodexSearch);
  }
  if (els.workspaceCodexExtraAddDirs && Object.hasOwn(profile, 'preferredCodexAddDirs')) {
    els.workspaceCodexExtraAddDirs.value = listTextFromValue(profile.preferredCodexAddDirs || '');
  }
  if (els.workspaceCodexConfigOverrides && Object.hasOwn(profile, 'preferredCodexConfigOverrides')) {
    els.workspaceCodexConfigOverrides.value = listTextFromValue(profile.preferredCodexConfigOverrides || '');
  }
  if (els.workspaceCodexAutoAddRelatedRepos && Object.hasOwn(profile, 'preferredCodexAutoAddRelatedRepos') && profile.preferredCodexAutoAddRelatedRepos !== null) {
    els.workspaceCodexAutoAddRelatedRepos.checked = Boolean(profile.preferredCodexAutoAddRelatedRepos);
  }
  if (els.workspaceCodexUseExperimentalMultiAgent && Object.hasOwn(profile, 'preferredCodexExperimentalMultiAgent') && profile.preferredCodexExperimentalMultiAgent !== null) {
    els.workspaceCodexUseExperimentalMultiAgent.checked = Boolean(profile.preferredCodexExperimentalMultiAgent);
  }
  syncAutopilotCodexDefaultsFromWorkspace({ force: true });

  if (profile.preferredPreset) {
    const hasPreset = [...els.qualityPreset.options].some((option) => option.value === profile.preferredPreset);
    if (hasPreset) {
      applyPresetById(profile.preferredPreset);
    } else {
      els.qualityPreset.value = 'custom';
    }
  }
  if (profile.preferredModel) {
    els.modelInput.value = profile.preferredModel;
    if (els.chatModel) {
      els.chatModel.value = profile.preferredModel;
    }
    syncAllModelPickers();
  }
  if (profile.preferredEffort) {
    els.effort.value = profile.preferredEffort;
    if (els.chatEffort) {
      els.chatEffort.value = profile.preferredEffort;
    }
  }

  if (Number.isFinite(Number(profile.preferredMaxCycles)) && Number(profile.preferredMaxCycles) > 0) {
    els.maxCycles.value = String(Math.floor(Number(profile.preferredMaxCycles)));
  }
  if (typeof profile.preferredQuiet === 'boolean') {
    els.quiet.checked = profile.preferredQuiet;
  }
  if (typeof profile.preferredAutoRefresh === 'boolean') {
    els.autoRefresh.checked = profile.preferredAutoRefresh;
  }
  if (Number.isFinite(Number(profile.preferredRefreshSeconds)) && Number(profile.preferredRefreshSeconds) >= 2) {
    els.refreshSeconds.value = String(Math.floor(Number(profile.preferredRefreshSeconds)));
  }

  renderWorkspaceList();
  updateChatContextSummary();
  if (els.chatThreadsList && String(els.chatProfileContext?.value || '__current__') === '__current__') {
    loadChatThreads({ autoOpenFirst: true }).catch(() => { });
  }
  startPolling(true);
}

async function loadProjectProfiles() {
  const payload = await api('/api/project-profiles');
  setProjectProfiles(payload.profiles || []);
}

async function saveCurrentAsProfile() {
  const selected = selectedProjectProfile();
  const typedName = els.projectProfileName.value.trim();
  const resolvedName = typedName || selected?.name || '';
  if (!resolvedName) {
    throw new Error('Enter a profile name first.');
  }

  const shouldUpdateSelected = Boolean(
    selected && (!typedName || typedName.toLowerCase() === String(selected.name || '').trim().toLowerCase())
  );

  const payload = {
    id: shouldUpdateSelected ? selected.id : '',
    name: resolvedName,
    workspaceRoot: workspaceRootValue(),
    projectPath: projectPathValue(),
    designGuides: els.designGuides.value.trim(),
    blueprintSources: els.blueprintSources.value.trim(),
    globalRules: els.globalRules.value.trim(),
    preferredModel: modelOverrideValue(),
    preferredEffort: els.effort.value,
    preferredPreset: els.qualityPreset.value,
    preferredCodexProfile: els.autopilotProfile?.value.trim() || '',
    preferredCodexSearch: Boolean(els.autopilotSearch?.checked),
    preferredCodexAddDirs: els.autopilotAddDirs?.value.trim() || '',
    preferredCodexConfigOverrides: els.autopilotConfigOverrides?.value.trim() || '',
    preferredCodexAutoAddRelatedRepos: Boolean(els.autopilotAutoAddRelatedRepos?.checked),
    preferredCodexExperimentalMultiAgent: Boolean(els.autopilotExperimentalMultiAgent?.checked),
    preferredMaxCycles: Number(els.maxCycles.value) || 12,
    preferredQuiet: Boolean(els.quiet.checked),
    preferredAutoRefresh: Boolean(els.autoRefresh.checked),
    preferredRefreshSeconds: Number(els.refreshSeconds.value) || 5,
    projectSurfaces: parseJsonArrayField(els.workspaceProjectSurfaces?.value || '', 'Project Surfaces', { allowEmpty: true }),
    devIgnore: els.workspaceDevIgnorePatterns?.value.trim() || '',
    scopeLevelDefault: els.workspaceScopeLevelDefault?.value || cachedScopeLevels[0] || 'module',
    fullSystemRequiredDocs: Boolean(els.workspaceFullSystemRequiredDocs?.checked),
    requiredAtlasDocs: els.workspaceRequiredAtlasDocs?.value.trim() || ''
  };

  const result = await api('/api/save-project-profile', { method: 'POST', body: JSON.stringify(payload) });
  setProjectProfiles(result.profiles || []);
  if (result.profile?.id) {
    els.projectProfileSelect.value = result.profile.id;
  }
  els.projectProfileName.value = result.profile?.name || resolvedName;
  renderProjectProfiles();
  showBanner(`Profile saved: ${result.profile?.name || resolvedName}`);
}

async function applySelectedProfile(initializeWorkspace = false) {
  const profile = selectedProjectProfile();
  if (!profile) {
    throw new Error('Select a saved profile first.');
  }

  applyProfileToForm(profile);
  els.projectProfileName.value = profile.name || '';
  renderProjectProfiles();

  if (initializeWorkspace) {
    await initWorkspace({ suppressBanner: true, applyMeta: false });
    await saveGlobalRules({ suppressBanner: true });
  }

  await loadMeta({ applyDefaults: false });
  applyProfileToForm(profile);
  renderProjectProfiles();

  if (initializeWorkspace) {
    showBanner(`Applied and saved profile: ${profile.name}`);
    return;
  }
  showBanner(`Applied profile: ${profile.name}`);
}

async function deleteSelectedProfile() {
  const profile = selectedProjectProfile();
  if (!profile) {
    throw new Error('Select a profile first.');
  }
  if (!window.confirm(`Delete profile "${profile.name}"?`)) {
    return;
  }
  const result = await api('/api/delete-project-profile', {
    method: 'POST',
    body: JSON.stringify({ id: profile.id })
  });
  setProjectProfiles(result.profiles || []);
  els.projectProfileName.value = '';
  showBanner(`Deleted profile: ${profile.name}`);
}

function siblingWorkspacePath(currentWorkspaceRoot, name) {
  const normalized = String(currentWorkspaceRoot || '').trim().replace(/\/+$/, '');
  if (!normalized) return '';
  const parts = normalized.split('/');
  if (parts.length <= 1) return '';
  parts[parts.length - 1] = name;
  return parts.join('/');
}

function useHuzPreset() {
  const suggestedWorkspace = siblingWorkspacePath(workspaceRootValue(), 'huz')
    || '/Users/macbook/Desktop/Codex-Project-Bot-GUI/agent-workspaces/huz';
  els.workspaceRoot.value = suggestedWorkspace;
  els.projectPath.value = DEFAULT_HUZ_PROJECT_ROOT;
  els.designGuides.value = DEFAULT_HUZ_DESIGN_GUIDES.join(',');
  if (els.workspaceProjectSurfaces) {
    els.workspaceProjectSurfaces.value = prettyJsonArray([{
      id: 'huz-web-frontend',
      label: 'Huz-Web-Frontend',
      path: DEFAULT_HUZ_PROJECT_ROOT,
      kind: 'panel-fe'
    }], '[]');
  }
  if (els.workspaceScopeLevelDefault) {
    setSelectValueSafe(els.workspaceScopeLevelDefault, 'panel-fe', cachedScopeLevels[0] || 'module');
  }
  if (els.workspaceDevIgnorePatterns) {
    els.workspaceDevIgnorePatterns.value = listTextFromValue([
      'node_modules/**',
      'dist/**',
      'build/**',
      'coverage/**',
      '.git/**',
      '.next/**',
      '*.map',
      '*.log'
    ]);
  }
  if (els.workspaceFullSystemRequiredDocs) {
    els.workspaceFullSystemRequiredDocs.checked = true;
  }
  if (els.workspaceCodexProfile) {
    els.workspaceCodexProfile.value = '';
  }
  if (els.workspaceCodexSearchEnabled) {
    els.workspaceCodexSearchEnabled.checked = true;
  }
  if (els.workspaceCodexExtraAddDirs) {
    els.workspaceCodexExtraAddDirs.value = listTextFromValue(DEFAULT_HUZ_RELATED_DIRS);
  }
  if (els.workspaceCodexConfigOverrides) {
    els.workspaceCodexConfigOverrides.value = '';
  }
  if (els.workspaceCodexAutoAddRelatedRepos) {
    els.workspaceCodexAutoAddRelatedRepos.checked = true;
  }
  if (els.workspaceCodexUseExperimentalMultiAgent) {
    els.workspaceCodexUseExperimentalMultiAgent.checked = false;
  }
  syncRunScopeDefaultsFromWorkspace({ force: true });
  syncAutopilotCodexDefaultsFromWorkspace({ force: true });
  applyPresetById('max-codex');
  renderAllFileTagLists();
  if (!els.projectProfileName.value.trim()) {
    els.projectProfileName.value = 'Huz';
  }
  showBanner('Huz preset applied to form fields.');
}

/* ─── Chat Tab ─── */
function chatModelValue() {
  return (els.chatModel?.value || '').trim() || modelValue();
}

function chatEffortValue() {
  return (els.chatEffort?.value || '').trim() || els.effort.value || 'high';
}

function clampInt(value, min, max, fallback) {
  const parsed = Number.parseInt(String(value ?? ''), 10);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(max, Math.max(min, parsed));
}

function chatCampaignPolicyValue() {
  const value = String(els.chatCampaignPolicy?.value || 'auto').trim().toLowerCase();
  return ['auto', 'force-on', 'force-off'].includes(value) ? value : 'auto';
}

function chatCampaignFollowupRunsValue() {
  return clampInt(els.chatCampaignFollowupRuns?.value, 1, 12, 3);
}

function chatCampaignPagesPerRunValue() {
  return clampInt(els.chatCampaignPagesPerRun?.value, 2, 24, 8);
}

function chatCampaignFollowupModeValue() {
  const value = String(els.chatCampaignFollowupMode?.value || 'fix-backlog').trim();
  return value || 'fix-backlog';
}

function chatCampaignPayload() {
  return {
    campaignPolicy: chatCampaignPolicyValue(),
    campaignFollowupRuns: chatCampaignFollowupRunsValue(),
    campaignPagesPerRun: chatCampaignPagesPerRunValue(),
    campaignFollowupMode: chatCampaignFollowupModeValue()
  };
}

function syncChatAutomationControls() {
  const enabled = Boolean(els.chatAutomationToggle?.checked);
  const controls = [
    els.chatCampaignPolicy,
    els.chatCampaignFollowupRuns,
    els.chatCampaignPagesPerRun,
    els.chatCampaignFollowupMode
  ];
  for (const control of controls) {
    if (!control) continue;
    control.disabled = !enabled;
  }
}

function selectedChatProfileContext() {
  const selectedId = String(els.chatProfileContext?.value || '').trim();
  if (!selectedId || selectedId === '__current__') return null;
  return profileById(selectedId);
}

function resolvedChatContext() {
  const selectedProfile = selectedChatProfileContext();
  if (selectedProfile) {
    return {
      profileId: selectedProfile.id || '',
      profileName: selectedProfile.name || '',
      workspaceRoot: selectedProfile.workspaceRoot || workspaceRootValue(),
      projectPath: selectedProfile.projectPath || projectPathValue()
    };
  }

  return {
    profileId: '',
    profileName: '',
    workspaceRoot: workspaceRootValue(),
    projectPath: projectPathValue()
  };
}

function updateChatContextSummary() {
  if (!els.chatContextSummary) return;
  const context = resolvedChatContext();
  const profileText = context.profileName ? `Profile: ${context.profileName}` : 'Profile: Current workspace context';
  const workspaceText = `Workspace: ${shortenPath(context.workspaceRoot)}`;
  const projectText = `Project: ${shortenPath(context.projectPath)}`;
  els.chatContextSummary.textContent = `${profileText} • ${workspaceText} • ${projectText}`;
}

function defaultChatIntentPreviewMessage() {
  return 'Write a message, then click Preview Intent to see inferred mode, scope level, scope, and targets before sending.';
}

function renderChatIntentPreview(preview, options = {}) {
  if (!els.chatIntentPreview) return;
  if (!preview || typeof preview !== 'object') {
    setCodeBoxText(els.chatIntentPreview, '', defaultChatIntentPreviewMessage());
    return;
  }

  const label = String(options.label || '').trim();
  const lines = [];
  if (label) lines.push(label);
  lines.push(`Automation Intent: ${preview.triggered ? 'Detected' : 'Not Detected'}`);

  if (preview.triggered) {
    lines.push(`Mode: ${preview.modeLabel || preview.mode || 'Unknown'}`);
    lines.push(`Scope Level: ${preview.scopeLevel || 'default'}`);
    lines.push(`Scope: ${preview.scope || 'Not specified'}`);
    const targets = Array.isArray(preview.scopeTargets) ? preview.scopeTargets.filter(Boolean) : [];
    lines.push(`Scope Targets: ${targets.length ? targets.join(', ') : 'Not specified'}`);
    if (preview.hugeMission) {
      lines.push('Huge Mission: Yes (campaign-safe batching recommended)');
    }
    if (preview.campaign?.enabled) {
      lines.push(`Auto Follow-up Runs: ${preview.campaign.followupRuns || preview.campaign.followupRunsPlanned || 'n/a'}`);
      lines.push(`Follow-up Mode: ${preview.campaign.followupMode || 'fix-backlog'}`);
      if (preview.campaign.pagesPerRun) {
        lines.push(`Pages Per Run Target: ${preview.campaign.pagesPerRun}`);
      }
      if (preview.campaign.estimatedTotalRuns) {
        lines.push(`Estimated Total Runs: ${preview.campaign.estimatedTotalRuns}`);
      }
    }
    if (preview.workspaceRoot) lines.push(`Workspace: ${preview.workspaceRoot}`);
    if (preview.projectPath) lines.push(`Project: ${preview.projectPath}`);
  } else {
    lines.push(preview.reason || 'No runnable automation intent matched this message.');
  }

  setCodeBoxText(els.chatIntentPreview, lines.join('\n'), defaultChatIntentPreviewMessage());
}

function resetChatIntentPreview() {
  if (!els.chatIntentPreview) return;
  setCodeBoxText(els.chatIntentPreview, '', defaultChatIntentPreviewMessage());
}

async function previewChatIntent() {
  if (!els.chatInput) return;
  const message = els.chatInput.value.trim();
  if (!message) throw new Error('Write a chat message first.');
  const context = resolvedChatContext();
  const payload = await api('/api/chat/preview-intent', {
    method: 'POST',
    body: JSON.stringify({
      message,
      workspaceRoot: context.workspaceRoot,
      projectPath: context.projectPath,
      profileId: context.profileId,
      profileName: context.profileName,
      model: chatModelValue(),
      effort: chatEffortValue(),
      ...chatCampaignPayload()
    })
  });
  renderChatIntentPreview(payload.preview, { label: 'Preview Result' });
  if (payload.preview?.triggered) {
    showBanner(`Preview ready: ${payload.preview.modeLabel || payload.preview.mode}.`);
    return;
  }
  showBanner('Preview ready: no automation intent detected.');
}

function refreshChatProfileContextOptions() {
  if (!els.chatProfileContext) return;

  const previous = String(els.chatProfileContext.value || '__current__').trim() || '__current__';
  els.chatProfileContext.innerHTML = '';

  const currentOption = document.createElement('option');
  currentOption.value = '__current__';
  currentOption.textContent = 'Current Workspace + Project';
  els.chatProfileContext.appendChild(currentOption);

  for (const profile of cachedProjectProfiles) {
    const option = document.createElement('option');
    option.value = profile.id;
    option.textContent = `${profile.name} (${shortenPath(profile.projectPath)})`;
    els.chatProfileContext.appendChild(option);
  }

  const canKeepPrevious = previous === '__current__'
    || cachedProjectProfiles.some((profile) => pathEquals(profile.id, previous));
  els.chatProfileContext.value = canKeepPrevious ? previous : '__current__';
  updateChatContextSummary();
}

function setChatThreads(threads) {
  cachedChatThreads = Array.isArray(threads) ? threads : [];
  renderChatThreads();
}

function renderChatThreads() {
  if (!els.chatThreadsList) return;
  if (!cachedChatThreads.length) {
    els.chatThreadsList.innerHTML = '<div class="empty-state">No chats yet for this context.</div>';
    return;
  }

  els.chatThreadsList.innerHTML = '';
  for (const thread of cachedChatThreads) {
    const item = document.createElement('button');
    item.type = 'button';
    item.className = 'workspace-button';
    if (pathEquals(activeChatThreadId, thread.id)) {
      item.classList.add('active-workspace');
    }

    const title = document.createElement('strong');
    title.textContent = thread.title || 'Untitled Chat';
    const meta1 = document.createElement('span');
    meta1.textContent = `${thread.messageCount || 0} messages • ${thread.model || 'default model'} • ${thread.effort || 'default effort'}`;
    const meta2 = document.createElement('span');
    meta2.textContent = `Updated: ${formatTimestamp(thread.updatedAt)}`;
    const meta3 = document.createElement('span');
    meta3.textContent = thread.preview || 'No messages yet.';

    item.append(title, meta1, meta2, meta3);
    item.addEventListener('click', async () => {
      try {
        await openChatThread(thread.id);
      } catch (error) {
        showBanner(error.message, 'error');
      }
    });
    els.chatThreadsList.appendChild(item);
  }
}

function clearChatThreadView() {
  activeChatThreadId = '';
  if (els.chatThreadTitle) els.chatThreadTitle.textContent = 'No chat selected';
  if (els.chatThreadMeta) els.chatThreadMeta.textContent = '';
  if (els.chatMessages) els.chatMessages.innerHTML = '<div class="empty-state">Create or open a chat to begin.</div>';
  resetChatIntentPreview();
  renderChatThreads();
}

function chatRoleLabel(role) {
  const normalized = String(role || '').toLowerCase();
  if (normalized === 'user') return 'You';
  if (normalized === 'system') return 'System';
  return 'Assistant';
}

function renderChatThread(thread) {
  if (!thread) {
    clearChatThreadView();
    return;
  }

  activeChatThreadId = thread.id;
  if (els.chatThreadTitle) {
    els.chatThreadTitle.textContent = thread.title || 'Untitled Chat';
  }
  if (els.chatThreadMeta) {
    const profileText = thread.profileName ? `Profile: ${thread.profileName}` : 'Current workspace context';
    els.chatThreadMeta.textContent = `${profileText} • ${thread.model || 'default model'} • ${thread.effort || 'default effort'}`;
  }
  if (!els.chatMessages) {
    renderChatThreads();
    return;
  }

  const messages = Array.isArray(thread.messages) ? thread.messages : [];
  if (!messages.length) {
    els.chatMessages.innerHTML = '<div class="empty-state">This chat has no messages yet.</div>';
    renderChatThreads();
    return;
  }

  els.chatMessages.innerHTML = '';
  for (const message of messages) {
    const role = String(message.role || 'assistant').toLowerCase();
    const item = document.createElement('div');
    item.className = `chat-message ${role}`;

    const head = document.createElement('div');
    head.className = 'chat-message-head';

    const roleLabel = document.createElement('span');
    roleLabel.className = 'chat-message-role';
    roleLabel.textContent = chatRoleLabel(role);

    const time = document.createElement('span');
    time.className = 'chat-message-time';
    time.textContent = formatTimestamp(message.createdAt);

    const body = document.createElement('div');
    body.textContent = message.content || '';

    head.append(roleLabel, time);
    item.append(head, body);
    els.chatMessages.appendChild(item);
  }
  els.chatMessages.scrollTop = els.chatMessages.scrollHeight;
  renderChatThreads();
}

async function loadChatThreads(options = {}) {
  if (!els.chatThreadsList) return;
  updateChatContextSummary();
  const context = resolvedChatContext();
  const params = new URLSearchParams();
  if (context.profileId) params.set('profileId', context.profileId);
  if (context.workspaceRoot) params.set('workspaceRoot', context.workspaceRoot);
  if (context.projectPath) params.set('projectPath', context.projectPath);

  const payload = await api(`/api/chat/threads?${params.toString()}`);
  setChatThreads(payload.threads || []);

  const requestedThreadId = String(options.threadId || activeChatThreadId || '').trim();
  if (requestedThreadId && cachedChatThreads.some((thread) => pathEquals(thread.id, requestedThreadId))) {
    await openChatThread(requestedThreadId);
    return;
  }

  if (!requestedThreadId && options.autoOpenFirst !== false && cachedChatThreads.length) {
    await openChatThread(cachedChatThreads[0].id);
    return;
  }

  if (!cachedChatThreads.length) {
    clearChatThreadView();
  }
}

async function openChatThread(threadId) {
  if (!threadId) return;
  const payload = await api(`/api/chat/thread?id=${encodeURIComponent(threadId)}`);
  if (!payload.thread) {
    clearChatThreadView();
    return;
  }

  renderChatThread(payload.thread);
}

async function createChatThread(title = '') {
  const context = resolvedChatContext();
  const payload = await api('/api/chat/thread', {
    method: 'POST',
    body: JSON.stringify({
      profileId: context.profileId,
      profileName: context.profileName,
      workspaceRoot: context.workspaceRoot,
      projectPath: context.projectPath,
      title,
      model: chatModelValue(),
      effort: chatEffortValue()
    })
  });

  const threadId = payload.thread?.id || '';
  if (!threadId) {
    throw new Error('Failed to create a chat thread.');
  }
  await loadChatThreads({ threadId });
}

async function sendChatMessage() {
  if (!els.chatInput) return;
  const message = els.chatInput.value.trim();
  if (!message) throw new Error('Enter a chat message first.');

  let threadId = activeChatThreadId;
  if (!threadId) {
    await createChatThread(message.slice(0, 72));
    threadId = activeChatThreadId;
  }
  if (!threadId) throw new Error('No active chat thread.');

  if (els.chatSend) els.chatSend.disabled = true;
  try {
    const payload = await api('/api/chat/message', {
      method: 'POST',
      body: JSON.stringify({
        threadId,
        message,
        model: chatModelValue(),
        effort: chatEffortValue(),
        automationEnabled: Boolean(els.chatAutomationToggle?.checked),
        ...chatCampaignPayload()
      })
    });

    els.chatInput.value = '';
    if (payload.thread) {
      renderChatThread(payload.thread);
    }
    await loadChatThreads({ threadId: payload.thread?.id || threadId });
    if (payload.automation) {
      renderChatIntentPreview({
        ...payload.automation,
        reason: payload.automation.triggered ? '' : 'No automation was started from this message.'
      }, { label: 'Last Message Result' });
    }
    if (payload.automation?.triggered) {
      if (payload.automation.ok && payload.automation.campaign?.enabled) {
        showBanner(`Automation campaign started (${payload.automation.modeLabel || payload.automation.mode}) with ${payload.automation.campaign.followupRunsPlanned} follow-up runs.`, 'success');
      } else {
        showBanner(payload.automation.ok
          ? `Automation started (${payload.automation.modeLabel || payload.automation.mode}).`
          : `Automation failed: ${payload.automation.message || 'See chat response.'}`, payload.automation.ok ? 'success' : 'error');
      }
    } else {
      showBanner('Chat reply received.');
    }
  } finally {
    if (els.chatSend) els.chatSend.disabled = false;
  }
}

async function runQuickDeepAuditFromChat() {
  if (!els.chatInput) return;
  if (!els.chatInput.value.trim()) {
    els.chatInput.value = 'Please run a deep audit automation for this project and start the autopilot.';
  }
  await sendChatMessage();
}

function runBadgeMeta(run) {
  const exitCode = Number(run?.lastExitCode);
  const failed = Number.isFinite(exitCode) && exitCode !== 0;
  if (run?.active) return { badgeClass: 'badge-running', badgeText: 'Running', failed: false };
  if (failed) return { badgeClass: 'badge-error', badgeText: 'Failed', failed: true };
  if (run?.done) return { badgeClass: 'badge-done', badgeText: 'Done', failed: false };
  return { badgeClass: 'badge-idle', badgeText: 'Ready', failed: false };
}

function runFailureLine(run) {
  const reason = String(run?.failureReason || '').trim();
  if (!reason) return '';
  return `Last error: ${reason}`;
}

function workflowStatusMeta(status, coordinator = null) {
  const normalized = String(coordinator?.active ? 'running' : (coordinator?.status || status || '')).trim().toLowerCase();
  if (normalized === 'running') return { badgeClass: 'badge-running', badgeText: 'Running' };
  if (['completed', 'done'].includes(normalized)) return { badgeClass: 'badge-done', badgeText: 'Completed' };
  if (['attention', 'failed', 'materialize-failed'].includes(normalized)) return { badgeClass: 'badge-error', badgeText: 'Attention' };
  if (['waiting', 'blocked', 'stopped'].includes(normalized)) return { badgeClass: 'badge-warning', badgeText: normalized === 'waiting' ? 'Waiting' : 'Blocked' };
  if (normalized === 'ready') return { badgeClass: 'badge-idle', badgeText: 'Ready' };
  return { badgeClass: 'badge-idle', badgeText: 'Planned' };
}

function updateTeamSummary(team) {
  if (!els.teamSummary) return;
  if (!team) {
    els.teamSummary.textContent = 'No team plan loaded yet.';
    return;
  }
  const counts = team.summary || {};
  const coordinatorText = team.coordinator?.active
    ? 'Coordinator: auto-advance ON'
    : (team.coordinator?.status && team.coordinator.status !== 'idle'
      ? `Coordinator: ${team.coordinator.status}`
      : 'Coordinator: idle');
  els.teamSummary.textContent = `${team.name} • ${coordinatorText} • Completed ${counts.completedCount || 0}/${counts.totalCount || 0} • Ready ${counts.readyCount || 0} • Running ${counts.runningCount || 0}`;
}

function renderTeamList(teams) {
  if (!els.teamList) return;
  cachedTeams = Array.isArray(teams) ? teams : [];
  if (!cachedTeams.length) {
    els.teamList.innerHTML = '<div class="empty-state">No team plans yet. Build one above.</div>';
    return;
  }

  els.teamList.innerHTML = '';
  for (const team of cachedTeams) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'workspace-button';
    if (pathEquals(activeTeamId, team.id)) {
      button.classList.add('active-workspace');
    }
    const badge = workflowStatusMeta(team.status, team.coordinator);
    const counts = team.counts || {};
    button.innerHTML = `
      <strong>${escapeHtml(team.name || 'Unnamed Team')}</strong>
      <span>${escapeHtml(shortenPath(team.projectPath || ''))}</span>
      <span>${counts.completedCount || 0}/${counts.totalCount || 0} complete • ${counts.readyCount || 0} ready • ${counts.runningCount || 0} running</span>
      <span class="badge ${badge.badgeClass}"><span class="badge-dot"></span> ${badge.badgeText}</span>
    `;
    button.addEventListener('click', async () => {
      try {
        await openTeam(team.id, { silent: true });
      } catch (error) {
        showBanner(error.message, 'error');
      }
    });
    els.teamList.appendChild(button);
  }
}

function renderTeamDetails(team) {
  if (!els.teamDetails) return;
  if (!team) {
    els.teamDetails.className = 'team-details-panel empty-state';
    els.teamDetails.textContent = 'Build or open a team plan to inspect its generated agents, prompts, and ownership lanes.';
    updateTeamSummary(null);
    return;
  }

  const badge = workflowStatusMeta(team.status, team.coordinator);
  const counts = team.summary || {};
  const titleById = new Map((team.agents || []).map((agent) => [agent.id, agent.title]));
  const noteHtml = Array.isArray(team.notes) && team.notes.length
    ? team.notes.map((note) => `<div class="team-summary-note">• ${escapeHtml(note)}</div>`).join('')
    : '<div class="team-summary-note">No planner notes were generated.</div>';
  const coordinatorLine = team.coordinator?.active
    ? 'Auto-advance coordinator is currently active.'
    : (team.coordinator?.status && team.coordinator.status !== 'idle'
      ? `Coordinator status: ${team.coordinator.status}${team.coordinator.lastError ? ` • ${team.coordinator.lastError}` : ''}`
      : 'Coordinator is idle.');
  const agentsHtml = (team.agents || []).map((agent) => {
    const agentBadge = workflowStatusMeta(agent.status);
    const ownership = agent.ownershipPaths?.length
      ? agent.ownershipPaths.join(', ')
      : (agent.ownershipKeys?.length ? agent.ownershipKeys.join(', ') : 'Global coordination');
    const dependencies = agent.dependsOn?.length
      ? agent.dependsOn.map((dependencyId) => titleById.get(dependencyId) || dependencyId).join(', ')
      : 'None';
    const blockedBy = agent.blockedBy?.length
      ? agent.blockedBy.map((dependencyId) => titleById.get(dependencyId) || dependencyId).join(', ')
      : '';
    const promptBox = agent.runRequest
      ? `
        <details class="collapsible">
          <summary>Agent Prompt</summary>
          <div class="details-body">
            <pre class="code-box team-prompt-box">${escapeHtml(agent.runRequest)}</pre>
          </div>
        </details>
      `
      : '';
    const openRunButton = agent.runDir
      ? `<button type="button" class="btn btn-ghost btn-sm team-open-run-btn" data-run-dir="${escapeHtml(agent.runDir)}">📊 Open Run</button>`
      : '';
    return `
      <article class="team-agent-card">
        <div class="team-agent-top">
          <div class="team-agent-title">
            <strong>${escapeHtml(agent.title || 'Unnamed Agent')}</strong>
            <span>${escapeHtml(agent.role || 'Agent')} • ${escapeHtml(agent.mode || 'mode')}</span>
          </div>
          <span class="badge ${agentBadge.badgeClass}"><span class="badge-dot"></span> ${agentBadge.badgeText}</span>
        </div>
        <div class="team-meta-lines">
          <div><span class="team-inline-label">Lane:</span> ${escapeHtml(agent.lane || 'Not specified')}</div>
          <div><span class="team-inline-label">Scope:</span> ${escapeHtml(agent.scope || team.scope || team.projectPath)}</div>
          <div><span class="team-inline-label">Dependencies:</span> ${escapeHtml(dependencies)}</div>
          <div><span class="team-inline-label">Ownership:</span> ${escapeHtml(ownership)}</div>
          ${blockedBy ? `<div><span class="team-inline-label">Blocked By:</span> ${escapeHtml(blockedBy)}</div>` : ''}
          ${agent.materializeError ? `<div><span class="team-inline-label">Run Error:</span> ${escapeHtml(agent.materializeError)}</div>` : ''}
          ${agent.runDir ? `<div><span class="team-inline-label">Run Dir:</span> ${escapeHtml(agent.runDir)}</div>` : ''}
        </div>
        <div class="team-pill-row">
          <span class="team-pill">${agent.reportOnly ? 'Report Only' : 'Can Modify Code'}</span>
          <span class="team-pill">Targets: ${escapeHtml((agent.scopeTargets || []).join(', ') || 'default')}</span>
        </div>
        <div class="team-agent-actions">
          ${openRunButton}
        </div>
        ${promptBox}
      </article>
    `;
  }).join('');

  els.teamDetails.className = 'team-details-panel';
  els.teamDetails.innerHTML = `
    <div class="team-overview">
      <div class="history-card active-run">
        <div class="history-card-header">
          <div class="history-card-left">
            <strong>${escapeHtml(team.name || 'Unnamed Team')}</strong>
            <span>${escapeHtml(shortenPath(team.projectPath || ''))}</span>
          </div>
          <div class="history-card-right">
            <span class="badge ${badge.badgeClass}"><span class="badge-dot"></span> ${badge.badgeText}</span>
          </div>
        </div>
        <div class="history-card-body" style="display:block;padding-top:12px;">
          <div class="team-stat-grid">
            <div class="team-stat-card"><strong>${counts.totalCount || 0}</strong><span>Total Agents</span></div>
            <div class="team-stat-card"><strong>${counts.completedCount || 0}</strong><span>Completed</span></div>
            <div class="team-stat-card"><strong>${counts.readyCount || 0}</strong><span>Ready</span></div>
            <div class="team-stat-card"><strong>${counts.runningCount || 0}</strong><span>Running</span></div>
          </div>
          <div class="team-meta-lines">
            <div><span class="team-inline-label">Coordinator:</span> ${escapeHtml(coordinatorLine)}</div>
            <div><span class="team-inline-label">Scope Level:</span> ${escapeHtml(team.scopeLevel || 'default')}</div>
            <div><span class="team-inline-label">Scope:</span> ${escapeHtml(team.scope || team.projectPath || '')}</div>
            <div><span class="team-inline-label">Master Prompt:</span> ${escapeHtml(team.masterRequest || '')}</div>
          </div>
          ${noteHtml}
        </div>
      </div>
      <div class="team-agent-list">
        ${agentsHtml || '<div class="empty-state">No agents were generated for this team.</div>'}
      </div>
    </div>
  `;

  els.teamDetails.querySelectorAll('.team-open-run-btn').forEach((button) => {
    button.addEventListener('click', async () => {
      const runDir = button.dataset.runDir || '';
      if (!runDir) return;
      currentRunDir = runDir;
      els.runDir.value = runDir;
      await refreshRun();
      switchTab('dashboard');
      showBanner('Run loaded into dashboard.');
    });
  });

  updateTeamSummary(team);
}

async function openTeam(teamId, options = {}) {
  if (!teamId) throw new Error('No team id provided.');
  const params = new URLSearchParams({ id: teamId });
  if (workspaceRootValue()) {
    params.set('workspaceRoot', workspaceRootValue());
  }
  const payload = await api(`/api/team?${params.toString()}`);
  activeTeamId = payload.team?.id || teamId;
  renderTeamDetails(payload.team || null);
  renderTeamList(cachedTeams);
  if (!options.silent) {
    showBanner('Team loaded.');
  }
}

async function loadTeams(options = {}) {
  const payload = await api(workspaceQuery('/api/teams'));
  renderTeamList(payload.teams || []);
  if (!cachedTeams.length) {
    activeTeamId = '';
    renderTeamDetails(null);
    return;
  }

  const requestedTeamId = Object.hasOwn(options, 'teamId')
    ? String(options.teamId || '').trim()
    : String(activeTeamId || '').trim();
  if (requestedTeamId && cachedTeams.some((team) => pathEquals(team.id, requestedTeamId))) {
    await openTeam(requestedTeamId, { silent: true });
    return;
  }
  if (cachedTeams.length && (options.autoOpenFirst || requestedTeamId)) {
    await openTeam(cachedTeams[0].id, { silent: true });
    return;
  }
  activeTeamId = '';
  renderTeamDetails(null);
}

function buildTeamPayload() {
  const masterRequest = els.teamMasterPrompt?.value.trim() || '';
  if (!masterRequest) throw new Error('Enter a master prompt for the team first.');
  return {
    workspaceRoot: workspaceRootValue(),
    projectPath: projectPathValue(),
    teamName: els.teamName?.value.trim() || '',
    scope: els.teamScope?.value.trim() || '',
    masterRequest
  };
}

async function createTeamPlan() {
  const payload = await api('/api/team/create', {
    method: 'POST',
    body: JSON.stringify(buildTeamPayload())
  });
  activeTeamId = payload.team?.id || '';
  renderTeamList(payload.teams || []);
  renderTeamDetails(payload.team || null);
  await Promise.all([loadHistory(), loadAgents()]);
  showBanner(`Team plan created with ${payload.team?.agents?.length || 0} agents.`);
}

async function startTeamCampaign() {
  if (!activeTeamId) throw new Error('Build or open a team plan first.');
  const payload = await api('/api/team/start', {
    method: 'POST',
    body: JSON.stringify({
      workspaceRoot: workspaceRootValue(),
      teamId: activeTeamId,
      model: modelOverrideValue(),
      effort: els.effort.value,
      maxCycles: Number(els.maxCycles.value) || 12,
      quiet: els.quiet.checked,
      profile: els.autopilotProfile?.value.trim() || '',
      search: Boolean(els.autopilotSearch?.checked),
      addDirs: els.autopilotAddDirs?.value.trim() || '',
      configOverrides: els.autopilotConfigOverrides?.value.trim() || '',
      autoAddRelatedRepos: Boolean(els.autopilotAutoAddRelatedRepos?.checked),
      useExperimentalMultiAgent: Boolean(els.autopilotExperimentalMultiAgent?.checked),
      autoAdvance: true
    })
  });
  renderTeamDetails(payload.team || null);
  await Promise.all([loadHistory(), loadAgents(), loadTeams({ teamId: activeTeamId })]);
  const started = Array.isArray(payload.started) ? payload.started.length : 0;
  if (started > 0) {
    showBanner(`Team campaign started with ${started} ready agent${started === 1 ? '' : 's'}.`);
  } else {
    showBanner('No ready agents were started. Check team status for blockers.', 'error');
  }
  startPolling(true);
}

async function stopTeamCampaign() {
  if (!activeTeamId) throw new Error('Open a team plan first.');
  const payload = await api('/api/team/stop', {
    method: 'POST',
    body: JSON.stringify({
      workspaceRoot: workspaceRootValue(),
      teamId: activeTeamId
    })
  });
  renderTeamDetails(payload.team || null);
  await Promise.all([loadHistory(), loadAgents(), loadTeams({ teamId: activeTeamId })]);
  const stopped = Array.isArray(payload.stopped) ? payload.stopped.length : 0;
  showBanner(`Stop signal sent to ${stopped} team agent${stopped === 1 ? '' : 's'}.`);
}

/* ─── Unified History (Merged Runs + Summaries) ─── */
function renderHistory(runs, summaries) {
  if (!els.historyList) return;
  // Merge: build a map keyed by runDir, combining run card + summary
  const merged = new Map();
  for (const r of (runs || [])) {
    merged.set(r.runDir, { ...r, preview: '' });
  }
  for (const s of (summaries || [])) {
    if (merged.has(s.runDir)) {
      merged.get(s.runDir).preview = s.preview || '';
    } else {
      merged.set(s.runDir, { runDir: s.runDir, mode: s.mode, updatedAt: s.updatedAt, completed: s.completed, total: s.total, done: s.done, active: false, preview: s.preview || '' });
    }
  }

  const items = [...merged.values()].sort((a, b) => Date.parse(b.updatedAt || 0) - Date.parse(a.updatedAt || 0));

  if (!items.length) { els.historyList.innerHTML = '<div class="empty-state">No runs yet. Create one from the New Run tab.</div>'; return; }

  els.historyList.innerHTML = '';
  for (const item of items) {
    const card = document.createElement('div');
    card.className = 'history-card';
    if (currentRunDir && pathEquals(currentRunDir, item.runDir)) card.classList.add('active-run');

    const { badgeClass, badgeText } = runBadgeMeta(item);
    const progressText = `${item.completed || 0}/${item.total || 0}`;
    const failureLine = runFailureLine(item);
    const summaryText = [item.preview || 'No summary available.', failureLine].filter(Boolean).join('\n\n');

    card.innerHTML = `
      <div class="history-card-header">
        <div class="history-card-left">
          <strong>${item.mode || 'Unknown'}</strong>
          <span>${shortenPath(item.runDir)}</span>
        </div>
        <div class="history-card-right">
          <span class="badge ${badgeClass}"><span class="badge-dot"></span> ${badgeText}</span>
          <span style="font-size:12px;color:var(--ink-muted)">${progressText}</span>
          <span style="font-size:14px;cursor:pointer;" title="Expand">▾</span>
        </div>
      </div>
      <div class="history-card-body">
        <div class="history-card-summary">${escapeHtml(summaryText)}</div>
        <div class="history-card-actions">
          <button type="button" class="btn btn-primary btn-sm load-run-btn">📊 Load in Dashboard</button>
        </div>
      </div>
    `;

    // Toggle expand
    card.querySelector('.history-card-header').addEventListener('click', () => {
      card.classList.toggle('expanded');
    });

    // Load button
    card.querySelector('.load-run-btn').addEventListener('click', async (e) => {
      e.stopPropagation();
      currentRunDir = item.runDir;
      els.runDir.value = item.runDir;
      await refreshRun();
      switchTab('dashboard');
      showBanner('Run loaded into dashboard.');
    });

    els.historyList.appendChild(card);
  }
}

/* ─── Multi-Agent Panel ─── */
function selectedAgentRuns() {
  return cachedAgentRuns.filter((run) => agentSelection.has(run.runDir));
}

function updateAgentsSummary() {
  const selected = selectedAgentRuns();
  const total = cachedAgentRuns.length;
  const active = cachedAgentRuns.filter((run) => run.active).length;
  const selectedActive = selected.filter((run) => run.active).length;
  els.agentsSummary.textContent = `Runs: ${total} • Active: ${active} • Selected: ${selected.length} (${selectedActive} active)`;
}

function renderAgents(runs) {
  if (!els.agentsList) return;
  cachedAgentRuns = [...(runs || [])].sort((a, b) => Date.parse(b.updatedAt || 0) - Date.parse(a.updatedAt || 0));
  agentSelection = new Set([...agentSelection].filter((runDir) => cachedAgentRuns.some((run) => pathEquals(run.runDir, runDir))));
  updateAgentsSummary();

  if (!cachedAgentRuns.length) {
    els.agentsList.innerHTML = '<div class="empty-state">No runs found. Create runs in the New Run tab first.</div>';
    return;
  }

  els.agentsList.innerHTML = '';
  for (const run of cachedAgentRuns) {
    const card = document.createElement('div');
    card.className = 'history-card';
    if (run.active) card.classList.add('active-run');

    const isSelected = agentSelection.has(run.runDir);
    const { badgeClass, badgeText } = runBadgeMeta(run);
    const progressText = `${run.completed || 0}/${run.total || 0}`;
    const failureLine = runFailureLine(run);
    const runDetails = [`Updated: ${run.updatedAt || 'Unknown'}`, `Target: ${run.targetProject || 'Unknown'}`, `Next: ${run.nextPhase?.title || 'n/a'}`];
    if (failureLine) runDetails.push(failureLine);

    card.innerHTML = `
      <div class="history-card-header">
        <div class="history-card-left">
          <strong>${run.mode || 'Unknown'}</strong>
          <span>${shortenPath(run.runDir)}</span>
        </div>
        <div class="history-card-right">
          <label class="checkbox-row agent-select-chip">
            <input type="checkbox" class="agent-checkbox" ${isSelected ? 'checked' : ''} />
            <span class="label-text">Select</span>
          </label>
          <span class="badge ${badgeClass}"><span class="badge-dot"></span> ${badgeText}</span>
          <span class="u-faint-meta">${progressText}</span>
        </div>
      </div>
      <div class="history-card-body">
        <div class="history-card-summary">${escapeHtml(runDetails.join('\n'))}</div>
        <div class="history-card-actions">
          <button type="button" class="btn btn-primary btn-sm agent-start-btn">▶ Start</button>
          <button type="button" class="btn btn-danger btn-sm agent-stop-btn">⏹ Stop</button>
          <button type="button" class="btn btn-ghost btn-sm agent-open-btn">📊 Open</button>
        </div>
      </div>
    `;

    card.querySelector('.history-card-header').addEventListener('click', (event) => {
      if (event.target.closest('.agent-checkbox')) return;
      card.classList.toggle('expanded');
    });

    card.querySelector('.agent-checkbox').addEventListener('change', (event) => {
      if (event.target.checked) agentSelection.add(run.runDir);
      else agentSelection.delete(run.runDir);
      updateAgentsSummary();
    });

    card.querySelector('.agent-start-btn').addEventListener('click', async (event) => {
      event.stopPropagation();
      try {
        await startAgentForRun(run.runDir);
      } catch (error) {
        showBanner(error.message, 'error');
      }
    });

    card.querySelector('.agent-stop-btn').addEventListener('click', async (event) => {
      event.stopPropagation();
      try {
        await stopAgentForRun(run.runDir);
      } catch (error) {
        showBanner(error.message, 'error');
      }
    });

    card.querySelector('.agent-open-btn').addEventListener('click', async (event) => {
      event.stopPropagation();
      currentRunDir = run.runDir;
      els.runDir.value = run.runDir;
      await refreshRun();
      switchTab('dashboard');
      showBanner('Run loaded into dashboard.');
    });

    els.agentsList.appendChild(card);
  }
}

async function loadAgents() {
  const runs = await loadRecentRuns();
  renderAgents(runs);
}

function autopilotPayloadForRun(runDir) {
  return {
    workspaceRoot: workspaceRootValue(),
    runDir,
    model: modelOverrideValue(),
    effort: els.effort.value,
    maxCycles: Number(els.maxCycles.value) || 12,
    quiet: els.quiet.checked,
    profile: els.autopilotProfile?.value.trim() || '',
    search: Boolean(els.autopilotSearch?.checked),
    addDirs: els.autopilotAddDirs?.value.trim() || '',
    configOverrides: els.autopilotConfigOverrides?.value.trim() || '',
    autoAddRelatedRepos: Boolean(els.autopilotAutoAddRelatedRepos?.checked),
    useExperimentalMultiAgent: Boolean(els.autopilotExperimentalMultiAgent?.checked)
  };
}

async function startAgentForRun(runDir) {
  await api('/api/start-autopilot', {
    method: 'POST',
    body: JSON.stringify(autopilotPayloadForRun(runDir))
  });
  showBanner(`Started agent for ${shortenPath(runDir)}`);
  await Promise.all([loadAgents(), loadHistory()]);
  if (pathEquals(runDir, currentRunDir)) await refreshRun();
  startPolling(true);
}

async function stopAgentForRun(runDir) {
  await api('/api/stop-autopilot', { method: 'POST', body: JSON.stringify({ runDir }) });
  showBanner(`Stop signal sent for ${shortenPath(runDir)}`);
  await Promise.all([loadAgents(), loadHistory()]);
  if (pathEquals(runDir, currentRunDir)) await refreshRun();
}

async function startSelectedAgents() {
  const selected = selectedAgentRuns();
  if (!selected.length) throw new Error('Select at least one run first.');
  for (const run of selected) {
    if (run.active) continue;
    await api('/api/start-autopilot', {
      method: 'POST',
      body: JSON.stringify(autopilotPayloadForRun(run.runDir))
    });
  }
  showBanner(`Started selected agents (${selected.length}).`);
  await Promise.all([loadAgents(), loadHistory()]);
  startPolling(true);
}

async function stopSelectedAgents() {
  const selected = selectedAgentRuns();
  if (!selected.length) throw new Error('Select at least one run first.');
  for (const run of selected) {
    if (!run.active) continue;
    await api('/api/stop-autopilot', { method: 'POST', body: JSON.stringify({ runDir: run.runDir }) });
  }
  showBanner(`Sent stop signal to selected agents (${selected.length}).`);
  await Promise.all([loadAgents(), loadHistory()]);
}

function selectAllAgents() {
  agentSelection = new Set(cachedAgentRuns.map((run) => run.runDir));
  renderAgents(cachedAgentRuns);
}

function clearAgentSelection() {
  agentSelection = new Set();
  renderAgents(cachedAgentRuns);
}

/* ─── Interactive Log Viewer ─── */
function colorizeLog(text) {
  if (!text) return '';
  const lines = text.split('\n');
  return lines.map(line => {
    const lower = line.toLowerCase();
    let cls = '';
    if (/error|fail|fatal|exception|panic|traceback/i.test(line)) cls = 'log-line-error';
    else if (/warn|warning|deprecat/i.test(line)) cls = 'log-line-warn';
    else if (/success|passed|complete|done|✓|✔/i.test(line)) cls = 'log-line-success';
    else if (/^\s*(phase|step|cycle|─)/i.test(line)) cls = 'log-line-info';
    else if (/^\s*(\[|#|\/\/)/i.test(line)) cls = 'log-line-dim';
    if (cls) return `<span class="${cls}">${escapeHtml(line)}</span>`;
    return escapeHtml(line);
  }).join('\n');
}

function escapeHtml(text) {
  return String(text || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function applyLogSearch() {
  const term = els.logSearch.value.trim().toLowerCase();
  if (!term || !rawLogContent) {
    els.logView.innerHTML = colorizeLog(rawLogContent) || 'Autopilot logs will appear here.';
    els.logSearchCount.textContent = '';
    return;
  }
  const lines = rawLogContent.split('\n');
  let matchCount = 0;
  const filtered = lines.map(line => {
    if (line.toLowerCase().includes(term)) {
      matchCount++;
      return `<span class="log-line-highlight">${escapeHtml(line)}</span>`;
    }
    return `<span class="log-line-dim">${escapeHtml(line)}</span>`;
  }).join('\n');
  els.logView.innerHTML = filtered;
  els.logSearchCount.textContent = `${matchCount} match${matchCount === 1 ? '' : 'es'}`;
}

els.logSearch.addEventListener('input', applyLogSearch);

// Auto-scroll
els.logView.addEventListener('scroll', () => {
  const el = els.logView;
  const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 40;
  logAutoScroll = atBottom;
  els.logAutoScrollBadge.classList.toggle('hidden', atBottom);
});

function scrollLogToBottom() {
  if (logAutoScroll) {
    els.logView.scrollTop = els.logView.scrollHeight;
  }
}

/* ─── Diff Viewer ─── */
function renderDiff(stat, diff, message) {
  if (stat) els.diffStat.textContent = stat.split('\n').pop() || '';
  else els.diffStat.textContent = '';

  if (!diff) {
    els.diffView.textContent = message || 'No diff available.';
    return;
  }

  const lines = diff.split('\n');
  els.diffView.innerHTML = lines.map(line => {
    if (line.startsWith('+++') || line.startsWith('---')) return `<span class="diff-meta">${escapeHtml(line)}</span>`;
    if (line.startsWith('@@')) return `<span class="diff-hunk">${escapeHtml(line)}</span>`;
    if (line.startsWith('+')) return `<span class="diff-add">${escapeHtml(line)}</span>`;
    if (line.startsWith('-')) return `<span class="diff-del">${escapeHtml(line)}</span>`;
    return escapeHtml(line);
  }).join('\n');
}

async function loadDiffAction() {
  const runDir = resolvedRunDir();
  if (!runDir) throw new Error('Load a run first to view diffs.');
  const result = await api(`/api/run-diff?runDir=${encodeURIComponent(runDir)}`);
  renderDiff(result.stat, result.diff, result.message);
  showBanner(result.diff ? 'Diff loaded!' : (result.message || 'No changes found.'));
}

/* ─── File Picker Modal ─── */
let filePickerMode = 'folder'; // 'folder' or 'file'
let filePickerAppend = false;
let filePickerSelectedFile = '';

async function openFilePicker(targetInputId, mode = 'folder', append = false) {
  const input = document.querySelector(`#${targetInputId}`);
  if (!input) return;
  filePickerTargetInput = input;
  filePickerMode = mode;
  filePickerAppend = append;
  filePickerSelectedFile = '';

  // Set modal title and select button text
  const titleEl = document.querySelector('#filePickerTitle');
  const selectBtn = els.filePickerSelect;
  if (mode === 'file') {
    titleEl.textContent = '📄 Browse & Select File';
    selectBtn.textContent = '📂 Use Current Folder';
  } else {
    titleEl.textContent = '📁 Browse Folders';
    selectBtn.textContent = '📂 Select This Folder';
  }

  // Determine starting directory
  let startDir = '/Users';
  const currentVal = input.value.trim();
  if (currentVal) {
    // For comma-separated fields, use the last entry's parent dir
    const parts = currentVal.split(',').map(s => s.trim()).filter(Boolean);
    const last = parts[parts.length - 1];
    if (last.includes('/')) {
      startDir = last.substring(0, last.lastIndexOf('/')) || '/Users';
    } else {
      startDir = last;
    }
  }

  filePickerCurrentDir = startDir;
  els.filePickerModal.classList.add('visible');
  await browseDir(startDir);
}

async function browseDir(dir) {
  filePickerCurrentDir = dir;
  filePickerSelectedFile = '';
  try {
    const result = await api(`/api/browse-dir?dir=${encodeURIComponent(dir)}`);
    filePickerCurrentDir = result.dir;
    renderBreadcrumb(result.dir);
    renderFileList(result.entries);
  } catch (err) {
    els.filePickerList.innerHTML = `<div class="empty-state">${err.message}</div>`;
  }
}

function renderBreadcrumb(dir) {
  const parts = dir.split('/').filter(Boolean);
  els.filePickerBreadcrumb.innerHTML = '';
  let accumulated = '';
  for (let i = 0; i < parts.length; i++) {
    accumulated += '/' + parts[i];
    const pathSoFar = accumulated;
    if (i > 0) {
      const sep = document.createElement('span');
      sep.textContent = ' / ';
      els.filePickerBreadcrumb.appendChild(sep);
    }
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = parts[i];
    btn.addEventListener('click', () => browseDir(pathSoFar));
    els.filePickerBreadcrumb.appendChild(btn);
  }
}

function renderFileList(entries) {
  els.filePickerList.innerHTML = '';

  // Parent dir navigation
  if (filePickerCurrentDir !== '/') {
    const parentDir = filePickerCurrentDir.split('/').slice(0, -1).join('/') || '/';
    const parentItem = document.createElement('button');
    parentItem.type = 'button';
    parentItem.className = 'modal-file-item is-dir';
    parentItem.innerHTML = '<span class="file-icon">⬆️</span><span class="file-name">..</span>';
    parentItem.addEventListener('click', () => browseDir(parentDir));
    els.filePickerList.appendChild(parentItem);
  }

  for (const entry of entries) {
    const item = document.createElement('button');
    item.type = 'button';
    const isDir = entry.type === 'directory';
    item.className = `modal-file-item ${isDir ? 'is-dir' : ''}`;
    const icon = isDir ? '📁' : '📄';
    item.innerHTML = `<span class="file-icon">${icon}</span><span class="file-name">${entry.name}</span>`;

    if (isDir) {
      item.addEventListener('click', () => browseDir(entry.path));
    } else if (filePickerMode === 'file') {
      // In file mode: clicking a file selects & confirms immediately
      item.addEventListener('click', () => {
        filePickerSelectedFile = entry.path;
        applyFilePickerSelection(entry.path);
        closeFilePicker();
      });
    }
    els.filePickerList.appendChild(item);
  }
}

function applyFilePickerSelection(selectedPath) {
  if (!filePickerTargetInput || !selectedPath) return;

  if (filePickerAppend) {
    // Append to comma-separated list
    const current = filePickerTargetInput.value.trim();
    const existing = current ? current.split(',').map(s => s.trim()).filter(Boolean) : [];
    if (!existing.includes(selectedPath)) {
      existing.push(selectedPath);
    }
    filePickerTargetInput.value = existing.join(',');
    renderFileTagList(filePickerTargetInput.id);
    showBanner(`Added: ${shortenPath(selectedPath)}`);
  } else {
    filePickerTargetInput.value = selectedPath;
    showBanner(`Selected: ${shortenPath(selectedPath)}`);
  }
}

function closeFilePicker() {
  els.filePickerModal.classList.remove('visible');
  filePickerTargetInput = null;
  filePickerSelectedFile = '';
}

function selectCurrentFolder() {
  if (filePickerTargetInput && filePickerCurrentDir) {
    applyFilePickerSelection(filePickerCurrentDir);
  }
  closeFilePicker();
}

els.filePickerCancel.addEventListener('click', closeFilePicker);
els.filePickerSelect.addEventListener('click', selectCurrentFolder);
els.filePickerModal.addEventListener('click', (e) => { if (e.target === els.filePickerModal) closeFilePicker(); });

// Wire browse buttons (supports data-mode and data-append attributes)
document.querySelectorAll('.btn-browse, .file-tag-add-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const mode = btn.dataset.mode || 'folder';
    const append = btn.dataset.append === 'true';
    openFilePicker(btn.dataset.target, mode, append);
  });
});

/* ─── File Tag List Rendering ─── */
const FILE_TAG_FIELDS = [
  { textareaId: 'designGuides', listId: 'designGuidesTagList' },
  { textareaId: 'blueprintSources', listId: 'blueprintSourcesTagList' }
];

function fileBasename(filePath) {
  const parts = String(filePath || '').split('/');
  return parts[parts.length - 1] || filePath;
}

function renderFileTagList(textareaId) {
  const field = FILE_TAG_FIELDS.find(f => f.textareaId === textareaId);
  if (!field) return;
  const textarea = document.querySelector(`#${field.textareaId}`);
  const container = document.querySelector(`#${field.listId}`);
  if (!textarea || !container) return;

  const paths = textarea.value.split(',').map(s => s.trim()).filter(Boolean);
  container.innerHTML = '';

  for (const fullPath of paths) {
    const tag = document.createElement('div');
    tag.className = 'file-tag';

    const icon = document.createElement('span');
    icon.className = 'file-tag-icon';
    icon.textContent = '📄';

    const info = document.createElement('div');
    info.className = 'file-tag-info';
    const nameSpan = document.createElement('span');
    nameSpan.className = 'file-tag-name';
    nameSpan.textContent = fileBasename(fullPath);
    const pathSpan = document.createElement('span');
    pathSpan.className = 'file-tag-path';
    pathSpan.textContent = fullPath;
    pathSpan.title = fullPath;
    info.append(nameSpan, pathSpan);

    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.className = 'file-tag-remove';
    removeBtn.title = 'Remove this file';
    removeBtn.textContent = '✕';
    removeBtn.addEventListener('click', () => {
      const current = textarea.value.split(',').map(s => s.trim()).filter(Boolean);
      const updated = current.filter(p => p !== fullPath);
      textarea.value = updated.join(',');
      renderFileTagList(textareaId);
    });

    tag.append(icon, info, removeBtn);
    container.appendChild(tag);
  }
}

function renderAllFileTagLists() {
  for (const field of FILE_TAG_FIELDS) {
    renderFileTagList(field.textareaId);
  }
}

/* ─── Snapshot Rendering ─── */
function phaseProgressText(snapshot) {
  if (!snapshot?.state?.phases?.length) return { text: 'No run loaded', className: 'badge badge-idle' };
  const { completed, total, done } = snapshot.health;
  if (done) return { text: `${completed}/${total} complete`, className: 'badge badge-done' };
  return { text: `${completed}/${total} • Phase ${snapshot.health.nextPhase?.id || '?'}`, className: 'badge badge-running' };
}

function renderSnapshot(snapshot) {
  if (!snapshot) return;
  const wasActive = previousAutopilotActive;
  const prevCompleted = previousCompletedCount;
  const failureReason = String(snapshot?.autopilot?.failureReason || '').trim();

  currentRunDir = snapshot.runDir;
  nextPromptCache = snapshot.nextPrompt || '';
  els.runDir.value = snapshot.runDir;
  els.currentRunShort.textContent = shortenPath(snapshot.runDir);

  const { completed, total } = snapshot.health;
  els.progressCardValue.textContent = `${completed} / ${total}`;
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
  els.progressBar.style.width = `${pct}%`;
  els.nextPhaseCardValue.textContent = snapshot.health.nextPhase ? `Phase ${snapshot.health.nextPhase.id}` : 'Finished';
  els.targetProjectShort.textContent = shortenPath(snapshot.state.projectPath);

  const progress = phaseProgressText(snapshot);
  els.phaseProgress.textContent = progress.text;
  els.phaseProgress.className = progress.className;

  const statusLines = [`Mode: ${snapshot.state.mode}`, `Target: ${snapshot.state.projectPath}`, `Updated: ${snapshot.state.updatedAt}`, ''];
  for (const phase of snapshot.state.phases) {
    statusLines.push(`Phase ${phase.id} | ${phase.status.padEnd(9)} | ${phase.title}`);
  }
  if (failureReason) {
    statusLines.push('', 'Failure reason:', failureReason);
  }
  els.statusView.textContent = statusLines.join('\n');
  els.statusView.classList.remove('empty');

  els.promptView.textContent = snapshot.nextPrompt || 'No next prompt available.';
  els.promptView.classList.toggle('empty', !snapshot.nextPrompt);
  els.summaryView.textContent = snapshot.runSummary || 'No run summary yet.';
  els.summaryView.classList.toggle('empty', !snapshot.runSummary);

  els.logPath.textContent = snapshot.logPath ? shortenPath(snapshot.logPath) : 'No log yet';
  const combinedLog = [snapshot.autopilot.consoleTail, snapshot.logTail].filter(Boolean).join('\n\n');
  rawLogContent = combinedLog;
  if (els.logSearch.value.trim()) {
    applyLogSearch();
  } else {
    els.logView.innerHTML = colorizeLog(combinedLog) || 'Autopilot logs will appear here.';
    els.logView.classList.toggle('empty', !combinedLog);
  }
  scrollLogToBottom();

  // Autopilot state badge
  previousAutopilotActive = snapshot.autopilot.active;
  previousCompletedCount = completed;

  if (snapshot.autopilot.active) {
    els.autopilotState.innerHTML = `<span class="badge-dot"></span> Running • PID ${snapshot.autopilot.pid}`;
    els.autopilotState.className = 'badge badge-running';
  } else if (snapshot.health.done && snapshot.autopilot.lastExitCode === 0) {
    els.autopilotState.innerHTML = `<span class="badge-dot"></span> Completed`;
    els.autopilotState.className = 'badge badge-done';
  } else if (snapshot.autopilot.lastExitCode !== null) {
    const failed = Number(snapshot.autopilot.lastExitCode) !== 0;
    els.autopilotState.innerHTML = `<span class="badge-dot"></span> ${failed ? 'Failed' : 'Stopped'} • exit ${snapshot.autopilot.lastExitCode}`;
    els.autopilotState.className = failed ? 'badge badge-error' : 'badge badge-warning';
  } else {
    els.autopilotState.innerHTML = `<span class="badge-dot"></span> Idle`;
    els.autopilotState.className = 'badge badge-idle';
  }

  // Desktop notifications
  if (wasActive && !snapshot.autopilot.active) {
    sendDesktopNotification('🤖 Autopilot Finished', `Run completed with ${completed}/${total} phases done.`);
  } else if (completed > prevCompleted && snapshot.autopilot.active) {
    sendDesktopNotification('✅ Phase Complete', `Phase ${prevCompleted + 1} finished. ${completed}/${total} done.`);
  }
}

function clearSnapshotView() {
  currentRunDir = '';
  nextPromptCache = '';
  rawLogContent = '';
  els.runDir.value = '';
  els.currentRunShort.textContent = 'None loaded';
  els.progressCardValue.textContent = '0 / 0';
  els.progressBar.style.width = '0%';
  els.nextPhaseCardValue.textContent = 'Not loaded';
  els.targetProjectShort.textContent = 'None';
  els.phaseProgress.textContent = 'No run loaded';
  els.phaseProgress.className = 'badge badge-idle';
  els.autopilotState.innerHTML = '<span class="badge-dot"></span> Idle';
  els.autopilotState.className = 'badge badge-idle';
  els.statusView.textContent = 'Load a run to see phase progress.'; els.statusView.classList.add('empty');
  els.promptView.textContent = 'Start or load a run to view the next prompt.'; els.promptView.classList.add('empty');
  els.summaryView.textContent = 'Run summaries appear here.'; els.summaryView.classList.add('empty');
  els.logPath.textContent = 'No log yet';
  els.logView.innerHTML = 'Autopilot logs will appear here.'; els.logView.classList.add('empty');
}

/* ─── API Calls ─── */
async function loadRecentRuns() {
  return (await api(workspaceQuery('/api/recent-runs'))).runs || [];
}

async function loadRecentSummaries() {
  return (await api(workspaceQuery('/api/recent-summaries'))).summaries || [];
}

async function loadHistory() {
  const [runs, summaries] = await Promise.all([loadRecentRuns(), loadRecentSummaries()]);
  renderHistory(runs, summaries);
  renderAgents(runs);
}

async function cleanupDuplicateRunHistory() {
  const result = await api('/api/cleanup-duplicate-runs', {
    method: 'POST',
    body: JSON.stringify({
      workspaceRoot: workspaceRootValue()
    })
  });
  renderHistory(result.recentRuns || [], result.recentSummaries || []);
  renderAgents(result.recentRuns || []);
  const removed = Number(result.removedCount || 0);
  if (removed > 0) {
    showBanner(`Removed ${removed} duplicate run${removed === 1 ? '' : 's'}.`);
  } else {
    showBanner('No duplicate runs found.');
  }
}

async function loadWorkspaceList() {
  const payload = await api('/api/workspaces');
  setSavedWorkspaces(payload.workspaces || []);
}

function applyMetaCollections(meta) {
  if (!meta) return;
  setModeOptions(meta.modes || []);
  setScopeLevelOptions(meta.scopeLevels || []);
  setModelOptions(meta.modelOptions || []);
  setQualityPresets(meta.qualityPresets || []);
  setQuickStarts(meta.quickStarts || []);
  setSavedWorkspaces(meta.savedWorkspaces || []);
  setProjectProfiles(meta.projectProfiles || []);
  renderHistory(meta.recentRuns || [], meta.recentSummaries || []);
  renderAgents(meta.recentRuns || []);
}

function applyMetaDefaults(defaults, options = {}) {
  if (!defaults) return;
  const preserveMigrationRoot = Boolean(options.preserveMigrationRoot);

  els.workspaceRoot.value = defaults.workspaceRoot || els.workspaceRoot.value;
  els.projectPath.value = defaults.projectPath || '';
  els.designGuides.value = defaults.designGuides || '';
  els.blueprintSources.value = defaults.blueprintSources || '';
  if (els.workspaceScopeLevelDefault) {
    setSelectValueSafe(
      els.workspaceScopeLevelDefault,
      defaults.scopeLevelDefault || cachedScopeLevels[0] || 'module',
      cachedScopeLevels[0] || 'module'
    );
  }
  if (els.workspaceProjectSurfaces) {
    els.workspaceProjectSurfaces.value = prettyJsonArray(
      defaults.projectSurfacesJson || defaults.projectSurfaces || '[]',
      '[]'
    );
  }
  if (els.workspaceDevIgnorePatterns) {
    els.workspaceDevIgnorePatterns.value = listTextFromValue(defaults.devIgnorePatterns || defaults.devIgnore || '');
  }
  if (els.workspaceRequiredAtlasDocs) {
    els.workspaceRequiredAtlasDocs.value = listTextFromValue(defaults.requiredAtlasDocs || defaults.requiredAtlasDocsCsv || '');
  }
  if (els.workspaceFullSystemRequiredDocs) {
    els.workspaceFullSystemRequiredDocs.checked = defaults.fullSystemRequiredDocs !== false;
  }
  if (els.workspaceCodexProfile) {
    els.workspaceCodexProfile.value = defaults.codexProfile || '';
  }
  if (els.workspaceCodexSearchEnabled) {
    els.workspaceCodexSearchEnabled.checked = Boolean(defaults.codexSearchEnabled);
  }
  if (els.workspaceCodexExtraAddDirs) {
    els.workspaceCodexExtraAddDirs.value = listTextFromValue(defaults.codexExtraAddDirs || defaults.codexExtraAddDirsCsv || '');
  }
  if (els.workspaceCodexConfigOverrides) {
    els.workspaceCodexConfigOverrides.value = listTextFromValue(defaults.codexConfigOverrides || defaults.codexConfigOverridesText || '');
  }
  if (els.workspaceCodexAutoAddRelatedRepos) {
    els.workspaceCodexAutoAddRelatedRepos.checked = defaults.codexAutoAddRelatedRepos !== false;
  }
  if (els.workspaceCodexUseExperimentalMultiAgent) {
    els.workspaceCodexUseExperimentalMultiAgent.checked = Boolean(defaults.codexUseExperimentalMultiAgent);
  }
  renderAllFileTagLists();
  els.migrationSourceRoot.value = defaults.migrationSourceRoot
    || (preserveMigrationRoot ? els.migrationSourceRoot.value : DEFAULT_MIGRATION_SOURCE_ROOT);
  syncRunScopeDefaultsFromWorkspace({ force: true });
  syncAutopilotCodexDefaultsFromWorkspace({ force: true });
  updateBrowserToolNotes();

  if (!options.includeRunControls) {
    return;
  }

  if (defaults.refreshSeconds !== undefined) {
    els.refreshSeconds.value = String(defaults.refreshSeconds);
  }
  if (defaults.quiet !== undefined) {
    els.quiet.checked = Boolean(defaults.quiet);
  }
  if (Object.hasOwn(defaults, 'globalRules')) {
    els.globalRules.value = defaults.globalRules || '';
  }

  cachedDefaultModel = defaults.model || cachedDefaultModel;
  applyPresetById(defaults.preset || 'max-codex');
  els.effort.value = defaults.effort || 'xhigh';
  syncAllModelPickers();
  syncRunScopeDefaultsFromWorkspace({ force: true });
  syncAutopilotCodexDefaultsFromWorkspace({ force: true });
}

function setCodeBoxText(el, content, emptyMessage) {
  if (!el) return;
  const text = String(content || '').trim();
  if (text) {
    el.textContent = text;
    el.classList.remove('empty');
    return;
  }
  el.textContent = emptyMessage;
  el.classList.add('empty');
}

function renderCodexStatus(snapshot) {
  const available = Boolean(snapshot?.available);
  const auth = snapshot?.auth || {};
  const usage = snapshot?.usage || {};

  els.codexCliVersion.textContent = available
    ? (snapshot.version || 'Unknown')
    : 'Not detected';
  els.codexAuthState.textContent = auth.loggedIn ? 'Signed in' : 'Signed out';
  els.codexAuthHint.textContent = auth.method ? `Method: ${auth.method}` : '';
  els.codexUsageState.textContent = usage.available ? 'Available' : 'Unavailable';
  els.codexUsageHint.textContent = usage.message || '';

  if (els.codexLoginApiKey) els.codexLoginApiKey.disabled = !available;
  if (els.codexLogout) els.codexLogout.disabled = !available;

  setCodeBoxText(els.codexStatusRaw, auth.raw, available
    ? 'No Codex auth status returned.'
    : 'Codex CLI was not detected from this server process.');
  setCodeBoxText(els.codexUsageRaw, usage.raw, usage.message || 'Usage and limits are unavailable.');
}

async function loadCodexStatus() {
  const payload = await api('/api/codex/status');
  renderCodexStatus(payload);
}

async function codexLoginWithApiKeyAction() {
  const apiKey = els.codexApiKey.value.trim();
  if (!apiKey) throw new Error('Enter an API key first.');
  const payload = await api('/api/codex/login', { method: 'POST', body: JSON.stringify({ apiKey }) });
  els.codexApiKey.value = '';
  renderCodexStatus(payload);
  showBanner(payload.auth?.loggedIn ? 'Codex signed in.' : 'Login command completed. Check status output.');
}

async function codexLogoutAction() {
  const payload = await api('/api/codex/logout', { method: 'POST', body: JSON.stringify({}) });
  renderCodexStatus(payload);
  showBanner(payload.auth?.loggedIn ? 'Logout command ran but account still appears signed in.' : 'Codex signed out.');
}

/* ─── Codex CLI Console ─── */
function cliCommandValue() {
  const value = els.cliCommand.value.trim();
  return value || 'exec';
}

function setCliCommandOptions(commands = []) {
  if (!els.cliCommand) return;
  const previous = cliCommandValue();
  els.cliCommand.innerHTML = '';

  const unique = [];
  const seen = new Set();
  for (const command of commands) {
    const name = String(command?.name || command || '').trim();
    if (!name || seen.has(name)) continue;
    seen.add(name);
    unique.push(name);
  }
  if (!seen.has('exec')) unique.unshift('exec');

  for (const name of unique) {
    const option = document.createElement('option');
    option.value = name;
    option.textContent = name;
    els.cliCommand.appendChild(option);
  }

  if (unique.includes(previous)) els.cliCommand.value = previous;
}

function renderCliCapabilities(capabilities) {
  cachedCliCapabilities = capabilities || null;
  const commands = capabilities?.commands || [];
  setCliCommandOptions(commands);

  const lines = [];
  const snapshot = capabilities?.snapshot || {};
  lines.push(`Binary: ${snapshot.binary || 'n/a'}`);
  lines.push(`Version: ${snapshot.version || 'n/a'}`);
  lines.push(`Logged In: ${snapshot.auth?.loggedIn ? `Yes (${snapshot.auth?.method || 'unknown'})` : 'No'}`);
  lines.push(`Usage Command Available: ${snapshot.usage?.available ? 'Yes' : 'No'}`);
  lines.push('');

  const profiles = capabilities?.profiles || [];
  lines.push(`Profiles (${profiles.length}): ${profiles.length ? profiles.join(', ') : 'none discovered'}`);
  lines.push('');

  lines.push(`Commands (${commands.length}):`);
  for (const command of commands) {
    const sub = command.subcommands?.length ? ` -> ${command.subcommands.join(', ')}` : '';
    lines.push(`- ${command.name}${sub}`);
  }
  lines.push('');

  const features = capabilities?.features || [];
  lines.push(`Features (${features.length}):`);
  for (const feature of features) {
    lines.push(`- ${feature.name} | ${feature.stage} | enabled=${feature.enabled}`);
  }
  lines.push('');

  const mcpServers = capabilities?.mcpServers || [];
  lines.push(`MCP Servers (${mcpServers.length}):`);
  for (const server of mcpServers) {
    lines.push(`- ${server.name} | ${server.command} ${server.args} | status=${server.status} | auth=${server.auth}`);
  }
  lines.push('');

  const slashTemplates = capabilities?.slashTemplates || [];
  lines.push('Slash Templates:');
  for (const slash of slashTemplates) {
    lines.push(`- ${slash}`);
  }
  if (capabilities?.notes?.slashCommands) {
    lines.push('');
    lines.push(`Note: ${capabilities.notes.slashCommands}`);
  }

  setCodeBoxText(els.cliSurfaceView, lines.join('\n'), 'No Codex CLI capabilities loaded yet.');
  updateBrowserToolNotes();
}

function renderCliResult(result) {
  const lines = [];
  lines.push(`Exit Code: ${result.code}`);
  lines.push(`Timed Out: ${result.timedOut ? 'Yes' : 'No'}`);
  lines.push(`Binary: ${result.binary || 'n/a'}`);
  lines.push(`Args: codex ${(result.args || []).join(' ')}`);
  lines.push('');
  lines.push('--- STDOUT ---');
  lines.push(result.stdout || '(empty)');
  lines.push('');
  lines.push('--- STDERR ---');
  lines.push(result.stderr || '(empty)');
  setCodeBoxText(els.cliResultView, lines.join('\n'), 'No command output.');
}

async function loadCliCapabilities(forceRefresh = false) {
  const query = forceRefresh ? '?refresh=1' : '';
  const payload = await api(`/api/codex/capabilities${query}`);
  renderCliCapabilities(payload);
}

function buildCliPayload() {
  return {
    command: cliCommandValue(),
    subcommand: els.cliSubcommand.value.trim(),
    timeoutMs: (Number(els.cliTimeoutSeconds.value) || 30) * 1000,
    prompt: els.cliPrompt.value.trim(),
    slashCommand: els.cliSlashCommand.value.trim(),
    extraArgs: els.cliExtraArgs.value.trim(),
    model: els.cliModel.value.trim(),
    profile: els.cliProfile.value.trim(),
    localProvider: els.cliLocalProvider.value.trim(),
    sandbox: els.cliSandbox.value.trim(),
    approval: els.cliApproval.value.trim(),
    cd: els.cliCd.value.trim(),
    configOverrides: els.cliConfigOverrides.value.trim(),
    addDirs: els.cliAddDirs.value.trim(),
    enableFeatures: els.cliEnableFeatures.value.trim(),
    disableFeatures: els.cliDisableFeatures.value.trim(),
    imagePaths: els.cliImagePaths.value.trim(),
    search: els.cliUseSearch.checked,
    oss: els.cliUseOss.checked,
    fullAuto: els.cliFullAuto.checked,
    noAltScreen: els.cliNoAltScreen.checked,
    dangerouslyBypass: els.cliDangerousBypass.checked
  };
}

async function runCliCommand(payloadOverride = null) {
  const payload = payloadOverride || buildCliPayload();
  const result = await api('/api/codex/run', { method: 'POST', body: JSON.stringify(payload) });
  renderCliResult(result);
  if (!result.ok) {
    showBanner(`Codex command failed (exit ${result.code}).`, 'error');
    return;
  }
  showBanner('Codex command completed.');
  await loadCodexStatus();
  if (cachedCliCapabilities) {
    await loadCliCapabilities(true);
  }
}

function resetCliBuilder() {
  els.cliSubcommand.value = '';
  els.cliPrompt.value = '';
  els.cliSlashCommand.value = '';
  els.cliExtraArgs.value = '';
  els.cliModel.value = '';
  els.cliProfile.value = '';
  els.cliLocalProvider.value = '';
  els.cliSandbox.value = '';
  els.cliApproval.value = '';
  els.cliCd.value = '';
  els.cliConfigOverrides.value = '';
  els.cliAddDirs.value = '';
  els.cliEnableFeatures.value = '';
  els.cliDisableFeatures.value = '';
  els.cliImagePaths.value = '';
  els.cliUseSearch.checked = false;
  els.cliUseOss.checked = false;
  els.cliFullAuto.checked = false;
  els.cliNoAltScreen.checked = false;
  els.cliDangerousBypass.checked = false;
  els.cliTimeoutSeconds.value = '30';
  if (els.cliCommand.options.length) {
    els.cliCommand.value = 'exec';
  }
  syncAllModelPickers();
  showBanner('CLI builder reset.');
}

async function runCliQuickStatus() {
  await runCliCommand({ command: 'login', subcommand: 'status', timeoutMs: 15000 });
}

async function runCliQuickFeatures() {
  await runCliCommand({ command: 'features', subcommand: 'list', timeoutMs: 15000 });
}

async function runCliQuickMcp() {
  await runCliCommand({ command: 'mcp', subcommand: 'list', timeoutMs: 15000 });
}

async function runCliQuickHelp() {
  await runCliCommand({ extraArgs: '--help', timeoutMs: 15000 });
}

async function loadMeta(options = {}) {
  const applyDefaults = options.applyDefaults !== false;
  const payload = await api(workspaceQuery('/api/meta'));
  applyMetaCollections(payload);
  if (applyDefaults) {
    applyMetaDefaults(payload.defaults, { includeRunControls: true });
  }
  updateBrowserToolNotes();

  refreshChatProfileContextOptions();
  if (els.chatModel && !els.chatModel.value.trim()) {
    els.chatModel.value = modelValue();
  }
  syncAllModelPickers();
  if (els.chatEffort && !els.chatEffort.value) {
    els.chatEffort.value = els.effort.value || 'high';
  }
  resetChatIntentPreview();
  if (els.chatThreadsList) {
    try {
      await loadChatThreads({ autoOpenFirst: true });
    } catch {
      setChatThreads([]);
      clearChatThreadView();
    }
  }

  if (payload.defaults.latestRun) {
    currentRunDir = payload.defaults.latestRun;
    els.runDir.value = currentRunDir;
    await refreshRun();
  } else {
    clearSnapshotView();
  }

  try {
    await loadTeams({ teamId: activeTeamId, autoOpenFirst: !activeTeamId });
  } catch {
    activeTeamId = '';
    renderTeamList([]);
    renderTeamDetails(null);
  }
}

async function refreshRun() {
  const runDir = resolvedRunDir();
  if (!runDir) return;
  renderSnapshot(await api(`/api/run?runDir=${encodeURIComponent(runDir)}`));
}

async function initWorkspace(options = {}) {
  const suppressBanner = Boolean(options.suppressBanner);
  const applyMeta = options.applyMeta !== false;
  const payload = {
    workspaceRoot: workspaceRootValue(),
    projectPath: projectPathValue(),
    designGuides: els.designGuides.value.trim(),
    blueprintSources: els.blueprintSources.value.trim(),
    globalRules: els.globalRules.value.trim(),
    projectSurfaces: parseJsonArrayField(els.workspaceProjectSurfaces?.value || '', 'Project Surfaces', { allowEmpty: true }),
    devIgnore: els.workspaceDevIgnorePatterns?.value.trim() || '',
    scopeLevelDefault: els.workspaceScopeLevelDefault?.value || cachedScopeLevels[0] || 'module',
    fullSystemRequiredDocs: Boolean(els.workspaceFullSystemRequiredDocs?.checked),
    requiredAtlasDocs: els.workspaceRequiredAtlasDocs?.value.trim() || '',
    codexProfile: els.workspaceCodexProfile?.value.trim() || '',
    codexSearchEnabled: Boolean(els.workspaceCodexSearchEnabled?.checked),
    codexExtraAddDirs: els.workspaceCodexExtraAddDirs?.value.trim() || '',
    codexConfigOverrides: els.workspaceCodexConfigOverrides?.value.trim() || '',
    codexAutoAddRelatedRepos: Boolean(els.workspaceCodexAutoAddRelatedRepos?.checked),
    codexUseExperimentalMultiAgent: Boolean(els.workspaceCodexUseExperimentalMultiAgent?.checked)
  };
  const result = await api('/api/init-workspace', { method: 'POST', body: JSON.stringify(payload) });
  if (!suppressBanner) {
    showBanner(result.stdout || 'Workspace settings saved.');
  }
  if (applyMeta && result.meta) {
    applyMetaCollections(result.meta);
    applyMetaDefaults(result.meta.defaults, { includeRunControls: true, preserveMigrationRoot: true });
    await loadTeams({ teamId: '' });
  }
}

async function createWorkspace() {
  if (!els.newWorkspaceName.value.trim()) throw new Error('Enter a workspace name first.');
  const payload = {
    name: els.newWorkspaceName.value.trim(),
    projectPath: projectPathValue(),
    designGuides: els.designGuides.value.trim(),
    blueprintSources: els.blueprintSources.value.trim(),
    globalRules: els.globalRules.value.trim(),
    projectSurfaces: parseJsonArrayField(els.workspaceProjectSurfaces?.value || '', 'Project Surfaces', { allowEmpty: true }),
    devIgnore: els.workspaceDevIgnorePatterns?.value.trim() || '',
    scopeLevelDefault: els.workspaceScopeLevelDefault?.value || cachedScopeLevels[0] || 'module',
    fullSystemRequiredDocs: Boolean(els.workspaceFullSystemRequiredDocs?.checked),
    requiredAtlasDocs: els.workspaceRequiredAtlasDocs?.value.trim() || '',
    codexProfile: els.workspaceCodexProfile?.value.trim() || '',
    codexSearchEnabled: Boolean(els.workspaceCodexSearchEnabled?.checked),
    codexExtraAddDirs: els.workspaceCodexExtraAddDirs?.value.trim() || '',
    codexConfigOverrides: els.workspaceCodexConfigOverrides?.value.trim() || '',
    codexAutoAddRelatedRepos: Boolean(els.workspaceCodexAutoAddRelatedRepos?.checked),
    codexUseExperimentalMultiAgent: Boolean(els.workspaceCodexUseExperimentalMultiAgent?.checked)
  };
  const result = await api('/api/create-workspace', { method: 'POST', body: JSON.stringify(payload) });
  els.workspaceRoot.value = result.workspaceRoot;
  els.newWorkspaceName.value = '';
  if (result.meta) {
    applyMetaCollections(result.meta);
    applyMetaDefaults(result.meta.defaults, { preserveMigrationRoot: true });
    await loadTeams({ teamId: '' });
  }
  currentRunDir = '';
  clearSnapshotView();
  showBanner('New workspace created and loaded!');
}

async function migrateRuns() {
  const sourceWorkspaceRoot = els.migrationSourceRoot.value.trim();
  const targetWorkspaceRoot = workspaceRootValue();
  if (!sourceWorkspaceRoot || !targetWorkspaceRoot) throw new Error('Both old workspace root and current workspace are required.');
  const result = await api('/api/migrate-runs', { method: 'POST', body: JSON.stringify({ sourceWorkspaceRoot, targetWorkspaceRoot }) });
  setSavedWorkspaces(result.meta?.savedWorkspaces || cachedWorkspaces);
  renderHistory(result.recentRuns || [], result.recentSummaries || []);
  renderAgents(result.recentRuns || []);
  showBanner(`Imported ${result.importedCount} old run${result.importedCount === 1 ? '' : 's'}.`);
}

async function startRun() {
  if (!els.request.value.trim()) throw new Error('Please describe what you want Codex to do first.');
  const runProjectSurfacesText = String(els.runProjectSurfaces?.value || '').trim();
  const runProjectSurfaces = runProjectSurfacesText
    ? parseJsonArrayField(runProjectSurfacesText, 'Run Project Surfaces', { allowEmpty: false })
    : '';
  const payload = {
    workspaceRoot: workspaceRootValue(),
    projectPath: projectPathValue(),
    mode: els.mode.value,
    scope: els.scope.value.trim(),
    scopeLevel: els.scopeLevel?.value || els.workspaceScopeLevelDefault?.value || cachedScopeLevels[0] || 'module',
    scopeTargets: els.scopeTargets?.value.trim() || '',
    projectSurfaces: runProjectSurfaces,
    devIgnore: els.runDevIgnore?.value.trim() || '',
    requiredAtlasDocs: els.runRequiredAtlasDocs?.value.trim() || '',
    fullSystemRequiredDocs: Boolean(els.runFullSystemRequiredDocs?.checked),
    request: els.request.value.trim(),
    references: els.references.value.trim(),
    globalRules: els.globalRules.value.trim()
  };
  const result = await api('/api/start-run', { method: 'POST', body: JSON.stringify(payload) });
  if (result.latestRun) { currentRunDir = result.latestRun; renderSnapshot(result.snapshot); }
  renderHistory(result.recentRuns || [], result.recentSummaries || []);
  renderAgents(result.recentRuns || []);
  switchTab('dashboard');
  showBanner('Run created! You can start autopilot now.');
}

async function startAutopilotAction() {
  const runDir = resolvedRunDir();
  if (!runDir) throw new Error('Load or create a run first.');
  const payload = autopilotPayloadForRun(runDir);
  await api('/api/start-autopilot', { method: 'POST', body: JSON.stringify(payload) });
  showBanner('Autopilot started! Dashboard will keep refreshing.');
  await refreshRun();
  await Promise.all([loadHistory(), loadAgents()]);
  startPolling(true);
}

async function stopAutopilotAction() {
  const runDir = resolvedRunDir();
  if (!runDir) throw new Error('No run is loaded.');
  await api('/api/stop-autopilot', { method: 'POST', body: JSON.stringify({ runDir }) });
  showBanner('Stop signal sent to autopilot.');
  await Promise.all([loadHistory(), loadAgents()]);
}

async function saveGlobalRules(options = {}) {
  const suppressBanner = Boolean(options.suppressBanner);
  const payload = { workspaceRoot: workspaceRootValue(), globalRules: els.globalRules.value.trim() };
  await api('/api/save-global-rules', { method: 'POST', body: JSON.stringify(payload) });
  if (!suppressBanner) {
    showBanner('Global rules saved! They will be included in every new run.');
  }
}

/* ─── Polling ─── */
function clearPolling() { if (pollingHandle) { clearInterval(pollingHandle); pollingHandle = null; } }

function startPolling(forceRestart = false) {
  if (!els.autoRefresh.checked) { clearPolling(); return; }
  if (forceRestart) clearPolling();
  if (pollingHandle) return;
  const intervalMs = Math.max(Number(els.refreshSeconds.value) || 5, 2) * 1000;
  pollingHandle = setInterval(async () => {
    try {
      if (currentRunDir) await refreshRun();
      await loadHistory();
      if (activeTeamId) {
        await loadTeams({ teamId: activeTeamId });
      }
    } catch (error) { clearPolling(); showBanner(error.message, 'error'); }
  }, intervalMs);
}

/* ─── Prompt Helpers ─── */
function applyStarterPrompt() {
  const sel = cachedModes.find(m => m.id === els.mode.value);
  if (!sel) throw new Error('Select a job type first.');
  els.request.value = sel.starter;
  showBanner('Suggested prompt added.');
}

function insertPromptFramework() {
  const sel = cachedModes.find(m => m.id === els.mode.value);
  const starter = sel ? sel.starter : 'Describe the task clearly.';
  const scope = els.scope.value.trim() || '[Add the exact page, module, folder, or feature]';
  els.request.value = [
    `Goal: ${starter}`, `Scope: ${scope}`,
    'Constraints:', '- Keep the current behavior stable unless explicitly asked for a change.',
    '- Update the atlas / blueprint docs if code structure changes.',
    'Deliverables:', '- Implement the required changes.', '- Update any relevant report or summary files.',
    'Verification:', '- Run the relevant checks for this task before marking it complete.',
    '', `Mode context: ${sel ? sel.label : 'Selected Job'}`
  ].join('\n');
  showBanner('Structured prompt template inserted!');
}

function appendGuardrails() {
  const addition = '\n\nExtra guardrails:\n- Work in bounded steps and keep changes easy to review.\n- If you touch code, refresh the project atlas docs for the affected area.\n- Write a short summary of what changed, why, and how it was verified.';
  els.request.value = els.request.value.trim()
    ? `${els.request.value.trim()}${addition}`
    : `Goal: [Describe the task]${addition}`;
  showBanner('Safety guardrails added.');
}

/* ─── Event Wiring ─── */
function attachClick(el, fn) { if (!el) return; el.addEventListener('click', async () => { try { await fn(); } catch (e) { showBanner(e.message, 'error'); } }); }

attachClick(els.refreshMeta, loadMeta);
attachClick(els.initWorkspace, initWorkspace);
attachClick(els.refreshWorkspaces, loadWorkspaceList);
attachClick(els.createWorkspace, createWorkspace);
attachClick(els.refreshProjectProfiles, loadProjectProfiles);
attachClick(els.saveCurrentAsProfile, saveCurrentAsProfile);
attachClick(els.applyProjectProfile, () => applySelectedProfile(false));
attachClick(els.applyProfileAndInit, () => applySelectedProfile(true));
attachClick(els.deleteProjectProfile, deleteSelectedProfile);
attachClick(els.useHuzPreset, useHuzPreset);
attachClick(els.migrateRuns, migrateRuns);
attachClick(els.refreshHistory, loadHistory);
attachClick(els.cleanupDuplicateRuns, cleanupDuplicateRunHistory);
attachClick(els.refreshAgents, loadAgents);
attachClick(els.teamRefresh, () => loadTeams({ teamId: activeTeamId }));
attachClick(els.teamCreate, createTeamPlan);
attachClick(els.teamStartReady, startTeamCampaign);
attachClick(els.teamStopActive, stopTeamCampaign);
attachClick(els.agentSelectAll, selectAllAgents);
attachClick(els.agentClearSelection, clearAgentSelection);
attachClick(els.agentStartSelected, startSelectedAgents);
attachClick(els.agentStopSelected, stopSelectedAgents);
attachClick(els.startRun, startRun);
attachClick(els.refreshRun, refreshRun);
attachClick(els.startAutopilot, startAutopilotAction);
attachClick(els.stopAutopilot, stopAutopilotAction);
attachClick(els.useStarterPrompt, applyStarterPrompt);
attachClick(els.insertFramework, insertPromptFramework);
attachClick(els.appendGuardrails, appendGuardrails);
attachClick(els.clearRequest, () => { els.request.value = ''; showBanner('Request cleared.'); });
attachClick(els.copyRunDir, () => copyText(resolvedRunDir(), 'Run path copied.'));
attachClick(els.copyNextPrompt, () => copyText(nextPromptCache, 'Next prompt copied.'));
attachClick(els.saveGlobalRules, saveGlobalRules);
attachClick(els.loadDiff, loadDiffAction);
attachClick(els.refreshCodexStatus, loadCodexStatus);
attachClick(els.codexLoginApiKey, codexLoginWithApiKeyAction);
attachClick(els.codexLogout, codexLogoutAction);
attachClick(els.refreshCliCapabilities, () => loadCliCapabilities(true));
attachClick(els.cliRunCommand, runCliCommand);
attachClick(els.cliResetForm, resetCliBuilder);
attachClick(els.cliQuickStatus, runCliQuickStatus);
attachClick(els.cliQuickFeatures, runCliQuickFeatures);
attachClick(els.cliQuickMcp, runCliQuickMcp);
attachClick(els.cliQuickHelp, runCliQuickHelp);
attachClick(els.chatNewThread, () => createChatThread('New Chat'));
attachClick(els.chatRefreshThreads, () => loadChatThreads({ autoOpenFirst: true }));
attachClick(els.chatPreviewIntent, previewChatIntent);
attachClick(els.chatSend, sendChatMessage);
attachClick(els.chatQuickDeepAudit, runQuickDeepAuditFromChat);
if (els.chatAutomationToggle) {
  els.chatAutomationToggle.addEventListener('change', () => {
    syncChatAutomationControls();
    resetChatIntentPreview();
  });
}
syncChatAutomationControls();

if (els.modelPicker) {
  els.modelPicker.addEventListener('change', () => {
    applyModelPickerSelection(els.modelPicker, els.modelInput, {
      onAnySelection: () => {
        els.qualityPreset.value = 'custom';
      }
    });
  });
}
if (els.chatModelPicker) {
  els.chatModelPicker.addEventListener('change', () => {
    applyModelPickerSelection(els.chatModelPicker, els.chatModel);
  });
}
if (els.cliModelPicker) {
  els.cliModelPicker.addEventListener('change', () => {
    applyModelPickerSelection(els.cliModelPicker, els.cliModel);
  });
}
els.modelInput.addEventListener('input', () => {
  els.qualityPreset.value = 'custom';
  syncModelPickerToInput(els.modelPicker, els.modelInput);
});
if (els.chatModel) {
  els.chatModel.addEventListener('input', () => {
    syncModelPickerToInput(els.chatModelPicker, els.chatModel);
  });
}
if (els.cliModel) {
  els.cliModel.addEventListener('input', () => {
    syncModelPickerToInput(els.cliModelPicker, els.cliModel);
  });
}
els.qualityPreset.addEventListener('change', () => applyPresetById(els.qualityPreset.value));
els.effort.addEventListener('change', () => { els.qualityPreset.value = 'custom'; });
els.maxCycles.addEventListener('input', () => { els.qualityPreset.value = 'custom'; });
els.quiet.addEventListener('change', () => { els.qualityPreset.value = 'custom'; });
els.autoRefresh.addEventListener('change', () => startPolling(true));
els.refreshSeconds.addEventListener('change', () => startPolling(true));
if (els.projectProfileSelect) {
  els.projectProfileSelect.addEventListener('change', () => {
    const profile = selectedProjectProfile();
    els.projectProfileName.value = profile?.name || '';
    if (profile) {
      applyProfileToForm(profile);
    }
    renderProjectProfiles();
  });
}
if (els.chatProfileContext) {
  els.chatProfileContext.addEventListener('change', async () => {
    updateChatContextSummary();
    resetChatIntentPreview();
    const selected = selectedChatProfileContext();
    if (selected?.preferredModel && els.chatModel) {
      els.chatModel.value = selected.preferredModel;
      syncModelPickerToInput(els.chatModelPicker, els.chatModel);
    }
    if (selected?.preferredEffort && els.chatEffort) {
      els.chatEffort.value = selected.preferredEffort;
    }
    try {
      await loadChatThreads({ autoOpenFirst: true });
    } catch (error) {
      showBanner(error.message, 'error');
    }
  });
}
if (els.chatInput) {
  els.chatInput.addEventListener('input', () => {
    resetChatIntentPreview();
  });
  els.chatInput.addEventListener('keydown', async (event) => {
    if (event.key !== 'Enter' || event.shiftKey) return;
    event.preventDefault();
    try {
      await sendChatMessage();
    } catch (error) {
      showBanner(error.message, 'error');
    }
  });
}
[els.workspaceRoot, els.projectPath].forEach((inputEl) => {
  if (!inputEl) return;
  inputEl.addEventListener('input', updateChatContextSummary);
  inputEl.addEventListener('change', updateChatContextSummary);
});
if (els.workspaceScopeLevelDefault) {
  els.workspaceScopeLevelDefault.addEventListener('change', () => syncRunScopeDefaultsFromWorkspace({ force: true }));
}
if (els.workspaceFullSystemRequiredDocs) {
  els.workspaceFullSystemRequiredDocs.addEventListener('change', () => syncRunScopeDefaultsFromWorkspace({ force: true }));
}
[els.workspaceProjectSurfaces, els.workspaceDevIgnorePatterns, els.workspaceRequiredAtlasDocs].forEach((field) => {
  if (!field) return;
  field.addEventListener('change', () => syncRunScopeDefaultsFromWorkspace());
});

/* ─── Init ─── */
loadMeta()
  .then(async () => {
    startPolling(true);
    try {
      await Promise.all([
        loadCodexStatus(),
        loadCliCapabilities(true),
        loadAgents(),
        loadProjectProfiles()
      ]);
    } catch (error) {
      showBanner(`Startup data unavailable: ${error.message}`, 'error');
    }
  })
  .catch(error => showBanner(error.message, 'error'));
