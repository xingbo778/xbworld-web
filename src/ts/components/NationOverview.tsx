/**
 * NationOverview — Preact panel showing all players' status (observer mode).
 *
 * Renders in the "players" tab area. Shows nation name, score, cities,
 * units, gold, current research, and diplomatic state at a glance.
 */
import { render } from 'preact';
import { signal } from '@preact/signals';
import { store } from '../data/store';
import { research_get, PlayerFlag } from '../data/player';
import { globalEvents } from '../core/events';
import { nationSelectPlayer, selectNoNation } from '../data/nationScreen';

// Refresh counter — bump to force re-render
const _tick = signal(0);
const _selectedPlayerno = signal(-1);

export function refreshNationOverview(): void { _tick.value++; }

export function mountNationOverview(container: HTMLElement): void {
  render(<NationOverview />, container);
}

globalEvents.on('game:beginturn', refreshNationOverview);
globalEvents.on('player:updated', refreshNationOverview);
globalEvents.on('city:updated', refreshNationOverview);

export function NationOverview() {
  _tick.value; // subscribe
  const selectedNo = _selectedPlayerno.value;
  const players = Object.values(store.players);

  if (players.length === 0) {
    return (
      <div style={{ padding: 16, color: 'var(--xb-text-secondary, #8b949e)', fontSize: 'var(--xb-font-size-sm, 12px)' }}>
        No players connected yet.
      </div>
    );
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{
        width: '100%',
        borderCollapse: 'collapse',
        fontSize: 'var(--xb-font-size-sm, 12px)',
        color: 'var(--xb-text-primary, #e6edf3)',
      }}>
        <thead>
          <tr style={{ borderBottom: '2px solid var(--xb-border-default, #30363d)', background: 'var(--xb-bg-secondary, #161b22)' }}>
            {['Nation', 'Score', 'Cities', 'Gold', 'Researching', 'Progress', 'State'].map(h => (
              <th key={h} style={{ padding: '6px 10px', textAlign: 'left', color: 'var(--xb-text-secondary, #8b949e)', fontWeight: 600 }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {players.map((pplayer) => {
            const p = pplayer as Record<string, unknown>;
            const nation = store.nations[p['nation'] as number];
            const color: string = (nation as Record<string, unknown> | undefined)?.['color'] as string ?? 'var(--xb-text-primary)';
            const pr = research_get(pplayer);
            const techData = pr ? store.techs[pr['researching'] as number] : null;
            const bulbs: number = (pr?.['bulbs_researched'] as number) ?? 0;
            const cost: number = ((pr?.['researching_cost'] as number) ?? 1) || 1;
            const pct = Math.min(100, Math.round((bulbs / cost) * 100));
            const isAI = pplayer.flags?.isSet(PlayerFlag.PLRF_AI) ?? false;

            // Count cities belonging to this player
            const myCities = Object.values(store.cities).filter(
              c => (c as Record<string, unknown>)['owner'] === p['playerno']
            ).length;

            // Turn state
            let stateText = '';
            let stateColor = 'var(--xb-text-secondary, #8b949e)';
            if (!p['is_alive']) {
              stateText = 'Dead';
              stateColor = 'var(--xb-accent-red, #f85149)';
            } else if (isAI) {
              stateText = 'AI';
            } else if (p['phase_done']) {
              stateText = 'Done';
              stateColor = 'var(--xb-accent-green, #3fb950)';
            } else if ((p['nturns_idle'] as number ?? 0) > 1) {
              stateText = `Idle ${p['nturns_idle']}t`;
              stateColor = 'var(--xb-accent-orange, #d29922)';
            } else {
              stateText = 'Moving';
              stateColor = 'var(--xb-accent-blue, #58a6ff)';
            }

            const playerno = p['playerno'] as number;
            const isSelected = playerno === selectedNo;
            return (
              <tr
                key={playerno}
                onClick={() => {
                  if (isSelected) {
                    _selectedPlayerno.value = -1;
                    selectNoNation();
                  } else {
                    _selectedPlayerno.value = playerno;
                    nationSelectPlayer(playerno);
                  }
                }}
                style={{
                  borderBottom: '1px solid var(--xb-border-muted, #21262d)',
                  background: isSelected ? 'var(--xb-bg-elevated, #21262d)' : undefined,
                  cursor: 'pointer',
                }}
              >
                <td style={{ padding: '6px 10px' }}>
                  <span style={{ fontWeight: 600, color }}>{p['name'] as string}</span>
                  {p['is_alive'] === false && (
                    <span style={{ marginLeft: 6, fontSize: 11, color: 'var(--xb-accent-red, #f85149)' }}>💀</span>
                  )}
                </td>
                <td style={{ padding: '6px 10px' }}>{(p['score'] as number) ?? '—'}</td>
                <td style={{ padding: '6px 10px' }}>{myCities}</td>
                <td style={{ padding: '6px 10px' }}>{(p['gold'] as number) ?? '—'}</td>
                <td style={{ padding: '6px 10px', color: 'var(--xb-text-secondary, #8b949e)' }}>
                  {techData ? techData['name'] as string : '—'}
                </td>
                <td style={{ padding: '6px 10px', minWidth: 80 }}>
                  {pr && (
                    <div title={`${bulbs}/${cost} bulbs (${pct}%)`}>
                      <div style={{ background: 'var(--xb-bg-elevated, #21262d)', borderRadius: 3, height: 6, overflow: 'hidden' }}>
                        <div style={{ background: color, height: '100%', width: `${pct}%`, borderRadius: 3, transition: 'width 0.3s' }} />
                      </div>
                    </div>
                  )}
                </td>
                <td style={{ padding: '6px 10px', color: stateColor, fontWeight: stateText === 'Moving' ? 600 : 400 }}>
                  {stateText}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
