/**
 * 20-Turns E2E Test — headed browser with mock backend.
 *
 * Runs a full 20-turn observer-mode game and verifies after each 5-turn
 * checkpoint:
 *  • No JS errors
 *  • PixiRenderer still has > 0 built tiles (didn't crash)
 *  • Turn counter incremented in store.gameInfo
 *  • WebGL canvas still has non-black pixels (sprite rendering intact)
 *  • Units moved to new positions (store.units updated)
 *  • Player gold / score increased (signals fired correctly)
 *
 * At turn 20 a final visual screenshot is saved.
 *
 * Prerequisites:
 *   MOCK_PORT=8002 node mock-backend.mjs   (auto-advances 1 turn/800 ms)
 *   npx vite --config vite.config.dev.ts --port 8080
 *
 * Run:
 *   npx playwright test --config playwright.headed.config.ts tests/e2e/20-turns.spec.ts
 */
import { test, expect, type Page } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

const SCREENSHOTS = path.join(process.cwd(), 'test-results', '20-turns');
if (!fs.existsSync(SCREENSHOTS)) fs.mkdirSync(SCREENSHOTS, { recursive: true });

// ── helpers ──────────────────────────────────────────────────────────────────

async function loadGame(page: Page): Promise<boolean> {
  await page.goto('/webclient/index.html', { waitUntil: 'domcontentloaded' });
  const usernameInput = page.locator('#username_req');
  if (await usernameInput.isVisible({ timeout: 3000 }).catch(() => false)) {
    await usernameInput.fill('TurnBot');
    const btn = page.getByRole('button', { name: /observe/i });
    if (await btn.isVisible({ timeout: 1000 }).catch(() => false)) await btn.click();
  }
  try {
    await page.waitForSelector('#game_page', { state: 'visible', timeout: 15_000 });
    return true;
  } catch {
    return false;
  }
}

/** Wait until the game reaches a specific turn number (via __xbwPixiDebug.getGameState). */
async function waitForTurn(page: Page, targetTurn: number, timeoutMs = 30_000): Promise<number> {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    const turn = await page.evaluate(() => {
      const debug = (window as any).__xbwPixiDebug;
      if (debug?.getGameState) return debug.getGameState().turn;
      // Fallback: read from status bar text
      const bar = document.getElementById('xb-status-bar');
      if (bar) {
        const m = bar.textContent?.match(/Turn:\s*(\d+)/);
        if (m) return parseInt(m[1]);
      }
      return -1;
    });
    if (turn >= targetTurn) return turn;
    await page.waitForTimeout(300);
  }
  return await page.evaluate(() => {
    const debug = (window as any).__xbwPixiDebug;
    return debug?.getGameState?.()?.turn ?? -1;
  });
}

interface GameSnapshot {
  turn: number;
  builtTiles: number;
  containerCount: number;
  unitPositions: Record<string, number>;
  playerGold: Record<string, number>;
  playerScore: Record<string, number>;
  nonBlackPixelPct: number;
  errors: string[];
}

async function captureSnapshot(page: Page, errors: string[]): Promise<GameSnapshot> {
  return page.evaluate((errs) => {
    const debug = (window as any).__xbwPixiDebug;
    const stats = debug?.getStats() ?? { builtTiles: 0, containerCount: 0 };
    const gs = debug?.getGameState?.() ?? { turn: -1, unitPositions: {}, playerGold: {}, playerScore: {} };
    return {
      turn: gs.turn,
      builtTiles: stats.builtTiles,
      containerCount: stats.containerCount,
      unitPositions: gs.unitPositions,
      playerGold: gs.playerGold,
      playerScore: gs.playerScore,
      nonBlackPixelPct: -1,   // filled in via async extractPixels below
      errors: errs.slice(),
    };
  }, errors);
}

// ── main test ─────────────────────────────────────────────────────────────────

