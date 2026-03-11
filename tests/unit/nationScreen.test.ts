/**
 * Tests for nationScreen.ts — observer-mode player selection logic.
 *
 * Button management (view_player_button, meet_player_button) has been removed
 * from this module — it is now handled by NationOverview's ActionBar (Preact).
 * These tests cover the remaining pure-state logic.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { store } from '@/data/store';
import {
  selectNoNation,
  nationSelectPlayer,
  nationTableSelectPlayer,
  centerOnPlayer,
} from '@/data/nationScreen';

describe('nationScreen — selectNoNation', () => {
  beforeEach(() => {
    store.reset();
    document.body.innerHTML = '';
  });

  it('resets selectedPlayer to -1', () => {
    store.selectedPlayer = 5;
    selectNoNation();
    expect(store.selectedPlayer).toBe(-1);
  });

  it('is a no-op when selectedPlayer is already -1', () => {
    store.selectedPlayer = -1;
    expect(() => selectNoNation()).not.toThrow();
    expect(store.selectedPlayer).toBe(-1);
  });
});

describe('nationScreen — nationSelectPlayer', () => {
  beforeEach(() => {
    store.reset();
    document.body.innerHTML = '';
  });

  it('sets selectedPlayer to the given player number', () => {
    store.players[3] = { playerno: 3, is_alive: true } as never;
    nationSelectPlayer(3);
    expect(store.selectedPlayer).toBe(3);
  });

  it('sets selectedPlayer even for unknown player id (graceful)', () => {
    nationSelectPlayer(999);
    expect(store.selectedPlayer).toBe(999);
  });
});

describe('nationScreen — nationTableSelectPlayer', () => {
  beforeEach(() => {
    store.reset();
    document.body.innerHTML = '';
  });

  it('sets selectedPlayer and does not throw even without players_tab link', () => {
    store.players[7] = { playerno: 7, is_alive: true } as never;
    nationTableSelectPlayer(7);
    expect(store.selectedPlayer).toBe(7);
  });
});

describe('nationScreen — centerOnPlayer', () => {
  beforeEach(() => {
    store.reset();
  });

  it('returns early when no player selected', () => {
    store.selectedPlayer = -1;
    expect(() => centerOnPlayer()).not.toThrow();
  });

  it('returns early when selected player has no cities', () => {
    store.players[1] = { playerno: 1, is_alive: true } as never;
    store.selectedPlayer = 1;
    expect(() => centerOnPlayer()).not.toThrow();
  });
});
