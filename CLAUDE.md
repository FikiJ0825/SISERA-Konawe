# SI LAIKA (SISERA Konawe)

Aplikasi mobile informasi data statistik strategis Kabupaten Konawe. Project Tugas Akhir Maganghub di BPS Kabupaten Konawe. Detail fitur ada di `README.md`.

## Stack
- Expo SDK 58, React Native 0.88, React 19, TypeScript
- expo-router (layar di `app/`), NativeWind v4 (Tailwind 3)
- Supabase (PostgreSQL, Storage, Auth) — hanya kunci **anon** di app
- Distribusi: EAS (`@maf_logictech/sisera-konawe`), Node v24.15.0

## Perintah
- `npm install` lalu `npx expo start` (scan QR dengan Expo Go)
- `npm run build:android` — APK internal (EAS Build, profile `preview`)
- `npm run update:ios` — EAS Update ke branch `preview`

## Struktur
- `app/` — layar: 5 tab (Beranda, Publikasi, Indikator, Tabel, Lainnya) + detail dan halaman menu
- `src/components/` — komponen UI (`AnimatedTabBar`)
- `src/services/` — sumber data; `EXPO_PUBLIC_DATA_SOURCE=mock` (default) atau `api`
- `src/data/mock/` — data contoh, **bukan data resmi**
- `docs/` — laporan, diagram, skrip pembuat dokumen
- `supabase/migrations/`, `.github/workflows/` — keep-alive Supabase

## Aturan penting
- Jangan taruh API key WebAPI BPS atau `service_role` Supabase di app/repo. Key BPS disimpan di proxy (mis. Supabase Edge Function).
- `.env` tidak ikut git: salin dari `.env.example` lalu isi di tiap perangkat. Keystore juga tidak ikut git.
- Bahasa UI dan dokumen: Indonesia.

## Alur git & dua perangkat
- Dikerjakan di 2 perangkat: laptop (branch `main`) dan PC rumah (branch `PC-silaika`).
- Di **laptop**: Claude commit dan push langsung ke `main` (tanpa branch kerja).
- Di **PC**: Claude commit dan push ke `PC-silaika`; user yang merge ke `main`.
- Mulai kerja: `git pull`. Selesai kerja: perbarui `docs/HANDOFF.md`, commit, push.
- Di sesi baru, baca `docs/HANDOFF.md` dulu untuk tahu status terakhir.
