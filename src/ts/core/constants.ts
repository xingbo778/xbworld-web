/**
 * Core game constants and enumerations.
 * Migrated from fc_types.js — all values match the Freeciv network protocol.
 */

// ─── Tri-state ───────────────────────────────────────────────────────────────
export const TRI_NO = 0;
export const TRI_YES = 1;
export const TRI_MAYBE = 2;

// ─── Limits ──────────────────────────────────────────────────────────────────
export const MAX_NUM_ITEMS = 200;
export const MAX_NUM_ADVANCES = 250;
export const MAX_NUM_UNITS = 250;
export const MAX_NUM_BUILDINGS = 200;
export const MAX_EXTRA_TYPES = 250;
export const MAX_LEN_NAME = 48;
export const MAX_LEN_CITYNAME = 50;
export const FC_INFINITY = 1_000_000_000;
export const IDENTITY_NUMBER_ZERO = 0;

// ─── Activity ────────────────────────────────────────────────────────────────
export const enum Activity {
  IDLE = 0,
  CULTIVATE = 1,
  MINE = 2,
  IRRIGATE = 3,
  FORTIFIED = 4,
  SENTRY = 5,
  PILLAGE = 6,
  GOTO = 7,
  EXPLORE = 8,
  TRANSFORM = 9,
  FORTIFYING = 10,
  CLEAN = 11,
  BASE = 12,
  GEN_ROAD = 13,
  CONVERT = 14,
  PLANT = 15,
  LAST = 16,
}

// ─── Action Result (ACTRES_) ─────────────────────────────────────────────────
export const enum ActionResult {
  ESTABLISH_EMBASSY = 0,
  SPY_INVESTIGATE_CITY = 1,
  SPY_POISON = 2,
  SPY_STEAL_GOLD = 3,
  SPY_SABOTAGE_CITY = 4,
  SPY_TARGETED_SABOTAGE_CITY = 5,
  SPY_SABOTAGE_CITY_PRODUCTION = 6,
  SPY_STEAL_TECH = 7,
  SPY_TARGETED_STEAL_TECH = 8,
  SPY_INCITE_CITY = 9,
  TRADE_ROUTE = 10,
  MARKETPLACE = 11,
  HELP_WONDER = 12,
  SPY_BRIBE_UNIT = 13,
  SPY_SABOTAGE_UNIT = 14,
  CAPTURE_UNITS = 15,
  FOUND_CITY = 16,
  JOIN_CITY = 17,
  STEAL_MAPS = 18,
  BOMBARD = 19,
  SPY_NUKE = 20,
  NUKE = 21,
  NUKE_UNITS = 22,
  DESTROY_CITY = 23,
  EXPEL_UNIT = 24,
  RECYCLE_UNIT = 25,
  DISBAND_UNIT = 26,
  HOME_CITY = 27,
  UPGRADE_UNIT = 28,
  PARADROP = 29,
  AIRLIFT = 30,
  ATTACK = 31,
  STRIKE_BUILDING = 32,
  STRIKE_PRODUCTION = 33,
  CONQUER_CITY = 34,
  HEAL_UNIT = 35,
  TRANSFORM_TERRAIN = 36,
  CULTIVATE = 37,
  PLANT = 38,
  PILLAGE = 39,
  FORTIFY = 40,
  ROAD = 41,
  CONVERT = 42,
  BASE = 43,
  MINE = 44,
  IRRIGATE = 45,
  TRANSPORT_DEBOARD = 48,
  TRANSPORT_UNLOAD = 49,
  TRANSPORT_DISEMBARK = 50,
  TRANSPORT_BOARD = 51,
  TRANSPORT_EMBARK = 52,
  SPY_SPREAD_PLAGUE = 53,
  SPY_ATTACK = 54,
  CONQUER_EXTRAS = 55,
  HUT_ENTER = 56,
  HUT_FRIGHTEN = 57,
  UNIT_MOVE = 58,
  PARADROP_CONQUER = 59,
  HOMELESS = 60,
  WIPE_UNITS = 61,
  SPY_ESCAPE = 62,
  TRANSPORT_LOAD = 63,
  CLEAN = 64,
  TELEPORT = 65,
  ENABLER_CHECK = 66,
  NONE = 67,
}

