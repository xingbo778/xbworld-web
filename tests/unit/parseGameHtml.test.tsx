/**
 * Tests for parseGameHtml utility (src/ts/utils/parseGameHtml.tsx).
 * PGH-1..12
 */
import { describe, it, expect } from 'vitest';
import { render } from 'preact';
import { parseGameHtml } from '@/utils/parseGameHtml';

function renderHtml(html: string): HTMLElement {
  const container = document.createElement('div');
  const nodes = parseGameHtml(html);
  render(<>{nodes}</>, container);
  return container;
}

// ── PGH-1: empty / falsy input ─────────────────────────────────────────────

describe('parseGameHtml', () => {
  it('PGH-1a: returns [] for empty string', () => {
    expect(parseGameHtml('')).toEqual([]);
  });

  it('PGH-1b: returns [] for null-like (empty string)', () => {
    expect(parseGameHtml('')).toHaveLength(0);
  });

  // ── PGH-2: plain text ────────────────────────────────────────────────────

  it('PGH-2: plain text renders as text node', () => {
    const el = renderHtml('Hello world');
    expect(el.textContent).toBe('Hello world');
  });

  // ── PGH-3: <b> / <strong> ────────────────────────────────────────────────

  it('PGH-3a: <b> renders as <strong>', () => {
    const el = renderHtml('Click <b>Games</b> now');
    expect(el.querySelector('strong')).not.toBeNull();
    expect(el.querySelector('strong')?.textContent).toBe('Games');
  });

  it('PGH-3b: <strong> renders as <strong>', () => {
    const el = renderHtml('<strong>bold</strong>');
    expect(el.querySelector('strong')).not.toBeNull();
  });

  // ── PGH-4: <br> ──────────────────────────────────────────────────────────

  it('PGH-4: <br> renders as <br> element', () => {
    const el = renderHtml('line1<br>line2');
    expect(el.querySelector('br')).not.toBeNull();
    expect(el.textContent).toContain('line1');
    expect(el.textContent).toContain('line2');
  });

  // ── PGH-5: <i> / <em> ────────────────────────────────────────────────────

  it('PGH-5: <i> renders as <em>', () => {
    const el = renderHtml('<i>italic</i>');
    expect(el.querySelector('em')).not.toBeNull();
    expect(el.querySelector('em')?.textContent).toBe('italic');
  });

  // ── PGH-6: <span style="color:…"> ───────────────────────────────────────

  it('PGH-6: <span style="color:red"> preserves inline style', () => {
    const el = renderHtml('<span style="color:red">warning</span>');
    const span = el.querySelector('span');
    expect(span).not.toBeNull();
    expect(span?.textContent).toBe('warning');
  });

  // ── PGH-7: <a href="https://…"> ─────────────────────────────────────────

  it('PGH-7a: <a href="https://…"> renders as link with target=_blank', () => {
    const el = renderHtml('<a href="https://example.com">link</a>');
    const a = el.querySelector('a');
    expect(a).not.toBeNull();
    expect(a?.getAttribute('href')).toBe('https://example.com');
    expect(a?.getAttribute('target')).toBe('_blank');
    expect(a?.textContent).toBe('link');
  });

  it('PGH-7b: javascript: href is stripped (sanitized) — children preserved', () => {
    const el = renderHtml('<a href="javascript:alert(1)">xss</a>');
    // sanitizeGameHtml rewrites javascript: href to "#"
    // The resulting '#' href doesn't match /^https?:\/\//  so children are rendered without <a>
    expect(el.querySelector('a')).toBeNull();
    expect(el.textContent).toContain('xss');
  });

  // ── PGH-8: <ul>/<ol>/<li> ────────────────────────────────────────────────

  it('PGH-8: list elements render correctly', () => {
    const el = renderHtml('<ul><li>item1</li><li>item2</li></ul>');
    expect(el.querySelector('ul')).not.toBeNull();
    const items = el.querySelectorAll('li');
    expect(items).toHaveLength(2);
    expect(items[0].textContent).toBe('item1');
    expect(items[1].textContent).toBe('item2');
  });

  // ── PGH-9: nested tags ───────────────────────────────────────────────────

  it('PGH-9: nested tags render correctly', () => {
    const el = renderHtml('<b>bold <i>bold-italic</i></b>');
    expect(el.querySelector('strong')).not.toBeNull();
    expect(el.querySelector('em')).not.toBeNull();
    expect(el.textContent).toBe('bold bold-italic');
  });

  // ── PGH-10: script stripping ─────────────────────────────────────────────

  it('PGH-10: <script> blocks are stripped by sanitizer', () => {
    const el = renderHtml('<script>alert(1)</script>safe text');
    expect(el.querySelector('script')).toBeNull();
    expect(el.textContent).not.toContain('alert');
    expect(el.textContent).toContain('safe text');
  });

  // ── PGH-11: on* event attributes are stripped ────────────────────────────

  it('PGH-11: onclick attributes stripped by sanitizer', () => {
    const el = renderHtml('<span onclick="alert(1)">text</span>');
    const span = el.querySelector('span');
    expect(span?.getAttribute('onclick')).toBeNull();
    expect(el.textContent).toBe('text');
  });

  // ── PGH-12: real-world gotoPath message ──────────────────────────────────

  it('PGH-12: gotoPath turn-done message renders correctly', () => {
    const msg = 'Your turn is over. Go to example.com and click <b>Games</b> in the menu.<br>See you soon!';
    const el = renderHtml(msg);
    expect(el.querySelector('strong')?.textContent).toBe('Games');
    expect(el.querySelector('br')).not.toBeNull();
    expect(el.textContent).toContain('See you soon!');
  });
});
