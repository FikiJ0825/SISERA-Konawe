import { View } from 'react-native';
import { InfografisCard } from '@/components/cards';
import { Screen, ScreenHeader, StateView } from '@/components/ui';
import { useInfografis } from '@/hooks/useData';

export default function Infografis() {
  const { data, loading, error, reload } = useInfografis();
  return (
    <Screen header={<ScreenHeader title="Infografis" subtitle="Data dalam bentuk visual" onBack />}>
      <View className="px-5 pt-5">
        <StateView loading={loading} error={error} empty={!loading && !error && !data?.length} onRetry={reload} />
        <View className="flex-row flex-wrap justify-between">
          {(data ?? []).map((i) => (
            <View key={i.id} className="mb-4 w-[48%]">
              <InfografisCard item={i} fluid />
            </View>
          ))}
        </View>
      </View>
    </Screen>
  );
}
