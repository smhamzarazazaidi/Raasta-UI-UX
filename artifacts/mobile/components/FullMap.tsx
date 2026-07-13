import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';

export function FullMap({ userCoords }: { userCoords: any }) {
  const colors = useColors();
  return (
    <View style={[StyleSheet.absoluteFill, styles.fallback, { backgroundColor: colors.muted }]}>
      <Ionicons name="map-outline" size={48} color={colors.mutedForeground} />
      <Text style={[styles.text, { color: colors.foreground }]}>
        Live map available on iOS/Android
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  fallback: { alignItems: 'center', justifyContent: 'center', gap: 12 },
  text: { fontSize: 16, fontFamily: 'Inter_500Medium' },
});
