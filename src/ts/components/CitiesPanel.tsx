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
import type { City, Improvement, Nation, UnitType } from '../data/types';
import { show_city_dialog } from '../ui/cityDialog';

// ── Component ─────────────────────────────────────────────────────────────────

export function CitiesPanel() {
  // Re-render on city count, turn, ruleset, and player info changes
  cityCount.value;
  currentTurn.value;
  rulesetReady.value;
  playerUpdated.value;

  const cities = Object.values(store.cities) as City[];

  if (cities.length === 0) {
    return (
      <div class="xb-empty-state" style={{ padding: 24 }}>
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
    <div class="xb-table-scroll-wrap" style={{ padding: '8px 0' }}>
      <table class="xb-table">
        <thead>
          <tr>
            <th>City</th>
            <th>Owner</th>
            <th>Size</th>
            <th>Production</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((city) => {
            const owner = store.players[city.owner];
            const ownerName = owner?.name ?? `#${city.owner}`;
            const nation = owner ? store.nations[owner.nation] as (Nation & { color?: string }) | undefined : null;
            const color = nation?.color ?? 'var(--xb-text-primary)';
            const prod = city.production as { kind?: number; value?: number } | undefined;
            const prodKind = prod?.kind;
            const prodValue = prod?.value;
            let prodName = '—';
            if (prodKind === 0 && prodValue !== undefined) {
              // Improvement
              const impr = store.improvements[prodValue] as Improvement | undefined;
              if (impr) prodName = impr.name;
            } else if (prodKind === 1 && prodValue !== undefined) {
              // Unit
              const utype = store.unitTypes[prodValue] as UnitType | undefined;
              if (utype) prodName = utype.name;
            }

            return (
              <tr
                key={city.id}
                onClick={() => show_city_dialog(city)}
                class="xb-row-clickable"
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--xb-bg-secondary, #161b22)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = ''; }}
              >
                <td>
                  <span style={{ fontWeight: 600 }}>{String(city.name)}</span>
                </td>
                <td style={{ color }}>
                  {ownerName}
                </td>
                <td>
                  {String(city.size ?? '—')}
                </td>
                <td style={{ color: 'var(--xb-text-secondary, #8b949e)' }}>
                  {prodName}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div class="xb-table-hint">
        {cities.length} cities total — click a row to open the city view
      </div>
    </div>
  );
}

// ── Mount helper ───────────────────────────────────────────────────────────────

let _mounted = false;

export function mountCitiesPanel(): void {
  if (_mounted) return;
  const container = document.getElementById('tabs-cities');
  if (!container) return;
  render(<CitiesPanel />, container);
  _mounted = true;
}
