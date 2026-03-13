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
          <p style={{ color: 'var(--xb-text-secondary, #8b949e)', margin: '8px 0' }}>
            No score data available yet.
          </p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--xb-border-default, #30363d)' }}>
                <th style={{ padding: '4px 8px', textAlign: 'left' }}>Rank</th>
                <th style={{ padding: '4px 8px', textAlign: 'left' }}>Player</th>
                <th style={{ padding: '4px 8px', textAlign: 'left' }}>Nation</th>
                <th style={{ padding: '4px 8px', textAlign: 'right' }}>Score</th>
                <th style={{ padding: '4px 8px', textAlign: 'right' }}>Cities</th>
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
                    <td style={{ padding: '4px 8px', fontWeight: 'bold' }}>#{i + 1}</td>
                    <td style={{ padding: '4px 8px' }}>{String(p['name'])}</td>
                    <td style={{ padding: '4px 8px', color: 'var(--xb-text-secondary, #8b949e)' }}>{adj}</td>
                    <td style={{ padding: '4px 8px', textAlign: 'right', fontWeight: 'bold', color: 'var(--xb-accent-blue, #58a6ff)' }}>{score}</td>
                    <td style={{ padding: '4px 8px', textAlign: 'right' }}>{cities} cities</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
      <div style={{ marginTop: '12px', textAlign: 'right' }}>
        <Button onClick={closeGameScoresDialog}>Close</Button>
      </div>
    </Dialog>
  );
}