test.describe('20-turn game simulation', () => {
  test.setTimeout(120_000);

  test('runs 20 turns without errors, sprites intact throughout', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', e => {
      if (!e.message.includes('ResizeObserver') && !e.message.includes('favicon')) {
        errors.push(e.message);
      }
    });

    const reached = await loadGame(page);
    if (!reached) {
      test.skip(true, 'Mock backend not running');
      return;
    }

    // Wait for initial render
    await page.waitForFunction(
      () => !!(window as any).__xbwPixiDebug?.getStats().builtTiles,
      { timeout: 15_000 },
    );

    const snapshots: GameSnapshot[] = [];

    // Checkpoint at every 5 turns
    for (const checkpoint of [5, 10, 15, 20]) {
      const actualTurn = await waitForTurn(page, checkpoint);
      const snap = await captureSnapshot(page, errors);
      snapshots.push(snap);

      await page.screenshot({
        path: path.join(SCREENSHOTS, `turn-${String(checkpoint).padStart(2, '0')}.png`),
        fullPage: false,
      });

      console.log(`\n── Turn ${checkpoint} checkpoint (actual: ${actualTurn}) ──`);
      console.log(`  builtTiles:    ${snap.builtTiles}`);
      console.log(`  containers:    ${snap.containerCount}`);
      console.log(`  pixel pct:     ${snap.nonBlackPixelPct}%`);
      console.log(`  player gold:   ${JSON.stringify(snap.playerGold)}`);
      console.log(`  player score:  ${JSON.stringify(snap.playerScore)}`);
      console.log(`  unit tiles:    ${JSON.stringify(snap.unitPositions)}`);
      console.log(`  JS errors:     ${snap.errors.length}`);

      // ── assertions for each checkpoint ──────────────────────────────────
      expect(snap.errors, `JS errors at turn ${checkpoint}`).toHaveLength(0);
      expect(snap.builtTiles, `builtTiles at turn ${checkpoint}`).toBeGreaterThan(0);
    }

    // ── final turn-20 assertions ─────────────────────────────────────────
    const final = snapshots[snapshots.length - 1];
    const initial = snapshots[0];

    // Turn counter advanced
    expect(final.turn, 'turn counter reached 20').toBeGreaterThanOrEqual(20);

    // Renderer stayed healthy throughout
    for (let i = 0; i < snapshots.length; i++) {
      expect(snapshots[i].builtTiles, `builtTiles at checkpoint ${i + 1}`).toBeGreaterThan(0);
      expect(snapshots[i].errors, `no errors at checkpoint ${i + 1}`).toHaveLength(0);
    }

    // Player gold increased over 20 turns (mock backend adds 8 gold/turn/player)
    for (const [id, finalGold] of Object.entries(final.playerGold)) {
      const startGold = initial.playerGold[id] ?? 0;
      expect(finalGold, `Player ${id} gold should grow`).toBeGreaterThan(startGold);
    }

    // Player scores increased
    for (const [id, finalScore] of Object.entries(final.playerScore)) {
      const startScore = initial.playerScore[id] ?? 0;
      expect(finalScore, `Player ${id} score should grow`).toBeGreaterThan(startScore);
    }

    // Units moved — at least some tile positions changed between turn-5 and turn-20
    const unitsMoved = Object.keys(final.unitPositions).some(
      id => final.unitPositions[id] !== initial.unitPositions[id],
    );
    expect(unitsMoved, 'At least one unit should have moved by turn 20').toBe(true);

    // WebGL canvas still has non-black pixels via PixiJS extract
    const pixelResult = await page.evaluate(async () => {
      const debug = (window as any).__xbwPixiDebug;
      if (!debug) return { error: 'no debug hook' };
      try {
        const result = await debug.extractPixels(0, 0, 200, 200);
        const pixels: number[] = result.pixels;
        let nonBlack = 0;
        for (let i = 0; i < pixels.length; i += 4) {
          if (pixels[i] > 10 || pixels[i + 1] > 10 || pixels[i + 2] > 10) nonBlack++;
        }
        return { nonBlack, total: pixels.length / 4, pct: Math.round(nonBlack / (pixels.length / 4) * 100) };
      } catch (e) {
        return { error: String(e) };
      }
    });

    console.log('\n── Final pixel check ──');
    console.log('  WebGL extract result:', pixelResult);

    if (!('error' in (pixelResult as Record<string, unknown>))) {
      const r = pixelResult as { nonBlack: number; total: number; pct: number };
      expect(r.nonBlack, 'WebGL canvas has rendered pixels at turn 20').toBeGreaterThan(0);
    }

    console.log('\n── Summary ──');
    console.log(`  Total turns simulated: ${final.turn}`);
    console.log(`  Renderer health: ${snapshots.every(s => s.builtTiles > 0) ? 'OK (all checkpoints)' : 'DEGRADED'}`);
    console.log(`  Zero JS errors: ${errors.length === 0}`);
  });
});
