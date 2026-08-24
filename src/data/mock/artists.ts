import type { Artist } from '@/types';
import { ARTIST_IMAGES } from './images';
import { tintFor } from './artworkManifest';

const a = (
  id: string,
  name: string,
  genres: string[],
  monthlyListeners: number,
  suggestion: boolean
): Artist => ({
  id,
  name,
  artwork: ARTIST_IMAGES[id],
  tint: tintFor('artists', id),
  genres,
  monthlyListeners,
  isOnboardingSuggestion: suggestion,
});

export const ARTISTS: Artist[] = [
  a('aurora-waves', 'Aurora Waves', ['Dream Pop', 'Ambient'], 12400000, true),
  a('neon-pulse', 'Neon Pulse', ['Synthwave', 'Electronic'], 9800000, true),
  a('midnight-echo', 'Midnight Echo', ['Indie Rock', 'Alt Pop'], 7300000, true),
  a('velvet-static', 'Velvet Static', ['Lo-fi', 'Chillhop'], 5600000, true),
  a('solar-drift', 'Solar Drift', ['Ambient', 'Downtempo'], 4100000, true),
  a('lunar-tide', 'Lunar Tide', ['Dream Pop', 'Shoegaze'], 3900000, true),
  a('iron-crescent', 'Iron Crescent', ['Alt Rock', 'Grunge'], 6200000, true),
  a('paper-moons', 'Paper Moons', ['Indie Folk', 'Acoustic'], 2800000, true),
  a('glass-atlas', 'Glass Atlas', ['Electronic', 'IDM'], 3400000, true),
  a('wild-signal', 'Wild Signal', ['Indie Rock', 'Garage'], 4500000, true),
  a('crimson-fables', 'Crimson Fables', ['Baroque Pop', 'Art Rock'], 2100000, true),
  a('static-fields', 'Static Fields', ['Techno', 'Electronic'], 5100000, true),
  a('hollow-sun', 'Hollow Sun', ['Post Rock', 'Instrumental'], 1900000, true),
  a('marble-sky', 'Marble Sky', ['Chillhop', 'Jazz Hop'], 2700000, true),
  a('quiet-machines', 'Quiet Machines', ['Ambient', 'Minimal'], 1500000, false),
  a('ember-lane', 'Ember Lane', ['Soul', 'Neo Soul'], 3300000, false),
];

export const ARTIST_BY_ID = new Map(ARTISTS.map((x) => [x.id, x]));

export const ONBOARDING_ARTISTS = ARTISTS.filter((x) => x.isOnboardingSuggestion);
