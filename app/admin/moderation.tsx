import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput, Image } from 'react-native';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { 
  Shield, AlertTriangle, CheckCircle, X, Eye, Flag, 
  Clock, User, Music, Video, MessageSquare, Search,
  Filter, MoreVertical, Ban, Trash2, FileText
} from 'lucide-react-native';

interface ModerationItem {
  id: string;
  type: 'track' | 'video' | 'comment' | 'user' | 'playlist';
  title: string;
  reporter: string;
  reportedUser: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected' | 'escalated';
  priority: 'low' | 'medium' | 'high' | 'critical';
  reportedAt: string;
  content?: string;
  artwork?: string;
  reportCount: number;
}

const mockModerationItems: ModerationItem[] = [
  {
    id: '1',
    type: 'track',
    title: 'Inappropriate Song Title',
    reporter: 'user123',
    reportedUser: 'artist456',
    reason: 'Explicit content without warning',
    status: 'pending',
    priority: 'high',
    reportedAt: '2024-01-15T10:30:00Z',
    artwork: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=60&h=60&fit=crop',
    reportCount: 12
  },
  {
    id: '2',
    type: 'comment',
    title: 'Hate speech in comments',
    reporter: 'moderator789',
    reportedUser: 'user999',
    reason: 'Harassment and hate speech',
    status: 'escalated',
    priority: 'critical',
    reportedAt: '2024-01-15T09:15:00Z',
    content: 'This is an example of reported comment content...',
    reportCount: 8
  },
  {
    id: '3',
    type: 'video',
    title: 'Copyright violation',
    reporter: 'copyright_bot',
    reportedUser: 'creator123',
    reason: 'Unauthorized use of copyrighted material',
    status: 'pending',
    priority: 'medium',
    reportedAt: '2024-01-15T08:45:00Z',
    artwork: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=60&h=60&fit=crop',
    reportCount: 3
  },
  {
    id: '4',
    type: 'user',
    title: 'Spam account behavior',
    reporter: 'system',
    reportedUser: 'spammer456',
    reason: 'Mass uploading of low-quality content',
    status: 'approved',
    priority: 'low',
    reportedAt: '2024-01-14T16:20:00Z',
    reportCount: 15
  }
];

