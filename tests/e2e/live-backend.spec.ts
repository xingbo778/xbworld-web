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
 * Requires dev server on port 3000:
 *   BACKEND_URL=http://localhost:8080 npx vite --config vite.config.dev.ts --port 3000 --host 127.0.0.1
 */
import { test, expect } from '@playwright/test';

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

  test('should mount Preact IntroDialog with username input', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));

    await blockBackend(page);
    await page.goto('/webclient/index.html', { waitUntil: 'domcontentloaded' });

    // IntroDialog (Preact) should mount and show username input
    await expect(page.locator('#username_req')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Observe Game' })).toBeVisible();

    // No critical JS errors
    const criticalErrors = errors.filter(
      (e) => !e.includes('ResizeObserver') && !e.includes('favicon') && !e.includes('404')
    );
    expect(criticalErrors).toHaveLength(0);
  });
});
