import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AdminLayout } from '@/components/admin/AdminLayout';

export default function AdminRevenue() {
  return (
    <AdminLayout title="Revenue & Finance">
      <View style={styles.card}>
        <Text style={styles.header}>Monthly Revenue</Text>
        <Text style={styles.value}>$128,430</Text>
        <Text style={styles.sub}>+12.4% vs last month</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.header}>Payouts Pending</Text>
        <Text style={styles.value}>$23,910</Text>
        <Text style={styles.sub}>17 creators</Text>
      </View>
    </AdminLayout>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#0b0f12', borderColor: '#1f2937', borderWidth: 1, borderRadius: 12, padding: 16, marginBottom: 12 },
  header: { color: '#94a3b8', marginBottom: 6 },
  value: { color: '#fff', fontSize: 20, fontWeight: '700' as const },
  sub: { color: '#cbd5e1', marginTop: 2 },
});
