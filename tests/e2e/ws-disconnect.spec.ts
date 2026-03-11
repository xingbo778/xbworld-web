/**
 * B2 verification: WebSocket disconnect/reconnect behavior
 *
 * Tests actual UI feedback when WS closes with various codes.
 * The store is exposed as window.__store (not window.store).
 * markServerShutdown() is internal TS; simulated via handle_server_shutdown.
 */
import { test, expect } from '@playwright/test';

test.setTimeout(60_000);

test('store.connectionState is "connected" after game loads', async ({ page }) => {
  await page.goto('/webclient/index.html?username=B2Tester', { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('#game_page', { state: 'visible', timeout: 25_000 });
  await page.waitForTimeout(1500);

  const state = await page.evaluate(() => (window as any).__store?.connectionState);
  console.log('connectionState after connect:', state);
  expect(state).toBe('connected');
});

test('clean close (code 1000) → connectionState="disconnected", no banner', async ({ page }) => {
  await page.goto('/webclient/index.html?username=B2Tester1', { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('#game_page', { state: 'visible', timeout: 25_000 });
  await page.waitForTimeout(1500);

  const result = await page.evaluate(() => {
    const win = window as any;
    const ws = win.ws;
    if (!ws) return { error: 'no ws object' };
    const before = win.__store?.connectionState;
    ws.onclose?.(new CloseEvent('close', { code: 1000, reason: 'Normal Closure', wasClean: true }));
    return { before, after: win.__store?.connectionState };
  });
  console.log('Clean close:', result);
  expect(result).toMatchObject({ before: 'connected', after: 'disconnected' });

  // No reconnect banner
  await expect(page.locator('#xbw_connection_banner')).toHaveCount(0);
});

test('abnormal close (code 1006) → connectionState="reconnecting" + banner visible', async ({ page }) => {
  await page.goto('/webclient/index.html?username=B2Tester2', { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('#game_page', { state: 'visible', timeout: 25_000 });
  await page.waitForTimeout(1500);

  const result = await page.evaluate(() => {
    const win = window as any;
    const ws = win.ws;
    if (!ws) return { error: 'no ws object' };
    const before = win.__store?.connectionState;
    ws.onclose?.(new CloseEvent('close', { code: 1006, reason: 'Abnormal Closure', wasClean: false }));
    return { before, after: win.__store?.connectionState };
  });
  console.log('Abnormal close:', result);
  expect(result).toMatchObject({ before: 'connected', after: 'reconnecting' });

  // Reconnect banner should appear (injected synchronously by startReconnect).
  // The banner is a span inside an empty div (game_status_panel_top) so it has
  // no layout height — check textContent rather than visibility.
  await page.waitForFunction(
    () => !!document.getElementById('xbw_connection_banner')?.textContent,
    { timeout: 2000 }
  );
  const bannerEl = page.locator('#xbw_connection_banner');
  const text = await bannerEl.textContent();
  console.log('Banner text:', text);
  expect(text).toMatch(/Reconnecting/i);
});

test('Going Away (code 1001) → connectionState="disconnected", no banner', async ({ page }) => {
  await page.goto('/webclient/index.html?username=B2Tester3', { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('#game_page', { state: 'visible', timeout: 25_000 });
  await page.waitForTimeout(1500);

  const result = await page.evaluate(() => {
    const win = window as any;
    const ws = win.ws;
    if (!ws) return { error: 'no ws object' };
    const before = win.__store?.connectionState;
    ws.onclose?.(new CloseEvent('close', { code: 1001, reason: 'Going Away', wasClean: true }));
    return { before, after: win.__store?.connectionState };
  });
  console.log('Going Away:', result);
  expect(result).toMatchObject({ before: 'connected', after: 'disconnected' });
  await expect(page.locator('#xbw_connection_banner')).toHaveCount(0);
});

test('5 failed attempts → banner shows Reconnecting or Disconnected (no crash)', async ({ page }) => {
  await page.goto('/webclient/index.html?username=B2Tester4', { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('#game_page', { state: 'visible', timeout: 25_000 });
  await page.waitForTimeout(1500);

  // Fire 6 abnormal closes to exhaust the 5-attempt budget.
  // Each call triggers startReconnect but the setTimeout is never advanced
  // (no fake timers in E2E) so we drain the counter synchronously by repeatedly
  // triggering onclose on whatever ws is current (the original + reconnect stubs).
  const finalState = await page.evaluate(() => {
    const win = window as any;
    for (let i = 0; i < 6; i++) {
      const ws = win.ws;
      if (ws?.onclose) {
        ws.onclose(new CloseEvent('close', { code: 1006, wasClean: false }));
      }
    }
    return win.__store?.connectionState;
  });
  console.log('After 6 drops:', finalState);

  // reconnecting (timer pending) or disconnected (exhausted) — either is correct behaviour
  expect(['reconnecting', 'disconnected']).toContain(finalState);

  await page.waitForFunction(
    () => !!document.getElementById('xbw_connection_banner')?.textContent,
    { timeout: 2000 }
  );
  const bannerText = await page.locator('#xbw_connection_banner').textContent();
  console.log('Banner after exhaustion:', bannerText);
  expect(bannerText).toMatch(/Reconnecting|Disconnected/i);
});
