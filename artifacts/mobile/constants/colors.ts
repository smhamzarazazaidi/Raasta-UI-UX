/**
 * Semantic design tokens for Raasta — "Truck Art Heritage" theme.
 *
 * Base surfaces are warm cream and light brown, the way a well-worn transit
 * card or a sun-bleached bus timetable actually looks — legible, paper-like,
 * calm. The saturated truck-art palette (marigold, vermillion, emerald,
 * cobalt) is reserved for small painted accents — the TruckArtBand motif,
 * badges, route-type dots — never for large fills, so the UI stays readable
 * in daylight while still feeling unmistakably Pakistani.
 */

const colors = {
  light: {
    // Legacy aliases (kept for backward compatibility)
    text: '#3B2A1D',
    tint: '#8A4B23',

    // Core surfaces — cream / parchment
    background: '#FBF3E4',
    foreground: '#3B2A1D',

    // Cards / elevated surfaces — slightly lifted off the cream ground
    card: '#FFFBF2',
    cardForeground: '#3B2A1D',

    // Primary action color — saddle-brown, like painted bus woodwork
    primary: '#8A4B23',
    primaryForeground: '#FFF8ED',

    // Secondary / less-emphasis interactive surfaces — light tan
    secondary: '#F0E0BF',
    secondaryForeground: '#6B4423',

    // Muted / subdued elements (dividers, timestamps, placeholders)
    muted: '#F1E6D2',
    mutedForeground: '#8A7A63',

    // Accent highlights (badges, selected items, focus rings) — marigold, the
    // brightest color truck-art livery uses, kept to small touches only
    accent: '#E0932E',
    accentForeground: '#3A2400',

    // Destructive / urgent actions (end trip, SOS) — vermillion
    destructive: '#B23A2E',
    destructiveForeground: '#FFF8ED',

    // Borders and input outlines — warm tan line, like aged card stock
    border: '#E4D3AE',
    input: '#E4D3AE',
  },

  // Route-type accent colors — painted-panel colors, used only as small dots
  // and chips, echoing the brief's Saver/Express/Comfort cues
  route: {
    saver: '#3F7D5C',
    express: '#2E6FA8',
    comfort: '#E0932E',
  },

  // Truck-art motif palette — for TruckArtBand borders and painted details
  // only; never used as a fill for large surfaces.
  motif: ['#E0932E', '#3F7D5C', '#2E6FA8', '#B23A2E', '#D8B24A'],

  // Border radius (in px) — soft, warm, pill-leaning
  radius: 18,
};

export default colors;
