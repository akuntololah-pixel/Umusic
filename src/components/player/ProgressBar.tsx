import React, { useCallback, useEffect, useRef, useState, useMemo } from 'react';
import { Animated, PanResponder, StyleSheet, View } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import type { GestureResponderEvent, PanResponderGestureState } from 'react-native';

interface Props {
  progressMs: number;
  durationMs: number;
  onSeek: (ms: number) => void;
  disabled?: boolean;
}

const clamp = (v: number) => Math.max(0, Math.min(1, Number.isFinite(v) ? v : 0));

export function ProgressBar({ progressMs, durationMs, onSeek, disabled }: Props) {
  const theme = useTheme();
  const [width, setWidth] = useState(0);
  const fill = useMemo(() => new Animated.Value(0), []);
  const fillPercent = fill.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] });
  const knobLeft = fill.interpolate({ inputRange: [0, 1], outputRange: [0, Math.max(width - 12, 0)] });
  const dragging = useRef(false);
  const dragValue = useRef(0);

  useEffect(() => {
    if (!dragging.current) {
      fill.setValue(durationMs > 0 ? clamp(progressMs / durationMs) : 0);
    }
  }, [progressMs, durationMs, fill]);

  const handleGrant = useCallback(
    (evt: GestureResponderEvent) => {
      if (disabled || width === 0) return;
      dragging.current = true;
      dragValue.current = clamp(evt.nativeEvent.locationX / width);
      fill.setValue(dragValue.current);
    },
    [disabled, width, fill]
  );

  const handleMove = useCallback(
    (evt: GestureResponderEvent) => {
      if (disabled || width === 0) return;
      dragValue.current = clamp(evt.nativeEvent.locationX / width);
      fill.setValue(dragValue.current);
    },
    [disabled, width, fill]
  );

  const handleRelease = useCallback(
    (_: unknown, _g: PanResponderGestureState) => {
      if (disabled) return;
      dragging.current = false;
      onSeek(Math.round(dragValue.current * durationMs));
    },
    [disabled, durationMs, onSeek]
  );

  const pan = useMemo(
    () =>
      // Gesture handlers only mutate refs inside callbacks — never during render.
      // eslint-disable-next-line react-hooks/refs
      PanResponder.create({
        onStartShouldSetPanResponder: () => !disabled,
        onMoveShouldSetPanResponder: () => !disabled,
        onPanResponderGrant: handleGrant,
        onPanResponderMove: handleMove,
        onPanResponderRelease: handleRelease,
      }),
    [disabled, handleGrant, handleMove, handleRelease]
  );

  return (
    <View
      accessible
      accessibilityRole="adjustable"
      accessibilityLabel="Seek bar"
      accessibilityValue={{ text: `${Math.round((progressMs / Math.max(durationMs, 1)) * 100)} percent` }}
      onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
      style={styles.wrap}
      {...pan.panHandlers}
    >
      <View style={[styles.track, { backgroundColor: theme.colors.surfacePressed }]}>
        <Animated.View style={[styles.fill, { backgroundColor: theme.colors.accent, width: fillPercent }]} />
      </View>
      <Animated.View style={[styles.knob, { backgroundColor: theme.colors.textPrimary, left: knobLeft }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { height: 28, justifyContent: 'center' },
  track: { height: 4, borderRadius: 999, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 999 },
  knob: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    top: 8,
    elevation: 3,
  },
});
