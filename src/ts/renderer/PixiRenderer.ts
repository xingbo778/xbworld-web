/**
 * PixiJS-based WebGL map renderer.
 *
 * Strategy: reuse fill_sprite_array() (the canonical 2D-canvas sprite logic)
 * as the data source. PixiRenderer is a pure "rendering backend" that maps
 * SpriteEntry[] → Pixi.js display objects, gaining GPU sprite-batching with
 * zero duplication of game logic.
 *
 * Architecture:
 *   - 13 ordered layer Containers (painter's algorithm)
 *   - Per-tile Containers within each layer, positioned at GUI coordinates
 *   - mapContainer offset = -mapview.gui_x0/-gui_y0 → O(1) panning
 *   - Texture cache: store.sprites[key] → Pixi Texture (on-demand)
 *   - Dirty-tile system: only rebuild changed tiles
 *   - Fog: solid diamond overlay for TILE_KNOWN_UNSEEN interior
 *          + corner fog sprites (t.fog_*) for smooth visibility boundaries
 */

import { Application, Container, Sprite, Texture, Graphics, Text, TextStyle } from 'pixi.js';
import { store } from '../data/store';
import { globalEvents } from '../core/events';
import { TILE_KNOWN_UNSEEN, TILE_UNKNOWN, tileGetKnown, tileCity } from '../data/tile';
import { logNormal, logError } from '../core/log';
import type { Tile, City } from '../data/types';
import { fill_sprite_array, fill_fog_sprite_array, LAYER_COUNT, type SpriteEntry } from './tilespec';
import { mapview } from './mapviewCommon';
import { map_to_gui_pos } from './mapCoords';
import { mapstep } from '../data/map';
import { tileset_tile_width, tileset_tile_height } from './tilesetConfig';
import { get_drawable_unit } from '../core/control/unitFocus';
import { clearBlendCache } from './terrainBlendGen';
import { draw_fog_of_war } from '../ui/options';
import { clientState, C_S_RUNNING } from '../client/clientState';

// LAYER_FOG = 8 (from tilespec.ts)
const LAYER_FOG_INDEX = 8;

// DIR8 values used for corner fog cluster (E/S/SE neighbors of current tile)
const DIR8_EAST = 4;
const DIR8_SOUTH = 6;
const DIR8_SOUTHEAST = 7;

export interface RendererConfig {
  container: HTMLElement;
}

export class PixiRenderer {
  private app!: Application;

  // mapContainer offset implements O(1) panning: x = -gui_x0, y = -gui_y0
  private mapContainer!: Container;

  // 13 layer Containers in painter's-algorithm draw order
  private layers: Container[] = [];

  // Per-tile-per-layer display containers
  // key: tileIndex * LAYER_COUNT + layer → Container holding that tile's sprites
  private tileLayerContainers = new Map<number, Container>();

  // Texture cache: sprite key → Pixi Texture (created from store.sprites)
  private texCache = new Map<string, Texture | null>();

  // Pre-rendered fog overlay texture (created once, reused as Sprite per fogged tile)
  private fogTexture: Texture | null = null;

  // Dirty tracking
  private dirtyTiles = new Set<number>();
  private dirtyAll = true; // start dirty so first game-state render works
  // Set by pan-reveal timer; processFrame handles the scan inside rAF (not blocking main thread).
  private revealAll = false;

  // Tracks which tile indices have been rendered at least once.
  // Pan-reveal only builds tiles NOT in this set (incremental).
  // Cleared on markAllDirty so the next dirtyAll rebuild re-populates it.
  private builtSet = new Set<number>();

  // Tile GUI position cache: avoids re-running map_to_gui_pos() on each scan.
  // Positions are stable (only change if tileset config changes, handled by markAllDirty).
  private readonly tilePosCache = new Map<number, readonly [number, number]>();

  // Viewport-culled rebuild queue (only visible tiles are rebuilt per event)
  private rebuildQueue: Tile[] | null = null;
  private rebuildQueueIdx = 0;
  private static readonly REBUILD_PER_FRAME = 100;

