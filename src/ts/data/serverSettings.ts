/**
 * Server settings — query helpers and side-effect applicator.
 *
 * `store.serverSettings` is keyed both by numeric id (as string) and by name,
 * so lookups by name always work after the const packet has been received.
 *
 * `applySettingEffect` is called by every type-specific handler whenever a
 * setting value is stored or updated.  It maps well-known setting names to
 * the client-side variables they control.
 */

import { store } from './store';
import { setDrawFogOfWar } from '../ui/options';
import type { ServerSetting } from './types';

// ---------------------------------------------------------------------------
// Query helpers
// ---------------------------------------------------------------------------

/** Look up a setting by name.  Returns undefined when not yet received. */
export function getServerSetting(name: string): ServerSetting | undefined {
  return store.serverSettings[name];
}

/** Return the current boolean value of a named server setting, or undefined. */
export function getServerSettingBool(name: string): boolean | undefined {
  const s = getServerSetting(name);
  return s != null ? Boolean(s['val']) : undefined;
}

/** Return the current integer value of a named server setting, or undefined. */
export function getServerSettingInt(name: string): number | undefined {
  const s = getServerSetting(name);
  return s != null ? Number(s['val']) : undefined;
}

/** Return the current string value of a named server setting, or undefined. */
export function getServerSettingStr(name: string): string | undefined {
  const s = getServerSetting(name);
  return s != null ? String(s['val']) : undefined;
}

// ---------------------------------------------------------------------------
// Key setting → client effect mapping
// ---------------------------------------------------------------------------

/**
 * Settings that directly affect client rendering or behavior.
 * Each entry maps a setting name to a side-effect function that receives
 * the new value and applies it to the relevant client variable.
 *
 * Extend this map as more server settings are integrated.
 */
const KEY_SETTING_EFFECTS: Readonly<Record<string, (val: unknown) => void>> = {
  /**
   * fogofwar (bool) — whether the fog of war is enabled on this server.
   * When false, all tiles are visible; the renderer skips fog overlay.
   * Triggers a full map re-render so existing fogged tiles are cleared.
   */
  'fogofwar': (val: unknown) => {
    setDrawFogOfWar(Boolean(val));
    // Re-render all tiles so fog overlays are added/removed immediately.
    const pr = (store as unknown as Record<string, unknown>)['pixiRenderer'] as
      { markAllDirty(): void } | undefined;
    pr?.markAllDirty();
  },
};

/**
 * Apply the client-side effect (if any) for the given setting.
 * Called by each type-specific handler after storing the updated value.
 */
export function applySettingEffect(setting: ServerSetting | null | undefined): void {
  if (setting == null) return;
  const name = setting['name'] as string | undefined;
  if (!name) return;
  const fn = KEY_SETTING_EFFECTS[name];
  if (fn != null) fn(setting['val']);
}

/**
 * Re-apply all key settings currently in the store.
 * Useful after a reconnect or ruleset reload to restore client state.
 */
export function reapplyAllKeySettings(): void {
  for (const name of Object.keys(KEY_SETTING_EFFECTS)) {
    const s = store.serverSettings[name];
    if (s != null) {
      KEY_SETTING_EFFECTS[name]!(s['val']);
    }
  }
}
