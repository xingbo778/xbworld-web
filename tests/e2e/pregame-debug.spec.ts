import { test } from '@playwright/test';
import type { XbwPageGlobals } from './helpers/pageGlobals';

test('pregame debug', async ({ page }) => {
  const logs: string[] = [];
  page.on('console', msg => logs.push(`[${msg.type()}] ${msg.text().slice(0, 300)}`));
  page.on('websocket', ws => {
    if (!ws.url().includes('civsocket')) return;
    ws.on('framereceived', f => {
      const txt = f.payload?.toString?.() ?? '';
      // Only log chat (pid 25) and game state relevant packets
      if (txt.includes('"pid":25') || txt.includes('"pid":16') || 
          txt.includes('"pid":126') || txt.includes('"pid":5')) {
        console.log('[WS-RECV]', txt.slice(0, 300));
      }
    });
    ws.on('framesent', f => {
      console.log('[WS-SENT]', f.payload?.toString?.()?.slice?.(0, 200));
    });
  });

  await page.goto('/webclient/index.html?username=PregameDbg', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(20_000);

  const state = await page.evaluate(() => {
    const w = window as XbwPageGlobals;
    const gamePage = document.getElementById('game_page');
    const startPage = document.getElementById('start_page');
    return {
      civclientState: w.__store?.civclientState,
      observing: w.__store?.observing,
      game_page: gamePage ? getComputedStyle(gamePage).display : 'missing',
      start_page: startPage ? getComputedStyle(startPage).display : 'missing',
      pids: JSON.stringify(w.__xbwReceivedPids || {}),
      gameInfo_turn: w.__store?.gameInfo?.turn,
    };
  });

  console.log('=== STATE ===', JSON.stringify(state, null, 2));
  console.log('=== XBW LOGS ===');
  logs.filter(l => l.includes('[xbw]') || l.includes('[WS-RECV]') || l.includes('[WS-SENT]')).forEach(l => console.log(l));
});
