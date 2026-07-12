/**
 * Deterministic mock route generator.
 *
 * Raasta's real product computes routes, fares and ETAs from crowdsourced
 * commuter data. This MVP has no live backend yet, so route options are
 * derived deterministically from the From/To text (same search always
 * returns the same options) rather than being random on every search.
 */

export type RouteType = 'saver' | 'express' | 'comfort';

export interface LatLng {
  latitude: number;
  longitude: number;
}

export interface RouteOption {
  id: string;
  type: RouteType;
  label: string;
  busNumber: string;
  etaMin: number;
  fareMin: number;
  fareMax: number;
  transfers: number;
  walkMeters: number;
  distanceKm: number;
  stops: string[];
  path: LatLng[];
}

// Approximate real-world coordinates for named Lahore landmarks, used so the
// generated route can be drawn on an actual map rather than an abstract list.
const STOP_COORDS: Record<string, LatLng> = {
  'Liberty Chowk': { latitude: 31.5099, longitude: 74.3436 },
  'Kalma Chowk': { latitude: 31.5039, longitude: 74.3406 },
  'Ferozepur Road': { latitude: 31.4923, longitude: 74.3324 },
  'Model Town Link': { latitude: 31.4847, longitude: 74.3277 },
  'Ichhra Bazaar': { latitude: 31.5335, longitude: 74.3271 },
  'Mall Road': { latitude: 31.5599, longitude: 74.3294 },
  'Faisal Town': { latitude: 31.4820, longitude: 74.3121 },
  'Gulberg Boulevard': { latitude: 31.5147, longitude: 74.3479 },
  'Township Chowk': { latitude: 31.4667, longitude: 74.2892 },
  'Wahdat Road': { latitude: 31.5064, longitude: 74.3122 },
  'Garden Town': { latitude: 31.4991, longitude: 74.3221 },
  'Barkat Market': { latitude: 31.5089, longitude: 74.3300 },
  'Chungi Amar Sidhu': { latitude: 31.4442, longitude: 74.2664 },
  'Thokar Niaz Baig': { latitude: 31.4383, longitude: 74.2570 },
  'Shadman Chowk': { latitude: 31.5453, longitude: 74.3225 },
};

const STOP_POOL = Object.keys(STOP_COORDS);

const LAHORE_CENTER: LatLng = { latitude: 31.5204, longitude: 74.3587 };

// Deterministically place an unresolved ("Near X") endpoint a short distance
// from Lahore's center, seeded so the same text always lands in the same spot.
function jitterCoord(seed: number): LatLng {
  const angle = (seed % 360) * (Math.PI / 180);
  const radius = 0.02 + ((seed % 17) / 17) * 0.05;
  return {
    latitude: LAHORE_CENTER.latitude + Math.sin(angle) * radius,
    longitude: LAHORE_CENTER.longitude + Math.cos(angle) * radius,
  };
}

function pathFromStops(stops: string[], seed: number): LatLng[] {
  return stops.map((stop, index) => STOP_COORDS[stop] ?? jitterCoord(seed + index * 41));
}

function hashString(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function pickStops(seed: number, count: number): string[] {
  const stops: string[] = [];
  let cursor = seed;
  while (stops.length < count) {
    const candidate = STOP_POOL[cursor % STOP_POOL.length];
    if (candidate && !stops.includes(candidate)) {
      stops.push(candidate);
    }
    cursor += 7;
  }
  return stops;
}

export function generateRouteOptions(from: string, to: string): RouteOption[] {
  const seed = hashString(`${from.trim().toLowerCase()}->${to.trim().toLowerCase()}`);
  const distanceKm = 3 + (seed % 13);

  const middleStopsSaver = pickStops(seed, 4);
  const middleStopsExpress = pickStops(seed + 3, 2);
  const middleStopsComfort = pickStops(seed + 9, 1);

  const fromLabel = from.trim() || 'Your location';
  const toLabel = to.trim() || 'Destination';

  const stopsSaver = [`Near ${fromLabel}`, ...middleStopsSaver, `Near ${toLabel}`];
  const stopsExpress = [`Near ${fromLabel}`, ...middleStopsExpress, `Near ${toLabel}`];
  const stopsComfort = [`Near ${fromLabel}`, ...middleStopsComfort, `Near ${toLabel}`];

  const saver: RouteOption = {
    id: 'saver',
    type: 'saver',
    label: 'Saver',
    busNumber: `${10 + (seed % 40)}A`,
    etaMin: 28 + (seed % 20),
    fareMin: 40 + (seed % 15),
    fareMax: 60 + (seed % 15),
    transfers: 1 + (seed % 2),
    walkMeters: 250 + (seed % 200),
    distanceKm,
    stops: stopsSaver,
    path: pathFromStops(stopsSaver, seed),
  };

  const express: RouteOption = {
    id: 'express',
    type: 'express',
    label: 'Express',
    busNumber: `R-${5 + (seed % 12)}`,
    etaMin: 18 + (seed % 12),
    fareMin: 70 + (seed % 20),
    fareMax: 90 + (seed % 20),
    transfers: seed % 2,
    walkMeters: 150 + (seed % 120),
    distanceKm,
    stops: stopsExpress,
    path: pathFromStops(stopsExpress, seed + 3),
  };

  const comfort: RouteOption = {
    id: 'comfort',
    type: 'comfort',
    label: 'Comfort',
    busNumber: `Metro Coaster ${1 + (seed % 6)}`,
    etaMin: 15 + (seed % 10),
    fareMin: 120 + (seed % 30),
    fareMax: 150 + (seed % 30),
    transfers: 0,
    walkMeters: 80 + (seed % 80),
    distanceKm,
    stops: stopsComfort,
    path: pathFromStops(stopsComfort, seed + 9),
  };

  return [saver, express, comfort];
}

export function suggestedFarePresets(min: number, max: number): number[] {
  const mid = Math.round((min + max) / 2 / 5) * 5;
  const low = Math.round(min / 5) * 5;
  const high = Math.round(max / 5) * 5;
  return Array.from(new Set([low, mid, high])).sort((a, b) => a - b);
}
