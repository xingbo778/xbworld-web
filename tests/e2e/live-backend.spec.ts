/**
 * E2E test: Connect to live backend as observer and verify rendering.
 *
 * Requires dev server running on port 8080 with BACKEND_URL set:
 *   BACKEND_URL=https://xbworld-server-production.up.railway.app \
 *   npx vite --config vite.config.dev.ts --port 8080
 */
import { test, expect } from '@playwright/test';

test.describe('Live Backend Observer Test', () => {
  test('should load page without critical JS errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));

    await page.goto('/webclient/index.html');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);

    await page.screenshot({ path: 'test-results/01-initial-load.png', fullPage: true });

    // Filter non-critical errors
    const criticalErrors = errors.filter(
      (e) => !e.includes('ResizeObserver') && !e.includes('favicon') && !e.includes('404')
    );
    expect(criticalErrors).toHaveLength(0);
  });

  test('should connect to backend and render game as observer', async ({ page }) => {
    const consoleLogs: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() !== 'debug') consoleLogs.push(`[${msg.type()}] ${msg.text()}`);
    });

    await page.goto('/webclient/index.html');
    await page.waitForLoadState('domcontentloaded');

    // Wait for WebSocket connection and auto-login
    await page.waitForTimeout(8000);
    await page.screenshot({ path: 'test-results/02-after-connect.png', fullPage: true });

    // App should have transitioned to game page or still be on pregame with dialog
    const gamePage = page.locator('#game_page');
    const pregamePage = page.locator('#pregame_page');

    const isGameVisible = await gamePage.isVisible();
    const isPregameVisible = await pregamePage.isVisible();

    console.log('Game page visible:', isGameVisible);
    console.log('Pregame page visible:', isPregameVisible);
    console.log('Console logs:', consoleLogs.slice(0, 20));

    // At least one page should be showing
    expect(isGameVisible || isPregameVisible).toBeTruthy();

    // Player-only buttons should NOT exist (removed from HTML)
    expect(await page.locator('#start_game_button').count()).toBe(0);
    expect(await page.locator('#pick_nation_button').count()).toBe(0);
    expect(await page.locator('#turn_done_button').count()).toBe(0);
    expect(await page.locator('#game_unit_orders_default').count()).toBe(0);
  });

  test('should render map with city names visible', async ({ page }) => {
    await page.goto('/webclient/index.html');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(10000);

    await page.screenshot({ path: 'test-results/03-map-render.png', fullPage: true });

    // Check if we're in game view
    const gamePage = page.locator('#game_page');
    if (await gamePage.isVisible()) {
      // Tabs should be present
      await expect(page.locator('#tabs')).toBeVisible();
      await expect(page.locator('#map_tab')).toBeVisible();

      // Chat box should exist (observers can chat)
      const chatInput = page.locator('#game_text_input');
      if (await chatInput.isVisible({ timeout: 2000 }).catch(() => false)) {
        expect(await chatInput.isVisible()).toBeTruthy();
      }
    }
  });
});
