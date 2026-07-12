import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import type { LatLng } from '@/lib/routes';
import { RouteVisual } from '@/components/RouteVisual';

// Web fallback: react-native-maps has no web build (it imports native-only RN
// internals), so on web we render the existing animated stop timeline instead
// of crashing the bundle. Native platforms use RouteMap.native.tsx.
interface RouteMapProps {
  path: LatLng[];
  progress: number;
  accentColor: string;
  height?: number;
  interactive?: boolean;
  stops?: string[];
}

export function RouteMap({ progress, accentColor, height = 220, stops }: RouteMapProps) {
  const colors = useColors();
  return (
    <View style={[styles.container, { height, borderColor: colors.border, backgroundColor: colors.card }]}>
      <View style={styles.notice}>
        <Ionicons name="phone-portrait-outline" size={14} color={colors.mutedForeground} />
        <Text style={[styles.noticeText, { color: colors.mutedForeground }]}>
          Live map view available on iOS/Android
        </Text>
      </View>
      {stops ? <RouteVisual stops={stops} progress={progress} accentColor={accentColor} compact /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    gap: 10,
  },
  notice: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  noticeText: { fontSize: 11.5, fontFamily: 'Inter_500Medium' },
});
