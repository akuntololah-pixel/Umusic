import React, { useEffect, useMemo } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/theme/ThemeProvider';
import { PrimaryButton, SecondaryButton } from '@/components/common/Buttons';
import { useRouter } from 'expo-router';
import { useSettingsStore } from '@/stores/settingsStore';

export default function WelcomeScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const skipOnboarding = useSettingsSkip();
  const wordAnim = useMemo(() => new Animated.Value(0), []);
  const subAnim = useMemo(() => new Animated.Value(0), []);
  const buttonsAnim = useMemo(() => new Animated.Value(0), []);

  useEffect(() => {
    Animated.stagger(180, [
      Animated.timing(wordAnim, { toValue: 1, duration: 700, easing: Easing.out(Easing.ease), useNativeDriver: true }),
      Animated.timing(subAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(buttonsAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
    ]).start();
  }, [wordAnim, subAnim, buttonsAnim]);

  const wordY = wordAnim.interpolate({ inputRange: [0, 1], outputRange: [26, 0] });
  const letterSpacing = wordAnim.interpolate({ inputRange: [0, 1], outputRange: [14, 2] });

  return (
    <View style={[styles.fill, { backgroundColor: theme.colors.background, paddingTop: insets.top }]}>
      <View style={styles.center}>
        <Animated.Text
          accessible
          accessibilityLabel="Umusic"
          style={[
            theme.font('bold'),
            styles.wordmark,
            { color: theme.colors.textPrimary, fontSize: theme.fs(theme.type.hero * 1.6), opacity: wordAnim, transform: [{ translateY: wordY }], letterSpacing },
          ]}
        >
          Umusic
        </Animated.Text>
        <Animated.View style={{ opacity: subAnim, transform: [{ translateY: wordY }] }}>
          <Text style={[theme.font('bold'), { color: theme.colors.textPrimary, fontSize: theme.fs(theme.type.title), marginTop: 26, textAlign: 'center' }]}>
            Make Umusic yours
          </Text>
          <Text style={[theme.font('regular'), styles.subtitle, { color: theme.colors.textSecondary, fontSize: theme.fs(theme.type.body) }]}>
            Choose artists you love and we&apos;ll shape your music feed around them.
          </Text>
        </Animated.View>
      </View>
      <Animated.View style={[styles.actions, { paddingBottom: insets.bottom + 30, opacity: buttonsAnim }]}>
        <PrimaryButton label="Choose Artists" onPress={() => router.push('/onboarding/artists')} style={{ width: 250 }} />
        <SecondaryButton label="Skip for now" onPress={skipOnboarding} style={{ width: 250, marginTop: 12 }} />
      </Animated.View>
    </View>
  );
}

function useSettingsSkip(): () => void {
  const router = useRouter();
  return () => {
    useSettingsStore.getState().skipOnboarding();
    router.replace('/(tabs)/home');
  };
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 36 },
  wordmark: { textAlign: 'center' },
  subtitle: { textAlign: 'center', marginTop: 12, lineHeight: 24 },
  actions: { gap: 0 },
});
