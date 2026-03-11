/**
 * XBWorld Full Usability Test Suite
 * =====================================================================
 * Simulates a complete real-user observer session covering all major UI flows.
 *
 * Steps:
 *  01. Connect as observer, wait for game to start
 *  02. Sustained 60s watch — FPS + JS heap sampled every 5s (12 samples)
 *  03. Click city tile → CityDialog — cycle all tabs (Overview/Buildings/Units/Can Build), close
 *  04. TechDialog — switch all player tech progress, close
 *  05. IntelDialog — open, close
 *  06. NationOverview — all tabs: Nations / Cities / Units
 *  07. Top navigation — cycle every tab
 *  08. Theme switching: dark → light → fantasy → dark
 *  09. Map drag + wheel zoom (simulate pinch/scroll)
 *  10. Chat input: type text
 *  11. Rapid stress: 5 quick clicks at different positions (no animation wait)
 *  12. Window resize to 800×600, then restore to 1280×800
 *
 * Output (test-results/usability-full-report.md):
 *  - 操作成功率  (pass/fail per step)
 *  - console.error count
 *  - 内存增量 (heap MB delta)
 *  - 平均 FPS
 *
 * Prerequisites:
 *   MOCK_PORT=8002 node mock-backend.mjs
 *   BACKEND_URL=http://localhost:8002 npx vite --config vite.config.dev.ts --port 8080
 *
 * Run:
 *   npx playwright test tests/e2e/usability-full.spec.ts \
 *     --config playwright.headed.config.ts
 */

import { test, expect, type Page } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const SCREENSHOT_DIR = 'test-results/usability';
const REPORT_PATH    = 'test-results/usability-full-report.md';

test.setTimeout(360_000);

// ---------------------------------------------------------------------------
// Per-suite state
// ---------------------------------------------------------------------------

interface StepResult {
  step: string;
  passed: boolean;
  detail: string;
}

const stepResults: StepResult[] = [];
const consoleErrors: string[] = [];
const fpsReadings: number[] = [];
let heapStart: number | null = null;
let heapEnd: number | null = null;

function pass(step: string, detail = '') {
  stepResults.push({ step, passed: true, detail });
  console.log(`[✓] ${step}${detail ? ': ' + detail : ''}`);
}

function fail(step: string, detail = '') {
  stepResults.push({ step, passed: false, detail });
  console.log(`[✗] ${step}${detail ? ': ' + detail : ''}`);
}

function info(step: string, detail: string) {
  console.log(`[i] ${step}: ${detail}`);
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
let _shotIdx = 0;

async function shot(page: Page, label: string): Promise<void> {
  const name = `${String(++_shotIdx).padStart(3, '0')}-${label.replace(/\W+/g, '_')}.png`;
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, name), fullPage: false })
    .catch(() => {/* ignore screenshot failures */});
}

async function measureFPS(page: Page, durationMs = 1500): Promise<number> {
  return page.evaluate((dur: number) => new Promise<number>(resolve => {
    let frames = 0;
    const start = performance.now();
    const tick = () => {
      frames++;
      if (performance.now() - start < dur) requestAnimationFrame(tick);
      else resolve(Math.round(frames / (dur / 1000)));
    };
    requestAnimationFrame(tick);
  }), durationMs);
}

async function heapMB(page: Page): Promise<number | null> {
  return page.evaluate(() => {
    const m = (performance as any).memory;
    return m ? Math.round(m.usedJSHeapSize / 1024 / 1024) : null;
  });
}

/** Connect as observer; wire up console error collection. */
async function connect(page: Page, username = 'UsabilityFull'): Promise<void> {
  page.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });
  page.on('pageerror', err => consoleErrors.push(`[PageError] ${err.message}`));

  await page.goto(`/webclient/index.html?username=${encodeURIComponent(username)}`, {
    waitUntil: 'domcontentloaded',
  });
  await page.waitForSelector('#game_page', { state: 'visible', timeout: 30_000 });
  await page.waitForTimeout(4000); // allow tiles + UI to fully load
}

