/**
 * Unit tests for net/commands.ts — export checks only (send() requires a
 * live WebSocket which is not available in the test environment).
 */
import { describe, it, expect } from 'vitest';

describe('net/commands exports', () => {
  it('sendChatMessage is a function', async () => {
    const { sendChatMessage } = await import('@/net/commands');
    expect(typeof sendChatMessage).toBe('function');
  });

  it('sendCitySell is a function', async () => {
    const { sendCitySell } = await import('@/net/commands');
    expect(typeof sendCitySell).toBe('function');
  });

  it('sendCityBuy is a function', async () => {
    const { sendCityBuy } = await import('@/net/commands');
    expect(typeof sendCityBuy).toBe('function');
  });

  it('sendCityChange is a function', async () => {
    const { sendCityChange } = await import('@/net/commands');
    expect(typeof sendCityChange).toBe('function');
  });

  it('sendCityRename is a function', async () => {
    const { sendCityRename } = await import('@/net/commands');
    expect(typeof sendCityRename).toBe('function');
  });

  it('sendPlayerPhaseDone is a function', async () => {
    const { sendPlayerPhaseDone } = await import('@/net/commands');
    expect(typeof sendPlayerPhaseDone).toBe('function');
  });

  it('sendPlayerChangeGovernment is a function', async () => {
    const { sendPlayerChangeGovernment } = await import('@/net/commands');
    expect(typeof sendPlayerChangeGovernment).toBe('function');
  });

  it('sendPlayerResearch is a function', async () => {
    const { sendPlayerResearch } = await import('@/net/commands');
    expect(typeof sendPlayerResearch).toBe('function');
  });

  it('sendPlayerRates is a function', async () => {
    const { sendPlayerRates } = await import('@/net/commands');
    expect(typeof sendPlayerRates).toBe('function');
  });

  it('sendUnitOrders is a function', async () => {
    const { sendUnitOrders } = await import('@/net/commands');
    expect(typeof sendUnitOrders).toBe('function');
  });

  it('sendUnitDoAction is a function', async () => {
    const { sendUnitDoAction } = await import('@/net/commands');
    expect(typeof sendUnitDoAction).toBe('function');
  });

  it('sendDiplomacyInitMeeting is a function', async () => {
    const { sendDiplomacyInitMeeting } = await import('@/net/commands');
    expect(typeof sendDiplomacyInitMeeting).toBe('function');
  });

  it('sendGotoPathReq is a function', async () => {
    const { sendGotoPathReq } = await import('@/net/commands');
    expect(typeof sendGotoPathReq).toBe('function');
  });

  it('sendConnPong is a function', async () => {
    const { sendConnPong } = await import('@/net/commands');
    expect(typeof sendConnPong).toBe('function');
  });

  it('sendClientInfo is a function', async () => {
    const { sendClientInfo } = await import('@/net/commands');
    expect(typeof sendClientInfo).toBe('function');
  });
});
