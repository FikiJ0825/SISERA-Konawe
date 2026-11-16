// Bentuk data yang dipakai UI. Sumber data (mock atau API) wajib memetakan responsnya ke tipe ini,
// sehingga layar tidak perlu diubah saat data asli dipasang.

export type TrenPoint = { label: string; nilai: number };

export type Indikator = {
  id: string;
  judul: string;
  /** Nilai terbaru, sudah diformat untuk ditampilkan, mis. "5,32". */
  nilai: string;
  satuan: string;
  /** Periode data terbaru, mis. "2024" atau "September 2025". */
  periode: string;
  kategori: string;
  definisi: string;
  tren: TrenPoint[];
  ikon: string;
};

export type Publikasi = {
  id: string;
  judul: string;
  /** ISO date (YYYY-MM-DD). */
  tanggalRilis: string;
  sampulUrl?: string;
  pdfUrl?: string;
  warna: string;
};

export type TabelSubjek = { id: string; nama: string };
export type TabelKategori = { id: string; nama: string; ikon: string; subjek: TabelSubjek[] };

export type Infografis = {
  id: string;
  judul: string;
  tanggal: string;
  gambarUrl?: string;
  warna: string;
};

export type Brs = { id: string; judul: string; tanggal: string; ringkasan: string };
export type Berita = { id: string; judul: string; tanggal: string; ringkasan: string };
export type JadwalRilis = { id: string; judul: string; tanggal: string; jenis: string };

export type Kontak = {
  nama: string;
  alamat: string;
  telepon: string;
  email: string;
  website: string;
  instagram: string;
  facebook: string;
  youtube: string;
};
