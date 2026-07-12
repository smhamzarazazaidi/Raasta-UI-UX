import React, { useMemo } from 'react';
import { Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import { useApp } from '@/context/AppContext';
import { SectionLabel } from '@/components/UI';

const TIER_SIZE = 100;

interface Badge {
  key: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  isUnlocked: (trips: number, fareReports: number, points: number) => boolean;
}

const BADGES: Badge[] = [
  { key: 'first-ride', label: 'First ride', icon: 'flag-outline', isUnlocked: (t) => t >= 1 },
  { key: 'five-rides', label: '5 rides', icon: 'trail-sign-outline', isUnlocked: (t) => t >= 5 },
  { key: 'ten-rides', label: '10 rides', icon: 'ribbon-outline', isUnlocked: (t) => t >= 10 },
  { key: 'fare-reporter', label: 'Fare reporter', icon: 'pricetag-outline', isUnlocked: (_t, f) => f >= 3 },
  { key: 'community-hero', label: 'Community hero', icon: 'people-outline', isUnlocked: (_t, _f, p) => p >= 200 },
  { key: 'century', label: '100 points', icon: 'star-outline', isUnlocked: (_t, _f, p) => p >= 100 },
];

export default function RewardsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { points, tripHistory } = useApp();

  const fareReportCount = useMemo(() => tripHistory.filter((t) => t.fare > 0).length, [tripHistory]);
  const tier = Math.floor(points / TIER_SIZE);
  const progressInTier = points - tier * TIER_SIZE;
  const pointsToNext = TIER_SIZE - progressInTier;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + (Platform.OS === 'web' ? 67 : 16), paddingBottom: insets.bottom + 32 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.title, { color: colors.foreground }]}>Rewards</Text>

        <View style={[styles.pointsCard, { backgroundColor: colors.primary }]}>
          <Text style={[styles.pointsLabel, { color: colors.primaryForeground }]}>Total points</Text>
          <Text style={[styles.pointsValue, { color: colors.primaryForeground }]}>{points}</Text>
          <View style={[styles.progressTrack, { backgroundColor: 'rgba(255,255,255,0.3)' }]}>
            <View
              style={[
                styles.progressFill,
                { backgroundColor: colors.primaryForeground, width: `${(progressInTier / TIER_SIZE) * 100}%` },
              ]}
            />
          </View>
          <Text style={[styles.progressCaption, { color: colors.primaryForeground }]}>
            {pointsToNext} points to tier {tier + 2}
          </Text>
        </View>

        <SectionLabel>Badges</SectionLabel>
        <View style={styles.badgeGrid}>
          {BADGES.map((badge) => {
            const unlocked = badge.isUnlocked(tripHistory.length, fareReportCount, points);
            return (
              <View
                key={badge.key}
                style={[
                  styles.badgeCard,
                  {
                    backgroundColor: unlocked ? colors.card : colors.muted,
                    borderColor: colors.border,
                    opacity: unlocked ? 1 : 0.55,
                  },
                ]}
              >
                <View
                  style={[
                    styles.badgeIconWrap,
                    { backgroundColor: unlocked ? `${colors.accent}33` : colors.background },
                  ]}
                >
                  <Ionicons
                    name={badge.icon}
                    size={20}
                    color={unlocked ? colors.accentForeground : colors.mutedForeground}
                  />
                </View>
                <Text style={[styles.badgeLabel, { color: colors.foreground }]}>{badge.label}</Text>
                {!unlocked ? (
                  <Ionicons name="lock-closed" size={12} color={colors.mutedForeground} />
                ) : null}
              </View>
            );
          })}
        </View>

        <SectionLabel>How points work</SectionLabel>
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <RewardRule text="+10 points for every completed trip" />
          <RewardRule text="+5 points for reporting your fare" />
          <RewardRule text="+3 points for flagging trip conditions" />
        </View>
      </ScrollView>
    </View>
  );
}

function RewardRule({ text }: { text: string }) {
  const colors = useColors();
  return (
    <View style={styles.ruleRow}>
      <Ionicons name="checkmark-circle" size={16} color={colors.primary} />
      <Text style={[styles.ruleText, { color: colors.mutedForeground }]}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 20, gap: 18 },
  title: { fontSize: 24, fontFamily: 'Inter_700Bold' },
  pointsCard: { borderRadius: 22, padding: 20, gap: 8 },
  pointsLabel: { fontSize: 13, fontFamily: 'Inter_500Medium', opacity: 0.9 },
  pointsValue: { fontSize: 36, fontFamily: 'Inter_700Bold' },
  progressTrack: { height: 6, borderRadius: 3, overflow: 'hidden', marginTop: 6 },
  progressFill: { height: 6, borderRadius: 3 },
  progressCaption: { fontSize: 12, fontFamily: 'Inter_500Medium', opacity: 0.9 },
  badgeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  badgeCard: {
    width: '31%',
    borderRadius: 16,
    borderWidth: 1,
    paddingVertical: 14,
    alignItems: 'center',
    gap: 6,
  },
  badgeIconWrap: { width: 40, height: 40, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  badgeLabel: { fontSize: 11, fontFamily: 'Inter_600SemiBold', textAlign: 'center' },
  card: { borderRadius: 16, borderWidth: 1, padding: 16, gap: 10 },
  ruleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  ruleText: { fontSize: 13, fontFamily: 'Inter_400Regular', flex: 1 },
});
