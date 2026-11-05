# SISERA Konawe

Aplikasi Informasi Data Statistik Strategis Kabupaten Konawe.

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

## Status
Tahap perancangan.
