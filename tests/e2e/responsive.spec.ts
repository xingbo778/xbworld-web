import { test, expect } from '@playwright/test';

/** Dismiss the intro dialog and show the game page. */
async function dismissDialogAndShowGame(page: import('@playwright/test').Page) {
  await page.waitForSelector('.xb-dialog, .ui-dialog, dialog', { timeout: 10000 }).catch(() => {});
  await page.evaluate(() => {
    // Remove all dialog types: Preact xb-dialog, jQuery UI shim, native dialog
    document.querySelectorAll('.xb-dialog, .xb-dialog-overlay, .ui-dialog, #xb-ui-dialog-overlay, dialog').forEach((d) => {
      if ('close' in d && typeof (d as any).close === 'function') (d as any).close();
      d.remove();
    });
    // Switch to game page
    const pregame = document.getElementById('pregame_page');
    const gamePage = document.getElementById('game_page');
    if (pregame) pregame.style.display = 'none';
    if (gamePage) gamePage.style.display = '';
  });
  await page.waitForSelector('#tabs_menu', { state: 'visible', timeout: 5000 });
}

test.describe('Responsive Design', () => {
  test('should adapt to mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/webclient/index.html');
    await dismissDialogAndShowGame(page);

    const tabMenu = page.locator('#tabs_menu');
    await expect(tabMenu).toBeVisible();
  });

  test('should adapt to tablet viewport', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/webclient/index.html');
    await dismissDialogAndShowGame(page);

    const tabMenu = page.locator('#tabs_menu');
    await expect(tabMenu).toBeVisible();
  });

  test('should adapt to desktop viewport', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/webclient/index.html');
    await dismissDialogAndShowGame(page);

    const tabMenu = page.locator('#tabs_menu');
    await expect(tabMenu).toBeVisible();
  });

  test('should show tab links on small screens', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/webclient/index.html');
    await dismissDialogAndShowGame(page);

    // In observer mode, civ_tab, cities_tab, opt_tab, and hel_tab are removed.
    // Verify that the remaining tabs (map, tech, players) are present.
    const mapTab = page.locator('#map_tab a');
    await expect(mapTab).toBeAttached();

    const optTab = page.locator('#players_tab a');
    await expect(optTab).toBeAttached();
  });

  test('should show tab links on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/webclient/index.html');
    await dismissDialogAndShowGame(page);

    // Verify tab links are visible on a wide viewport
    const mapTab = page.locator('#map_tab a');
    await expect(mapTab).toBeVisible();

    const techTab = page.locator('#tech_tab a');
    await expect(techTab).toBeVisible();

    const optTab = page.locator('#players_tab a');
    await expect(optTab).toBeVisible();
  });
});
