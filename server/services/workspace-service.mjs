import fs from 'node:fs/promises';
import path from 'node:path';
import {
  AGENT_WORKSPACES_ROOT,
  DEFAULT_GLOBAL_RULES,
  DEFAULT_WORKSPACE_ROOT,
  PROJECT_PROFILES_PATH
} from '../config.mjs';
import { MODE_CATALOG, QUALITY_PRESETS, RUN_TEMPLATES, SCOPE_LEVELS, TAB_CATALOG } from '../data/catalog.mjs';
import { normalizeMultiAgentConfig } from './multi-agent-service.mjs';
import { ensureDir, exists, readJson, writeJson } from '../utils/fs.mjs';
import { randomId, slugify } from '../utils/id.mjs';

const DEFAULT_EXECUTION_PROFILE = {
  model: '',
  effort: 'high',
  maxCycles: 12,
  quiet: true,
  profile: '',
  searchEnabled: false,
  extraAddDirs: [],
  configOverrides: [],
  autoAddRelatedRepos: true,
  multiAgent: {
    enabled: true,
    workerCount: 3,
    writeMode: 'scoped',
    isolation: 'worktree',
    mergeGate: 'manager_tests'
  }
};

function workspaceConfigPath(workspaceRoot) {
  return path.join(path.resolve(workspaceRoot), 'docs', 'project-bot', 'config.json');
}

function latestRunPath(workspaceRoot) {
  return path.join(path.resolve(workspaceRoot), 'docs', 'project-bot', 'LATEST_RUN.txt');
}

