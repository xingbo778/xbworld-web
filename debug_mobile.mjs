import { chromium, devices } from 'playwright';

const Pixel5 = devices['Pixel 5'];
const browser = await chromium.launch({ headless: false });
const ctx = await browser.newContext({ ...Pixel5 });
const page = await ctx.newPage();

const logs = [];
page.on('console', m => logs.push(`[${m.type()}] ${m.text().slice(0, 150)}`));
page.on('pageerror', e => logs.push(`[ERROR] ${e.message.slice(0, 150)}`));

await page.goto('http://localhost:3000/webclient/index.html?civserverport=6000', { waitUntil: 'networkidle', timeout: 20000 });
await page.waitForTimeout(3000);

const state = await page.evaluate(() => {
  const dialog = document.querySelector('.xb-dialog-overlay, .xb-intro-dialog, [class*="intro"], [class*="dialog"]');
  const username = document.getElementById('username_req');
  return {
    viewport: { w: window.innerWidth, h: window.innerHeight },
    dialogFound: !!dialog,
    dialogClass: dialog?.className,
    dialogRect: dialog?.getBoundingClientRect(),
    usernameFound: !!username,
    usernameRect: username?.getBoundingClientRect(),
    gamePageDisplay: document.getElementById('game_page')?.style.display,
    bodyBg: getComputedStyle(document.body).backgroundColor,
    canvasRect: document.getElementById('canvas')?.getBoundingClientRect(),
  };
});
console.log('Mobile state:', JSON.stringify(state, null, 2));
console.log('\nLogs:');
logs.slice(0, 15).forEach(l => console.log(l));

await page.screenshot({ path: '/tmp/mobile_debug.png' });
console.log('\nScreenshot: /tmp/mobile_debug.png');
await page.waitForTimeout(3000);
await browser.close();
