import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput } from 'react-native';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { 
  MessageSquare, Search, Plus, Download, Calendar, 
  CheckCircle, Clock, AlertTriangle, FileText, Share, Zap
} from 'lucide-react-native';

interface Questionnaire {
  id: string;
  name: string;
  counterparty: string;
  status: 'draft' | 'in_progress' | 'review' | 'completed' | 'sent';
  progress: number;
  dueAt: string;
  type: 'SIG' | 'CAIQ' | 'Custom' | 'VSA';
  questionsTotal: number;
  questionsAnswered: number;
  lastUpdated: string;
}

const mockQuestionnaires: Questionnaire[] = [
  {
    id: 'q-001',
    name: 'Enterprise Security Assessment',
    counterparty: 'Acme Corp',
    status: 'in_progress',
    progress: 67,
    dueAt: '2024-03-25',
    type: 'SIG',
    questionsTotal: 150,
    questionsAnswered: 101,
    lastUpdated: '2024-03-15T10:30:00Z'
  },
  {
    id: 'q-002',
    name: 'Cloud Security Review',
    counterparty: 'TechStart Inc',
    status: 'review',
    progress: 100,
    dueAt: '2024-03-20',
    type: 'CAIQ',
    questionsTotal: 87,
    questionsAnswered: 87,
    lastUpdated: '2024-03-14T16:45:00Z'
  },
  {
    id: 'q-003',
    name: 'Vendor Risk Assessment',
    counterparty: 'Global Solutions',
    status: 'completed',
    progress: 100,
    dueAt: '2024-03-18',
    type: 'Custom',
    questionsTotal: 45,
    questionsAnswered: 45,
    lastUpdated: '2024-03-12T14:20:00Z'
  },
  {
    id: 'q-004',
    name: 'SOC 2 Readiness Check',
    counterparty: 'Internal Audit',
    status: 'draft',
    progress: 23,
    dueAt: '2024-04-01',
    type: 'Custom',
    questionsTotal: 120,
    questionsAnswered: 28,
    lastUpdated: '2024-03-13T09:15:00Z'
  },
  {
    id: 'q-005',
    name: 'Third Party Security Review',
    counterparty: 'MegaCorp Ltd',
    status: 'sent',
    progress: 100,
    dueAt: '2024-03-22',
    type: 'VSA',
    questionsTotal: 200,
    questionsAnswered: 200,
    lastUpdated: '2024-03-11T11:30:00Z'
  }
];

