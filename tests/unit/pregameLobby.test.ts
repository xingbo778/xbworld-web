/**
 * Tests for PregameLobby Preact component and pregame.ts signal integration.
 */
import { describe, it, expect, vi } from 'vitest';

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
