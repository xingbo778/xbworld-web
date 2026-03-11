/**
 * Unit tests for audio/sounds.ts and audio/audioState.ts
 */
import { describe, it, expect } from 'vitest';

// ── audioState ────────────────────────────────────────────────────────────

describe('audioState', () => {
  it('exports audio as null initially', async () => {
    const { audio } = await import('@/audio/audioState');
    // audio starts as null (no AudioPlayer initialized in test env)
    expect(audio).toBeNull();
  });

  it('setAudio does not throw', async () => {
    const { setAudio } = await import('@/audio/audioState');
    expect(() => setAudio(null)).not.toThrow();
  });

  it('setMusicList does not throw', async () => {
    const { setMusicList } = await import('@/audio/audioState');
    expect(() => setMusicList(['track1.mp3', 'track2.ogg'])).not.toThrow();
  });

  it('supports_mp3 returns a boolean', async () => {
    const { supports_mp3 } = await import('@/audio/audioState');
    expect(typeof supports_mp3()).toBe('boolean');
  });
});

// ── sounds ────────────────────────────────────────────────────────────────

describe('sounds', () => {
  it('sound_path is exported as a string', async () => {
    const { sound_path } = await import('@/audio/sounds');
    expect(typeof sound_path).toBe('string');
  });

  it('play_sound does not throw when audio is null', async () => {
    const { play_sound } = await import('@/audio/sounds');
    // audio is null in test env — play_sound should be a no-op
    expect(() => play_sound('LrgExpl.ogg')).not.toThrow();
  });

  it('sound_error_handler does not throw', async () => {
    const { sound_error_handler } = await import('@/audio/sounds');
    expect(() => sound_error_handler(new Error('test error'))).not.toThrow();
  });

  it('check_unit_sound_play does not throw for null units', async () => {
    const { check_unit_sound_play } = await import('@/audio/sounds');
    expect(() => check_unit_sound_play(null, null)).not.toThrow();
  });

  it('unit_move_sound_play does not throw for null unit', async () => {
    const { unit_move_sound_play } = await import('@/audio/sounds');
    expect(() => unit_move_sound_play(null)).not.toThrow();
  });

  it('play_combat_sound does not throw for null unit', async () => {
    const { play_combat_sound } = await import('@/audio/sounds');
    expect(() => play_combat_sound(null)).not.toThrow();
  });
});
