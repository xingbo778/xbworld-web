/**
 * Unit tests for core/pregame.ts and ui/dialogs.ts and ui/controls.ts
 */
import { describe, it, expect } from 'vitest';

// ── pregame ───────────────────────────────────────────────────────────────

describe('sanitize_username', () => {
  it('is exported as a function', async () => {
    const { sanitize_username } = await import('@/core/pregame');
    expect(typeof sanitize_username).toBe('function');
  });

  it('escapes HTML entities', async () => {
    const { sanitize_username } = await import('@/core/pregame');
    const result = sanitize_username('<script>alert("xss")</script>');
    expect(result).not.toContain('<');
    expect(result).not.toContain('>');
    expect(result).toContain('&lt;');
  });

  it('trims whitespace', async () => {
    const { sanitize_username } = await import('@/core/pregame');
    expect(sanitize_username('  Alice  ')).toBe('Alice');
  });

  it('passes clean usernames through', async () => {
    const { sanitize_username } = await import('@/core/pregame');
    expect(sanitize_username('Player1')).toBe('Player1');
  });

  it('escapes ampersands', async () => {
    const { sanitize_username } = await import('@/core/pregame');
    expect(sanitize_username('A&B')).toContain('&amp;');
  });
});

describe('ruledir_from_ruleset_name', () => {
  it('is exported as a function', async () => {
    const { ruledir_from_ruleset_name } = await import('@/core/pregame');
    expect(typeof ruledir_from_ruleset_name).toBe('function');
  });

  it('maps Classic ruleset to classic', async () => {
    const { ruledir_from_ruleset_name } = await import('@/core/pregame');
    expect(ruledir_from_ruleset_name('Classic ruleset', 'default')).toBe('classic');
  });

  it('maps Civ2Civ3 ruleset to civ2civ3', async () => {
    const { ruledir_from_ruleset_name } = await import('@/core/pregame');
    expect(ruledir_from_ruleset_name('Civ2Civ3 ruleset', 'default')).toBe('civ2civ3');
  });

  it('maps Multiplayer ruleset to multiplayer', async () => {
    const { ruledir_from_ruleset_name } = await import('@/core/pregame');
    expect(ruledir_from_ruleset_name('Multiplayer ruleset', 'default')).toBe('multiplayer');
  });

  it('falls back to fall_back_dir for unknown ruleset', async () => {
    const { ruledir_from_ruleset_name } = await import('@/core/pregame');
    expect(ruledir_from_ruleset_name('Unknown Ruleset', 'fallback')).toBe('fallback');
  });
});

// ── dialogs ───────────────────────────────────────────────────────────────

describe('ui/dialogs', () => {
  it('showAlert is exported as a function', async () => {
    const { showAlert } = await import('@/ui/dialogs');
    expect(typeof showAlert).toBe('function');
  });

  it('showMessage is exported as a function', async () => {
    const { showMessage } = await import('@/ui/dialogs');
    expect(typeof showMessage).toBe('function');
  });

  it('showMessage does not throw', async () => {
    const { showMessage } = await import('@/ui/dialogs');
    expect(() => showMessage('Test Title', 'Test message')).not.toThrow();
  });
});

// ── controls ──────────────────────────────────────────────────────────────

describe('ui/controls', () => {
  it('getFocusedUnitId returns null (stub)', async () => {
    const { getFocusedUnitId } = await import('@/ui/controls');
    expect(getFocusedUnitId()).toBeNull();
  });

  it('activateGoto does not throw (no-op stub)', async () => {
    const { activateGoto } = await import('@/ui/controls');
    expect(() => activateGoto()).not.toThrow();
  });
});

describe('initControls', () => {
  it('does not throw', async () => {
    const { initControls } = await import('@/ui/controls');
    expect(() => initControls()).not.toThrow();
  });
});

describe('update_player_info_pregame_real', () => {
  it('is exported as a function', async () => {
    const { update_player_info_pregame_real } = await import('@/core/pregame');
    expect(typeof update_player_info_pregame_real).toBe('function');
  });

  it('does not throw when called outside C_S_PREPARING state', async () => {
    const { update_player_info_pregame_real } = await import('@/core/pregame');
    // In test env clientState won't be C_S_PREPARING, so it early-returns safely
    expect(() => update_player_info_pregame_real()).not.toThrow();
  });
});
