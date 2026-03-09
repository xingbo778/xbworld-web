/**
 * Tests for helpdata.ts — pure utility functions.
 */
import { describe, it, expect } from 'vitest';
import {
  helpdata_tag_to_title,
  find_parent_help_key,
  toplevel_menu_items,
  hidden_menu_items,
} from '@/ui/helpdata';

describe('helpdata_tag_to_title', () => {
  it('converts help_ prefix to title case', () => {
    expect(helpdata_tag_to_title('help_terrain')).toBe('Terrain');
  });

  it('strips gen_ prefix', () => {
    expect(helpdata_tag_to_title('help_gen_units')).toBe('Units');
  });

  it('strips _of_the_world suffix', () => {
    expect(helpdata_tag_to_title('help_wonders_of_the_world')).toBe('Wonders');
  });

  it('converts underscores to spaces and title-cases', () => {
    expect(helpdata_tag_to_title('help_city_improvements')).toBe('City Improvements');
  });

  it('handles help_government', () => {
    expect(helpdata_tag_to_title('help_government')).toBe('Government');
  });

  it('handles help_gen_terrain entry', () => {
    expect(helpdata_tag_to_title('help_gen_terrain_5')).toBe('Terrain 5');
  });
});

describe('find_parent_help_key', () => {
  it('terrain alterations go into terrain submenu', () => {
    expect(find_parent_help_key('help_terrain_alterations')).toBe('#help_terrain_ul');
  });

  it('help_villages goes into terrain submenu', () => {
    expect(find_parent_help_key('help_villages')).toBe('#help_terrain_ul');
  });

  it('help_borders goes into terrain submenu', () => {
    expect(find_parent_help_key('help_borders')).toBe('#help_terrain_ul');
  });

  it('help_food goes into economy submenu', () => {
    expect(find_parent_help_key('help_food')).toBe('#help_economy_ul');
  });

  it('help_production goes into economy submenu', () => {
    expect(find_parent_help_key('help_production')).toBe('#help_economy_ul');
  });

  it('help_trade goes into economy submenu', () => {
    expect(find_parent_help_key('help_trade')).toBe('#help_economy_ul');
  });

  it('help_specialists goes into cities submenu', () => {
    expect(find_parent_help_key('help_specialists')).toBe('#help_cities_ul');
  });

  it('help_happiness goes into cities submenu', () => {
    expect(find_parent_help_key('help_happiness')).toBe('#help_cities_ul');
  });

  it('help_combat_example_1 goes into combat submenu', () => {
    expect(find_parent_help_key('help_combat_example_1')).toBe('#help_combat_ul');
  });

  it('unknown keys go into the top-level menu', () => {
    expect(find_parent_help_key('help_unknown_key')).toBe('#help_menu');
  });

  it('help_technology goes into top-level menu', () => {
    expect(find_parent_help_key('help_technology')).toBe('#help_menu');
  });
});

describe('menu item lists', () => {
  it('toplevel_menu_items contains expected keys', () => {
    expect(toplevel_menu_items).toContain('help_terrain');
    expect(toplevel_menu_items).toContain('help_units');
    expect(toplevel_menu_items).toContain('help_technology');
    expect(toplevel_menu_items).toContain('help_government');
    expect(toplevel_menu_items.length).toBeGreaterThan(0);
  });

  it('hidden_menu_items contains governor and chatline', () => {
    expect(hidden_menu_items).toContain('help_governor');
    expect(hidden_menu_items).toContain('help_chatline');
  });

  it('toplevel and hidden lists do not overlap', () => {
    const overlap = toplevel_menu_items.filter(k => hidden_menu_items.includes(k));
    expect(overlap).toHaveLength(0);
  });
});
