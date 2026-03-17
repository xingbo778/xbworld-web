import { h } from 'preact';
import { signal } from '@preact/signals';
import { useEffect } from 'preact/hooks';
import { AdminApi, AdminConfig } from './AdminApi';
import { configSignal } from './index';

const errorsSignal = signal<string[]>([]);
const savedSignal = signal(false);
const toolsSignal = signal<unknown[]>([]);

const RULES = [
  { key: 'min_city_distance',          label: 'Min city founding distance (tiles)', min: 2,  max: 15  },
  { key: 'default_science_rate',       label: 'Default science rate (%)',            min: 0,  max: 100 },
  { key: 'default_tax_rate',           label: 'Default tax rate (%)',                min: 0,  max: 100 },
  { key: 'default_luxury_rate',        label: 'Default luxury rate (%)',             min: 0,  max: 100 },
  { key: 'llm_max_iterations',         label: 'Max LLM iterations per turn',         min: 1,  max: 30  },
  { key: 'turn_timeout_seconds',       label: 'LLM turn timeout (s)',                min: 10, max: 600 },
  { key: 'inter_turn_delay',           label: 'Delay between turns (s)',             min: 0,  max: 120 },
];

export function RulesTab() {
  useEffect(() => {
    AdminApi.getTools().then(t => { toolsSignal.value = t; }).catch(() => {});
  }, []);

  const cfg = configSignal.value;
  if (!cfg) return <div class="xb-admin-tab-body xb-stat-label">Loading config...</div>;

  const localValues = signal<Record<string, number>>({});

  async function handleSave(key: string, value: number) {
    const result = await AdminApi.patchConfig({ [key]: value } as Partial<AdminConfig>);
    if (result.errors?.length) {
      errorsSignal.value = result.errors;
    } else {
      errorsSignal.value = [];
      savedSignal.value = true;
      setTimeout(() => { savedSignal.value = false; }, 1500);
    }
  }

  return (
    <div class="xb-admin-tab-body">
      {savedSignal.value && <div class="xb-badge xb-badge-green" style={{ marginBottom: '12px' }}>Saved!</div>}
      {errorsSignal.value.length > 0 && (
        <div class="xb-badge xb-badge-red" style={{ marginBottom: '12px' }}>{errorsSignal.value.join(', ')}</div>
      )}

      <div class="xb-admin-section-title">Agent Rule Values</div>
      <table class="xb-table" style={{ maxWidth: '600px' }}>
        <thead><tr><th>Setting</th><th>Value</th><th></th></tr></thead>
        <tbody>
          {RULES.map(rule => {
            const current = (cfg as unknown as Record<string, unknown>)[rule.key] as number ?? 0;
            const localVal = localValues.value[rule.key] ?? current;
            return (
              <tr key={rule.key}>
                <td>{rule.label}</td>
                <td>
                  <input type="number" class="xb-form-input"
                    style={{ width: '80px' }}
                    value={localVal} min={rule.min} max={rule.max}
                    onInput={(e) => {
                      localValues.value = { ...localValues.value, [rule.key]: Number((e.target as HTMLInputElement).value) };
                    }} />
                </td>
                <td>
                  <button class="xb-btn xb-btn-primary" style={{ padding: '4px 12px', fontSize: '12px' }}
                    onClick={() => handleSave(rule.key, localValues.value[rule.key] ?? current)}>
                    Apply
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div class="xb-admin-section-title" style={{ marginTop: '24px' }}>Available Agent Tools</div>
      <div class="xb-stat-label" style={{ marginBottom: '8px', fontSize: '12px' }}>
        These are the tools the LLM can call each turn.
      </div>
      <table class="xb-table">
        <thead><tr><th>Tool Name</th><th>Description</th></tr></thead>
        <tbody>
          {(toolsSignal.value as Array<Record<string, unknown>>).map(tool => {
            const fn = (tool?.function ?? tool) as Record<string, unknown>;
            return (
              <tr key={fn?.name as string}>
                <td><code style={{ fontSize: '11px' }}>{fn?.name as string}</code></td>
                <td class="xb-stat-label" style={{ fontSize: '12px' }}>{fn?.description as string}</td>
              </tr>
            );
          })}
          {toolsSignal.value.length === 0 && (
            <tr><td colSpan={2} class="xb-stat-label">No tools loaded (agent may not be running)</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