// ─── Action Sub-Result (ACT_SUB_RES_) ────────────────────────────────────────
export const enum ActionSubResult {
  HUT_ENTER = 0,
  HUT_FRIGHTEN = 1,
  MAY_EMBARK = 2,
  NON_LETHAL = 3,
  COUNT = 4,
}

// ─── Action Target Kind (ATK_) ───────────────────────────────────────────────
export const enum ActionTargetKind {
  CITY = 0,
  UNIT = 1,
  UNITS = 2,
  TILE = 3,
  EXTRAS = 4,
  SELF = 5,
  COUNT = 6,
}

// ─── Action Sub-Target Kind (ASTK_) ──────────────────────────────────────────
export const enum ActionSubTargetKind {
  NONE = 0,
  BUILDING = 1,
  TECH = 2,
  EXTRA = 3,
  EXTRA_NOT_THERE = 4,
  COUNT = 5,
}

// ─── Actions (ACTION_) ───────────────────────────────────────────────────────
export const enum Action {
  ESTABLISH_EMBASSY = 0,
  ESTABLISH_EMBASSY_STAY = 1,
  SPY_INVESTIGATE_CITY = 2,
  INV_CITY_SPEND = 3,
  SPY_POISON = 4,
  SPY_POISON_ESC = 5,
  SPY_STEAL_GOLD = 6,
  SPY_STEAL_GOLD_ESC = 7,
  SPY_SABOTAGE_CITY = 8,
  SPY_SABOTAGE_CITY_ESC = 9,
  SPY_TARGETED_SABOTAGE_CITY = 10,
  SPY_TARGETED_SABOTAGE_CITY_ESC = 11,
  SPY_SABOTAGE_CITY_PRODUCTION = 12,
  SPY_SABOTAGE_CITY_PRODUCTION_ESC = 13,
  SPY_STEAL_TECH = 14,
  SPY_STEAL_TECH_ESC = 15,
  SPY_TARGETED_STEAL_TECH = 16,
  SPY_TARGETED_STEAL_TECH_ESC = 17,
  SPY_INCITE_CITY = 18,
  SPY_INCITE_CITY_ESC = 19,
  TRADE_ROUTE = 20,
  MARKETPLACE = 21,
  HELP_WONDER = 22,
  SPY_BRIBE_UNIT = 23,
  SPY_BRIBE_STACK = 24,
  CAPTURE_UNITS = 25,
  SPY_SABOTAGE_UNIT = 26,
  SPY_SABOTAGE_UNIT_ESC = 27,
  FOUND_CITY = 28,
  JOIN_CITY = 29,
  STEAL_MAPS = 30,
  STEAL_MAPS_ESC = 31,
  SPY_NUKE = 32,
  SPY_NUKE_ESC = 33,
  NUKE = 34,
  NUKE_CITY = 35,
  NUKE_UNITS = 36,
  DESTROY_CITY = 37,
  EXPEL_UNIT = 38,
  DISBAND_UNIT_RECOVER = 39,
  DISBAND_UNIT = 40,
  HOME_CITY = 41,
  HOMELESS = 42,
  UPGRADE_UNIT = 43,
  CONVERT = 44,
  AIRLIFT = 45,
  ATTACK = 46,
  ATTACK2 = 47,
  SUICIDE_ATTACK = 48,
  SUICIDE_ATTACK2 = 49,
  STRIKE_BUILDING = 50,
  STRIKE_PRODUCTION = 51,
  CONQUER_CITY_SHRINK = 52,
  CONQUER_CITY_SHRINK2 = 53,
  CONQUER_CITY_SHRINK3 = 54,
  CONQUER_CITY_SHRINK4 = 55,
  BOMBARD = 56,
  BOMBARD2 = 57,
  BOMBARD3 = 58,
  BOMBARD4 = 59,
  BOMBARD_LETHAL = 60,
  BOMBARD_LETHAL2 = 61,
  ROAD = 62,
  ROAD2 = 63,
  IRRIGATE = 64,
  IRRIGATE2 = 65,
  MINE = 66,
  MINE2 = 67,
  BASE = 68,
  BASE2 = 69,
  PILLAGE = 70,
  PILLAGE2 = 71,
  TRANSPORT_BOARD = 72,
  TRANSPORT_BOARD2 = 73,
  TRANSPORT_BOARD3 = 74,
  TRANSPORT_DEBOARD = 75,
  TRANSPORT_EMBARK = 76,
  TRANSPORT_EMBARK2 = 77,
  TRANSPORT_EMBARK3 = 78,
  TRANSPORT_EMBARK4 = 79,
  TRANSPORT_DISEMBARK1 = 80,
  TRANSPORT_DISEMBARK2 = 81,
  TRANSPORT_DISEMBARK3 = 82,
  TRANSPORT_DISEMBARK4 = 83,
  TRANSPORT_LOAD = 84,
  TRANSPORT_LOAD2 = 85,
  TRANSPORT_LOAD3 = 86,
  TRANSPORT_UNLOAD = 87,
  SPY_SPREAD_PLAGUE = 88,
  SPY_ATTACK = 89,
  CONQUER_EXTRAS = 90,
  CONQUER_EXTRAS2 = 91,
  CONQUER_EXTRAS3 = 92,
  CONQUER_EXTRAS4 = 93,
  HUT_ENTER = 94,
  HUT_ENTER2 = 95,
  HUT_ENTER3 = 96,
  HUT_ENTER4 = 97,
  HUT_FRIGHTEN = 98,
  HUT_FRIGHTEN2 = 99,
  HUT_FRIGHTEN3 = 100,
  HUT_FRIGHTEN4 = 101,
  HEAL_UNIT = 102,
  HEAL_UNIT2 = 103,
  PARADROP = 104,
  PARADROP_CONQUER = 105,
  PARADROP_FRIGHTEN = 106,
  PARADROP_FRIGHTEN_CONQUER = 107,
  PARADROP_ENTER = 108,
  PARADROP_ENTER_CONQUER = 109,
  WIPE_UNITS = 110,
  SPY_ESCAPE = 111,
  UNIT_MOVE = 112,
  UNIT_MOVE2 = 113,
  UNIT_MOVE3 = 114,
  TELEPORT = 115,
  TELEPORT2 = 116,
  TELEPORT3 = 117,
  TELEPORT_CONQUER = 118,
  TELEPORT_FRIGHTEN = 119,
  TELEPORT_FRIGHTEN_CONQUER = 120,
  TELEPORT_ENTER = 121,
  TELEPORT_ENTER_CONQUER = 122,
  CLEAN = 123,
  CLEAN2 = 124,
  COLLECT_RANSOM = 125,
  FORTIFY = 126,
  FORTIFY2 = 127,
  CULTIVATE = 128,
  CULTIVATE2 = 129,
  PLANT = 130,
  PLANT2 = 131,
  TRANSFORM_TERRAIN = 132,
  TRANSFORM_TERRAIN2 = 133,
  GAIN_VETERANCY = 134,
  ESCAPE = 135,
  CIVIL_WAR = 136,
  FINISH_UNIT = 137,
  FINISH_BUILDING = 138,
  USER_ACTION1 = 139,
  USER_ACTION2 = 140,
  USER_ACTION3 = 141,
  USER_ACTION4 = 142,
  COUNT = 143,
}

