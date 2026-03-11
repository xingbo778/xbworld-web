/**
 * CitiesPanel — Preact component for the Cities tab (tabs-cities).
 *
 * Shows all cities known in observer mode, grouped by owner.
 * Clicking a city row opens the CityDialog for that city.
 *
 * Mounted lazily when the cities tab is first opened.
 */
import { render } from 'preact';
import { cityCount, currentTurn, rulesetReady, playerUpdated } from '../data/signals';
import { store } from '../data/store';
import type { City } from '../data/types';
import { show_city_dialog } from '../ui/cityDialog';

// ── Styles ────────────────────────────────────────────────────────────────────

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
  borderBottom: '2px solid var(--xb-border-default, #30363d)',
  background: 'var(--xb-bg-secondary, #161b22)',
};
const TD_STYLE = {
  padding: '6px 10px',
  borderBottom: '1px solid var(--xb-border-muted, #21262d)',
};

// ── Component ─────────────────────────────────────────────────────────────────

function CitiesPanel() {
  // Re-render on city count, turn, ruleset, and player info changes
  cityCount.value;
  currentTurn.value;
  rulesetReady.value;
  playerUpdated.value;

  const cities = Object.values(store.cities) as City[];

  if (cities.length === 0) {
    return (
      <div style={{ padding: 24, color: 'var(--xb-text-secondary, #8b949e)', fontSize: 'var(--xb-font-size-sm, 12px)' }}>
        No cities known yet.
      </div>
    );
  }

  // Sort by owner, then by name
  const sorted = [...cities].sort((a, b) => {
    const ownDiff = (a.owner as number) - (b.owner as number);
    if (ownDiff !== 0) return ownDiff;
    return String(a.name).localeCompare(String(b.name));
  });

  return (
    <div style={{ overflowX: 'auto', padding: '8px 0' }}>
      <table style={TABLE_STYLE}>
        <thead>
          <tr>
            <th style={TH_STYLE}>City</th>
            <th style={TH_STYLE}>Owner</th>
            <th style={TH_STYLE}>Size</th>
            <th style={TH_STYLE}>Production</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((city) => {
            const owner = store.players[city.owner as number];
            const ownerName = (owner as Record<string, unknown> | undefined)?.['name'] as string ?? `#${city.owner}`;
            const nation = owner ? store.nations[(owner as Record<string, unknown>)['nation'] as number] : null;
            const color: string = (nation as Record<string, unknown> | undefined)?.['color'] as string ?? 'var(--xb-text-primary)';
            const prod = city.production as Record<string, unknown> | undefined;
            const prodKind = prod?.['kind'] as number | undefined;
            const prodValue = prod?.['value'] as number | undefined;
            let prodName = '—';
            if (prodKind === 0 && prodValue !== undefined) {
              // Improvement
              const impr = store.improvements[prodValue];
              if (impr) prodName = (impr as Record<string, unknown>)['name'] as string;
            } else if (prodKind === 1 && prodValue !== undefined) {
              // Unit
              const utype = store.unitTypes[prodValue];
              if (utype) prodName = (utype as Record<string, unknown>)['name'] as string;
            }

            return (
              <tr
                key={city.id}
                onClick={() => show_city_dialog(city)}
                style={{ cursor: 'pointer' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--xb-bg-secondary, #161b22)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = ''; }}
              >
                <td style={TD_STYLE}>
                  <span style={{ fontWeight: 600 }}>{String(city.name)}</span>
                </td>
                <td style={{ ...TD_STYLE, color }}>
                  {ownerName}
                </td>
                <td style={TD_STYLE}>
                  {String(city.size ?? '—')}
                </td>
                <td style={{ ...TD_STYLE, color: 'var(--xb-text-secondary, #8b949e)' }}>
                  {prodName}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div style={{ padding: '6px 10px', color: 'var(--xb-text-secondary, #8b949e)', fontSize: 'var(--xb-font-size-xs, 11px)' }}>
        {cities.length} cities total — click a row to open the city view
      </div>
    </div>
  );
}

// ── Mount helper ──────────────────────────────────────────────────────────────

let _mounted = false;

export function mountCitiesPanel(): void {
  if (_mounted) return;
  const tabsCities = document.getElementById('tabs-cities');
  if (!tabsCities) return;
  // Clear legacy "Your Cities" heading and empty cities_list DOM
  tabsCities.innerHTML = '';
  const container = document.createElement('div');
  container.id = 'xb-cities-panel';
  tabsCities.appendChild(container);
  render(<CitiesPanel />, container);
  _mounted = true;
}
