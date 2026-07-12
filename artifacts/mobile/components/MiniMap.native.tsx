import React from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

interface MiniMapProps {
  center: { latitude: number; longitude: number };
  markerColor: string;
  showMarker: boolean;
}

export function MiniMap({ center, markerColor, showMarker }: MiniMapProps) {
  return (
    <MapView
      style={StyleSheet.absoluteFill}
      pointerEvents="none"
      initialRegion={{ ...center, latitudeDelta: 0.02, longitudeDelta: 0.02 }}
      region={{ ...center, latitudeDelta: 0.02, longitudeDelta: 0.02 }}
    >
      {showMarker ? (
        <Marker coordinate={center} anchor={{ x: 0.5, y: 0.5 }}>
          <View style={[styles.youMarker, { backgroundColor: markerColor }]} />
        </Marker>
      ) : null}
    </MapView>
  );
}

const styles = StyleSheet.create({
  youMarker: { width: 16, height: 16, borderRadius: 8, borderWidth: 3, borderColor: '#FFFFFF' },
});
