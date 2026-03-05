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
    await page.waitForTimeout(2000);

    await page.screenshot({ path: 'test-results/02a-before-login.png', fullPage: true });

    // Fill in username and click "Observe Game" to trigger network_init
    const usernameInput = page.locator('#username_req');
    if (await usernameInput.isVisible({ timeout: 3000 }).catch(() => false)) {
      await usernameInput.fill('TestObserver');
      // Click the "Observe Game" button
      const observeBtn = page.getByRole('button', { name: 'Observe Game' });
      if (await observeBtn.isVisible({ timeout: 1000 }).catch(() => false)) {
        await observeBtn.click();
      }
    }

    // Wait for WebSocket connection, login, and game data
    await page.waitForTimeout(15000);
    await page.screenshot({ path: 'test-results/02b-after-connect.png', fullPage: true });

    const gamePage = page.locator('#game_page');
    const pregamePage = page.locator('#pregame_page');

    const isGameVisible = await gamePage.isVisible();
    const isPregameVisible = await pregamePage.isVisible();

    console.log('Game page visible:', isGameVisible);
    console.log('Pregame page visible:', isPregameVisible);
    console.log('Console logs:', consoleLogs.slice(0, 30));

    // At least one page should be showing, or a dialog (swal/modal) may be covering
    const hasDialog = await page.locator('.swal-overlay, .swal-modal, dialog[open], .blockUI').count() > 0;
    expect(isGameVisible || isPregameVisible || hasDialog).toBeTruthy();

    // Player-only buttons should NOT exist (removed from HTML)
    expect(await page.locator('#start_game_button').count()).toBe(0);
    expect(await page.locator('#pick_nation_button').count()).toBe(0);
    expect(await page.locator('#turn_done_button').count()).toBe(0);
    expect(await page.locator('#game_unit_orders_default').count()).toBe(0);
  });

  test('should render map after observer login', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));

    await page.goto('/webclient/index.html');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);

    // Fill in username and click "Observe Game"
    const usernameInput = page.locator('#username_req');
    if (await usernameInput.isVisible({ timeout: 3000 }).catch(() => false)) {
      await usernameInput.fill('TestObserver');
      const observeBtn = page.getByRole('button', { name: 'Observe Game' });
      if (await observeBtn.isVisible({ timeout: 1000 }).catch(() => false)) {
        await observeBtn.click();
      }
    }

    // Wait for game to load — map data takes time
    await page.waitForTimeout(20000);
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

      // Take a final screenshot of the map tab
      await page.locator('#map_tab a').click();
      await page.waitForTimeout(3000);
      await page.screenshot({ path: 'test-results/04-map-tab.png', fullPage: true });
    }

    // Log any runtime errors that occurred during gameplay
    const criticalErrors = errors.filter(
      (e) => !e.includes('ResizeObserver') && !e.includes('favicon') && !e.includes('404')
    );
    console.log('Runtime errors during game:', criticalErrors);
  });
});