  // Viewport tracking for pan-reveal (rebuild after pan stops)
  private lastViewX0 = 0;
  private lastViewY0 = 0;
  private lastViewW = 0;
  private lastViewH = 0;
  private panRevealTimer: ReturnType<typeof setTimeout> | null = null;
  private static readonly PAN_REVEAL_DELAY_MS = 150;

  private rafHandle: number | null = null;
  private initialized = false;
  private spritesReady = false; // cached: avoids Object.keys(store.sprites) every frame

  constructor(private config: RendererConfig) {}

  // ---------------------------------------------------------------------------
  // Init
  // ---------------------------------------------------------------------------

  async init(): Promise<void> {
    this.app = new Application();
    await this.app.init({
      resizeTo: this.config.container,
      backgroundColor: 0x000000,
      antialias: false,
      resolution: window.devicePixelRatio || 1,
      autoDensity: true,
    });

    this.config.container.appendChild(this.app.canvas as HTMLCanvasElement);

    this.mapContainer = new Container();
    this.app.stage.addChild(this.mapContainer);

    for (let i = 0; i < LAYER_COUNT; i++) {
      const layer = new Container();
      this.layers.push(layer);
      this.mapContainer.addChild(layer);
    }

    this.setupEventListeners();
    this.startRenderLoop();
    this.initialized = true;
    this.createFogTexture();

    logNormal('PixiJS renderer initialized');
  }

  // ---------------------------------------------------------------------------
  // Texture cache
  // ---------------------------------------------------------------------------

  private getTexture(key: string): Texture | null {
    if (this.texCache.has(key)) return this.texCache.get(key)!;

    const sp = (store.sprites as Record<string, HTMLCanvasElement | ImageBitmap>)[key];
    if (!sp) {
      this.texCache.set(key, null);
      return null;
    }

    try {
      // Pixi v8: Texture.from() accepts ImageBitmap and HTMLCanvasElement
      const tex = Texture.from(sp as Parameters<typeof Texture.from>[0]);
      this.texCache.set(key, tex);
      return tex;
    } catch (e) {
      logError('PixiRenderer: texture creation failed for', key, e);
      this.texCache.set(key, null);
      return null;
    }
  }

  /** Must be called when store.sprites is replaced (new game / reload). */
  clearTextureCache(): void {
    for (const tex of this.texCache.values()) {
      if (tex) tex.destroy();
    }
    this.texCache.clear();
    // Clear A2 blend sprites so they are regenerated from the new tileset.
    clearBlendCache();
    // tilePosCache is NOT cleared: tile x/y→GUI positions are stable across sprite reloads.
  }

  // ---------------------------------------------------------------------------
  // Tile layer container management
  // ---------------------------------------------------------------------------

  private getTileLayerContainer(tileIndex: number, layer: number): Container {
    const key = tileIndex * LAYER_COUNT + layer;
    let c = this.tileLayerContainers.get(key);
    if (!c) {
      c = new Container();
      this.layers[layer].addChild(c);
      this.tileLayerContainers.set(key, c);
    }
    return c;
  }

  private clearTileLayer(tileIndex: number, layer: number): void {
    const c = this.tileLayerContainers.get(tileIndex * LAYER_COUNT + layer);
    if (c) c.removeChildren().forEach(ch => ch.destroy({ children: true }));
  }

  // ---------------------------------------------------------------------------
  // SpriteEntry rendering
  // ---------------------------------------------------------------------------

