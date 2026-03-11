/**
 * NationOverview — Preact panel showing all players' status (observer mode).
 *
 * Renders in the "players" tab area. Three sub-tabs:
 *  • Nations — player score/gold/research overview (one row per player)
 *  • Cities  — all cities with owner / size
 *  • Units   — all units with type / owner / HP
 */
import { render } from 'preact';
import { signal } from '@preact/signals';
import { store } from '../data/store';
import { currentTurn, cityCount, unitCount, playerUpdated, researchUpdated, rulesetReady } from '../data/signals';
import { research_get, PlayerFlag } from '../data/player';
import { nationSelectPlayer, selectNoNation } from '../data/nationScreen';
import { Tabs, TabPanel } from './Shared/Tabs';
import { Button } from './Shared/Button';
import { centerOnPlayer } from '../data/nationScreen';

type OverviewTab = 'nations' | 'cities' | 'units';

// Refresh counter — bump to force re-render
const _tick = signal(0);
const _selectedPlayerno = signal(-1);
const _activeTab = signal<OverviewTab>('nations');

export function refreshNationOverview(): void { _tick.value++; }
export function setNationOverviewTab(tab: OverviewTab): void { _activeTab.value = tab; }

export function mountNationOverview(container: HTMLElement): void {
  render(<NationOverview />, container);
}

// Refresh is now driven by signals (currentTurn, cityCount, playerUpdated)
// read inside the render body — no manual globalEvents wiring needed.

// ── shared styles ────────────────────────────────────────────────────────────

const TABLE_STYLE = {
  width: '100%',
  borderCollapse: 'collapse' as const,
  fontSize: 'var(--xb-font-size-sm, 12px)',
  color: 'var(--xb-text-primary, #e6edf3)',
};
const TH_STYLE = {
  padding: '6px 10px',
  textAlign: 'left' as const,
  color: 'var(--xb-text-secondary, #8b949e)',
  fontWeight: 600,
};
const TD_STYLE = { padding: '6px 10px' };
const THEAD_TR_STYLE = {
  borderBottom: '2px solid var(--xb-border-default, #30363d)',
  background: 'var(--xb-bg-secondary, #161b22)',
};
const TBODY_TR_STYLE = { borderBottom: '1px solid var(--xb-border-muted, #21262d)' };

const OVERVIEW_TABS = [
  { id: 'nations', label: 'Nations' },
  { id: 'cities',  label: 'Cities'  },
  { id: 'units',   label: 'Units'   },
];

// ── sub-components ────────────────────────────────────────────────────────────

