/**
 * Type declarations for external libraries and legacy JS interop.
 *
 * All game functions and data types now have proper TypeScript
 * implementations — use ES imports instead of referencing globals.
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

// ---------------------------------------------------------------------------
// jQuery (minimal typing for HTML onclick handlers still using $)
// ---------------------------------------------------------------------------
interface JQueryStatic {
  (selector: string | Element | Document): any;
  ajax(options: any): any;
  blockUI(options?: any): void;
  unblockUI(): void;
  getUrlVar(name: string): string | null;
  contextMenu?(options: any): void;
}
declare const $: JQueryStatic;
declare const jQuery: JQueryStatic;

// ---------------------------------------------------------------------------
// Third-party stubs
// ---------------------------------------------------------------------------
declare const audiojs: any;

// ---------------------------------------------------------------------------
// Legacy JS globals loaded via <script> tags
// ---------------------------------------------------------------------------

/** Tileset sprite atlas loaded by tileset_spec_*.js */
declare const tileset: Record<string, number[]> | undefined;

/** Sound-set mapping loaded by soundset JS */
declare const soundset: Record<string, string> | undefined;

/** TrackJS error-tracking library (optional) */
declare const trackJs: { console: { log(v: unknown): void }; track(msg: string): void } | undefined;