  private renderSpriteEntry(
    entry: SpriteEntry,
    baseGX: number,
    baseGY: number,
    container: Container,
    fogAlpha: number,
  ): void {
    const e = entry as Record<string, unknown>;
    const ox = typeof e['offset_x'] === 'number' ? (e['offset_x'] as number) : 0;
    const oy = typeof e['offset_y'] === 'number' ? (e['offset_y'] as number) : 0;

    switch (e['key']) {
      case 'city_text':
        this.renderCityBar(e['city'] as City, baseGX + ox, baseGY + oy, container);
        break;
      case 'border':
        this.renderBorder(e['dir'] as number, e['color'] as string, baseGX, baseGY, container);
        break;
      case 'goto_line':
        this.renderGotoLine(e['goto_dir'] as number, baseGX, baseGY, container);
        break;
      case 'tile_label':
        this.renderTileLabel(e['tile'] as Tile, baseGX + ox, baseGY + oy, container);
        break;
      case null:
      case undefined:
      case '':
        break;
      default: {
        const tex = this.getTexture(e['key'] as string);
        if (tex) {
          const sp = new Sprite(tex);
          sp.x = baseGX + ox;
          sp.y = baseGY + oy;
          sp.alpha = fogAlpha;
          container.addChild(sp);
        }
        break;
      }
    }
  }

  private static readonly CITY_TEXT_STYLE = new TextStyle({
    fontSize: 11,
    fill: '#ffffff',
    fontFamily: 'Arial, sans-serif',
    stroke: { color: '#000000', width: 2 },
  });
  private static readonly LABEL_TEXT_STYLE = new TextStyle({
    fontSize: 10,
    fill: '#ffff00',
    fontFamily: 'Arial, sans-serif',
  });

  private renderCityBar(city: City, x: number, y: number, container: Container): void {
    if (!city) return;
    const c = city as Record<string, unknown>;
    const name = (c['name'] as string) ?? '';
    const size = (c['size'] as number) ?? 0;
    const t = new Text({ text: `${name} (${size})`, style: PixiRenderer.CITY_TEXT_STYLE });
    t.x = x;
    t.y = y;
    container.addChild(t);
  }

  private renderTileLabel(tile: Tile, x: number, y: number, container: Container): void {
    const label = (tile as Record<string, unknown>)['label'] as string;
    if (!label) return;
    const t = new Text({ text: label, style: PixiRenderer.LABEL_TEXT_STYLE });
    t.x = x;
    t.y = y;
    container.addChild(t);
  }

  private renderBorder(
    dir: number,
    colorStr: string,
    baseGX: number,
    baseGY: number,
    container: Container,
  ): void {
    const tw = tileset_tile_width;
    const th = tileset_tile_height;
    const hw = tw / 2, hh = th / 2;
    const color = this.parseCSSColor(colorStr);
    const g = new Graphics();

    // Each border segment is one edge of the isometric diamond
    // DIR8: N=1, E=4, S=6, W=3
    switch (dir) {
      case 1: g.moveTo(baseGX + hw, baseGY).lineTo(baseGX + tw, baseGY + hh); break;
      case 4: g.moveTo(baseGX + tw, baseGY + hh).lineTo(baseGX + hw, baseGY + th); break;
      case 6: g.moveTo(baseGX + hw, baseGY + th).lineTo(baseGX, baseGY + hh); break;
      case 3: g.moveTo(baseGX, baseGY + hh).lineTo(baseGX + hw, baseGY); break;
    }
    g.stroke({ width: 2, color });
    container.addChild(g);
  }

  private renderGotoLine(
    gotoDir: number,
    baseGX: number,
    baseGY: number,
    container: Container,
  ): void {
    if (gotoDir == null) return;
    const tw = tileset_tile_width, th = tileset_tile_height;
    const hw = tw / 2, hh = th / 2;
    const cx = baseGX + hw, cy = baseGY + hh;

    // Half-tile offsets per DIR8 direction
    const offsets: Record<number, [number, number]> = {
      0: [-hw, -hh], 1: [0, -th], 2: [hw, -hh],
      3: [-tw, 0],               4: [tw, 0],
      5: [-hw,  hh], 6: [0,  th], 7: [hw,  hh],
    };
    const off = offsets[gotoDir];
    if (!off) return;

    const g = new Graphics();
    g.moveTo(cx, cy).lineTo(cx + off[0] * 0.7, cy + off[1] * 0.7);
    g.stroke({ width: 2, color: 0xffffff, alpha: 0.85 });
    container.addChild(g);
  }

