import type { Album, Artist, FeedSection, Playlist, Song, StreamResolution, Lyrics } from '@/types';

export interface HomeFeed {
  sections: FeedSection[];
}

export interface MusicProvider {
  search(query: string): Promise<{ songs: Song[]; artists: Artist[]; albums: Album[]; playlists: Playlist[] }>;
  getSong(id: string): Promise<Song | null>;
  getArtist(id: string): Promise<Artist | null>;
  getAlbum(id: string): Promise<Album | null>;
  getPlaylist(id: string): Promise<Playlist | null>;
  getHome(selectedArtistIds: string[]): Promise<HomeFeed>;
  getRelated(artistId: string): Promise<Artist[]>;
}

export interface LyricsProvider {
  getLyrics(songId: string): Promise<Lyrics | null>;
}

export interface StreamProvider {
  resolveAudio(songId: string): Promise<StreamResolution>;
  resolveVideo(songId: string): Promise<StreamResolution>;
}

export interface AudioCacheManager {
  isCached(songId: string): Promise<boolean>;
  cacheSong(songId: string): Promise<void>;
  removeCachedSong(songId: string): Promise<void>;
  clearCache(): Promise<void>;
  getCacheSize(): Promise<number>;
  getCachedSongs(): Promise<string[]>;
}
