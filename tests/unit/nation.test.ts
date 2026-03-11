/**
 * Unit tests for data/nation.ts
 *
 * Tests nation query functions: loveText, getScoreText, colLove.
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  MAX_AI_LOVE,
  loveText,
  getScoreText,
  colLove,
  getPlayerScoresSummary,
} from '@/data/nation';
import { store } from '@/data/store';
import { PlayerFlag } from '@/data/player';
import type { Player } from '@/data/types';

/* eslint-disable @typescript-eslint/no-explicit-any */

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

describe('Nation constants', () => {
  it('should export MAX_AI_LOVE as 1000', () => {
    expect(MAX_AI_LOVE).toBe(1000);
  });
});

// ---------------------------------------------------------------------------
// loveText
// ---------------------------------------------------------------------------

describe('loveText', () => {
  it('should return "Genocidal" for very negative love', () => {
    expect(loveText(-950)).toBe('Genocidal');
    expect(loveText(-1000)).toBe('Genocidal');
  });

  it('should return "Belligerent" for moderately negative love', () => {
    expect(loveText(-750)).toBe('Belligerent');
  });

  it('should return "Hostile" for somewhat negative love', () => {
    expect(loveText(-550)).toBe('Hostile');
  });

  it('should return "Uncooperative" for slightly negative love', () => {
    expect(loveText(-300)).toBe('Uncooperative');
  });

  it('should return "Uneasy" for mildly negative love', () => {
    expect(loveText(-150)).toBe('Uneasy');
  });

  it('should return "Neutral" for near-zero love', () => {
    expect(loveText(0)).toBe('Neutral');
    expect(loveText(50)).toBe('Neutral');
    expect(loveText(-50)).toBe('Neutral');
  });

  it('should return "Respectful" for slightly positive love', () => {
    expect(loveText(200)).toBe('Respectful');
  });

  it('should return "Helpful" for moderately positive love', () => {
    expect(loveText(400)).toBe('Helpful');
  });

  it('should return "Enthusiastic" for quite positive love', () => {
    expect(loveText(600)).toBe('Enthusiastic');
  });

  it('should return "Admiring" for very positive love', () => {
    expect(loveText(850)).toBe('Admiring');
  });

  it('should return "Worshipful" for maximum love', () => {
    expect(loveText(950)).toBe('Worshipful');
    expect(loveText(1000)).toBe('Worshipful');
  });
});

// ---------------------------------------------------------------------------
// getScoreText
// ---------------------------------------------------------------------------

describe('getScoreText', () => {
  it('should return score when >= 0', () => {
    expect(getScoreText({ score: 100 } as unknown as Player)).toBe(100);
    expect(getScoreText({ score: 0 } as unknown as Player)).toBe(0);
  });

  it('should return "?" when score is negative', () => {
    expect(getScoreText({ score: -1 } as unknown as Player)).toBe('?');
  });
});

// ---------------------------------------------------------------------------
// colLove
// ---------------------------------------------------------------------------

describe('colLove', () => {
  beforeEach(() => {
    // clientIsObserver reads store.observing and store.client.conn
    store.observing = false;
    // clientPlaying reads store.client.conn.playing
    store.client = {
      conn: {
        id: 0,
        playing: { playerno: 0 } as any,
      },
    };
  });

  afterEach(() => {
    store.observing = false;
    store.client = { conn: { id: 0, playing: null } };
  });

  it('should return "-" when player is the current player', () => {
    const pplayer = {
      playerno: 0,
      flags: { isSet: () => true },
      love: { 0: 500 },
    } as unknown as Player;
    expect(colLove(pplayer)).toBe('-');
  });

  it('should return "-" when client is observer', () => {
    store.observing = true;
    const pplayer = {
      playerno: 1,
      flags: { isSet: () => true },
      love: { 0: 500 },
    } as unknown as Player;
    expect(colLove(pplayer)).toBe('-');
  });

  it('should return "-" when player is not AI', () => {
    const pplayer = {
      playerno: 1,
      flags: { isSet: () => false },
      love: { 0: 500 },
    } as unknown as Player;
    expect(colLove(pplayer)).toBe('-');
  });

  it('should return love text for AI player', () => {
    const pplayer = {
      playerno: 1,
      flags: { isSet: (flag: number) => flag === PlayerFlag.PLRF_AI },
      love: { 0: 500 },
    } as unknown as Player;
    expect(colLove(pplayer)).toBe('Helpful');
  });

  it('should return "Genocidal" for AI with very low love', () => {
    const pplayer = {
      playerno: 1,
      flags: { isSet: (flag: number) => flag === PlayerFlag.PLRF_AI },
      love: { 0: -950 },
    } as unknown as Player;
    expect(colLove(pplayer)).toBe('Genocidal');
  });
});

// ---------------------------------------------------------------------------
// getPlayerScoresSummary
// ---------------------------------------------------------------------------

describe('getPlayerScoresSummary', () => {
  beforeEach(() => {
    store.reset();
  });

  it('returns no-data message when store has no players', () => {
    const result = getPlayerScoresSummary();
    expect(result).toContain('No score data');
  });

  it('returns an HTML table when players exist', () => {
    store.players = {
      0: { playerno: 0, name: 'Caesar', nation: 0, score: 120 } as never,
      1: { playerno: 1, name: 'Pericles', nation: 1, score: 80 } as never,
    };
    store.nations = {
      0: { id: 0, adjective: 'Roman' } as never,
      1: { id: 1, adjective: 'Greek' } as never,
    };
    const result = getPlayerScoresSummary();
    expect(result).toContain('<table');
    expect(result).toContain('Caesar');
    expect(result).toContain('Pericles');
  });

  it('sorts players by score descending', () => {
    store.players = {
      0: { playerno: 0, name: 'Low', nation: 0, score: 10 } as never,
      1: { playerno: 1, name: 'High', nation: 1, score: 999 } as never,
    };
    store.nations = {};
    const result = getPlayerScoresSummary();
    // High scorer should appear before Low scorer in the table
    expect(result.indexOf('High')).toBeLessThan(result.indexOf('Low'));
  });

  it('escapes player name HTML', () => {
    store.players = {
      0: { playerno: 0, name: '<script>xss</script>', nation: 0, score: 5 } as never,
    };
    store.nations = {};
    const result = getPlayerScoresSummary();
    expect(result).not.toContain('<script>');
    expect(result).toContain('&lt;script&gt;');
  });
});
