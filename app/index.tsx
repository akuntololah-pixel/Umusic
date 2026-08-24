import React, { useEffect, useMemo } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSettingsStore } from '@/stores/settingsStore';
import { useReducedMotion } from '@/hooks/useReducedMotion';

const WORD = 'Umusic'.split('');

export default function Splash() {
  const router = useRouter();
  const reducedMotion = useReducedMotion();
  const letterAnims = useMemo(() => WORD.map(() => new Animated.Value(0)), []);
  const underline = useMemo(() => new Animated.Value(0), []);
  const fadeOut = useMemo(() => new Animated.Value(1), []);

  useEffect(() => {
    if (reducedMotion) {
      Animated.timing(fadeOut, { toValue: 0, duration: 400, delay: 600, useNativeDriver: true }).start(() => {
        const completed = useSettingsStore.getState().onboardingCompleted;
        router.replace(completed ? '/(tabs)/home' : '/onboarding');
      });
      return;
    }
    const animations = letterAnims.map((anim, i) =>
      Animated.timing(anim, {
        toValue: 1,
        duration: 420,
        delay: 90 + i * 70,
        easing: Easing.out(Easing.back(1.4)),
        useNativeDriver: true,
      })
    );
    Animated.parallel([
      ...animations,
      Animated.timing(underline, { toValue: 1, duration: 420, delay: 90 + WORD.length * 70 + 80, easing: Easing.out(Easing.ease), useNativeDriver: false }),
    ]).start(() => {
      Animated.timing(fadeOut, { toValue: 0, duration: 260, easing: Easing.in(Easing.ease), useNativeDriver: true }).start(() => {
        const completed = useSettingsStore.getState().onboardingCompleted;
        router.replace(completed ? '/(tabs)/home' : '/onboarding');
      });
    });
  }, [letterAnims, underline, fadeOut, router, reducedMotion]);

  const underlineWidth = underline.interpolate({ inputRange: [0, 1], outputRange: ['0%', '72%'] });

  return (
    <Animated.View accessible accessibilityLabel="Umusic" style={[styles.fill, { opacity: fadeOut }]}>
      <View style={styles.wordWrap}>
        <View style={styles.wordRow}>
          {WORD.map((letter, i) => {
            const anim = letterAnims[i];
            const y = anim.interpolate({ inputRange: [0, 1], outputRange: [26, 0] });
            const spacing = anim.interpolate({ inputRange: [0, 1], outputRange: [10, 1] });
            return (
              <Animated.Text
                key={`${letter}-${i}`}
                style={[
                  styles.letter,
                  {
                    opacity: anim,
                    transform: [{ translateY: y }],
                    marginRight: spacing,
                  },
                ]}
              >
                {letter}
              </Animated.Text>
            );
          })}
        </View>
        <Animated.View style={[styles.underline, { width: underlineWidth }]} />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1, backgroundColor: '#0B0B0F', alignItems: 'center', justifyContent: 'center' },
  wordWrap: { alignItems: 'center' },
  wordRow: { flexDirection: 'row' },
  letter: {
    color: '#F5F5F7',
    fontSize: 52,
    fontWeight: '700',
    letterSpacing: 1,
  },
  underline: {
    height: 4,
    borderRadius: 2,
    backgroundColor: '#7C5CFF',
    marginTop: 12,
  },
});