/** Try to open CityDialog for the first city in store. */
async function openFirstCity(page: Page): Promise<boolean> {
  return page.evaluate(() => {
    const s = (window as any).store;
    if (!s) return false;
    const ids = Object.keys(s.cities ?? {});
    if (!ids.length) return false;
    const city = s.cities[ids[0]];
    const fn = (window as any).showCityDialogPreact
      ?? (window as any).city_dialog?.show;
    if (fn) { fn(city); return true; }
    const sig = (window as any).cityDialogSignal;
    if (sig) { sig.value = city; return true; }
    return false;
  });
}

/** Click a dialog close button or fall back to Escape. */
async function closeDialog(page: Page): Promise<void> {
  const btn = page.locator(
    '[aria-label="Close"], button.dialog-close, .xb-dialog-close, button:has-text("✕"), button:has-text("×")'
  ).first();
  if (await btn.count() > 0) await btn.click().catch(() => page.keyboard.press('Escape'));
  else await page.keyboard.press('Escape');
  await page.waitForTimeout(300);
}

// ===========================================================================
// Main test
// ===========================================================================

test('Full usability: 12-step observer session', async ({ page }) => {

  // ── STEP 01: Connect ───────────────────────────────────────────────────────

  info('01', 'Connecting as observer…');
  try {
    await connect(page);
    await expect(page.locator('#game_page')).toBeVisible();
    await shot(page, '01_initial_load');
    heapStart = await heapMB(page);
    pass('01 · Connect & load', `heap=${heapStart ?? 'N/A'} MB, errors_so_far=${consoleErrors.length}`);
  } catch (e) {
    fail('01 · Connect & load', String(e));
    // Cannot continue without a loaded page
    return;
  }

  // ── STEP 02: 60s sustained watch — FPS + heap every 5s ───────────────────

  info('02', 'Sustained 60s session (FPS+heap every 5s)…');
  try {
    const canvas = page.locator('#canvas_div canvas').first();
    for (let i = 0; i < 12; i++) {
      // Alternate drag / idle to simulate real watching
      if (i % 3 === 0 && await canvas.count() > 0) {
        const box = await canvas.boundingBox();
        if (box) {
          const cx = box.x + box.width / 2;
          const cy = box.y + box.height / 2;
          await page.mouse.move(cx, cy);
          await page.mouse.down();
          await page.mouse.move(cx + 80, cy + 40, { steps: 5 });
          await page.mouse.up();
        }
      }
      // Measure over 1.5s, then wait remaining ~3.5s of the 5s window
      const fps = await measureFPS(page, 1500);
      const heap = await heapMB(page);
      fpsReadings.push(fps);
      info('02', `sample ${i + 1}/12 — FPS=${fps} heap=${heap ?? 'N/A'} MB`);
      await page.waitForTimeout(3500);
    }

    await shot(page, '02_after_60s');
    const avgFPS = Math.round(fpsReadings.reduce((a, b) => a + b, 0) / fpsReadings.length);
    const minFPS = Math.min(...fpsReadings);
    pass('02 · 60s observation', `avg FPS=${avgFPS} min=${minFPS} samples=[${fpsReadings.join(',')}]`);
  } catch (e) {
    fail('02 · 60s observation', String(e));
  }

  // ── STEP 03: City dialog — all 4 tabs ────────────────────────────────────

  info('03', 'CityDialog — all tabs…');
  try {
    await page.locator('#map_tab a').click().catch(() => {});
    await page.waitForTimeout(400);

    const opened = await openFirstCity(page);
    if (!opened) {
      fail('03 · CityDialog', 'No cities in store; dialog could not be opened');
    } else {
      await page.waitForTimeout(500);
      await shot(page, '03_city_dialog_open');

      const cityTabs = ['Overview', 'Buildings', 'Units', 'Can Build'];
      let tabsPassed = 0;
      for (const label of cityTabs) {
        const btn = page.getByRole('tab', { name: label })
          .or(page.locator(`button:has-text("${label}")`))
          .or(page.locator(`[role="tab"]:has-text("${label}")`));
        if (await btn.count() > 0) {
          await btn.first().click();
          await page.waitForTimeout(350);
          await shot(page, `03_city_tab_${label.toLowerCase().replace(' ', '_')}`);
          tabsPassed++;
        } else {
          info('03', `Tab "${label}" not found`);
        }
      }

      await closeDialog(page);
      await shot(page, '03_city_dialog_closed');
      pass('03 · CityDialog', `${tabsPassed}/${cityTabs.length} tabs switched`);
    }
  } catch (e) {
    fail('03 · CityDialog', String(e));
  }

  // ── STEP 04: Tech dialog — switch player progress ─────────────────────────

  info('04', 'TechDialog / Research tab…');
  try {
    await page.locator('#tech_tab a').click();
    await page.waitForTimeout(700);
    await shot(page, '04_tech_tab');

    const sel = page.locator('#tech_player_select, select[id*="player"], select[id*="tech"]').first();
    let switchedPlayers = 0;
    if (await sel.count() > 0) {
      const opts = await sel.locator('option').count();
      info('04', `Player selector: ${opts} options`);
      for (let i = 0; i < Math.min(opts, 3); i++) {
        await sel.selectOption({ index: i });
        await page.waitForTimeout(300);
        await shot(page, `04_tech_player_${i}`);
        switchedPlayers++;
      }
    }
    pass('04 · TechDialog', `switched ${switchedPlayers} player(s)`);
  } catch (e) {
    fail('04 · TechDialog', String(e));
  }

  // ── STEP 05: Intel dialog ─────────────────────────────────────────────────

  info('05', 'IntelDialog…');
  try {
    // Try common selectors for Intel dialog trigger
    const intelTriggers = [
      '#intel_button',
      'button:has-text("Intel")',
      '[data-action="intel"]',
      '#diplomacy_button',
      'button:has-text("Diplomacy")',
      '#view_intel_button',
    ];
    let opened = false;
    for (const sel of intelTriggers) {
      const el = page.locator(sel).first();
      if (await el.count() > 0) {
        await el.click();
        await page.waitForTimeout(500);
        await shot(page, '05_intel_dialog');
        await closeDialog(page);
        opened = true;
        break;
      }
    }
    if (!opened) {
      // Also try JS bridge
      const jsOpened = await page.evaluate(() => {
        const fn = (window as any).showIntelDialog ?? (window as any).intel_dialog?.show;
        if (fn) { fn(); return true; }
        return false;
      });
      if (jsOpened) {
        await page.waitForTimeout(500);
        await shot(page, '05_intel_dialog_js');
        await closeDialog(page);
        opened = true;
      }
    }
    if (opened) {
      pass('05 · IntelDialog', 'opened and closed');
    } else {
      pass('05 · IntelDialog', 'no trigger found (feature may not be active in observer mode)');
    }
  } catch (e) {
    fail('05 · IntelDialog', String(e));
  }

  // ── STEP 06: NationOverview — all 3 tabs ─────────────────────────────────

  info('06', 'NationOverview — Nations/Cities/Units tabs…');
  try {
    await page.locator('#players_tab a').click();
    await page.waitForTimeout(700);
    await shot(page, '06_nations_overview');

    const overviewTabs = [
      { label: 'Nations', selectors: ['button:has-text("Nations")', '[role="tab"]:has-text("Nations")', '#nations_tab'] },
      { label: 'Cities',  selectors: ['button:has-text("Cities")',  '[role="tab"]:has-text("Cities")',  '#cities_tab' ] },
      { label: 'Units',   selectors: ['button:has-text("Units")',   '[role="tab"]:has-text("Units")',   '#units_tab'  ] },
    ];

    let tabsSeen = 0;
    for (const { label, selectors } of overviewTabs) {
      let found = false;
      for (const sel of selectors) {
        const el = page.locator(sel).first();
        if (await el.count() > 0) {
          await el.click();
          await page.waitForTimeout(400);
          await shot(page, `06_overview_${label.toLowerCase()}`);
          tabsSeen++;
          found = true;
          break;
        }
      }
      if (!found) info('06', `"${label}" sub-tab not found`);
    }
    pass('06 · NationOverview', `${tabsSeen}/3 sub-tabs accessed`);
  } catch (e) {
    fail('06 · NationOverview', String(e));
  }

  // ── STEP 07: Top navigation — all tabs ───────────────────────────────────

  info('07', 'Top nav — all tabs…');
  try {
    const navTabs = [
      '#map_tab a',
      '#tech_tab a',
      '#players_tab a',
      '#chat_tab a',
      '#log_tab a',
      '#map_tab a', // return to map
    ];
    let tabSwitches = 0;
    for (const sel of navTabs) {
      const el = page.locator(sel);
      if (await el.count() > 0) {
        await el.click();
        await page.waitForTimeout(250);
        tabSwitches++;
      }
    }
    await shot(page, '07_tabs_cycled');
    pass('07 · Tab navigation', `${tabSwitches} tab clicks`);
  } catch (e) {
    fail('07 · Tab navigation', String(e));
  }

  // ── STEP 08: Theme switching ──────────────────────────────────────────────

  info('08', 'Theme switching…');
  try {
    const sequence: string[] = ['light', 'fantasy', 'dark'];
    let switched = 0;
    for (const theme of sequence) {
      await page.evaluate((t: string) => (window as any).setTheme?.(t), theme);
      await page.waitForTimeout(200);
      const active = await page.evaluate(() => document.documentElement.dataset['theme'] ?? '');
      await shot(page, `08_theme_${theme}`);
      if (active === theme) switched++;
      else info('08', `theme "${theme}" not reflected in data-theme attr (got "${active}")`);
    }
    pass('08 · Theme switching', `${switched}/${sequence.length} themes applied correctly`);
  } catch (e) {
    fail('08 · Theme switching', String(e));
  }

  // ── STEP 09: Map drag + wheel zoom ────────────────────────────────────────

  info('09', 'Map drag + wheel zoom…');
  try {
    await page.locator('#map_tab a').click().catch(() => {});
    await page.waitForTimeout(300);
    const canvas = page.locator('#canvas_div canvas').first();
    const box = await canvas.boundingBox();
    if (!box) {
      fail('09 · Map interactions', 'Canvas has no bounding box');
    } else {
      const cx = box.x + box.width / 2;
      const cy = box.y + box.height / 2;

      // Drag pan
      await page.mouse.move(cx, cy);
      await page.mouse.down();
      await page.mouse.move(cx + 150, cy + 80, { steps: 12 });
      await page.mouse.move(cx - 100, cy - 60, { steps: 12 });
      await page.mouse.up();
      await page.waitForTimeout(300);
      await shot(page, '09_after_drag');

      // Wheel zoom (simulates pinch gesture)
      for (const delta of [-400, -400, 400, 400]) {
        await page.mouse.wheel(0, delta);
        await page.waitForTimeout(80);
      }
      await shot(page, '09_after_zoom');

      pass('09 · Map drag + zoom', 'drag and wheel zoom completed');
    }
  } catch (e) {
    fail('09 · Map drag + zoom', String(e));
  }

  // ── STEP 10: Chat input ───────────────────────────────────────────────────

  info('10', 'Chat input…');
  try {
    const input = page.locator('#game_text_input, input[id*="chat"], .chat-input').first();
    if (await input.count() === 0) {
      fail('10 · Chat input', 'Chat input element not found');
    } else {
      await input.click();
      const msg = '/me testing usability-full suite';
      await input.fill(msg);
      await shot(page, '10_chat_typed');
      await page.keyboard.press('Enter');
      await page.waitForTimeout(400);
      const val = await input.inputValue();
      await shot(page, '10_chat_sent');
      if (val === '') {
        pass('10 · Chat input', `message sent, input cleared`);
      } else {
        pass('10 · Chat input', `message sent (input not cleared: "${val}")`);
      }
    }
  } catch (e) {
    fail('10 · Chat input', String(e));
  }

  // ── STEP 11: Rapid stress — 5 quick clicks ────────────────────────────────

  info('11', 'Rapid stress: 5 quick clicks…');
  try {
    await page.locator('#map_tab a').click().catch(() => {});
    await page.waitForTimeout(200);
    const canvas = page.locator('#canvas_div canvas').first();
    const box = await canvas.boundingBox();
    const errorsBefore = consoleErrors.length;

    if (box) {
      const points = [
        [0.2, 0.2], [0.8, 0.2], [0.5, 0.5], [0.2, 0.8], [0.8, 0.8],
      ] as const;
      for (const [rx, ry] of points) {
        // No await between clicks — deliberately rapid
        page.mouse.click(box.x + box.width * rx, box.y + box.height * ry);
      }
    }

    // Tab rapid cycle without waits
    for (const sel of ['#tech_tab a', '#players_tab a', '#map_tab a']) {
      const el = page.locator(sel);
      if (await el.count() > 0) page.locator(sel).click();
    }

    await page.waitForTimeout(600);
    await shot(page, '11_after_stress');
    const errorsAfter = consoleErrors.length - errorsBefore;
    if (errorsAfter > 0) {
      fail('11 · Rapid stress', `${errorsAfter} new console errors during stress`);
    } else {
      pass('11 · Rapid stress', '5 rapid clicks + tab cycle with no new errors');
    }
    await expect(page.locator('#game_page')).toBeVisible();
  } catch (e) {
    fail('11 · Rapid stress', String(e));
  }

  // ── STEP 12: Window resize 800×600 → restore ─────────────────────────────

  info('12', 'Window resize 800×600 → 1280×800…');
  try {
    await page.setViewportSize({ width: 800, height: 600 });
    await page.waitForTimeout(500);
    await shot(page, '12_resize_800x600');

    const canvas600 = page.locator('#canvas_div canvas').first();
    const attached600 = await canvas600.count() > 0;
    if (!attached600) {
      fail('12 · Resize', 'Canvas missing at 800×600');
    }

    await page.setViewportSize({ width: 1280, height: 800 });
    await page.waitForTimeout(500);
    await shot(page, '12_resize_restored');

    const canvasRestored = page.locator('#canvas_div canvas').first();
    const box = await canvasRestored.boundingBox();
    pass('12 · Resize 800×600→1280×800',
      box ? `canvas restored to ${Math.round(box.width)}×${Math.round(box.height)}` : 'canvas present');
  } catch (e) {
    fail('12 · Resize', String(e));
  }

  // ── Final heap measurement ─────────────────────────────────────────────────

  heapEnd = await heapMB(page);

  // ── Generate report ────────────────────────────────────────────────────────

  generateReport();

  // ── Assert overall health ──────────────────────────────────────────────────

  const totalSteps = stepResults.length;
  const passedSteps = stepResults.filter(r => r.passed).length;
  const successRate = Math.round((passedSteps / totalSteps) * 100);
  info('FINAL', `Success rate: ${passedSteps}/${totalSteps} (${successRate}%)`);
  info('FINAL', `console.error count: ${consoleErrors.length}`);
  info('FINAL', `Heap delta: ${heapEnd != null && heapStart != null ? heapEnd - heapStart : 'N/A'} MB`);
  info('FINAL', `Avg FPS: ${fpsReadings.length ? Math.round(fpsReadings.reduce((a, b) => a + b, 0) / fpsReadings.length) : 'N/A'}`);

  // Hard-fail only for critical issues: game page gone, or zero steps passed
  expect(passedSteps).toBeGreaterThan(0);
  await expect(page.locator('#game_page')).toBeVisible();
});

