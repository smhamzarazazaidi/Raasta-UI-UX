/**
 * Semantic design tokens for Raasta — "Premium Minimal" theme.
 */

const colors = {
  light: {
    // Legacy aliases
    text: '#2A2A2A',
    tint: '#0B4A3B',

    // Core surfaces
    background: '#FFFFFF', // Soft White
    foreground: '#2A2A2A',

    // Cards / elevated surfaces
    card: '#FFFFFF',
    cardForeground: '#2A2A2A',

    // Primary action color — Deep Emerald Green
    primary: '#0B4A3B',
    primaryForeground: '#FFFFFF',

    // Secondary / less-emphasis interactive surfaces — Teal
    secondary: '#1A7A6E',
    secondaryForeground: '#FFFFFF',

    // Muted / subdued elements (dividers, timestamps, placeholders)
    muted: '#F5F5F5',
    mutedForeground: '#7C8A85',

    // Accent highlights — Warm Orange
    accent: '#E66A20',
    accentForeground: '#FFFFFF',

    // Destructive / urgent actions
    destructive: '#D32F2F',
    destructiveForeground: '#FFFFFF',

    // Borders and input outlines
    border: '#EAEAEA',
    input: '#EAEAEA',
  },

  // Route-type accent colors
  route: {
    saver: '#1A7A6E', // Teal
    express: '#0B4A3B', // Emerald
    comfort: '#E66A20', // Orange
  },

  // Border radius (in px) — rounded, modern cards (inDrive style)
  radius: 24,
};

export default colors;
