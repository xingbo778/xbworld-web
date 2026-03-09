/**
 * Unit command functions — observer mode.
 *
 * key_unit_* keyboard shortcuts are no-ops (observer cannot issue orders).
 * Only request_unit_do_action / request_unit_act_sel_vs / request_new_unit_activity
 * have real implementations — they are called by mapClick.ts, unitFocus.ts,
 * and net/handlers/unit.ts for action-decision handling.
 */

import { sendUnitSscsSet, sendUnitOrders, sendUnitChangeActivity, sendUnitDoAction } from '../../net/commands';
import { action_decision_clear_want } from './actionSelection';
import type { Unit, Tile } from '../../data/types';
import { UnitSSDataType } from '../../data/unit';

// ---------------------------------------------------------------------------
// Real implementations — called by external modules
// ---------------------------------------------------------------------------

export function request_unit_do_action(
  action_id: number, actor_id: number, target_id: number,
  sub_tgt_id: number = 0, name: string = ""
): void {
  sendUnitDoAction(action_id, actor_id, target_id, sub_tgt_id || 0, name || "");
  action_decision_clear_want(actor_id);
}

export function request_unit_act_sel_vs(ptile: Tile): void {
  // In observer mode current_focus is empty; this is a safe no-op in practice
  // but kept for the action-decision pipeline in net/handlers/unit.ts
  void ptile;
}

export function request_new_unit_activity(punit: Unit, activity: number, target: number): void {
  // Cancel any existing orders first (send empty orders packet)
  if (punit != null && (punit.ssa_controller !== 0 || punit.has_orders)) {
    punit.ssa_controller = 0;
    punit.has_orders = false;
    sendUnitOrders({
      unit_id: punit.id, src_tile: punit.tile, length: 0,
      repeat: false, vigilant: false, dest_tile: punit.tile, orders: [],
    });
  }
  action_decision_clear_want(punit['id']);
  sendUnitChangeActivity(punit['id'], activity, target);
}

// ---------------------------------------------------------------------------
// key_unit_* — all no-ops in observer mode (keyboard shortcuts disabled)
// ---------------------------------------------------------------------------

export function key_unit_auto_explore(): void {}
export function key_unit_load(): void {}
export function key_unit_unload(): void {}
export function key_unit_show_cargo(): void {}
export function key_unit_wait(): void {}
export function key_unit_noorders(): void {}
export function key_unit_idle(): void {}
export function key_unit_sentry(): void {}
export function key_unit_fortify(): void {}
export function key_unit_fortress(): void {}
export function key_unit_airbase(): void {}
export function key_unit_irrigate(): void {}
export function key_unit_cultivate(): void {}
export function key_unit_clean(): void {}
export function key_unit_nuke(): void {}
export function key_unit_upgrade(): void {}
export function key_unit_paradrop(): void {}
export function key_unit_airlift(): void {}
export function key_unit_transform(): void {}
export function key_unit_pillage(): void {}
export function key_unit_mine(): void {}
export function key_unit_plant(): void {}
export function key_unit_road(): void {}
export function key_unit_homecity(): void {}
export function key_unit_action_select(): void {}
export function key_unit_auto_work(): void {}
export function key_unit_build_city(): void {}
export function key_unit_disband(): void {}
export function key_unit_move(_dir: number): void {}

// Also needed by mapClick.ts (calls this when action-target-select mode active)
export function request_unit_act_sel_vs_own_tile(): void {}
