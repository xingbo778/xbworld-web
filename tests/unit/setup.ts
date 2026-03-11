/**
 * Vitest setup file — runs before each test file.
 * Stubs browser APIs and prevents side-effects from module imports.
 */
import { vi } from 'vitest';

// Mark test environment so modules can skip side-effects
(globalThis as any).__VITEST__ = true;

// Stub fetch to prevent network requests during module loading
globalThis.fetch = vi.fn().mockResolvedValue(
  new Response(JSON.stringify({ result: 'error', port: null }), { status: 200 })
);

// Stub requestAnimationFrame (jsdom doesn't provide it)
if (!globalThis.requestAnimationFrame) {
  globalThis.requestAnimationFrame = (cb: FrameRequestCallback) => setTimeout(cb, 0) as unknown as number;
  globalThis.cancelAnimationFrame = (id: number) => clearTimeout(id);
}

// Stub scrollIntoView (jsdom doesn't implement it; prevents unhandled error in ChatBox/GameLog)
if (!Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = vi.fn();
}

// Stub localStorage if jsdom does not provide a working implementation.
// Some jsdom environments expose the object but with non-functional methods.
try {
  localStorage.getItem('__probe__');
} catch {
  Object.defineProperty(globalThis, 'localStorage', {
    value: {
      _store: {} as Record<string, string>,
      getItem(k: string) { return this._store[k] ?? null; },
      setItem(k: string, v: string) { this._store[k] = v; },
      removeItem(k: string) { delete this._store[k]; },
      clear() { this._store = {}; },
      get length() { return Object.keys(this._store).length; },
      key(i: number) { return Object.keys(this._store)[i] ?? null; },
    },
    writable: true,
    configurable: true,
  });
}
