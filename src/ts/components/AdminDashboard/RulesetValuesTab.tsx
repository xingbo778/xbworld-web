import { h } from 'preact';
import { signal } from '@preact/signals';
import { useEffect, useState } from 'preact/hooks';
import { AdminApi, UnitStat, BuildingStat } from './AdminApi';

const unitsSignal = signal<UnitStat[]>([]);
const buildingsSignal = signal<BuildingStat[]>([]);
const activeSubTab = signal<'units' | 'buildings'>('units');
const statusMsg = signal<{text: string; ok: boolean} | null>(null);

async function applyChange(type: 'unit' | 'building', name: string, stat: string, value: number) {
  const fn = type === 'unit' ? AdminApi.patchUnit : AdminApi.patchBuilding;
  const result = await fn(name, stat, value);
  statusMsg.value = result.ok
    ? { text: result.note ?? 'Saved. Restart game server to apply.', ok: true }
    : { text: result.error ?? 'Error', ok: false };
  setTimeout(() => { statusMsg.value = null; }, 4000);
}

function EditableCell({ value, name, stat, type }: { value: number; name: string; stat: string; type: 'unit' | 'building' }) {
  const [local, setLocal] = useState(value);
  const changed = local !== value;
  return (
    <td style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
      <input type="number" class="xb-form-input" style={{ width: '64px', padding: '2px 6px' }}
        value={local} onInput={(e) => setLocal(Number((e.target as HTMLInputElement).value))} />
      {changed && (
        <button class="xb-btn xb-btn-primary" style={{ padding: '2px 8px', fontSize: '11px' }}
          onClick={() => applyChange(type, name, stat, local)}>&#10003;</button>
      )}
    </td>
  );
}

export function RulesetValuesTab() {
  useEffect(() => {
    AdminApi.getUnits().then(u => { unitsSignal.value = u; }).catch(() => {});
    AdminApi.getBuildings().then(b => { buildingsSignal.value = b; }).catch(() => {});
  }, []);

  return (
    <div class="xb-admin-tab-body">
      <div class="xb-admin-banner xb-admin-banner-warn">
        &#9888; Ruleset changes require a game server restart to take effect.
      </div>
      {statusMsg.value && (
        <div class={`xb-badge ${statusMsg.value.ok ? 'xb-badge-green' : 'xb-badge-red'}`} style={{ margin: '8px 0' }}>
          {statusMsg.value.text}
        </div>
      )}

      <div class="xb-admin-tabs" style={{ marginBottom: '16px' }}>
        {(['units', 'buildings'] as const).map(t => (
          <button key={t} class={`xb-admin-tab${activeSubTab.value === t ? ' xb-admin-tab-active' : ''}`}
            onClick={() => { activeSubTab.value = t; }}>
            {t === 'units' ? `Units (${unitsSignal.value.length})` : `Buildings (${buildingsSignal.value.length})`}
          </button>
        ))}
      </div>

      {activeSubTab.value === 'units' && (
        <table class="xb-table">
          <thead><tr><th>Unit</th><th>Build Cost</th><th>Attack</th><th>Defense</th><th>Move Rate</th></tr></thead>
          <tbody>
            {unitsSignal.value.length === 0
              ? <tr><td colSpan={5} class="xb-stat-label">No ruleset data (check RULESET_PATH)</td></tr>
              : unitsSignal.value.map(u => (
                <tr key={u.section}>
                  <td style={{ fontWeight: 600 }}>{u.name}</td>
                  <EditableCell value={u.build_cost} name={u.name} stat="build_cost" type="unit" />
                  <EditableCell value={u.attack} name={u.name} stat="attack" type="unit" />
                  <EditableCell value={u.defense} name={u.name} stat="defense" type="unit" />
                  <EditableCell value={u.move_rate} name={u.name} stat="move_rate" type="unit" />
                </tr>
              ))}
          </tbody>
        </table>
      )}

      {activeSubTab.value === 'buildings' && (
        <table class="xb-table">
          <thead><tr><th>Building</th><th>Build Cost</th><th>Upkeep</th></tr></thead>
          <tbody>
            {buildingsSignal.value.length === 0
              ? <tr><td colSpan={3} class="xb-stat-label">No ruleset data (check RULESET_PATH)</td></tr>
              : buildingsSignal.value.map(b => (
                <tr key={b.section}>
                  <td style={{ fontWeight: 600 }}>{b.name}</td>
                  <EditableCell value={b.build_cost} name={b.name} stat="build_cost" type="building" />
                  <EditableCell value={b.upkeep} name={b.name} stat="upkeep" type="building" />
                </tr>
              ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
