import React, { createContext, useContext, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { buildTheme, resolveMode, type AppTheme } from '@/theme';
import { useSettingsStore } from '@/stores/settingsStore';

const ThemeContext = createContext<AppTheme>(buildTheme('dark', 'default', 'default'));

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const themeMode = useSettingsStore((s) => s.themeMode);
  const accentId = useSettingsStore((s) => s.accentId);
  const displaySize = useSettingsStore((s) => s.displaySize);
  const systemDark = useColorScheme() !== 'light';
  const theme = useMemo(
    () => buildTheme(resolveMode(themeMode, systemDark), accentId, displaySize),
    [themeMode, accentId, displaySize, systemDark]
  );
  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
}

export function useTheme(): AppTheme {
  return useContext(ThemeContext);
}
