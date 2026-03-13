import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { spawn, execFile } from 'node:child_process';
import { promisify } from 'node:util';
const execFileAsync = promisify(execFile);
import os from 'node:os';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PUBLIC_DIR = path.join(__dirname, 'public');
const PROJECT_BOT = '/Users/macbook/.codex/skills/project-autopilot-manager/scripts/project_orchestrate.mjs';
const AUTOPILOT = path.join(__dirname, 'bin', 'run-orchestration-autopilot.sh');
const PORT = Number(process.env.PORT || 4311);
const DEFAULT_AGENT_WORKSPACE_ROOT = path.join(__dirname, 'agent-workspaces', 'default');
const DEFAULT_PROJECT_PATH = '/Users/macbook/Desktop/Huz/Huz-Web-Frontend';
const DEFAULT_DESIGN_GUIDES = [
  '/Users/macbook/Desktop/Huz/UI_DESIGN_SYSTEM_GUIDE.md',
  '/Users/macbook/Desktop/Huz/HOMEPAGE_DEVELOPMENT_CUSTOMIZATION_GUIDE.md'
];
const SCOPE_LEVELS = [
  'module',
  'panel-fe',
  'panel-be',
  'panel-fullstack',
  'multi-panel-fe',
  'multi-panel-fullstack',
  'full-system'
];
const DEFAULT_SCOPE_LEVEL = 'module';
const DEFAULT_DEV_IGNORE_PATTERNS = [
  'node_modules/**',
  'dist/**',
  'build/**',
  'coverage/**',
  '.git/**',
  '.cache/**',
  '.next/**',
  '.turbo/**',
  '.idea/**',
  '.vscode/**',
  'logs/**',
  'tmp/**',
  'temp/**',
  '*.min.js',
  '*.map',
  '*.log',
  '*.lock'
];
const DEFAULT_FULL_SYSTEM_REQUIRED_DOCS = true;
const DEFAULT_GLOBAL_RULES = [
  'Always maintain full-system project memory in docs for the selected scope level.',
  'Exclude non-dev and non-required files from deep mapping and auditing.',
  'When code changes touch modules/routes/APIs/contracts/schema/security/state, refresh relevant atlas docs in the same run.',
  'Keep audit findings traceable with status updates (open, fixed, verified) when remediation occurs.',
  'For full-system or multi-panel fullstack scope, ensure frontend panels and backend structure/contracts are mapped together.'
].join('\n');
const activeRuns = new Map();
const activeCampaigns = new Map();
const activeTeamCoordinators = new Map();
const CAMPAIGN_POLL_INTERVAL_MS = 20000;
const TEAM_COORDINATOR_POLL_INTERVAL_MS = 20000;
const DEFAULT_CAMPAIGN_FOLLOWUP_RUNS = 3;
const MAX_CAMPAIGN_FOLLOWUP_RUNS = 12;
const DEFAULT_CAMPAIGN_PAGES_PER_RUN = 8;
const MIN_CAMPAIGN_PAGES_PER_RUN = 2;
const MAX_CAMPAIGN_PAGES_PER_RUN = 24;
const TEAM_MANIFEST_VERSION = 1;
const MAX_TEAM_IMPLEMENTATION_BUCKETS = 4;
const CAMPAIGN_POLICY_VALUES = new Set(['auto', 'force-on', 'force-off']);
const CAMPAIGN_FOLLOWUP_MODES = new Set([
  'fix-backlog',
  'feature-delivery',
  'design-revamp',
  'contract-sync',
  'backend-optimize',
  'performance-pass',
  'test-hardening'
]);

const MODE_META = [
  {
    id: 'system-atlas',
    label: 'System Atlas',
    summary: 'Builds or refreshes the master project map so future runs do not need a full rescan.',
    bestFor: 'Full project understanding, blueprint refreshes, and onboarding new work.',
    starter: 'Refresh the full system atlas for this project. Update the blueprint, module map, routes, API surface, and change map only.'
  },
  {
    id: 'full-system-atlas',
    label: 'Full System Atlas',
    summary: 'Builds a full-system atlas across frontend panels, backend services, contracts, schema mapping, dependencies, and security surfaces.',
    bestFor: 'Onboarding new engineers, multi-panel architecture mapping, and full FE+BE blueprinting.',
    starter: 'Refresh the full-system atlas. Cover all configured surfaces and update file map, panel index, frontend/backend blueprints, route matrix, state map, contract registry, schema map, dependency graph, security map, and traceability map.'
  },
  {
    id: 'deep-scan',
    label: 'Deep Scan',
    summary: 'Analyzes logic, routes, contracts, and structure, then writes findings plus backlog.',
    bestFor: 'Report-only scans, code audits, mismatch checks, and analysis before coding.',
    starter: 'Perform a deep scan of the requested scope, write findings, and update the backlog. Report only first.'
  },
  {
    id: 'full-system-deep-audit',
    label: 'Full System Deep Audit',
    summary: 'Audits frontend, backend, contracts, security, and performance as one connected system with prioritized backlog output.',
    bestFor: 'End-to-end fullstack audits and large-scope modernization planning.',
    starter: 'Perform a full-system deep audit across all configured surfaces, document findings by module/panel/service, and produce prioritized execution batches with verification gates.'
  },
  {
    id: 'plan-batch',
    label: 'Plan Batch',
    summary: 'Chooses the next safe batch of work from the backlog and writes a concrete execution plan.',
    bestFor: 'Thinking before coding, breaking large work into smaller batches.',
    starter: 'Read the backlog and plan the next safe batch of work for the requested module.'
  },
  {
    id: 'fix-backlog',
    label: 'Fix Backlog',
    summary: 'Picks the next backlog item, fixes it, verifies it, and updates docs.',
    bestFor: 'Bug-by-bug or module-by-module repair loops.',
    starter: 'Read the backlog, pick the highest-priority item in scope, fix it, verify it, and update the atlas plus backlog.'
  },
  {
    id: 'feature-delivery',
    label: 'Feature Delivery',
    summary: 'Maps backend and frontend impact, builds the requested feature, verifies it, and updates the blueprint.',
    bestFor: 'New features, flow changes, and full-stack product work.',
    starter: 'Implement the requested feature across backend and frontend, reconcile contracts, verify it, and refresh all affected docs.'
  },
  {
    id: 'contract-sync',
    label: 'Contract Sync',
    summary: 'Finds and fixes frontend/backend API mismatches.',
    bestFor: 'When panels and APIs drift or payloads stop matching.',
    starter: 'Compare the backend API contracts to the frontend usage in scope, fix mismatches, verify, and update API docs.'
  },
  {
    id: 'design-revamp',
    label: 'Design Revamp',
    summary: 'Redesigns a page or module using your saved design guides and reference examples.',
    bestFor: 'Page revamps, module redesigns, premium UI upgrades.',
    starter: 'Revamp the requested page or module using the saved design guides and any reference modules provided.'
  },
  {
    id: 'ui-parity',
    label: 'UI Parity',
    summary: 'Makes one page or module match another existing reference module’s quality and style.',
    bestFor: 'Keeping design consistency across panels.',
    starter: 'Make the target module match the design quality and component patterns of the referenced module.'
  },
  {
    id: 'performance-pass',
    label: 'Performance Pass',
    summary: 'Runs a targeted performance and bundle optimization pass with before/after notes.',
    bestFor: 'Build size, runtime speed, render cleanup, asset optimization.',
    starter: 'Run a performance pass on the requested scope, measure the baseline, optimize safely, and record before/after metrics.'
  },
  {
    id: 'responsive-hardening',
    label: 'Responsive Hardening',
    summary: 'Audits and fixes desktop, tablet, and mobile layout issues.',
    bestFor: 'Layout breakages, overflow, spacing drift, mobile fixes.',
    starter: 'Audit the requested UI for mobile, tablet, and desktop issues, fix them, and document the resulting behavior.'
  },
  {
    id: 'dead-code-prune',
    label: 'Dead Code Prune',
    summary: 'Finds unused files and dead code, removes only proven-safe targets, and writes a deletion summary.',
    bestFor: 'Cleanup work, project size reduction, stale module removal.',
    starter: 'Deep scan the requested directory for dead code and unused files, delete only proven-safe targets, and write a cleanup summary.'
  },
  {
    id: 'test-hardening',
    label: 'Test Hardening',
    summary: 'Strengthens tests and verification around risky or recently changed code.',
    bestFor: 'Adding confidence after refactors and bug fixes.',
    starter: 'Improve the tests and validation around the requested scope, then rerun the relevant checks and summarize confidence.'
  },
  {
    id: 'regression-hunt',
    label: 'Regression Hunt',
    summary: 'Rechecks recent changes or risky modules for regressions and fixes them.',
    bestFor: 'Post-refactor confidence sweeps and recent bug fallout.',
    starter: 'Inspect recent changes in scope for regressions, reproduce issues, fix them if found, and document the outcome.'
  },
  {
    id: 'release-gate',
    label: 'Release Gate',
    summary: 'Runs a release-readiness checklist and produces a go or no-go verdict.',
    bestFor: 'Before shipping, deploying, or freezing a release.',
    starter: 'Run the release gate for the requested scope, fix safe blockers if needed, and produce a GO or NO-GO summary.'
  },
  {
    id: 'backend-audit',
    label: 'Backend Audit',
    summary: 'Analyzes backend routes, services, models, bottlenecks, and contract risks.',
    bestFor: 'Server analysis, API mapping, backend health checks.',
    starter: 'Audit the backend scope deeply, map routes and services, identify risks, and write a backend-focused report.'
  },
  {
    id: 'backend-optimize',
    label: 'Backend Optimize',
    summary: 'Improves backend performance, duplication, and efficiency while keeping behavior stable.',
    bestFor: 'Server speedups, cleanup, heavy logic optimization.',
    starter: 'Run a backend optimization pass on the requested scope, improve performance safely, verify, and update the atlas.'
  },
  {
    id: 'security-audit',
    label: 'Security Audit',
    summary: 'Scans auth, permissions, inputs, config, and sensitive flows for concrete risks.',
    bestFor: 'Security reviews and high-risk flow audits.',
    starter: 'Perform a security audit of the requested scope, identify concrete risks, prioritize them, and update the backlog.'
  },
  {
    id: 'migration-batch',
    label: 'Migration Batch',
    summary: 'Handles structured refactors or contract migrations in safe, bounded batches.',
    bestFor: 'Renames, architecture migrations, shared pattern changes.',
    starter: 'Plan and execute a safe migration batch for the requested scope, verify it, and update all affected docs.'
  },
  {
    id: 'project-summary',
    label: 'Project Summary',
    summary: 'Writes a current-state summary for developers or stakeholders.',
    bestFor: 'Handovers, status summaries, explaining the project quickly.',
    starter: 'Write a current-state summary of the requested project or module for a non-technical stakeholder.'
  },
  {
    id: 'improvement-report',
    label: 'Improvement Report',
    summary: 'Produces prioritized suggestions without changing code.',
    bestFor: 'Strategy, advisory work, roadmap ideas, quality reviews.',
    starter: 'Inspect the requested scope and write a prioritized improvement report without implementing changes.'
  },
  {
    id: 'change-journal',
    label: 'Change Journal',
    summary: 'Summarizes what changed recently, why, how, and what remains.',
    bestFor: 'Audits, handoffs, run recaps, work logs.',
    starter: 'Read the latest work records and write a clean change journal entry for the requested scope.'
  },
  {
    id: 'full-enhance',
    label: 'Full Enhance',
    summary: 'Runs a complete analyze, plan, execute, verify, and refresh loop in bounded phases.',
    bestFor: 'Large multi-step project improvements handled by the bot itself.',
    starter: 'Analyze the project, create a prioritized backlog, execute the highest-value batch safely, verify it, and refresh the docs.'
  }
];

const BASE_MODEL_OPTIONS = [
  { value: 'gpt-5.4', label: 'GPT-5.4 (current strongest configured model)' },
  { value: 'gpt-5.3-codex', label: 'GPT-5.3 Codex (best overall)' },
  { value: 'gpt-5-codex-mini', label: 'GPT-5 Codex Mini (faster, lighter)' },
  { value: 'gpt-5.1-codex-mini', label: 'GPT-5.1 Codex Mini (older mini)' },
  { value: 'custom', label: 'Custom model id' }
];

const QUALITY_PRESETS = [
  {
    id: 'max-codex',
    label: 'Max Codex',
    summary: 'Uses your Codex config default model with search and broader repo context for the strongest runs.',
    model: '',
    useWorkspaceDefaultModel: true,
    effort: 'xhigh',
    quiet: true,
    maxCycles: 14,
    search: true,
    autoAddRelatedRepos: true
  },
  {
    id: 'max-quality',
    label: 'Max Quality',
    summary: 'High-quality project work with your workspace default model and deep reasoning.',
    model: '',
    useWorkspaceDefaultModel: true,
    effort: 'xhigh',
    quiet: true,
    maxCycles: 12
  },
  {
    id: 'balanced',
    label: 'Balanced',
    summary: 'Good default for most tasks. Keeps quality high while staying a bit lighter.',
    model: '',
    useWorkspaceDefaultModel: true,
    effort: 'high',
    quiet: true,
    maxCycles: 10
  },
  {
    id: 'fast-sweep',
    label: 'Fast Sweep',
    summary: 'Best for lighter scans, summaries, or cleanup experiments.',
    model: 'gpt-5-codex-mini',
    effort: 'medium',
    quiet: true,
    maxCycles: 8
  },
  {
    id: 'custom',
    label: 'Custom',
    summary: 'Manually choose every setting yourself.',
    model: '',
    effort: 'xhigh',
    quiet: true,
    maxCycles: 12
  }
];

const QUICK_STARTS = [
  {
    id: 'scan-project',
    label: 'Scan Project',
    mode: 'system-atlas',
    description: 'Refresh the full blueprint and map first.',
    starter: 'Refresh the full system atlas for this project, update the blueprint and module map, and report key architecture findings.'
  },
  {
    id: 'full-system-atlas',
    label: 'Full System Atlas',
    mode: 'full-system-atlas',
    description: 'Build complete FE+BE atlas docs with panel/module/schema/API/dependency/security mapping.',
    starter: 'Refresh the full-system atlas for all configured surfaces and produce a developer-ready system map.'
  },
  {
    id: 'deep-audit',
    label: 'Deep Audit',
    mode: 'deep-scan',
    description: 'Analyze logic, routes, APIs, and risks without changing code.',
    starter: 'Perform a deep scan of this project, write a structured analysis report, and create or refresh the bug backlog. Report only first.'
  },
  {
    id: 'full-system-deep-audit',
    label: 'Full System Audit',
    mode: 'full-system-deep-audit',
    description: 'Run end-to-end audit across frontend, backend, contracts, security, and performance.',
    starter: 'Perform a full-system deep audit, generate a full audit report, and produce prioritized remediation batches.'
  },
  {
    id: 'fix-backlog',
    label: 'Fix Backlog',
    mode: 'fix-backlog',
    description: 'Pick the next backlog item and fix it safely.',
    starter: 'Read the current bug backlog, pick the highest-priority item in scope, fix it, verify it, and update the backlog plus atlas docs.'
  },
  {
    id: 'revamp-page',
    label: 'Revamp Page',
    mode: 'design-revamp',
    description: 'Redesign a page or module using the saved design guides.',
    starter: 'Revamp the requested page or module using the saved design guides while keeping the rest of the system stable.'
  },
  {
    id: 'audit-frontend',
    label: 'Audit Frontend',
    mode: 'deep-scan',
    description: 'Inspect the frontend only for structure, UX logic, and technical issues.',
    starter: 'Audit the frontend scope only, analyze routes, UI logic, dead code, and performance issues, then write findings and a prioritized backlog.'
  },
  {
    id: 'audit-backend',
    label: 'Audit Backend',
    mode: 'backend-audit',
    description: 'Inspect backend routes, services, contracts, and risks.',
    starter: 'Audit the backend deeply, map routes and services, identify contract risks, and write a backend system report.'
  },
  {
    id: 'sync-contracts',
    label: 'Sync Contracts',
    mode: 'contract-sync',
    description: 'Match frontend requests with backend APIs.',
    starter: 'Compare backend API contracts to frontend usage, fix mismatches safely, verify behavior, and update API docs.'
  },
  {
    id: 'cleanup-dead-code',
    label: 'Clean Dead Code',
    mode: 'dead-code-prune',
    description: 'Find and remove proven-unused files and code.',
    starter: 'Deep scan the requested directory for unused files and dead code, remove only proven-safe targets, and write a cleanup summary.'
  },
  {
    id: 'performance-pass',
    label: 'Speed Up App',
    mode: 'performance-pass',
    description: 'Run a focused performance and bundle-size optimization pass.',
    starter: 'Run a performance pass on the requested scope, measure the baseline, optimize safely, and record before and after metrics.'
  },
  {
    id: 'ship-check',
    label: 'Release Check',
    mode: 'release-gate',
    description: 'Run a go or no-go readiness check before shipping.',
    starter: 'Run the release gate for this project, fix safe blockers if found, and produce a clear GO or NO-GO summary.'
  }
];

function slugifyName(value) {
  return String(value || 'workspace')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 48) || 'workspace';
}

function agentWorkspacesRoot() {
  return path.join(__dirname, 'agent-workspaces');
}

function defaultBlueprintSourcesForWorkspace(workspaceRoot) {
  const root = path.resolve(workspaceRoot || DEFAULT_AGENT_WORKSPACE_ROOT);
  return defaultRequiredAtlasDocs(root, true);
}

function projectProfilesPath() {
  return path.join(agentWorkspacesRoot(), 'project-profiles.json');
}

function parseStringList(value) {
  if (Array.isArray(value)) {
    return value.map((entry) => String(entry || '').trim()).filter(Boolean);
  }
  return String(value || '')
    .split(/\r?\n|,/)
    .map((entry) => entry.trim())
    .filter(Boolean);
}

function normalizeScopeLevel(value, fallback = DEFAULT_SCOPE_LEVEL) {
  const normalized = String(value || '').trim().toLowerCase();
  if (!normalized) return fallback;
  return SCOPE_LEVELS.includes(normalized) ? normalized : fallback;
}

function inferSurfaceKindFromPath(surfacePath) {
  const normalized = String(surfacePath || '').toLowerCase();
  if (normalized.includes('frontend') || normalized.includes('web-frontend')) return 'panel-fe';
  if (normalized.includes('backend') || normalized.includes('django') || normalized.includes('api')) return 'panel-be';
  return 'panel-fullstack';
}

function defaultProjectSurfaces(projectPath) {
  const resolved = path.resolve(String(projectPath || DEFAULT_PROJECT_PATH));
  return [
    {
      id: 'primary-project',
      label: path.basename(resolved),
      path: resolved,
      kind: inferSurfaceKindFromPath(resolved)
    }
  ];
}

function defaultRequiredAtlasDocs(workspaceRoot, fullSystemRequiredDocs = DEFAULT_FULL_SYSTEM_REQUIRED_DOCS) {
  const root = path.resolve(workspaceRoot || DEFAULT_AGENT_WORKSPACE_ROOT);
  const atlasRoot = path.join(root, 'docs', 'atlas');
  const qaRoot = path.join(root, 'docs', 'qa');
  const core = [
    path.join(atlasRoot, 'PROJECT_BLUEPRINT.md'),
    path.join(atlasRoot, 'MODULE_MAP.md'),
    path.join(atlasRoot, 'ROUTES_AND_ENTRYPOINTS.md'),
    path.join(atlasRoot, 'API_SURFACE.md'),
    path.join(atlasRoot, 'CHANGE_MAP.md')
  ];
  if (!fullSystemRequiredDocs) {
    return core;
  }
  return [
    path.join(atlasRoot, 'SYSTEM_BLUEPRINT.md'),
    path.join(atlasRoot, 'FILE_MAP_DEV_ONLY.md'),
    path.join(atlasRoot, 'PANEL_MODULE_INDEX.md'),
    path.join(atlasRoot, 'FRONTEND_BLUEPRINT.md'),
    path.join(atlasRoot, 'BACKEND_BLUEPRINT.md'),
    ...core,
    path.join(atlasRoot, 'ROUTE_MATRIX.md'),
    path.join(atlasRoot, 'STATE_MANAGEMENT_MAP.md'),
    path.join(atlasRoot, 'API_CONTRACT_REGISTRY.md'),
    path.join(atlasRoot, 'BACKEND_SCHEMA_MAP.md'),
    path.join(atlasRoot, 'DEPENDENCY_GRAPH.md'),
    path.join(atlasRoot, 'SECURITY_THREAT_MAP.md'),
    path.join(atlasRoot, 'TRACEABILITY_MAP.md'),
    path.join(qaRoot, 'FULL_AUDIT_REPORT.md'),
    path.join(qaRoot, 'DEEP_SCAN_REPORT.md'),
    path.join(qaRoot, 'BUG_BACKLOG.md')
  ];
}

function normalizeProjectSurfaces(value, projectPath) {
  const fallback = defaultProjectSurfaces(projectPath);
  if (!Array.isArray(value) || !value.length) return fallback;

  const surfaces = value
    .map((entry, index) => {
      if (!entry || typeof entry !== 'object') return null;
      const surfacePath = String(entry.path || '').trim();
      if (!surfacePath) return null;
      const resolvedPath = path.resolve(surfacePath);
      return {
        id: String(entry.id || `surface-${index + 1}`).trim() || `surface-${index + 1}`,
        label: String(entry.label || entry.name || path.basename(resolvedPath)).trim() || path.basename(resolvedPath),
        path: resolvedPath,
        kind: normalizeScopeLevel(entry.kind || entry.type || inferSurfaceKindFromPath(resolvedPath), 'panel-fullstack')
      };
    })
    .filter(Boolean);

  return surfaces.length ? surfaces : fallback;
}

function normalizeWorkspaceConfig(config, workspaceRoot) {
  const resolvedRoot = path.resolve(workspaceRoot || DEFAULT_AGENT_WORKSPACE_ROOT);
  const projectPath = path.resolve(String(config?.projectPath || DEFAULT_PROJECT_PATH));
  const fullSystemRequiredDocs = config?.fullSystemRequiredDocs !== false;
  return {
    ...config,
    version: Number(config?.version) || 1,
    workspaceRoot: resolvedRoot,
    projectPath,
    designGuides: parseStringList(config?.designGuides).length ? parseStringList(config?.designGuides) : [...DEFAULT_DESIGN_GUIDES],
    blueprintSources: parseStringList(config?.blueprintSources).length
      ? parseStringList(config?.blueprintSources)
      : defaultBlueprintSourcesForWorkspace(resolvedRoot),
    projectSurfaces: normalizeProjectSurfaces(config?.projectSurfaces, projectPath),
    devIgnorePatterns: parseStringList(config?.devIgnorePatterns).length
      ? parseStringList(config?.devIgnorePatterns)
      : [...DEFAULT_DEV_IGNORE_PATTERNS],
    scopeLevelDefault: normalizeScopeLevel(config?.scopeLevelDefault, DEFAULT_SCOPE_LEVEL),
    fullSystemRequiredDocs,
    requiredAtlasDocs: parseStringList(config?.requiredAtlasDocs).length
      ? parseStringList(config?.requiredAtlasDocs)
      : defaultRequiredAtlasDocs(resolvedRoot, false),
    codexProfile: String(config?.codexProfile || '').trim(),
    codexSearchEnabled: toBoolean(config?.codexSearchEnabled),
    codexExtraAddDirs: parseStringList(config?.codexExtraAddDirs),
    codexConfigOverrides: parseLineList(config?.codexConfigOverrides),
    codexAutoAddRelatedRepos: config?.codexAutoAddRelatedRepos !== false,
    codexUseExperimentalMultiAgent: toBoolean(config?.codexUseExperimentalMultiAgent),
    globalRules: String(config?.globalRules || '').trim() || DEFAULT_GLOBAL_RULES,
    forceExternalDocs: config?.forceExternalDocs !== false
  };
}

function normalizeProfileName(value) {
  return String(value || '')
    .trim()
    .replace(/\s+/g, ' ')
    .slice(0, 80);
}

