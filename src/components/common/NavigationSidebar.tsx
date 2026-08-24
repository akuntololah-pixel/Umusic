import React, { useEffect, useMemo, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { usePathname, useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/theme/ThemeProvider';
import { useUiStore } from '@/stores/uiStore';
import { useLibraryStore } from '@/stores/libraryStore';

type GlyphName = keyof typeof MaterialCommunityIcons.glyphMap;

const ITEMS: { route: string; label: string; icon: GlyphName }[] = [
  { route: '/home', label: 'Home', icon: 'home-variant' as const },
  { route: '/search', label: 'Search', icon: 'magnify' as const },
  { route: '/library', label: 'Library', icon: 'library' as const },
  { route: '/settings', label: 'Settings', icon: 'cog-outline' as const },
];

const QUICK: { route: string; label: string; icon: GlyphName }[] = [
  { route: '/favorites', label: 'Favorites', icon: 'heart' as const },
  { route: '/history', label: 'History', icon: 'history' as const },
];

export function NavigationSidebar() {
  const theme = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const collapsed = useUiStore((s) => s.sidebarCollapsed);
  const toggleCollapsed = useUiStore((s) => s.toggleSidebarCollapsed);
  const favoritesCount = useLibraryStore((s) => s.favorites.length);

  const [mounted, setMounted] = useState(false);
  const width = useMemo(() => new Animated.Value(collapsed ? 76 : 216), [collapsed]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    Animated.spring(width, { toValue: collapsed ? 76 : 216, useNativeDriver: false, bounciness: 3 }).start();
  }, [collapsed, width]);

  if (!mounted) return null;

  const isActive = (route: string) => pathname.startsWith(route);

  const renderItem = (item: { route: string; label: string; icon: GlyphName }, badge?: number) => {
    const active = isActive(item.route);
    return (
      <Pressable
        key={item.route}
        accessible
        accessibilityRole="tab"
        accessibilityState={{ selected: active }}
        accessibilityLabel={item.label}
        onPress={() => {
          if (!active) Haptics.selectionAsync().catch(() => undefined);
          router.navigate(item.route as never);
        }}
        style={({ pressed }) => [
          styles.item,
          {
            backgroundColor: active ? theme.colors.accent + '26' : pressed ? theme.colors.surfacePressed : 'transparent',
            borderRadius: theme.radius.md,
          },
        ]}
      >
        <MaterialCommunityIcons name={item.icon} size={23} color={active ? theme.colors.accent : theme.colors.textSecondary} />
        {!collapsed ? (
          <Text
            numberOfLines={1}
            style={[theme.font(active ? 'bold' : 'medium'), { color: active ? theme.colors.accent : theme.colors.textSecondary, fontSize: theme.fs(theme.type.small) }]}
          >
            {item.label}
          </Text>
        ) : null}
        {!collapsed && badge !== undefined && badge > 0 ? (
          <View style={[styles.badge, { backgroundColor: theme.colors.accent, borderRadius: theme.radius.pill }]}>
            <Text style={[theme.font('bold'), { color: theme.colors.onAccent, fontSize: 10 }]}>{badge}</Text>
          </View>
        ) : null}
      </Pressable>
    );
  };

  return (
    <Animated.View
      accessible
      accessibilityLabel="Navigation sidebar"
      style={[
        styles.sidebar,
        {
          width,
          backgroundColor: theme.colors.backgroundElevated,
          borderRightColor: theme.colors.divider,
          borderTopRightRadius: theme.radius.xl,
          borderBottomRightRadius: theme.radius.xl,
        },
      ]}
    >
      <BlurView intensity={theme.glass.blurIntensity} tint={theme.mode === 'dark' ? 'dark' : 'light'} experimentalBlurMethod="dimezisBlurView" style={StyleSheet.absoluteFill} />
      <View style={[StyleSheet.absoluteFill, { backgroundColor: theme.colors.glassTint }]} />
      <View style={[styles.inner, { paddingHorizontal: collapsed ? 10 : 14 }]}>
        <View style={styles.brandRow}>
          {collapsed ? (
            <Text style={[theme.font('bold'), { color: theme.colors.accent, fontSize: theme.fs(theme.type.title) }]}>U</Text>
          ) : (
            <Text style={[theme.font('bold'), styles.brand, { color: theme.colors.textPrimary, fontSize: theme.fs(theme.type.title), letterSpacing: 0.5 }]}>
              Umusic
            </Text>
          )}
          <Pressable
            accessible
            accessibilityRole="button"
            accessibilityLabel={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            onPress={() => {
              Haptics.selectionAsync().catch(() => undefined);
              toggleCollapsed();
            }}
            style={({ pressed }) => ({ padding: 6, opacity: pressed ? 0.6 : 1 })}
          >
            <MaterialCommunityIcons name={collapsed ? 'chevron-double-right' : 'chevron-double-left'} size={20} color={theme.colors.textMuted} />
          </Pressable>
        </View>
        <View style={styles.navGroup}>
          {ITEMS.map((item) => renderItem(item))}
        </View>
        <View style={[styles.divider, { backgroundColor: theme.colors.divider }]} />
        <View style={styles.navGroup}>
          {QUICK.map((item) => renderItem(item, item.route === '/favorites' ? favoritesCount : undefined))}
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  sidebar: {
    justifyContent: 'flex-start',
    overflow: 'hidden',
    borderRightWidth: 1,
    zIndex: 5,
  },
  inner: { flex: 1, paddingTop: 18 },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    marginBottom: 22,
    minHeight: 36,
  },
  brand: {},
  navGroup: { gap: 4 },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    height: 46,
    paddingHorizontal: 12,
  },
  badge: { marginLeft: 'auto', paddingHorizontal: 7, paddingVertical: 2 },
  divider: { height: 1, marginVertical: 14, marginHorizontal: 8 },
});
