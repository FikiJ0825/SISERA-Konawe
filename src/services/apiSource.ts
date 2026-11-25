import { env } from '@/config/env';
import type {
  Berita,
  Brs,
  Indikator,
  Infografis,
  Publikasi,
  TabelKategori,
  TrenPoint,
} from '@/types';
import type { DataSource } from './dataSource';
import { mockSource } from './mockSource';

/**
 * Sumber data WebAPI BPS Kab. Konawe, lewat proxy Supabase Edge Function (supabase/functions/bps-proxy).
 * API key BPS hanya ada di proxy. App mengirim path WebAPI lewat parameter `p`.
 * Jadwal rilis dan kontak tidak tersedia di WebAPI, jadi diambil dari mockSource.
 */

export class ApiNotConfiguredError extends Error {
  constructor() {
    super(
      'Sumber data "api" belum dikonfigurasi. Isi EXPO_PUBLIC_API_BASE_URL atau ganti EXPO_PUBLIC_DATA_SOURCE ke "mock".',
    );
    this.name = 'ApiNotConfiguredError';
  }
}

// ---------- Transport ----------

type Raw = Record<string, any>;

async function request(path: string, params: Record<string, string | number> = {}): Promise<Raw> {
  if (!env.apiBaseUrl) throw new ApiNotConfiguredError();
  const query = new URLSearchParams({ p: path });
  for (const [k, v] of Object.entries(params)) query.set(k, String(v));
  const res = await fetch(`${env.apiBaseUrl}?${query.toString()}`, {
    headers: env.supabaseAnonKey
      ? { apikey: env.supabaseAnonKey, Authorization: `Bearer ${env.supabaseAnonKey}` }
      : undefined,
  });
  const json = (await res.json().catch(() => ({}))) as Raw;
  if (!res.ok || json.status === 'error') {
    throw new Error(json.message ?? `Permintaan data BPS gagal (${res.status})`);
  }
  return json;
}

const domain = () => env.domainCode || '7403';

/** Respons list BPS: data = [meta, records]. Mengembalikan records dan jumlah halaman. */
function parseList(json: Raw): { rows: Raw[]; pages: number } {
  if (json['data-availability'] !== 'available' || !Array.isArray(json.data)) return { rows: [], pages: 0 };
  const meta = (json.data[0] ?? {}) as Raw;
  return { rows: (json.data[1] ?? []) as Raw[], pages: Number(meta.pages ?? 1) };
}

async function listPage(model: string, page = 1, extra: Record<string, string | number> = {}) {
  return parseList(await request(`/list/model/${model}/domain/${domain()}`, { lang: 'ind', page, ...extra }));
}

async function listAll(model: string, extra: Record<string, string | number> = {}, maxPages = 10) {
  const first = await listPage(model, 1, extra);
  const rest = await Promise.all(
    Array.from({ length: Math.max(0, Math.min(first.pages, maxPages) - 1) }, (_, i) =>
      listPage(model, i + 2, extra),
    ),
  );
  return [first, ...rest].flatMap((p) => p.rows);
}

// ---------- Util pemetaan ----------

const PALETTE = ['#17588A', '#2B8CC8', '#6DB33F', '#E8893A', '#10446B', '#4FA3D9'];
const warna = (seed: string | number) => {
  const s = String(seed);
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return PALETTE[h % PALETTE.length];
};

const decode = (s: string) =>
  s
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');

const teks = (html: unknown, max = 220) => {
  const t = decode(String(html ?? '').replace(/<[^>]*>/g, ' ')).replace(/\s+/g, ' ').trim();
  return t.length > max ? `${t.slice(0, max).trimEnd()}…` : t;
};

const tanggal = (v: unknown) => String(v ?? '').slice(0, 10);

const urlOrUndef = (v: unknown) => (typeof v === 'string' && v.startsWith('http') ? v : undefined);

// ---------- Konten ----------

const mapPublikasi = (r: Raw): Publikasi => ({
  id: String(r.pub_id),
  judul: String(r.title ?? ''),
  tanggalRilis: tanggal(r.rl_date ?? r.sch_date),
  sampulUrl: urlOrUndef(r.cover),
  pdfUrl: urlOrUndef(r.pdf),
  warna: warna(r.pub_id),
});

const mapBrs = (r: Raw): Brs => ({
  id: String(r.brs_id),
  judul: String(r.title ?? ''),
  tanggal: tanggal(r.rl_date),
  ringkasan: teks(r.abstract),
});

const mapBerita = (r: Raw): Berita => ({
  id: String(r.news_id),
  judul: String(r.title ?? ''),
  tanggal: tanggal(r.rl_date),
  ringkasan: teks(r.news),
});

