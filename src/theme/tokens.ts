export const colors = {
  canvas: '#F8F9FB',
  surface: '#FFFFFF',
  surfaceSubtle: '#F1F5F9',
  border: '#E2E8F0',
  divider: '#F1F5F9',
  textPrimary: '#0F172A',
  textSecondary: '#64748B',
  textTertiary: '#94A3B8',
  textMuted: '#475569',
  accent: '#8B5CF6',
  accentSoft: '#EDE9FE',
  accentTextSoft: '#DDD6FE',
  success: '#10B981',
  successSoft: '#D1FAE5',
  danger: '#EF4444',
  dangerSoft: '#FEF2F2',
  warning: '#F59E0B',
  warningSoft: '#FEF3C7',
  info: '#3B82F6',
  infoSoft: '#DBEAFE',
  inverse: '#FFFFFF',
  darkSurface: '#1E293B',
} as const;

export const spacing = {
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
} as const;

export const radii = {
  small: 10,
  control: 12,
  brand: 16,
  card: 20,
  feature: 24,
  pill: 999,
} as const;

export const typography = {
  display: { fontSize: 32, fontWeight: '800' },
  screenTitle: { fontSize: 28, fontWeight: '800' },
  profileTitle: { fontSize: 24, fontWeight: '800' },
  sectionTitle: { fontSize: 18, fontWeight: '700' },
  itemTitle: { fontSize: 16, fontWeight: '700' },
  body: { fontSize: 15, fontWeight: '400' },
  supporting: { fontSize: 14, fontWeight: '400' },
  label: { fontSize: 13, fontWeight: '600' },
  micro: { fontSize: 12, fontWeight: '500' },
} as const;

export const shadows = {
  card: {
    shadowColor: colors.textPrimary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  subtle: {
    shadowColor: colors.textPrimary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
} as const;