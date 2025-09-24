import React from 'react';
import { Stack } from 'expo-router';

export default function AdminStackLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="controls" />
      <Stack.Screen name="frameworks" />
      <Stack.Screen name="evidence" />
      <Stack.Screen name="vendors" />
      <Stack.Screen name="questionnaires" />
      <Stack.Screen name="trust-center" />
      <Stack.Screen name="policies" />
      <Stack.Screen name="training" />
      <Stack.Screen name="integrations" />
      <Stack.Screen name="audits" />
      <Stack.Screen name="users" />
      <Stack.Screen name="settings" />
      <Stack.Screen name="audit-log" />
      <Stack.Screen name="content" />
      <Stack.Screen name="moderation" />
      <Stack.Screen name="analytics" />
      <Stack.Screen name="mixmind" />
      <Stack.Screen name="ingest" />
      <Stack.Screen name="revenue" />
      <Stack.Screen name="secrets" />
      <Stack.Screen name="support" />
    </Stack>
  );
}