// Judul infografis BPS sering berakhiran "(1)2026-10-01": nomor urut + tanggal. Tanggal diambil dari sana.
const SUFIKS_INFOGRAFIS = /\s*\(\d+\)(\d{4}-\d{2}-\d{2})\s*$/;
const mapInfografis = (r: Raw): Infografis => {
  const judul = String(r.title ?? '');
  const m = judul.match(SUFIKS_INFOGRAFIS);
  return {
    id: String(r.inf_id),
    judul: judul.replace(SUFIKS_INFOGRAFIS, ''),
    tanggal: m?.[1] ?? '',
    gambarUrl: urlOrUndef(r.img),
    warna: warna(r.inf_id),
  };
};

const IKON_KATEGORI: Record<string, string> = {
  'Sosial dan Kependudukan': 'people',
  'Ekonomi dan Perdagangan': 'cash',
  'Pertanian dan Pertambangan': 'leaf',
  Ketenagakerjaan: 'briefcase',
};

async function getTabelKategori(): Promise<TabelKategori[]> {
  const [kategori, subjek] = await Promise.all([listAll('subcat'), listAll('subject')]);
  return kategori
    .map((k) => ({
      id: String(k.subcat_id),
      nama: String(k.title ?? ''),
      ikon: IKON_KATEGORI[String(k.title)] ?? 'stats-chart',
      subjek: subjek
        .filter((s) => s.subcat_id === k.subcat_id && String(s.title ?? '').trim() !== '')
        .map((s) => ({ id: String(s.sub_id), nama: String(s.title).trim() })),
    }))
    .filter((k) => k.nama && k.subjek.length > 0);
}

// ---------- Indikator (data dinamis) ----------
// Endpoint "indicators" BPS tidak mendukung level kabupaten, jadi indikator disusun dari variabel data dinamis.
// Spesifikasi di bawah dipilih lewat scripts/bps-explore.mjs. Indikator yang belum punya variabel di
// WebAPI Konawe (jumlah penduduk terbaru, TPT, NTP) sengaja tidak ditampilkan agar tidak memakai data palsu.

type Spec = {
  id: string;
  judul: string;
  varId: number;
  /** Id vertical variable baris yang diambil (mis. 4 = "Persentase penduduk miskin"). */
  vervar: number;
  /** Id derived variable (turvar); 0 = "Tidak ada". */
  turvar?: number;
  satuan: string;
  kategori: string;
  definisi: string;
  ikon: string;
  /** "bulanan": nilai per bulan (turtahun 1..12); "tahunan": satu nilai per tahun (turtahun 0). */
  periodik: 'tahunan' | 'bulanan';
};

const SPEC_INDIKATOR: Spec[] = [
  {
    id: 'ipm',
    judul: 'Indeks Pembangunan Manusia (IPM)',
    varId: 201,
    vervar: 1,
    satuan: 'Indeks',
    kategori: 'Sosial dan Kependudukan',
    definisi:
      'Ukuran capaian pembangunan manusia berbasis tiga dimensi dasar: umur panjang dan hidup sehat, pengetahuan, dan standar hidup layak.',
    ikon: 'ribbon',
    periodik: 'tahunan',
  },
  {
    id: 'kemiskinan',
    judul: 'Persentase Penduduk Miskin',
    varId: 170,
    vervar: 4,
    satuan: 'Persen',
    kategori: 'Sosial dan Kependudukan',
    definisi:
      'Persentase penduduk yang memiliki rata-rata pengeluaran per kapita per bulan di bawah Garis Kemiskinan.',
    ikon: 'heart',
    periodik: 'tahunan',
  },
  {
    id: 'pertumbuhan',
    judul: 'Laju Pertumbuhan Ekonomi',
    varId: 63,
    vervar: 18,
    satuan: 'Persen',
    kategori: 'Ekonomi dan Perdagangan',
    definisi: 'Laju pertumbuhan PDRB Kabupaten Konawe atas dasar harga konstan 2010 (total semua lapangan usaha).',
    ikon: 'trending-up',
    periodik: 'tahunan',
  },
  // TPT kabupaten tidak dipublikasikan di WebAPI; TPAK (Sakernas) tersedia per jenis kelamin (turvar 163/164).
  {
    id: 'tpak-l',
    judul: 'TPAK Laki-laki',
    varId: 235,
    vervar: 1,
    turvar: 163,
    satuan: 'Persen',
    kategori: 'Ketenagakerjaan',
    definisi: 'Tingkat Partisipasi Angkatan Kerja: persentase angkatan kerja terhadap penduduk usia kerja, laki-laki.',
    ikon: 'briefcase',
    periodik: 'tahunan',
  },
  {
    id: 'tpak-p',
    judul: 'TPAK Perempuan',
    varId: 235,
    vervar: 1,
    turvar: 164,
    satuan: 'Persen',
    kategori: 'Ketenagakerjaan',
    definisi: 'Tingkat Partisipasi Angkatan Kerja: persentase angkatan kerja terhadap penduduk usia kerja, perempuan.',
    ikon: 'briefcase',
    periodik: 'tahunan',
  },
  {
    id: 'inflasi',
    judul: 'Inflasi Bulanan (month to month)',
    varId: 196,
    vervar: 1,
    satuan: 'Persen',
    kategori: 'Harga',
    definisi: 'Perubahan Indeks Harga Konsumen (2022=100) Kabupaten Konawe, kelompok umum, dibanding bulan sebelumnya.',
    ikon: 'pricetag',
    periodik: 'bulanan',
  },
];

