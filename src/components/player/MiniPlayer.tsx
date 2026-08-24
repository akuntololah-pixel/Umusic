import React, { useCallback, useEffect, useRef, useState, useMemo } from 'react';
import {
  Animated,
  Easing,
  PanResponder,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/theme/ThemeProvider';
import { Artwork } from '@/components/common/Artwork';
import { usePlayerStore } from '@/stores/playerStore';
import { useCurrentSong } from '@/hooks';
import { formatMs } from '@/utils/format';
import type { PanResponderGestureState } from 'react-native';

export function MiniPlayer() {
  const theme = useTheme();
  const router = useRouter();
  const song = useCurrentSong();
  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const progressMs = usePlayerStore((s) => s.progressMs);
  const durationMs = usePlayerStore((s) => s.durationMs);
  const mode = usePlayerStore((s) => s.playbackMode);
  const togglePlay = usePlayerStore((s) => s.togglePlay);
  const next = usePlayerStore((s) => s.next);
  const previous = usePlayerStore((s) => s.previous);

  const contentX = useMemo(() => new Animated.Value(0), []);
  const tintProgress = useMemo(() => new Animated.Value(1), []);
  const [tints, setTints] = useState<{ from: string; to: string }>({ from: '#1C1C25', to: '#1C1C25' });

  useEffect(() => {
    if (!song) return;
    setTints((prev) => {
      if (prev.to === song.tint) return prev;
      tintProgress.setValue(0);
      Animated.timing(tintProgress, { toValue: 1, duration: 600, easing: Easing.inOut(Easing.ease), useNativeDriver: false }).start();
      return { from: prev.to, to: song.tint };
    });
  }, [song, tintProgress]);

  const tint = tintProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [tints.from, tints.to],
  });

  const slideOut = useCallback(
    (dir: number, action: () => void) => {
      Haptics.selectionAsync().catch(() => undefined);
      Animated.timing(contentX, { toValue: dir * -70, duration: 160, easing: Easing.in(Easing.ease), useNativeDriver: true }).start(() => {
        action();
        contentX.setValue(dir * 70);
        Animated.spring(contentX, { toValue: 0, useNativeDriver: true, bounciness: 5 }).start();
      });
    },
    [contentX]
  );

  const touchStart = useRef(0);

  const handleGrant = useCallback(() => {
    touchStart.current = Date.now();
  }, []);

  const handleMove = useCallback(
    (_: unknown, g: PanResponderGestureState) => {
      if (Math.abs(g.dx) > Math.abs(g.dy) && Math.abs(g.dx) > 8) {
        contentX.setValue(g.dx * 0.6);
      }
    },
    [contentX]
  );

  const handleRelease = useCallback(
    (_: unknown, g: PanResponderGestureState) => {
      const horizontal = Math.abs(g.dx) > Math.abs(g.dy);
      if (horizontal && Math.abs(g.dx) > 45) {
        slideOut(Math.sign(g.dx), g.dx > 0 ? () => next() : () => previous());
        return;
      }
      Animated.spring(contentX, { toValue: 0, useNativeDriver: true, bounciness: 5 }).start();
      if (!horizontal && g.dy < -45) {
        router.push('/player');
        return;
      }
      if (Math.abs(g.dx) < 6 && Math.abs(g.dy) < 6 && Date.now() - touchStart.current < 400) {
        router.push('/player');
      }
    },
    [contentX, next, previous, router, slideOut]
  );

  const pan = useMemo(
    () =>
      // Gesture handlers only mutate refs inside callbacks — never during render.
      // eslint-disable-next-line react-hooks/refs
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderGrant: handleGrant,
        onPanResponderMove: handleMove,
        onPanResponderRelease: handleRelease,
      }),
    [handleGrant, handleMove, handleRelease]
  );

  if (!song) return null;
  const progress = durationMs > 0 ? Math.min(progressMs / durationMs, 1) : 0;

  return (
    <View style={styles.outer} pointerEvents="box-none">
      <Pressable
        accessible
        accessibilityRole="button"
        accessibilityLabel={`Mini player: ${song.title} by ${song.artistName}. Tap to open full player.`}
        {...pan.panHandlers}
        style={[styles.bar, { borderRadius: theme.radius.lg, overflow: 'hidden', borderColor: theme.colors.glassBorder }]}
      >
        <BlurView
          intensity={theme.glass.blurIntensity}
          tint={theme.mode === 'dark' ? 'dark' : 'light'}
          experimentalBlurMethod="dimezisBlurView"
          style={StyleSheet.absoluteFill}
        />
        <Animated.View style={[StyleSheet.absoluteFill, { backgroundColor: tint, opacity: 0.28 }]} />
        <View style={[StyleSheet.absoluteFill, { backgroundColor: theme.colors.glassTint }]} />
        <View
          style={[
            styles.progressLine,
            { backgroundColor: theme.colors.accent, borderRadius: theme.radius.pill, width: `${Math.round(progress * 100)}%` },
          ]}
        />
        <Animated.View style={[styles.content, { transform: [{ translateX: contentX }] }]}>
          <Artwork source={song.artwork} size={44} accessibilityLabel={`${song.albumTitle} artwork`} />
          <View style={styles.meta}>
            <Marquee text={song.title} style={[theme.font('semibold'), { color: theme.colors.textPrimary, fontSize: theme.fs(theme.type.small) }]} />
            <View style={styles.subRow}>
              <Text numberOfLines={1} style={[theme.font('regular'), { color: theme.colors.textSecondary, fontSize: theme.fs(theme.type.tiny), flexShrink: 1 }]}>
                {song.artistName}
              </Text>
              <Text style={[theme.font('medium'), { color: theme.colors.textMuted, fontSize: 10, marginLeft: 6 }]}>
                {mode === 'AUDIO' ? '🎵 Audio' : '🎬 Video'}
              </Text>
              <Text style={[theme.font('regular'), { color: theme.colors.textMuted, fontSize: theme.fs(theme.type.tiny), marginLeft: 6 }]}>
                {formatMs(progressMs)} / {formatMs(durationMs)}
              </Text>
            </View>
          </View>
          <Pressable
            accessible
            accessibilityRole="button"
            accessibilityLabel={isPlaying ? 'Pause' : 'Play'}
            onPress={togglePlay}
            hitSlop={8}
            style={({ pressed }) => ({ padding: 8, opacity: pressed ? 0.6 : 1 })}
          >
            <MaterialCommunityIcons name={isPlaying ? 'pause' : 'play'} size={26} color={theme.colors.textPrimary} style={!isPlaying ? styles.playOffset : undefined} />
          </Pressable>
        </Animated.View>
      </Pressable>
    </View>
  );
}

