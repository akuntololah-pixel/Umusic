import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/theme/ThemeProvider';

interface Props {
  title: string;
  moreLabel?: string;
  moreTo?: string;
}

export function SectionHeader({ title, moreLabel, moreTo }: Props) {
  const theme = useTheme();
  const router = useRouter();
  return (
    <View style={styles.row}>
      <Text
        style={[
          theme.font('bold'),
          { color: theme.colors.textPrimary, fontSize: theme.fs(theme.type.medium), letterSpacing: 0.2 },
        ]}
      >
        {title}
      </Text>
      {moreTo ? (
        <Pressable
          accessible
          accessibilityRole="button"
          accessibilityLabel={`${moreLabel ?? 'More'} for ${title}`}
          onPress={() => router.push(moreTo as never)}
          hitSlop={8}
          style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
        >
          <Text style={[theme.font('semibold'), { color: theme.colors.textMuted, fontSize: theme.fs(theme.type.small) }]}>
            {moreLabel ?? 'More'}
          </Text>
        </Pressable>
      ) : (
        <View style={{ width: 8 }} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 12,
    minHeight: 32,
  },
});
