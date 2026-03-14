import express from 'express';
import path from 'node:path';
import { asyncHandler } from '../utils/http.mjs';
import { DEFAULT_WORKSPACE_ROOT } from '../config.mjs';
import { WorkspaceService, buildExecutionProfile } from '../services/workspace-service.mjs';
import { ProjectBotService } from '../services/project-bot-service.mjs';
import { RunService } from '../services/run-service.mjs';
import { RuntimeSupervisor } from '../services/runtime-supervisor.mjs';
import { CodexService } from '../services/codex-service.mjs';
import { KeychainService } from '../services/keychain-service.mjs';
import { AccountService } from '../services/account-service.mjs';
import { ChatService } from '../services/chat-service.mjs';

function normalizeList(value) {
  if (Array.isArray(value)) return value.map((item) => String(item || '').trim()).filter(Boolean);
  return String(value || '')
    .split(/[\n,]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function workspaceRootFrom(req) {
  return path.resolve(
    String(req.body?.workspaceRoot || req.query?.workspaceRoot || DEFAULT_WORKSPACE_ROOT)
  );
}

async function resolveRunDir(runService, workspaceRoot, runId) {
  const runs = await runService.listRuns(workspaceRoot, 200);
  const match = runs.find((run) => run.runId === runId || run.runDir === runId);
  if (!match) {
    const error = new Error('Run not found.');
    error.statusCode = 404;
    throw error;
  }
  return match.runDir;
}

export function createServices() {
  const workspaceService = new WorkspaceService();
  const runService = new RunService({ workspaceService });
  const runtimeSupervisor = new RuntimeSupervisor({ runService });
  const codexService = new CodexService();
  const keychainService = new KeychainService();
  const accountService = new AccountService({ keychainService, codexService });
  const projectBotService = new ProjectBotService();
  const chatService = new ChatService({ codexService, workspaceService });
  return {
    workspaceService,
    runService,
    runtimeSupervisor,
    codexService,
    keychainService,
    accountService,
    projectBotService,
    chatService
  };
}

export function createApiRouter(services) {
  const router = express.Router();
  const {
    workspaceService,
    runService,
    runtimeSupervisor,
    accountService,
    projectBotService,
    codexService,
    chatService
  } = services;

  router.get('/app/bootstrap', asyncHandler(async (req, res) => {
    const workspaceRoot = workspaceRootFrom(req);
    const meta = await workspaceService.bootstrapMetadata(workspaceRoot);
    const runs = await runService.listRuns(workspaceRoot);
    const accounts = await accountService.listAccounts();
    const capabilities = await codexService.getCapabilities();
    const currentRun = meta.latestRun ? await runService.getRunSnapshot(meta.latestRun).catch(() => null) : null;
    res.json({
      ...meta,
      runs,
      accounts,
      capabilities,
      currentRun
    });
  }));

  router.get('/workspaces', asyncHandler(async (_req, res) => {
    res.json({ workspaces: await workspaceService.listSavedWorkspaces() });
  }));

  router.post('/workspaces', asyncHandler(async (req, res) => {
    const config = await workspaceService.createWorkspace(req.body?.name || 'workspace', {
      projectPath: req.body?.projectPath || '',
      globalRules: req.body?.globalRules || '',
      scopeLevelDefault: req.body?.scopeLevelDefault || 'module',
      designGuides: normalizeList(req.body?.designGuides),
      blueprintSources: normalizeList(req.body?.blueprintSources),
      requiredAtlasDocs: normalizeList(req.body?.requiredAtlasDocs),
      executionProfile: req.body?.executionProfile || {}
    });
    if (config.projectPath) {
      await projectBotService.initWorkspace({
        workspaceRoot: config.workspaceRoot,
        projectPath: config.projectPath,
        designGuides: config.designGuides,
        blueprintSources: config.blueprintSources
      });
    }
    res.json({ workspace: config });
  }));

  router.post('/workspace', asyncHandler(async (req, res) => {
    const workspaceRoot = workspaceRootFrom(req);
    const config = await workspaceService.saveWorkspaceConfig(workspaceRoot, req.body);
    if (config.projectPath) {
      await projectBotService.initWorkspace({
        workspaceRoot: config.workspaceRoot,
        projectPath: config.projectPath,
        designGuides: config.designGuides,
        blueprintSources: config.blueprintSources
      });
    }
    res.json({ workspace: config });
  }));

  router.get('/profiles', asyncHandler(async (_req, res) => {
    res.json({ profiles: await workspaceService.listProjectProfiles() });
  }));

  router.post('/profiles', asyncHandler(async (req, res) => {
    const profile = await workspaceService.saveProjectProfile(req.body || {});
    res.json({ profile });
  }));

  router.delete('/profiles/:id', asyncHandler(async (req, res) => {
    res.json(await workspaceService.deleteProjectProfile(req.params.id));
  }));

  router.get('/runs', asyncHandler(async (req, res) => {
    const workspaceRoot = workspaceRootFrom(req);
    res.json({ runs: await runService.listRuns(workspaceRoot) });
  }));

  router.post('/runs', asyncHandler(async (req, res) => {
    const workspaceRoot = workspaceRootFrom(req);
    const workspace = await workspaceService.getWorkspaceConfig(workspaceRoot);
    if (!workspace.projectPath && !req.body?.projectPath) {
      throw new Error('Select a target project before creating a run.');
    }
    const projectPath = String(req.body?.projectPath || workspace.projectPath || '').trim();
    const requestText = String(req.body?.request || '').trim();
    if (!requestText) throw new Error('A run request is required.');
    const executionProfile = buildExecutionProfile({
      ...(req.body?.executionProfile || {}),
      multiAgent: req.body?.multiAgent || req.body?.executionProfile?.multiAgent
    }, workspace);
    await workspaceService.saveWorkspaceConfig(workspaceRoot, {
      ...workspace,
      projectPath
    });
    await projectBotService.initWorkspace({
      workspaceRoot,
      projectPath,
      designGuides: normalizeList(req.body?.designGuides || workspace.designGuides),
      blueprintSources: normalizeList(req.body?.references || workspace.blueprintSources)
    });
    await projectBotService.startRun({
      workspaceRoot,
      projectPath,
      mode: req.body?.mode,
      scope: req.body?.scope || '',
      scopeLevel: req.body?.scopeLevel || workspace.scopeLevelDefault,
      scopeTargets: normalizeList(req.body?.scopeTargets),
      requiredAtlasDocs: normalizeList(req.body?.requiredAtlasDocs || workspace.requiredAtlasDocs),
      devIgnore: normalizeList(req.body?.devIgnore),
      designGuides: normalizeList(req.body?.designGuides || workspace.designGuides),
      references: normalizeList(req.body?.references || workspace.blueprintSources),
      request: [
        requestText,
        workspace.globalRules ? `\nGlobal Instructions:\n${workspace.globalRules}` : ''
      ].join('').trim()
    });
    const latestRun = await workspaceService.getLatestRun(workspaceRoot);
    if (!latestRun) throw new Error('Run created but could not locate the run folder.');
    await runService.createDraftRuntime(latestRun);
    const snapshot = await runService.initializeRunConfiguration(latestRun, {
      multiAgent: executionProfile.multiAgent
    });
    res.json({ run: snapshot });
  }));

  router.get('/runs/:runId', asyncHandler(async (req, res) => {
    const workspaceRoot = workspaceRootFrom(req);
    const runDir = await resolveRunDir(runService, workspaceRoot, req.params.runId);
    res.json({ run: await runService.getRunSnapshot(runDir) });
  }));

  router.get('/runs/:runId/agents', asyncHandler(async (req, res) => {
    const workspaceRoot = workspaceRootFrom(req);
    const runDir = await resolveRunDir(runService, workspaceRoot, req.params.runId);
    res.json({ agents: await runService.getRunAgents(runDir) });
  }));

  router.get('/runs/:runId/agents/:agentId', asyncHandler(async (req, res) => {
    const workspaceRoot = workspaceRootFrom(req);
    const runDir = await resolveRunDir(runService, workspaceRoot, req.params.runId);
    const agent = await runService.getRunAgentDetail(runDir, req.params.agentId);
    if (!agent) {
      const error = new Error('Agent not found.');
      error.statusCode = 404;
      throw error;
    }
    res.json({ agent });
  }));

  router.get('/runs/:runId/stream', asyncHandler(async (req, res) => {
    const workspaceRoot = workspaceRootFrom(req);
    const runDir = await resolveRunDir(runService, workspaceRoot, req.params.runId);
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders?.();

    const initial = await runService.getRunSnapshot(runDir);
    res.write(`event: snapshot\ndata: ${JSON.stringify(initial)}\n\n`);

    const unsubscribe = runtimeSupervisor.subscribe(runDir, (event) => {
      res.write(`event: update\ndata: ${JSON.stringify(event)}\n\n`);
    });

    const keepAlive = setInterval(() => {
      res.write('event: ping\ndata: {}\n\n');
    }, 15000);

    req.on('close', () => {
      clearInterval(keepAlive);
      unsubscribe();
      res.end();
    });
  }));

  router.post('/runs/:runId/start', asyncHandler(async (req, res) => {
    const workspaceRoot = workspaceRootFrom(req);
    const workspace = await workspaceService.getWorkspaceConfig(workspaceRoot);
    const runDir = await resolveRunDir(runService, workspaceRoot, req.params.runId);
    const executionProfile = buildExecutionProfile(req.body?.executionProfile, workspace);
    await runtimeSupervisor.startRun(runDir, {
      workspaceRoot,
      executionProfile,
      activeAccountId: req.body?.activeAccountId || ''
    });
    res.json({ run: await runService.getRunSnapshot(runDir) });
  }));

  router.post('/runs/:runId/pause', asyncHandler(async (req, res) => {
    const runDir = await resolveRunDir(runService, workspaceRootFrom(req), req.params.runId);
    await runtimeSupervisor.pauseRun(runDir);
    res.json({ run: await runService.getRunSnapshot(runDir) });
  }));

  router.post('/runs/:runId/resume', asyncHandler(async (req, res) => {
    const workspaceRoot = workspaceRootFrom(req);
    const workspace = await workspaceService.getWorkspaceConfig(workspaceRoot);
    const runDir = await resolveRunDir(runService, workspaceRoot, req.params.runId);
    const executionProfile = buildExecutionProfile(req.body?.executionProfile, workspace);
    await runtimeSupervisor.resumeRun(runDir, {
      workspaceRoot,
      executionProfile,
      activeAccountId: req.body?.activeAccountId || ''
    });
    res.json({ run: await runService.getRunSnapshot(runDir) });
  }));

  router.post('/runs/:runId/stop', asyncHandler(async (req, res) => {
    const runDir = await resolveRunDir(runService, workspaceRootFrom(req), req.params.runId);
    await runtimeSupervisor.stopRun(runDir);
    res.json({ run: await runService.getRunSnapshot(runDir) });
  }));

  router.get('/accounts', asyncHandler(async (_req, res) => {
    res.json(await accountService.listAccounts());
  }));

  router.post('/accounts/login', asyncHandler(async (req, res) => {
    res.json(await accountService.login(req.body || {}));
  }));

  router.post('/accounts/save-chatgpt-session', asyncHandler(async (req, res) => {
    res.json(await accountService.saveCurrentChatgptSession(req.body?.name || ''));
  }));

  router.post('/accounts/switch', asyncHandler(async (req, res) => {
    const result = await accountService.switchAccount(req.body?.accountId);
    if (req.body?.runId) {
      const runDir = await resolveRunDir(runService, workspaceRootFrom(req), req.body.runId);
      await runService.appendRuntimeEvent?.(runDir, {
        type: 'audit',
        source: 'accounts',
        level: 'info',
        message: `Account switched while paused to ${result.account.name}.`
      });
    }
    res.json(result);
  }));

  router.post('/accounts/logout', asyncHandler(async (_req, res) => {
    res.json(await accountService.logout());
  }));

  router.post('/accounts/verify', asyncHandler(async (_req, res) => {
    res.json(await accountService.verifyCurrentSession());
  }));

  router.post('/accounts/usage', asyncHandler(async (_req, res) => {
    res.json(await accountService.checkCurrentUsage());
  }));

  router.delete('/accounts/:accountId', asyncHandler(async (req, res) => {
    res.json(await accountService.removeAccount(req.params.accountId));
  }));

  router.get('/codex/capabilities', asyncHandler(async (_req, res) => {
    res.json(await codexService.getCapabilities());
  }));

  router.post('/cli/preview', asyncHandler(async (req, res) => {
    res.json(codexService.previewCliCommand({
      ...req.body,
      extraAddDirs: normalizeList(req.body?.extraAddDirs),
      configOverrides: normalizeList(req.body?.configOverrides),
      searchEnabled: Boolean(req.body?.searchEnabled)
    }));
  }));

  router.post('/cli/run', asyncHandler(async (req, res) => {
    res.json(await codexService.runCliCommand({
      ...req.body,
      extraAddDirs: normalizeList(req.body?.extraAddDirs),
      configOverrides: normalizeList(req.body?.configOverrides),
      searchEnabled: Boolean(req.body?.searchEnabled)
    }));
  }));

  router.get('/chat/threads', asyncHandler(async (_req, res) => {
    res.json({ threads: await chatService.listThreads() });
  }));

  router.post('/chat/threads', asyncHandler(async (req, res) => {
    res.json({ thread: await chatService.createThread(req.body || {}) });
  }));

  router.get('/chat/threads/:threadId', asyncHandler(async (req, res) => {
    const thread = await chatService.getThread(req.params.threadId);
    if (!thread) {
      res.status(404).json({ error: 'Thread not found.' });
      return;
    }
    res.json({ thread });
  }));

  router.post('/chat/threads/:threadId/messages', asyncHandler(async (req, res) => {
    const thread = await chatService.sendMessage(req.params.threadId, req.body?.message || '');
    res.json({ thread });
  }));

  // Compatibility aliases while the new shell replaces the old one.
  router.get('/meta', asyncHandler(async (req, res) => {
    req.url = '/app/bootstrap';
    const workspaceRoot = workspaceRootFrom(req);
    const meta = await workspaceService.bootstrapMetadata(workspaceRoot);
    const runs = await runService.listRuns(workspaceRoot);
    const currentRun = meta.latestRun ? await runService.getRunSnapshot(meta.latestRun).catch(() => null) : null;
    res.json({
      modes: meta.modes,
      scopeLevels: meta.scopeLevels,
      qualityPresets: meta.qualityPresets,
      quickStarts: meta.runTemplates,
      savedWorkspaces: meta.workspaces,
      projectProfiles: meta.projectProfiles,
      defaults: {
        ...meta.workspace,
        latestRun: meta.latestRun
      },
      recentRuns: runs,
      recentSummaries: runs.map((run) => ({
        runDir: run.runDir,
        preview: run.runSummary.split('\n').filter(Boolean).slice(0, 5).join('\n')
      })),
      currentRun
    });
  }));

  router.get('/recent-runs', asyncHandler(async (req, res) => {
    res.json({ runs: await runService.listRuns(workspaceRootFrom(req)) });
  }));

  router.get('/latest-run', asyncHandler(async (req, res) => {
    const latestRun = await workspaceService.getLatestRun(workspaceRootFrom(req));
    res.json({
      latestRun,
      run: latestRun ? await runService.getRunSnapshot(latestRun).catch(() => null) : null
    });
  }));

  router.post('/start-run', asyncHandler(async (req, res) => {
    req.body.workspaceRoot = workspaceRootFrom(req);
    const workspaceRoot = workspaceRootFrom(req);
    const workspace = await workspaceService.getWorkspaceConfig(workspaceRoot);
    const response = await projectBotService.startRun({
      workspaceRoot,
      projectPath: req.body?.projectPath || workspace.projectPath,
      mode: req.body?.mode,
      scope: req.body?.scope || '',
      scopeLevel: req.body?.scopeLevel || workspace.scopeLevelDefault,
      scopeTargets: normalizeList(req.body?.scopeTargets),
      requiredAtlasDocs: normalizeList(req.body?.requiredAtlasDocs || workspace.requiredAtlasDocs),
      devIgnore: normalizeList(req.body?.devIgnore),
      designGuides: normalizeList(req.body?.designGuides || workspace.designGuides),
      references: normalizeList(req.body?.references || workspace.blueprintSources),
      request: String(req.body?.request || '').trim()
    });
    const latestRun = await workspaceService.getLatestRun(workspaceRoot);
    if (!latestRun) throw new Error('Run created but latest run path was not written.');
    await runService.createDraftRuntime(latestRun);
    res.json({
      ...response,
      latestRun,
      snapshot: await runService.getRunSnapshot(latestRun),
      recentRuns: await runService.listRuns(workspaceRoot)
    });
  }));

  router.post('/start-autopilot', asyncHandler(async (req, res) => {
    const workspaceRoot = workspaceRootFrom(req);
    const workspace = await workspaceService.getWorkspaceConfig(workspaceRoot);
    const runDir = req.body?.runDir;
    const executionProfile = buildExecutionProfile(req.body || {}, workspace);
    await runtimeSupervisor.startRun(runDir, {
      workspaceRoot,
      executionProfile,
      activeAccountId: req.body?.activeAccountId || ''
    });
    res.json({ ok: true, snapshot: await runService.getRunSnapshot(runDir) });
  }));

  router.post('/stop-autopilot', asyncHandler(async (req, res) => {
    await runtimeSupervisor.stopRun(req.body?.runDir);
    res.json({ ok: true });
  }));

  router.get('/run', asyncHandler(async (req, res) => {
    res.json(await runService.getRunSnapshot(String(req.query?.runDir || '')));
  }));

  router.get('/codex/status', asyncHandler(async (_req, res) => {
    const capabilities = await codexService.getCapabilities();
    res.json({
      available: capabilities.available,
      version: capabilities.version,
      auth: capabilities.auth
    });
  }));

  return router;
}
