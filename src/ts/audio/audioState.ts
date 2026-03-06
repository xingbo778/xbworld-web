/**
 * Shared audio state — used by civClient.ts and options.ts.
 *
 * Centralises the module-level variables that were previously stored
 * on `window` via `(window as any)`.
 */

/** audiojs player instance shape */
interface AudioPlayer {
  play: () => void;
  load: (src: string) => void;
  [key: string]: unknown;
}

export let music_list: string[] = [
  'battle-epic', 'battle2', 'battle3', 'battle4',
  'battle5', 'battle6', 'battle7', 'battle8',
];

export let audio: AudioPlayer | null = null;

export function setAudio(value: AudioPlayer | null): void {
  audio = value;
}

export function setMusicList(value: string[]): void {
  music_list = value;
}

/**
 * Check whether the browser supports MP3 playback.
 * Falls back to `false` if detection is unavailable.
 */
export function supports_mp3(): boolean {
  try {
    const a = document.createElement('audio');
    return !!(a.canPlayType && a.canPlayType('audio/mpeg'));
  } catch {
    return false;
  }
}
