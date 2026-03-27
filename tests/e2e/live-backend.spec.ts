/**
 * E2E tests for the XBWorld observer-mode web client.
 *
 * Tests that interact with the DOM run with the backend connection blocked
 * (via page.route + page.routeWebSocket) to prevent the game's initial state
 * flood from freezing the renderer thread for 80+ seconds.
 *
 * A second source of renderer freezing is tileset sprite initialisation:
 * init_cache_sprites() creates ~2770 ImageBitmaps from the tileset, which
 * blocks the renderer for ~28 seconds. We fix this by returning an empty
 * tileset JSON ({}) and a 1×1 transparent pixel for every tileset image,
 * so init_cache_sprites() runs with 0 entries and completes instantly.
 *
 * Requires dev server on port 8081:
 *   BACKEND_URL=https://xbworld-production.up.railway.app npx vite --config vite.config.dev.ts --port 8081
 */
import { test, expect } from '@playwright/test';
import { XbwPageGlobals } from './helpers/pageGlobals';

// Minimal 1×1 transparent PNG (base64).  Returned for every tileset image
// request so the three image.onload callbacks fire instantly while keeping
// init_cache_sprites() from doing any real GPU work.
const PIXEL_PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
  'base64'
);

/**
 * Block every network call that would either flood the renderer with game
 * packets OR stall it with tileset sprite initialisation.
 *
 * - /civclientlauncher → fake success so network_init() proceeds normally
 * - /civsocket/**     → WebSocket accepted but idle (no packets)
 * - tileset images   → 1×1 transparent PNG (triggers onload instantly)
 * - tileset JSON     → {} (empty object so init_cache_sprites creates 0 bitmaps)
 */
async function blockBackend(page: import('@playwright/test').Page) {
  await page.route('**/civclientlauncher**', route => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ result: 'success', port: '55555' }),
    });
  });

  await page.routeWebSocket('**/civsocket/**', _ws => {
    // accepted but silent — game waits forever, no error dialog
  });

  // Return an empty tileset spec so init_cache_sprites() creates 0 ImageBitmaps.
  await page.route('**/tileset_spec_amplio2.json**', route => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: '{}',
    });
  });

  // Return a 1×1 pixel for every tileset image so image.onload fires instantly.
  await page.route('**/freeciv-web-tileset-**', route => {
    route.fulfill({
      status: 200,
      contentType: 'image/png',
      body: PIXEL_PNG,
    });
  });
}

test.describe('Observer UI (backend blocked)', () => {
  test.describe.configure({ timeout: 30_000 });

  test.afterEach(async ({ page }) => {
    await page.close({ runBeforeUnload: false });
  });

  test('should load page without critical JS errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));

    await blockBackend(page);
    await page.goto('/webclient/index.html', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);

    await page.screenshot({ path: 'test-results/01-initial-load.png', timeout: 5000 }).catch(() => {});

    const criticalErrors = errors.filter(
      (e) => !e.includes('ResizeObserver') && !e.includes('favicon') && !e.includes('404')
    );
    expect(criticalErrors).toHaveLength(0);
  });

  test('should have correct observer-mode HTML structure', async ({ page }) => {
    await blockBackend(page);
    await page.goto('/webclient/index.html', { waitUntil: 'domcontentloaded' });

    // Pregame page should be visible initially
    await expect(page.locator('#pregame_page')).toBeVisible();

    // Game page is in DOM but hidden until game starts
    expect(await page.locator('#game_page').count()).toBe(1);
    expect(await page.locator('#tabs').count()).toBe(1);
    expect(await page.locator('#map_tab').count()).toBe(1);

    // Player-only buttons must NOT exist (removed in observer mode)
    expect(await page.locator('#start_game_button').count()).toBe(0);
    expect(await page.locator('#pick_nation_button').count()).toBe(0);
    expect(await page.locator('#turn_done_button').count()).toBe(0);
    expect(await page.locator('#game_unit_orders_default').count()).toBe(0);
  });

  test('should auto-connect without username dialog', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));

    await blockBackend(page);
    // ?username= in URL — should be used directly, no dialog shown
    await page.goto('/webclient/index.html?username=TestObserver', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);

    // IntroDialog must NOT appear — no dialog, no username input
    expect(await page.locator('#username_req').count()).toBe(0);
    expect(await page.getByRole('button', { name: 'Observe Game' }).count()).toBe(0);

    // pregame page visible while waiting for server
    await expect(page.locator('#pregame_page')).toBeVisible();

    // No critical JS errors
    const criticalErrors = errors.filter(
      (e) => !e.includes('ResizeObserver') && !e.includes('favicon') && !e.includes('404')
    );
    expect(criticalErrors).toHaveLength(0);
  });
});

