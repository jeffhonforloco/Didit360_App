import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useTheme } from '@/components/ui/Theme';
import { BarChart3 } from 'lucide-react-native';

export default function AdminDashboard() {
  const { colors } = useTheme();

  return (
    <AdminLayout title="Dashboard">
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} testID="admin-dashboard">
        <View style={[styles.card, { backgroundColor: '#111315', borderColor: '#1f2937' }]} testID="stats-card">
          <View style={styles.cardHeader}>
            <BarChart3 color="#22c55e" size={18} />
            <Text style={styles.cardTitle}>Overview</Text>
          </View>
          <Text style={styles.metric}>Active Users: 12,534</Text>
          <Text style={styles.metric}>Streams Today: 84,129</Text>
          <Text style={styles.metric}>Uploads Pending Review: 47</Text>
        </View>
      </ScrollView>
    </AdminLayout>
  );
}

const styles = StyleSheet.create({
  card: { padding: 16, borderRadius: 14, borderWidth: 1, marginBottom: 16 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  cardTitle: { color: '#fff', fontWeight: '600' as const },
  metric: { color: '#cbd5e1', marginTop: 4 },
});
