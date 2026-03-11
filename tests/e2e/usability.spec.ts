/**
 * XBWorld Usability Test Suite
 * ============================================================
 * Simulates a real observer's full session:
 *   1.  Connection + game load
 *   2.  Tab navigation (Map / Research / Nations)
 *   3.  Theme switching (dark / light / fantasy)
 *   4.  Map interactions (drag, scroll, zoom, canvas clicks)
 *   5.  City dialog — all 4 tabs (Overview/Buildings/Units/Can Build)
 *   6.  Tech dialog (Research tab)
 *   7.  Intel / Nation-overview dialogs
 *   8.  Chat input
 *   9.  Window resize (desktop → tablet → mobile → restore)
 *  10.  Rapid stress test (no wait between clicks)
 *  11.  Sustained 60-second activity — FPS + memory leak detection
 *
 * Requires:
 *   MOCK_PORT=8002 node mock-backend.mjs
 *   BACKEND_URL=http://localhost:8002 npx vite --config vite.config.dev.ts --port 8080
 *
 * Run:
 *   npx playwright test tests/e2e/usability.spec.ts \
 *     --config playwright.headed.config.ts
 */

import { test, expect, Page, CDPSession } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const SCREENSHOT_DIR = 'test-results/usability';
const REPORT_PATH    = 'test-results/usability-report.md';

// Allow generous timeouts for game-load steps
test.setTimeout(300_000);

// ---------------------------------------------------------------------------
// Shared state collected across tests
// ---------------------------------------------------------------------------

interface UsabilityIssue {
  step: string;
  severity: 'error' | 'warn' | 'info';
  detail: string;
}

const issues: UsabilityIssue[] = [];
const consoleErrors: string[] = [];

function record(step: string, severity: UsabilityIssue['severity'], detail: string) {
  issues.push({ step, severity, detail });
  console.log(`[usability][${severity.toUpperCase()}] ${step}: ${detail}`);
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });

let _shotIdx = 0;
async function shot(page: Page, label: string): Promise<string> {
  const name = `${String(++_shotIdx).padStart(3, '0')}-${label.replace(/\s+/g, '_')}.png`;
  const p = path.join(SCREENSHOT_DIR, name);
  await page.screenshot({ path: p, fullPage: false });
  return name;
}

/** Wait for the game page to be fully visible after connecting. */
async function connectAsObserver(page: Page, username = 'UsabilityBot'): Promise<void> {
  // Collect console errors throughout the session
  page.on('console', msg => {
    if (msg.type() === 'error') {
      const txt = msg.text();
      consoleErrors.push(txt);
    }
  });
  page.on('pageerror', err => {
    consoleErrors.push(`[PageError] ${err.message}`);
  });

  // Use ?username= URL param — initCommonIntroDialog() auto-connects as observer
  // without showing the IntroDialog, so #username_req is never in the DOM.
  await page.goto(`/webclient/index.html?username=${encodeURIComponent(username)}`, {
    waitUntil: 'domcontentloaded',
  });

  await page.waitForSelector('#game_page', { state: 'visible', timeout: 25_000 });
  // Let mock data fully load (tiles, units, cities)
  await page.waitForTimeout(3500);
}

/** Measure FPS over `durationMs` using rAF counting. */
async function measureFPS(page: Page, durationMs = 2000): Promise<number> {
  return page.evaluate((dur: number) => {
    return new Promise<number>(resolve => {
      let frames = 0;
      const start = performance.now();
      const tick = () => {
        frames++;
        if (performance.now() - start < dur) {
          requestAnimationFrame(tick);
        } else {
          resolve(Math.round(frames / (dur / 1000)));
        }
      };
      requestAnimationFrame(tick);
    });
  }, durationMs);
}

/** Read JS heap size in MB (Chrome only). */
async function heapMB(page: Page): Promise<number | null> {
  return page.evaluate(() => {
    const m = (performance as unknown as { memory?: { usedJSHeapSize: number } }).memory;
    return m ? Math.round(m.usedJSHeapSize / 1024 / 1024) : null;
  });
}