  /**
   * Add a corner fog sprite for the SE cluster of this tile.
   *
   * Each tile is the NW tile of one corner cluster: {self, E, S, SE}.
   * fill_fog_sprite_array() computes the visibility combination and returns
   * the matching t.fog_* key from store.fullfog. The resulting sprite is
   * drawn at (gx, gy) — the tile's GUI position. The sprite image covers
   * only the SE quadrant of the isometric diamond, so adjacent tiles' corner
   * sprites together provide complete smooth fog coverage.
   *
   * Returns without drawing if all 4 cluster tiles are known-seen (no fog).
   */
  private addCornerFogSprite(tile: Tile, gx: number, gy: number, layer: number): void {
    const eN = mapstep(tile, DIR8_EAST);
    const sN = mapstep(tile, DIR8_SOUTH);
    const seN = mapstep(tile, DIR8_SOUTHEAST);
    const pcorner = { tile: [tile as Tile | null, eN, sN, seN] };

    const entries = fill_fog_sprite_array(null, null, pcorner);
    if (entries.length === 0) return;

    const key = entries[0].key;
    if (!key) return;

    const tex = this.getTexture(key as string);
    if (!tex) return;

    const c = this.getTileLayerContainer(tile.index, layer);
    const sp = new Sprite(tex);
    sp.x = gx;
    sp.y = gy;
    c.addChild(sp);
  }

  /** Create a shared fog texture once. Reused as Sprite per fogged tile (~2µs vs ~20µs for Graphics). */
  private createFogTexture(): void {
    const tw = tileset_tile_width, th = tileset_tile_height;
    const hw = tw / 2, hh = th / 2;
    const g = new Graphics();
    g.poly([hw, 0, tw, hh, hw, th, 0, hh]).fill({ color: 0x000000, alpha: 0.45 });
    try {
      this.fogTexture = this.app.renderer.generateTexture({ target: g, resolution: 1 });
    } catch {
      this.fogTexture = null; // fallback: fog simply won't render
    }
    g.destroy();
  }

  private addFogOverlay(gx: number, gy: number, container: Container): void {
    if (!this.fogTexture) return;
    const sp = new Sprite(this.fogTexture);
    sp.x = gx;
    sp.y = gy;
    container.addChild(sp);
  }

  private parseCSSColor(color: string): number {
    const hex = color.startsWith('#') ? color.slice(1) : '';
    if (/^[0-9a-f]{6}$/i.test(hex)) return parseInt(hex, 16);
    const rgb = color.match(/\d+/g);
    if (rgb && rgb.length >= 3) {
      return (parseInt(rgb[0]) << 16) | (parseInt(rgb[1]) << 8) | parseInt(rgb[2]);
    }
    return 0xffffff;
  }

  // ---------------------------------------------------------------------------
  // Per-tile rebuild
  // ---------------------------------------------------------------------------

