import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput } from 'react-native';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { 
  FileText, Search, Plus, Download, CheckCircle, AlertTriangle, 
  BarChart3, Shield, Clock, TrendingUp
} from 'lucide-react-native';

interface Framework {
  id: string;
  name: string;
  version: string;
  coverage: number;
  requirements: number;
  mappedControls: number;
  lastUpdated: string;
  status: 'active' | 'draft' | 'archived';
}

const mockFrameworks: Framework[] = [
  {
    id: 'soc2',
    name: 'SOC 2 Type II',
    version: '2017',
    coverage: 94,
    requirements: 64,
    mappedControls: 60,
    lastUpdated: '2 days ago',
    status: 'active'
  },
  {
    id: 'iso27001',
    name: 'ISO 27001',
    version: '2013/2022',
    coverage: 89,
    requirements: 114,
    mappedControls: 101,
    lastUpdated: '1 week ago',
    status: 'active'
  },
  {
    id: 'hipaa',
    name: 'HIPAA Security Rule',
    version: '2013',
    coverage: 76,
    requirements: 42,
    mappedControls: 32,
    lastUpdated: '3 days ago',
    status: 'active'
  },
  {
    id: 'gdpr',
    name: 'GDPR',
    version: '2016/679',
    coverage: 82,
    requirements: 37,
    mappedControls: 30,
    lastUpdated: '5 days ago',
    status: 'active'
  },
  {
    id: 'pci-dss',
    name: 'PCI DSS',
    version: '4.0',
    coverage: 45,
    requirements: 78,
    mappedControls: 35,
    lastUpdated: '2 weeks ago',
    status: 'draft'
  }
];