export const ACTION_COUNT = 143;

// ─── Action Decision (ACT_DEC_) ──────────────────────────────────────────────
export const enum ActionDecision {
  NOTHING = 0,
  PASSIVE = 1,
  ACTIVE = 2,
}

// ─── Universals Kind (VUT_) ──────────────────────────────────────────────────
export const enum UniversalKind {
  NONE = 0,
  ACHIEVEMENT = 1,
  ACTION = 2,
  ACTIVITY = 3,
  ADVANCE = 4,
  AGE = 5,
  AI_LEVEL = 6,
  CITYSTATUS = 7,
  CITYTILE = 8,
  COUNTER = 9,
  DIPLREL = 10,
  DIPLREL_TILE = 11,
  DIPLREL_TILE_O = 12,
  DIPLREL_UNITANY = 13,
  DIPLREL_UNITANY_O = 14,
  EXTRA = 15,
  EXTRAFLAG = 16,
  FORM_AGE = 17,
  GOOD = 18,
  GOVERNMENT = 19,
  IMPROVEMENT = 20,
  IMPR_FLAG = 21,
  IMPR_GENUS = 22,
  MAXLATITUDE = 23,
  MAXTILEUNITS = 24,
  MAX_DISTANCE_SQ = 25,
  MAX_REGION_TILES = 26,
  MINCALFRAG = 27,
  MINCITIES = 28,
  MINCULTURE = 29,
  MINFOREIGNPCT = 30,
  MINHP = 31,
  MINLATITUDE = 32,
  MINMOVES = 33,
  MINSIZE = 34,
  MINTECHS = 35,
  MINVETERAN = 36,
  MINYEAR = 37,
  NATION = 38,
  NATIONALITY = 39,
  NATIONGROUP = 40,
  ORIGINAL_OWNER = 41,
  OTYPE = 42,
  PLAYER_FLAG = 43,
  PLAYER_STATE = 44,
  ROADFLAG = 45,
  SERVERSETTING = 46,
  SITE = 47,
  SPECIALIST = 48,
  STYLE = 49,
  TECHFLAG = 50,
  TERRAIN = 51,
  TERRAINALTER = 52,
  TERRAINCLASS = 53,
  TERRFLAG = 54,
  TILE_REL = 55,
  TOPO = 56,
  UCFLAG = 57,
  UCLASS = 58,
  UNITSTATE = 59,
  UTFLAG = 60,
  UTYPE = 61,
  WRAP = 62,
  COUNT = 63,
}

