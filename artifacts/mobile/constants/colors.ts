/**
 * Semantic design tokens for Raasta — "Cultural Pakistani" theme.
 *
 * Palette is pulled straight from truck-art livery: vermillion red as the
 * hero color, marigold-orange and emerald as its supporting accents, on a
 * warm off-white ground so painted colors pop the way they do on a real
 * Lahore bus. Decorative motifs (see TruckArtBand) stay confined to
 * header/hero edges per the brief — body text and cards stay plain and
 * legible in daylight.
 */

const colors = {
  light: {
    // Legacy aliases (kept for backward compatibility)
    text: '#20140A',
    tint: '#E93F48',

    // Core surfaces
    background: '#FCF8F1',
    foreground: '#20140A',

    // Cards / elevated surfaces
    card: '#FFFFFF',
    cardForeground: '#20140A',

    // Primary action color — truck-art vermillion red
    primary: '#E93F48',
    primaryForeground: '#FFFFFF',

    // Secondary / less-emphasis interactive surfaces — marigold tint
    secondary: '#FDECC8',
    secondaryForeground: '#8A4B00',

    // Muted / subdued elements (dividers, timestamps, placeholders)
    muted: '#F2E9DA',
    mutedForeground: '#7C6F5E',

    // Accent highlights (badges, selected items, focus rings) — marigold orange
    accent: '#F7A029',
    accentForeground: '#3A2400',

    // Destructive / urgent actions (end trip, SOS) — deep crimson
    destructive: '#C62828',
    destructiveForeground: '#FFFFFF',

    // Borders and input outlines
    border: '#EFE1C8',
    input: '#EFE1C8',
  },

  // Route-type accent colors, echoing the brief's Saver/Express/Comfort cues
  route: {
    saver: '#0F9D58',
    express: '#2E6FE0',
    comfort: '#F7A029',
  },

  // Border radius (in px) — soft, warm, pill-leaning
  radius: 18,
};

export default colors;
