import { store } from '../data/store';
import type { City, Tile, UnitType } from '../data/types';
import { cityOwner as city_owner, getCityProductionType as get_city_production_type } from '../data/city';
import { game_find_city_by_number as find_city_by_number } from '../data/game';
import { tileset_unit_type_graphic_tag } from '../renderer/tilespec';
import { tileset_ruleset_entity_tag_str_or_alt, get_city_flag_sprite, get_city_occupied_sprite } from '../renderer/tilespec';
import { orientation_changed } from '../utils/mobile';
import { mapview, mark_all_dirty } from './mapviewCommon';
import { tileset_tile_width, tileset_tile_height, normal_tile_width, tileset_image_count, tileset_name } from './tilesetConfig';
import { RENDERER_PIXI } from '../core/constants';
import { active_city, citydlg_map_width, citydlg_map_height } from '../ui/cityDialogState';
import { resize_enabled } from '../core/control/controlState';
import { overview_active } from '../core/overview';
import { chatbox_active } from '../core/messages';
import { setupWindowSize } from '../client/clientMain';
import { getTilesetFileExtension } from '../utils/helpers';
import { blockUI, unblockUI } from '../utils/dom';
import { swal } from '../components/Dialogs/SwalDialog';
import { VUT_UTYPE } from '../data/fcTypes';

// jQuery removed from this module

// DIR8 constants - must match map.ts Direction enum ordering
const DIR8_NORTH = 1;
const DIR8_EAST = 4;
const DIR8_SOUTH = 6;
const DIR8_WEST = 3;

let tileset_images: HTMLImageElement[] = [];
const sprites: { [key: string]: HTMLCanvasElement | ImageBitmap } = {};
let loaded_images: number = 0;
let sprites_loading: boolean = false;

export let sprites_init: boolean = false;

const fullfog: string[] = [];

const GOTO_DIR_DX: number[] = [0, 1, 2, -1, 1, -2, -1, 0];
const GOTO_DIR_DY: number[] = [-2, -1, 0, -1, 1, 0, 1, 2];

/**************************************************************************
  Initialize tileset sprites for the Pixi renderer.
  Sets up mapview origin, fog array, orientation, and starts async sprite loading.
  Does NOT create a 2D canvas or start an rAF loop.
**************************************************************************/
export function initTilesetSprites(): void {
  mapview['gui_x0'] = 0;
  mapview['gui_y0'] = 0;

  /* Initialize fog array. */
  let i: number;
  for (i = 0; i < 81; i++) {
    /* Unknown, fog, known. */
    const ids: string[] = ['u', 'f', 'k'];
    let buf: string = "t.fog";
    const values: number[] = [];
    let j: number, k: number = i;

    for (j = 0; j < 4; j++) {
      values[j] = k % 3;
      k = Math.floor(k / 3);

      buf += "_" + ids[values[j]];
    }

    fullfog[i] = buf;
  }
  store.fullfog = fullfog;

  orientation_changed();

  // Async fetch of tileset definition files.
  fetch('/javascript/2dcanvas/tileset_spec_amplio2.json')
    .then(r => {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.json();
    })
    .then((data: unknown) => {
      (window as unknown as Record<string, unknown>)['tileset'] = data;
      init_sprites();
    })
    .catch(err => { console.error('Failed to load tileset spec:', err); });
}


/**************************************************************************
  ...
**************************************************************************/
export function is_small_screen(): boolean {
  return window.innerWidth <= 640 || window.innerHeight <= 590;

}

/**************************************************************************
  This will load the tileset, blocking the UI while loading.
**************************************************************************/
export function init_sprites(): void {
  blockUI("<h1>Freeciv-web is loading. Please wait..."
      + "<br><center><img src='/images/loading.gif'></center></h1>");

  if (loaded_images != tileset_image_count) {
    for (let i = 0; i < tileset_image_count; i++) {
      const tileset_image = new Image();
      tileset_image.onload = preload_check;
      tileset_image.src = '/tileset/freeciv-web-tileset-'
        + tileset_name + '-' + i + getTilesetFileExtension() + '?ts=' + ((window as unknown as Record<string, unknown>)['ts'] ?? '');
      tileset_images[i] = tileset_image;
    }
  } else {
    // already loaded
    unblockUI();
  }

}

/**************************************************************************
  Determines when the whole tileset has been preloaded.
**************************************************************************/
export function preload_check(): void {
  loaded_images += 1;

  if (loaded_images == tileset_image_count) {
    init_cache_sprites();
    // unblockUI() is called inside init_cache_sprites() once sprites are ready
    // (async: in Promise.all().then(); sync fallback: directly after loop)
  }
}