function randomProfileId() {
  return `profile-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function sanitizeProfileInput(input = {}) {
  const name = normalizeProfileName(input.name);
  if (!name) {
    throw new Error('Profile name is required.');
  }

  const workspaceRoot = path.resolve(String(input.workspaceRoot || DEFAULT_AGENT_WORKSPACE_ROOT).trim());
  const projectPath = path.resolve(String(input.projectPath || DEFAULT_PROJECT_PATH).trim());
  let projectSurfacesInput = input.projectSurfaces;
  if (typeof projectSurfacesInput === 'string') {
    try {
      projectSurfacesInput = JSON.parse(projectSurfacesInput);
    } catch {
      projectSurfacesInput = [];
    }
  }
  const maxCyclesRaw = Number.parseInt(String(input.preferredMaxCycles ?? '').trim(), 10);
  const refreshSecondsRaw = Number.parseInt(String(input.preferredRefreshSeconds ?? '').trim(), 10);

  return {
    id: String(input.id || '').trim() || randomProfileId(),
    name,
    workspaceRoot,
    projectPath,
    designGuides: parseStringList(input.designGuides),
    blueprintSources: parseStringList(input.blueprintSources),
    projectSurfaces: normalizeProjectSurfaces(projectSurfacesInput, projectPath),
    devIgnorePatterns: parseStringList(input.devIgnorePatterns || input.devIgnore),
    scopeLevelDefault: normalizeScopeLevel(input.scopeLevelDefault, DEFAULT_SCOPE_LEVEL),
    fullSystemRequiredDocs: input.fullSystemRequiredDocs === undefined
      ? DEFAULT_FULL_SYSTEM_REQUIRED_DOCS
      : toBoolean(input.fullSystemRequiredDocs),
    requiredAtlasDocs: parseStringList(input.requiredAtlasDocs),
    globalRules: String(input.globalRules || '').trim(),
    preferredModel: String(input.preferredModel || '').trim(),
    preferredEffort: String(input.preferredEffort || '').trim(),
    preferredPreset: String(input.preferredPreset || '').trim(),
    preferredCodexProfile: String(input.preferredCodexProfile || '').trim(),
    preferredCodexSearch: input.preferredCodexSearch === undefined ? null : toBoolean(input.preferredCodexSearch),
    preferredCodexAddDirs: parseStringList(input.preferredCodexAddDirs),
    preferredCodexConfigOverrides: parseLineList(input.preferredCodexConfigOverrides),
    preferredCodexAutoAddRelatedRepos: input.preferredCodexAutoAddRelatedRepos === undefined
      ? null
      : toBoolean(input.preferredCodexAutoAddRelatedRepos),
    preferredCodexExperimentalMultiAgent: input.preferredCodexExperimentalMultiAgent === undefined
      ? null
      : toBoolean(input.preferredCodexExperimentalMultiAgent),
    preferredMaxCycles: Number.isFinite(maxCyclesRaw) && maxCyclesRaw > 0 ? maxCyclesRaw : null,
    preferredQuiet: typeof input.preferredQuiet === 'boolean' ? input.preferredQuiet : null,
    preferredAutoRefresh: typeof input.preferredAutoRefresh === 'boolean' ? input.preferredAutoRefresh : null,
    preferredRefreshSeconds: Number.isFinite(refreshSecondsRaw) && refreshSecondsRaw >= 2 ? refreshSecondsRaw : null
  };
}

async function readProjectProfilesState() {
  const filePath = projectProfilesPath();
  if (!(await exists(filePath))) {
    return { version: 1, profiles: [] };
  }

  try {
    const parsed = await readJson(filePath);
    const profiles = Array.isArray(parsed?.profiles) ? parsed.profiles : [];
    return {
      version: Number(parsed?.version) || 1,
      profiles
    };
  } catch {
    return { version: 1, profiles: [] };
  }
}

async function listProjectProfiles() {
  const state = await readProjectProfilesState();
  return [...state.profiles].sort((left, right) => {
    const leftTime = Date.parse(left?.updatedAt || left?.createdAt || 0);
    const rightTime = Date.parse(right?.updatedAt || right?.createdAt || 0);
    return rightTime - leftTime;
  });
}

async function saveProjectProfile(inputProfile) {
  const incoming = sanitizeProfileInput(inputProfile);
  const state = await readProjectProfilesState();
  const now = new Date().toISOString();

  const existingIndex = state.profiles.findIndex((profile) => {
    const sameId = profile?.id && incoming.id && profile.id === incoming.id;
    const sameName = normalizeProfileName(profile?.name).toLowerCase() === incoming.name.toLowerCase();
    return sameId || sameName;
  });

  if (existingIndex >= 0) {
    const existing = state.profiles[existingIndex] || {};
    const merged = {
      ...existing,
      ...incoming,
      id: existing.id || incoming.id,
      createdAt: existing.createdAt || now,
      updatedAt: now
    };
    state.profiles[existingIndex] = merged;
    await writeJson(projectProfilesPath(), state);
    return { profile: merged, profiles: await listProjectProfiles() };
  }

  const created = {
    ...incoming,
    createdAt: now,
    updatedAt: now
  };
  state.profiles.push(created);
  await writeJson(projectProfilesPath(), state);
  return { profile: created, profiles: await listProjectProfiles() };
}

async function deleteProjectProfile(profileId) {
  const targetId = String(profileId || '').trim();
  if (!targetId) {
    throw new Error('Profile id is required.');
  }

  const state = await readProjectProfilesState();
  const before = state.profiles.length;
  state.profiles = state.profiles.filter((profile) => profile?.id !== targetId);
  const deleted = before !== state.profiles.length;
  if (deleted) {
    await writeJson(projectProfilesPath(), state);
  }
  return { deleted, profiles: await listProjectProfiles() };
}

function chatStorePath() {
  return path.join(agentWorkspacesRoot(), 'chat-store.json');
}

function randomChatId() {
  return `chat-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function randomChatMessageId() {
  return `msg-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function normalizeChatEffort(value) {
  const normalized = String(value || '').trim().toLowerCase();
  if (['low', 'medium', 'high', 'xhigh'].includes(normalized)) return normalized;
  return 'high';
}

function sanitizeChatText(value) {
  return String(value || '')
    .replace(/\r/g, '')
    .trim();
}

function normalizeChatTitle(value) {
  return sanitizeChatText(value)
    .replace(/\s+/g, ' ')
    .slice(0, 96);
}

function chatPreview(value, max = 140) {
  const text = sanitizeChatText(value).replace(/\s+/g, ' ');
  if (text.length <= max) return text;
  return `${text.slice(0, max - 1)}…`;
}

function normalizeChatContext(input = {}) {
  const workspaceRoot = path.resolve(String(input.workspaceRoot || DEFAULT_AGENT_WORKSPACE_ROOT).trim());
  const projectPath = path.resolve(String(input.projectPath || DEFAULT_PROJECT_PATH).trim());
  return {
    profileId: String(input.profileId || '').trim(),
    profileName: normalizeProfileName(input.profileName || ''),
    workspaceRoot,
    projectPath
  };
}

function threadMatchesContext(thread, filter = {}) {
  const profileId = String(filter.profileId || '').trim();
  if (profileId) {
    return String(thread?.profileId || '').trim() === profileId;
  }

  const filterWorkspace = String(filter.workspaceRoot || '').trim();
  const filterProject = String(filter.projectPath || '').trim();
  const threadWorkspace = String(thread?.workspaceRoot || '').trim();
  const threadProject = String(thread?.projectPath || '').trim();

  if (filterWorkspace && threadWorkspace && path.resolve(filterWorkspace) !== path.resolve(threadWorkspace)) {
    return false;
  }
  if (filterProject && threadProject && path.resolve(filterProject) !== path.resolve(threadProject)) {
    return false;
  }
  return true;
}

async function readChatStoreState() {
  const filePath = chatStorePath();
  if (!(await exists(filePath))) {
    return { version: 1, threads: [] };
  }

  try {
    const parsed = await readJson(filePath);
    const threads = Array.isArray(parsed?.threads) ? parsed.threads : [];
    return { version: Number(parsed?.version) || 1, threads };
  } catch {
    return { version: 1, threads: [] };
  }
}

async function writeChatStoreState(state) {
  await writeJson(chatStorePath(), {
    version: 1,
    threads: Array.isArray(state?.threads) ? state.threads : []
  });
}

function appendChatMessage(thread, role, content, meta = null) {
  const text = sanitizeChatText(content);
  if (!text) return null;

  const now = new Date().toISOString();
  const entry = {
    id: randomChatMessageId(),
    role,
    content: text,
    createdAt: now
  };
  if (meta && Object.keys(meta).length) {
    entry.meta = meta;
  }

  if (!Array.isArray(thread.messages)) {
    thread.messages = [];
  }
  thread.messages.push(entry);
  thread.updatedAt = now;

  if ((!thread.title || thread.title === 'New Chat') && role === 'user') {
    thread.title = normalizeChatTitle(text) || 'New Chat';
  }

  return entry;
}

function formatChatThreadSummary(thread) {
  const messages = Array.isArray(thread?.messages) ? thread.messages : [];
  const lastMessage = messages[messages.length - 1] || null;
  return {
    id: thread.id,
    title: thread.title || 'New Chat',
    profileId: thread.profileId || '',
    profileName: thread.profileName || '',
    workspaceRoot: thread.workspaceRoot || '',
    projectPath: thread.projectPath || '',
    model: thread.model || '',
    effort: thread.effort || '',
    messageCount: messages.length,
    preview: lastMessage ? chatPreview(lastMessage.content) : '',
    updatedAt: thread.updatedAt || thread.createdAt || '',
    createdAt: thread.createdAt || ''
  };
}

function formatChatThread(thread) {
  return {
    ...formatChatThreadSummary(thread),
    messages: Array.isArray(thread?.messages) ? thread.messages : []
  };
}

async function listChatThreads(filter = {}) {
  const state = await readChatStoreState();
  return state.threads
    .filter((thread) => threadMatchesContext(thread, filter))
    .sort((left, right) => {
      const leftTime = Date.parse(left?.updatedAt || left?.createdAt || 0);
      const rightTime = Date.parse(right?.updatedAt || right?.createdAt || 0);
      return rightTime - leftTime;
    })
    .map(formatChatThreadSummary);
}

async function getChatThread(threadId) {
  const state = await readChatStoreState();
  const index = state.threads.findIndex((thread) => String(thread?.id || '').trim() === String(threadId || '').trim());
  if (index < 0) {
    const error = new Error('Chat thread not found.');
    error.statusCode = 404;
    throw error;
  }
  return { state, index, thread: state.threads[index] };
}

async function createChatThread(input = {}) {
  const context = normalizeChatContext(input);
  const codexDefaults = await readCodexDefaults();
  const now = new Date().toISOString();
  const thread = {
    id: randomChatId(),
    title: normalizeChatTitle(input.title) || 'New Chat',
    profileId: context.profileId,
    profileName: context.profileName,
    workspaceRoot: context.workspaceRoot,
    projectPath: context.projectPath,
    model: String(input.model || '').trim() || codexDefaults.model || 'gpt-5.4',
    effort: normalizeChatEffort(input.effort || codexDefaults.effort),
    createdAt: now,
    updatedAt: now,
    messages: []
  };

  const state = await readChatStoreState();
  state.threads.push(thread);
  await writeChatStoreState(state);
  return formatChatThread(thread);
}

const CHAT_AUTOMATION_MATCHERS = [
  {
    mode: 'full-system-atlas',
    label: 'Full System Atlas',
    scopeLevel: 'full-system',
    patterns: [/\bfull system atlas\b/i, /\bfull-system atlas\b/i, /\bfull project atlas\b/i, /\bfull system blueprint\b/i]
  },
  {
    mode: 'full-system-deep-audit',
    label: 'Full System Deep Audit',
    scopeLevel: 'full-system',
    patterns: [/\bfull system audit\b/i, /\bfull system deep audit\b/i, /\bfull-system deep audit\b/i, /\bend[- ]to[- ]end audit\b/i, /\bproject[- ]wide deep audit\b/i]
  },
  { mode: 'deep-scan', label: 'Deep Audit', patterns: [/\bdeep audit\b/i, /\bdeep scan\b/i] },
  { mode: 'system-atlas', label: 'System Atlas', patterns: [/\bsystem atlas\b/i, /\bscan project\b/i, /\bproject scan\b/i] },
  { mode: 'fix-backlog', label: 'Fix Backlog', patterns: [/\bfix backlog\b/i, /\bbacklog fix\b/i] },
  { mode: 'performance-pass', label: 'Performance Pass', patterns: [/\bperformance pass\b/i, /\bspeed up\b/i, /\boptimi[sz]e performance\b/i] },
  { mode: 'backend-audit', label: 'Backend Audit', scopeLevel: 'panel-be', patterns: [/\bbackend audit\b/i] },
  { mode: 'security-audit', label: 'Security Audit', patterns: [/\bsecurity audit\b/i] },
  { mode: 'dead-code-prune', label: 'Dead Code Prune', patterns: [/\bdead code\b/i, /\bcleanup dead code\b/i] },
  { mode: 'contract-sync', label: 'Contract Sync', patterns: [/\bcontract sync\b/i, /\bapi mismatch\b/i, /\bapi urls?.*wrong\b/i] },
  { mode: 'design-revamp', label: 'Design Revamp', scopeLevel: 'panel-fe', patterns: [/\bdesign revamp\b/i, /\bredesign\b/i, /\brevamp\b/i] }
];

const CHAT_TARGET_STOPWORDS = new Set([
  'end-to-end',
  'full-system',
  'multi-panel',
  'front-end',
  'back-end',
  'project-bot'
]);

function inferScopeLevelFromChatMessage(text, fallback = DEFAULT_SCOPE_LEVEL) {
  const lower = String(text || '').toLowerCase();
  const hasFrontend = /\b(frontend|front end|ui|ux|web|page|pages|component|components|react|next)\b/.test(lower);
  const hasBackend = /\b(backend|back end|api|apis|server|django|database|schema|endpoint|endpoints)\b/.test(lower);
  const fullSystemCue = /\b(full system|whole system|entire system|entire project|whole project|all panels|all modules|end[- ]to[- ]end)\b/.test(lower);
  const multiPanelCue = /\b(multi[- ]panel|across panels|all panels|multiple panels)\b/.test(lower);
  const panelCue = /\bpanel\b/.test(lower);
  const moduleCue = /\b(module|folder|directory|single page|single module)\b/.test(lower);

  if (fullSystemCue && (hasFrontend || hasBackend)) {
    return hasFrontend && hasBackend ? 'full-system' : (hasFrontend ? 'multi-panel-fe' : 'multi-panel-fullstack');
  }
  if (multiPanelCue) {
    return hasBackend ? 'multi-panel-fullstack' : 'multi-panel-fe';
  }
  if (panelCue && hasFrontend && hasBackend) return 'panel-fullstack';
  if (panelCue && hasFrontend) return 'panel-fe';
  if (panelCue && hasBackend) return 'panel-be';
  if (hasFrontend && hasBackend) return 'panel-fullstack';
  if (hasFrontend) return 'panel-fe';
  if (hasBackend) return 'panel-be';
  if (moduleCue) return 'module';
  return normalizeScopeLevel(fallback, DEFAULT_SCOPE_LEVEL);
}

function clampInteger(value, min, max) {
  const parsed = Number.parseInt(String(value ?? ''), 10);
  if (!Number.isFinite(parsed)) return min;
  return Math.min(max, Math.max(min, parsed));
}

function normalizeCampaignPolicy(value) {
  const normalized = String(value || '').trim().toLowerCase();
  if (CAMPAIGN_POLICY_VALUES.has(normalized)) return normalized;
  return 'auto';
}

function normalizeCampaignFollowupMode(value) {
  const normalized = String(value || '').trim();
  if (CAMPAIGN_FOLLOWUP_MODES.has(normalized)) return normalized;
  return 'fix-backlog';
}

function normalizeCampaignPolicyInput(input = {}) {
  if (!input || typeof input !== 'object') {
    return {
      policy: 'auto',
      followupRuns: null,
      pagesPerRun: null,
      followupMode: 'fix-backlog'
    };
  }
  return {
    policy: normalizeCampaignPolicy(input.policy),
    followupRuns: Number.isFinite(Number(input.followupRuns))
      ? clampInteger(input.followupRuns, 1, MAX_CAMPAIGN_FOLLOWUP_RUNS)
      : null,
    pagesPerRun: Number.isFinite(Number(input.pagesPerRun))
      ? clampInteger(input.pagesPerRun, MIN_CAMPAIGN_PAGES_PER_RUN, MAX_CAMPAIGN_PAGES_PER_RUN)
      : null,
    followupMode: normalizeCampaignFollowupMode(input.followupMode)
  };
}

function estimateCampaignFollowupRuns(pageCount, pagesPerRun = DEFAULT_CAMPAIGN_PAGES_PER_RUN) {
  if (Number.isFinite(pageCount) && pageCount > 0) {
    const totalRunsEstimate = Math.max(2, Math.ceil(pageCount / pagesPerRun));
    return clampInteger(totalRunsEstimate - 1, 2, MAX_CAMPAIGN_FOLLOWUP_RUNS);
  }
  return DEFAULT_CAMPAIGN_FOLLOWUP_RUNS;
}

function analyzeChatAutomationMission(text, scopeLevel) {
  const lower = String(text || '').toLowerCase();
  const hasFrontend = /\b(frontend|front end|ui|ux|web|page|pages|screen|screens|component|components)\b/.test(lower);
  const hasBackend = /\b(backend|back end|api|apis|server|database|schema|endpoint|endpoints|service|services)\b/.test(lower);
  const wantsRedesign = /\b(redesign|re-design|revamp|restyle|ui refresh|ux refresh)\b/.test(lower);
  const wantsExecution = /\b(enhance|improve|upgrade|implement|build|ship|deliver|fix|resolve|match|sync|redesign|revamp)\b/.test(lower);
  const wantsAuditOnly = /\b(audit only|report only|analysis only|analyze only|scan only)\b/.test(lower);
  const allPagesCue = /\b(all pages|every page|each page|all screens|every screen|entire frontend|whole frontend|redesign all pages)\b/.test(lower);
  const wideScopeCue = /\b(entire system|whole system|full system|across the project|project-wide|all modules|all panels)\b/.test(lower);
  const pageCountMatch = lower.match(/\b(\d{2,4})\s*\+?\s*pages?\b/);
  const pageCount = pageCountMatch ? Number.parseInt(pageCountMatch[1], 10) : 0;
  const hasLargePageCount = Number.isFinite(pageCount) && pageCount >= 20;
  const crossStack = hasFrontend && hasBackend;
  const hugeMission = wantsExecution
    && !wantsAuditOnly
    && (
      allPagesCue
      || hasLargePageCount
      || (crossStack && wantsRedesign)
      || (wideScopeCue && (wantsRedesign || crossStack))
    );

  const recommendedScopeLevel = hugeMission
    ? (crossStack ? 'full-system' : 'multi-panel-fe')
    : normalizeScopeLevel(scopeLevel, DEFAULT_SCOPE_LEVEL);

  return {
    hasFrontend,
    hasBackend,
    wantsExecution,
    wantsRedesign,
    pageCount,
    allPagesCue,
    crossStack,
    hugeMission,
    recommendedScopeLevel
  };
}

function buildCampaignIntent(mission = {}, rawPolicy = {}) {
  const policy = normalizeCampaignPolicyInput(rawPolicy);
  if (policy.policy === 'force-off') return null;
  const shouldEnable = policy.policy === 'force-on' || mission.hugeMission;
  if (!shouldEnable) return null;
  const pagesPerRun = policy.pagesPerRun || DEFAULT_CAMPAIGN_PAGES_PER_RUN;
  const followupRuns = policy.followupRuns || estimateCampaignFollowupRuns(mission.pageCount, pagesPerRun);
  return {
    enabled: true,
    reason: mission.hugeMission
      ? 'Large cross-module mission detected. Auto-batching follow-up runs enabled.'
      : 'Campaign policy is forced on by operator settings.',
    policy: policy.policy,
    pageCount: mission.pageCount || 0,
    pagesPerRun,
    followupMode: policy.followupMode,
    followupRuns,
    estimatedTotalRuns: followupRuns + 1
  };
}

function inferChatAutomationMode(text, scopeLevel, mission = null, campaignPolicy = {}) {
  const lower = String(text || '').toLowerCase();
  const wantsAtlas = /\b(atlas|blueprint|system map|file map|module map|architecture map|project overview)\b/.test(lower);
  const wantsAudit = /\b(audit|deep scan|analy[sz]e|analysis|qa|review)\b/.test(lower);
  const wantsSecurity = /\b(security|threat|vulnerability|auth|permission)\b/.test(lower);
  const wantsCleanup = /\b(dead code|unused files?|cleanup|prune)\b/.test(lower);
  const wantsPerformance = /\b(optimi[sz]e|optimization|performance|efficient|fast|faster|speed)\b/.test(lower);
  const wantsDesign = /\b(redesign|re-design|revamp|ui|ux|theme|layout)\b/.test(lower);
  const wantsContracts = /\b(contract|api mismatch|endpoint mismatch|url mismatch|api urls?)\b/.test(lower);
  const wantsFixes = /\b(fix|resolve|bug|issue|backlog)\b/.test(lower);
  const wantsExecution = mission?.wantsExecution
    || /\b(enhance|improve|upgrade|implement|build|ship|deliver)\b/.test(lower);
  const wideScope = scopeLevel === 'full-system'
    || scopeLevel === 'multi-panel-fe'
    || scopeLevel === 'multi-panel-fullstack';
  const campaign = buildCampaignIntent(mission, campaignPolicy);

  if (mission?.hugeMission) {
    return {
      mode: 'full-enhance',
      modeLabel: 'Full Enhance',
      campaign
    };
  }

  if (wantsAtlas && !wantsAudit && !wantsFixes && !wantsSecurity && !wantsDesign && !wantsContracts) {
    return wideScope
      ? { mode: 'full-system-atlas', modeLabel: 'Full System Atlas' }
      : { mode: 'system-atlas', modeLabel: 'System Atlas' };
  }
  if (wantsSecurity && wantsAudit && !wantsExecution) return { mode: 'security-audit', modeLabel: 'Security Audit' };
  if (wantsContracts && (wantsAudit || wantsFixes) && !wantsDesign && !wantsExecution) return { mode: 'contract-sync', modeLabel: 'Contract Sync' };
  if (wantsCleanup && wantsFixes && !wantsAudit) return { mode: 'dead-code-prune', modeLabel: 'Dead Code Prune' };

  const modernizationSignals = [wantsAudit, wantsCleanup, wantsPerformance, wantsDesign, wantsContracts, wantsFixes, wantsSecurity]
    .filter(Boolean)
    .length;
  if (modernizationSignals >= 3) {
    if (wantsExecution || wantsDesign || wantsContracts || wantsFixes) {
      return { mode: 'full-enhance', modeLabel: 'Full Enhance', campaign };
    }
    return wideScope
      ? { mode: 'full-system-deep-audit', modeLabel: 'Full System Deep Audit' }
      : { mode: 'deep-scan', modeLabel: 'Deep Audit' };
  }

  if (wantsDesign && wantsExecution) {
    if (wideScope || mission?.crossStack || mission?.allPagesCue) {
      return { mode: 'full-enhance', modeLabel: 'Full Enhance', campaign };
    }
    return { mode: 'design-revamp', modeLabel: 'Design Revamp' };
  }

  if (wantsAudit && !wantsExecution) {
    return wideScope
      ? { mode: 'full-system-deep-audit', modeLabel: 'Full System Deep Audit' }
      : { mode: 'deep-scan', modeLabel: 'Deep Audit' };
  }

  if (wantsCleanup) return { mode: 'dead-code-prune', modeLabel: 'Dead Code Prune' };
  if (wantsPerformance) return { mode: 'performance-pass', modeLabel: 'Performance Pass' };
  return null;
}

function extractChatScope(message) {
  const text = sanitizeChatText(message);
  if (!text) return '';
  const explicitScope = text.match(/scope\s*:\s*([^\n]+)/i);
  if (explicitScope) return explicitScope[1].trim();

  const explicitTarget = text.match(/target\s*:\s*([^\n]+)/i);
  if (explicitTarget) return explicitTarget[1].trim();

  const pathLike = text.match(/\b([A-Za-z0-9_.-]+(?:\/[A-Za-z0-9_.-]+)+)\b/);
  if (pathLike) return pathLike[1].trim();
  return '';
}

function extractChatScopeTargets(message, scopeText = '') {
  const text = sanitizeChatText(message);
  const explicitTargets = text.match(/scope\s*targets?\s*:\s*([^\n]+)/i)
    || text.match(/targets?\s*:\s*([^\n]+)/i);
  if (explicitTargets) {
    return parseStringList(explicitTargets[1]).slice(0, 12);
  }

  const fromScope = parseStringList(scopeText);
  if (fromScope.length > 1) {
    return fromScope.slice(0, 12);
  }

  const inferred = [];
  for (const match of text.matchAll(/\b([A-Za-z][A-Za-z0-9]*(?:-[A-Za-z0-9]+){1,})\b/g)) {
    const token = String(match[1] || '').trim();
    if (!token) continue;
    const lower = token.toLowerCase();
    if (CHAT_TARGET_STOPWORDS.has(lower)) continue;
    if (inferred.includes(token)) continue;
    inferred.push(token);
    if (inferred.length >= 8) break;
  }
  return inferred;
}

function detectChatAutomationIntent(message, options = {}) {
  const text = sanitizeChatText(message);
  if (!text) return null;
  const lower = text.toLowerCase();
  const scope = extractChatScope(text);
  const inferredScopeLevel = inferScopeLevelFromChatMessage(text, options.scopeLevelDefault || DEFAULT_SCOPE_LEVEL);
  const scopeTargets = extractChatScopeTargets(text, scope);
  const explicitCommand = /^\s*\/(run|autopilot|automation)\b/.test(lower);
  const asksToRun = /\b(run|start|launch|execute|perform|trigger|kick off|begin|do)\b/.test(lower);
  const politeRequest = /\bplease\b/.test(lower);
  const describesAction = /\b(can you|could you|i need|i want|i want you to|we need to|let's)\b/.test(lower);
  const likelyQuestion = /\b(what|why|how|meaning|explain)\b/.test(lower);
  const hasAutomationCue = explicitCommand || asksToRun || politeRequest || describesAction;
  const mission = analyzeChatAutomationMission(text, inferredScopeLevel);
  const campaignPolicy = normalizeCampaignPolicyInput(options.campaignPolicy || {});
  const campaign = buildCampaignIntent(mission, campaignPolicy);

  if (mission.hugeMission && hasAutomationCue) {
    return {
      mode: 'full-enhance',
      modeLabel: 'Full Enhance',
      scope,
      scopeTargets,
      scopeLevel: mission.recommendedScopeLevel || inferredScopeLevel,
      mission,
      campaign
    };
  }

  for (const matcher of CHAT_AUTOMATION_MATCHERS) {
    if (!matcher.patterns.some((pattern) => pattern.test(text))) continue;
    if (!hasAutomationCue && likelyQuestion) return null;
    return {
      mode: matcher.mode,
      modeLabel: matcher.label,
      scope,
      scopeTargets,
      scopeLevel: matcher.scopeLevel
        || (matcher.mode.startsWith('full-system') ? 'full-system' : inferredScopeLevel),
      mission,
      campaign: campaign?.enabled ? campaign : null
    };
  }

  const inferred = inferChatAutomationMode(text, inferredScopeLevel, mission, campaignPolicy);
  if (inferred && hasAutomationCue) {
    return {
      ...inferred,
      scope,
      scopeTargets,
      scopeLevel: inferred.mode.startsWith('full-system') ? 'full-system' : inferredScopeLevel,
      mission,
      campaign: inferred.campaign || campaign
    };
  }

  if (explicitCommand) {
    return {
      mode: 'deep-scan',
      modeLabel: 'Deep Audit',
      scope,
      scopeTargets,
      scopeLevel: inferredScopeLevel,
      mission,
      campaign: null
    };
  }
  return null;
}

async function previewChatAutomationIntent(input = {}) {
  const message = sanitizeChatText(input.message || input.text || '');
  const context = normalizeChatContext(input);
  if (!message) {
    return {
      triggered: false,
      reason: 'Message is empty.',
      workspaceRoot: context.workspaceRoot,
      projectPath: context.projectPath
    };
  }

  const meta = await workspaceMeta(context.workspaceRoot);
  const intent = detectChatAutomationIntent(message, {
    scopeLevelDefault: meta.defaults.scopeLevelDefault || DEFAULT_SCOPE_LEVEL,
    campaignPolicy: {
      policy: input.campaignPolicy,
      followupRuns: input.campaignFollowupRuns,
      pagesPerRun: input.campaignPagesPerRun,
      followupMode: input.campaignFollowupMode
    }
  });

  if (!intent) {
    return {
      triggered: false,
      reason: 'No runnable automation intent matched. Mention run/start plus a mode cue like deep audit, full system atlas, cleanup, performance, or contract sync.',
      workspaceRoot: context.workspaceRoot,
      projectPath: context.projectPath
    };
  }

  return {
    triggered: true,
    mode: intent.mode,
    modeLabel: intent.modeLabel,
    scopeLevel: intent.scopeLevel || (intent.mode.startsWith('full-system') ? 'full-system' : (meta.defaults.scopeLevelDefault || DEFAULT_SCOPE_LEVEL)),
    scope: intent.scope || '',
    scopeTargets: intent.scopeTargets || [],
    campaign: intent.campaign || null,
    hugeMission: Boolean(intent.mission?.hugeMission),
    workspaceRoot: context.workspaceRoot,
    projectPath: context.projectPath
  };
}

function modeMetaById(modeId) {
  return MODE_META.find((mode) => mode.id === modeId) || null;
}

function buildChatAutomationRunRequest({ intent, modeMeta, userMessage, defaults }) {
  const lines = [
    modeMeta?.starter || `Execute ${intent.modeLabel || intent.mode} for this project.`,
    '',
    'Compiled automation contract:',
    `- Scope level: ${intent.scopeLevel || defaults.scopeLevelDefault || DEFAULT_SCOPE_LEVEL}`,
    `- Scope: ${intent.scope || '[Not explicitly specified]'}`,
    `- Scope targets: ${intent.scopeTargets?.length ? intent.scopeTargets.join(', ') : '[Not explicitly specified]'}`,
    '- Keep atlas, maps, and audit files synchronized with any implementation changes.'
  ];

  if (intent.campaign?.enabled) {
    const pagesPerRun = intent.campaign.pagesPerRun || DEFAULT_CAMPAIGN_PAGES_PER_RUN;
    lines.push(
      '',
      'Large-task campaign contract (mandatory):',
      '- Treat this as a multi-run execution campaign, not a one-shot rewrite.',
      `- This run must complete one bounded implementation batch (target <= ${pagesPerRun} pages or one backend domain).`,
      '- Keep frontend and backend contracts synchronized for touched flows.',
      '- Update BUG_BACKLOG with completed items, deferred items, and the exact next batch recommendation.',
      '- Include concrete verification commands and outcomes in RUN_SUMMARY for every batch.',
      '- Do not claim full completion unless the backlog for this scope is explicitly clear.'
    );
  }

  lines.push('', `Original user request: ${sanitizeChatText(userMessage)}`);
  return lines.join('\n');
}

async function runChatAutomation(thread, userMessage, options = {}) {
  const meta = await workspaceMeta(thread.workspaceRoot);
  const intent = detectChatAutomationIntent(userMessage, {
    scopeLevelDefault: meta.defaults.scopeLevelDefault || DEFAULT_SCOPE_LEVEL,
    campaignPolicy: {
      policy: options.campaignPolicy,
      followupRuns: options.campaignFollowupRuns,
      pagesPerRun: options.campaignPagesPerRun,
      followupMode: options.campaignFollowupMode
    }
  });
  if (!intent) {
    return { triggered: false };
  }

  const modeMeta = modeMetaById(intent.mode);
  const runRequest = buildChatAutomationRunRequest({
    intent,
    modeMeta,
    userMessage,
    defaults: meta.defaults
  });

  const selectedModel = String(options.model || thread.model || meta.defaults.model || '').trim() || 'gpt-5.4';
  const selectedEffort = normalizeChatEffort(options.effort || thread.effort);
  const selectedMaxCycles = intent.campaign?.enabled ? 16 : 12;

  const startRunPayload = {
    workspaceRoot: thread.workspaceRoot,
    projectPath: thread.projectPath || meta.defaults.projectPath,
    mode: intent.mode,
    scope: intent.scope || '',
    scopeLevel: intent.scopeLevel || (intent.mode.startsWith('full-system')
      ? 'full-system'
      : (meta.defaults.scopeLevelDefault || DEFAULT_SCOPE_LEVEL)),
    scopeTargets: intent.scopeTargets?.length ? intent.scopeTargets.join(',') : '',
    devIgnore: String(meta.defaults.devIgnore || DEFAULT_DEV_IGNORE_PATTERNS.join(',')),
    requiredAtlasDocs: String(meta.defaults.requiredAtlasDocsCsv || ''),
    projectSurfaces: String(meta.defaults.projectSurfacesJson || '[]'),
    fullSystemRequiredDocs: meta.defaults.fullSystemRequiredDocs !== false,
    designGuides: String(meta.defaults.designGuides || ''),
    references: String(meta.defaults.blueprintSources || ''),
    request: runRequest,
    globalRules: meta.defaults.globalRules || DEFAULT_GLOBAL_RULES
  };

  const configFile = configPathForWorkspace(thread.workspaceRoot);
  if (!(await exists(configFile))) {
    const initResult = await runCommand(buildInitWorkspaceArgs({
      workspaceRoot: thread.workspaceRoot,
      projectPath: thread.projectPath || meta.defaults.projectPath,
      designGuides: String(meta.defaults.designGuides || ''),
      blueprintSources: String(meta.defaults.blueprintSources || ''),
      projectSurfaces: String(meta.defaults.projectSurfacesJson || '[]'),
      devIgnore: String(meta.defaults.devIgnore || DEFAULT_DEV_IGNORE_PATTERNS.join(',')),
      scopeLevelDefault: meta.defaults.scopeLevelDefault || DEFAULT_SCOPE_LEVEL,
      fullSystemRequiredDocs: meta.defaults.fullSystemRequiredDocs !== false
    }));
    if (initResult.code !== 0) {
      return {
        triggered: true,
        ok: false,
        mode: intent.mode,
        modeLabel: intent.modeLabel,
        message: initResult.stderr || initResult.stdout || 'Failed to initialize workspace for chat automation.'
      };
    }
    await updateWorkspaceSettings(thread.workspaceRoot, {
      projectPath: thread.projectPath || meta.defaults.projectPath,
      designGuides: String(meta.defaults.designGuides || ''),
      blueprintSources: String(meta.defaults.blueprintSources || ''),
      projectSurfaces: String(meta.defaults.projectSurfacesJson || '[]'),
      devIgnore: String(meta.defaults.devIgnore || DEFAULT_DEV_IGNORE_PATTERNS.join(',')),
      scopeLevelDefault: meta.defaults.scopeLevelDefault || DEFAULT_SCOPE_LEVEL,
      fullSystemRequiredDocs: meta.defaults.fullSystemRequiredDocs !== false,
      requiredAtlasDocs: String(meta.defaults.requiredAtlasDocsCsv || ''),
      codexProfile: String(meta.defaults.codexProfile || ''),
      codexSearchEnabled: Boolean(meta.defaults.codexSearchEnabled),
      codexExtraAddDirs: String(meta.defaults.codexExtraAddDirsCsv || ''),
      codexConfigOverrides: String(meta.defaults.codexConfigOverridesText || ''),
      codexAutoAddRelatedRepos: Boolean(meta.defaults.codexAutoAddRelatedRepos),
      codexUseExperimentalMultiAgent: Boolean(meta.defaults.codexUseExperimentalMultiAgent),
      globalRules: meta.defaults.globalRules || DEFAULT_GLOBAL_RULES
    });
  }

  const runResult = await runCommand(buildProjectBotArgs(startRunPayload));
  if (runResult.code !== 0) {
    return {
      triggered: true,
      ok: false,
      mode: intent.mode,
      modeLabel: intent.modeLabel,
      message: runResult.stderr || runResult.stdout || 'Unable to start automation run.'
    };
  }

  const latestRun = await readLatestRun(thread.workspaceRoot);
  if (!latestRun) {
    return {
      triggered: true,
      ok: false,
      mode: intent.mode,
      modeLabel: intent.modeLabel,
      message: 'Run was created but no latest run path was found.'
    };
  }

  let autopilotInfo = null;
  try {
    autopilotInfo = {
      ok: true,
      started: true,
      ...(await startAutopilot({
        workspaceRoot: thread.workspaceRoot,
        runDir: latestRun,
        model: selectedModel,
        effort: selectedEffort,
        maxCycles: selectedMaxCycles,
        quiet: true
      }))
    };
  } catch (error) {
    const details = error?.message || String(error);
    const alreadyRunning = /already running/i.test(details);
    autopilotInfo = {
      ok: alreadyRunning,
      started: false,
      warning: details
    };
  }

  let campaignInfo = null;
  if (autopilotInfo?.ok && autopilotInfo?.started && intent.campaign?.enabled) {
    campaignInfo = startAutomationCampaign({
      workspaceRoot: thread.workspaceRoot,
      projectPath: thread.projectPath || meta.defaults.projectPath,
      currentRunDir: latestRun,
      scope: startRunPayload.scope,
      scopeLevel: startRunPayload.scopeLevel,
      scopeTargets: intent.scopeTargets || [],
      objective: sanitizeChatText(userMessage),
      model: selectedModel,
      effort: selectedEffort,
      maxCycles: selectedMaxCycles,
      quiet: true,
      profile: String(meta.defaults.codexProfile || ''),
      search: Boolean(meta.defaults.codexSearchEnabled),
      addDirs: String(meta.defaults.codexExtraAddDirsCsv || ''),
      configOverrides: String(meta.defaults.codexConfigOverridesText || ''),
      useExperimentalMultiAgent: Boolean(meta.defaults.codexUseExperimentalMultiAgent),
      followupMode: intent.campaign.followupMode || 'fix-backlog',
      followupRuns: intent.campaign.followupRuns || DEFAULT_CAMPAIGN_FOLLOWUP_RUNS,
      pagesPerRun: intent.campaign.pagesPerRun || DEFAULT_CAMPAIGN_PAGES_PER_RUN
    });
  }

  return {
    triggered: true,
    ok: Boolean(autopilotInfo?.ok),
    mode: intent.mode,
    modeLabel: intent.modeLabel,
    scopeLevel: startRunPayload.scopeLevel,
    scope: startRunPayload.scope,
    scopeTargets: intent.scopeTargets || [],
    runDir: latestRun,
    autopilot: autopilotInfo,
    campaign: campaignInfo,
    message: autopilotInfo?.ok
      ? 'Automation run created and autopilot started.'
      : (autopilotInfo?.warning || 'Automation run created, but autopilot did not start.')
  };
}

function randomCampaignId() {
  return `campaign-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function buildCampaignFollowupRequest(campaign) {
  const nextBatch = campaign.followupRunsCompleted + 2;
  const pagesPerRun = clampInteger(
    campaign.pagesPerRun ?? DEFAULT_CAMPAIGN_PAGES_PER_RUN,
    MIN_CAMPAIGN_PAGES_PER_RUN,
    MAX_CAMPAIGN_PAGES_PER_RUN
  );
  const lines = [
    'Continue the large enhancement campaign in one bounded batch.',
    '',
    `Campaign objective: ${campaign.objective || 'Large project enhancement campaign'}`,
    `Campaign ID: ${campaign.id}`,
    `Batch index: ${nextBatch}`,
    `Previous run: ${campaign.currentRunDir}`,
    '',
    'Follow-up contract:',
    '- Read BUG_BACKLOG and atlas docs first.',
    `- Implement only one bounded batch (target <= ${pagesPerRun} pages or one backend domain).`,
    '- Keep frontend/backend contracts synchronized for touched flows.',
    '- Mark completed/deferred items in BUG_BACKLOG and name the next recommended batch.',
    '- Refresh atlas docs and append verification evidence in RUN_SUMMARY.',
    '- If backlog in this scope is already clear, produce verification-only summary and stop without unrelated edits.'
  ];

  if (campaign.scope) {
    lines.push('', `Scope override: ${campaign.scope}`);
  }
  if (Array.isArray(campaign.scopeTargets) && campaign.scopeTargets.length) {
    lines.push(`Scope targets: ${campaign.scopeTargets.join(', ')}`);
  }
  return lines.join('\n');
}

function finishAutomationCampaign(campaign, status, errorMessage = '') {
  if (!campaign) return;
  campaign.status = status;
  campaign.lastError = String(errorMessage || '').trim();
  campaign.updatedAt = new Date().toISOString();
  if (campaign.pollTimer) {
    clearTimeout(campaign.pollTimer);
    campaign.pollTimer = null;
  }
  setTimeout(() => {
    const current = activeCampaigns.get(campaign.id);
    if (current && current.status === status && current.updatedAt === campaign.updatedAt) {
      activeCampaigns.delete(campaign.id);
    }
  }, 24 * 60 * 60 * 1000);
}

function scheduleAutomationCampaignPoll(campaignId, delayMs = CAMPAIGN_POLL_INTERVAL_MS) {
  const campaign = activeCampaigns.get(campaignId);
  if (!campaign || campaign.status !== 'running') return;
  if (campaign.pollTimer) {
    clearTimeout(campaign.pollTimer);
  }
  campaign.pollTimer = setTimeout(() => {
    advanceAutomationCampaign(campaignId)
      .catch((error) => {
        const current = activeCampaigns.get(campaignId);
        if (!current) return;
        finishAutomationCampaign(current, 'failed', error?.message || String(error));
      });
  }, Math.max(4000, Number(delayMs) || CAMPAIGN_POLL_INTERVAL_MS));
}

async function advanceAutomationCampaign(campaignId) {
  const campaign = activeCampaigns.get(campaignId);
  if (!campaign || campaign.status !== 'running') return;
  if (campaign.processing) return;

  campaign.processing = true;
  campaign.updatedAt = new Date().toISOString();

  try {
    const processInfo = activeRuns.get(campaign.currentRunDir);
    if (processInfo?.child) {
      return;
    }

    const snapshot = await runSnapshot(campaign.currentRunDir);
    const exitCode = snapshot?.autopilot?.lastExitCode;
    if (exitCode !== null && Number(exitCode) !== 0) {
      finishAutomationCampaign(
        campaign,
        'failed',
        snapshot?.autopilot?.failureReason || `Autopilot exited with code ${exitCode}.`
      );
      return;
    }

    if (!snapshot?.health?.done) {
      finishAutomationCampaign(
        campaign,
        'blocked',
        'Latest run stopped before all phases were completed. Campaign auto-continuation paused.'
      );
      return;
    }

    if (campaign.followupRunsRemaining <= 0) {
      finishAutomationCampaign(campaign, 'completed');
      return;
    }

    const meta = await workspaceMeta(campaign.workspaceRoot);
    const startRunPayload = {
      workspaceRoot: campaign.workspaceRoot,
      projectPath: campaign.projectPath || meta.defaults.projectPath,
      mode: campaign.followupMode || 'fix-backlog',
      scope: campaign.scope || '',
      scopeLevel: campaign.scopeLevel || meta.defaults.scopeLevelDefault || DEFAULT_SCOPE_LEVEL,
      scopeTargets: campaign.scopeTargets?.length ? campaign.scopeTargets.join(',') : '',
      devIgnore: String(meta.defaults.devIgnore || DEFAULT_DEV_IGNORE_PATTERNS.join(',')),
      requiredAtlasDocs: String(meta.defaults.requiredAtlasDocsCsv || ''),
      projectSurfaces: String(meta.defaults.projectSurfacesJson || '[]'),
      fullSystemRequiredDocs: meta.defaults.fullSystemRequiredDocs !== false,
      designGuides: String(meta.defaults.designGuides || ''),
      references: String(meta.defaults.blueprintSources || ''),
      request: buildCampaignFollowupRequest(campaign),
      globalRules: meta.defaults.globalRules || DEFAULT_GLOBAL_RULES
    };

    const runResult = await runCommand(buildProjectBotArgs(startRunPayload));
    if (runResult.code !== 0) {
      finishAutomationCampaign(
        campaign,
        'failed',
        runResult.stderr || runResult.stdout || 'Unable to create campaign follow-up run.'
      );
      return;
    }

    const latestRun = await readLatestRun(campaign.workspaceRoot);
    if (!latestRun) {
      finishAutomationCampaign(campaign, 'failed', 'Follow-up run was created but LATEST_RUN could not be resolved.');
      return;
    }

    try {
      await startAutopilot({
        workspaceRoot: campaign.workspaceRoot,
        runDir: latestRun,
        model: campaign.model,
        effort: campaign.effort,
        maxCycles: campaign.maxCycles,
        quiet: campaign.quiet,
        profile: campaign.profile,
        search: campaign.search,
        addDirs: campaign.addDirs,
        configOverrides: campaign.configOverrides.join('\n'),
        useExperimentalMultiAgent: campaign.useExperimentalMultiAgent
      });
    } catch (error) {
      finishAutomationCampaign(campaign, 'failed', error?.message || String(error));
      return;
    }

    campaign.currentRunDir = path.resolve(latestRun);
    campaign.followupRunsRemaining -= 1;
    campaign.followupRunsCompleted += 1;
    campaign.history.push(campaign.currentRunDir);
    campaign.updatedAt = new Date().toISOString();
  } finally {
    const current = activeCampaigns.get(campaignId);
    if (!current) return;
    current.processing = false;
    if (current.status === 'running') {
      scheduleAutomationCampaignPoll(campaignId, CAMPAIGN_POLL_INTERVAL_MS);
    }
  }
}

function startAutomationCampaign(input = {}) {
  const followupRuns = clampInteger(
    input.followupRuns ?? DEFAULT_CAMPAIGN_FOLLOWUP_RUNS,
    1,
    MAX_CAMPAIGN_FOLLOWUP_RUNS
  );
  const pagesPerRun = clampInteger(
    input.pagesPerRun ?? DEFAULT_CAMPAIGN_PAGES_PER_RUN,
    MIN_CAMPAIGN_PAGES_PER_RUN,
    MAX_CAMPAIGN_PAGES_PER_RUN
  );
  const campaign = {
    id: randomCampaignId(),
    status: 'running',
    workspaceRoot: path.resolve(String(input.workspaceRoot || DEFAULT_AGENT_WORKSPACE_ROOT)),
    projectPath: path.resolve(String(input.projectPath || DEFAULT_PROJECT_PATH)),
    currentRunDir: path.resolve(String(input.currentRunDir || '')),
    scope: String(input.scope || '').trim(),
    scopeLevel: normalizeScopeLevel(input.scopeLevel, DEFAULT_SCOPE_LEVEL),
    scopeTargets: Array.isArray(input.scopeTargets) ? uniqueStrings(input.scopeTargets).slice(0, 16) : [],
    objective: sanitizeChatText(input.objective || ''),
    model: String(input.model || '').trim(),
    effort: normalizeChatEffort(input.effort),
    maxCycles: clampInteger(input.maxCycles ?? 12, 1, 40),
    quiet: input.quiet !== false,
    profile: String(input.profile || '').trim(),
    search: toBoolean(input.search),
    addDirs: parseStringList(input.addDirs),
    configOverrides: parseLineList(input.configOverrides),
    useExperimentalMultiAgent: toBoolean(input.useExperimentalMultiAgent),
    followupMode: normalizeCampaignFollowupMode(input.followupMode),
    pagesPerRun,
    followupRunsPlanned: followupRuns,
    followupRunsRemaining: followupRuns,
    followupRunsCompleted: 0,
    history: [path.resolve(String(input.currentRunDir || ''))],
    pollTimer: null,
    processing: false,
    lastError: '',
    startedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  activeCampaigns.set(campaign.id, campaign);
  scheduleAutomationCampaignPoll(campaign.id, CAMPAIGN_POLL_INTERVAL_MS);

  return {
    id: campaign.id,
    enabled: true,
    followupMode: campaign.followupMode,
    pagesPerRun: campaign.pagesPerRun,
    followupRunsPlanned: campaign.followupRunsPlanned,
    followupRunsRemaining: campaign.followupRunsRemaining
  };
}

function buildChatAutomationReply(result) {
  if (!result?.triggered) return '';
  if (!result.ok) {
    return `I tried to run ${result.modeLabel || result.mode}, but it failed.\n\nDetails: ${result.message || 'Unknown error.'}`;
  }

  const lines = [
    `Automation started: ${result.modeLabel || result.mode}`,
    `Run: ${result.runDir || 'Unknown run path'}`,
    `Scope Level: ${result.scopeLevel || 'default'}`,
    `Scope: ${result.scope || 'Not specified'}`
  ];
  if (Array.isArray(result.scopeTargets) && result.scopeTargets.length) {
    lines.push(`Scope Targets: ${result.scopeTargets.join(', ')}`);
  }
  if (result.campaign?.enabled) {
    lines.push(`Campaign: Auto-follow-up enabled (${result.campaign.followupRunsPlanned} additional runs planned).`);
    lines.push(`Campaign ID: ${result.campaign.id}`);
    lines.push(`Follow-up mode: ${result.campaign.followupMode}`);
    if (result.campaign.pagesPerRun) {
      lines.push(`Pages per run target: ${result.campaign.pagesPerRun}`);
    }
  }
  if (result.autopilot?.pid) {
    lines.push(`Autopilot PID: ${result.autopilot.pid}`);
  }
  if (result.autopilot?.warning) {
    lines.push(`Note: ${result.autopilot.warning}`);
  }
  lines.push('Open Dashboard to monitor progress, logs, next prompt, and summary.');
  return lines.join('\n');
}

function buildChatPrompt(thread, userMessage) {
  const recent = (Array.isArray(thread.messages) ? thread.messages : [])
    .slice(-14)
    .map((entry) => {
      const role = String(entry.role || 'assistant').toUpperCase();
      return `${role}: ${entry.content || ''}`;
    })
    .join('\n\n');

  return [
    'You are the Codex Project Bot chat assistant inside a project automation GUI.',
    'Answer clearly with practical steps. Keep responses concise but complete.',
    'If the user asks about bot settings or automation behavior, explain in plain language.',
    `Workspace: ${thread.workspaceRoot || 'Unknown'}`,
    `Project: ${thread.projectPath || 'Unknown'}`,
    `Profile: ${thread.profileName || 'Current workspace context'}`,
    '',
    'Recent conversation:',
    recent || 'No prior conversation.',
    '',
    `User message:\n${sanitizeChatText(userMessage)}`,
    '',
    'Respond directly and avoid unnecessary fluff.'
  ].join('\n');
}

function trimAssistantResponse(text, max = 18000) {
  const clean = sanitizeCommandOutput(text || '');
  if (clean.length <= max) return clean;
  return `${clean.slice(0, max - 1)}…`;
}

async function runChatAssistantReply(thread, userMessage, options = {}) {
  const model = String(options.model || thread.model || '').trim() || 'gpt-5.4';
  const effort = normalizeChatEffort(options.effort || thread.effort);
  const prompt = buildChatPrompt(thread, userMessage);
  const chatWorkingDir = String(thread.projectPath || thread.workspaceRoot || '').trim();
  const result = await runCodexFromPayload({
    command: 'exec',
    model,
    timeoutMs: 90000,
    configOverrides: `model_reasoning_effort="${effort}"`,
    cd: chatWorkingDir,
    skipGitRepoCheck: true,
    prompt
  });

  const combined = [result.stdout, result.stderr].filter(Boolean).join('\n\n').trim();
  if (!combined) {
    return {
      text: result.ok
        ? 'No response content was returned by Codex.'
        : 'Codex did not return output for this message.',
      meta: { ok: result.ok, code: result.code, timedOut: result.timedOut }
    };
  }

  return {
    text: trimAssistantResponse(combined),
    meta: { ok: result.ok, code: result.code, timedOut: result.timedOut }
  };
}

async function exists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function readJson(filePath) {
  const raw = await fs.readFile(filePath, 'utf8');
  return JSON.parse(raw);
}

function sendJson(res, statusCode, payload) {
  const body = JSON.stringify(payload, null, 2);
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store'
  });
  res.end(body);
}

function sendText(res, statusCode, text, type = 'text/plain; charset=utf-8') {
  res.writeHead(statusCode, {
    'Content-Type': type,
    'Cache-Control': 'no-store'
  });
  res.end(text);
}

async function parseBody(req) {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(chunk);
  }
  const raw = Buffer.concat(chunks).toString('utf8').trim();
  if (!raw) {
    return {};
  }
  return JSON.parse(raw);
}

