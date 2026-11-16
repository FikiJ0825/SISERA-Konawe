import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router, type Href } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { Card, Screen, ScreenHeader, type IconName } from '@/components/ui';
import { env } from '@/config/env';
import { colors } from '@/theme';

type Item = { label: string; icon: IconName; href: Href; tint: string; bg: string };

const GROUPS: { title: string; items: Item[] }[] = [
  {
    title: 'Konten',
    items: [
      { label: 'Infografis', icon: 'image', href: '/infografis', tint: colors.primary600, bg: colors.primary100 },
      { label: 'Berita Resmi Statistik (BRS)', icon: 'megaphone', href: '/brs', tint: colors.orange, bg: colors.orangeSoft },
      { label: 'Berita', icon: 'newspaper', href: '/berita', tint: colors.orange, bg: colors.orangeSoft },
      { label: 'Jadwal Rilis', icon: 'calendar', href: '/jadwal-rilis', tint: '#4E8F26', bg: colors.greenSoft },
    ],
  },
  {
    title: 'Layanan',
    items: [
      { label: 'Konsultasi Statistik', icon: 'chatbubbles', href: '/halaman/konsultasi', tint: colors.primary600, bg: colors.primary100 },
      { label: 'Syantik', icon: 'information-circle', href: '/halaman/syantik', tint: colors.orange, bg: colors.orangeSoft },
      { label: 'PPID', icon: 'shield-checkmark', href: '/halaman/ppid', tint: '#4E8F26', bg: colors.greenSoft },
      { label: 'Survei Kepuasan Pelanggan', icon: 'happy', href: '/halaman/survei', tint: colors.primary600, bg: colors.primary100 },
      { label: 'Standar dan Maklumat Pelayanan', icon: 'ribbon', href: '/halaman/standar-pelayanan', tint: colors.orange, bg: colors.orangeSoft },
      { label: 'Hasil Survei Kepuasan Masyarakat', icon: 'bar-chart', href: '/halaman/hasil-survei', tint: '#4E8F26', bg: colors.greenSoft },
    ],
  },
];

export default function Lainnya() {
  return (
    <Screen header={<ScreenHeader title="Lainnya" subtitle="Menu dan layanan" />}>
      <View className="px-5 pt-5">
        {GROUPS.map((g) => (
          <View key={g.title} className="mb-5">
            <Text className="mb-2.5 font-extrabold text-[13px] uppercase tracking-wider text-muted">{g.title}</Text>
            <Card className="overflow-hidden">
              {g.items.map((it, i) => (
                <Pressable key={it.label} onPress={() => router.push(it.href)} className={`flex-row items-center px-4 py-3.5 active:bg-surface ${i > 0 ? 'border-t border-line' : ''}`}>
                  <View className="h-10 w-10 items-center justify-center rounded-xl" style={{ backgroundColor: it.bg }}>
                    <Ionicons name={it.icon} size={19} color={it.tint} />
                  </View>
                  <Text className="ml-3.5 flex-1 font-semibold text-[14px] text-ink">{it.label}</Text>
                  <Ionicons name="chevron-forward" size={18} color={colors.muted} />
                </Pressable>
              ))}
            </Card>
          </View>
        ))}
        <View className="items-center py-4">
          <Image source={require('../../assets/images/logo-silaika.png')} style={{ width: 54, height: 49 }} contentFit="contain" />
          <Text className="mt-2.5 font-extrabold text-[15px] text-primary-700">{env.namaApp}</Text>
          <Text className="mt-0.5 text-center font-medium text-[11.5px] text-muted">Sistem Informasi dan Layanan Statistik{'\n'}Konawe Terintegrasi · v1.0.0</Text>
        </View>
      </View>
    </Screen>
  );
}
