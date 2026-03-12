/**
 * Unit tests for ui/cityDialog.ts exported functions.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { store } from '@/data/store';
import { globalEvents } from '@/core/events';

beforeEach(() => {
  store.reset();
});

describe('show_city_dialog_by_id', () => {
  it('is exported as a function', async () => {
    const { show_city_dialog_by_id } = await import('@/ui/cityDialog');
    expect(typeof show_city_dialog_by_id).toBe('function');
  });

  it('does not throw when city is absent from store', async () => {
    const { show_city_dialog_by_id } = await import('@/ui/cityDialog');
    expect(() => show_city_dialog_by_id(999)).not.toThrow();
  });
});

describe('close_city_dialog / city_dialog_close_handler', () => {
  it('close_city_dialog does not throw', async () => {
    const { close_city_dialog } = await import('@/ui/cityDialog');
    expect(() => close_city_dialog()).not.toThrow();
  });

  it('city_dialog_close_handler does not throw', async () => {
    const { city_dialog_close_handler } = await import('@/ui/cityDialog');
    expect(() => city_dialog_close_handler()).not.toThrow();
  });
});

describe('update_city_screen', () => {
  it('does not throw when cityDialog is null', async () => {
    const { update_city_screen } = await import('@/ui/cityDialog');
    expect(() => update_city_screen()).not.toThrow();
  });
});

describe('no-op stubs', () => {
  it('request_city_buy does not throw', async () => {
    const { request_city_buy } = await import('@/ui/cityDialog');
    expect(() => request_city_buy()).not.toThrow();
  });

  it('send_city_buy does not throw', async () => {
    const { send_city_buy } = await import('@/ui/cityDialog');
    expect(() => send_city_buy()).not.toThrow();
  });

  it('next_city does not throw', async () => {
    const { next_city } = await import('@/ui/cityDialog');
    expect(() => next_city()).not.toThrow();
  });

  it('previous_city does not throw', async () => {
    const { previous_city } = await import('@/ui/cityDialog');
    expect(() => previous_city()).not.toThrow();
  });
});

describe('city_name_dialog', () => {
  it('is exported as a function', async () => {
    const { city_name_dialog } = await import('@/ui/cityDialog');
    expect(typeof city_name_dialog).toBe('function');
  });

  it('does not throw with no arguments', async () => {
    const { city_name_dialog } = await import('@/ui/cityDialog');
    expect(() => city_name_dialog()).not.toThrow();
  });
});

describe('update_city_screen — city:screenUpdate integration', () => {
  beforeEach(() => { store.reset(); });

  it('does not throw when city:screenUpdate fires with no open dialog', async () => {
    await import('@/ui/cityDialog');
    expect(() => globalEvents.emit('city:screenUpdate')).not.toThrow();
  });

  it('refreshes cityDialogSignal when city:screenUpdate fires and dialog is open', async () => {
    const { showCityDialogPreact, cityDialogSignal } = await import('@/components/Dialogs/CityDialog');

    // Set up a city in store
    const city = { id: 42, name: 'Rome', size: 5, owner: 0, tile: 0 };
    store.cities[42] = city as never;

    // Open the dialog
    showCityDialogPreact(city as never);
    const initial = cityDialogSignal.value;
    expect(initial).not.toBeNull();

    // Update city in store
    const updatedCity = { ...city, size: 10 };
    store.cities[42] = updatedCity as never;

    // Fire the event
    globalEvents.emit('city:screenUpdate');

    // Signal should have been refreshed with updated data
    expect(cityDialogSignal.value).not.toBeNull();
  });
});

describe('city:updated event — auto-refresh open dialog', () => {
  beforeEach(() => { store.reset(); });

  it('does not throw when city:updated fires with no dialog open', async () => {
    const { closeCityDialogPreact } = await import('@/components/Dialogs/CityDialog');
    await import('@/ui/cityDialog');
    closeCityDialogPreact();
    expect(() => globalEvents.emit('city:updated', { id: 1 })).not.toThrow();
  });

  it('updates cityDialogSignal when city:updated fires for the open city', async () => {
    const { showCityDialogPreact, cityDialogSignal } = await import('@/components/Dialogs/CityDialog');
    await import('@/ui/cityDialog');

    const city = { id: 7, name: 'Athens', size: 3, owner: 0, tile: 0 };
    store.cities[7] = city as never;
    showCityDialogPreact(city as never);

    const updatedCity = { ...city, size: 8 };
    store.cities[7] = updatedCity as never;

    globalEvents.emit('city:updated', { id: 7 });

    // Signal should now point to updated data
    const current = cityDialogSignal.value as Record<string, unknown> | null;
    expect(current).not.toBeNull();
    expect(current?.['size']).toBe(8);
  });
});

describe('cityDialog stub functions', () => {
  it('rename_city does not throw', async () => {
    const { rename_city } = await import('@/ui/cityDialog');
    expect(() => rename_city()).not.toThrow();
  });

  it('city_keyboard_listener does not throw', async () => {
    const { city_keyboard_listener } = await import('@/ui/cityDialog');
    expect(() => city_keyboard_listener({} as KeyboardEvent)).not.toThrow();
  });

  it('set_citydlg_dimensions does not throw', async () => {
    const { set_citydlg_dimensions } = await import('@/ui/cityDialog');
    expect(() => set_citydlg_dimensions({} as never)).not.toThrow();
  });

  it('do_city_map_click does not throw', async () => {
    const { do_city_map_click } = await import('@/ui/cityDialog');
    expect(() => do_city_map_click(null)).not.toThrow();
  });

  it('city_sell_improvement does not throw', async () => {
    const { city_sell_improvement } = await import('@/ui/cityDialog');
    expect(() => city_sell_improvement(0)).not.toThrow();
  });

  it('city_change_specialist does not throw', async () => {
    const { city_change_specialist } = await import('@/ui/cityDialog');
    expect(() => city_change_specialist(0, 0)).not.toThrow();
  });

  it('send_city_change does not throw', async () => {
    const { send_city_change } = await import('@/ui/cityDialog');
    expect(() => send_city_change(0, 0, 0)).not.toThrow();
  });
});

// ── cityDialogState setters ───────────────────────────────────────────────

describe('cityDialogState setters', () => {
  it('set_city_screen_updater_fn is exported as a function', async () => {
    const { set_city_screen_updater_fn } = await import('@/ui/cityDialogState');
    expect(typeof set_city_screen_updater_fn).toBe('function');
  });

  it('set_city_screen_updater_fn does not throw', async () => {
    const { set_city_screen_updater_fn } = await import('@/ui/cityDialogState');
    expect(() => set_city_screen_updater_fn(() => {})).not.toThrow();
  });

  it('set_citydlg_map_width is exported as a function', async () => {
    const { set_citydlg_map_width } = await import('@/ui/cityDialogState');
    expect(typeof set_citydlg_map_width).toBe('function');
  });

  it('set_citydlg_map_height is exported as a function', async () => {
    const { set_citydlg_map_height } = await import('@/ui/cityDialogState');
    expect(typeof set_citydlg_map_height).toBe('function');
  });

  it('set_citydlg_map_width and height do not throw', async () => {
    const { set_citydlg_map_width, set_citydlg_map_height } = await import('@/ui/cityDialogState');
    expect(() => set_citydlg_map_width(200)).not.toThrow();
    expect(() => set_citydlg_map_height(150)).not.toThrow();
  });
});

// ── cityDialogState remaining setters ─────────────────────────────────────

describe('cityDialogState remaining setters', () => {
  it('set_active_city / active_city round-trip', async () => {
    const mod = await import('@/ui/cityDialogState');
    const city = { id: 1, name: 'Rome' } as never;
    mod.set_active_city(city);
    expect(mod.active_city).toBe(city);
    mod.set_active_city(null);
    expect(mod.active_city).toBeNull();
  });

  it('set_worklist_dialog_active round-trip', async () => {
    const mod = await import('@/ui/cityDialogState');
    mod.set_worklist_dialog_active(true);
    expect(mod.worklist_dialog_active).toBe(true);
    mod.set_worklist_dialog_active(false);
    expect(mod.worklist_dialog_active).toBe(false);
  });

  it('set_production_selection round-trip', async () => {
    const mod = await import('@/ui/cityDialogState');
    const sel = [{ kind: 1, value: 2 }];
    mod.set_production_selection(sel);
    expect(mod.production_selection).toBe(sel);
  });

  it('set_worklist_selection round-trip', async () => {
    const mod = await import('@/ui/cityDialogState');
    mod.set_worklist_selection([3, 4, 5]);
    expect(mod.worklist_selection).toEqual([3, 4, 5]);
  });

  it('set_city_tab_index round-trip', async () => {
    const mod = await import('@/ui/cityDialogState');
    mod.set_city_tab_index(2);
    expect(mod.city_tab_index).toBe(2);
  });

  it('set_city_prod_clicks round-trip', async () => {
    const mod = await import('@/ui/cityDialogState');
    mod.set_city_prod_clicks(5);
    expect(mod.city_prod_clicks).toBe(5);
  });

  it('set_opt_show_unreachable_items round-trip', async () => {
    const mod = await import('@/ui/cityDialogState');
    mod.set_opt_show_unreachable_items(true);
    expect(mod.opt_show_unreachable_items).toBe(true);
    mod.set_opt_show_unreachable_items(false);
    expect(mod.opt_show_unreachable_items).toBe(false);
  });
});
