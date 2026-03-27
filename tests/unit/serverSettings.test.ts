/**
 * Unit tests for server setting control handler and helper utilities.
 *
 * Covers:
 *  SC-1: handle_server_setting_control stores count + categories, pre-inits slots
 *  SC-2: handle_server_setting_const resolves categoryName
 *  SC-3: type-specific handlers set `type` field and call applySettingEffect
 *  SC-4: fogofwar bool → setDrawFogOfWar called + markAllDirty triggered
 *  SC-5: defensive guard — update before const logs warning, doesn't crash
 *  SC-6: query helpers (getServerSettingBool, Int, Str) return correct values
 *  SC-7: reapplyAllKeySettings re-triggers effects for known settings
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';

// ---------------------------------------------------------------------------
// Mocks — vi.hoisted() ensures references are safe before vi.mock factories run
// ---------------------------------------------------------------------------

const { optionsState, mockSetDrawFogOfWar, mockMarkAllDirty } = vi.hoisted(() => {
  const optionsState = { draw_fog_of_war: true };
  const mockSetDrawFogOfWar = vi.fn((val: boolean) => { optionsState.draw_fog_of_war = val; });
  const mockMarkAllDirty = vi.fn();
  return { optionsState, mockSetDrawFogOfWar, mockMarkAllDirty };
});

vi.mock('@/components/Dialogs/SwalDialog', () => ({ swal: vi.fn() }));
vi.mock('@/utils/dom', () => ({ blockUI: vi.fn(), unblockUI: vi.fn() }));

vi.mock('@/ui/options', () => ({
  get draw_fog_of_war() { return optionsState.draw_fog_of_war; },
  setDrawFogOfWar: mockSetDrawFogOfWar,
  auto_center_on_unit: true,
  popup_actor_arrival: true,
  draw_units: true,
  draw_focus_unit: false,
  init_options_dialog: vi.fn(),
  init_theme_selector: vi.fn(),
  loadSavedTheme: vi.fn(),
}));

vi.mock('@/renderer/rendererRegistry', () => ({
  getActiveRenderer: () => ({ markAllDirty: mockMarkAllDirty }),
}));

import { store } from '@/data/store';
import {
  handle_server_setting_control,
  handle_server_setting_const,
  handle_server_setting_bool,
  handle_server_setting_int,
  handle_server_setting_str,
  handle_server_setting_enum,
  handle_server_setting_bitwise,
} from '@/net/handlers/server';
import {
  getServerSetting,
  getServerSettingBool,
  getServerSettingInt,
  getServerSettingStr,
  reapplyAllKeySettings,
} from '@/data/serverSettings';

/* eslint-disable @typescript-eslint/no-explicit-any */

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function resetSettings(): void {
  store.serverSettings = {};
  store.serverSettingCategories = [];
  store.serverSettingCount = 0;
  optionsState.draw_fog_of_war = true;
  vi.clearAllMocks();
}

function sendControl(nSettings = 3, categories = ['General', 'Map', 'Players']): void {
  handle_server_setting_control({
    nSettings,
    nCategories: categories.length,
    categoryNames: categories,
  });
}

function sendConst(id: number, name: string, category = 0): void {
  handle_server_setting_const({ id, name, category });
}

// ---------------------------------------------------------------------------
// SC-1: handle_server_setting_control
// ---------------------------------------------------------------------------

