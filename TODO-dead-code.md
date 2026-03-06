# Dead Code & Observer-Irrelevant Code TODO

## Dead Code (unused exports / unreachable paths)

- `options.ts`: GTK2 options (`gui_gtk2_*`) — 12 exported booleans, never read anywhere. Legacy from C client.
- `options.ts`: `default_server_host`, `default_server_port`, `default_metaserver`, `default_theme_name`, `default_tileset_name`, `default_sound_set_name`, `default_sound_plugin_name` — never used, leftovers from C client config.
- `options.ts`: `TRUE`/`FALSE` constants — just aliases for `true`/`false`, can inline and remove.
- `options.ts`: `save_options_on_exit`, `fullscreen_mode` — never read.
- `options.ts`: Many `draw_*` options (e.g. `draw_coastline`, `draw_roads_rails`, `draw_irrigation`, `draw_mines`, `draw_fortress_airbase`, `draw_huts`, `draw_resources`, `draw_pollution`) — check if actually consumed by renderer.
- `pregame.ts`: `observing` export — declared but check if it's ever set or read (store.observing is the actual flag).
- `pregame.ts`: `graphics_quality`, `antialiasing_setting`, `QUALITY_MEDIUM`, `QUALITY_HIGH` — check if consumed.

## Observer-Mode Irrelevant Code (can be stripped or gated)

- `keyboard.ts`: Entire `map_handle_key()` function — all unit commands (build, goto, fortify, mine, road, etc.) are no-ops in observer mode since there are no controllable units.
- `keyboard.ts`: `handle_context_menu_callback()` — same reason, context menu actions are all unit commands.
- `keyboard.ts`: `civclient_handle_key()` Shift+Enter send_end_turn — disabled for observer already, but the handler still runs.
- `cma.ts`: Entire file — City Governor is player-only feature, already gated with `client_is_observer()` check at top.
- `ui/rates.ts`: Tax rate sliders — observer can't change rates.
- `ui/diplomacy.ts`: Diplomacy dialogs — observer can't negotiate.
- `ui/governmentDialog.ts`: Government revolution dialog — observer can't change government.
- `core/control/unitCommands.ts`: All unit command functions — observer has no units to command.
- `core/control/unitFocus.ts`: Unit focus/selection — observer has no units.
- `core/control/actionSelection.ts`: Action selection queue — observer has no units performing actions.
- `connection.ts`: Password hashing with jsSHA — observer login doesn't use passwords.
- `net/handlers/unit.ts`: `handle_unit_actions`, `handle_unit_action_answer` — action dialog flows irrelevant for observer.

## jQuery Plugin Dependencies (contextMenu)

- `core/control.ts` line 182: `jQuery.contextMenu()` initializes the plugin — only meaningful for player mode (unit right-click menu).
- `keyboard.ts`: contextMenu show/hide — converted to native DOM access, but still depends on jQuery contextMenu plugin being loaded.
- `renderer/mapctrl.ts`: contextMenu enable/disable — same plugin dependency.
- Consider removing contextMenu plugin entirely for observer mode.
