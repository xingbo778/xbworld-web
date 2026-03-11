import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({ viewport: { width: 1280, height: 720 } });
const page = await ctx.newPage();

const logs = [];
page.on('console', m => logs.push(`[${m.type()}] ${m.text().slice(0, 250)}`));

await page.goto('http://localhost:3000/webclient/index.html?civserverport=6000', { waitUntil: 'domcontentloaded' });
await page.waitForSelector('#username_req', { timeout: 10000 });
await page.evaluate(() => {
  document.getElementById('username_req').value = 'Debug99';
  document.querySelectorAll('button').forEach(b => { if (b.textContent.includes('Observe')) b.click(); });
});
await page.waitForTimeout(18000);

const info = await page.evaluate(() => {
  const s = window.store;
  
  // Check store.sprites (the actual sprite cache used by renderer)
  const storeSprites = s?.sprites;
  const storeSpritesCount = storeSprites ? Object.keys(storeSprites).length : -1;
  
  // Check sprites_init
  const spritesInit = window.sprites_init;
  
  // Check loaded_images vs tileset_image_count
  const loadedImages = window.loaded_images;
  const imageCount = window.tileset_image_count;
  
  // Check tileset images in DOM
  const imgElems = [...document.querySelectorAll('img')].map(img => ({
    src: img.src.split('/').pop(),
    complete: img.complete,
    naturalWidth: img.naturalWidth,
  }));
  
  return {
    storeSpritesCount,
    spritesInit,
    loadedImages,
    imageCount,
    imgCount: imgElems.length,
    imgSample: imgElems.slice(0, 5),
  };
});
console.log('Sprite load state:', JSON.stringify(info, null, 2));
console.log('\nErrors/Warnings:');
logs.filter(l => l.includes('[error]') || l.includes('[warn') || l.includes('tileset') || l.includes('Tileset')).forEach(l => console.log(l));

await browser.close();
