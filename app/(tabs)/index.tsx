import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router, type Href } from 'expo-router';
import { useState } from 'react';
import { Linking, Pressable, ScrollView, Text, View } from 'react-native';
import { IndicatorCard, InfografisCard, PublicationRow } from '@/components/cards';
import { Card, HeaderDecor, SearchBar, SectionHeader, ShortcutTile, StateView, TAB_BAR_SPACE, type IconName } from '@/components/ui';
import { env } from '@/config/env';
import { useBrs, useInfografis, useIndikator, useKontak, usePublikasi, useTabelKategori } from '@/hooks/useData';
import { colors } from '@/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { formatTanggal } from '@/components/ui';

const SHORTCUTS: { label: string; icon: IconName; href: Href; tint: number }[] = [
  { label: 'Publikasi', icon: 'document-text', href: '/publikasi', tint: 2 },
  { label: 'Tabel', icon: 'grid', href: '/tabel', tint: 0 },
  { label: 'Infografis', icon: 'image', href: '/infografis', tint: 0 },
  { label: 'BRS', icon: 'megaphone', href: '/brs', tint: 1 },
  { label: 'Berita', icon: 'newspaper', href: '/berita', tint: 1 },
  { label: 'Jadwal Rilis', icon: 'calendar', href: '/jadwal-rilis', tint: 2 },
  { label: 'Konsultasi', icon: 'chatbubbles', href: '/halaman/konsultasi', tint: 0 },
  { label: 'Syantik', icon: 'information-circle', href: '/halaman/syantik', tint: 1 },
];

const INFO_TABS = ['Publikasi', 'Tabel', 'BRS'] as const;

