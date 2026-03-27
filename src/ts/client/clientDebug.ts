/**
 * Client debug utilities — migrated from civclient.js.
 *
 * Provides:
 *   - show_debug_info() — logs version, browser, network stats to console
 */

import { getDebugWebSocket } from '../utils/debugGlobals';
import { store } from '../data/store';
import { debug_client_speed_list, freeciv_version } from '../net/connection';
import { getWindowValue } from '../utils/windowBridge';

// ---------------------------------------------------------------------------
// show_debug_info
// ---------------------------------------------------------------------------

/**
 * Logs diagnostic information to the browser console:
 *   - XBWorld version, browser user-agent, jQuery versions
 *   - Network ping averages (server and client)
 *   - WebGL renderer info (if using WebGL)
 *
 * Sets `debug_active = true` as a side effect.
 */
export function showDebugInfo(): void {
  const jq = $('') as { jquery?: string };
  const jqUi = $ as typeof $ & { ui?: { version?: string } };
  console.log('XBWorld version: ' + freeciv_version);
  console.log('Browser useragent: ' + navigator.userAgent);
  console.log('jQuery version: ' + jq.jquery);
  console.log('jQuery UI version: ' + jqUi.ui?.version);
  console.log(
    'simpleStorage version: N/A (replaced with native localStorage)',
  );
  console.log(
    'Touch device: ' +
      (typeof getWindowValue<() => boolean>('is_touch_device') === 'function'
        ? getWindowValue<() => boolean>('is_touch_device')!()
        : 'unknown'),
  );
  console.log('HTTP protocol: ' + document.location.protocol);
  const wsObj = getDebugWebSocket();
  if (wsObj != null && wsObj.url != null) {
    console.log('WebSocket URL: ' + wsObj.url);
  }

  store.debugActive = true;

  // Server ping stats
  const pingList = store.debugPingList;
  if (pingList.length > 0) {
    let sum = 0;
    let max = 0;
    for (const v of pingList) {
      sum += v;
      if (v > max) max = v;
    }
    console.log(
      'Network PING average (server): ' +
        (sum / pingList.length) +
        ' ms. (Max: ' +
        max +
        'ms.)',
    );
  }

  // Client ping stats
  const clientSpeedList = debug_client_speed_list;
  if (clientSpeedList.length > 0) {
    let sum = 0;
    let max = 0;
    for (const v of clientSpeedList) {
      sum += v;
      if (v > max) max = v;
    }
    console.log(
      'Network PING average (client): ' +
        (sum / clientSpeedList.length) +
        ' ms.  (Max: ' +
        max +
        'ms.)',
    );
  }

}

// ---------------------------------------------------------------------------
// Expose to legacy JS
// ---------------------------------------------------------------------------
