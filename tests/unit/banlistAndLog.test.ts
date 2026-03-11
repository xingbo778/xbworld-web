/**
 * Unit tests for utils/banlist.ts and core/log.ts
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';

// ── banlist ────────────────────────────────────────────────────────────────

describe('check_text_with_banlist', () => {
  it('is exported as a function', async () => {
    const { check_text_with_banlist } = await import('@/utils/banlist');
    expect(typeof check_text_with_banlist).toBe('function');
  });

  it('returns false for null input', async () => {
    const { check_text_with_banlist } = await import('@/utils/banlist');
    expect(check_text_with_banlist(null)).toBe(false);
  });

  it('returns false for empty string', async () => {
    const { check_text_with_banlist } = await import('@/utils/banlist');
    expect(check_text_with_banlist('')).toBe(false);
  });

  it('returns true when banned_users is empty', async () => {
    const mod = await import('@/utils/banlist');
    mod.banned_users.length = 0;
    expect(mod.check_text_with_banlist('hello world')).toBe(true);
  });

  it('returns false when text contains a banned user (case-insensitive)', async () => {
    const mod = await import('@/utils/banlist');
    mod.banned_users.length = 0;
    mod.banned_users.push('baduser');
    expect(mod.check_text_with_banlist('Hello BADUSER!')).toBe(false);
    mod.banned_users.length = 0;
  });

  it('returns true when no banned users match', async () => {
    const mod = await import('@/utils/banlist');
    mod.banned_users.length = 0;
    mod.banned_users.push('banned1', 'banned2');
    expect(mod.check_text_with_banlist('gooduser is here')).toBe(true);
    mod.banned_users.length = 0;
  });
});

describe('check_text_with_banlist_exact', () => {
  it('returns false for null input', async () => {
    const { check_text_with_banlist_exact } = await import('@/utils/banlist');
    expect(check_text_with_banlist_exact(null)).toBe(false);
  });

  it('returns true for non-matching text', async () => {
    const mod = await import('@/utils/banlist');
    mod.banned_users.length = 0;
    mod.banned_users.push('bad');
    expect(mod.check_text_with_banlist_exact('good')).toBe(true);
    mod.banned_users.length = 0;
  });

  it('returns false for exact match (case-insensitive)', async () => {
    const mod = await import('@/utils/banlist');
    mod.banned_users.length = 0;
    mod.banned_users.push('eviluser');
    expect(mod.check_text_with_banlist_exact('EVILUSER')).toBe(false);
    mod.banned_users.length = 0;
  });

  it('returns true for partial match (exact requires full string)', async () => {
    const mod = await import('@/utils/banlist');
    mod.banned_users.length = 0;
    mod.banned_users.push('evil');
    expect(mod.check_text_with_banlist_exact('evildoer')).toBe(true);
    mod.banned_users.length = 0;
  });
});

// ── log ───────────────────────────────────────────────────────────────────

describe('log / LogLevel', () => {
  it('exports LogLevel constants', async () => {
    const { LogLevel } = await import('@/core/log');
    expect(LogLevel.FATAL).toBe(0);
    expect(LogLevel.ERROR).toBe(1);
    expect(LogLevel.NORMAL).toBe(2);
    expect(LogLevel.VERBOSE).toBe(3);
    expect(LogLevel.DEBUG).toBe(4);
  });

  it('log() does not throw', async () => {
    const { log, LogLevel } = await import('@/core/log');
    expect(() => log(LogLevel.NORMAL, 'test message')).not.toThrow();
  });

  it('logError() does not throw', async () => {
    const { logError } = await import('@/core/log');
    expect(() => logError('an error')).not.toThrow();
  });

  it('logNormal() does not throw', async () => {
    const { logNormal } = await import('@/core/log');
    expect(() => logNormal('a normal message')).not.toThrow();
  });

  it('freelog() does not throw', async () => {
    const { freelog } = await import('@/core/log');
    expect(() => freelog(2, 'legacy message')).not.toThrow();
  });

  it('setLogLevel() does not throw', async () => {
    const { setLogLevel, LogLevel } = await import('@/core/log');
    expect(() => setLogLevel(LogLevel.DEBUG)).not.toThrow();
    expect(() => setLogLevel(LogLevel.NORMAL)).not.toThrow();
  });

  it('log() suppresses messages above current level', async () => {
    const { log, setLogLevel, LogLevel } = await import('@/core/log');
    setLogLevel(LogLevel.ERROR);
    const spy = vi.spyOn(console, 'debug').mockImplementation(() => {});
    log(LogLevel.DEBUG, 'should be suppressed');
    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
    setLogLevel(LogLevel.NORMAL);
  });
});
