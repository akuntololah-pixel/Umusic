import React from 'react';
import { Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '@/theme/ThemeProvider';
import { useRouter } from 'expo-router';

interface Props {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  onPress?: () => void;
  accessibilityLabel: string;
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  useRouterBack?: boolean;
  disabled?: boolean;
}

export function IconButton({ icon, onPress, accessibilityLabel, size = 'md', color, useRouterBack, disabled }: Props) {
  const theme = useTheme();
  const router = useRouter();
  const dim = size === 'sm' ? 32 : size === 'lg' ? 48 : 40;
  const glyph = size === 'sm' ? 18 : size === 'lg' ? 26 : 22;
  return (
    <Pressable
      accessible
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      disabled={disabled}
      onPress={useRouterBack && !onPress ? () => router.back() : onPress}
      hitSlop={8}
      style={({ pressed }) => ({
        width: dim,
        height: dim,
        borderRadius: theme.radius.pill,
        alignItems: 'center',
        justifyContent: 'center',
        opacity: disabled ? 0.4 : pressed ? 0.6 : 1,
      })}
    >
      <MaterialCommunityIcons name={icon} size={glyph} color={color ?? theme.colors.textPrimary} />
    </Pressable>
  );
}