export default function FrameworksPage() {
  const [searchQuery, setSearchQuery] = useState<string>('');

  const getCoverageColor = (coverage: number) => {
    if (coverage >= 90) return '#22c55e';
    if (coverage >= 75) return '#f59e0b';
    return '#ef4444';
  };

  const getStatusColor = (status: Framework['status']) => {
    switch (status) {
      case 'active': return '#22c55e';
      case 'draft': return '#f59e0b';
      case 'archived': return '#94a3b8';
    }
  };

  const filteredFrameworks = mockFrameworks.filter(framework =>
    framework.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    framework.version.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayout title="Compliance Frameworks">
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} testID="frameworks-page">
        {/* Header Actions */}
        <View style={styles.headerActions}>
          <View style={styles.searchContainer}>
            <Search color="#94a3b8" size={16} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search frameworks..."
              placeholderTextColor="#94a3b8"
              value={searchQuery}
              onChangeText={setSearchQuery}
              testID="frameworks-search"
            />
          </View>
          <Pressable style={styles.actionButton} testID="import-framework">
            <Plus color="#22c55e" size={16} />
            <Text style={styles.actionButtonText}>Import Framework</Text>
          </Pressable>
        </View>

        {/* Framework Coverage Overview */}
        <View style={[styles.card, { backgroundColor: '#111315', borderColor: '#1f2937' }]}>
          <View style={styles.cardHeader}>
            <BarChart3 color="#22c55e" size={18} />
            <Text style={styles.cardTitle}>Coverage Overview</Text>
          </View>
          <View style={styles.coverageGrid}>
            <View style={styles.coverageItem}>
              <Text style={[styles.coverageValue, { color: '#22c55e' }]}>87%</Text>
              <Text style={styles.coverageLabel}>Average Coverage</Text>
            </View>
            <View style={styles.coverageItem}>
              <Text style={[styles.coverageValue, { color: '#3b82f6' }]}>5</Text>
              <Text style={styles.coverageLabel}>Active Frameworks</Text>
            </View>
            <View style={styles.coverageItem}>
              <Text style={[styles.coverageValue, { color: '#f59e0b' }]}>335</Text>
              <Text style={styles.coverageLabel}>Total Requirements</Text>
            </View>
            <View style={styles.coverageItem}>
              <Text style={[styles.coverageValue, { color: '#8b5cf6' }]}>258</Text>
              <Text style={styles.coverageLabel}>Mapped Controls</Text>
            </View>
          </View>
        </View>

        {/* Frameworks List */}
        <View style={[styles.card, { backgroundColor: '#111315', borderColor: '#1f2937' }]}>
          <View style={styles.cardHeader}>
            <FileText color="#3b82f6" size={18} />
            <Text style={styles.cardTitle}>Compliance Frameworks ({filteredFrameworks.length})</Text>
          </View>
          
          {filteredFrameworks.map((framework) => (
            <View key={framework.id} style={styles.frameworkRow}>
              <View style={styles.frameworkMain}>
                <View style={styles.frameworkHeader}>
                  <View style={styles.frameworkInfo}>
                    <Text style={styles.frameworkName}>{framework.name}</Text>
                    <Text style={styles.frameworkVersion}>v{framework.version}</Text>
                  </View>
                  <View style={styles.frameworkBadges}>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(framework.status) + '20', borderColor: getStatusColor(framework.status) }]}>
                      <Text style={[styles.statusText, { color: getStatusColor(framework.status) }]}>
                        {framework.status.toUpperCase()}
                      </Text>
                    </View>
                  </View>
                </View>
                
                <View style={styles.frameworkMetrics}>
                  <View style={styles.metricItem}>
                    <View style={styles.coverageBar}>
                      <View 
                        style={[
                          styles.coverageProgress, 
                          { 
                            width: `${framework.coverage}%`, 
                            backgroundColor: getCoverageColor(framework.coverage) 
                          }
                        ]} 
                      />
                    </View>
                    <Text style={[styles.coverageText, { color: getCoverageColor(framework.coverage) }]}>
                      {framework.coverage}% Coverage
                    </Text>
                  </View>
                  
                  <View style={styles.requirementsGrid}>
                    <View style={styles.requirementItem}>
                      <Shield color="#3b82f6" size={14} />
                      <Text style={styles.requirementText}>{framework.requirements} Requirements</Text>
                    </View>
                    <View style={styles.requirementItem}>
                      <CheckCircle color="#22c55e" size={14} />
                      <Text style={styles.requirementText}>{framework.mappedControls} Mapped</Text>
                    </View>
                    <View style={styles.requirementItem}>
                      <AlertTriangle color="#f59e0b" size={14} />
                      <Text style={styles.requirementText}>{framework.requirements - framework.mappedControls} Gaps</Text>
                    </View>
                  </View>
                </View>
                
                <View style={styles.frameworkMeta}>
                  <Clock color="#94a3b8" size={12} />
                  <Text style={styles.frameworkMetaText}>Updated {framework.lastUpdated}</Text>
                </View>
              </View>
              
              <View style={styles.frameworkActions}>
                <Pressable style={styles.actionBtn} testID={`view-framework-${framework.id}`}>
                  <Text style={styles.actionBtnText}>View</Text>
                </Pressable>
                <Pressable style={styles.actionBtn} testID={`export-framework-${framework.id}`}>
                  <Download color="#94a3b8" size={14} />
                </Pressable>
              </View>
            </View>
          ))}
        </View>

        {/* Gap Analysis Summary */}
        <View style={[styles.card, { backgroundColor: '#111315', borderColor: '#1f2937' }]}>
          <View style={styles.cardHeader}>
            <AlertTriangle color="#f59e0b" size={18} />
            <Text style={styles.cardTitle}>Gap Analysis Summary</Text>
          </View>
          
          <View style={styles.gapsList}>
            <View style={styles.gapItem}>
              <View style={[styles.gapDot, { backgroundColor: '#ef4444' }]} />
              <Text style={styles.gapText}>Access control requirements not fully mapped</Text>
              <Text style={styles.gapFramework}>HIPAA</Text>
            </View>
            <View style={styles.gapItem}>
              <View style={[styles.gapDot, { backgroundColor: '#f59e0b' }]} />
              <Text style={styles.gapText}>Data retention policies need review</Text>
              <Text style={styles.gapFramework}>GDPR</Text>
            </View>
            <View style={styles.gapItem}>
              <View style={[styles.gapDot, { backgroundColor: '#f59e0b' }]} />
              <Text style={styles.gapText}>Incident response procedures incomplete</Text>
              <Text style={styles.gapFramework}>ISO 27001</Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <Pressable style={[styles.quickButton, { backgroundColor: '#22c55e' }]} testID="map-controls">
            <Shield color="#fff" size={16} />
            <Text style={styles.quickButtonText}>Map Controls</Text>
          </Pressable>
          <Pressable style={[styles.quickButton, { backgroundColor: '#3b82f6' }]} testID="generate-report">
            <TrendingUp color="#fff" size={16} />
            <Text style={styles.quickButtonText}>Generate Report</Text>
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
  coverageGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  coverageItem: {
    alignItems: 'center',
  },
  coverageValue: {
    fontSize: 20,
    fontWeight: '700' as const,
  },
  coverageLabel: {
    color: '#94a3b8',
    fontSize: 11,
    marginTop: 4,
  },
  frameworkRow: {
    flexDirection: 'row',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1f2937',
  },
  frameworkMain: {
    flex: 1,
  },
  frameworkHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  frameworkInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  frameworkName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600' as const,
  },
  frameworkVersion: {
    color: '#94a3b8',
    fontSize: 12,
    backgroundColor: '#1f2937',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  frameworkBadges: {
    flexDirection: 'row',
    gap: 6,
  },
  statusBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600' as const,
  },
  frameworkMetrics: {
    marginBottom: 8,
  },
  metricItem: {
    marginBottom: 8,
  },
  coverageBar: {
    height: 6,
    backgroundColor: '#1f2937',
    borderRadius: 3,
    marginBottom: 4,
  },
  coverageProgress: {
    height: '100%',
    borderRadius: 3,
  },
  coverageText: {
    fontSize: 12,
    fontWeight: '600' as const,
  },
  requirementsGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  requirementText: {
    color: '#cbd5e1',
    fontSize: 12,
  },
  frameworkMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  frameworkMetaText: {
    color: '#94a3b8',
    fontSize: 11,
  },
  frameworkActions: {
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
  gapsList: {
    gap: 8,
  },
  gapItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  gapDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  gapText: {
    color: '#cbd5e1',
    flex: 1,
    fontSize: 13,
  },
  gapFramework: {
    color: '#94a3b8',
    fontSize: 11,
    backgroundColor: '#1f2937',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
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