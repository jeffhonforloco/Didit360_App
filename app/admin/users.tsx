import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, TextInput, ScrollView } from 'react-native';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useTheme } from '@/components/ui/Theme';
import { 
  UserPlus, Ban, Shield, Search, Filter, MoreVertical, 
  Mail, Calendar, MapPin, Crown, Eye, Edit3, Trash2,
  AlertTriangle, CheckCircle, Clock, Users
} from 'lucide-react-native';
import { trpc } from '@/lib/trpc';

interface UserRow { 
  id: string; 
  name: string; 
  email: string;
  role: 'admin' | 'creator' | 'listener' | 'moderator'; 
  status: 'active' | 'suspended' | 'pending' | 'banned'; 
  joinDate: string;
  lastActive: string;
  country: string;
  totalStreams: number;
  uploads: number;
  subscription: 'free' | 'premium' | 'pro';
  reports: number;
}

const mockUsers: UserRow[] = [
  { id: '1', name: 'Alice Johnson', email: 'alice@example.com', role: 'admin', status: 'active', joinDate: '2023-01-15', lastActive: '2 hours ago', country: 'US', totalStreams: 15420, uploads: 0, subscription: 'pro', reports: 0 },
  { id: '2', name: 'Bob Smith', email: 'bob@example.com', role: 'creator', status: 'active', joinDate: '2023-03-22', lastActive: '1 day ago', country: 'UK', totalStreams: 8930, uploads: 47, subscription: 'premium', reports: 2 },
  { id: '3', name: 'Charlie Brown', email: 'charlie@example.com', role: 'listener', status: 'suspended', joinDate: '2023-06-10', lastActive: '1 week ago', country: 'CA', totalStreams: 2340, uploads: 0, subscription: 'free', reports: 5 },
  { id: '4', name: 'Diana Prince', email: 'diana@example.com', role: 'creator', status: 'active', joinDate: '2023-02-08', lastActive: '3 hours ago', country: 'AU', totalStreams: 12890, uploads: 23, subscription: 'premium', reports: 0 },
  { id: '5', name: 'Eve Wilson', email: 'eve@example.com', role: 'moderator', status: 'active', joinDate: '2023-01-30', lastActive: '30 minutes ago', country: 'DE', totalStreams: 5670, uploads: 0, subscription: 'pro', reports: 0 },
];

