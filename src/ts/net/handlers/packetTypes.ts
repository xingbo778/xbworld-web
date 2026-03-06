/**
 * TypeScript interfaces for all packet types used by ruleset and server handlers.
 *
 * Each interface captures the fields actually accessed in the handler code.
 * A catch-all `[key: string]: unknown` index signature allows for additional
 * server-sent fields that we do not yet consume.
 *
 * Where a packet is stored directly into a typed store slot (e.g. Terrain,
 * Nation), the packet interface extends the store type so assignment is safe.
 * Where the handler mutates the packet before storing (e.g. converting flags
 * to BitVector), a separate packet interface is used and the store assignment
 * uses a cast.
 */

import type {
  Terrain,
  Nation,
  Government,
  Tech,
  Improvement,
  Connection,
  MapInfo,
  Unit,
  GameInfo,
  CalendarInfo,
} from '../../data/types';
import type { ResearchData } from '../../data/player';
// ---------------------------------------------------------------------------
// Base packet -- used for stub/TODO handlers that ignore packet contents
// ---------------------------------------------------------------------------
export interface BasePacket {
  [key: string]: unknown;
}

// ---------------------------------------------------------------------------
// Ruleset packets
// ---------------------------------------------------------------------------

/**
 * Terrain packet. Extends the store Terrain type; handler may overwrite
 * `graphic_str` with `graphic_alt` for Lake terrain.
 */
export interface RulesetTerrainPacket extends Terrain {
  graphic_alt: string;
}

export interface RulesetResourcePacket {
  id: number;
  [key: string]: unknown;
}

export interface RulesetGamePacket {
  [key: string]: unknown;
}

export interface RulesetSpecialistPacket {
  id: number;
  [key: string]: unknown;
}

export interface RulesetNationGroupsPacket {
  groups: unknown[];
  [key: string]: unknown;
}

/** Extends the store Nation type so it can be assigned directly. */
export interface RulesetNationPacket extends Nation {}

export interface RulesetCityPacket {
  style_id: number;
  [key: string]: unknown;
}

/** Extends the store Government type so it can be assigned directly. */
export interface RulesetGovernmentPacket extends Government {}

export interface RulesetSummaryPacket {
  text: string;
  [key: string]: unknown;
}

export interface RulesetDescriptionPartPacket {
  text: string;
  [key: string]: unknown;
}

export interface RulesetActionPacket {
  id: number;
  enablers?: unknown[];
  [key: string]: unknown;
}

export interface RulesetGoodsPacket {
  id: number;
  [key: string]: unknown;
}

export interface RulesetClausePacket {
  type: number;
  [key: string]: unknown;
}

export interface RulesetEffectPacket {
  effect_type: number;
  [key: string]: unknown;
}

/**
 * Raw unit packet from the server. `flags` arrives as a raw number[] and
 * is converted to a BitVector by the handler before storing. Because of
 * this mutation the packet is cast to UnitType at the store assignment.
 */
export interface RulesetUnitPacket {
  id: number;
  name: string;
  flags: number[];
  [key: string]: unknown;
}

export interface WebRulesetUnitAdditionPacket {
  id: number;
  utype_actions?: number[];
  [key: string]: unknown;
}

/** Requirement inside a research_reqs array. */
export interface TechRequirement {
  kind: number;
  range: number;
  present: boolean;
  value: number;
  [key: string]: unknown;
}

/**
 * Raw tech packet. `research_reqs` is processed into a `req` array.
 * Extends the store Tech type so it can be assigned directly (the handler
 * adds `req` as an extra field).
 */
export interface RulesetTechPacket extends Tech {
  research_reqs?: TechRequirement[];
  req?: number[];
}

export interface RulesetTerrainControlPacket {
  move_fragments: number;
  [key: string]: unknown;
}

/** Extends the store Improvement type so it can be assigned directly. */
export interface RulesetBuildingPacket extends Improvement {}

/**
 * Raw unit-class packet. `flags` arrives as number[] and is converted to
 * BitVector by the handler.
 */
export interface RulesetUnitClassPacket {
  id: number;
  flags: number[];
  [key: string]: unknown;
}

export interface RulesetBasePacket {
  [key: string]: unknown;
}

export interface RulesetRoadPacket {
  [key: string]: unknown;
}

export interface RulesetActionEnablerPacket {
  enabled_action: number;
  action?: number;
  [key: string]: unknown;
}

