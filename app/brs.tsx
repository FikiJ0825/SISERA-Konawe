import { ListPage } from '@/components/ListPage';
import { useBrs } from '@/hooks/useData';

export default function Brs() {
  const { data, loading, error, reload } = useBrs();
  return (
    <ListPage
      title="Berita Resmi Statistik"
      subtitle="Rilis resmi BPS Kabupaten Konawe"
      icon="megaphone"
      entries={data?.map((b) => ({ id: b.id, judul: b.judul, tanggal: b.tanggal }))}
      loading={loading}
      error={error}
      reload={reload}
    />
  );
}