/** Open City dialog for the first city in store via JS bridge. */
async function openFirstCityDialog(page: Page): Promise<boolean> {
  return page.evaluate(() => {
    const s = (window as any).store;
    if (!s) return false;
    const cityIds = Object.keys(s.cities);
    if (!cityIds.length) return false;
    const pcity = s.cities[cityIds[0]];
    const fn = (window as any).showCityDialogPreact
      ?? (window as any).city_dialog?.show;
    if (fn) { fn(pcity); return true; }
    // Fallback: set the Preact signal directly
    const sig = (window as any).cityDialogSignal;
    if (sig) { sig.value = pcity; return true; }
    return false;
  });
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

test.describe('Usability: Full Observer Session', () => {

  // ── 1. Connection + Initial Load ────────────────────────────────────────────

  test('01 · Connection and initial game load', async ({ page }) => {
    const t0 = Date.now();
    await connectAsObserver(page);
    const loadMs = Date.now() - t0;

    await shot(page, 'initial_load');

    // Game page must be visible
    await expect(page.locator('#game_page')).toBeVisible();

    // Canvas must exist
    const canvas = page.locator('#canvas_div canvas').first();
    await expect(canvas).toBeAttached();

    // Minimap must exist
    await expect(page.locator('#overview_img')).toBeAttached();

    if (loadMs > 15_000) {
      record('01-load', 'warn', `Slow initial load: ${loadMs}ms (threshold 15s)`);
    } else {
      record('01-load', 'info', `Load OK: ${loadMs}ms`);
    }

    // Check for any early console errors
    if (consoleErrors.length > 0) {
      record('01-load', 'warn', `${consoleErrors.length} console error(s) during load: ${consoleErrors.slice(0, 3).join(' | ')}`);
    }

    const fps = await measureFPS(page, 1500);
    record('01-load', 'info', `Initial FPS: ${fps}`);
    if (fps < 30) record('01-load', 'warn', `Low FPS at idle: ${fps}`);

    const heap = await heapMB(page);
    record('01-load', 'info', `Heap after load: ${heap ?? 'N/A'} MB`);
  });

  // ── 2. Tab Navigation ───────────────────────────────────────────────────────

  test('02 · Tab navigation: Map / Research / Nations', async ({ page }) => {
    await connectAsObserver(page);

    const tabs = [
      { id: 'map_tab',     label: 'Map',      contentCheck: '#canvas_div' },
      { id: 'tech_tab',    label: 'Research',  contentCheck: '#tabs-tec'   },
      { id: 'players_tab', label: 'Nations',   contentCheck: '#nations_list' },
    ];

    for (const tab of tabs) {
      const link = page.locator(`#${tab.id} a`);
      await expect(link).toBeVisible({ timeout: 5000 });
      await link.click();
      await page.waitForTimeout(500);
      await shot(page, `tab_${tab.label.toLowerCase()}`);

      const content = page.locator(tab.contentCheck);
      const attached = await content.count() > 0;
      if (!attached) {
        record(`02-tab-${tab.label}`, 'error', `Content element ${tab.contentCheck} missing after tab click`);
      } else {
        record(`02-tab-${tab.label}`, 'info', `Tab "${tab.label}" OK`);
      }
    }

    // Return to Map
    await page.locator('#map_tab a').click();
    await page.waitForTimeout(300);
  });

  // ── 3. Theme Switching ──────────────────────────────────────────────────────

  test('03 · Theme switching: dark / light / fantasy', async ({ page }) => {
    await connectAsObserver(page);

    const themes: Array<'dark' | 'light' | 'fantasy'> = ['light', 'fantasy', 'dark'];
    for (const theme of themes) {
      const t0 = Date.now();
      await page.evaluate((t: string) => {
        (window as any).setTheme?.(t);
      }, theme);
      await page.waitForTimeout(200);
      const elapsed = Date.now() - t0;

      const activeTheme = await page.evaluate(() =>
        document.documentElement.dataset['theme'] ?? 'unknown'
      );

      await shot(page, `theme_${theme}`);

      if (activeTheme !== theme) {
        record(`03-theme-${theme}`, 'error', `Theme attribute is "${activeTheme}", expected "${theme}"`);
      } else {
        record(`03-theme-${theme}`, 'info', `Theme "${theme}" applied in ${elapsed}ms`);
      }

      // Check background color actually changed
      const bg = await page.evaluate(() =>
        window.getComputedStyle(document.documentElement).getPropertyValue('--xb-bg-primary').trim()
      );
      record(`03-theme-${theme}`, 'info', `--xb-bg-primary = "${bg}"`);
    }

    // Restore dark
    await page.evaluate(() => (window as any).setTheme?.('dark'));
  });

  // ── 4. Map Interactions ─────────────────────────────────────────────────────

  test('04 · Map drag, scroll, zoom', async ({ page }) => {
    await connectAsObserver(page);
    const canvas = page.locator('#canvas_div canvas').first();
    await canvas.waitFor({ state: 'attached', timeout: 10_000 });

    const box = await canvas.boundingBox();
    if (!box) {
      record('04-map', 'error', 'Canvas has no bounding box — cannot test interactions');
      return;
    }

    const cx = box.x + box.width / 2;
    const cy = box.y + box.height / 2;

    // --- Drag pan ---
    await page.mouse.move(cx, cy);
    await page.mouse.down();
    await page.mouse.move(cx + 120, cy + 60, { steps: 10 });
    await page.mouse.move(cx - 80, cy - 40, { steps: 10 });
    await page.mouse.up();
    await page.waitForTimeout(300);
    await shot(page, 'map_after_drag');

    const errAfterDrag = consoleErrors.length;
    if (errAfterDrag > 0) {
      record('04-map-drag', 'warn', `${errAfterDrag} console error(s) after drag`);
    } else {
      record('04-map-drag', 'info', 'Drag pan completed without errors');
    }

    // --- Mouse wheel zoom ---
    for (const delta of [-300, -300, 300, 300]) {
      await page.mouse.wheel(0, delta);
      await page.waitForTimeout(100);
    }
    await shot(page, 'map_after_zoom');
    record('04-map-zoom', 'info', 'Mouse wheel zoom completed');

    // --- Arrow key scroll ---
    await canvas.click(); // focus
    for (const key of ['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp']) {
      await page.keyboard.press(key);
      await page.waitForTimeout(80);
    }
    await shot(page, 'map_after_keyboard_scroll');
    record('04-map-keyboard', 'info', 'Keyboard scroll completed');

    // --- FPS after activity ---
    const fps = await measureFPS(page, 1500);
    record('04-map-fps', fps < 30 ? 'warn' : 'info', `FPS after map interactions: ${fps}`);
  });

  // ── 5. City Dialog — All 4 Tabs ─────────────────────────────────────────────

  test('05 · City dialog: all tabs open/close', async ({ page }) => {
    await connectAsObserver(page);
    await page.locator('#map_tab a').click();
    await page.waitForTimeout(500);

    const opened = await openFirstCityDialog(page);
    if (!opened) {
      record('05-city-dialog', 'warn', 'No cities in store — city dialog test skipped');
      return;
    }
    await page.waitForTimeout(600);
    await shot(page, 'city_dialog_open');

    // Dialog must be visible
    const dialog = page.locator('[role="dialog"], .xb-dialog, #preact-root dialog, .dialog-overlay').first();
    const dialogVisible = await dialog.isVisible().catch(() => false);
    if (!dialogVisible) {
      record('05-city-dialog', 'warn', 'Dialog element not detected via ARIA — checking by content');
    }

    const cityTabs = ['Overview', 'Buildings', 'Units', 'Can Build'];
    for (const tabLabel of cityTabs) {
      const tabBtn = page.getByRole('tab', { name: tabLabel })
        .or(page.locator(`button:has-text("${tabLabel}")`))
        .or(page.locator(`[role="tab"]:has-text("${tabLabel}")`));

      const tabCount = await tabBtn.count();
      if (tabCount === 0) {
        record(`05-city-tab-${tabLabel}`, 'warn', `Tab "${tabLabel}" not found`);
        continue;
      }

      await tabBtn.first().click();
      await page.waitForTimeout(400);
      await shot(page, `city_tab_${tabLabel.toLowerCase().replace(' ', '_')}`);
      record(`05-city-tab-${tabLabel}`, 'info', `Tab "${tabLabel}" clicked`);
    }

    // Close dialog via ✕ button or Escape
    const closeBtn = page.locator('[aria-label="Close"], button.dialog-close, .xb-dialog-close, button:has-text("✕"), button:has-text("×")').first();
    if (await closeBtn.count() > 0) {
      await closeBtn.click();
    } else {
      await page.keyboard.press('Escape');
    }
    await page.waitForTimeout(300);
    await shot(page, 'city_dialog_closed');
    record('05-city-dialog', 'info', 'City dialog open/close cycle complete');
  });

  // ── 6. Research / Tech Tab ──────────────────────────────────────────────────

  test('06 · Research tab: tech tree interactions', async ({ page }) => {
    await connectAsObserver(page);

    await page.locator('#tech_tab a').click();
    await page.waitForTimeout(800);
    await shot(page, 'research_tab');

    // Player selector
    const playerSelect = page.locator('#tech_player_select, select[id*="player"], select[id*="tech"]').first();
    if (await playerSelect.count() > 0) {
      const options = await playerSelect.locator('option').count();
      record('06-research-player', 'info', `Player selector has ${options} option(s)`);
      if (options > 1) {
        await playerSelect.selectOption({ index: 1 });
        await page.waitForTimeout(400);
        await shot(page, 'research_player2');
      }
    } else {
      record('06-research-player', 'info', 'No player selector found (single player or not rendered)');
    }

    // Click a tech tree item
    const techItems = page.locator('.tech_tree_item, .tech-item, [data-tech-id], .reqtree_item, .tech_name').first();
    if (await techItems.count() > 0) {
      await techItems.click();
      await page.waitForTimeout(400);
      await shot(page, 'research_tech_clicked');
      record('06-research-tech', 'info', 'Tech tree item clicked successfully');
    } else {
      record('06-research-tech', 'info', 'No clickable tech items found');
    }

    const errors = consoleErrors.length;
    if (errors > 0) {
      record('06-research', 'warn', `${errors} console error(s) during research tab interactions`);
    }
  });

  // ── 7. Nations Tab: player selection + view ─────────────────────────────────

  test('07 · Nations tab: player rows and view actions', async ({ page }) => {
    await connectAsObserver(page);

    await page.locator('#players_tab a').click();
    await page.waitForTimeout(800);
    await shot(page, 'nations_tab');

    // NationOverview Preact table rows
    const rows = page.locator('#nations_list tr, #nations_list [style*="cursor"], #nations_list tbody tr');
    const rowCount = await rows.count();
    record('07-nations', 'info', `Nations table has ${rowCount} row(s)`);

    if (rowCount > 0) {
      // Click first player row
      await rows.first().click();
      await page.waitForTimeout(400);
      await shot(page, 'nations_player_selected');
      record('07-nations', 'info', 'First player row clicked');

      // Click again to deselect
      await rows.first().click();
      await page.waitForTimeout(200);
      record('07-nations', 'info', 'First player row deselected');
    }

    // View Player button
    const viewBtn = page.locator('#view_player_button');
    if (await viewBtn.count() > 0) {
      const disabled = await viewBtn.isDisabled();
      record('07-nations', 'info', `View Player button ${disabled ? 'disabled (no selection)' : 'enabled'}`);
    }

    // Game Scores button
    const scoresBtn = page.locator('#game_scores_button');
    if (await scoresBtn.count() > 0) {
      await scoresBtn.click();
      await page.waitForTimeout(500);
      await shot(page, 'game_scores_dialog');
      // Close
      await page.keyboard.press('Escape');
      await page.waitForTimeout(200);
      record('07-nations', 'info', 'Game Scores dialog opened/closed');
    }
  });

  // ── 8. Chat Input ───────────────────────────────────────────────────────────

  test('08 · Chat input: type and send', async ({ page }) => {
    await connectAsObserver(page);

    const chatInput = page.locator('#game_text_input, input[id*="chat"], .chat-input').first();
    if (await chatInput.count() === 0) {
      record('08-chat', 'warn', 'Chat input element not found');
      return;
    }

    await chatInput.click();
    await chatInput.fill('Hello from usability test!');
    await shot(page, 'chat_typed');
    record('08-chat', 'info', 'Typed message into chat input');

    // Send via Enter
    await page.keyboard.press('Enter');
    await page.waitForTimeout(400);
    await shot(page, 'chat_sent');

    // Input should be cleared after send
    const val = await chatInput.inputValue();
    if (val !== '') {
      record('08-chat', 'warn', `Chat input not cleared after Enter: "${val}"`);
    } else {
      record('08-chat', 'info', 'Chat input cleared after send');
    }

    // Check chatbox has content
    const chatbox = page.locator('#chatbox, .chatbox, #game_chatbox_area');
    if (await chatbox.count() > 0) {
      const text = await chatbox.textContent();
      record('08-chat', 'info', `Chatbox has content (${text?.length ?? 0} chars)`);
    }
  });

  // ── 9. Window Resize ────────────────────────────────────────────────────────

  test('09 · Window resize: desktop → tablet → mobile → restore', async ({ page }) => {
    await connectAsObserver(page);

    const sizes = [
      { w: 1280, h: 800,  label: 'desktop'  },
      { w: 768,  h: 1024, label: 'tablet'   },
      { w: 375,  h: 812,  label: 'mobile'   },
      { w: 1280, h: 800,  label: 'restored' },
    ];

    for (const { w, h, label } of sizes) {
      await page.setViewportSize({ width: w, height: h });
      await page.waitForTimeout(500);
      await shot(page, `resize_${label}`);

      // Canvas must still be present
      const canvas = page.locator('#canvas_div canvas').first();
      const attached = await canvas.count() > 0;
      if (!attached) {
        record(`09-resize-${label}`, 'error', `Canvas missing after resize to ${w}×${h}`);
      } else {
        const box = await canvas.boundingBox();
        record(`09-resize-${label}`, 'info',
          `${w}×${h}: canvas ${box ? `${Math.round(box.width)}×${Math.round(box.height)}` : 'no box'}`);
      }

      // Status bar check
      const status = page.locator('#game_status_panel_top, #game_status_panel_bottom');
      const statusVisible = await status.filter({ hasText: /Turn|Observing|AD|BC/ }).count() > 0;
      if (!statusVisible) {
        record(`09-resize-${label}`, 'info', 'Status bar text not detected (may be pre-game state)');
      }
    }
  });

  // ── 10. Rapid Stress Test ────────────────────────────────────────────────────

  test('10 · Rapid stress: tabs + actions without waiting', async ({ page }) => {
    await connectAsObserver(page);

    const errsBefore = consoleErrors.length;

    // Rapid tab switching
    const tabLinks = ['#map_tab a', '#tech_tab a', '#players_tab a', '#map_tab a'];
    for (let round = 0; round < 3; round++) {
      for (const sel of tabLinks) {
        const el = page.locator(sel);
        if (await el.count() > 0) await el.click();
        // No wait — immediately next
      }
    }
    await page.waitForTimeout(500);

    // Rapid map clicks + drags
    await page.locator('#map_tab a').click();
    await page.waitForTimeout(300);
    const canvas = page.locator('#canvas_div canvas').first();
    if (await canvas.count() > 0) {
      const box = await canvas.boundingBox();
      if (box) {
        const pts = [
          [0.3, 0.3], [0.5, 0.5], [0.7, 0.3], [0.3, 0.7], [0.7, 0.7],
        ];
        for (const [rx, ry] of pts) {
          await page.mouse.click(box.x + box.width * rx, box.y + box.height * ry);
        }
        // Rapid drag
        await page.mouse.move(box.x + box.width * 0.5, box.y + box.height * 0.5);
        await page.mouse.down();
        for (let dx = 0; dx < 200; dx += 20) {
          await page.mouse.move(box.x + box.width * 0.5 + dx, box.y + box.height * 0.5);
        }
        await page.mouse.up();
      }
    }

    // Rapid city dialog open/close
    for (let i = 0; i < 3; i++) {
      await openFirstCityDialog(page);
      await page.waitForTimeout(150);
      await page.keyboard.press('Escape');
      await page.waitForTimeout(100);
    }

    await page.waitForTimeout(500);
    await shot(page, 'stress_test_end');

    const errsAfter = consoleErrors.length;
    const newErrs = errsAfter - errsBefore;
    if (newErrs > 0) {
      record('10-stress', 'warn',
        `${newErrs} console error(s) during stress test: ${consoleErrors.slice(-3).join(' | ')}`);
    } else {
      record('10-stress', 'info', 'Stress test completed with no new console errors');
    }

    // Page must still be functional
    await expect(page.locator('#game_page')).toBeVisible();
    record('10-stress', 'info', 'Page still functional after stress test');
  });

  // ── 11. Sustained Activity: FPS + Memory Leak Detection ─────────────────────

  test('11 · Sustained 60s activity: FPS stability + memory', async ({ page }) => {
    await connectAsObserver(page);

    const heapStart = await heapMB(page);
    const fpsReadings: number[] = [];

    // 6 rounds × 10s = 60s total
    for (let round = 0; round < 6; round++) {
      // Alternate between map drag and tab switch
      if (round % 2 === 0) {
        const canvas = page.locator('#canvas_div canvas').first();
        await page.locator('#map_tab a').click().catch(() => {});
        if (await canvas.count() > 0) {
          const box = await canvas.boundingBox();
          if (box) {
            const cx = box.x + box.width / 2;
            const cy = box.y + box.height / 2;
            await page.mouse.move(cx, cy);
            await page.mouse.down();
            for (let s = 0; s < 5; s++) {
              await page.mouse.move(cx + Math.sin(s) * 60, cy + Math.cos(s) * 40, { steps: 5 });
              await page.waitForTimeout(300);
            }
            await page.mouse.up();
          }
        }
      } else {
        const tabs = ['#map_tab a', '#tech_tab a', '#players_tab a'];
        for (const t of tabs) {
          await page.locator(t).click().catch(() => {});
          await page.waitForTimeout(800);
        }
      }

      const fps = await measureFPS(page, 1500);
      const heap = await heapMB(page);
      fpsReadings.push(fps);
      record(
        `11-sustained-round${round + 1}`,
        fps < 20 ? 'warn' : 'info',
        `FPS: ${fps}  Heap: ${heap ?? 'N/A'} MB`
      );
    }

    await shot(page, 'sustained_final');

    const heapEnd = await heapMB(page);
    const heapGrowth = heapEnd != null && heapStart != null ? heapEnd - heapStart : null;
    const avgFPS = Math.round(fpsReadings.reduce((a, b) => a + b, 0) / fpsReadings.length);
    const minFPS = Math.min(...fpsReadings);

    record('11-sustained', 'info', `FPS: avg=${avgFPS} min=${minFPS} readings=[${fpsReadings.join(',')}]`);
    if (heapGrowth != null) {
      record(
        '11-sustained',
        heapGrowth > 50 ? 'warn' : 'info',
        `Heap: start=${heapStart} MB end=${heapEnd} MB growth=${heapGrowth > 0 ? '+' : ''}${heapGrowth} MB`
      );
      if (heapGrowth > 50) {
        record('11-sustained', 'warn',
          `Possible memory leak: heap grew ${heapGrowth} MB over 60s of activity`);
      }
    }
    if (avgFPS < 30) {
      record('11-sustained', 'warn', `Low average FPS during sustained activity: ${avgFPS}`);
    }
  });

  // ── Generate report after all tests ─────────────────────────────────────────

  test.afterAll(async () => {
    generateReport();
  });
});

// ---------------------------------------------------------------------------
// Report generation
// ---------------------------------------------------------------------------

function generateReport(): void {
  const now = new Date().toISOString();

  const errors = issues.filter(i => i.severity === 'error');
  const warns  = issues.filter(i => i.severity === 'warn');
  const infos  = issues.filter(i => i.severity === 'info');

  let md = `# XBWorld Usability Report\n\n`;
  md += `Generated: ${now}\n\n`;
  md += `## Summary\n\n`;
  md += `| Metric | Count |\n|---|---|\n`;
  md += `| ❌ Errors | ${errors.length} |\n`;
  md += `| ⚠ Warnings | ${warns.length} |\n`;
  md += `| ✅ Passing checks | ${infos.length} |\n`;
  md += `| Console errors total | ${consoleErrors.length} |\n\n`;

  if (errors.length > 0) {
    md += `## ❌ Errors (must fix)\n\n`;
    for (const i of errors) {
      md += `- **[${i.step}]** ${i.detail}\n`;
    }
    md += '\n';
  }

  if (warns.length > 0) {
    md += `## ⚠ Warnings (should investigate)\n\n`;
    for (const i of warns) {
      md += `- **[${i.step}]** ${i.detail}\n`;
    }
    md += '\n';
  }

  md += `## ✅ Passing Checks\n\n`;
  for (const i of infos) {
    md += `- [${i.step}] ${i.detail}\n`;
  }
  md += '\n';

  if (consoleErrors.length > 0) {
    md += `## Console Errors (${consoleErrors.length})\n\n`;
    for (const e of consoleErrors.slice(0, 20)) {
      md += `- \`${e.slice(0, 200)}\`\n`;
    }
    if (consoleErrors.length > 20) {
      md += `- ... and ${consoleErrors.length - 20} more\n`;
    }
    md += '\n';
  }

  md += `## Screenshots\n\nAll screenshots saved to \`${SCREENSHOT_DIR}/\`\n\n`;
  md += `## Test Steps Covered\n\n`;
  md += `1. Connection + initial load\n`;
  md += `2. Tab navigation (Map / Research / Nations)\n`;
  md += `3. Theme switching (dark / light / fantasy)\n`;
  md += `4. Map drag, scroll, zoom\n`;
  md += `5. City dialog — all 4 tabs\n`;
  md += `6. Research / tech tree\n`;
  md += `7. Nations overview + game scores\n`;
  md += `8. Chat input + send\n`;
  md += `9. Window resize (desktop→tablet→mobile→restore)\n`;
  md += `10. Rapid stress test\n`;
  md += `11. Sustained 60s activity — FPS + memory leak detection\n`;

  fs.mkdirSync(path.dirname(REPORT_PATH), { recursive: true });
  fs.writeFileSync(REPORT_PATH, md, 'utf-8');
  console.log(`\n[usability] Report written to ${REPORT_PATH}`);
  console.log(`[usability] ${errors.length} errors, ${warns.length} warnings, ${infos.length} passing`);
}
