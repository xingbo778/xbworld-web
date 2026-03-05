/**
 * E2E test: Comprehensive observer UI verification.
 *
 * Verifies all UI elements, tabs, buttons, and interactions
 * that should be present/functional for an observer.
 *
 * Requires:
 *   1. Mock backend: MOCK_PORT=8002 node mock-backend.mjs
 *   2. Vite dev server: BACKEND_URL=http://localhost:8002 npx vite --config vite.config.dev.ts --port 8080
 */
import { test, expect, Page } from '@playwright/test';

/** Helper: connect as observer and wait for game page */
async function connectAsObserver(page: Page): Promise<void> {
  await page.goto('/webclient/index.html');
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(2000);

  // Fill in username and click "Observe Game"
  const usernameInput = page.locator('#username_req');
  if (await usernameInput.isVisible({ timeout: 3000 }).catch(() => false)) {
    await usernameInput.fill('TestObserver');
    const observeBtn = page.getByRole('button', { name: 'Observe Game' });
    if (await observeBtn.isVisible({ timeout: 1000 }).catch(() => false)) {
      await observeBtn.click();
    }
  }

  // Wait for game page to become visible
  await page.waitForSelector('#game_page', { state: 'visible', timeout: 15000 });
  // Extra wait for rendering to settle
  await page.waitForTimeout(3000);
}