function NationsTable() {
  _tick.value;        // re-render on turn/player events
  rulesetReady.value; // re-render when tech names become available
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
      <table style={TABLE_STYLE}>
        <thead>
          <tr style={THEAD_TR_STYLE}>
            {['Nation', 'Score', 'Cities', 'Units', 'Gold', 'Researching', 'Progress', 'State'].map(h => (
              <th key={h} style={TH_STYLE}>{h}</th>
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

            const myCities = Object.values(store.cities).filter(
              c => (c as Record<string, unknown>)['owner'] === p['playerno']
            ).length;
            const myUnits = Object.values(store.units).filter(
              u => (u as Record<string, unknown>)['owner'] === p['playerno']
            ).length;

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
                  ...TBODY_TR_STYLE,
                  background: isSelected ? 'var(--xb-bg-elevated, #21262d)' : undefined,
                  cursor: 'pointer',
                }}
              >
                <td style={TD_STYLE}>
                  <span style={{ fontWeight: 600, color }}>{p['name'] as string}</span>
                  {p['is_alive'] === false && (
                    <span style={{ marginLeft: 6, fontSize: 11, color: 'var(--xb-accent-red, #f85149)' }}>💀</span>
                  )}
                </td>
                <td style={TD_STYLE}>{(p['score'] as number) ?? '—'}</td>
                <td style={TD_STYLE}>{myCities}</td>
                <td style={TD_STYLE}>{myUnits}</td>
                <td style={TD_STYLE}>{(p['gold'] as number) ?? '—'}</td>
                <td style={{ ...TD_STYLE, color: 'var(--xb-text-secondary, #8b949e)' }}>
                  {techData ? techData['name'] as string : '—'}
                </td>
                <td style={{ ...TD_STYLE, minWidth: 80 }}>
                  {pr && (
                    <div title={`${bulbs}/${cost} bulbs (${pct}%)`}>
                      <div style={{ background: 'var(--xb-bg-elevated, #21262d)', borderRadius: 3, height: 6, overflow: 'hidden' }}>
                        <div style={{ background: color, height: '100%', width: `${pct}%`, borderRadius: 3, transition: 'width 0.3s' }} />
                      </div>
                    </div>
                  )}
                </td>
                <td style={{ ...TD_STYLE, color: stateColor, fontWeight: stateText === 'Moving' ? 600 : 400 }}>
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

function CitiesTable() {
  const cities = Object.values(store.cities);

  if (cities.length === 0) {
    return (
      <div style={{ padding: 16, color: 'var(--xb-text-secondary, #8b949e)', fontSize: 'var(--xb-font-size-sm, 12px)' }}>
        No cities known yet.
      </div>
    );
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={TABLE_STYLE}>
        <thead>
          <tr style={THEAD_TR_STYLE}>
            {['City', 'Owner', 'Size'].map(h => (
              <th key={h} style={TH_STYLE}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {cities.map((city) => {
            const owner = store.players[city.owner];
            const ownerName = (owner as Record<string, unknown> | undefined)?.['name'] as string ?? `#${city.owner}`;
            const nation = owner ? store.nations[(owner as Record<string, unknown>)['nation'] as number] : null;
            const color: string = (nation as Record<string, unknown> | undefined)?.['color'] as string ?? 'var(--xb-text-primary)';
            return (
              <tr key={city.id} style={TBODY_TR_STYLE}>
                <td style={TD_STYLE}>{city.name}</td>
                <td style={{ ...TD_STYLE, color }}>{ownerName}</td>
                <td style={TD_STYLE}>{city.size}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function UnitsTable() {
  const units = Object.values(store.units);

  if (units.length === 0) {
    return (
      <div style={{ padding: 16, color: 'var(--xb-text-secondary, #8b949e)', fontSize: 'var(--xb-font-size-sm, 12px)' }}>
        No units known yet.
      </div>
    );
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={TABLE_STYLE}>
        <thead>
          <tr style={THEAD_TR_STYLE}>
            {['Type', 'Owner', 'HP'].map(h => (
              <th key={h} style={TH_STYLE}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {units.map((unit) => {
            const utype = store.unitTypes[unit.type];
            const typeName = (utype as Record<string, unknown> | undefined)?.['name'] as string ?? `#${unit.type}`;
            const owner = store.players[unit.owner];
            const ownerName = (owner as Record<string, unknown> | undefined)?.['name'] as string ?? `#${unit.owner}`;
            const nation = owner ? store.nations[(owner as Record<string, unknown>)['nation'] as number] : null;
            const color: string = (nation as Record<string, unknown> | undefined)?.['color'] as string ?? 'var(--xb-text-primary)';
            return (
              <tr key={unit.id} style={TBODY_TR_STYLE}>
                <td style={TD_STYLE}>{typeName}</td>
                <td style={{ ...TD_STYLE, color }}>{ownerName}</td>
                <td style={TD_STYLE}>{unit.hp}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ── root component ────────────────────────────────────────────────────────────

// ── Action bar ───────────────────────────────────────────────────────────────

function ActionBar() {
  const selectedNo = _selectedPlayerno.value;
  const hasSelection = selectedNo >= 0;
  const pplayer = hasSelection ? store.players[selectedNo] : null;
  const isAlive = hasSelection && pplayer && (pplayer as Record<string, unknown>)['is_alive'] !== false;

  function handleViewOnMap() {
    if (!isAlive) return;
    centerOnPlayer();
  }

  function handleGameScores() {
    import('../data/nation').then(({ getPlayerScoresSummary }) => {
      const text = getPlayerScoresSummary();
      import('../client/civClient').then(({ showDialogMessage }) =>
        showDialogMessage('Game Scores', text),
      );
    });
  }

  return (
    <div style={{
      display: 'flex',
      gap: 8,
      padding: '8px 12px',
      borderBottom: '1px solid var(--xb-border-default, #30363d)',
      background: 'var(--xb-bg-secondary, #161b22)',
      flexShrink: 0,
    }}>
      <Button
        onClick={handleViewOnMap}
        disabled={!isAlive}
        variant="secondary"
      >
        View on Map
      </Button>
      <Button onClick={handleGameScores} variant="secondary">
        Game Scores
      </Button>
    </div>
  );
}

// ── root component ────────────────────────────────────────────────────────────

export function NationOverview() {
  _tick.value;           // explicit external refresh (refreshNationOverview())
  currentTurn.value;     // re-render on each new turn
  playerUpdated.value;    // re-render when any player changes
  researchUpdated.value;  // re-render when research state changes (RESEARCH_INFO)
  cityCount.value;        // re-render when city count changes
  unitCount.value;        // re-render when unit count changes
  rulesetReady.value;     // re-render when tech names become available
  const activeTab = _activeTab.value;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <ActionBar />
      <div style={{ flex: 1, overflow: 'auto' }}>
        <Tabs
          tabs={OVERVIEW_TABS}
          activeTab={activeTab}
          onTabChange={(id) => { _activeTab.value = id as OverviewTab; }}
        >
          <TabPanel id="nations" activeTab={activeTab}><NationsTable /></TabPanel>
          <TabPanel id="cities"  activeTab={activeTab}><CitiesTable /></TabPanel>
          <TabPanel id="units"   activeTab={activeTab}><UnitsTable /></TabPanel>
        </Tabs>
      </div>
    </div>
  );
}
