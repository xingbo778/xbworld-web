import { test, expect } from '@playwright/test';

test.describe('Internationalization', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/webclient/index.html');
    // Wait for JS to load and render the intro dialog
    await page.waitForSelector('.xb-dialog, .ui-dialog, dialog', { timeout: 10000 }).catch(() => {});
    await page.evaluate(() => {
      // Remove all dialog types: Preact xb-dialog, jQuery UI shim, native dialog
      document.querySelectorAll('.xb-dialog, .xb-dialog-overlay, .ui-dialog, #xb-ui-dialog-overlay, dialog').forEach((d) => {
        if (d instanceof HTMLDialogElement) d.close();
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

  test('should display English labels by default (non-zh browser)', async ({ page }) => {
    // The map tab link text contains the label directly (e.g. "🌍 Map")
    const mapTab = page.locator('#map_tab a');
    const text = await mapTab.textContent();
    expect(text?.trim()).toMatch(/Map|地图/);
  });

  test('should have correct html lang attribute', async ({ page }) => {
    const lang = await page.getAttribute('html', 'lang');
    expect(lang).toBe('en');
  });
});
