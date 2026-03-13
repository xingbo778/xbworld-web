/**
 * Playwright config for CI (headless, no slowMo, strict mode).
 *
 * Usage:
 *   npx playwright test --config playwright.ci.config.ts
 *
 * The mock backend must already be running on port 8002, or the workflow
 * starts it before invoking Playwright.
 */
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false,
  forbidOnly: true,      // fail the run if a test.only is accidentally committed
  retries: 1,            // one retry for transient timing issues
  workers: 1,
  reporter: [['html', { open: 'never' }], ['github'], ['list']],
  timeout: 120_000,
  use: {
    baseURL: 'http://localhost:8080',
    headless: true,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium-ci',
      use: {
        ...devices['Desktop Chrome'],
        launchOptions: {
          args: [
            '--disable-background-timer-throttling',
            '--disable-renderer-backgrounding',
            '--disable-backgrounding-occluded-windows',
            '--disable-dev-shm-usage',   // avoids /dev/shm OOM in Docker/CI
          ],
        },
      },
    },
  ],
  webServer: {
    command: 'BACKEND_URL=http://localhost:8002 npx vite --config vite.config.dev.ts --port 8080',
    port: 8080,
    reuseExistingServer: false,   // always fresh in CI
    timeout: 60_000,
  },
});
