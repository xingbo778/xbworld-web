# Refactor: Observer-Only + 2D Mode

Remove all non-observer player code, keeping only spectator mode + 2D rendering.
Already removed in prior work: speech, hallOfFame, hotseat, mapFromImage, scorelog, spacerace, replay, WebGL/3D, PBEM.

---

## Phase 1: pregame.ts deep cleanup (~1400 lines removal)

The largest file (1607 lines), 87% is player-only.

**REMOVE entirely:**
- `pick_nation()`, `render_city_style_list()`, `update_nation_selection()`, `select_nation()`, `submit_nation_choice()` — nation selection UI
- `pregame_settings()` — game customization dialog (ruleset, AI, map size, etc.)
- `show_longturn_intro_dialog()` — LongTurn/Google sign-in
- `validate_username_callback()` — login/register flow
- `show_new_user_account_dialog()`, `create_new_freeciv_user_account_request()` — registration
- `forgot_password()` — password reset + CAPTCHA
- `show_customize_nation_dialog()`, `handle_customized_nation()`, `handle_new_flag()` — custom flags
- `change_ruleset()` — ruleset switching
- `observe()` / `detach()` toggle — observers don't need to toggle

**SIMPLIFY:**
- `show_intro_dialog()` — keep only observer path: name input + "Observe Game" button
- `update_player_info_pregame_real()` — keep player list display, remove context menu & start game logic
- `pregame_start_game()` — remove (observers don't start games)

**KEEP:**
- `update_game_info_pregame()` — game info display
- Chat-related pregame code

---

## Phase 2: civClient.ts + connection.ts simplification

**civClient.ts:**
- `civClientInit()`: Always set `observing = true`, remove `action === 'observe'` conditional (it's always observe now)
- `initCommonIntroDialog()`: Remove all non-observe branches (earthload, load, multi, hack, singleplayer). Keep only observer dialog path.

**connection.ts:**
- `network_init()`: Hardcode `action=observe` in URL, remove dynamic action detection
- `network_init_manual_hack()`: Remove (hack mode gone)
- Remove `civserverport` URL parameter handling

---

## Phase 3: clientMain.ts + control/ sub-modules

**clientMain.ts:**
- Simplify `set_client_state()` observer conditional (line 58): remove multi/longturn/game_loaded checks
- Remove autostart logic for singleplayer (line 263+)
- Remove `pregame_start_game` call paths

**control/ sub-modules:**
- `unitCommands.ts`: Add early `return` guard with `clientIsObserver()` at top of every `key_unit_*` and `request_unit_*` function
- `keyboard.ts`: Guard player-only shortcuts (Ctrl+S quicksave, Shift+Enter end turn, all unit command keys)
- `mapClick.ts`: Already guarded — verify
- `controlState.ts`, `chat.ts`, `mouse.ts`, `actionSelection.ts`: Keep (used by observer for map navigation/chat)

---

## Phase 4: UI modules + index.html

**UI modules to guard/simplify:**
- `cityDialog.ts`: Guard all mutation operations (buy, sell, change production, rename, specialists). Keep read-only city view.
- `actionDialog.ts`: Guard with observer check at entry
- `pillageDialog.ts`: Guard with observer check at entry
- `diplomacy.ts`: Guard action functions (init_meeting, accept_treaty, create/remove clause). Keep display.
- `rates.ts`: Already checks observer — verify
- `governmentDialog.ts`: Already checks observer — verify
- `cma.ts`: Already checks observer — verify
- `controls.ts` (ui/): Guard `setupOrderButtons()` with observer check

**index.html:**
- Remove: `#start_game_button`, `#load_game_button`, `#pick_nation_button`, `#pregame_settings_button`
- Hide/remove: `#turn_done_button_div`, `#game_unit_orders_default`
- Hide: `#revolution_button`, `#taxrates_button` (or let existing JS guards handle)

---

## Phase 5: mock-backend + cleanup

- Simplify mock-backend to observer-only (remove non-observer `handleConnection`, always send observer packets)
- Remove unused globalRegistry registrations for deleted functions
- Update tests for removed exports/functions
- Run `npm run typecheck && npm run test && npm run build` to verify
