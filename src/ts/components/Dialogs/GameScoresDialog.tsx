/**
 * GameScoresDialog — sorted player score table.
 * Replaces the getPlayerScoresSummary() HTML-string approach in nation.ts.
 * Mounted once in App.tsx; opened via showGameScoresDialog().
 */
import { signal } from '@preact/signals';
import { Dialog } from '../Shared/Dialog';
import { Button } from '../Shared/Button';
import { store } from '../../data/store';
import type { Player } from '../../data/types';

const open = signal(false);

export function showGameScoresDialog(): void {
  open.value = true;
}

export function closeGameScoresDialog(): void {
  open.value = false;
}

export function GameScoresDialog() {
  if (!open.value) return null;

  const players = Object.values(store.players) as Player[];
  const sorted = [...players].sort(
    (a, b) => ((b['score'] as number) ?? 0) - ((a['score'] as number) ?? 0),
  );

  return (
    <Dialog
      title="Game Scores"
      open
      onClose={closeGameScoresDialog}
      width={480}
      modal={false}
    >
      <div style={{ maxHeight: '420px', overflow: 'auto' }}>
        {players.length === 0 ? (
          <p class="xb-stat-label" style={{ margin: '8px 0' }}>
            No score data available yet.
          </p>
        ) : (
          <table class="xb-scores-table">
            <thead>
              <tr>
                <th class="xb-scores-th">Rank</th>
                <th class="xb-scores-th">Player</th>
                <th class="xb-scores-th">Nation</th>
                <th class="xb-scores-th xb-scores-td-right">Score</th>
                <th class="xb-scores-th xb-scores-td-right">Cities</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((p, i) => {
                const nation = store.nations[p['nation'] as number];
                const adj = String(nation?.['adjective'] ?? '?');
                const score = (p['score'] as number) ?? '?';
                const cities = (p['cities'] as number) ?? 0;
                return (
                  <tr key={p['playerno'] as number}>
                    <td class="xb-scores-td xb-scores-rank">#{i + 1}</td>
                    <td class="xb-scores-td xb-scores-name">{String(p['name'])}</td>
                    <td class="xb-scores-td">{adj}</td>
                    <td class="xb-scores-td xb-scores-td-right" style={{ color: 'var(--xb-accent-blue, #58a6ff)', fontWeight: 'bold' }}>{score}</td>
                    <td class="xb-scores-td xb-scores-td-right">{cities} cities</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
      <div class="xb-dialog-footer-right">
        <Button onClick={closeGameScoresDialog}>Close</Button>
      </div>
    </Dialog>
  );
}
