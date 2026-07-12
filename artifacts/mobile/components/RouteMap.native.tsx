import React, { useEffect, useMemo, useRef } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import type { LatLng } from '@/lib/routes';

interface RouteMapProps {
  path: LatLng[];
  progress: number; // 0..1, position of the bus marker along the path
  accentColor: string;
  height?: number;
  interactive?: boolean;
  stops?: string[];
}

function pointAlongPath(path: LatLng[], progress: number): LatLng {
  if (path.length === 0) return { latitude: 31.5204, longitude: 74.3587 };
  if (path.length === 1 || progress <= 0) return path[0];
  if (progress >= 1) return path[path.length - 1];

  const scaled = progress * (path.length - 1);
  const index = Math.min(path.length - 2, Math.floor(scaled));
  const localT = scaled - index;
  const a = path[index];
  const b = path[index + 1];
  return {
    latitude: a.latitude + (b.latitude - a.latitude) * localT,
    longitude: a.longitude + (b.longitude - a.longitude) * localT,
  };
}

function boundingRegion(path: LatLng[]) {
  const lats = path.map((p) => p.latitude);
  const lngs = path.map((p) => p.longitude);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);
  const latPad = Math.max((maxLat - minLat) * 0.5, 0.01);
  const lngPad = Math.max((maxLng - minLng) * 0.5, 0.01);
  return {
    latitude: (minLat + maxLat) / 2,
    longitude: (minLng + maxLng) / 2,
    latitudeDelta: maxLat - minLat + latPad * 2,
    longitudeDelta: maxLng - minLng + lngPad * 2,
  };
}

export function RouteMap({ path, progress, accentColor, height = 220, interactive = true }: RouteMapProps) {
  const colors = useColors();
  const mapRef = useRef<MapView | null>(null);
  const region = useMemo(() => boundingRegion(path), [path]);
  const busPosition = useMemo(() => pointAlongPath(path, progress), [path, progress]);

  useEffect(() => {
    if (mapRef.current && path.length > 1) {
      mapRef.current.fitToCoordinates(path, {
        edgePadding: { top: 40, right: 40, bottom: 40, left: 40 },
        animated: true,
      });
    }
  }, [path]);

  return (
    <View style={[styles.container, { height, borderColor: colors.border }]}>
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFill}
        provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
        initialRegion={region}
        scrollEnabled={interactive}
        zoomEnabled={interactive}
        rotateEnabled={false}
        pitchEnabled={false}
        showsCompass={false}
        showsUserLocation={false}
        toolbarEnabled={false}
      >
        <Polyline coordinates={path} strokeColor={accentColor} strokeWidth={4} />
        {path.length > 0 ? (
          <Marker coordinate={path[0]} anchor={{ x: 0.5, y: 0.5 }}>
            <View style={[styles.endpointDot, { backgroundColor: colors.foreground }]} />
          </Marker>
        ) : null}
        {path.length > 1 ? (
          <Marker coordinate={path[path.length - 1]} anchor={{ x: 0.5, y: 1 }}>
            <Ionicons name="location" size={26} color={colors.destructive} />
          </Marker>
        ) : null}
        <Marker coordinate={busPosition} anchor={{ x: 0.5, y: 0.5 }} tracksViewChanges={false}>
          <View style={[styles.busMarker, { backgroundColor: accentColor }]}>
            <Ionicons name="bus" size={14} color="#FFFFFF" />
          </View>
        </Marker>
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: 20,
    borderWidth: 1,
    overflow: 'hidden',
  },
  busMarker: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  endpointDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
});
