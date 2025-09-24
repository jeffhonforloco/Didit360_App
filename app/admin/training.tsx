import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput } from 'react-native';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { 
  BookOpen, Search, Plus, Users, Calendar, CheckCircle, 
  Clock, AlertTriangle, TrendingUp, RefreshCw, Download
} from 'lucide-react-native';

interface TrainingAssignment {
  id: string;
  courseName: string;
  provider: 'Internal' | 'KnowBe4' | 'SANS' | 'Coursera' | 'Custom';
  assignees: string[];
  assigneeCount: number;
  dueAt: string;
  status: 'active' | 'completed' | 'overdue' | 'draft';
  completionRate: number;
  completedCount: number;
  category: 'Security' | 'Privacy' | 'Compliance' | 'Technical';
  lastUpdated: string;
}

const mockTrainingAssignments: TrainingAssignment[] = [
  {
    id: 'train-001',
    courseName: 'Security Awareness Training 2024',
    provider: 'KnowBe4',
    assignees: ['All Employees'],
    assigneeCount: 247,
    dueAt: '2024-03-31',
    status: 'active',
    completionRate: 78,
    completedCount: 193,
    category: 'Security',
    lastUpdated: '2024-03-15T10:30:00Z'
  },
  {
    id: 'train-002',
    courseName: 'GDPR Privacy Training',
    provider: 'Internal',
    assignees: ['All Employees', 'Contractors'],
    assigneeCount: 267,
    dueAt: '2024-04-15',
    status: 'active',
    completionRate: 45,
    completedCount: 120,
    category: 'Privacy',
    lastUpdated: '2024-03-14T16:20:00Z'
  },
  {
    id: 'train-003',
    courseName: 'Incident Response Procedures',
    provider: 'SANS',
    assignees: ['Security Team', 'DevOps Team', 'Management'],
    assigneeCount: 45,
    dueAt: '2024-03-20',
    status: 'overdue',
    completionRate: 67,
    completedCount: 30,
    category: 'Security',
    lastUpdated: '2024-03-10T14:15:00Z'
  },
  {
    id: 'train-004',
    courseName: 'SOC 2 Compliance Overview',
    provider: 'Custom',
    assignees: ['Compliance Team', 'Audit Team'],
    assigneeCount: 12,
    dueAt: '2024-04-01',
    status: 'active',
    completionRate: 92,
    completedCount: 11,
    category: 'Compliance',
    lastUpdated: '2024-03-13T09:45:00Z'
  },
  {
    id: 'train-005',
    courseName: 'Secure Coding Practices',
    provider: 'Coursera',
    assignees: ['Engineering Team'],
    assigneeCount: 89,
    dueAt: '2024-05-01',
    status: 'draft',
    completionRate: 0,
    completedCount: 0,
    category: 'Technical',
    lastUpdated: '2024-03-12T11:30:00Z'
  }
];

