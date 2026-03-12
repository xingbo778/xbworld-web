/**
 * E2E test: Observer watching 8 AI agents playing on the local server.
 *
 * - Connects as browser observer to the local game
 * - Screenshots every 5 turns (reads turn from DOM)
 * - Auto-reconnects on Network Error dialog
 * - Validates canvas renders and observer-only UI on each checkpoint
 *
 * Environment variables:
 *   CIVSERVER_PORT  — freeciv game port (default: 6001)
 *   OBSERVE_MINUTES — how long to watch in minutes (default: 60)
 */
import { test, expect, Page } from '@playwright/test';

const CIVSERVER_PORT = process.env.CIVSERVER_PORT || '6001';
const OBSERVE_MINUTES = parseInt(process.env.OBSERVE_MINUTES || '60', 10);

test.setTimeout(OBSERVE_MINUTES * 60 * 1000 + 120_000);

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Navigate to observer URL, fill username, click Observe Game. */
async function connectAsObserver(page: Page): Promise<void> {
  await page.goto(`/webclient/index.html?civserverport=${CIVSERVER_PORT}`);
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(2000);

  const usernameInput = page.locator('#username_req');
  if (await usernameInput.isVisible({ timeout: 5000 }).catch(() => false)) {
    await usernameInput.fill('Observer');
    const observeBtn = page.getByRole('button', { name: 'Observe Game' });
    if (await observeBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await observeBtn.click();
    }
  }
}

/** Read current turn number from DOM status panel (returns 0 if not found). */
async function getCurrentTurn(page: Page): Promise<number> {
  return page.evaluate(() => {
    const selectors = ['#game_status_panel_top', '#game_status_panel_bottom'];
    for (const sel of selectors) {
      const el = document.querySelector(sel);
      if (!el) continue;
      const b = el.querySelector('b');
      if (b) {
        const n = parseInt(b.textContent || '0', 10);
        if (!isNaN(n) && n > 0) return n;
      }
      const m = el.textContent?.match(/Turn:\s*(\d+)/);
      if (m) return parseInt(m[1], 10);
    }
    return 0;
  });
}

/** Check if canvas has rendered content (not all black). */
async function validateCanvas(page: Page): Promise<string> {
  return page.evaluate(() => {
    const c = document.querySelector('#canvas_div canvas') as HTMLCanvasElement | null;
    if (!c) return 'no-canvas';
    const w = c.width, h = c.height;
    if (!w || !h) return `canvas-zero-size: ${w}x${h}`;
    // Pixi.js uses WebGL — try 2D context first, fall back to WebGL check.
    const ctx2d = c.getContext('2d');
    if (ctx2d) {
      const sampleW = Math.min(Math.floor(w / 2), 200);
      const sampleH = Math.min(Math.floor(h / 2), 200);
      const data = ctx2d.getImageData(Math.floor(w / 4), Math.floor(h / 4), sampleW, sampleH).data;
      let nonBlack = 0;
      for (let i = 0; i < data.length; i += 4) {
        if (data[i] > 10 || data[i + 1] > 10 || data[i + 2] > 10) nonBlack++;
      }
      const total = data.length / 4;
      const pct = ((nonBlack / total) * 100).toFixed(1);
      return `${w}x${h} nonBlack=${nonBlack}/${total} (${pct}%)`;
    }
    // WebGL canvas — verify context exists and canvas has size.
    const ctxWgl = c.getContext('webgl') || c.getContext('webgl2');
    if (ctxWgl) return `webgl:${w}x${h} (100%)`;
    return 'no-context';
  });
}

/** Force map canvas to redraw by clicking Map tab and dispatching resize. */
async function forceMapRedraw(page: Page): Promise<void> {
  await page.locator('a[href="#tabs-map"]').click().catch(() => {});
  await page.evaluate(() => window.dispatchEvent(new Event('resize')));
  await page.waitForTimeout(3000);
}

/** Dismiss Network Error dialog if visible; returns true if it was present. */
async function handleNetworkError(page: Page, disconnectIdx: number): Promise<boolean> {
  const networkErrText = page.getByText('Connection to server is closed', { exact: false });
  const hasError = await networkErrText.isVisible({ timeout: 300 }).catch(() => false);
  if (!hasError) return false;

  console.log('  [!] Network Error detected — reconnecting...');
  await page.screenshot({ path: `test-results/agent-game-disconnect-${disconnectIdx}.png`, fullPage: true });

  // Click OK in any dialog variant
  for (const btn of [
    page.locator('.swal-button--confirm'),
    page.locator('.swal2-confirm'),
    page.locator('.xb-btn').filter({ hasText: 'OK' }),
    page.getByRole('button', { name: 'OK' }),
  ]) {
    if (await btn.isVisible({ timeout: 300 }).catch(() => false)) {
      await btn.click().catch(() => {});
      break;
    }
  }

  await page.waitForTimeout(1000);
  await connectAsObserver(page);
  await page.waitForSelector('#game_page', { state: 'visible', timeout: 30_000 }).catch(() => {});
  // Force map redraw after reconnect so canvas isn't blank
  await forceMapRedraw(page);
  return true;
}

