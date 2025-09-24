import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput } from 'react-native';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { 
  FileText, Search, Plus, Edit, Globe, CheckCircle, 
  Clock, AlertTriangle, Users, Calendar, Eye
} from 'lucide-react-native';

interface Policy {
  id: string;
  title: string;
  version: string;
  status: 'draft' | 'published' | 'archived' | 'review';
  ackRequired: boolean;
  lastPublished: string;
  category: string;
  assignedRoles: string[];
  completionRate: number;
  totalAssignees: number;
  completedAssignees: number;
}

const mockPolicies: Policy[] = [
  {
    id: 'pol-001',
    title: 'Information Security Policy',
    version: '2.1',
    status: 'published',
    ackRequired: true,
    lastPublished: '2024-01-15T10:00:00Z',
    category: 'Security',
    assignedRoles: ['All Employees', 'Contractors'],
    completionRate: 94,
    totalAssignees: 247,
    completedAssignees: 232
  },
  {
    id: 'pol-002',
    title: 'Data Privacy Policy',
    version: '1.8',
    status: 'published',
    ackRequired: true,
    lastPublished: '2024-02-01T14:30:00Z',
    category: 'Privacy',
    assignedRoles: ['All Employees'],
    completionRate: 87,
    totalAssignees: 247,
    completedAssignees: 215
  },
  {
    id: 'pol-003',
    title: 'Incident Response Procedures',
    version: '3.0',
    status: 'review',
    ackRequired: true,
    lastPublished: '2023-11-20T09:15:00Z',
    category: 'Security',
    assignedRoles: ['Security Team', 'DevOps Team', 'Management'],
    completionRate: 76,
    totalAssignees: 45,
    completedAssignees: 34
  },
  {
    id: 'pol-004',
    title: 'Remote Work Guidelines',
    version: '1.2',
    status: 'published',
    ackRequired: false,
    lastPublished: '2024-03-01T11:45:00Z',
    category: 'HR',
    assignedRoles: ['All Employees'],
    completionRate: 100,
    totalAssignees: 247,
    completedAssignees: 247
  },
  {
    id: 'pol-005',
    title: 'Vendor Management Policy',
    version: '2.3',
    status: 'draft',
    ackRequired: true,
    lastPublished: '2023-12-10T16:20:00Z',
    category: 'Procurement',
    assignedRoles: ['Procurement Team', 'Legal Team', 'Security Team'],
    completionRate: 0,
    totalAssignees: 12,
    completedAssignees: 0
  }
];

