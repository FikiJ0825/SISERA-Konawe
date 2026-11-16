import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';
import { Card, Screen, ScreenHeader } from '@/components/ui';
import { colors } from '@/theme';

const CONTOH = [
  { id: '1', judul: 'Rilis baru: Inflasi Oktober 2025', waktu: '2 jam lalu' },
  { id: '2', judul: 'Publikasi baru tersedia untuk diunduh', waktu: 'Kemarin' },
  { id: '3', judul: 'Selamat datang di SI LAIKA', waktu: '3 hari lalu' },
];

export default function Notifikasi() {
  return (
    <Screen header={<ScreenHeader title="Notifikasi" subtitle="Contoh tampilan, belum terhubung" onBack />}>
      <View className="pt-5">
        {CONTOH.map((n) => (
          <Card key={n.id} className="mx-5 mb-3 flex-row items-center p-4">
            <View className="h-11 w-11 items-center justify-center rounded-2xl bg-orange-soft">
              <Ionicons name="notifications" size={20} color={colors.orange} />
            </View>
            <View className="ml-3.5 flex-1">
              <Text className="font-bold text-[13.5px] leading-5 text-ink">{n.judul}</Text>
              <Text className="mt-0.5 font-medium text-[12px] text-muted">{n.waktu}</Text>
            </View>
          </Card>
        ))}
      </View>
    </Screen>
  );
}
