import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';

export function FullMap({ userCoords }: { userCoords: any }) {
  const colors = useColors();
  return (
    <View style={[styles.container, { backgroundColor: '#0d1f0d' }]}>
      {/* Decorative grid lines to simulate a map */}
      <View style={styles.gridOverlay} pointerEvents="none">
        {[...Array(8)].map((_, i) => (
          <View key={`h${i}`} style={[styles.gridLineH, { top: `${i * 14}%`, backgroundColor: 'rgba(255,255,255,0.04)' }]} />
        ))}
        {[...Array(6)].map((_, i) => (
          <View key={`v${i}`} style={[styles.gridLineV, { left: `${i * 18}%`, backgroundColor: 'rgba(255,255,255,0.04)' }]} />
        ))}
      </View>

      {/* Center pin */}
      <View style={styles.center}>
        <View style={[styles.pulse, { backgroundColor: colors.primary + '33' }]} />
        <View style={[styles.dot, { backgroundColor: colors.primary }]}>
          <Ionicons name="location" size={20} color="#fff" />
        </View>
        <Text style={[styles.label, { color: colors.primary }]}>Lahore, Pakistan</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },
  gridOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  gridLineH: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
  },
  gridLineV: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 1,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulse: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  dot: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  label: {
    marginTop: 12,
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});
