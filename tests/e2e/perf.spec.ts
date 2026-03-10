/**
 * Performance benchmark — headed browser against live Railway backend.
 *
 * Measures:
 *   1. Page load → JS bundle parsed
 *   2. WebSocket connect → first packet received
 *   3. Game page visible (C_S_RUNNING)
 *   4. Minimap rendered
 *   5. Map drag responsiveness (frame timing)
 *   6. City dialog open latency
 *   7. Minimap click → map jump latency
 *   8. Tab switch latency
 *   9. Packet processing throughput (packets/s)
 *  10. Long-idle frame budget (rAF loop stability)
 *
 * Run:
 *   npx playwright test tests/e2e/perf.spec.ts \
 *     --config tests/e2e/playwright.live.config.ts \
 *     --headed
 */

import { test, expect, Page } from '@playwright/test';

const BASE = process.env.TEST_BASE_URL || 'http://localhost:8080';
const RND = Math.random().toString(36).slice(2, 6).toUpperCase();
const PAGE_URL = `${BASE}/webclient/index.html?username=Perf${RND}`;

// Helper: measure async action duration
async function measure<T>(label: string, fn: () => Promise<T>): Promise<[T, number]> {
  const t0 = Date.now();
  const result = await fn();
  const ms = Date.now() - t0;
  console.log(`  [perf] ${label}: ${ms} ms`);
  return [result, ms];
}

// Helper: wait for game page to be running
async function waitForGameRunning(page: Page, timeout = 60_000): Promise<number> {
  const t0 = Date.now();
  await page.waitForFunction(
    () => (window as any).__store?.civclientState === 2, // C_S_RUNNING = 2
    { timeout }
  );
  return Date.now() - t0;
}

// Helper: collect frame timings via PerformanceObserver
async function measureFrameTiming(page: Page, durationMs: number): Promise<{
  count: number; avgMs: number; maxMs: number; p95Ms: number;
}> {
  // Inject frame counter
  await page.evaluate(() => {
    (window as any).__perfFrames = [];
    let last = performance.now();
    function tick() {
      const now = performance.now();
      (window as any).__perfFrames.push(now - last);
      last = now;
      (window as any).__perfRaf = requestAnimationFrame(tick);
    }
    (window as any).__perfRaf = requestAnimationFrame(tick);
  });

  await page.waitForTimeout(durationMs);

  return page.evaluate(() => {
    cancelAnimationFrame((window as any).__perfRaf);
    const frames: number[] = (window as any).__perfFrames;
    if (frames.length === 0) return { count: 0, avgMs: 0, maxMs: 0, p95Ms: 0 };
    const sorted = [...frames].sort((a, b) => a - b);
    const avg = frames.reduce((s, f) => s + f, 0) / frames.length;
    const max = sorted[sorted.length - 1];
    const p95 = sorted[Math.floor(sorted.length * 0.95)];
    return { count: frames.length, avgMs: +avg.toFixed(2), maxMs: +max.toFixed(2), p95Ms: +p95.toFixed(2) };
  });
}

// Helper: screenshot with label
async function snap(page: Page, name: string) {
  await page.screenshot({
    path: `test-results/perf-${name}.png`,
    fullPage: false,
  });
}

