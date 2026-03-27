import { test, expect } from '@playwright/test';
import type { XbwPageGlobals } from './helpers/pageGlobals';

test.describe('Observer Auto-Connect', () => {
  test('should not show username intro form on load', async ({ page }) => {
    await page.goto('/webclient/index.html', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1500);
    await expect(page.locator('#username_req')).toHaveCount(0);
    await expect(page.getByRole('button', { name: 'Observe Game' })).toHaveCount(0);
  });

  test('should auto-connect when username query param is present', async ({ page }) => {
    await page.goto('/webclient/index.html?username=IntroSpecUser', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1500);
    const username = await page.evaluate(() => {
      const w = window as XbwPageGlobals;
      return w.__store?.username ?? null;
    });
    expect(username).toBe('IntroSpecUser');
    await expect(page.locator('#username_req')).toHaveCount(0);
  });

  test('should resolve username from localStorage when no query param is provided', async ({ page }) => {
    await page.goto('/webclient/index.html', { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => localStorage.setItem('username', 'SavedUser'));
    await page.reload({ waitUntil: 'domcontentloaded' });

    const username = await page.evaluate(() => {
      const w = window as XbwPageGlobals;
      return w.__store?.username ?? null;
    });
    expect(username).toBe('SavedUser');
  });

  test('should prefer username query param over localStorage', async ({ page }) => {
    await page.goto('/webclient/index.html', { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => localStorage.setItem('username', 'SavedUser'));
    await page.goto('/webclient/index.html?username=ParamUser', { waitUntil: 'domcontentloaded' });

    const username = await page.evaluate(() => {
      const w = window as XbwPageGlobals;
      return w.__store?.username ?? null;
    });
    expect(username).toBe('ParamUser');
  });
});
