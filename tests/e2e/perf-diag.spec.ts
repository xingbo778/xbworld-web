/**
 * Performance diagnostic — understand what's blocking the main thread.
 */
import { test, expect } from '@playwright/test';
import type { XbwPageGlobals } from './helpers/pageGlobals';

const BASE = process.env.TEST_BASE_URL || 'http://localhost:8080';
const RND = Math.random().toString(36).slice(2, 6).toUpperCase();
const PAGE_URL = `${BASE}/webclient/index.html?username=Diag${RND}`;

test('diagnose rendering bottleneck', async ({ page }) => {
  test.setTimeout(120_000);

  // Capture console errors
  const errors: string[] = [];
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', e => errors.push('[pageerror] ' + e.message));

  await page.goto(PAGE_URL, { waitUntil: 'domcontentloaded' });

  // Wait for game to be running
  await page.waitForFunction(
    () => {
      const w = window as XbwPageGlobals;
      return w.__store?.civclientState === 2;
    },
    { timeout: 60_000 }
  );

  console.log('\n=== Console errors so far ===');
  for (const e of errors) console.log(' ', e);
  errors.length = 0;

  // Snapshot renderer state
  const state = await page.evaluate(() => {
    const w = window as XbwPageGlobals;
    const store = w.__store;
    const tiles = store?.tiles;
    const tileCount = tiles ? Object.keys(tiles).length : -1;
    const sprites = store?.sprites;
    const spriteCount = sprites ? Object.keys(sprites).length : -1;
    const renderer = store?.renderer;

    // Check if PixiRenderer is attached
    const canvases = document.querySelectorAll('#canvas_div canvas');
    const canvasInfo = Array.from(canvases).map(c => ({
      id: (c as HTMLCanvasElement).id,
      w: (c as HTMLCanvasElement).width,
      h: (c as HTMLCanvasElement).height,
    }));

    // Check if 2D canvas has content
    const mainCanvas = document.getElementById('canvas') as HTMLCanvasElement | null;
    let canvasHasContent = false;
    if (mainCanvas) {
      const ctx = mainCanvas.getContext('2d');
      if (ctx) {
        const px = ctx.getImageData(mainCanvas.width/2, mainCanvas.height/2, 1, 1).data;
        canvasHasContent = px[3] > 0; // alpha > 0 means something was drawn
      }
    }

    return {
      civclientState: store?.civclientState,
      renderer,
      tileCount,
      spriteCount,
      canvases: canvasInfo,
      canvasHasContent,
      mapInfo: store?.mapInfo ? `${store.mapInfo.xsize}x${store.mapInfo.ysize}` : 'none',
      packetCount: w.__xbwPacketCount,
      // Check for pixi app
      pixiAttached: !!document.querySelector('#canvas_div canvas:not(#canvas)'),
    };
  });

  console.log('\n=== Renderer state ===');
  console.log(JSON.stringify(state, null, 2));

  // Measure frame timing precisely
  const frameData = await page.evaluate(() => new Promise<number[]>(resolve => {
    const frames: number[] = [];
    let last = performance.now();
    let count = 0;
    function tick() {
      const now = performance.now();
      frames.push(now - last);
      last = now;
      count++;
      if (count < 10) {  // collect 10 frames
        requestAnimationFrame(tick);
      } else {
        resolve(frames);
      }
    }
    requestAnimationFrame(tick);
  }));

  console.log('\n=== Frame timings (10 frames) ===');
  frameData.forEach((ms, i) => console.log(`  frame ${i+1}: ${ms.toFixed(1)}ms`));

  // Check what's happening in the render loop
  const loopDiag = await page.evaluate(() => {
    return new Promise<Record<string, unknown>>(resolve => {
      let rafFired = 0;
      let blockStart = 0;
      const originalRaf = window.requestAnimationFrame.bind(window);

      // Measure time from one rAF to next
      const times: number[] = [];
      let last = performance.now();

      function probe() {
        rafFired++;
        const now = performance.now();
        times.push(now - last);
        last = now;
        if (rafFired < 5) originalRaf(probe);
        else resolve({ rafFired, times });
      }
      originalRaf(probe);
    });
  });

  console.log('\n=== rAF inter-frame times ===');
  console.log(loopDiag);

  console.log('\n=== Console errors after game start ===');
  for (const e of errors) console.log(' ', e);

  await page.screenshot({ path: 'test-results/diag-state.png' });
  expect(state.civclientState).toBe(2);
});
