/**
 * Unit tests for engine/index.ts barrel module.
 */
import { describe, it, expect } from 'vitest';

describe('engine barrel', () => {
  it('re-exports store', async () => {
    const { store } = await import('@/engine');
    expect(store).toBeDefined();
    expect(typeof store).toBe('object');
  });

  it('re-exports gameInfo signal', async () => {
    const { gameInfo } = await import('@/engine');
    expect(gameInfo).toBeDefined();
  });

  it('re-exports clientState as a function', async () => {
    const { clientState } = await import('@/engine');
    expect(typeof clientState).toBe('function');
  });

  it('re-exports C_S_INITIAL as 0', async () => {
    const { C_S_INITIAL } = await import('@/engine');
    expect(C_S_INITIAL).toBe(0);
  });

  it('re-exports mapstep as a function', async () => {
    const { mapstep } = await import('@/engine');
    expect(typeof mapstep).toBe('function');
  });

  it('re-exports tileGetKnown as a function', async () => {
    const { tileGetKnown } = await import('@/engine');
    expect(typeof tileGetKnown).toBe('function');
  });

  it('re-exports statusPanelLayout signal', async () => {
    const { statusPanelLayout } = await import('@/engine');
    expect(statusPanelLayout).toBeDefined();
    expect(['top', 'bottom']).toContain(statusPanelLayout.value);
  });
});
