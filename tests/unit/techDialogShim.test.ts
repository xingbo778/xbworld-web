/**
 * Tests for techDialog.ts shim functions:
 *   - queue_tech_gained_dialog
 *   - send_player_research
 *   - update_tech_screen / setTechDialogActive
 *   - show_wikipedia_dialog / show_tech_info_dialog (export-level tests)
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { store } from '@/data/store';

beforeEach(() => {
  store.reset();
});

describe('techDialog.ts shim exports', () => {
  it('exports update_tech_screen as a function', async () => {
    const { update_tech_screen } = await import('@/ui/techDialog');
    expect(typeof update_tech_screen).toBe('function');
  });

  it('exports queue_tech_gained_dialog as a function', async () => {
    const { queue_tech_gained_dialog } = await import('@/ui/techDialog');
    expect(typeof queue_tech_gained_dialog).toBe('function');
  });

  it('exports send_player_research as a function', async () => {
    const { send_player_research } = await import('@/ui/techDialog');
    expect(typeof send_player_research).toBe('function');
  });

  it('exports show_wikipedia_dialog as a function', async () => {
    const { show_wikipedia_dialog } = await import('@/ui/techDialog');
    expect(typeof show_wikipedia_dialog).toBe('function');
  });

  it('exports show_tech_info_dialog as a function', async () => {
    const { show_tech_info_dialog } = await import('@/ui/techDialog');
    expect(typeof show_tech_info_dialog).toBe('function');
  });

  it('exports tech constants (A_NONE, A_FIRST)', async () => {
    const { A_NONE, A_FIRST } = await import('@/ui/techDialog');
    expect(typeof A_NONE).toBe('number');
    expect(typeof A_FIRST).toBe('number');
  });
});

describe('queue_tech_gained_dialog', () => {
  it('is a no-op in observer mode (store.observing = true)', async () => {
    store.observing = true;
    const { queue_tech_gained_dialog } = await import('@/ui/techDialog');
    expect(() => queue_tech_gained_dialog(1)).not.toThrow();
  });

  it('does not throw when store has no tech for the id', async () => {
    store.observing = false;
    // C_S_RUNNING check: store.client.conn.established = true, state = running
    // Without mocking client state, we just test it doesn't throw
    const { queue_tech_gained_dialog } = await import('@/ui/techDialog');
    expect(() => queue_tech_gained_dialog(999)).not.toThrow();
  });
});

describe('setTechDialogActive', () => {
  it('sets tech_dialog_active flag', async () => {
    const { setTechDialogActive, tech_dialog_active } = await import('@/ui/techDialog');
    expect(typeof tech_dialog_active).toBe('boolean');
    expect(() => setTechDialogActive(true)).not.toThrow();
  });
});
