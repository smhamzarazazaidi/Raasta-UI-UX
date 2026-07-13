import React from 'react';
import { View, StyleSheet } from 'react-native';

interface MiniMapProps {
  center: { latitude: number; longitude: number };
  markerColor: string;
  showMarker: boolean;
}

export function MiniMap({ center, markerColor, showMarker }: MiniMapProps) {
  return (
    <View style={[styles.container, { backgroundColor: '#1a2e1a' }]}>
      {showMarker && (
        <View style={[styles.marker, { backgroundColor: markerColor }]} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  marker: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
});
