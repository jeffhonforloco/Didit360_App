import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput } from 'react-native';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { 
  Database, Upload, Download, CheckCircle, AlertTriangle, 
  Clock, FileText, Music, Video, Headphones, BookOpen,
  Play, Pause, RotateCcw, Trash2, Eye, Settings, Zap
} from 'lucide-react-native';
import { trpc } from '@/lib/trpc';

interface IngestJob {
  id: string;
  type: 'ddex' | 'json' | 'rss' | 'manual';
  source: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'paused';
  progress: number;
  itemsTotal: number;
  itemsProcessed: number;
  itemsFailed: number;
  startedAt: string;
  estimatedCompletion?: string;
  errorMessage?: string;
}

export default function AdminIngest() {
  const [selectedTab, setSelectedTab] = useState<string>('jobs');
  const [newJobSource, setNewJobSource] = useState<string>('');
  
  const { data: jobsData, isLoading, error } = trpc.admin.ingest.getJobs.useQuery({
    limit: 50,
    offset: 0,
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#22c55e';
      case 'processing': return '#3b82f6';
      case 'pending': return '#f59e0b';
      case 'failed': return '#ef4444';
      case 'paused': return '#94a3b8';
      default: return '#94a3b8';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'ddex': return Database;
      case 'json': return FileText;
      case 'rss': return Headphones;
      case 'manual': return Upload;
      default: return FileText;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const tabs = [
    { key: 'jobs', label: 'Ingest Jobs', icon: Database },
    { key: 'sources', label: 'Data Sources', icon: Upload },
    { key: 'config', label: 'Configuration', icon: Settings },
    { key: 'monitoring', label: 'Monitoring', icon: Zap }
  ];

  return (
    <AdminLayout title="Content Ingestion">
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} testID="admin-ingest">
        {/* Tab Navigation */}
        <View style={[styles.tabContainer, { backgroundColor: '#111315', borderColor: '#1f2937' }]}>
          <View style={styles.tabButtons}>
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <Pressable
                  key={tab.key}
                  style={[styles.tabButton, selectedTab === tab.key && styles.tabButtonActive]}
                  onPress={() => setSelectedTab(tab.key)}
                  testID={`tab-${tab.key}`}
                >
                  <Icon color={selectedTab === tab.key ? '#22c55e' : '#cbd5e1'} size={16} />
                  <Text style={[styles.tabButtonText, selectedTab === tab.key && styles.tabButtonTextActive]}>
                    {tab.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Jobs Tab */}
        {selectedTab === 'jobs' && (
          <>
            {/* Stats Overview */}
            {/* Loading/Error States */}
            {isLoading ? (
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 }}>
                <Text style={{ color: '#fff' }}>Loading ingest jobs...</Text>
              </View>
            ) : error ? (
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 }}>
                <Text style={{ color: '#ef4444' }}>Error loading jobs: {error.message}</Text>
              </View>
            ) : (
              <>
                <View style={[styles.statsContainer, { backgroundColor: '#111315', borderColor: '#1f2937' }]}>
                  <Text style={styles.sectionTitle}>Ingestion Overview</Text>
                  <View style={styles.statsGrid}>
                    <View style={styles.statCard}>
                      <Database color="#3b82f6" size={20} />
                      <Text style={styles.statValue}>{jobsData?.stats.totalIngested}</Text>
                      <Text style={styles.statLabel}>Items Ingested</Text>
                      <Text style={styles.statChange}>+5.2K today</Text>
                    </View>
                    <View style={styles.statCard}>
                      <CheckCircle color="#22c55e" size={20} />
                      <Text style={styles.statValue}>{jobsData?.stats.successRate}</Text>
                      <Text style={styles.statLabel}>Success Rate</Text>
                      <Text style={styles.statChange}>+0.3% ↗</Text>
                    </View>
                    <View style={styles.statCard}>
                      <Clock color="#f59e0b" size={20} />
                      <Text style={styles.statValue}>{jobsData?.stats.activeJobs}</Text>
                      <Text style={styles.statLabel}>Active Jobs</Text>
                      <Text style={styles.statChange}>2 pending</Text>
                    </View>
                    <View style={styles.statCard}>
                      <AlertTriangle color="#ef4444" size={20} />
                      <Text style={styles.statValue}>{jobsData?.stats.failedItems}</Text>
                      <Text style={styles.statLabel}>Failed Items</Text>
                      <Text style={styles.statChange}>-12 vs yesterday</Text>
                    </View>
                  </View>
                </View>

            {/* New Job Creation */}
            <View style={[styles.newJobContainer, { backgroundColor: '#111315', borderColor: '#1f2937' }]}>
              <Text style={styles.sectionTitle}>Create New Ingest Job</Text>
              <View style={styles.newJobForm}>
                <TextInput
                  style={styles.newJobInput}
                  value={newJobSource}
                  onChangeText={setNewJobSource}
                  placeholder="Enter source URL or upload file..."
                  placeholderTextColor="#94a3b8"
                  testID="new-job-source"
                />
                <View style={styles.newJobButtons}>
                  <Pressable style={styles.newJobButton} testID="create-ddex-job">
                    <Database color="#3b82f6" size={16} />
                    <Text style={styles.newJobButtonText}>DDEX</Text>
                  </Pressable>
                  <Pressable style={styles.newJobButton} testID="create-json-job">
                    <FileText color="#22c55e" size={16} />
                    <Text style={styles.newJobButtonText}>JSON</Text>
                  </Pressable>
                  <Pressable style={styles.newJobButton} testID="create-rss-job">
                    <Headphones color="#f59e0b" size={16} />
                    <Text style={styles.newJobButtonText}>RSS</Text>
                  </Pressable>
                  <Pressable style={styles.newJobButton} testID="create-manual-job">
                    <Upload color="#8b5cf6" size={16} />
                    <Text style={styles.newJobButtonText}>Manual</Text>
                  </Pressable>
                </View>
              </View>
            </View>

            {/* Jobs List */}
            <View style={[styles.jobsContainer, { backgroundColor: '#111315', borderColor: '#1f2937' }]}>
              <Text style={styles.sectionTitle}>Active & Recent Jobs</Text>
              
              {(jobsData?.jobs || []).map((job) => {
                const TypeIcon = getTypeIcon(job.type);
                return (
                  <View key={job.id} style={[styles.jobItem, { backgroundColor: '#0b0f12', borderColor: '#1f2937' }]}>
                    <View style={styles.jobHeader}>
                      <View style={styles.jobInfo}>
                        <TypeIcon color="#cbd5e1" size={18} />
                        <View style={styles.jobDetails}>
                          <Text style={styles.jobSource}>{job.source}</Text>
                          <Text style={styles.jobType}>{job.type.toUpperCase()}</Text>
                        </View>
                      </View>
                      <View style={[styles.jobStatus, { backgroundColor: getStatusColor(job.status) + '20', borderColor: getStatusColor(job.status) }]}>
                        <Text style={[styles.jobStatusText, { color: getStatusColor(job.status) }]}>{job.status}</Text>
                      </View>
                    </View>

                    <View style={styles.jobProgress}>
                      <View style={styles.progressBar}>
                        <View style={[styles.progressFill, { width: `${job.progress}%`, backgroundColor: getStatusColor(job.status) }]} />
                      </View>
                      <Text style={styles.progressText}>{job.progress}%</Text>
                    </View>

                    <View style={styles.jobStats}>
                      <Text style={styles.jobStat}>Total: {job.itemsTotal}</Text>
                      <Text style={styles.jobStat}>Processed: {job.itemsProcessed}</Text>
                      <Text style={styles.jobStat}>Failed: {job.itemsFailed}</Text>
                      <Text style={styles.jobStat}>Started: {formatDate(job.startedAt)}</Text>
                    </View>

                    {job.errorMessage && (
                      <View style={styles.jobError}>
                        <AlertTriangle color="#ef4444" size={14} />
                        <Text style={styles.jobErrorText}>{job.errorMessage}</Text>
                      </View>
                    )}

                    <View style={styles.jobActions}>
                      <Pressable style={styles.jobActionBtn} testID={`view-job-${job.id}`}>
                        <Eye color="#3b82f6" size={14} />
                        <Text style={styles.jobActionText}>View</Text>
                      </Pressable>
                      {job.status === 'processing' && (
                        <Pressable style={styles.jobActionBtn} testID={`pause-job-${job.id}`}>
                          <Pause color="#f59e0b" size={14} />
                          <Text style={styles.jobActionText}>Pause</Text>
                        </Pressable>
                      )}
                      {job.status === 'paused' && (
                        <Pressable style={styles.jobActionBtn} testID={`resume-job-${job.id}`}>
                          <Play color="#22c55e" size={14} />
                          <Text style={styles.jobActionText}>Resume</Text>
                        </Pressable>
                      )}
                      {job.status === 'failed' && (
                        <Pressable style={styles.jobActionBtn} testID={`retry-job-${job.id}`}>
                          <RotateCcw color="#22c55e" size={14} />
                          <Text style={styles.jobActionText}>Retry</Text>
                        </Pressable>
                      )}
                      <Pressable style={styles.jobActionBtn} testID={`delete-job-${job.id}`}>
                        <Trash2 color="#ef4444" size={14} />
                        <Text style={styles.jobActionText}>Delete</Text>
                      </Pressable>
                    </View>
                  </View>
                );
              })}
            </View>
              </>
            )}
          </>
        )}

        {/* Data Sources Tab */}
        {selectedTab === 'sources' && (
          <View style={[styles.sourcesContainer, { backgroundColor: '#111315', borderColor: '#1f2937' }]}>
            <Text style={styles.sectionTitle}>Configured Data Sources</Text>
            
            <View style={styles.sourceItem}>
              <View style={styles.sourceHeader}>
                <Database color="#3b82f6" size={18} />
                <Text style={styles.sourceName}>DDEX Partners</Text>
                <View style={[styles.sourceStatus, { backgroundColor: '#22c55e20', borderColor: '#22c55e' }]}>
                  <Text style={[styles.sourceStatusText, { color: '#22c55e' }]}>Active</Text>
                </View>
              </View>
              <Text style={styles.sourceDescription}>Automated DDEX ERN/MEAD ingestion from major labels</Text>
              <View style={styles.sourceStats}>
                <Text style={styles.sourceStat}>Partners: 12</Text>
                <Text style={styles.sourceStat}>Last sync: 2h ago</Text>
                <Text style={styles.sourceStat}>Items/day: ~2.3K</Text>
              </View>
            </View>

            <View style={styles.sourceItem}>
              <View style={styles.sourceHeader}>
                <FileText color="#22c55e" size={18} />
                <Text style={styles.sourceName}>MusicBrainz API</Text>
                <View style={[styles.sourceStatus, { backgroundColor: '#22c55e20', borderColor: '#22c55e' }]}>
                  <Text style={[styles.sourceStatusText, { color: '#22c55e' }]}>Active</Text>
                </View>
              </View>
              <Text style={styles.sourceDescription}>Open metadata enrichment and gap filling</Text>
              <View style={styles.sourceStats}>
                <Text style={styles.sourceStat}>Rate limit: 1/sec</Text>
                <Text style={styles.sourceStat}>Last update: 15m ago</Text>
                <Text style={styles.sourceStat}>Enriched: 847 today</Text>
              </View>
            </View>

            <View style={styles.sourceItem}>
              <View style={styles.sourceHeader}>
                <Headphones color="#f59e0b" size={18} />
                <Text style={styles.sourceName}>Podcast Index</Text>
                <View style={[styles.sourceStatus, { backgroundColor: '#f59e0b20', borderColor: '#f59e0b' }]}>
                  <Text style={[styles.sourceStatusText, { color: '#f59e0b' }]}>Limited</Text>
                </View>
              </View>
              <Text style={styles.sourceDescription}>RSS feed discovery and podcast metadata</Text>
              <View style={styles.sourceStats}>
                <Text style={styles.sourceStat}>Feeds: 234</Text>
                <Text style={styles.sourceStat}>Check interval: 1h</Text>
                <Text style={styles.sourceStat}>New episodes: 45 today</Text>
              </View>
            </View>
          </View>
        )}

        {/* Configuration Tab */}
        {selectedTab === 'config' && (
          <View style={[styles.configContainer, { backgroundColor: '#111315', borderColor: '#1f2937' }]}>
            <Text style={styles.sectionTitle}>Ingestion Configuration</Text>
            
            <View style={styles.configSection}>
              <Text style={styles.configSectionTitle}>Processing Limits</Text>
              <View style={styles.configItem}>
                <Text style={styles.configLabel}>Max concurrent jobs</Text>
                <Text style={styles.configValue}>4</Text>
              </View>
              <View style={styles.configItem}>
                <Text style={styles.configLabel}>Items per batch</Text>
                <Text style={styles.configValue}>100</Text>
              </View>
              <View style={styles.configItem}>
                <Text style={styles.configLabel}>Retry attempts</Text>
                <Text style={styles.configValue}>3</Text>
              </View>
            </View>

            <View style={styles.configSection}>
              <Text style={styles.configSectionTitle}>Quality Control</Text>
              <View style={styles.configItem}>
                <Text style={styles.configLabel}>Metadata validation</Text>
                <Text style={styles.configValue}>Strict</Text>
              </View>
              <View style={styles.configItem}>
                <Text style={styles.configLabel}>Duplicate detection</Text>
                <Text style={styles.configValue}>Enabled</Text>
              </View>
              <View style={styles.configItem}>
                <Text style={styles.configLabel}>Auto-enrichment</Text>
                <Text style={styles.configValue}>Enabled</Text>
              </View>
            </View>
          </View>
        )}

        {/* Monitoring Tab */}
        {selectedTab === 'monitoring' && (
          <View style={[styles.monitoringContainer, { backgroundColor: '#111315', borderColor: '#1f2937' }]}>
            <Text style={styles.sectionTitle}>System Monitoring</Text>
            
            <View style={styles.monitoringGrid}>
              <View style={styles.monitoringCard}>
                <Text style={styles.monitoringTitle}>Queue Health</Text>
                <Text style={styles.monitoringValue}>Normal</Text>
                <Text style={styles.monitoringDetail}>47 items pending</Text>
              </View>
              <View style={styles.monitoringCard}>
                <Text style={styles.monitoringTitle}>Processing Speed</Text>
                <Text style={styles.monitoringValue}>234/min</Text>
                <Text style={styles.monitoringDetail}>Above average</Text>
              </View>
              <View style={styles.monitoringCard}>
                <Text style={styles.monitoringTitle}>Error Rate</Text>
                <Text style={styles.monitoringValue}>1.3%</Text>
                <Text style={styles.monitoringDetail}>Within threshold</Text>
              </View>
              <View style={styles.monitoringCard}>
                <Text style={styles.monitoringTitle}>Storage Usage</Text>
                <Text style={styles.monitoringValue}>67%</Text>
                <Text style={styles.monitoringDetail}>2.1TB available</Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </AdminLayout>
  );
}

