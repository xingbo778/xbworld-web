import { test, expect } from '@playwright/test';

test.describe('Tab Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/webclient/index.html');
    // Wait for JS to load and render the intro dialog
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
    // Wait for tabs to be visible
    await page.waitForSelector('#tabs_menu', { state: 'visible', timeout: 5000 });
  });

  test('should display tab menu', async ({ page }) => {
    const tabMenu = page.locator('#tabs_menu');
    await expect(tabMenu).toBeVisible();
  });

  test('should show map tab by default', async ({ page }) => {
    const mapTab = page.locator('#tabs-map');
    await expect(mapTab).toBeVisible();
  });

  // Note: civ_tab and cities_tab are removed in observer mode (civClientInit)
  // so we only test tabs that exist in observer mode

  test('should switch to research tab', async ({ page }) => {
    await page.click('#tech_tab a');
    const techTab = page.locator('#tabs-tec');
    await expect(techTab).toBeVisible();
  });

  test('should switch to nations tab', async ({ page }) => {
    await page.click('#players_tab a');
    const natTab = page.locator('#tabs-nat');
    await expect(natTab).toBeVisible();
  });

  test('should switch to options tab', async ({ page }) => {
    await page.click('#opt_tab a');
    const optTab = page.locator('#tabs-opt');
    await expect(optTab).toBeVisible();
  });

  test('should switch back to map tab', async ({ page }) => {
    await page.click('#opt_tab a');
    await page.click('#map_tab a');
    const mapTab = page.locator('#tabs-map');
    await expect(mapTab).toBeVisible();
  });

  test('should highlight active tab', async ({ page }) => {
    await page.click('#opt_tab a');
    const optLi = page.locator('#opt_tab');
    await expect(optLi).toHaveClass(/ui-state-active/);
  });
});
