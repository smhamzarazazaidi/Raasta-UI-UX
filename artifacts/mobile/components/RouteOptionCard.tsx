import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import colors from '@/constants/colors';
import type { RouteOption } from '@/lib/routes';
import { routeTypeIcon } from '@/components/RouteVisual';

interface RouteOptionCardProps {
  option: RouteOption;
  onPress: () => void;
  delay?: number;
}

export function RouteOptionCard({ option, onPress, delay = 0 }: RouteOptionCardProps) {
  const theme = useColors();
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(16)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 320, delay, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 0, duration: 320, delay, useNativeDriver: true }),
    ]).start();
  }, [opacity, translateY, delay]);

  const accent = colors.route[option.type];

  return (
    <Animated.View style={{ opacity, transform: [{ translateY }] }}>
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.card,
          {
            backgroundColor: theme.card,
            borderColor: theme.border,
            opacity: pressed ? 0.9 : 1,
          },
        ]}
      >
        <View style={styles.topRow}>
          <View style={[styles.iconWrap, { backgroundColor: `${accent}1F` }]}>
            <Ionicons name={routeTypeIcon(option.type)} size={18} color={accent} />
          </View>
          <View style={styles.headerText}>
            <Text style={[styles.label, { color: theme.foreground }]}>{option.label}</Text>
            <Text style={[styles.busNumber, { color: theme.mutedForeground }]}>
              Bus {option.busNumber}
            </Text>
          </View>
          <View style={styles.fareWrap}>
            <Text style={[styles.fare, { color: theme.foreground }]}>
              PKR {option.fareMin}–{option.fareMax}
            </Text>
            <Text style={[styles.eta, { color: accent }]}>{option.etaMin} min</Text>
          </View>
        </View>

        <View style={[styles.metaRow, { borderTopColor: theme.border }]}>
          <View style={styles.metaItem}>
            <Ionicons name="walk-outline" size={14} color={theme.mutedForeground} />
            <Text style={[styles.metaText, { color: theme.mutedForeground }]}>
              {option.walkMeters}m walk
            </Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="swap-horizontal-outline" size={14} color={theme.mutedForeground} />
            <Text style={[styles.metaText, { color: theme.mutedForeground }]}>
              {option.transfers === 0 ? 'Direct' : `${option.transfers} transfer${option.transfers > 1 ? 's' : ''}`}
            </Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="navigate-outline" size={14} color={theme.mutedForeground} />
            <Text style={[styles.metaText, { color: theme.mutedForeground }]}>
              {option.distanceKm} km
            </Text>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    gap: 12,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    flex: 1,
    gap: 2,
  },
  label: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
  },
  busNumber: {
    fontSize: 12.5,
    fontFamily: 'Inter_400Regular',
  },
  fareWrap: {
    alignItems: 'flex-end',
    gap: 2,
  },
  fare: {
    fontSize: 14.5,
    fontFamily: 'Inter_600SemiBold',
  },
  eta: {
    fontSize: 12.5,
    fontFamily: 'Inter_600SemiBold',
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    paddingTop: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  metaText: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
  },
});
