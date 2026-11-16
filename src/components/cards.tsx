import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { useBookmarks } from '@/hooks/useBookmarks';
import { colors } from '@/theme';
import type { Indikator, Infografis, Publikasi } from '@/types';
import { Card, CoverArt, asIcon, formatTanggal } from './ui';

/** Kartu besar membulat (gaya UI 2): `dark` = biru tua, selain itu putih. */
export function IndicatorCard({ item, dark, width = 236 }: { item: Indikator; dark?: boolean; width?: number }) {
  return (
    <Pressable
      onPress={() => router.push({ pathname: '/indikator/[id]', params: { id: item.id } })}
      className="active:opacity-90"
      style={{ width }}
      accessibilityRole="button"
    >
      <View
        className={`overflow-hidden rounded-[28px] p-5 ${dark ? 'bg-primary-700' : 'bg-white'}`}
        style={{ height: 196, shadowColor: colors.primary900, shadowOpacity: dark ? 0.22 : 0.08, shadowRadius: 14, shadowOffset: { width: 0, height: 6 }, elevation: 4 }}
      >
        {dark ? <View className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary-500/30" /> : <View className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary-100" />}
        <View className={`h-11 w-11 items-center justify-center rounded-full ${dark ? 'bg-white' : 'bg-primary-700'}`}>
          <Ionicons name={asIcon(item.ikon, 'stats-chart')} size={21} color={dark ? colors.primary700 : '#fff'} />
        </View>
        <Text className={`mt-3 font-bold text-[14px] leading-5 ${dark ? 'text-white' : 'text-ink'}`} numberOfLines={2}>
          {item.judul}
        </Text>
        <View className="flex-1 justify-end">
          <View className="flex-row items-end justify-between">
            <View>
              <Text className={`font-extrabold text-[26px] ${dark ? 'text-white' : 'text-primary-700'}`}>{item.nilai}</Text>
              <Text className={`font-medium text-[12px] ${dark ? 'text-primary-200' : 'text-muted'}`}>
                {item.satuan} · {item.periode}
              </Text>
            </View>
            <View className={`h-9 w-9 items-center justify-center rounded-full ${dark ? 'bg-white' : 'bg-orange'}`}>
              <Ionicons name="arrow-forward" size={18} color={dark ? colors.primary700 : '#fff'} />
            </View>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

/** Baris indikator untuk daftar (dengan tombol bookmark). */
export function IndicatorRow({ item }: { item: Indikator }) {
  const { isBookmarked, toggle } = useBookmarks();
  const saved = isBookmarked(item.id);
  return (
    <Card className="mx-5 mb-3 p-4">
      <Pressable onPress={() => router.push({ pathname: '/indikator/[id]', params: { id: item.id } })} className="flex-row items-center active:opacity-80">
        <View className="h-12 w-12 items-center justify-center rounded-2xl bg-primary-100">
          <Ionicons name={asIcon(item.ikon, 'stats-chart')} size={23} color={colors.primary700} />
        </View>
        <View className="ml-3.5 flex-1">
          <Text className="font-bold text-[14px] leading-5 text-ink" numberOfLines={2}>
            {item.judul}
          </Text>
          <Text className="mt-0.5 font-medium text-[12px] text-muted">{item.kategori}</Text>
          <View className="mt-1.5 flex-row items-baseline">
            <Text className="font-extrabold text-[20px] text-primary-700">{item.nilai}</Text>
            <Text className="ml-1.5 font-medium text-[12px] text-muted">
              {item.satuan} · {item.periode}
            </Text>
          </View>
        </View>
        <Pressable onPress={() => toggle(item.id)} hitSlop={10} accessibilityLabel={saved ? 'Hapus dari tersimpan' : 'Simpan indikator'} className="ml-2 h-10 w-10 items-center justify-center rounded-full bg-surface">
          <Ionicons name={saved ? 'bookmark' : 'bookmark-outline'} size={19} color={saved ? colors.orange : colors.muted} />
        </Pressable>
      </Pressable>
    </Card>
  );
}

export function PublicationRow({ item, compact }: { item: Publikasi; compact?: boolean }) {
  return (
    <Card className={`${compact ? 'mx-5' : 'mx-5'} mb-3 flex-row items-center p-3`}>
      <CoverArt color={item.warna} size={56} className="" />
      <View className="ml-3.5 flex-1">
        <Text className="font-bold text-[13.5px] leading-5 text-ink" numberOfLines={3}>
          {item.judul}
        </Text>
        <View className="mt-1.5 flex-row items-center">
          <Ionicons name="calendar-outline" size={13} color={colors.muted} />
          <Text className="ml-1 font-medium text-[12px] text-muted">{formatTanggal(item.tanggalRilis)}</Text>
        </View>
      </View>
      <View className="ml-2 h-9 w-9 items-center justify-center rounded-full bg-primary-100">
        <Ionicons name="download-outline" size={18} color={colors.primary700} />
      </View>
    </Card>
  );
}

export function InfografisCard({ item, fluid }: { item: Infografis; fluid?: boolean }) {
  return (
    <View className={fluid ? 'w-full' : 'mr-3.5 w-[210px]'}>
      <CoverArt color={item.warna} icon="image" className={`w-full rounded-[24px] ${fluid ? 'h-[190px]' : 'h-[250px]'}`} />
      <Text className="mt-2.5 font-bold text-[13px] leading-[18px] text-ink" numberOfLines={2}>
        {item.judul}
      </Text>
      <Text className="mt-0.5 font-medium text-[11.5px] text-muted">{formatTanggal(item.tanggal)}</Text>
    </View>
  );
}
