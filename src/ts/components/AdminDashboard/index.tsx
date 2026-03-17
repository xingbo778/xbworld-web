import { h, render } from 'preact';
import { useEffect } from 'preact/hooks';
import { signal } from '@preact/signals';
import { AdminApi, AdminConfig } from './AdminApi';
import { ThemeTokensTab } from './ThemeTokensTab';
import { AgentStrategyTab } from './AgentStrategyTab';
import { RulesTab } from './RulesTab';
import { RulesetValuesTab } from './RulesetValuesTab';
import { GameMechanicsTab } from './GameMechanicsTab';
import { LiveStateTab } from './LiveStateTab';

const TABS = [
  { id: 'theme',     label: 'UI Tokens' },
  { id: 'strategy',  label: 'Agent Strategy' },
  { id: 'rules',     label: 'Agent Rules' },
  { id: 'ruleset',   label: 'Ruleset Values' },
  { id: 'mechanics', label: 'Game Mechanics' },
  { id: 'live',      label: 'Live State' },
];

export const activeTab = signal('live');
export const configSignal = signal<AdminConfig | null>(null);
export const sseStatus = signal<'connecting' | 'connected' | 'error'>('connecting');
export const lastEvent = signal<{type: string; data: unknown} | null>(null);

function AdminDashboard() {
  useEffect(() => {
    AdminApi.getConfig().then(c => { configSignal.value = c; }).catch(() => {});

    // SSE connection
    let es: EventSource | undefined;
    try {
      es = AdminApi.connectSSE((type, data) => {
        sseStatus.value = 'connected';
        lastEvent.value = { type, data };
        // Refresh config on changes
        if (type === 'config_changed') {
          AdminApi.getConfig().then(c => { configSignal.value = c; }).catch(() => {});
        }
      });
      es.onerror = () => { sseStatus.value = 'error'; };
    } catch {}
    return () => { es?.close(); };
  }, []);

  const tab = activeTab.value;

  return (
    <div class="xb-admin-layout">
      <div class="xb-admin-header">
        <span class="xb-admin-title">&#9881; XBWorld Admin</span>
        <span class={`xb-admin-sse-badge xb-admin-sse-${sseStatus.value}`}>
          {sseStatus.value === 'connected' ? '● Live' : sseStatus.value === 'connecting' ? '○ Connecting' : '✕ Offline'}
        </span>
      </div>
      <div class="xb-admin-tabs">
        {TABS.map(t => (
          <button
            key={t.id}
            class={`xb-admin-tab${tab === t.id ? ' xb-admin-tab-active' : ''}`}
            onClick={() => { activeTab.value = t.id; }}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div class="xb-admin-content">
        {tab === 'theme'     && <ThemeTokensTab />}
        {tab === 'strategy'  && <AgentStrategyTab />}
        {tab === 'rules'     && <RulesTab />}
        {tab === 'ruleset'   && <RulesetValuesTab />}
        {tab === 'mechanics' && <GameMechanicsTab />}
        {tab === 'live'      && <LiveStateTab />}
      </div>
    </div>
  );
}

export function mountAdminDashboard() {
  const root = document.getElementById('xb-admin-root');
  if (root) render(h(AdminDashboard, {}), root);
}
