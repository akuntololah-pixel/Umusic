import { ARTISTS, ARTIST_BY_ID } from '@/data/mock/artists';
import { ALBUMS, ALBUM_BY_ID } from '@/data/mock/albums';
import { SONGS, SONG_BY_ID } from '@/data/mock/songs';
import { PLAYLISTS, PLAYLIST_BY_ID } from '@/data/mock/playlists';
import type { Album, Artist, FeedSection, Playlist, Song } from '@/types';
import type { HomeFeed, MusicProvider } from '../interfaces';

const normalize = (s: string) => s.toLowerCase().trim();

function relatedFor(artistId: string): Artist[] {
  const artist = ARTIST_BY_ID.get(artistId);
  if (!artist) return [];
  const shared = ARTISTS.filter(
    (x) => x.id !== artistId && x.genres.some((g) => artist.genres.includes(g))
  );
  const rest = ARTISTS.filter((x) => x.id !== artistId && !shared.includes(x));
  return [...shared, ...rest].slice(0, 6);
}

export function buildHomeSections(selectedArtistIds: string[]): FeedSection[] {
  const sections: FeedSection[] = [];
  const recentSongIds = SONGS.slice(0, 8).map((s) => s.id);

  sections.push({ id: 'recent', title: 'Recently Played', type: 'songs', itemIds: recentSongIds });

  const picked = selectedArtistIds
    .map((id) => ARTIST_BY_ID.get(id))
    .filter((x): x is Artist => Boolean(x));

  if (picked.length >= 3) {
    sections.push({
      id: 'made-for-you',
      title: 'Made For You',
      type: 'playlists',
      itemIds: PLAYLISTS.slice(0, 4).map((p) => p.id),
    });
  }

  picked.slice(0, 3).forEach((artist, i) => {
    const artistSongs = SONGS.filter((s) => s.artistId === artist.id).map((s) => s.id);
    const artistAlbums = ALBUMS.filter((a) => a.artistId === artist.id).map((a) => a.id);
    const titles = ['Because you like', 'From', 'More from'];
    if (artistSongs.length > 0) {
      sections.push({
        id: `artist-songs-${artist.id}`,
        title: `${titles[i % titles.length]} ${artist.name}`,
        type: 'songs',
        itemIds: artistSongs,
      });
    }
    if (i === 0 && artistAlbums.length > 0) {
      sections.push({
        id: `artist-albums-${artist.id}`,
        title: `${artist.name} Albums`,
        type: 'albums',
        itemIds: artistAlbums,
      });
    }
  });

  const relatedIds = new Set<string>();
  picked.forEach((artist) => relatedFor(artist.id).forEach((r) => relatedIds.add(r.id)));
  if (relatedIds.size > 0) {
    sections.push({
      id: 'recommended',
      title: 'Recommended For You',
      type: 'artists',
      itemIds: [...relatedIds].slice(0, 8),
    });
  }

  sections.push({
    id: 'trending',
    title: 'Trending Now',
    type: 'songs',
    itemIds: [...SONGS].sort((x, y) => y.plays - x.plays).slice(0, 8).map((s) => s.id),
  });

  sections.push({
    id: 'new-releases',
    title: 'New Releases',
    type: 'albums',
    itemIds: [...ALBUMS].sort((x, y) => y.year - x.year).slice(0, 8).map((a) => a.id),
  });

  sections.push({
    id: 'popular-artists',
    title: 'Popular Artists',
    type: 'artists',
    itemIds: [...ARTISTS].sort((x, y) => y.monthlyListeners - x.monthlyListeners).slice(0, 8).map((a) => a.id),
  });

  sections.push({
    id: 'favorites',
    title: 'Your Favorites',
    type: 'playlists',
    itemIds: PLAYLISTS.slice(2, 6).map((p) => p.id),
  });

  return sections;
}

export const mockMusicProvider: MusicProvider = {
  async search(query) {
    const q = normalize(query);
    if (!q) return { songs: [], artists: [], albums: [], playlists: [] };
    const songs = SONGS.filter(
      (s) => normalize(s.title).includes(q) || normalize(s.artistName).includes(q)
    ).slice(0, 12);
    const artists = ARTISTS.filter((a) => normalize(a.name).includes(q)).slice(0, 8);
    const albums = ALBUMS.filter(
      (a) => normalize(a.title).includes(q) || normalize(a.artistName).includes(q)
    ).slice(0, 8);
    const playlists = PLAYLISTS.filter(
      (p) => normalize(p.title).includes(q) || normalize(p.description).includes(q)
    ).slice(0, 8);
    return { songs, artists, albums, playlists };
  },

  async getSong(id) {
    return SONG_BY_ID.get(id) ?? null;
  },

  async getArtist(id) {
    return ARTIST_BY_ID.get(id) ?? null;
  },

  async getAlbum(id) {
    return ALBUM_BY_ID.get(id) ?? null;
  },

  async getPlaylist(id) {
    return PLAYLIST_BY_ID.get(id) ?? null;
  },

  async getHome(selectedArtistIds: string[]): Promise<HomeFeed> {
    return { sections: buildHomeSections(selectedArtistIds) };
  },

  async getRelated(artistId) {
    return relatedFor(artistId);
  },
};

export function songsByIds(ids: string[]): Song[] {
  return ids.map((id) => SONG_BY_ID.get(id)).filter((s): s is Song => Boolean(s));
}

export function albumsByIds(ids: string[]): Album[] {
  return ids.map((id) => ALBUM_BY_ID.get(id)).filter((a): a is Album => Boolean(a));
}

export function artistsByIds(ids: string[]): Artist[] {
  return ids.map((id) => ARTIST_BY_ID.get(id)).filter((a): a is Artist => Boolean(a));
}

export function playlistsByIds(ids: string[]): Playlist[] {
  return ids.map((id) => PLAYLIST_BY_ID.get(id)).filter((p): p is Playlist => Boolean(p));
}
