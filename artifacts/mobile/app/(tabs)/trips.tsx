import React from 'react';
import { Alert, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import colors from '@/constants/colors';
import { useApp } from '@/context/AppContext';
import { EmptyState } from '@/components/UI';

function formatDate(ts: number): string {
  const date = new Date(ts);
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

export default function TripsScreen() {
  const theme = useColors();
  const insets = useSafeAreaInsets();
  const { tripHistory } = useApp();

  const showDetail = (id: string) => {
    const trip = tripHistory.find((t) => t.id === id);
    if (!trip) return;
    Alert.alert(
      `${trip.from} → ${trip.to}`,
      `${trip.routeType} · Bus ${trip.busNumber}\n${trip.distanceKm} km · PKR ${trip.fare}\n+${trip.pointsEarned} points earned\n${formatDate(trip.completedAt)}`,
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + (Platform.OS === 'web' ? 67 : 16) }]}>
        <Text style={[styles.title, { color: theme.foreground }]}>Your trips</Text>
      </View>

      {tripHistory.length === 0 ? (
        <EmptyState
          icon="map-outline"
          title="No trips yet"
          subtitle="Your completed rides will show up here once you report your first fare."
        />
      ) : (
        <ScrollView
          contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + 32 }]}
          showsVerticalScrollIndicator={false}
        >
          {tripHistory.map((trip) => (
            <Pressable
              key={trip.id}
              onPress={() => showDetail(trip.id)}
              style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}
            >
              <View
                style={[
                  styles.typeDot,
                  { backgroundColor: colors.route[trip.routeType.toLowerCase() as keyof typeof colors.route] ?? theme.primary },
                ]}
              />
              <View style={styles.cardText}>
                <Text style={[styles.route, { color: theme.foreground }]} numberOfLines={1}>
                  {trip.from} → {trip.to}
                </Text>
                <Text style={[styles.meta, { color: theme.mutedForeground }]}>
                  {formatDate(trip.completedAt)} · {trip.routeType} · PKR {trip.fare}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={theme.mutedForeground} />
            </Pressable>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingBottom: 16 },
  title: { fontSize: 24, fontFamily: 'Inter_700Bold' },
  list: { paddingHorizontal: 20, gap: 10 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
  },
  typeDot: { width: 10, height: 10, borderRadius: 5 },
  cardText: { flex: 1, gap: 2 },
  route: { fontSize: 14.5, fontFamily: 'Inter_600SemiBold' },
  meta: { fontSize: 12, fontFamily: 'Inter_400Regular' },
});
