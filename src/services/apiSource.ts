import { env } from '@/config/env';
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
import type { DataSource } from './dataSource';

/**
 * ============================================================
 *  RUANG API BPS KABUPATEN KONAWE  (belum dipasang)
 * ============================================================
 * Cara pasang nanti:
 *  1. Siapkan proxy (mis. Supabase Edge Function) yang menyimpan API key WebAPI BPS dan
 *     meneruskan permintaan ke https://webapi.bps.go.id (domain Kab. Konawe).
 *  2. Isi EXPO_PUBLIC_API_BASE_URL dengan URL proxy itu, dan set EXPO_PUBLIC_DATA_SOURCE=api.
 *  3. Pada tiap fungsi di bawah, ganti ENDPOINT dan lengkapi fungsi map* agar respons BPS
 *     dipetakan ke tipe di src/types. Layar tidak perlu diubah.
 *
 * Padanan model WebAPI BPS (cek dokumentasi untuk nama persis): indikator strategis,
 * tabel statis, publikasi, infografis, berita resmi statistik (BRS), berita.
 */

export class ApiNotConfiguredError extends Error {
  constructor() {
    super(
      'Sumber data "api" belum dikonfigurasi. Isi EXPO_PUBLIC_API_BASE_URL atau ganti EXPO_PUBLIC_DATA_SOURCE ke "mock".',
    );
    this.name = 'ApiNotConfiguredError';
  }
}

async function request<T>(path: string, params: Record<string, string> = {}): Promise<T> {
  if (!env.apiBaseUrl) throw new ApiNotConfiguredError();
  const query = new URLSearchParams({ domain: env.domainCode, ...params }).toString();
  const res = await fetch(`${env.apiBaseUrl}${path}?${query}`);
  if (!res.ok) throw new Error(`Permintaan gagal (${res.status}) untuk ${path}`);
  return (await res.json()) as T;
}

// TODO: tulis pemetaan respons BPS -> tipe UI. Sementara respons dianggap sudah berbentuk tipe UI.
const mapIndikator = (data: unknown) => data as Indikator[];
const mapPublikasi = (data: unknown) => data as Publikasi[];
const mapTabel = (data: unknown) => data as TabelKategori[];
const mapInfografis = (data: unknown) => data as Infografis[];
const mapBrs = (data: unknown) => data as Brs[];
const mapBerita = (data: unknown) => data as Berita[];
const mapJadwal = (data: unknown) => data as JadwalRilis[];
const mapKontak = (data: unknown) => data as Kontak;

export const apiSource: DataSource = {
  nama: 'api',
  getIndikator: async () => mapIndikator(await request('/indikator')),
  getIndikatorById: async (id) => mapIndikator(await request('/indikator')).find((x) => x.id === id),
  getPublikasi: async () => mapPublikasi(await request('/publikasi')),
  getTabelKategori: async () => mapTabel(await request('/tabel')),
  getInfografis: async () => mapInfografis(await request('/infografis')),
  getBrs: async () => mapBrs(await request('/brs')),
  getBerita: async () => mapBerita(await request('/berita')),
  getJadwalRilis: async () => mapJadwal(await request('/jadwal-rilis')),
  getKontak: async () => mapKontak(await request('/kontak')),
};
