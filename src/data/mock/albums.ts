import type { Album } from '@/types';
import { ALBUM_IMAGES } from './images';
import { tintFor } from './artworkManifest';

const al = (
  id: string,
  title: string,
  artistId: string,
  artistName: string,
  year: number,
  songIds: string[],
  type: 'album' | 'single' = 'album'
): Album => ({
  id,
  title,
  artistId,
  artistName,
  year,
  artwork: ALBUM_IMAGES[id],
  tint: tintFor('albums', id),
  songIds,
  type,
});

export const ALBUMS: Album[] = [
  al('afterglow', 'Afterglow', 'aurora-waves', 'Aurora Waves', 2025, ['s01', 's02']),
  al('night-drive', 'Night Drive', 'neon-pulse', 'Neon Pulse', 2024, ['s03', 's04']),
  al('paper-hearts', 'Paper Hearts', 'midnight-echo', 'Midnight Echo', 2023, ['s05', 's06']),
  al('static-bloom', 'Static Bloom', 'velvet-static', 'Velvet Static', 2025, ['s07', 's08']),
  al('echo-chamber', 'Echo Chamber', 'solar-drift', 'Solar Drift', 2022, ['s09', 's10']),
  al('golden-hour', 'Golden Hour', 'lunar-tide', 'Lunar Tide', 2024, ['s11', 's12']),
  al('low-orbit', 'Low Orbit', 'iron-crescent', 'Iron Crescent', 2023, ['s13', 's14']),
  al('midnight-snack', 'Midnight Snack', 'paper-moons', 'Paper Moons', 2025, ['s15', 's16']),
  al('neon-cathedral', 'Neon Cathedral', 'glass-atlas', 'Glass Atlas', 2022, ['s17', 's18']),
  al('slow-motion', 'Slow Motion', 'wild-signal', 'Wild Signal', 2024, ['s19', 's20']),
];

export const ALBUM_BY_ID = new Map(ALBUMS.map((x) => [x.id, x]));
