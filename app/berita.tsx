import { ListPage } from '@/components/ListPage';
import { useBerita } from '@/hooks/useData';

export default function Berita() {
  const { data, loading, error, reload } = useBerita();
  return (
    <ListPage
      title="Berita"
      subtitle="Kabar terbaru BPS Kabupaten Konawe"
      icon="newspaper"
      entries={data?.map((b) => ({ id: b.id, judul: b.judul, tanggal: b.tanggal, keterangan: b.ringkasan }))}
      loading={loading}
      error={error}
      reload={reload}
    />
  );
}