function sanitizeCommandOutput(text) {
  return String(text || '').replace(/\r/g, '').trim();
}

function runCommand(args, options = {}) {
  return new Promise((resolve) => {
    let finished = false;
    let timedOut = false;
    const child = spawn(args[0], args.slice(1), {
      cwd: options.cwd || __dirname,
      env: { ...process.env, ...(options.env || {}) },
      stdio: ['pipe', 'pipe', 'pipe']
    });

    let stdout = '';
    let stderr = '';
    let timeoutHandle = null;

    const finish = (code, extra = {}) => {
      if (finished) {
        return;
      }
      finished = true;
      if (timeoutHandle) {
        clearTimeout(timeoutHandle);
      }
      resolve({
        code: code ?? 0,
        stdout: sanitizeCommandOutput(stdout),
        stderr: sanitizeCommandOutput(stderr),
        timedOut,
        ...extra
      });
    };

    child.stdout.on('data', (chunk) => {
      stdout += chunk.toString('utf8');
    });

    child.stderr.on('data', (chunk) => {
      stderr += chunk.toString('utf8');
    });

    child.on('error', (error) => {
      stderr += `\n${error.message || String(error)}`;
      finish(1);
    });

    if (typeof options.stdinText === 'string') {
      child.stdin.write(options.stdinText);
    }
    child.stdin.end();

    if (Number(options.timeoutMs) > 0) {
      timeoutHandle = setTimeout(() => {
        timedOut = true;
        try {
          child.kill('SIGTERM');
        } catch {
          // Ignore kill errors and wait for close.
        }
      }, Number(options.timeoutMs));
    }

    child.on('close', (code) => {
      finish(code);
    });
  });
}

