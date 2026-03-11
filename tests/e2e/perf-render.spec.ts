/**
 * Render performance test — wait for sprites to load, then measure actual tile rendering.
 */
import { test, expect } from '@playwright/test';

const BASE = process.env.TEST_BASE_URL || 'http://localhost:8080';
const RND = Math.random().toString(36).slice(2, 6).toUpperCase();
const PAGE_URL = `${BASE}/webclient/index.html?username=Perf${RND}`;

test('sprite loading + render timing', async ({ page }) => {
  test.setTimeout(120_000);

  const errors: string[] = [];
  page.on('pageerror', e => errors.push(e.message));

  await page.goto(PAGE_URL, { waitUntil: 'domcontentloaded' });

  // Wait for game running
  await page.waitForFunction(
    () => (window as any).__store?.civclientState === 2,
    { timeout: 60_000 }
  );
  console.log('✅ Game running');

  // Wait for sprites to finish loading (up to 30s)
  const [spriteMs] = await Promise.all([
    (async () => {
      const t0 = Date.now();
      await page.waitForFunction(
        () => Object.keys((window as any).__store?.sprites || {}).length > 0,
        { timeout: 30_000 }
      );
      return Date.now() - t0;
    })()
  ]).catch(() => [-1]);

  const state = await page.evaluate(() => {
    const store = (window as any).__store;
    const sprites = store?.sprites || {};
    const tiles = store?.tiles || {};
    const tileCount = Object.keys(tiles).length;
    const spriteCount = Object.keys(sprites).length;

    // Check canvas
    const canvas = document.getElementById('canvas') as HTMLCanvasElement | null;
    let hasContent = false;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const px = ctx.getImageData(0, 0, canvas.width, canvas.height);
        hasContent = px.data.some(v => v > 0);
      }
    }

    return { spriteCount, tileCount, hasContent, mapInfo: store?.mapInfo };
  });

  console.log('\n=== Sprite + tile state ===');
  console.log(JSON.stringify(state, null, 2));
  console.log(`Sprite load time: ${spriteMs}ms`);

  await page.screenshot({ path: 'test-results/render-after-sprites.png' });

  // Frame rate after sprites loaded
  const frames = await page.evaluate(() => new Promise<number[]>(resolve => {
    const gaps: number[] = [];
    let last = performance.now();
    let count = 0;
    function tick() {
      const now = performance.now();
      gaps.push(now - last);
      last = now;
      count++;
      if (count < 60) requestAnimationFrame(tick);
      else resolve(gaps.slice(1)); // skip first frame
    }
    requestAnimationFrame(tick);
  }));

  const avg = frames.reduce((s, f) => s + f, 0) / frames.length;
  const sorted = [...frames].sort((a, b) => a - b);
  const p95 = sorted[Math.floor(sorted.length * 0.95)];
  const fps = Math.round(1000 / avg);

  console.log(`\n=== Frame rate after sprites (60 frames) ===`);
  console.log(`avg: ${avg.toFixed(1)}ms, p95: ${p95.toFixed(1)}ms, fps: ${fps}`);

  // Drag test
  const canvasBox = await page.locator('#canvas_div canvas').first().boundingBox();
  if (canvasBox) {
    const cx = canvasBox.x + canvasBox.width / 2;
    const cy = canvasBox.y + canvasBox.height / 2;

    const dragFrames = await page.evaluate(() => new Promise<number[]>(resolve => {
      const gaps: number[] = [];
      let last = performance.now();
      let count = 0;
      function tick() {
        const now = performance.now();
        gaps.push(now - last);
        last = now;
        count++;
        if (count < 40) requestAnimationFrame(tick);
        else resolve(gaps.slice(1));
      }
      requestAnimationFrame(tick);
    }));

    await page.mouse.move(cx, cy);
    await page.mouse.down();
    for (let i = 0; i < 30; i++) {
      await page.mouse.move(cx + (i + 1) * 8, cy);
      await page.waitForTimeout(16);
    }
    await page.mouse.up();

    await page.screenshot({ path: 'test-results/render-after-drag.png' });
  }

  console.log('\n=== Errors ===');
  errors.forEach(e => console.log(' ', e));

  expect(state.spriteCount).toBeGreaterThan(0);
  expect(fps).toBeGreaterThan(30);
});