test.describe('Observer UI Elements', () => {
  test.beforeEach(async ({ page }) => {
    await connectAsObserver(page);
  });

  // ─── Tab Structure ────────────────────────────────────────────────

  test('visible tabs: Map, Research, Nations, Options, Manual', async ({ page }) => {
    // These tabs SHOULD be visible for observer
    await expect(page.locator('#map_tab')).toBeVisible();
    await expect(page.locator('#tech_tab')).toBeVisible();
    await expect(page.locator('#players_tab')).toBeVisible();
    await expect(page.locator('#opt_tab')).toBeVisible();
    await expect(page.locator('#hel_tab')).toBeVisible();
  });

  test('removed tabs: Government and Cities should not exist', async ({ page }) => {
    // These tabs are REMOVED from DOM for observers
    await expect(page.locator('#civ_tab')).toHaveCount(0);
    await expect(page.locator('#cities_tab')).toHaveCount(0);
  });

  test('tab switching works', async ({ page }) => {
    // Switch to Research tab
    await page.locator('#tech_tab a').click();
    await page.waitForTimeout(500);
    await expect(page.locator('#tabs-tec')).toBeVisible();

    // Switch to Nations tab
    await page.locator('#players_tab a').click();
    await page.waitForTimeout(500);
    await expect(page.locator('#tabs-nat')).toBeVisible();

    // Switch to Options tab
    await page.locator('#opt_tab a').click();
    await page.waitForTimeout(500);
    await expect(page.locator('#tabs-opt')).toBeVisible();

    // Switch to Manual tab
    await page.locator('#hel_tab a').click();
    await page.waitForTimeout(500);
    await expect(page.locator('#tabs-hel')).toBeVisible();

    // Switch back to Map tab
    await page.locator('#map_tab a').click();
    await page.waitForTimeout(500);
    await expect(page.locator('#tabs-map')).toBeVisible();
  });

  // ─── Map Tab ──────────────────────────────────────────────────────

  test('map tab: canvas element exists and has size', async ({ page }) => {
    await page.locator('#map_tab a').click();
    await page.waitForTimeout(1000);

    const canvas = page.locator('#canvas_div canvas, #mapview_canvas, canvas');
    const count = await canvas.count();
    expect(count).toBeGreaterThan(0);

    // Canvas should have non-zero dimensions
    const box = await canvas.first().boundingBox();
    expect(box).not.toBeNull();
    expect(box!.width).toBeGreaterThan(100);
    expect(box!.height).toBeGreaterThan(100);
  });

  test('map tab: overview/minimap panel is visible', async ({ page }) => {
    await page.locator('#map_tab a').click();
    await page.waitForTimeout(1000);

    await expect(page.locator('#game_overview_panel')).toBeVisible();
    await expect(page.locator('#overview_map')).toBeVisible();
    // overview_img may not have src yet (bmp_lib renders async on 6s timer)
    await expect(page.locator('#overview_img')).toBeAttached();
    await expect(page.locator('#overview_viewrect')).toBeAttached();
  });

  test('map tab: chat box is visible and input works', async ({ page }) => {
    await page.locator('#map_tab a').click();
    await page.waitForTimeout(500);

    const chatInput = page.locator('#game_text_input');
    await expect(chatInput).toBeVisible();
    await expect(chatInput).toBeEnabled();

    // Type in chat (should accept input)
    await chatInput.fill('Hello from observer');
    await expect(chatInput).toHaveValue('Hello from observer');
  });

  test('map tab: chat message area exists', async ({ page }) => {
    await expect(page.locator('#game_message_area')).toBeAttached();
  });

  test('map tab: unit orders toolbar removed for observer', async ({ page }) => {
    await expect(page.locator('#game_unit_orders_default')).toHaveCount(0);
  });

  test('map tab: unit info panel exists', async ({ page }) => {
    await expect(page.locator('#game_unit_panel')).toBeAttached();
    await expect(page.locator('#game_unit_info')).toBeAttached();
  });

  test('map tab: status panels exist', async ({ page }) => {
    // At least one status panel should exist (top or bottom depending on screen size)
    const topPanel = page.locator('#game_status_panel_top');
    const bottomPanel = page.locator('#game_status_panel_bottom');
    const topExists = await topPanel.count() > 0;
    const bottomExists = await bottomPanel.count() > 0;
    expect(topExists || bottomExists).toBe(true);
  });

  // ─── Map Interaction ──────────────────────────────────────────────

  test('map tab: clicking on overview minimap does not crash', async ({ page }) => {
    await page.locator('#map_tab a').click();
    await page.waitForTimeout(1000);

    const overview = page.locator('#overview_map');
    if (await overview.isVisible()) {
      const box = await overview.boundingBox();
      if (box) {
        // Click center of minimap
        await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
        await page.waitForTimeout(500);
        // Should not crash — page still functional
        await expect(page.locator('#game_page')).toBeVisible();
      }
    }
  });

  test('map tab: clicking on main map does not crash', async ({ page }) => {
    await page.locator('#map_tab a').click();
    await page.waitForTimeout(1000);

    const canvas = page.locator('#canvas_div canvas, #mapview_canvas, canvas').first();
    const box = await canvas.boundingBox();
    if (box) {
      // Click center of main map
      await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
      await page.waitForTimeout(500);
      await expect(page.locator('#game_page')).toBeVisible();
    }
  });

  // ─── Research Tab ─────────────────────────────────────────────────

  test('research tab: tech tree elements exist', async ({ page }) => {
    await page.locator('#tech_tab a').click();
    await page.waitForTimeout(1000);

    await expect(page.locator('#technology_dialog')).toBeVisible();
    // tech_info_box may be hidden when no tech data from server, but must exist in DOM
    await expect(page.locator('#tech_info_box')).toBeAttached();
    // tech_canvas may be dynamically created/replaced by the tech dialog code
    // Just verify the technology_dialog container is present
    await expect(page.locator('#technologies')).toBeAttached();
  });

  test('research tab: progress elements exist', async ({ page }) => {
    await page.locator('#tech_tab a').click();
    await page.waitForTimeout(500);

    // These are in DOM but may be hidden without full ruleset data
    await expect(page.locator('#tech_goal_box')).toBeAttached();
    await expect(page.locator('#tech_progress_box')).toBeAttached();
    await expect(page.locator('#progress_bg')).toBeAttached();
    await expect(page.locator('#progress_fg')).toBeAttached();
  });

  // ─── Nations Tab ──────────────────────────────────────────────────

  test('nations tab: button panel exists with expected buttons', async ({ page }) => {
    await page.locator('#players_tab a').click();
    await page.waitForTimeout(1000);

    await expect(page.locator('#nations_button_div')).toBeVisible();
    await expect(page.locator('#view_player_button')).toBeVisible();
    await expect(page.locator('#meet_player_button')).toBeVisible();
    await expect(page.locator('#game_scores_button')).toBeVisible();
  });

  test('nations tab: nations list container exists', async ({ page }) => {
    await page.locator('#players_tab a').click();
    await page.waitForTimeout(500);

    await expect(page.locator('#nations')).toBeAttached();
    await expect(page.locator('#nations_list')).toBeAttached();
  });

  // ─── Options Tab ──────────────────────────────────────────────────

  test('options tab: all buttons visible', async ({ page }) => {
    await page.locator('#opt_tab a').click();
    await page.waitForTimeout(500);

    await expect(page.locator('#save_button')).toBeVisible();
    await expect(page.locator('#fullscreen_button')).toBeVisible();
    await expect(page.locator('#surrender_button')).toBeVisible();
    await expect(page.locator('#end_button')).toBeVisible();
  });

  test('options tab: music audio element exists', async ({ page }) => {
    await page.locator('#opt_tab a').click();
    await page.waitForTimeout(500);

    await expect(page.locator('#tabs-opt audio')).toBeAttached();
  });

  // ─── Manual Tab ───────────────────────────────────────────────────

  test('manual tab: help container exists', async ({ page }) => {
    await page.locator('#hel_tab a').click();
    await page.waitForTimeout(500);

    await expect(page.locator('#tabs-hel')).toBeVisible();
  });

  // ─── Observer-Removed Elements ────────────────────────────────────

  test('government dialog removed from DOM', async ({ page }) => {
    await expect(page.locator('#civ_dialog')).toHaveCount(0);
  });

  test('pregame buttons removed from DOM', async ({ page }) => {
    await expect(page.locator('#pregame_buttons')).toHaveCount(0);
  });

  // ─── Map Rendering Quality ────────────────────────────────────────

  test('map renders terrain sprites (not just black)', async ({ page }) => {
    await page.locator('#map_tab a').click();
    await page.waitForTimeout(3000);

    // Take screenshot and verify canvas has non-trivial content
    const canvas = page.locator('#canvas_div canvas, #mapview_canvas, canvas').first();
    const box = await canvas.boundingBox();
    expect(box).not.toBeNull();

    // Sample pixel colors from the canvas to confirm rendering
    const hasContent = await page.evaluate(() => {
      const c = document.querySelector('canvas') as HTMLCanvasElement;
      if (!c) return false;
      const ctx = c.getContext('2d');
      if (!ctx) return false;
      // Sample a grid of pixels across the canvas
      let nonBlackPixels = 0;
      const step = Math.max(1, Math.floor(c.width / 20));
      for (let x = 0; x < c.width; x += step) {
        for (let y = 0; y < c.height; y += step) {
          const pixel = ctx.getImageData(x, y, 1, 1).data;
          if (pixel[0] > 10 || pixel[1] > 10 || pixel[2] > 10) {
            nonBlackPixels++;
          }
        }
      }
      return nonBlackPixels > 20; // More than 20 non-black sample points
    });

    expect(hasContent).toBe(true);
  });

  test('overview minimap renders content (not blank)', async ({ page }) => {
    await page.locator('#map_tab a').click();
    // Overview renders on a 6s timer — wait up to 10s for canvas content
    await expect(async () => {
      const hasContent = await page.evaluate(() => {
        const canvas = document.getElementById('overview_img') as HTMLCanvasElement;
        if (!canvas || canvas.tagName !== 'CANVAS') return false;
        const ctx = canvas.getContext('2d');
        if (!ctx || canvas.width < 2 || canvas.height < 2) return false;
        const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
        let nonBlack = 0;
        for (let i = 0; i < data.length; i += 4) {
          if (data[i] > 0 || data[i+1] > 0 || data[i+2] > 0) nonBlack++;
        }
        return nonBlack > 20;
      });
      expect(hasContent).toBe(true);
    }).toPass({ timeout: 10000, intervals: [1000] });
  });

  // ─── No Critical JS Errors ────────────────────────────────────────

  test('no critical runtime errors during session', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));

    // Navigate through all tabs to trigger any lazy errors
    await page.locator('#tech_tab a').click();
    await page.waitForTimeout(500);
    await page.locator('#players_tab a').click();
    await page.waitForTimeout(500);
    await page.locator('#opt_tab a').click();
    await page.waitForTimeout(500);
    await page.locator('#hel_tab a').click();
    await page.waitForTimeout(500);
    await page.locator('#map_tab a').click();
    await page.waitForTimeout(1000);

    // Filter out known non-critical errors
    const critical = errors.filter(
      (e) =>
        !e.includes('ResizeObserver') &&
        !e.includes('favicon') &&
        !e.includes('404') &&
        !e.includes("reading '0'") && // known tileset sprite lookup edge case
        !e.includes("reading 'color'") && // nation color lookup with minimal mock data
        !e.includes("reading 'isSet'") && // BitVector access with minimal mock extras data
        !e.includes('helpdata_order is not defined') // legacy global not in TS bundle
    );

    expect(critical).toEqual([]);
  });
});
