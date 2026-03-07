# xbworld-web: Changes Required for Freeciv 3.4

xbworld-server has been upgraded from freeciv 3.2 to 3.4 (branch `upgrade-freeciv-3.4`,
now merged to main). xbworld-web currently targets freeciv 3.3 and will be **rejected
at connection** by the new server. This document lists every change needed.

xbworld-web is observe-only (no game commands sent by the user). This simplifies the
scope — action ID changes matter for correct parsing of server data, not for sending.

---

## 1. Capability string & version  `src/ts/net/connection.ts`

**Blocking — server rejects the connection without this.**

```ts
// line 41
const freeciv_version = '+Freeciv.Web.Devel-3.4';  // was '+Freeciv.Web.Devel-3.3'

// lines 188–190 (JOIN_REQ packet)
major_version: 3,
minor_version: 3,   // was 1
patch_version: 90,
```

---

## 2. ACTION_COUNT sentinel  `src/ts/core/constants.ts`

**Must fix — wrong value causes mis-indexing of action probability arrays.**

```ts
// line 287
export const ACTION_COUNT = 143;  // was 139
```

`ACTION_COUNT` is used as the "no action" sentinel in UNIT_ORDERS and as the loop
bound when iterating `action_probabilities[]` arrays sent by the server in
`UNIT_INFO` / `DIPLOMAT_ACTION`. The server sends 143-element arrays; iterating
to 139 truncates them and sends wrong indices in goto packets.

---

## 3. All ACTION_* IDs  `src/ts/data/fcTypes.ts`

**Must fix — every action from ID 24 onward is wrong.**

Root cause: freeciv 3.4 inserted `ACTION_SPY_BRIBE_STACK` at position 24, shifting
all subsequent IDs by +1. Additionally `ACTION_BOMBARD_LETHAL2` was inserted at 61,
and three new actions were added before `ACTION_USER_ACTION*` at the end.

Replace the entire `ACTION_*` block (lines ~126–265) with the values below, sourced
directly from `xbworld-server/freeciv/build/actions_enums_gen.h`:

