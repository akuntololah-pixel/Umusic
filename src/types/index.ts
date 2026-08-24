export type PlaybackMode = 'AUDIO' | 'VIDEO';

export type ThemeMode = 'dark' | 'light' | 'system';

export type NavStyle = 'bottom' | 'sidebar';

export type DisplaySize = 'small' | 'default' | 'large' | 'xlarge';

export type RepeatMode = 'off' | 'all' | 'one';

export type CacheStatus = 'NOT_CACHED' | 'CACHING' | 'CACHED' | 'CACHE_FAILED' | 'OFFLINE';

export interface Song {
  id: string;
  title: string;
  artistId: string;
  artistName: string;
  albumId: string;
  albumTitle: string;
  durationMs: number;
  artwork: number;
  tint: string;
  genre: string;
  plays: number;
  videoAvailable: boolean;
}

export interface Artist {
  id: string;
  name: string;
  artwork: number;
  tint: string;
  genres: string[];
  monthlyListeners: number;
  isOnboardingSuggestion: boolean;
}

export interface Album {
  id: string;
  title: string;
  artistId: string;
  artistName: string;
  year: number;
  artwork: number;
  tint: string;
  songIds: string[];
  type: 'album' | 'single';
}

export interface Playlist {
  id: string;
  title: string;
  description: string;
  artwork: number;
  tint: string;
  songIds: string[];
  curator: string;
  isUserPlaylist?: boolean;
}

export interface LyricLine {
  startMs: number;
  endMs: number;
  text: string;
}

export interface Lyrics {
  songId: string;
  synced: boolean;
  lines: LyricLine[];
  plainText?: string;
}

export interface QueueItem {
  songId: string;
  addedAt: number;
}

export interface HistoryItem {
  songId: string;
  playedAt: number;
}

export type PlaybackStatus = 'playing' | 'paused' | 'stopped';

export interface CacheItem {
  songId: string;
  sizeMb: number;
  cachedAt: number;
  status: CacheStatus;
}

export interface OfflineItem {
  songId: string;
  keptAt: number;
}

export type FeedSectionType = 'songs' | 'albums' | 'artists' | 'playlists';

export interface FeedSection {
  id: string;
  title: string;
  type: FeedSectionType;
  itemIds: string[];
}

export interface SearchResult {
  songs: Song[];
  artists: Artist[];
  albums: Album[];
  playlists: Playlist[];
}

export interface AccentPreset {
  id: string;
  label: string;
  color: string;
}

export interface StreamResolution {
  url: string;
  kind: PlaybackMode;
  durationMs: number;
}
