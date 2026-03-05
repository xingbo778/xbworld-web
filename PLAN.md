# XBWorld Web Frontend Refactoring Plan

## Progress

| Step | Status | Notes |
|------|--------|-------|
| Step 1: Eliminate globalRegistry | DONE | globalRegistry.ts (2,543 lines) replaced by windowBridge.ts (60 lines). Bundle: 675→570 KB (-15.6%). |
| Step 2: jQuery Dialogs → Preact | NOT STARTED | |
| Step 3: Remove remaining jQuery | NOT STARTED | |
| Step 4: CSS Modernization | NOT STARTED | |
| Step 5: Pixi.js Rendering | NOT STARTED | |
| Step 6: State Management | NOT STARTED | |

### Step 1 Commits
- `cea6163` Phase 1: 17 files converted from `const w` pattern
- `2c0dac8` Phase 2: 9 more files from `declare` globals
- `51957cb` Phase 3: 6 more small files
- `4a62901` Phase 4: 13 large files (unitCommands, packhandlers, cityDialog, etc.)
- `7c32d5c` Phase 5: Final cleanup — 1 declare remaining (global.d.ts), 2 _w aliases (runtime DOM)
- `b85860c` Phase 6: Replace globalRegistry (2,543 lines) with windowBridge (60 lines) — 570 KB bundle
- `81cb64a` Delete globalRegistry.ts (2,543 lines removed)
- `61610ee` Lazy-load wikiDoc: 363KB Wikipedia data → runtime JSON fetch — 217 KB bundle

### Metrics After Step 1
- Bundle: 686 KB → 217 KB (-469 KB, -68.4%)
- Gzip: 233 KB → 70 KB (-163 KB, -70.0%)
- declare const: 426 → 1 (global.d.ts only)
- _w aliases: 24 → 2 (clientMain.ts, tilespec.ts — runtime DOM, intentional)
- globalRegistry: 2,543 lines → windowBridge 60 lines

## Current State Summary

| Metric | Value |
|--------|-------|
| TS Bundle (main.js) | 675 KB (232 KB gzip) |
| Legacy JS (26 files) | ~1 MB |
| CSS (16 files) | 474 KB |
| jQuery $() calls | 815 across 31 files |
| .dialog()/.blockUI() calls | 90 across 17 files |
| globalRegistry.ts | 2,543 lines, 1,285 window assignments |
| Renderer code | 4,166 lines (Canvas 2D) |
| Preact components | 3 (App, PillageDialog, Dialog) |

### Top jQuery-heavy files
| File | $() calls | .dialog() calls |
|------|-----------|-----------------|
| cityDialog.ts | 145 | 12 |
| actionDialog.ts | 89 | 8 |
| controls.ts | 81 | 5 |
| techDialog.ts | 62 | 6 |
| diplomacy.ts | 58 | 7 |
| helpdata.ts | 55 | 4 |
| options.ts | 48 | 6 |
| governmentDialog.ts | 35 | 5 |
| intelDialog.ts | 32 | 4 |
| pregame.ts | 30 | 3 |

---

## Step 1: Eliminate globalRegistry.ts (2,543 lines -> 0)

**Goal**: Remove the 1,285 window assignments. All TS modules already import each other directly -- globalRegistry exists only as a legacy bridge.

**Approach**:
1. Verify zero external (non-TS) consumers of window globals
   - Grep all `.html`, `.jsp`, legacy `.js` files for function names exported by globalRegistry
   - Any remaining callers get thin `<script>` shims or direct imports
2. Delete globalRegistry.ts in batches by domain:
   - Batch A: data/ exports (store, types, map, tile, terrain, etc.)
   - Batch B: net/ exports (connection, packets, packhandlers)
   - Batch C: client/ exports (clientState, clientCore, civClient)
   - Batch D: core/ exports (log, messages, overview, pages, control, pregame)
   - Batch E: renderer/ exports (mapctrl, mapview, tilespec)
   - Batch F: ui/ exports (all dialogs, controls, options)
3. After each batch: build, test in browser, verify no runtime errors
4. Delete globalRegistry.ts import from main.ts
5. Remove syncStoreWithWindow() if no longer needed

**Risk**: Some legacy JS files may reference window globals. Mitigate by grepping thoroughly before each batch.

**Test**: Full game flow -- login, join game, play turns, open all dialogs, observer mode.

---

## Step 2: Migrate jQuery Dialogs to Preact (90 .dialog() calls -> 0)

**Goal**: Replace all jQuery UI dialog/blockUI usage with Preact `<Dialog>` components.

**Migration order** (by complexity, easiest first):

### Phase 2a: Simple confirmation dialogs
- pillageDialog (DONE)
- governmentDialog (1 dialog, simple select)
- rates (1 dialog, 3 sliders)
- intelDialog (1 dialog, read-only info)

### Phase 2b: Medium complexity dialogs
- techDialog (tree view + selection)
- diplomacy (multi-step negotiation)
- helpdata (tabbed content display)
- options (form with multiple sections)

### Phase 2c: Complex dialogs
- actionDialog (dynamic action list from server)
- cityDialog (most complex -- production queue, specialists, map inset, multiple tabs)

### Pattern for each migration:
1. Create `src/ts/components/Dialogs/XxxDialog.tsx`
2. Use signal for open/close state
3. Port DOM manipulation to JSX
4. Replace `$('#xxx').dialog()` calls with signal updates
5. Add to App.tsx
6. Remove old jQuery code from `src/ts/ui/xxx.ts`
7. Test the dialog end-to-end

