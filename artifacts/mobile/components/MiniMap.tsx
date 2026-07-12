import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';

// Web fallback: react-native-maps has no web build. Native platforms use
// MiniMap.native.tsx instead.
interface MiniMapProps {
  center: { latitude: number; longitude: number };
  markerColor: string;
  showMarker: boolean;
}

export function MiniMap({ markerColor, showMarker }: MiniMapProps) {
  const colors = useColors();
  return (
    <View style={[StyleSheet.absoluteFill, styles.fallback, { backgroundColor: colors.muted }]}>
      {showMarker ? (
        <View style={[styles.youMarker, { backgroundColor: markerColor }]} />
      ) : (
        <Ionicons name="map-outline" size={22} color={colors.mutedForeground} />
      )}
      <Text style={[styles.text, { color: colors.mutedForeground }]}>
        Live map available on iOS/Android
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  fallback: { alignItems: 'center', justifyContent: 'center', gap: 8 },
  youMarker: { width: 16, height: 16, borderRadius: 8, borderWidth: 3, borderColor: '#FFFFFF' },
  text: { fontSize: 11.5, fontFamily: 'Inter_500Medium' },
});