function buildProjectBotArgs(payload) {
  // Auto-append global rules to the request if they exist
  let request = payload.request || '';
  if (payload.globalRules && payload.globalRules.trim()) {
    request = `${request}\n\nGlobal Instructions (always apply):\n${payload.globalRules.trim()}`;
  }
  const args = ['node', PROJECT_BOT, 'start-run', '--root', payload.workspaceRoot, '--mode', payload.mode, '--request', request];
  if (payload.projectPath) args.push('--project', payload.projectPath);
  if (payload.scope) args.push('--scope', payload.scope);
  if (payload.scopeLevel) args.push('--scope-level', payload.scopeLevel);
  if (payload.scopeTargets) args.push('--scope-targets', payload.scopeTargets);
  if (payload.requiredAtlasDocs) args.push('--required-atlas-docs', payload.requiredAtlasDocs);
  if (payload.devIgnore) args.push('--dev-ignore', payload.devIgnore);
  if (payload.projectSurfaces) args.push('--project-surfaces', payload.projectSurfaces);
  if (payload.fullSystemRequiredDocs !== undefined) args.push('--full-system-required-docs', String(payload.fullSystemRequiredDocs));
  if (payload.designGuides) args.push('--design-guides', payload.designGuides);
  if (payload.references) args.push('--references', payload.references);
  // Always force external docs
  args.push('--force-external-docs');
  return args;
}

function latestRunPathForWorkspace(workspaceRoot) {
  return path.join(path.resolve(workspaceRoot), 'docs', 'project-bot', 'LATEST_RUN.txt');
}

function configPathForWorkspace(workspaceRoot) {
  return path.join(path.resolve(workspaceRoot), 'docs', 'project-bot', 'config.json');
}

function runsDirForWorkspace(workspaceRoot) {
  return path.join(path.resolve(workspaceRoot), 'docs', 'project-bot', 'runs');
}

function projectBotRootForWorkspace(workspaceRoot) {
  return path.join(path.resolve(workspaceRoot), 'docs', 'project-bot');
}

async function writeJson(filePath, value) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

function buildInitWorkspaceArgs(payload) {
  const args = ['node', PROJECT_BOT, 'init-workspace', '--root', payload.workspaceRoot, '--project', payload.projectPath || DEFAULT_PROJECT_PATH];
  if (payload.designGuides) args.push('--design-guides', payload.designGuides);
  if (payload.blueprintSources) args.push('--blueprint-sources', payload.blueprintSources);
  if (payload.projectSurfaces) args.push('--project-surfaces', payload.projectSurfaces);
  if (payload.devIgnore) args.push('--dev-ignore', payload.devIgnore);
  if (payload.scopeLevelDefault) args.push('--scope-level-default', payload.scopeLevelDefault);
  if (payload.fullSystemRequiredDocs !== undefined) args.push('--full-system-required-docs', String(payload.fullSystemRequiredDocs));
  // Always force external docs
  args.push('--force-external-docs');
  return args;
}

function remapWorkspaceDocPath(filePath, sourceWorkspaceRoot, targetWorkspaceRoot) {
  const resolved = path.resolve(String(filePath || ''));
  const sourceDocsRoot = path.join(path.resolve(sourceWorkspaceRoot), 'docs');
  const targetDocsRoot = path.join(path.resolve(targetWorkspaceRoot), 'docs');

  if (resolved === sourceDocsRoot || resolved.startsWith(`${sourceDocsRoot}${path.sep}`)) {
    return path.join(targetDocsRoot, path.relative(sourceDocsRoot, resolved));
  }
  return resolved;
}

async function listSavedWorkspaces() {
  const root = agentWorkspacesRoot();
  if (!(await exists(root))) {
    return [];
  }

  const entries = await fs.readdir(root, { withFileTypes: true });
  const workspaces = [];

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const workspaceRoot = path.join(root, entry.name);
    const configFile = configPathForWorkspace(workspaceRoot);
    if (!(await exists(configFile))) continue;

    const config = normalizeWorkspaceConfig(await readJson(configFile), workspaceRoot);
    const runsDir = runsDirForWorkspace(workspaceRoot);
    let runCount = 0;
    if (await exists(runsDir)) {
      const runEntries = await fs.readdir(runsDir, { withFileTypes: true });
      runCount = runEntries.filter((item) => item.isDirectory()).length;
    }

    workspaces.push({
      name: entry.name,
      workspaceRoot,
      projectPath: config.projectPath || '',
      scopeLevelDefault: config.scopeLevelDefault || DEFAULT_SCOPE_LEVEL,
      surfaceCount: Array.isArray(config.projectSurfaces) ? config.projectSurfaces.length : 0,
      runCount,
      forceExternalDocs: config.forceExternalDocs !== false
    });
  }

  workspaces.sort((left, right) => left.name.localeCompare(right.name));
  return workspaces;
}

async function readLatestRun(workspaceRoot) {
  const filePath = latestRunPathForWorkspace(workspaceRoot);
  if (!(await exists(filePath))) {
    return '';
  }
  return (await fs.readFile(filePath, 'utf8')).trim();
}

async function readLatestLog(runDir) {
  const logsRoot = path.join(runDir, 'logs');
  if (!(await exists(logsRoot))) {
    return { logPath: '', logTail: '' };
  }

  const entries = await fs.readdir(logsRoot, { withFileTypes: true });
  const folders = entries.filter((entry) => entry.isDirectory()).map((entry) => path.join(logsRoot, entry.name));
  if (!folders.length) {
    return { logPath: '', logTail: '' };
  }

  const stats = await Promise.all(folders.map(async (folder) => ({
    folder,
    stat: await fs.stat(folder)
  })));
  stats.sort((left, right) => right.stat.mtimeMs - left.stat.mtimeMs);
  const latestFolder = stats[0].folder;
  const files = await fs.readdir(latestFolder);
  const logFiles = files.filter((name) => /^stdout-\d+\.log$/.test(name));
  if (!logFiles.length) {
    return { logPath: '', logTail: '' };
  }

  logFiles.sort((a, b) => Number(b.match(/(\d+)/)[1]) - Number(a.match(/(\d+)/)[1]));
  const logPath = path.join(latestFolder, logFiles[0]);
  const content = await fs.readFile(logPath, 'utf8');
  return {
    logPath,
    logTail: content.split('\n').slice(-80).join('\n').trim()
  };
}

function snapshotAutopilot(runDir) {
  const processInfo = activeRuns.get(runDir) || null;
  return {
    active: Boolean(processInfo?.child),
    pid: processInfo?.pid || null,
    startedAt: processInfo?.startedAt || null,
    lastExitCode: processInfo?.lastExitCode ?? null,
    consoleTail: sanitizeCommandOutput(`${processInfo?.stdout || ''}\n${processInfo?.stderr || ''}`).split('\n').slice(-40).join('\n').trim()
  };
}

function inferAutopilotFailure(logTail, health, autopilot) {
  if (autopilot?.active) return '';
  if (health?.done) return '';

  const text = String(logTail || '').trim();
  if (!text) return '';

  const failureHints = [
    /not inside a trusted directory/i,
    /skip-git-repo-check/i,
    /unable to find codex cli/i,
    /missing orchestration files/i,
    /phase cursor did not advance/i,
    /permission denied/i,
    /error:/i,
    /\bfailed\b/i
  ];
  if (!failureHints.some((pattern) => pattern.test(text))) return '';

  const lines = text.split('\n').map((line) => line.trim()).filter(Boolean);
  return lines.slice(-3).join('\n');
}

function withInferredAutopilotStatus(autopilot, health, logTail) {
  const failureReason = inferAutopilotFailure(logTail, health, autopilot);
  return {
    ...autopilot,
    lastExitCode: autopilot.lastExitCode ?? (failureReason ? 1 : null),
    failureReason
  };
}

function buildHealthSummary(state) {
  const phases = state?.phases || [];
  const total = phases.length;
  const completed = phases.filter((phase) => phase.status === 'completed').length;
  const next = phases.find((phase) => phase.status !== 'completed');
  return {
    total,
    completed,
    remaining: Math.max(total - completed, 0),
    nextPhase: next ? { id: next.id, title: next.title } : null,
    done: Boolean(!next && total > 0)
  };
}

async function runSnapshot(runDir) {
  const resolvedRunDir = path.resolve(runDir);
  const stateFile = path.join(resolvedRunDir, 'state.json');
  const summaryFile = path.join(resolvedRunDir, 'RUN_SUMMARY.md');
  const nextPromptFile = path.join(resolvedRunDir, 'NEXT_PROMPT.md');

  if (!(await exists(stateFile))) {
    throw new Error(`Run not found: ${resolvedRunDir}`);
  }

  const state = await readJson(stateFile);
  const health = buildHealthSummary(state);
  const runSummary = (await exists(summaryFile)) ? await fs.readFile(summaryFile, 'utf8') : '';
  const nextPrompt = (await exists(nextPromptFile)) ? await fs.readFile(nextPromptFile, 'utf8') : '';
  const { logPath, logTail } = await readLatestLog(resolvedRunDir);
  const autopilot = withInferredAutopilotStatus(snapshotAutopilot(resolvedRunDir), health, logTail);

  return {
    runDir: resolvedRunDir,
    state,
    health,
    runSummary,
    nextPrompt,
    logPath,
    logTail,
    autopilot
  };
}

async function readRunCard(runDir) {
  const resolvedRunDir = path.resolve(runDir);
  const stateFile = path.join(resolvedRunDir, 'state.json');
  if (!(await exists(stateFile))) {
    return null;
  }

  const state = await readJson(stateFile);
  const health = buildHealthSummary(state);
  const stats = await fs.stat(stateFile);
  const { logTail } = await readLatestLog(resolvedRunDir);
  const autopilot = withInferredAutopilotStatus(snapshotAutopilot(resolvedRunDir), health, logTail);
  return {
    runDir: resolvedRunDir,
    mode: state.mode,
    targetProject: state.projectPath,
    updatedAt: state.updatedAt || stats.mtime.toISOString(),
    completed: health.completed,
    total: health.total,
    nextPhase: health.nextPhase,
    done: health.done,
    active: autopilot.active,
    lastExitCode: autopilot.lastExitCode,
    failureReason: autopilot.failureReason || ''
  };
}

