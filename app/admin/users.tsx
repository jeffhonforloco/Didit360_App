import React from 'react';
import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useTheme } from '@/components/ui/Theme';
import { UserPlus, Ban, Shield } from 'lucide-react-native';

interface UserRow { id: string; name: string; role: 'admin' | 'editor' | 'viewer'; status: 'active' | 'blocked'; }

const data: UserRow[] = [
  { id: '1', name: 'Alice Johnson', role: 'admin', status: 'active' },
  { id: '2', name: 'Bob Smith', role: 'editor', status: 'active' },
  { id: '3', name: 'Charlie Brown', role: 'viewer', status: 'blocked' },
];

export default function AdminUsers() {
  const { colors } = useTheme();
  return (
    <AdminLayout title="User Management">
      <FlatList
        data={data}
        keyExtractor={(i) => i.id}
        contentContainerStyle={{ paddingBottom: 40 }}
        renderItem={({ item }) => (
          <View style={[styles.row, { backgroundColor: '#0b0f12', borderColor: '#1f2937' }]} testID={`user-${item.id}`}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.role}>{item.role}</Text>
            <Text style={[styles.status, { color: item.status === 'active' ? '#22c55e' : '#ef4444' }]}>{item.status}</Text>
            <View style={styles.actions}>
              <Pressable testID={`promote-${item.id}`} style={styles.action}><Shield color="#93c5fd" size={16} /></Pressable>
              <Pressable testID={`block-${item.id}`} style={styles.action}><Ban color="#fca5a5" size={16} /></Pressable>
            </View>
          </View>
        )}
        ListHeaderComponent={() => (
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Users</Text>
            <Pressable testID="add-user" style={styles.addBtn}><UserPlus color="#fff" size={16} /><Text style={styles.addText}>Add</Text></Pressable>
          </View>
        )}
      />
    </AdminLayout>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  headerTitle: { color: '#fff', fontSize: 16, fontWeight: '600' as const },
  addBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#22c55e', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10 },
  addText: { color: '#fff', fontWeight: '600' as const },
  row: { marginBottom: 10, borderWidth: 1, borderRadius: 12, padding: 12, flexDirection: 'row', alignItems: 'center', gap: 12 },
  name: { color: '#fff', flex: 1 },
  role: { color: '#93c5fd', width: 70 },
  status: { width: 70, textTransform: 'capitalize' as const },
  actions: { flexDirection: 'row', gap: 10 },
  action: { padding: 6, borderRadius: 8, backgroundColor: '#111827' },
});
