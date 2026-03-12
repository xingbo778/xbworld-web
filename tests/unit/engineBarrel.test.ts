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

  it('re-exports all count signals (playerCount, cityCount, unitCount)', async () => {
    const { playerCount, cityCount, unitCount } = await import('@/engine');
    expect(typeof playerCount.value).toBe('number');
    expect(typeof cityCount.value).toBe('number');
    expect(typeof unitCount.value).toBe('number');
  });

  it('re-exports isObserver and connectedPlayer signals', async () => {
    const { isObserver, connectedPlayer } = await import('@/engine');
    expect(typeof isObserver.value).toBe('boolean');
    expect(connectedPlayer.value === null || typeof connectedPlayer.value === 'number').toBe(true);
  });

  it('re-exports counter signals (rulesetReady, playerUpdated, researchUpdated, settingsUpdated)', async () => {
    const { rulesetReady, playerUpdated, researchUpdated, settingsUpdated } = await import('@/engine');
    expect(typeof rulesetReady.value).toBe('number');
    expect(typeof playerUpdated.value).toBe('number');
    expect(typeof researchUpdated.value).toBe('number');
    expect(typeof settingsUpdated.value).toBe('number');
  });

  it('re-exports disconnectOverlay signal', async () => {
    const { disconnectOverlay } = await import('@/engine');
    expect(disconnectOverlay).toBeDefined();
    // null or an object with phase property
    expect(disconnectOverlay.value === null || typeof disconnectOverlay.value === 'object').toBe(true);
  });

  it('re-exports turnDoneState signal with correct shape', async () => {
    const { turnDoneState } = await import('@/engine');
    expect(turnDoneState).toBeDefined();
    expect(typeof turnDoneState.value.disabled).toBe('boolean');
    expect(typeof turnDoneState.value.text).toBe('string');
  });

  it('re-exports connectionBanner signal', async () => {
    const { connectionBanner } = await import('@/engine');
    expect(connectionBanner).toBeDefined();
    expect(connectionBanner.value === null || typeof connectionBanner.value === 'object').toBe(true);
  });

  it('re-exports map helpers (mapPosToTile, tileCity, tileTerrain)', async () => {
    const { mapPosToTile, tileCity, tileTerrain } = await import('@/engine');
    expect(typeof mapPosToTile).toBe('function');
    expect(typeof tileCity).toBe('function');
    expect(typeof tileTerrain).toBe('function');
  });

  it('re-exports client state constants', async () => {
    const { C_S_PREPARING, C_S_RUNNING, C_S_OVER } = await import('@/engine');
    expect(typeof C_S_PREPARING).toBe('number');
    expect(typeof C_S_RUNNING).toBe('number');
    expect(typeof C_S_OVER).toBe('number');
  });
});
