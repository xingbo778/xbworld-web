import { h } from 'preact';
import { signal } from '@preact/signals';
import { useEffect } from 'preact/hooks';
import { AdminApi } from './AdminApi';

const stateSignal = signal<{turn: number; players: unknown[]; cities: unknown[]; units: unknown[]} | null>(null);
const loading = signal(false);

export function LiveStateTab() {
  async function refresh() {
    loading.value = true;
    const s = await AdminApi.getGameState().catch(() => null);
    if (s) stateSignal.value = s;
    loading.value = false;
  }

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, 5000);
    return () => clearInterval(interval);
  }, []);

  const state = stateSignal.value;

  return (
    <div class="xb-admin-tab-body">
      <div class="xb-admin-toolbar">
        <button class="xb-btn xb-btn-secondary" onClick={refresh}>
          {loading.value ? 'Refreshing...' : 'Refresh'}
        </button>
        {state && <span class="xb-stat-label">Turn {state.turn} · Auto-refreshes every 5s</span>}
      </div>

      {!state && <div class="xb-stat-label">No game state available. Agent may not be running.</div>}

      {state && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
          <div>
            <div class="xb-admin-section-title">Players ({state.players.length})</div>
            <table class="xb-table">
              <thead><tr><th>Name</th><th>Cities</th><th>Units</th><th>Gold</th></tr></thead>
              <tbody>
                {(state.players as Array<Record<string, unknown>>).map((p) => (
                  <tr key={(p['playerno'] ?? p['name']) as string}>
                    <td style={{ fontWeight: 600 }}>{(p['name'] ?? p['username'] ?? '?') as string}</td>
                    <td class="xb-col-right">{(p['cities_count'] ?? '-') as string | number}</td>
                    <td class="xb-col-right">{(p['units_count'] ?? '-') as string | number}</td>
                    <td class="xb-col-right">{(p['gold'] ?? '-') as string | number}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div>
            <div class="xb-admin-section-title">Cities ({state.cities.length})</div>
            <div class="xb-scroll-y" style={{ maxHeight: '400px' }}>
              <table class="xb-table">
                <thead><tr><th>City</th><th>Size</th><th>Production</th></tr></thead>
                <tbody>
                  {(state.cities as Array<Record<string, unknown>>).slice(0, 50).map((c) => (
                    <tr key={(c['id'] ?? c['name']) as string | number}>
                      <td>{(c['name'] ?? `City ${c['id']}`) as string}</td>
                      <td class="xb-col-right">{(c['size'] ?? '-') as string | number}</td>
                      <td class="xb-stat-label" style={{ fontSize: '11px' }}>{(c['production_name'] ?? c['production'] ?? '-') as string}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <div class="xb-admin-section-title">Units ({state.units.length})</div>
            <div class="xb-scroll-y" style={{ maxHeight: '400px' }}>
              <table class="xb-table">
                <thead><tr><th>Type</th><th>HP</th><th>MP</th></tr></thead>
                <tbody>
                  {(state.units as Array<Record<string, unknown>>).slice(0, 50).map((u) => (
                    <tr key={u['id'] as string | number}>
                      <td>{(u['type_name'] ?? u['unit_type'] ?? `Unit ${u['id']}`) as string}</td>
                      <td class="xb-col-right">{(u['hp'] ?? '-') as string | number}</td>
                      <td class="xb-col-right">{(u['moves_left'] ?? u['mp'] ?? '-') as string | number}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
