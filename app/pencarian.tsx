import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Card, Screen, ScreenHeader, SearchBar, StateView } from '@/components/ui';
import { useBerita, useBrs, useIndikator, usePublikasi } from '@/hooks/useData';
import { colors } from '@/theme';

type Hasil = { key: string; judul: string; jenis: string; onPress?: () => void };

export default function Pencarian() {
  const [q, setQ] = useState('');
  const indikator = useIndikator();
  const publikasi = usePublikasi();
  const brs = useBrs();
  const berita = useBerita();
  const loading = indikator.loading || publikasi.loading || brs.loading || berita.loading;

  const hasil = useMemo<Hasil[]>(() => {
    const kata = q.trim().toLowerCase();
    if (!kata) return [];
    const semua: Hasil[] = [
      ...(indikator.data ?? []).map((x) => ({
        key: `i-${x.id}`,
        judul: x.judul,
        jenis: 'Indikator',
        onPress: () => router.push({ pathname: '/indikator/[id]', params: { id: x.id } }),
      })),
      ...(publikasi.data ?? []).map((x) => ({ key: `p-${x.id}`, judul: x.judul, jenis: 'Publikasi' })),
      ...(brs.data ?? []).map((x) => ({ key: `b-${x.id}`, judul: x.judul, jenis: 'BRS' })),
      ...(berita.data ?? []).map((x) => ({ key: `n-${x.id}`, judul: x.judul, jenis: 'Berita' })),
    ];
    return semua.filter((h) => h.judul.toLowerCase().includes(kata));
  }, [q, indikator.data, publikasi.data, brs.data, berita.data]);

  return (
    <Screen
      header={
        <ScreenHeader title="Pencarian" subtitle="Cari indikator, publikasi, BRS, dan berita" onBack>
          <View className="mt-4">
            <SearchBar autoFocus value={q} onChangeText={setQ} placeholder="Ketik kata kunci..." />
          </View>
        </ScreenHeader>
      }
    >
      <View className="pt-5">
        {q.trim() === '' ? (
          <View className="items-center px-10 py-12">
            <Ionicons name="search-outline" size={36} color={colors.muted} />
            <Text className="mt-3 text-center font-medium text-[13px] text-muted">Mulai mengetik untuk mencari data.</Text>
          </View>
        ) : (
          <StateView loading={loading} empty={!loading && hasil.length === 0} />
        )}
        {hasil.map((h) => (
          <Pressable key={h.key} onPress={h.onPress}>
            <Card className="mx-5 mb-3 p-4">
              <Text className="font-bold text-[11.5px] uppercase tracking-wider text-primary-600">{h.jenis}</Text>
              <Text className="mt-1 font-bold text-[14px] leading-5 text-ink">{h.judul}</Text>
            </Card>
          </Pressable>
        ))}
      </View>
    </Screen>
  );
}
