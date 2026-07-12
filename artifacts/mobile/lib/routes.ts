/**
 * Deterministic mock route generator.
 *
 * Raasta's real product computes routes, fares and ETAs from crowdsourced
 * commuter data. This MVP has no live backend yet, so route options are
 * derived deterministically from the From/To text (same search always
 * returns the same options) rather than being random on every search.
 */

export type RouteType = 'saver' | 'express' | 'comfort';

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
}

const STOP_POOL = [
  'Liberty Chowk',
  'Kalma Chowk',
  'Ferozepur Road',
  'Model Town Link',
  'Ichhra Bazaar',
  'Mall Road',
  'Faisal Town',
  'Gulberg Boulevard',
  'Township Chowk',
  'Wahdat Road',
  'Garden Town',
  'Barkat Market',
  'Chungi Amar Sidhu',
  'Thokar Niaz Baig',
  'Shadman Chowk',
];

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
    stops: [`Near ${fromLabel}`, ...middleStopsSaver, `Near ${toLabel}`],
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
    stops: [`Near ${fromLabel}`, ...middleStopsExpress, `Near ${toLabel}`],
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
    stops: [`Near ${fromLabel}`, ...middleStopsComfort, `Near ${toLabel}`],
  };

  return [saver, express, comfort];
}

export function suggestedFarePresets(min: number, max: number): number[] {
  const mid = Math.round((min + max) / 2 / 5) * 5;
  const low = Math.round(min / 5) * 5;
  const high = Math.round(max / 5) * 5;
  return Array.from(new Set([low, mid, high])).sort((a, b) => a - b);
}
