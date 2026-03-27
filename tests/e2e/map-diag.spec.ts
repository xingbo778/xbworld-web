import { test } from '@playwright/test';
import { XbwPageGlobals } from './helpers/pageGlobals';

test('sprite deep diagnostic', async ({ page }) => {
  const logs: string[] = [];
  page.on('console', msg => logs.push(`[${msg.type()}] ${msg.text()}`));
  page.on('pageerror', err => logs.push(`[ERROR] ${err.message}`));

  await page.goto('http://localhost:8080/webclient/index.html?username=SpriteDiag', { waitUntil: 'domcontentloaded' });

  // Inject monitoring hooks into the page immediately after load
  await page.evaluate(() => {
    const w = window as XbwPageGlobals;
    type CreateImageBitmapArgs =
      | [image: ImageBitmapSource, options?: ImageBitmapOptions]
      | [image: ImageBitmapSource, sx: number, sy: number, sw: number, sh: number, options?: ImageBitmapOptions];
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
    const patchedCreateImageBitmap: typeof createImageBitmap = async (...args: CreateImageBitmapArgs) => {
      cibCallCount++;
      w.__cibCallCount = cibCallCount;
      try {
        if (typeof args[1] !== 'number') {
          const [image, options] = args;
          return await origCIB(image, options);
        }
        const [image, sx, sy, sw, sh, options] =
          args as [ImageBitmapSource, number, number, number, number, ImageBitmapOptions?];
        return await origCIB(image, sx, sy, sw, sh, options);
      } catch (e) {
        const message = e instanceof Error ? e.message : String(e);
        w.__spriteDiag?.errors.push('cib error: ' + message);
        throw e;
      }
    };
    window.createImageBitmap = patchedCreateImageBitmap;
  });

  // Wait for game page
  await page.waitForFunction(() => {
    const gp = document.getElementById('game_page');
    return gp && window.getComputedStyle(gp).display !== 'none';
  }, { timeout: 20_000 }).catch(() => {});

  const gameVisible = await page.evaluate(() => {
    const gp = document.getElementById('game_page');
    return !!gp && window.getComputedStyle(gp).display !== 'none';
  });
  test.skip(!gameVisible, 'Backend did not reach game page');

  // Check state right after
  const snap1 = await page.evaluate(() => {
    const w = window as XbwPageGlobals;
    return {
      spriteCount: w.__store?.sprites ? Object.keys(w.__store.sprites).length : 0,
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
    const w = window as XbwPageGlobals;
    return {
      spriteCount: w.__store?.sprites ? Object.keys(w.__store.sprites).length : 0,
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
    const w = window as XbwPageGlobals;
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
    } catch (e) {
      return { error: e instanceof Error ? e.message : String(e) };
    }
  });
  console.log('Manual createImageBitmap test:', JSON.stringify(manualTest));

  console.log(`Total logs: ${logs.length}`);
  logs.forEach(l => console.log(l));

  await page.screenshot({ path: 'test-results/sprite-diag.png' }).catch(() => {});
});
