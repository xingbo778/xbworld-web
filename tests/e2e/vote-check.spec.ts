/**
 * Check vote behavior after /start command.
 */
import { test, expect } from '@playwright/test';
import type { XbwPageGlobals } from './helpers/pageGlobals';

test.describe.configure({ timeout: 60_000 });

test('vote check', async ({ page }) => {
  const sentPackets: string[] = [];
  const votePackets: Array<{pid: number; data: unknown}> = [];
  let chatCount = 0;
  const recentChats: string[] = [];

  page.on('websocket', ws => {
    ws.on('framereceived', frame => {
      try {
        const payload = frame.payload.toString();
        const arr = JSON.parse(payload);
        const packets = Array.isArray(arr) ? arr : [arr];
        packets.forEach((p: { pid: number; message?: string }) => {
          if (p.pid === 25 && p.message) {
            chatCount++;
            recentChats.push(p.message);
            if (recentChats.length > 20) recentChats.shift();
          }
          if (p.pid >= 185 && p.pid <= 188) {
            votePackets.push({ pid: p.pid, data: p });
          }
        });
      } catch {}
    });
    ws.on('framesent', frame => {
      sentPackets.push(frame.payload.toString().slice(0, 100));
    });
  });

  await page.goto('/webclient/index.html?username=VoteCheck', { waitUntil: 'domcontentloaded' });

  await page.waitForFunction(() => {
    const gp = document.getElementById('game_page');
    return gp && window.getComputedStyle(gp).display !== 'none';
  }, { timeout: 30_000 });

  console.log('Game page appeared. Waiting 4s...');
  await page.waitForTimeout(4000);

  console.log('Sent packets so far:', sentPackets);

  await page.evaluate(() => {
    const w = window as XbwPageGlobals;
    if (typeof w.send_message === 'function') {
      console.log('[vc] Sending /start');
      w.send_message('/start');
    }
  });

  // Wait for vote packets to arrive
  await page.waitForTimeout(5000);

  console.log('Vote packets received:', JSON.stringify(votePackets, null, 2));
  console.log('All sent packets:', sentPackets);
  console.log('Recent chat messages (last 20):');
  recentChats.forEach(m => console.log(' ', m));

  // Wait more for MAP_INFO
  await page.waitForTimeout(30000);

  const state = await page.evaluate(() => {
    const w = window as XbwPageGlobals;
    return {
      mapInfoCalled: w.__xbwHandleMapInfoCalled,
      tileCount: Object.keys(w.__store?.tiles || {}).length,
      receivedPids: w.__xbwReceivedPids,
    };
  });
  console.log('Final state (35s after /start):', JSON.stringify(state, null, 2));
  console.log('Final recent chats:');
  recentChats.forEach(m => console.log(' ', m));

  expect(state).toBeDefined();
});