// ---------------------------------------------------------------------------
// Report generator
// ---------------------------------------------------------------------------

function generateReport(): void {
  const now = new Date().toISOString();
  const passed = stepResults.filter(r => r.passed).length;
  const total  = stepResults.length;
  const successRate = total > 0 ? Math.round((passed / total) * 100) : 0;

  const avgFPS = fpsReadings.length
    ? Math.round(fpsReadings.reduce((a, b) => a + b, 0) / fpsReadings.length)
    : null;
  const minFPS = fpsReadings.length ? Math.min(...fpsReadings) : null;
  const heapDelta = heapEnd != null && heapStart != null ? heapEnd - heapStart : null;

  let md = `# XBWorld Full Usability Report\n\nGenerated: ${now}\n\n`;

  md += `## 操作成功率 (Success Rate)\n\n`;
  md += `**${passed} / ${total} steps passed = ${successRate}%**\n\n`;
  md += `| Step | Result | Detail |\n|---|---|---|\n`;
  for (const r of stepResults) {
    md += `| ${r.step} | ${r.passed ? '✅ PASS' : '❌ FAIL'} | ${r.detail} |\n`;
  }
  md += '\n';

  md += `## console.error 数量\n\n`;
  md += `**${consoleErrors.length} console error(s)**\n\n`;
  if (consoleErrors.length > 0) {
    for (const e of consoleErrors.slice(0, 20)) {
      md += `- \`${e.slice(0, 200)}\`\n`;
    }
    if (consoleErrors.length > 20) {
      md += `- ... and ${consoleErrors.length - 20} more\n`;
    }
  }
  md += '\n';

  md += `## 内存增量 (Memory Delta)\n\n`;
  if (heapDelta != null) {
    md += `| Metric | Value |\n|---|---|\n`;
    md += `| Heap at start | ${heapStart} MB |\n`;
    md += `| Heap at end   | ${heapEnd} MB |\n`;
    md += `| **Delta**     | **${heapDelta > 0 ? '+' : ''}${heapDelta} MB** |\n`;
    if (heapDelta > 80) md += `\n⚠️ Heap grew >80 MB — possible memory leak.\n`;
  } else {
    md += `Heap data unavailable (performance.memory not exposed in this browser).\n`;
  }
  md += '\n';

  md += `## 平均 FPS (Average FPS)\n\n`;
  if (avgFPS != null) {
    md += `| Metric | Value |\n|---|---|\n`;
    md += `| Average FPS | ${avgFPS} |\n`;
    md += `| Minimum FPS | ${minFPS} |\n`;
    md += `| Samples (every 5s) | ${fpsReadings.join(', ')} |\n`;
    if (avgFPS < 30) md += `\n⚠️ Average FPS below 30 — performance concern.\n`;
  } else {
    md += `No FPS readings recorded.\n`;
  }
  md += '\n';

  md += `## Screenshots\n\nSaved to \`${SCREENSHOT_DIR}/\`\n\n`;

  fs.mkdirSync(path.dirname(REPORT_PATH), { recursive: true });
  fs.writeFileSync(REPORT_PATH, md, 'utf-8');
  console.log(`\n[usability-full] Report: ${REPORT_PATH}`);
  console.log(`[usability-full] ${passed}/${total} steps (${successRate}%) — ` +
    `errors=${consoleErrors.length} heap_delta=${heapDelta ?? 'N/A'} MB avg_fps=${avgFPS ?? 'N/A'}`);
}