const BULAN = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
const TITIK_TREN = 6;

const formatAngka = (n: number, desimal: number) =>
  n.toLocaleString('id-ID', { minimumFractionDigits: desimal, maximumFractionDigits: desimal });

/** BPS membatasi parameter `th` maksimal 3 tahun per permintaan. */
const potong3 = <T,>(a: T[]) => {
  const out: T[][] = [];
  for (let i = 0; i < a.length; i += 3) out.push(a.slice(i, i + 3));
  return out;
};

async function muatIndikator(spec: Spec): Promise<Indikator | undefined> {
  const thJson = await request(`/list/model/th/domain/${domain()}/var/${spec.varId}`);
  const periode: { th_id: number; th: string }[] = Array.isArray(thJson.data) ? (thJson.data[1] ?? thJson.data) : [];
  // Ambil tahun terbaru; indikator bulanan butuh 2 tahun agar tren 6 bulan selalu terisi.
  const dipakai = [...periode].sort((a, b) => b.th_id - a.th_id).slice(0, spec.periodik === 'bulanan' ? 2 : 6);
  if (dipakai.length === 0) return undefined;

  const hasil = await Promise.all(
    potong3(dipakai.map((p) => p.th_id)).map((ids) =>
      request(`/list/model/data/domain/${domain()}/var/${spec.varId}/th/${ids.join(';')}`),
    ),
  );

  const nilaiPerThn = new Map<number, Raw>();
  let desimal = 2;
  for (const j of hasil) {
    desimal = Number(j.var?.[0]?.decimal ?? desimal) || desimal;
    for (const [kode, v] of Object.entries((j.datacontent ?? {}) as Raw)) {
      // Kode: vervar + var + turvar(0) + th + turth. Dicocokkan dari ujung kiri dengan awalan yang diketahui.
      const awalan = `${spec.vervar}${spec.varId}${spec.turvar ?? 0}`;
      if (!kode.startsWith(awalan) || typeof v !== 'number') continue;
      for (const p of dipakai) {
        const sisa = kode.slice(awalan.length);
        const thStr = String(p.th_id);
        if (!sisa.startsWith(thStr)) continue;
        const turth = Number(sisa.slice(thStr.length));
        const cur = nilaiPerThn.get(p.th_id) ?? {};
        cur[turth] = v;
        nilaiPerThn.set(p.th_id, cur);
        break;
      }
    }
  }

  const titik: (TrenPoint & { urut: number })[] = [];
  for (const p of dipakai) {
    const data = nilaiPerThn.get(p.th_id);
    if (!data) continue;
    if (spec.periodik === 'tahunan') {
      if (typeof data[0] === 'number') titik.push({ label: p.th, nilai: data[0], urut: p.th_id * 100 });
    } else {
      for (let b = 1; b <= 12; b++) {
        if (typeof data[b] === 'number') {
          titik.push({ label: `${BULAN[b - 1]} ${p.th.slice(2)}`, nilai: data[b], urut: p.th_id * 100 + b });
        }
      }
    }
  }
  titik.sort((a, b) => a.urut - b.urut);
  const tren = titik.slice(-TITIK_TREN).map(({ label, nilai }) => ({ label, nilai }));
  const akhir = tren[tren.length - 1];
  if (!akhir) return undefined;

  const labelAkhir = titik[titik.length - 1];
  const tahunAkhir = dipakai.find((p) => p.th_id === Math.floor(labelAkhir.urut / 100))?.th ?? '';
  return {
    id: spec.id,
    judul: spec.judul,
    nilai: formatAngka(akhir.nilai, desimal),
    satuan: spec.satuan,
    periode: spec.periodik === 'tahunan' ? akhir.label : `${BULAN_PENUH[labelAkhir.urut % 100 - 1]} ${tahunAkhir}`,
    kategori: spec.kategori,
    definisi: spec.definisi,
    tren,
    ikon: spec.ikon,
  };
}