function summarizeMarkdown(text) {
  return String(text || '')
    .replace(/^#+\s*/gm, '')
    .replace(/`/g, '')
    .replace(/\r/g, '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function snippet(text, maxLength = 220) {
  const clean = summarizeMarkdown(text);
  if (!clean) return 'No summary written yet.';
  if (clean.length <= maxLength) return clean;
  return `${clean.slice(0, maxLength - 1).trim()}…`;
}

async function readRunSummaryCard(runDir) {
  const resolvedRunDir = path.resolve(runDir);
  const stateFile = path.join(resolvedRunDir, 'state.json');
  if (!(await exists(stateFile))) {
    return null;
  }

  const state = await readJson(stateFile);
  const health = buildHealthSummary(state);
  const summaryFile = path.join(resolvedRunDir, 'RUN_SUMMARY.md');
  const summaryText = (await exists(summaryFile)) ? await fs.readFile(summaryFile, 'utf8') : '';
  const stats = await fs.stat(stateFile);
  return {
    runDir: resolvedRunDir,
    mode: state.mode,
    updatedAt: state.updatedAt || stats.mtime.toISOString(),
    done: health.done,
    completed: health.completed,
    total: health.total,
    preview: snippet(summaryText)
  };
}

async function listRecentRuns(workspaceRoot, limit = 12) {
  const runsDir = runsDirForWorkspace(workspaceRoot);
  if (!(await exists(runsDir))) {
    return [];
  }

  const entries = await fs.readdir(runsDir, { withFileTypes: true });
  const directories = entries.filter((entry) => entry.isDirectory()).map((entry) => path.join(runsDir, entry.name));
  const cards = [];

  for (const directory of directories) {
    const card = await readRunCard(directory);
    if (card) {
      cards.push(card);
    }
  }

  cards.sort((left, right) => Date.parse(right.updatedAt) - Date.parse(left.updatedAt));
  return cards.slice(0, limit);
}

async function listRecentSummaries(workspaceRoot, limit = 8) {
  const runsDir = runsDirForWorkspace(workspaceRoot);
  if (!(await exists(runsDir))) {
    return [];
  }

  const entries = await fs.readdir(runsDir, { withFileTypes: true });
  const directories = entries.filter((entry) => entry.isDirectory()).map((entry) => path.join(runsDir, entry.name));
  const cards = [];

  for (const directory of directories) {
    const card = await readRunSummaryCard(directory);
    if (card) {
      cards.push(card);
    }
  }

  cards.sort((left, right) => Date.parse(right.updatedAt) - Date.parse(left.updatedAt));
  return cards.slice(0, limit);
}

function normalizeRunFingerprintText(value, maxLength = 260) {
  return String(value || '')
    .toLowerCase()
    .replace(/\r/g, '')
    .replace(/\s+/g, ' ')
    .replace(/[^a-z0-9/_:.\-\s]/g, '')
    .trim()
    .slice(0, maxLength);
}

function buildRunFingerprint(state = {}) {
  const scopeTargets = Array.isArray(state.scopeTargets)
    ? state.scopeTargets.map((value) => normalizeRunFingerprintText(value, 72)).filter(Boolean).join('|')
    : normalizeRunFingerprintText(state.scopeTargets || '', 160);
  return [
    normalizeRunFingerprintText(state.mode || '', 72),
    normalizeRunFingerprintText(state.projectPath || '', 180),
    normalizeRunFingerprintText(state.scopeLevel || '', 48),
    normalizeRunFingerprintText(state.scope || '', 180),
    scopeTargets,
    normalizeRunFingerprintText(state.request || '', 280)
  ].join('::');
}

async function cleanupDuplicateRuns(workspaceRoot, options = {}) {
  const resolvedRoot = path.resolve(workspaceRoot || DEFAULT_AGENT_WORKSPACE_ROOT);
  const runsDir = runsDirForWorkspace(resolvedRoot);
  const dryRun = toBoolean(options?.dryRun);
  if (!(await exists(runsDir))) {
    return {
      workspaceRoot: resolvedRoot,
      dryRun,
      removedCount: 0,
      removedRuns: [],
      keptCount: 0,
      keptRuns: []
    };
  }

  const entries = await fs.readdir(runsDir, { withFileTypes: true });
  const candidates = [];
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const runDir = path.join(runsDir, entry.name);
    const stateFile = path.join(runDir, 'state.json');
    if (!(await exists(stateFile))) continue;
    try {
      const state = await readJson(stateFile);
      const health = buildHealthSummary(state);
      const stats = await fs.stat(stateFile);
      candidates.push({
        runDir,
        updatedAt: Date.parse(state.updatedAt || stats.mtime.toISOString()) || 0,
        fingerprint: buildRunFingerprint(state),
        active: Boolean(snapshotAutopilot(runDir).active),
        done: Boolean(health.done)
      });
    } catch {
      // Ignore unreadable run entries and preserve them.
    }
  }

  candidates.sort((left, right) => right.updatedAt - left.updatedAt);
  const keepByFingerprint = new Map();
  const keptRuns = [];
  const removedRuns = [];

  for (const entry of candidates) {
    const key = entry.fingerprint || entry.runDir;
    if (!keepByFingerprint.has(key)) {
      keepByFingerprint.set(key, entry);
      keptRuns.push(entry.runDir);
      continue;
    }
    if (entry.active || !entry.done) {
      keptRuns.push(entry.runDir);
      continue;
    }
    removedRuns.push(entry.runDir);
  }

  if (!dryRun) {
    for (const runDir of removedRuns) {
      await fs.rm(runDir, { recursive: true, force: true });
      activeRuns.delete(runDir);
    }

    const latestFile = latestRunPathForWorkspace(resolvedRoot);
    if (await exists(latestFile)) {
      const latestValue = (await fs.readFile(latestFile, 'utf8')).trim();
      const removedLatest = removedRuns.some((runDir) => path.resolve(runDir) === path.resolve(latestValue || ''));
      if (removedLatest) {
        const fallbackLatest = candidates
          .filter((entry) => !removedRuns.includes(entry.runDir))
          .sort((left, right) => right.updatedAt - left.updatedAt)[0];
        await fs.writeFile(latestFile, `${fallbackLatest?.runDir || ''}\n`, 'utf8');
      }
    }
  }

  return {
    workspaceRoot: resolvedRoot,
    dryRun,
    removedCount: removedRuns.length,
    removedRuns,
    keptCount: keptRuns.length,
    keptRuns
  };
}

function teamsDirForWorkspace(workspaceRoot) {
  return path.join(projectBotRootForWorkspace(workspaceRoot), 'teams');
}

function teamManifestPath(workspaceRoot, teamId) {
  return path.join(teamsDirForWorkspace(workspaceRoot), String(teamId || '').trim(), 'manifest.json');
}

function teamReadmePath(workspaceRoot, teamId) {
  return path.join(teamsDirForWorkspace(workspaceRoot), String(teamId || '').trim(), 'README.md');
}

function teamCoordinatorKey(workspaceRoot, teamId) {
  return `${path.resolve(workspaceRoot || DEFAULT_AGENT_WORKSPACE_ROOT)}::${String(teamId || '').trim()}`;
}

function randomTeamId() {
  return `team-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function normalizeTeamName(value) {
  return String(value || '')
    .trim()
    .replace(/\s+/g, ' ')
    .slice(0, 96);
}

function defaultTeamName(projectPath, masterRequest) {
  const base = path.basename(String(projectPath || DEFAULT_PROJECT_PATH));
  const lower = String(masterRequest || '').toLowerCase();
  if (/\b(audit|scan|review)\b/.test(lower) && /\b(fix|implement|optimi[sz]e|improve)\b/.test(lower)) {
    return `${base} Audit and Fix Team`;
  }
  if (/\b(audit|scan|review)\b/.test(lower)) {
    return `${base} Audit Team`;
  }
  return `${base} Multi-Agent Team`;
}

function pathIsInside(parentPath, childPath) {
  const parent = path.resolve(String(parentPath || ''));
  const child = path.resolve(String(childPath || ''));
  if (!parent || !child) return false;
  const relative = path.relative(parent, child);
  return relative === '' || (!relative.startsWith('..') && !path.isAbsolute(relative));
}

function ownershipKeysOverlap(leftKeys = [], rightKeys = []) {
  for (const left of leftKeys) {
    const leftValue = String(left || '').trim();
    if (!leftValue) continue;
    for (const right of rightKeys) {
      const rightValue = String(right || '').trim();
      if (!rightValue) continue;
      if (leftValue === rightValue) return true;
      if (leftValue.startsWith('label:') || rightValue.startsWith('label:')) continue;
      if (pathIsInside(leftValue, rightValue) || pathIsInside(rightValue, leftValue)) {
        return true;
      }
    }
  }
  return false;
}

function teamHasFrontend(surfaces = []) {
  return surfaces.some((surface) => {
    const kind = normalizeScopeLevel(surface?.kind, 'panel-fullstack');
    return ['panel-fe', 'panel-fullstack', 'multi-panel-fe', 'multi-panel-fullstack', 'full-system'].includes(kind);
  });
}

function teamHasBackend(surfaces = []) {
  return surfaces.some((surface) => {
    const kind = normalizeScopeLevel(surface?.kind, 'panel-fullstack');
    return ['panel-be', 'panel-fullstack', 'multi-panel-fullstack', 'full-system'].includes(kind);
  });
}

function isFullRepoTeamRequest(text) {
  return /\b(full repo|full repository|repo audit|full audit|entire repo|entire project|whole repo|whole project|all files|all modules|project-wide|across the repo)\b/i
    .test(String(text || ''));
}

function inferTeamScopeLevel(masterRequest, surfaces, fallback = DEFAULT_SCOPE_LEVEL) {
  const inferred = inferScopeLevelFromChatMessage(masterRequest, fallback);
  if (!isFullRepoTeamRequest(masterRequest)) {
    return normalizeScopeLevel(inferred, fallback);
  }
  const hasFrontend = teamHasFrontend(surfaces);
  const hasBackend = teamHasBackend(surfaces);
  if (hasFrontend && hasBackend) return 'full-system';
  if (hasFrontend) return 'multi-panel-fe';
  if (hasBackend) return 'multi-panel-fullstack';
  return normalizeScopeLevel(inferred, fallback);
}

async function pathExistsAsDirectory(targetPath) {
  try {
    const stats = await fs.stat(targetPath);
    return stats.isDirectory();
  } catch {
    return false;
  }
}

function relativeTeamPathLabel(projectPath, targetPath) {
  const relative = path.relative(projectPath, targetPath);
  if (!relative || relative.startsWith('..') || path.isAbsolute(relative)) {
    return path.basename(targetPath);
  }
  return relative;
}

async function resolveExplicitTeamTargets(projectPath, scopeTargets = []) {
  const buckets = [];
  const seen = new Set();

  for (const [index, rawTarget] of scopeTargets.entries()) {
    const target = String(rawTarget || '').trim();
    if (!target) continue;

    let resolvedPath = '';
    if (/[\\/]/.test(target) || target.startsWith('.')) {
      const candidate = path.isAbsolute(target)
        ? path.resolve(target)
        : path.resolve(projectPath, target);
      if (await exists(candidate)) {
        resolvedPath = candidate;
      }
    }

    const ownershipKeys = resolvedPath ? [resolvedPath] : [`label:${target}`];
    const bucketId = `scope-${index + 1}`;
    const dedupeKey = ownershipKeys[0];
    if (seen.has(dedupeKey)) continue;
    seen.add(dedupeKey);

    buckets.push({
      id: bucketId,
      label: resolvedPath ? `Scoped Lane ${index + 1}` : `Target Lane ${index + 1}`,
      focus: target,
      role: 'Full Stack Developer',
      mode: 'fix-backlog',
      scope: resolvedPath || target,
      scopeLevel: resolvedPath ? 'module' : DEFAULT_SCOPE_LEVEL,
      scopeTargets: [target],
      ownershipPaths: resolvedPath ? [resolvedPath] : [],
      ownershipKeys
    });
  }

  return buckets;
}

async function discoverImplementationBuckets(projectPath, scopeTargets = [], surfaces = []) {
  const explicitBuckets = await resolveExplicitTeamTargets(projectPath, scopeTargets);
  if (explicitBuckets.length > 1) {
    return explicitBuckets.slice(0, MAX_TEAM_IMPLEMENTATION_BUCKETS);
  }

  const bucketDefinitions = [
    {
      id: 'pages-routes',
      label: 'Pages and Routes',
      focus: 'pages, routes, and feature modules',
      role: 'React / JavaScript Specialist',
      mode: 'fix-backlog',
      scopeLevel: 'panel-fe',
      candidates: ['src/app', 'src/pages', 'src/routes', 'src/features', 'src/modules', 'app', 'pages', 'routes', 'features', 'modules']
    },
    {
      id: 'shared-ui',
      label: 'Shared UI and Components',
      focus: 'shared UI components, layouts, and presentation logic',
      role: 'React / JavaScript Specialist',
      mode: 'fix-backlog',
      scopeLevel: 'panel-fe',
      candidates: ['src/components', 'src/layouts', 'src/containers', 'components', 'layouts', 'containers']
    },
    {
      id: 'state-data',
      label: 'State, Hooks, and Data',
      focus: 'hooks, state, client services, and utility flows',
      role: 'Full Stack Developer',
      mode: 'fix-backlog',
      scopeLevel: 'panel-fullstack',
      candidates: ['src/hooks', 'src/store', 'src/state', 'src/context', 'src/api', 'src/services', 'src/lib', 'src/utils', 'hooks', 'store', 'state', 'context', 'api', 'services', 'lib', 'utils']
    },
    {
      id: 'backend-api',
      label: 'Backend and API',
      focus: 'backend endpoints, services, and contract handling',
      role: 'Full Stack Developer',
      mode: 'backend-optimize',
      scopeLevel: 'panel-be',
      candidates: ['server', 'src/server', 'backend', 'src/backend', 'api', 'src/api', 'services', 'src/services']
    }
  ];

  const buckets = [];
  for (const definition of bucketDefinitions) {
    const ownershipPaths = [];
    for (const candidate of definition.candidates) {
      const absolute = path.join(projectPath, candidate);
      if (await pathExistsAsDirectory(absolute)) {
        ownershipPaths.push(absolute);
      }
    }
    const uniqueOwnershipPaths = uniqueStrings(ownershipPaths);
    if (!uniqueOwnershipPaths.length) continue;
    buckets.push({
      id: definition.id,
      label: definition.label,
      focus: definition.focus,
      role: definition.role,
      mode: definition.mode,
      scope: uniqueOwnershipPaths[0],
      scopeLevel: definition.scopeLevel,
      scopeTargets: uniqueOwnershipPaths.map((targetPath) => relativeTeamPathLabel(projectPath, targetPath)),
      ownershipPaths: uniqueOwnershipPaths,
      ownershipKeys: uniqueOwnershipPaths
    });
  }

  if (!buckets.length && Array.isArray(surfaces) && surfaces.length) {
    for (const [index, surface] of surfaces.slice(0, MAX_TEAM_IMPLEMENTATION_BUCKETS).entries()) {
      const surfacePath = path.resolve(String(surface.path || projectPath));
      buckets.push({
        id: String(surface.id || `surface-${index + 1}`).trim() || `surface-${index + 1}`,
        label: `${surface.label || `Surface ${index + 1}`} Lane`,
        focus: surface.label || relativeTeamPathLabel(projectPath, surfacePath),
        role: normalizeScopeLevel(surface.kind, 'panel-fullstack') === 'panel-be'
          ? 'Full Stack Developer'
          : 'React / JavaScript Specialist',
        mode: normalizeScopeLevel(surface.kind, 'panel-fullstack') === 'panel-be' ? 'backend-optimize' : 'fix-backlog',
        scope: surfacePath,
        scopeLevel: normalizeScopeLevel(surface.kind, DEFAULT_SCOPE_LEVEL),
        scopeTargets: [String(surface.id || relativeTeamPathLabel(projectPath, surfacePath)).trim()],
        ownershipPaths: [surfacePath],
        ownershipKeys: [surfacePath]
      });
    }
  }

  if (!buckets.length) {
    return [{
      id: 'project-root',
      label: 'Project Root Lane',
      focus: 'the whole repo scope',
      role: 'Full Stack Developer',
      mode: 'fix-backlog',
      scope: projectPath,
      scopeLevel: DEFAULT_SCOPE_LEVEL,
      scopeTargets: ['project-root'],
      ownershipPaths: [projectPath],
      ownershipKeys: [projectPath]
    }];
  }

  return buckets.slice(0, MAX_TEAM_IMPLEMENTATION_BUCKETS);
}

function createTeamAgent(input = {}) {
  return {
    id: String(input.id || '').trim(),
    title: String(input.title || '').trim(),
    role: String(input.role || '').trim() || 'Generalist Agent',
    phase: String(input.phase || '').trim() || 'implementation',
    lane: String(input.lane || input.title || '').trim(),
    summary: sanitizeChatText(input.summary || ''),
    mode: String(input.mode || '').trim() || 'fix-backlog',
    scope: String(input.scope || '').trim(),
    scopeLevel: normalizeScopeLevel(input.scopeLevel, DEFAULT_SCOPE_LEVEL),
    scopeTargets: uniqueStrings(input.scopeTargets || []).slice(0, 16),
    ownershipPaths: uniqueStrings(input.ownershipPaths || []).map((entry) => path.resolve(String(entry))),
    ownershipKeys: uniqueStrings(input.ownershipKeys || input.ownershipPaths || []).map((entry) => String(entry).trim()),
    reportOnly: Boolean(input.reportOnly),
    mutatesCode: Boolean(input.mutatesCode),
    dependsOn: uniqueStrings(input.dependsOn || []),
    runDir: String(input.runDir || '').trim(),
    runRequest: sanitizeChatText(input.runRequest || ''),
    materializeError: sanitizeChatText(input.materializeError || '')
  };
}

function findTeamAgentTitle(agents = [], agentId = '') {
  return agents.find((agent) => agent.id === agentId)?.title || agentId;
}

function buildTeamAgentRequest(team, agent, agents) {
  const dependencyTitles = agent.dependsOn.map((dependencyId) => findTeamAgentTitle(agents, dependencyId));
  const ownershipText = agent.ownershipPaths.length
    ? agent.ownershipPaths.join(', ')
    : (agent.ownershipKeys.length ? agent.ownershipKeys.join(', ') : 'Global coordination only');
  const scopeTargetText = agent.scopeTargets.length ? agent.scopeTargets.join(', ') : '[Not specified]';
  const lines = [
    `Team mission: ${team.masterRequest}`,
    '',
    `You are the ${agent.role} in coordinated team "${team.name}".`,
    `Assigned lane: ${agent.lane || agent.title}`,
    `Primary objective: ${agent.summary || 'Execute the assigned lane carefully.'}`,
    `Execution phase: ${agent.phase}`,
    `Mode: ${agent.mode}`,
    `Scope level: ${agent.scopeLevel}`,
    `Scope: ${agent.scope || team.scope || team.projectPath}`,
    `Scope targets: ${scopeTargetText}`,
    '',
    'Team coordination contract:',
    '- Work only inside your assigned lane.',
    `- Ownership boundaries: ${ownershipText}`,
    agent.reportOnly
      ? '- This is a report-only run. Do not modify product code; workspace docs and reports are allowed.'
      : '- You may modify code only inside your ownership boundaries. Treat other lanes as read-only and create handoff notes instead of cross-lane edits.',
    '- Read atlas docs, QA reports, and BUG_BACKLOG before making major decisions.',
    '- If you discover issues outside your lane, document them clearly in RUN_SUMMARY or BUG_BACKLOG instead of implementing them here.',
    dependencyTitles.length
      ? `- Upstream dependencies that should already be complete: ${dependencyTitles.join(', ')}`
      : '- You are the first wave. Establish a clean foundation for downstream agents.'
  ];

  if (agent.phase === 'discovery') {
    lines.push(
      '',
      'Discovery contract:',
      '- Build or refresh the atlas needed for downstream work.',
      '- Define safe implementation boundaries in the run summary so later agents can avoid collisions.',
      '- Name the recommended lanes, major risks, and the highest-risk files or flows.'
    );
  }

  if (agent.phase === 'audit') {
    lines.push(
      '',
      'Audit contract:',
      '- Find loopholes, optimization issues, efficiency problems, dead code, threats, regressions, and anything clearly wrong.',
      '- Provide concrete, prioritized findings with file or module references when possible.',
      '- Update DEEP_SCAN_REPORT and BUG_BACKLOG with lane-aware findings and recommended fixes.'
    );
  }

  if (agent.phase === 'planning') {
    lines.push(
      '',
      'Planning contract:',
      '- Read all upstream reports first.',
      '- Convert the findings into implementation batches grouped by lane.',
      '- Make ownership explicit so downstream implementers do not overlap.'
    );
  }

  if (agent.phase === 'implementation') {
    lines.push(
      '',
      'Implementation contract:',
      '- Read the backlog and project-manager plan first.',
      '- Fix only the highest-value items assigned to this lane.',
      '- Verify the touched area and update BUG_BACKLOG with exact status changes and remaining follow-ups.',
      '- Avoid unrelated cleanup or architectural drift outside this lane.'
    );
  }

  if (agent.phase === 'verification') {
    lines.push(
      '',
      'Verification contract:',
      '- Recheck implementation lanes for regressions and missing coverage.',
      '- Tighten tests or validation where needed.',
      '- Fix only issues directly caused by the implementation wave and document evidence clearly.'
    );
  }

  if (agent.phase === 'wrap-up') {
    lines.push(
      '',
      'Wrap-up contract:',
      '- Summarize what the team completed, what remains, and the next recommended batch.',
      '- Keep the change journal concise and developer-actionable.'
    );
  }

  lines.push(
    '',
    'Original operator request:',
    team.masterRequest
  );

  return lines.join('\n');
}

function defaultTeamNotes(implementationBuckets = []) {
  const bucketLabels = implementationBuckets.map((bucket) => bucket.label);
  const notes = [
    'Report-only discovery and audit waves may run in parallel once the atlas wave finishes.',
    'Implementation lanes use distinct ownership paths when available to reduce collisions.'
  ];
  if (bucketLabels.length) {
    notes.push(`Planned implementation lanes: ${bucketLabels.join(', ')}`);
  }
  return notes;
}

function normalizeTeamManifest(team, workspaceRoot) {
  const resolvedWorkspaceRoot = path.resolve(String(workspaceRoot || team?.workspaceRoot || DEFAULT_AGENT_WORKSPACE_ROOT));
  const projectPath = path.resolve(String(team?.projectPath || DEFAULT_PROJECT_PATH));
  return {
    version: Number(team?.version) || TEAM_MANIFEST_VERSION,
    id: String(team?.id || '').trim(),
    name: normalizeTeamName(team?.name) || defaultTeamName(projectPath, team?.masterRequest),
    summary: sanitizeChatText(team?.summary || ''),
    workspaceRoot: resolvedWorkspaceRoot,
    projectPath,
    scope: String(team?.scope || '').trim() || projectPath,
    scopeLevel: normalizeScopeLevel(team?.scopeLevel, DEFAULT_SCOPE_LEVEL),
    scopeTargets: uniqueStrings(team?.scopeTargets || []).slice(0, 16),
    masterRequest: sanitizeChatText(team?.masterRequest || ''),
    notes: uniqueStrings(team?.notes || []),
    createdAt: String(team?.createdAt || '').trim(),
    updatedAt: String(team?.updatedAt || '').trim(),
    agents: Array.isArray(team?.agents) ? team.agents.map((agent) => createTeamAgent(agent)) : []
  };
}

function buildTeamReadme(team) {
  const lines = [
    `# ${team.name}`,
    '',
    `- Team ID: \`${team.id}\``,
    `- Workspace Root: \`${team.workspaceRoot}\``,
    `- Project Path: \`${team.projectPath}\``,
    `- Scope Level: \`${team.scopeLevel}\``,
    `- Scope: \`${team.scope}\``,
    `- Created At: ${team.createdAt || 'Unknown'}`,
    '',
    '## Master Request',
    '',
    team.masterRequest || 'No master request saved.',
    '',
    '## Notes',
    ''
  ];

  if (team.notes.length) {
    for (const note of team.notes) {
      lines.push(`- ${note}`);
    }
  } else {
    lines.push('- No notes.');
  }

  lines.push('', '## Agents', '');
  for (const agent of team.agents) {
    lines.push(`### ${agent.title}`);
    lines.push(`- Role: ${agent.role}`);
    lines.push(`- Phase: ${agent.phase}`);
    lines.push(`- Mode: ${agent.mode}`);
    lines.push(`- Scope: ${agent.scope || '[default scope]'}`);
    lines.push(`- Scope Targets: ${agent.scopeTargets.length ? agent.scopeTargets.join(', ') : '[none]'}`);
    lines.push(`- Dependencies: ${agent.dependsOn.length ? agent.dependsOn.join(', ') : '[none]'}`);
    lines.push(`- Ownership: ${agent.ownershipPaths.length ? agent.ownershipPaths.join(', ') : (agent.ownershipKeys.join(', ') || '[global]')}`);
    if (agent.runDir) {
      lines.push(`- Run Dir: \`${agent.runDir}\``);
    }
    if (agent.materializeError) {
      lines.push(`- Materialize Error: ${agent.materializeError}`);
    }
    lines.push('', '```text', agent.runRequest || 'No prompt saved.', '```', '');
  }

  return `${lines.join('\n').trim()}\n`;
}

async function writeTeamManifest(team) {
  const normalized = normalizeTeamManifest(team, team.workspaceRoot);
  normalized.updatedAt = new Date().toISOString();
  await writeJson(teamManifestPath(normalized.workspaceRoot, normalized.id), normalized);
  await fs.mkdir(path.dirname(teamReadmePath(normalized.workspaceRoot, normalized.id)), { recursive: true });
  await fs.writeFile(teamReadmePath(normalized.workspaceRoot, normalized.id), buildTeamReadme(normalized), 'utf8');
  return normalized;
}

async function readTeamManifest(workspaceRoot, teamId) {
  const resolvedWorkspaceRoot = path.resolve(String(workspaceRoot || DEFAULT_AGENT_WORKSPACE_ROOT));
  const manifestPath = teamManifestPath(resolvedWorkspaceRoot, teamId);
  if (!(await exists(manifestPath))) {
    const error = new Error(`Team not found: ${teamId}`);
    error.statusCode = 404;
    throw error;
  }
  return normalizeTeamManifest(await readJson(manifestPath), resolvedWorkspaceRoot);
}

async function buildCoordinatedTeamPlan(input = {}) {
  const workspaceRoot = path.resolve(String(input.workspaceRoot || DEFAULT_AGENT_WORKSPACE_ROOT));
  const meta = await workspaceMeta(workspaceRoot);
  const projectPath = path.resolve(String(input.projectPath || meta.defaults.projectPath || DEFAULT_PROJECT_PATH));
  const masterRequest = sanitizeChatText(input.masterRequest || input.request || '');
  if (!masterRequest) {
    throw new Error('Master request is required to build a team plan.');
  }

  const surfaces = normalizeProjectSurfaces(meta.defaults.projectSurfaces || defaultProjectSurfaces(projectPath), projectPath);
  const scopeTargets = uniqueStrings(parseStringList(input.scopeTargets)).slice(0, 16);
  const inferredScopeLevel = inferTeamScopeLevel(masterRequest, surfaces, meta.defaults.scopeLevelDefault || DEFAULT_SCOPE_LEVEL);
  const scopeLevel = normalizeScopeLevel(input.scopeLevel || inferredScopeLevel, meta.defaults.scopeLevelDefault || DEFAULT_SCOPE_LEVEL);
  const scope = String(input.scope || '').trim() || projectPath;
  const implementationBuckets = await discoverImplementationBuckets(projectPath, scopeTargets, surfaces);
  const hasFrontend = teamHasFrontend(surfaces) || /\b(react|javascript|frontend|ui|page|component)\b/i.test(masterRequest);
  const hasBackend = teamHasBackend(surfaces);
  const atlasMode = (scopeLevel === 'full-system' || (hasFrontend && hasBackend)) ? 'full-system-atlas' : 'system-atlas';
  const auditMode = (scopeLevel === 'full-system' || (hasFrontend && hasBackend)) ? 'full-system-deep-audit' : 'deep-scan';
  const now = new Date().toISOString();

  const auditAgentIds = ['qa-audit', 'security-audit'];
  const agents = [
    createTeamAgent({
      id: 'pm-atlas',
      title: 'Project Manager Atlas',
      role: 'Project Manager',
      phase: 'discovery',
      lane: 'Global coordination',
      summary: 'Map the repo, establish safe work lanes, and refresh the system memory before any parallel work starts.',
      mode: atlasMode,
      scope: projectPath,
      scopeLevel: atlasMode.startsWith('full-system') ? 'full-system' : scopeLevel,
      scopeTargets: scopeTargets.length ? scopeTargets : ['system-atlas'],
      ownershipKeys: ['coordination:global'],
      reportOnly: true,
      mutatesCode: false
    }),
    createTeamAgent({
      id: 'qa-audit',
      title: 'QA Audit',
      role: 'QA Engineer',
      phase: 'audit',
      lane: 'Cross-repo quality audit',
      summary: 'Audit for loopholes, risks, dead code, optimization issues, and anything clearly wrong.',
      mode: auditMode,
      scope,
      scopeLevel: auditMode.startsWith('full-system') ? 'full-system' : scopeLevel,
      scopeTargets,
      ownershipKeys: ['audit:qa'],
      dependsOn: ['pm-atlas'],
      reportOnly: true,
      mutatesCode: false
    }),
    createTeamAgent({
      id: 'security-audit',
      title: 'Security Audit',
      role: 'Security Reviewer',
      phase: 'audit',
      lane: 'Threat and permission review',
      summary: 'Inspect auth, permissions, inputs, configs, and risky flows for concrete threats.',
      mode: 'security-audit',
      scope,
      scopeLevel,
      scopeTargets,
      ownershipKeys: ['audit:security'],
      dependsOn: ['pm-atlas'],
      reportOnly: true,
      mutatesCode: false
    })
  ];

  if (hasFrontend) {
    auditAgentIds.push('react-audit');
    agents.push(createTeamAgent({
      id: 'react-audit',
      title: 'React Runtime and JS Audit',
      role: 'React / JavaScript Specialist',
      phase: 'audit',
      lane: 'Frontend runtime and architecture review',
      summary: 'Inspect render flow, state usage, effects, dead UI code, and frontend efficiency issues.',
      mode: 'improvement-report',
      scope: implementationBuckets.find((bucket) => bucket.scopeLevel === 'panel-fe')?.scope || projectPath,
      scopeLevel: 'panel-fe',
      scopeTargets: implementationBuckets
        .filter((bucket) => ['panel-fe', 'panel-fullstack'].includes(bucket.scopeLevel))
        .flatMap((bucket) => bucket.scopeTargets)
        .slice(0, 16),
      ownershipKeys: ['audit:frontend'],
      dependsOn: ['pm-atlas'],
      reportOnly: true,
      mutatesCode: false
    }));
  }

  agents.push(createTeamAgent({
    id: 'pm-plan',
    title: 'Project Manager Remediation Plan',
    role: 'Project Manager',
    phase: 'planning',
    lane: 'Backlog triage and batching',
    summary: 'Turn audit findings into lane-specific implementation batches with clear ownership and priorities.',
    mode: 'plan-batch',
    scope,
    scopeLevel,
    scopeTargets,
    ownershipKeys: ['coordination:plan'],
    dependsOn: auditAgentIds,
    reportOnly: true,
    mutatesCode: false
  }));

  const implementationAgentIds = [];
  for (const bucket of implementationBuckets) {
    const agentId = `fix-${bucket.id}`;
    implementationAgentIds.push(agentId);
    agents.push(createTeamAgent({
      id: agentId,
      title: `${bucket.label} Fix Lane`,
      role: bucket.role,
      phase: 'implementation',
      lane: bucket.label,
      summary: `Implement the highest-value fixes and optimizations for ${bucket.focus}.`,
      mode: bucket.mode,
      scope: bucket.scope,
      scopeLevel: bucket.scopeLevel,
      scopeTargets: bucket.scopeTargets,
      ownershipPaths: bucket.ownershipPaths,
      ownershipKeys: bucket.ownershipKeys,
      dependsOn: ['pm-plan'],
      reportOnly: false,
      mutatesCode: true
    }));
  }

  agents.push(
    createTeamAgent({
      id: 'qa-verify',
      title: 'QA Verification Sweep',
      role: 'QA Engineer',
      phase: 'verification',
      lane: 'Regression and test confidence',
      summary: 'Recheck implementation lanes, hunt regressions, and strengthen verification evidence.',
      mode: 'regression-hunt',
      scope,
      scopeLevel,
      scopeTargets: implementationBuckets.flatMap((bucket) => bucket.scopeTargets).slice(0, 16),
      ownershipKeys: ['verify:global'],
      dependsOn: implementationAgentIds,
      reportOnly: false,
      mutatesCode: true
    }),
    createTeamAgent({
      id: 'pm-wrap',
      title: 'Project Manager Wrap-up',
      role: 'Project Manager',
      phase: 'wrap-up',
      lane: 'Final recap',
      summary: 'Summarize what was fixed, what remains, and the next recommended batch.',
      mode: 'change-journal',
      scope,
      scopeLevel,
      scopeTargets,
      ownershipKeys: ['coordination:wrap'],
      dependsOn: ['qa-verify'],
      reportOnly: true,
      mutatesCode: false
    })
  );

  const team = normalizeTeamManifest({
    version: TEAM_MANIFEST_VERSION,
    id: randomTeamId(),
    name: normalizeTeamName(input.teamName) || defaultTeamName(projectPath, masterRequest),
    summary: `Coordinated multi-agent campaign for ${path.basename(projectPath)}.`,
    workspaceRoot,
    projectPath,
    scope,
    scopeLevel,
    scopeTargets,
    masterRequest,
    notes: defaultTeamNotes(implementationBuckets),
    createdAt: now,
    updatedAt: now,
    agents
  }, workspaceRoot);

  team.agents = team.agents.map((agent) => ({
    ...agent,
    runRequest: buildTeamAgentRequest(team, agent, team.agents)
  }));

  return {
    team,
    metaDefaults: meta.defaults
  };
}

async function materializeTeamRuns(team, defaults = {}) {
  const normalized = normalizeTeamManifest(team, team.workspaceRoot);
  for (const agent of normalized.agents) {
    if (agent.runDir) continue;

    const payload = {
      workspaceRoot: normalized.workspaceRoot,
      projectPath: normalized.projectPath,
      mode: agent.mode,
      scope: agent.scope,
      scopeLevel: agent.scopeLevel,
      scopeTargets: agent.scopeTargets.join(','),
      devIgnore: String(defaults.devIgnore || DEFAULT_DEV_IGNORE_PATTERNS.join(',')),
      requiredAtlasDocs: String(defaults.requiredAtlasDocsCsv || ''),
      projectSurfaces: String(defaults.projectSurfacesJson || JSON.stringify(defaultProjectSurfaces(normalized.projectPath))),
      fullSystemRequiredDocs: defaults.fullSystemRequiredDocs !== false,
      designGuides: String(defaults.designGuides || DEFAULT_DESIGN_GUIDES.join(',')),
      references: String(defaults.blueprintSources || defaultBlueprintSourcesForWorkspace(normalized.workspaceRoot).join(',')),
      request: agent.runRequest,
      globalRules: defaults.globalRules || DEFAULT_GLOBAL_RULES
    };

    const result = await runCommand(buildProjectBotArgs(payload));
    if (result.code !== 0) {
      agent.materializeError = result.stderr || result.stdout || 'Unable to create team run.';
      continue;
    }

    const latestRun = await readLatestRun(normalized.workspaceRoot);
    if (!latestRun) {
      agent.materializeError = 'Run was created but LATEST_RUN could not be resolved.';
      continue;
    }

    agent.runDir = path.resolve(latestRun);
    agent.materializeError = '';
  }

  return writeTeamManifest(normalized);
}

function coordinatorSnapshot(coordinator) {
  if (!coordinator) {
    return {
      active: false,
      status: 'idle',
      autoAdvance: false,
      startedAt: '',
      updatedAt: '',
      lastError: ''
    };
  }
  return {
    active: coordinator.status === 'running',
    status: coordinator.status,
    autoAdvance: coordinator.autoAdvance !== false,
    startedAt: coordinator.startedAt,
    updatedAt: coordinator.updatedAt,
    lastError: coordinator.lastError || ''
  };
}

async function hydrateTeam(team) {
  const normalized = normalizeTeamManifest(team, team.workspaceRoot);
  const runCardsByAgentId = new Map();

  await Promise.all(normalized.agents.map(async (agent) => {
    if (!agent.runDir) return;
    try {
      runCardsByAgentId.set(agent.id, await readRunCard(agent.runDir));
    } catch {
      runCardsByAgentId.set(agent.id, null);
    }
  }));

  const baseAgents = normalized.agents.map((agent) => {
    const run = runCardsByAgentId.get(agent.id) || null;
    let status = 'planned';
    if (agent.materializeError) {
      status = 'materialize-failed';
    } else if (run?.active) {
      status = 'running';
    } else if (run?.lastExitCode !== null && Number(run.lastExitCode) !== 0) {
      status = 'failed';
    } else if (run?.done) {
      status = 'completed';
    } else if (agent.runDir) {
      status = 'ready';
    }
    return {
      ...agent,
      run,
      status,
      blockedBy: []
    };
  });

  const completed = new Set(baseAgents.filter((agent) => agent.status === 'completed').map((agent) => agent.id));
  const agents = baseAgents.map((agent) => {
    if (['running', 'failed', 'completed', 'materialize-failed'].includes(agent.status)) {
      return agent;
    }
    const blockedBy = agent.dependsOn.filter((dependencyId) => !completed.has(dependencyId));
    if (blockedBy.length) {
      return {
        ...agent,
        status: 'waiting',
        blockedBy
      };
    }
    return agent;
  });

  const summary = {
    totalCount: agents.length,
    runningCount: agents.filter((agent) => agent.status === 'running').length,
    readyCount: agents.filter((agent) => agent.status === 'ready').length,
    waitingCount: agents.filter((agent) => agent.status === 'waiting').length,
    completedCount: agents.filter((agent) => agent.status === 'completed').length,
    failedCount: agents.filter((agent) => ['failed', 'materialize-failed'].includes(agent.status)).length
  };

  const coordinator = coordinatorSnapshot(activeTeamCoordinators.get(teamCoordinatorKey(normalized.workspaceRoot, normalized.id)));
  let status = 'planned';
  if (summary.failedCount > 0) {
    status = 'attention';
  } else if (summary.completedCount === summary.totalCount && summary.totalCount > 0) {
    status = 'completed';
  } else if (summary.runningCount > 0) {
    status = 'running';
  } else if (summary.readyCount > 0) {
    status = 'ready';
  } else if (summary.waitingCount > 0) {
    status = 'waiting';
  }

  return {
    ...normalized,
    agents,
    status,
    summary,
    coordinator
  };
}

function formatTeamSummary(team) {
  return {
    id: team.id,
    name: team.name,
    summary: team.summary,
    status: team.status,
    projectPath: team.projectPath,
    scopeLevel: team.scopeLevel,
    createdAt: team.createdAt,
    updatedAt: team.updatedAt,
    coordinator: team.coordinator,
    counts: team.summary
  };
}

async function listTeams(workspaceRoot, limit = 12) {
  const resolvedWorkspaceRoot = path.resolve(String(workspaceRoot || DEFAULT_AGENT_WORKSPACE_ROOT));
  const teamsRoot = teamsDirForWorkspace(resolvedWorkspaceRoot);
  if (!(await exists(teamsRoot))) {
    return [];
  }

  const entries = await fs.readdir(teamsRoot, { withFileTypes: true });
  const teams = [];
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const manifestPath = path.join(teamsRoot, entry.name, 'manifest.json');
    if (!(await exists(manifestPath))) continue;
    try {
      const manifest = normalizeTeamManifest(await readJson(manifestPath), resolvedWorkspaceRoot);
      const hydrated = await hydrateTeam(manifest);
      teams.push(formatTeamSummary(hydrated));
    } catch {
      // Ignore unreadable manifests.
    }
  }

  teams.sort((left, right) => Date.parse(right.updatedAt || right.createdAt || 0) - Date.parse(left.updatedAt || left.createdAt || 0));
  return teams.slice(0, limit);
}

async function getHydratedTeam(workspaceRoot, teamId) {
  return hydrateTeam(await readTeamManifest(workspaceRoot, teamId));
}

async function startReadyTeamAgentsInternal(team, startOptions = {}) {
  const hydratedTeam = team?.agents ? await hydrateTeam(team) : await getHydratedTeam(startOptions.workspaceRoot, startOptions.teamId);
  const activeMutatingAgents = hydratedTeam.agents.filter((agent) => agent.status === 'running' && agent.mutatesCode);
  const started = [];
  const skipped = [];

  for (const agent of hydratedTeam.agents.filter((entry) => entry.status === 'ready')) {
    if (!agent.runDir) {
      skipped.push({ id: agent.id, title: agent.title, reason: 'Run has not been created for this agent yet.' });
      continue;
    }

    if (agent.mutatesCode) {
      const conflict = [...activeMutatingAgents, ...started.map((entry) => entry.agent)]
        .find((activeAgent) => ownershipKeysOverlap(activeAgent.ownershipKeys, agent.ownershipKeys));
      if (conflict) {
        skipped.push({
          id: agent.id,
          title: agent.title,
          reason: `Ownership overlaps with ${conflict.title}.`
        });
        continue;
      }
    }

    try {
      const processMeta = await startAutopilot({
        workspaceRoot: hydratedTeam.workspaceRoot,
        runDir: agent.runDir,
        model: startOptions.model,
        effort: startOptions.effort,
        maxCycles: startOptions.maxCycles,
        quiet: startOptions.quiet,
        profile: startOptions.profile,
        search: startOptions.search,
        addDirs: startOptions.addDirs,
        configOverrides: startOptions.configOverrides,
        autoAddRelatedRepos: startOptions.autoAddRelatedRepos,
        useExperimentalMultiAgent: startOptions.useExperimentalMultiAgent,
        mode: agent.mode,
        scopeLevel: agent.scopeLevel
      });
      started.push({
        id: agent.id,
        title: agent.title,
        runDir: agent.runDir,
        pid: processMeta.pid,
        agent
      });
      if (agent.mutatesCode) {
        activeMutatingAgents.push(agent);
      }
    } catch (error) {
      skipped.push({
        id: agent.id,
        title: agent.title,
        reason: error?.message || String(error)
      });
    }
  }

  return {
    started: started.map(({ agent, ...rest }) => rest),
    skipped,
    team: await getHydratedTeam(hydratedTeam.workspaceRoot, hydratedTeam.id)
  };
}

function finishTeamCoordinator(workspaceRoot, teamId, status, errorMessage = '') {
  const key = teamCoordinatorKey(workspaceRoot, teamId);
  const coordinator = activeTeamCoordinators.get(key);
  if (!coordinator) return;
  coordinator.status = status;
  coordinator.lastError = String(errorMessage || '').trim();
  coordinator.updatedAt = new Date().toISOString();
  if (coordinator.pollTimer) {
    clearTimeout(coordinator.pollTimer);
    coordinator.pollTimer = null;
  }
  setTimeout(() => {
    const current = activeTeamCoordinators.get(key);
    if (current && current.status === status && current.updatedAt === coordinator.updatedAt) {
      activeTeamCoordinators.delete(key);
    }
  }, 24 * 60 * 60 * 1000);
}

function scheduleTeamCoordinatorPoll(workspaceRoot, teamId, delayMs = TEAM_COORDINATOR_POLL_INTERVAL_MS) {
  const key = teamCoordinatorKey(workspaceRoot, teamId);
  const coordinator = activeTeamCoordinators.get(key);
  if (!coordinator || coordinator.status !== 'running') return;
  if (coordinator.pollTimer) {
    clearTimeout(coordinator.pollTimer);
  }
  coordinator.pollTimer = setTimeout(() => {
    advanceTeamCoordinator(key).catch((error) => {
      const current = activeTeamCoordinators.get(key);
      if (!current) return;
      finishTeamCoordinator(current.workspaceRoot, current.teamId, 'failed', error?.message || String(error));
    });
  }, Math.max(4000, Number(delayMs) || TEAM_COORDINATOR_POLL_INTERVAL_MS));
}

async function advanceTeamCoordinator(coordinatorKey) {
  const coordinator = activeTeamCoordinators.get(coordinatorKey);
  if (!coordinator || coordinator.status !== 'running' || coordinator.processing) return;
  coordinator.processing = true;
  coordinator.updatedAt = new Date().toISOString();

  try {
    const team = await getHydratedTeam(coordinator.workspaceRoot, coordinator.teamId);
    if (team.summary.failedCount > 0) {
      finishTeamCoordinator(team.workspaceRoot, team.id, 'failed', 'One or more team agents failed or could not be created.');
      return;
    }
    if (team.summary.completedCount === team.summary.totalCount && team.summary.totalCount > 0) {
      finishTeamCoordinator(team.workspaceRoot, team.id, 'completed');
      return;
    }
    if (team.summary.runningCount > 0) {
      return;
    }

    const startResult = await startReadyTeamAgentsInternal(team, coordinator.startOptions);
    if (startResult.started.length > 0) {
      return;
    }

    const refreshed = startResult.team;
    if (refreshed.summary.failedCount > 0) {
      finishTeamCoordinator(refreshed.workspaceRoot, refreshed.id, 'failed', 'One or more team agents failed or could not be created.');
      return;
    }
    if (refreshed.summary.completedCount === refreshed.summary.totalCount && refreshed.summary.totalCount > 0) {
      finishTeamCoordinator(refreshed.workspaceRoot, refreshed.id, 'completed');
      return;
    }

    const reason = startResult.skipped.length
      ? startResult.skipped.map((entry) => `${entry.title}: ${entry.reason}`).join(' | ')
      : 'No ready agents were available to start.';
    finishTeamCoordinator(refreshed.workspaceRoot, refreshed.id, 'blocked', reason);
  } finally {
    const current = activeTeamCoordinators.get(coordinatorKey);
    if (!current) return;
    current.processing = false;
    if (current.status === 'running') {
      scheduleTeamCoordinatorPoll(current.workspaceRoot, current.teamId, TEAM_COORDINATOR_POLL_INTERVAL_MS);
    }
  }
}

function upsertTeamCoordinator(input = {}) {
  const workspaceRoot = path.resolve(String(input.workspaceRoot || DEFAULT_AGENT_WORKSPACE_ROOT));
  const teamId = String(input.teamId || '').trim();
  const key = teamCoordinatorKey(workspaceRoot, teamId);
  const existing = activeTeamCoordinators.get(key);
  if (existing?.pollTimer) {
    clearTimeout(existing.pollTimer);
  }
  const coordinator = {
    workspaceRoot,
    teamId,
    status: 'running',
    autoAdvance: input.autoAdvance !== false,
    startOptions: {
      model: String(input.model || '').trim(),
      effort: normalizeChatEffort(input.effort),
      maxCycles: clampInteger(input.maxCycles ?? 12, 1, 40),
      quiet: input.quiet !== false,
      profile: String(input.profile || '').trim(),
      search: toBoolean(input.search),
      addDirs: String(input.addDirs || '').trim(),
      configOverrides: String(input.configOverrides || '').trim(),
      autoAddRelatedRepos: toBoolean(input.autoAddRelatedRepos, true),
      useExperimentalMultiAgent: toBoolean(input.useExperimentalMultiAgent)
    },
    startedAt: existing?.startedAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    lastError: '',
    pollTimer: null,
    processing: false
  };
  activeTeamCoordinators.set(key, coordinator);
  scheduleTeamCoordinatorPoll(workspaceRoot, teamId, TEAM_COORDINATOR_POLL_INTERVAL_MS);
  return coordinatorSnapshot(coordinator);
}

async function stopActiveTeamAgents(workspaceRoot, teamId) {
  const hydratedTeam = await getHydratedTeam(workspaceRoot, teamId);
  const stopped = [];
  for (const agent of hydratedTeam.agents.filter((entry) => entry.status === 'running' && entry.runDir)) {
    try {
      stopAutopilot(agent.runDir);
      stopped.push({ id: agent.id, title: agent.title, runDir: agent.runDir });
    } catch {
      // Ignore stop failures for processes that already exited.
    }
  }
  finishTeamCoordinator(hydratedTeam.workspaceRoot, hydratedTeam.id, 'stopped');
  return {
    stopped,
    team: await getHydratedTeam(hydratedTeam.workspaceRoot, hydratedTeam.id)
  };
}

async function nextAvailableRunDir(targetRunsDir, preferredName) {
  let candidate = path.join(targetRunsDir, preferredName);
  if (!(await exists(candidate))) {
    return candidate;
  }

  let index = 1;
  while (true) {
    candidate = path.join(targetRunsDir, `${preferredName}-imported-${index}`);
    if (!(await exists(candidate))) {
      return candidate;
    }
    index += 1;
  }
}

async function updateImportedRunFiles(runDir, sourceWorkspaceRoot, targetWorkspaceRoot) {
  const stateFile = path.join(runDir, 'state.json');
  if (!(await exists(stateFile))) {
    return;
  }

  const state = await readJson(stateFile);
  state.workspaceRoot = path.resolve(targetWorkspaceRoot);
  state.forceExternalDocs = state.forceExternalDocs !== false;
  state.reportFiles = (state.reportFiles || []).map((filePath) => remapWorkspaceDocPath(filePath, sourceWorkspaceRoot, targetWorkspaceRoot));
  state.referenceDocs = (state.referenceDocs || []).map((filePath) => remapWorkspaceDocPath(filePath, sourceWorkspaceRoot, targetWorkspaceRoot));
  state.updatedAt = new Date().toISOString();
  state.migratedFromWorkspace = path.resolve(sourceWorkspaceRoot);
  await writeJson(stateFile, state);

  const summaryFile = path.join(runDir, 'RUN_SUMMARY.md');
  if (await exists(summaryFile)) {
    let summary = await fs.readFile(summaryFile, 'utf8');
    summary = summary.replace(/- Workspace root: `[^`]+`/m, `- Workspace root: \`${state.workspaceRoot}\``);
    await fs.writeFile(summaryFile, summary, 'utf8');
  }

  await runCommand(['node', PROJECT_BOT, 'refresh-run', '--run', runDir]);
}

async function migrateOldRuns(sourceWorkspaceRoot, targetWorkspaceRoot) {
  if (path.resolve(sourceWorkspaceRoot) === path.resolve(targetWorkspaceRoot)) {
    throw new Error('Source and target workspaces must be different.');
  }

  const sourceRunsDir = runsDirForWorkspace(sourceWorkspaceRoot);
  if (!(await exists(sourceRunsDir))) {
    throw new Error(`No runs directory found in source workspace: ${sourceRunsDir}`);
  }

  const targetRunsDir = runsDirForWorkspace(targetWorkspaceRoot);
  await fs.mkdir(targetRunsDir, { recursive: true });

  const entries = await fs.readdir(sourceRunsDir, { withFileTypes: true });
  const runDirs = entries.filter((entry) => entry.isDirectory());
  const imported = [];

  for (const entry of runDirs) {
    const sourceRunDir = path.join(sourceRunsDir, entry.name);
    const targetRunDir = await nextAvailableRunDir(targetRunsDir, entry.name);
    await fs.cp(sourceRunDir, targetRunDir, {
      recursive: true,
      force: false,
      errorOnExist: true
    });
    await updateImportedRunFiles(targetRunDir, sourceWorkspaceRoot, targetWorkspaceRoot);
    imported.push(targetRunDir);
  }

  if (imported.length) {
    await fs.writeFile(latestRunPathForWorkspace(targetWorkspaceRoot), `${imported[imported.length - 1]}\n`, 'utf8');
  }

  return imported;
}

async function readCodexDefaults() {
  const configFile = path.join(os.homedir(), '.codex', 'config.toml');
  const defaults = { model: 'gpt-5.4', effort: 'xhigh' };
  if (!(await exists(configFile))) {
    return defaults;
  }

  const raw = await fs.readFile(configFile, 'utf8');
  const modelMatch = raw.match(/^model\s*=\s*"([^"]+)"/m);
  const effortMatch = raw.match(/^model_reasoning_effort\s*=\s*"([^"]+)"/m);
  if (modelMatch) defaults.model = modelMatch[1];
  if (effortMatch) defaults.effort = effortMatch[1];
  return defaults;
}