/**
 * Raw extra packet. `causes` and `rmcauses` arrive as number[] and are
 * converted to BitVector by the handler. Because of this mutation the
 * packet is cast to Extra at the store assignment.
 */
export interface RulesetExtraPacket {
  id: number;
  name: string;
  rule_name: string;
  causes: number[];
  rmcauses: number[];
  buildable: boolean;
  [key: string]: unknown;
}

export interface RulesetControlPacket {
  num_extra_types: number;
  [key: string]: unknown;
}

// ---------------------------------------------------------------------------
// Server / connection packets
// ---------------------------------------------------------------------------

export interface ServerJoinReplyPacket {
  you_can_join: boolean;
  conn_id: number;
  message?: string;
  [key: string]: unknown;
}

/**
 * Connection info packet. `playing` is set by the handler (not sent as a
 * Player object), so it starts as unknown. The handler assigns it into
 * store.connections which expects Connection, so a cast is needed.
 */
export interface ConnInfoPacket {
  id: number;
  used: boolean;
  player_num: number;
  playing?: unknown;
  observer?: boolean;
  [key: string]: unknown;
}

export interface ConnPingPacket {
  [key: string]: unknown;
}

export interface AuthenticationReqPacket {
  [key: string]: unknown;
}

export interface ConnectMsgPacket {
  [key: string]: unknown;
}

export interface ServerInfoPacket {
  major_version: number;
  minor_version: number;
  patch_version: number;
  emerg_version: number;
  version_label: string;
  [key: string]: unknown;
}

export interface ConnPingInfoPacket {
  ping_time: number[];
  [key: string]: unknown;
}

export interface ServerSettingConstPacket {
  id: number;
  name: string;
  [key: string]: unknown;
}

export interface ServerSettingUpdatePacket {
  id: number;
  [key: string]: unknown;
}

// ---------------------------------------------------------------------------
// City packets
// ---------------------------------------------------------------------------

/**
 * Full city info — handler mutates name, improvements (number[] -> BitVector),
 * city_options (number[] -> BitVector), and adds unhappy.
 * Stored into store.cities as City via cast.
 */
export interface CityInfoPacket {
  id: number;
  tile: number;
  name: string;
  owner: number;
  improvements: unknown;
  city_options: unknown;
  [key: string]: unknown;
}

/**
 * City short info — handler mutates name and improvements
 * (number[] -> BitVector). Stored into store.cities as City via cast.
 */
export interface CityShortInfoPacket {
  id: number;
  tile: number;
  name: string;
  improvements: unknown;
  [key: string]: unknown;
}

export interface CityNationalitiesPacket {
  id: number;
  [key: string]: unknown;
}

export interface CityRallyPointPacket {
  id: number;
  [key: string]: unknown;
}

export interface WebCityInfoAdditionPacket {
  id: number;
  [key: string]: unknown;
}

export interface CityUpdateCountersPacket {
  id: number;
  counters: unknown;
  [key: string]: unknown;
}

export interface CityRemovePacket {
  city_id: number;
  [key: string]: unknown;
}

export interface CityNameSuggestionInfoPacket {
  name: string;
  unit_id: number;
  [key: string]: unknown;
}

export interface CitySabotageListPacket {
  request_kind: number;
  actor_id: number;
  city_id: number;
  improvements: number[];
  act_id: number;
  [key: string]: unknown;
}

// ---------------------------------------------------------------------------
// Map packets
// ---------------------------------------------------------------------------

export interface TileInfoPacket {
  tile: number;
  extras: unknown;
  [key: string]: unknown;
}

/** Extends MapInfo so it can be assigned directly to store.mapInfo. */
export interface MapInfoPacket extends MapInfo {}

export interface NukeTileInfoPacket {
  tile: number;
  [key: string]: unknown;
}

// ---------------------------------------------------------------------------
// Chat / message packets
// ---------------------------------------------------------------------------

export interface ChatMsgPacket {
  message: string;
  conn_id: number;
  event: number;
  tile: number;
  [key: string]: unknown;
}

export interface PageMsgPacket {
  headline: string;
  caption: string;
  event: number;
  parts: number;
  [key: string]: unknown;
}

export interface PageMsgPartPacket {
  lines: string;
  [key: string]: unknown;
}

// ---------------------------------------------------------------------------
// Freeze / thaw packets (all use BasePacket — no fields accessed)
// ---------------------------------------------------------------------------

// (handled via BasePacket)

