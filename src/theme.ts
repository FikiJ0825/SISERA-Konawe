// Token warna untuk komponen yang tidak bisa memakai className (SVG, gradient, ikon).
// Harus sama dengan tailwind.config.js.
export const colors = {
  primary50: '#EEF5FB',
  primary100: '#DCEBF6',
  primary200: '#B9D7EE',
  primary400: '#4FA3D9',
  primary500: '#2B8CC8',
  primary600: '#1F74AC',
  primary700: '#17588A',
  primary800: '#10446B',
  primary900: '#0B3250',
  orange: '#E8893A',
  orangeSoft: '#FCEBDA',
  green: '#6DB33F',
  greenSoft: '#E6F3DC',
  surface: '#F3F7FB',
  card: '#FFFFFF',
  ink: '#17324A',
  muted: '#6B8196',
  line: '#E3EAF1',
} as const;

export const fonts = {
  regular: 'PlusJakartaSans_400Regular',
  medium: 'PlusJakartaSans_500Medium',
  semibold: 'PlusJakartaSans_600SemiBold',
  bold: 'PlusJakartaSans_700Bold',
  extrabold: 'PlusJakartaSans_800ExtraBold',
} as const;
