/**
 * Sprite getter functions for UI dialogs — units, improvements, techs, treaties, specialists.
 * Extracted from tilespec.ts to decouple UI rendering from map tile rendering.
 */
import { unit_type } from '../data/unit';
import { tileset_name } from './tilesetConfig';
import { tileset_unit_type_graphic_tag, tileset_building_graphic_tag, tileset_tech_graphic_tag } from './tilespec';
import { getTilesetFileExtension } from '../utils/helpers';
import { store } from '../data/store';
import type { Unit, UnitType } from '../data/types';

export interface SpriteInfo {
  tag: string;
  "image-src": string;
  "tileset-x": number;
  "tileset-y": number;
  width: number;
  height: number;
}

const _ts = Date.now();

export function get_unit_image_sprite(punit: Unit): SpriteInfo | null {
  const utype = unit_type(punit);
  if (utype == null) return null;
  const from_type = get_unit_type_image_sprite(utype);
  if (from_type == null) return null;
  from_type["height"] = from_type["height"] - 2;
  return from_type;
}

export function get_unit_type_image_sprite(punittype: UnitType): SpriteInfo | null {
  const tag = tileset_unit_type_graphic_tag(punittype);
  if (tag == null) return null;

  const tileset_x = store.tileset[tag][0];
  const tileset_y = store.tileset[tag][1];
  const width = store.tileset[tag][2];
  const height = store.tileset[tag][3];
  const i = store.tileset[tag][4];
  return {
    "tag": tag,
    "image-src": "/tileset/freeciv-web-tileset-" + tileset_name + "-" + i + getTilesetFileExtension() + "?ts=" + _ts,
    "tileset-x": tileset_x,
    "tileset-y": tileset_y,
    "width": width,
    "height": height
  };
}

export function get_improvement_image_sprite(pimprovement: { graphic_str: string; graphic_alt: string; name: string } | null): SpriteInfo | null {
  const tag = tileset_building_graphic_tag(pimprovement);
  if (tag == null) return null;

  const tileset_x = store.tileset[tag][0];
  const tileset_y = store.tileset[tag][1];
  const width = store.tileset[tag][2];
  const height = store.tileset[tag][3];
  const i = store.tileset[tag][4];
  return {
    "tag": tag,
    "image-src": "/tileset/freeciv-web-tileset-" + tileset_name + "-" + i + getTilesetFileExtension() + "?ts=" + _ts,
    "tileset-x": tileset_x,
    "tileset-y": tileset_y,
    "width": width,
    "height": height
  };
}

export function get_specialist_image_sprite(tag: string): SpriteInfo | null {
  if (store.tileset[tag] == null) return null;

  const tileset_x = store.tileset[tag][0];
  const tileset_y = store.tileset[tag][1];
  const width = store.tileset[tag][2];
  const height = store.tileset[tag][3];
  const i = store.tileset[tag][4];
  return {
    "tag": tag,
    "image-src": "/tileset/freeciv-web-tileset-" + tileset_name + "-" + i + getTilesetFileExtension() + "?ts=" + _ts,
    "tileset-x": tileset_x,
    "tileset-y": tileset_y,
    "width": width,
    "height": height
  };
}

export function get_technology_image_sprite(ptech: { graphic_str: string; graphic_alt: string; name: string } | null): SpriteInfo | null {
  const tag = tileset_tech_graphic_tag(ptech);
  if (tag == null) return null;

  const tileset_x = store.tileset[tag][0];
  const tileset_y = store.tileset[tag][1];
  const width = store.tileset[tag][2];
  const height = store.tileset[tag][3];
  const i = store.tileset[tag][4];
  return {
    "tag": tag,
    "image-src": "/tileset/freeciv-web-tileset-" + tileset_name + "-" + i + getTilesetFileExtension() + "?ts=" + _ts,
    "tileset-x": tileset_x,
    "tileset-y": tileset_y,
    "width": width,
    "height": height
  };
}

export function get_treaty_agree_thumb_up(): SpriteInfo {
  const tag = "treaty.agree_thumb_up";
  const tileset_x = store.tileset[tag][0];
  const tileset_y = store.tileset[tag][1];
  const width = store.tileset[tag][2];
  const height = store.tileset[tag][3];
  const i = store.tileset[tag][4];
  return {
    "tag": tag,
    "image-src": "/tileset/freeciv-web-tileset-" + tileset_name + "-" + i + getTilesetFileExtension() + "?ts=" + _ts,
    "tileset-x": tileset_x,
    "tileset-y": tileset_y,
    "width": width,
    "height": height
  };
}

export function get_treaty_disagree_thumb_down(): SpriteInfo {
  const tag = "treaty.disagree_thumb_down";
  const tileset_x = store.tileset[tag][0];
  const tileset_y = store.tileset[tag][1];
  const width = store.tileset[tag][2];
  const height = store.tileset[tag][3];
  const i = store.tileset[tag][4];
  return {
    "tag": tag,
    "image-src": "/tileset/freeciv-web-tileset-" + tileset_name + "-" + i + getTilesetFileExtension() + "?ts=" + _ts,
    "tileset-x": tileset_x,
    "tileset-y": tileset_y,
    "width": width,
    "height": height
  };
}
