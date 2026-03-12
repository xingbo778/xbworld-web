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

  it('sendCityWorklist is a function', async () => {
    const { sendCityWorklist } = await import('@/net/commands');
    expect(typeof sendCityWorklist).toBe('function');
  });

  it('sendCityMakeSpecialist is a function', async () => {
    const { sendCityMakeSpecialist } = await import('@/net/commands');
    expect(typeof sendCityMakeSpecialist).toBe('function');
  });

  it('sendCityMakeWorker is a function', async () => {
    const { sendCityMakeWorker } = await import('@/net/commands');
    expect(typeof sendCityMakeWorker).toBe('function');
  });

  it('sendCityChangeSpecialist is a function', async () => {
    const { sendCityChangeSpecialist } = await import('@/net/commands');
    expect(typeof sendCityChangeSpecialist).toBe('function');
  });

  it('sendCityNameSuggestionReq is a function', async () => {
    const { sendCityNameSuggestionReq } = await import('@/net/commands');
    expect(typeof sendCityNameSuggestionReq).toBe('function');
  });

  it('sendCityRefresh is a function', async () => {
    const { sendCityRefresh } = await import('@/net/commands');
    expect(typeof sendCityRefresh).toBe('function');
  });

  it('sendPlayerTechGoal is a function', async () => {
    const { sendPlayerTechGoal } = await import('@/net/commands');
    expect(typeof sendPlayerTechGoal).toBe('function');
  });

  it('sendReportReq is a function', async () => {
    const { sendReportReq } = await import('@/net/commands');
    expect(typeof sendReportReq).toBe('function');
  });

  it('sendUnitSscsSet is a function', async () => {
    const { sendUnitSscsSet } = await import('@/net/commands');
    expect(typeof sendUnitSscsSet).toBe('function');
  });

  it('sendUnitServerSideAgentSet is a function', async () => {
    const { sendUnitServerSideAgentSet } = await import('@/net/commands');
    expect(typeof sendUnitServerSideAgentSet).toBe('function');
  });

  it('sendUnitGetActions is a function', async () => {
    const { sendUnitGetActions } = await import('@/net/commands');
    expect(typeof sendUnitGetActions).toBe('function');
  });

  it('sendUnitChangeActivity is a function', async () => {
    const { sendUnitChangeActivity } = await import('@/net/commands');
    expect(typeof sendUnitChangeActivity).toBe('function');
  });

  it('sendDiplomacyCancelMeeting is a function', async () => {
    const { sendDiplomacyCancelMeeting } = await import('@/net/commands');
    expect(typeof sendDiplomacyCancelMeeting).toBe('function');
  });

  it('sendDiplomacyCreateClause is a function', async () => {
    const { sendDiplomacyCreateClause } = await import('@/net/commands');
    expect(typeof sendDiplomacyCreateClause).toBe('function');
  });

  it('sendDiplomacyRemoveClause is a function', async () => {
    const { sendDiplomacyRemoveClause } = await import('@/net/commands');
    expect(typeof sendDiplomacyRemoveClause).toBe('function');
  });

  it('sendDiplomacyAcceptTreaty is a function', async () => {
    const { sendDiplomacyAcceptTreaty } = await import('@/net/commands');
    expect(typeof sendDiplomacyAcceptTreaty).toBe('function');
  });

  it('sendDiplomacyCancelPact is a function', async () => {
    const { sendDiplomacyCancelPact } = await import('@/net/commands');
    expect(typeof sendDiplomacyCancelPact).toBe('function');
  });

  it('sendCmaSet is a function', async () => {
    const { sendCmaSet } = await import('@/net/commands');
    expect(typeof sendCmaSet).toBe('function');
  });

  it('sendCmaClear is a function', async () => {
    const { sendCmaClear } = await import('@/net/commands');
    expect(typeof sendCmaClear).toBe('function');
  });

  it('sendInfoTextReq is a function', async () => {
    const { sendInfoTextReq } = await import('@/net/commands');
    expect(typeof sendInfoTextReq).toBe('function');
  });
});
