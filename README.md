# SI LAIKA (SISERA Konawe)

**SI LAIKA** — Sistem Informasi dan Layanan Statistik Konawe Terintegrasi. Aplikasi Informasi Data Statistik Strategis Kabupaten Konawe.

Project Tugas Akhir Program Maganghub di BPS Kabupaten Konawe. Konsepnya mengacu pada SISERA (BPS Provinsi Sulawesi Tenggara), tetapi memakai data strategis Kabupaten Konawe.

## Rencana Fitur
- Beranda (ringkasan indikator dan berita terbaru)
- Indikator Strategis per kategori dengan grafik tren
- Publikasi (unduh PDF)
- Tabel statistik
- Infografis
- Berita
- Pencarian

## Teknologi
- React Native (Expo)
- NativeWind v4 (Tailwind CSS 3 untuk React Native)
- Supabase (PostgreSQL, Storage, Auth, Row Level Security)

## Dokumen
- `Laporan_Rancangan_SISERA_Konawe.docx` — laporan rancangan awal
- `Templat_Laporan_Akhir_SISERA_Konawe.docx` — templat laporan akhir

## Konfigurasi
Salin `.env.example` menjadi `.env`, lalu isi dengan URL dan kunci **anon** Supabase. Jangan pernah memasukkan kunci `service_role` ke aplikasi atau repository.

## Menjalankan & Distribusi (Expo / EAS)
Project terdaftar di Expo: `@maf_logictech/sisera-konawe`.

- **Pengembangan lokal:** `npm install`, lalu `npx expo start` dan scan QR code dengan Expo Go.
- **iOS (Expo Go via EAS Update):** `npm run update:ios`, lalu buka expo.dev → project → Updates → branch `preview` → scan QR code dengan Expo Go.
- **Android (EAS Build):** `npm run build:android` (menghasilkan APK internal, channel `preview`).

Catatan: variabel `EXPO_PUBLIC_*` ikut tertanam saat `eas update`/`eas build`, jadi isi di expo.dev (Environment variables) untuk environment `preview`.

## Struktur & Sumber Data
- `app/` — layar (expo-router): 5 tab (Beranda, Publikasi, Indikator, Tabel, Lainnya) + detail indikator dan halaman menu.
- `src/components/` — komponen UI; `AnimatedTabBar` = tab bar dengan lingkaran aktif yang meluncur.
- `src/services/` — sumber data. `EXPO_PUBLIC_DATA_SOURCE=mock` (default, data contoh di `src/data/mock/`, **bukan data resmi**) atau `api`.
- **Memasang API BPS Konawe:** lengkapi `src/services/apiSource.ts` (endpoint dan pemetaan respons ke `src/types`), isi `EXPO_PUBLIC_API_BASE_URL` dengan URL proxy, lalu set `EXPO_PUBLIC_DATA_SOURCE=api`. API key WebAPI BPS **tidak boleh** ada di app; simpan di proxy (mis. Supabase Edge Function).

## Status
Tahap UI dengan data contoh. Integrasi data asli menunggu perizinan dari BPS pusat.
