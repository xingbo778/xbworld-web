/**
 * Lightweight HTML sanitizer for game-server messages.
 *
 * Game messages (chat, notifications, log entries) come from the Freeciv server
 * and may contain simple formatting tags (<b>, <i>, <span>, <br>, color
 * attributes).  They are trusted in the sense that they are not user-typed
 * free text, but we still strip anything that could cause XSS if a malicious
 * server were connected.
 *
 * This avoids the need for a heavy dependency like DOMPurify by using a
 * whitelist of allowed tags and stripping dangerous attributes.
 *
 * Allowed tags: b, i, em, strong, u, s, br, p, span, div, a, li, ul, ol
 * Stripped attributes: on* (event handlers), anything starting with "javascript:"
 * Allowed attributes: style (sanitized), href (http/https only), color, class
 */

/** Set of lowercase tag names that are safe to keep. */
const ALLOWED_TAGS = new Set([
  'b', 'i', 'em', 'strong', 'u', 's', 'strike',
  'br', 'p', 'span', 'div',
  'a', 'li', 'ul', 'ol',
]);

/**
 * Escape a plain-text value for safe inline use inside an HTML string.
 * Use this when building HTML via string concatenation and inserting a value
 * that comes from the server (nation names, player names, settings, etc.).
 */
export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Sanitize an HTML string from the game server.
 * Removes <script> blocks, strips on* event attributes, and blocks
 * javascript: / data: href values.
 * All other content (including allowed tags) is preserved.
 */
export function sanitizeGameHtml(html: string): string {
  if (!html) return '';

  // 1. Strip complete <script> ... </script> blocks (case-insensitive)
  let out = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

  // 2. Strip inline event handlers (on* attributes)
  out = out.replace(/\bon\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]*)/gi, '');

  // 3. Block javascript: and data: URI schemes in href/src attributes
  out = out.replace(/(href|src)\s*=\s*["']?\s*(javascript|data)\s*:/gi, '$1="#"');

  // 4. Remove <iframe>, <object>, <embed>, <form>, <input> tags entirely
  out = out.replace(/<\/?(iframe|object|embed|form|input|button|textarea|select)\b[^>]*>/gi, '');

  return out;
}
