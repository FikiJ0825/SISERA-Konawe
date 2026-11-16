import { useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/** Lebar maksimum konten. Di tablet/iPad/layar lipat konten dipusatkan, bukan dilebarkan. */
export const MAX_CONTENT_WIDTH = 640;
/** Tinggi tab bar tanpa inset bawah (bar 66 + bagian lingkaran yang menonjol 30). */
export const TAB_BAR_BASE_HEIGHT = 96;

const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max);

/** Ukuran-ukuran turunan layar agar UI tetap rapi di semua perangkat dan rasio. */
export function useLayout() {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const contentWidth = Math.min(width, MAX_CONTENT_WIDTH);

  return {
    width,
    height,
    contentWidth,
    isCompact: width < 360,
    isTablet: width >= 600,
    /** Lebar kartu horizontal (indikator), mengikuti lebar konten. */
    cardWidth: clamp(contentWidth * 0.62, 200, 280),
    /** Jumlah kolom grid pintasan. */
    // 8 pintasan: 4 kolom rapi di >= 300dp (2 baris penuh); 3 kolom hanya untuk layar ekstra sempit.
    shortcutColumns: width >= 300 ? 4 : 3,
    /** Ruang kosong di bawah konten agar tidak tertutup tab bar. */
    tabBarSpace: TAB_BAR_BASE_HEIGHT + Math.max(insets.bottom, 8) + 16,
    /** Ruang bawah untuk layar tanpa tab bar. */
    safeBottom: insets.bottom + 24,
  };
}
