import { chromium } from 'playwright';

const browser = await chromium.launch({ headless: false });
const ctx = await browser.newContext({ viewport: { width: 1280, height: 720 } });
const page = await ctx.newPage();

const logs = [];
page.on('console', m => logs.push(`[${m.type()}] ${m.text().slice(0, 120)}`));
page.on('pageerror', e => logs.push(`[pageerror] ${e.message.slice(0, 120)}`));

// Track network failures
page.on('requestfailed', req => logs.push(`[FAILED] ${req.url().replace('http://localhost:3000','')}`));

await page.goto('http://localhost:3000/webclient/index.html?civserverport=6000', { waitUntil: 'domcontentloaded', timeout: 15000 });
await page.waitForTimeout(3000);

const state1 = await page.evaluate(() => ({
  introVisible: !!document.querySelector('.xb-intro-dialog, .xb-dialog-overlay, #username_req'),
  bodyBg: getComputedStyle(document.body).backgroundColor,
  gamePage: document.getElementById('game_page')?.style.display,
  pregamePage: document.getElementById('pregame_page')?.style.display,
  allDivs: [...document.querySelectorAll('[id]')].map(e => e.id).slice(0, 30),
}));

console.log('=== DOM state after 3s ===');
console.log(JSON.stringify(state1, null, 2));
console.log('\n=== Console logs ===');
logs.forEach(l => console.log(l));

await page.screenshot({ path: '/tmp/debug_load.png' });
await page.waitForTimeout(3000);
await browser.close();