export default function AdminUsers() {
  const { colors } = useTheme();
  const [search, setSearch] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const { data: usersData, isLoading, error } = trpc.admin.users.getUsers.useQuery({
    search: search || undefined,
    role: selectedRole !== 'all' ? selectedRole as any : undefined,
    status: selectedStatus !== 'all' ? selectedStatus as any : undefined,
    limit: 50,
    offset: 0,
  });

  if (isLoading) {
    return (
      <AdminLayout title="User Management">
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: '#fff' }}>Loading users...</Text>
        </View>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout title="User Management">
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: '#ef4444' }}>Error loading users: {error.message}</Text>
        </View>
      </AdminLayout>
    );
  }

  const users = usersData?.users || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#22c55e';
      case 'suspended': return '#f59e0b';
      case 'pending': return '#3b82f6';
      case 'banned': return '#ef4444';
      default: return '#94a3b8';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return Crown;
      case 'creator': return Edit3;
      case 'moderator': return Shield;
      case 'listener': return Eye;
      default: return Users;
    }
  };

  return (
    <AdminLayout title="User Management">
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} testID="admin-users">
        {/* Stats Overview */}
        <View style={styles.statsContainer}>
          <View style={[styles.statCard, { backgroundColor: '#111315', borderColor: '#1f2937' }]}>
            <Users color="#3b82f6" size={20} />
            <Text style={styles.statValue}>2.4M</Text>
            <Text style={styles.statLabel}>Total Users</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: '#111315', borderColor: '#1f2937' }]}>
            <CheckCircle color="#22c55e" size={20} />
            <Text style={styles.statValue}>2.1M</Text>
            <Text style={styles.statLabel}>Active</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: '#111315', borderColor: '#1f2937' }]}>
            <AlertTriangle color="#f59e0b" size={20} />
            <Text style={styles.statValue}>47K</Text>
            <Text style={styles.statLabel}>Flagged</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: '#111315', borderColor: '#1f2937' }]}>
            <Clock color="#8b5cf6" size={20} />
            <Text style={styles.statValue}>12K</Text>
            <Text style={styles.statLabel}>New Today</Text>
          </View>
        </View>

        {/* Search and Filters */}
        <View style={[styles.filtersContainer, { backgroundColor: '#111315', borderColor: '#1f2937' }]}>
          <View style={styles.searchBar}>
            <Search color="#cbd5e1" size={16} />
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="Search users..."
              placeholderTextColor="#94a3b8"
              style={styles.searchInput}
              testID="user-search-input"
            />
          </View>
          <View style={styles.filterRow}>
            <View style={styles.filterGroup}>
              <Text style={styles.filterLabel}>Role:</Text>
              <View style={styles.filterButtons}>
                {['all', 'admin', 'creator', 'listener', 'moderator'].map(role => (
                  <Pressable
                    key={role}
                    style={[styles.filterButton, selectedRole === role && styles.filterButtonActive]}
                    onPress={() => setSelectedRole(role)}
                    testID={`filter-role-${role}`}
                  >
                    <Text style={[styles.filterButtonText, selectedRole === role && styles.filterButtonTextActive]}>
                      {role.charAt(0).toUpperCase() + role.slice(1)}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
            <View style={styles.filterGroup}>
              <Text style={styles.filterLabel}>Status:</Text>
              <View style={styles.filterButtons}>
                {['all', 'active', 'suspended', 'pending', 'banned'].map(status => (
                  <Pressable
                    key={status}
                    style={[styles.filterButton, selectedStatus === status && styles.filterButtonActive]}
                    onPress={() => setSelectedStatus(status)}
                    testID={`filter-status-${status}`}
                  >
                    <Text style={[styles.filterButtonText, selectedStatus === status && styles.filterButtonTextActive]}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          </View>
        </View>

        {/* Users List */}
        <View style={[styles.usersContainer, { backgroundColor: '#111315', borderColor: '#1f2937' }]}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Users ({usersData?.total || 0})</Text>
            <Pressable testID="add-user" style={styles.addBtn}>
              <UserPlus color="#fff" size={16} />
              <Text style={styles.addText}>Add User</Text>
            </Pressable>
          </View>
          
          {users.map((user) => {
            const RoleIcon = getRoleIcon(user.role);
            return (
              <View key={user.id} style={[styles.userRow, { backgroundColor: '#0b0f12', borderColor: '#1f2937' }]} testID={`user-${user.id}`}>
                <View style={styles.userMain}>
                  <View style={styles.userInfo}>
                    <View style={styles.userHeader}>
                      <RoleIcon color="#cbd5e1" size={16} />
                      <Text style={styles.userName}>{user.name}</Text>
                      <View style={[styles.statusBadge, { backgroundColor: getStatusColor(user.status) + '20', borderColor: getStatusColor(user.status) }]}>
                        <Text style={[styles.statusText, { color: getStatusColor(user.status) }]}>{user.status}</Text>
                      </View>
                    </View>
                    <Text style={styles.userEmail}>{user.email}</Text>
                    <View style={styles.userMeta}>
                      <View style={styles.metaItem}>
                        <Calendar color="#94a3b8" size={12} />
                        <Text style={styles.metaText}>Joined {user.joinDate}</Text>
                      </View>
                      <View style={styles.metaItem}>
                        <MapPin color="#94a3b8" size={12} />
                        <Text style={styles.metaText}>{user.country}</Text>
                      </View>
                      <View style={styles.metaItem}>
                        <Clock color="#94a3b8" size={12} />
                        <Text style={styles.metaText}>Active {user.lastActive}</Text>
                      </View>
                    </View>
                  </View>
                  <View style={styles.userStats}>
                    <View style={styles.statItem}>
                      <Text style={styles.statNumber}>{user.totalStreams.toLocaleString()}</Text>
                      <Text style={styles.statLabel}>Streams</Text>
                    </View>
                    <View style={styles.statItem}>
                      <Text style={styles.statNumber}>{user.uploads}</Text>
                      <Text style={styles.statLabel}>Uploads</Text>
                    </View>
                    <View style={styles.statItem}>
                      <Text style={[styles.statNumber, { color: user.reports > 0 ? '#ef4444' : '#22c55e' }]}>{user.reports}</Text>
                      <Text style={styles.statLabel}>Reports</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.userActions}>
                  <Pressable testID={`view-${user.id}`} style={styles.actionButton}>
                    <Eye color="#3b82f6" size={16} />
                  </Pressable>
                  <Pressable testID={`edit-${user.id}`} style={styles.actionButton}>
                    <Edit3 color="#22c55e" size={16} />
                  </Pressable>
                  <Pressable testID={`ban-${user.id}`} style={styles.actionButton}>
                    <Ban color="#f59e0b" size={16} />
                  </Pressable>
                  <Pressable testID={`delete-${user.id}`} style={styles.actionButton}>
                    <Trash2 color="#ef4444" size={16} />
                  </Pressable>
                  <Pressable testID={`more-${user.id}`} style={styles.actionButton}>
                    <MoreVertical color="#cbd5e1" size={16} />
                  </Pressable>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </AdminLayout>
  );
}

const styles = StyleSheet.create({
  statsContainer: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  statCard: { flex: 1, padding: 16, borderRadius: 12, borderWidth: 1, alignItems: 'center', gap: 8 },
  statValue: { color: '#fff', fontSize: 20, fontWeight: '700' as const },
  statLabel: { color: '#94a3b8', fontSize: 12 },
  filtersContainer: { padding: 16, borderRadius: 12, borderWidth: 1, marginBottom: 16 },
  searchBar: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#0b0f12', borderColor: '#1f2937', borderWidth: 1, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, marginBottom: 16 },
  searchInput: { flex: 1, color: '#e5e7eb' },
  filterRow: { gap: 16 },
  filterGroup: { gap: 8 },
  filterLabel: { color: '#cbd5e1', fontSize: 14, fontWeight: '500' as const },
  filterButtons: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  filterButton: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6, backgroundColor: '#0b0f12', borderWidth: 1, borderColor: '#1f2937' },
  filterButtonActive: { backgroundColor: '#22c55e', borderColor: '#22c55e' },
  filterButtonText: { color: '#cbd5e1', fontSize: 12 },
  filterButtonTextActive: { color: '#fff' },
  usersContainer: { padding: 16, borderRadius: 12, borderWidth: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  headerTitle: { color: '#fff', fontSize: 16, fontWeight: '600' as const },
  addBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#22c55e', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 },
  addText: { color: '#fff', fontWeight: '600' as const },
  userRow: { marginBottom: 12, borderWidth: 1, borderRadius: 12, padding: 16 },
  userMain: { flexDirection: 'row', gap: 16, marginBottom: 12 },
  userInfo: { flex: 1 },
  userHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  userName: { color: '#fff', fontWeight: '600' as const, flex: 1 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4, borderWidth: 1 },
  statusText: { fontSize: 11, fontWeight: '500' as const, textTransform: 'capitalize' as const },
  userEmail: { color: '#94a3b8', marginBottom: 8 },
  userMeta: { flexDirection: 'row', gap: 16, flexWrap: 'wrap' },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { color: '#94a3b8', fontSize: 12 },
  userStats: { flexDirection: 'row', gap: 16 },
  statItem: { alignItems: 'center' },
  statNumber: { color: '#fff', fontWeight: '600' as const },
  userActions: { flexDirection: 'row', gap: 8 },
  actionButton: { padding: 8, borderRadius: 6, backgroundColor: '#111827' },
});
