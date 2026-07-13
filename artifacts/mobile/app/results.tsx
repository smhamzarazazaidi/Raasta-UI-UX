import React, { useMemo } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useColors } from '@/hooks/useColors';
import { useApp } from '@/context/AppContext';
import { generateRouteOptions } from '@/lib/routes';
import { RouteOptionCard } from '@/components/RouteOptionCard';
import { SectionLabel } from '@/components/UI';
import { TruckArtBand } from '@/components/TruckArtBand';

export default function ResultsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { from, to } = useLocalSearchParams<{ from: string; to: string }>();
  const { startTrip } = useApp();

  const fromText = from ?? 'Your location';
  const toText = to ?? '';

  const options = useMemo(() => generateRouteOptions(fromText, toText), [fromText, toText]);

  const handleSelect = (routeId: string) => {
    const route = options.find((o) => o.id === routeId);
    if (!route) return;
    startTrip(fromText, toText, route);
    router.push('/live-ride');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <TruckArtBand height={8} />
      <View
        style={[
          styles.header,
          { paddingTop: insets.top + (Platform.OS === 'web' ? 24 : 12), borderBottomColor: colors.border },
        ]}
      >
        <Pressable onPress={() => router.back()} hitSlop={12} style={styles.backButton}>
          <Ionicons name="chevron-back" size={22} color={colors.foreground} />
        </Pressable>
        <View style={styles.headerText}>
          <Text style={[styles.headerTitle, { color: colors.foreground }]} numberOfLines={1}>
            {fromText} → {toText}
          </Text>
          <Text style={[styles.headerSubtitle, { color: colors.mutedForeground }]}>
            Choose how you want to ride
          </Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + 32 }]}
        showsVerticalScrollIndicator={false}
      >
        <SectionLabel>{`${options.length} routes found`}</SectionLabel>
        {options.map((option, index) => (
          <RouteOptionCard
            key={option.id}
            option={option}
            delay={index * 90}
            onPress={() => handleSelect(option.id)}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  backButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
  },
  headerSubtitle: {
    fontSize: 12.5,
    fontFamily: 'Inter_400Regular',
    marginTop: 2,
  },
  list: {
    padding: 20,
    gap: 14,
  },
});
