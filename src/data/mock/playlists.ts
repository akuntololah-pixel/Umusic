import type { Playlist } from '@/types';
import { PLAYLIST_IMAGES } from './images';
import { tintFor } from './artworkManifest';

const p = (
  id: string,
  title: string,
  description: string,
  songIds: string[],
  curator: string
): Playlist => ({
  id,
  title,
  description,
  artwork: PLAYLIST_IMAGES[id],
  tint: tintFor('playlists', id),
  songIds,
  curator,
});

export const PLAYLISTS: Playlist[] = [
  p('late-night-coding', 'Late Night Coding', 'Deep focus beats for shipping through the dark.', ['s07', 's09', 's17', 's08', 's10', 's18'], 'Umusic Editorial'),
  p('morning-coffee', 'Morning Coffee', 'Gentle wake-up acoustic and dream pop.', ['s15', 's01', 's16', 's11', 's02'], 'Umusic Editorial'),
  p('gym-rage', 'Gym Rage', 'Loud guitars and heavy synths. No brakes.', ['s13', 's03', 's19', 's14', 's20', 's04'], 'Umusic Editorial'),
  p('rainy-window', 'Rainy Window', 'Slow, wet, reflective. Watch the drops.', ['s09', 's05', 's12', 's10', 's06'], 'Umusic Editorial'),
  p('road-trip', 'Road Trip 3000', 'Windows down, highway hum, full volume.', ['s19', 's03', 's13', 's11', 's04', 's01'], 'Umusic Editorial'),
  p('focus-flow', 'Focus Flow', 'Instrumental current for deep work sessions.', ['s09', 's17', 's10', 's18', 's07'], 'Umusic Editorial'),
];

export const PLAYLIST_BY_ID = new Map(PLAYLISTS.map((x) => [x.id, x]));
