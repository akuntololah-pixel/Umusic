import React, { useMemo } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Animated, Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface Props {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
  icon?: keyof typeof MaterialCommunityIcons.glyphMap;
  disabled?: boolean;
  style?: ViewStyle;
}

export function PrimaryButton({ label, onPress, variant = 'primary', icon, disabled, style }: Props) {
  const theme = useTheme();
  const reducedMotion = useReducedMotion();
  const scale = useMemo(() => new Animated.Value(1), []);
  const isPrimary = variant === 'primary';
  return (
    <Pressable
      accessible
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: disabled ?? false }}
      disabled={disabled}
      onPressIn={() => {
        if (reducedMotion) return;
        Animated.spring(scale, { toValue: 0.96, useNativeDriver: true, speed: 40 }).start();
      }}
      onPressOut={() => {
        if (reducedMotion) return;
        Animated.spring(scale, { toValue: 1, useNativeDriver: true, bounciness: 6 }).start();
      }}
      onPress={onPress}
    >
      <Animated.View
        style={[
          styles.base,
          { transform: [{ scale }] },
          style,
          {
            backgroundColor: isPrimary ? theme.colors.accent : 'transparent',
            borderRadius: theme.radius.pill,
            borderWidth: isPrimary ? 0 : 1.5,
            borderColor: theme.colors.divider,
            opacity: disabled ? 0.45 : 1,
          },
        ]}
      >
        <View style={styles.row}>
          {icon ? (
            <MaterialCommunityIcons
              name={icon}
              size={18}
              color={isPrimary ? theme.colors.onAccent : theme.colors.textPrimary}
              style={{ marginRight: 6 }}
            />
          ) : null}
          <Text
            style={[
              theme.font('semibold'),
              {
                color: isPrimary ? theme.colors.onAccent : theme.colors.textPrimary,
                fontSize: theme.fs(theme.type.body),
                letterSpacing: 0.2,
              },
            ]}
          >
            {label}
          </Text>
        </View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 50,
    paddingHorizontal: 28,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  row: { flexDirection: 'row', alignItems: 'center' },
});

export function SecondaryButton(props: Omit<Props, 'variant'>) {
  return <PrimaryButton {...props} variant="secondary" />;
}
