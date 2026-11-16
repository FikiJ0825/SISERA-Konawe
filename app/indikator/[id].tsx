import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { ChartLegend, TrendChart } from '@/components/TrendChart';
import { Card, Screen, ScreenHeader, StateView, asIcon } from '@/components/ui';
import { useBookmarks } from '@/hooks/useBookmarks';
import { useIndikatorDetail } from '@/hooks/useData';
import { colors } from '@/theme';

export default function IndikatorDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data, loading, error, reload } = useIndikatorDetail(String(id));
  const { isBookmarked, toggle } = useBookmarks();
  const saved = data ? isBookmarked(data.id) : false;

  return (
    <Screen
      header={
        <ScreenHeader
          title={data?.judul ?? 'Indikator'}
          subtitle={data?.kategori}
          onBack
          right={
            data ? (
              <Pressable onPress={() => toggle(data.id)} hitSlop={8} className="ml-3 h-10 w-10 items-center justify-center rounded-full bg-white/15" accessibilityLabel="Simpan indikator">
                <Ionicons name={saved ? 'bookmark' : 'bookmark-outline'} size={20} color={saved ? colors.orange : '#fff'} />
              </Pressable>
            ) : null
          }
        />
      }
    >
      <View className="px-5 pt-5">
        <StateView loading={loading} error={error} empty={!loading && !error && !data} onRetry={reload} />
        {data ? (
          <>
            <Card className="p-5">
              <View className="flex-row items-center">
                <View className="h-12 w-12 items-center justify-center rounded-2xl bg-primary-700">
                  <Ionicons name={asIcon(data.ikon, 'stats-chart')} size={23} color="#fff" />
                </View>
                <View className="ml-3.5">
                  <Text className="font-medium text-[12px] text-muted">Nilai terbaru · {data.periode}</Text>
                  <View className="flex-row items-baseline">
                    <Text className="font-extrabold text-[30px] text-primary-700">{data.nilai}</Text>
                    <Text className="ml-2 font-semibold text-[13px] text-muted">{data.satuan}</Text>
                  </View>
                </View>
              </View>
            </Card>

            <Card className="mt-4 p-5">
              <Text className="font-extrabold text-[16px] text-ink">Tren</Text>
              <ChartLegend first={data.tren[0]} last={data.tren[data.tren.length - 1]} />
              <View className="mt-2">
                <TrendChart data={data.tren} />
              </View>
            </Card>

            <Card className="mt-4 p-5">
              <Text className="font-extrabold text-[16px] text-ink">Definisi</Text>
              <Text className="mt-2 font-regular text-[13.5px] leading-[21px] text-muted">{data.definisi}</Text>
            </Card>
          </>
        ) : null}
      </View>
    </Screen>
  );
}
