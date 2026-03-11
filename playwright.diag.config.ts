import { defineConfig, devices } from '@playwright/test';
export default defineConfig({
  testDir: '/Users/administrator/code/xbworld/xbw/xbworld-web/tests/e2e',
  testMatch: 'diagnose-loading.spec.ts',
  fullyParallel: false,
  retries: 0,
  workers: 1,
  reporter: 'list',
  timeout: 60_000,
  use: {
    baseURL: 'https://xbworld-web-production.up.railway.app',
    headless: false,
    slowMo: 0,
    screenshot: 'on',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
});