```ts
export const ACTION_ESTABLISH_EMBASSY = 0;
export const ACTION_ESTABLISH_EMBASSY_STAY = 1;
export const ACTION_SPY_INVESTIGATE_CITY = 2;
export const ACTION_INV_CITY_SPEND = 3;
export const ACTION_SPY_POISON = 4;
export const ACTION_SPY_POISON_ESC = 5;
export const ACTION_SPY_STEAL_GOLD = 6;
export const ACTION_SPY_STEAL_GOLD_ESC = 7;
export const ACTION_SPY_SABOTAGE_CITY = 8;
export const ACTION_SPY_SABOTAGE_CITY_ESC = 9;
export const ACTION_SPY_TARGETED_SABOTAGE_CITY = 10;
export const ACTION_SPY_TARGETED_SABOTAGE_CITY_ESC = 11;
export const ACTION_SPY_SABOTAGE_CITY_PRODUCTION = 12;
export const ACTION_SPY_SABOTAGE_CITY_PRODUCTION_ESC = 13;
export const ACTION_SPY_STEAL_TECH = 14;
export const ACTION_SPY_STEAL_TECH_ESC = 15;
export const ACTION_SPY_TARGETED_STEAL_TECH = 16;
export const ACTION_SPY_TARGETED_STEAL_TECH_ESC = 17;
export const ACTION_SPY_INCITE_CITY = 18;
export const ACTION_SPY_INCITE_CITY_ESC = 19;
export const ACTION_TRADE_ROUTE = 20;
export const ACTION_MARKETPLACE = 21;
export const ACTION_HELP_WONDER = 22;
export const ACTION_SPY_BRIBE_UNIT = 23;
export const ACTION_SPY_BRIBE_STACK = 24;        // NEW in 3.4
export const ACTION_CAPTURE_UNITS = 25;          // was 24
export const ACTION_SPY_SABOTAGE_UNIT = 26;      // was 25
export const ACTION_SPY_SABOTAGE_UNIT_ESC = 27;  // was 26
export const ACTION_FOUND_CITY = 28;             // was 27
export const ACTION_JOIN_CITY = 29;              // was 28
export const ACTION_STEAL_MAPS = 30;             // was 29
export const ACTION_STEAL_MAPS_ESC = 31;         // was 30
export const ACTION_SPY_NUKE = 32;               // was 31
export const ACTION_SPY_NUKE_ESC = 33;           // was 32
export const ACTION_NUKE = 34;                   // was 33
export const ACTION_NUKE_CITY = 35;              // was 34
export const ACTION_NUKE_UNITS = 36;             // was 35
export const ACTION_DESTROY_CITY = 37;           // was 36
export const ACTION_EXPEL_UNIT = 38;             // was 37
export const ACTION_DISBAND_UNIT_RECOVER = 39;   // was 38
export const ACTION_DISBAND_UNIT = 40;           // was 39
export const ACTION_HOME_CITY = 41;              // was 40
export const ACTION_HOMELESS = 42;               // was 41
export const ACTION_UPGRADE_UNIT = 43;           // was 42
export const ACTION_CONVERT = 44;               // was 43
export const ACTION_AIRLIFT = 45;               // was 44
export const ACTION_ATTACK = 46;                // was 45
export const ACTION_ATTACK2 = 47;               // was 46
export const ACTION_SUICIDE_ATTACK = 48;        // was 47
export const ACTION_SUICIDE_ATTACK2 = 49;       // was 48
export const ACTION_STRIKE_BUILDING = 50;       // was 49
export const ACTION_STRIKE_PRODUCTION = 51;     // was 50
export const ACTION_CONQUER_CITY_SHRINK = 52;   // was ACTION_CONQUER_CITY = 51
export const ACTION_CONQUER_CITY_SHRINK2 = 53;  // was ACTION_CONQUER_CITY2 = 52
export const ACTION_CONQUER_CITY_SHRINK3 = 54;  // was ACTION_CONQUER_CITY3 = 53
export const ACTION_CONQUER_CITY_SHRINK4 = 55;  // was ACTION_CONQUER_CITY4 = 54
export const ACTION_BOMBARD = 56;               // was 55
export const ACTION_BOMBARD2 = 57;              // was 56
export const ACTION_BOMBARD3 = 58;              // was 57
export const ACTION_BOMBARD4 = 59;              // was 58
export const ACTION_BOMBARD_LETHAL = 60;        // was 59
export const ACTION_BOMBARD_LETHAL2 = 61;       // NEW in 3.4
export const ACTION_ROAD = 62;
export const ACTION_ROAD2 = 63;
export const ACTION_IRRIGATE = 64;
export const ACTION_IRRIGATE2 = 65;
export const ACTION_MINE = 66;
export const ACTION_MINE2 = 67;
export const ACTION_BASE = 68;
export const ACTION_BASE2 = 69;
export const ACTION_PILLAGE = 70;
export const ACTION_PILLAGE2 = 71;
export const ACTION_TRANSPORT_BOARD = 72;
export const ACTION_TRANSPORT_BOARD2 = 73;
export const ACTION_TRANSPORT_BOARD3 = 74;
export const ACTION_TRANSPORT_DEBOARD = 75;
export const ACTION_TRANSPORT_EMBARK = 76;
export const ACTION_TRANSPORT_EMBARK2 = 77;
export const ACTION_TRANSPORT_EMBARK3 = 78;
export const ACTION_TRANSPORT_EMBARK4 = 79;
export const ACTION_TRANSPORT_DISEMBARK1 = 80;
export const ACTION_TRANSPORT_DISEMBARK2 = 81;  // was 80
export const ACTION_TRANSPORT_DISEMBARK3 = 82;
export const ACTION_TRANSPORT_DISEMBARK4 = 83;
export const ACTION_TRANSPORT_LOAD = 84;
export const ACTION_TRANSPORT_LOAD2 = 85;
export const ACTION_TRANSPORT_LOAD3 = 86;
export const ACTION_TRANSPORT_UNLOAD = 87;
export const ACTION_SPY_SPREAD_PLAGUE = 88;
export const ACTION_SPY_ATTACK = 89;
export const ACTION_CONQUER_EXTRAS = 90;
export const ACTION_CONQUER_EXTRAS2 = 91;
export const ACTION_CONQUER_EXTRAS3 = 92;
export const ACTION_CONQUER_EXTRAS4 = 93;
export const ACTION_HUT_ENTER = 94;
export const ACTION_HUT_ENTER2 = 95;
export const ACTION_HUT_ENTER3 = 96;
export const ACTION_HUT_ENTER4 = 97;
export const ACTION_HUT_FRIGHTEN = 98;
export const ACTION_HUT_FRIGHTEN2 = 99;
export const ACTION_HUT_FRIGHTEN3 = 100;
export const ACTION_HUT_FRIGHTEN4 = 101;
export const ACTION_HEAL_UNIT = 102;
export const ACTION_HEAL_UNIT2 = 103;
export const ACTION_PARADROP = 104;
export const ACTION_PARADROP_CONQUER = 105;
export const ACTION_PARADROP_FRIGHTEN = 106;
export const ACTION_PARADROP_FRIGHTEN_CONQUER = 107;
export const ACTION_PARADROP_ENTER = 108;
export const ACTION_PARADROP_ENTER_CONQUER = 109;
export const ACTION_WIPE_UNITS = 110;
export const ACTION_SPY_ESCAPE = 111;
export const ACTION_UNIT_MOVE = 112;
export const ACTION_UNIT_MOVE2 = 113;
export const ACTION_UNIT_MOVE3 = 114;
export const ACTION_TELEPORT = 115;
export const ACTION_TELEPORT2 = 116;
export const ACTION_TELEPORT3 = 117;
export const ACTION_TELEPORT_CONQUER = 118;
export const ACTION_TELEPORT_FRIGHTEN = 119;
export const ACTION_TELEPORT_FRIGHTEN_CONQUER = 120;
export const ACTION_TELEPORT_ENTER = 121;
export const ACTION_TELEPORT_ENTER_CONQUER = 122;
export const ACTION_CLEAN = 123;
export const ACTION_CLEAN2 = 124;
export const ACTION_COLLECT_RANSOM = 125;
export const ACTION_FORTIFY = 126;              // was 125
export const ACTION_FORTIFY2 = 127;             // was 126
export const ACTION_CULTIVATE = 128;
export const ACTION_CULTIVATE2 = 129;
export const ACTION_PLANT = 130;
export const ACTION_PLANT2 = 131;
export const ACTION_TRANSFORM_TERRAIN = 132;
export const ACTION_TRANSFORM_TERRAIN2 = 133;
export const ACTION_GAIN_VETERANCY = 134;
export const ACTION_ESCAPE = 135;
export const ACTION_CIVIL_WAR = 136;            // NEW in 3.4
export const ACTION_FINISH_UNIT = 137;          // NEW in 3.4
export const ACTION_FINISH_BUILDING = 138;      // NEW in 3.4
export const ACTION_USER_ACTION1 = 139;         // was 135
export const ACTION_USER_ACTION2 = 140;         // was 136
export const ACTION_USER_ACTION3 = 141;         // was 137
export const ACTION_USER_ACTION4 = 142;         // was 138
export const ACTION_COUNT = 143;                // was 139
```