/**************************************************************************
  ...
**************************************************************************/
export function init_cache_sprites(): void {
  // Guard: don't run until all tileset images have finished loading.
  if (loaded_images < tileset_image_count) return;
  // Prevent re-entry while async bitmaps are in flight, or after completion.
  if (sprites_loading || sprites_init) return;
  sprites_loading = true;

  if (typeof tileset === 'undefined') {
    swal('Tileset error', 'Tileset not generated correctly. Run sync.sh in freeciv-img-extract and recompile.', 'error');
    sprites_loading = false;
    return;
  }

  if (typeof createImageBitmap === 'function') {
    // Two-phase async approach:
    // Phase 1: Decode each full tileset image into an ImageBitmap ONCE.
    // Phase 2: Crop sprites from the already-decoded ImageBitmaps.
    const images = Array.from({ length: tileset_image_count }, (_, idx) => tileset_images[idx]);
    Promise.all(images.map(img => createImageBitmap(img)))
      .then((fullBitmaps: ImageBitmap[]) => {
        const BATCH = 200;
        const entries = Object.keys(tileset);
        const total = entries.length;

        const processBatch = (offset: number): Promise<void> => {
          const chunk = entries.slice(offset, offset + BATCH);
          const batchPromises = chunk.map(tile_tag => {
            const [x, y, w, h, i] = tileset[tile_tag] as [number, number, number, number, number];
            return createImageBitmap(fullBitmaps[i], x, y, w, h)
              .then((bmp: ImageBitmap) => { sprites[tile_tag] = bmp; })
              .catch(() => { /* skip missing sprite */ });
          });
          return Promise.all(batchPromises).then(() => {
            if (offset + BATCH < total) {
              return new Promise<void>(res => setTimeout(() => processBatch(offset + BATCH).then(res), 0));
            }
          });
        };

        return processBatch(0);
      })
      .then(() => {
        sprites_init = true;
        sprites_loading = false;
        store.sprites = sprites as Record<string, HTMLCanvasElement>;
        if (tileset) store.tileset = tileset;
        tileset_images = null!;
        unblockUI();
        console.log('[xbw] sprites loaded: ' + Object.keys(sprites).length);
        mark_all_dirty();
      })
      .catch(err => {
        console.error('createImageBitmap failed, falling back to canvas:', err);
        sprites_loading = false;
        init_cache_sprites_canvas();
      });
  } else {
    init_cache_sprites_canvas();
  }
}

/** Synchronous canvas-based sprite caching (fallback when createImageBitmap unavailable). */
function init_cache_sprites_canvas(): void {
  try {
    for (const tile_tag in tileset) {
      const x = tileset[tile_tag][0];
      const y = tileset[tile_tag][1];
      const w = tileset[tile_tag][2];
      const h = tileset[tile_tag][3];
      const i = tileset[tile_tag][4];
      const newCanvas = document.createElement('canvas');
      newCanvas.height = h;
      newCanvas.width = w;
      const newCtx = newCanvas.getContext('2d');
      if (newCtx) {
        newCtx.drawImage(tileset_images[i], x, y, w, h, 0, 0, w, h);
        sprites[tile_tag] = newCanvas;
      }
    }
    sprites_init = true;
    sprites_loading = false;
    store.sprites = sprites as Record<string, HTMLCanvasElement>;
    if (tileset) store.tileset = tileset;
    tileset_images = null!;
    console.log('[xbw] sprites loaded (canvas fallback): ' + Object.keys(sprites).length);
    mark_all_dirty();
  } catch (e: unknown) {
    console.log("Problem caching sprite: " + (e instanceof Error ? e.message : e));
    sprites_loading = false;
  }
  unblockUI();
}

/**************************************************************************
  ...
**************************************************************************/
export function mapview_window_resized(): void {
  if (active_city != null || !resize_enabled) return;
  setupWindowSize();
  const pr = (store as unknown as Record<string, unknown>)['pixiRenderer'] as { resize(): void; markAllDirty(): void } | undefined;
  pr?.resize();
  pr?.markAllDirty();
}

/**************************************************************************
  ...
**************************************************************************/
export function set_city_mapview_active(): void {
  mapview['width'] = citydlg_map_width;
  mapview['height'] = citydlg_map_height;
  mapview['store_width'] = citydlg_map_width;
  mapview['store_height'] = citydlg_map_height;

  set_default_mapview_inactive();
}

/**************************************************************************
  ...
**************************************************************************/
export function set_default_mapview_inactive(): void {
  if (overview_active) {
    const op = document.getElementById('game_overview_panel');
    if (op?.parentElement) op.parentElement.style.display = 'none';
  }
  const up = document.getElementById('game_unit_panel');
  if (up?.parentElement) up.parentElement.style.display = 'none';
  if (chatbox_active) {
    const cp = document.getElementById('game_chatbox_panel');
    if (cp?.parentElement) cp.parentElement.style.display = 'none';
  }
}