function combineOutput(result) {
  return sanitizeCommandOutput([result?.stdout, result?.stderr].filter(Boolean).join('\n'));
}

let cachedCodexBinary = '';
let codexCapabilitiesCache = { key: '', expiresAt: 0, payload: null };

function uniqueStrings(values) {
  const seen = new Set();
  const output = [];
  for (const value of values) {
    const normalized = String(value || '').trim();
    if (!normalized || seen.has(normalized)) continue;
    seen.add(normalized);
    output.push(normalized);
  }
  return output;
}

function toBoolean(value, defaultValue = false) {
  if (value === undefined || value === null || value === '') return defaultValue;
  if (value === true) return true;
  if (value === false) return false;
  const normalized = String(value || '').trim().toLowerCase();
  if (['1', 'true', 'yes', 'on'].includes(normalized)) return true;
  if (['0', 'false', 'no', 'off'].includes(normalized)) return false;
  return defaultValue;
}

function parseMultilineOrCsv(value) {
  return String(value || '')
    .split(/\r?\n|,/)
    .map((entry) => entry.trim())
    .filter(Boolean);
}

function parseLineList(value) {
  if (Array.isArray(value)) {
    return value.map((entry) => String(entry || '').trim()).filter(Boolean);
  }
  return String(value || '')
    .split(/\r?\n/)
    .map((entry) => entry.trim())
    .filter(Boolean);
}

function tokenizeCliArgs(input) {
  const text = String(input || '').trim();
  if (!text) return [];

  const tokens = [];
  let current = '';
  let quote = '';
  let escaped = false;

  for (const char of text) {
    if (escaped) {
      current += char;
      escaped = false;
      continue;
    }

    if (char === '\\') {
      escaped = true;
      continue;
    }

    if (quote) {
      if (char === quote) {
        quote = '';
      } else {
        current += char;
      }
      continue;
    }

    if (char === '"' || char === '\'') {
      quote = char;
      continue;
    }

    if (/\s/.test(char)) {
      if (current) {
        tokens.push(current);
        current = '';
      }
      continue;
    }

    current += char;
  }

  if (escaped) {
    current += '\\';
  }
  if (current) {
    tokens.push(current);
  }
  return tokens;
}

async function discoverCodexFromPath() {
  const pathDirs = String(process.env.PATH || '').split(path.delimiter).filter(Boolean);
  for (const dir of pathDirs) {
    const candidate = path.join(dir, 'codex');
    if (await exists(candidate)) {
      return candidate;
    }
  }
  return '';
}

async function discoverCodexFromAntigravity() {
  const extensionsRoot = path.join(os.homedir(), '.antigravity', 'extensions');
  if (!(await exists(extensionsRoot))) {
    return '';
  }

  const entries = await fs.readdir(extensionsRoot, { withFileTypes: true });
  const extensionDirs = entries
    .filter((entry) => entry.isDirectory() && entry.name.startsWith('openai.chatgpt-'))
    .map((entry) => path.join(extensionsRoot, entry.name))
    .sort((left, right) => right.localeCompare(left));

  for (const extensionDir of extensionDirs) {
    const binRoot = path.join(extensionDir, 'bin');
    if (!(await exists(binRoot))) continue;

    const platformDirs = await fs.readdir(binRoot, { withFileTypes: true });
    for (const platformDir of platformDirs) {
      if (!platformDir.isDirectory()) continue;
      const candidate = path.join(binRoot, platformDir.name, 'codex');
      if (await exists(candidate)) {
        return candidate;
      }
    }
  }

  return '';
}

async function resolveCodexBinary() {
  if (cachedCodexBinary) {
    return cachedCodexBinary;
  }

  const fromEnv = process.env.CODEX_BIN || process.env.CODEX_PATH || '';
  const fromPath = await discoverCodexFromPath();
  const fromAntigravity = await discoverCodexFromAntigravity();
  const commonCandidates = [
    path.join(os.homedir(), '.local', 'bin', 'codex'),
    '/opt/homebrew/bin/codex',
    '/usr/local/bin/codex'
  ];

  const candidates = uniqueStrings([
    fromEnv,
    fromPath,
    fromAntigravity,
    ...commonCandidates
  ]);

  for (const candidate of candidates) {
    if (await exists(candidate)) {
      cachedCodexBinary = candidate;
      return cachedCodexBinary;
    }
  }

  cachedCodexBinary = 'codex';
  return cachedCodexBinary;
}

function parseCodexCommands(helpText) {
  const lines = String(helpText || '').split('\n');
  const commands = [];
  let inCommands = false;

  for (const line of lines) {
    if (/^Commands:\s*$/i.test(line.trim())) {
      inCommands = true;
      continue;
    }

    if (!inCommands) continue;
    if (!line.trim()) break;

    const match = line.match(/^  ([a-z0-9-]+)\s{2,}/i);
    if (!match) continue;
    commands.push(match[1]);
  }

  return commands;
}

function parseCodexLoginStatus(output) {
  const raw = sanitizeCommandOutput(output);
  const lower = raw.toLowerCase();
  const explicitlyLoggedOut = lower.includes('not logged in') || lower.includes('logged out');
  const loggedIn = !explicitlyLoggedOut && lower.includes('logged in');
  const methodMatch = raw.match(/logged in using\s+(.+)$/i);
  return {
    loggedIn,
    method: methodMatch ? methodMatch[1].trim() : '',
    raw
  };
}

function parseTableRows(output) {
  const lines = String(output || '')
    .split('\n')
    .map((line) => line.trimEnd())
    .filter(Boolean);

  if (lines.length < 2) return { header: [], rows: [] };

  const header = lines[0].trim().split(/\s{2,}/).map((cell) => cell.trim()).filter(Boolean);
  const rows = [];

  for (const line of lines.slice(1)) {
    const cells = line.trim().split(/\s{2,}/).map((cell) => cell.trim());
    if (!cells.length) continue;
    rows.push(cells);
  }

  return { header, rows };
}

function parseCodexFeatures(output) {
  const { rows } = parseTableRows(output);
  const features = [];
  for (const cells of rows) {
    if (cells.length < 3) continue;
    const enabledRaw = cells[cells.length - 1];
    const stage = cells[cells.length - 2];
    const name = cells.slice(0, cells.length - 2).join(' ');
    if (!name) continue;
    const enabled = enabledRaw.toLowerCase() === 'true';
    features.push({ name, stage, enabled });
  }
  return features;
}

function parseCodexMcpServers(output) {
  const { rows } = parseTableRows(output);
  const servers = [];
  for (const cells of rows) {
    if (cells.length < 7) continue;
    const [name, command, args, env, cwd, status, auth] = cells;
    servers.push({ name, command, args, env, cwd, status, auth });
  }
  return servers;
}

function parseCodexProfilesFromToml(raw) {
  const lines = String(raw || '').split('\n');
  const profiles = new Set();

  for (const line of lines) {
    const trimmed = line.trim();
    const profileMatch = trimmed.match(/^\[(?:profiles|profile)\.([^\]]+)\]$/i);
    if (profileMatch) {
      profiles.add(profileMatch[1].trim());
    }
  }

  return [...profiles].sort((left, right) => left.localeCompare(right));
}

function parseCodexModelsFromToml(raw) {
  const matches = String(raw || '').matchAll(/^model\s*=\s*"([^"]+)"/gm);
  return uniqueStrings([...matches].map((match) => match[1]));
}

