# Refactor Phase 2: Type Safety & Legacy Elimination

Previous phase (complete): Observer-only refactor — removed all player code paths.

Current state:
- 90 TS files, 22.7K LOC
- 299 typecheck errors (pre-existing)
- ~407 `declare const/function` (legacy global refs) across 33 files
- ~925 `any` annotations
- globalRegistry.ts: 2,648 lines bridging TS exports → window
- 27 legacy JS libs loaded via script tags
- 3 app JS files (hbs-templates, 2x tileset config)

---

## Phase 1: Fix typecheck errors (target: 299 → 0)

Group errors by category and fix in order of dependency.

**1a. globalRegistry.ts duplicate identifiers (~50 errors)**
- Duplicate `const` re-declarations (mouse_x/y, CITYO_*, FEELING_*, AR_*, A_*, TECH_*)
- Fix: deduplicate — keep one declaration per identifier

**1b. data/ module type errors (~40 errors)**
- `city.ts`: Cannot assign to function (getCityTileMapForPos)
- `wikiDoc.ts`: null assignment to string
- Fix: use proper function reassignment patterns, add null unions

**1c. renderer/ missing globals (~80 errors)**
- `tilespec.ts`: Missing `ts_tiles`, `dir_ccw`, `dir_cw`, `fill_irrigation_sprite_array`
- `tilesetConfig.ts`: Missing `MATCH_NONE`, `CELL_WHOLE`, etc.
- Fix: add `declare` stubs in a shared renderer.d.ts or import from tileset JS

**1d. audio/sounds.ts missing globals (~22 errors)**
- Missing `sounds_enabled`, `is_unit_visible`, `soundset`
- Fix: add declares or import properly

**1e. UI module strict-null errors (~60 errors)**
- Object possibly undefined/null in actionDialog, cityDialog, etc.
- Fix: add null checks, non-null assertions where safe

**1f. Remaining scattered errors (~47 errors)**
- `overview.ts`: undefined-to-number, null-to-array
- `packhandlers.ts`, `mapctrl.ts`, `intelDialog.ts`, etc.
- Fix: case-by-case

---

## Phase 2: Type the packet system

The 145 packet handlers in `packhandlers.ts` (1,446 LOC) are the backbone.
Typing them unlocks type safety across the entire data flow.

**2a. Define packet interfaces**
- Create `net/packetTypes.ts` with discriminated union:
  ```ts
  interface PacketGameInfo { pid: 16; turn: number; year: number; ... }
  interface PacketMapInfo { pid: 17; xsize: number; ysize: number; ... }
  type ServerPacket = PacketGameInfo | PacketMapInfo | ...;
  ```
- Start with the 20 most-used packet types (game, map, tile, unit, city, player, conn)

**2b. Type packet handlers**
- Replace `(packet: any)` signatures with specific packet types
- Use the discriminated union in the router

**2c. Type outgoing packets**
- Create interfaces for client→server packets (unit_orders, city_buy, chat, etc.)
- Type `send_request()` calls

---

## Phase 3: Eliminate `declare` statements (407 → 0)

Replace legacy `declare const X: any` with proper imports.
Work file-by-file, prioritizing files with most declares.

**3a. Create typed facade modules for legacy JS libs**
- `legacy/jquery.ts` — re-export `$` with basic types
- `legacy/handlebars.ts` — re-export `Handlebars`
- `legacy/eventAggregator.ts` — typed wrapper

**3b. Move tileset JS constants into TS**
- Convert `tileset_config_amplio2.js` → `.ts`
- Convert `tileset_spec_amplio2.js` → `.ts`
- This eliminates ~80 declares in renderer/ files

**3c. Replace declares in UI files (top 10 by count)**
1. `ui/techDialog.ts` (22 declares)
2. `ui/cityDialog.ts` (20 declares)
3. `ui/diplomacy.ts` (20 declares)
4. `ui/helpdata.ts` (18 declares)
5. `ui/nationDialog.ts`
6. `ui/intelDialog.ts`
7. `core/control/unitCommands.ts`
8. `renderer/tilespec.ts`
9. `renderer/tilesetConfig.ts`
10. `net/packhandlers.ts`

**3d. Clean up global.d.ts**
- Remove entries as declares are replaced with imports
- Goal: delete global.d.ts entirely

---

## Phase 4: Shrink globalRegistry.ts (2,648 → 0 lines)

Once declares are replaced with imports, the registry becomes unnecessary.

**4a. Audit which window registrations are still needed**
- Check index.html inline scripts
- Check legacy JS lib callbacks
- Check Handlebars template helpers

**4b. Remove registrations for TS-only consumers**
- If a function is only called from TS code, remove its window registration
- Batch by module (audio, data, core, ui, net, renderer)

**4c. Move remaining registrations to the consuming module**
- For functions still called from legacy JS, register at the call site
- Example: `window.show_city_dialog = show_city_dialog` in cityDialog.ts

**4d. Delete globalRegistry.ts and its import from main.ts**

---

## Phase 5: Modernize library dependencies

Replace script-tag libraries with npm packages.

**5a. High-value replacements**
- jQuery → native DOM (already have `utils/dom.ts` with `$id`, `on`)
- jQuery UI dialogs → lightweight alternative (or custom)
- simpleStorage → localStorage wrapper

**5b. Bundle remaining libs via Vite**
- Move Handlebars runtime to npm import
- Move EventAggregator to TS module (already have `core/events.ts`)

**5c. Clean up index.html script tags**
- Remove library script tags as they're bundled
- Goal: single `<script>` tag for the TS bundle

---

## Phase 6: Reduce `any` annotations (925 → <50)

**6a. Type game state objects**
- Define interfaces: `Player`, `Unit`, `City`, `Tile`, `Nation`, `Tech`
- Update `data/store.ts` to use typed collections
- Replace `players: any` → `players: Record<number, Player>`

**6b. Type UI module parameters**
- Replace `any` in dialog functions with game object types
- Type jQuery callbacks with proper event types

**6c. Type renderer interfaces**
- Sprite types, canvas context types, tileset types

---

## Execution order & priorities

| Phase | Effort | Impact | Dependencies |
|-------|--------|--------|--------------|
| 1     | 2-3 sessions | Unlocks CI typecheck | None |
| 2     | 2-3 sessions | Type safety for data flow | None |
| 3     | 4-5 sessions | Eliminates legacy coupling | Phase 1 |
| 4     | 2 sessions | Removes biggest file | Phase 3 |
| 5     | 3-4 sessions | Modern build, smaller bundle | Phase 4 |
| 6     | 3-4 sessions | Full type safety | Phase 2 |

Phases 1 and 2 can run in parallel. Phase 3→4 is sequential. Phase 6 benefits from Phase 2 but can start early.
