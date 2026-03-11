/**
 * Playwright config for local agent game observation.
 * Opens a headed browser to watch 8 AI agents playing on the local server.
 *
 * Usage (via runtest_local.sh):
 *   ./runtest_local.sh
 *
 * Or manually:
 *   1. Start server:  cd xbworld-server && python server.py --port 8080
 *   2. Create game:   curl -X POST 'http://localhost:8080/civclientlauncher?action=new&type=multiplayer'
 *   3. Start agents:  cd xbworld-agent && GAME_PORT=<port> python test_8agents_50turns.py
 *   4. Run this:      CIVSERVER_PORT=<port> npx playwright test --config playwright.local-agent.config.ts
 */
import { defineConfig, devices } from '@playwright/test';

const BACKEND_PORT = process.env.BACKEND_PORT || '8080';
const VITE_PORT = 3000;

export default defineConfig({
  testDir: './tests/e2e',
  testMatch: 'agent-game-observer.spec.ts',
  fullyParallel: false,
  retries: 0,
  workers: 1,
  reporter: [['list'], ['html', { open: 'never', outputFolder: 'playwright-report/agent-game' }]],
  // 1 hour max — long-running game observation
  timeout: 3_600_000,
  use: {
    baseURL: `http://localhost:${VITE_PORT}`,
    headless: false,
    slowMo: 0,
    trace: 'on',
    screenshot: 'on',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium-headed',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: `BACKEND_URL=http://localhost:${BACKEND_PORT} npx vite --config vite.config.dev.ts --port ${VITE_PORT}`,
    port: VITE_PORT,
    reuseExistingServer: true,
    timeout: 30_000,
  },
});