export default function Beranda() {
  const insets = useSafeAreaInsets();
  const indikator = useIndikator();
  const publikasi = usePublikasi();
  const tabel = useTabelKategori();
  const brs = useBrs();
  const infografis = useInfografis();
  const kontak = useKontak();
  const [tab, setTab] = useState<(typeof INFO_TABS)[number]>('Publikasi');

  return (
    <ScrollView className="flex-1 bg-surface" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: TAB_BAR_SPACE }}>
      {/* Hero */}
      <View className="overflow-hidden rounded-b-[36px] bg-primary-700 px-5 pb-7" style={{ paddingTop: insets.top + 14 }}>
        <HeaderDecor />
        <View className="flex-row items-center">
          <View className="h-12 w-12 items-center justify-center rounded-2xl bg-white">
            <Image source={require('../../assets/images/logo-bps.png')} style={{ width: 34, height: 28 }} contentFit="contain" />
          </View>
          <View className="ml-3 flex-1">
            <Text className="font-medium text-[12.5px] text-primary-200">Selamat datang di</Text>
            <Text className="font-extrabold text-[19px] text-white">{env.namaApp}</Text>
          </View>
          <Pressable onPress={() => router.push('/notifikasi')} hitSlop={8} className="h-11 w-11 items-center justify-center rounded-full bg-white/15" accessibilityLabel="Notifikasi">
            <Ionicons name="notifications-outline" size={22} color="#fff" />
            <View className="absolute right-2.5 top-2.5 h-2.5 w-2.5 rounded-full border-2 border-primary-700 bg-orange" />
          </Pressable>
        </View>

        <Text className="mt-6 font-extrabold text-[27px] leading-[34px] text-white">Data Konawe{'\n'}dalam genggaman</Text>
        <Text className="mt-1.5 font-medium text-[13px] text-primary-200">Sistem Informasi dan Layanan Statistik Konawe Terintegrasi</Text>

        <View className="mt-5 flex-row items-center">
          <SearchBar onPress={() => router.push('/pencarian')} />
          <Pressable onPress={() => router.push('/pencarian')} className="ml-3 h-12 w-12 items-center justify-center rounded-2xl bg-orange" accessibilityLabel="Filter">
            <Ionicons name="options" size={21} color="#fff" />
          </Pressable>
        </View>

        <View className="mt-4 flex-row items-center self-start rounded-full bg-white/15 py-1.5 pl-2.5 pr-3.5">
          <Ionicons name="location" size={14} color="#fff" />
          <Text className="ml-1.5 font-semibold text-[12px] text-white">Wilayah: {env.namaWilayah}</Text>
        </View>
        {env.dataSource === 'mock' ? (
          <Text className="mt-3 font-medium text-[11px] text-primary-200">Mode data contoh · bukan data resmi</Text>
        ) : null}
      </View>

      {/* Indikator strategis */}
      <SectionHeader title="Indikator Strategis" onAction={() => router.push('/indikator')} />
      {indikator.loading || indikator.error ? (
        <StateView loading={indikator.loading} error={indikator.error} onRetry={indikator.reload} />
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 14, gap: 14 }} decelerationRate="fast" snapToInterval={250}>
          {(indikator.data ?? []).slice(0, 6).map((it, i) => (
            <IndicatorCard key={it.id} item={it} dark={i % 2 === 0} />
          ))}
        </ScrollView>
      )}

      {/* Pintasan */}
      <View className="mt-3 px-3.5">
        <Card className="flex-row flex-wrap gap-y-4 px-1.5 py-5">
          {SHORTCUTS.map((s) => (
            <ShortcutTile key={s.label} label={s.label} icon={s.icon} tint={s.tint} onPress={() => router.push(s.href)} />
          ))}
        </Card>
      </View>

      {/* Informasi terbaru */}
      <SectionHeader title="Informasi Terbaru" />
      <View className="mx-5 mb-4 flex-row rounded-full bg-primary-100 p-1">
        {INFO_TABS.map((t) => (
          <Pressable key={t} onPress={() => setTab(t)} className={`h-10 flex-1 items-center justify-center rounded-full ${tab === t ? 'bg-primary-700' : ''}`}>
            <Text className={`font-bold text-[13px] ${tab === t ? 'text-white' : 'text-primary-700'}`}>{t}</Text>
          </Pressable>
        ))}
      </View>
      {tab === 'Publikasi' ? (
        publikasi.loading ? <StateView loading /> : (publikasi.data ?? []).slice(0, 3).map((p) => <PublicationRow key={p.id} item={p} />)
      ) : null}
      {tab === 'Tabel'
        ? (tabel.data ?? []).slice(0, 3).map((k) => (
            <Card key={k.id} className="mx-5 mb-3 flex-row items-center p-4">
              <View className="h-11 w-11 items-center justify-center rounded-2xl bg-primary-100">
                <Ionicons name="grid" size={20} color={colors.primary700} />
              </View>
              <View className="ml-3.5 flex-1">
                <Text className="font-bold text-[14px] text-ink">{k.nama}</Text>
                <Text className="font-medium text-[12px] text-muted">{k.subjek.length} subjek</Text>
              </View>
            </Card>
          ))
        : null}
      {tab === 'BRS'
        ? (brs.data ?? []).slice(0, 3).map((b) => (
            <Card key={b.id} className="mx-5 mb-3 flex-row items-center p-4">
              <View className="h-11 w-11 items-center justify-center rounded-2xl bg-orange-soft">
                <Ionicons name="megaphone" size={20} color={colors.orange} />
              </View>
              <View className="ml-3.5 flex-1">
                <Text className="font-bold text-[13.5px] leading-5 text-ink" numberOfLines={2}>{b.judul}</Text>
                <Text className="font-medium text-[12px] text-muted">{formatTanggal(b.tanggal)}</Text>
              </View>
            </Card>
          ))
        : null}

      {/* Infografis */}
      <SectionHeader title="Infografis" onAction={() => router.push('/infografis')} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20 }}>
        {(infografis.data ?? []).map((i) => (
          <InfografisCard key={i.id} item={i} />
        ))}
      </ScrollView>

      {/* Hubungi kami */}
      <SectionHeader title="Hubungi Kami" />
      <Card className="mx-5 p-5">
        <Text className="font-bold text-[15px] text-ink">{kontak.data?.nama ?? 'BPS Kabupaten Konawe'}</Text>
        <ContactLine icon="location-outline" text={kontak.data?.alamat} />
        <ContactLine icon="call-outline" text={kontak.data?.telepon} />
        <ContactLine icon="mail-outline" text={kontak.data?.email} />
        <Pressable onPress={() => kontak.data?.website && Linking.openURL(kontak.data.website)} className="mt-4 h-11 flex-row items-center justify-center rounded-2xl bg-primary-700">
          <Ionicons name="globe-outline" size={18} color="#fff" />
          <Text className="ml-2 font-bold text-[13.5px] text-white">Kunjungi konawekab.bps.go.id</Text>
        </Pressable>
      </Card>

      <Text className="mt-6 text-center font-medium text-[11.5px] text-muted">© BPS Kabupaten Konawe · {env.namaApp} v1.0.0</Text>
    </ScrollView>
  );
}

function ContactLine({ icon, text }: { icon: IconName; text?: string }) {
  return (
    <View className="mt-3 flex-row items-start">
      <Ionicons name={icon} size={17} color={colors.primary600} />
      <Text className="ml-2.5 flex-1 font-medium text-[13px] leading-[19px] text-muted">{text ?? '-'}</Text>
    </View>
  );
}
