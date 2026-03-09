/**
 * Tests for nationScreen.ts — observer-mode player selection logic.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { store } from '@/data/store';
import {
  selectNoNation,
  selectANation,
  nationSelectPlayer,
  nationTableSelectPlayer,
  updateNationScreen,
  centerOnPlayer,
} from '@/data/nationScreen';

function makeButton(id: string): HTMLButtonElement {
  const btn = document.createElement('button');
  btn.id = id;
  document.body.appendChild(btn);
  return btn;
}

describe('nationScreen — button management', () => {
  let viewBtn: HTMLButtonElement;
  let meetBtn: HTMLButtonElement;

  beforeEach(() => {
    store.reset();
    document.body.innerHTML = '';
    viewBtn = makeButton('view_player_button');
    meetBtn = makeButton('meet_player_button');
  });

  it('selectNoNation disables both buttons and resets selectedPlayer', () => {
    viewBtn.disabled = false;
    meetBtn.disabled = false;
    selectNoNation();
    expect(viewBtn.disabled).toBe(true);
    expect(meetBtn.disabled).toBe(true);
    expect(store.selectedPlayer).toBe(-1);
  });

  it('selectANation enables view button for alive player', () => {
    store.players[1] = { playerno: 1, is_alive: true } as never;
    store.selectedPlayer = 1;
    selectANation();
    expect(viewBtn.disabled).toBe(false);
    expect(meetBtn.disabled).toBe(true); // observer cannot meet
  });

  it('selectANation disables view button for dead player', () => {
    store.players[2] = { playerno: 2, is_alive: false } as never;
    store.selectedPlayer = 2;
    selectANation();
    expect(viewBtn.disabled).toBe(true);
  });

  it('selectANation is a no-op for unknown player id', () => {
    store.selectedPlayer = 999;
    // Should not throw
    expect(() => selectANation()).not.toThrow();
    // Buttons remain in whatever state they were
    expect(viewBtn.disabled).toBe(false); // initial DOM state
  });

  it('nationSelectPlayer sets selectedPlayer and enables view button for alive player', () => {
    store.players[3] = { playerno: 3, is_alive: true } as never;
    nationSelectPlayer(3);
    expect(store.selectedPlayer).toBe(3);
    expect(viewBtn.disabled).toBe(false);
  });
});

describe('nationScreen — updateNationScreen', () => {
  beforeEach(() => {
    store.reset();
    document.body.innerHTML = '';
  });

  it('sets nations_title text', () => {
    const titleEl = document.createElement('div');
    titleEl.id = 'nations_title';
    document.body.appendChild(titleEl);
    const viewBtn = makeButton('view_player_button');
    const meetBtn = makeButton('meet_player_button');
    void viewBtn; void meetBtn; // ensure they exist for selectNoNation

    updateNationScreen();
    expect(titleEl.textContent).toBe('Nations of the World');
  });

  it('calls selectNoNation (resets selectedPlayer to -1)', () => {
    makeButton('view_player_button');
    makeButton('meet_player_button');
    store.selectedPlayer = 5;
    updateNationScreen();
    expect(store.selectedPlayer).toBe(-1);
  });
});

describe('nationScreen — nationTableSelectPlayer', () => {
  beforeEach(() => {
    store.reset();
    document.body.innerHTML = '';
  });

  it('sets selectedPlayer and enables view button if player is alive', () => {
    const viewBtn = makeButton('view_player_button');
    const meetBtn = makeButton('meet_player_button');
    void meetBtn;
    store.players[7] = { playerno: 7, is_alive: true } as never;

    // players_tab link may not exist in jsdom — nationTableSelectPlayer should not throw
    nationTableSelectPlayer(7);
    expect(store.selectedPlayer).toBe(7);
    expect(viewBtn.disabled).toBe(false);
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
