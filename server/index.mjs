import { createServer } from 'node:http';
import { pathToFileURL } from 'node:url';
import { PORT } from './config.mjs';
import { createApp } from './app.mjs';

const DEFAULT_PORT = 4311;

export function isPortInUseError(error) {
  return Boolean(error && typeof error === 'object' && error.code === 'EADDRINUSE');
}

export function shouldRetryWithNextPort(error, requestedPort) {
  return isPortInUseError(error) && !process.env.PORT && requestedPort === DEFAULT_PORT;
}

export function formatAddress(port) {
  return `http://localhost:${port}`;
}

export async function startServer({ startPort = PORT } = {}) {
  const { app } = await createApp();

  return await new Promise((resolve, reject) => {
    const tryListen = (port) => {
      const server = createServer(app);

      server.once('error', (error) => {
        if (shouldRetryWithNextPort(error, port)) {
          console.warn(`Port ${port} is already in use, retrying on ${port + 1}.`);
          tryListen(port + 1);
          return;
        }

        if (isPortInUseError(error)) {
          reject(new Error(`Port ${port} is already in use. Stop the existing process or start with PORT=<port>.`, { cause: error }));
          return;
        }

        reject(error);
      });

      server.listen(port, () => {
        console.log(`Codex Project Bot GUI running at ${formatAddress(port)}`);
        resolve({ server, port });
      });
    };

    tryListen(startPort);
  });
}

const isDirectExecution = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;

if (isDirectExecution) {
  await startServer();
}
