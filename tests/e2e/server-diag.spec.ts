/**
 * Quick diagnostic: connect to Railway server, try /start, dump all received data.
 */
import { test, expect } from '@playwright/test';
import type { XbwPageGlobals } from './helpers/pageGlobals';

test.describe.configure({ timeout: 60_000 });

test('server diagnostics', async ({ page }) => {
  const consoleLogs: string[] = [];
  const chatMessages: string[] = [];
  const receivedPids: number[] = [];
  let wsFrameCount = 0;

  page.on('console', msg => consoleLogs.push(`[${msg.type()}] ${msg.text()}`));

  page.on('websocket', ws => {
    ws.on('framereceived', frame => {
      wsFrameCount++;
      try {
        const payload = frame.payload.toString();
        if (payload.startsWith('[') || payload.startsWith('{')) {
          const packets = JSON.parse(payload);
          const arr = Array.isArray(packets) ? packets : [packets];
          arr.forEach((p: { pid: number; message?: string }) => {
            if (!receivedPids.includes(p.pid)) receivedPids.push(p.pid);
            // pid=25 is CONNECT_MSG (chat/server messages)
            if (p.pid === 25 && p.message) {
              chatMessages.push(p.message);
            }
          });
        }
      } catch {}
    });
    ws.on('framesent', frame => {
      const payload = frame.payload.toString();
      if (payload.length < 200) console.log('SENT:', payload);
    });
  });

  await page.goto('/webclient/index.html?username=DiagBot', { waitUntil: 'domcontentloaded' });

  // Wait for game page
  await page.waitForFunction(() => {
    const gp = document.getElementById('game_page');
    return gp && window.getComputedStyle(gp).display !== 'none';
  }, { timeout: 30_000 });

  console.log('Game page appeared. Waiting 3s before sending commands...');
  await page.waitForTimeout(3000);

  // Print current state
  const state1 = await page.evaluate(() => {
    const w = window as XbwPageGlobals;
    return {
      hasSendMessage: typeof w.send_message === 'function',
      wsReadyState: w.__networkDebug?.state?.readyState,
      playerCount: Object.keys(w.__store?.players || {}).length,
      civclientState: w.__store?.civclientState,
      mapInfoCalled: w.__xbwHandleMapInfoCalled,
      receivedPids: w.__xbwReceivedPids,
    };
  });
  console.log('State before /start:', JSON.stringify(state1, null, 2));
  console.log('Chat messages so far:', chatMessages);

  // Try setting AI fill and starting
  await page.evaluate(() => {
    const w = window as XbwPageGlobals;
    if (typeof w.send_message === 'function') {
      console.log('[diag] Sending /set aifill 1');
      w.send_message('/set aifill 1');
    }
  });
  await page.waitForTimeout(1000);

  await page.evaluate(() => {
    const w = window as XbwPageGlobals;
    if (typeof w.send_message === 'function') {
      console.log('[diag] Sending /start');
      w.send_message('/start');
    }
  });
  await page.waitForTimeout(10000);

  // Print what we got
  const state2 = await page.evaluate(() => {
    const w = window as XbwPageGlobals;
    return {
      playerCount: Object.keys(w.__store?.players || {}).length,
      civclientState: w.__store?.civclientState,
      mapInfoCalled: w.__xbwHandleMapInfoCalled,
      receivedPids: w.__xbwReceivedPids,
      tileCount: Object.keys(w.__store?.tiles || {}).length,
    };
  });

  console.log('=== After /start (10s) ===');
  console.log('State:', JSON.stringify(state2, null, 2));
  console.log('Chat messages:', chatMessages);
  console.log('All received PIDs:', receivedPids.sort((a, b) => a - b).join(', '));
  console.log('Total WS frames:', wsFrameCount);
  console.log('=== Console logs ===');
  consoleLogs.slice(0, 80).forEach(l => console.log(l));

  await page.screenshot({ path: 'test-results/diag-after-start.png' }).catch(() => {});

  // Just check we're connected - don't fail on map
  expect(state1.hasSendMessage).toBe(true);
});
