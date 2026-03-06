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
}
declare const $: JQueryStatic;
declare const jQuery: JQueryStatic;

// ---------------------------------------------------------------------------
// Third-party stubs
// ---------------------------------------------------------------------------
declare const audiojs: any;
