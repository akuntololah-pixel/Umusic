import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/theme/ThemeProvider';
import { IconButton } from './IconButton';

interface Props {
  title: string;
  showBack?: boolean;
  right?: React.ReactNode;
  sticky?: boolean;
}

export function AppHeader({ title, showBack, right, sticky }: Props) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  return (
    <View
      style={[
        styles.row,
        {
          paddingTop: sticky ? insets.top + 6 : 6,
          paddingHorizontal: theme.spacing.lg,
          paddingBottom: theme.spacing.md,
        },
      ]}
    >
      {showBack ? (
        <IconButton icon="chevron-left" onPress={() => undefined} accessibilityLabel="Go back" useRouterBack />
      ) : (
        <View style={styles.side} />
      )}
      <Text
        numberOfLines={1}
        style={[
          styles.title,
          theme.font('bold'),
          { color: theme.colors.textPrimary, fontSize: theme.fs(theme.type.title) },
        ]}
      >
        {title}
      </Text>
      <View style={styles.side}>{right}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  title: { flex: 1, textAlign: 'center', letterSpacing: 0.3 },
  side: { minWidth: 40, flexDirection: 'row', justifyContent: 'flex-end' },
});
