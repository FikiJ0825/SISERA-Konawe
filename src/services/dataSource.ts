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

/** Kontrak sumber data. Implementasi: mockSource (data contoh) dan apiSource (API BPS Konawe). */
export interface DataSource {
  readonly nama: 'mock' | 'api';
  getIndikator(): Promise<Indikator[]>;
  getIndikatorById(id: string): Promise<Indikator | undefined>;
  getPublikasi(): Promise<Publikasi[]>;
  getTabelKategori(): Promise<TabelKategori[]>;
  getInfografis(): Promise<Infografis[]>;
  getBrs(): Promise<Brs[]>;
  getBerita(): Promise<Berita[]>;
  getJadwalRilis(): Promise<JadwalRilis[]>;
  getKontak(): Promise<Kontak>;
}
