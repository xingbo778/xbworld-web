import { chromium } from 'playwright';

const GAME_URL = 'http://localhost:3000/webclient/index.html?civserverport=6000';
const browser = await chromium.launch({ headless: false });
const ctx = await browser.newContext({ viewport: { width: 1280, height: 720 } });
const page = await ctx.newPage();

const errors = [];
page.on('console', m => { if (m.type() === 'error') errors.push(m.text().slice(0, 80)); });

await page.goto(GAME_URL, { waitUntil: 'domcontentloaded', timeout: 15000 });
await page.waitForSelector('#username_req', { timeout: 10000 });
await page.evaluate(() => {
  document.getElementById('username_req').value = 'Watcher99';
  document.querySelectorAll('button').forEach(b => { if (b.textContent.includes('Observe')) b.click(); });
});
await page.waitForTimeout(12000);

// Get initial map position
const pos0 = await page.evaluate(() => {
  const S = window.__store || window.store;
  return S ? { x: S.mapview?.gui_x0, y: S.mapview?.gui_y0 } : null;
});

// Perform 10 drag operations on the canvas
const canvas = page.locator('#canvas');
const box = await canvas.boundingBox();
const cx = box.x + box.width / 2;
const cy = box.y + box.height / 2;

const positions = [];
for (let i = 0; i < 10; i++) {
  await page.mouse.move(cx, cy);
  await page.mouse.down();
  await page.mouse.move(cx - 100, cy - 50, { steps: 5 });
  await page.mouse.up();
  await page.waitForTimeout(300);

  const pos = await page.evaluate(() => {
    const mv = window._mapview || (window.store && window.store.mapview);
    if (mv) return { x: Math.round(mv.gui_x0), y: Math.round(mv.gui_y0) };
    // Fallback: look for Preact/React state
    return null;
  });
  positions.push(pos);
}

console.log('\nDrag positions (should change each time):');
positions.forEach((p, i) => console.log(`  drag ${i+1}: ${JSON.stringify(p)}`));
console.log('\nErrors during test:', errors.length > 0 ? errors.slice(0, 5) : 'none');

await page.screenshot({ path: '/tmp/drag_test.png' });
console.log('Screenshot: /tmp/drag_test.png');

await page.waitForTimeout(4000);
await browser.close();
