import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';

interface Props {
  options: string[];
  selected: string;
  onSelect: (value: string) => void;
  accessibilityLabel?: string;
}

export function FilterChips({ options, selected, onSelect, accessibilityLabel }: Props) {
  const theme = useTheme();
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
      accessible
      accessibilityLabel={accessibilityLabel ?? 'Filter chips'}
    >
      {options.map((option) => {
        const active = option === selected;
        return (
          <Pressable
            key={option}
            accessible
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            accessibilityLabel={option}
            onPress={() => onSelect(option)}
            onPressIn={undefined}
            style={({ pressed }) => [
              styles.chip,
              {
                backgroundColor: active ? theme.colors.accent : theme.colors.surface,
                borderColor: active ? theme.colors.accent : theme.colors.divider,
                borderRadius: theme.radius.pill,
                opacity: pressed ? 0.8 : 1,
              },
            ]}
          >
            <Text
              style={[
                theme.font('semibold'),
                {
                  color: active ? theme.colors.onAccent : theme.colors.textSecondary,
                  fontSize: theme.fs(theme.type.small),
                },
              ]}
            >
              {option}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: { paddingHorizontal: 16, gap: 8, paddingVertical: 2 },
  chip: {
    paddingHorizontal: 16,
    height: 36,
    borderRadius: 999,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
