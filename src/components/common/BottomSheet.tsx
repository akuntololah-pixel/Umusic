import React, { useCallback, useEffect, useState, useMemo } from 'react';
import {
  Animated,
  BackHandler,
  Easing,
  Modal,
  PanResponder,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { PanResponderGestureState } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';

interface Props {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  accessibilityLabel?: string;
}

export function BottomSheet({ visible, onClose, children, accessibilityLabel }: Props) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const translateY = useMemo(() => new Animated.Value(400), []);
  const backdrop = useMemo(() => new Animated.Value(0), []);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (visible) {
      setMounted(true);
      Animated.parallel([
        Animated.spring(translateY, { toValue: 0, bounciness: 6, useNativeDriver: true }),
        Animated.timing(backdrop, { toValue: 1, duration: 220, easing: Easing.out(Easing.ease), useNativeDriver: true }),
      ]).start();
    } else if (mounted) {
      Animated.parallel([
        Animated.timing(translateY, { toValue: 420, duration: 200, easing: Easing.in(Easing.ease), useNativeDriver: true }),
        Animated.timing(backdrop, { toValue: 0, duration: 200, useNativeDriver: true }),
      ]).start(() => setMounted(false));
    }
  }, [visible, mounted, translateY, backdrop]);

  useEffect(() => {
    if (!visible) return;
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      onClose();
      return true;
    });
    return () => sub.remove();
  }, [visible, onClose]);

  const handleMove = useCallback(
    (_: unknown, gesture: PanResponderGestureState) => {
      if (gesture.dy > 0) translateY.setValue(gesture.dy);
    },
    [translateY]
  );

  const handleRelease = useCallback(
    (_: unknown, gesture: PanResponderGestureState) => {
      if (gesture.dy > 110 || gesture.vy > 0.9) {
        onClose();
      } else {
        Animated.spring(translateY, { toValue: 0, bounciness: 6, useNativeDriver: true }).start();
      }
    },
    [onClose, translateY]
  );

  const pan = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderMove: handleMove,
        onPanResponderRelease: handleRelease,
      }),
    [handleMove, handleRelease]
  );

  if (!mounted && !visible) return null;

  return (
    <Modal transparent visible={mounted || visible} animationType="none" onRequestClose={onClose} statusBarTranslucent>
      <View style={StyleSheet.absoluteFill}>
        <Pressable
          accessible
          accessibilityRole="button"
          accessibilityLabel="Close sheet"
          onPress={onClose}
          style={StyleSheet.absoluteFill}
        >
          <Animated.View style={[StyleSheet.absoluteFill, { backgroundColor: theme.colors.overlay, opacity: backdrop }]} />
        </Pressable>
        <Animated.View
          accessible={accessibilityLabel ? true : false}
          accessibilityLabel={accessibilityLabel}
          {...pan.panHandlers}
          style={[
            styles.sheet,
            {
              backgroundColor: theme.colors.backgroundElevated,
              borderTopLeftRadius: theme.radius.xl,
              borderTopRightRadius: theme.radius.xl,
              paddingBottom: insets.bottom + 12,
              transform: [{ translateY }],
            },
          ]}
        >
          <View style={[styles.handle, { backgroundColor: theme.colors.divider }]} />
          {children}
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 20,
    paddingTop: 10,
    maxHeight: '82%',
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 5,
    borderRadius: 3,
    marginBottom: 14,
  },
});