// ─── Output Type (O_) ────────────────────────────────────────────────────────
export const enum OutputType {
  FOOD = 0,
  SHIELD = 1,
  TRADE = 2,
  GOLD = 3,
  LUXURY = 4,
  SCIENCE = 5,
}

// ─── Vision Layer (V_) ───────────────────────────────────────────────────────
export const enum VisionLayer {
  MAIN = 0,
  INVIS = 1,
  SUBSURFACE = 2,
  COUNT = 3,
}

// ─── Extra Cause (EC_) ───────────────────────────────────────────────────────
export const enum ExtraCause {
  IRRIGATION = 0,
  MINE = 1,
  ROAD = 2,
  BASE = 3,
  POLLUTION = 4,
  FALLOUT = 5,
  HUT = 6,
  APPEARANCE = 7,
  RESOURCE = 8,
}

// ─── Extra Removal Cause (ERM_) ──────────────────────────────────────────────
export const enum ExtraRemovalCause {
  PILLAGE = 0,
  CLEAN = 1,
  DISAPPEARANCE = 2,
  ENTER = 3,
}

// ─── Barbarian Type ──────────────────────────────────────────────────────────
export const enum BarbarianType {
  NOT_A_BARBARIAN = 0,
  LAND = 1,
  SEA = 2,
  ANIMAL = 3,
  LAND_AND_SEA = 4,
}

// ─── Capital Type ────────────────────────────────────────────────────────────
export const enum CapitalType {
  NOT = 0,
  SECONDARY = 1,
  PRIMARY = 2,
}

// ─── GUI Type ────────────────────────────────────────────────────────────────
export const enum GuiType {
  STUB = 0,
  GTK2 = 1,
  GTK3 = 2,
  GTK3_22 = 3,
  QT = 4,
  SDL = 5,
  SDL2 = 6,
  SDL3 = 7,
  WEB = 8,
  GTK4 = 9,
  GTK5 = 10,
}

// ─── Requirement Problem Type (RPT_) ─────────────────────────────────────────
export const enum ReqProblemType {
  POSSIBLE = 0,
  CERTAIN = 1,
}

// ─── Client State (C_S_) ─────────────────────────────────────────────────────
export const enum ClientState {
  INITIAL = 0,
  PREPARING = 1,
  RUNNING = 2,
  OVER = 3,
}

// ─── Renderer Type ───────────────────────────────────────────────────────────
export const RENDERER_2DCANVAS = 1;
export const RENDERER_PIXI = 2;

// ─── Directions (8-way) ─────────────────────────────────────────────────────
export const DIR8_NORTHWEST = 0;
export const DIR8_NORTH = 1;
export const DIR8_NORTHEAST = 2;
export const DIR8_WEST = 3;
export const DIR8_EAST = 4;
export const DIR8_SOUTHWEST = 5;
export const DIR8_SOUTH = 6;
export const DIR8_SOUTHEAST = 7;
