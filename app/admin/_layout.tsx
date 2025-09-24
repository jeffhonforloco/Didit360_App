import React from 'react';
import { Stack } from 'expo-router';

export default function AdminStackLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="users" />
      <Stack.Screen name="content" />
      <Stack.Screen name="moderation" />
      <Stack.Screen name="analytics" />
      <Stack.Screen name="mixmind" />
      <Stack.Screen name="ingest" />
      <Stack.Screen name="partners" />
      <Stack.Screen name="revenue" />
      <Stack.Screen name="system" />
      <Stack.Screen name="audit" />
      <Stack.Screen name="secrets" />
      <Stack.Screen name="support" />
      <Stack.Screen name="settings" />
    </Stack>
  );
}
