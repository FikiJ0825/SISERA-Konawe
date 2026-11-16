import { Pressable, Text, View } from 'react-native';
import { useState } from 'react';
import { IndicatorRow } from '@/components/cards';
import { Screen, ScreenHeader, StateView } from '@/components/ui';
import { useBookmarks } from '@/hooks/useBookmarks';
import { useIndikator } from '@/hooks/useData';

export default function IndikatorStrategis() {
  const { data, loading, error, reload } = useIndikator();
  const { ids } = useBookmarks();
  const [onlySaved, setOnlySaved] = useState(false);
  const list = (data ?? []).filter((x) => !onlySaved || ids.includes(x.id));

  return (
    <Screen
      header={
        <ScreenHeader title="Indikator Strategis" subtitle="Ukuran utama kondisi Kabupaten Konawe">
          <View className="mt-4 flex-row rounded-full bg-white/15 p-1">
            {[
              { k: false, t: 'Semua' },
              { k: true, t: `Tersimpan (${ids.length})` },
            ].map((o) => (
              <Pressable key={o.t} onPress={() => setOnlySaved(o.k)} className={`h-10 flex-1 items-center justify-center rounded-full ${onlySaved === o.k ? 'bg-white' : ''}`}>
                <Text className={`font-bold text-[13px] ${onlySaved === o.k ? 'text-primary-700' : 'text-white'}`}>{o.t}</Text>
              </Pressable>
            ))}
          </View>
        </ScreenHeader>
      }
    >
      <View className="pt-5">
        <StateView loading={loading} error={error} empty={!loading && !error && list.length === 0} onRetry={reload} />
        {list.map((it) => (
          <IndicatorRow key={it.id} item={it} />
        ))}
      </View>
    </Screen>
  );
}
