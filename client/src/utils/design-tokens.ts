// SLCTrips Design Token System
// Comprehensive color palette and design system for the 9-category template framework

// Brand colors - SLCTrips core identity
export const brandColors = {
  'great-salt-blue': '#0087c8',
  'pioneer-gold': '#f4b441',
  'canyon-red': '#b33c1a',
  'wasatch-white': '#ffffff',
  'navy-ridge': '#0d2a40',
  'rocky-road': '#f7f0e8'
};

// Category-specific color schemes
export const categoryColors = {
  'outdoor-adventure': {
    primary: '#4CAF50',    // Green - Nature and adventure
    secondary: '#81C784',
    accent: '#1B5E20',
    gradient: 'from-green-500 to-green-600'
  },
  'food-drink': {
    primary: '#FF5722',    // Deep Orange - Appetite and warmth
    secondary: '#FF8A65',
    accent: '#BF360C',
    gradient: 'from-orange-500 to-red-600'
  },
  'cultural-heritage': {
    primary: '#5D4037',    // Brown - History and tradition
    secondary: '#8D6E63',
    accent: '#3E2723',
    gradient: 'from-brown-500 to-brown-600'
  },
  'youth-family': {
    primary: '#03A9F4',    // Light Blue - Fun and family
    secondary: '#4FC3F7',
    accent: '#01579B',
    gradient: 'from-blue-400 to-blue-500'
  },
  'arts-entertainment': {
    primary: '#E91E63',    // Pink - Creativity and entertainment
    secondary: '#F06292',
    accent: '#AD1457',
    gradient: 'from-pink-500 to-pink-600'
  },
  'movie-media': {
    primary: '#9C27B0',    // Purple - Media and creativity
    secondary: '#BA68C8',
    accent: '#4A148C',
    gradient: 'from-purple-500 to-purple-600'
  },
  'hidden-gems': {
    primary: '#607D8B',    // Blue Grey - Mystery and discovery
    secondary: '#78909C',
    accent: '#37474F',
    gradient: 'from-blue-gray-500 to-blue-gray-600'
  },
  'seasonal-events': {
    primary: '#2196F3',    // Blue - Seasonal and timely
    secondary: '#42A5F5',
    accent: '#0D47A1',
    gradient: 'from-blue-500 to-blue-600'
  },
  'quick-escapes': {
    primary: '#00BCD4',    // Cyan - Quick and accessible
    secondary: '#4DD0E1',
    accent: '#006064',
    gradient: 'from-cyan-500 to-cyan-600'
  }
};

// Typography system
export const typography = {
  fonts: {
    headline: 'Montserrat, sans-serif',
    body: 'Inter, sans-serif',
    accent: 'Poppins, sans-serif'
  },
  sizes: {
    h1: '32px',
    h2: '24px',
    h3: '20px',
    h4: '18px',
    body: '16px',
    small: '14px',
    caption: '12px'
  },
  weights: {
    light: 300,
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800
  },
  lineHeights: {
    tight: 1.2,
    normal: 1.4,
    relaxed: 1.6,
    loose: 1.8
  }
};

// Spacing system
export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  '2xl': '48px',
  '3xl': '64px',
  '4xl': '96px'
};

// Border radius system
export const borderRadius = {
  none: '0px',
  sm: '4px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  full: '9999px'
};

// Shadow system
export const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
};

// Breakpoints
export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px'
};

// Z-index system
export const zIndex = {
  hide: -1,
  auto: 'auto',
  base: 0,
  docked: 10,
  dropdown: 1000,
  sticky: 1100,
  banner: 1200,
  overlay: 1300,
  modal: 1400,
  popover: 1500,
  skipLink: 1600,
  toast: 1700,
  tooltip: 1800
};

// Animation durations
export const animation = {
  duration: {
    fast: '150ms',
    normal: '300ms',
    slow: '500ms'
  },
  easing: {
    ease: 'cubic-bezier(0.4, 0, 0.2, 1)',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)'
  }
};

// CSS Variables for easy integration
export const cssVariables = {
  // Brand colors
  '--slc-primary': brandColors['great-salt-blue'],
  '--slc-accent': brandColors['pioneer-gold'],
  '--slc-danger': brandColors['canyon-red'],
  '--slc-light': brandColors['wasatch-white'],
  '--slc-dark': brandColors['navy-ridge'],
  '--slc-neutral': brandColors['rocky-road'],
  
  // Typography
  '--font-headline': typography.fonts.headline,
  '--font-body': typography.fonts.body,
  '--font-accent': typography.fonts.accent,
  
  // Spacing
  '--spacing-xs': spacing.xs,
  '--spacing-sm': spacing.sm,
  '--spacing-md': spacing.md,
  '--spacing-lg': spacing.lg,
  '--spacing-xl': spacing.xl,
  
  // Border radius
  '--radius-sm': borderRadius.sm,
  '--radius-md': borderRadius.md,
  '--radius-lg': borderRadius.lg,
  
  // Shadows
  '--shadow-sm': shadows.sm,
  '--shadow-md': shadows.md,
  '--shadow-lg': shadows.lg
};

// Helper function to get category colors
export const getCategoryColors = (category: keyof typeof categoryColors) => {
  return categoryColors[category] || categoryColors['outdoor-adventure'];
};

// Helper function to get brand colors
export const getBrandColors = () => {
  return brandColors;
};

// Helper function to generate CSS variables string
export const generateCSSVariables = () => {
  return Object.entries(cssVariables)
    .map(([key, value]) => `${key}: ${value};`)
    .join('\n');
};

// Export all design tokens
export const designTokens = {
  brandColors,
  categoryColors,
  typography,
  spacing,
  borderRadius,
  shadows,
  breakpoints,
  zIndex,
  animation,
  cssVariables
}; 