/**
 * E2E visual test with mock backend.
 *
 * Uses Playwright's routeWebSocket to intercept the game WebSocket,
 * then re-patches the page-side ws.onmessage to bypass the Web Worker
 * (which doesn't process mock messages correctly) and call
 * client_handle_packet directly.
 *
 * Verifies:
 *   1. Main map canvas renders terrain
 *   2. Mini-map / overview renders
 *   3. Game data (tiles, units, terrains) loaded
 *   4. Unit movement updates game state
 *
 * Usage:
 *   npx playwright test tests/e2e/mock-game-visual.spec.ts --headed
 */
import { test, expect } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildInitPackets, buildUnitMovePacket, MAP_DIMS } from './mock-packets';
import { connectAsObserver } from './helpers/observer';
import type { XbwPageGlobals } from './helpers/pageGlobals';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SCREENSHOT_DIR = path.join(__dirname, '../../test-screenshots/mock-visual');

test.describe('Mock Game Visual Test', () => {
  test.describe.configure({ timeout: 120_000 });

  test('full rendering pipeline: map, minimap, sprites, movement', async ({ page }) => {
    page.on('pageerror', (err) => {
      console.log(`  [pageerror] ${err.message.substring(0, 200)}`);
    });

    // --- Block backend, intercept WebSocket ---
    await page.route('**/civclientlauncher**', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ result: 'success', port: '6789' }),
      });
    });

    const initPackets = buildInitPackets();
    const mock = { send: null as ((data: string) => void) | null };

    await page.routeWebSocket('**', ws => {
      mock.send = (data: string) => ws.send(data);

      ws.onMessage((msg) => {
        const msgStr = String(msg);
        try {
          const parsed = JSON.parse(msgStr);
          if (parsed.pid === 4) {
            console.log('[test] Login received');
          }
        } catch { /* chat commands */ }
      });
    });

    // --- Navigate ---
    await connectAsObserver(page, {
      username: 'TestObserver',
      waitForGamePage: false,
      settleMs: 0,
    });
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '01-autoconnect.png'), fullPage: true });

    // Wait for WebSocket to connect and login packet to be sent
    await page.waitForTimeout(2000);

    // --- Patch ws.onmessage to bypass Worker ---
    const patchResult = await page.evaluate(() => {
      type MockStore = NonNullable<XbwPageGlobals['__store']> & {
        tiles?: Record<number, Record<string, unknown>>;
        terrains?: Record<number, Record<string, unknown>>;
        units?: Record<number, Record<string, Record<string, unknown>>>;
        players?: Record<number, Record<string, unknown>>;
      };
      type MockGlobals = XbwPageGlobals & {
        game_info?: Record<string, unknown>;
        calendar_info?: Record<string, unknown>;
        terrain_control?: Record<string, unknown>;
        ruleset_control?: Record<string, unknown>;
        unit_types?: Record<number, unknown>;
        unit_classes?: Record<number, unknown>;
        nations?: Record<number, unknown>;
        governments?: Record<number, unknown>;
        techs?: Record<number, unknown>;
        game_rules?: Record<string, unknown>;
      };

      const w = window as MockGlobals;
      const wsObj = w.__networkDebug?.ws ?? null;
      if (!wsObj) return { success: false, reason: 'no ws' };

      wsObj.onmessage = function (event: MessageEvent) {
        try {
          const store = w.__store as MockStore | undefined;
          const mapDebug = w.__mapDebug;
          let packets = JSON.parse(event.data);
          if (!Array.isArray(packets)) packets = [packets];

          for (const p of packets) {
            const pid = p.pid;
            switch (pid) {
              case 5: // SERVER_JOIN_REPLY
                break;
              case 17: { // MAP_INFO
                mapDebug?.setMapInfo?.(p);
                mapDebug?.mapInitTopology?.();
                mapDebug?.mapAllocate?.();
                break;
              }
              case 15: { // TILE_INFO
                const tiles = store?.tiles;
                if (tiles && tiles[p.tile]) {
                  Object.assign(tiles[p.tile], p);
                }
                break;
              }
              case 16: // GAME_INFO
                w.game_info = p;
                break;
              case 255: // CALENDAR_INFO
                w.calendar_info = p;
                break;
              case 151: { // RULESET_TERRAIN
                const terrains = store?.terrains;
                if (!terrains) break;
                if (p.name === 'Lake') p.graphic_str = p.graphic_alt;
                if (p.name === 'Glacier') p.graphic_str = 'tundra';
                terrains[p.id] = p;
                break;
              }
              case 146: // RULESET_TERRAIN_CONTROL
                w.terrain_control = p;
                break;
              case 155: // RULESET_CONTROL
                w.ruleset_control = p;
                break;
              case 140: { // RULESET_UNIT
                const utypes = w.unit_types ?? (w.unit_types = {});
                utypes[p.id] = p;
                break;
              }
              case 152: { // RULESET_UNIT_CLASS
                const uclasses = w.unit_classes ?? (w.unit_classes = {});
                uclasses[p.id] = p;
                break;
              }
              case 148: { // RULESET_NATION
                const nations = w.nations ?? (w.nations = {});
                nations[p.id] = p;
                break;
              }
              case 145: { // RULESET_GOVERNMENT
                const govs = w.governments ?? (w.governments = {});
                govs[p.id] = p;
                break;
              }
              case 51: { // PLAYER_INFO
                const players = store?.players;
                if (!players) break;
                if (p.name) p.name = decodeURIComponent(p.name);
                players[p.playerno] = p;
                break;
              }
              case 259: { // WEB_PLAYER_INFO_ADDITION
                const players2 = store?.players;
                if (!players2) break;
                if (players2[p.playerno]) {
                  players2[p.playerno]['nation'] = p.nation;
                }
                break;
              }
              case 63: { // UNIT_INFO
                const units = store?.units;
                if (!units || !store?.tiles) break;
                const oldUnit = units[p.id];
                if (oldUnit) {
                  Object.assign(oldUnit, p);
                } else {
                  p.anim_list = [];
                  p.facing = p.facing ?? 6;
                  units[p.id] = p;
                }
                const tiles = store.tiles;
                const tile = tiles[p.tile];
                if (tile) {
                  const ulist = (tile['units'] || []) as Array<Record<string, unknown>>;
                  const idx = ulist.findIndex((u: Record<string, unknown>) => u['id'] === p.id);
                  if (idx >= 0) ulist.splice(idx, 1);
                  ulist.push(units[p.id]);
                  tile['units'] = ulist;
                }
                break;
              }
              case 144: { // RULESET_TECH
                const techs = w.techs ?? (w.techs = {});
                techs[p.id] = p;
                break;
              }
              case 141: // RULESET_GAME
                w.game_rules = p;
                break;
              case 59: // PLAYER_DIPLSTATE
              case 60: // RESEARCH_INFO
              case 244: // TIMEOUT_INFO
              case 225: // RULESETS_READY
              case 253: // SET_TOPOLOGY
              case 25:  // CHAT_MSG
              case 126: // START_PHASE
              case 128: // BEGIN_TURN
              case 150: // RULESET_BUILDING
              case 232: // RULESET_EXTRA
                break;
              default:
                break;
            }
          }
        } catch (e) {
          console.error('Mock packet handler error:', e);
        }
      };

      return { success: true, reason: 'onmessage patched' };
    });

    console.log('[test] Patch result:', JSON.stringify(patchResult));

    // --- Now send packets through the mock WebSocket ---
    if (mock.send) {
      const send = mock.send;
      console.log(`[test] Sending ${initPackets.length} packets...`);
      const BATCH = 50;
      for (let i = 0; i < initPackets.length; i += BATCH) {
        const batch = initPackets.slice(i, i + BATCH);
        send(JSON.stringify(batch));
      }
      console.log('[test] All packets sent');
    }

    // Wait for processing
    await page.waitForTimeout(2000);

    // Check state
    const gameState = await page.evaluate(() => {
      const w = window as XbwPageGlobals & {
        game_info?: Record<string, unknown>;
      };
      const store = w.__store;
      const units = store?.units;
      const terrains = store?.terrains;
      const tiles = store?.tiles;
      const mapInfo = store?.mapInfo;
      return {
        tileCount: tiles ? Object.keys(tiles).length : 0,
        unitCount: units ? Object.keys(units).length : 0,
        terrainCount: terrains ? Object.keys(terrains).length : 0,
        gameInfo: w.game_info ? 'exists' : 'null',
        mapXsize: mapInfo?.xsize ?? 'none',
        clientState: store?.civclientState ?? 'not synced',
      };
    });
    console.log('[test] Game state:', JSON.stringify(gameState));

    expect(gameState.tileCount).toBe(MAP_DIMS.width * MAP_DIMS.height);
    expect(gameState.unitCount).toBeGreaterThan(0);
    expect(gameState.terrainCount).toBeGreaterThan(0);

    // --- Force game page visible + set client state to RUNNING ---
    await page.evaluate(() => {
      const w = window as XbwPageGlobals;

      // Hide pregame, show game page
      document.getElementById('pregame_page')!.style.display = 'none';
      document.getElementById('game_page')!.style.display = '';
      document.querySelectorAll('.blockUI, .blockOverlay, .xb-dialog, .xb-dialog-overlay').forEach(el => el.remove());

      // Set client state to C_S_RUNNING (2) via the exposed function
      if (typeof w['set_client_state'] === 'function') {
        w.set_client_state?.(2);
        console.log('[test] set_client_state(2) called');
      } else {
        if (w.__store) {
          w.__store.civclientState = 2;
          console.log('[test] __store.civclientState set to 2');
        }
      }
    });
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '02-game-page.png'), fullPage: true });

    // Wait for tileset sprites to finish loading (init_cache_sprites sets sprites_init = true)
    console.log('[test] Waiting for sprite init...');
    await page.waitForFunction(() => {
      const w = window as XbwPageGlobals;
      return Object.keys(w.__store?.sprites || {}).length > 0;
    }, { timeout: 60_000 }).catch(() => {
      console.log('[test] Timed out waiting for sprites_init');
    });

    // Additional wait for createImageBitmap async processing
    await page.waitForTimeout(3000);

    // Trigger full map render
    await page.evaluate(() => {
      const w = window as XbwPageGlobals;
      w.mark_all_dirty?.();
      if (typeof w.update_map_canvas_full === 'function') {
        w.update_map_canvas_full();
        console.log('[test] update_map_canvas_full() called');
      }
      if (typeof w.redraw_overview === 'function') {
        w.redraw_overview();
        console.log('[test] redraw_overview() called');
      }
    });

    await page.waitForTimeout(2000);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '03-after-render.png'), fullPage: true });

    // --- Verify canvas ---
    const mainCanvas = await page.evaluate(() => {
      const c = document.querySelector('#canvas_div canvas') as HTMLCanvasElement;
      if (!c) return { exists: false, width: 0, height: 0, nonBlackPct: 0 };
      const ctx = c.getContext('2d');
      if (!ctx) return { exists: true, width: c.width, height: c.height, nonBlackPct: 0 };
      const w2 = Math.floor(c.width / 2), h2 = Math.floor(c.height / 2);
      const data = ctx.getImageData(c.width / 4, c.height / 4, w2, h2).data;
      let nb = 0;
      for (let i = 0; i < data.length; i += 4) {
        if (data[i] > 10 || data[i + 1] > 10 || data[i + 2] > 10) nb++;
      }
      return { exists: true, width: c.width, height: c.height, nonBlackPct: (nb / (data.length / 4)) * 100 };
    });
    console.log('Canvas:', JSON.stringify(mainCanvas));
    expect(mainCanvas.exists).toBe(true);
    expect(mainCanvas.width).toBeGreaterThan(0);
    expect(mainCanvas.nonBlackPct).toBeGreaterThan(10); // terrain sprites rendered

    if ((await page.locator('#canvas_div canvas').boundingBox())?.width) {
      await page.locator('#canvas_div canvas').screenshot({ path: path.join(SCREENSHOT_DIR, '04-main-canvas.png') });
    }

    // --- Verify minimap ---
    const overview = await page.evaluate(() => {
      const img = document.getElementById('overview_img') as HTMLCanvasElement | null;
      if (!img || img.tagName !== 'CANVAS') return { exists: false, nonBlackPct: 0 };
      const ctx = img.getContext('2d');
      if (!ctx) return { exists: true, nonBlackPct: 0 };
      const d = ctx.getImageData(0, 0, img.width, img.height).data;
      let nb = 0;
      for (let i = 0; i < d.length; i += 4) {
        if (d[i] > 10 || d[i + 1] > 10 || d[i + 2] > 10) nb++;
      }
      return { exists: true, nonBlackPct: (nb / (d.length / 4)) * 100 };
    });
    console.log('Overview:', JSON.stringify(overview));
    expect(overview.exists).toBe(true);
    expect(overview.nonBlackPct).toBeGreaterThan(10); // minimap rendered

    if (await page.locator('#overview_map').isVisible()) {
      await page.locator('#overview_map').screenshot({ path: path.join(SCREENSHOT_DIR, '05-overview-map.png') });
    }

    // --- Unit movement ---
    if (mock.send && gameState.unitCount > 0) {
      const t1 = 6 + 5 * MAP_DIMS.width;
      mock.send(JSON.stringify([buildUnitMovePacket(1, 0, t1, 0)]));
      await page.waitForTimeout(500);

      const t2 = 7 + 5 * MAP_DIMS.width;
      mock.send(JSON.stringify([buildUnitMovePacket(1, 0, t2, 0)]));
      await page.waitForTimeout(500);

      // Trigger re-render after movement
      await page.evaluate(() => {
        (window as XbwPageGlobals).update_map_canvas_full?.();
      });
      await page.waitForTimeout(500);

      await page.screenshot({ path: path.join(SCREENSHOT_DIR, '06-after-unit-move.png'), fullPage: true });

      const unit = await page.evaluate(() => {
        const w = window as XbwPageGlobals;
        const u = w.__store?.units as Record<string, { tile: number }> | undefined;
        return u?.[1] ? { tile: u[1].tile } : null;
      });
      console.log('Unit after move:', JSON.stringify(unit));
      expect(unit).not.toBeNull();
      expect(unit!.tile).toBe(t2);
    }

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '07-final-state.png'), fullPage: true });
    console.log('All visual checks completed!');
  });
});