export default function TrainingPage() {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedProvider, setSelectedProvider] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const getStatusColor = (status: TrainingAssignment['status']) => {
    switch (status) {
      case 'active': return '#3b82f6';
      case 'completed': return '#22c55e';
      case 'overdue': return '#ef4444';
      case 'draft': return '#94a3b8';
    }
  };

  const getStatusIcon = (status: TrainingAssignment['status']) => {
    switch (status) {
      case 'active': return <Clock color="#3b82f6" size={14} />;
      case 'completed': return <CheckCircle color="#22c55e" size={14} />;
      case 'overdue': return <AlertTriangle color="#ef4444" size={14} />;
      case 'draft': return <BookOpen color="#94a3b8" size={14} />;
    }
  };

  const getProviderColor = (provider: TrainingAssignment['provider']) => {
    switch (provider) {
      case 'Internal': return '#8b5cf6';
      case 'KnowBe4': return '#3b82f6';
      case 'SANS': return '#ef4444';
      case 'Coursera': return '#22c55e';
      case 'Custom': return '#f59e0b';
    }
  };

  const getCategoryColor = (category: TrainingAssignment['category']) => {
    switch (category) {
      case 'Security': return '#ef4444';
      case 'Privacy': return '#8b5cf6';
      case 'Compliance': return '#3b82f6';
      case 'Technical': return '#22c55e';
    }
  };

  const getCompletionColor = (rate: number) => {
    if (rate >= 90) return '#22c55e';
    if (rate >= 70) return '#f59e0b';
    return '#ef4444';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  const filteredAssignments = mockTrainingAssignments.filter(assignment => {
    const matchesSearch = assignment.courseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         assignment.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesProvider = selectedProvider === 'all' || assignment.provider === selectedProvider;
    const matchesStatus = selectedStatus === 'all' || assignment.status === selectedStatus;
    
    return matchesSearch && matchesProvider && matchesStatus;
  });

  const uniqueProviders = Array.from(new Set(mockTrainingAssignments.map(t => t.provider)));

  return (
    <AdminLayout title="Training Assignments">
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} testID="training-page">
        {/* Header Actions */}
        <View style={styles.headerActions}>
          <View style={styles.searchContainer}>
            <Search color="#94a3b8" size={16} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search training..."
              placeholderTextColor="#94a3b8"
              value={searchQuery}
              onChangeText={setSearchQuery}
              testID="training-search"
            />
          </View>
          <Pressable style={styles.actionButton} testID="assign-training">
            <Plus color="#22c55e" size={16} />
            <Text style={styles.actionButtonText}>Assign</Text>
          </Pressable>
          <Pressable style={styles.actionButton} testID="sync-providers">
            <RefreshCw color="#3b82f6" size={16} />
            <Text style={styles.actionButtonText}>Sync</Text>
          </Pressable>
        </View>

        {/* Filter Pills */}
        <View style={styles.filterSection}>
          <View style={styles.filterGroup}>
            <Text style={styles.filterLabel}>Provider:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.pillsContainer}>
                <Pressable
                  style={[styles.pill, selectedProvider === 'all' && styles.pillActive]}
                  onPress={() => setSelectedProvider('all')}
                  testID="provider-filter-all"
                >
                  <Text style={[styles.pillText, selectedProvider === 'all' && styles.pillTextActive]}>
                    All
                  </Text>
                </Pressable>
                {uniqueProviders.map((provider) => (
                  <Pressable
                    key={provider}
                    style={[styles.pill, selectedProvider === provider && styles.pillActive]}
                    onPress={() => setSelectedProvider(provider)}
                    testID={`provider-filter-${provider}`}
                  >
                    <Text style={[styles.pillText, selectedProvider === provider && styles.pillTextActive]}>
                      {provider}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </ScrollView>
          </View>

          <View style={styles.filterGroup}>
            <Text style={styles.filterLabel}>Status:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.pillsContainer}>
                {['all', 'active', 'completed', 'overdue', 'draft'].map((status) => (
                  <Pressable
                    key={status}
                    style={[
                      styles.pill,
                      selectedStatus === status && styles.pillActive
                    ]}
                    onPress={() => setSelectedStatus(status)}
                    testID={`status-filter-${status}`}
                  >
                    <Text style={[
                      styles.pillText,
                      selectedStatus === status && styles.pillTextActive
                    ]}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </ScrollView>
          </View>
        </View>

        {/* Training Overview */}
        <View style={[styles.card, { backgroundColor: '#111315', borderColor: '#1f2937' }]}>
          <View style={styles.cardHeader}>
            <TrendingUp color="#22c55e" size={18} />
            <Text style={styles.cardTitle}>Training Overview</Text>
          </View>
          <View style={styles.overviewGrid}>
            <View style={styles.overviewItem}>
              <Text style={[styles.overviewValue, { color: '#3b82f6' }]}>47</Text>
              <Text style={styles.overviewLabel}>Active Courses</Text>
            </View>
            <View style={styles.overviewItem}>
              <Text style={[styles.overviewValue, { color: '#22c55e' }]}>354</Text>
              <Text style={styles.overviewLabel}>Completed</Text>
            </View>
            <View style={styles.overviewItem}>
              <Text style={[styles.overviewValue, { color: '#ef4444' }]}>23</Text>
              <Text style={styles.overviewLabel}>Overdue</Text>
            </View>
            <View style={styles.overviewItem}>
              <Text style={[styles.overviewValue, { color: '#8b5cf6' }]}>73%</Text>
              <Text style={styles.overviewLabel}>Avg Completion</Text>
            </View>
          </View>
        </View>

        {/* Completion Alerts */}
        <View style={[styles.card, { backgroundColor: '#111315', borderColor: '#f59e0b' }]}>
          <View style={styles.cardHeader}>
            <AlertTriangle color="#f59e0b" size={18} />
            <Text style={styles.cardTitle}>Completion Alerts</Text>
          </View>
          <Text style={styles.alertText}>
            Training assignments requiring attention:
          </Text>
          <View style={styles.alertsList}>
            <Text style={styles.alertItem}>• Incident Response: 15 employees overdue</Text>
            <Text style={styles.alertItem}>• GDPR Training: 147 employees pending</Text>
            <Text style={styles.alertItem}>• Security Awareness: Due in 16 days</Text>
          </View>
        </View>

        {/* Training Assignments List */}
        <View style={[styles.card, { backgroundColor: '#111315', borderColor: '#1f2937' }]}>
          <View style={styles.cardHeader}>
            <BookOpen color="#3b82f6" size={18} />
            <Text style={styles.cardTitle}>Training Assignments ({filteredAssignments.length})</Text>
          </View>
          
          {filteredAssignments.map((assignment) => (
            <View key={assignment.id} style={styles.assignmentRow}>
              <View style={styles.assignmentMain}>
                <View style={styles.assignmentHeader}>
                  <View style={styles.assignmentInfo}>
                    <Text style={styles.assignmentName}>{assignment.courseName}</Text>
                    <View style={styles.assignmentMeta}>
                      <View style={[styles.providerBadge, { backgroundColor: getProviderColor(assignment.provider) + '20', borderColor: getProviderColor(assignment.provider) }]}>
                        <Text style={[styles.providerText, { color: getProviderColor(assignment.provider) }]}>
                          {assignment.provider}
                        </Text>
                      </View>
                      <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(assignment.category) + '20', borderColor: getCategoryColor(assignment.category) }]}>
                        <Text style={[styles.categoryText, { color: getCategoryColor(assignment.category) }]}>
                          {assignment.category}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <View style={styles.assignmentBadges}>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(assignment.status) + '20', borderColor: getStatusColor(assignment.status) }]}>
                      {getStatusIcon(assignment.status)}
                      <Text style={[styles.statusText, { color: getStatusColor(assignment.status) }]}>
                        {assignment.status.toUpperCase()}
                      </Text>
                    </View>
                  </View>
                </View>
                
                {assignment.status !== 'draft' && (
                  <View style={styles.progressSection}>
                    <View style={styles.progressInfo}>
                      <Text style={styles.progressText}>
                        {assignment.completedCount} / {assignment.assigneeCount} completed
                      </Text>
                      <Text style={[styles.progressPercent, { color: getCompletionColor(assignment.completionRate) }]}>
                        {assignment.completionRate}%
                      </Text>
                    </View>
                    <View style={styles.progressBar}>
                      <View 
                        style={[
                          styles.progressFill, 
                          { 
                            width: `${assignment.completionRate}%`, 
                            backgroundColor: getCompletionColor(assignment.completionRate) 
                          }
                        ]} 
                      />
                    </View>
                  </View>
                )}
                
                <View style={styles.assignmentDetails}>
                  <View style={styles.detailRow}>
                    <Users color="#94a3b8" size={12} />
                    <Text style={styles.detailText}>
                      Assigned to: {assignment.assignees.join(', ')}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Calendar color="#94a3b8" size={12} />
                    <Text style={[
                      styles.detailText,
                      isOverdue(assignment.dueAt) && assignment.status !== 'completed' && { color: '#ef4444' }
                    ]}>
                      Due: {formatDate(assignment.dueAt)}
                      {isOverdue(assignment.dueAt) && assignment.status !== 'completed' && ' (Overdue)'}
                    </Text>
                  </View>
                </View>
              </View>
              
              <View style={styles.assignmentActions}>
                <Pressable style={styles.actionBtn} testID={`view-assignment-${assignment.id}`}>
                  <Text style={styles.actionBtnText}>View</Text>
                </Pressable>
                <Pressable style={styles.actionBtn} testID={`export-assignment-${assignment.id}`}>
                  <Download color="#94a3b8" size={14} />
                </Pressable>
              </View>
            </View>
          ))}
        </View>

        {/* Provider Integration Status */}
        <View style={[styles.card, { backgroundColor: '#111315', borderColor: '#1f2937' }]}>
          <View style={styles.cardHeader}>
            <RefreshCw color="#3b82f6" size={18} />
            <Text style={styles.cardTitle}>Provider Integration Status</Text>
          </View>
          <View style={styles.providersList}>
            <View style={styles.providerItem}>
              <View style={[styles.providerDot, { backgroundColor: '#22c55e' }]} />
              <Text style={styles.providerLabel}>KnowBe4</Text>
              <Text style={styles.providerStatus}>Connected • Last sync: 2h ago</Text>
            </View>
            <View style={styles.providerItem}>
              <View style={[styles.providerDot, { backgroundColor: '#22c55e' }]} />
              <Text style={styles.providerLabel}>SANS</Text>
              <Text style={styles.providerStatus}>Connected • Last sync: 4h ago</Text>
            </View>
            <View style={styles.providerItem}>
              <View style={[styles.providerDot, { backgroundColor: '#f59e0b' }]} />
              <Text style={styles.providerLabel}>Coursera</Text>
              <Text style={styles.providerStatus}>Connected • Sync pending</Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <Pressable style={[styles.quickButton, { backgroundColor: '#f59e0b' }]} testID="send-reminders">
            <Clock color="#fff" size={16} />
            <Text style={styles.quickButtonText}>Send Reminders</Text>
          </Pressable>
          <Pressable style={[styles.quickButton, { backgroundColor: '#3b82f6' }]} testID="export-report">
            <Download color="#fff" size={16} />
            <Text style={styles.quickButtonText}>Export Report</Text>
          </Pressable>
        </View>
      </ScrollView>
    </AdminLayout>
  );
}

