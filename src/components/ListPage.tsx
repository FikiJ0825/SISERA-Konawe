import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';
import { Card, Screen, ScreenHeader, StateView, formatTanggal, type IconName } from '@/components/ui';
import { colors } from '@/theme';

export type ListEntry = { id: string; judul: string; tanggal?: string; keterangan?: string };

/** Halaman daftar sederhana (BRS, Berita, Jadwal Rilis, dst.) dengan header dan state data. */
export function ListPage({
  title,
  subtitle,
  icon,
  entries,
  loading,
  error,
  reload,
}: {
  title: string;
  subtitle?: string;
  icon: IconName;
  entries: ListEntry[] | undefined;
  loading: boolean;
  error?: string;
  reload: () => void;
}) {
  return (
    <Screen header={<ScreenHeader title={title} subtitle={subtitle} onBack />}>
      <View className="pt-5">
        <StateView loading={loading} error={error} empty={!loading && !error && !entries?.length} onRetry={reload} />
        {(entries ?? []).map((e) => (
          <Card key={e.id} className="mx-5 mb-3 flex-row items-center p-4">
            <View className="h-11 w-11 items-center justify-center rounded-2xl bg-primary-100">
              <Ionicons name={icon} size={20} color={colors.primary700} />
            </View>
            <View className="ml-3.5 flex-1">
              <Text className="font-bold text-[13.5px] leading-5 text-ink">{e.judul}</Text>
              {e.keterangan ? <Text className="mt-0.5 font-medium text-[12px] text-muted">{e.keterangan}</Text> : null}
              {e.tanggal ? <Text className="mt-1 font-medium text-[12px] text-primary-600">{formatTanggal(e.tanggal)}</Text> : null}
            </View>
          </Card>
        ))}
      </View>
    </Screen>
  );
}