export default function QuestionnairesPage() {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');

  const getStatusColor = (status: Questionnaire['status']) => {
    switch (status) {
      case 'draft': return '#94a3b8';
      case 'in_progress': return '#3b82f6';
      case 'review': return '#f59e0b';
      case 'completed': return '#22c55e';
      case 'sent': return '#8b5cf6';
    }
  };

  const getStatusIcon = (status: Questionnaire['status']) => {
    switch (status) {
      case 'draft': return <FileText color="#94a3b8" size={14} />;
      case 'in_progress': return <Clock color="#3b82f6" size={14} />;
      case 'review': return <AlertTriangle color="#f59e0b" size={14} />;
      case 'completed': return <CheckCircle color="#22c55e" size={14} />;
      case 'sent': return <Share color="#8b5cf6" size={14} />;
    }
  };

  const getTypeColor = (type: Questionnaire['type']) => {
    switch (type) {
      case 'SIG': return '#3b82f6';
      case 'CAIQ': return '#22c55e';
      case 'Custom': return '#f59e0b';
      case 'VSA': return '#8b5cf6';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatLastUpdated = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else {
      const diffDays = Math.floor(diffHours / 24);
      return `${diffDays}d ago`;
    }
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  const filteredQuestionnaires = mockQuestionnaires.filter(q => {
    const matchesSearch = q.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         q.counterparty.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || q.status === selectedStatus;
    const matchesType = selectedType === 'all' || q.type === selectedType;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <AdminLayout title="Security Questionnaires">
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} testID="questionnaires-page">
        {/* Header Actions */}
        <View style={styles.headerActions}>
          <View style={styles.searchContainer}>
            <Search color="#94a3b8" size={16} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search questionnaires..."
              placeholderTextColor="#94a3b8"
              value={searchQuery}
              onChangeText={setSearchQuery}
              testID="questionnaires-search"
            />
          </View>
          <Pressable style={styles.actionButton} testID="new-questionnaire">
            <Plus color="#22c55e" size={16} />
            <Text style={styles.actionButtonText}>New</Text>
          </Pressable>
          <Pressable style={styles.actionButton} testID="import-template">
            <Download color="#3b82f6" size={16} />
            <Text style={styles.actionButtonText}>Import</Text>
          </Pressable>
        </View>

        {/* Filter Pills */}
        <View style={styles.filterSection}>
          <View style={styles.filterGroup}>
            <Text style={styles.filterLabel}>Status:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.pillsContainer}>
                {['all', 'draft', 'in_progress', 'review', 'completed', 'sent'].map((status) => (
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
                      {status.replace('_', ' ').charAt(0).toUpperCase() + status.replace('_', ' ').slice(1)}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </ScrollView>
          </View>

          <View style={styles.filterGroup}>
            <Text style={styles.filterLabel}>Type:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.pillsContainer}>
                {['all', 'SIG', 'CAIQ', 'Custom', 'VSA'].map((type) => (
                  <Pressable
                    key={type}
                    style={[
                      styles.pill,
                      selectedType === type && styles.pillActive
                    ]}
                    onPress={() => setSelectedType(type)}
                    testID={`type-filter-${type}`}
                  >
                    <Text style={[
                      styles.pillText,
                      selectedType === type && styles.pillTextActive
                    ]}>
                      {type}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </ScrollView>
          </View>
        </View>

        {/* Questionnaires Overview */}
        <View style={[styles.card, { backgroundColor: '#111315', borderColor: '#1f2937' }]}>
          <View style={styles.cardHeader}>
            <MessageSquare color="#22c55e" size={18} />
            <Text style={styles.cardTitle}>Questionnaires Overview</Text>
          </View>
          <View style={styles.overviewGrid}>
            <View style={styles.overviewItem}>
              <Text style={[styles.overviewValue, { color: '#3b82f6' }]}>47</Text>
              <Text style={styles.overviewLabel}>Total</Text>
            </View>
            <View style={styles.overviewItem}>
              <Text style={[styles.overviewValue, { color: '#f59e0b' }]}>12</Text>
              <Text style={styles.overviewLabel}>In Progress</Text>
            </View>
            <View style={styles.overviewItem}>
              <Text style={[styles.overviewValue, { color: '#ef4444' }]}>3</Text>
              <Text style={styles.overviewLabel}>Overdue</Text>
            </View>
            <View style={styles.overviewItem}>
              <Text style={[styles.overviewValue, { color: '#22c55e' }]}>23</Text>
              <Text style={styles.overviewLabel}>Completed</Text>
            </View>
          </View>
        </View>

        {/* Questionnaires List */}
        <View style={[styles.card, { backgroundColor: '#111315', borderColor: '#1f2937' }]}>
          <View style={styles.cardHeader}>
            <FileText color="#3b82f6" size={18} />
            <Text style={styles.cardTitle}>Questionnaires ({filteredQuestionnaires.length})</Text>
          </View>
          
          {filteredQuestionnaires.map((questionnaire) => (
            <View key={questionnaire.id} style={styles.questionnaireRow}>
              <View style={styles.questionnaireMain}>
                <View style={styles.questionnaireHeader}>
                  <View style={styles.questionnaireInfo}>
                    <Text style={styles.questionnaireName}>{questionnaire.name}</Text>
                    <Text style={styles.questionnaireCounterparty}>{questionnaire.counterparty}</Text>
                  </View>
                  <View style={styles.questionnaireBadges}>
                    <View style={[styles.typeBadge, { backgroundColor: getTypeColor(questionnaire.type) + '20', borderColor: getTypeColor(questionnaire.type) }]}>
                      <Text style={[styles.typeText, { color: getTypeColor(questionnaire.type) }]}>
                        {questionnaire.type}
                      </Text>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(questionnaire.status) + '20', borderColor: getStatusColor(questionnaire.status) }]}>
                      {getStatusIcon(questionnaire.status)}
                      <Text style={[styles.statusText, { color: getStatusColor(questionnaire.status) }]}>
                        {questionnaire.status.replace('_', ' ').toUpperCase()}
                      </Text>
                    </View>
                  </View>
                </View>
                
                <View style={styles.progressSection}>
                  <View style={styles.progressInfo}>
                    <Text style={styles.progressText}>
                      {questionnaire.questionsAnswered} / {questionnaire.questionsTotal} questions
                    </Text>
                    <Text style={[styles.progressPercent, { color: getStatusColor(questionnaire.status) }]}>
                      {questionnaire.progress}%
                    </Text>
                  </View>
                  <View style={styles.progressBar}>
                    <View 
                      style={[
                        styles.progressFill, 
                        { 
                          width: `${questionnaire.progress}%`, 
                          backgroundColor: getStatusColor(questionnaire.status) 
                        }
                      ]} 
                    />
                  </View>
                </View>
                
                <View style={styles.questionnaireDetails}>
                  <View style={styles.detailRow}>
                    <Calendar color="#94a3b8" size={12} />
                    <Text style={[
                      styles.detailText,
                      isOverdue(questionnaire.dueAt) && { color: '#ef4444' }
                    ]}>
                      Due: {formatDate(questionnaire.dueAt)}
                      {isOverdue(questionnaire.dueAt) && ' (Overdue)'}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Clock color="#94a3b8" size={12} />
                    <Text style={styles.detailText}>
                      Updated: {formatLastUpdated(questionnaire.lastUpdated)}
                    </Text>
                  </View>
                </View>
              </View>
              
              <View style={styles.questionnaireActions}>
                <Pressable style={styles.actionBtn} testID={`edit-questionnaire-${questionnaire.id}`}>
                  <Text style={styles.actionBtnText}>Edit</Text>
                </Pressable>
                {questionnaire.status === 'completed' && (
                  <Pressable style={styles.actionBtn} testID={`export-questionnaire-${questionnaire.id}`}>
                    <Download color="#94a3b8" size={14} />
                  </Pressable>
                )}
              </View>
            </View>
          ))}
        </View>

        {/* AI Assistant */}
        <View style={[styles.card, { backgroundColor: '#111315', borderColor: '#8b5cf6' }]}>
          <View style={styles.cardHeader}>
            <Zap color="#8b5cf6" size={18} />
            <Text style={styles.cardTitle}>AI Assistant</Text>
          </View>
          <Text style={styles.aiText}>
            Use AI to auto-draft questionnaire responses based on your existing controls, 
            policies, and evidence. Responses include citations and can be reviewed before submission.
          </Text>
          <View style={styles.aiActions}>
            <Pressable style={[styles.aiButton, { backgroundColor: '#8b5cf6' }]} testID="auto-draft-answers">
              <Zap color="#fff" size={16} />
              <Text style={styles.aiButtonText}>Auto-Draft Answers</Text>
            </Pressable>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <Pressable style={[styles.quickButton, { backgroundColor: '#22c55e' }]} testID="bulk-export">
            <Download color="#fff" size={16} />
            <Text style={styles.quickButtonText}>Export All</Text>
          </Pressable>
          <Pressable style={[styles.quickButton, { backgroundColor: '#3b82f6' }]} testID="share-portal">
            <Share color="#fff" size={16} />
            <Text style={styles.quickButtonText}>Share Portal</Text>
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
  questionnaireRow: {
    flexDirection: 'row',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1f2937',
  },
  questionnaireMain: {
    flex: 1,
  },
  questionnaireHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  questionnaireInfo: {
    flex: 1,
  },
  questionnaireName: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600' as const,
  },
  questionnaireCounterparty: {
    color: '#94a3b8',
    fontSize: 12,
    marginTop: 2,
  },
  questionnaireBadges: {
    flexDirection: 'row',
    gap: 6,
  },
  typeBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
  },
  typeText: {
    fontSize: 10,
    fontWeight: '600' as const,
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
  questionnaireDetails: {
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
  questionnaireActions: {
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
  aiText: {
    color: '#cbd5e1',
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 12,
  },
  aiActions: {
    flexDirection: 'row',
  },
  aiButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    gap: 6,
  },
  aiButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600' as const,
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