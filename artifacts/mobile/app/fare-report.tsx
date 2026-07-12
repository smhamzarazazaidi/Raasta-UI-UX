import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { KeyboardAwareScrollViewCompat } from '@/components/KeyboardAwareScrollViewCompat';
import { router, useLocalSearchParams } from 'expo-router';
import { useColors } from '@/hooks/useColors';
import { useApp } from '@/context/AppContext';
import { Button, Chip, SectionLabel } from '@/components/UI';
import { suggestedFarePresets } from '@/lib/routes';

const ISSUE_OPTIONS = ['On time', 'Crowded', 'Late', 'Wrong route', 'Overcharged'];

export default function FareReportScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { endTrip } = useApp();
  const params = useLocalSearchParams<{
    from: string;
    to: string;
    routeType: string;
    busNumber: string;
    distanceKm: string;
    fareMin: string;
    fareMax: string;
    reportedIssues?: string;
  }>();

  const fareMin = Number(params.fareMin ?? 0);
  const fareMax = Number(params.fareMax ?? 0);
  const presets = suggestedFarePresets(fareMin, fareMax);
  const preReported = useMemo(
    () => (params.reportedIssues ? params.reportedIssues.split(',').filter(Boolean) : []),
    [params.reportedIssues],
  );

  const [fare, setFare] = useState(String(presets[Math.floor(presets.length / 2)] ?? ''));
  const [issues, setIssues] = useState<string[]>(preReported);
  const [submitted, setSubmitted] = useState<{ points: number } | null>(null);
  const successScale = useRef(new Animated.Value(0.6)).current;

  useEffect(() => {
    if (submitted) {
      Animated.spring(successScale, { toValue: 1, useNativeDriver: true, speed: 14 }).start();
      const timeout = setTimeout(() => {
        router.replace('/(tabs)');
      }, 1100);
      return () => clearTimeout(timeout);
    }
    return undefined;
  }, [submitted, successScale]);

  const toggleIssue = (issue: string) => {
    setIssues((prev) => (prev.includes(issue) ? prev.filter((i) => i !== issue) : [...prev, issue]));
  };

  const handleSubmit = () => {
    const parsedFare = Number(fare) || 0;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    const record = endTrip(parsedFare, issues);
    setSubmitted({ points: record?.pointsEarned ?? 0 });
  };

  if (submitted) {
    return (
      <View style={[styles.container, styles.center, { backgroundColor: colors.background }]}>
        <Animated.View
          style={[
            styles.successCircle,
            { backgroundColor: colors.primary, transform: [{ scale: successScale }] },
          ]}
        >
          <Ionicons name="checkmark" size={40} color={colors.primaryForeground} />
        </Animated.View>
        <Text style={[styles.successTitle, { color: colors.foreground }]}>Thanks for riding!</Text>
        <Text style={[styles.successSubtitle, { color: colors.mutedForeground }]}>
          +{submitted.points} points added
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + (Platform.OS === 'web' ? 24 : 16) }]}>
        <Pressable onPress={() => router.replace('/(tabs)')} hitSlop={12} style={styles.closeButton}>
          <Ionicons name="close" size={22} color={colors.foreground} />
        </Pressable>
      </View>

      <KeyboardAwareScrollViewCompat
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 24 }]}
        bottomOffset={40}
      >
        <Text style={[styles.title, { color: colors.foreground }]}>Report your fare</Text>
        <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
          Help keep fares accurate for the next rider on this route.
        </Text>

        <View style={[styles.summaryCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.summaryRoute, { color: colors.foreground }]} numberOfLines={1}>
            {params.from} → {params.to}
          </Text>
          <Text style={[styles.summaryMeta, { color: colors.mutedForeground }]}>
            {params.routeType} · Bus {params.busNumber} · {params.distanceKm} km
          </Text>
        </View>

        <SectionLabel>Fare paid (PKR)</SectionLabel>
        <View style={styles.presetRow}>
          {presets.map((preset) => (
            <Chip
              key={preset}
              label={`PKR ${preset}`}
              active={fare === String(preset)}
              onPress={() => setFare(String(preset))}
            />
          ))}
        </View>
        <View style={[styles.inputWrap, { backgroundColor: colors.muted, borderColor: colors.border }]}>
          <Text style={[styles.inputPrefix, { color: colors.mutedForeground }]}>PKR</Text>
          <TextInput
            value={fare}
            onChangeText={setFare}
            keyboardType="number-pad"
            placeholder="Enter amount"
            placeholderTextColor={colors.mutedForeground}
            style={[styles.input, { color: colors.foreground }]}
          />
        </View>

        <SectionLabel>How was the trip?</SectionLabel>
        <View style={styles.presetRow}>
          {ISSUE_OPTIONS.map((issue) => (
            <Chip
              key={issue}
              label={issue}
              active={issues.includes(issue)}
              onPress={() => toggleIssue(issue)}
            />
          ))}
        </View>
      </KeyboardAwareScrollViewCompat>

      <View style={[styles.footer, { paddingBottom: insets.bottom + (Platform.OS === 'web' ? 34 : 16) }]}>
        <Button label="Submit fare" onPress={handleSubmit} disabled={!fare || Number(fare) <= 0} icon="checkmark" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { alignItems: 'center', justifyContent: 'center', gap: 6 },
  header: { paddingHorizontal: 20, alignItems: 'flex-end' },
  closeButton: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  content: { paddingHorizontal: 20, gap: 12 },
  title: { fontSize: 22, fontFamily: 'Inter_700Bold', marginTop: 4 },
  subtitle: { fontSize: 13.5, fontFamily: 'Inter_400Regular', marginBottom: 6, lineHeight: 19 },
  summaryCard: { borderRadius: 16, borderWidth: 1, padding: 14, gap: 4, marginBottom: 8 },
  summaryRoute: { fontSize: 14.5, fontFamily: 'Inter_600SemiBold' },
  summaryMeta: { fontSize: 12, fontFamily: 'Inter_400Regular' },
  presetRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 14 },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 14,
    marginBottom: 4,
  },
  inputPrefix: { fontSize: 14, fontFamily: 'Inter_600SemiBold' },
  input: { flex: 1, paddingVertical: 14, fontSize: 16, fontFamily: 'Inter_600SemiBold' },
  footer: { paddingHorizontal: 20, paddingTop: 8 },
  successCircle: { width: 84, height: 84, borderRadius: 42, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  successTitle: { fontSize: 19, fontFamily: 'Inter_700Bold' },
  successSubtitle: { fontSize: 14, fontFamily: 'Inter_500Medium' },
});
