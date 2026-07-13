import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import colors from '@/constants/colors';

// A decorative strip inspired by Pakistani truck-art livery: repeating
// painted flowers in the bright, hand-painted palette riders recognize from
// real buses and trucks. Used sparingly as a border accent on hero surfaces
// against the app's cream/brown ground — legible content stays plain, only
// edges/headers carry the motif.
const MOTIF_COLORS = colors.motif;

function Flower({ x, color }: { x: number; color: string }) {
  return (
    <React.Fragment>
      <Circle cx={x} cy={9} r={2.4} fill={color} opacity={0.9} />
      <Circle cx={x - 4} cy={9} r={1.5} fill={color} opacity={0.55} />
      <Circle cx={x + 4} cy={9} r={1.5} fill={color} opacity={0.55} />
      <Circle cx={x} cy={5} r={1.5} fill={color} opacity={0.55} />
      <Circle cx={x} cy={13} r={1.5} fill={color} opacity={0.55} />
    </React.Fragment>
  );
}

export function TruckArtBand({ height = 18 }: { height?: number }) {
  const segments = 14;
  const spacing = 26;
  const width = segments * spacing;

  return (
    <View style={[styles.wrap, { height }]}>
      <Svg width="100%" height={height} viewBox={`0 0 ${width} 18`} preserveAspectRatio="xMidYMid slice">
        <Path d={`M0 17 L${width} 17`} stroke="#20140A" strokeOpacity={0.08} strokeWidth={1} />
        {Array.from({ length: segments }).map((_, i) => (
          <Flower key={i} x={i * spacing + spacing / 2} color={MOTIF_COLORS[i % MOTIF_COLORS.length]} />
        ))}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { width: '100%', overflow: 'hidden' },
});
