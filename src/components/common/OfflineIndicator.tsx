import React, { useEffect, useState, useMemo } from 'react';
import { Animated, Easing, StyleSheet, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '@/theme/ThemeProvider';
import { useUiStore } from '@/stores/uiStore';

export function OfflineIndicator() {
  const theme = useTheme();
  const offline = useUiStore((s) => s.offlineSimulation);
  const [visible, setVisible] = useState(offline);
  const drop = useMemo(() => new Animated.Value(-60), []);

  useEffect(() => {
    if (offline) {
      setVisible(true);
      Animated.spring(drop, { toValue: 0, useNativeDriver: true, bounciness: 5 }).start();
    } else if (visible) {
      Animated.timing(drop, { toValue: -70, duration: 220, easing: Easing.in(Easing.ease), useNativeDriver: true }).start(() =>
        setVisible(false)
      );
    }
  }, [offline, visible, drop]);

  if (!visible) return null;

  return (
    <Animated.View
      pointerEvents="none"
      accessible
      accessibilityLabel="You are offline"
      style={[
        styles.banner,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.warning,
          borderRadius: theme.radius.pill,
          transform: [{ translateY: drop }],
        },
      ]}
    >
      <MaterialCommunityIcons name="wifi-off" size={14} color={theme.colors.warning} />
      <Text style={[theme.font('semibold'), { color: theme.colors.textPrimary, fontSize: theme.fs(theme.type.tiny) }]}>
        You&apos;re offline
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  banner: {
    position: 'absolute',
    top: 14,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    height: 32,
    borderWidth: 1,
    zIndex: 50,
    elevation: 6,
  },
});