function Marquee({ text, style }: { text: string; style: object }) {
  const [containerW, setContainerW] = useState(0);
  const [textW, setTextW] = useState(0);
  const x = useMemo(() => new Animated.Value(0), []);
  const overflow = textW > containerW && containerW > 0;

  useEffect(() => {
    if (!overflow) {
      x.setValue(0);
      return;
    }
    const distance = textW - containerW + 24;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(x, { toValue: -distance, duration: 2600 + distance * 6, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.delay(900),
        Animated.timing(x, { toValue: 0, duration: 2600 + distance * 6, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.delay(900),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [overflow, textW, containerW, x]);

  return (
    <View onLayout={(e) => setContainerW(e.nativeEvent.layout.width)} style={styles.marqueeClip}>
      <Animated.Text numberOfLines={1} onTextLayout={undefined} style={[style, overflow && { transform: [{ translateX: x }] }]} ellipsizeMode="head">
        {text}
      </Animated.Text>
      <View style={styles.measure} onLayout={(e) => setTextW(e.nativeEvent.layout.width)}>
        <Text style={[style, styles.hidden]}>{text}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: { paddingHorizontal: 12 },
  bar: { height: 60, justifyContent: 'center', borderWidth: 1 },
  progressLine: { position: 'absolute', top: 0, left: 0, height: 2 },
  content: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 10 },
  meta: { flex: 1, gap: 2 },
  subRow: { flexDirection: 'row', alignItems: 'center' },
  playOffset: { marginLeft: 3 },
  marqueeClip: { overflow: 'hidden' },
  measure: { position: 'absolute', opacity: 0, left: 0, top: 0 },
  hidden: { color: 'transparent' },
});
