import { chromium, devices } from 'playwright';

const Pixel5 = devices['Pixel 5'];
const browser = await chromium.launch({ headless: false });
const ctx = await browser.newContext({ ...Pixel5 });
const page = await ctx.newPage();

const logs = [];
page.on('console', m => logs.push(`[${m.type()}] ${m.text().slice(0, 200)}`));
page.on('pageerror', e => logs.push(`[PAGEERROR] ${e.message.slice(0, 200)}`));
page.on('requestfailed', r => logs.push(`[FAILED] ${r.url().split('/').pop()} - ${r.failure()?.errorText}`));

// Connect via EXTERNAL IP (same as the user does)
const EXTERNAL_URL = 'http://207.254.39.62:3000/webclient/index.html?civserverport=6000';
console.log('Connecting to:', EXTERNAL_URL);

await page.goto(EXTERNAL_URL, { waitUntil: 'domcontentloaded', timeout: 15000 });
await page.waitForTimeout(5000);

const state = await page.evaluate(() => {
  const dialog = document.querySelector('.xb-dialog-overlay');
  const blockOverlay = document.querySelector('.xb-block-overlay');
  return {
    viewport: { w: window.innerWidth, h: window.innerHeight },
    dialogVisible: !!dialog,
    dialogDisplay: dialog ? getComputedStyle(dialog).display : null,
    blockOverlayVisible: !!blockOverlay,
    blockOverlayContent: blockOverlay?.textContent?.slice(0, 50),
    usernameFound: !!document.getElementById('username_req'),
    gamePageDisplay: document.getElementById('game_page')?.style.display,
    wsReadyState: window.ws?.readyState,
    hostname: window.location.hostname,
    wsUrl: 'ws://' + window.location.host + '/civsocket/7000',
  };
});
console.log('External test state:', JSON.stringify(state, null, 2));
console.log('\nLogs:');
logs.slice(0, 20).forEach(l => console.log(l));

await page.screenshot({ path: '/tmp/external_debug.png' });
console.log('\nScreenshot: /tmp/external_debug.png');
await page.waitForTimeout(4000);
await browser.close();
