/**
 * CitiesTab — Cities sub-tab content for NationOverview.
 *
 * Reads directly from store/signals; no props received from parent.
 */
import { store } from '../data/store';
import { cityCount, rulesetReady } from '../data/signals';
import type { City } from '../data/types';
import { show_city_dialog } from '../ui/cityDialog';

export function CitiesTab() {
  cityCount.value;    // re-render when city list changes
  rulesetReady.value; // re-render when improvement/unit names load

  const cities = Object.values(store.cities) as City[];

  if (cities.length === 0) {
    return (
      <div class="xb-empty-state">
        No cities known yet.
      </div>
    );
  }

  const sorted = [...cities].sort((a, b) => {
    const ownDiff = (a.owner as number) - (b.owner as number);
    if (ownDiff !== 0) return ownDiff;
    return String(a.name).localeCompare(String(b.name));
  });

  return (
    <div class="xb-table-scroll-wrap">
      <table class="xb-table">
        <thead>
          <tr>
            {['City', 'Owner', 'Size', 'Production'].map(h => (
              <th key={h}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map((city) => {
            const owner = store.players[city.owner as number];
            const ownerName = (owner as Record<string, unknown> | undefined)?.['name'] as string ?? `#${city.owner}`;
            const nation = owner ? store.nations[(owner as Record<string, unknown>)['nation'] as number] : null;
            // color is dynamic player color — kept inline
            const color: string = (nation as Record<string, unknown> | undefined)?.['color'] as string ?? 'var(--xb-text-primary)';
            const prod = city.production as Record<string, unknown> | undefined;
            const prodKind = prod?.['kind'] as number | undefined;
            const prodValue = prod?.['value'] as number | undefined;
            let prodName = '—';
            if (prodKind === 0 && prodValue !== undefined) {
              const impr = store.improvements[prodValue];
              if (impr) prodName = (impr as Record<string, unknown>)['name'] as string;
            } else if (prodKind === 1 && prodValue !== undefined) {
              const utype = store.unitTypes[prodValue];
              if (utype) prodName = (utype as Record<string, unknown>)['name'] as string;
            }
            return (
              <tr
                key={city.id}
                onClick={() => show_city_dialog(city)}
                class="xb-row-clickable"
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--xb-bg-elevated, #21262d)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = ''; }}
              >
                <td style={{ fontWeight: 600 }}>{city.name}</td>
                <td style={{ color }}>{ownerName}</td>
                <td>{String(city.size ?? '—')}</td>
                <td style={{ color: 'var(--xb-text-secondary, #8b949e)' }}>{prodName}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div class="xb-table-hint">
        {cities.length} cities — click a row to open the city view
      </div>
    </div>
  );
}
