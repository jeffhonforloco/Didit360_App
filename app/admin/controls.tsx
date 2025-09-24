import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput } from 'react-native';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { 
  ShieldCheck, AlertTriangle, CheckCircle, XCircle, Clock, 
  Search, Filter, Play, Pause, Settings, FileText
} from 'lucide-react-native';

interface Control {
  key: string;
  title: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  lastRun: string;
  status: 'pass' | 'fail' | 'skipped' | 'running';
  frameworks: string[];
  owner: string;
}

const mockControls: Control[] = [
  {
    key: 'IDP.MFA.Required',
    title: 'MFA required for all users',
    severity: 'high',
    lastRun: '2 hours ago',
    status: 'fail',
    frameworks: ['SOC 2', 'ISO 27001'],
    owner: 'Security Team'
  },
  {
    key: 'AWS.S3.NoPublic',
    title: 'No public S3 buckets',
    severity: 'critical',
    lastRun: '1 hour ago',
    status: 'pass',
    frameworks: ['SOC 2', 'ISO 27001', 'GDPR'],
    owner: 'DevOps Team'
  },
  {
    key: 'DB.Encryption.AtRest',
    title: 'Database encryption at rest',
    severity: 'high',
    lastRun: '30 minutes ago',
    status: 'pass',
    frameworks: ['SOC 2', 'HIPAA'],
    owner: 'Database Team'
  },
  {
    key: 'LOG.Retention.Policy',
    title: 'Log retention policy enforced',
    severity: 'medium',
    lastRun: '4 hours ago',
    status: 'fail',
    frameworks: ['SOC 2', 'GDPR'],
    owner: 'Security Team'
  },
  {
    key: 'NET.Firewall.Rules',
    title: 'Network firewall rules configured',
    severity: 'high',
    lastRun: '6 hours ago',
    status: 'running',
    frameworks: ['ISO 27001'],
    owner: 'Network Team'
  }
];

