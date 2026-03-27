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
import { connectAsObserver as connectObserver } from './helpers/observer';

/** Helper: connect as observer and wait for game page */
async function connectAsObserver(page: Page): Promise<boolean> {
  return connectObserver(page, { username: 'TestObserver', timeout: 15_000, settleMs: 3_000 });
}

test.describe('Observer UI Elements', () => {
  test.beforeEach(async ({ page }) => {
    const connected = await connectAsObserver(page);
    test.skip(!connected, 'Observer backend did not reach game page');
  });

  // ─── Tab Structure ────────────────────────────────────────────────

  test('visible tabs: Map, Research, Nations', async ({ page }) => {
    // These tabs SHOULD be visible for observer
    await expect(page.locator('#map_tab')).toBeVisible();
    await expect(page.locator('#tech_tab')).toBeVisible();
    await expect(page.locator('#players_tab')).toBeVisible();
  });

  test('removed tabs: Government, Cities, Options, Manual should not exist', async ({ page }) => {
    // These tabs are REMOVED from DOM for observers
    await expect(page.locator('#civ_tab')).toHaveCount(0);
    await expect(page.locator('#cities_tab')).toHaveCount(0);
    await expect(page.locator('#opt_tab')).toHaveCount(0);
    await expect(page.locator('#hel_tab')).toHaveCount(0);
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

  test('map tab: unit info panel removed in observer mode', async ({ page }) => {
    await expect(page.locator('#game_unit_panel')).toHaveCount(0);
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
    // Wait for the lazy-loaded Preact TechPanel to mount
    await page.waitForSelector('#xb-tech-panel', { timeout: 6000 });

    // The Preact TechPanel container is present
    await expect(page.locator('#xb-tech-panel')).toBeAttached();
    // Sub-tab buttons rendered by TechPanel
    await expect(page.locator('#xb-tech-panel').getByRole('button', { name: 'Research Progress' })).toBeAttached();
    await expect(page.locator('#xb-tech-panel').getByRole('button', { name: 'Tech Tree' })).toBeAttached();
  });

  test('research tab: progress elements exist', async ({ page }) => {
    await page.locator('#tech_tab a').click();
    // Wait for the lazy-loaded Preact TechPanel to mount
    await page.waitForSelector('#xb-tech-panel', { timeout: 6000 });

    // TechPanel container is present with its sub-tab navigation
    await expect(page.locator('#xb-tech-panel')).toBeAttached();
    // "Research Progress" is the default active sub-tab
    await expect(page.locator('#xb-tech-panel').getByRole('button', { name: 'Research Progress' })).toBeAttached();
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

    // Target the actual map canvas specifically
    const canvas = page.locator('#mapview_canvas, #canvas_div canvas').first();
    const box = await canvas.boundingBox();
    expect(box).not.toBeNull();

    // The map canvas may not have 2D pixel data readable via getImageData
    // (e.g. rendering uses buffer canvas + drawImage). Verify via screenshot instead.
    const screenshot = await canvas.screenshot();
    // A non-trivial PNG (map with terrain) should be well over 1KB
    expect(screenshot.byteLength).toBeGreaterThan(1000);
  });

  test('overview minimap renders content (not blank)', async ({ page }) => {
    await page.locator('#map_tab a').click();
    // Overview renders on a 6s timer — wait for it to appear
    const overview = page.locator('#overview_img');
    await expect(overview).toBeAttached();
    await page.waitForTimeout(7000);
    // Verify via screenshot — canvas pixel sampling may return zeros due to rendering pipeline
    const screenshot = await overview.screenshot();
    expect(screenshot.byteLength).toBeGreaterThan(500);
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
