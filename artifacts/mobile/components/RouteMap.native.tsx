import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import type { LatLng } from '@/lib/routes';

interface RouteMapProps {
  path: LatLng[];
  progress: number;
  accentColor: string;
  height?: number;
  interactive?: boolean;
  stops?: string[];
}

export function RouteMap({ path, progress, accentColor, height = 220 }: RouteMapProps) {
  const colors = useColors();
  const busStop = path.length > 0 ? path[Math.floor(progress * (path.length - 1))] : null;

  return (
    <View style={[styles.container, { height, borderColor: colors.border, backgroundColor: '#EFDFBB' }]}>
      {/* Route line visualization */}
      <View style={[styles.routeLine, { backgroundColor: accentColor + '40', borderColor: accentColor }]} />

      {/* Progress indicator */}
      <View style={[styles.progressFill, { backgroundColor: accentColor, width: `${Math.round(progress * 100)}%` }]} />

      {/* Bus icon */}
      <View style={styles.center}>
        <View style={[styles.busChip, { backgroundColor: accentColor }]}>
          <Ionicons name="bus" size={16} color="#fff" />
          <Text style={styles.busLabel}>{Math.round(progress * 100)}% complete</Text>
        </View>
        <Text style={[styles.routeInfo, { color: colors.foreground }]}>
          {path.length} stops · Live tracking
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: 20,
    borderWidth: 1,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  routeLine: {
    position: 'absolute',
    top: '50%',
    left: 16,
    right: 16,
    height: 4,
    borderRadius: 2,
    borderWidth: 1,
  },
  progressFill: {
    position: 'absolute',
    top: '50%',
    left: 16,
    height: 4,
    borderRadius: 2,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  busChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  busLabel: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  routeInfo: {
    fontSize: 12,
  },
});
