/**
 * Playwright config for the map rendering diagnostic test.
 * Starts a local Vite dev server (serves built main.js) and proxies
 * WebSocket + API requests to the Railway backend.
 *
 * Usage:
 *   npx playwright test tests/e2e/diag-map-render.spec.ts --config playwright.diag-local.config.ts
 */
import { defineConfig, devices } from '@playwright/test';

const BACKEND = process.env.BACKEND_URL || 'https://xbworld-web-production.up.railway.app';
const VITE_PORT = 3000;

export default defineConfig({
  testDir: './tests/e2e',
  testMatch: 'diag-map-render.spec.ts',
  fullyParallel: false,
  retries: 0,
  workers: 1,
  reporter: 'list',
  timeout: 120_000,
  use: {
    baseURL: `http://localhost:${VITE_PORT}`,
    headless: false,
    slowMo: 0,
    screenshot: 'on',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
  webServer: {
    command: `BACKEND_URL=${BACKEND} npx vite --config vite.config.dev.ts --port ${VITE_PORT}`,
    port: VITE_PORT,
    reuseExistingServer: true,
    timeout: 30_000,
  },
});
