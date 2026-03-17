import { h } from 'preact';
import { signal } from '@preact/signals';
import { useEffect } from 'preact/hooks';
import { AdminApi, CssToken } from './AdminApi';

const tokensSignal = signal<Record<string, CssToken>>({});
const overridesSignal = signal<Record<string, string>>({});

// Load saved overrides from localStorage
function loadOverrides(): Record<string, string> {
  try { return JSON.parse(localStorage.getItem('xb_token_overrides') ?? '{}'); } catch { return {}; }
}

export function ThemeTokensTab() {
  useEffect(() => {
    AdminApi.getTokens().then(t => { tokensSignal.value = t; }).catch(() => {});
    const saved = loadOverrides();
    overridesSignal.value = saved;
    // Apply saved overrides
    Object.entries(saved).forEach(([k, v]) => {
      document.documentElement.style.setProperty(k, v);
    });
  }, []);

  const tokens = tokensSignal.value;
  const overrides = overridesSignal.value;

  // Group by category
  const groups: Record<string, [string, CssToken][]> = {};
  Object.entries(tokens).forEach(([name, tok]) => {
    (groups[tok.category] ??= []).push([name, tok]);
  });

  function handleChange(name: string, value: string) {
    document.documentElement.style.setProperty(name, value);
    overridesSignal.value = { ...overrides, [name]: value };
  }

  function handleReset(name: string) {
    document.documentElement.style.removeProperty(name);
    const o = { ...overridesSignal.value };
    delete o[name];
    overridesSignal.value = o;
  }

  function saveAll() {
    localStorage.setItem('xb_token_overrides', JSON.stringify(overridesSignal.value));
  }

  function copyCSS() {
    const css = ':root {\n' + Object.entries(overridesSignal.value).map(([k, v]) => `  ${k}: ${v};`).join('\n') + '\n}';
    navigator.clipboard.writeText(css);
  }

  return (
    <div class="xb-admin-tab-body">
      <div class="xb-admin-toolbar">
        <button class="xb-btn xb-btn-secondary" onClick={saveAll}>Save to localStorage</button>
        <button class="xb-btn xb-btn-secondary" onClick={copyCSS}>Copy CSS</button>
        <span class="xb-stat-label">{Object.keys(overrides).length} overrides active</span>
      </div>
      {Object.entries(groups).map(([category, items]) => (
        <div key={category} class="xb-admin-token-group">
          <div class="xb-admin-section-title">{category}</div>
          <table class="xb-table">
            <thead><tr><th>Token</th><th>Default</th><th>Override</th><th></th></tr></thead>
            <tbody>
              {items.map(([name, tok]) => {
                const isColor = /^#|^rgb|^hsl/.test(tok.value.trim());
                const currentVal = overrides[name] ?? tok.value;
                return (
                  <tr key={name}>
                    <td><code class="xb-admin-token-name">{name}</code></td>
                    <td class="xb-stat-label">{tok.value}</td>
                    <td>
                      {isColor ? (
                        <div class="xb-admin-gap">
                          <input type="color" value={currentVal}
                            onInput={(e) => handleChange(name, (e.target as HTMLInputElement).value)}
                            class="xb-admin-color-swatch" />
                          <span class="xb-stat-label">{currentVal}</span>
                        </div>
                      ) : (
                        <input type="text" value={currentVal} class="xb-form-input"
                          style={{ width: '160px', fontSize: '11px', padding: '2px 6px' }}
                          onInput={(e) => handleChange(name, (e.target as HTMLInputElement).value)} />
                      )}
                    </td>
                    <td>
                      {overrides[name] && (
                        <button class="xb-btn xb-btn-secondary" style={{ padding: '2px 8px', fontSize: '11px' }}
                          onClick={() => handleReset(name)}>Reset</button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}
