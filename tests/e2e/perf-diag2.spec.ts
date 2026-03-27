/**
 * Performance diagnostic 2 — find what's blocking the main thread.
 */
import { test, expect } from '@playwright/test';
import type { XbwPageGlobals } from './helpers/pageGlobals';

const BASE = process.env.TEST_BASE_URL || 'http://localhost:8080';
const RND = Math.random().toString(36).slice(2, 6).toUpperCase();
const PAGE_URL = `${BASE}/webclient/index.html?username=D2${RND}`;

test('find blocking code', async ({ page }) => {
  test.setTimeout(120_000);

  // Enable long task observer before page load
  await page.addInitScript(() => {
    const w = window as XbwPageGlobals;
    w.__longTasks = [];
    const obs = new PerformanceObserver(list => {
      for (const entry of list.getEntries()) {
        w.__longTasks?.push({
          name: entry.name,
          startTime: +entry.startTime.toFixed(1),
          duration: +entry.duration.toFixed(1),
        });
      }
    });
    obs.observe({ entryTypes: ['longtask'] });
  });

  await page.goto(PAGE_URL, { waitUntil: 'domcontentloaded' });

  // Wait for game running
  await page.waitForFunction(
    () => {
      const w = window as XbwPageGlobals;
      return w.__store?.civclientState === 2;
    },
    { timeout: 60_000 }
  );

  // Wait 8 more seconds to collect long tasks
  await page.waitForTimeout(8000);

  const longTasks = await page.evaluate(() => {
    const w = window as XbwPageGlobals;
    return w.__longTasks ?? [];
  });

  console.log(`\n=== Long tasks (>${50}ms) ===`);
  console.log(`Total long tasks: ${longTasks.length}`);
  for (const t of longTasks) {
    console.log(`  [t=${t.startTime}ms] ${t.name}: ${t.duration}ms`);
  }

  // Also check what timers are running
  const timerInfo = await page.evaluate(() => {
    // Override setTimeout/setInterval to track them
    const timers: Array<{type: string; delay: number; t: number}> = [];
    const origSI = window.setInterval;
    const origST = window.setTimeout;
    const w = window as XbwPageGlobals;
    // Just check current state
    return {
      animationFrameCount: w.__perfFrames?.length || 0,
      longTaskCount: w.__longTasks?.length || 0,
    };
  });
  console.log('\n=== Timer info ===');
  console.log(timerInfo);

  // Capture a performance trace for 3 seconds
  const traceData = await page.evaluate(() => new Promise<Record<string, unknown>>(resolve => {
    const marks: Array<{name: string; time: number}> = [];
    const origRAF = window.requestAnimationFrame.bind(window);

    // Track rAF scheduling
    let count = 0;
    let lastFire = performance.now();

    function observer() {
      const now = performance.now();
      marks.push({ name: `raf_${count}`, time: now });
      count++;
      if (count < 20) {
        origRAF(observer);
      } else {
        // Also report timing between frames
        const gaps = [];
        for (let i = 1; i < marks.length; i++) {
          gaps.push(+(marks[i].time - marks[i-1].time).toFixed(1));
        }
        resolve({ count, gaps: gaps.slice(0, 20) });
      }
    }
    origRAF(observer);
  }));

  console.log('\n=== 20 rAF inter-frame gaps ===');
  const gaps = traceData['gaps'] as number[];
  for (let i = 0; i < gaps.length; i++) {
    const mark = gaps[i] > 100 ? '⚠️ SLOW' : '';
    console.log(`  gap ${i+1}: ${gaps[i]}ms ${mark}`);
  }

  console.log('\nTotal slow gaps (>100ms):', gaps.filter(g => g > 100).length);
  console.log('Max gap:', Math.max(...gaps).toFixed(1), 'ms');
  console.log('Avg gap:', (gaps.reduce((s, g) => s + g, 0) / gaps.length).toFixed(1), 'ms');

  expect(longTasks.length).toBeGreaterThanOrEqual(0); // always pass - diagnostic only
});