export default function ControlsPage() {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');

  const getStatusIcon = (status: Control['status']) => {
    switch (status) {
      case 'pass': return <CheckCircle color="#22c55e" size={16} />;
      case 'fail': return <XCircle color="#ef4444" size={16} />;
      case 'running': return <Clock color="#3b82f6" size={16} />;
      case 'skipped': return <Pause color="#94a3b8" size={16} />;
    }
  };

  const getSeverityColor = (severity: Control['severity']) => {
    switch (severity) {
      case 'low': return '#22c55e';
      case 'medium': return '#f59e0b';
      case 'high': return '#f97316';
      case 'critical': return '#ef4444';
    }
  };

  const getStatusColor = (status: Control['status']) => {
    switch (status) {
      case 'pass': return '#22c55e';
      case 'fail': return '#ef4444';
      case 'running': return '#3b82f6';
      case 'skipped': return '#94a3b8';
    }
  };

  const filteredControls = mockControls.filter(control => {
    const matchesSearch = control.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         control.key.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || control.status === selectedStatus;
    const matchesSeverity = selectedSeverity === 'all' || control.severity === selectedSeverity;
    
    return matchesSearch && matchesStatus && matchesSeverity;
  });

  return (
    <AdminLayout title="Security Controls">
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} testID="controls-page">
        {/* Header Actions */}
        <View style={styles.headerActions}>
          <View style={styles.searchContainer}>
            <Search color="#94a3b8" size={16} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search controls..."
              placeholderTextColor="#94a3b8"
              value={searchQuery}
              onChangeText={setSearchQuery}
              testID="controls-search"
            />
          </View>
          <Pressable style={styles.filterButton} testID="controls-filter">
            <Filter color="#cbd5e1" size={16} />
            <Text style={styles.filterText}>Filter</Text>
          </Pressable>
        </View>

        {/* Filter Pills */}
        <View style={styles.filterPills}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.pillsContainer}>
              {['all', 'pass', 'fail', 'running', 'skipped'].map((status) => (
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

        {/* Controls Summary */}
        <View style={[styles.card, { backgroundColor: '#111315', borderColor: '#1f2937' }]}>
          <View style={styles.cardHeader}>
            <ShieldCheck color="#22c55e" size={18} />
            <Text style={styles.cardTitle}>Controls Overview</Text>
          </View>
          <View style={styles.summaryGrid}>
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryValue, { color: '#22c55e' }]}>240</Text>
              <Text style={styles.summaryLabel}>Passing</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryValue, { color: '#ef4444' }]}>52</Text>
              <Text style={styles.summaryLabel}>Failing</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryValue, { color: '#3b82f6' }]}>8</Text>
              <Text style={styles.summaryLabel}>Running</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryValue, { color: '#94a3b8' }]}>42</Text>
              <Text style={styles.summaryLabel}>Skipped</Text>
            </View>
          </View>
        </View>

        {/* Controls Table */}
        <View style={[styles.card, { backgroundColor: '#111315', borderColor: '#1f2937' }]}>
          <View style={styles.cardHeader}>
            <FileText color="#3b82f6" size={18} />
            <Text style={styles.cardTitle}>Security Controls ({filteredControls.length})</Text>
          </View>
          
          {filteredControls.map((control) => (
            <View key={control.key} style={styles.controlRow}>
              <View style={styles.controlMain}>
                <View style={styles.controlHeader}>
                  <Text style={styles.controlKey}>{control.key}</Text>
                  <View style={styles.controlBadges}>
                    <View style={[styles.severityBadge, { backgroundColor: getSeverityColor(control.severity) + '20', borderColor: getSeverityColor(control.severity) }]}>
                      <Text style={[styles.severityText, { color: getSeverityColor(control.severity) }]}>
                        {control.severity.toUpperCase()}
                      </Text>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(control.status) + '20', borderColor: getStatusColor(control.status) }]}>
                      {getStatusIcon(control.status)}
                      <Text style={[styles.statusText, { color: getStatusColor(control.status) }]}>
                        {control.status.toUpperCase()}
                      </Text>
                    </View>
                  </View>
                </View>
                <Text style={styles.controlTitle}>{control.title}</Text>
                <View style={styles.controlMeta}>
                  <Text style={styles.controlMetaText}>Owner: {control.owner}</Text>
                  <Text style={styles.controlMetaText}>Last run: {control.lastRun}</Text>
                  <Text style={styles.controlMetaText}>
                    Frameworks: {control.frameworks.join(', ')}
                  </Text>
                </View>
              </View>
              <View style={styles.controlActions}>
                <Pressable style={styles.actionButton} testID={`run-control-${control.key}`}>
                  <Play color="#22c55e" size={14} />
                </Pressable>
                <Pressable style={styles.actionButton} testID={`configure-control-${control.key}`}>
                  <Settings color="#94a3b8" size={14} />
                </Pressable>
              </View>
            </View>
          ))}
        </View>

        {/* Bulk Actions */}
        <View style={styles.bulkActions}>
          <Pressable style={[styles.bulkButton, { backgroundColor: '#22c55e' }]} testID="run-all-controls">
            <Play color="#fff" size={16} />
            <Text style={styles.bulkButtonText}>Run All Controls</Text>
          </Pressable>
          <Pressable style={[styles.bulkButton, { backgroundColor: '#3b82f6' }]} testID="export-controls">
            <FileText color="#fff" size={16} />
            <Text style={styles.bulkButtonText}>Export Report</Text>
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
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1f2937',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 6,
  },
  filterText: {
    color: '#cbd5e1',
    fontSize: 14,
  },
  filterPills: {
    marginBottom: 16,
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
    backgroundColor: '#22c55e',
    borderColor: '#22c55e',
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
  summaryGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: '700' as const,
  },
  summaryLabel: {
    color: '#94a3b8',
    fontSize: 12,
    marginTop: 4,
  },
  controlRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1f2937',
  },
  controlMain: {
    flex: 1,
  },
  controlHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  controlKey: {
    color: '#3b82f6',
    fontSize: 12,
    fontWeight: '600' as const,
    fontFamily: 'monospace',
  },
  controlBadges: {
    flexDirection: 'row',
    gap: 6,
  },
  severityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
  },
  severityText: {
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
  controlTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500' as const,
    marginBottom: 4,
  },
  controlMeta: {
    gap: 2,
  },
  controlMetaText: {
    color: '#94a3b8',
    fontSize: 11,
  },
  controlActions: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  actionButton: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: '#1f2937',
  },
  bulkActions: {
    flexDirection: 'row',
    gap: 12,
  },
  bulkButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  bulkButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600' as const,
  },
});