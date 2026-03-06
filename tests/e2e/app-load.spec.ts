import { test, expect } from '@playwright/test';

test.describe('Application Loading', () => {
  test('should load the index page without errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));

    await page.goto('/webclient/');
    await page.waitForLoadState('domcontentloaded');

    expect(errors).toHaveLength(0);
  });

  test('should not have player-only buttons (observer mode)', async ({ page }) => {
    await page.goto('/webclient/');
    // Wait for the TS bundle to initialize and remove observer-irrelevant elements
    await page.waitForTimeout(2000);

    expect(await page.locator('#start_game_button').count()).toBe(0);
    expect(await page.locator('#load_game_button').count()).toBe(0);
    expect(await page.locator('#pick_nation_button').count()).toBe(0);
    expect(await page.locator('#pregame_settings_button').count()).toBe(0);
    expect(await page.locator('#turn_done_button').count()).toBe(0);
    expect(await page.locator('#game_unit_orders_default').count()).toBe(0);
  });

  test('should have correct page title', async ({ page }) => {
    await page.goto('/webclient/');
    await expect(page).toHaveTitle(/XBWorld/);
  });

  test('should load CSS without errors', async ({ page }) => {
    await page.goto('/webclient/');
    const styles = await page.evaluate(() => {
      const sheets = Array.from(document.styleSheets);
      return sheets.map((s) => ({
        href: s.href,
        rules: s.cssRules?.length ?? 0,
      }));
    });
    expect(styles.length).toBeGreaterThan(0);
  });
});
