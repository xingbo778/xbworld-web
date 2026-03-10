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
 *   - Fog: simple diamond overlay for TILE_KNOWN_UNSEEN (corner fog = TODO)
 */

import { Application, Container, Sprite, Texture, Graphics, Text, TextStyle } from 'pixi.js';
import { store } from '../data/store';
import { globalEvents } from '../core/events';
import { TILE_KNOWN_UNSEEN, TILE_UNKNOWN, tileGetKnown, tileCity } from '../data/tile';
import { logNormal, logError } from '../core/log';
import type { Tile, City } from '../data/types';
import { fill_sprite_array, LAYER_COUNT, type SpriteEntry } from './tilespec';
import { mapview } from './mapviewCommon';
import { map_to_gui_pos } from './mapCoords';
import { tileset_tile_width, tileset_tile_height } from './tilesetConfig';
import { get_drawable_unit } from '../core/control/unitFocus';
import { draw_fog_of_war } from '../ui/options';
import { clientState, C_S_RUNNING } from '../client/clientState';

// LAYER_FOG = 8 (from tilespec.ts — skipped for corner-based rendering)
const LAYER_FOG_INDEX = 8;

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
  // key: `${tileIndex}_${layer}` → Container holding that tile's sprites
  private tileLayerContainers = new Map<string, Container>();

  // Texture cache: sprite key → Pixi Texture (created from store.sprites)
  private texCache = new Map<string, Texture | null>();

  // Dirty tracking
  private dirtyTiles = new Set<number>();
  private dirtyAll = true; // start dirty so first game-state render works

  private rafHandle: number | null = null;
  private initialized = false;

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
  }

  // ---------------------------------------------------------------------------
  // Tile layer container management
  // ---------------------------------------------------------------------------

  private getTileLayerContainer(tileIndex: number, layer: number): Container {
    const key = `${tileIndex}_${layer}`;
    let c = this.tileLayerContainers.get(key);
    if (!c) {
      c = new Container();
      this.layers[layer].addChild(c);
      this.tileLayerContainers.set(key, c);
    }
    return c;
  }

  private clearTileLayer(tileIndex: number, layer: number): void {
    const c = this.tileLayerContainers.get(`${tileIndex}_${layer}`);
    if (c) c.removeChildren().forEach(ch => (ch as Container).destroy({ children: true }));
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

  private renderCityBar(city: City, x: number, y: number, container: Container): void {
    if (!city) return;
    const c = city as Record<string, unknown>;
    const name = (c['name'] as string) ?? '';
    const size = (c['size'] as number) ?? 0;
    const style = new TextStyle({
      fontSize: 11,
      fill: '#ffffff',
      fontFamily: 'Arial, sans-serif',
      stroke: { color: '#000000', width: 2 },
    });
    const t = new Text({ text: `${name} (${size})`, style });
    t.x = x;
    t.y = y;
    container.addChild(t);
  }

  private renderTileLabel(tile: Tile, x: number, y: number, container: Container): void {
    const label = (tile as Record<string, unknown>)['label'] as string;
    if (!label) return;
    const style = new TextStyle({ fontSize: 10, fill: '#ffff00', fontFamily: 'Arial, sans-serif' });
    const t = new Text({ text: label, style });
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

  private addFogOverlay(gx: number, gy: number, container: Container): void {
    const tw = tileset_tile_width, th = tileset_tile_height;
    const hw = tw / 2, hh = th / 2;
    const g = new Graphics();
    // Diamond-shaped semi-transparent dark overlay
    g.poly([gx + hw, gy, gx + tw, gy + hh, gx + hw, gy + th, gx, gy + hh])
      .fill({ color: 0x000000, alpha: 0.45 });
    container.addChild(g);
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

    const pos = map_to_gui_pos(tile.x, tile.y);
    const gx = pos['gui_dx'];
    const gy = pos['gui_dy'];
    const fog = draw_fog_of_war && known === TILE_KNOWN_UNSEEN;
    const fogAlpha = fog ? 0.5 : 1.0;
    const punit = get_drawable_unit(tile, false);
    const pcity = tileCity(tile);

    for (let layer = 0; layer < LAYER_COUNT; layer++) {
      this.clearTileLayer(tile.index, layer);

      if (layer === LAYER_FOG_INDEX) {
        // Corner-based fog sprites require pcorner iteration (TODO Phase 1.5).
        // For now: draw a simple overlay on fogged tiles.
        if (fog) {
          const c = this.getTileLayerContainer(tile.index, layer);
          this.addFogOverlay(gx, gy, c);
        }
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
  // Render loop
  // ---------------------------------------------------------------------------

  private processFrame(): void {
    if (!store.tiles || clientState() < C_S_RUNNING) return;
    if (!store.sprites || Object.keys(store.sprites).length === 0) return;

    // O(1) panning: shift the entire map container
    this.mapContainer.x = -mapview['gui_x0'];
    this.mapContainer.y = -mapview['gui_y0'];

    // Update minimap at rAF frequency (not per-mousemove).
    globalEvents.emit('overview:frame', null);

    const tiles = store.tiles as Tile[];

    if (this.dirtyAll) {
      for (const tile of tiles) {
        if (tile) this.rebuildTile(tile);
      }
      this.dirtyAll = false;
      this.dirtyTiles.clear();
    } else if (this.dirtyTiles.size > 0) {
      for (const idx of this.dirtyTiles) {
        const tile = tiles[idx];
        if (tile) this.rebuildTile(tile);
      }
      this.dirtyTiles.clear();
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
    this.dirtyAll = true;
    this.dirtyTiles.clear();
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
    globalEvents.on('unit:updated', () => this.markAllDirty());
    globalEvents.on('unit:removed', () => this.markAllDirty());
    globalEvents.on('city:updated', () => this.markAllDirty());
    globalEvents.on('city:removed', () => this.markAllDirty());
    globalEvents.on('map:allocated', () => {
      this.clearTextureCache();
      this.markAllDirty();
    });
    globalEvents.on('game:beginturn', () => this.markAllDirty());

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
    this.app.destroy(true);
  }
}
