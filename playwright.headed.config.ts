/**
 * Playwright config for headed browser testing with mock backend.
 * Runs tests visually so you can watch the flows in real time.
 *
 * Usage:
 *   # 1. Start mock backend in another terminal:
 *   #    MOCK_PORT=8002 node mock-backend.mjs
 *   #
 *   # 2. Run headed tests:
 *   #    npx playwright test --config playwright.headed.config.ts
 */
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false,   // serial so you can watch each test
  forbidOnly: false,
  retries: 0,
  workers: 1,
  reporter: [['html', { open: 'never' }], ['list']],
  timeout: 180_000,
  use: {
    baseURL: 'http://localhost:8080',
    headless: false,
    slowMo: 50,             // slight slowdown so flows are visible
    trace: 'on',
    screenshot: 'on',
    video: 'on',
  },
  projects: [
    {
      name: 'chromium-headed',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'BACKEND_URL=http://localhost:8002 npx vite --config vite.config.dev.ts --port 8080',
    port: 8080,
    reuseExistingServer: true,
    timeout: 30_000,
  },
});
