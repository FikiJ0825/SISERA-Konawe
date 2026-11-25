// Konfigurasi sumber data. Semua variabel EXPO_PUBLIC_* terbaca publik di dalam app,
// jadi JANGAN pernah menaruh API key BPS di sini. Key disimpan di server proxy (mis. Supabase Edge Function).

export type DataSourceKind = 'mock' | 'api';

const raw = process.env.EXPO_PUBLIC_DATA_SOURCE;

export const env = {
  dataSource: (raw === 'api' ? 'api' : 'mock') as DataSourceKind,
  /** URL proxy/backend yang meneruskan permintaan ke WebAPI BPS. Kosong = belum dipasang. */
  apiBaseUrl: (process.env.EXPO_PUBLIC_API_BASE_URL ?? '').replace(/\/$/, ''),
  /** Kode wilayah BPS untuk Kab. Konawe. Verifikasi lewat endpoint daftar domain WebAPI BPS. */
  domainCode: process.env.EXPO_PUBLIC_BPS_DOMAIN_CODE ?? '',
  /** Kunci anon Supabase (publik by design) untuk memanggil Edge Function proxy. */
  supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '',
  namaWilayah: 'Kab. Konawe',
  namaApp: 'SI LAIKA',
};
