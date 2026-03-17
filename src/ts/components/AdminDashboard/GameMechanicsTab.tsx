import { h } from 'preact';
import { signal } from '@preact/signals';
import { useEffect } from 'preact/hooks';
import { AdminApi, ServScript } from './AdminApi';

const scriptsSignal = signal<ServScript[]>([]);
const selectedScript = signal('');
const scriptContent = signal('');
const statusMsg = signal<string | null>(null);
const commandInput = signal('');
const commandResult = signal('');

// Quick-set keys parsed from .serv content
const QUICK_KEYS = ['timeout', 'aifill', 'maxconnectionsperhost', 'size', 'landmass'];

function parseServKey(content: string, key: string): string {
  const m = content.match(new RegExp(`^\\s*set\\s+${key}\\s+(\\S+)`, 'm'));
  return m ? m[1] : '';
}

function setServKey(content: string, key: string, value: string): string {
  const re = new RegExp(`(^\\s*set\\s+${key}\\s+)\\S+`, 'm');
  return content.match(re)
    ? content.replace(re, `$1${value}`)
    : content + `\nset ${key} ${value}`;
}

export function GameMechanicsTab() {
  useEffect(() => {
    AdminApi.getServScripts().then(s => {
      scriptsSignal.value = s;
      if (s.length > 0) {
        selectedScript.value = s[0].name;
        AdminApi.getServScript(s[0].name).then(r => { scriptContent.value = r.content; }).catch(() => {});
      }
    }).catch(() => {});
  }, []);

  async function loadScript(name: string) {
    selectedScript.value = name;
    const r = await AdminApi.getServScript(name).catch(() => null);
    if (r) scriptContent.value = r.content;
  }

  async function saveScript() {
    const r = await AdminApi.putServScript(selectedScript.value, scriptContent.value).catch(() => null);
    statusMsg.value = r?.ok ? (r.note ?? 'Saved!') : 'Save failed';
    setTimeout(() => { statusMsg.value = null; }, 3000);
  }

  async function sendCommand() {
    const r = await AdminApi.sendCommand(commandInput.value).catch(() => null);
    commandResult.value = r?.sent ? `Sent: ${r.sent}` : (r?.error ?? 'Error');
    setTimeout(() => { commandResult.value = ''; }, 3000);
  }

  const content = scriptContent.value;

  return (
    <div class="xb-admin-tab-body">
      <div class="xb-admin-section-title">Quick Settings</div>
      <table class="xb-table" style={{ maxWidth: '480px', marginBottom: '20px' }}>
        <thead><tr><th>Setting</th><th>Value</th></tr></thead>
        <tbody>
          {QUICK_KEYS.map(key => {
            const val = parseServKey(content, key);
            return (
              <tr key={key}>
                <td><code style={{ fontSize: '11px' }}>{key}</code></td>
                <td>
                  <input type="text" class="xb-form-input" style={{ width: '100px' }}
                    value={val}
                    onInput={(e) => {
                      scriptContent.value = setServKey(scriptContent.value, key, (e.target as HTMLInputElement).value);
                    }} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div class="xb-admin-section-title">Server Script Editor</div>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '8px', alignItems: 'center' }}>
        <select class="xb-theme-select" onChange={(e) => loadScript((e.target as HTMLSelectElement).value)}>
          {scriptsSignal.value.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
        </select>
        {statusMsg.value && <span class="xb-stat-label">{statusMsg.value}</span>}
      </div>
      <textarea class="xb-form-input xb-form-input-full"
        style={{ height: '240px', resize: 'vertical', fontSize: '12px', fontFamily: 'monospace' }}
        value={content}
        onInput={(e) => { scriptContent.value = (e.target as HTMLTextAreaElement).value; }} />
      <button class="xb-btn xb-btn-primary" style={{ marginTop: '8px' }} onClick={saveScript}>
        Save Script
      </button>

      <div class="xb-admin-section-title" style={{ marginTop: '24px' }}>Send Server Command</div>
      <div style={{ display: 'flex', gap: '8px' }}>
        <input type="text" class="xb-form-input" style={{ flex: 1 }}
          placeholder="/set timeout 90"
          value={commandInput.value}
          onInput={(e) => { commandInput.value = (e.target as HTMLInputElement).value; }}
          onKeyDown={(e) => { if (e.key === 'Enter') sendCommand(); }} />
        <button class="xb-btn xb-btn-secondary" onClick={sendCommand}>Send</button>
      </div>
      {commandResult.value && <div class="xb-stat-label" style={{ marginTop: '6px' }}>{commandResult.value}</div>}
    </div>
  );
}
