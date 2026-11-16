import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import type { BottomTabBarProps } from 'expo-router/js-tabs';
import { useEffect } from 'react';
import { Platform, Pressable, Text, View } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';
import { MAX_CONTENT_WIDTH, useLayout } from '@/hooks/useLayout';
import { useKeyboardVisible } from '@/hooks/useKeyboardVisible';
import { colors, fonts } from '@/theme';

type IconName = keyof typeof Ionicons.glyphMap;

const TAB_META: Record<string, { label: string; icon: IconName; iconActive: IconName }> = {
  index: { label: 'Beranda', icon: 'home-outline', iconActive: 'home' },
  publikasi: { label: 'Publikasi', icon: 'document-text-outline', iconActive: 'document-text' },
  indikator: { label: 'Indikator', icon: 'stats-chart-outline', iconActive: 'stats-chart' },
  tabel: { label: 'Tabel', icon: 'grid-outline', iconActive: 'grid' },
  lainnya: {
    label: 'Lainnya',
    icon: 'ellipsis-horizontal-circle-outline',
    iconActive: 'ellipsis-horizontal-circle',
  },
};

const BAR_HEIGHT = 66;
const OVERHANG = 30; // bagian lingkaran yang menonjol di atas bar
const CORNER = 16;
const NOTCH_HALF = 36;
const NOTCH_DEPTH = 34;
const BUBBLE = 60;
const MIN_TAP = 48;

const AnimatedPath = Animated.createAnimatedComponent(Path);

/** Path bar putih dengan takik melengkung di sekitar posisi cx. */
function barPath(width: number, cx: number, bottom: number) {
  'worklet';
  const top = OVERHANG;
  const hw = NOTCH_HALF;
  const d = NOTCH_DEPTH;
  const left = Math.max(CORNER + hw, Math.min(width - CORNER - hw, cx));
  return [
    `M0 ${top + CORNER}`,
    `Q0 ${top} ${CORNER} ${top}`,
    `H${left - hw}`,
    `C${left - hw * 0.42} ${top} ${left - hw * 0.58} ${top + d} ${left} ${top + d}`,
    `C${left + hw * 0.58} ${top + d} ${left + hw * 0.42} ${top} ${left + hw} ${top}`,
    `H${width - CORNER}`,
    `Q${width} ${top} ${width} ${top + CORNER}`,
    `V${bottom}`,
    'H0',
    'Z',
  ].join(' ');
}

