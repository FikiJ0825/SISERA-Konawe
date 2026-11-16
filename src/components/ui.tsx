import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useSegments } from 'expo-router';
import { useEffect, useRef, type ComponentRef, type ReactNode } from 'react';
import {
  ActivityIndicator,
  Keyboard,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  type ViewProps,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MAX_CONTENT_WIDTH, useLayout } from '@/hooks/useLayout';
import { colors } from '@/theme';

export type IconName = keyof typeof Ionicons.glyphMap;
export const asIcon = (name: string | undefined, fallback: IconName = 'ellipse'): IconName =>
  name && name in Ionicons.glyphMap ? (name as IconName) : fallback;

/** Pembatas lebar konten: di tablet/layar lipat konten dipusatkan, bukan dilebarkan. */
export function Container({ children, className = '', ...rest }: ViewProps & { className?: string }) {
  return (
    <View className={className} style={{ width: '100%', maxWidth: MAX_CONTENT_WIDTH, alignSelf: 'center' }} {...rest}>
      {children}
    </View>
  );
}

/* ---------- Header lengkung berwarna (gaya UI 2) ---------- */
export function ScreenHeader({
  title,
  subtitle,
  onBack,
  right,
  children,
}: {
  title: string;
  subtitle?: string;
  onBack?: boolean;
  right?: ReactNode;
  children?: ReactNode;
}) {
  const insets = useSafeAreaInsets();
  return (
    <View className="overflow-hidden rounded-b-[32px] bg-primary-700 pb-6 px-5" style={{ paddingTop: insets.top + 12 }}>
      <HeaderDecor />
      <Container>
      <View className="flex-row items-center">
        {onBack ? (
          <Pressable
            onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))}
            hitSlop={10}
            className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-white/15"
            accessibilityLabel="Kembali"
          >
            <Ionicons name="chevron-back" size={22} color="#fff" />
          </Pressable>
        ) : null}
        <View className="flex-1">
          <Text className="font-extrabold text-[22px] leading-7 text-white" numberOfLines={2} maxFontSizeMultiplier={1.25}>
            {title}
          </Text>
          {subtitle ? <Text className="mt-0.5 font-medium text-[13px] text-primary-200" maxFontSizeMultiplier={1.25}>{subtitle}</Text> : null}
        </View>
        {right}
      </View>
      {children}
      </Container>
    </View>
  );
}

/** Garis gelombang dekoratif tipis seperti pada referensi UI 2. */
export function HeaderDecor() {
  return (
    <View pointerEvents="none" className="absolute inset-0">
      <View className="absolute -right-16 -top-20 h-64 w-64 rounded-full bg-primary-600/40" />
      <View className="absolute -left-10 top-16 h-40 w-40 rounded-full bg-primary-500/20" />
      <View className="absolute right-10 top-10 h-24 w-24 rounded-full border border-white/10" />
    </View>
  );
}

/* ---------- Kolom cari ---------- */
export function SearchBar({
  value,
  onChangeText,
  onPress,
  placeholder = 'Cari data, publikasi, tabel...',
  autoFocus,
}: {
  value?: string;
  onChangeText?: (t: string) => void;
  onPress?: () => void;
  placeholder?: string;
  autoFocus?: boolean;
}) {
  const inputRef = useRef<ComponentRef<typeof TextInput>>(null);

  // Fokus ditunda sedikit supaya keyboard tidak muncul di tengah transisi layar (patah di Android).
  useEffect(() => {
    if (!autoFocus || onPress) return;
    const t = setTimeout(() => inputRef.current?.focus(), 350);
    return () => clearTimeout(t);
  }, [autoFocus, onPress]);

  const body = (
    <View className="h-12 flex-1 flex-row items-center rounded-2xl bg-white px-4">
      <Ionicons name="search" size={19} color={colors.muted} />
      {onPress ? (
        <Text className="ml-2.5 flex-1 font-medium text-[14px] text-muted" numberOfLines={1} maxFontSizeMultiplier={1.2}>
          {placeholder}
        </Text>
      ) : (
        <>
          <TextInput
            ref={inputRef}
            value={value}
            onChangeText={onChangeText}
            onSubmitEditing={() => Keyboard.dismiss()}
            placeholder={placeholder}
            placeholderTextColor={colors.muted}
            className="ml-2.5 flex-1 font-medium text-[14px] text-ink"
            style={{ paddingVertical: 0 }}
            returnKeyType="search"
            autoCorrect={false}
            autoCapitalize="none"
            maxFontSizeMultiplier={1.2}
          />
          {value ? (
            <Pressable onPress={() => onChangeText?.('')} hitSlop={12} accessibilityLabel="Hapus pencarian" className="ml-1 h-6 w-6 items-center justify-center rounded-full bg-primary-100">
              <Ionicons name="close" size={14} color={colors.primary700} />
            </Pressable>
          ) : null}
        </>
      )}
    </View>
  );
  return onPress ? (
    <Pressable onPress={onPress} className="flex-row" accessibilityRole="search">
      {body}
    </Pressable>
  ) : (
    <View className="flex-row">{body}</View>
  );
}