// ============================================================
test.describe('Performance benchmarks', () => {
  test.setTimeout(180_000);

  test('full benchmark suite', async ({ page }) => {
    const results: Record<string, number | string> = {};

    // ── 1. Page load ──────────────────────────────────────────
    console.log('\n=== 1. Page load ===');
    const [, loadMs] = await measure('page load (domcontentloaded)', () =>
      page.goto(PAGE_URL, { waitUntil: 'domcontentloaded' })
    );
    results['1_load_domcontentloaded_ms'] = loadMs;

    // ── 2. JS bundle parsed + network_init called ─────────────
    console.log('\n=== 2. JS bundle parsed ===');
    const [, bundleMs] = await measure('bundle parsed (__store available)', () =>
      page.waitForFunction(() => !!(window as any).__store, { timeout: 30_000 })
    );
    results['2_bundle_parsed_ms'] = bundleMs;

    // ── 3. WebSocket connect → first packet ───────────────────
    console.log('\n=== 3. WebSocket + first packet ===');
    const [, firstPacketMs] = await measure('first packet received', () =>
      page.waitForFunction(
        () => ((window as any).__xbwPacketCount || 0) >= 1,
        { timeout: 30_000 }
      )
    );
    results['3_first_packet_ms'] = firstPacketMs;

    // ── 4. Game page visible (C_S_RUNNING) ────────────────────
    console.log('\n=== 4. Game page running ===');
    const [, gameMs] = await measure('C_S_RUNNING + game page visible', () =>
      waitForGameRunning(page, 60_000)
    );
    results['4_game_running_ms'] = gameMs;

    await snap(page, '4-game-running');

    // ── 5. Packet count & throughput ─────────────────────────
    console.log('\n=== 5. Packet throughput ===');
    const packetStats = await page.evaluate(() => {
      return {
        total: (window as any).__xbwPacketCount || 0,
      };
    });
    results['5_total_packets'] = packetStats.total;
    results['5_packets_per_sec'] = gameMs > 0
      ? +((packetStats.total / (gameMs / 1000)).toFixed(1))
      : 0;
    console.log(`  [perf] packets total: ${packetStats.total}, rate: ${results['5_packets_per_sec']}/s`);

    // ── 6. Minimap visible ────────────────────────────────────
    console.log('\n=== 6. Minimap ===');
    const minimapVisible = await page.evaluate(() => {
      const el = document.getElementById('overview_img') || document.getElementById('overview_map');
      if (!el) return false;
      const r = el.getBoundingClientRect();
      return r.width > 0 && r.height > 0;
    });
    results['6_minimap_visible'] = minimapVisible ? 'yes' : 'no';
    console.log(`  [perf] minimap visible: ${minimapVisible}`);

    // ── 7. Idle frame budget (1 second sample) ────────────────
    console.log('\n=== 7. Frame timing (1s idle) ===');
    const idleFrames = await measureFrameTiming(page, 1000);
    results['7_idle_frame_count'] = idleFrames.count;
    results['7_idle_frame_avg_ms'] = idleFrames.avgMs;
    results['7_idle_frame_max_ms'] = idleFrames.maxMs;
    results['7_idle_frame_p95_ms'] = idleFrames.p95Ms;
    results['7_idle_fps'] = idleFrames.count; // frames in 1s ≈ fps
    console.log(`  [perf] frames: ${idleFrames.count} (avg ${idleFrames.avgMs}ms, p95 ${idleFrames.p95Ms}ms, max ${idleFrames.maxMs}ms)`);

    // ── 8. Map drag latency ───────────────────────────────────
    console.log('\n=== 8. Map drag ===');
    // Find the canvas
    const canvasSelector = '#canvas_div canvas';
    const canvas = page.locator(canvasSelector).first();
    const canvasBox = await canvas.boundingBox();

    if (canvasBox) {
      const cx = canvasBox.x + canvasBox.width / 2;
      const cy = canvasBox.y + canvasBox.height / 2;

      // Measure frame timing during drag
      await page.evaluate(() => {
        (window as any).__perfFrames = [];
        let last = performance.now();
        function tick() {
          const now = performance.now();
          (window as any).__perfFrames.push(now - last);
          last = now;
          (window as any).__perfRaf = requestAnimationFrame(tick);
        }
        (window as any).__perfRaf = requestAnimationFrame(tick);
      });

      // Perform drag
      const [, dragMs] = await measure('map drag (200px, 500ms)', async () => {
        await page.mouse.move(cx, cy);
        await page.mouse.down();
        // Drag 200px to the right over 500ms (20 steps × 25ms)
        for (let i = 0; i < 20; i++) {
          await page.mouse.move(cx + (i + 1) * 10, cy, { steps: 1 });
          await page.waitForTimeout(25);
        }
        await page.mouse.up();
      });

      const dragFrames = await page.evaluate(() => {
        cancelAnimationFrame((window as any).__perfRaf);
        const frames: number[] = (window as any).__perfFrames;
        if (!frames.length) return { count: 0, avgMs: 0, maxMs: 0, p95Ms: 0 };
        const sorted = [...frames].sort((a, b) => a - b);
        return {
          count: frames.length,
          avgMs: +(frames.reduce((s, f) => s + f, 0) / frames.length).toFixed(2),
          maxMs: +sorted[sorted.length - 1].toFixed(2),
          p95Ms: +sorted[Math.floor(sorted.length * 0.95)].toFixed(2),
        };
      });

      results['8_drag_duration_ms'] = dragMs;
      results['8_drag_frame_avg_ms'] = dragFrames.avgMs;
      results['8_drag_frame_max_ms'] = dragFrames.maxMs;
      results['8_drag_frame_p95_ms'] = dragFrames.p95Ms;
      results['8_drag_fps'] = dragFrames.count; // frames during drag ≈ fps
      console.log(`  [perf] drag frames: ${dragFrames.count} (avg ${dragFrames.avgMs}ms, p95 ${dragFrames.p95Ms}ms, max ${dragFrames.maxMs}ms)`);

      await snap(page, '8-after-drag');
    } else {
      results['8_drag_duration_ms'] = 'no canvas';
      console.log('  [perf] canvas not found, skipping drag test');
    }

    // ── 9. City dialog click latency ─────────────────────────
    console.log('\n=== 9. City dialog open ===');
    // Click center of map and see if city dialog opens
    if (canvasBox) {
      const cx = canvasBox.x + canvasBox.width / 2;
      const cy = canvasBox.y + canvasBox.height / 2;

      const [, cityDialogMs] = await measure('city dialog open (click center)', async () => {
        await page.mouse.click(cx, cy);
        // Wait up to 3s for a dialog to appear
        try {
          await page.waitForSelector(
            '.xbw-dialog, #city_dialog, [data-testid="city-dialog"]',
            { timeout: 3_000 }
          );
        } catch {
          // No city at center — that's OK
        }
      });
      results['9_city_dialog_click_ms'] = cityDialogMs;

      // Check if dialog opened
      const dialogOpen = await page.evaluate(() =>
        !!document.querySelector('.xbw-dialog, #city_dialog')
      );
      results['9_city_dialog_opened'] = dialogOpen ? 'yes' : 'no (no city at click point)';
      console.log(`  [perf] dialog opened: ${dialogOpen}`);

      if (dialogOpen) {
        // Close dialog
        await page.keyboard.press('Escape');
        await page.waitForTimeout(200);
      }
    }

    // ── 10. Tab switch latency ────────────────────────────────
    console.log('\n=== 10. Tab switch ===');
    const tabs = [
      { selector: '#players_tab a', name: 'Players' },
      { selector: '#tech_tab a',    name: 'Tech' },
      { selector: '#map_tab a',     name: 'Map' },
    ];

    for (const tab of tabs) {
      const tabEl = page.locator(tab.selector).first();
      const visible = await tabEl.isVisible().catch(() => false);
      if (!visible) {
        console.log(`  [perf] tab ${tab.name}: not visible`);
        continue;
      }

      // Measure frame during tab switch
      await page.evaluate(() => {
        (window as any).__perfFrames = [];
        let last = performance.now();
        const tick = () => {
          const now = performance.now();
          (window as any).__perfFrames.push(now - last);
          last = now;
          (window as any).__perfRaf = requestAnimationFrame(tick);
        };
        (window as any).__perfRaf = requestAnimationFrame(tick);
      });

      const [, tabMs] = await measure(`tab switch → ${tab.name}`, () =>
        tabEl.click()
      );

      const tabFrames = await page.evaluate(() => {
        cancelAnimationFrame((window as any).__perfRaf);
        const frames: number[] = (window as any).__perfFrames;
        return frames.length > 0 ? +(frames[0]).toFixed(2) : 0;
      });

      results[`10_tab_${tab.name.toLowerCase()}_click_ms`] = tabMs;
      results[`10_tab_${tab.name.toLowerCase()}_first_frame_ms`] = tabFrames;
      await page.waitForTimeout(300);
    }

    await snap(page, '10-tabs');

    // ── 11. Memory snapshot ───────────────────────────────────
    console.log('\n=== 11. Memory ===');
    const memory = await page.evaluate(() => {
      const m = (performance as any).memory;
      if (!m) return null;
      return {
        usedJSHeapMB: +(m.usedJSHeapSize / 1024 / 1024).toFixed(1),
        totalJSHeapMB: +(m.totalJSHeapSize / 1024 / 1024).toFixed(1),
        heapLimitMB: +(m.jsHeapSizeLimit / 1024 / 1024).toFixed(1),
      };
    });
    if (memory) {
      results['11_used_heap_mb'] = memory.usedJSHeapMB;
      results['11_total_heap_mb'] = memory.totalJSHeapMB;
      results['11_heap_limit_mb'] = memory.heapLimitMB;
      console.log(`  [perf] heap: ${memory.usedJSHeapMB}MB used / ${memory.totalJSHeapMB}MB total / ${memory.heapLimitMB}MB limit`);
    }

    // ── Final report ──────────────────────────────────────────
    console.log('\n' + '='.repeat(60));
    console.log('PERFORMANCE REPORT');
    console.log('='.repeat(60));
    for (const [key, val] of Object.entries(results)) {
      const label = key.replace(/_/g, ' ').padEnd(45);
      console.log(`  ${label} ${val}`);
    }
    console.log('='.repeat(60) + '\n');

    // Sanity assertions (not strict — just flag regressions)
    expect(loadMs).toBeLessThan(10_000);
    expect(gameMs).toBeLessThan(60_000);
    expect(idleFrames.p95Ms).toBeLessThan(100); // <100ms p95 frame = >10fps minimum
  });
});
