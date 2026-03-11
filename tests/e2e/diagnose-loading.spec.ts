import { test } from '@playwright/test';

test('diagnose observe click', async ({ page }) => {
  const wsFrameCount = { n: 0, lastPid: 0 };
  const failed: string[] = [];

  page.on('websocket', ws => {
    console.log(`WS OPEN: ${ws.url()}`);
    ws.on('framereceived', f => {
      wsFrameCount.n++;
      try { const pid = JSON.parse(String(f.payload))?.[0]?.pid; if (pid !== undefined) wsFrameCount.lastPid = pid; } catch {}
    });
    ws.on('close', () => console.log('WS CLOSED'));
  });
  page.on('requestfailed', r => failed.push(`FAIL ${r.url().split('/').pop()} — ${r.failure()?.errorText}`));
  page.on('console', m => { if (m.type() === 'error') console.log(`[err] ${m.text()}`); });

  await page.goto('/webclient/index.html');
  await page.waitForTimeout(2000);
  const input = page.locator('#username_req');
  if (await input.isVisible({ timeout: 3000 }).catch(() => false)) await input.fill('TestObserver');
  await page.getByRole('button', { name: 'Observe Game' }).click();
  console.log('Clicked Observe');

  for (let i = 0; i < 20; i++) {
    await page.waitForTimeout(2000);
    const game = await page.locator('#game_page').isVisible();
    const canvas = await page.locator('#canvas_div canvas').count();
    console.log(`t=${i*2+2}s frames=${wsFrameCount.n} lastPid=${wsFrameCount.lastPid} game=${game} canvas=${canvas}`);
    await page.screenshot({ path: `test-results/obs-${String(i).padStart(2,'0')}.png` });
    if (game && canvas > 0) break;
  }

  console.log('Failed:', failed.join(', '));
});
