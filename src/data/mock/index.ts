// DATA CONTOH untuk pengembangan UI. Semua angka di bawah adalah placeholder dan BUKAN data resmi BPS.
// Akan diganti data asli dari WebAPI BPS Kab. Konawe lewat src/services/apiSource.ts.
import type {
  Berita,
  Brs,
  Indikator,
  Infografis,
  JadwalRilis,
  Kontak,
  Publikasi,
  TabelKategori,
} from '@/types';

const tahun = (mulai: number, nilai: number[]) =>
  nilai.map((v, i) => ({ label: String(mulai + i), nilai: v }));

export const indikator: Indikator[] = [
  {
    id: 'penduduk',
    judul: 'Jumlah Penduduk Kabupaten Konawe',
    nilai: '280.000',
    satuan: 'Jiwa',
    periode: '2024',
    kategori: 'Sosial dan Kependudukan',
    definisi:
      'Banyaknya penduduk yang bertempat tinggal di wilayah Kabupaten Konawe pada pertengahan tahun.',
    tren: tahun(2019, [262000, 265500, 269000, 272500, 276000, 280000]),
    ikon: 'people',
  },
  {
    id: 'ipm',
    judul: 'Indeks Pembangunan Manusia (IPM)',
    nilai: '70,00',
    satuan: 'Indeks',
    periode: '2024',
    kategori: 'Sosial dan Kependudukan',
    definisi:
      'Ukuran capaian pembangunan manusia berbasis tiga dimensi dasar: umur panjang dan hidup sehat, pengetahuan, dan standar hidup layak.',
    tren: tahun(2019, [67.1, 67.5, 68.0, 68.6, 69.3, 70.0]),
    ikon: 'ribbon',
  },
  {
    id: 'kemiskinan',
    judul: 'Persentase Penduduk Miskin',
    nilai: '10,00',
    satuan: 'Persen',
    periode: '2024',
    kategori: 'Sosial dan Kependudukan',
    definisi:
      'Persentase penduduk yang memiliki rata-rata pengeluaran per kapita per bulan di bawah Garis Kemiskinan.',
    tren: tahun(2019, [11.6, 11.9, 11.4, 11.0, 10.5, 10.0]),
    ikon: 'heart',
  },
  {
    id: 'pertumbuhan',
    judul: 'Laju Pertumbuhan Ekonomi',
    nilai: '5,00',
    satuan: 'Persen',
    periode: '2024',
    kategori: 'Ekonomi dan Perdagangan',
    definisi:
      'Perubahan nilai Produk Domestik Regional Bruto (PDRB) atas dasar harga konstan dibanding tahun sebelumnya.',
    tren: tahun(2019, [6.1, -0.4, 3.2, 4.6, 5.3, 5.0]),
    ikon: 'trending-up',
  },
  {
    id: 'tpt',
    judul: 'Tingkat Pengangguran Terbuka (TPT)',
    nilai: '3,50',
    satuan: 'Persen',
    periode: 'Agustus 2024',
    kategori: 'Ketenagakerjaan',
    definisi:
      'Persentase jumlah pengangguran terhadap jumlah angkatan kerja.',
    tren: tahun(2019, [3.9, 4.6, 4.2, 3.9, 3.7, 3.5]),
    ikon: 'briefcase',
  },
  {
    id: 'inflasi',
    judul: 'Inflasi (year on year)',
    nilai: '2,50',
    satuan: 'Persen',
    periode: 'Oktober 2025',
    kategori: 'Harga',
    definisi:
      'Persentase kenaikan harga barang dan jasa secara umum dibanding bulan yang sama tahun sebelumnya.',
    tren: [
      { label: 'Mei', nilai: 2.1 },
      { label: 'Jun', nilai: 2.3 },
      { label: 'Jul', nilai: 2.2 },
      { label: 'Agu', nilai: 2.6 },
      { label: 'Sep', nilai: 2.4 },
      { label: 'Okt', nilai: 2.5 },
    ],
    ikon: 'pricetag',
  },
  {
    id: 'ntp',
    judul: 'Nilai Tukar Petani (NTP)',
    nilai: '120,00',
    satuan: 'Indeks',
    periode: 'Oktober 2025',
    kategori: 'Pertanian',
    definisi:
      'Perbandingan indeks harga yang diterima petani dengan indeks harga yang dibayar petani, sebagai indikator daya tukar produk pertanian.',
    tren: [
      { label: 'Mei', nilai: 117 },
      { label: 'Jun', nilai: 118 },
      { label: 'Jul', nilai: 118.5 },
      { label: 'Agu', nilai: 119 },
      { label: 'Sep', nilai: 119.4 },
      { label: 'Okt', nilai: 120 },
    ],
    ikon: 'leaf',
  },
];