describe('SC-1: handle_server_setting_control', () => {
  beforeEach(resetSettings);

  it('stores nSettings in store.serverSettingCount', () => {
    sendControl(7);
    expect(store.serverSettingCount).toBe(7);
  });

  it('stores categoryNames in store.serverSettingCategories', () => {
    sendControl(3, ['General', 'Map', 'Players']);
    expect(store.serverSettingCategories).toEqual(['General', 'Map', 'Players']);
  });

  it('pre-initialises placeholder slots for each setting id', () => {
    sendControl(3);
    expect(store.serverSettings['0']).toBeDefined();
    expect(store.serverSettings['1']).toBeDefined();
    expect(store.serverSettings['2']).toBeDefined();
    expect(store.serverSettings['3']).toBeUndefined(); // beyond count
  });

  it('placeholder slots have id, name="", val=null', () => {
    sendControl(2);
    expect(store.serverSettings['0']).toMatchObject({ id: 0, name: '', val: null });
    expect(store.serverSettings['1']).toMatchObject({ id: 1, name: '', val: null });
  });

  it('does not overwrite existing slots (const may arrive before update)', () => {
    sendControl(2);
    // Manually populate slot 0 (as if const arrived)
    store.serverSettings['0'] = { id: 0, name: 'fogofwar', category: 0, val: true };
    // Re-sending control must not wipe the populated slot
    sendControl(2);
    expect(store.serverSettings['0']?.['name']).toBe('fogofwar');
  });

  it('handles missing categoryNames gracefully (defaults to [])', () => {
    handle_server_setting_control({ nSettings: 2, nCategories: 0 } as any);
    expect(store.serverSettingCategories).toEqual([]);
    expect(store.serverSettingCount).toBe(2);
  });

  it('handles nSettings=0 without error', () => {
    expect(() => sendControl(0, [])).not.toThrow();
    expect(store.serverSettingCount).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// SC-2: handle_server_setting_const — categoryName resolution
// ---------------------------------------------------------------------------

describe('SC-2: handle_server_setting_const', () => {
  beforeEach(resetSettings);

  it('resolves categoryName when categories are available', () => {
    sendControl(3, ['General', 'Map', 'Players']);
    sendConst(0, 'fogofwar', 0);
    expect(store.serverSettings['0']?.['categoryName']).toBe('General');
    expect(store.serverSettings['fogofwar']?.['categoryName']).toBe('General');
  });

  it('resolves category index 1 → "Map"', () => {
    sendControl(3, ['General', 'Map', 'Players']);
    sendConst(1, 'xsize', 1);
    expect(store.serverSettings['xsize']?.['categoryName']).toBe('Map');
  });

  it('does not set categoryName when categories are empty', () => {
    sendConst(0, 'fogofwar', 0);
    expect(store.serverSettings['0']?.['categoryName']).toBeUndefined();
  });

  it('indexes the setting by both numeric id and name', () => {
    sendControl(3, ['General', 'Map', 'Players']);
    sendConst(2, 'aifill', 2);
    // Both keys must point to the same object
    expect(store.serverSettings['2']).toBe(store.serverSettings['aifill']);
  });
});

// ---------------------------------------------------------------------------
// SC-3: type-specific update handlers set `type` and call applySettingEffect
// ---------------------------------------------------------------------------

describe('SC-3: type-specific update handlers', () => {
  beforeEach(() => {
    resetSettings();
    sendControl(6, ['General', 'Map']);
    // Populate const entries for all test settings
    sendConst(0, 'fogofwar', 0);
    sendConst(1, 'xsize', 1);
    sendConst(2, 'generator', 1);
    sendConst(3, 'topology', 1);
    sendConst(4, 'desc', 0);
  });

  it('handle_server_setting_bool sets type="bool" and val', () => {
    handle_server_setting_bool({ id: 0, val: false });
    expect(store.serverSettings['0']?.['type']).toBe('bool');
    expect(store.serverSettings['0']?.['val']).toBe(false);
  });

  it('handle_server_setting_int sets type="int" and val', () => {
    handle_server_setting_int({ id: 1, val: 80, min: 3, max: 10000 });
    expect(store.serverSettings['1']?.['type']).toBe('int');
    expect(store.serverSettings['1']?.['val']).toBe(80);
    // Extra fields merged in too
    expect(store.serverSettings['1']?.['min']).toBe(3);
    expect(store.serverSettings['1']?.['max']).toBe(10000);
  });

  it('handle_server_setting_enum sets type="enum" and val', () => {
    handle_server_setting_enum({ id: 2, val: 3 });
    expect(store.serverSettings['2']?.['type']).toBe('enum');
    expect(store.serverSettings['2']?.['val']).toBe(3);
  });

  it('handle_server_setting_bitwise sets type="bitwise" and val', () => {
    handle_server_setting_bitwise({ id: 3, val: 0b1010 });
    expect(store.serverSettings['3']?.['type']).toBe('bitwise');
    expect(store.serverSettings['3']?.['val']).toBe(0b1010);
  });

  it('handle_server_setting_str sets type="str" and val', () => {
    handle_server_setting_str({ id: 4, val: 'civ2civ3' });
    expect(store.serverSettings['4']?.['type']).toBe('str');
    expect(store.serverSettings['4']?.['val']).toBe('civ2civ3');
  });
});

// ---------------------------------------------------------------------------
// SC-4: fogofwar bool → setDrawFogOfWar + markAllDirty
// ---------------------------------------------------------------------------

describe('SC-4: fogofwar setting drives render flag', () => {
  beforeEach(() => {
    resetSettings();
    sendControl(1, ['General']);
    sendConst(0, 'fogofwar', 0);
  });

  it('false → setDrawFogOfWar(false) called', () => {
    handle_server_setting_bool({ id: 0, val: false });
    expect(mockSetDrawFogOfWar).toHaveBeenCalledWith(false);
    expect(optionsState.draw_fog_of_war).toBe(false);
  });

  it('true → setDrawFogOfWar(true) called', () => {
    optionsState.draw_fog_of_war = false; // start with fog off
    handle_server_setting_bool({ id: 0, val: true });
    expect(mockSetDrawFogOfWar).toHaveBeenCalledWith(true);
    expect(optionsState.draw_fog_of_war).toBe(true);
  });

  it('fogofwar change triggers markAllDirty on PixiRenderer', () => {
    handle_server_setting_bool({ id: 0, val: false });
    expect(mockMarkAllDirty).toHaveBeenCalledTimes(1);
  });

  it('non-key setting (xsize) does NOT call setDrawFogOfWar', () => {
    sendConst(1, 'xsize', 0);
    handle_server_setting_int({ id: 1, val: 60 });
    expect(mockSetDrawFogOfWar).not.toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// SC-5: defensive guard — update before const
// ---------------------------------------------------------------------------

describe('SC-5: defensive guard — update before const', () => {
  beforeEach(resetSettings);

  it('update for unknown id logs warning and does not crash', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    expect(() => handle_server_setting_bool({ id: 99, val: false })).not.toThrow();
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('before const'),
      99,
    );
    warnSpy.mockRestore();
  });

  it('update for id not in control range (slot undefined) is safe', () => {
    sendControl(2); // only slots 0,1 pre-inited
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    expect(() => handle_server_setting_int({ id: 5, val: 100 })).not.toThrow();
    warnSpy.mockRestore();
  });
});

// ---------------------------------------------------------------------------
// SC-6: query helpers
// ---------------------------------------------------------------------------

describe('SC-6: query helpers', () => {
  beforeEach(() => {
    resetSettings();
    sendControl(4, ['General', 'Map']);
    sendConst(0, 'fogofwar', 0);
    sendConst(1, 'xsize', 1);
    sendConst(2, 'ruleset', 0);
    handle_server_setting_bool({ id: 0, val: true });
    handle_server_setting_int({ id: 1, val: 40 });
    handle_server_setting_str({ id: 2, val: 'civ2civ3' });
  });

  it('getServerSetting returns the setting object by name', () => {
    const s = getServerSetting('fogofwar');
    expect(s).toBeDefined();
    expect(s!['name']).toBe('fogofwar');
  });

  it('getServerSetting returns undefined for unknown name', () => {
    expect(getServerSetting('nonexistent')).toBeUndefined();
  });

  it('getServerSettingBool returns true for fogofwar=true', () => {
    expect(getServerSettingBool('fogofwar')).toBe(true);
  });

  it('getServerSettingBool returns false for fogofwar=false', () => {
    handle_server_setting_bool({ id: 0, val: false });
    expect(getServerSettingBool('fogofwar')).toBe(false);
  });

  it('getServerSettingBool returns undefined for unknown name', () => {
    expect(getServerSettingBool('unknown')).toBeUndefined();
  });

  it('getServerSettingInt returns 40 for xsize', () => {
    expect(getServerSettingInt('xsize')).toBe(40);
  });

  it('getServerSettingInt returns undefined for unknown name', () => {
    expect(getServerSettingInt('unknown')).toBeUndefined();
  });

  it('getServerSettingStr returns "civ2civ3" for ruleset', () => {
    expect(getServerSettingStr('ruleset')).toBe('civ2civ3');
  });

  it('getServerSettingStr returns undefined for unknown name', () => {
    expect(getServerSettingStr('unknown')).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// SC-7: reapplyAllKeySettings
// ---------------------------------------------------------------------------

describe('SC-7: reapplyAllKeySettings', () => {
  beforeEach(() => {
    resetSettings();
    sendControl(1, ['General']);
    sendConst(0, 'fogofwar', 0);
  });

  it('re-applies fogofwar=false after a reconnect', () => {
    handle_server_setting_bool({ id: 0, val: false });
    vi.clearAllMocks();
    optionsState.draw_fog_of_war = true; // simulate reset

    reapplyAllKeySettings();
    expect(mockSetDrawFogOfWar).toHaveBeenCalledWith(false);
  });

  it('does not crash when no fogofwar setting is stored', () => {
    store.serverSettings = {};
    expect(() => reapplyAllKeySettings()).not.toThrow();
  });
});