const styles = StyleSheet.create({
  headerActions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1f2937',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    color: '#fff',
    fontSize: 14,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1f2937',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 6,
  },
  actionButtonText: {
    color: '#cbd5e1',
    fontSize: 14,
  },
  filterSection: {
    marginBottom: 16,
    gap: 12,
  },
  filterGroup: {
    gap: 8,
  },
  filterLabel: {
    color: '#cbd5e1',
    fontSize: 12,
    fontWeight: '500' as const,
  },
  pillsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  pill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#1f2937',
    borderWidth: 1,
    borderColor: '#374151',
  },
  pillActive: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  pillText: {
    color: '#cbd5e1',
    fontSize: 12,
    fontWeight: '500' as const,
  },
  pillTextActive: {
    color: '#fff',
  },
  card: {
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  cardTitle: {
    color: '#fff',
    fontWeight: '600' as const,
  },
  overviewGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  overviewItem: {
    alignItems: 'center',
  },
  overviewValue: {
    fontSize: 20,
    fontWeight: '700' as const,
  },
  overviewLabel: {
    color: '#94a3b8',
    fontSize: 11,
    marginTop: 4,
  },
  alertText: {
    color: '#cbd5e1',
    fontSize: 13,
    marginBottom: 8,
  },
  alertsList: {
    gap: 4,
  },
  alertItem: {
    color: '#f59e0b',
    fontSize: 12,
  },
  assignmentRow: {
    flexDirection: 'row',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1f2937',
  },
  assignmentMain: {
    flex: 1,
  },
  assignmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  assignmentInfo: {
    flex: 1,
  },
  assignmentName: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600' as const,
  },
  assignmentMeta: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 4,
  },
  providerBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
  },
  providerText: {
    fontSize: 10,
    fontWeight: '600' as const,
  },
  categoryBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: '600' as const,
  },
  assignmentBadges: {
    flexDirection: 'row',
    gap: 6,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
    gap: 4,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600' as const,
  },
  progressSection: {
    marginBottom: 8,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  progressText: {
    color: '#cbd5e1',
    fontSize: 12,
  },
  progressPercent: {
    fontSize: 12,
    fontWeight: '600' as const,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#1f2937',
    borderRadius: 2,
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  assignmentDetails: {
    gap: 4,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    color: '#94a3b8',
    fontSize: 11,
  },
  assignmentActions: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 6,
    backgroundColor: '#1f2937',
    gap: 4,
  },
  actionBtnText: {
    color: '#cbd5e1',
    fontSize: 12,
  },
  providersList: {
    gap: 8,
  },
  providerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  providerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  providerLabel: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '500' as const,
    minWidth: 80,
  },
  providerStatus: {
    color: '#94a3b8',
    fontSize: 12,
  },
  quickActions: {
    flexDirection: 'row',
    gap: 12,
  },
  quickButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  quickButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600' as const,
  },
});