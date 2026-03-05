/**
 * Civ client initialisation — migrated from civclient.js (Phase 9.3).
 *
 * Covers all 7 functions in civclient.js:
 *   civclient_init, init_common_intro_dialog, close_dialog_message,
 *   closing_dialog_message, show_dialog_message, show_auth_dialog,
 *   switch_renderer.
 *
 * Global state variables declared in civclient.js (client, client_frozen,
 * phase_start_time, debug_active, autostart, username, fc_seedrandom,
 * game_type, music_list, audio, audio_enabled, last_turn_change_time,
 * turn_change_elapsed, seconds_to_phasedone, seconds_to_phasedone_sync,
 * dialog_close_trigger, dialog_message_close_task, RENDERER_2DCANVAS,
 * renderer) remain as legacy globals while civclient.js
 * is still loaded. Guards below initialise them once civclient.js is removed.
 */

const w = window as any;

// ---------------------------------------------------------------------------
// Global state guards (active once civclient.js is deleted)
// ---------------------------------------------------------------------------
if (w.client === undefined || Object.keys(w.client).length === 0) {
  // Only set if truly absent — civclient.js sets this to {}
  if (w.client === undefined) w.client = {};
}
if (w.client_frozen === undefined)          w.client_frozen = false;
if (w.phase_start_time === undefined)       w.phase_start_time = 0;
if (w.debug_active === undefined)           w.debug_active = false;
if (w.autostart === undefined)              w.autostart = false;
if (w.username === undefined)               w.username = null;
if (w.fc_seedrandom === undefined)          w.fc_seedrandom = null;
if (w.game_type === undefined)              w.game_type = '';
if (w.audio === undefined)                  w.audio = null;
if (w.audio_enabled === undefined)          w.audio_enabled = false;
if (w.last_turn_change_time === undefined)  w.last_turn_change_time = 0;
if (w.turn_change_elapsed === undefined)    w.turn_change_elapsed = 0;
if (w.seconds_to_phasedone === undefined)   w.seconds_to_phasedone = 0;
if (w.seconds_to_phasedone_sync === undefined) w.seconds_to_phasedone_sync = 0;
if (w.dialog_close_trigger === undefined)   w.dialog_close_trigger = '';
if (w.dialog_message_close_task === undefined) w.dialog_message_close_task = undefined;
if (w.RENDERER_2DCANVAS === undefined)      w.RENDERER_2DCANVAS = 1;
if (w.renderer === undefined)               w.renderer = w.RENDERER_2DCANVAS;
if (!w.music_list) {
  w.music_list = [
    'battle-epic', 'battle2', 'battle3', 'battle4',
    'battle5', 'battle6', 'battle7', 'battle8'
  ];
}

// ---------------------------------------------------------------------------
// civclient_init
// ---------------------------------------------------------------------------

/**
 * Main client initialisation — called from index.html $(document).ready.
 */
export function civClientInit(): void {
  w.$.blockUI.defaults['css']['backgroundColor'] = '#222';
  w.$.blockUI.defaults['css']['color'] = '#fff';
  w.$.blockUI.defaults['theme'] = true;

  // Always observer mode
  w.observing = true;
  w.game_type = 'observe';
  w.$('#civ_tab').remove();
  w.$('#cities_tab').remove();
  w.$('#pregame_buttons').remove();
  w.$('#game_unit_orders_default').remove();
  w.$('#civ_dialog').remove();

  // Initialise seeded random number generator
  w.fc_seedrandom = new (w.Math.seedrandom || w.seedrandom)('xbworld');

  if (window.requestAnimationFrame == null) {
    if (typeof w.swal === 'function') w.swal('Please upgrade your browser.');
    return;
  }


  if (typeof w.init_mapview === 'function') w.init_mapview();
  if (typeof w.game_init === 'function') w.game_init();
  w.$('#tabs').tabs({ heightStyle: 'fill' });
  if (typeof w.control_init === 'function') w.control_init();
  w.timeoutTimerId = setInterval(function () {
    if (typeof w.update_timeout === 'function') w.update_timeout();
  }, 1000);
  if (typeof w.update_game_status_panel === 'function') w.update_game_status_panel();
  w.statusTimerId = setInterval(function () {
    if (typeof w.update_game_status_panel === 'function') w.update_game_status_panel();
  }, 6000);

  if (w.overviewTimerId === -1) {
    w.OVERVIEW_REFRESH = 6000;
    w.overviewTimerId = setInterval(function () {
      if (typeof w.redraw_overview === 'function') w.redraw_overview();
    }, w.OVERVIEW_REFRESH);
  }

  if (typeof w.motd_init === 'function') w.motd_init();

  // IE polyfill for Array.indexOf (kept for historical compatibility)
  if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function (obj: unknown): number {
      for (let i = 0; i < this.length; i++) {
        if (this[i] === obj) return i;
      }
      return -1;
    };
  }

  w.$('#tabs').css('height', w.$(window).height());
  w.$('#tabs-map').height('auto');
  w.$('#tabs-civ').height('auto');
  w.$('#tabs-tec').height('auto');
  w.$('#tabs-nat').height('auto');
  w.$('#tabs-cities').height('auto');
  w.$('#tabs-opt').height('auto');
  w.$('#tabs-hel').height('auto');
  w.$('.button').button();

  w.sounds_enabled = w.simpleStorage.get('sndFX');
  if (w.sounds_enabled == null) {
    // Default to true, except when known to be problematic.
    w.sounds_enabled = (w.platform?.name === 'Safari') ? false : true;
  }

  /* Initialise audio.js music player */
  if (w.audiojs) {
    w.audiojs.events.ready(function () {
      const as = w.audiojs.createAll({
        trackEnded: function () {
          const list: string[] = w.music_list;
          const track = list[Math.floor(Math.random() * list.length)];
          const ext = (typeof w.supports_mp3 === 'function' && !w.supports_mp3()) ? '.ogg' : '.mp3';
          if (w.audio) {
            w.audio.load('/music/' + track + ext);
            w.audio.play();
          }
        }
      });
      w.audio = as[0];
    });
  }

  if (typeof w.init_common_intro_dialog === 'function') w.init_common_intro_dialog();
  if (typeof w.setup_window_size === 'function') w.setup_window_size();
}

