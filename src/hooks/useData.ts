import { useCallback, useEffect, useState } from 'react';
import { dataSource } from '@/services';
import type { DataSource } from '@/services';

export type AsyncState<T> = {
  data: T | undefined;
  loading: boolean;
  error: string | undefined;
  reload: () => void;
};

/** Pemuat data generik: semua layar membaca lewat sini, bukan langsung dari sumber data. */
export function useAsync<T>(loader: (source: DataSource) => Promise<T>, deps: unknown[] = []): AsyncState<T> {
  const [data, setData] = useState<T>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();
  const [tick, setTick] = useState(0);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const stableLoader = useCallback(loader, deps);

  useEffect(() => {
    let batal = false;
    setLoading(true);
    setError(undefined);
    stableLoader(dataSource)
      .then((hasil) => {
        if (!batal) setData(hasil);
      })
      .catch((e: unknown) => {
        if (!batal) setError(e instanceof Error ? e.message : 'Terjadi kesalahan');
      })
      .finally(() => {
        if (!batal) setLoading(false);
      });
    return () => {
      batal = true;
    };
  }, [stableLoader, tick]);

  return { data, loading, error, reload: () => setTick((t) => t + 1) };
}

export const useIndikator = () => useAsync((s) => s.getIndikator());
export const useIndikatorDetail = (id: string) => useAsync((s) => s.getIndikatorById(id), [id]);
export const usePublikasi = () => useAsync((s) => s.getPublikasi());
export const useTabelKategori = () => useAsync((s) => s.getTabelKategori());
export const useInfografis = () => useAsync((s) => s.getInfografis());
export const useBrs = () => useAsync((s) => s.getBrs());
export const useBerita = () => useAsync((s) => s.getBerita());
export const useJadwalRilis = () => useAsync((s) => s.getJadwalRilis());
export const useKontak = () => useAsync((s) => s.getKontak());
