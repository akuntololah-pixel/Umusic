import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Stack, usePathname } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider, useTheme } from '@/theme/ThemeProvider';
import { NavigationSidebar } from '@/components/common/NavigationSidebar';
import { MiniPlayerHost } from '@/components/player/MiniPlayerHost';
import { SheetsHost } from '@/components/music/SheetsHost';
import { OfflineIndicator } from '@/components/common/OfflineIndicator';
import { useSettingsStore } from '@/stores/settingsStore';

function RootShell() {
  const theme = useTheme();
  const navStyle = useSettingsStore((s) => s.navStyle);
  const pathname = usePathname();

  const hideChrome =
    pathname.startsWith('/onboarding') ||
    pathname.startsWith('/player') ||
    pathname.startsWith('/lyrics') ||
    pathname.startsWith('/queue') ||
    pathname === '/';

  return (
    <View style={[styles.row, { backgroundColor: theme.colors.background }]}>
      {navStyle === 'sidebar' && !hideChrome ? <NavigationSidebar /> : null}
      <View style={styles.content}>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: theme.colors.background },
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="onboarding/index" options={{ animation: 'fade' }} />
          <Stack.Screen name="onboarding/artists" options={{ animation: 'slide_from_right' }} />
          <Stack.Screen name="onboarding/confirm" options={{ animation: 'slide_from_right' }} />
          <Stack.Screen name="(tabs)" options={{ animation: 'fade' }} />
          <Stack.Screen name="artist/[id]" options={{ animation: 'slide_from_right' }} />
          <Stack.Screen name="album/[id]" options={{ animation: 'slide_from_right' }} />
          <Stack.Screen name="playlist/[id]" options={{ animation: 'slide_from_right' }} />
          <Stack.Screen name="player" options={{ presentation: 'fullScreenModal', animation: 'slide_from_bottom' }} />
          <Stack.Screen name="lyrics" options={{ presentation: 'fullScreenModal', animation: 'slide_from_bottom' }} />
          <Stack.Screen name="queue" options={{ presentation: 'fullScreenModal', animation: 'slide_from_bottom' }} />
          <Stack.Screen name="favorites" options={{ animation: 'slide_from_right' }} />
          <Stack.Screen name="history" options={{ animation: 'slide_from_right' }} />
          <Stack.Screen name="playlist-editor" options={{ animation: 'slide_from_right' }} />
          <Stack.Screen name="settings/favorite-artists" options={{ animation: 'slide_from_right' }} />
        </Stack>
        {!hideChrome ? <MiniPlayerHost /> : null}
        {!hideChrome ? <SheetsHost /> : null}
        {!hideChrome ? <OfflineIndicator /> : null}
      </View>
    </View>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <StatusBar style="auto" />
      <RootShell />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  row: { flex: 1 },
  content: { flex: 1 },
});
