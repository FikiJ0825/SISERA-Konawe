import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { Linking, Pressable, Text, View } from 'react-native';
import { Card, Screen, ScreenHeader } from '@/components/ui';
import { colors } from '@/theme';

const HALAMAN: Record<string, { judul: string; isi: string }> = {
  konsultasi: { judul: 'Konsultasi Statistik', isi: 'Layanan konsultasi data dan statistik dengan BPS Kabupaten Konawe. Bentuk layanan (mis. tautan WhatsApp) menyusul setelah dikonfirmasi.' },
  syantik: { judul: 'Syantik', isi: 'Tautan ke sistem Syantik BPS. Tujuan tautan menyusul setelah dikonfirmasi.' },
  ppid: { judul: 'PPID', isi: 'Informasi Pejabat Pengelola Informasi dan Dokumentasi BPS Kabupaten Konawe. Isi menyusul dari sumber resmi.' },
  survei: { judul: 'Survei Kepuasan Pelanggan', isi: 'Formulir survei kepuasan pelanggan layanan statistik. Isi menyusul.' },
  'standar-pelayanan': { judul: 'Standar dan Maklumat Pelayanan', isi: 'Dokumen standar dan maklumat pelayanan publik. Isi menyusul dari sumber resmi.' },
  'hasil-survei': { judul: 'Hasil Survei Kepuasan Masyarakat', isi: 'Ringkasan hasil survei kepuasan masyarakat. Isi menyusul dari sumber resmi.' },
};

export default function Halaman() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const h = HALAMAN[String(slug)] ?? { judul: 'Halaman', isi: 'Halaman tidak ditemukan.' };
  return (
    <Screen header={<ScreenHeader title={h.judul} onBack />}>
      <View className="px-5 pt-5">
        <Card className="p-5">
          <View className="h-12 w-12 items-center justify-center rounded-2xl bg-primary-100">
            <Ionicons name="construct-outline" size={23} color={colors.primary700} />
          </View>
          <Text className="mt-4 font-regular text-[14px] leading-[22px] text-muted">{h.isi}</Text>
          <Pressable onPress={() => Linking.openURL('https://konawekab.bps.go.id')} className="mt-5 h-11 flex-row items-center justify-center rounded-2xl bg-primary-700">
            <Ionicons name="globe-outline" size={18} color="#fff" />
            <Text className="ml-2 font-bold text-[13.5px] text-white">Buka konawekab.bps.go.id</Text>
          </Pressable>
        </Card>
      </View>
    </Screen>
  );
}