// ---------------------------------------------------------------------------
// init_common_intro_dialog
// ---------------------------------------------------------------------------

/**
 * Shows the observer intro dialog.
 */
export function initCommonIntroDialog(): void {
  if (typeof w.show_intro_dialog === 'function') {
    w.show_intro_dialog('Welcome to XBWorld', 'You are joining the game as an observer. Please enter your name:');
  }
  w.$('#turn_done_button').button('option', 'disabled', true);
}

// ---------------------------------------------------------------------------
// close_dialog_message / closing_dialog_message
// ---------------------------------------------------------------------------

/**
 * Closes the generic message dialog.
 */
export function closeDialogMessage(): void {
  w.$('#generic_dialog').dialog('close');
}

/**
 * Cleanup callback when the generic message dialog is closing.
 */
export function closingDialogMessage(): void {
  clearTimeout(w.dialog_message_close_task);
  w.$('#game_text_input').blur();
}

// ---------------------------------------------------------------------------
// show_dialog_message
// ---------------------------------------------------------------------------

/**
 * Shows a generic message dialog with auto-close after 24 seconds.
 */
export function showDialogMessage(title: string, message: string): void {
  w.$('#generic_dialog').remove();
  w.$("<div id='generic_dialog'></div>").appendTo('div#game_page');
  w.$('#generic_dialog').html(message);
  w.$('#generic_dialog').attr('title', title);
  w.$('#generic_dialog').dialog({
    bgiframe: true,
    modal: false,
    width: (w.is_small_screen && w.is_small_screen()) ? '90%' : '50%',
    close: function () { if (typeof w.closing_dialog_message === 'function') w.closing_dialog_message(); },
    buttons: {
      Ok: function () { if (typeof w.close_dialog_message === 'function') w.close_dialog_message(); }
    }
  }).dialogExtend({
    minimizable: true,
    closable: true,
    icons: {
      minimize: 'ui-icon-circle-minus',
      restore: 'ui-icon-bullet'
    }
  });
  w.$('#generic_dialog').dialog('open');
  w.$('#game_text_input').blur();
  // Auto-close after 24 seconds
  w.dialog_message_close_task = setTimeout(function () {
    if (typeof w.close_dialog_message === 'function') w.close_dialog_message();
  }, 24000);
  w.$('#generic_dialog').css('max-height', '450px');
}

// ---------------------------------------------------------------------------
// show_auth_dialog
// ---------------------------------------------------------------------------

/**
 * Shows the authentication/password dialog for private servers.
 */
export function showAuthDialog(packet: any): void {
  w.$('#dialog').remove();
  w.$("<div id='dialog'></div>").appendTo('div#game_page');
  const intro_html = packet['message'] +
    "<br><br> Password: <input id='password_req' type='text' size='25'>";
  w.$('#dialog').html(intro_html);
  w.$('#dialog').attr('title', 'Private server needs password to enter');
  w.$('#dialog').dialog({
    bgiframe: true,
    modal: true,
    width: (w.is_small_screen && w.is_small_screen()) ? '80%' : '60%',
    buttons: {
      Ok: function () {
        const pwd_packet = {
          pid: w.packet_authentication_reply,
          password: w.$('#password_req').val()
        };
        if (typeof w.send_request === 'function') w.send_request(JSON.stringify(pwd_packet));
        w.$('#dialog').dialog('close');
      }
    }
  });
  w.$('#dialog').dialog('open');
}

// ---------------------------------------------------------------------------
// switch_renderer
// ---------------------------------------------------------------------------

/**
 * Only 2D renderer is supported. This is a no-op stub.
 */
export function switchRenderer(): void {
  // 3D WebGL renderer has been removed; only 2D canvas is supported.
}

// ---------------------------------------------------------------------------
// Auto-init: register $(document).ready so civClientInit runs on page load.
//
// webclient.min.js registers $(document).ready(civclient_init) but that fires
// before this ts-bundle (type="module", deferred) overrides window.civclient_init.
// By registering our own handler here we ensure the TS version always runs.
// The guard prevents double-init if webclient.min.js's old version already ran
// and set civclient_state > 0.
// ---------------------------------------------------------------------------
w.$(function () {
  if (!w.civclient_state || w.civclient_state === 0) {
    civClientInit();
  }
});

// ---------------------------------------------------------------------------
// Expose to legacy JS
// ---------------------------------------------------------------------------
