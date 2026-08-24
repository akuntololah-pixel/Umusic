import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '@/theme/ThemeProvider';

interface Props {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  autoFocus?: boolean;
  accessibilityLabel?: string;
}

export function SearchBar({ value, onChangeText, placeholder, autoFocus, accessibilityLabel }: Props) {
  const theme = useTheme();
  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.surface,
          borderRadius: theme.radius.pill,
          borderColor: theme.colors.divider,
          borderWidth: 1,
        },
      ]}
    >
      <MaterialCommunityIcons name="magnify" size={20} color={theme.colors.textMuted} style={styles.icon} />
      <TextInput
        accessible
        accessibilityLabel={accessibilityLabel ?? placeholder}
        style={[styles.input, theme.font('medium'), { color: theme.colors.textPrimary, fontSize: theme.fs(theme.type.body) }]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.textMuted}
        autoFocus={autoFocus}
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="search"
      />
      {value.length > 0 ? (
        <MaterialCommunityIcons
          name="close-circle"
          size={18}
          color={theme.colors.textMuted}
          onPress={() => onChangeText('')}
          style={styles.clear}
          accessibilityLabel="Clear search"
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 46,
    paddingHorizontal: 14,
  },
  icon: { marginRight: 8 },
  input: { flex: 1, paddingVertical: 0 },
  clear: { padding: 4 },
});
