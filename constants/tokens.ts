export type ColorScheme = 'light' | 'dark';

export const palette = {
  light: {
    background: '#0B0A14',
    backgroundAlt: '#0A0A0A',
    card: '#1A1A1A',
    surface: '#111113',
    elevated: '#18181B',
    primary: '#FF0080',
    primaryAlt: '#E91E63',
    secondary: '#8B5CF6',
    accent: '#00C6FF',
    success: '#6EE7B7',
    danger: '#EF4444',
    warning: '#F59E0B',
    info: '#3B82F6',
    text: '#FFFFFF',
    textSecondary: '#CCC',
    textMuted: '#999',
    textSubtle: '#666',
    border: '#2A2A2A',
    borderLight: '#1F2937',
    overlay: 'rgba(0,0,0,0.5)',
    overlayLight: 'rgba(0,0,0,0.3)'
  },
  dark: {
    background: '#0B0A14',
    backgroundAlt: '#0A0A0A',
    card: '#1A1A1A',
    surface: '#111113',
    elevated: '#18181B',
    primary: '#FF0080',
    primaryAlt: '#E91E63',
    secondary: '#8B5CF6',
    accent: '#00C6FF',
    success: '#6EE7B7',
    danger: '#EF4444',
    warning: '#F59E0B',
    info: '#3B82F6',
    text: '#FFFFFF',
    textSecondary: '#CCC',
    textMuted: '#999',
    textSubtle: '#666',
    border: '#2A2A2A',
    borderLight: '#1F2937',
    overlay: 'rgba(0,0,0,0.5)',
    overlayLight: 'rgba(0,0,0,0.3)'
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
