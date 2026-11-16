/** @type {import('tailwindcss').Config} */
module.exports = {
  // App ini light-only (userInterfaceStyle: light); 'class' mencegah NativeWind menolak setColorScheme.
  darkMode: 'class',
  content: ['./app/**/*.{ts,tsx}', './src/**/*.{ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // Diambil dari logo BPS (biru, oranye, hijau) dan logo SI LAIKA (biru tua).
        primary: {
          50: '#EEF5FB',
          100: '#DCEBF6',
          200: '#B9D7EE',
          400: '#4FA3D9',
          500: '#2B8CC8',
          600: '#1F74AC',
          700: '#17588A',
          800: '#10446B',
          900: '#0B3250',
        },
        orange: { DEFAULT: '#E8893A', soft: '#FCEBDA' },
        green: { DEFAULT: '#6DB33F', soft: '#E6F3DC' },
        surface: '#F3F7FB',
        ink: '#17324A',
        muted: '#6B8196',
        line: '#E3EAF1',
      },
      fontFamily: {
        sans: ['PlusJakartaSans_400Regular'],
        medium: ['PlusJakartaSans_500Medium'],
        semibold: ['PlusJakartaSans_600SemiBold'],
        bold: ['PlusJakartaSans_700Bold'],
        extrabold: ['PlusJakartaSans_800ExtraBold'],
      },
      borderRadius: { '4xl': 32 },
    },
  },
  plugins: [],
};