const BULAN_PENUH = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
];

// ---------- Jumlah penduduk (SIMDASI / Kabupaten dalam Angka) ----------
// Variabel dinamis "Jumlah Penduduk" (var 35) berhenti di 2014, jadi pakai tabel SIMDASI 3.1.1
// (penduduk menurut kecamatan) dan ambil baris total Kab. Konawe (kode wilayah 7403000).

const SIMDASI = '/interoperabilitas/datasource/simdasi/id';
const WILAYAH = '7403000';
const SUBJEK_PENDUDUK = 519;
const KODE_TABEL_PENDUDUK = '3.1.1';

/** Angka format Indonesia ("267.139,0") jadi number. */
const angkaId = (s: string) => Number(s.replace(/\./g, '').replace(',', '.'));

async function muatPenduduk(): Promise<Indikator | undefined> {
  const daftar = await request(`${SIMDASI}/24/wilayah/${WILAYAH}/id_subjek/${SUBJEK_PENDUDUK}`);
  const tabel = ((daftar.data?.[1]?.data ?? []) as Raw[]).find((t) => t.kode_tabel === KODE_TABEL_PENDUDUK);
  if (!tabel) return undefined;
  const tahunTersedia = ([...(tabel.ketersediaan_tahun ?? [])] as number[]).sort((a, b) => a - b);
  const dipakai = tahunTersedia.slice(-TITIK_TREN);

  const titik = (
    await Promise.all(
      dipakai.map(async (tahun) => {
        const j = await request(`${SIMDASI}/25/wilayah/${WILAYAH}/tahun/${tahun}/id_tabel/${tabel.id_tabel}`);
        const d = j.data?.[1] as Raw | undefined;
        const kolom = Object.entries((d?.kolom ?? {}) as Raw).find(([, c]) => c.nama_variabel === 'Jumlah Penduduk');
        const baris = ((d?.data ?? []) as Raw[]).find((r) => String(r.kode_wilayah) === WILAYAH);
        const mentah = kolom && baris?.variables?.[kolom[0]]?.value;
        if (typeof mentah !== 'string') return undefined;
        let jiwa = angkaId(mentah);
        // Beberapa tahun dicatat dalam ribu jiwa ("267,1"), lainnya dalam jiwa. Penduduk Konawe > 100 ribu.
        if (jiwa < 10_000) jiwa *= 1000;
        return { label: String(tahun), nilai: Math.round(jiwa) };
      }),
    )
  ).filter((x): x is TrenPoint => x !== undefined);

  const akhir = titik[titik.length - 1];
  if (!akhir) return undefined;
  return {
    id: 'penduduk',
    judul: 'Jumlah Penduduk Kabupaten Konawe',
    nilai: formatAngka(akhir.nilai, 0),
    satuan: 'Jiwa',
    periode: akhir.label,
    kategori: 'Sosial dan Kependudukan',
    definisi: 'Banyaknya penduduk yang bertempat tinggal di wilayah Kabupaten Konawe (Kabupaten dalam Angka).',
    tren: titik,
    ikon: 'people',
  };
}

let cacheIndikator: Promise<Indikator[]> | undefined;
const getIndikator = () => {
  cacheIndikator ??= Promise.all([muatPenduduk(), ...SPEC_INDIKATOR.map((s) => muatIndikator(s))]).then(
    (r) => r.filter((x): x is Indikator => x !== undefined),
  );
  // Jangan simpan kegagalan: percobaan berikutnya (reload) harus mengulang.
  cacheIndikator.catch(() => {
    cacheIndikator = undefined;
  });
  return cacheIndikator;
};

// ---------- DataSource ----------

export const apiSource: DataSource = {
  nama: 'api',
  getIndikator,
  getIndikatorById: async (id) => (await getIndikator()).find((x) => x.id === id),
  getPublikasi: async () => (await listPage('publication')).rows.map(mapPublikasi),
  getTabelKategori,
  getInfografis: async () => (await listPage('infographic')).rows.map(mapInfografis),
  getBrs: async () => (await listPage('pressrelease')).rows.map(mapBrs),
  getBerita: async () => (await listPage('news')).rows.map(mapBerita),
  // Tidak tersedia di WebAPI BPS.
  getJadwalRilis: () => mockSource.getJadwalRilis(),
  getKontak: () => mockSource.getKontak(),
};
