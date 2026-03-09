/**
 * Unit query and mutation functions.
 * Migrated from unit.js.
 */

import { store } from './store';

import type { Unit, UnitType, City, Tile, Player } from './types';
import { player_by_number } from './player';
import { indexToTile as index_to_tile } from './map';
import { utype_can_do_action } from './unittype';
import { tileHasExtra as tile_has_extra } from './tile';
import { isExtraRemovedBy as is_extra_removed_by } from './extra';
import { EXTRA_NONE } from './extra';
import {
  O_FOOD, O_SHIELD, O_GOLD,
  ACTION_PILLAGE, ACTIVITY_PILLAGE,
  VUT_EXTRA, ERM_PILLAGE,
} from './fcTypes';
import { BitVector } from '../utils/bitvector';
// map_to_gui_pos and mapview are renderer globals resolved at runtime
declare function map_to_gui_pos(x: number, y: number): { gui_dx: number; gui_dy: number };
declare const mapview: { gui_x0: number; gui_y0: number; width: number; height: number };
import { RENDERER_2DCANVAS } from '../core/constants';
// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

export enum Order {
  MOVE = 0,
  ACTIVITY = 1,
  FULL_MP = 2,
  ACTION_MOVE = 3,
  PERFORM_ACTION = 4,
  LAST = 5,
}

export enum UnitSSDataType {
  QUEUE = 0,
  UNQUEUE = 1,
  BATTLE_GROUP = 2,
  SENTRY = 3,
}

export enum ServerSideAgent {
  NONE = 0,
  AUTOWORKER = 1,
  AUTOEXPLORE = 2,
  COUNT = 3,
}

export const ANIM_STEPS = 8;

/**
 * Depends on the ruleset. Comes in the packet ruleset_terrain_control.
 * Set externally in handle_ruleset_terrain_control().
 */
export let SINGLE_MOVE: number;

// ---------------------------------------------------------------------------
// Module state
// ---------------------------------------------------------------------------

const anim_units_max = 30;
let anim_units_count = 0;

// ---------------------------------------------------------------------------
// Animation tuple type
// ---------------------------------------------------------------------------

interface AnimTuple {
  tile: number;
  i: number;
}

// ---------------------------------------------------------------------------
// Lookup / ownership
// ---------------------------------------------------------------------------

export function idex_lookup_unit(id: number): Unit | undefined {
  return store.units[id];
}

export function unit_owner(punit: Unit): Player | null {
  return player_by_number(punit.owner);
}

// ---------------------------------------------------------------------------
// Add / remove
// ---------------------------------------------------------------------------

export function client_remove_unit(punit: Unit): void {
  // Use dynamic import to avoid circular dependency (data→core)
  import('../core/control/unitFocus').then(m => {
    m.control_unit_killed(punit);
  });

  // Check focus via store
  const focused = store.currentFocus || [];
  if (focused.some((u: Unit) => u.id === punit.id)) {
    store.currentFocus = [];
  }

  delete store.units[punit.id];
}

// ---------------------------------------------------------------------------
// Tile / city unit queries
// ---------------------------------------------------------------------------

export function tile_units(ptile: Tile | null): Unit[] | null {
  if (ptile == null) return null;
  return ptile['units'] as Unit[];
}

export function get_supported_units(pcity: City | null): Unit[] | null {
  if (pcity == null) return null;
  const result: Unit[] = [];
  for (const unit_id in store.units) {
    const punit = store.units[unit_id] as Unit;
    if (punit.homecity === pcity.id) {
      result.push(punit);
    }
  }
  return result;
}

// ---------------------------------------------------------------------------
// Tile unit index management
// ---------------------------------------------------------------------------

export function update_tile_unit(punit: Unit | null): void {
  if (punit == null) return;

  const ptile = index_to_tile(punit.tile);
  if (ptile == null || ptile['units'] == null) return;

  let found = false;
  for (let i = 0; i < ptile['units'].length; i++) {
    if (ptile['units'][i].id === punit.id) {
      found = true;
    }
  }

  if (!found) {
    ptile['units'].push(punit);
  }
}

export function clear_tile_unit(punit: Unit | null): void {
  if (punit == null) return;
  const ptile = index_to_tile(punit.tile);
  if (ptile == null || ptile['units'] == null) return;

  const idx = ptile['units'].indexOf(punit);
  if (idx >= 0) {
    ptile['units'].splice(idx, 1);
  }
}

// ---------------------------------------------------------------------------
// Unit list helpers
// ---------------------------------------------------------------------------

export function unit_list_size(unit_list: Unit[] | null): number {
  if (unit_list == null) return 0;
  return unit_list.length;
}

export function unit_list_without(unit_list: Unit[], punit: Unit): Unit[] {
  return unit_list.filter((funit) => funit.id !== punit.id);
}

