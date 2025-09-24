import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput } from 'react-native';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { 
  Activity, Search, Filter, Download, Calendar, User, 
  Shield, Settings, FileText, Database, Globe, AlertTriangle
} from 'lucide-react-native';

interface AuditLogEntry {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  target: string;
  ip: string;
  userAgent: string;
  metadata: Record<string, any>;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

const mockAuditLogs: AuditLogEntry[] = [
  {
    id: 'log-001',
    timestamp: '2024-03-15T14:30:25Z',
    actor: 'admin@company.com',
    action: 'control.run.executed',
    target: 'IDP.MFA.Required',
    ip: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
    metadata: { result: 'fail', duration: '2.3s' },
    severity: 'high'
  },
  {
    id: 'log-002',
    timestamp: '2024-03-15T14:25:12Z',
    actor: 'security@company.com',
    action: 'evidence.uploaded',
    target: 'AWS CloudTrail Logs',
    ip: '192.168.1.101',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    metadata: { fileSize: '2.4MB', hash: 'sha256:a1b2c3...' },
    severity: 'medium'
  },
  {
    id: 'log-003',
    timestamp: '2024-03-15T14:20:45Z',
    actor: 'compliance@company.com',
    action: 'framework.mapped',
    target: 'SOC 2 Type II',
    ip: '192.168.1.102',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
    metadata: { controlsMapped: 15, newMappings: 3 },
    severity: 'low'
  },
  {
    id: 'log-004',
    timestamp: '2024-03-15T14:15:33Z',
    actor: 'admin@company.com',
    action: 'vendor.risk.updated',
    target: 'DataDog',
    ip: '192.168.1.100',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
    metadata: { oldRisk: 'low', newRisk: 'medium', reason: 'artifact_expiry' },
    severity: 'medium'
  },
  {
    id: 'log-005',
    timestamp: '2024-03-15T14:10:18Z',
    actor: 'system',
    action: 'trust_center.published',
    target: 'Public Trust Center',
    ip: '10.0.0.1',
    userAgent: 'TrustOps-System/1.0',
    metadata: { widgets: 6, visibility: 'public' },
    severity: 'low'
  },
  {
    id: 'log-006',
    timestamp: '2024-03-15T14:05:07Z',
    actor: 'security@company.com',
    action: 'remediation.created',
    target: 'REM-2024-001',
    ip: '192.168.1.101',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    metadata: { control: 'IDP.MFA.Required', severity: 'high', dueDate: '2024-03-22' },
    severity: 'high'
  }
];

export default function AuditLogPage() {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedActor, setSelectedActor] = useState<string>('all');
  const [selectedAction, setSelectedAction] = useState<string>('all');

  const getSeverityColor = (severity: AuditLogEntry['severity']) => {
    switch (severity) {
      case 'low': return '#22c55e';
      case 'medium': return '#f59e0b';
      case 'high': return '#f97316';
      case 'critical': return '#ef4444';
    }
  };