/* ---------- Judul bagian ---------- */
export function SectionHeader({ title, actionLabel = 'Lihat semua', onAction }: { title: string; actionLabel?: string; onAction?: () => void }) {
  return (
    <View className="mb-3 mt-7 flex-row items-end justify-between px-5">
      <Text className="font-extrabold text-[19px] text-ink">{title}</Text>
      {onAction ? (
        <Pressable onPress={onAction} hitSlop={8}>
          <Text className="font-semibold text-[13px] text-primary-600">{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

/* ---------- Kartu & pintasan ---------- */
export function Card({ children, className = '', ...rest }: ViewProps & { className?: string }) {
  return (
    <View
      className={`rounded-3xl bg-white ${className}`}
      style={{ shadowColor: colors.primary900, shadowOpacity: 0.07, shadowRadius: 12, shadowOffset: { width: 0, height: 4 }, elevation: 2 }}
      {...rest}
    >
      {children}
    </View>
  );
}

const TILE_TINTS = [
  { bg: colors.primary100, fg: colors.primary600 },
  { bg: colors.orangeSoft, fg: colors.orange },
  { bg: colors.greenSoft, fg: '#4E8F26' },
];

export function ShortcutTile({ label, icon, tint = 0, columns = 4, onPress }: { label: string; icon: IconName; tint?: number; columns?: number; onPress?: () => void }) {
  const t = TILE_TINTS[tint % TILE_TINTS.length];
  return (
    <Pressable onPress={onPress} className="items-center px-1.5 active:opacity-70" style={{ width: `${100 / columns}%` }} accessibilityRole="button" accessibilityLabel={label}>
      <View className="w-full items-center justify-center rounded-[22px]" style={{ backgroundColor: t.bg, aspectRatio: 1.1, maxHeight: 76 }}>
        <Ionicons name={icon} size={27} color={t.fg} />
      </View>
      <Text className="mt-2 text-center font-semibold text-[11.5px] leading-[15px] text-ink" numberOfLines={2} maxFontSizeMultiplier={1.15}>
        {label}
      </Text>
    </Pressable>
  );
}

/** Sampul buatan (gradasi + ikon) dipakai selama gambar asli belum tersedia dari API. */
export function CoverArt({ color, icon = 'document-text', className = '', size, ratio }: { color: string; icon?: IconName; className?: string; size?: number; ratio?: number }) {
  return (
    <View
      className={`items-center justify-center overflow-hidden rounded-2xl ${className}`}
      style={size ? { width: size, height: size * 1.3 } : ratio ? { aspectRatio: ratio } : undefined}
    >
      <LinearGradient
        colors={[color, shade(color)]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <View className="absolute -right-4 -top-4 h-16 w-16 rounded-full bg-white/15" />
      <View className="absolute -bottom-6 -left-4 h-20 w-20 rounded-full bg-black/10" />
      <Ionicons name={icon} size={size ? size * 0.4 : 28} color="rgba(255,255,255,0.95)" />
    </View>
  );
}

function shade(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  const f = (v: number) => Math.max(0, Math.round(v * 0.72));
  const r = f((n >> 16) & 255);
  const g = f((n >> 8) & 255);
  const b = f(n & 255);
  return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;
}

/* ---------- Status data ---------- */
export function StateView({ loading, error, empty, onRetry }: { loading?: boolean; error?: string; empty?: boolean; onRetry?: () => void }) {
  if (loading)
    return (
      <View className="items-center py-14">
        <ActivityIndicator color={colors.primary600} />
        <Text className="mt-3 font-medium text-[13px] text-muted">Memuat data...</Text>
      </View>
    );
  if (error)
    return (
      <View className="items-center px-8 py-12">
        <Ionicons name="cloud-offline-outline" size={36} color={colors.muted} />
        <Text className="mt-3 text-center font-semibold text-[14px] text-ink">Data belum bisa dimuat</Text>
        <Text className="mt-1 text-center font-regular text-[12.5px] text-muted">{error}</Text>
        {onRetry ? (
          <Pressable onPress={onRetry} className="mt-4 rounded-full bg-primary-700 px-5 py-2.5">
            <Text className="font-bold text-[13px] text-white">Coba lagi</Text>
          </Pressable>
        ) : null}
      </View>
    );
  if (empty)
    return (
      <View className="items-center py-12">
        <Ionicons name="file-tray-outline" size={34} color={colors.muted} />
        <Text className="mt-2 font-medium text-[13px] text-muted">Belum ada data</Text>
      </View>
    );
  return null;
}

/* ---------- Pembungkus layar ---------- */
/**
 * Perilaku scroll + keyboard yang sama di semua layar:
 * - ketukan pada item tetap bekerja saat keyboard terbuka (tidak hanya menutup keyboard)
 * - keyboard menutup saat daftar digeser
 */
export const keyboardScrollProps = {
  keyboardShouldPersistTaps: 'handled',
  keyboardDismissMode: Platform.OS === 'ios' ? 'on-drag' : 'interactive',
  showsVerticalScrollIndicator: false,
} as const;

export function Screen({ header, children, refreshControl }: { header: ReactNode; children: ReactNode; refreshControl?: React.ReactElement<any> }) {
  const { tabBarSpace, safeBottom } = useLayout();
  // Layar di dalam grup (tabs) punya tab bar melayang; layar detail tidak.
  const inTabs = useSegments()[0] === '(tabs)';
  return (
    <View className="flex-1 bg-surface">
      {header}
      <ScrollView {...keyboardScrollProps} contentContainerStyle={{ paddingBottom: inTabs ? tabBarSpace : safeBottom }} refreshControl={refreshControl as any}>
        <Container>{children}</Container>
      </ScrollView>
    </View>
  );
}

export function formatTanggal(iso: string) {
  const bulan = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
  const [y, m, d] = iso.split('-').map(Number);
  if (!y || !m || !d) return iso;
  return `${d} ${bulan[m - 1]} ${y}`;
}
