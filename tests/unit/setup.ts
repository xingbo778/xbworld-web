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
