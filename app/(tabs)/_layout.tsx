import { Tabs } from 'expo-router/js-tabs';
import { AnimatedTabBar } from '@/components/AnimatedTabBar';

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <AnimatedTabBar {...props} />}
      screenOptions={{ headerShown: false, sceneStyle: { backgroundColor: '#F3F7FB' } }}
    >
      <Tabs.Screen name="index" options={{ title: 'Beranda' }} />
      <Tabs.Screen name="publikasi" options={{ title: 'Publikasi' }} />
      <Tabs.Screen name="indikator" options={{ title: 'Indikator Strategis' }} />
      <Tabs.Screen name="tabel" options={{ title: 'Tabel' }} />
      <Tabs.Screen name="lainnya" options={{ title: 'Lainnya' }} />
    </Tabs>
  );
}
