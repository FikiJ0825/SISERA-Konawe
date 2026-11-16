import '../global.css';

import {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
  PlusJakartaSans_800ExtraBold,
  useFonts,
} from '@expo-google-fonts/plus-jakarta-sans';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AnimatedSplash } from '@/components/AnimatedSplash';
import { BookmarkProvider } from '@/hooks/useBookmarks';
import { colors } from '@/theme';

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const [loaded, error] = useFonts({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
    PlusJakartaSans_800ExtraBold,
  });

  const [splashDone, setSplashDone] = useState(false);
  const ready = loaded || !!error;

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: splashDone ? colors.surface : '#FFFFFF' }}>
      {ready && (
        <BookmarkProvider>
          <StatusBar style="light" />
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: colors.surface },
              animation: 'slide_from_right',
            }}
          />
        </BookmarkProvider>
      )}
      {!splashDone && <AnimatedSplash ready={ready} onFinish={() => setSplashDone(true)} />}
    </GestureHandlerRootView>
  );
}
