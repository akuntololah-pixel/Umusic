# Umusic

Umusic is a **zero-server mobile music app frontend** built with React Native, Expo SDK 57, TypeScript, and Expo Router. It is a complete, polished foundation that runs entirely on **local mock data** — no backend, no API keys, no network.

## Features

- **Home** — time-aware greeting, personalized shelves (Made For You, Trending, New Releases, Recommended), filter chips, genres & moods
- **Onboarding** — first-launch flow: animated wordmark splash → welcome → pick 3–15 favorite artists → personalized feed (skippable)
- **Search** — songs, artists, albums, playlists with recent searches and genre tiles
- **Artist / Album / Playlist** — detail screens with play, shuffle, favorites, related artists
- **Player** — glass MiniPlayer (tap, swipe up/left/right gestures, adaptive tint) and immersive FullPlayer with ambient gradients, Audio/Video mode, mock playback, synced lyrics with auto-scroll, and queue management
- **Library** — favorites, playlists (create/edit/reorder), history, offline audio
- **Cache & Offline** — cache states, offline mode simulation, storage usage, cache limits
- **Settings** — Dark/Light/System theme, 12 accent presets + custom hex, display size scaling (0.85x–1.3x), navigation style (floating glass bottom bar ↔ collapsible sidebar), playback & cache preferences, reset music preferences

## Design language

- Dark-first, premium, YouTube Music-inspired layout with an upgraded motion layer
- Glassmorphism on navigation, MiniPlayer, and sheets (with solid fallbacks)
- No pure squares — every element uses the shared radius scale
- Typography-only brand: animated "Umusic" wordmark splash, system fonts only
- Deterministic local artwork generated with Sharp + SVG templates (`scripts/generate-artwork.mjs`)

## Architecture

```
app/          Expo Router routes (tabs, player, onboarding, details)
src/
  components/ common, music, player, lyrics, library, onboarding
  data/mock/  coherent mock catalog (16 artists, 10 albums, 20 songs, 6 playlists, 5 lyric sets)
  stores/     Zustand: player, library, cache, settings, ui
  services/   provider interfaces + mock implementations (MusicProvider, LyricsProvider,
              StreamProvider, AudioCacheManager) — UI only consumes interfaces
  theme/      centralized design tokens (colors, glass, radius, accents, display scale)
  hooks/      shared hooks
  utils/      formatters
```

## Commands

```bash
npm install          # install dependencies
npm start            # start Expo dev server
npm test             # run unit + component tests (jest-expo)
npm run typecheck    # strict TypeScript check
npm run lint         # ESLint (expo config)
node scripts/generate-artwork.mjs   # regenerate deterministic artwork
```

## What is intentionally NOT here (later phases)

Real music providers, real audio/video streaming, real lyrics APIs, real audio caching/downloads, real offline playback, authentication, and any backend. The UI consumes provider interfaces only, so future phases can swap the mocks for real implementations without touching screens.
