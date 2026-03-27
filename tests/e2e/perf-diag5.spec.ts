/**
 * Diagnostic 5 — measure packet processing time and find slow handlers.
 */
import { test } from '@playwright/test';
import type { XbwPageGlobals } from './helpers/pageGlobals';

const BASE = process.env.TEST_BASE_URL || 'http://localhost:8080';
const RND = Math.random().toString(36).slice(2, 6).toUpperCase();
const PAGE_URL = `${BASE}/webclient/index.html?username=D5${RND}`;

test('packet handler timing', async ({ page }) => {
  test.setTimeout(120_000);

  await page.addInitScript(() => {
    (window as XbwPageGlobals).__packetStats = {
      handlerTimes: {} as Record<number, number[]>,
      slowPackets: [] as Array<{pid: number; ms: number}>,
    };
  });

  await page.goto(PAGE_URL, { waitUntil: 'domcontentloaded' });

  // Wait for bundle to load, then patch client_handle_packet
  await page.waitForFunction(() => !!(window as XbwPageGlobals).__store, { timeout: 30_000 });

  // Patch the packet handler at the module level
  // We need to find it via the bundle's exposed globals
  const patched = await page.evaluate(() => {
    // client_handle_packet is not directly exposed, but we can hook into
    // the WebSocket message processing by patching JSON.parse
    const origParse = JSON.parse.bind(JSON);
    const stats = (window as XbwPageGlobals).__packetStats!;

    JSON.parse = function(text: string) {
      const result = origParse(text);
      if (Array.isArray(result) && result.length > 0 && result[0]?.pid !== undefined) {
        // Measure total time to process this batch
        const t0 = performance.now();
        // We can't measure processing time here since processing happens after this returns
        // But we can at least track packet counts
        for (const pkt of result) {
          const pid = pkt.pid;
          if (!stats.handlerTimes[pid]) stats.handlerTimes[pid] = [];
        }
      }
      return result;
    };
    return true;
  });

  // Better approach: patch the WebSocket
  const wsPatched = await page.evaluate(() => {
    const stats = (window as XbwPageGlobals).__packetStats!;

    // Find the WebSocket by patching its constructor
    // Since ws was already created, we need to find it differently
    // Monitor for the next batch of packets
    const origAddEventListener = EventTarget.prototype.addEventListener;
    const w = window as XbwPageGlobals;
    w.__wsMessages = 0;
    w.__wsTotalMs = 0;

    return 'monitoring setup';
  });

  // Wait for game running
  await page.waitForFunction(
    () => {
      const w = window as XbwPageGlobals;
      return w.__store?.civclientState === 2;
    },
    { timeout: 60_000 }
  );

  // Wait a bit more
  await page.waitForTimeout(5000);

  // Get the actual timing by running a micro-benchmark inline
  const timing = await page.evaluate(() => {
    const w = window as XbwPageGlobals;
    // Test: how long does a simple tight loop take?
    const t0 = performance.now();
    let x = 0;
    for (let i = 0; i < 1_000_000; i++) x += i;
    const loopMs = performance.now() - t0;

    // Test: how long does JSON.parse of typical packet data take?
    const samplePkt = JSON.stringify([{pid: 22, payload: new Array(100).fill(0)}]);
    const t1 = performance.now();
    for (let i = 0; i < 1000; i++) JSON.parse(samplePkt);
    const parseMs = (performance.now() - t1) / 1000;

    // Test: how long does document.createElement take?
    const t2 = performance.now();
    for (let i = 0; i < 1000; i++) {
      const el = document.createElement('div');
      el.textContent = 'test';
    }
    const domMs = (performance.now() - t2) / 1000;

    // Check redraw_overview timing
    let overviewMs = 0;
    if (typeof w.redraw_overview === 'function') {
      const t3 = performance.now();
      w.redraw_overview();
      overviewMs = performance.now() - t3;
    }

    // Check update_game_status_panel timing
    let statusMs = 0;
    if (typeof w.update_game_status_panel === 'function') {
      const t4 = performance.now();
      w.update_game_status_panel();
      statusMs = performance.now() - t4;
    }

    return {
      loopMs: +loopMs.toFixed(2),
      parseMsPerCall: +parseMs.toFixed(3),
      domMsPerCall: +domMs.toFixed(3),
      overviewMs: +overviewMs.toFixed(2),
      statusMs: +statusMs.toFixed(2),
      packetCount: w.__xbwPacketCount || 0,
      sprites: Object.keys(w.__store?.sprites || {}).length,
      tiles: Object.keys(w.__store?.tiles || {}).length,
    };
  });

  console.log('\n=== Micro-benchmarks ===');
  console.log(JSON.stringify(timing, null, 2));

  // Now check what's happening with the main page
  const pageState = await page.evaluate(() => {
    // Check if blockUI overlay exists (maybe with wrong class)
    const allDivs = Array.from(document.querySelectorAll('div')).filter(d => {
      const style = getComputedStyle(d);
      return style.position === 'fixed' && parseFloat(style.zIndex) > 100;
    });

    // Find the canvas state
    const canvas = document.getElementById('canvas') as HTMLCanvasElement | null;
    let canvasData = 'no canvas';
    if (canvas) {
      const ctx = canvas.getContext('2d');
      const center = ctx?.getImageData(canvas.width/2, canvas.height/2, 10, 10);
      const hasContent = center ? Array.from(center.data).some(v => v > 0) : false;
      canvasData = `${canvas.width}x${canvas.height} hasContent=${hasContent}`;
    }

    // Check if tileset images are in the DOM (created by init_sprites)
    const tilesetImages = document.querySelectorAll('img[src*="tileset"]');

    return {
      fixedOverlays: allDivs.length,
      fixedOverlayDetails: allDivs.map(d => ({ id: d.id, class: d.className.slice(0, 50) })),
      canvas: canvasData,
      tilesetImagesInDOM: tilesetImages.length,
    };
  });

  console.log('\n=== Page state ===');
  console.log(JSON.stringify(pageState, null, 2));
});
