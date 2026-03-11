import { test } from '@playwright/test';

test('sprite deep diagnostic', async ({ page }) => {
  const logs: string[] = [];
  page.on('console', msg => logs.push(`[${msg.type()}] ${msg.text()}`));
  page.on('pageerror', err => logs.push(`[ERROR] ${err.message}`));

  await page.goto('http://localhost:8080/webclient/index.html?username=SpriteDiag', { waitUntil: 'domcontentloaded' });

  // Inject monitoring hooks into the page immediately after load
  await page.evaluate(() => {
    const w = window as any;
    w.__spriteDiag = {
      init_sprites_called: false,
      preload_check_called: 0,
      init_cache_called: false,
      phase1_started: false,
      phase1_done: false,
      phase2_batches: 0,
      phase2_done: false,
      sprites_populated: 0,
      errors: [] as string[],
    };

    // Patch createImageBitmap to monitor calls
    const origCIB = createImageBitmap;
    let cibCallCount = 0;
    (window as any).createImageBitmap = async function(...args: any[]) {
      cibCallCount++;
      (window as any).__cibCallCount = cibCallCount;
      try {
        return await origCIB.apply(this, args as any);
      } catch (e: any) {
        w.__spriteDiag.errors.push('cib error: ' + e.message);
        throw e;
      }
    };
  });

  // Wait for game page
  await page.waitForFunction(() => {
    const gp = document.getElementById('game_page');
    return gp && window.getComputedStyle(gp).display !== 'none';
  }, { timeout: 20_000 }).catch(() => {});

  // Check state right after
  const snap1 = await page.evaluate(() => {
    const w = window as any;
    return {
      spriteCount: w.store?.sprites ? Object.keys(w.store.sprites).length : 0,
      tilesetKeys: w.tileset ? Object.keys(w.tileset).length : 0,
      cibCalls: w.__cibCallCount || 0,
      diag: w.__spriteDiag,
      blockUI: !!document.querySelector('.xb-block-overlay'),
    };
  });
  console.log('After game page:', JSON.stringify(snap1));

  // Wait more
  await page.waitForTimeout(10000);
  const snap2 = await page.evaluate(() => {
    const w = window as any;
    return {
      spriteCount: w.store?.sprites ? Object.keys(w.store.sprites).length : 0,
      cibCalls: w.__cibCallCount || 0,
      diag: w.__spriteDiag,
      blockUI: !!document.querySelector('.xb-block-overlay'),
      // try a manual createImageBitmap  
      tilesetFirstEntry: w.tileset ? JSON.stringify(Object.entries(w.tileset)[0]) : 'null',
    };
  });
  console.log('After +10s:', JSON.stringify(snap2));

  // Try manual sprite creation
  const manualTest = await page.evaluate(async () => {
    const w = window as any;
    if (!w.tileset) return { error: 'no tileset' };
    // Try creating one sprite manually
    try {
      const entries = Object.entries(w.tileset);
      const [tag, coords] = entries[0] as [string, number[]];
      const [x, y, width, height, imgIdx] = coords;
      
      // Try to find the tileset images from window
      const images = document.querySelectorAll('img[src*="tileset"]') as NodeListOf<HTMLImageElement>;
      if (images.length === 0) return { error: 'no tileset images found in DOM' };
      
      const img = images[imgIdx];
      if (!img) return { error: `no image at index ${imgIdx}` };
      
      const bmp = await createImageBitmap(img, x, y, width, height);
      return { success: true, tag, bmpSize: `${bmp.width}x${bmp.height}` };
    } catch (e: any) {
      return { error: e.message };
    }
  });
  console.log('Manual createImageBitmap test:', JSON.stringify(manualTest));

  console.log(`Total logs: ${logs.length}`);
  logs.forEach(l => console.log(l));

  await page.screenshot({ path: 'test-results/sprite-diag.png' }).catch(() => {});
});