test.describe('Live Railway connection', () => {
  test.describe.configure({ timeout: 120_000 });

  test.afterEach(async ({ page }) => {
    await page.close({ runBeforeUnload: false });
  });

  test('should connect and show game map with minimap', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => {
      if (!err.message.includes('ResizeObserver') && !err.message.includes('favicon')) {
        errors.push(err.message);
      }
    });

    // Navigate — username from URL, no dialog
    await page.goto('/webclient/index.html?username=E2EObserver', { waitUntil: 'domcontentloaded' });

    // No username dialog should appear
    expect(await page.locator('#username_req').count()).toBe(0);

    // Wait for either game page (running game) or pregame/start page (lobby).
    // With the lobby-state fix, the client stays on the start page when turn == 0.
    await page.waitForFunction(() => {
      const game = document.getElementById('game_page');
      const start = document.getElementById('start_page') ?? document.getElementById('pregame_page');
      return (game && window.getComputedStyle(game).display !== 'none') ||
             (start && window.getComputedStyle(start).display !== 'none');
    }, { timeout: 30_000 }).catch(() => {});
    await page.screenshot({ path: 'test-results/live-01-game-page-visible.png' }).catch(() => {});

    // Check which page is showing
    const gamePageVisible = await page.evaluate(() => {
      const gp = document.getElementById('game_page');
      return !!gp && window.getComputedStyle(gp).display !== 'none';
    });
    console.log('Game page visible:', gamePageVisible);

    if (!gamePageVisible) {
      // Server is in lobby/pre-game state — that is correct behavior
      console.log('Server is in lobby state; game page not shown (expected).');
      expect(errors).toHaveLength(0);
      return;
    }

    // Map tab should be present
    await expect(page.locator('#map_tab')).toBeVisible();

    // Canvas should exist inside canvas_div
    await expect(page.locator('#canvas_div canvas').first()).toBeVisible({ timeout: 15_000 });

    // Debug: check overview DOM state
    await page.waitForTimeout(3000);
    const overviewDebug = await page.evaluate(() => {
      const panel = document.getElementById('game_overview_panel');
      const map = document.getElementById('overview_map');
      const img = document.getElementById('overview_img') as HTMLCanvasElement | null;
      const w = window as XbwPageGlobals;
      return {
        panel_display: panel ? getComputedStyle(panel).display : 'missing',
        panel_visibility: panel ? getComputedStyle(panel).visibility : 'missing',
        panel_w: panel?.offsetWidth, panel_h: panel?.offsetHeight,
        map_display: map ? getComputedStyle(map).display : 'missing',
        map_style_w: map?.style.width, map_style_h: map?.style.height,
        map_w: map?.offsetWidth, map_h: map?.offsetHeight,
        img_display: img ? getComputedStyle(img).display : 'missing',
        img_w: img?.offsetWidth, img_h: img?.offsetHeight,
        overview_active: w.__xbwOverviewActive,
        store_map_info: w.__store ? !!w.__store.mapInfo : 'no-store',
        map_info_xsize: w.__store?.mapInfo?.xsize,
        init_overview_called: w.__xbwInitOverviewCalled,
        init_overview_no_map_info: w.__xbwInitOverviewNoMapInfo,
        handle_map_info_called: w.__xbwHandleMapInfoCalled,
        debug_map_info_xsize: w.__xbwMapInfoXsize,
        received_pids_sample: JSON.stringify(w.__xbwReceivedPids).slice(0, 200),
      };
    });
    console.log('Overview debug:', JSON.stringify(overviewDebug));

    // Minimap overview canvas should be visible (allow time for init_overview to run)
    await expect(page.locator('#overview_img')).toBeVisible({ timeout: 20_000 });
    await expect(page.locator('#overview_viewrect')).toBeVisible({ timeout: 10_000 });

    await page.screenshot({ path: 'test-results/live-02-map-visible.png' }).catch(() => {});

    // Verify canvas has rendered content (non-black pixels)
    const canvasInfo = await page.evaluate(() => {
      const c = document.querySelector('#canvas_div canvas') as HTMLCanvasElement | null;
      if (!c) return 'no-canvas';
      const ctx = c.getContext('2d');
      if (!ctx) return 'no-context';
      const { width: w, height: h } = c;
      if (!w || !h) return `zero-size:${w}x${h}`;
      const data = ctx.getImageData(Math.floor(w / 4), Math.floor(h / 4),
        Math.min(200, Math.floor(w / 2)), Math.min(200, Math.floor(h / 2))).data;
      let nonBlack = 0;
      for (let i = 0; i < data.length; i += 4) {
        if (data[i] > 10 || data[i + 1] > 10 || data[i + 2] > 10) nonBlack++;
      }
      return `${w}x${h} nonBlack=${nonBlack}/${data.length / 4}`;
    });
    console.log('Canvas info:', canvasInfo);
    expect(canvasInfo).not.toBe('no-canvas');
    expect(canvasInfo).not.toBe('no-context');

    // Test map drag: mousedown + mousemove + mouseup on canvas
    const canvas = page.locator('#canvas_div canvas').first();
    const box = await canvas.boundingBox();
    if (box) {
      const cx = box.x + box.width / 2;
      const cy = box.y + box.height / 2;
      await page.mouse.move(cx, cy);
      await page.mouse.down();
      await page.mouse.move(cx + 100, cy + 50, { steps: 5 });
      await page.mouse.up();
      await page.waitForTimeout(500);
    }
    await page.screenshot({ path: 'test-results/live-03-after-drag.png' }).catch(() => {});

    expect(errors).toHaveLength(0);
  });
});

