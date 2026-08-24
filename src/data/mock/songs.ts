import type { Song } from '@/types';
import { ALBUM_IMAGES } from './images';
import { tintFor } from './artworkManifest';

const s = (
  id: string,
  title: string,
  artistId: string,
  artistName: string,
  albumId: string,
  albumTitle: string,
  durationMs: number,
  genre: string,
  plays: number,
  videoAvailable: boolean
): Song => ({
  id,
  title,
  artistId,
  artistName,
  albumId,
  albumTitle,
  durationMs,
  artwork: ALBUM_IMAGES[albumId],
  tint: tintFor('albums', albumId),
  genre,
  plays,
  videoAvailable,
});

export const SONGS: Song[] = [
  s('s01', 'Afterglow', 'aurora-waves', 'Aurora Waves', 'afterglow', 'Afterglow', 214000, 'Dream Pop', 48200000, true),
  s('s02', 'Halo Bloom', 'aurora-waves', 'Aurora Waves', 'afterglow', 'Afterglow', 198000, 'Dream Pop', 31100000, false),
  s('s03', 'Night Drive', 'neon-pulse', 'Neon Pulse', 'night-drive', 'Night Drive', 246000, 'Synthwave', 65300000, true),
  s('s04', 'Chrome Sunset', 'neon-pulse', 'Neon Pulse', 'night-drive', 'Night Drive', 222000, 'Synthwave', 39900000, true),
  s('s05', 'Paper Hearts', 'midnight-echo', 'Midnight Echo', 'paper-hearts', 'Paper Hearts', 205000, 'Indie Rock', 27400000, false),
  s('s06', 'Tape Delay', 'midnight-echo', 'Midnight Echo', 'paper-hearts', 'Paper Hearts', 233000, 'Indie Rock', 18800000, true),
  s('s07', 'Static Bloom', 'velvet-static', 'Velvet Static', 'static-bloom', 'Static Bloom', 187000, 'Lo-fi', 35600000, false),
  s('s08', 'Dust & Warm', 'velvet-static', 'Velvet Static', 'static-bloom', 'Static Bloom', 201000, 'Chillhop', 21900000, false),
  s('s09', 'Echo Chamber', 'solar-drift', 'Solar Drift', 'echo-chamber', 'Echo Chamber', 312000, 'Ambient', 12700000, false),
  s('s10', 'Gravity Well', 'solar-drift', 'Solar Drift', 'echo-chamber', 'Echo Chamber', 287000, 'Downtempo', 9800000, true),
  s('s11', 'Golden Hour', 'lunar-tide', 'Lunar Tide', 'golden-hour', 'Golden Hour', 226000, 'Dream Pop', 44100000, true),
  s('s12', 'Salt & Sky', 'lunar-tide', 'Lunar Tide', 'golden-hour', 'Golden Hour', 241000, 'Shoegaze', 16500000, false),
  s('s13', 'Low Orbit', 'iron-crescent', 'Iron Crescent', 'low-orbit', 'Low Orbit', 258000, 'Alt Rock', 38700000, true),
  s('s14', 'Gravity Says', 'iron-crescent', 'Iron Crescent', 'low-orbit', 'Low Orbit', 234000, 'Grunge', 14200000, false),
  s('s15', 'Midnight Snack', 'paper-moons', 'Paper Moons', 'midnight-snack', 'Midnight Snack', 194000, 'Indie Folk', 22300000, false),
  s('s16', 'Porch Light', 'paper-moons', 'Paper Moons', 'midnight-snack', 'Midnight Snack', 178000, 'Acoustic', 11700000, false),
  s('s17', 'Neon Cathedral', 'glass-atlas', 'Glass Atlas', 'neon-cathedral', 'Neon Cathedral', 296000, 'Electronic', 19800000, true),
  s('s18', 'Glass Hymn', 'glass-atlas', 'Glass Atlas', 'neon-cathedral', 'Neon Cathedral', 268000, 'IDM', 8900000, false),
  s('s19', 'Slow Motion', 'wild-signal', 'Wild Signal', 'slow-motion', 'Slow Motion', 219000, 'Indie Rock', 26500000, true),
  s('s20', 'Wildfire Season', 'wild-signal', 'Wild Signal', 'slow-motion', 'Slow Motion', 207000, 'Garage', 13400000, false),
];

export const SONG_BY_ID = new Map(SONGS.map((x) => [x.id, x]));
