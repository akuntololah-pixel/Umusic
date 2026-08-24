import type { Lyrics, LyricLine } from '@/types';

const buildLines = (texts: string[], startMs = 2400, stepMs = 3400): LyricLine[] =>
  texts.map((text, i) => ({
    startMs: startMs + i * stepMs,
    endMs: startMs + (i + 1) * stepMs,
    text,
  }));

const LYRIC_SETS: Record<string, string[]> = {
  s01: [
    'We chase the light after dark',
    'Every color leaves its mark',
    'Hold the afterglow a little longer',
    'The night keeps making us stronger',
    'Stay until the silence breaks',
    'Stay for every breath it takes',
    'We are light we are afterglow',
    'Burning soft and burning slow',
  ],
  s03: [
    'Headlights paint the interstate',
    'Midnight is a perfect weight',
    'Engines hum in synth and chrome',
    'Every exit feels like home',
    'Drive until the sun comes up',
    'Drink the night from one gold cup',
    'Night drive on an endless line',
    'Neon hearts in overdrive',
  ],
  s07: [
    'Dust settles on the window pane',
    'Static blooms like warm rain',
    'Tape hiss lullaby',
    'Under a violet sky',
    'Slow the record down',
    'Let the room spin around',
    'Everything is soft right now',
    'Everything is soft somehow',
  ],
  s11: [
    'Golden hour on your face',
    'Time slows down its steady pace',
    'Keep this moment in a jar',
    'Keep it glowing where you are',
    'Sun goes down but we remain',
    'Painted warm in amber grain',
    'Golden hour stay with me',
    'Linger like the memory',
  ],
  s13: [
    'Strapped to a falling star',
    'Low orbit is where we are',
    'Engines cut the sky in two',
    'Nothing left to hold on to',
    'Weightless in the afterburn',
    'No return and no concern',
    'We orbit we come alive',
    'Falling is how we survive',
  ],
};

export const LYRICS: Lyrics[] = Object.entries(LYRIC_SETS).map(([songId, texts]) => ({
  songId,
  synced: true,
  lines: buildLines(texts),
}));