  const getActionIcon = (action: string) => {
    if (action.includes('control')) return <Shield color="#3b82f6" size={14} />;
    if (action.includes('evidence')) return <Database color="#22c55e" size={14} />;
    if (action.includes('framework')) return <FileText color="#8b5cf6" size={14} />;
    if (action.includes('vendor')) return <Globe color="#f59e0b" size={14} />;
    if (action.includes('trust_center')) return <Settings color="#3b82f6" size={14} />;
    if (action.includes('remediation')) return <AlertTriangle color="#ef4444" size={14} />;
    return <Activity color="#94a3b8" size={14} />;
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatMetadata = (metadata: Record<string, any>) => {
    return Object.entries(metadata)
      .map(([key, value]) => `${key}: ${value}`)
      .join(', ');
  };

  const filteredLogs = mockAuditLogs.filter(log => {
    const matchesSearch = log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         log.target.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         log.actor.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesActor = selectedActor === 'all' || log.actor === selectedActor;
    const matchesAction = selectedAction === 'all' || log.action.includes(selectedAction);
    
    return matchesSearch && matchesActor && matchesAction;
  });

  const uniqueActors = Array.from(new Set(mockAuditLogs.map(log => log.actor)));
  const uniqueActions = Array.from(new Set(mockAuditLogs.map(log => log.action.split('.')[0])));

  return (
    <AdminLayout title="Audit Log">
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} testID="audit-log-page">
        {/* Header Actions */}
        <View style={styles.headerActions}>
          <View style={styles.searchContainer}>
            <Search color="#94a3b8" size={16} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search audit logs..."
              placeholderTextColor="#94a3b8"
              value={searchQuery}
              onChangeText={setSearchQuery}
              testID="audit-search"
            />
          </View>
          <Pressable style={styles.filterButton} testID="audit-filter">
            <Filter color="#cbd5e1" size={16} />
            <Text style={styles.filterText}>Filter</Text>
          </Pressable>
          <Pressable style={styles.exportButton} testID="export-audit-log">
            <Download color="#22c55e" size={16} />
            <Text style={styles.exportText}>Export</Text>
          </Pressable>
        </View>

        {/* Filter Controls */}
        <View style={styles.filterControls}>
          <View style={styles.filterGroup}>
            <Text style={styles.filterLabel}>Actor:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.pillsContainer}>
                <Pressable
                  style={[styles.pill, selectedActor === 'all' && styles.pillActive]}
                  onPress={() => setSelectedActor('all')}
                  testID="actor-filter-all"
                >
                  <Text style={[styles.pillText, selectedActor === 'all' && styles.pillTextActive]}>
                    All
                  </Text>
                </Pressable>
                {uniqueActors.map((actor) => (
                  <Pressable
                    key={actor}
                    style={[styles.pill, selectedActor === actor && styles.pillActive]}
                    onPress={() => setSelectedActor(actor)}
                    testID={`actor-filter-${actor}`}
                  >
                    <Text style={[styles.pillText, selectedActor === actor && styles.pillTextActive]}>
                      {actor.split('@')[0]}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </ScrollView>
          </View>

          <View style={styles.filterGroup}>
            <Text style={styles.filterLabel}>Action:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.pillsContainer}>
                <Pressable
                  style={[styles.pill, selectedAction === 'all' && styles.pillActive]}
                  onPress={() => setSelectedAction('all')}
                  testID="action-filter-all"
                >
                  <Text style={[styles.pillText, selectedAction === 'all' && styles.pillTextActive]}>
                    All
                  </Text>
                </Pressable>
                {uniqueActions.map((action) => (
                  <Pressable
                    key={action}
                    style={[styles.pill, selectedAction === action && styles.pillActive]}
                    onPress={() => setSelectedAction(action)}
                    testID={`action-filter-${action}`}
                  >
                    <Text style={[styles.pillText, selectedAction === action && styles.pillTextActive]}>
                      {action}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </ScrollView>
          </View>
        </View>

        {/* Audit Summary */}
        <View style={[styles.card, { backgroundColor: '#111315', borderColor: '#1f2937' }]}>
          <View style={styles.cardHeader}>
            <Activity color="#22c55e" size={18} />
            <Text style={styles.cardTitle}>Activity Summary</Text>
          </View>
          <View style={styles.summaryGrid}>
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryValue, { color: '#3b82f6' }]}>1,247</Text>
              <Text style={styles.summaryLabel}>Total Events</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryValue, { color: '#22c55e' }]}>847</Text>
              <Text style={styles.summaryLabel}>Today</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryValue, { color: '#f59e0b' }]}>23</Text>
              <Text style={styles.summaryLabel}>High Severity</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryValue, { color: '#8b5cf6' }]}>12</Text>
              <Text style={styles.summaryLabel}>Unique Users</Text>
            </View>
          </View>
        </View>

        {/* Audit Log Entries */}
        <View style={[styles.card, { backgroundColor: '#111315', borderColor: '#1f2937' }]}>
          <View style={styles.cardHeader}>
            <FileText color="#3b82f6" size={18} />
            <Text style={styles.cardTitle}>Audit Entries ({filteredLogs.length})</Text>
          </View>
          
          {filteredLogs.map((log) => (
            <View key={log.id} style={styles.logRow}>
              <View style={styles.logMain}>
                <View style={styles.logHeader}>
                  <View style={styles.logInfo}>
                    {getActionIcon(log.action)}
                    <Text style={styles.logAction}>{log.action}</Text>
                    <View style={[styles.severityBadge, { backgroundColor: getSeverityColor(log.severity) + '20', borderColor: getSeverityColor(log.severity) }]}>
                      <Text style={[styles.severityText, { color: getSeverityColor(log.severity) }]}>
                        {log.severity.toUpperCase()}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.logTimestamp}>{formatTimestamp(log.timestamp)}</Text>
                </View>
                
                <Text style={styles.logTarget}>Target: {log.target}</Text>
                
                <View style={styles.logDetails}>
                  <View style={styles.logDetailRow}>
                    <User color="#94a3b8" size={12} />
                    <Text style={styles.logDetailText}>Actor: {log.actor}</Text>
                  </View>
                  <View style={styles.logDetailRow}>
                    <Globe color="#94a3b8" size={12} />
                    <Text style={styles.logDetailText}>IP: {log.ip}</Text>
                  </View>
                  {Object.keys(log.metadata).length > 0 && (
                    <View style={styles.logDetailRow}>
                      <Settings color="#94a3b8" size={12} />
                      <Text style={styles.logDetailText}>
                        Metadata: {formatMetadata(log.metadata)}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Retention Policy */}
        <View style={[styles.card, { backgroundColor: '#111315', borderColor: '#1f2937' }]}>
          <View style={styles.cardHeader}>
            <Calendar color="#f59e0b" size={18} />
            <Text style={styles.cardTitle}>Retention Policy</Text>
          </View>
          <Text style={styles.retentionText}>
            Audit logs are retained for 7 years to meet compliance requirements. 
            Logs older than 90 days are archived to cold storage.
          </Text>
          <View style={styles.retentionStats}>
            <View style={styles.retentionItem}>
              <Text style={styles.retentionLabel}>Active logs (90 days):</Text>
              <Text style={styles.retentionValue}>2.4 GB</Text>
            </View>
            <View style={styles.retentionItem}>
              <Text style={styles.retentionLabel}>Archived logs (7 years):</Text>
              <Text style={styles.retentionValue}>847 GB</Text>
            </View>
          </View>
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
  exportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#22c55e',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 6,
  },
  exportText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600' as const,
  },
  filterControls: {
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
  summaryGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: '700' as const,
  },
  summaryLabel: {
    color: '#94a3b8',
    fontSize: 11,
    marginTop: 4,
  },
  logRow: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1f2937',
  },
  logMain: {
    gap: 6,
  },
  logHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  logAction: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500' as const,
    fontFamily: 'monospace',
  },
  severityBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
  },
  severityText: {
    fontSize: 10,
    fontWeight: '600' as const,
  },
  logTimestamp: {
    color: '#94a3b8',
    fontSize: 11,
    fontFamily: 'monospace',
  },
  logTarget: {
    color: '#3b82f6',
    fontSize: 13,
    fontWeight: '500' as const,
  },
  logDetails: {
    gap: 4,
  },
  logDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  logDetailText: {
    color: '#94a3b8',
    fontSize: 11,
  },
  retentionText: {
    color: '#cbd5e1',
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 12,
  },
  retentionStats: {
    gap: 8,
  },
  retentionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  retentionLabel: {
    color: '#94a3b8',
    fontSize: 12,
  },
  retentionValue: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600' as const,
  },
});