export default function AdminModeration() {
  const [search, setSearch] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('pending');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');

  const filteredItems = useMemo(() => {
    return mockModerationItems.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase()) ||
                           item.reportedUser.toLowerCase().includes(search.toLowerCase()) ||
                           item.reason.toLowerCase().includes(search.toLowerCase());
      const matchesType = selectedType === 'all' || item.type === selectedType;
      const matchesStatus = selectedStatus === 'all' || item.status === selectedStatus;
      const matchesPriority = selectedPriority === 'all' || item.priority === selectedPriority;
      return matchesSearch && matchesType && matchesStatus && matchesPriority;
    });
  }, [search, selectedType, selectedStatus, selectedPriority]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return '#f59e0b';
      case 'approved': return '#22c55e';
      case 'rejected': return '#ef4444';
      case 'escalated': return '#8b5cf6';
      default: return '#94a3b8';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return '#ef4444';
      case 'high': return '#f59e0b';
      case 'medium': return '#3b82f6';
      case 'low': return '#22c55e';
      default: return '#94a3b8';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'track': return Music;
      case 'video': return Video;
      case 'comment': return MessageSquare;
      case 'user': return User;
      case 'playlist': return FileText;
      default: return Flag;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${Math.floor(diffHours / 24)}d ago`;
  };

  return (
    <AdminLayout title="Content Moderation">
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} testID="admin-moderation">
        {/* Stats Overview */}
        <View style={styles.statsContainer}>
          <View style={[styles.statCard, { backgroundColor: '#111315', borderColor: '#1f2937' }]}>
            <Clock color="#f59e0b" size={20} />
            <Text style={styles.statValue}>47</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: '#111315', borderColor: '#1f2937' }]}>
            <AlertTriangle color="#ef4444" size={20} />
            <Text style={styles.statValue}>12</Text>
            <Text style={styles.statLabel}>Critical</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: '#111315', borderColor: '#1f2937' }]}>
            <CheckCircle color="#22c55e" size={20} />
            <Text style={styles.statValue}>234</Text>
            <Text style={styles.statLabel}>Resolved Today</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: '#111315', borderColor: '#1f2937' }]}>
            <Shield color="#8b5cf6" size={20} />
            <Text style={styles.statValue}>98.2%</Text>
            <Text style={styles.statLabel}>Accuracy</Text>
          </View>
        </View>

        {/* Filters */}
        <View style={[styles.filtersContainer, { backgroundColor: '#111315', borderColor: '#1f2937' }]}>
          <View style={styles.searchBar}>
            <Search color="#cbd5e1" size={16} />
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="Search reports..."
              placeholderTextColor="#94a3b8"
              style={styles.searchInput}
              testID="moderation-search-input"
            />
          </View>
          
          <View style={styles.filterRow}>
            <View style={styles.filterGroup}>
              <Text style={styles.filterLabel}>Type:</Text>
              <View style={styles.filterButtons}>
                {['all', 'track', 'video', 'comment', 'user', 'playlist'].map(type => (
                  <Pressable
                    key={type}
                    style={[styles.filterButton, selectedType === type && styles.filterButtonActive]}
                    onPress={() => setSelectedType(type)}
                    testID={`filter-type-${type}`}
                  >
                    <Text style={[styles.filterButtonText, selectedType === type && styles.filterButtonTextActive]}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
            
            <View style={styles.filterGroup}>
              <Text style={styles.filterLabel}>Status:</Text>
              <View style={styles.filterButtons}>
                {['all', 'pending', 'approved', 'rejected', 'escalated'].map(status => (
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
            
            <View style={styles.filterGroup}>
              <Text style={styles.filterLabel}>Priority:</Text>
              <View style={styles.filterButtons}>
                {['all', 'critical', 'high', 'medium', 'low'].map(priority => (
                  <Pressable
                    key={priority}
                    style={[styles.filterButton, selectedPriority === priority && styles.filterButtonActive]}
                    onPress={() => setSelectedPriority(priority)}
                    testID={`filter-priority-${priority}`}
                  >
                    <Text style={[styles.filterButtonText, selectedPriority === priority && styles.filterButtonTextActive]}>
                      {priority.charAt(0).toUpperCase() + priority.slice(1)}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          </View>
        </View>

        {/* Moderation Queue */}
        <View style={[styles.queueContainer, { backgroundColor: '#111315', borderColor: '#1f2937' }]}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Moderation Queue ({filteredItems.length})</Text>
            <View style={styles.headerActions}>
              <Pressable style={styles.bulkActionBtn} testID="bulk-approve">
                <CheckCircle color="#22c55e" size={16} />
                <Text style={styles.bulkActionText}>Bulk Approve</Text>
              </Pressable>
              <Pressable style={styles.bulkActionBtn} testID="bulk-reject">
                <X color="#ef4444" size={16} />
                <Text style={styles.bulkActionText}>Bulk Reject</Text>
              </Pressable>
            </View>
          </View>

          {filteredItems.map((item) => {
            const TypeIcon = getTypeIcon(item.type);
            return (
              <View key={item.id} style={[styles.moderationItem, { backgroundColor: '#0b0f12', borderColor: '#1f2937' }]} testID={`moderation-${item.id}`}>
                <View style={styles.itemHeader}>
                  <View style={styles.itemInfo}>
                    <TypeIcon color="#cbd5e1" size={16} />
                    <Text style={styles.itemTitle}>{item.title}</Text>
                    <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(item.priority) + '20', borderColor: getPriorityColor(item.priority) }]}>
                      <Text style={[styles.priorityText, { color: getPriorityColor(item.priority) }]}>{item.priority}</Text>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20', borderColor: getStatusColor(item.status) }]}>
                      <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>{item.status}</Text>
                    </View>
                  </View>
                  <Text style={styles.timeAgo}>{formatDate(item.reportedAt)}</Text>
                </View>

                <View style={styles.itemContent}>
                  {item.artwork && (
                    <Image source={{ uri: item.artwork }} style={styles.itemArtwork} />
                  )}
                  <View style={styles.itemDetails}>
                    <Text style={styles.itemReason}>Reason: {item.reason}</Text>
                    <Text style={styles.itemMeta}>Reported by: {item.reporter}</Text>
                    <Text style={styles.itemMeta}>Target: {item.reportedUser}</Text>
                    <Text style={styles.itemMeta}>Reports: {item.reportCount}</Text>
                    {item.content && (
                      <Text style={styles.itemContentText} numberOfLines={2}>{item.content}</Text>
                    )}
                  </View>
                </View>

                <View style={styles.itemActions}>
                  <Pressable style={[styles.actionBtn, { backgroundColor: '#22c55e20', borderColor: '#22c55e' }]} testID={`approve-${item.id}`}>
                    <CheckCircle color="#22c55e" size={16} />
                    <Text style={[styles.actionText, { color: '#22c55e' }]}>Approve</Text>
                  </Pressable>
                  <Pressable style={[styles.actionBtn, { backgroundColor: '#ef444420', borderColor: '#ef4444' }]} testID={`reject-${item.id}`}>
                    <X color="#ef4444" size={16} />
                    <Text style={[styles.actionText, { color: '#ef4444' }]}>Reject</Text>
                  </Pressable>
                  <Pressable style={[styles.actionBtn, { backgroundColor: '#f59e0b20', borderColor: '#f59e0b' }]} testID={`ban-${item.id}`}>
                    <Ban color="#f59e0b" size={16} />
                    <Text style={[styles.actionText, { color: '#f59e0b' }]}>Ban</Text>
                  </Pressable>
                  <Pressable style={[styles.actionBtn, { backgroundColor: '#3b82f620', borderColor: '#3b82f6' }]} testID={`view-${item.id}`}>
                    <Eye color="#3b82f6" size={16} />
                    <Text style={[styles.actionText, { color: '#3b82f6' }]}>View</Text>
                  </Pressable>
                  <Pressable style={styles.moreBtn} testID={`more-${item.id}`}>
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
  queueContainer: { padding: 16, borderRadius: 12, borderWidth: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  headerTitle: { color: '#fff', fontSize: 16, fontWeight: '600' as const },
  headerActions: { flexDirection: 'row', gap: 8 },
  bulkActionBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6, backgroundColor: '#0f172a', borderWidth: 1, borderColor: '#1f2937' },
  bulkActionText: { color: '#cbd5e1', fontSize: 12 },
  moderationItem: { marginBottom: 12, borderWidth: 1, borderRadius: 12, padding: 16 },
  itemHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  itemInfo: { flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 },
  itemTitle: { color: '#fff', fontWeight: '600' as const, flex: 1 },
  priorityBadge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, borderWidth: 1 },
  priorityText: { fontSize: 10, fontWeight: '500' as const, textTransform: 'uppercase' as const },
  statusBadge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, borderWidth: 1 },
  statusText: { fontSize: 10, fontWeight: '500' as const, textTransform: 'capitalize' as const },
  timeAgo: { color: '#94a3b8', fontSize: 12 },
  itemContent: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  itemArtwork: { width: 48, height: 48, borderRadius: 8 },
  itemDetails: { flex: 1, gap: 4 },
  itemReason: { color: '#cbd5e1', fontWeight: '500' as const },
  itemMeta: { color: '#94a3b8', fontSize: 12 },
  itemContentText: { color: '#94a3b8', fontSize: 12, fontStyle: 'italic' as const, marginTop: 4 },
  itemActions: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6, borderWidth: 1 },
  actionText: { fontSize: 12, fontWeight: '500' as const },
  moreBtn: { padding: 6, borderRadius: 6, backgroundColor: '#111827' },
});