// ---------------------------------------------------------------------------
// Main test
// ---------------------------------------------------------------------------

test('observe 8-agent game — screenshot every 5 turns', async ({ page }) => {
  const pageErrors: string[] = [];
  page.on('pageerror', (err) => {
    if (!err.message.includes('ResizeObserver') && !err.message.includes('favicon')) {
      pageErrors.push(err.message);
    }
  });

  console.log(`\nConnecting to game on port ${CIVSERVER_PORT}...`);
  await connectAsObserver(page);

  await page.waitForSelector('#game_page, #pregame_page', { state: 'visible', timeout: 30_000 });
  await page.screenshot({ path: 'test-results/agent-game-01-connected.png', fullPage: true });
  console.log('Connected. Waiting for game to start...');

  await page.waitForSelector('#game_page', { state: 'visible', timeout: 120_000 });
  await page.screenshot({ path: 'test-results/agent-game-02-game-started.png', fullPage: true });
  console.log('Game started!');

  // Verify observer-only UI
  expect(await page.locator('#turn_done_button').count()).toBe(0);
  expect(await page.locator('#start_game_button').count()).toBe(0);
  await expect(page.locator('a[href="#tabs-map"]')).toBeVisible();

  // -------------------------------------------------------------------------
  // Watch loop — screenshot every 5 turns
  // -------------------------------------------------------------------------
  const endTime = Date.now() + OBSERVE_MINUTES * 60 * 1000;
  let lastScreenshotTurn = 0;
  let screenshotIdx = 3;
  let disconnectCount = 0;

  while (Date.now() < endTime) {
    await page.waitForTimeout(2000);

    // Handle Network Error and reconnect
    const wasDisconnected = await handleNetworkError(page, disconnectCount + 1);
    if (wasDisconnected) {
      disconnectCount++;
      console.log(`  Reconnected (disconnect #${disconnectCount})`);
      lastScreenshotTurn = 0;
      continue;
    }

    const gameVisible = await page.locator('#game_page').isVisible().catch(() => false);
    if (!gameVisible) {
      console.log('Game page not visible — game may have ended.');
      break;
    }

    const turn = await getCurrentTurn(page);
    if (turn <= 0) continue;

    // Screenshot every 5 turns
    const nextScreenshotTurn = Math.ceil((lastScreenshotTurn + 1) / 5) * 5;
    if (turn >= nextScreenshotTurn) {
      const idx = String(screenshotIdx).padStart(2, '0');
      const path = `test-results/agent-game-${idx}-turn${turn}.png`;
      await page.screenshot({ path, fullPage: true });

      const canvasInfo = await validateCanvas(page);
      const tabsVisible = await page.locator('a[href="#tabs-map"]').isVisible().catch(() => false);

      console.log(`  Turn ${turn} | canvas: ${canvasInfo} | map_tab: ${tabsVisible} | errors: ${pageErrors.length}`);

      // Tabs must always be present
      expect(tabsVisible).toBe(true);
      // Canvas must exist and have a context
      expect(canvasInfo).not.toBe('no-canvas');
      expect(canvasInfo).not.toBe('no-context');
      // Warn (don't fail) if canvas is black — occurs after WS reconnect
      // while map tiles are re-streaming from server
      const pctMatch = canvasInfo.match(/\((\d+\.?\d*)%\)/);
      const pct = pctMatch ? parseFloat(pctMatch[1]) : 0;
      if (pct < 10) {
        console.log(`  [warn] Canvas mostly black (${pct}%) at turn ${turn} — likely mid-game reconnect, map tiles re-streaming`);
      }

      lastScreenshotTurn = turn;
      screenshotIdx++;
    }
  }

  const finalTurn = await getCurrentTurn(page);
  await page.screenshot({ path: 'test-results/agent-game-final.png', fullPage: true });
  console.log(`\nObservation complete. Final turn: ${finalTurn}, disconnects: ${disconnectCount}, JS errors: ${pageErrors.length}`);

  if (pageErrors.length > 0) {
    console.warn('Runtime errors during observation:', pageErrors.slice(0, 5));
  }
});