export const publikasi: Publikasi[] = [
  { id: 'p1', judul: 'Kabupaten Konawe dalam Angka 2025', tanggalRilis: '2025-02-28', warna: '#17588A' },
  { id: 'p2', judul: 'Statistik Daerah Kabupaten Konawe 2025', tanggalRilis: '2025-09-26', warna: '#2B8CC8' },
  { id: 'p3', judul: 'Produk Domestik Regional Bruto Kabupaten Konawe Menurut Lapangan Usaha 2020–2024', tanggalRilis: '2025-04-30', warna: '#6DB33F' },
  { id: 'p4', judul: 'Indeks Pembangunan Manusia Kabupaten Konawe 2024', tanggalRilis: '2025-08-12', warna: '#E8893A' },
  { id: 'p5', judul: 'Statistik Nilai Tukar Petani Triwulan III 2025', tanggalRilis: '2025-11-03', warna: '#10446B' },
  { id: 'p6', judul: 'Direktori Desa Kabupaten Konawe 2025', tanggalRilis: '2025-08-20', warna: '#4FA3D9' },
];

export const tabelKategori: TabelKategori[] = [
  {
    id: 'sosial',
    nama: 'Sosial dan Kependudukan',
    ikon: 'people',
    subjek: [
      { id: 'agama', nama: 'Agama' },
      { id: 'gender', nama: 'Gender' },
      { id: 'geografi', nama: 'Geografi' },
      { id: 'ipm', nama: 'Indeks Pembangunan Manusia' },
      { id: 'kemiskinan', nama: 'Kemiskinan dan Ketimpangan' },
      { id: 'kependudukan', nama: 'Kependudukan' },
    ],
  },
  {
    id: 'ekonomi',
    nama: 'Ekonomi dan Perdagangan',
    ikon: 'cash',
    subjek: [
      { id: 'pdrb', nama: 'Produk Domestik Regional Bruto' },
      { id: 'inflasi', nama: 'Inflasi' },
      { id: 'perdagangan', nama: 'Perdagangan' },
      { id: 'keuangan', nama: 'Keuangan dan Harga' },
    ],
  },
  {
    id: 'pertanian',
    nama: 'Pertanian dan Pertambangan',
    ikon: 'leaf',
    subjek: [
      { id: 'tanaman', nama: 'Tanaman Pangan' },
      { id: 'perkebunan', nama: 'Perkebunan' },
      { id: 'perikanan', nama: 'Perikanan' },
      { id: 'pertambangan', nama: 'Pertambangan dan Energi' },
    ],
  },
  {
    id: 'kerja',
    nama: 'Ketenagakerjaan',
    ikon: 'briefcase',
    subjek: [
      { id: 'angkatan', nama: 'Angkatan Kerja' },
      { id: 'upah', nama: 'Upah' },
    ],
  },
];

export const infografis: Infografis[] = [
  { id: 'i1', judul: 'Profil Kemiskinan Kabupaten Konawe', tanggal: '2025-07-15', warna: '#E8893A' },
  { id: 'i2', judul: 'Perkembangan Inflasi Oktober 2025', tanggal: '2025-11-03', warna: '#2B8CC8' },
  { id: 'i3', judul: 'Potret Ketenagakerjaan Agustus 2025', tanggal: '2025-11-05', warna: '#6DB33F' },
  { id: 'i4', judul: 'Indeks Pembangunan Manusia 2024', tanggal: '2025-08-12', warna: '#17588A' },
];

export const brs: Brs[] = [
  { id: 'b1', judul: 'Perkembangan Nilai Tukar Petani Oktober 2025', tanggal: '2025-11-03', ringkasan: 'Ringkasan contoh Berita Resmi Statistik.' },
  { id: 'b2', judul: 'Inflasi Oktober 2025', tanggal: '2025-11-03', ringkasan: 'Ringkasan contoh Berita Resmi Statistik.' },
  { id: 'b3', judul: 'Keadaan Ketenagakerjaan Agustus 2025', tanggal: '2025-11-05', ringkasan: 'Ringkasan contoh Berita Resmi Statistik.' },
];

export const berita: Berita[] = [
  { id: 'n1', judul: 'BPS Kabupaten Konawe Gelar Pembinaan Statistik Sektoral', tanggal: '2025-10-21', ringkasan: 'Contoh berita kegiatan. Isi asli menyusul dari sumber resmi.' },
  { id: 'n2', judul: 'Sensus Ekonomi: Persiapan Pelaksanaan di Kabupaten Konawe', tanggal: '2025-10-10', ringkasan: 'Contoh berita kegiatan. Isi asli menyusul dari sumber resmi.' },
  { id: 'n3', judul: 'Mengenal Indikator Strategis untuk Perencanaan Daerah', tanggal: '2025-09-30', ringkasan: 'Contoh berita kegiatan. Isi asli menyusul dari sumber resmi.' },
];

export const jadwalRilis: JadwalRilis[] = [
  { id: 'j1', judul: 'Berita Resmi Statistik: Inflasi', tanggal: '2025-12-01', jenis: 'BRS' },
  { id: 'j2', judul: 'Berita Resmi Statistik: Nilai Tukar Petani', tanggal: '2025-12-01', jenis: 'BRS' },
  { id: 'j3', judul: 'Publikasi: Statistik Konstruksi', tanggal: '2025-12-15', jenis: 'Publikasi' },
];

export const kontak: Kontak = {
  nama: 'BPS Kabupaten Konawe',
  alamat: 'Alamat resmi menyusul dari BPS Kabupaten Konawe',
  telepon: '-',
  email: '-',
  website: 'https://konawekab.bps.go.id',
  instagram: '-',
  facebook: '-',
  youtube: '-',
};