Also update any remaining references to the old CONQUER_CITY names:

```
ACTION_CONQUER_CITY  → ACTION_CONQUER_CITY_SHRINK
ACTION_CONQUER_CITY2 → ACTION_CONQUER_CITY_SHRINK2
ACTION_CONQUER_CITY3 → ACTION_CONQUER_CITY_SHRINK3
ACTION_CONQUER_CITY4 → ACTION_CONQUER_CITY_SHRINK4
```

Search with: `grep -rn "ACTION_CONQUER_CITY[^_S]" src/ts`

---

## 4. Removed web packets 287–290 (goto path & info text)

**No code change required, but goto path preview stops working.**

Freeciv 3.4 removed four server-side web helper packets:

| PID | Name | Direction | Status |
|-----|------|-----------|--------|
| 287 | `WEB_GOTO_PATH_REQ` | client→server | removed; server ignores |
| 288 | `WEB_GOTO_PATH` | server→client | removed; never arrives |
| 289 | `WEB_INFO_TEXT_REQ` | client→server | removed; server ignores |
| 290 | `WEB_INFO_TEXT_MESSAGE` | server→client | removed; never arrives |

The web sends 287 (`packet_web_goto_path_req`) when the user clicks a destination
tile to preview the path. The server will silently ignore it. The response (288)
never comes back, so `update_goto_path()` is never called and the path overlay is
never drawn.

**Workaround options** (not required for observe-only mode):
- Remove the `request_goto_path` call and fall back to immediate UNIT_ORDERS without
  path preview, OR
- Implement client-side A* pathfinding using the tile data already in the store.

The `packet_hand_table[288]` and `packet_hand_table[290]` handlers in `packhandlers.ts`
can stay — they simply never fire.

---

## 5. New packets 516–520

**No change required — unknown PIDs are already ignored.**

The 3.4 server sends five new packets that the web has no handlers for:

| PID | Name | Content |
|-----|------|---------|
| 516 | `EDIT_FOGOFWAR_STATE` | fog-of-war toggle (editor) |
| 517 | `SYNC_SERIAL` | state sync serial number |
| 518 | `SYNC_SERIAL_REPLY` | sync reply |
| 519 | `RULESET_GOV_FLAG` | government flags bitvector |
| 520 | `RULESET_TILEDEF` | tile definitions |

These are dispatched through `packet_hand_table` in `packhandlers.ts`. Missing entries
result in a no-op. No crash, no action needed.

---

## 6. CITY_INFO improvements field

**Already handled correctly — no change needed.**

`src/ts/net/handlers/city.ts` already converts `improvements: number[]` to a
`BitVector` before storing. The 3.4 protocol sends `improvements` as a bitmask array
(building N present if `improvements[N>>3] & (1 << (N&7))`) — identical to what
`BitVector` already implements.

---

## 7. GAME_INFO removed fields

**No change needed.**

Freeciv 3.4 removed `homeless_gold_upkeep` and `civil_war_enabled` from the
`GAME_INFO` packet (pid=16). The web does not reference either field. Missing JSON
keys are read as `undefined` and ignored.

---

## Summary

| # | File | Change | Severity |
|---|------|--------|----------|
| 1 | `net/connection.ts` | Capstring `3.3→3.4`, `minor_version` `1→3` | **Blocking** |
| 2 | `core/constants.ts` | `ACTION_COUNT` `139→143` | **Blocking** |
| 3 | `data/fcTypes.ts` | Replace all `ACTION_*` IDs (full block above) | **Blocking** |
| 4 | — | Goto path preview broken (pids 287–290 removed) | Functional loss |
| 5 | — | New pids 516–520 ignored silently | None |
| 6 | — | `improvements` BitVector already correct | None |
| 7 | — | Removed GAME_INFO fields not referenced | None |

Items 1–3 are required for the web to connect and display game state correctly.
Item 4 is a known functional regression with no quick fix short of client-side pathfinding.
