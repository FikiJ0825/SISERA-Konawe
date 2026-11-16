import * as mock from '@/data/mock';
import type { DataSource } from './dataSource';

// Jeda kecil agar state loading terlihat dan perilakunya mirip pemanggilan jaringan.
const tunda = <T>(nilai: T, ms = 250) => new Promise<T>((resolve) => setTimeout(() => resolve(nilai), ms));

export const mockSource: DataSource = {
  nama: 'mock',
  getIndikator: () => tunda(mock.indikator),
  getIndikatorById: (id) => tunda(mock.indikator.find((x) => x.id === id)),
  getPublikasi: () => tunda(mock.publikasi),
  getTabelKategori: () => tunda(mock.tabelKategori),
  getInfografis: () => tunda(mock.infografis),
  getBrs: () => tunda(mock.brs),
  getBerita: () => tunda(mock.berita),
  getJadwalRilis: () => tunda(mock.jadwalRilis),
  getKontak: () => tunda(mock.kontak),
};
