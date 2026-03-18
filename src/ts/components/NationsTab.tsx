/**
 * NationsTab — Nations sub-tab content for NationOverview.
 *
 * Reads directly from store/signals; no props received from parent.
 */
import { signal } from '@preact/signals';
import { store } from '../data/store';
import { currentTurn, rulesetReady, playerUpdated, researchUpdated } from '../data/signals';
import { research_get, PlayerFlag } from '../data/player';
import { nationSelectPlayer, selectNoNation, centerOnPlayer } from '../data/nationScreen';
import { Button } from './Shared/Button';

/**
 * External refresh counter — bumped by refreshNationOverview() in NationOverview.tsx.
 * Exported so NationOverview can write to it without a circular dependency.
 */
export const nationOverviewTick = signal(0);

/** Tracks which player row is currently selected (for Action Bar buttons). */
const _selectedPlayerno = signal(-1);

function ActionBar() {
  const selectedNo = _selectedPlayerno.value;
  const hasSelection = selectedNo >= 0;
  const pplayer = hasSelection ? store.players[selectedNo] : null;
  const isAlive = hasSelection && pplayer && (pplayer as Record<string, unknown>)['is_alive'] !== false;

  function handleViewOnMap() {
    if (!isAlive) return;
    centerOnPlayer();
  }

  function handleViewIntel() {
    if (!hasSelection) return;
    import('../ui/intelDialog').then(({ show_intelligence_report_dialog }) => {
      show_intelligence_report_dialog();
    });
  }

  function handleGameScores() { /* game scores dialog not available in this build */ }

  return (
    <div class="xb-action-bar">
      <Button
        onClick={handleViewOnMap}
        disabled={!isAlive}
        variant="secondary"
      >
        View on Map
      </Button>
      <Button
        onClick={handleViewIntel}
        disabled={!hasSelection}
        variant="secondary"
      >
        View Intel
      </Button>
      <Button onClick={handleGameScores} variant="secondary">
        Game Scores
      </Button>
    </div>
  );
}

export function NationsTab() {
  nationOverviewTick.value; // explicit external refresh (refreshNationOverview())
  currentTurn.value;        // re-render on each new turn
  playerUpdated.value;      // re-render when any player changes
  researchUpdated.value;    // re-render when research state changes
  rulesetReady.value;       // re-render when tech names become available

  const selectedNo = _selectedPlayerno.value;
  const players = Object.values(store.players)
    .sort((a, b) => {
      const aScore = ((a as Record<string, unknown>)['score'] as number) ?? 0;
      const bScore = ((b as Record<string, unknown>)['score'] as number) ?? 0;
      return bScore - aScore;
    });

  if (players.length === 0) {
    return (
      <>
        <ActionBar />
        <div class="xb-empty-state">
          <span style={{ fontSize: 36 }}>🏴</span>
          <span>No nations connected yet</span>
          <span style={{ fontSize: 12 }}>Waiting for players to join the game</span>
        </div>
      </>
    );
  }

  // Pre-compute per-player counts in a single O(C + U) pass instead of
  // O(P×C + P×U) repeated filters inside the player loop.
  const cityCountByPlayer = new Map<number, number>();
  for (const city of Object.values(store.cities)) {
    const owner = (city as Record<string, unknown>)['owner'] as number;
    cityCountByPlayer.set(owner, (cityCountByPlayer.get(owner) ?? 0) + 1);
  }
  const unitCountByPlayer = new Map<number, number>();
  for (const unit of Object.values(store.units)) {
    const owner = (unit as Record<string, unknown>)['owner'] as number;
    unitCountByPlayer.set(owner, (unitCountByPlayer.get(owner) ?? 0) + 1);
  }

  return (
    <>
      <ActionBar />
      <div class="xb-table-scroll-wrap">
        <table class="xb-table">
          <thead>
            <tr>
              {['Nation', 'Score', 'Cities', 'Units', 'Gold', 'Researching', 'Progress', 'State'].map(h => (
                <th key={h}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {players.map((pplayer) => {
              const p = pplayer as Record<string, unknown>;
              const nation = store.nations[p['nation'] as number];
              const color: string = (nation as Record<string, unknown> | undefined)?.['color'] as string ?? 'var(--xb-text-primary)';
              // Fall back to research fields merged onto player object if research_data entry absent
              const pr = research_get(pplayer) ?? (p as Record<string, unknown>);
              const researchingId = (pr['researching'] as number) ?? 0;
              const techData = researchingId ? store.techs[researchingId] : null;
              const bulbs: number = (pr['bulbs_researched'] as number) ?? 0;
              const cost: number = ((pr['researching_cost'] as number) ?? 1) || 1;
              const pct = Math.min(100, Math.round((bulbs / cost) * 100));
              const isAI = pplayer.flags?.isSet(PlayerFlag.PLRF_AI) ?? false;

              const playerno = p['playerno'] as number;
              const myCities = cityCountByPlayer.get(playerno) ?? 0;
              const myUnits = unitCountByPlayer.get(playerno) ?? 0;

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
                  class={`xb-row-clickable${isSelected ? ' xb-row-selected' : ''}`}
                >
                  <td>
                    {/* color is dynamic player color — kept inline */}
                    <span style={{ fontWeight: 600, color }}>{p['name'] as string}</span>
                    {p['is_alive'] === false && (
                      <span style={{ marginLeft: 6, fontSize: 11, color: 'var(--xb-accent-red, #f85149)' }}>💀</span>
                    )}
                  </td>
                  <td>{(p['score'] as number) ?? '—'}</td>
                  <td>{myCities}</td>
                  <td>{myUnits}</td>
                  <td>{(p['gold'] as number) ?? '—'}</td>
                  <td style={{ color: 'var(--xb-text-secondary, #8b949e)' }}>
                    {techData ? techData['name'] as string : '—'}
                  </td>
                  <td style={{ minWidth: 80 }}>
                    {researchingId > 0 && (
                      <div title={`${bulbs}/${cost} bulbs (${pct}%)`}>
                        <div class="xb-progress-track">
                          {/* width and background are dynamic — kept inline */}
                          <div class="xb-progress-fill" style={{ background: color, width: `${pct}%` }} />
                        </div>
                      </div>
                    )}
                  </td>
                  {/* stateColor is conditional game state — kept inline */}
                  <td style={{ color: stateColor, fontWeight: stateText === 'Moving' ? 600 : 400 }}>
                    {stateText}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
