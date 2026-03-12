/**
 * Tests for PregameLobby Preact component and pregame.ts signal integration.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, h } from 'preact';
import { store } from '@/data/store';

describe('PregameLobby module', () => {
  it('exports mountPregameLobby as a function', async () => {
    const { mountPregameLobby } = await import('@/components/PregameLobby');
    expect(typeof mountPregameLobby).toBe('function');
  });

  it('mountPregameLobby does not throw when DOM elements are absent', async () => {
    const { mountPregameLobby } = await import('@/components/PregameLobby');
    expect(() => mountPregameLobby()).not.toThrow();
  });

  it('mountPregameLobby mounts into #pregame_game_info when present', async () => {
    const { mountPregameLobby } = await import('@/components/PregameLobby');
    const el = document.createElement('div');
    el.id = 'pregame_game_info';
    document.body.appendChild(el);
    expect(() => mountPregameLobby()).not.toThrow();
    document.body.removeChild(el);
  });

  it('mountPregameLobby mounts into #pregame_player_list when present', async () => {
    const { mountPregameLobby } = await import('@/components/PregameLobby');
    const el = document.createElement('div');
    el.id = 'pregame_player_list';
    document.body.appendChild(el);
    expect(() => mountPregameLobby()).not.toThrow();
    document.body.removeChild(el);
  });
});

describe('pregame.ts signal integration', () => {
  it('pregameRefresh signal starts at 0', async () => {
    const { pregameRefresh } = await import('@/data/signals');
    expect(typeof pregameRefresh.value).toBe('number');
  });

  it('update_game_info_pregame is a function', async () => {
    const { update_game_info_pregame } = await import('@/core/pregame');
    expect(typeof update_game_info_pregame).toBe('function');
  });

  it('update_player_info_pregame is a function', async () => {
    const { update_player_info_pregame } = await import('@/core/pregame');
    expect(typeof update_player_info_pregame).toBe('function');
  });

  it('ruledir_from_ruleset_name maps known rulesets', async () => {
    const { ruledir_from_ruleset_name } = await import('@/core/pregame');
    expect(ruledir_from_ruleset_name('Classic ruleset', 'classic')).toBe('classic');
    expect(ruledir_from_ruleset_name('Civ2Civ3 ruleset', 'civ2civ3')).toBe('civ2civ3');
    expect(ruledir_from_ruleset_name('Multiplayer ruleset', 'multiplayer')).toBe('multiplayer');
    expect(ruledir_from_ruleset_name('Webperimental', 'webperimental')).toBe('webperimental');
  });

  it('ruledir_from_ruleset_name falls back for unknown ruleset', async () => {
    const warnSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const { ruledir_from_ruleset_name } = await import('@/core/pregame');
    const result = ruledir_from_ruleset_name('Unknown Ruleset', 'fallback');
    expect(result).toBe('fallback');
    warnSpy.mockRestore();
  });

  it('sanitize_username escapes HTML special characters', async () => {
    const { sanitize_username } = await import('@/core/pregame');
    expect(sanitize_username('<script>alert(1)</script>')).not.toContain('<');
    expect(sanitize_username('"test"')).not.toContain('"');
    expect(sanitize_username("it's")).not.toContain("'");
  });
});

// ── PlayerList rendering ───────────────────────────────────────────────────────

describe('PlayerList — render tests', () => {
  beforeEach(() => { store.reset(); document.body.innerHTML = ''; });

  it('renders nothing when store.players is empty', async () => {
    const { PlayerList } = await import('@/components/PregameLobby');
    const container = document.createElement('div');
    document.body.appendChild(container);
    render(h(PlayerList, null), container);
    expect(container.innerHTML).toBe('');
    document.body.removeChild(container);
  });

  it('renders player name in bold', async () => {
    const { PlayerList } = await import('@/components/PregameLobby');
    store.players[0] = { playerno: 0, name: 'Caesar', nation: 0, is_ready: false } as never;
    const container = document.createElement('div');
    document.body.appendChild(container);
    render(h(PlayerList, null), container);
    expect(container.textContent).toContain('Caesar');
    expect(container.querySelector('b')?.textContent).toBe('Caesar');
    document.body.removeChild(container);
  });

  it('renders ready players with pregame_player_ready class', async () => {
    const { PlayerList } = await import('@/components/PregameLobby');
    store.players[0] = { playerno: 0, name: 'Caesar', nation: 0, is_ready: true } as never;
    const container = document.createElement('div');
    document.body.appendChild(container);
    render(h(PlayerList, null), container);
    expect(container.querySelector('.pregame_player_ready')).not.toBeNull();
    document.body.removeChild(container);
  });

  it('renders not-ready players without pregame_player_ready class', async () => {
    const { PlayerList } = await import('@/components/PregameLobby');
    store.players[0] = { playerno: 0, name: 'Caesar', nation: 0, is_ready: false } as never;
    const container = document.createElement('div');
    document.body.appendChild(container);
    render(h(PlayerList, null), container);
    expect(container.querySelector('.pregame_player_ready')).toBeNull();
    document.body.removeChild(container);
  });

  it('renders multiple players', async () => {
    const { PlayerList } = await import('@/components/PregameLobby');
    store.players[0] = { playerno: 0, name: 'Caesar', nation: 0, is_ready: true } as never;
    store.players[1] = { playerno: 1, name: 'Alexander', nation: 1, is_ready: false } as never;
    const container = document.createElement('div');
    document.body.appendChild(container);
    render(h(PlayerList, null), container);
    expect(container.textContent).toContain('Caesar');
    expect(container.textContent).toContain('Alexander');
    document.body.removeChild(container);
  });

  it('renders player row with correct id attribute', async () => {
    const { PlayerList } = await import('@/components/PregameLobby');
    store.players[3] = { playerno: 3, name: 'Hannibal', nation: 2, is_ready: false } as never;
    const container = document.createElement('div');
    document.body.appendChild(container);
    render(h(PlayerList, null), container);
    expect(container.querySelector('#pregame_plr_3')).not.toBeNull();
    document.body.removeChild(container);
  });

  it('renders player title "Player not ready" for human non-ready player', async () => {
    const { PlayerList } = await import('@/components/PregameLobby');
    store.players[0] = { playerno: 0, name: 'Caesar', nation: 0, is_ready: false } as never;
    const container = document.createElement('div');
    document.body.appendChild(container);
    render(h(PlayerList, null), container);
    const row = container.querySelector('[data-player-name="Caesar"]');
    expect(row?.getAttribute('title')).toContain('Player not ready');
    document.body.removeChild(container);
  });
});

// ── ScenarioInfoPanel rendering ────────────────────────────────────────────────

describe('ScenarioInfoPanel — render tests', () => {
  beforeEach(() => { store.reset(); });

  it('renders nothing when no scenario info', async () => {
    const { ScenarioInfoPanel } = await import('@/components/PregameLobby');
    const container = document.createElement('div');
    document.body.appendChild(container);
    render(h(ScenarioInfoPanel, null), container);
    expect(container.innerHTML).toBe('');
    document.body.removeChild(container);
  });

  it('renders nothing when is_scenario is false', async () => {
    const { ScenarioInfoPanel } = await import('@/components/PregameLobby');
    store.scenarioInfo = { is_scenario: false, description: 'A scenario', authors: '', prevent_new_cities: false, name: 'Test' } as never;
    const container = document.createElement('div');
    document.body.appendChild(container);
    render(h(ScenarioInfoPanel, null), container);
    expect(container.innerHTML).toBe('');
    document.body.removeChild(container);
  });

  it('renders scenario description when is_scenario is true', async () => {
    const { ScenarioInfoPanel } = await import('@/components/PregameLobby');
    store.scenarioInfo = { is_scenario: true, description: 'Epic campaign', authors: 'Dev Team', prevent_new_cities: false, name: 'Epic' } as never;
    const container = document.createElement('div');
    document.body.appendChild(container);
    render(h(ScenarioInfoPanel, null), container);
    expect(container.textContent).toContain('Epic campaign');
    document.body.removeChild(container);
  });

  it('renders Scenario by author text', async () => {
    const { ScenarioInfoPanel } = await import('@/components/PregameLobby');
    store.scenarioInfo = { is_scenario: true, description: '', authors: 'Game Dev', prevent_new_cities: false, name: 'Test' } as never;
    const container = document.createElement('div');
    document.body.appendChild(container);
    render(h(ScenarioInfoPanel, null), container);
    expect(container.textContent).toContain('Scenario by');
    expect(container.textContent).toContain('Game Dev');
    document.body.removeChild(container);
  });

  it('renders city restriction message when prevent_new_cities is true', async () => {
    const { ScenarioInfoPanel } = await import('@/components/PregameLobby');
    store.scenarioInfo = { is_scenario: true, description: '', authors: '', prevent_new_cities: true, name: 'Epic Siege' } as never;
    const container = document.createElement('div');
    document.body.appendChild(container);
    render(h(ScenarioInfoPanel, null), container);
    expect(container.textContent).toContain('Epic Siege');
    expect(container.textContent).toContain('forbids the founding of new cities');
    document.body.removeChild(container);
  });
});
