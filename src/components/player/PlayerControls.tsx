import React, { useMemo } from 'react';
import { Animated, Pressable, StyleSheet, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/theme/ThemeProvider';

interface Props {
  isPlaying: boolean;
  shuffle: boolean;
  repeatMode: 'off' | 'all' | 'one';
  onTogglePlay: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onToggleShuffle: () => void;
  onCycleRepeat: () => void;
  size?: 'normal' | 'large';
}

export function PlayerControls({
  isPlaying,
  shuffle,
  repeatMode,
  onTogglePlay,
  onNext,
  onPrevious,
  onToggleShuffle,
  onCycleRepeat,
  size = 'large',
}: Props) {
  const theme = useTheme();
  const scale = useMemo(() => new Animated.Value(1), []);
  const big = size === 'large';
  const playSize = big ? 72 : 44;
  const sideSize = big ? 26 : 20;

  const onPlay = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => undefined);
    Animated.sequence([
      Animated.spring(scale, { toValue: 0.9, useNativeDriver: true, speed: 50 }),
      Animated.spring(scale, { toValue: 1, useNativeDriver: true, bounciness: 8 }),
    ]).start();
    onTogglePlay();
  };

  const repeatIcon: keyof typeof MaterialCommunityIcons.glyphMap =
    repeatMode === 'one' ? 'repeat-once' : repeatMode === 'all' ? 'repeat' : 'repeat-off';

  return (
    <View style={[styles.row, big && styles.rowLarge]}>
      <Pressable
        accessible
        accessibilityRole="button"
        accessibilityLabel={shuffle ? 'Disable shuffle' : 'Enable shuffle'}
        accessibilityState={{ selected: shuffle }}
        onPress={onToggleShuffle}
        style={({ pressed }) => [styles.side, { opacity: pressed ? 0.6 : shuffle ? 1 : 0.45 }]}
      >
        <MaterialCommunityIcons name="shuffle" size={sideSize} color={shuffle ? theme.colors.accent : theme.colors.textPrimary} />
      </Pressable>

      <Pressable
        accessible
        accessibilityRole="button"
        accessibilityLabel="Previous track"
        onPress={onPrevious}
        style={({ pressed }) => [styles.side, { opacity: pressed ? 0.6 : 1 }]}
      >
        <MaterialCommunityIcons name="skip-previous" size={big ? 34 : 26} color={theme.colors.textPrimary} />
      </Pressable>

      <Pressable
        accessible
        accessibilityRole="button"
        accessibilityLabel={isPlaying ? 'Pause' : 'Play'}
        onPress={onPlay}
      >
        <Animated.View
          style={[
            styles.play,
            {
              width: playSize,
              height: playSize,
              borderRadius: theme.radius.pill,
              backgroundColor: theme.colors.accent,
              transform: [{ scale }],
            },
          ]}
        >
          <MaterialCommunityIcons
            name={isPlaying ? 'pause' : 'play'}
            size={big ? 34 : 22}
            color={theme.colors.onAccent}
            style={!isPlaying ? styles.playIconOffset : undefined}
          />
        </Animated.View>
      </Pressable>

      <Pressable
        accessible
        accessibilityRole="button"
        accessibilityLabel="Next track"
        onPress={onNext}
        style={({ pressed }) => [styles.side, { opacity: pressed ? 0.6 : 1 }]}
      >
        <MaterialCommunityIcons name="skip-next" size={big ? 34 : 26} color={theme.colors.textPrimary} />
      </Pressable>

      <Pressable
        accessible
        accessibilityRole="button"
        accessibilityLabel={`Repeat mode ${repeatMode}`}
        accessibilityState={{ selected: repeatMode !== 'off' }}
        onPress={onCycleRepeat}
        style={({ pressed }) => [styles.side, { opacity: pressed ? 0.6 : repeatMode !== 'off' ? 1 : 0.45 }]}
      >
        <MaterialCommunityIcons name={repeatIcon} size={sideSize} color={repeatMode !== 'off' ? theme.colors.accent : theme.colors.textPrimary} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 18 },
  rowLarge: { gap: 26 },
  side: { padding: 6 },
  play: { alignItems: 'center', justifyContent: 'center', elevation: 6 },
  playIconOffset: { marginLeft: 3 },
});
