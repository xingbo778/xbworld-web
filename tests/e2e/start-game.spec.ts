/**
 * Start-game script: connects to Railway Freeciv server with 4 bot players,
 * removes the persistent "Host" player via vote, then all bots send /start.
 * Verifies the map renders (non-black canvas pixels).
 *
 * Usage:
 *   npx playwright test tests/e2e/start-game.spec.ts --config tests/e2e/playwright.live.config.ts
 *
 * Requires dev server running on port 8080:
 *   BACKEND_URL=https://xbworld-web-production.up.railway.app npx vite --config vite.config.dev.ts --port 8080
 *
 * Flow:
 *   1. Open 4 browser pages simultaneously (server auto-assigns player slots)
 *   2. Bot1 sends /set aifill 0 (all bots auto-vote YES → removes AI filler players)
 *   3. Bot1 sends /remove Host (all bots auto-vote YES → removes persistent Host player)
 *   4. All 4 bots send /start (4 out of 4 alive players ready → game starts)
 *   5. Wait for MAP_INFO (pid=17) on page 1
 *   6. Verify canvas has non-black pixels (map rendered)
 */
import { test, expect, Browser } from '@playwright/test';

test.describe.configure({ timeout: 180_000 });

async function connectBot(browser: Browser, username: string, botIndex: number) {
  const context = await browser.newContext();
  const page = await context.newPage();
  const chats: string[] = [];
  let mapInfoReceived = false;

  page.on('console', msg => {
    const text = msg.text();
    if (text.includes('[xbw]') || text.includes('MAP_INFO') || text.includes('vote') || text.includes('start')) {
      console.log(`[Bot${botIndex}] ${text}`);
    }
  });

  page.on('websocket', ws => {
    ws.on('framereceived', frame => {
      try {
        const packets = JSON.parse(frame.payload.toString());
        if (Array.isArray(packets)) {
          packets.forEach((p: { pid: number; message?: string }) => {
            if (p.pid === 25 && p.message) {
              chats.push(p.message);
              if (chats.length > 10) chats.shift();
            }
            if (p.pid === 17) mapInfoReceived = true;
          });
        }
      } catch {}
    });
  });

  await page.goto(`/webclient/index.html?username=${username}`, { waitUntil: 'domcontentloaded' });

  // Wait for game page
  await page.waitForFunction(() => {
    const gp = document.getElementById('game_page');
    return gp && window.getComputedStyle(gp).display !== 'none';
  }, { timeout: 30_000 });

  console.log(`Bot${botIndex} (${username}): game page appeared`);
  return { page, context, chats: () => chats, mapInfoReceived: () => mapInfoReceived };
}

