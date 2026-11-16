import { useMemo, useState } from 'react';
import { View } from 'react-native';
import { PublicationRow } from '@/components/cards';
import { Screen, ScreenHeader, SearchBar, StateView } from '@/components/ui';
import { usePublikasi } from '@/hooks/useData';

export default function Publikasi() {
  const { data, loading, error, reload } = usePublikasi();
  const [q, setQ] = useState('');
  const list = useMemo(
    () => (data ?? []).filter((p) => p.judul.toLowerCase().includes(q.trim().toLowerCase())),
    [data, q],
  );

  return (
    <Screen
      header={
        <ScreenHeader title="Publikasi" subtitle="Terbitan resmi BPS Kabupaten Konawe">
          <View className="mt-4">
            <SearchBar value={q} onChangeText={setQ} placeholder="Cari publikasi..." />
          </View>
        </ScreenHeader>
      }
    >
      <View className="pt-5">
        <StateView loading={loading} error={error} empty={!loading && !error && list.length === 0} onRetry={reload} />
        {list.map((p) => (
          <PublicationRow key={p.id} item={p} />
        ))}
      </View>
    </Screen>
  );
}
