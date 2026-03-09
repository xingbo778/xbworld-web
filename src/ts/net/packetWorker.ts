/**
 * Packet Worker — JSON.parse off the main thread.
 *
 * The main thread sends raw WebSocket message strings via postMessage.
 * The worker parses them and sends back the packet array.
 * This keeps JSON.parse (which can be slow for large game state updates)
 * off the main thread to reduce jank.
 */

self.onmessage = function (e: MessageEvent<string>) {
  try {
    let parsed = JSON.parse(e.data);
    if (!Array.isArray(parsed)) parsed = [parsed];
    (self as unknown as Worker).postMessage({ packets: parsed });
  } catch {
    (self as unknown as Worker).postMessage({ error: 'parse error', raw: e.data });
  }
};