test('start game and verify map renders', async ({ browser }) => {
  // Connect 4 bots in parallel (4 to cover all alive player slots)
  const [bot1, bot2, bot3, bot4] = await Promise.all([
    connectBot(browser, 'GameBot1', 1),
    connectBot(browser, 'GameBot2', 2),
    connectBot(browser, 'GameBot3', 3),
    connectBot(browser, 'GameBot4', 4),
  ]);

  console.log('All 3 bots connected. Waiting 5s for /take commands to complete...');
  await bot1.page.waitForTimeout(5000);

  // Log initial state
  const initState = await bot1.page.evaluate(() => {
    const w = window as any;
    return {
      playerCount: Object.keys(w.players || {}).length,
      hasSendMessage: typeof w.send_message === 'function',
    };
  });
  console.log('Initial state (bot1):', JSON.stringify(initState));
  console.log('Bot1 recent chats:', bot1.chats().slice(-5));

  // Step 1: Set aifill=0 (removes AI players, vote auto-voted YES by all bots)
  await bot1.page.evaluate(() => {
    const w = window as any;
    if (typeof w.send_message === 'function') {
      console.log('[xbw] Bot1 sending /set aifill 0');
      w.send_message('/set aifill 0');
    }
  });

  // Wait for aifill vote to pass
  console.log('Waiting 20s for aifill=0 vote to pass...');
  await bot1.page.waitForTimeout(20000);
  console.log('Bot1 chats after aifill:', bot1.chats().slice(-5));

  // Step 2: Vote to kick the persistent "Host" player
  // This uses /callvote kick which goes through the voting system
  const hostPlayerName = await bot1.page.evaluate(() => {
    const w = window as any;
    const players = Object.values(w.players || {}) as any[];
    // Find any non-GameBot player (the Host or other persistent player)
    const nonBot = players.find(p => p.name && !p.name.startsWith('GameBot') && !p.name.startsWith('AI'));
    return nonBot?.name || null;
  });
  console.log('Persistent player to kick:', hostPlayerName);

  if (hostPlayerName) {
    // Try /vote kick <name> — freeciv-web voting syntax
    await bot1.page.evaluate((name) => {
      const w = window as any;
      if (typeof w.send_message === 'function') {
        console.log('[xbw] Bot1 sending /vote kick', name);
        w.send_message('/vote kick ' + name);
      }
    }, hostPlayerName);
    await bot1.page.waitForTimeout(3000);

    // Also try /remove <name> (admin command that may create a vote)
    await bot1.page.evaluate((name) => {
      const w = window as any;
      if (typeof w.send_message === 'function') {
        console.log('[xbw] Bot1 sending /remove', name);
        w.send_message('/remove ' + name);
      }
    }, hostPlayerName);

    console.log('Waiting 20s for kick/remove vote to pass...');
    await bot1.page.waitForTimeout(20000);
    console.log('Bot1 chats after kick:', bot1.chats().slice(-10));
  } else {
    console.log('No persistent player found to kick, proceeding with /start');
    await bot1.page.waitForTimeout(5000);
  }

  const afterAifill = await bot1.page.evaluate(() => {
    const w = window as any;
    return { playerCount: Object.keys(w.players || {}).length };
  });
  console.log('After aifill=0:', JSON.stringify(afterAifill));
  console.log('Bot1 chats after aifill:', bot1.chats().slice(-8));

  // Step 2: All bots send /start simultaneously
  await Promise.all([bot1, bot2, bot3, bot4].map((bot, i) =>
    bot.page.evaluate((idx) => {
      const w = window as any;
      if (typeof w.send_message === 'function') {
        console.log('[xbw] Bot' + idx + ' sending /start');
        w.send_message('/start');
      }
    }, i + 1)
  ));

  console.log('All 3 bots sent /start — waiting for MAP_INFO...');
  await bot1.page.screenshot({ path: 'test-results/start-02-after-start.png' }).catch(() => {});

  // Wait for MAP_INFO on bot1
  const mapInfoReceived = await bot1.page.waitForFunction(() => {
    const w = window as any;
    return (w.__xbwHandleMapInfoCalled || 0) > 0;
  }, { timeout: 90_000 }).then(() => true).catch(() => false);

  console.log('MAP_INFO received (bot1):', mapInfoReceived);
  console.log('Bot1 recent chats:', bot1.chats().slice(-10));
  await bot1.page.screenshot({ path: 'test-results/start-03-map-info.png' }).catch(() => {});

  // Wait for map to render
  await bot1.page.waitForTimeout(5000);

  const state = await bot1.page.evaluate(() => {
    const w = window as any;
    const canvas = document.querySelector('#canvas_div canvas') as HTMLCanvasElement | null;
    let canvasInfo = 'no-canvas';
    let nonBlack = 0;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const { width: cw, height: ch } = canvas;
        if (cw && ch) {
          const data = ctx.getImageData(0, 0, Math.min(400, cw), Math.min(300, ch)).data;
          for (let i = 0; i < data.length; i += 4) {
            if (data[i] > 10 || data[i + 1] > 10 || data[i + 2] > 10) nonBlack++;
          }
          canvasInfo = `${cw}x${ch} nonBlack=${nonBlack}`;
        }
      }
    }
    return {
      mapInfoCalled: w.__xbwHandleMapInfoCalled,
      tileCount: Object.keys(w.tiles || {}).length,
      canvasInfo,
      civclientState: w.civclient_state,
      receivedPids: Object.keys(w.__xbwReceivedPids || {}).sort((a, b) => Number(a) - Number(b)).join(','),
    };
  });

  console.log('=== Final state (bot1) ===');
  console.log(JSON.stringify(state, null, 2));

  await bot1.page.screenshot({ path: 'test-results/start-04-final.png' }).catch(() => {});

  // Cleanup
  await Promise.all([bot1, bot2, bot3, bot4].map(b => b.context.close()));

  // Assertions
  expect(state.mapInfoCalled, 'MAP_INFO should have been received').toBeGreaterThan(0);
  expect(state.canvasInfo, 'Canvas should not be no-canvas').not.toBe('no-canvas');
  const nonBlackCount = parseInt(state.canvasInfo.match(/nonBlack=(\d+)/)?.[1] ?? '0');
  console.log(`Non-black pixel count: ${nonBlackCount}`);
  expect(nonBlackCount, 'Map canvas should have rendered content').toBeGreaterThan(100);
});
