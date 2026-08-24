import type { HistoryItem, QueueItem } from '@/types';

export const INITIAL_HISTORY: HistoryItem[] = [
  { songId: 's03', playedAt: 1756000000000 },
  { songId: 's07', playedAt: 1755999000000 },
  { songId: 's01', playedAt: 1755998000000 },
  { songId: 's13', playedAt: 1755997000000 },
  { songId: 's11', playedAt: 1755996000000 },
  { songId: 's19', playedAt: 1755995000000 },
  { songId: 's09', playedAt: 1755994000000 },
  { songId: 's15', playedAt: 1755993000000 },
  { songId: 's17', playedAt: 1755992000000 },
  { songId: 's05', playedAt: 1755991000000 },
];

export const INITIAL_FAVORITES: string[] = [
  's01', 's03', 's05', 's07', 's09',
  's11', 's13', 's15', 's17', 's19',
];

export const INITIAL_QUEUE: QueueItem[] = [
  's03', 's07', 's13', 's11', 's19', 's09', 's15', 's17', 's05', 's01',
].map((songId, i) => ({ songId, addedAt: 1756000000000 + i }));
