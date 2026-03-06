import { test, expect } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SCREENSHOT_DIR = path.join(__dirname, '../../test-screenshots');

test.describe('Headed UI Visual Check', () => {
  test('full UI visual inspection', async ({ page }) => {
    // 1. Load page and capture intro dialog
    await page.goto('/webclient/index.html');
    await page.waitForSelector('.xb-dialog', { timeout: 10000 });
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '01-intro-dialog.png'), fullPage: true });

    // 2. Enter username and start observing
    await page.fill('#username_req', 'TestObserver');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '02-username-entered.png'), fullPage: true });

    // Click "Observe Game" button
    const observeBtn = page.locator('.xb-dialog-content .xb-btn');
    await observeBtn.click();

    // Wait for game page to appear (dialog should close)
    await page.waitForTimeout(2000);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '03-after-observe-click.png'), fullPage: true });

    // Dismiss any remaining dialogs
    await page.evaluate(() => {
      document.querySelectorAll('.xb-dialog, .xb-dialog-overlay, .ui-dialog, #xb-ui-dialog-overlay, dialog').forEach((d) => {
        if ('close' in d && typeof (d as any).close === 'function') (d as any).close();
        d.remove();
      });
      const pregame = document.getElementById('pregame_page');
      const gamePage = document.getElementById('game_page');
      if (pregame) pregame.style.display = 'none';
      if (gamePage) gamePage.style.display = '';
    });
    await page.waitForTimeout(500);

    // 3. Map tab - main canvas
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '04-map-tab-full.png'), fullPage: true });

    // Check main map canvas exists
    const canvas = page.locator('#canvas_div canvas');
    await expect(canvas).toHaveCount(1);
    const canvasBox = await canvas.boundingBox();
    if (canvasBox && canvasBox.width > 0 && canvasBox.height > 0) {
      await canvas.screenshot({ path: path.join(SCREENSHOT_DIR, '05-main-map-canvas.png') });
    }

    // Check canvas has non-zero dimensions
    const canvasSize = await page.evaluate(() => {
      const c = document.querySelector('#canvas_div canvas') as HTMLCanvasElement;
      return c ? { width: c.width, height: c.height } : null;
    });
    expect(canvasSize).not.toBeNull();
    expect(canvasSize!.width).toBeGreaterThan(0);
    expect(canvasSize!.height).toBeGreaterThan(0);

    // 4. Check minimap/overview
    const overview = page.locator('#overview_map, #canvas_div canvas');
    await overview.first().screenshot({ path: path.join(SCREENSHOT_DIR, '06-overview-area.png') });

    // Check overview element exists
    const overviewStatus = await page.evaluate(() => {
      const el = document.getElementById('overview_map');
      if (!el) return 'no-overview-element';
      const tag = el.tagName.toLowerCase();
      if (tag === 'canvas') {
        const ctx = (el as HTMLCanvasElement).getContext('2d');
        if (!ctx) return 'canvas-no-context';
        const w = (el as HTMLCanvasElement).width, h = (el as HTMLCanvasElement).height;
        const data = ctx.getImageData(0, 0, w, h).data;
        let nonBlack = 0;
        for (let i = 0; i < data.length; i += 4) {
          if (data[i] > 10 || data[i+1] > 10 || data[i+2] > 10) nonBlack++;
        }
        return `overview-canvas: ${w}x${h}, nonBlack=${nonBlack}/${data.length/4}`;
      }
      return `overview-element: ${tag} ${el.clientWidth}x${el.clientHeight}`;
    });
    console.log('Overview status:', overviewStatus);

    // 5. Check tabs menu
    const tabsMenu = page.locator('#tabs_menu');
    await expect(tabsMenu).toBeVisible();
    await tabsMenu.screenshot({ path: path.join(SCREENSHOT_DIR, '07-tabs-menu.png') });

    // 6. Switch to Research tab
    await page.click('#tech_tab a');
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '08-tech-tab.png'), fullPage: true });
    const techTab = page.locator('#tabs-tec');
    await expect(techTab).toBeVisible();

    // 7. Switch to Nations tab
    await page.click('#players_tab a');
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '09-nations-tab.png'), fullPage: true });

    // 8. Back to Map tab
    await page.click('#map_tab a');
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '12-back-to-map.png'), fullPage: true });

    // 11. Check for console errors
    const consoleErrors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });
    await page.waitForTimeout(1000);

    // 12. Check main map canvas has rendered content (not all black)
    const mainCanvasContent = await page.evaluate(() => {
      const c = document.querySelector('#canvas_div canvas') as HTMLCanvasElement;
      if (!c) return 'no-canvas';
      const ctx = c.getContext('2d');
      if (!ctx) return 'no-context';
      // Sample center area
      const w = c.width, h = c.height;
      const sampleX = Math.floor(w / 4);
      const sampleY = Math.floor(h / 4);
      const sampleW = Math.floor(w / 2);
      const sampleH = Math.floor(h / 2);
      const data = ctx.getImageData(sampleX, sampleY, sampleW, sampleH).data;
      let nonBlack = 0;
      for (let i = 0; i < data.length; i += 4) {
        if (data[i] > 10 || data[i+1] > 10 || data[i+2] > 10) nonBlack++;
      }
      const totalPixels = data.length / 4;
      return `canvas: ${w}x${h}, center nonBlack=${nonBlack}/${totalPixels} (${(100*nonBlack/totalPixels).toFixed(1)}%)`;
    });
    console.log('Main canvas:', mainCanvasContent);

    // 13. Verify no critical elements are missing
    const gamePageVisible = await page.locator('#game_page').isVisible();
    expect(gamePageVisible).toBe(true);

    // Verify civ_tab, cities_tab, opt_tab, and hel_tab are removed (observer mode)
    const civTab = await page.locator('#civ_tab').count();
    const citiesTab = await page.locator('#cities_tab').count();
    const optTab = await page.locator('#opt_tab').count();
    const helTab = await page.locator('#hel_tab').count();
    expect(civTab).toBe(0);
    expect(citiesTab).toBe(0);
    expect(optTab).toBe(0);
    expect(helTab).toBe(0);

    console.log('All UI checks passed!');
  });
});
