import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: '/Users/administrator/code/xbworld/xbw/xbworld-web/tests/e2e',
  testMatch: 'live-backend.spec.ts',
  fullyParallel: false,
  retries: 0,
  workers: 1,
  reporter: [['list'], ['html', { open: 'never' }]],
  timeout: 60_000,
  use: {
    baseURL: 'https://xbworld-web-production.up.railway.app',
    headless: false,
    slowMo: 200,
    trace: 'on',
    screenshot: 'on',
    video: 'on',
  },
  projects: [
    { name: 'chromium-headed', use: { ...devices['Desktop Chrome'] } },
  ],
});
