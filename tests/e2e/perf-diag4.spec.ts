/**
 * Diagnostic 4 — find the EXACT source of 2.5s blocks using PerformanceObserver.
 */
import { test } from '@playwright/test';
import type { XbwPageGlobals } from './helpers/pageGlobals';

const BASE = process.env.TEST_BASE_URL || 'http://localhost:8080';
const RND = Math.random().toString(36).slice(2, 6).toUpperCase();
const PAGE_URL = `${BASE}/webclient/index.html?username=D4${RND}`;

test('find 2.5s block source', async ({ page }) => {
  test.setTimeout(120_000);

  // Inject hooks before page load
  await page.addInitScript(() => {
    type TaskAttributionLike = {
      name?: string;
      containerType?: string;
      containerSrc?: string;
      containerId?: string;
    };
    type LongTaskLike = PerformanceEntry & {
      attribution?: TaskAttributionLike[];
    };

    // Track all long tasks with attribution
    const w = window as XbwPageGlobals;
    w.__longTaskDetails = [];
    const obs = new PerformanceObserver(list => {
      for (const entry of list.getEntries()) {
        const lt = entry as LongTaskLike;
        const attrib = lt.attribution?.map((a: TaskAttributionLike) => ({
          name: a.name,
          containerType: a.containerType,
          containerSrc: a.containerSrc,
          containerId: a.containerId,
        }));
        w.__longTaskDetails?.push({
          startTime: +entry.startTime.toFixed(0),
          duration: +entry.duration.toFixed(0),
          attrib,
        });
      }
    });
    try {
      obs.observe({ entryTypes: ['longtask'] });
    } catch {}

    // Override requestAnimationFrame to measure each callback
    const origRAF = window.requestAnimationFrame.bind(window);
    w.__rafCallbacks = [];
    window.requestAnimationFrame = (cb: FrameRequestCallback): number => {
      return origRAF((time: DOMHighResTimeStamp) => {
        const t0 = performance.now();
        cb(time);
        const elapsed = performance.now() - t0;
        if (elapsed > 10) {
          w.__rafCallbacks?.push({
            t: +t0.toFixed(0),
            elapsed: +elapsed.toFixed(0),
          });
        }
      });
    };

    // Override setInterval to find heavy callbacks
    const origSI = window.setInterval.bind(window);
    w.__intervalCallbacks = [];
    const patchedSetInterval = ((fn: TimerHandler, delay?: number, ...args: any[]) => {
      if (typeof fn === 'function') {
        const wrapped = (...a: any[]) => {
          const t0 = performance.now();
          fn(...a);
          const elapsed = performance.now() - t0;
          if (elapsed > 50) {
            w.__intervalCallbacks?.push({
              delay,
              elapsed: +elapsed.toFixed(0),
              t: +t0.toFixed(0),
            });
          }
        };
        return origSI(wrapped, delay, ...args);
      }
      return origSI(fn, delay, ...args);
    }) as typeof window.setInterval;
    window.setInterval = patchedSetInterval;
  });

  await page.goto(PAGE_URL, { waitUntil: 'domcontentloaded' });

  // Wait for game + 10 more seconds to collect data
  await page.waitForFunction(
    () => {
      const w = window as XbwPageGlobals;
      return w.__store?.civclientState === 2;
    },
    { timeout: 60_000 }
  );
  await page.waitForTimeout(10_000);

  const diag = await page.evaluate(() => {
    const w = window as XbwPageGlobals;
    return {
      longTaskDetails: w.__longTaskDetails ?? [],
      rafCallbacks: w.__rafCallbacks ?? [],
      intervalCallbacks: w.__intervalCallbacks ?? [],
      spriteCount: Object.keys(w.__store?.sprites || {}).length,
      blockOverlay: !!document.querySelector('.xb-block-overlay'),
    };
  });

  console.log('\n=== Long tasks ===');
  for (const t of diag.longTaskDetails) {
    console.log(`  [t=${t.startTime}ms] ${t.duration}ms — attrib:`, JSON.stringify(t.attrib));
  }

  console.log('\n=== Slow rAF callbacks (>10ms) ===');
  for (const r of diag.rafCallbacks) {
    console.log(`  [t=${r.t}ms] ${r.elapsed}ms`);
  }

  console.log('\n=== Slow setInterval callbacks (>50ms) ===');
  for (const r of diag.intervalCallbacks) {
    console.log(`  delay=${r.delay}ms [t=${r.t}ms] elapsed=${r.elapsed}ms`);
  }

  console.log('\n=== Summary ===');
  console.log('Sprites loaded:', diag.spriteCount);
  console.log('BlockUI visible:', diag.blockOverlay);
});
