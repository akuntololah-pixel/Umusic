import React, { useEffect, useMemo, useState } from 'react';
import { Animated, Easing, Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/theme/ThemeProvider';

interface Props {
  tint: string;
  isPlaying: boolean;
  onTogglePlay: () => void;
  title: string;
}

export function VideoSurface({ tint, isPlaying, onTogglePlay, title }: Props) {
  const theme = useTheme();
  const shimmer = useMemo(() => new Animated.Value(0), []);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 900);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!loading) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer, { toValue: 1, duration: 1100, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(shimmer, { toValue: 0, duration: 1100, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [loading, shimmer]);

  const shimmerX = shimmer.interpolate({ inputRange: [0, 1], outputRange: [-160, 160] });

  return (
    <View
      accessible
      accessibilityLabel={`Video placeholder for ${title}`}
      style={[styles.surface, { borderRadius: theme.radius.lg }]}
    >
      <LinearGradient colors={[tint, theme.colors.background]} style={StyleSheet.absoluteFill} />
      {loading ? (
        <View style={StyleSheet.absoluteFill}>
          <Animated.View
            style={[
              styles.shimmer,
              { transform: [{ translateX: shimmerX }], backgroundColor: 'rgba(255,255,255,0.08)' },
            ]}
          />
          <Text style={[theme.font('medium'), styles.loadingText, { color: theme.colors.textSecondary, fontSize: theme.fs(theme.type.small) }]}>
            Loading stream…
          </Text>
        </View>
      ) : (
        <Pressable
          accessible
          accessibilityRole="button"
          accessibilityLabel={isPlaying ? 'Pause video' : 'Play video'}
          onPress={onTogglePlay}
          style={({ pressed }) => [styles.center, { opacity: pressed ? 0.85 : 1 }]}
        >
          <View style={[styles.playCircle, { backgroundColor: 'rgba(0,0,0,0.45)', borderRadius: theme.radius.pill }]}>
            <MaterialCommunityIcons name={isPlaying ? 'pause' : 'play'} size={40} color="#FFFFFF" style={!isPlaying ? styles.playOffset : undefined} />
          </View>
          {!isPlaying ? (
            <Text style={[theme.font('semibold'), { color: '#FFFFFF', fontSize: theme.fs(theme.type.small), marginTop: 10 }]}>
              Tap to play
            </Text>
          ) : null}
        </Pressable>
      )}
      <Pressable
        accessible
        accessibilityRole="button"
        accessibilityLabel="Fullscreen"
        onPress={() => undefined}
        style={[styles.fullscreen, { backgroundColor: 'rgba(0,0,0,0.45)', borderRadius: theme.radius.sm }]}
      >
        <MaterialCommunityIcons name="fullscreen" size={20} color="#FFFFFF" />
      </Pressable>
      <View style={[styles.badge, { backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: theme.radius.pill }]}>
        <Text style={[theme.font('semibold'), { color: '#FFFFFF', fontSize: 10, letterSpacing: 1 }]}>MOCK VIDEO</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  surface: {
    width: '92%',
    aspectRatio: 16 / 9,
    alignSelf: 'center',
    overflow: 'hidden',
  },
  center: { ...StyleSheet.absoluteFill, alignItems: 'center', justifyContent: 'center' },
  playCircle: { width: 76, height: 76, alignItems: 'center', justifyContent: 'center' },
  playOffset: { marginLeft: 4 },
  fullscreen: { position: 'absolute', right: 12, bottom: 12, padding: 8 },
  badge: { position: 'absolute', left: 12, top: 12, paddingHorizontal: 8, paddingVertical: 3 },
  shimmer: { width: 120, height: '100%', transform: [{ rotate: '8deg' }] },
  loadingText: { position: 'absolute', bottom: 16, alignSelf: 'center' },
});
