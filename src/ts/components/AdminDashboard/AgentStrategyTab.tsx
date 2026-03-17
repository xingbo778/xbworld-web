import { h } from 'preact';
import { signal } from '@preact/signals';
import { useEffect } from 'preact/hooks';
import { AdminApi } from './AdminApi';
import { configSignal } from './index';

const promptSignal = signal('');
const savedSignal = signal<string | null>(null);
const techsSignal = signal<string[]>([]);
const newTechSignal = signal('');

export function AgentStrategyTab() {
  useEffect(() => {
    AdminApi.getPrompt().then(r => { promptSignal.value = r.prompt ?? ''; }).catch(() => {});
  }, []);

  const cfg = configSignal.value;
  if (cfg && techsSignal.value.length === 0 && cfg.research_priority_techs?.length > 0) {
    techsSignal.value = [...cfg.research_priority_techs];
  }

  async function savePrompt() {
    await AdminApi.putPrompt(promptSignal.value);
    savedSignal.value = 'Prompt saved!';
    setTimeout(() => { savedSignal.value = null; }, 2000);
  }

  async function saveEngine(type: string) {
    await AdminApi.patchConfig({ engine_type: type as 'llm' | 'rule_based' });
  }

  async function saveTechs() {
    await AdminApi.patchConfig({ research_priority_techs: techsSignal.value });
    savedSignal.value = 'Priorities saved!';
    setTimeout(() => { savedSignal.value = null; }, 2000);
  }

  function moveTech(i: number, dir: -1 | 1) {
    const arr = [...techsSignal.value];
    const j = i + dir;
    if (j < 0 || j >= arr.length) return;
    [arr[i], arr[j]] = [arr[j], arr[i]];
    techsSignal.value = arr;
  }

  function removeTech(i: number) {
    techsSignal.value = techsSignal.value.filter((_, idx) => idx !== i);
  }

  function addTech() {
    const t = newTechSignal.value.trim();
    if (t && !techsSignal.value.includes(t)) {
      techsSignal.value = [...techsSignal.value, t];
      newTechSignal.value = '';
    }
  }

  return (
    <div class="xb-admin-tab-body">
      {savedSignal.value && <div class="xb-badge xb-badge-green xb-admin-mb-lg">{savedSignal.value}</div>}

      <div class="xb-admin-section-title">Decision Engine</div>
      <div class="xb-admin-form-row">
        {(['llm', 'rule_based'] as const).map(type => (
          <label key={type} class="xb-admin-gap" style={{ cursor: 'pointer', marginRight: '16px' }}>
            <input type="radio" name="engine" value={type}
              checked={cfg?.engine_type === type}
              onChange={() => saveEngine(type)} />
            <span>{type === 'llm' ? 'LLM (Claude/GPT)' : 'Rule-Based'}</span>
          </label>
        ))}
      </div>

      <div class="xb-admin-section-title xb-admin-mt-lg">System Prompt</div>
      <textarea
        class="xb-admin-textarea"
        style={{ height: '200px' }}
        value={promptSignal.value}
        onInput={(e) => { promptSignal.value = (e.target as HTMLTextAreaElement).value; }}
      />
      <div class="xb-admin-input-row xb-admin-mt">
        <button class="xb-btn xb-btn-primary" onClick={savePrompt}>Save Prompt</button>
      </div>

      <div class="xb-admin-section-title xb-admin-mt-lg">Research Priority Techs</div>
      <div class="xb-admin-mb">
        {techsSignal.value.map((tech, i) => (
          <div key={i} class="xb-admin-input-row">
            <span class="xb-stat-label" style={{ width: '24px', textAlign: 'right' }}>{i + 1}.</span>
            <span style={{ flex: 1, fontSize: '13px' }}>{tech}</span>
            <button class="xb-btn xb-btn-secondary" style={{ padding: '2px 8px' }} onClick={() => moveTech(i, -1)}>&#8593;</button>
            <button class="xb-btn xb-btn-secondary" style={{ padding: '2px 8px' }} onClick={() => moveTech(i, 1)}>&#8595;</button>
            <button class="xb-btn xb-btn-danger" style={{ padding: '2px 8px' }} onClick={() => removeTech(i)}>&#x2715;</button>
          </div>
        ))}
      </div>
      <div class="xb-admin-input-row xb-admin-mt">
        <input type="text" class="xb-form-input" placeholder="Add tech..." value={newTechSignal.value}
          style={{ flex: 1 }}
          onInput={(e) => { newTechSignal.value = (e.target as HTMLInputElement).value; }}
          onKeyDown={(e) => { if (e.key === 'Enter') addTech(); }} />
        <button class="xb-btn xb-btn-secondary" onClick={addTech}>Add</button>
        <button class="xb-btn xb-btn-primary" onClick={saveTechs}>Save Order</button>
      </div>
    </div>
  );
}
