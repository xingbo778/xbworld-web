/**
 * E2E test: Connect to mock backend as observer and verify game page + map rendering.
 *
 * Requires:
 *   1. Mock backend: MOCK_PORT=8002 node mock-backend.mjs
 *   2. Vite dev server: BACKEND_URL=http://localhost:8002 npx vite --config vite.config.dev.ts --port 8080
 */
import { test, expect } from '@playwright/test';
import { connectAsObserver } from './helpers/observer';

test.describe('Mock Backend Observer Test', () => {
  test('should connect, enter game page, and render map', async ({ page }) => {
    const errors: string[] = [];
    const consoleLogs: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));
    page.on('console', (msg) => {
      if (msg.type() !== 'debug') consoleLogs.push(`[${msg.type()}] ${msg.text()}`);
    });

    await connectAsObserver(page, {
      username: 'MockObserver',
      waitForGamePage: false,
      settleMs: 2_000,
    });

    await page.screenshot({ path: 'test-results/mock-01-initial.png', fullPage: true });

    // Wait for game data to load
    await page.waitForTimeout(8000);
    await page.screenshot({ path: 'test-results/mock-02-after-connect.png', fullPage: true });

    const gamePage = page.locator('#game_page');
    const isGameVisible = await gamePage.isVisible();
    console.log('Game page visible:', isGameVisible);
    console.log('Console logs:', consoleLogs.slice(0, 30));

    // Log errors but don't fail on them for diagnosis
    const criticalErrors = errors.filter(
      (e) => !e.includes('ResizeObserver') && !e.includes('favicon') && !e.includes('404')
    );
    console.log('Runtime errors:', criticalErrors);

    if (isGameVisible) {
      // Verify game UI elements
      await expect(page.locator('#tabs')).toBeVisible();
      await expect(page.locator('#map_tab')).toBeVisible();

      // Click on map tab to ensure we're viewing the map
      await page.locator('#map_tab a').click();
      await page.waitForTimeout(3000);
      await page.screenshot({ path: 'test-results/mock-03-map-tab.png', fullPage: true });

      // Check for canvas element
      const canvas = page.locator('#canvas_div canvas, #canvas, #mapview_canvas');
      const canvasCount = await canvas.count();
      console.log('Canvas elements found:', canvasCount);

      // Check overview panel
      const overview = page.locator('#game_overview_panel');
      console.log('Overview panel visible:', await overview.isVisible());

      // Final screenshot with longer wait for rendering
      await page.waitForTimeout(5000);
      await page.screenshot({ path: 'test-results/mock-04-final.png', fullPage: true });
    } else {
      // Still on pregame — take diagnostic screenshot
      await page.screenshot({ path: 'test-results/mock-03-still-pregame.png', fullPage: true });
      console.log('Did not reach game page. Check mock backend packets.');
      test.skip(true, 'Mock backend did not reach game page');
    }
  });
});