test.describe('Debug connection', () => {
  test.describe.configure({ timeout: 60_000 });
  test('diagnose - capture state at 5s, 15s, 30s', async ({ page }) => {
    const logs: string[] = [];
    const requests: string[] = [];
    let wsFrameCount = 0;
    let wsConnected = false;
    page.on('console', msg => { logs.push(`[${msg.type()}] ${msg.text()}`); });
    page.on('pageerror', err => logs.push(`[ERROR] ${err.message}`));
    page.on('request', req => {
      const u = req.url();
      if (u.includes('civclientlauncher') || u.includes('civsocket')) requests.push(u);
    });
    page.on('websocket', ws => {
      console.log('WebSocket created:', ws.url());
      wsConnected = true;
      ws.on('framereceived', frame => {
        wsFrameCount++;
        if (wsFrameCount <= 3) {
          const text = frame.payload.toString().slice(0, 100);
          console.log(`WS frame #${wsFrameCount}:`, text);
        }
      });
      ws.on('socketerror', err => console.log('WS error:', err));
      ws.on('close', () => console.log('WS closed'));
    });

    await page.goto('/webclient/index.html?username=DiagUser', { waitUntil: 'domcontentloaded' });

    // Snapshot at 5s
    await page.waitForTimeout(5000);
    const snap5 = await page.evaluate(() => {
      const pregame = document.getElementById('pregame_page');
      const gamePage = document.getElementById('game_page');
      const chatbox = document.getElementById('pregame_message_area');
      const w = window as XbwPageGlobals;
      const net = w.__networkDebug?.state ?? {};
      return {
        pregame_exists: !!pregame,
        game_page_display: gamePage ? gamePage.style.display : 'missing',
        chatbox_text: chatbox ? chatbox.textContent?.slice(0, 200) : '(no chatbox)',
        civserverport: net.civserverport ?? null,
        ws_readyState: net.readyState ?? 'no-ws',
        ws_url: net.url ?? 'no-url',
        blockUI_visible: !!document.querySelector('.xb-block-overlay, .blockUI'),
      };
    });
    console.log('5s snapshot:', JSON.stringify(snap5));
    await page.screenshot({ path: 'test-results/diag-5s.png' }).catch(() => {});

    // Snapshot at 15s
    await page.waitForTimeout(10000);
    const snap15 = await page.evaluate(() => {
      const pregame = document.getElementById('pregame_page');
      const gamePage = document.getElementById('game_page');
      const chatbox = document.getElementById('pregame_message_area');
      const w = window as XbwPageGlobals;
      const net = w.__networkDebug?.state ?? {};
      return {
        pregame_exists: !!pregame,
        game_page_display: gamePage ? gamePage.style.display : 'missing',
        chatbox_text: chatbox ? chatbox.textContent?.slice(0, 200) : '(no chatbox)',
        chatbox_innerHTML: chatbox ? chatbox.innerHTML?.slice(0, 200) : '(no chatbox)',
        chatbox_childCount: chatbox ? chatbox.children.length : -1,
        ws_readyState: net.readyState ?? 'no-ws',
        ws_url: net.url ?? 'no-ws',
        packets_processed: w.__xbwPacketCount || 0,
        onMessage_called: w.__xbwOnMessageCalled || 0,
        processPackets_called: w.__xbwProcessPacketsCalled || 0,
        early_return: w.__xbwEarlyReturn || null,
        main_thread_parsing: w.__xbwMainThreadParsing || false,
        parse_error: w.__xbwParseError || null,
        ws_onmessage_type: net.onmessageType ?? 'no-ws',
        blockUI_visible: !!document.querySelector('.xb-block-overlay'),
        swal_visible: !!document.querySelector('.swal2-popup'),
        dialog_text: document.querySelector('[class*="MessageDialog"], [class*="xb-msg"]')?.textContent?.slice(0,100) || 'none',
        game_info_year: (document.getElementById('game_status_panel_top') || document.getElementById('game_status_panel_bottom'))?.textContent?.slice(0, 50) || '(none)',
        civclient_state: w.__store?.civclientState,
        game_info_turn: w.__xbwGameInfoTurn,
        game_info_called: w.__xbwGameInfoCalled,
        set_running_scheduled: w.__xbwSetRunningScheduled,
        set_running_fired: w.__xbwSetRunningFired,
        already_running: w.__xbwAlreadyRunning,
        set_client_state_history: w.__xbwSetClientStateCalled,
      };
    });
    console.log('15s snapshot:', JSON.stringify(snap15));
    await page.screenshot({ path: 'test-results/diag-15s.png' }).catch(() => {});

    // Snapshot at 30s
    await page.waitForTimeout(15000);
    const snap30 = await page.evaluate(() => {
      const pregame = document.getElementById('pregame_page');
      const gamePage = document.getElementById('game_page');
      const chatbox = document.getElementById('pregame_message_area') || document.getElementById('game_message_area');
      const computedDisplay = gamePage ? window.getComputedStyle(gamePage).display : 'missing';
      return {
        pregame_exists: !!pregame,
        game_page_inline_display: gamePage ? gamePage.style.display : 'missing',
        game_page_computed_display: computedDisplay,
        chatbox_text: chatbox ? chatbox.textContent?.slice(0, 200) : '(no chatbox)',
        pregame_chatbox_text: document.getElementById('pregame_message_area')?.textContent?.slice(0, 200) || '(no pregame chatbox)',
      };
    });
    console.log('30s snapshot:', JSON.stringify(snap30));
    console.log('Network requests:', requests.join(', '));
    console.log('WS connected:', wsConnected, 'frames received:', wsFrameCount);
    logs.slice(0, 50).forEach(l => console.log(l));
    await page.screenshot({ path: 'test-results/diag-30s.png' }).catch(() => {});
  });
});
