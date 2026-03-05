# Refactor Phase 2: Clean Up, Fix Types, Kill Legacy

Previous phase (complete): Observer-only refactor — removed all player code paths.

---

## Current state snapshot

```
Code volume:
  TypeScript      29,446 lines  (90 files)
  Legacy JS libs  10,625 lines  (26 files, script-tag loaded)
  App JS            673 lines   (tileset config + Handlebars templates)
  HTML              217 lines   (index.html)
  CSS             5,010 lines
  Total          ~46,000 lines

Technical debt:
  typecheck errors    299
  `declare` stubs     407  (across 33 files)
  `any` annotations   925  (across 38 files)
  jQuery usages       900  (across 38 files)
  globalRegistry.ts   2,648 lines

Dead code (observer-mode):
  savegame.ts         459 lines  (entire file)
  clientTimers.ts     111 lines  (entire file)
  options.ts          ~30 lines  (save/metamessage/timeout init)
  clientMain.ts       ~20 lines  (alertWar, metamessage functions)
  pages.ts            ~30 lines  (non-game page branches)
```

### typecheck errors breakdown (299 total)

```
By file (top 10):
  globalRegistry.ts      120  (duplicates + const enum issues)
  tilesetConfig.ts        40  (missing MATCH_NONE, CELL_WHOLE etc.)
  sounds.ts               22  (missing soundset, sounds_enabled)
  techDialog.ts           22  (missing globals)
  tilespec.ts             18  (missing ts_tiles, dir_ccw etc.)
  cityDialog.ts           14  (strict-null, missing names)
  actionDialog.ts         13  (strict-null, store property names)
  mapctrl.ts               9  (missing globals)
  options.ts               8  (missing globals)
  mapviewCommon.ts         6  (missing globals)

By error type:
  TS2304  93  Cannot find name (missing declares)
  TS2475  60  const enum used incorrectly
  TS2300  60  Duplicate identifier
  TS2345  15  Type mismatch in argument
  TS2683  13  'this' implicitly has type 'any'
  TS2532  13  Object possibly undefined
  TS18047  7  Object possibly null
  TS2395   6  Individual declarations in merged declaration
  TS2322   6  Type not assignable
  TS2630   4  Cannot assign to function
```

---

## Step 0: Delete dead code (quick win, ~650 lines)

Remove files and code that are completely dead after observer-only refactor.
This reduces noise before tackling type errors.

**0a. Delete `savegame.ts` (459 lines)**
- Entire file is dead: observers can't save/load games
- Remove its imports from `main.ts` and `globalRegistry.ts`
- Remove `quicksave` declare from `keyboard.ts`
- Already guarded by `clientIsObserver()`, but the file serves no purpose

**0b. Delete `clientTimers.ts` (111 lines)**
- `updateTimeout()` and `updateTurnChangeTimer()` depend on `#turn_done_button` (removed from HTML)
- Remove imports from `main.ts` and `globalRegistry.ts`

**0c. Trim dead branches in existing files (~80 lines)**
- `clientMain.ts`: Delete `alertWar()`, simplify `updateMetamessageOnGamestart()` / `updateMetamessageGameRunningStatus()` to return immediately for observer
- `pages.ts`: Remove PAGE_LOAD, PAGE_SCENARIO, PAGE_NETWORK cases
- `options.ts`: Remove save button init, metamessage setting, timeout setting

**0d. Clean globalRegistry.ts imports**
- Remove registration lines for deleted functions (savegame, clientTimers, alertWar etc.)

**Verification:** `npx vite build` still passes, E2E tests still pass.

---

## Step 1: Fix globalRegistry.ts errors (120 → 0)

This single file has 40% of all errors. Fix it first for biggest impact.

**1a. Fix duplicate identifiers (60 errors, TS2300)**
- Problem: Constants like `mouse_x`, `CITYO_*`, `FEELING_*`, `AR_*`, `A_*`, `TECH_KNOWN` are declared twice
- Cause: imported from a module AND re-declared as `const` in the same file
- Fix: Remove the duplicate `const` declarations, keep only the import + `w[name] = value` pattern

**1b. Fix const enum issues (60 errors, TS2475)**
- Problem: `const enum` members used in `w[name] = EnumMember` assignments
- Cause: TypeScript inlines `const enum` values, but they can't be used in arbitrary expressions
- Fix: Change the source enums from `const enum` to regular `enum`, or use the numeric literal values directly

**Verification:** `npx tsc --noEmit 2>&1 | grep globalRegistry | wc -l` → 0

---

## Step 2: Fix renderer errors (64 → 0)

Second biggest group. All about missing tileset constants.

**2a. Create `renderer/tileset.d.ts` with declares for tileset JS globals (~40 errors)**
- `MATCH_NONE`, `MATCH_SAME`, `MATCH_PAIR`, `MATCH_FULL`, `CELL_WHOLE`, `CELL_CORNER`
- `ts_tiles`, `dir_ccw`, `dir_cw`, `fill_irrigation_sprite_array`
- These come from `tileset_config_amplio2.js` / `tileset_spec_amplio2.js` loaded via script tag
- Single `.d.ts` file eliminates 40+ errors across tilesetConfig.ts, tilespec.ts, mapviewCommon.ts

