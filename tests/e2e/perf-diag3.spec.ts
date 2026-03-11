/**
 * Diagnostic 3 — trace exactly what's running during the 2.5s blocks.
 * Uses Playwright CDP tracing.
 */
import { test } from '@playwright/test';
import { chromium } from '@playwright/test';
import * as fs from 'fs';

const BASE = process.env.TEST_BASE_URL || 'http://localhost:8080';
const RND = Math.random().toString(36).slice(2, 6).toUpperCase();
const PAGE_URL = `${BASE}/webclient/index.html?username=D3${RND}`;

test('CDP trace + sprite state', async ({ page }) => {
  test.setTimeout(120_000);

  await page.goto(PAGE_URL, { waitUntil: 'domcontentloaded' });

  // Wait for game running
  await page.waitForFunction(
    () => (window as any).__store?.civclientState === 2,
    { timeout: 60_000 }
  );

  // Wait for sprite loading to potentially complete
  await page.waitForTimeout(5000);

  // Check sprite state via JS
  const spriteState = await page.evaluate(() => {
    const store = (window as any).__store;

    // Try to access module-level variables exposed via window (may not work with IIFE)
    return {
      spriteCount: store?.sprites ? Object.keys(store.sprites).length : 0,
      tileCount: store?.tiles ? Object.keys(store.tiles).length : 0,
      renderer: store?.renderer,
      civclientState: store?.civclientState,
      // Check window-level tileset
      tilesetDefined: typeof (window as any).tileset !== 'undefined',
      tilesetKeys: (window as any).tileset ? Object.keys((window as any).tileset).length : 0,
      // Check if blockUI overlay is present
      blockUIVisible: !!document.querySelector('#block-ui, #jGrowl, .ui-widget-overlay, [id*="block"]'),
      // Check canvas_div
      canvasDivChildren: document.getElementById('canvas_div')?.children.length || 0,
    };
  });

  console.log('\n=== Sprite / render state after 5s ===');
  console.log(JSON.stringify(spriteState, null, 2));

  // Monkey-patch to detect what's blocking
  const blockSource = await page.evaluate(() => new Promise<Record<string, unknown>>(resolve => {
    const results: string[] = [];

    // Patch requestAnimationFrame to measure callback duration
    const origRAF = window.requestAnimationFrame.bind(window);
    let rafCallCount = 0;
    window.requestAnimationFrame = (cb: FrameRequestCallback) => {
      return origRAF((time: number) => {
        const t0 = performance.now();
        cb(time);
        const elapsed = performance.now() - t0;
        if (elapsed > 50) {
          results.push(`rAF callback took ${elapsed.toFixed(0)}ms at t=${t0.toFixed(0)}`);
        }
        rafCallCount++;
        if (rafCallCount >= 10) {
          resolve({ results, rafCallCount });
        }
      });
    };

    // Patch setTimeout to detect heavy callbacks
    const origST = window.setTimeout;
    (window as any).setTimeout = (fn: (...args: unknown[]) => void, delay: number, ...args: unknown[]) => {
      return origST(() => {
        const t0 = performance.now();
        fn(...args);
        const elapsed = performance.now() - t0;
        if (elapsed > 100) {
          results.push(`setTimeout(${delay}ms) callback took ${elapsed.toFixed(0)}ms`);
        }
      }, delay, ...args);
    };
  }));

  console.log('\n=== Blocking sources ===');
  const res = blockSource as { results: string[]; rafCallCount: number };
  console.log('rAF calls intercepted:', res.rafCallCount);
  for (const r of res.results) console.log(' ', r);
});