  private rebuildTile(tile: Tile): void {
    const known = tileGetKnown(tile);

    if (known === TILE_UNKNOWN) {
      for (let l = 0; l < LAYER_COUNT; l++) this.clearTileLayer(tile.index, l);
      return;
    }

    // Use tilePosCache (populated during processFrame scan); recompute only if missing.
    let gx: number, gy: number;
    const cached = this.tilePosCache.get(tile.index);
    if (cached) {
      gx = cached[0]; gy = cached[1];
    } else {
      const pos = map_to_gui_pos(tile.x, tile.y);
      gx = pos['gui_dx'] as number; gy = pos['gui_dy'] as number;
      this.tilePosCache.set(tile.index, [gx, gy]);
    }
    const fog = draw_fog_of_war && known === TILE_KNOWN_UNSEEN;
    const fogAlpha = fog ? 0.5 : 1.0;
    const punit = get_drawable_unit(tile, false);
    const pcity = tileCity(tile);

    for (let layer = 0; layer < LAYER_COUNT; layer++) {
      this.clearTileLayer(tile.index, layer);

      if (layer === LAYER_FOG_INDEX) {
        // 1. Solid overlay for TILE_KNOWN_UNSEEN interior (keeps deeply-fogged
        //    tiles dark even before all 4 neighboring corner sprites are built).
        if (fog) {
          const c = this.getTileLayerContainer(tile.index, layer);
          this.addFogOverlay(gx, gy, c);
        }
        // 2. Corner fog sprite: smooth visibility transition at fog boundaries.
        //    Each tile "owns" the SE corner cluster where it is the NW tile.
        //    pcorner.tile = [self(NW), E(NE), S(SW), SE] → fullfog key lookup.
        this.addCornerFogSprite(tile, gx, gy, layer);
        continue;
      }

      const entries = fill_sprite_array(layer, tile, null, null, punit, pcity, false);
      if (entries.length === 0) continue;

      const c = this.getTileLayerContainer(tile.index, layer);
      for (const entry of entries) {
        this.renderSpriteEntry(entry, gx, gy, c, fogAlpha);
      }
    }
  }

  // ---------------------------------------------------------------------------
  // Texture pre-warming
  // ---------------------------------------------------------------------------

  /**
   * Pre-upload frequently-used sprites to GPU on first sprite-ready frame.
   * Without this, first encounters trigger synchronous GPU texture uploads,
   * causing large frame spikes during initial exploration.
   * Called once when store.sprites becomes available.
   */
  private preWarmCommonTextures(): void {
    // Road / rail direction sprites (9 per type × 2 types = 18)
    const dirs = ['n', 'ne', 'e', 'se', 's', 'sw', 'w', 'nw'];
    for (const prefix of ['road.road', 'road.rail']) {
      this.getTexture(`${prefix}_isolated`);
      for (const d of dirs) this.getTexture(`${prefix}_${d}`);
    }

    // Corner fog sprites: t.fog_X_X_X_X for all 80 valid combinations.
    // Matches the fullfog array construction in initTilesetSprites().
    const ids = ['u', 'f', 'k'];
    for (let i = 0; i < 80; i++) {
      let k = i;
      let key = 't.fog';
      for (let j = 0; j < 4; j++) { key += '_' + ids[k % 3]; k = Math.floor(k / 3); }
      this.getTexture(key);
    }

    // Force GPU upload of all newly-created textures now (before initial tile build).
    // Pixi defers GPU uploads until first render — without this, the first frame
    // that includes road/fog sprites triggers a large synchronous GPU batch upload.
    this.forceGPUUpload();
  }

  /**
   * Force Pixi to upload all cached textures to GPU immediately.
   * Renders a tiny off-screen scene containing all cached sprites.
   * Cost: one-time ~10ms during game start; prevents mid-game upload spikes.
   */
  private forceGPUUpload(): void {
    const tmp = new Container();
    tmp.x = -999999; tmp.y = -999999;
    for (const tex of this.texCache.values()) {
      if (tex) tmp.addChild(new Sprite(tex));
    }
    try {
      this.app.renderer.render({ container: tmp });
    } catch { /* non-fatal */ }
    tmp.destroy({ children: true });
  }

  // ---------------------------------------------------------------------------
  // Render loop
  // ---------------------------------------------------------------------------