function buildModelOptions(extraModels = []) {
  const configuredModels = uniqueStrings(extraModels);
  const remainingBase = [...BASE_MODEL_OPTIONS];
  const options = [];

  for (const model of configuredModels) {
    const baseIndex = remainingBase.findIndex((option) => option.value === model);
    if (baseIndex >= 0) {
      const base = remainingBase.splice(baseIndex, 1)[0];
      options.push({ ...base, label: `${base.label} (configured)` });
      continue;
    }
    options.push({ value: model, label: `${model} (from Codex config)` });
  }

  return [...options, ...remainingBase];
}

function previewCommandHelp(text, maxLines = 28) {
  return String(text || '').split('\n').slice(0, maxLines).join('\n').trim();
}

async function runCodex(args, options = {}) {
  const { env: extraEnv, ...rest } = options;
  const codexBinary = await resolveCodexBinary();
  return {
    ...(await runCommand([codexBinary, ...args], {
      timeoutMs: 12000,
      ...rest,
      env: { TERM: 'xterm-256color', ...(extraEnv || {}) }
    })),
    binary: codexBinary
  };
}

function codexUnavailableSnapshot(details = '', binary = '') {
  return {
    available: false,
    version: '',
    binary,
    commands: [],
    auth: { loggedIn: false, method: '', raw: 'Unavailable' },
    usage: {
      available: false,
      message: 'Codex CLI is not available from this server process.',
      raw: details || 'Unable to read Codex CLI help output.'
    }
  };
}

async function readCodexCliSnapshot() {
  let help;
  try {
    help = await runCodex(['--help']);
  } catch (error) {
    const message = error?.message || String(error);
    return codexUnavailableSnapshot(message);
  }

  const helpOutput = combineOutput(help);
  if (help.code !== 0) {
    return codexUnavailableSnapshot(helpOutput, help.binary || '');
  }

  const commands = parseCodexCommands(helpOutput);
  const versionResult = await runCodex(['--version']);
  const statusResult = await runCodex(['login', 'status']);
  const auth = parseCodexLoginStatus(combineOutput(statusResult));

  const usageCommand =
    commands.includes('usage') ? ['usage'] :
      commands.includes('limits') ? ['limits'] :
        commands.includes('account') ? ['account'] :
          null;

  let usage = {
    available: false,
    message: 'This installed Codex CLI version does not expose usage or remaining-limits commands.',
    raw: ''
  };

  if (usageCommand) {
    const usageResult = await runCodex(usageCommand);
    const usageRaw = combineOutput(usageResult);
    usage = {
      available: usageResult.code === 0,
      message: usageResult.code === 0
        ? `Usage command available via \`codex ${usageCommand.join(' ')}\`.`
        : `Codex exposes \`codex ${usageCommand.join(' ')}\`, but it returned an error.`,
      raw: usageRaw
    };
  }

  return {
    available: true,
    version: sanitizeCommandOutput(versionResult.stdout || versionResult.stderr || ''),
    binary: help.binary || '',
    commands,
    auth,
    usage
  };
}

async function readCodexProfiles() {
  const configFile = path.join(os.homedir(), '.codex', 'config.toml');
  if (!(await exists(configFile))) return [];
  const raw = await fs.readFile(configFile, 'utf8');
  return parseCodexProfilesFromToml(raw);
}

async function readCodexConfigModels() {
  const configFile = path.join(os.homedir(), '.codex', 'config.toml');
  if (!(await exists(configFile))) return [];
  const raw = await fs.readFile(configFile, 'utf8');
  return parseCodexModelsFromToml(raw);
}

async function readCodexCliCapabilities(forceRefresh = false) {
  const snapshot = await readCodexCliSnapshot();
  if (!snapshot.available) {
    return {
      snapshot,
      commands: [],
      profiles: [],
      features: [],
      mcpServers: [],
      slashTemplates: [],
      notes: {
        slashCommands: 'Interactive slash commands are not exposed via a dedicated CLI API; use templates in command prompts.'
      }
    };
  }

  const cacheKey = `${snapshot.binary}|${snapshot.version}`;
  if (!forceRefresh && codexCapabilitiesCache.payload && codexCapabilitiesCache.key === cacheKey && Date.now() < codexCapabilitiesCache.expiresAt) {
    return codexCapabilitiesCache.payload;
  }

  const commandDetails = [];
  for (const commandName of snapshot.commands || []) {
    const helpResult = await runCodex([commandName, '--help'], { timeoutMs: 9000 });
    const helpOutput = combineOutput(helpResult);
    commandDetails.push({
      name: commandName,
      subcommands: parseCodexCommands(helpOutput),
      help: previewCommandHelp(helpOutput)
    });
  }

  const [profiles, featuresResult, mcpResult] = await Promise.all([
    readCodexProfiles(),
    runCodex(['features', 'list'], { timeoutMs: 12000 }),
    runCodex(['mcp', 'list'], { timeoutMs: 12000 })
  ]);

  const featuresOutput = combineOutput(featuresResult);
  const mcpOutput = combineOutput(mcpResult);
  const slashTemplates = [
    '/help',
    '/model gpt-5.4',
    '/approval on-request',
    '/sandbox workspace-write',
    '/mcp',
    '/status',
    '/clear',
    '/quit'
  ];

  const payload = {
    snapshot,
    commands: commandDetails,
    profiles,
    features: featuresResult.code === 0 ? parseCodexFeatures(featuresOutput) : [],
    mcpServers: mcpResult.code === 0 ? parseCodexMcpServers(mcpOutput) : [],
    slashTemplates,
    notes: {
      slashCommands: 'Slash templates are provided for interactive Codex workflows; command availability can vary by CLI version.'
    },
    raw: {
      features: featuresOutput,
      mcp: mcpOutput
    }
  };

  codexCapabilitiesCache = {
    key: cacheKey,
    expiresAt: Date.now() + 60_000,
    payload
  };
  return payload;
}

function buildCodexRunArgs(payload = {}) {
  const args = [];
  const command = String(payload.command || '').trim();

  for (const override of parseLineList(payload.configOverrides)) {
    args.push('-c', override);
  }

  for (const feature of parseLineList(payload.enableFeatures)) {
    args.push('--enable', feature);
  }
  for (const feature of parseLineList(payload.disableFeatures)) {
    args.push('--disable', feature);
  }

  if (payload.model) args.push('-m', String(payload.model).trim());
  if (payload.profile) args.push('-p', String(payload.profile).trim());
  if (payload.sandbox) args.push('-s', String(payload.sandbox).trim());
  if (payload.approval) args.push('-a', String(payload.approval).trim());
  if (payload.localProvider) args.push('--local-provider', String(payload.localProvider).trim());
  if (toBoolean(payload.oss)) args.push('--oss');
  if (toBoolean(payload.search)) args.push('--search');
  if (toBoolean(payload.fullAuto)) args.push('--full-auto');
  if (toBoolean(payload.noAltScreen)) args.push('--no-alt-screen');
  if (toBoolean(payload.dangerouslyBypass)) args.push('--dangerously-bypass-approvals-and-sandbox');

  for (const addDir of parseLineList(payload.addDirs)) {
    args.push('--add-dir', addDir);
  }
  for (const imagePath of parseLineList(payload.imagePaths)) {
    args.push('-i', imagePath);
  }

  const cliCd = String(payload.cd || '').trim();
  if (cliCd) args.push('-C', cliCd);

  if (command) args.push(command);
  if (command === 'exec' && (toBoolean(payload.skipGitRepoCheck) || !Object.hasOwn(payload, 'skipGitRepoCheck'))) {
    args.push('--skip-git-repo-check');
  }

  const subcommand = String(payload.subcommand || '').trim();
  if (subcommand) args.push(subcommand);

  const extraArgs = tokenizeCliArgs(payload.extraArgs);
  args.push(...extraArgs);

  const slashCommand = String(payload.slashCommand || '').trim();
  const normalizedSlash = slashCommand
    ? (slashCommand.startsWith('/') ? slashCommand : `/${slashCommand}`)
    : '';
  const prompt = String(payload.prompt || '').trim();
  const combinedPrompt = [normalizedSlash, prompt].filter(Boolean).join('\n').trim();
  if (combinedPrompt) {
    args.push(combinedPrompt);
  }

  return args;
}

async function runCodexFromPayload(payload = {}) {
  const args = buildCodexRunArgs(payload);
  const timeoutMsRaw = Number(payload.timeoutMs || 30000);
  const timeoutMs = Number.isFinite(timeoutMsRaw)
    ? Math.max(5000, Math.min(timeoutMsRaw, 180000))
    : 30000;
  const result = await runCodex(args, { timeoutMs });
  return {
    ok: result.code === 0,
    code: result.code,
    timedOut: Boolean(result.timedOut),
    binary: result.binary || '',
    args,
    stdout: result.stdout || '',
    stderr: result.stderr || ''
  };
}

async function codexLoginWithApiKey(apiKey) {
  const key = String(apiKey || '').trim();
  if (!key) {
    throw new Error('Missing API key.');
  }

  const loginResult = await runCodex(['login', '--with-api-key'], {
    stdinText: `${key}\n`,
    timeoutMs: 18000
  });

  if (loginResult.code !== 0) {
    const details = combineOutput(loginResult);
    throw new Error(details || 'Codex login failed.');
  }

  const snapshot = await readCodexCliSnapshot();
  return {
    ...snapshot,
    action: 'login',
    commandOutput: combineOutput(loginResult)
  };
}

async function codexLogout() {
  const result = await runCodex(['logout']);
  if (result.code !== 0) {
    const details = combineOutput(result);
    throw new Error(details || 'Codex logout failed.');
  }
  const snapshot = await readCodexCliSnapshot();
  return {
    ...snapshot,
    action: 'logout',
    commandOutput: combineOutput(result)
  };
}

function isCrossRepoRelevantRunMeta(meta = {}) {
  const mode = String(meta.mode || '').trim();
  const scopeLevel = normalizeScopeLevel(meta.scopeLevel, DEFAULT_SCOPE_LEVEL);
  return (
    scopeLevel === 'full-system'
    || scopeLevel === 'multi-panel-fullstack'
    || scopeLevel === 'panel-fullstack'
    || scopeLevel === 'panel-be'
    || [
      'full-system-atlas',
      'full-system-deep-audit',
      'full-enhance',
      'feature-delivery',
      'contract-sync',
      'backend-audit',
      'backend-optimize',
      'release-gate'
    ].includes(mode)
  );
}

async function discoverSiblingRepoDirs(projectPath) {
  const resolvedProjectPath = path.resolve(String(projectPath || DEFAULT_PROJECT_PATH));
  const parentDir = path.dirname(resolvedProjectPath);
  const baseName = path.basename(resolvedProjectPath);
  if (!(await exists(parentDir))) return [];

  const prefix = baseName.includes('-')
    ? baseName.split('-')[0].trim().toLowerCase()
    : baseName.trim().toLowerCase();

  const entries = await fs.readdir(parentDir, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => path.join(parentDir, entry.name))
    .filter((entryPath) => path.resolve(entryPath) !== resolvedProjectPath)
    .filter((entryPath) => {
      const entryName = path.basename(entryPath).toLowerCase();
      if (prefix && entryName.startsWith(`${prefix}-`)) return true;
      return false;
    });
}

async function relatedRepoDirsForRun(meta = {}, config = {}) {
  const projectPath = path.resolve(String(meta.projectPath || config.projectPath || DEFAULT_PROJECT_PATH));
  const configuredSurfaces = Array.isArray(config.projectSurfaces) ? config.projectSurfaces : [];
  const surfacePaths = configuredSurfaces
    .map((surface) => path.resolve(String(surface?.path || '')))
    .filter((surfacePath) => surfacePath && surfacePath !== projectPath);

  const siblingPaths = isCrossRepoRelevantRunMeta(meta)
    ? await discoverSiblingRepoDirs(projectPath)
    : [];

  return uniqueStrings([...surfacePaths, ...siblingPaths]).filter((entryPath) => entryPath !== projectPath);
}

async function buildAutopilotLaunchConfig(payload = {}) {
  const workspaceRoot = path.resolve(payload.workspaceRoot || DEFAULT_AGENT_WORKSPACE_ROOT);
  const runDir = path.resolve(payload.runDir);
  const configFile = configPathForWorkspace(workspaceRoot);
  let config = normalizeWorkspaceConfig({}, workspaceRoot);
  if (await exists(configFile)) {
    config = normalizeWorkspaceConfig(await readJson(configFile), workspaceRoot);
  }

  let runMeta = {
    mode: String(payload.mode || '').trim(),
    scopeLevel: normalizeScopeLevel(payload.scopeLevel, config.scopeLevelDefault || DEFAULT_SCOPE_LEVEL),
    projectPath: path.resolve(String(payload.projectPath || config.projectPath || DEFAULT_PROJECT_PATH))
  };
  const stateFile = path.join(runDir, 'state.json');
  if (await exists(stateFile)) {
    try {
      const state = await readJson(stateFile);
      runMeta = {
        mode: String(state.mode || runMeta.mode || '').trim(),
        scopeLevel: normalizeScopeLevel(state.scopeLevel || runMeta.scopeLevel, config.scopeLevelDefault || DEFAULT_SCOPE_LEVEL),
        projectPath: path.resolve(String(state.projectPath || runMeta.projectPath || config.projectPath || DEFAULT_PROJECT_PATH))
      };
    } catch {
      // Fall back to provided payload/config defaults.
    }
  }

  const explicitAddDirs = parseStringList(payload.addDirs || payload.extraAddDirs);
  const workspaceAddDirs = parseStringList(config.codexExtraAddDirs);
  const autoAddRelatedRepos = Object.hasOwn(payload, 'autoAddRelatedRepos')
    ? toBoolean(payload.autoAddRelatedRepos)
    : (config.codexAutoAddRelatedRepos !== false);
  const relatedAddDirs = autoAddRelatedRepos
    ? await relatedRepoDirsForRun(runMeta, config)
    : [];

  const explicitConfigOverrides = parseLineList(payload.configOverrides);
  const workspaceConfigOverrides = parseLineList(config.codexConfigOverrides);
  const useExperimentalMultiAgent = Object.hasOwn(payload, 'useExperimentalMultiAgent')
    ? toBoolean(payload.useExperimentalMultiAgent)
    : toBoolean(config.codexUseExperimentalMultiAgent);

  const enableFeatures = [];
  if (useExperimentalMultiAgent) {
    enableFeatures.push('multi_agent');
  }

  return {
    runDir,
    workspaceRoot,
    model: String(payload.model || '').trim(),
    effort: normalizeChatEffort(payload.effort),
    maxCycles: clampInteger(payload.maxCycles ?? 12, 1, 40),
    quiet: payload.quiet !== false,
    profile: String(payload.profile || config.codexProfile || '').trim(),
    search: Object.hasOwn(payload, 'search')
      ? toBoolean(payload.search)
      : Boolean(config.codexSearchEnabled),
    addDirs: uniqueStrings([...workspaceAddDirs, ...explicitAddDirs, ...relatedAddDirs]),
    configOverrides: uniqueStrings([...workspaceConfigOverrides, ...explicitConfigOverrides]),
    enableFeatures,
    runMeta
  };
}

async function startAutopilot(payload) {
  const launch = await buildAutopilotLaunchConfig(payload);
  const runDir = launch.runDir;
  if (activeRuns.has(runDir) && activeRuns.get(runDir)?.child) {
    throw new Error('Autopilot is already running for this run.');
  }

  const env = {
    ...process.env,
    ORCH_DIR_OVERRIDE: runDir,
    MAX_CYCLES: String(launch.maxCycles || 12),
    QUIET_AGENT_OUTPUT: launch.quiet ? '1' : '0'
  };
  if (launch.model) env.MODEL = launch.model;
  if (launch.effort) env.EFFORT = launch.effort;
  if (launch.profile) env.CODEX_PROFILE = launch.profile;
  if (launch.search) env.CODEX_SEARCH = '1';
  if (launch.addDirs.length) env.CODEX_ADD_DIRS = launch.addDirs.join('\n');
  if (launch.configOverrides.length) env.CODEX_CONFIG_OVERRIDES = launch.configOverrides.join('\n');
  if (launch.enableFeatures.length) env.CODEX_ENABLE_FEATURES = launch.enableFeatures.join('\n');

  const child = spawn(AUTOPILOT, [launch.workspaceRoot], {
    cwd: __dirname,
    env,
    detached: false,
    stdio: ['ignore', 'pipe', 'pipe']
  });

  const processInfo = {
    pid: child.pid,
    startedAt: new Date().toISOString(),
    stdout: '',
    stderr: '',
    lastExitCode: null,
    child
  };

  child.stdout.on('data', (chunk) => {
    processInfo.stdout += chunk.toString('utf8');
    processInfo.stdout = processInfo.stdout.slice(-240000);
  });

  child.stderr.on('data', (chunk) => {
    processInfo.stderr += chunk.toString('utf8');
    processInfo.stderr = processInfo.stderr.slice(-240000);
  });

  child.on('close', (code) => {
    processInfo.lastExitCode = code ?? 0;
    processInfo.child = null;
    activeRuns.set(runDir, processInfo);
    setTimeout(() => {
      const current = activeRuns.get(runDir);
      if (current && !current.child && current.lastExitCode === processInfo.lastExitCode) {
        activeRuns.delete(runDir);
      }
    }, 300000);
  });

  activeRuns.set(runDir, processInfo);
  return { pid: child.pid, startedAt: processInfo.startedAt };
}

function stopAutopilot(runDir) {
  const resolvedRunDir = path.resolve(runDir);
  const processInfo = activeRuns.get(resolvedRunDir);
  if (!processInfo || !processInfo.child) {
    throw new Error('No active autopilot process for this run.');
  }
  processInfo.child.kill('SIGTERM');
}

async function workspaceMeta(workspaceRoot) {
  const resolvedRoot = path.resolve(workspaceRoot || DEFAULT_AGENT_WORKSPACE_ROOT);
  let config = null;
  const configFile = configPathForWorkspace(resolvedRoot);
  if (await exists(configFile)) {
    config = await readJson(configFile);
  }
  const normalizedConfig = normalizeWorkspaceConfig(config || {}, resolvedRoot);

  const [codexDefaults, codexConfigModels, latestRun, recentRuns] = await Promise.all([
    readCodexDefaults(),
    readCodexConfigModels(),
    readLatestRun(resolvedRoot),
    listRecentRuns(resolvedRoot)
  ]);

  return {
    modes: MODE_META,
    scopeLevels: SCOPE_LEVELS,
    modelOptions: buildModelOptions(codexConfigModels),
    qualityPresets: QUALITY_PRESETS,
    quickStarts: QUICK_STARTS,
    savedWorkspaces: await listSavedWorkspaces(),
    projectProfiles: await listProjectProfiles(),
    defaults: {
      workspaceRoot: resolvedRoot,
      projectPath: normalizedConfig.projectPath || DEFAULT_PROJECT_PATH,
      designGuides: (normalizedConfig.designGuides || DEFAULT_DESIGN_GUIDES).join(','),
      blueprintSources: (normalizedConfig.blueprintSources || defaultBlueprintSourcesForWorkspace(resolvedRoot)).join(','),
      projectSurfaces: normalizedConfig.projectSurfaces || defaultProjectSurfaces(normalizedConfig.projectPath),
      projectSurfacesJson: JSON.stringify(normalizedConfig.projectSurfaces || defaultProjectSurfaces(normalizedConfig.projectPath)),
      devIgnorePatterns: normalizedConfig.devIgnorePatterns || [...DEFAULT_DEV_IGNORE_PATTERNS],
      devIgnore: (normalizedConfig.devIgnorePatterns || [...DEFAULT_DEV_IGNORE_PATTERNS]).join(','),
      scopeLevelDefault: normalizedConfig.scopeLevelDefault || DEFAULT_SCOPE_LEVEL,
      fullSystemRequiredDocs: normalizedConfig.fullSystemRequiredDocs !== false,
      requiredAtlasDocs: normalizedConfig.requiredAtlasDocs || defaultRequiredAtlasDocs(resolvedRoot, normalizedConfig.fullSystemRequiredDocs !== false),
      requiredAtlasDocsCsv: (normalizedConfig.requiredAtlasDocs || defaultRequiredAtlasDocs(resolvedRoot, normalizedConfig.fullSystemRequiredDocs !== false)).join(','),
      codexProfile: normalizedConfig.codexProfile || '',
      codexSearchEnabled: Boolean(normalizedConfig.codexSearchEnabled),
      codexExtraAddDirs: normalizedConfig.codexExtraAddDirs || [],
      codexExtraAddDirsCsv: (normalizedConfig.codexExtraAddDirs || []).join(','),
      codexConfigOverrides: normalizedConfig.codexConfigOverrides || [],
      codexConfigOverridesText: (normalizedConfig.codexConfigOverrides || []).join('\n'),
      codexAutoAddRelatedRepos: normalizedConfig.codexAutoAddRelatedRepos !== false,
      codexUseExperimentalMultiAgent: Boolean(normalizedConfig.codexUseExperimentalMultiAgent),
      globalRules: normalizedConfig.globalRules || DEFAULT_GLOBAL_RULES,
      migrationSourceRoot: '/Users/macbook/Desktop/Huz',
      latestRun,
      model: codexDefaults.model,
      effort: codexDefaults.effort,
      preset: 'max-codex',
      maxCycles: 12,
      quiet: true,
      refreshSeconds: 5
    },
    recentRuns,
    recentSummaries: await listRecentSummaries(resolvedRoot)
  };
}

async function updateWorkspaceGlobalRules(workspaceRoot, globalRules) {
  const resolvedRoot = path.resolve(workspaceRoot || DEFAULT_AGENT_WORKSPACE_ROOT);
  const configFile = configPathForWorkspace(resolvedRoot);
  let config = normalizeWorkspaceConfig({}, resolvedRoot);
  if (await exists(configFile)) {
    config = normalizeWorkspaceConfig(await readJson(configFile), resolvedRoot);
  }
  config.globalRules = String(globalRules || '').trim() || DEFAULT_GLOBAL_RULES;
  config.updatedAt = new Date().toISOString();
  await writeJson(configFile, config);
}

