import { Image } from 'expo-image';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, useWindowDimensions } from 'react-native';

const LOGO = require('../../assets/images/logo-silaika-lengkap.png');
const LOGO_RATIO = 642 / 421;
/** Lama minimal logo tampil (ms), dihitung sejak logo termuat. */
const MIN_VISIBLE = 2000;
const FADE_OUT = 400;

type Props = {
  /** true setelah app siap (font termuat). Splash baru menghilang setelah ini true. */
  ready: boolean;
  onFinish: () => void;
};

/**
 * Layar pembuka berisi logo SI LAIKA lengkap dengan kepanjangannya.
 * Splash native (ikon rumah) hanya jembatan singkat; logo lengkap ditampilkan di sini
 * karena splash native Android 12+ dipotong berbentuk lingkaran dan tidak tampil di Expo Go.
 */
export function AnimatedSplash({ ready, onFinish }: Props) {
  const { width } = useWindowDimensions();
  const logoWidth = Math.min(width * 0.8, 320);
  const appear = useRef(new Animated.Value(0)).current;
  const fade = useRef(new Animated.Value(1)).current;
  const [shownAt, setShownAt] = useState<number | null>(null);
  const [minDone, setMinDone] = useState(false);

  const handleShown = () => {
    setShownAt((prev) => {
      if (prev !== null) return prev;
      SplashScreen.hideAsync().catch(() => {});
      Animated.timing(appear, {
        toValue: 1,
        duration: 600,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
      return Date.now();
    });
  };

  // Cadangan bila event onLoad gambar tidak datang: tetap lanjutkan.
  useEffect(() => {
    const t = setTimeout(handleShown, 1500);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (shownAt === null) return;
    const t = setTimeout(() => setMinDone(true), MIN_VISIBLE);
    return () => clearTimeout(t);
  }, [shownAt]);

  const leaving = useRef(false);
  useEffect(() => {
    if (!ready || !minDone || leaving.current) return;
    leaving.current = true;
    Animated.timing(fade, { toValue: 0, duration: FADE_OUT, useNativeDriver: true }).start(() => onFinish());
  }, [ready, minDone, fade, onFinish]);

  return (
    <Animated.View style={[styles.root, { opacity: fade }]} pointerEvents="auto">
      <Animated.View
        style={{
          opacity: appear,
          transform: [{ scale: appear.interpolate({ inputRange: [0, 1], outputRange: [0.94, 1] }) }],
        }}
      >
        <Image
          source={LOGO}
          style={{ width: logoWidth, height: logoWidth / LOGO_RATIO }}
          contentFit="contain"
          onLoad={handleShown}
          onError={handleShown}
          accessibilityLabel="SI LAIKA, Sistem Informasi dan Layanan Statistik Konawe Terintegrasi"
        />
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFill,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    elevation: 1000,
  },
});