  private processFrame(): void {
    if (!store.tiles || clientState() < C_S_RUNNING) return;
    if (!this.spritesReady) {
      if (!store.sprites || Object.keys(store.sprites).length === 0) return;
      this.spritesReady = true; // cache once — sprites don't change after load
      this.preWarmCommonTextures();
    }

    // O(1) panning: shift the entire map container
    this.mapContainer.x = -mapview['gui_x0'];
    this.mapContainer.y = -mapview['gui_y0'];

    // Update minimap at rAF frequency (not per-mousemove).
    globalEvents.emit('overview:frame', null);

    const gx0 = mapview['gui_x0'] as number;
    const gy0 = mapview['gui_y0'] as number;
    const gw = this.app.screen.width;
    const gh = this.app.screen.height;

    // On dirtyAll or revealAll: scan visible tiles and queue a rebuild.
    // Uses tilePosCache so subsequent scans are O(n) Map lookups (<5ms) after first call.
    // dirtyAll = full rebuild (clears builtSet); revealAll = incremental (skips already-built).
    if ((this.dirtyAll || this.revealAll) && !this.rebuildQueue) {
      const margin = tileset_tile_width * 2;
      const tilesMap = store.tiles as Record<number, Tile>;
      const visible: Tile[] = [];
      const isRevealOnly = this.revealAll && !this.dirtyAll;
      for (const tile of Object.values(tilesMap)) {
        if (!tile) continue;
        if (isRevealOnly && this.builtSet.has(tile.index)) continue;
        // Use cached position; compute and cache on first encounter.
        let tx: number, ty: number;
        const cached = this.tilePosCache.get(tile.index);
        if (cached) {
          tx = cached[0]; ty = cached[1];
        } else {
          const pos = map_to_gui_pos(tile.x, tile.y);
          tx = pos['gui_dx'] as number;
          ty = pos['gui_dy'] as number;
          this.tilePosCache.set(tile.index, [tx, ty]);
        }
        if (tx >= gx0 - margin && tx < gx0 + gw + margin &&
            ty >= gy0 - margin && ty < gy0 + gh + margin) {
          visible.push(tile);
        }
      }
      this.rebuildQueue = visible;
      this.rebuildQueueIdx = 0;
      if (this.dirtyAll) {
        this.dirtyTiles.clear();
        this.builtSet.clear();
        this.dirtyAll = false;
      }
      this.revealAll = false;
      this.lastViewX0 = gx0;
      this.lastViewY0 = gy0;
      this.lastViewW = gw;
      this.lastViewH = gh;
    }

    // Detect viewport pan → debounce incremental build of newly-revealed tiles.
    // Timer callback is O(1); the actual scan runs in the next rAF frame (revealAll flag).
    if (!this.rebuildQueue && !this.dirtyAll && !this.revealAll) {
      const viewChanged = gx0 !== this.lastViewX0 || gy0 !== this.lastViewY0 ||
                          gw !== this.lastViewW || gh !== this.lastViewH;
      if (viewChanged) {
        this.lastViewX0 = gx0;
        this.lastViewY0 = gy0;
        this.lastViewW = gw;
        this.lastViewH = gh;
        if (this.panRevealTimer !== null) clearTimeout(this.panRevealTimer);
        this.panRevealTimer = setTimeout(() => {
          this.panRevealTimer = null;
          this.revealAll = true; // processFrame handles the scan in the next rAF
        }, PixiRenderer.PAN_REVEAL_DELAY_MS);
      }
    }

    // Drain dirty tiles in chunks (prevents long tasks if many tiles dirtied by pan-reveal).
    if (!this.rebuildQueue && this.dirtyTiles.size > 0) {
      const tilesMap = store.tiles as Record<number, Tile>;
      let count = 0;
      for (const idx of this.dirtyTiles) {
        this.dirtyTiles.delete(idx);
        const tile = tilesMap[idx];
        if (tile) {
          this.rebuildTile(tile);
          this.builtSet.add(idx);
        }
        if (++count >= PixiRenderer.REBUILD_PER_FRAME) break;
      }
    }

    // Process a chunk of the viewport-culled rebuild queue
    if (this.rebuildQueue) {
      const end = Math.min(this.rebuildQueueIdx + PixiRenderer.REBUILD_PER_FRAME, this.rebuildQueue.length);
      for (let i = this.rebuildQueueIdx; i < end; i++) {
        const tile = this.rebuildQueue[i];
        this.rebuildTile(tile);
        this.builtSet.add(tile.index);
      }
      this.rebuildQueueIdx = end;
      if (this.rebuildQueueIdx >= this.rebuildQueue.length) {
        this.rebuildQueue = null;
        this.rebuildQueueIdx = 0;
      }
    }
  }

