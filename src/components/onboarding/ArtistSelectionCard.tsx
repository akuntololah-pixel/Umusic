import React, { useMemo, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/theme/ThemeProvider';
import { Artwork } from '@/components/common/Artwork';
import type { Artist } from '@/types';

interface Props {
  artist: Artist;
  selected: boolean;
  disabled?: boolean;
  onToggle: () => void;
}

export function ArtistSelectionCard({ artist, selected, disabled, onToggle }: Props) {
  const theme = useTheme();
  const scale = useMemo(() => new Animated.Value(1), []);
  const checkScale = useMemo(() => new Animated.Value(0), []);
  const [pressed, setPressed] = useState(false);

  React.useEffect(() => {
    Animated.spring(checkScale, { toValue: selected ? 1 : 0, useNativeDriver: true, bounciness: 7 }).start();
  }, [selected, checkScale]);

  const handlePress = () => {
    if (disabled && !selected) return;
    Haptics.selectionAsync().catch(() => undefined);
    Animated.sequence([
      Animated.spring(scale, { toValue: 0.93, useNativeDriver: true, speed: 45 }),
      Animated.spring(scale, { toValue: 1, useNativeDriver: true, bounciness: 7 }),
    ]).start();
    onToggle();
  };

  return (
    <Pressable
      accessible
      accessibilityRole="checkbox"
      accessibilityState={{ checked: selected, disabled: disabled && !selected }}
      accessibilityLabel={`${artist.name}${selected ? ', selected' : ''}`}
      onPress={handlePress}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      style={styles.wrap}
    >
      <Animated.View style={{ transform: [{ scale }], alignItems: 'center' }}>
        <View>
          <Artwork source={artist.artwork} size={104} shape="circle" accessibilityLabel={`${artist.name} artwork`} />
          <Animated.View
            style={[
              styles.check,
              {
                backgroundColor: theme.colors.accent,
                borderRadius: theme.radius.pill,
                transform: [{ scale: checkScale }],
                opacity: checkScale,
              },
            ]}
          >
            <MaterialCommunityIcons name="check" size={16} color={theme.colors.onAccent} />
          </Animated.View>
        </View>
        <Text
          numberOfLines={1}
          style={[
            theme.font(selected ? 'bold' : 'medium'),
            styles.name,
            {
              color: selected ? theme.colors.accent : theme.colors.textPrimary,
              fontSize: theme.fs(theme.type.small),
              opacity: disabled && !selected ? 0.4 : pressed ? 0.7 : 1,
            },
          ]}
        >
          {artist.name}
        </Text>
      </Animated.View>
      {selected ? <View style={[styles.border, { borderColor: theme.colors.accent, borderRadius: theme.radius.pill }]} pointerEvents="none" /> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: { width: 104, alignItems: 'center', alignSelf: 'flex-start' },
  check: {
    position: 'absolute',
    right: 2,
    bottom: 22,
    width: 26,
    height: 26,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  name: { marginTop: 8, textAlign: 'center' },
  border: {
    position: 'absolute',
    left: -3,
    right: -3,
    top: -3,
    height: 110,
    borderWidth: 2,
  },
});
