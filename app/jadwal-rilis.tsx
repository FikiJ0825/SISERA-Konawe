import { ListPage } from '@/components/ListPage';
import { useJadwalRilis } from '@/hooks/useData';

export default function JadwalRilis() {
  const { data, loading, error, reload } = useJadwalRilis();
  return (
    <ListPage
      title="Jadwal Rilis"
      subtitle="Jadwal publikasi dan berita resmi"
      icon="calendar"
      entries={data?.map((j) => ({ id: j.id, judul: j.judul, tanggal: j.tanggal, keterangan: j.jenis }))}
      loading={loading}
      error={error}
      reload={reload}
    />
  );
}
