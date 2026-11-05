# Use Case SISERA Konawe (DRAFT)

Status: draf untuk didiskusikan dengan mentor. Bagian "Usulan kebaruan" belum disetujui dan belum akan dikerjakan.

Sumber acuan: 7 tangkapan layar SISERA BPS Sultra v3.0.1 (disimpan lokal di folder `UI SISERA BPS SULTRA/`, tidak di-commit), App Store, leaflet BPS, portal sultradata.com.

## 1. Temuan dari UI SISERA Sultra

Struktur layar yang terlihat:

- **Bottom tab (5):** Beranda, Publikasi, Indikator Strategis (tombol tengah menonjol), Tabel, Lainnya.
- **Beranda:** header logo BPS + ikon notifikasi (ada titik merah), banner sambutan, kolom "Cari Disini...", pemilih wilayah ("Pilih Wilayah: Prov. Sulawesi Tenggara"), kartu Indikator Strategis (contoh: Jumlah Penduduk 2023), grid 8 pintasan (Publikasi, Tabel, Infografis, BRS, Berita, Jadwal Rilis, Konsultasi, Syantik), "Informasi Terbaru" dengan tab Publikasi / Tabel / BRS, galeri Infografis, "Hubungi Kami" (alamat, telepon, email, Instagram, Facebook, YouTube), hak cipta dan versi aplikasi.
- **Publikasi:** daftar sampul + judul + tanggal rilis.
- **Tabel:** dikelompokkan per kategori yang bisa dibuka-tutup (Sosial dan Kependudukan, Ekonomi dan Perdagangan, Pertanian dan Pertambangan, ...), berisi subjek (Agama, Demokrasi, Gender, Geografi, Iklim, IPM, Kemiskinan dan Ketimpangan, Kependudukan).
- **Indikator Strategis:** daftar kartu (IHK, Inflasi m-to-m, Inflasi y-on-y, NTP, dst.) dengan nilai terbaru, satuan, periode, dan tombol **Bookmark**.
- **Lainnya:** Infografis, BRS, Berita, Jadwal Rilis, Konsultasi, Syantik, PPID, Survey Kepuasan Pelanggan, Standar dan Maklumat Pelayanan, Hasil Survey Kepuasan Masyarakat.

Belum terlihat dari tangkapan layar: halaman detail indikator (apakah ada grafik tren), isi halaman Tabel setelah memilih subjek, layar Konsultasi/Jadwal Rilis, dan apakah ada login.

## 2. Use case acuan (aktor: Pengguna umum)

| No | Use case | Dasar |
|----|----------|-------|
| 1 | Lihat beranda | Terlihat di UI |
| 2 | Cari data | Terlihat (kolom "Cari Disini...") |
| 3 | Pilih wilayah | Terlihat ("Pilih Wilayah"); untuk Konawe: kabupaten/kecamatan (usulan) |
| 4 | Lihat indikator strategis | Terlihat |
| 5 | Simpan indikator (bookmark) | Terlihat (tombol Bookmark) |
| 6 | Lihat publikasi / unduh publikasi | Daftar terlihat; unduh diasumsikan |
| 7 | Lihat tabel per kategori dan subjek | Terlihat |
| 8 | Lihat infografis | Terlihat |
| 9 | Baca Berita Resmi Statistik (BRS) | Terlihat |
| 10 | Baca berita | Terlihat (menu) |
| 11 | Lihat jadwal rilis | Terlihat (menu) |
| 12 | Lihat notifikasi | Terlihat (ikon lonceng) |
| 13 | Konsultasi | Terlihat (menu); bentuknya belum diketahui (diduga tautan WhatsApp) |
| 14 | Buka Syantik | Terlihat (menu); diduga tautan ke sistem lain |
| 15 | Lihat informasi layanan (PPID, standar dan maklumat pelayanan) | Terlihat (menu) |
| 16 | Isi survei kepuasan / lihat hasil survei | Terlihat (menu) |
| 17 | Lihat kontak dan media sosial BPS (Hubungi Kami) | Terlihat |

## 3. Use case admin (aktor: Admin BPS Konawe) — asumsi

SISERA Sultra tidak menampilkan sisi admin di aplikasi. Untuk SISERA Konawe diusulkan: Login admin; Kelola indikator dan nilai; Kelola publikasi; Kelola tabel; Kelola infografis; Kelola BRS dan berita; Kelola jadwal rilis; Kirim notifikasi; Kelola kategori dan wilayah.

## 4. Usulan kebaruan (DRAFT, menunggu persetujuan mentor)

Catatan koreksi: setelah melihat UI asli, **favorit/bookmark, notifikasi, dan konsultasi sudah ada di SISERA Sultra**, jadi tidak lagi dihitung sebagai kebaruan.

| Usulan | Tingkat | Keterangan |
|--------|---------|------------|
| Bandingkan kecamatan dan tahun | Inti | Tidak terlihat di SISERA Sultra |
| Lihat definisi dan metadata indikator | Inti | Tidak terlihat di SISERA Sultra |
| Unduh data CSV/Excel | Inti | Tidak terlihat di SISERA Sultra |
| Akses offline (cache) | Inti | Relevan untuk sinyal lemah di Konawe |
| Peta tematik kecamatan | Lanjut | Butuh data batas wilayah kecamatan |
| Bagikan indikator sebagai gambar | Lanjut | |
| Mode gelap dan ukuran huruf | Lanjut | |
| Grafik tren per indikator | Perlu dicek | Hanya jadi kebaruan jika halaman detail SISERA Sultra tidak punya grafik |

## 5. Pertanyaan untuk mentor

1. Fitur kebaruan mana yang disetujui, dan mana yang ditunda?
2. Apakah data per kecamatan Konawe tersedia dan boleh dipublikasikan?
3. Apakah pengelolaan data oleh admin dilakukan lewat aplikasi/web sendiri atau cukup lewat Supabase?
4. Apakah nama dan identitas visual (logo BPS) boleh dipakai?
