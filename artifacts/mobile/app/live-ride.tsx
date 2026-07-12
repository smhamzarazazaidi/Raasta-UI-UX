import React, { useEffect, useRef, useState } from 'react';
import { Alert, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { useColors } from '@/hooks/useColors';
import colors from '@/constants/colors';
import { useApp } from '@/context/AppContext';
import { RouteVisual, routeTypeIcon } from '@/components/RouteVisual';
import { RouteMap } from '@/components/RouteMap';
import { Button } from '@/components/UI';

type Phase = 'boarding' | 'riding' | 'arrived';

// Demo compression: real ETA minutes are compressed into a short simulated
// ride so the crowdsourced-tracking concept is visible without waiting.
function demoDurationMs(etaMin: number): number {
  return Math.min(Math.max(etaMin * 700, 9000), 26000);
}

export default function LiveRideScreen() {
  const theme = useColors();
  const insets = useSafeAreaInsets();
  const { activeTrip, cancelTrip } = useApp();
  const [phase, setPhase] = useState<Phase>('boarding');
  const [progress, setProgress] = useState(0);
  const [reportedIssues, setReportedIssues] = useState<string[]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  if (!activeTrip) {
    return (
      <View style={[styles.container, styles.center, { backgroundColor: theme.background }]}>
        <Text style={{ color: theme.mutedForeground, fontFamily: 'Inter_500Medium' }}>
          No active trip.
        </Text>
        <View style={{ marginTop: 16, width: 160 }}>
          <Button label="Go home" onPress={() => router.replace('/(tabs)')} variant="outline" />
        </View>
      </View>
    );
  }

  const { route, from, to } = activeTrip;
  const accent = colors.route[route.type];
  const stopCount = route.stops.length;
  const currentStopIndex = Math.min(stopCount - 1, Math.round(progress * (stopCount - 1)));
  const nextStop = route.stops[Math.min(stopCount - 1, currentStopIndex + (phase === 'riding' ? 1 : 0))];
  const remainingMin = Math.max(1, Math.round(route.etaMin * (1 - progress)));

  const beginRide = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    setPhase('riding');
    const duration = demoDurationMs(route.etaMin);
    const startedAt = Date.now();
    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startedAt;
      const next = Math.min(1, elapsed / duration);
      setProgress(next);
      if (next >= 1) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
        setPhase('arrived');
      }
    }, 200);
  };

  const confirmEnd = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    router.push({
      pathname: '/fare-report',
      params: {
        from,
        to,
        routeType: route.label,
        busNumber: route.busNumber,
        distanceKm: String(route.distanceKm),
        fareMin: String(route.fareMin),
        fareMax: String(route.fareMax),
        reportedIssues: reportedIssues.join(','),
      },
    });
  };

  const handleEndPress = () => {
    Alert.alert('End this trip?', 'Confirm once you have exited the bus.', [
      { text: 'Not yet', style: 'cancel' },
      { text: "I've exited", style: 'default', onPress: confirmEnd },
    ]);
  };

  const handleReportProblem = () => {
    const logIssue = (issue: string) => {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      setReportedIssues((prev) => (prev.includes(issue) ? prev : [...prev, issue]));
      Alert.alert('Thanks for reporting', 'This helps keep the route accurate for other riders.');
    };
    Alert.alert('Report a problem', 'What happened on this trip?', [
      { text: 'Bus is late', onPress: () => logIssue('Late') },
      { text: 'Overcrowded', onPress: () => logIssue('Crowded') },
      { text: 'Wrong route', onPress: () => logIssue('Wrong route') },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const handleCancel = () => {
    Alert.alert('Cancel trip?', 'This trip will not be saved to your history.', [
      { text: 'Keep riding', style: 'cancel' },
      {
        text: 'Cancel trip',
        style: 'destructive',
        onPress: () => {
          if (intervalRef.current) clearInterval(intervalRef.current);
          cancelTrip();
          router.replace('/(tabs)');
        },
      },
    ]);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View
        style={[
          styles.header,
          { paddingTop: insets.top + (Platform.OS === 'web' ? 67 : 12), borderBottomColor: theme.border },
        ]}
      >
        <View style={[styles.headerIcon, { backgroundColor: `${accent}1F` }]}>
          <Ionicons name={routeTypeIcon(route.type)} size={18} color={accent} />
        </View>
        <View style={styles.headerText}>
          <Text style={[styles.headerTitle, { color: theme.foreground }]} numberOfLines={1}>
            {from} → {to}
          </Text>
          <Text style={[styles.headerSubtitle, { color: theme.mutedForeground }]}>
            {route.label} · Bus {route.busNumber}
          </Text>
        </View>
        <Text
          onPress={handleCancel}
          style={[styles.cancelLink, { color: theme.mutedForeground }]}
        >
          Cancel
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {phase === 'boarding' ? (
          <View style={[styles.boardingCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Ionicons name="walk" size={30} color={accent} />
            <Text style={[styles.boardingTitle, { color: theme.foreground }]}>
              Walk {route.walkMeters}m to your stop
            </Text>
            <Text style={[styles.boardingSubtitle, { color: theme.mutedForeground }]}>
              Board Bus {route.busNumber} near {route.stops[0]}
            </Text>
          </View>
        ) : (
          <View style={[styles.statusCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[styles.statusLabel, { color: theme.mutedForeground }]}>
              {phase === 'arrived' ? "You've arrived" : 'Next stop'}
            </Text>
            <Text style={[styles.statusValue, { color: theme.foreground }]} numberOfLines={1}>
              {phase === 'arrived' ? route.stops[stopCount - 1] : nextStop}
            </Text>
            {phase === 'riding' ? (
              <Text style={[styles.statusMeta, { color: accent }]}>~{remainingMin} min remaining</Text>
            ) : null}
          </View>
        )}

        <RouteMap path={route.path} progress={progress} accentColor={accent} stops={route.stops} />

        <View style={[styles.visualCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <RouteVisual stops={route.stops} progress={progress} accentColor={accent} />
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + (Platform.OS === 'web' ? 34 : 16) }]}>
        {phase === 'boarding' ? (
          <Button label="I've boarded" onPress={beginRide} icon="checkmark-circle" />
        ) : (
          <>
            <View style={styles.footerRow}>
              <View style={{ flex: 1 }}>
                <Button label="Report a problem" variant="outline" icon="alert-circle-outline" onPress={handleReportProblem} />
              </View>
              <View style={styles.sosButtonWrap}>
                <Button
                  label=""
                  variant="destructive"
                  icon="shield-outline"
                  fullWidth={false}
                  onPress={() => router.push('/safety')}
                />
              </View>
            </View>
            <View style={{ marginTop: 10 }}>
              <Button
                label={phase === 'arrived' ? 'Confirm & report fare' : 'End trip'}
                onPress={handleEndPress}
                variant={phase === 'arrived' ? 'primary' : 'secondary'}
                icon="flag-outline"
              />
            </View>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { alignItems: 'center', justifyContent: 'center' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  headerIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: { flex: 1 },
  headerTitle: { fontSize: 15, fontFamily: 'Inter_600SemiBold' },
  headerSubtitle: { fontSize: 12, fontFamily: 'Inter_400Regular', marginTop: 2 },
  cancelLink: { fontSize: 13, fontFamily: 'Inter_500Medium' },
  content: { padding: 20, gap: 16, paddingBottom: 32 },
  boardingCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 24,
    alignItems: 'center',
    gap: 8,
  },
  boardingTitle: { fontSize: 17, fontFamily: 'Inter_700Bold', textAlign: 'center', marginTop: 4 },
  boardingSubtitle: { fontSize: 13.5, fontFamily: 'Inter_400Regular', textAlign: 'center' },
  statusCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 20,
    gap: 4,
  },
  statusLabel: { fontSize: 12, fontFamily: 'Inter_600SemiBold', textTransform: 'uppercase', letterSpacing: 0.5 },
  statusValue: { fontSize: 20, fontFamily: 'Inter_700Bold' },
  statusMeta: { fontSize: 13, fontFamily: 'Inter_600SemiBold', marginTop: 2 },
  visualCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 20,
    paddingBottom: 24,
  },
  footer: { paddingHorizontal: 20, paddingTop: 8 },
  footerRow: { flexDirection: 'row', gap: 10, alignItems: 'stretch' },
  sosButtonWrap: { width: 56 },
});
