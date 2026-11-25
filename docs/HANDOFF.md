# HANDOFF — status terakhir

Perbarui file ini di akhir setiap sesi kerja, lalu commit dan push.

**Terakhir diperbarui:** 2026-11-25 (laptop)

## Status
Integrasi WebAPI BPS (domain Kab. Konawe `7403`) selesai di kode; tinggal deploy proxy Supabase lalu aktifkan sumber data `api`. Default app tetap `mock`.

## Sudah selesai
- UI SI LAIKA v2 (5 tab, detail indikator, halaman menu), responsif untuk Android
- Splash logo SI LAIKA, setup Expo + EAS
- `src/services/apiSource.ts` lengkap: publikasi, BRS, infografis, berita, tabel (subcat + subject), indikator (IPM, kemiskinan, pertumbuhan ekonomi, inflasi bulanan). Diuji terhadap API asli lewat proxy lokal tiruan.
- Edge Function `supabase/functions/bps-proxy`: key BPS di secret Supabase, path di-whitelist, hanya domain 7403. **Belum di-deploy.**
- `scripts/bps-explore.mjs`: eksplorasi endpoint (key dari `.env`, sampel ke `.bps-samples/`, gitignored)
- Keep-alive Supabase via GitHub Actions (PR #1, #2)
- Laporan progres bulan 1 dan bahan presentasi (docx/pptx lokal, belum di-commit)

## Langkah berikutnya
- Deploy proxy: `supabase login`, `supabase link`, `supabase secrets set BPS_API_KEY=...`, `supabase functions deploy bps-proxy`
- Isi `.env`: `EXPO_PUBLIC_API_BASE_URL=https://<ref>.supabase.co/functions/v1/bps-proxy`, `EXPO_PUBLIC_DATA_SOURCE=api`, `EXPO_PUBLIC_BPS_DOMAIN_CODE=7403`, kunci anon Supabase
- Uji tiap tab dengan data asli di Expo Go
- Indikator yang belum ada di WebAPI Konawe: jumlah penduduk terkini (var 35 hanya sampai 2014), TPT, NTP. Saat ini disembunyikan; putuskan cari sumber lain (tabel statis/BRS) atau biarkan.
- Jadwal rilis dan kontak masih dari mock (tidak ada di WebAPI)
- Batas WebAPI: parameter `th` maksimal 3 tahun per permintaan; endpoint `indicators` tidak mendukung kabupaten
- Inflasi di app = month-to-month (var 196); inflasi y-on-y ada di judul BRS

## Catatan
- File docx/pptx laporan berada di folder proyek laptop dan belum masuk git; pindahkan manual (Drive/flashdisk) bila perlu di PC.
- Setup PC: `npm install`, salin `.env.example` ke `.env`, samakan Node v24. `BPS_API_KEY` hanya untuk skrip lokal; jangan beri prefix `EXPO_PUBLIC_`.
