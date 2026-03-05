/**
 * Event type constants — must match freeciv/common/events.h.
 *
 * These were previously defined inside webclient.min.js (Closure Compiler output).
 * Phase 4 split webclient.min.js into individual source files, but these constants
 * were not extracted. Legacy JS files (e.g., client_main.js, messages.js) reference
 * them as globals.
 *
 * We expose ALL event constants (not just the 12 currently referenced) to avoid
 * future breakage as more legacy code is exercised.
 */

// --- Event section categories ---
export const E_S_ADVANCE = 0;
export const E_S_BUILD = 1;
export const E_S_CITY = 2;
export const E_S_D_ME = 3;
export const E_S_D_THEM = 4;
export const E_S_GLOBAL = 5;
export const E_S_HUT = 6;
export const E_S_NATION = 7;
export const E_S_TREATY = 8;
export const E_S_UNIT = 9;
export const E_S_VOTE = 10;
export const E_S_WONDER = 11;
export const E_S_XYZZY = 12;
export const E_S_CHAT = 13;

// --- Event section names and descriptions ---

// --- Event type IDs (from freeciv/common/events.h) ---

export const E_CITY_CANTBUILD = 0;
export const E_CITY_LOST = 1;
export const E_CITY_LOVE = 2;
export const E_CITY_DISORDER = 3;
export const E_CITY_FAMINE = 4;
export const E_CITY_FAMINE_FEARED = 5;
export const E_CITY_GROWTH = 6;
export const E_CITY_MAY_SOON_GROW = 7;
export const E_CITY_AQUEDUCT = 8;
export const E_CITY_AQ_BUILDING = 9;
export const E_CITY_NORMAL = 10;
export const E_CITY_NUKED = 11;
export const E_CITY_CMA_RELEASE = 12;
export const E_CITY_GRAN_THROTTLE = 13;
export const E_CITY_TRANSFER = 14;
export const E_CITY_BUILD = 15;
export const E_CITY_PRODUCTION_CHANGED = 16;
export const E_WORKLIST = 17;
export const E_UPRISING = 18;
export const E_CIVIL_WAR = 19;
export const E_ANARCHY = 20;
export const E_FIRST_CONTACT = 21;
export const E_NEW_GOVERNMENT = 22;
export const E_LOW_ON_FUNDS = 23;
export const E_POLLUTION = 24;
export const E_REVOLT_DONE = 25;
export const E_REVOLT_START = 26;
export const E_SPACESHIP = 27;
export const E_MY_DIPLOMAT_BRIBE = 28;
export const E_DIPLOMATIC_INCIDENT = 29;
export const E_MY_DIPLOMAT_ESCAPE = 30;
export const E_MY_DIPLOMAT_EMBASSY = 31;
export const E_MY_DIPLOMAT_FAILED = 32;
export const E_MY_DIPLOMAT_INCITE = 33;
export const E_MY_DIPLOMAT_POISON = 34;
export const E_MY_DIPLOMAT_SABOTAGE = 35;
export const E_MY_DIPLOMAT_THEFT = 36;
export const E_ENEMY_DIPLOMAT_BRIBE = 37;
export const E_ENEMY_DIPLOMAT_EMBASSY = 38;
export const E_ENEMY_DIPLOMAT_FAILED = 39;
export const E_ENEMY_DIPLOMAT_INCITE = 40;
export const E_ENEMY_DIPLOMAT_POISON = 41;
export const E_ENEMY_DIPLOMAT_SABOTAGE = 42;
export const E_ENEMY_DIPLOMAT_THEFT = 43;
export const E_CARAVAN_ACTION = 44;
export const E_SCRIPT = 45;
export const E_BROADCAST_REPORT = 46;
export const E_GAME_END = 47;
export const E_GAME_START = 48;
export const E_NATION_SELECTED = 49;
export const E_DESTROYED = 50;
export const E_REPORT = 51;
export const E_TURN_BELL = 52;
export const E_NEXT_YEAR = 53;
export const E_GLOBAL_ECO = 54;
export const E_NUKE = 55;
export const E_HUT_BARB = 56;
export const E_HUT_CITY = 57;
export const E_HUT_GOLD = 58;
export const E_HUT_BARB_KILLED = 59;
export const E_HUT_MERC = 60;
export const E_HUT_SETTLER = 61;
export const E_HUT_TECH = 62;
export const E_HUT_BARB_CITY_NEAR = 63;
export const E_IMP_BUY = 64;
export const E_IMP_BUILD = 65;
export const E_IMP_AUCTIONED = 66;
export const E_IMP_AUTO = 67;
export const E_IMP_SOLD = 68;
export const E_TECH_GAIN = 69;
export const E_TECH_LEARNED = 70;
export const E_TREATY_ALLIANCE = 71;
export const E_TREATY_BROKEN = 72;
export const E_TREATY_CEASEFIRE = 73;
export const E_TREATY_PEACE = 74;
export const E_TREATY_SHARED_VISION = 75;
export const E_UNIT_LOST_ATT = 76;
export const E_UNIT_WIN_ATT = 77;
export const E_UNIT_BUY = 78;
export const E_UNIT_BUILT = 79;
export const E_UNIT_LOST_DEF = 80;
export const E_UNIT_WIN_DEF = 81;
export const E_UNIT_BECAME_VET = 82;
export const E_UNIT_UPGRADED = 83;
export const E_UNIT_RELOCATED = 84;
export const E_UNIT_ORDERS = 85;
export const E_WONDER_BUILD = 86;
export const E_WONDER_OBSOLETE = 87;
export const E_WONDER_STARTED = 88;
export const E_WONDER_STOPPED = 89;
export const E_WONDER_WILL_BE_BUILT = 90;
export const E_DIPLOMACY = 91;
export const E_TREATY_EMBASSY = 92;
export const E_BAD_COMMAND = 93;
export const E_SETTING = 94;
export const E_CHAT_MSG = 95;
export const E_MESSAGE_WALL = 96;
export const E_CHAT_ERROR = 97;
export const E_CONNECTION = 98;
export const E_AI_DEBUG = 99;
export const E_LOG_ERROR = 100;
export const E_LOG_FATAL = 101;
export const E_TECH_GOAL = 102;
export const E_UNIT_LOST_MISC = 103;
export const E_CITY_PLAGUE = 104;
export const E_VOTE_NEW = 105;
export const E_VOTE_RESOLVED = 106;
export const E_VOTE_ABORTED = 107;
export const E_CITY_RADIUS_SQ = 108;
export const E_UNIT_BUILT_POP_COST = 109;
export const E_DISASTER = 110;
export const E_ACHIEVEMENT = 111;
export const E_TECH_LOST = 112;
export const E_TECH_EMBASSY = 113;
export const E_MY_SPY_STEAL_GOLD = 114;
export const E_ENEMY_SPY_STEAL_GOLD = 115;
export const E_SPONTANEOUS_EXTRA = 116;
export const E_UNIT_ILLEGAL_ACTION = 117;
export const E_MY_SPY_STEAL_MAP = 118;
export const E_ENEMY_SPY_STEAL_MAP = 119;
export const E_MY_SPY_NUKE = 120;
export const E_ENEMY_SPY_NUKE = 121;
export const E_UNIT_WAS_EXPELLED = 122;
export const E_UNIT_DID_EXPEL = 123;
export const E_UNIT_ACTION_FAILED = 124;
export const E_UNIT_ESCAPED = 125;
export const E_DEPRECATION_WARNING = 126;
export const E_BEGINNER_HELP = 127;
export const E_MY_UNIT_DID_HEAL = 128;
export const E_MY_UNIT_WAS_HEALED = 129;
export const E_MULTIPLIER = 130;
export const E_UNIT_ACTION_ACTOR_SUCCESS = 131;
export const E_UNIT_ACTION_ACTOR_FAILURE = 132;
export const E_UNIT_ACTION_TARGET_OTHER = 133;
export const E_UNIT_ACTION_TARGET_HOSTILE = 134;
export const E_INFRAPOINTS = 135;
export const E_HUT_MAP = 136;
export const E_TREATY_SHARED_TILES = 137;
export const E_CITY_CONQUERED = 138;
export const E_CHAT_PRIVATE = 139;
export const E_CHAT_ALLIES = 140;
export const E_CHAT_OBSERVER = 141;
export const E_UNDEFINED = 142;