export function AnimatedTabBar({ state, emitter, navigateToTab, insets }: BottomTabBarProps) {
  const { width: screenWidth } = useLayout();
  // Di tablet/layar lipat bar dibatasi dan dipusatkan, bukan direntangkan.
  const width = Math.min(screenWidth, MAX_CONTENT_WIDTH);
  const count = state.routes.length;
  // Jarak samping agar pusat tab pertama/terakhir tetap di bawah takik pada layar sempit:
  // INSET + (W - 2*INSET)/count >= CORNER + NOTCH_HALF di tab pertama.
  const minCenter = CORNER + NOTCH_HALF;
  const inset = Math.max(12, (minCenter - width / (count * 2)) / (1 - 1 / count));
  const tabWidth = (width - inset * 2) / count;
  const bottomInset = Math.max(insets?.bottom ?? 0, 8);
  const totalHeight = OVERHANG + BAR_HEIGHT + bottomInset;

  // posisi aktif dalam satuan indeks tab (animasi spring), bukan piksel
  const pos = useSharedValue(state.index);
  useEffect(() => {
    pos.value = withSpring(state.index, { damping: 16, stiffness: 150, mass: 0.9 });
  }, [state.index, pos]);

  // Keyboard: bar turun keluar layar agar tidak ikut terangkat di atas keyboard (Android adjustResize).
  const keyboardVisible = useKeyboardVisible();
  const hidden = useSharedValue(0);
  useEffect(() => {
    hidden.value = withTiming(keyboardVisible ? 1 : 0, { duration: 180 });
  }, [keyboardVisible, hidden]);
  const rootStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: hidden.value * (totalHeight + 24) }],
    opacity: 1 - hidden.value,
  }));

  const pathProps = useAnimatedProps(() => {
    const cx = inset + (pos.value + 0.5) * tabWidth;
    return { d: barPath(width, cx, totalHeight) };
  });

  const bubbleStyle = useAnimatedStyle(() => {
    const cx = inset + (pos.value + 0.5) * tabWidth;
    const left = Math.max(CORNER + NOTCH_HALF, Math.min(width - CORNER - NOTCH_HALF, cx));
    return { transform: [{ translateX: left - BUBBLE / 2 }] };
  });

  return (
    <Animated.View
      pointerEvents={keyboardVisible ? 'none' : 'box-none'}
      style={[
        {
          position: 'absolute',
          bottom: 0,
          left: (screenWidth - width) / 2,
          width,
          height: totalHeight,
        },
        rootStyle,
      ]}
    >
      <View pointerEvents="none" style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: totalHeight }}>
        <Svg width={width} height={totalHeight}>
          {/* bayangan lembut mengikuti kontur takik (box-shadow kotak akan memotong garis lurus) */}
          {[16, 10, 5].map((w, i) => (
            <AnimatedPath
              key={w}
              animatedProps={pathProps}
              fill="none"
              stroke={colors.primary900}
              strokeOpacity={[0.025, 0.035, 0.05][i]}
              strokeWidth={w}
            />
          ))}
          <AnimatedPath animatedProps={pathProps} fill={colors.card} />
        </Svg>
      </View>

      {/* lingkaran aktif yang meluncur */}
      <Animated.View
        pointerEvents="none"
        style={[
          {
            position: 'absolute',
            top: OVERHANG + 2 - BUBBLE / 2,
            left: 0,
            width: BUBBLE,
            height: BUBBLE,
            borderRadius: BUBBLE / 2,
            backgroundColor: colors.primary700,
            borderWidth: 5,
            borderColor: colors.surface,
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: colors.primary700,
            shadowOpacity: 0.35,
            shadowRadius: 10,
            shadowOffset: { width: 0, height: 5 },
            elevation: 8,
          },
          bubbleStyle,
        ]}
      >
        {state.routes.map((route, i) => (
          <BubbleIcon
            key={route.key}
            index={i}
            pos={pos}
            name={TAB_META[route.name]?.iconActive ?? 'ellipse'}
          />
        ))}
      </Animated.View>

      <View
        style={{
          position: 'absolute',
          left: inset,
          right: inset,
          bottom: bottomInset,
          height: BAR_HEIGHT,
          flexDirection: 'row',
        }}
      >
        {state.routes.map((route, i) => {
          const meta = TAB_META[route.name] ?? {
            label: route.name,
            icon: 'ellipse-outline' as IconName,
            iconActive: 'ellipse' as IconName,
          };
          const focused = state.index === i;
          const onPress = () => {
            const event = emitter.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!focused && !event.defaultPrevented) {
              if (Platform.OS !== 'web') Haptics.selectionAsync().catch(() => {});
              navigateToTab(route.key);
            }
          };
          return (
            <Pressable
              key={route.key}
              accessibilityRole="button"
              accessibilityState={focused ? { selected: true } : {}}
              accessibilityLabel={meta.label}
              onPress={onPress}
              style={{
                width: tabWidth,
                minHeight: MIN_TAP,
                alignItems: 'center',
                justifyContent: 'flex-end',
                paddingBottom: 10,
              }}
            >
              <TabIcon index={i} pos={pos} name={meta.icon} />
              <Text
                numberOfLines={1}
                maxFontSizeMultiplier={1.1}
                style={{
                  marginTop: 3,
                  fontSize: 11,
                  fontFamily: focused ? fonts.bold : fonts.medium,
                  color: focused ? colors.primary700 : colors.muted,
                }}
              >
                {meta.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </Animated.View>
  );
}

function TabIcon({ index, pos, name }: { index: number; pos: { value: number }; name: IconName }) {
  const style = useAnimatedStyle(() => {
    const d = Math.min(Math.abs(pos.value - index), 1);
    return {
      opacity: d,
      transform: [
        { translateY: interpolate(d, [0, 1], [-6, 0]) },
        { scale: interpolate(d, [0, 1], [0.6, 1]) },
      ],
    };
  });
  return (
    <Animated.View style={[{ height: 26, justifyContent: 'center' }, style]}>
      <Ionicons name={name} size={23} color={colors.muted} />
    </Animated.View>
  );
}

function BubbleIcon({
  index,
  pos,
  name,
}: {
  index: number;
  pos: { value: number };
  name: IconName;
}) {
  const style = useAnimatedStyle(() => {
    const d = Math.min(Math.abs(pos.value - index), 1);
    return { opacity: 1 - d, transform: [{ scale: interpolate(d, [0, 1], [1, 0.5]) }] };
  });
  return (
    <Animated.View style={[{ position: 'absolute' }, style]}>
      <Ionicons name={name} size={25} color="#FFFFFF" />
    </Animated.View>
  );
}
