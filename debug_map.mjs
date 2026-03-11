import { chromium } from 'playwright';

const GAME_URL = 'http://localhost:3000/webclient/index.html?civserverport=6000';
const browser = await chromium.launch({ headless: false });
const ctx = await browser.newContext();
const page = await ctx.newPage();

await page.goto(GAME_URL, { waitUntil: 'domcontentloaded', timeout: 15000 });
await page.waitForSelector('#username_req', { timeout: 10000 });
await page.evaluate(() => {
  document.getElementById('username_req').value = 'Watcher99';
  document.querySelectorAll('button').forEach(b => { if (b.textContent.includes('Observe')) b.click(); });
});
await page.waitForSelector('#username_req', { state: 'detached', timeout: 5000 }).catch(() => {});
await page.waitForTimeout(12000);

// Comprehensive element visibility check
const layout = await page.evaluate(() => {
  function info(id) {
    const el = document.getElementById(id);
    if (!el) return { found: false };
    const rect = el.getBoundingClientRect();
    const style = getComputedStyle(el);
    return {
      found: true,
      rect: { top: Math.round(rect.top), left: Math.round(rect.left), w: Math.round(rect.width), h: Math.round(rect.height) },
      display: style.display,
      visibility: style.visibility,
      zIndex: style.zIndex,
      opacity: style.opacity,
    };
  }
  return {
    mapviewCanvasDiv: info('mapview_canvas_div'),
    canvasDiv: info('canvas_div'),
    canvas: info('canvas'),
    overviewPanel: info('game_overview_panel'),
    overviewMap: info('overview_map'),
    overviewImg: info('overview_img'),
    chatbox: info('game_chatbox_panel'),
    statusBottom: info('game_status_panel_bottom'),
    viewportSize: { w: window.innerWidth, h: window.innerHeight },
  };
});
console.log('\n=== Layout ===');
console.log(JSON.stringify(layout, null, 2));

// Check element at overview panel location - is something covering it?
const overviewPanelRect = await page.evaluate(() => {
  const panel = document.getElementById('game_overview_panel');
  if (!panel) return null;
  const rect = panel.getBoundingClientRect();
  // Find element at center of overview panel
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  const topEl = document.elementFromPoint(centerX, centerY);
  return {
    panelRect: { top: Math.round(rect.top), left: Math.round(rect.left), w: Math.round(rect.width), h: Math.round(rect.height) },
    centerPoint: { x: Math.round(centerX), y: Math.round(centerY) },
    topElementId: topEl ? topEl.id : 'none',
    topElementTag: topEl ? topEl.tagName : 'none',
    topElementClass: topEl ? topEl.className : 'none',
  };
});
console.log('\n=== Overview panel coverage ===', JSON.stringify(overviewPanelRect));

await page.screenshot({ path: '/tmp/xbworld_layout.png', fullPage: false });
console.log('\nScreenshot saved: /tmp/xbworld_layout.png');

await page.waitForTimeout(5000);
await browser.close();