  private startRenderLoop(): void {
    const loop = (): void => {
      this.processFrame();
      this.rafHandle = requestAnimationFrame(loop);
    };
    this.rafHandle = requestAnimationFrame(loop);
  }

  // ---------------------------------------------------------------------------
  // Dirty API (called by game event handlers)
  // ---------------------------------------------------------------------------

  markDirty(tileIndex: number): void {
    if (!this.dirtyAll) this.dirtyTiles.add(tileIndex);
  }

  markAllDirty(): void {
    this.dirtyAll = true;  // processFrame will start a viewport-culled rebuild when current finishes
    this.revealAll = false; // dirtyAll supersedes revealAll
    this.dirtyTiles.clear();
    this.builtSet.clear();  // force all tiles to be rebuilt from scratch
    // Don't restart an in-progress rebuild — let it finish, then re-check dirtyAll
  }

  // ---------------------------------------------------------------------------
  // Event listeners
  // ---------------------------------------------------------------------------

  private setupEventListeners(): void {
    globalEvents.on('tile:updated', (data: unknown) => {
      const d = data as Record<string, unknown> | null;
      const idx = d?.['tileIndex'] ?? (d?.['tile'] as Record<string, unknown> | undefined)?.['index'];
      typeof idx === 'number' ? this.markDirty(idx) : this.markAllDirty();
    });
    globalEvents.on('unit:updated', (data: unknown) => {
      const tileIdx = (data as Record<string, unknown> | null)?.['tile'];
      typeof tileIdx === 'number' ? this.markDirty(tileIdx) : this.markAllDirty();
    });
    globalEvents.on('unit:removed', (data: unknown) => {
      const tileIdx = (data as Record<string, unknown> | null)?.['tile'];
      typeof tileIdx === 'number' ? this.markDirty(tileIdx) : this.markAllDirty();
    });
    globalEvents.on('city:updated', (data: unknown) => {
      const tileIdx = (data as Record<string, unknown> | null)?.['tile'];
      typeof tileIdx === 'number' ? this.markDirty(tileIdx) : this.markAllDirty();
    });
    globalEvents.on('city:removed', (data: unknown) => {
      const tileIdx = (data as Record<string, unknown> | null)?.['tile'];
      typeof tileIdx === 'number' ? this.markDirty(tileIdx) : this.markAllDirty();
    });
    globalEvents.on('map:allocated', () => {
      this.clearTextureCache();
      this.markAllDirty();
    });
    // game:beginturn: individual tile/unit/city events already handle dirty marking per-packet,
    // so a full markAllDirty here would cause unnecessary expensive rebuilds every turn.
    // Instead, only refresh tiles that were NOT yet built (incrementally reveal newly-known tiles).
    globalEvents.on('game:beginturn', () => { this.revealAll = true; });

    window.addEventListener('resize', () => {
      this.app.resize();
      this.markAllDirty();
    });
  }

  // ---------------------------------------------------------------------------
  // View control
  // ---------------------------------------------------------------------------

  centerOnTile(tile: Tile): void {
    const pos = map_to_gui_pos(tile.x, tile.y);
    mapview['gui_x0'] = pos['gui_dx'] - this.app.screen.width / 2;
    mapview['gui_y0'] = pos['gui_dy'] - this.app.screen.height / 2;
  }

  resize(): void {
    this.app.resize();
  }

  destroy(): void {
    if (this.rafHandle != null) cancelAnimationFrame(this.rafHandle);
    this.clearTextureCache();
    this.fogTexture?.destroy();
    this.fogTexture = null;
    this.app.destroy(true);
  }
}
