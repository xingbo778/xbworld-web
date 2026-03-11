/**
 * Tests for src/ts/utils/safeHtml.ts — sanitizeGameHtml()
 *
 * Verifies that dangerous patterns are stripped while safe game-message
 * formatting (bold, italic, colour spans, links) is preserved.
 */
import { describe, it, expect } from 'vitest';
import { sanitizeGameHtml } from '@/utils/safeHtml';

describe('sanitizeGameHtml — safe content preserved', () => {
  it('returns empty string for empty input', () => {
    expect(sanitizeGameHtml('')).toBe('');
  });

  it('passes plain text through unchanged', () => {
    expect(sanitizeGameHtml('Hello world')).toBe('Hello world');
  });

  it('preserves <b> tags', () => {
    expect(sanitizeGameHtml('<b>bold</b>')).toBe('<b>bold</b>');
  });

  it('preserves <i> and <em> tags', () => {
    expect(sanitizeGameHtml('<i>italic</i> <em>em</em>')).toBe('<i>italic</i> <em>em</em>');
  });

  it('preserves <span> with style attribute', () => {
    const input = '<span style="color:red">text</span>';
    expect(sanitizeGameHtml(input)).toBe(input);
  });

  it('preserves <br> tags', () => {
    expect(sanitizeGameHtml('line1<br>line2')).toBe('line1<br>line2');
  });

  it('preserves <a href="https://..."> links', () => {
    const input = '<a href="https://example.com">link</a>';
    expect(sanitizeGameHtml(input)).toBe(input);
  });
});

describe('sanitizeGameHtml — dangerous content stripped', () => {
  it('strips <script> blocks entirely', () => {
    const result = sanitizeGameHtml('<script>alert(1)</script>safe');
    expect(result).not.toContain('<script>');
    expect(result).not.toContain('alert');
    expect(result).toContain('safe');
  });

  it('strips multi-line <script> blocks', () => {
    const result = sanitizeGameHtml('<script type="text/javascript">\nfetch("/")\n</script>ok');
    expect(result).not.toContain('fetch');
    expect(result).toContain('ok');
  });

  it('strips onclick handlers', () => {
    const result = sanitizeGameHtml('<div onclick="alert(1)">click</div>');
    expect(result).not.toContain('onclick');
    expect(result).not.toContain('alert');
    expect(result).toContain('click');
  });

  it('strips onmouseover handlers', () => {
    const result = sanitizeGameHtml('<span onmouseover="evil()">text</span>');
    expect(result).not.toContain('onmouseover');
  });

  it('strips onerror on img', () => {
    const result = sanitizeGameHtml('<img src="x" onerror="xss()">');
    expect(result).not.toContain('onerror');
  });

  it('blocks javascript: in href', () => {
    const result = sanitizeGameHtml('<a href="javascript:alert(1)">click</a>');
    expect(result).not.toContain('javascript:');
  });

  it('blocks data: URI in src', () => {
    const result = sanitizeGameHtml('<img src="data:text/html,<script>x</script>">');
    expect(result).not.toContain('data:');
  });

  it('strips <iframe> tags', () => {
    const result = sanitizeGameHtml('<iframe src="https://evil.com"></iframe>safe');
    expect(result).not.toContain('iframe');
    expect(result).toContain('safe');
  });

  it('strips <object> tags', () => {
    const result = sanitizeGameHtml('<object data="evil.swf"></object>ok');
    expect(result).not.toContain('object');
  });
});

describe('sanitizeGameHtml — typical game message patterns', () => {
  it('handles buy-city prompt with bold city name and cost', () => {
    const input = 'Buy a <b>Warrior</b> in <b>Rome</b> for <b>100</b> gold?';
    const result = sanitizeGameHtml(input);
    expect(result).toBe(input);
    expect(result).toContain('Warrior');
    expect(result).toContain('100');
  });

  it('handles tech-gained message with formatting', () => {
    const input = 'You have discovered <b>Pottery</b>!<br>Your civilization advances.';
    const result = sanitizeGameHtml(input);
    expect(result).toBe(input);
  });

  it('handles coloured span from game log', () => {
    const input = '<span style="color:#58a6ff">Player 1 founded Rome</span>';
    const result = sanitizeGameHtml(input);
    expect(result).toContain('Rome');
    expect(result).toContain('color:#58a6ff');
  });
});
