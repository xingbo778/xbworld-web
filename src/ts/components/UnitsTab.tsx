/**
 * UnitsTab — Units sub-tab content for NationOverview.
 *
 * Reads directly from store/signals; no props received from parent.
 */
import { store } from '../data/store';
import { unitCount, rulesetReady } from '../data/signals';

export function UnitsTab() {
  unitCount.value;    // re-render when unit list changes
  rulesetReady.value; // re-render when unit type names load

  const units = Object.values(store.units);

  if (units.length === 0) {
    return (
      <div class="xb-empty-state">
        No units known yet.
      </div>
    );
  }

  const sorted = [...units].sort((a, b) => {
    const ownDiff = a.owner - b.owner;
    if (ownDiff !== 0) return ownDiff;
    return a.type - b.type;
  });

  return (
    <div class="xb-table-scroll-wrap">
      <table class="xb-table">
        <thead>
          <tr>
            {['Type', 'Owner', 'HP'].map(h => (
              <th key={h}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map((unit) => {
            const utype = store.unitTypes[unit.type];
            const typeName = (utype as Record<string, unknown> | undefined)?.['name'] as string ?? `#${unit.type}`;
            const owner = store.players[unit.owner];
            const ownerName = (owner as Record<string, unknown> | undefined)?.['name'] as string ?? `#${unit.owner}`;
            const nation = owner ? store.nations[(owner as Record<string, unknown>)['nation'] as number] : null;
            // color is dynamic player color — kept inline
            const color: string = (nation as Record<string, unknown> | undefined)?.['color'] as string ?? 'var(--xb-text-primary)';
            return (
              <tr key={unit.id}>
                <td>{typeName}</td>
                <td style={{ color }}>{ownerName}</td>
                <td>{unit.hp}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div class="xb-table-hint">
        {units.length} units total
      </div>
    </div>
  );
}
