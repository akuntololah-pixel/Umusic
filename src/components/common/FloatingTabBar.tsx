import React, { useEffect, useMemo } from 'react';
import { Animated, Easing, Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { usePathname, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/theme/ThemeProvider';

const TABS = [
  { name: 'home', route: '/home', label: 'Home', icon: 'home-variant' as const, activeIcon: 'home-variant' as const },
  { name: 'search', route: '/search', label: 'Search', icon: 'magnify' as const, activeIcon: 'magnify' as const },
  { name: 'library', route: '/library', label: 'Library', icon: 'library' as const, activeIcon: 'library' as const },
  { name: 'settings', route: '/settings', label: 'Settings', icon: 'cog-outline' as const, activeIcon: 'cog' as const },
];

export function FloatingTabBar() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const pathname = usePathname();
  const indicator = useMemo(() => new Animated.Value(0), []);

  const activeIndex = Math.max(
    TABS.findIndex((t) => pathname.startsWith(t.route)),
    0
  );

  useEffect(() => {
    Animated.timing(indicator, { toValue: activeIndex, duration: 260, easing: Easing.out(Easing.ease), useNativeDriver: true }).start();
  }, [activeIndex, indicator]);

  const slide = indicator.interpolate({ inputRange: [0, 1, 2, 3], outputRange: [0, 1, 2, 3] });
  const pillLeft = slide.interpolate({ inputRange: [0, 3], outputRange: ['2%', '76%'] });

  return (
    <View pointerEvents="box-none" style={[styles.outer, { bottom: insets.bottom + 10 }]}>
      <View style={[styles.bar, { borderRadius: theme.radius.pill, overflow: 'hidden', borderColor: theme.colors.glassBorder }]}>
        <BlurView intensity={theme.glass.blurIntensity} tint={theme.mode === 'dark' ? 'dark' : 'light'} experimentalBlurMethod="dimezisBlurView" style={StyleSheet.absoluteFill} />
        <View style={[StyleSheet.absoluteFill, { backgroundColor: theme.colors.glassTint }]} />
        <Animated.View
          style={[
            styles.activePill,
            {
              backgroundColor: theme.colors.accent,
              opacity: 0.22,
              borderRadius: theme.radius.pill,
              left: pillLeft,
            },
          ]}
        />
        {TABS.map((tab, i) => {
          const active = i === activeIndex;
          return (
            <Pressable
              key={tab.name}
              accessible
              accessibilityRole="tab"
              accessibilityState={{ selected: active }}
              accessibilityLabel={tab.label}
              onPress={() => {
                if (!active) Haptics.selectionAsync().catch(() => undefined);
                router.navigate(tab.route as never);
              }}
              style={({ pressed }) => [styles.tab, { opacity: pressed ? 0.6 : 1 }]}
            >
              <MaterialCommunityIcons
                name={active ? tab.activeIcon : tab.icon}
                size={23}
                color={active ? theme.colors.accent : theme.colors.textSecondary}
              />
              <Text
                style={[
                  theme.font(active ? 'bold' : 'medium'),
                  styles.label,
                  { color: active ? theme.colors.accent : theme.colors.textSecondary, fontSize: theme.fs(10.5) },
                ]}
              >
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: { position: 'absolute', left: 14, right: 14 },
  bar: {
    flexDirection: 'row',
    height: 64,
    borderWidth: 1,
    elevation: 8,
  },
  activePill: { position: 'absolute', top: 6, bottom: 6, width: '23%' },
  tab: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 3, zIndex: 1 },
  label: { letterSpacing: 0.2 },
});