// ---------------------------------------------------------------------------
// Unit type / capabilities
// ---------------------------------------------------------------------------

export function unit_type(punit: Unit): UnitType | undefined {
  return store.unitTypes[punit.type];
}

export function unit_can_do_action(punit: Unit, act_id: number): boolean {
  return utype_can_do_action(unit_type(punit), act_id);
}

// ---------------------------------------------------------------------------
// Movement display
// ---------------------------------------------------------------------------

export function get_unit_moves_left(punit: Unit | null): string | 0 {
  if (punit == null) {
    return 0;
  }

  return 'Moves:' + move_points_text(punit.movesleft);
}

export function move_points_text(moves: number): string {
  // Read SINGLE_MOVE from window because it is set by legacy packhand.js
  // (handle_ruleset_terrain_control), not by TS code.
  const sm: number = store.singleMove ?? 1;
  let result: string;

  if (moves % sm !== 0) {
    if (Math.floor(moves / sm) > 0) {
      result =
        Math.floor(moves / sm) + ' ' + Math.floor(moves % sm) + '/' + sm;
    } else {
      result = Math.floor(moves % sm) + '/' + sm;
    }
  } else {
    result = String(Math.floor(moves / sm));
  }

  return result;
}

// ---------------------------------------------------------------------------
// Goto
// ---------------------------------------------------------------------------

export function unit_has_goto(punit: Unit): boolean {
  if (store.client?.conn?.playing == null || punit.owner !== store.client.conn.playing.playerno) {
    return false;
  }

  return punit.goto_tile !== -1;
}

// ---------------------------------------------------------------------------
// Animation tracking
// ---------------------------------------------------------------------------

export function update_unit_anim_list(old_unit: Unit | null, new_unit: Unit | null): void {
  if (old_unit == null || new_unit == null) return;
  if (new_unit.tile === old_unit.tile) return;

  if (anim_units_count > anim_units_max) return;

  if (store.renderer === RENDERER_2DCANVAS && !is_unit_visible(new_unit)) return;

  if (old_unit['anim_list'] == null) old_unit['anim_list'] = [];

  if (new_unit['transported'] === true) {
    old_unit['anim_list'] = [];
    return;
  }

  anim_units_count += 1;
  const animList: AnimTuple[] = old_unit['anim_list'] as AnimTuple[];
  let has_old_pos = false;
  let has_new_pos = false;
  for (let i = 0; i < animList.length; i++) {
    const anim_tuple = animList[i];
    if (anim_tuple.tile === old_unit.tile) {
      has_old_pos = true;
    }
    if (anim_tuple.tile === new_unit.tile) {
      has_new_pos = true;
    }
  }

  if (!has_old_pos) {
    animList.push({ tile: old_unit.tile, i: ANIM_STEPS });
  }

  if (!has_new_pos) {
    animList.push({ tile: new_unit.tile, i: ANIM_STEPS });
  }
}

export function get_unit_anim_offset(punit: Unit): { x: number; y: number } {
  const offset = { x: 0, y: 0 };

  const animList: AnimTuple[] | null = punit['anim_list'] as AnimTuple[] | null;

  if (animList != null && animList.length >= 2) {
    const anim_tuple_src = animList[0];
    const anim_tuple_dst = animList[1];
    const src_tile = index_to_tile(anim_tuple_src.tile)!;
    const dst_tile = index_to_tile(anim_tuple_dst.tile)!;
    const u_tile = index_to_tile(punit.tile)!;

    anim_tuple_dst.i = anim_tuple_dst.i - 1;

    const i = Math.floor((anim_tuple_dst.i + 2) / 3);

    const r = map_to_gui_pos(src_tile['x'], src_tile['y']);
    const src_gx = r['gui_dx'];
    const src_gy = r['gui_dy'];

    const s = map_to_gui_pos(dst_tile['x'], dst_tile['y']);
    const dst_gx = s['gui_dx'];
    const dst_gy = s['gui_dy'];

    const t = map_to_gui_pos(u_tile['x'], u_tile['y']);
    const punit_gx = t['gui_dx'];
    const punit_gy = t['gui_dy'];

    const gui_dx = Math.floor((dst_gx - src_gx) * (i / ANIM_STEPS)) + (punit_gx - dst_gx);
    const gui_dy = Math.floor((dst_gy - src_gy) * (i / ANIM_STEPS)) + (punit_gy - dst_gy);

    if (i === 0) {
      animList.splice(0, 1);
      if (animList.length === 1) {
        animList.splice(0, 1);
      }
    }

    offset.x = -gui_dx;
    offset.y = -gui_dy;
  } else {
    anim_units_count -= 1;
  }

  return offset;
}

