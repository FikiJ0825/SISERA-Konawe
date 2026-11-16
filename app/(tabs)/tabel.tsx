import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Card, Screen, ScreenHeader, StateView, asIcon } from '@/components/ui';
import { useTabelKategori } from '@/hooks/useData';
import { colors } from '@/theme';

export default function Tabel() {
  const { data, loading, error, reload } = useTabelKategori();
  const [open, setOpen] = useState<string | undefined>('sosial');

  return (
    <Screen header={<ScreenHeader title="Tabel Statistik" subtitle="Pilih kategori lalu subjek" />}>
      <View className="pt-5">
        <StateView loading={loading} error={error} empty={!loading && !error && !data?.length} onRetry={reload} />
        {(data ?? []).map((k) => {
          const isOpen = open === k.id;
          return (
            <Card key={k.id} className="mx-5 mb-3 overflow-hidden">
              <Pressable onPress={() => setOpen(isOpen ? undefined : k.id)} className="flex-row items-center p-4">
                <View className="h-11 w-11 items-center justify-center rounded-2xl bg-primary-100">
                  <Ionicons name={asIcon(k.ikon, 'grid')} size={21} color={colors.primary700} />
                </View>
                <View className="ml-3.5 flex-1">
                  <Text className="font-bold text-[14.5px] text-ink">{k.nama}</Text>
                  <Text className="font-medium text-[12px] text-muted">{k.subjek.length} subjek</Text>
                </View>
                <Ionicons name={isOpen ? 'chevron-up' : 'chevron-down'} size={20} color={colors.muted} />
              </Pressable>
              {isOpen ? (
                <View className="border-t border-line px-4 pb-2 pt-1">
                  {k.subjek.map((s) => (
                    <Pressable key={s.id} className="flex-row items-center justify-between py-3 active:opacity-60">
                      <Text className="font-semibold text-[13.5px] text-ink">{s.nama}</Text>
                      <Ionicons name="chevron-forward" size={17} color={colors.muted} />
                    </Pressable>
                  ))}
                </View>
              ) : null}
            </Card>
          );
        })}
      </View>
    </Screen>
  );
}