// --- Event info: fc_e_events is now a flat string array, so E_I_NAME is unused ---

// --- fc_e_events: event name array (section/description stripped for bundle size) ---
export const fc_e_events: string[] = [
  'e_city_cantbuild',
  'e_city_lost',
  'e_city_love',
  'e_city_disorder',
  'e_city_famine',
  'e_city_famine_feared',
  'e_city_growth',
  'e_city_may_soon_grow',
  'e_city_aqueduct',
  'e_city_aq_building',
  'e_city_normal',
  'e_city_nuked',
  'e_city_cma_release',
  'e_city_gran_throttle',
  'e_city_transfer',
  'e_city_build',
  'e_city_production_changed',
  'e_worklist',
  'e_uprising',
  'e_civil_war',
  'e_anarchy',
  'e_first_contact',
  'e_new_government',
  'e_low_on_funds',
  'e_pollution',
  'e_revolt_done',
  'e_revolt_start',
  'e_spaceship',
  'e_my_diplomat_bribe',
  'e_diplomatic_incident',
  'e_my_diplomat_escape',
  'e_my_diplomat_embassy',
  'e_my_diplomat_failed',
  'e_my_diplomat_incite',
  'e_my_diplomat_poison',
  'e_my_diplomat_sabotage',
  'e_my_diplomat_theft',
  'e_enemy_diplomat_bribe',
  'e_enemy_diplomat_embassy',
  'e_enemy_diplomat_failed',
  'e_enemy_diplomat_incite',
  'e_enemy_diplomat_poison',
  'e_enemy_diplomat_sabotage',
  'e_enemy_diplomat_theft',
  'e_caravan_action',
  'e_script',
  'e_broadcast_report',
  'e_game_end',
  'e_game_start',
  'e_nation_selected',
  'e_destroyed',
  'e_report',
  'e_turn_bell',
  'e_next_year',
  'e_global_eco',
  'e_nuke',
  'e_hut_barb',
  'e_hut_city',
  'e_hut_gold',
  'e_hut_barb_killed',
  'e_hut_merc',
  'e_hut_settler',
  'e_hut_tech',
  'e_hut_barb_city_near',
  'e_imp_buy',
  'e_imp_build',
  'e_imp_auctioned',
  'e_imp_auto',
  'e_imp_sold',
  'e_tech_gain',
  'e_tech_learned',
  'e_treaty_alliance',
  'e_treaty_broken',
  'e_treaty_ceasefire',
  'e_treaty_peace',
  'e_treaty_shared_vision',
  'e_unit_lost_att',
  'e_unit_win_att',
  'e_unit_buy',
  'e_unit_built',
  'e_unit_lost_def',
  'e_unit_win_def',
  'e_unit_became_vet',
  'e_unit_upgraded',
  'e_unit_relocated',
  'e_unit_orders',
  'e_wonder_build',
  'e_wonder_obsolete',
  'e_wonder_started',
  'e_wonder_stopped',
  'e_wonder_will_be_built',
  'e_diplomacy',
  'e_treaty_embassy',
  'e_bad_command',
  'e_setting',
  'e_chat_msg',
  'e_message_wall',
  'e_chat_error',
  'e_connection',
  'e_ai_debug',
  'e_log_error',
  'e_log_fatal',
  'e_tech_goal',
  'e_unit_lost_misc',
  'e_city_plague',
  'e_vote_new',
  'e_vote_resolved',
  'e_vote_aborted',
  'e_city_radius_sq',
  'e_unit_built_pop_cost',
  'e_disaster',
  'e_achievement',
  'e_tech_lost',
  'e_tech_embassy',
  'e_my_spy_steal_gold',
  'e_enemy_spy_steal_gold',
  'e_spontaneous_extra',
  'e_unit_illegal_action',
  'e_my_spy_steal_map',
  'e_enemy_spy_steal_map',
  'e_my_spy_nuke',
  'e_enemy_spy_nuke',
  'e_unit_was_expelled',
  'e_unit_did_expel',
  'e_unit_action_failed',
  'e_unit_escaped',
  'e_deprecation_warning',
  'e_beginner_help',
  'e_my_unit_did_heal',
  'e_my_unit_was_healed',
  'e_multiplier',
  'e_unit_action_actor_success',
  'e_unit_action_actor_failure',
  'e_unit_action_target_other',
  'e_unit_action_target_hostile',
  'e_infrapoints',
  'e_hut_map',
  'e_treaty_shared_tiles',
  'e_city_conquered',
  'e_chat_private',
  'e_chat_allies',
  'e_chat_observer',
  'e_undefined',
];

// Legacy JS window exposure removed — all consumers now use TS imports.
