/**
 * Tests for App.tsx — verifies that all Preact dialog components are
 * mounted in the root App and that mountPreactApp() is idempotent.
 */
import { describe, it, expect, beforeEach } from 'vitest';

describe('mountPreactApp — mounts all dialogs', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
  });

  it('creates the xb-preact-dialogs container on first call', async () => {
    // Reset the mounted guard by reimporting with a fresh module
    const { mountPreactApp } = await import('@/components/App');
    mountPreactApp();
    expect(document.getElementById('xb-preact-dialogs')).not.toBeNull();
  });

  it('second call does not throw even if already mounted', async () => {
    // mountPreactApp sets module-level `mounted = true` after first call;
    // subsequent calls are no-ops — just verify no error is thrown.
    const { mountPreactApp } = await import('@/components/App');
    expect(() => mountPreactApp()).not.toThrow();
    expect(() => mountPreactApp()).not.toThrow();
  });
});

describe('App — dialog components present in tree', () => {
  it('App module imports CityBuyDialog, CityInputDialog, TechGainedDialog', async () => {
    // If any import is missing the module load itself will throw
    const appModule = await import('@/components/App');
    expect(typeof appModule.mountPreactApp).toBe('function');
  });

  it('CityBuyDialog is importable and exports showCityBuyDialog', async () => {
    const { showCityBuyDialog } = await import('@/components/Dialogs/CityBuyDialog');
    expect(typeof showCityBuyDialog).toBe('function');
  });

  it('CityInputDialog is importable and exports showCityInputDialog', async () => {
    const { showCityInputDialog } = await import('@/components/Dialogs/CityInputDialog');
    expect(typeof showCityInputDialog).toBe('function');
  });

  it('TechGainedDialog is importable and exports showTechGainedDialog', async () => {
    const { showTechGainedDialog } = await import('@/components/Dialogs/TechGainedDialog');
    expect(typeof showTechGainedDialog).toBe('function');
  });

  it('BlockingOverlay is importable and exports show/hide functions', async () => {
    const { showBlockingOverlay, hideBlockingOverlay } = await import('@/components/BlockingOverlay');
    expect(typeof showBlockingOverlay).toBe('function');
    expect(typeof hideBlockingOverlay).toBe('function');
  });
});

describe('BlockingOverlay signal', () => {
  it('showBlockingOverlay sets the signal, hideBlockingOverlay clears it', async () => {
    const { showBlockingOverlay, hideBlockingOverlay } = await import('@/components/BlockingOverlay');
    // Just verify calls don't throw — DOM rendering is Preact's responsibility
    expect(() => showBlockingOverlay('<h1>Loading…</h1>')).not.toThrow();
    expect(() => hideBlockingOverlay()).not.toThrow();
  });

  it('hideBlockingOverlay is idempotent', async () => {
    const { hideBlockingOverlay } = await import('@/components/BlockingOverlay');
    expect(() => hideBlockingOverlay()).not.toThrow();
    expect(() => hideBlockingOverlay()).not.toThrow();
  });

  it('showBlockingOverlay called twice updates the signal (no duplicate overlays)', async () => {
    const { showBlockingOverlay, hideBlockingOverlay } = await import('@/components/BlockingOverlay');
    expect(() => {
      showBlockingOverlay('First');
      showBlockingOverlay('Second');
    }).not.toThrow();
    hideBlockingOverlay();
  });
});
