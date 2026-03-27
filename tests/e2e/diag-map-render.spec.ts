/**
 * Diagnostic test: full live-backend map rendering check.
 * Takes screenshots at each key stage and reports pixel/state data.
 */
import { test, expect } from '@playwright/test';
import * as path from 'path';
import * as fs from 'fs';
import type { XbwPageGlobals } from './helpers/pageGlobals';

const OUT = path.join(process.cwd(), 'test-screenshots');
if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });

async function snap(page: import('@playwright/test').Page, name: string) {
  const file = path.join(OUT, `${name}.png`);
  await page.screenshot({ path: file, fullPage: false });
  console.log(`Screenshot: ${file}`);
}

async function getState(page: import('@playwright/test').Page) {
  return page.evaluate(() => {
    const w = window as XbwPageGlobals;
    const store = w.__store;
    const tiles = store?.tiles as Record<string, { known?: unknown; terrain?: number }> | undefined;
    const terrains = store?.terrains as Record<string, {
      id?: unknown;
      color_red?: unknown;
      color_green?: unknown;
      color_blue?: unknown;
    }> | undefined;
    const players = store?.players;
    const gamePage = document.getElementById('game_page');
    const pregamePage = document.getElementById('pregame_page');
    const canvases = document.querySelectorAll('#canvas_div canvas');
    const overviewImg = document.getElementById('overview_img') as HTMLCanvasElement | null;

    // Sample main canvas pixels
    let canvasPixels = 'no-canvas';
    if (canvases.length > 0) {
      const c = canvases[0] as HTMLCanvasElement;
      const ctx = c.getContext('2d');
      if (ctx && c.width > 0 && c.height > 0) {
        const sampleW = Math.min(200, Math.floor(c.width / 2));
        const sampleH = Math.min(200, Math.floor(c.height / 2));
        const d = ctx.getImageData(Math.floor(c.width / 4), Math.floor(c.height / 4), sampleW, sampleH).data;
        let nonBlack = 0;
        for (let i = 0; i < d.length; i += 4) {
          if (d[i] > 10 || d[i+1] > 10 || d[i+2] > 10) nonBlack++;
        }
        canvasPixels = `${c.width}x${c.height} nonBlack=${nonBlack}/${d.length/4}`;
      } else {
        canvasPixels = `${c.width}x${c.height} ctx=${!!ctx}`;
      }
    }

    // Sample overview canvas pixels
    let overviewPixels = 'no-overview';
    if (overviewImg) {
      const ctx = overviewImg.getContext('2d');
      if (ctx && overviewImg.width > 0 && overviewImg.height > 0) {
        const d = ctx.getImageData(0, 0, overviewImg.width, overviewImg.height).data;
        let nonBlack = 0;
        for (let i = 0; i < d.length; i += 4) {
          if (d[i] > 10 || d[i+1] > 10 || d[i+2] > 10) nonBlack++;
        }
        overviewPixels = `${overviewImg.width}x${overviewImg.height} nonBlack=${nonBlack}/${d.length/4}`;
      }
    }

    // Check chat messages for game events
    const gameChat = document.getElementById('game_message_area');
    const pregameChat = document.getElementById('pregame_message_area');

    // JS errors from window
    const sampleTile0 = tiles?.['0'];
    const sampleTerrain0 = terrains ? Object.values(terrains)[0] : null;
    const sampleTile100 = tiles?.['100'];

    // Count tiles with non-zero terrain
    let tilesWithTerrain = 0;
    if (tiles) {
      for (const t of Object.values(tiles)) {
        if (t && t.terrain && t.terrain !== 0) tilesWithTerrain++;
      }
    }

    // Sample overview diagnostics
    let overviewDiag = 'n/a';
    try {
      overviewDiag = JSON.stringify({
        handleMapInfoCalled: w.__xbwHandleMapInfoCalled,
      });
    } catch(e) {}

    // Read mapview origin via exposed store or global
    const mapviewOrigin = (() => {
      try {
        // Try to read via the store's renderer reference
        const mapview = w.__xbwMapview;
        if (mapview) return `(${mapview.x0},${mapview.y0})`;
        return 'unknown';
      } catch { return 'error'; }
    })();

    return {
      civclientState: w.__store?.civclientState,
      observing: w.__store?.observing,
      centerCalled: w.__xbwCenterCalled || 0,
      midTileNull: w.__xbwMidTileNull,
      mapviewOrigin: w.__xbwMapview ? `(${w.__xbwMapview.x0},${w.__xbwMapview.y0})` : ('__xbwMapview' in w ? 'falsy' : 'not-set'),
      tilesCount: tiles ? Object.keys(tiles).length : 0,
      tilesWithTerrain,
      terrainsCount: terrains ? Object.keys(terrains).length : -1,
      sampleTile0known: sampleTile0 != null ? sampleTile0.known : 'no-tile0',
      sampleTile0terrain: sampleTile0 != null ? sampleTile0.terrain : 'no-tile0',
      sampleTile100terrain: sampleTile100 != null ? sampleTile100.terrain : 'no-tile100',
      sampleTerrainId: sampleTerrain0 != null ? sampleTerrain0.id : 'no-terrain',
      sampleTerrainColor: sampleTerrain0 != null
        ? `rgb(${sampleTerrain0.color_red},${sampleTerrain0.color_green},${sampleTerrain0.color_blue})`
        : 'no-terrain',
      mapInfo: store?.mapInfo?.xsize ? `${store.mapInfo.xsize}x${store.mapInfo.ysize}` : null,
      storeMapInfoXsize: w.__store?.mapInfo?.xsize,
      winTilesCount: tiles ? Object.keys(tiles).length : 0,
      playersCount: players ? Object.keys(players).length : 0,
      pidsReceived: JSON.stringify(w.__xbwReceivedPids || {}).slice(0, 800),
      overviewDiag,
      game_page_display: gamePage ? getComputedStyle(gamePage).display : 'missing',
      pregame_page_display: pregamePage ? getComputedStyle(pregamePage).display : 'missing',
      canvasCount: canvases.length,
      canvasPixels,
      overviewPixels,
      overviewVisible: overviewImg ? getComputedStyle(overviewImg).display !== 'none' : false,
      gameChat: gameChat ? gameChat.textContent?.slice(0, 300) : null,
      pregameChat: pregameChat ? pregameChat.textContent?.slice(0, 300) : null,
      blockUIVisible: !!document.querySelector('.xb-block-overlay'),
      alertVisible: !!document.querySelector('.swal2-popup, [class*="MessageDialog"]'),
    };
  });
}

