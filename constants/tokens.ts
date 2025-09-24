export type ColorScheme = 'light' | 'dark';

export const palette = {
  light: {
    background: '#0B0B10',
    card: '#14141B',
    surface: '#181825',
    elevated: '#1E1E2E',
    primary: '#7C5CFF',
    primaryAlt: '#A68CFF',
    secondary: '#3ECF8E',
    danger: '#FF5C7C',
    warning: '#FFC24C',
    info: '#4CC9F0',
    text: '#FFFFFF',
    textMuted: '#C9C9D1',
    border: '#2A2A3B',
    overlay: 'rgba(0,0,0,0.4)'
  },
  dark: {
    background: '#0B0B10',
    card: '#14141B',
    surface: '#181825',
    elevated: '#1E1E2E',
    primary: '#7C5CFF',
    primaryAlt: '#A68CFF',
    secondary: '#3ECF8E',
    danger: '#FF5C7C',
    warning: '#FFC24C',
    info: '#4CC9F0',
    text: '#FFFFFF',
    textMuted: '#C9C9D1',
    border: '#2A2A3B',
    overlay: 'rgba(0,0,0,0.4)'
  }
} as const;

export const spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32
} as const;

export const radii = {
  xs: 6,
  sm: 10,
  md: 14,
  lg: 18,
  full: 999
} as const;

export const typography = {
  fontFamily: 'System',
  sizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 22,
    xxl: 28
  } as const,
  weights: {
    regular: '400' as const,
    medium: '600' as const,
    bold: '700' as const
  }
};

export const shadows = {
  sm: { shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 2 },
  md: { shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 4 },
  lg: { shadowColor: '#000', shadowOpacity: 0.25, shadowRadius: 18, shadowOffset: { width: 0, height: 8 }, elevation: 8 }
} as const;
