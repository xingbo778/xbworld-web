import { chromium } from 'playwright';

const GAME_URL = 'http://localhost:3000/webclient/index.html?civserverport=6000';
const browser = await chromium.launch({ headless: false });
const ctx = await browser.newContext({ viewport: { width: 1280, height: 720 } });
const page = await ctx.newPage();

// Capture console errors
const errors = [];
page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
page.on('pageerror', e => errors.push(e.message));

await page.goto(GAME_URL, { waitUntil: 'domcontentloaded', timeout: 15000 });

// Check CSS loaded
const cssLoaded = await page.evaluate(() => {
  const links = [...document.querySelectorAll('link[rel=stylesheet]')];
  return links.map(l => ({ href: l.href, loaded: !l.sheet?.disabled }));
});
console.log('CSS links:', JSON.stringify(cssLoaded));

await page.waitForSelector('#username_req', { timeout: 10000 });
await page.evaluate(() => {
  document.getElementById('username_req').value = 'Watcher99';
  document.querySelectorAll('button').forEach(b => { if (b.textContent.includes('Observe')) b.click(); });
});
await page.waitForTimeout(12000);

const layout = await page.evaluate(() => {
  function info(id) {
    const el = document.getElementById(id);
    if (!el) return { found: false };
    const rect = el.getBoundingClientRect();
    const style = getComputedStyle(el);
    return {
      found: true,
      rect: { top: Math.round(rect.top), left: Math.round(rect.left), w: Math.round(rect.width), h: Math.round(rect.height) },
      display: style.display, visibility: style.visibility, opacity: style.opacity,
    };
  }
  return {
    overview: info('game_overview_panel'),
    overviewImg: info('overview_img'),
    canvas: info('canvas'),
    chatbox: info('game_chatbox_panel'),
    viewport: { w: window.innerWidth, h: window.innerHeight },
    cssVar: getComputedStyle(document.documentElement).getPropertyValue('--xb-z-ui'),
  };
});
console.log('\n=== Layout after fix ===');
console.log(JSON.stringify(layout, null, 2));
console.log('\n=== Console errors ===');
errors.slice(0, 10).forEach(e => console.log(e));

await page.screenshot({ path: '/tmp/verify_fixes.png' });
console.log('\nScreenshot saved: /tmp/verify_fixes.png');

await page.waitForTimeout(5000);
await browser.close();
