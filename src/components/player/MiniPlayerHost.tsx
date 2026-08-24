import React, { useEffect, useState, useMemo } from 'react';
import { Animated, Easing, StyleSheet } from 'react-native';
import { usePathname } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MiniPlayer } from './MiniPlayer';
import { useSettingsStore } from '@/stores/settingsStore';
import { usePlayerStore } from '@/stores/playerStore';

const HIDDEN_PREFIXES = ['/player', '/lyrics', '/queue', '/onboarding'];

export function MiniPlayerHost() {
  const insets = useSafeAreaInsets();
  const pathname = usePathname();
  const navStyle = useSettingsStore((s) => s.navStyle);
  const hasSong = usePlayerStore((s) => s.currentSongId !== null);
  const slide = useMemo(() => new Animated.Value(0), []);
  const [mounted, setMounted] = useState(false);

  const hidden = HIDDEN_PREFIXES.some((p) => pathname.startsWith(p));

  useEffect(() => {
    if (hasSong && !hidden) {
      setMounted(true);
      Animated.spring(slide, { toValue: 1, useNativeDriver: true, bounciness: 6 }).start();
    } else if (mounted) {
      Animated.timing(slide, { toValue: 0, duration: 180, easing: Easing.in(Easing.ease), useNativeDriver: true }).start(() =>
        setMounted(false)
      );
    }
  }, [hasSong, hidden, mounted, slide]);

  if (!mounted && !hasSong) return null;

  const bottom = navStyle === 'bottom' ? insets.bottom + 86 : insets.bottom + 16;

  return (
    <Animated.View
      pointerEvents="box-none"
      style={[
        styles.host,
        {
          bottom,
          opacity: slide,
          transform: [{ translateY: slide.interpolate({ inputRange: [0, 1], outputRange: [90, 0] }) }],
        },
      ]}
    >
      <MiniPlayer />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  host: { position: 'absolute', left: 0, right: 0, zIndex: 20 },
});
