import { LYRICS } from '@/data/mock/lyrics';
import { SONG_BY_ID } from '@/data/mock/songs';
import type { Lyrics as LyricsModel } from '@/types';
import type { AudioCacheManager, LyricsProvider, StreamProvider } from '../interfaces';
import { useCacheStore } from '@/stores/cacheStore';

export const mockLyricsProvider: LyricsProvider = {
  async getLyrics(songId): Promise<LyricsModel | null> {
    return LYRICS.find((l) => l.songId === songId) ?? null;
  },
};

export const mockStreamProvider: StreamProvider = {
  async resolveAudio(songId) {
    const song = SONG_BY_ID.get(songId);
    return {
      url: `mock://audio/${songId}`,
      kind: 'AUDIO',
      durationMs: song ? song.durationMs : 0,
    };
  },
  async resolveVideo(songId) {
    const song = SONG_BY_ID.get(songId);
    return {
      url: `mock://video/${songId}`,
      kind: 'VIDEO',
      durationMs: song ? song.durationMs : 0,
    };
  },
};

export const mockAudioCacheManager: AudioCacheManager = {
  async isCached(songId) {
    return useCacheStore.getState().statusFor(songId) === 'CACHED';
  },
  async cacheSong(songId) {
    useCacheStore.getState().cacheSong(songId);
  },
  async removeCachedSong(songId) {
    useCacheStore.getState().removeCached(songId);
  },
  async clearCache() {
    useCacheStore.getState().clearAudioCache();
  },
  async getCacheSize() {
    return useCacheStore.getState().totalSizeMb();
  },
  async getCachedSongs() {
    return Object.values(useCacheStore.getState().items)
      .filter((x) => x.status === 'CACHED')
      .map((x) => x.songId);
  },
};
