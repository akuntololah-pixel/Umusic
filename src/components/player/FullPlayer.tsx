import React, { useEffect, useMemo, useState } from 'react';
import { Animated, Easing, PanResponder, Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/theme/ThemeProvider';
import { Artwork } from '@/components/common/Artwork';
import { ProgressBar } from './ProgressBar';
import { PlayerControls } from './PlayerControls';
import { PlaybackModeSelector } from './PlaybackModeSelector';
import { VideoSurface } from './VideoSurface';
import { usePlayerStore } from '@/stores/playerStore';
import { useLibraryStore } from '@/stores/libraryStore';
import { useCurrentSong } from '@/hooks';
import { formatMs } from '@/utils/format';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export function FullPlayer() {
  const theme = useTheme();
  const router = useRouter();
  const reducedMotion = useReducedMotion();
  const insets = useSafeAreaInsets();
  const song = useCurrentSong();
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const progressMs = usePlayerStore((s) => s.progressMs);
  const durationMs = usePlayerStore((s) => s.durationMs);
  const mode = usePlayerStore((s) => s.playbackMode);
  const shuffle = usePlayerStore((s) => s.shuffleEnabled);
  const repeatMode = usePlayerStore((s) => s.repeatMode);
  const queueLen = usePlayerStore((s) => s.queue.length);
  const store = usePlayerStore();
  const favorites = useLibraryStore((s) => s.favorites);
  const toggleFavorite = useLibraryStore((s) => s.toggleFavorite);

  const enter = useMemo(() => new Animated.Value(0), []);
  const modeFade = useMemo(() => new Animated.Value(1), []);
  const [shownMode, setShownMode] = useState(mode);

  useEffect(() => {
    if (reducedMotion) {
      enter.setValue(1);
      return;
    }
    Animated.spring(enter, { toValue: 1, useNativeDriver: true, bounciness: 5 }).start();
  }, [enter, reducedMotion]);

  useEffect(() => {
    if (mode === shownMode) return;
    Animated.timing(modeFade, { toValue: 0, duration: 150, useNativeDriver: true }).start(() => {
      setShownMode(mode);
      Animated.timing(modeFade, { toValue: 1, duration: 180, easing: Easing.out(Easing.ease), useNativeDriver: true }).start();
    });
  }, [mode, shownMode, modeFade]);

  const pan = useMemo(
    () => PanResponder.create({
      onStartShouldSetPanResponder: (_, g) => g.y0 < 90,
      onMoveShouldSetPanResponder: (_, g) => g.dy > 12 && Math.abs(g.dy) > Math.abs(g.dx),
      onPanResponderRelease: (_, g) => {
        if (g.dy > 110) {
          Haptics.selectionAsync().catch(() => undefined);
          router.back();
        }
      },
    })
  , [router]);

  if (!song) {
    return (
      <View style={[styles.empty, { backgroundColor: theme.colors.background, paddingTop: insets.top }]}>
        <Text style={[theme.font('medium'), { color: theme.colors.textSecondary, fontSize: theme.fs(theme.type.body) }]}>
          Nothing is playing yet
        </Text>
        <Pressable accessibilityRole="button" accessibilityLabel="Close player" onPress={() => router.back()} hitSlop={10}>
          <Text style={[theme.font('semibold'), { color: theme.colors.accent, fontSize: theme.fs(theme.type.body), marginTop: 12 }]}>Close</Text>
        </Pressable>
      </View>
    );
  }

  const fav = favorites.includes(song.id);
  const artScale = enter.interpolate({ inputRange: [0, 1], outputRange: [0.55, 1] });
  const artOpacity = enter.interpolate({ inputRange: [0, 0.6, 1], outputRange: [0, 0.4, 1] });
  const screenMove = enter.interpolate({ inputRange: [0, 1], outputRange: [80, 0] });

  return (
    <View style={[styles.fill, { backgroundColor: theme.colors.background }]} {...pan.panHandlers}>
      <LinearGradient colors={[`${song.tint}55`, `${song.tint}18`, theme.colors.background]} style={StyleSheet.absoluteFill} />
      <View style={{ paddingTop: insets.top + 4, flex: 1 }}>
        <View style={styles.header}>
          <Pressable
            accessible
            accessibilityRole="button"
            accessibilityLabel="Close player"
            onPress={() => router.back()}
            style={({ pressed }) => ({ padding: 8, opacity: pressed ? 0.6 : 1 })}
          >
            <MaterialCommunityIcons name="chevron-down" size={30} color={theme.colors.textPrimary} />
          </Pressable>
          <Text style={[theme.font('medium'), styles.context, { color: theme.colors.textSecondary, fontSize: theme.fs(theme.type.tiny) }]}>
            PLAYING FROM {song.albumTitle.toUpperCase()}
          </Text>
          <View style={{ width: 46 }} />
        </View>

        <Animated.View style={[styles.body, { opacity: artOpacity, transform: [{ translateY: screenMove }] }]}>
          <Animated.View style={{ transform: [{ scale: artScale }], opacity: artOpacity, alignItems: 'center' }}>
            {shownMode === 'AUDIO' ? (
              <Artwork source={song.artwork} size={300} accessibilityLabel={`${song.albumTitle} artwork`} />
            ) : (
              <VideoSurface tint={song.tint} isPlaying={isPlaying} onTogglePlay={store.togglePlay} title={song.title} />
            )}
          </Animated.View>

          <Animated.View style={{ opacity: modeFade, width: '100%' }}>
            <View style={styles.titleRow}>
              <View style={styles.titleMeta}>
                <Text numberOfLines={2} style={[theme.font('bold'), { color: theme.colors.textPrimary, fontSize: theme.fs(theme.type.large) }]}>
                  {song.title}
                </Text>
                <Pressable
                  accessible
                  accessibilityRole="button"
                  accessibilityLabel={`Open artist ${song.artistName}`}
                  onPress={() => {
                    router.back();
                    setTimeout(() => router.push(`/artist/${song.artistId}` as never), 120);
                  }}
                >
                  <Text style={[theme.font('medium'), { color: theme.colors.textSecondary, fontSize: theme.fs(theme.type.body), marginTop: 2 }]}>
                    {song.artistName}
                  </Text>
                </Pressable>
              </View>
              <Pressable
                accessible
                accessibilityRole="button"
                accessibilityLabel={fav ? 'Remove from favorites' : 'Add to favorites'}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => undefined);
                  toggleFavorite(song.id);
                }}
                style={({ pressed }) => ({ padding: 8, opacity: pressed ? 0.6 : 1 })}
              >
                <MaterialCommunityIcons name={fav ? 'heart' : 'heart-outline'} size={28} color={fav ? theme.colors.accent : theme.colors.textPrimary} />
              </Pressable>
            </View>

            <View style={styles.progressWrap}>
              <ProgressBar progressMs={progressMs} durationMs={durationMs} onSeek={store.seek} />
              <View style={styles.timesRow}>
                <Text style={[theme.font('regular'), { color: theme.colors.textMuted, fontSize: theme.fs(theme.type.tiny) }]}>{formatMs(progressMs)}</Text>
                <Text style={[theme.font('regular'), { color: theme.colors.textMuted, fontSize: theme.fs(theme.type.tiny) }]}>-{formatMs(Math.max(durationMs - progressMs, 0))}</Text>
              </View>
            </View>

            <PlayerControls
              isPlaying={isPlaying}
              shuffle={shuffle}
              repeatMode={repeatMode}
              onTogglePlay={store.togglePlay}
              onNext={() => store.next()}
              onPrevious={store.previous}
              onToggleShuffle={store.toggleShuffle}
              onCycleRepeat={store.cycleRepeat}
            />

            <View style={{ marginTop: 18 }}>
              <PlaybackModeSelector mode={mode} onChange={store.setPlaybackMode} />
            </View>

            <View style={styles.linksRow}>
              <Pressable
                accessible
                accessibilityRole="button"
                accessibilityLabel="Open lyrics"
                onPress={() => router.push('/lyrics')}
                style={({ pressed }) => [styles.link, { backgroundColor: theme.colors.surface, borderRadius: theme.radius.md, opacity: pressed ? 0.7 : 1 }]}
              >
                <MaterialCommunityIcons name="text" size={20} color={theme.colors.textPrimary} />
                <Text style={[theme.font('semibold'), { color: theme.colors.textPrimary, fontSize: theme.fs(theme.type.small) }]}>Lyrics</Text>
              </Pressable>
              <Pressable
                accessible
                accessibilityRole="button"
                accessibilityLabel={`Open queue, ${queueLen} items`}
                onPress={() => router.push('/queue')}
                style={({ pressed }) => [styles.link, { backgroundColor: theme.colors.surface, borderRadius: theme.radius.md, opacity: pressed ? 0.7 : 1 }]}
              >
                <MaterialCommunityIcons name="playlist-music" size={20} color={theme.colors.textPrimary} />
                <Text style={[theme.font('semibold'), { color: theme.colors.textPrimary, fontSize: theme.fs(theme.type.small) }]}>Queue</Text>
              </Pressable>
            </View>
          </Animated.View>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12 },
  context: { flex: 1, textAlign: 'center', letterSpacing: 1.2 },
  body: { flex: 1, alignItems: 'center', paddingHorizontal: 24, paddingTop: 18 },
  titleRow: { flexDirection: 'row', alignItems: 'center', width: '100%', marginTop: 26, gap: 10 },
  titleMeta: { flex: 1 },
  progressWrap: { width: '100%', marginTop: 14 },
  timesRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 2 },
  linksRow: { flexDirection: 'row', gap: 12, width: '100%', marginTop: 22 },
  link: { flex: 1, height: 46, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
});