export function reset_unit_anim_list(): void {
  for (const unit_id in store.units) {
    const punit = store.units[unit_id];
    punit['anim_list'] = [];
  }
  anim_units_count = 0;
}

// ---------------------------------------------------------------------------
// Home city
// ---------------------------------------------------------------------------

export function get_unit_homecity_name(punit: Unit): string | null {
  if (punit.homecity !== 0 && store.cities[punit.homecity] != null) {
    return decodeURIComponent(store.cities[punit.homecity]['name']);
  }
  return null;
}

// ---------------------------------------------------------------------------
// Visibility
// ---------------------------------------------------------------------------

export function is_unit_visible(punit: Unit | null): boolean {
  if (punit == null || punit.tile == null) return false;

  const u_tile = index_to_tile(punit.tile)!;
  const r = map_to_gui_pos(u_tile['x'], u_tile['y']);
  const unit_gui_x: number = r['gui_dx'];
  const unit_gui_y: number = r['gui_dy'];

  if (
    unit_gui_x < mapview['gui_x0'] ||
    unit_gui_y < mapview['gui_y0'] ||
    unit_gui_x > mapview['gui_x0'] + mapview['width'] ||
    unit_gui_y > mapview['gui_y0'] + mapview['height']
  ) {
    return false;
  }

  return true;
}

// ---------------------------------------------------------------------------
// Unit type sorting
// ---------------------------------------------------------------------------

export function unittype_ids_alphabetic(): string[] {
  const unittype_names: string[] = [];
  for (const unit_id in store.unitTypes) {
    const punit_type = store.unitTypes[unit_id];
    unittype_names.push(punit_type['name']);
  }

  unittype_names.sort();

  const unittype_id_list: string[] = [];
  for (const unit_name of unittype_names) {
    for (const unit_id in store.unitTypes) {
      const punit_type = store.unitTypes[unit_id];
      if (unit_name === punit_type['name']) {
        unittype_id_list.push(unit_id);
      }
    }
  }
  return unittype_id_list;
}

// ---------------------------------------------------------------------------
// City dialog info
// ---------------------------------------------------------------------------

export function get_unit_city_info(punit: Unit): string {
  let result = '';

  const ptype = unit_type(punit);

  result += ptype!['name'] + '\nFood/Shield/Gold: ';

  const upkeep = punit['upkeep'] as number[] | undefined;
  if (upkeep != null) {
    result +=
      upkeep[O_FOOD] +
      '/' +
      upkeep[O_SHIELD] +
      '/' +
      upkeep[O_GOLD];
  }

  result += '\n' + get_unit_moves_left(punit) + '\n';

  const homecity = get_unit_homecity_name(punit);
  if (homecity != null) {
    result += homecity;
  }

  return result;
}

// ---------------------------------------------------------------------------
// Pillage
// ---------------------------------------------------------------------------

export function get_what_can_unit_pillage_from(punit: Unit | null, ptile: Tile | null): number[] {
  const targets: number[] = [];
  if (punit == null) return targets;

  if (ptile == null) {
    ptile = index_to_tile(punit.tile) ?? null;
  }
  if (ptile == null) return targets;

  if (store.terrains[ptile.terrain].pillage_time === 0) return targets;
  if (!utype_can_do_action(unit_type(punit), ACTION_PILLAGE)) return targets;

  const cannot_pillage = new BitVector([]);

  const ptile_units = tile_units(ptile) || [];
  for (let ui = 0; ui < ptile_units.length; ui++) {
    const u = ptile_units[ui];
    if (u.activity === ACTIVITY_PILLAGE) {
      cannot_pillage.set(u['activity_tgt'] as number);
    }
  }

  const numExtraTypes = (store.rulesControl?.['num_extra_types'] ?? 0) as number;
  for (let i = 0; i < numExtraTypes; i++) {
    if (tile_has_extra(ptile, i)) {
      const extra = store.extras[i];
      const reqs = extra['reqs'] as { kind: number; present: boolean; value: number }[];
      for (let j = 0; j < reqs.length; j++) {
        const req = reqs[j];
        if (req.kind === VUT_EXTRA && req.present === true) {
          cannot_pillage.set(req.value);
        }
      }
    } else {
      cannot_pillage.set(i);
    }
  }

  for (let i = 0; i < numExtraTypes; i++) {
    if (is_extra_removed_by(store.extras[i], ERM_PILLAGE) && !cannot_pillage.isSet(i)) {
      if (store.gameInfo!.pillage_select) {
        targets.push(i);
      } else {
        targets.push(EXTRA_NONE);
        break;
      }
    }
  }

  return targets;
}

// ---------------------------------------------------------------------------
// Expose to legacy JS via window
// ---------------------------------------------------------------------------