function normalizeList(value) {
  if (Array.isArray(value)) return value.map((item) => String(item || '').trim()).filter(Boolean);
  return String(value || '')
    .split(/[\n,]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export function normalizeWorkspaceConfig(input = {}, workspaceRoot = DEFAULT_WORKSPACE_ROOT) {
  const codexInput = input.codex || {};
  const rawExecutionProfile = {
    ...DEFAULT_EXECUTION_PROFILE,
    ...codexInput,
    ...(input.executionProfile || {})
  };
  return {
    version: 3,
    workspaceRoot: path.resolve(input.workspaceRoot || workspaceRoot),
    projectPath: String(input.projectPath || '').trim(),
    designGuides: normalizeList(input.designGuides),
    blueprintSources: normalizeList(input.blueprintSources),
    globalRules: String(input.globalRules || DEFAULT_GLOBAL_RULES).trim(),
    scopeLevelDefault: String(input.scopeLevelDefault || 'module').trim() || 'module',
    requiredAtlasDocs: normalizeList(input.requiredAtlasDocs),
    fullSystemRequiredDocs: input.fullSystemRequiredDocs !== false,
    executionProfile: {
      ...rawExecutionProfile,
      extraAddDirs: normalizeList(codexInput.extraAddDirs || input?.executionProfile?.extraAddDirs),
      configOverrides: normalizeList(codexInput.configOverrides || input?.executionProfile?.configOverrides),
      multiAgent: normalizeMultiAgentConfig(rawExecutionProfile.multiAgent || rawExecutionProfile)
    }
  };
}

export class WorkspaceService {
  async ensureWorkspaceRoot(workspaceRoot) {
    await ensureDir(workspaceRoot);
    await ensureDir(path.join(workspaceRoot, 'docs', 'project-bot'));
  }

  async getWorkspaceConfig(workspaceRoot = DEFAULT_WORKSPACE_ROOT) {
    const resolvedRoot = path.resolve(workspaceRoot);
    const config = await readJson(workspaceConfigPath(resolvedRoot), null);
    return normalizeWorkspaceConfig(config || {}, resolvedRoot);
  }

  async saveWorkspaceConfig(workspaceRoot, updates = {}) {
    const resolvedRoot = path.resolve(workspaceRoot || DEFAULT_WORKSPACE_ROOT);
    await this.ensureWorkspaceRoot(resolvedRoot);
    const current = await this.getWorkspaceConfig(resolvedRoot);
    const next = normalizeWorkspaceConfig(
      {
        ...current,
        ...updates,
        executionProfile: {
          ...current.executionProfile,
          ...(updates.executionProfile || {})
        }
      },
      resolvedRoot
    );
    await writeJson(workspaceConfigPath(resolvedRoot), next);
    return next;
  }

  async setLatestRun(workspaceRoot, runDir) {
    const resolvedRoot = path.resolve(workspaceRoot);
    await this.ensureWorkspaceRoot(resolvedRoot);
    await fs.writeFile(latestRunPath(resolvedRoot), `${path.resolve(runDir)}\n`, 'utf8');
  }

  async getLatestRun(workspaceRoot = DEFAULT_WORKSPACE_ROOT) {
    try {
      return (await fs.readFile(latestRunPath(workspaceRoot), 'utf8')).trim();
    } catch {
      return '';
    }
  }

  async listSavedWorkspaces() {
    await ensureDir(AGENT_WORKSPACES_ROOT);
    const entries = await fs.readdir(AGENT_WORKSPACES_ROOT, { withFileTypes: true });
    const workspaces = [];
    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      const workspaceRoot = path.join(AGENT_WORKSPACES_ROOT, entry.name);
      const config = await this.getWorkspaceConfig(workspaceRoot);
      workspaces.push({
        id: entry.name,
        name: entry.name,
        workspaceRoot,
        projectPath: config.projectPath,
        updatedAt: (await readJson(workspaceConfigPath(workspaceRoot), {}))?.updatedAt || '',
        executionProfile: config.executionProfile
      });
    }
    return workspaces.sort((left, right) => left.name.localeCompare(right.name));
  }

  async createWorkspace(name, seed = {}) {
    const workspaceRoot = path.join(AGENT_WORKSPACES_ROOT, slugify(name));
    const config = await this.saveWorkspaceConfig(workspaceRoot, {
      workspaceRoot,
      ...seed
    });
    return config;
  }

  async listProjectProfiles() {
    const state = await readJson(PROJECT_PROFILES_PATH, { version: 1, profiles: [] });
    return Array.isArray(state?.profiles) ? state.profiles : [];
  }

  async saveProjectProfile(input = {}) {
    const state = await readJson(PROJECT_PROFILES_PATH, { version: 1, profiles: [] });
    const profile = {
      id: input.id || randomId('profile'),
      name: String(input.name || '').trim() || 'Untitled Profile',
      workspaceRoot: path.resolve(input.workspaceRoot || DEFAULT_WORKSPACE_ROOT),
      projectPath: String(input.projectPath || '').trim(),
      scopeLevelDefault: String(input.scopeLevelDefault || 'module').trim() || 'module',
      globalRules: String(input.globalRules || '').trim(),
      executionProfile: {
        ...DEFAULT_EXECUTION_PROFILE,
        ...(input.executionProfile || {})
      },
      updatedAt: new Date().toISOString()
    };
    const nextProfiles = [
      ...state.profiles.filter((item) => item.id !== profile.id),
      profile
    ].sort((left, right) => left.name.localeCompare(right.name));
    await writeJson(PROJECT_PROFILES_PATH, { version: 1, profiles: nextProfiles });
    return profile;
  }

  async deleteProjectProfile(id) {
    const state = await readJson(PROJECT_PROFILES_PATH, { version: 1, profiles: [] });
    const nextProfiles = state.profiles.filter((item) => item.id !== id);
    await writeJson(PROJECT_PROFILES_PATH, { version: 1, profiles: nextProfiles });
    return { ok: true };
  }

  async bootstrapMetadata(workspaceRoot = DEFAULT_WORKSPACE_ROOT) {
    const config = await this.getWorkspaceConfig(workspaceRoot);
    const workspaces = await this.listSavedWorkspaces();
    const profiles = await this.listProjectProfiles();
    const latestRun = await this.getLatestRun(workspaceRoot);
    return {
      tabs: TAB_CATALOG,
      modes: MODE_CATALOG,
      runTemplates: RUN_TEMPLATES,
      scopeLevels: SCOPE_LEVELS,
      qualityPresets: QUALITY_PRESETS,
      workspace: config,
      workspaces,
      projectProfiles: profiles,
      latestRun
    };
  }
}

export function buildExecutionProfile(input = {}, workspace = null) {
  const merged = {
    ...DEFAULT_EXECUTION_PROFILE,
    ...(workspace?.executionProfile || {}),
    ...(input || {})
  };
  return {
    ...merged,
    maxCycles: Number(merged.maxCycles || 12),
    quiet: merged.quiet !== false,
    searchEnabled: Boolean(merged.searchEnabled),
    autoAddRelatedRepos: merged.autoAddRelatedRepos !== false,
    extraAddDirs: normalizeList(merged.extraAddDirs),
    configOverrides: normalizeList(merged.configOverrides),
    multiAgent: normalizeMultiAgentConfig(merged.multiAgent || merged)
  };
}

export { workspaceConfigPath };