test('map rendering diagnostic', async ({ page }) => {
  const jsErrors: string[] = [];
  const consoleLogs: string[] = [];

  page.on('pageerror', err => {
    if (!err.message.includes('ResizeObserver') && !err.message.includes('favicon')) {
      jsErrors.push(err.message);
      console.log('[JS ERROR]', err.message);
    }
  });
  page.on('console', msg => {
    const text = msg.text();
    if (msg.type() === 'error') {
      consoleLogs.push(`[CONSOLE ERROR] ${text}`);
      console.log('[CONSOLE ERROR]', text.slice(0, 200));
    } else if (text.includes('[xbw]') || text.includes('center_on')) {
      console.log('[PAGE LOG]', text.slice(0, 300));
    }
  });

  await page.goto('/webclient/index.html?username=DiagTest1', { waitUntil: 'domcontentloaded' });
  await snap(page, '01-initial');

  // Wait for game page to appear (up to 60s)
  console.log('Waiting for game page...');
  try {
    await page.waitForFunction(() => {
      const gp = document.getElementById('game_page');
      return gp && window.getComputedStyle(gp).display !== 'none';
    }, { timeout: 60_000 });
    console.log('Game page appeared!');
  } catch {
    console.log('Game page never appeared!');
    await snap(page, '02-timeout-no-gamepage');
    const s = await getState(page);
    console.log('State at timeout:', JSON.stringify(s, null, 2));
    test.skip(true, 'Backend did not reach game page');
  }

  await snap(page, '02-game-page-visible');
  let s = await getState(page);
  console.log('State after game page:', JSON.stringify(s, null, 2));

  // Wait 5 more seconds for tiles/overview to load
  await page.waitForTimeout(5000);
  await snap(page, '03-after-5s');
  s = await getState(page);
  console.log('State at +5s:', JSON.stringify(s, null, 2));

  // Wait another 5s
  await page.waitForTimeout(5000);
  await snap(page, '04-after-10s');
  s = await getState(page);
  console.log('State at +10s:', JSON.stringify(s, null, 2));

  // Test minimap click
  const overviewImg = page.locator('#overview_img');
  const overviewVisible = await overviewImg.isVisible().catch(() => false);
  console.log('Overview visible:', overviewVisible);
  if (overviewVisible) {
    const box = await overviewImg.boundingBox();
    if (box) {
      await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
      await page.waitForTimeout(1000);
      await snap(page, '05-after-minimap-click');
    }
  }

  // Test map drag
  const canvas = page.locator('#canvas_div canvas').first();
  const canvasVisible = await canvas.isVisible().catch(() => false);
  console.log('Canvas visible:', canvasVisible);
  if (canvasVisible) {
    const box = await canvas.boundingBox();
    if (box) {
      const cx = box.x + box.width / 2;
      const cy = box.y + box.height / 2;
      await page.mouse.move(cx, cy);
      await page.mouse.down();
      await page.mouse.move(cx + 150, cy + 80, { steps: 10 });
      await page.mouse.up();
      await page.waitForTimeout(500);
      await snap(page, '06-after-drag');
      // Drag again
      await page.mouse.move(cx, cy);
      await page.mouse.down();
      await page.mouse.move(cx - 150, cy - 80, { steps: 10 });
      await page.mouse.up();
      await page.waitForTimeout(500);
      await snap(page, '07-after-drag2');
    }
  }

  const finalState = await getState(page);
  console.log('Final state:', JSON.stringify(finalState, null, 2));
  console.log('JS errors:', jsErrors);

  // Assertions
  expect(finalState.game_page_display, 'game page should be visible').not.toBe('none');
  expect(finalState.game_page_display, 'game page should be visible').not.toBe('missing');
  expect(finalState.canvasCount, 'canvas elements should exist').toBeGreaterThan(0);
  console.log('PIDs received:', finalState.pidsReceived);
  expect(finalState.tilesCount, 'should have tile data').toBeGreaterThan(0);
});
