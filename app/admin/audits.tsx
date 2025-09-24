import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput } from 'react-native';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { 
  BarChart3, Search, Download, FileText, Share, Calendar, 
  CheckCircle, AlertTriangle, TrendingUp, Shield, Database, Eye
} from 'lucide-react-native';

interface AuditReport {
  id: string;
  name: string;
  type: 'soc2_readiness' | 'iso_gap_analysis' | 'hipaa_safeguards' | 'gdpr_ropa' | 'custom';
  status: 'draft' | 'generating' | 'ready' | 'shared';
  framework: string;
  createdAt: string;
  lastUpdated: string;
  size: string;
  sharedWith: string[];
}

interface AuditPackage {
  id: string;
  name: string;
  auditor: string;
  framework: string;
  status: 'preparing' | 'ready' | 'shared' | 'completed';
  items: number;
  dueDate: string;
  createdAt: string;
}

const mockReports: AuditReport[] = [
  {
    id: 'rep-001',
    name: 'SOC 2 Type II Readiness Assessment',
    type: 'soc2_readiness',
    status: 'ready',
    framework: 'SOC 2',
    createdAt: '2024-03-15T10:00:00Z',
    lastUpdated: '2024-03-15T14:30:00Z',
    size: '2.4 MB',
    sharedWith: ['External Auditor', 'Management']
  },
  {
    id: 'rep-002',
    name: 'ISO 27001 Gap Analysis Report',
    type: 'iso_gap_analysis',
    status: 'ready',
    framework: 'ISO 27001',
    createdAt: '2024-03-14T16:20:00Z',
    lastUpdated: '2024-03-14T18:45:00Z',
    size: '1.8 MB',
    sharedWith: ['Compliance Team']
  },
  {
    id: 'rep-003',
    name: 'HIPAA Safeguards Summary',
    type: 'hipaa_safeguards',
    status: 'generating',
    framework: 'HIPAA',
    createdAt: '2024-03-15T09:15:00Z',
    lastUpdated: '2024-03-15T09:15:00Z',
    size: 'Generating...',
    sharedWith: []
  },
  {
    id: 'rep-004',
    name: 'GDPR ROPA Export',
    type: 'gdpr_ropa',
    status: 'draft',
    framework: 'GDPR',
    createdAt: '2024-03-13T11:30:00Z',
    lastUpdated: '2024-03-13T11:30:00Z',
    size: 'Draft',
    sharedWith: []
  }
];

const mockPackages: AuditPackage[] = [
  {
    id: 'pkg-001',
    name: 'SOC 2 Type II Audit Package',
    auditor: 'Deloitte',
    framework: 'SOC 2',
    status: 'ready',
    items: 47,
    dueDate: '2024-03-25',
    createdAt: '2024-03-10T14:00:00Z'
  },
  {
    id: 'pkg-002',
    name: 'ISO 27001 Certification Package',
    auditor: 'BSI Group',
    framework: 'ISO 27001',
    status: 'preparing',
    items: 32,
    dueDate: '2024-04-15',
    createdAt: '2024-03-12T10:30:00Z'
  },
  {
    id: 'pkg-003',
    name: 'HIPAA Compliance Review',
    auditor: 'Internal Audit',
    framework: 'HIPAA',
    status: 'shared',
    items: 23,
    dueDate: '2024-03-30',
    createdAt: '2024-03-08T16:45:00Z'
  }
];

