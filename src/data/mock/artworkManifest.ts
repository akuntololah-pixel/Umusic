export type ArtworkEntry = { file: string; tint: string };

export const ARTWORK_TINTS = {
  "artists": {
    "aurora-waves": {
      "file": "artist-aurora-waves",
      "tint": "#8AFF80"
    },
    "neon-pulse": {
      "file": "artist-neon-pulse",
      "tint": "#4DA6FF"
    },
    "midnight-echo": {
      "file": "artist-midnight-echo",
      "tint": "#FFB13D"
    },
    "velvet-static": {
      "file": "artist-velvet-static",
      "tint": "#39D0D8"
    },
    "solar-drift": {
      "file": "artist-solar-drift",
      "tint": "#F2F2F2"
    },
    "lunar-tide": {
      "file": "artist-lunar-tide",
      "tint": "#8AFF80"
    },
    "iron-crescent": {
      "file": "artist-iron-crescent",
      "tint": "#FFB13D"
    },
    "paper-moons": {
      "file": "artist-paper-moons",
      "tint": "#FF4D6D"
    },
    "glass-atlas": {
      "file": "artist-glass-atlas",
      "tint": "#FFB13D"
    },
    "wild-signal": {
      "file": "artist-wild-signal",
      "tint": "#B28AFF"
    },
    "crimson-fables": {
      "file": "artist-crimson-fables",
      "tint": "#7C5CFF"
    },
    "static-fields": {
      "file": "artist-static-fields",
      "tint": "#FF7A45"
    },
    "hollow-sun": {
      "file": "artist-hollow-sun",
      "tint": "#FFB13D"
    },
    "marble-sky": {
      "file": "artist-marble-sky",
      "tint": "#B28AFF"
    },
    "quiet-machines": {
      "file": "artist-quiet-machines",
      "tint": "#39D0D8"
    },
    "ember-lane": {
      "file": "artist-ember-lane",
      "tint": "#4DA6FF"
    }
  },
  "albums": {
    "afterglow": {
      "file": "album-afterglow",
      "tint": "#FF4D6D"
    },
    "night-drive": {
      "file": "album-night-drive",
      "tint": "#FF4D6D"
    },
    "paper-hearts": {
      "file": "album-paper-hearts",
      "tint": "#3DDC97"
    },
    "static-bloom": {
      "file": "album-static-bloom",
      "tint": "#FF5C8A"
    },
    "echo-chamber": {
      "file": "album-echo-chamber",
      "tint": "#4DA6FF"
    },
    "golden-hour": {
      "file": "album-golden-hour",
      "tint": "#3DDC97"
    },
    "low-orbit": {
      "file": "album-low-orbit",
      "tint": "#7C5CFF"
    },
    "midnight-snack": {
      "file": "album-midnight-snack",
      "tint": "#B28AFF"
    },
    "neon-cathedral": {
      "file": "album-neon-cathedral",
      "tint": "#FF4D6D"
    },
    "slow-motion": {
      "file": "album-slow-motion",
      "tint": "#3DDC97"
    }
  },
  "playlists": {
    "late-night-coding": {
      "file": "playlist-late-night-coding",
      "tint": "#B28AFF"
    },
    "morning-coffee": {
      "file": "playlist-morning-coffee",
      "tint": "#3DDC97"
    },
    "gym-rage": {
      "file": "playlist-gym-rage",
      "tint": "#3DDC97"
    },
    "rainy-window": {
      "file": "playlist-rainy-window",
      "tint": "#F2F2F2"
    },
    "road-trip": {
      "file": "playlist-road-trip",
      "tint": "#FF4D6D"
    },
    "focus-flow": {
      "file": "playlist-focus-flow",
      "tint": "#FF5C8A"
    }
  }
} as const;

export function tintFor(group: keyof typeof ARTWORK_TINTS, name: string): string {
  return (ARTWORK_TINTS[group] as Record<string, ArtworkEntry>)[name]?.tint ?? '#7C5CFF';
}
