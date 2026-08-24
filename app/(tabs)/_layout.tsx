import React from 'react';
import { Tabs, Slot } from 'expo-router';
import { FloatingTabBar } from '@/components/common/FloatingTabBar';
import { useSettingsStore } from '@/stores/settingsStore';

export default function TabsLayout() {
  const navStyle = useSettingsStore((s) => s.navStyle);

  if (navStyle === 'sidebar') {
    return <Slot />;
  }

  return (
    <Tabs tabBar={(props) => <FloatingTabBar key={props.state.index} />} screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="home" />
      <Tabs.Screen name="search" />
      <Tabs.Screen name="library" />
      <Tabs.Screen name="settings" />
    </Tabs>
  );
}
