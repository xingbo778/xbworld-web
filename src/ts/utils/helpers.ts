/**
 * XBWorld — General-purpose utility functions (migrated from utility.js)
 *
 * All functions here are pure (no side effects, no module-local state),
 * safe to exposeToLegacy.
 *
 * NOTE: get_random_int depends on window.fc_seedrandom (set by civclient.js).
 * NOTE: is_right_mouse_selection_supported depends on window.platform (external lib).
 * NOTE: is_touch_device is defined in control.js, not utility.js.
 */

const swal = (window as any).swal;
import { mapPosToTile as map_pos_to_tile } from '../data/map';
import { center_tile_mapcanvas } from '../core/control';

/** Deep clone a plain object (no circular refs). */
export function clone<T>(obj: T): T {
  if (obj == null || typeof obj !== 'object') return obj;
  return JSON.parse(JSON.stringify(obj));
}

/** Integer division that rounds toward negative infinity. */
export function DIVIDE(n: number, d: number): number {
  return Math.floor(n / d);
}

/** Wrap `value` into [0, range). */
export function FC_WRAP(value: number, range: number): number {
  if (value < 0) {
    const mod = value % range;
    return mod !== 0 ? mod + range : 0;
  }
  return value >= range ? value % range : value;
}

export function XOR(a: unknown, b: unknown): boolean {
  return (!!a || !!b) && !(!!a && !!b);
}

export function numberWithCommas(x: number | string): string {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export function toTitleCase(str: string): string {
  return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase());
}

/** Remove Freeciv translation qualifier prefix like "?qualifier:text". */
export function stringUnqualify(str: string): string {
  if (str.charAt(0) === '?' && str.includes(':')) {
    return str.slice(str.indexOf(':') + 1);
  }
  return str;
}

export function secondsToHumanTime(seconds: number): string {
  if (seconds <= 0) return '0s';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds - h * 3600) / 60);
  const s = seconds - h * 3600 - m * 60;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

/** Parse URL query parameters. */
export function getUrlVar(name: string): string | undefined {
  const params = new URLSearchParams(window.location.search);
  return params.get(name) ?? undefined;
}

export function isSmallScreen(): boolean {
  return window.innerWidth <= 600 || window.innerHeight <= 600;
}

export function isTouchDevice(): boolean {
  return ('ontouchstart' in window
    || 'onmsgesturechange' in window
    || ((globalThis as any).DocumentTouch != null && document instanceof (globalThis as any).DocumentTouch))
    ? true : false;
}

export function supportsMp3(): boolean {
  const a = document.createElement('audio');
  return !!(a.canPlayType && a.canPlayType('audio/mpeg;').replace(/no/, ''));
}

export function getTilesetFileExtension(): string {
  return '.png';
}

/**
 * Get a random integer in [min, max) using the seeded RNG.
 * Falls back to Math.random if fc_seedrandom is not available.
 */
export function getRandomInt(min: number, max: number): number {
  const rng = (globalThis as any).fc_seedrandom;
  const rand = typeof rng === 'function' ? rng() : Math.random();
  return Math.floor(rand * (max - min)) + min;
}

/**
 * Check if right-click-and-drag selection is supported.
 * Mac OS X and Chrome OS do not support it.
 */
export function isRightMouseSelectionSupported(): boolean {
  if (isTouchDevice()) return false;
  const ua = navigator.userAgent;
  if (ua.includes('Mac OS X') || ua.includes('CrOS')) {
    return false;
  }
  return true;
}

// ---------------------------------------------------------------------------
// Expose to legacy — function names must match Legacy snake_case names
// ---------------------------------------------------------------------------

// Expose is_small_screen (legacy name) and other utility functions
// $.getUrlVar/$.getUrlVars registration moved to index.html inline script
// for legacy JS compatibility. TS code uses URLSearchParams instead.

/**
 * Simple benchmark: scrolls the map 30 frames and reports average redraw time.
 */
let benchmark_start = 0;
export function civclient_benchmark(frame: number): void {
  if (frame === 0) benchmark_start = Date.now();
  const ptile = map_pos_to_tile(frame + 5, frame + 5);
  center_tile_mapcanvas(ptile);
  if (frame < 30) {
    setTimeout(() => civclient_benchmark(frame + 1), 10);
  } else {
    const time = (Date.now() - benchmark_start) / 25;
    swal('Redraw time: ' + time);
  }
}

// benchmark_start is read by pregame.js at runtime
Object.defineProperty(window, 'benchmark_start', {
  get: () => benchmark_start,
  set: (v: number) => { benchmark_start = v; },
  configurable: true,
  enumerable: true,
});

export function blur_input_on_touchdevice(): void {
  if ((document.activeElement as HTMLElement)?.blur) {
    (document.activeElement as HTMLElement).blur();
  }
}