const styles = StyleSheet.create({
  tabContainer: { padding: 16, borderRadius: 12, borderWidth: 1, marginBottom: 16 },
  tabButtons: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  tabButton: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, backgroundColor: '#0b0f12', borderWidth: 1, borderColor: '#1f2937' },
  tabButtonActive: { backgroundColor: '#22c55e20', borderColor: '#22c55e' },
  tabButtonText: { color: '#cbd5e1', fontSize: 13 },
  tabButtonTextActive: { color: '#22c55e' },
  sectionTitle: { color: '#fff', fontSize: 16, fontWeight: '600' as const, marginBottom: 16 },
  statsContainer: { padding: 16, borderRadius: 12, borderWidth: 1, marginBottom: 16 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  statCard: { flex: 1, minWidth: 140, alignItems: 'center', padding: 16, backgroundColor: '#0b0f12', borderRadius: 10, borderWidth: 1, borderColor: '#1f2937' },
  statValue: { color: '#fff', fontSize: 20, fontWeight: '700' as const, marginTop: 8 },
  statLabel: { color: '#94a3b8', fontSize: 12, marginTop: 4 },
  statChange: { color: '#22c55e', fontSize: 11, marginTop: 2 },
  newJobContainer: { padding: 16, borderRadius: 12, borderWidth: 1, marginBottom: 16 },
  newJobForm: { gap: 12 },
  newJobInput: { color: '#fff', backgroundColor: '#0b0f12', borderColor: '#1f2937', borderWidth: 1, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10 },
  newJobButtons: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  newJobButton: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 6, backgroundColor: '#0b0f12', borderWidth: 1, borderColor: '#1f2937' },
  newJobButtonText: { color: '#cbd5e1', fontSize: 12 },
  jobsContainer: { padding: 16, borderRadius: 12, borderWidth: 1, marginBottom: 16 },
  jobItem: { marginBottom: 16, borderWidth: 1, borderRadius: 12, padding: 16 },
  jobHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  jobInfo: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  jobDetails: { flex: 1 },
  jobSource: { color: '#fff', fontWeight: '600' as const },
  jobType: { color: '#94a3b8', fontSize: 12 },
  jobStatus: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4, borderWidth: 1 },
  jobStatusText: { fontSize: 11, fontWeight: '500' as const, textTransform: 'capitalize' as const },
  jobProgress: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  progressBar: { flex: 1, height: 6, backgroundColor: '#1f2937', borderRadius: 3 },
  progressFill: { height: '100%', borderRadius: 3 },
  progressText: { color: '#cbd5e1', fontSize: 12, fontWeight: '500' as const, width: 40, textAlign: 'right' as const },
  jobStats: { flexDirection: 'row', gap: 16, marginBottom: 12, flexWrap: 'wrap' },
  jobStat: { color: '#94a3b8', fontSize: 11 },
  jobError: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 12, padding: 8, backgroundColor: '#ef444420', borderRadius: 6 },
  jobErrorText: { color: '#ef4444', fontSize: 12, flex: 1 },
  jobActions: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  jobActionBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6, backgroundColor: '#111827' },
  jobActionText: { color: '#cbd5e1', fontSize: 12 },
  sourcesContainer: { padding: 16, borderRadius: 12, borderWidth: 1, marginBottom: 16 },
  sourceItem: { marginBottom: 16, padding: 16, backgroundColor: '#0b0f12', borderRadius: 10, borderWidth: 1, borderColor: '#1f2937' },
  sourceHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  sourceName: { color: '#fff', fontWeight: '600' as const, flex: 1 },
  sourceStatus: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4, borderWidth: 1 },
  sourceStatusText: { fontSize: 11, fontWeight: '500' as const },
  sourceDescription: { color: '#94a3b8', fontSize: 12, marginBottom: 8 },
  sourceStats: { flexDirection: 'row', gap: 16, flexWrap: 'wrap' },
  sourceStat: { color: '#cbd5e1', fontSize: 11 },
  configContainer: { padding: 16, borderRadius: 12, borderWidth: 1, marginBottom: 16 },
  configSection: { marginBottom: 20 },
  configSectionTitle: { color: '#22c55e', fontSize: 14, fontWeight: '600' as const, marginBottom: 12 },
  configItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  configLabel: { color: '#cbd5e1' },
  configValue: { color: '#fff', fontWeight: '500' as const },
  monitoringContainer: { padding: 16, borderRadius: 12, borderWidth: 1, marginBottom: 16 },
  monitoringGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  monitoringCard: { flex: 1, minWidth: 140, padding: 16, backgroundColor: '#0b0f12', borderRadius: 10, borderWidth: 1, borderColor: '#1f2937' },
  monitoringTitle: { color: '#94a3b8', fontSize: 12, marginBottom: 4 },
  monitoringValue: { color: '#fff', fontSize: 18, fontWeight: '600' as const, marginBottom: 2 },
  monitoringDetail: { color: '#cbd5e1', fontSize: 11 },
});