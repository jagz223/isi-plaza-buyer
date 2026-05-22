import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';

import { PlatformGate } from '@/components/PlatformGate';
import { AuthProvider } from '@/context/AuthContext';
import { PlatformAccessProvider } from '@/context/PlatformAccessContext';

export default function RootLayout() {
  return (
    <PlatformAccessProvider>
      <PlatformGate>
        <AuthProvider>
          <StatusBar style="dark" />
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(app)" />
          </Stack>
        </AuthProvider>
      </PlatformGate>
    </PlatformAccessProvider>
  );
}
