import type { DisplaySize, ThemeMode } from '@/types';

export const SPACING = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 } as const;

export const RADIUS = { xs: 8, sm: 12, md: 16, lg: 24, xl: 32, pill: 999 } as const;

export const ICON_SIZES = { xs: 14, sm: 18, md: 22, lg: 28, xl: 36 } as const;

export const TYPE_SCALE = {
  tiny: 11,
  small: 13,
  body: 15,
  medium: 17,
  title: 21,
  large: 27,
  hero: 34,
} as const;

export const FONT_WEIGHT = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
} as const;

export const GLASS = {
  blurIntensity: 40,
  tintOpacityDark: 0.55,
  tintOpacityLight: 0.65,
  borderOpacity: 0.12,
  shadowOpacity: 0.35,
  shadowRadius: 18,
  shadowHeight: 8,
} as const;

export interface AccentPreset {
  id: string;
  label: string;
  color: string;
  onAccent: string;
}

export interface AccentPalette {
  id: string;
  accent: string;
  onAccent: string;
}

export const ACCENT_PRESETS: AccentPreset[] = [
  { id: 'default', label: 'Umusic Default', color: '#7C5CFF', onAccent: '#FFFFFF' },
  { id: 'rose', label: 'Rose', color: '#FF5C8A', onAccent: '#FFFFFF' },
  { id: 'cyan', label: 'Cyan', color: '#39D0D8', onAccent: '#06282B' },
  { id: 'amber', label: 'Amber', color: '#FFB13D', onAccent: '#2B1D05' },
  { id: 'lime', label: 'Lime', color: '#8AFF80', onAccent: '#0C2B0A' },
  { id: 'coral', label: 'Coral', color: '#FF7A45', onAccent: '#2B1205' },
  { id: 'violet', label: 'Violet', color: '#B28AFF', onAccent: '#1D1240' },
  { id: 'sky', label: 'Sky', color: '#4DA6FF', onAccent: '#06182B' },
  { id: 'crimson', label: 'Crimson', color: '#FF4D6D', onAccent: '#FFFFFF' },
  { id: 'mint', label: 'Mint', color: '#3DDC97', onAccent: '#062B1D' },
  { id: 'mono', label: 'Mono', color: '#F2F2F2', onAccent: '#111116' },
  { id: 'gold', label: 'Gold', color: '#FFDE59', onAccent: '#2B2405' },
];

export const DISPLAY_SCALES: Record<DisplaySize, number> = {
  small: 0.85,
  default: 1,
  large: 1.15,
  xlarge: 1.3,
};

export interface ThemeColors {
  background: string;
  backgroundElevated: string;
  surface: string;
  surfacePressed: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  accent: string;
  onAccent: string;
  divider: string;
  error: string;
  success: string;
  warning: string;
  glassTint: string;
  glassBorder: string;
  skeleton: string;
  overlay: string;
}

const DARK_COLORS: ThemeColors = {
  background: '#0B0B0F',
  backgroundElevated: '#15151C',
  surface: '#1C1C25',
  surfacePressed: '#26262F',
  textPrimary: '#F5F5F7',
  textSecondary: '#A8A8B3',
  textMuted: '#8A8A96',
  accent: '#7C5CFF',
  onAccent: '#FFFFFF',
  divider: 'rgba(255,255,255,0.08)',
  error: '#FF4D6D',
  success: '#3DDC97',
  warning: '#FFB13D',
  glassTint: 'rgba(20,20,28,0.55)',
  glassBorder: 'rgba(255,255,255,0.12)',
  skeleton: '#1E1E28',
  overlay: 'rgba(0,0,0,0.6)',
};

const LIGHT_COLORS: ThemeColors = {
  background: '#F7F7FA',
  backgroundElevated: '#FFFFFF',
  surface: '#FFFFFF',
  surfacePressed: '#ECECF2',
  textPrimary: '#16161C',
  textSecondary: '#5A5A66',
  textMuted: '#66666F',
  accent: '#6A4BEF',
  onAccent: '#FFFFFF',
  divider: 'rgba(0,0,0,0.08)',
  error: '#E0314F',
  success: '#1FA97A',
  warning: '#C98A1B',
  glassTint: 'rgba(255,255,255,0.65)',
  glassBorder: 'rgba(0,0,0,0.10)',
  skeleton: '#E8E8EF',
  overlay: 'rgba(20,20,30,0.45)',
};

export type FontWeightValue = (typeof FONT_WEIGHT)[keyof typeof FONT_WEIGHT];

export interface AppTheme {
  mode: 'dark' | 'light';
  colors: ThemeColors;
  accent: AccentPalette;
  scale: number;
  spacing: typeof SPACING;
  radius: typeof RADIUS;
  iconSizes: typeof ICON_SIZES;
  type: typeof TYPE_SCALE;
  fontWeight: typeof FONT_WEIGHT;
  glass: typeof GLASS;
  font(family: 'regular' | 'medium' | 'semibold' | 'bold'): { fontWeight: FontWeightValue };
  fs(size: number): number;
  sp(size: number): number;
}

export function resolveAccent(accentId: string): AccentPalette {
  const preset = ACCENT_PRESETS.find((a) => a.id === accentId);
  if (preset) return { id: preset.id, accent: preset.color, onAccent: preset.onAccent };
  if (/^#[0-9A-Fa-f]{6}$/.test(accentId)) {
    return { id: 'custom', accent: accentId, onAccent: pickOnColor(accentId) };
  }
  const fallback = ACCENT_PRESETS[0];
  return { id: fallback.id, accent: fallback.color, onAccent: fallback.onAccent };
}

export function pickOnColor(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
  return luminance > 150 ? '#111116' : '#FFFFFF';
}

export function buildTheme(mode: 'dark' | 'light', accentId: string, displaySize: DisplaySize): AppTheme {
  const base = mode === 'dark' ? DARK_COLORS : LIGHT_COLORS;
  const accent = resolveAccent(accentId);
  const scale = DISPLAY_SCALES[displaySize] ?? 1;
  const colors: ThemeColors = { ...base, accent: accent.accent, onAccent: accent.onAccent };
  return {
    mode,
    colors,
    accent,
    scale,
    spacing: SPACING,
    radius: RADIUS,
    iconSizes: ICON_SIZES,
    type: TYPE_SCALE,
    fontWeight: FONT_WEIGHT,
    glass: GLASS,
    font: (family) => ({ fontWeight: FONT_WEIGHT[family] }),
    fs: (size) => Math.round(size * scale),
    sp: (size) => Math.round(size * Math.min(scale, 1.15)),
  };
}

export function resolveMode(themeMode: ThemeMode, systemDark: boolean): 'dark' | 'light' {
  if (themeMode === 'system') return systemDark ? 'dark' : 'light';
  return themeMode;
}