**Shared components to build**:
- `<Tabs>` -- for dialogs with tab navigation
- `<Select>` -- styled dropdown
- `<Slider>` -- for rates dialog
- `<ProgressBar>` -- for production/research

---

## Step 3: Clean Remaining jQuery + Delete Legacy JS (1 MB -> 0)

**Goal**: Remove jQuery dependency entirely and delete legacy JS files.

### 3a: Replace remaining jQuery DOM operations
- `$('#id').html(...)` -> `document.getElementById(...).innerHTML = ...` or Preact refs
- `$('#id').show/hide()` -> CSS class toggle or signal-driven rendering
- `$('.class').each(...)` -> `document.querySelectorAll(...).forEach(...)`
- `$.ajax(...)` -> `fetch()` (if any remain)
- `$('#id').tooltip()` -> CSS `:hover` or Preact tooltip component

### 3b: Delete legacy JS files
Files in `src/main/webapp/javascript/libs/` that can be removed:
- jquery-*.js (after all jQuery usage removed)
- jquery-ui-*.js (after all .dialog() removed)
- blockUI.js (after blockUI calls removed)
- mCustomScrollbar.js (already replaced by tokens.css)
- handlebars.js (check if used)
- Verify each file has zero imports before deletion

### 3c: Update HTML templates
- Remove `<script>` tags for deleted JS files
- Update any CDN references

---

## Step 4: CSS Modernization (474 KB -> ~100 KB)

**Goal**: Consolidate CSS using design tokens, remove unused rules.

### 4a: Audit CSS usage
- Use PurgeCSS or manual grep to find unused selectors
- Identify jQuery UI theme CSS (can be fully removed after Step 2)
- Identify mCustomScrollbar CSS (already replaced)

### 4b: Consolidate to module CSS
- Each Preact component gets co-located `.module.css` or uses tokens.css variables
- Move game-specific styles to `src/ts/styles/game.css`
- Move layout styles to `src/ts/styles/layout.css`

### 4c: Delete legacy CSS files
- jQuery UI themes (~100 KB)
- mCustomScrollbar CSS
- Any unused bootstrap/normalize CSS

---

## Step 5: Pixi.js Rendering Upgrade (Canvas 2D -> WebGL)

**Goal**: Replace Canvas 2D renderer with Pixi.js for GPU-accelerated map rendering.

### Current renderer architecture:
- `mapview.ts` (1,200 lines) -- main rendering loop, camera, viewport
- `mapviewCommon.ts` (800 lines) -- tile drawing, sprite management
- `tilespec.ts` (1,400 lines) -- tileset loading, sprite lookup
- `mapctrl.ts` (700 lines) -- mouse/touch input handling
- `tilesetConfig.ts` -- tileset metadata

### 5a: Pixi.js integration layer
1. Create `src/ts/renderer/PixiMapRenderer.ts`
2. Initialize Pixi.Application with WebGL backend, Canvas 2D fallback
3. Create sprite atlas from existing tileset images
4. Implement tile layer (terrain, specials, roads)
5. Implement unit layer (animated sprites)
6. Implement city layer (city sprites + labels)
7. Implement fog-of-war layer (alpha mask)

### 5b: Camera and viewport
1. Port viewport calculations from mapview.ts
2. Implement smooth scrolling with Pixi ticker
3. Implement zoom levels (0.5x, 1x, 2x)
4. Implement minimap rendering

### 5c: Input handling
1. Port mouse event handlers from mapctrl.ts
2. Implement touch gestures (pinch-zoom, drag-scroll)
3. Implement tile selection highlighting

### 5d: Performance targets
- 60 FPS on standard map (80x50)
- < 100ms initial render
- Smooth zoom/scroll transitions

---

## Step 6: State Management + Final Cleanup

**Goal**: Complete the Preact signals migration and clean up remaining technical debt.

### 6a: Expand signals layer
- Add signals for: selected unit, selected city, active dialog, chat messages
- Replace remaining window.xxx reads with signal subscriptions
- Ensure all Preact components use signals (no manual DOM reads)

### 6b: Remove window global bridge
- After globalRegistry is gone (Step 1) and all UI is Preact (Step 2):
  - Remove `syncStoreWithWindow()` from main.ts
  - Remove window property definitions from Step 0 in main.ts
  - Store becomes single source of truth

### 6c: Bundle optimization
- Tree-shake unused exports
- Code-split dialogs (lazy load on open)
- Target: < 300 KB gzip total (JS + CSS)

### 6d: Developer experience
- Add hot module replacement for Preact components
- Add source maps for production debugging
- Consider adding Preact DevTools integration

---

## Execution Order & Dependencies

```
Step 1 (globalRegistry) --- no dependencies, start immediately
       |
Step 2 (jQuery dialogs) --- can start after Step 1 Batch F (ui/)
       |
Step 3 (delete jQuery) ---- requires Step 2 complete
       |
Step 4 (CSS cleanup) ------ requires Step 2+3 complete
       |
Step 5 (Pixi.js) ---------- independent, can start after Step 1
       |
Step 6 (final cleanup) ---- requires Steps 1-4 complete
```

**Parallelizable**: Steps 1 + 5 can run in parallel. Step 2 can start mid-Step 1.

## Target Final State

| Metric | Before | After |
|--------|--------|-------|
| Total JS payload | ~1.7 MB | < 400 KB |
| Total CSS payload | 474 KB | < 80 KB |
| jQuery dependency | Yes | No |
| Legacy JS files | 26 | 0 |
| globalRegistry.ts | 2,543 lines | 0 |
| Rendering | Canvas 2D | WebGL (Pixi.js) |
| UI framework | jQuery UI | Preact |
| State management | window globals | Preact signals |
