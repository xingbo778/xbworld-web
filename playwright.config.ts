import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  timeout: 30_000,
  use: {
    baseURL: 'http://127.0.0.1:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'BACKEND_URL=http://127.0.0.1:8080 npx vite --config vite.config.dev.ts --port 3000 --host 127.0.0.1',
    url: 'http://127.0.0.1:3000/webclient/index.html',
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});
