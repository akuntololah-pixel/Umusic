import { mockMusicProvider, buildHomeSections } from '@/services/providers/mockMusicProvider';
import { SONGS, SONG_BY_ID } from '@/data/mock/songs';
import { ARTISTS } from '@/data/mock/artists';
import { ALBUMS } from '@/data/mock/albums';
import { PLAYLISTS } from '@/data/mock/playlists';

describe('mockMusicProvider', () => {
  it('has coherent mock catalog', () => {
    expect(SONGS.length).toBeGreaterThanOrEqual(20);
    expect(ARTISTS.length).toBeGreaterThanOrEqual(15);
    expect(ALBUMS.length).toBeGreaterThanOrEqual(10);
    expect(PLAYLISTS.length).toBeGreaterThanOrEqual(6);

    for (const song of SONGS) {
      expect(ARTISTS.some((a) => a.id === song.artistId)).toBe(true);
      expect(ALBUMS.some((a) => a.id === song.albumId)).toBe(true);
      expect(song.durationMs).toBeGreaterThan(0);
    }
    for (const album of ALBUMS) {
      expect(ARTISTS.some((a) => a.id === album.artistId)).toBe(true);
      for (const songId of album.songIds) {
        expect(SONG_BY_ID.get(songId)?.albumId).toBe(album.id);
      }
    }
    for (const playlist of PLAYLISTS) {
      for (const songId of playlist.songIds) {
        expect(SONG_BY_ID.has(songId)).toBe(true);
      }
    }
  });

  it('searches songs, artists, albums, playlists', async () => {
    const results = await mockMusicProvider.search('aurora');
    expect(results.artists.length).toBeGreaterThan(0);
    expect(results.artists[0].name).toBe('Aurora Waves');
    expect(results.songs.length).toBeGreaterThan(0);

    const empty = await mockMusicProvider.search('zzzz-nothing');
    expect(empty.songs).toHaveLength(0);
    expect(empty.artists).toHaveLength(0);
  });

  it('getSong/getArtist/getAlbum/getPlaylist resolve', async () => {
    const song = await mockMusicProvider.getSong('s01');
    expect(song?.title).toBe('Afterglow');
    const artist = await mockMusicProvider.getArtist('aurora-waves');
    expect(artist?.name).toBe('Aurora Waves');
    const album = await mockMusicProvider.getAlbum('afterglow');
    expect(album?.songIds).toContain('s01');
    const playlist = await mockMusicProvider.getPlaylist('late-night-coding');
    expect(playlist?.songIds.length).toBeGreaterThan(0);
    expect(await mockMusicProvider.getSong('nope')).toBeNull();
  });

  it('personalized home includes selected artist sections', async () => {
    const feed = await mockMusicProvider.getHome(['aurora-waves', 'neon-pulse', 'iron-crescent']);
    const titles = feed.sections.map((s) => s.title);
    expect(titles).toContain('Made For You');
    expect(titles.some((t) => t.includes('Aurora Waves'))).toBe(true);
    expect(titles).toContain('Recommended For You');
    expect(titles).toContain('Trending Now');
    expect(titles).toContain('New Releases');
  });

  it('generic home without selections still has base sections', async () => {
    const feed = await mockMusicProvider.getHome([]);
    const ids = feed.sections.map((s) => s.id);
    expect(ids).toContain('recent');
    expect(ids).toContain('trending');
    expect(ids).not.toContain('made-for-you');
  });

  it('buildHomeSections is deterministic', () => {
    const a = buildHomeSections(['aurora-waves']);
    const b = buildHomeSections(['aurora-waves']);
    expect(a).toEqual(b);
  });

  it('getRelated returns artists sharing genres', async () => {
    const related = await mockMusicProvider.getRelated('aurora-waves');
    expect(related.length).toBeGreaterThan(0);
    expect(related.every((r) => r.id !== 'aurora-waves')).toBe(true);
  });
});
