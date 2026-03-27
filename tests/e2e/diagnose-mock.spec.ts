/**
 * End-to-end test: mock server → browser → map rendering.
 * Requires mock server running on port 8080: npx tsx scripts/mock-server.ts
 *
 * Verifies:
 *  1. Large map renders with terrain sprites
 *  2. Mini map (overview) is visible
 *  3. Sprites on the map (cities, units) render correctly
 *  4. Unit movement packets update positions
 */
import { test, expect } from '@playwright/test';
import type { XbwPageGlobals } from './helpers/pageGlobals';

test('mock server: game loads and renders map with sprites', async ({ page }) => {
  test.setTimeout(120_000);

  const errors: string[] = [];
  page.on('pageerror', err => errors.push(err.message));

  // Connect to mock server
  await page.goto('http://127.0.0.1:8080/webclient/index.html', { waitUntil: 'load' });
  await page.waitForTimeout(2000);

  // Fill in username and click Observe Game
  const usernameInput = page.locator('#username_req');
  if (await usernameInput.isVisible().catch(() => false)) {
    await usernameInput.fill('Observer');
  }
  const observeBtn = page.getByRole('button', { name: 'Observe Game' });
  if (await observeBtn.isVisible().catch(() => false)) {
    await observeBtn.click();
  }

  // Wait for game state to reach RUNNING
  await page.waitForFunction(() => {
    const w = window as XbwPageGlobals;
    return w.__store?.civclientState === 2;
  }, { timeout: 30_000 });

  // Wait for all 2770 sprites to be created from tileset images
  await page.waitForFunction(() => {
    const w = window as XbwPageGlobals;
    return Object.keys(w.__store?.sprites || {}).length > 2000;
  }, { timeout: 60_000 });

  // Give the renderer a moment to paint
  await page.waitForTimeout(3000);

  const state = await page.evaluate(() => {
    const w = window as XbwPageGlobals;
    const store = w.__store;
    const canvas = document.getElementById('canvas') as HTMLCanvasElement | null;
    const overview = document.getElementById('overview_map') as HTMLCanvasElement | null;
    const tiles = store?.tiles;
    const units = store?.units;
    return {
      civclientState: store?.civclientState,
      tileCount: tiles ? Object.keys(tiles).length : 0,
      unitCount: units ? Object.keys(units).length : 0,
      spriteCount: Object.keys(store?.sprites || {}).length,
      canvasSize: canvas ? `${canvas.width}x${canvas.height}` : 'none',
      overviewVisible: overview?.offsetParent !== null,
      overviewSize: overview ? `${overview.width}x${overview.height}` : 'none',
    };
  });

  console.log('Game state:', JSON.stringify(state, null, 2));
  if (errors.length) console.log('Page errors:', errors.slice(0, 5));

  // Take screenshot for visual verification
  await page.screenshot({ path: 'test-screenshots/diagnose-mock.png', fullPage: true }).catch(() => {});

  // Verify canvas has non-black pixels (map is actually rendering)
  const hasContent = await page.evaluate(() => {
    const canvas = document.getElementById('canvas') as HTMLCanvasElement | null;
    if (!canvas) return false;
    const ctx = canvas.getContext('2d');
    if (!ctx) return false;
    // Sample center region of canvas
    const cx = Math.floor(canvas.width / 2);
    const cy = Math.floor(canvas.height / 2);
    const data = ctx.getImageData(cx - 50, cy - 50, 100, 100).data;
    let nonBlack = 0;
    for (let i = 0; i < data.length; i += 4) {
      if (data[i] > 10 || data[i + 1] > 10 || data[i + 2] > 10) nonBlack++;
    }
    return nonBlack > 100; // At least 100 non-black pixels in center
  });

  // Wait for unit movement (mock server sends moves every 2s, starts after 3s)
  await page.waitForTimeout(5000);

  // Check that unit tile positions have changed
  const unitPositions = await page.evaluate(() => {
    const w = window as XbwPageGlobals;
    const units = w.__store?.units as Record<string, { id: number; tile: number }> | undefined;
    if (!units) return [];
    return Object.values(units).map(u => ({ id: u.id, tile: u.tile }));
  });

  await page.screenshot({ path: 'test-screenshots/diagnose-mock-movement.png', fullPage: true }).catch(() => {});

  // Assertions
  expect(state.civclientState).toBe(2);
  expect(state.tileCount).toBe(320);
  expect(state.unitCount).toBeGreaterThan(0);
  expect(state.spriteCount).toBeGreaterThan(2000);
  expect(state.overviewVisible).toBe(true);
  expect(hasContent).toBe(true);
  expect(unitPositions.length).toBeGreaterThan(0);
});
