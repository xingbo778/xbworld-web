import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: '.',
  fullyParallel: false,
  retries: 0,
  workers: 1,
  reporter: 'list',
  timeout: 300_000,
  use: {
    baseURL: 'http://localhost:8081',
    headless: false,          // headed — WebGL available
    trace: 'off',
    screenshot: 'only-on-failure',
    launchOptions: {
      args: [
        '--enable-gpu',
        '--no-sandbox',
        '--disable-setuid-sandbox',
      ],
    },
  },
  projects: [
    {
      name: 'chromium-headed',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'echo "Using pre-started dev server"',
    port: 8081,
    reuseExistingServer: true,
    timeout: 5_000,
  },
});