// ---------------------------------------------------------------------------
// Unit packets
// ---------------------------------------------------------------------------

export interface UnitRemovePacket {
  unit_id: number;
  [key: string]: unknown;
}

/**
 * Unit info / short info packet. Extends Unit so it can be stored directly.
 * The handler adds `anim_list` and sets `facing` before storing.
 */
export interface UnitInfoPacket extends Unit {}

export interface UnitCombatInfoPacket {
  attacker_unit_id: number;
  defender_unit_id: number;
  attacker_hp: number;
  defender_hp: number;
  [key: string]: unknown;
}

export interface UnitActionAnswerPacket {
  actor_id: number;
  target_id: number;
  cost: number;
  action_type: number;
  request_kind: number;
  [key: string]: unknown;
}

export interface UnitActionsPacket {
  actor_unit_id: number;
  target_unit_id: number;
  target_city_id: number;
  target_tile_id: number;
  target_extra_id: number;
  action_probabilities: { min: number; max: number }[];
  request_kind: number;
  [key: string]: unknown;
}

// ---------------------------------------------------------------------------
// Player packets
// ---------------------------------------------------------------------------

export interface PlayerInfoPacket {
  playerno: number;
  name?: string;
  flags?: number[];
  gives_shared_vision?: number[];
  [key: string]: unknown;
}

export interface WebPlayerInfoAdditionPacket {
  playerno: number;
  nation: number;
  [key: string]: unknown;
}

export interface PlayerRemovePacket {
  playerno: number;
  [key: string]: unknown;
}

export interface PlayerDiplstatePacket {
  plr1: number;
  plr2: number;
  type: number;
  turns_left: number;
  contact_turns_left: number;
  [key: string]: unknown;
}

// ---------------------------------------------------------------------------
// Game state packets
// ---------------------------------------------------------------------------

/** Extends GameInfo so it can be assigned directly to store.gameInfo. */
export interface GameInfoPacket extends GameInfo {}

/** Extends CalendarInfo so it can be assigned directly to store.calendarInfo. */
export interface CalendarInfoPacket extends CalendarInfo {}

export interface NewYearPacket {
  year: number;
  fragments: number;
  turn: number;
  [key: string]: unknown;
}

export interface TimeoutInfoPacket {
  last_turn_change_time: number;
  seconds_to_phasedone: number;
  [key: string]: unknown;
}

export interface TradeRouteInfoPacket {
  city: number;
  index: number;
  [key: string]: unknown;
}

export interface EndgamePlayerPacket {
  [key: string]: unknown;
}

export interface UnknownResearchPacket {
  id: number;
  [key: string]: unknown;
}

export interface ScenarioInfoPacket {
  [key: string]: unknown;
}

export interface ScenarioDescriptionPacket {
  description: string;
  [key: string]: unknown;
}

/** Extends ResearchData so it can be stored directly into research_data. */
export interface ResearchInfoPacket extends ResearchData {
  id: number;
  inventions: number[];
  team: number;
}

// ---------------------------------------------------------------------------
// Diplomacy packets
// ---------------------------------------------------------------------------

export interface DiplomacyInitMeetingPacket {
  counterpart: number;
  [key: string]: unknown;
}

export interface DiplomacyCancelMeetingPacket {
  counterpart: number;
  [key: string]: unknown;
}

export interface DiplomacyCreateClausePacket {
  counterpart: number;
  giver: number;
  type: number;
  value: number;
  [key: string]: unknown;
}

export interface DiplomacyRemoveClausePacket {
  counterpart: number;
  giver: number;
  type: number;
  value: number;
  [key: string]: unknown;
}

export interface DiplomacyAcceptTreatyPacket {
  counterpart: number;
  I_accepted: boolean;
  other_accepted: boolean;
  [key: string]: unknown;
}

// ---------------------------------------------------------------------------
// Goto packet
// ---------------------------------------------------------------------------

export interface WebGotoPathPacket {
  unit_id: number;
  dest: number;
  dir: number[];
  turns: number;
  length: number;
  [key: string]: unknown;
}

// ---------------------------------------------------------------------------
// Unit orders (outgoing command packet)
// ---------------------------------------------------------------------------

export interface UnitOrdersPacket {
  unit_id: number;
  src_tile: number;
  length: number;
  repeat: boolean;
  vigilant: boolean;
  dest_tile: number;
  orders: Record<string, number>[];
  [key: string]: unknown;
}
