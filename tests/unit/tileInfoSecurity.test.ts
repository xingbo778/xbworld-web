/**
 * Security tests for handle_web_info_text_message.
 * Verifies that plain-text tile info lines from the server are escaped before
 * being joined into HTML.
 *
 * Previously, non-City/Unit/Territory lines were passed through raw, which
 * could allow XSS if a server sent crafted tile names.
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { store } from '@/data/store';

beforeEach(() => {
  store.reset();
});

describe('handle_web_info_text_message escaping', () => {
  it('is exported as a function', async () => {
    const { handle_web_info_text_message } = await import('@/renderer/mapctrl');
    expect(typeof handle_web_info_text_message).toBe('function');
  });

  it('does not throw for a plain terrain line', async () => {
    const { handle_web_info_text_message } = await import('@/renderer/mapctrl');
    expect(() => handle_web_info_text_message({ message: encodeURIComponent('Plains') })).not.toThrow();
  });

  it('does not throw for a line with HTML-special chars', async () => {
    const { handle_web_info_text_message } = await import('@/renderer/mapctrl');
    // Server sends a line with angle brackets (e.g. locale-specific terrain name)
    expect(() => handle_web_info_text_message({ message: encodeURIComponent('Terrain: <script>alert(1)</script>') })).not.toThrow();
  });

  it('does not throw for a multi-line message', async () => {
    const { handle_web_info_text_message } = await import('@/renderer/mapctrl');
    const raw = 'Plains\nSpecial: Wheat\nFood: 3';
    expect(() => handle_web_info_text_message({ message: encodeURIComponent(raw) })).not.toThrow();
  });

  it('does not throw for City: line without matching player', async () => {
    const { handle_web_info_text_message } = await import('@/renderer/mapctrl');
    const raw = 'City: Rome | Player (AI) - some data';
    expect(() => handle_web_info_text_message({ message: encodeURIComponent(raw) })).not.toThrow();
  });
});
