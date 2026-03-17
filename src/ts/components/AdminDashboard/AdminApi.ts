/// <reference types="vite/client" />

// Admin API base URL - configurable via env var
const ADMIN_BASE = (typeof window !== 'undefined' && (window as any).ADMIN_BASE_URL)
  ? (window as any).ADMIN_BASE_URL
  : (import.meta.env.VITE_ADMIN_URL ?? 'http://localhost:8081');

function adminFetch<T = unknown>(method: string, path: string, body?: unknown): Promise<T> {
  const secret = localStorage.getItem('xb_admin_secret') ?? '';
  return fetch(`${ADMIN_BASE}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(secret ? { 'Authorization': `Bearer ${secret}` } : {}),
    },
    body: body != null ? JSON.stringify(body) : undefined,
  }).then(r => r.json());
}

export interface AdminConfig {
  engine_type: 'llm' | 'rule_based';
  llm_max_iterations: number;
  turn_timeout_seconds: number;
  inter_turn_delay: number;
  research_priority_techs: string[];
  min_city_distance: number;
  default_science_rate: number;
  default_tax_rate: number;
  default_luxury_rate: number;
  game_timeout: number;
  aifill: number;
  max_connections_per_host: number;
}

export interface UnitStat {
  name: string; section: string;
  build_cost: number; attack: number; defense: number; move_rate: number;
}

export interface BuildingStat {
  name: string; section: string;
  build_cost: number; upkeep: number;
}

export interface CssToken { value: string; category: string; }

export interface ServScript { name: string; path: string; }

export const AdminApi = {
  getConfig: () => adminFetch<AdminConfig>('GET', '/admin/config'),
  patchConfig: (updates: Partial<AdminConfig>) => adminFetch<{changed: Record<string, unknown>; errors: string[]}>('PATCH', '/admin/config', { updates }),
  getPrompt: () => adminFetch<{prompt: string}>('GET', '/admin/config/prompt'),
  putPrompt: (prompt: string) => adminFetch<{ok: boolean}>('PUT', '/admin/config/prompt', { prompt }),
  getAgentStatus: () => adminFetch<Record<string, unknown>>('GET', '/admin/agent/status'),
  getTools: () => adminFetch<unknown[]>('GET', '/admin/agent/tools'),
  getUnits: () => adminFetch<UnitStat[]>('GET', '/admin/ruleset/units'),
  getBuildings: () => adminFetch<BuildingStat[]>('GET', '/admin/ruleset/buildings'),
  patchUnit: (name: string, stat: string, value: number) =>
    adminFetch<{ok: boolean; note?: string; error?: string}>('PATCH', '/admin/ruleset/unit', { name, stat, value }),
  patchBuilding: (name: string, stat: string, value: number) =>
    adminFetch<{ok: boolean; note?: string; error?: string}>('PATCH', '/admin/ruleset/building', { name, stat, value }),
  getGameState: () => adminFetch<{turn: number; players: unknown[]; cities: unknown[]; units: unknown[]}>('GET', '/admin/game/state'),
  sendCommand: (command: string) => adminFetch<{sent?: string; error?: string}>('POST', '/admin/game/command', { command }),
  getServScripts: () => adminFetch<ServScript[]>('GET', '/admin/serv-scripts'),
  getServScript: (name: string) => adminFetch<{name: string; content: string}>('GET', `/admin/serv-script/${encodeURIComponent(name)}`),
  putServScript: (name: string, content: string) => adminFetch<{ok: boolean; note?: string}>('PUT', `/admin/serv-script/${encodeURIComponent(name)}`, { content }),
  getTokens: () => adminFetch<Record<string, CssToken>>('GET', '/admin/ui/tokens'),

  connectSSE(onEvent: (type: string, data: unknown) => void): EventSource {
    const secret = localStorage.getItem('xb_admin_secret') ?? '';
    const url = `${ADMIN_BASE}/admin/events${secret ? `?token=${secret}` : ''}`;
    const es = new EventSource(url);
    es.onmessage = (e) => {
      try { onEvent('message', JSON.parse(e.data)); } catch {}
    };
    ['config_changed', 'game_state', 'agent_action', 'ruleset_changed'].forEach(type => {
      es.addEventListener(type, (e: Event) => {
        try { onEvent(type, JSON.parse((e as MessageEvent).data)); } catch {}
      });
    });
    return es;
  }
};
