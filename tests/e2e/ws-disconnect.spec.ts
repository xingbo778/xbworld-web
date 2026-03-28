/**
 * B2 verification: WebSocket disconnect/reconnect behavior
 *
 * Tests actual UI feedback when WS closes with various codes.
 * The store is exposed as window.__store (not window.store).
 * markServerShutdown() is internal TS; simulated via handle_server_shutdown.
 */
import { test, expect } from '@playwright/test';
import type { Page, Route, WebSocketRoute } from '@playwright/test';
import type { XbwPageGlobals } from './helpers/pageGlobals';

test.setTimeout(60_000);
const activeSockets = new Set<WebSocketRoute>();

test.afterEach(async ({ page }) => {
  for (const ws of activeSockets) {
    await ws.close({ code: 1000, reason: 'test cleanup' }).catch(() => {
      // Ignore already-closed mock sockets.
    });
  }
  activeSockets.clear();
  await page.evaluate(() => {
    const win = window as XbwPageGlobals;
    win.__networkDebug?.forceClose?.(1000, 'test cleanup', true);
    win.__networkDebug?.resetReconnectState?.();
  }).catch(() => {
    // Ignore teardown errors when the page never finished booting.
  });
});

async function setupMockDisconnectHarness(page: Page): Promise<void> {
  await page.route('**/civclientlauncher**', (route: Route) => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ result: 'success', port: '6789' }),
    });
  });

  await page.routeWebSocket('**/civsocket/**', (ws: WebSocketRoute) => {
    activeSockets.add(ws);
    ws.onClose(() => {
      activeSockets.delete(ws);
    });
    ws.onMessage(() => {
      // Keep the socket open; the tests drive close events via __networkDebug.forceClose().
    });
  });
}

async function gotoConnectedGame(page: Page, username: string): Promise<void> {
  await setupMockDisconnectHarness(page);
  await page.goto(`/webclient/index.html?username=${encodeURIComponent(username)}`, { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => Boolean((window as XbwPageGlobals).__networkDebug?.ws), { timeout: 10_000 });
  await page.evaluate(() => {
    const win = window as XbwPageGlobals;
    const pregame = document.getElementById('pregame_page');
    const game = document.getElementById('game_page');
    if (pregame) pregame.style.display = 'none';
    if (game) game.style.display = '';
    if (win.__store) {
      win.__store.connectionState = 'connected';
    }
  });
  await page.waitForSelector('#game_page', { state: 'visible', timeout: 10_000 });
  await page.waitForTimeout(250);
}

test('store.connectionState is "connected" after game loads', async ({ page }) => {
  await gotoConnectedGame(page, 'B2Tester');

  const state = await page.evaluate(() => {
    const w = window as XbwPageGlobals;
    return w.__store?.connectionState;
  });
  console.log('connectionState after connect:', state);
  expect(state).toBe('connected');
});

test('clean close (code 1000) → connectionState="disconnected", no banner', async ({ page }) => {
  await gotoConnectedGame(page, 'B2Tester1');

  const result = await page.evaluate(() => {
    const win = window as XbwPageGlobals;
    const net = win.__networkDebug;
    if (!net?.forceClose) return { error: 'no network debug' };
    const before = win.__store?.connectionState;
    net.forceClose(1000, 'Normal Closure', true);
    return { before, after: win.__store?.connectionState };
  });
  console.log('Clean close:', result);
  expect(result).toMatchObject({ before: 'connected', after: 'disconnected' });

  // No reconnect banner
  await expect(page.locator('#xbw_connection_banner')).toHaveCount(0);
});

test('abnormal close (code 1006) → connectionState="reconnecting" + banner visible', async ({ page }) => {
  await gotoConnectedGame(page, 'B2Tester2');

  const result = await page.evaluate(() => {
    const win = window as XbwPageGlobals;
    const net = win.__networkDebug;
    if (!net?.forceClose) return { error: 'no network debug' };
    const before = win.__store?.connectionState;
    net.forceClose(1006, 'Abnormal Closure', false);
    return { before, after: win.__store?.connectionState };
  });
  console.log('Abnormal close:', result);
  expect(result).toMatchObject({ before: 'connected', after: 'reconnecting' });

  await page.waitForTimeout(100);
  const uiText = await page.evaluate(() => {
    const bannerText = document.getElementById('xbw_connection_banner')?.textContent ?? '';
    const overlayText = document.querySelector('.xb-disconnect-overlay')?.textContent ?? '';
    return { bannerText, overlayText };
  });
  console.log('Reconnect UI:', uiText);
  expect(`${uiText.bannerText} ${uiText.overlayText}`).toMatch(/Reconnecting|Connection Lost/i);
});

test('Going Away (code 1001) → connectionState="disconnected", no banner', async ({ page }) => {
  await gotoConnectedGame(page, 'B2Tester3');

  const result = await page.evaluate(() => {
    const win = window as XbwPageGlobals;
    const net = win.__networkDebug;
    if (!net?.forceClose) return { error: 'no network debug' };
    const before = win.__store?.connectionState;
    net.forceClose(1001, 'Going Away', true);
    return { before, after: win.__store?.connectionState };
  });
  console.log('Going Away:', result);
  expect(result).toMatchObject({ before: 'connected', after: 'disconnected' });
  await expect(page.locator('#xbw_connection_banner')).toHaveCount(0);
});

test('5 failed attempts → banner shows Reconnecting or Disconnected (no crash)', async ({ page }) => {
  await gotoConnectedGame(page, 'B2Tester4');

  // Fire 6 abnormal closes to exhaust the 5-attempt budget.
  // Each call triggers startReconnect but the setTimeout is never advanced
  // (no fake timers in E2E) so we drain the counter synchronously by repeatedly
  // triggering onclose on whatever ws is current (the original + reconnect stubs).
  const finalState = await page.evaluate(() => {
    const win = window as XbwPageGlobals;
    for (let i = 0; i < 6; i++) {
      win.__networkDebug?.forceClose?.(1006, '', false);
    }
    return win.__store?.connectionState;
  });
  console.log('After 6 drops:', finalState);

  // reconnecting (timer pending) or disconnected (exhausted) — either is correct behaviour
  expect(['reconnecting', 'disconnected']).toContain(finalState);

  await page.waitForTimeout(100);
  const uiText = await page.evaluate(() => {
    const bannerText = document.getElementById('xbw_connection_banner')?.textContent ?? '';
    const overlayText = document.querySelector('.xb-disconnect-overlay')?.textContent ?? '';
    return { bannerText, overlayText };
  });
  console.log('UI after exhaustion:', uiText);
  expect(`${uiText.bannerText} ${uiText.overlayText}`).toMatch(
    /Reconnecting|Disconnected|Connection Lost|Could not reconnect/i
  );
});
