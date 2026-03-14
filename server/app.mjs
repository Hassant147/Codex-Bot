import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { DIST_DIR, DEFAULT_WORKSPACE_ROOT } from './config.mjs';
import { createApiRouter, createServices } from './routes/api-router.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function createApp() {
  const services = createServices();
  const app = express();
  app.use(express.json({ limit: '2mb' }));
  app.use('/api', createApiRouter(services));

  const defaultWorkspaceRuns = await services.runService.listRuns(DEFAULT_WORKSPACE_ROOT).catch(() => []);
  await services.runtimeSupervisor.recoverRuns(defaultWorkspaceRuns.map((run) => run.runDir));

  app.use(express.static(DIST_DIR));
  app.get(/.*/, async (_req, res, next) => {
    try {
      res.sendFile(path.join(DIST_DIR, 'index.html'));
    } catch (error) {
      next(error);
    }
  });

  app.use((error, _req, res, _next) => {
    res.status(error.statusCode || 500).json({
      error: error.message || 'Unexpected error.',
      ...(error.preflight ? { preflight: error.preflight } : {})
    });
  });

  return { app, services };
}
