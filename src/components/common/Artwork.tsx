import React from 'react';
import { Image, ImageStyle, StyleProp, StyleSheet, View } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';

interface Props {
  source: number;
  size: number;
  shape?: 'circle' | 'rounded' | 'square';
  style?: StyleProp<ImageStyle>;
  accessibilityLabel?: string;
}

export function Artwork({ source, size, shape = 'rounded', style, accessibilityLabel }: Props) {
  const theme = useTheme();
  const radius = shape === 'circle' ? size / 2 : shape === 'square' ? 0 : Math.round(size * 0.14);
  return (
    <View
      style={[
        styles.wrap,
        {
          width: size,
          height: size,
          borderRadius: radius,
          backgroundColor: theme.colors.skeleton,
        },
        style,
      ]}
    >
      <Image
        accessible={accessibilityLabel ? true : false}
        accessibilityLabel={accessibilityLabel}
        source={source}
        style={[styles.image, { borderRadius: radius }]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { overflow: 'hidden' },
  image: { width: '100%', height: '100%' },
});
