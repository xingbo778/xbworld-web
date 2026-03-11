import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({ viewport: { width: 1280, height: 720 } });
const page = await ctx.newPage();

const errors = [];
page.on('console', m => { if (m.type() === 'error') errors.push(m.text().slice(0, 200)); });

await page.goto('http://localhost:3000/webclient/index.html?civserverport=6000', { waitUntil: 'domcontentloaded' });
await page.waitForSelector('#username_req', { timeout: 10000 });
await page.evaluate(() => {
  document.getElementById('username_req').value = 'Debug99';
  document.querySelectorAll('button').forEach(b => { if (b.textContent.includes('Observe')) b.click(); });
});
await page.waitForTimeout(15000);

const info = await page.evaluate(() => {
  // Check sprite cache 
  const s = window.store || window._store;
  const sprites = s?.sprites || window.sprites;
  const spriteKeys = sprites ? Object.keys(sprites) : [];
  const terrainKeys = spriteKeys.filter(k => k.startsWith('t.') || k.startsWith('t_'));
  const tundraKey = spriteKeys.find(k => k.toLowerCase().includes('tundra') || k.includes('t.tundra'));
  
  // Sample some tile data
  const tiles = s?.tiles || window.tiles;
  const tileKeys = tiles ? Object.keys(tiles) : [];
  const sampleTile = tileKeys.length > 0 ? tiles[tileKeys[0]] : null;
  
  // Check terrain data
  const terrains = s?.terrains || window.terrains;
  const terrainIds = terrains ? Object.keys(terrains) : [];
  const sampleTerrain = terrainIds.length > 0 ? terrains[terrainIds[0]] : null;

  // Check what fill_sprite_array would return for terrain layer
  return {
    totalSprites: spriteKeys.length,
    terrainSpriteSample: terrainKeys.slice(0, 10),
    hasTundra: !!tundraKey,
    tileCount: tileKeys.length,
    sampleTileKnown: sampleTile?.known,
    sampleTileTerrainId: sampleTile?.terrain,
    terrainCount: terrainIds.length,
    sampleTerrainGraphicStr: sampleTerrain?.graphic_str,
    // Check tileset global
    tilesetDefined: typeof window.tileset !== 'undefined',
    tilesetKeys: typeof window.tileset !== 'undefined' ? Object.keys(window.tileset).slice(0, 5) : [],
  };
});
console.log('Terrain debug info:');
console.log(JSON.stringify(info, null, 2));
console.log('\nErrors:', errors.length > 0 ? errors.slice(0, 5) : 'none');

// Take screenshot to check visual state
await page.screenshot({ path: '/tmp/terrain_debug.png' });
await browser.close();