async function updateWorkspaceSettings(workspaceRoot, updates = {}) {
  const resolvedRoot = path.resolve(workspaceRoot || DEFAULT_AGENT_WORKSPACE_ROOT);
  const configFile = configPathForWorkspace(resolvedRoot);
  let config = normalizeWorkspaceConfig({}, resolvedRoot);
  if (await exists(configFile)) {
    config = normalizeWorkspaceConfig(await readJson(configFile), resolvedRoot);
  }

  if (Object.hasOwn(updates, 'globalRules')) {
    config.globalRules = String(updates.globalRules || '').trim() || DEFAULT_GLOBAL_RULES;
  }
  if (Object.hasOwn(updates, 'projectPath') && String(updates.projectPath || '').trim()) {
    config.projectPath = path.resolve(String(updates.projectPath || '').trim());
  }
  if (Object.hasOwn(updates, 'designGuides')) {
    const guides = parseStringList(updates.designGuides);
    config.designGuides = guides.length ? guides : [...DEFAULT_DESIGN_GUIDES];
  }
  if (Object.hasOwn(updates, 'blueprintSources')) {
    const sources = parseStringList(updates.blueprintSources);
    config.blueprintSources = sources.length ? sources : defaultBlueprintSourcesForWorkspace(resolvedRoot);
  }
  if (Object.hasOwn(updates, 'projectSurfaces')) {
    let surfaces = updates.projectSurfaces;
    if (typeof surfaces === 'string') {
      try {
        surfaces = JSON.parse(surfaces);
      } catch {
        surfaces = [];
      }
    }
    config.projectSurfaces = normalizeProjectSurfaces(surfaces, config.projectPath);
  }
  if (Object.hasOwn(updates, 'devIgnore')) {
    const ignore = parseStringList(updates.devIgnore);
    config.devIgnorePatterns = ignore.length ? ignore : [...DEFAULT_DEV_IGNORE_PATTERNS];
  }
  if (Object.hasOwn(updates, 'scopeLevelDefault')) {
    config.scopeLevelDefault = normalizeScopeLevel(updates.scopeLevelDefault, DEFAULT_SCOPE_LEVEL);
  }
  if (Object.hasOwn(updates, 'fullSystemRequiredDocs') && updates.fullSystemRequiredDocs !== undefined) {
    config.fullSystemRequiredDocs = toBoolean(updates.fullSystemRequiredDocs);
  }
  if (Object.hasOwn(updates, 'requiredAtlasDocs')) {
    const required = parseStringList(updates.requiredAtlasDocs);
    config.requiredAtlasDocs = required.length
      ? required
      : defaultRequiredAtlasDocs(resolvedRoot, false);
  } else if (!Array.isArray(config.requiredAtlasDocs) || !config.requiredAtlasDocs.length) {
    config.requiredAtlasDocs = defaultRequiredAtlasDocs(resolvedRoot, false);
  }
  if (Object.hasOwn(updates, 'codexProfile')) {
    config.codexProfile = String(updates.codexProfile || '').trim();
  }
  if (Object.hasOwn(updates, 'codexSearchEnabled')) {
    config.codexSearchEnabled = toBoolean(updates.codexSearchEnabled);
  }
  if (Object.hasOwn(updates, 'codexExtraAddDirs')) {
    config.codexExtraAddDirs = parseStringList(updates.codexExtraAddDirs);
  }
  if (Object.hasOwn(updates, 'codexConfigOverrides')) {
    config.codexConfigOverrides = parseLineList(updates.codexConfigOverrides);
  }
  if (Object.hasOwn(updates, 'codexAutoAddRelatedRepos')) {
    config.codexAutoAddRelatedRepos = toBoolean(updates.codexAutoAddRelatedRepos, true);
  }
  if (Object.hasOwn(updates, 'codexUseExperimentalMultiAgent')) {
    config.codexUseExperimentalMultiAgent = toBoolean(updates.codexUseExperimentalMultiAgent);
  }

  config.updatedAt = new Date().toISOString();
  await writeJson(configFile, config);
  return config;
}

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);

    if (req.method === 'GET' && url.pathname === '/api/meta') {
      const workspaceRoot = url.searchParams.get('workspaceRoot') || DEFAULT_AGENT_WORKSPACE_ROOT;
      sendJson(res, 200, await workspaceMeta(workspaceRoot));
      return;
    }

    if (req.method === 'GET' && url.pathname === '/api/recent-runs') {
      const workspaceRoot = url.searchParams.get('workspaceRoot') || DEFAULT_AGENT_WORKSPACE_ROOT;
      sendJson(res, 200, { runs: await listRecentRuns(workspaceRoot) });
      return;
    }

    if (req.method === 'GET' && url.pathname === '/api/recent-summaries') {
      const workspaceRoot = url.searchParams.get('workspaceRoot') || DEFAULT_AGENT_WORKSPACE_ROOT;
      sendJson(res, 200, { summaries: await listRecentSummaries(workspaceRoot) });
      return;
    }

    if (req.method === 'GET' && url.pathname === '/api/teams') {
      const workspaceRoot = url.searchParams.get('workspaceRoot') || DEFAULT_AGENT_WORKSPACE_ROOT;
      sendJson(res, 200, { teams: await listTeams(workspaceRoot) });
      return;
    }

    if (req.method === 'GET' && url.pathname === '/api/team') {
      const workspaceRoot = url.searchParams.get('workspaceRoot') || DEFAULT_AGENT_WORKSPACE_ROOT;
      const teamId = String(url.searchParams.get('id') || '').trim();
      if (!teamId) {
        sendJson(res, 400, { error: 'Missing team id.' });
        return;
      }
      sendJson(res, 200, { team: await getHydratedTeam(workspaceRoot, teamId) });
      return;
    }

    if (req.method === 'POST' && url.pathname === '/api/cleanup-duplicate-runs') {
      const body = await parseBody(req);
      const workspaceRoot = body.workspaceRoot || DEFAULT_AGENT_WORKSPACE_ROOT;
      const result = await cleanupDuplicateRuns(workspaceRoot, {
        dryRun: body.dryRun
      });
      sendJson(res, 200, {
        ok: true,
        ...result,
        recentRuns: await listRecentRuns(workspaceRoot),
        recentSummaries: await listRecentSummaries(workspaceRoot)
      });
      return;
    }

    if (req.method === 'POST' && url.pathname === '/api/team/create') {
      const body = await parseBody(req);
      const { team, metaDefaults } = await buildCoordinatedTeamPlan(body);
      const savedTeam = await materializeTeamRuns(team, metaDefaults);
      sendJson(res, 200, {
        ok: true,
        team: await hydrateTeam(savedTeam),
        teams: await listTeams(savedTeam.workspaceRoot)
      });
      return;
    }

    if (req.method === 'POST' && url.pathname === '/api/team/start') {
      const body = await parseBody(req);
      const workspaceRoot = path.resolve(String(body.workspaceRoot || DEFAULT_AGENT_WORKSPACE_ROOT));
      const teamId = String(body.teamId || '').trim();
      if (!teamId) {
        sendJson(res, 400, { error: 'Missing teamId.' });
        return;
      }

      const startResult = await startReadyTeamAgentsInternal(await getHydratedTeam(workspaceRoot, teamId), {
        workspaceRoot,
        teamId,
        model: body.model,
        effort: body.effort,
        maxCycles: body.maxCycles,
        quiet: body.quiet,
        profile: body.profile,
        search: body.search,
        addDirs: body.addDirs,
        configOverrides: body.configOverrides,
        autoAddRelatedRepos: body.autoAddRelatedRepos,
        useExperimentalMultiAgent: body.useExperimentalMultiAgent
      });

      let coordinator = coordinatorSnapshot(null);
      const shouldAutoAdvance = body.autoAdvance === undefined ? true : toBoolean(body.autoAdvance, true);
      if (shouldAutoAdvance && (
        startResult.started.length > 0
        || startResult.team.summary.runningCount > 0
        || startResult.team.summary.readyCount > 0
        || startResult.team.summary.waitingCount > 0
      )) {
        coordinator = upsertTeamCoordinator({
          workspaceRoot,
          teamId,
          model: body.model,
          effort: body.effort,
          maxCycles: body.maxCycles,
          quiet: body.quiet,
          profile: body.profile,
          search: body.search,
          addDirs: body.addDirs,
          configOverrides: body.configOverrides,
          autoAddRelatedRepos: body.autoAddRelatedRepos,
          useExperimentalMultiAgent: body.useExperimentalMultiAgent,
          autoAdvance: true
        });
      }

      sendJson(res, 200, {
        ok: true,
        started: startResult.started,
        skipped: startResult.skipped,
        coordinator,
        team: await getHydratedTeam(workspaceRoot, teamId)
      });
      return;
    }

    if (req.method === 'POST' && url.pathname === '/api/team/stop') {
      const body = await parseBody(req);
      const workspaceRoot = path.resolve(String(body.workspaceRoot || DEFAULT_AGENT_WORKSPACE_ROOT));
      const teamId = String(body.teamId || '').trim();
      if (!teamId) {
        sendJson(res, 400, { error: 'Missing teamId.' });
        return;
      }
      const result = await stopActiveTeamAgents(workspaceRoot, teamId);
      sendJson(res, 200, {
        ok: true,
        stopped: result.stopped,
        coordinator: coordinatorSnapshot(activeTeamCoordinators.get(teamCoordinatorKey(workspaceRoot, teamId))),
        team: result.team
      });
      return;
    }

    if (req.method === 'GET' && url.pathname === '/api/workspaces') {
      sendJson(res, 200, { workspaces: await listSavedWorkspaces() });
      return;
    }

    if (req.method === 'GET' && url.pathname === '/api/project-profiles') {
      sendJson(res, 200, { profiles: await listProjectProfiles() });
      return;
    }

    if (req.method === 'GET' && url.pathname === '/api/chat/threads') {
      const profileId = String(url.searchParams.get('profileId') || '').trim();
      const workspaceRoot = String(url.searchParams.get('workspaceRoot') || '').trim();
      const projectPath = String(url.searchParams.get('projectPath') || '').trim();
      const filter = profileId
        ? { profileId }
        : {
          workspaceRoot: workspaceRoot || DEFAULT_AGENT_WORKSPACE_ROOT,
          projectPath: projectPath || DEFAULT_PROJECT_PATH
        };
      sendJson(res, 200, { threads: await listChatThreads(filter) });
      return;
    }

    if (req.method === 'GET' && url.pathname === '/api/chat/thread') {
      const threadId = String(url.searchParams.get('id') || '').trim();
      if (!threadId) {
        sendJson(res, 400, { error: 'Missing chat thread id.' });
        return;
      }
      const { thread } = await getChatThread(threadId);
      sendJson(res, 200, { thread: formatChatThread(thread) });
      return;
    }

    if (req.method === 'GET' && url.pathname === '/api/codex/status') {
      sendJson(res, 200, await readCodexCliSnapshot());
      return;
    }

    if (req.method === 'GET' && url.pathname === '/api/codex/capabilities') {
      const refresh = toBoolean(url.searchParams.get('refresh'));
      sendJson(res, 200, await readCodexCliCapabilities(refresh));
      return;
    }

    if (req.method === 'POST' && url.pathname === '/api/codex/run') {
      const body = await parseBody(req);
      sendJson(res, 200, await runCodexFromPayload(body));
      return;
    }

    if (req.method === 'POST' && url.pathname === '/api/codex/login') {
      const body = await parseBody(req);
      if (!body.apiKey) {
        sendJson(res, 400, { error: 'Missing apiKey in request body.' });
        return;
      }
      sendJson(res, 200, await codexLoginWithApiKey(body.apiKey));
      return;
    }

    if (req.method === 'POST' && url.pathname === '/api/codex/logout') {
      sendJson(res, 200, await codexLogout());
      return;
    }

    if (req.method === 'POST' && url.pathname === '/api/init-workspace') {
      const body = await parseBody(req);
      const result = await runCommand(buildInitWorkspaceArgs(body));
      if (result.code !== 0) {
        sendJson(res, 500, result);
        return;
      }
      await updateWorkspaceSettings(body.workspaceRoot, {
        projectPath: body.projectPath,
        designGuides: body.designGuides,
        blueprintSources: body.blueprintSources,
        globalRules: body.globalRules,
        projectSurfaces: body.projectSurfaces,
        devIgnore: body.devIgnore,
        scopeLevelDefault: body.scopeLevelDefault,
        fullSystemRequiredDocs: body.fullSystemRequiredDocs,
        requiredAtlasDocs: body.requiredAtlasDocs,
        codexProfile: body.codexProfile,
        codexSearchEnabled: body.codexSearchEnabled,
        codexExtraAddDirs: body.codexExtraAddDirs,
        codexConfigOverrides: body.codexConfigOverrides,
        codexAutoAddRelatedRepos: body.codexAutoAddRelatedRepos,
        codexUseExperimentalMultiAgent: body.codexUseExperimentalMultiAgent
      });
      sendJson(res, 200, { ...result, meta: await workspaceMeta(body.workspaceRoot) });
      return;
    }

    if (req.method === 'POST' && url.pathname === '/api/create-workspace') {
      const body = await parseBody(req);
      if (!body.name) {
        sendJson(res, 400, { error: 'Missing workspace name.' });
        return;
      }

      const workspaceRoot = path.join(agentWorkspacesRoot(), slugifyName(body.name));
      const configFile = configPathForWorkspace(workspaceRoot);
      if (!(await exists(configFile))) {
        const result = await runCommand(buildInitWorkspaceArgs({
          workspaceRoot,
          projectPath: body.projectPath,
          designGuides: body.designGuides,
          blueprintSources: body.blueprintSources,
          projectSurfaces: body.projectSurfaces,
          devIgnore: body.devIgnore,
          scopeLevelDefault: body.scopeLevelDefault,
          fullSystemRequiredDocs: body.fullSystemRequiredDocs,
          forceExternalDocs: toBoolean(body.forceExternalDocs, true)
        }));
        if (result.code !== 0) {
          sendJson(res, 500, result);
          return;
        }
      }

      await updateWorkspaceSettings(workspaceRoot, {
        projectPath: body.projectPath,
        designGuides: body.designGuides,
        blueprintSources: body.blueprintSources,
        globalRules: body.globalRules,
        projectSurfaces: body.projectSurfaces,
        devIgnore: body.devIgnore,
        scopeLevelDefault: body.scopeLevelDefault,
        fullSystemRequiredDocs: body.fullSystemRequiredDocs,
        requiredAtlasDocs: body.requiredAtlasDocs,
        codexProfile: body.codexProfile,
        codexSearchEnabled: body.codexSearchEnabled,
        codexExtraAddDirs: body.codexExtraAddDirs,
        codexConfigOverrides: body.codexConfigOverrides,
        codexAutoAddRelatedRepos: body.codexAutoAddRelatedRepos,
        codexUseExperimentalMultiAgent: body.codexUseExperimentalMultiAgent
      });

      sendJson(res, 200, {
        ok: true,
        workspaceRoot,
        meta: await workspaceMeta(workspaceRoot)
      });
      return;
    }

    if (req.method === 'POST' && url.pathname === '/api/save-project-profile') {
      const body = await parseBody(req);
      const result = await saveProjectProfile(body);
      sendJson(res, 200, result);
      return;
    }

    if (req.method === 'POST' && url.pathname === '/api/delete-project-profile') {
      const body = await parseBody(req);
      const result = await deleteProjectProfile(body.id);
      sendJson(res, 200, result);
      return;
    }

    if (req.method === 'POST' && url.pathname === '/api/chat/thread') {
      const body = await parseBody(req);
      const created = await createChatThread(body);
      sendJson(res, 200, { thread: created });
      return;
    }

    if (req.method === 'POST' && url.pathname === '/api/chat/preview-intent') {
      const body = await parseBody(req);
      const preview = await previewChatAutomationIntent(body);
      sendJson(res, 200, { preview });
      return;
    }

    if (req.method === 'POST' && url.pathname === '/api/chat/message') {
      const body = await parseBody(req);
      const threadId = String(body.threadId || '').trim();
      const userMessage = sanitizeChatText(body.message || body.text || '');
      if (!threadId) {
        sendJson(res, 400, { error: 'Missing threadId.' });
        return;
      }
      if (!userMessage) {
        sendJson(res, 400, { error: 'Message is required.' });
        return;
      }

      const { state, index, thread } = await getChatThread(threadId);
      thread.model = String(body.model || thread.model || '').trim() || 'gpt-5.4';
      thread.effort = normalizeChatEffort(body.effort || thread.effort);

      appendChatMessage(thread, 'user', userMessage);

      const automationEnabled = body.automationEnabled === undefined
        ? true
        : toBoolean(body.automationEnabled);

      let automationResult = { triggered: false };
      let assistantReply = '';

      if (automationEnabled) {
        automationResult = await runChatAutomation(thread, userMessage, {
          model: thread.model,
          effort: thread.effort,
          campaignPolicy: body.campaignPolicy,
          campaignFollowupRuns: body.campaignFollowupRuns,
          campaignPagesPerRun: body.campaignPagesPerRun,
          campaignFollowupMode: body.campaignFollowupMode
        });
        if (automationResult.triggered) {
          assistantReply = buildChatAutomationReply(automationResult);
        }
      }

      if (!assistantReply) {
        const reply = await runChatAssistantReply(thread, userMessage, {
          model: thread.model,
          effort: thread.effort
        });
        assistantReply = reply.text;
      }

      appendChatMessage(thread, 'assistant', assistantReply, automationResult?.triggered ? {
        automation: {
          mode: automationResult.mode,
          modeLabel: automationResult.modeLabel,
          ok: automationResult.ok,
          campaignId: automationResult.campaign?.id || ''
        }
      } : null);

      state.threads[index] = thread;
      await writeChatStoreState(state);

      sendJson(res, 200, {
        thread: formatChatThread(thread),
        automation: automationResult
      });
      return;
    }

    if (req.method === 'POST' && url.pathname === '/api/start-run') {
      const body = await parseBody(req);
      const resolvedRoot = path.resolve(body.workspaceRoot || DEFAULT_AGENT_WORKSPACE_ROOT);
      const configFile = configPathForWorkspace(resolvedRoot);
      let config = normalizeWorkspaceConfig({}, resolvedRoot);
      if (await exists(configFile)) {
        config = normalizeWorkspaceConfig(await readJson(configFile), resolvedRoot);
      }

      const requestedScopeLevel = body.scopeLevel
        || (String(body.mode || '').startsWith('full-system') ? 'full-system' : (config.scopeLevelDefault || DEFAULT_SCOPE_LEVEL));
      const scopeLevel = normalizeScopeLevel(requestedScopeLevel, config.scopeLevelDefault || DEFAULT_SCOPE_LEVEL);
      const scopeTargets = parseStringList(body.scopeTargets);
      const requiredAtlasDocs = parseStringList(body.requiredAtlasDocs);
      const devIgnorePatterns = parseStringList(body.devIgnore);
      const fullSystemRequiredDocs = body.fullSystemRequiredDocs !== undefined
        ? toBoolean(body.fullSystemRequiredDocs)
        : (config.fullSystemRequiredDocs !== false);
      const enforceFullAtlasDocs = fullSystemRequiredDocs && (
        scopeLevel === 'full-system'
        || scopeLevel === 'multi-panel-fullstack'
        || body.mode === 'full-system-atlas'
        || body.mode === 'full-system-deep-audit'
      );
      const requiredAtlasDocsCsv = (
        enforceFullAtlasDocs
          ? defaultRequiredAtlasDocs(resolvedRoot, true)
          : (requiredAtlasDocs.length
            ? requiredAtlasDocs
            : (config.requiredAtlasDocs || defaultRequiredAtlasDocs(resolvedRoot, false)))
      ).join(',');
      let projectSurfaces = body.projectSurfaces;
      if (!projectSurfaces || (typeof projectSurfaces === 'string' && !projectSurfaces.trim())) {
        projectSurfaces = JSON.stringify(config.projectSurfaces || defaultProjectSurfaces(config.projectPath));
      } else if (typeof projectSurfaces !== 'string') {
        projectSurfaces = JSON.stringify(projectSurfaces);
      }

      const startRunPayload = {
        workspaceRoot: resolvedRoot,
        projectPath: body.projectPath || config.projectPath,
        mode: body.mode,
        scope: body.scope || '',
        scopeLevel,
        scopeTargets: scopeTargets.length ? scopeTargets.join(',') : '',
        requiredAtlasDocs: requiredAtlasDocsCsv,
        devIgnore: devIgnorePatterns.length ? devIgnorePatterns.join(',') : (config.devIgnorePatterns || DEFAULT_DEV_IGNORE_PATTERNS).join(','),
        projectSurfaces,
        fullSystemRequiredDocs,
        request: body.request,
        designGuides: body.designGuides || (config.designGuides || DEFAULT_DESIGN_GUIDES).join(','),
        references: body.references || (config.blueprintSources || defaultBlueprintSourcesForWorkspace(resolvedRoot)).join(','),
        globalRules: body.globalRules || config.globalRules || DEFAULT_GLOBAL_RULES
      };

      const result = await runCommand(buildProjectBotArgs(startRunPayload));
      if (result.code !== 0) {
        sendJson(res, 500, result);
        return;
      }
      const latestRun = await readLatestRun(resolvedRoot);
      const snapshot = latestRun ? await runSnapshot(latestRun) : null;
      const recentRuns = await listRecentRuns(resolvedRoot);
      const recentSummaries = await listRecentSummaries(resolvedRoot);
      sendJson(res, 200, { ...result, latestRun, snapshot, recentRuns, recentSummaries });
      return;
    }

    if (req.method === 'POST' && url.pathname === '/api/migrate-runs') {
      const body = await parseBody(req);
      const sourceWorkspaceRoot = body.sourceWorkspaceRoot;
      const targetWorkspaceRoot = body.targetWorkspaceRoot;

      if (!sourceWorkspaceRoot || !targetWorkspaceRoot) {
        sendJson(res, 400, { error: 'Both sourceWorkspaceRoot and targetWorkspaceRoot are required.' });
        return;
      }

      const imported = await migrateOldRuns(sourceWorkspaceRoot, targetWorkspaceRoot);
      sendJson(res, 200, {
        ok: true,
        importedCount: imported.length,
        importedRuns: imported,
        recentRuns: await listRecentRuns(targetWorkspaceRoot),
        recentSummaries: await listRecentSummaries(targetWorkspaceRoot),
        meta: await workspaceMeta(targetWorkspaceRoot)
      });
      return;
    }

    if (req.method === 'POST' && url.pathname === '/api/start-autopilot') {
      const body = await parseBody(req);
      const processMeta = await startAutopilot(body);
      sendJson(res, 200, { ok: true, ...processMeta, snapshot: await runSnapshot(body.runDir) });
      return;
    }

    if (req.method === 'POST' && url.pathname === '/api/stop-autopilot') {
      const body = await parseBody(req);
      stopAutopilot(body.runDir);
      sendJson(res, 200, { ok: true });
      return;
    }

    if (req.method === 'GET' && url.pathname === '/api/run') {
      const runDir = url.searchParams.get('runDir');
      if (!runDir) {
        sendJson(res, 400, { error: 'Missing runDir query parameter.' });
        return;
      }
      sendJson(res, 200, await runSnapshot(runDir));
      return;
    }

    if (req.method === 'GET' && url.pathname === '/api/latest-run') {
      const workspaceRoot = url.searchParams.get('workspaceRoot') || DEFAULT_AGENT_WORKSPACE_ROOT;
      const latestRun = await readLatestRun(workspaceRoot);
      if (!latestRun) {
        sendJson(res, 200, { latestRun: '', snapshot: null });
        return;
      }
      sendJson(res, 200, { latestRun, snapshot: await runSnapshot(latestRun) });
      return;
    }

    // ─── File/Folder Picker ───
    if (req.method === 'GET' && url.pathname === '/api/browse-dir') {
      const dir = url.searchParams.get('dir') || os.homedir();
      const resolvedDir = path.resolve(dir);
      // Safety: don't allow listing above /Users on macOS
      if (!resolvedDir.startsWith('/Users') && !resolvedDir.startsWith('/tmp')) {
        sendJson(res, 403, { error: 'Cannot browse outside /Users.' });
        return;
      }
      const entries = await fs.readdir(resolvedDir, { withFileTypes: true });
      const items = entries
        .filter(e => !e.name.startsWith('.'))
        .map(e => ({
          name: e.name,
          type: e.isDirectory() ? 'directory' : 'file',
          path: path.join(resolvedDir, e.name)
        }))
        .sort((a, b) => {
          if (a.type !== b.type) return a.type === 'directory' ? -1 : 1;
          return a.name.localeCompare(b.name);
        });
      sendJson(res, 200, { dir: resolvedDir, entries: items });
      return;
    }

    // ─── Git Diff Viewer ───
    if (req.method === 'GET' && url.pathname === '/api/run-diff') {
      const runDir = url.searchParams.get('runDir');
      if (!runDir) {
        sendJson(res, 400, { error: 'Missing runDir.' });
        return;
      }
      const stateFile = path.join(path.resolve(runDir), 'state.json');
      if (!(await exists(stateFile))) {
        sendJson(res, 404, { error: 'Run not found.' });
        return;
      }
      const state = await readJson(stateFile);
      const projectPath = state.projectPath;
      if (!projectPath) {
        sendJson(res, 200, { stat: '', diff: '', message: 'No project path in run state.' });
        return;
      }
      try {
        const { stdout: stat } = await execFileAsync('git', ['diff', 'HEAD~1', '--stat'], { cwd: projectPath, maxBuffer: 1024 * 1024 });
        const { stdout: diff } = await execFileAsync('git', ['diff', 'HEAD~1'], { cwd: projectPath, maxBuffer: 5 * 1024 * 1024 });
        sendJson(res, 200, { stat: stat.trim(), diff: diff.trim() });
      } catch (err) {
        sendJson(res, 200, { stat: '', diff: '', message: err.message || 'Not a git repo or no previous commit.' });
      }
      return;
    }

    // ─── Global Rules ───
    if (req.method === 'POST' && url.pathname === '/api/save-global-rules') {
      const body = await parseBody(req);
      await updateWorkspaceGlobalRules(body.workspaceRoot, body.globalRules);
      sendJson(res, 200, { ok: true });
      return;
    }

    if (req.method === 'GET' && (url.pathname === '/' || url.pathname === '/index.html')) {
      sendText(res, 200, await fs.readFile(path.join(PUBLIC_DIR, 'index.html'), 'utf8'), 'text/html; charset=utf-8');
      return;
    }

    if (req.method === 'GET' && url.pathname === '/favicon.ico') {
      res.writeHead(204, { 'Cache-Control': 'no-store' });
      res.end();
      return;
    }

    if (req.method === 'GET' && (url.pathname === '/app.js' || url.pathname === '/styles.css')) {
      const filePath = path.join(PUBLIC_DIR, url.pathname.slice(1));
      const contentType = url.pathname.endsWith('.js')
        ? 'application/javascript; charset=utf-8'
        : 'text/css; charset=utf-8';
      sendText(res, 200, await fs.readFile(filePath, 'utf8'), contentType);
      return;
    }

    sendJson(res, 404, { error: 'Not found.' });
  } catch (error) {
    sendJson(res, Number(error?.statusCode) || 500, { error: error.message || 'Unexpected error.' });
  }
});

server.listen(PORT, () => {
  console.log(`Codex Project Bot GUI running at http://localhost:${PORT}`);
});
