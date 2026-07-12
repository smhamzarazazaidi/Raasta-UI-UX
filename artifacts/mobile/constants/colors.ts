/**
 * Semantic design tokens for Raasta.
 *
 * Palette draws from Pakistani transit culture — warm sand backgrounds,
 * a deep "road" emerald as the primary brand color, and marigold / vermillion
 * accents inspired by truck-art livery — kept restrained so the UI stays
 * legible in daylight rather than decorative.
 */

const colors = {
  light: {
    // Legacy aliases (kept for backward compatibility)
    text: '#201D18',
    tint: '#0E8F72',

    // Core surfaces
    background: '#FBF7F1',
    foreground: '#201D18',

    // Cards / elevated surfaces
    card: '#FFFFFF',
    cardForeground: '#201D18',

    // Primary action color — "the road" emerald
    primary: '#0E8F72',
    primaryForeground: '#FFFFFF',

    // Secondary / less-emphasis interactive surfaces — soft marigold tint
    secondary: '#FCEBD2',
    secondaryForeground: '#7A4A00',

    // Muted / subdued elements (dividers, timestamps, placeholders)
    muted: '#F0EAE0',
    mutedForeground: '#7A7266',

    // Accent highlights (badges, selected items, focus rings) — marigold
    accent: '#F2A22C',
    accentForeground: '#3A2400',

    // Destructive / urgent actions (end trip, SOS) — vermillion
    destructive: '#DE4B3F',
    destructiveForeground: '#FFFFFF',

    // Borders and input outlines
    border: '#E8E0D2',
    input: '#E8E0D2',
  },

  // Route-type accent colors, echoing the brief's Saver/Express/Comfort cues
  route: {
    saver: '#0E8F72',
    express: '#2E6FE0',
    comfort: '#F2A22C',
  },

  // Border radius (in px) — soft, warm, pill-leaning
  radius: 18,
};

export default colors;
