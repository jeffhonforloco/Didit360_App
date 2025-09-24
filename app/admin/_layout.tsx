import React from 'react';
import { Stack } from 'expo-router';

export default function AdminStackLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="users" />
      <Stack.Screen name="content" />
      <Stack.Screen name="genres" />
      <Stack.Screen name="live" />
      <Stack.Screen name="revenue" />
      <Stack.Screen name="secrets" />
      <Stack.Screen name="support" />
      <Stack.Screen name="settings" />
    </Stack>
  );
}