**2b. Fix mapctrl.ts missing globals (9 errors)**
- `map_select_x`, `map_select_y`, `mouse_moved_cb`, `selected_player`
- Add declares or import from appropriate module

**2c. Fix remaining renderer strict-null errors (~5)**
- `tilespec.ts`: `punits` possibly null, `utype` possibly undefined, `pterrain` possibly undefined
- Add null checks

**Verification:** `npx tsc --noEmit 2>&1 | grep renderer | wc -l` → 0

---

## Step 3: Fix audio + UI errors (93 → 0)

**3a. Fix sounds.ts (22 errors)**
- Add declares: `soundset`, `sounds_enabled`, `is_unit_visible`
- All are window globals from legacy JS

**3b. Fix techDialog.ts (22 errors)**
- Missing: `is_tech_req_for_goal`, `get_units_from_tech`, `get_improvements_from_tech`, `selected_player`
- Add declares for legacy globals

**3c. Fix cityDialog.ts (14 errors)**
- Mix of missing names (`can_city_build_now`, `generate_production_list`) and strict-null
- Add declares + null checks + `typeof EventAggregator` fix

**3d. Fix actionDialog.ts (13 errors)**
- Strict-null errors + `store.ruleset_control` → `store.rulesControl`
- Fix property name to match actual store shape

**3e. Fix remaining UI files (options, diplomacy, intelDialog, rates, pillageDialog, helpdata — ~20 errors)**
- Case by case: add declares, null checks, type fixes

---

## Step 4: Fix data/ errors (8 → 0)

**4a. city.ts (4 errors, TS2630)**
- Cannot assign to function `getCityTileMapForPos`
- Fix: use `let` variable with function type instead of function declaration

**4b. wikiDoc.ts (2 errors)**
- Null assignment to string
- Fix: add `| null` to type

**4c. overview.ts (5 errors)**
- `number | undefined` passed as `number`, `null` to `number[]`
- Fix: add null checks and defaults

---

## Step 5: Fix runtime errors preventing page load ✅ DONE

Fixed runtime errors caused by `declare` stubs that don't resolve at runtime in the IIFE bundle.

**5a. Fixed `DEFAULT_SOCK_PORT is not defined`** ✅
- `options.ts`: replaced `declare const DEFAULT_SOCK_PORT` with `const DEFAULT_SOCK_PORT = 6001`

**5b. Fixed `TRUE is not defined`** ✅
- `options.ts`: replaced `declare const TRUE/FALSE` with `const TRUE = true; const FALSE = false`

**5c. Fixed `MATCH_PAIR is not defined` / TDZ error** ✅
- `tilesetConfig.ts`: added local constant definitions for `MATCH_NONE/SAME/PAIR/FULL`, `CELL_WHOLE/CORNER`
  (can't import from `tilespec.ts` due to circular dependency / TDZ in IIFE bundle)
- Removed redundant declares from `tileset.d.ts`

**5d. Fixed `Cannot set properties of undefined (setting 'width')`** ✅
- `clientMain.ts`: added null checks for `w.mapview_canvas` and `w.buffer_canvas` in `setupWindowSize()`

**Result:** All 3 E2E tests pass. Page loads without JS errors.

**Note:** Map rendering in-game still needs investigation (observer auto-connect doesn't
trigger in the 10s test window). The remaining `declare` stubs (~400) in renderer files
(tilespec.ts, mapview.ts, etc.) may cause runtime errors when rendering functions execute.
Full `declare` → import migration is tracked in Phase 3 below.

---

## Step 6: Node.js version pin

**6a. Add `.nvmrc` file**
```
18
```

**6b. Update package.json engines**
```json
"engines": { "node": ">=18" }
```

**6c. Update vite.config.dev.ts comment**
- Remove reference to old backend URL if needed

---

## Execution summary

| Step | Errors fixed | Lines changed | Time est. |
|------|-------------|---------------|-----------|
| 0    | —           | -650 deleted  | 15 min    |
| 1    | 120         | ~60 changed   | 20 min    |
| 2    | 64          | ~50 new declares | 15 min |
| 3    | 93          | ~40 declares + fixes | 30 min |
| 4    | 8           | ~15 fixes     | 10 min    |
| 5    | —           | debug + fix   | 30 min    |
| 6    | —           | 3 new files   | 5 min     |
| **Total** | **299 → 0** | **~800 lines** | **~2 hours** |

After completion:
- `npx tsc --noEmit` exits with 0 errors
- `npx vite build` passes
- E2E tests pass with live backend
- Map renders correctly
- Dead code removed
- Node.js version pinned

---

## What comes after (future sessions)

With 0 typecheck errors achieved, the codebase is ready for:

1. **Packet typing** (PLAN Phase 2) — define interfaces for 145 packet handlers
2. **declare elimination** (PLAN Phase 3) — replace 407 `declare` stubs with imports
3. **jQuery removal** (PLAN Phase 5) — replace 900 `$()` calls with native DOM
4. **globalRegistry deletion** (PLAN Phase 4) — remove 2,648-line bridge file
5. **Full type safety** (PLAN Phase 6) — reduce 925 `any` to <50
