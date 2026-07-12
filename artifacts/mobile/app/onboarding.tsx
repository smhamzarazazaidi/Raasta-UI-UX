import React, { useRef, useState } from 'react';
import {
  Dimensions,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { router } from 'expo-router';
import { useColors } from '@/hooks/useColors';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/UI';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const SLIDES: { icon: keyof typeof Ionicons.glyphMap; title: string; body: string }[] = [
  {
    icon: 'people-circle-outline',
    title: 'We track people, not buses',
    body: 'No GPS trackers on buses. Every rider who opens Raasta on their trip quietly improves the map for everyone else.',
  },
  {
    icon: 'navigate-circle-outline',
    title: 'Real routes, real fares',
    body: 'Routes, fares, and arrival times come from thousands of everyday trips — not a fixed schedule that goes stale.',
  },
  {
    icon: 'trophy-outline',
    title: 'Ride, report, get rewarded',
    body: 'Confirm your fare after every ride to earn points and badges, and help keep Raasta accurate for your city.',
  },
];

export default function OnboardingScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { completeOnboarding, toggleSetting, settings } = useApp();
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<ScrollView>(null);

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
    setActiveIndex(index);
  };

  const finish = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted' && !settings.shareLocation) {
        toggleSetting('shareLocation');
      }
    } catch {
      // Permission flow unavailable (e.g. web) — continue without it.
    }
    completeOnboarding();
    router.replace('/(tabs)');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Image source={require('@/assets/images/onboarding.png')} style={styles.hero} resizeMode="cover" />

      <View style={styles.body}>
        <Text style={[styles.wordmark, { color: colors.primary }]}>Raasta</Text>

        <ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={handleScroll}
          style={styles.slider}
        >
          {SLIDES.map((slide, index) => (
            <View key={index} style={[styles.slide, { width: SCREEN_WIDTH - 48 }]}>
              <View style={[styles.slideIconWrap, { backgroundColor: colors.secondary }]}>
                <Ionicons name={slide.icon} size={26} color={colors.accentForeground} />
              </View>
              <Text style={[styles.slideTitle, { color: colors.foreground }]}>{slide.title}</Text>
              <Text style={[styles.slideBody, { color: colors.mutedForeground }]}>{slide.body}</Text>
            </View>
          ))}
        </ScrollView>

        <View style={styles.dots}>
          {SLIDES.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                {
                  backgroundColor: index === activeIndex ? colors.primary : colors.border,
                  width: index === activeIndex ? 18 : 6,
                },
              ]}
            />
          ))}
        </View>
      </View>

      <View style={[styles.footer, { paddingBottom: insets.bottom + (Platform.OS === 'web' ? 34 : 16) }]}>
        <Button label="Get started" onPress={finish} icon="arrow-forward" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  hero: {
    width: '100%',
    height: '42%',
  },
  body: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  wordmark: {
    fontSize: 26,
    fontFamily: 'Inter_700Bold',
    marginBottom: 8,
  },
  slider: {
    flexGrow: 0,
  },
  slide: {
    paddingTop: 14,
  },
  slideIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  slideTitle: {
    fontSize: 21,
    fontFamily: 'Inter_700Bold',
    marginBottom: 8,
  },
  slideBody: {
    fontSize: 14.5,
    lineHeight: 21,
    fontFamily: 'Inter_400Regular',
  },
  dots: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 16,
  },
  dot: {
    height: 6,
    borderRadius: 3,
  },
  footer: {
    paddingHorizontal: 24,
    paddingTop: 8,
  },
});
