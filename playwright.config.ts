import { defineConfig } from '@playwright/test';

const baseURL = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:4311';

export default defineConfig({
  testDir: './tests/e2e',
  use: {
    baseURL
  },
  webServer: {
    command: 'npm start',
    url: baseURL,
    reuseExistingServer: true,
    timeout: 120000
  }
});
