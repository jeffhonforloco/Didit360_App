import React from 'react';
import { View, Text, StyleSheet, TextInput, Pressable } from 'react-native';
import { AdminLayout } from '@/components/admin/AdminLayout';

export default function AdminLive() {
  return (
    <AdminLayout title="Live Streaming">
      <View style={styles.banner} testID="live-banner">
        <Text style={styles.bannerText}>Live Streaming</Text>
      </View>
      <View style={styles.formRow}>
        <TextInput placeholder="Title" placeholderTextColor="#94a3b8" style={styles.input} />
        <TextInput placeholder="Description" placeholderTextColor="#94a3b8" style={styles.input} />
      </View>
      <View style={styles.formRow}>
        <TextInput placeholder="Host" placeholderTextColor="#94a3b8" style={styles.input} />
        <TextInput placeholder="Album/Title" placeholderTextColor="#94a3b8" style={styles.input} />
      </View>
      <Pressable style={styles.startBtn} testID="start-live">
        <Text style={styles.startText}>Start</Text>
      </Pressable>
    </AdminLayout>
  );
}

const styles = StyleSheet.create({
  banner: { backgroundColor: '#ef4444', height: 80, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  bannerText: { color: '#fff', fontWeight: '700' as const, letterSpacing: 0.4 },
  formRow: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  input: { flex: 1, backgroundColor: '#0b0f12', color: '#e5e7eb', borderColor: '#1f2937', borderWidth: 1, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10 },
  startBtn: { alignSelf: 'flex-start', backgroundColor: '#22c55e', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 12, marginTop: 8 },
  startText: { color: '#fff', fontWeight: '600' as const },
});
