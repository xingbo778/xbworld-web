import { test, expect } from '@playwright/test';

test.describe('Timing test', () => {
  test.describe.configure({ timeout: 90_000 });

  test.afterEach(async ({ page }) => {
    const t = Date.now();
    await page.close({ runBeforeUnload: false });
    console.log('[afterEach] page.close took', Date.now() - t, 'ms');
  });

  test('step-by-step timing', async ({ page }) => {
    let t = Date.now();

    console.log('[test] starting goto...');
    await page.goto('http://127.0.0.1:3000/webclient/index.html', { waitUntil: 'domcontentloaded' });
    console.log('[test] goto done in', Date.now() - t, 'ms');

    t = Date.now();
    console.log('[test] starting waitForTimeout(2000)...');
    await page.waitForTimeout(2000);
    console.log('[test] waitForTimeout done in', Date.now() - t, 'ms');

    t = Date.now();
    console.log('[test] starting screenshot...');
    await page.screenshot({ path: 'test-results/timing-screenshot.png' });
    console.log('[test] screenshot done in', Date.now() - t, 'ms');

    expect(1).toBe(1);
  });
});