export default function PoliciesPage() {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const getStatusColor = (status: Policy['status']) => {
    switch (status) {
      case 'draft': return '#94a3b8';
      case 'published': return '#22c55e';
      case 'archived': return '#6b7280';
      case 'review': return '#f59e0b';
    }
  };

  const getStatusIcon = (status: Policy['status']) => {
    switch (status) {
      case 'draft': return <Edit color="#94a3b8" size={14} />;
      case 'published': return <Globe color="#22c55e" size={14} />;
      case 'archived': return <FileText color="#6b7280" size={14} />;
      case 'review': return <AlertTriangle color="#f59e0b" size={14} />;
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

  const filteredPolicies = mockPolicies.filter(policy => {
    const matchesSearch = policy.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         policy.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || policy.status === selectedStatus;
    const matchesCategory = selectedCategory === 'all' || policy.category === selectedCategory;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const uniqueCategories = Array.from(new Set(mockPolicies.map(p => p.category)));

  return (
    <AdminLayout title="Policy Management">
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} testID="policies-page">
        {/* Header Actions */}
        <View style={styles.headerActions}>
          <View style={styles.searchContainer}>
            <Search color="#94a3b8" size={16} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search policies..."
              placeholderTextColor="#94a3b8"
              value={searchQuery}
              onChangeText={setSearchQuery}
              testID="policies-search"
            />
          </View>
          <Pressable style={styles.actionButton} testID="new-policy">
            <Plus color="#22c55e" size={16} />
            <Text style={styles.actionButtonText}>New Policy</Text>
          </Pressable>
        </View>

        {/* Filter Pills */}
        <View style={styles.filterSection}>
          <View style={styles.filterGroup}>
            <Text style={styles.filterLabel}>Status:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.pillsContainer}>
                {['all', 'draft', 'published', 'review', 'archived'].map((status) => (
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

          <View style={styles.filterGroup}>
            <Text style={styles.filterLabel}>Category:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.pillsContainer}>
                <Pressable
                  style={[styles.pill, selectedCategory === 'all' && styles.pillActive]}
                  onPress={() => setSelectedCategory('all')}
                  testID="category-filter-all"
                >
                  <Text style={[styles.pillText, selectedCategory === 'all' && styles.pillTextActive]}>
                    All
                  </Text>
                </Pressable>
                {uniqueCategories.map((category) => (
                  <Pressable
                    key={category}
                    style={[styles.pill, selectedCategory === category && styles.pillActive]}
                    onPress={() => setSelectedCategory(category)}
                    testID={`category-filter-${category}`}
                  >
                    <Text style={[styles.pillText, selectedCategory === category && styles.pillTextActive]}>
                      {category}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </ScrollView>
          </View>
        </View>

        {/* Policies Overview */}
        <View style={[styles.card, { backgroundColor: '#111315', borderColor: '#1f2937' }]}>
          <View style={styles.cardHeader}>
            <FileText color="#22c55e" size={18} />
            <Text style={styles.cardTitle}>Policies Overview</Text>
          </View>
          <View style={styles.overviewGrid}>
            <View style={styles.overviewItem}>
              <Text style={[styles.overviewValue, { color: '#3b82f6' }]}>23</Text>
              <Text style={styles.overviewLabel}>Total Policies</Text>
            </View>
            <View style={styles.overviewItem}>
              <Text style={[styles.overviewValue, { color: '#22c55e' }]}>18</Text>
              <Text style={styles.overviewLabel}>Published</Text>
            </View>
            <View style={styles.overviewItem}>
              <Text style={[styles.overviewValue, { color: '#f59e0b' }]}>3</Text>
              <Text style={styles.overviewLabel}>Need Review</Text>
            </View>
            <View style={styles.overviewItem}>
              <Text style={[styles.overviewValue, { color: '#8b5cf6' }]}>89%</Text>
              <Text style={styles.overviewLabel}>Avg Completion</Text>
            </View>
          </View>
        </View>

        {/* Acknowledgment Status */}
        <View style={[styles.card, { backgroundColor: '#111315', borderColor: '#1f2937' }]}>
          <View style={styles.cardHeader}>
            <CheckCircle color="#3b82f6" size={18} />
            <Text style={styles.cardTitle}>Acknowledgment Status</Text>
          </View>
          <View style={styles.ackStats}>
            <View style={styles.ackItem}>
              <Text style={styles.ackLabel}>Overdue acknowledgments:</Text>
              <Text style={[styles.ackValue, { color: '#ef4444' }]}>47 employees</Text>
            </View>
            <View style={styles.ackItem}>
              <Text style={styles.ackLabel}>Due this week:</Text>
              <Text style={[styles.ackValue, { color: '#f59e0b' }]}>23 employees</Text>
            </View>
            <View style={styles.ackItem}>
              <Text style={styles.ackLabel}>Completed this month:</Text>
              <Text style={[styles.ackValue, { color: '#22c55e' }]}>156 acknowledgments</Text>
            </View>
          </View>
        </View>

        {/* Policies List */}
        <View style={[styles.card, { backgroundColor: '#111315', borderColor: '#1f2937' }]}>
          <View style={styles.cardHeader}>
            <FileText color="#3b82f6" size={18} />
            <Text style={styles.cardTitle}>Policies ({filteredPolicies.length})</Text>
          </View>
          
          {filteredPolicies.map((policy) => (
            <View key={policy.id} style={styles.policyRow}>
              <View style={styles.policyMain}>
                <View style={styles.policyHeader}>
                  <View style={styles.policyInfo}>
                    <Text style={styles.policyTitle}>{policy.title}</Text>
                    <View style={styles.policyMeta}>
                      <Text style={styles.policyVersion}>v{policy.version}</Text>
                      <Text style={styles.policyCategory}>{policy.category}</Text>
                    </View>
                  </View>
                  <View style={styles.policyBadges}>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(policy.status) + '20', borderColor: getStatusColor(policy.status) }]}>
                      {getStatusIcon(policy.status)}
                      <Text style={[styles.statusText, { color: getStatusColor(policy.status) }]}>
                        {policy.status.toUpperCase()}
                      </Text>
                    </View>
                    {policy.ackRequired && (
                      <View style={styles.ackBadge}>
                        <CheckCircle color="#3b82f6" size={12} />
                        <Text style={styles.ackBadgeText}>ACK REQ</Text>
                      </View>
                    )}
                  </View>
                </View>
                
                {policy.ackRequired && (
                  <View style={styles.completionSection}>
                    <View style={styles.completionInfo}>
                      <Text style={styles.completionText}>
                        {policy.completedAssignees} / {policy.totalAssignees} completed
                      </Text>
                      <Text style={[styles.completionPercent, { color: getCompletionColor(policy.completionRate) }]}>
                        {policy.completionRate}%
                      </Text>
                    </View>
                    <View style={styles.completionBar}>
                      <View 
                        style={[
                          styles.completionFill, 
                          { 
                            width: `${policy.completionRate}%`, 
                            backgroundColor: getCompletionColor(policy.completionRate) 
                          }
                        ]} 
                      />
                    </View>
                  </View>
                )}
                
                <View style={styles.policyDetails}>
                  <View style={styles.detailRow}>
                    <Users color="#94a3b8" size={12} />
                    <Text style={styles.detailText}>
                      Assigned to: {policy.assignedRoles.join(', ')}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Calendar color="#94a3b8" size={12} />
                    <Text style={styles.detailText}>
                      Last published: {formatDate(policy.lastPublished)}
                    </Text>
                  </View>
                </View>
              </View>
              
              <View style={styles.policyActions}>
                <Pressable style={styles.actionBtn} testID={`edit-policy-${policy.id}`}>
                  <Edit color="#94a3b8" size={14} />
                </Pressable>
                <Pressable style={styles.actionBtn} testID={`view-policy-${policy.id}`}>
                  <Eye color="#94a3b8" size={14} />
                </Pressable>
                {policy.status === 'draft' && (
                  <Pressable style={[styles.actionBtn, { backgroundColor: '#22c55e' }]} testID={`publish-policy-${policy.id}`}>
                    <Globe color="#fff" size={14} />
                  </Pressable>
                )}
              </View>
            </View>
          ))}
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <Pressable style={[styles.quickButton, { backgroundColor: '#22c55e' }]} testID="publish-all">
            <Globe color="#fff" size={16} />
            <Text style={styles.quickButtonText}>Publish Drafts</Text>
          </Pressable>
          <Pressable style={[styles.quickButton, { backgroundColor: '#f59e0b' }]} testID="send-reminders">
            <Clock color="#fff" size={16} />
            <Text style={styles.quickButtonText}>Send Reminders</Text>
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
    backgroundColor: '#22c55e',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 6,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600' as const,
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
  ackStats: {
    gap: 8,
  },
  ackItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ackLabel: {
    color: '#cbd5e1',
    fontSize: 13,
  },
  ackValue: {
    fontSize: 13,
    fontWeight: '600' as const,
  },
  policyRow: {
    flexDirection: 'row',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1f2937',
  },
  policyMain: {
    flex: 1,
  },
  policyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  policyInfo: {
    flex: 1,
  },
  policyTitle: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600' as const,
  },
  policyMeta: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 2,
  },
  policyVersion: {
    color: '#94a3b8',
    fontSize: 11,
    backgroundColor: '#1f2937',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  policyCategory: {
    color: '#94a3b8',
    fontSize: 11,
    backgroundColor: '#1f2937',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  policyBadges: {
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
  ackBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    backgroundColor: '#3b82f620',
    borderWidth: 1,
    borderColor: '#3b82f6',
    gap: 4,
  },
  ackBadgeText: {
    color: '#3b82f6',
    fontSize: 10,
    fontWeight: '600' as const,
  },
  completionSection: {
    marginBottom: 8,
  },
  completionInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  completionText: {
    color: '#cbd5e1',
    fontSize: 12,
  },
  completionPercent: {
    fontSize: 12,
    fontWeight: '600' as const,
  },
  completionBar: {
    height: 4,
    backgroundColor: '#1f2937',
    borderRadius: 2,
  },
  completionFill: {
    height: '100%',
    borderRadius: 2,
  },
  policyDetails: {
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
  policyActions: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  actionBtn: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: '#1f2937',
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