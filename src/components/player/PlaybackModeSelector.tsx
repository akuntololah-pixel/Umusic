import React, { useEffect, useMemo } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import type { PlaybackMode } from '@/types';

interface Props {
  mode: PlaybackMode;
  onChange: (mode: PlaybackMode) => void;
}

export function PlaybackModeSelector({ mode, onChange }: Props) {
  const theme = useTheme();
  const slide = useMemo(() => new Animated.Value(0), []);

  useEffect(() => {
    Animated.spring(slide, { toValue: mode === 'VIDEO' ? 1 : 0, useNativeDriver: true, bounciness: 4 }).start();
  }, [mode, slide]);

  const pillTranslate = slide.interpolate({ inputRange: [0, 1], outputRange: [0, 118] });

  return (
    <View
      accessible
      accessibilityRole="tablist"
      accessibilityLabel="Playback mode"
      style={[
        styles.wrap,
        { backgroundColor: theme.colors.surfacePressed, borderRadius: theme.radius.pill, borderColor: theme.colors.divider },
      ]}
    >
      <Animated.View
        style={[
          styles.pill,
          { backgroundColor: theme.colors.accent, borderRadius: theme.radius.pill, transform: [{ translateX: pillTranslate }] },
        ]}
      />
      {(['AUDIO', 'VIDEO'] as const).map((m) => {
        const active = m === mode;
        return (
          <Pressable
            key={m}
            accessible
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            accessibilityLabel={`${m === 'AUDIO' ? 'Audio' : 'Video'} mode`}
            onPress={() => onChange(m)}
            style={styles.option}
          >
            <Text style={{ fontSize: theme.fs(13) }}>{m === 'AUDIO' ? '🎵' : '🎬'}</Text>
            <Text
              style={[
                theme.font('semibold'),
                { color: active ? theme.colors.onAccent : theme.colors.textSecondary, fontSize: theme.fs(theme.type.small) },
              ]}
            >
              {m === 'AUDIO' ? 'Audio' : 'Video'}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignSelf: 'center',
    borderWidth: 1,
    padding: 3,
  },
  pill: {
    position: 'absolute',
    top: 3,
    left: 3,
    width: 118,
    height: 34,
  },
  option: {
    width: 118,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 6,
    zIndex: 1,
  },
});
