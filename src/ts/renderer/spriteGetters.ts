/**
 * Sprite getter functions for UI dialogs — units, improvements, techs, treaties, specialists.
 * Extracted from tilespec.ts to decouple UI rendering from map tile rendering.
 */
import { unit_type } from '../data/unit';
import { tileset_name } from './tilesetConfig';
import { tileset_unit_type_graphic_tag, tileset_building_graphic_tag, tileset_tech_graphic_tag } from './tilespec';
import { getTilesetFileExtension } from '../utils/helpers';

const _w = window as any;

export function get_unit_image_sprite(punit: any): any {
  const from_type = get_unit_type_image_sprite(unit_type(punit));
  from_type["height"] = from_type["height"] - 2;
  return from_type;
}

export function get_unit_type_image_sprite(punittype: any): any | null {
  const tag = tileset_unit_type_graphic_tag(punittype);
  if (tag == null) return null;

  const tileset_x = _w.tileset[tag][0];
  const tileset_y = _w.tileset[tag][1];
  const width = _w.tileset[tag][2];
  const height = _w.tileset[tag][3];
  const i = _w.tileset[tag][4];
  return {
    "tag": tag,
    "image-src": "/tileset/freeciv-web-tileset-" + tileset_name + "-" + i + getTilesetFileExtension() + "?ts=" + _w.ts,
    "tileset-x": tileset_x,
    "tileset-y": tileset_y,
    "width": width,
    "height": height
  };
}

export function get_improvement_image_sprite(pimprovement: any): any | null {
  const tag = tileset_building_graphic_tag(pimprovement);
  if (tag == null) return null;

  const tileset_x = _w.tileset[tag][0];
  const tileset_y = _w.tileset[tag][1];
  const width = _w.tileset[tag][2];
  const height = _w.tileset[tag][3];
  const i = _w.tileset[tag][4];
  return {
    "tag": tag,
    "image-src": "/tileset/freeciv-web-tileset-" + tileset_name + "-" + i + getTilesetFileExtension() + "?ts=" + _w.ts,
    "tileset-x": tileset_x,
    "tileset-y": tileset_y,
    "width": width,
    "height": height
  };
}

export function get_specialist_image_sprite(tag: string): any | null {
  if (_w.tileset[tag] == null) return null;

  const tileset_x = _w.tileset[tag][0];
  const tileset_y = _w.tileset[tag][1];
  const width = _w.tileset[tag][2];
  const height = _w.tileset[tag][3];
  const i = _w.tileset[tag][4];
  return {
    "tag": tag,
    "image-src": "/tileset/freeciv-web-tileset-" + tileset_name + "-" + i + getTilesetFileExtension() + "?ts=" + _w.ts,
    "tileset-x": tileset_x,
    "tileset-y": tileset_y,
    "width": width,
    "height": height
  };
}

export function get_technology_image_sprite(ptech: any): any | null {
  const tag = tileset_tech_graphic_tag(ptech);
  if (tag == null) return null;

  const tileset_x = _w.tileset[tag][0];
  const tileset_y = _w.tileset[tag][1];
  const width = _w.tileset[tag][2];
  const height = _w.tileset[tag][3];
  const i = _w.tileset[tag][4];
  return {
    "tag": tag,
    "image-src": "/tileset/freeciv-web-tileset-" + tileset_name + "-" + i + getTilesetFileExtension() + "?ts=" + _w.ts,
    "tileset-x": tileset_x,
    "tileset-y": tileset_y,
    "width": width,
    "height": height
  };
}

export function get_treaty_agree_thumb_up(): any {
  const tag = "treaty.agree_thumb_up";
  const tileset_x = _w.tileset[tag][0];
  const tileset_y = _w.tileset[tag][1];
  const width = _w.tileset[tag][2];
  const height = _w.tileset[tag][3];
  const i = _w.tileset[tag][4];
  return {
    "tag": tag,
    "image-src": "/tileset/freeciv-web-tileset-" + tileset_name + "-" + i + getTilesetFileExtension() + "?ts=" + _w.ts,
    "tileset-x": tileset_x,
    "tileset-y": tileset_y,
    "width": width,
    "height": height
  };
}

export function get_treaty_disagree_thumb_down(): any {
  const tag = "treaty.disagree_thumb_down";
  const tileset_x = _w.tileset[tag][0];
  const tileset_y = _w.tileset[tag][1];
  const width = _w.tileset[tag][2];
  const height = _w.tileset[tag][3];
  const i = _w.tileset[tag][4];
  return {
    "tag": tag,
    "image-src": "/tileset/freeciv-web-tileset-" + tileset_name + "-" + i + getTilesetFileExtension() + "?ts=" + _w.ts,
    "tileset-x": tileset_x,
    "tileset-y": tileset_y,
    "width": width,
    "height": height
  };
}