export default function AuditsReportsPage() {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('reports');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return '#94a3b8';
      case 'generating': return '#3b82f6';
      case 'preparing': return '#3b82f6';
      case 'ready': return '#22c55e';
      case 'shared': return '#8b5cf6';
      case 'completed': return '#22c55e';
      default: return '#94a3b8';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft': return <FileText color="#94a3b8" size={14} />;
      case 'generating': return <TrendingUp color="#3b82f6" size={14} />;
      case 'preparing': return <TrendingUp color="#3b82f6" size={14} />;
      case 'ready': return <CheckCircle color="#22c55e" size={14} />;
      case 'shared': return <Share color="#8b5cf6" size={14} />;
      case 'completed': return <CheckCircle color="#22c55e" size={14} />;
      default: return <FileText color="#94a3b8" size={14} />;
    }
  };

  const getTypeIcon = (type: AuditReport['type']) => {
    switch (type) {
      case 'soc2_readiness': return <Shield color="#3b82f6" size={16} />;
      case 'iso_gap_analysis': return <AlertTriangle color="#f59e0b" size={16} />;
      case 'hipaa_safeguards': return <Database color="#ef4444" size={16} />;
      case 'gdpr_ropa': return <FileText color="#8b5cf6" size={16} />;
      case 'custom': return <BarChart3 color="#22c55e" size={16} />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  const filteredReports = mockReports.filter(report =>
    report.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    report.framework.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredPackages = mockPackages.filter(pkg =>
    pkg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pkg.auditor.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayout title="Audits & Reports">
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} testID="audits-reports-page">
        {/* Header Actions */}
        <View style={styles.headerActions}>
          <View style={styles.searchContainer}>
            <Search color="#94a3b8" size={16} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search reports and packages..."
              placeholderTextColor="#94a3b8"
              value={searchQuery}
              onChangeText={setSearchQuery}
              testID="audits-search"
            />
          </View>
          <Pressable style={styles.actionButton} testID="generate-report">
            <BarChart3 color="#22c55e" size={16} />
            <Text style={styles.actionButtonText}>Generate</Text>
          </Pressable>
        </View>

        {/* Type Toggle */}
        <View style={styles.typeToggle}>
          <Pressable
            style={[styles.toggleButton, selectedType === 'reports' && styles.toggleButtonActive]}
            onPress={() => setSelectedType('reports')}
            testID="toggle-reports"
          >
            <FileText color={selectedType === 'reports' ? '#fff' : '#94a3b8'} size={16} />
            <Text style={[styles.toggleText, selectedType === 'reports' && styles.toggleTextActive]}>
              Reports
            </Text>
          </Pressable>
          <Pressable
            style={[styles.toggleButton, selectedType === 'packages' && styles.toggleButtonActive]}
            onPress={() => setSelectedType('packages')}
            testID="toggle-packages"
          >
            <Database color={selectedType === 'packages' ? '#fff' : '#94a3b8'} size={16} />
            <Text style={[styles.toggleText, selectedType === 'packages' && styles.toggleTextActive]}>
              Audit Packages
            </Text>
          </Pressable>
        </View>

        {/* Reports Overview */}
        <View style={[styles.card, { backgroundColor: '#111315', borderColor: '#1f2937' }]}>
          <View style={styles.cardHeader}>
            <BarChart3 color="#22c55e" size={18} />
            <Text style={styles.cardTitle}>Reports & Audits Overview</Text>
          </View>
          <View style={styles.overviewGrid}>
            <View style={styles.overviewItem}>
              <Text style={[styles.overviewValue, { color: '#3b82f6' }]}>23</Text>
              <Text style={styles.overviewLabel}>Total Reports</Text>
            </View>
            <View style={styles.overviewItem}>
              <Text style={[styles.overviewValue, { color: '#22c55e' }]}>18</Text>
              <Text style={styles.overviewLabel}>Ready</Text>
            </View>
            <View style={styles.overviewItem}>
              <Text style={[styles.overviewValue, { color: '#8b5cf6' }]}>7</Text>
              <Text style={styles.overviewLabel}>Shared</Text>
            </View>
            <View style={styles.overviewItem}>
              <Text style={[styles.overviewValue, { color: '#f59e0b' }]}>2</Text>
              <Text style={styles.overviewLabel}>Due Soon</Text>
            </View>
          </View>
        </View>

        {selectedType === 'reports' ? (
          /* Reports List */
          <View style={[styles.card, { backgroundColor: '#111315', borderColor: '#1f2937' }]}>
            <View style={styles.cardHeader}>
              <FileText color="#3b82f6" size={18} />
              <Text style={styles.cardTitle}>Compliance Reports ({filteredReports.length})</Text>
            </View>
            
            {filteredReports.map((report) => (
              <View key={report.id} style={styles.reportRow}>
                <View style={styles.reportMain}>
                  <View style={styles.reportHeader}>
                    <View style={styles.reportInfo}>
                      {getTypeIcon(report.type)}
                      <Text style={styles.reportName}>{report.name}</Text>
                    </View>
                    <View style={styles.reportBadges}>
                      <View style={[styles.frameworkBadge, { backgroundColor: '#3b82f6' + '20', borderColor: '#3b82f6' }]}>
                        <Text style={[styles.frameworkText, { color: '#3b82f6' }]}>
                          {report.framework}
                        </Text>
                      </View>
                      <View style={[styles.statusBadge, { backgroundColor: getStatusColor(report.status) + '20', borderColor: getStatusColor(report.status) }]}>
                        {getStatusIcon(report.status)}
                        <Text style={[styles.statusText, { color: getStatusColor(report.status) }]}>
                          {report.status.toUpperCase()}
                        </Text>
                      </View>
                    </View>
                  </View>
                  
                  <View style={styles.reportDetails}>
                    <View style={styles.detailRow}>
                      <Calendar color="#94a3b8" size={12} />
                      <Text style={styles.detailText}>
                        Created: {formatDate(report.createdAt)}
                      </Text>
                    </View>
                    <View style={styles.detailRow}>
                      <FileText color="#94a3b8" size={12} />
                      <Text style={styles.detailText}>
                        Size: {report.size}
                      </Text>
                    </View>
                    {report.sharedWith.length > 0 && (
                      <View style={styles.detailRow}>
                        <Share color="#94a3b8" size={12} />
                        <Text style={styles.detailText}>
                          Shared with: {report.sharedWith.join(', ')}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
                
                <View style={styles.reportActions}>
                  {report.status === 'ready' && (
                    <>
                      <Pressable style={styles.actionBtn} testID={`view-report-${report.id}`}>
                        <Eye color="#3b82f6" size={14} />
                      </Pressable>
                      <Pressable style={styles.actionBtn} testID={`download-report-${report.id}`}>
                        <Download color="#22c55e" size={14} />
                      </Pressable>
                      <Pressable style={styles.actionBtn} testID={`share-report-${report.id}`}>
                        <Share color="#8b5cf6" size={14} />
                      </Pressable>
                    </>
                  )}
                  {report.status === 'draft' && (
                    <Pressable style={[styles.actionBtn, { backgroundColor: '#22c55e' }]} testID={`generate-report-${report.id}`}>
                      <BarChart3 color="#fff" size={14} />
                    </Pressable>
                  )}
                </View>
              </View>
            ))}
          </View>
        ) : (
          /* Audit Packages List */
          <View style={[styles.card, { backgroundColor: '#111315', borderColor: '#1f2937' }]}>
            <View style={styles.cardHeader}>
              <Database color="#3b82f6" size={18} />
              <Text style={styles.cardTitle}>Audit Packages ({filteredPackages.length})</Text>
            </View>
            
            {filteredPackages.map((pkg) => (
              <View key={pkg.id} style={styles.packageRow}>
                <View style={styles.packageMain}>
                  <View style={styles.packageHeader}>
                    <View style={styles.packageInfo}>
                      <Shield color="#3b82f6" size={16} />
                      <Text style={styles.packageName}>{pkg.name}</Text>
                    </View>
                    <View style={styles.packageBadges}>
                      <View style={[styles.frameworkBadge, { backgroundColor: '#3b82f6' + '20', borderColor: '#3b82f6' }]}>
                        <Text style={[styles.frameworkText, { color: '#3b82f6' }]}>
                          {pkg.framework}
                        </Text>
                      </View>
                      <View style={[styles.statusBadge, { backgroundColor: getStatusColor(pkg.status) + '20', borderColor: getStatusColor(pkg.status) }]}>
                        {getStatusIcon(pkg.status)}
                        <Text style={[styles.statusText, { color: getStatusColor(pkg.status) }]}>
                          {pkg.status.toUpperCase()}
                        </Text>
                      </View>
                    </View>
                  </View>
                  
                  <View style={styles.packageDetails}>
                    <View style={styles.detailRow}>
                      <Eye color="#94a3b8" size={12} />
                      <Text style={styles.detailText}>
                        Auditor: {pkg.auditor}
                      </Text>
                    </View>
                    <View style={styles.detailRow}>
                      <FileText color="#94a3b8" size={12} />
                      <Text style={styles.detailText}>
                        {pkg.items} items included
                      </Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Calendar color="#94a3b8" size={12} />
                      <Text style={[
                        styles.detailText,
                        isOverdue(pkg.dueDate) && { color: '#ef4444' }
                      ]}>
                        Due: {formatDate(pkg.dueDate)}
                        {isOverdue(pkg.dueDate) && ' (Overdue)'}
                      </Text>
                    </View>
                  </View>
                </View>
                
                <View style={styles.packageActions}>
                  {pkg.status === 'ready' && (
                    <>
                      <Pressable style={styles.actionBtn} testID={`view-package-${pkg.id}`}>
                        <Eye color="#3b82f6" size={14} />
                      </Pressable>
                      <Pressable style={styles.actionBtn} testID={`share-package-${pkg.id}`}>
                        <Share color="#8b5cf6" size={14} />
                      </Pressable>
                    </>
                  )}
                  {pkg.status === 'preparing' && (
                    <Pressable style={styles.actionBtn} testID={`edit-package-${pkg.id}`}>
                      <FileText color="#94a3b8" size={14} />
                    </Pressable>
                  )}
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Report Templates */}
        <View style={[styles.card, { backgroundColor: '#111315', borderColor: '#1f2937' }]}>
          <View style={styles.cardHeader}>
            <TrendingUp color="#22c55e" size={18} />
            <Text style={styles.cardTitle}>Available Report Templates</Text>
          </View>
          <View style={styles.templatesList}>
            <Pressable style={styles.templateItem} testID="template-soc2">
              <Shield color="#3b82f6" size={16} />
              <Text style={styles.templateText}>SOC 2 Readiness Report</Text>
              <BarChart3 color="#22c55e" size={14} />
            </Pressable>
            <Pressable style={styles.templateItem} testID="template-iso">
              <AlertTriangle color="#f59e0b" size={16} />
              <Text style={styles.templateText}>ISO 27001 Gap Analysis</Text>
              <BarChart3 color="#22c55e" size={14} />
            </Pressable>
            <Pressable style={styles.templateItem} testID="template-hipaa">
              <Database color="#ef4444" size={16} />
              <Text style={styles.templateText}>HIPAA Safeguards Summary</Text>
              <BarChart3 color="#22c55e" size={14} />
            </Pressable>
            <Pressable style={styles.templateItem} testID="template-gdpr">
              <FileText color="#8b5cf6" size={16} />
              <Text style={styles.templateText}>GDPR ROPA Export</Text>
              <BarChart3 color="#22c55e" size={14} />
            </Pressable>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <Pressable style={[styles.quickButton, { backgroundColor: '#22c55e' }]} testID="generate-pdf">
            <Download color="#fff" size={16} />
            <Text style={styles.quickButtonText}>Generate PDF</Text>
          </Pressable>
          <Pressable style={[styles.quickButton, { backgroundColor: '#8b5cf6' }]} testID="share-auditor">
            <Share color="#fff" size={16} />
            <Text style={styles.quickButtonText}>Share with Auditor</Text>
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
  typeToggle: {
    flexDirection: 'row',
    backgroundColor: '#1f2937',
    borderRadius: 8,
    padding: 4,
    marginBottom: 16,
  },
  toggleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 6,
    gap: 6,
  },
  toggleButtonActive: {
    backgroundColor: '#3b82f6',
  },
  toggleText: {
    color: '#94a3b8',
    fontSize: 14,
    fontWeight: '500' as const,
  },
  toggleTextActive: {
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
  reportRow: {
    flexDirection: 'row',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1f2937',
  },
  reportMain: {
    flex: 1,
  },
  reportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reportInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  reportName: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600' as const,
  },
  reportBadges: {
    flexDirection: 'row',
    gap: 6,
  },
  frameworkBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    borderWidth: 1,
  },
  frameworkText: {
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
  reportDetails: {
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
  reportActions: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  actionBtn: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: '#1f2937',
  },
  packageRow: {
    flexDirection: 'row',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1f2937',
  },
  packageMain: {
    flex: 1,
  },
  packageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  packageInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  packageName: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600' as const,
  },
  packageBadges: {
    flexDirection: 'row',
    gap: 6,
  },
  packageDetails: {
    gap: 4,
  },
  packageActions: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  templatesList: {
    gap: 8,
  },
  templateItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#1f2937',
    borderRadius: 8,
    gap: 12,
  },
  templateText: {
    color: '#cbd5e1',
    fontSize: 14,
    flex: 1,
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