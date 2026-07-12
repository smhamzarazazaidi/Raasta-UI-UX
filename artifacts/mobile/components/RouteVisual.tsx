import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import type { RouteType } from '@/lib/routes';

const ROW_HEIGHT = 46;

interface RouteVisualProps {
  stops: string[];
  progress: number; // 0..1
  accentColor: string;
  compact?: boolean;
}

export function RouteVisual({ stops, progress, accentColor, compact }: RouteVisualProps) {
  const colors = useColors();
  const anim = useRef(new Animated.Value(progress)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: progress,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, [progress, anim]);

  const trackHeight = (stops.length - 1) * ROW_HEIGHT;
  const translateY = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, trackHeight],
  });

  return (
    <View style={styles.container}>
      <View style={[styles.line, { height: trackHeight + ROW_HEIGHT * 0.4, backgroundColor: colors.border }]} />
      <Animated.View
        style={[
          styles.progressLine,
          {
            height: Animated.add(translateY, new Animated.Value(2)),
            backgroundColor: accentColor,
          },
        ]}
      />
      <Animated.View
        style={[
          styles.marker,
          { backgroundColor: accentColor, transform: [{ translateY }] },
        ]}
      >
        <Ionicons name="bus" size={14} color="#FFFFFF" />
      </Animated.View>
      {stops.map((stop, index) => {
        const isPassed = index / (stops.length - 1) <= progress + 0.001;
        return (
          <View key={`${stop}-${index}`} style={[styles.row, { height: ROW_HEIGHT }]}>
            <View
              style={[
                styles.dot,
                {
                  backgroundColor: isPassed ? accentColor : colors.background,
                  borderColor: isPassed ? accentColor : colors.border,
                },
              ]}
            />
            {!compact ? (
              <Text
                numberOfLines={1}
                style={[
                  styles.stopLabel,
                  { color: isPassed ? colors.foreground : colors.mutedForeground },
                ]}
              >
                {stop}
              </Text>
            ) : null}
          </View>
        );
      })}
    </View>
  );
}

export function routeTypeIcon(type: RouteType): keyof typeof Ionicons.glyphMap {
  if (type === 'express') return 'flash';
  if (type === 'comfort') return 'sparkles';
  return 'leaf';
}

const styles = StyleSheet.create({
  container: {
    paddingLeft: 6,
  },
  line: {
    position: 'absolute',
    left: 12,
    top: 8,
    width: 2,
  },
  progressLine: {
    position: 'absolute',
    left: 12,
    top: 8,
    width: 2,
  },
  marker: {
    position: 'absolute',
    left: 1,
    top: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingLeft: 4,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 2,
    marginLeft: 8,
  },
  stopLabel: {
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
    flexShrink: 1,
  },
});
