import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, TextInput, Switch } from 'react-native';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { 
  Zap, Settings, Brain, Music, Sliders, Play, Pause, 
  RotateCcw, Save, AlertTriangle, CheckCircle, Clock,
  TrendingUp, Users, BarChart3, Cpu, Database, Activity
} from 'lucide-react-native';

interface MixMindConfig {
  enabled: boolean;
  maxSessionLength: number;
  crossfadeDuration: number;
  energyVariation: number;
  genreBlending: boolean;
  aiModelVersion: string;
  qualityThreshold: number;
  userFeedbackWeight: number;
}

interface MixMindSession {
  id: string;
  userId: string;
  status: 'active' | 'completed' | 'failed';
  duration: number;
  tracksCount: number;
  satisfaction: number;
  createdAt: string;
}

const mockSessions: MixMindSession[] = [
  { id: '1', userId: 'user123', status: 'active', duration: 3600, tracksCount: 15, satisfaction: 4.8, createdAt: '2024-01-15T10:30:00Z' },
  { id: '2', userId: 'user456', status: 'completed', duration: 2400, tracksCount: 12, satisfaction: 4.2, createdAt: '2024-01-15T09:15:00Z' },
  { id: '3', userId: 'user789', status: 'completed', duration: 4200, tracksCount: 18, satisfaction: 4.9, createdAt: '2024-01-15T08:45:00Z' },
  { id: '4', userId: 'user101', status: 'failed', duration: 0, tracksCount: 0, satisfaction: 0, createdAt: '2024-01-15T08:00:00Z' },
];

export default function AdminMixMind() {
  const [config, setConfig] = useState<MixMindConfig>({
    enabled: true,
    maxSessionLength: 240, // minutes
    crossfadeDuration: 8, // seconds
    energyVariation: 0.3,
    genreBlending: true,
    aiModelVersion: 'v2.1',
    qualityThreshold: 0.8,
    userFeedbackWeight: 0.4
  });

  const [selectedTab, setSelectedTab] = useState<string>('overview');

  const updateConfig = (key: keyof MixMindConfig, value: any) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#22c55e';
      case 'completed': return '#3b82f6';
      case 'failed': return '#ef4444';
      default: return '#94a3b8';
    }
  };

  const tabs = [
    { key: 'overview', label: 'Overview', icon: BarChart3 },
    { key: 'config', label: 'Configuration', icon: Settings },
    { key: 'sessions', label: 'Active Sessions', icon: Activity },
    { key: 'models', label: 'AI Models', icon: Brain }
  ];

  return (
    <AdminLayout title="MixMind AI DJ Management">
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} testID="admin-mixmind">
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

        {/* Overview Tab */}
        {selectedTab === 'overview' && (
          <>
            {/* Stats Overview */}
            <View style={[styles.statsContainer, { backgroundColor: '#111315', borderColor: '#1f2937' }]}>
              <Text style={styles.sectionTitle}>MixMind Performance</Text>
              <View style={styles.statsGrid}>
                <View style={styles.statCard}>
                  <Zap color="#f59e0b" size={20} />
                  <Text style={styles.statValue}>12.8K</Text>
                  <Text style={styles.statLabel}>Sessions Today</Text>
                  <Text style={styles.statChange}>+18.2% ↗</Text>
                </View>
                <View style={styles.statCard}>
                  <Users color="#3b82f6" size={20} />
                  <Text style={styles.statValue}>8.4K</Text>
                  <Text style={styles.statLabel}>Active Users</Text>
                  <Text style={styles.statChange}>+12.7% ↗</Text>
                </View>
                <View style={styles.statCard}>
                  <Clock color="#8b5cf6" size={20} />
                  <Text style={styles.statValue}>4.2h</Text>
                  <Text style={styles.statLabel}>Avg. Session</Text>
                  <Text style={styles.statChange}>+5.3% ↗</Text>
                </View>
                <View style={styles.statCard}>
                  <TrendingUp color="#22c55e" size={20} />
                  <Text style={styles.statValue}>89%</Text>
                  <Text style={styles.statLabel}>Satisfaction</Text>
                  <Text style={styles.statChange}>+2.1% ↗</Text>
                </View>
              </View>
            </View>

            {/* System Health */}
            <View style={[styles.healthContainer, { backgroundColor: '#111315', borderColor: '#1f2937' }]}>
              <Text style={styles.sectionTitle}>System Health</Text>
              <View style={styles.healthGrid}>
                <View style={styles.healthItem}>
                  <Cpu color="#22c55e" size={18} />
                  <Text style={styles.healthLabel}>AI Processing</Text>
                  <Text style={styles.healthStatus}>Optimal</Text>
                  <View style={[styles.healthBar, { backgroundColor: '#22c55e' }]} />
                </View>
                <View style={styles.healthItem}>
                  <Database color="#3b82f6" size={18} />
                  <Text style={styles.healthLabel}>Music Database</Text>
                  <Text style={styles.healthStatus}>Good</Text>
                  <View style={[styles.healthBar, { backgroundColor: '#3b82f6', width: '85%' }]} />
                </View>
                <View style={styles.healthItem}>
                  <Activity color="#f59e0b" size={18} />
                  <Text style={styles.healthLabel}>Queue Processing</Text>
                  <Text style={styles.healthStatus}>Warning</Text>
                  <View style={[styles.healthBar, { backgroundColor: '#f59e0b', width: '70%' }]} />
                </View>
              </View>
            </View>
          </>
        )}

        {/* Configuration Tab */}
        {selectedTab === 'config' && (
          <View style={[styles.configContainer, { backgroundColor: '#111315', borderColor: '#1f2937' }]}>
            <Text style={styles.sectionTitle}>MixMind Configuration</Text>
            
            <View style={styles.configSection}>
              <Text style={styles.configSectionTitle}>General Settings</Text>
              
              <View style={styles.configItem}>
                <Text style={styles.configLabel}>Enable MixMind AI DJ</Text>
                <Switch
                  value={config.enabled}
                  onValueChange={(value) => updateConfig('enabled', value)}
                  trackColor={{ false: '#374151', true: '#22c55e' }}
                  thumbColor={config.enabled ? '#fff' : '#9ca3af'}
                  testID="config-enabled"
                />
              </View>

              <View style={styles.configItem}>
                <Text style={styles.configLabel}>Max Session Length (minutes)</Text>
                <TextInput
                  style={styles.configInput}
                  value={config.maxSessionLength.toString()}
                  onChangeText={(text) => updateConfig('maxSessionLength', parseInt(text) || 0)}
                  keyboardType="numeric"
                  testID="config-max-session"
                />
              </View>

              <View style={styles.configItem}>
                <Text style={styles.configLabel}>Crossfade Duration (seconds)</Text>
                <TextInput
                  style={styles.configInput}
                  value={config.crossfadeDuration.toString()}
                  onChangeText={(text) => updateConfig('crossfadeDuration', parseInt(text) || 0)}
                  keyboardType="numeric"
                  testID="config-crossfade"
                />
              </View>

              <View style={styles.configItem}>
                <Text style={styles.configLabel}>Energy Variation (0-1)</Text>
                <TextInput
                  style={styles.configInput}
                  value={config.energyVariation.toString()}
                  onChangeText={(text) => updateConfig('energyVariation', parseFloat(text) || 0)}
                  keyboardType="decimal-pad"
                  testID="config-energy"
                />
              </View>

              <View style={styles.configItem}>
                <Text style={styles.configLabel}>Enable Genre Blending</Text>
                <Switch
                  value={config.genreBlending}
                  onValueChange={(value) => updateConfig('genreBlending', value)}
                  trackColor={{ false: '#374151', true: '#22c55e' }}
                  thumbColor={config.genreBlending ? '#fff' : '#9ca3af'}
                  testID="config-genre-blending"
                />
              </View>
            </View>

            <View style={styles.configSection}>
              <Text style={styles.configSectionTitle}>AI Model Settings</Text>
              
              <View style={styles.configItem}>
                <Text style={styles.configLabel}>AI Model Version</Text>
                <TextInput
                  style={styles.configInput}
                  value={config.aiModelVersion}
                  onChangeText={(text) => updateConfig('aiModelVersion', text)}
                  testID="config-model-version"
                />
              </View>

              <View style={styles.configItem}>
                <Text style={styles.configLabel}>Quality Threshold (0-1)</Text>
                <TextInput
                  style={styles.configInput}
                  value={config.qualityThreshold.toString()}
                  onChangeText={(text) => updateConfig('qualityThreshold', parseFloat(text) || 0)}
                  keyboardType="decimal-pad"
                  testID="config-quality"
                />
              </View>

              <View style={styles.configItem}>
                <Text style={styles.configLabel}>User Feedback Weight (0-1)</Text>
                <TextInput
                  style={styles.configInput}
                  value={config.userFeedbackWeight.toString()}
                  onChangeText={(text) => updateConfig('userFeedbackWeight', parseFloat(text) || 0)}
                  keyboardType="decimal-pad"
                  testID="config-feedback-weight"
                />
              </View>
            </View>

            <View style={styles.configActions}>
              <Pressable style={styles.saveButton} testID="save-config">
                <Save color="#fff" size={16} />
                <Text style={styles.saveButtonText}>Save Configuration</Text>
              </Pressable>
              <Pressable style={styles.resetButton} testID="reset-config">
                <RotateCcw color="#cbd5e1" size={16} />
                <Text style={styles.resetButtonText}>Reset to Defaults</Text>
              </Pressable>
            </View>
          </View>
        )}

        {/* Active Sessions Tab */}
        {selectedTab === 'sessions' && (
          <View style={[styles.sessionsContainer, { backgroundColor: '#111315', borderColor: '#1f2937' }]}>
            <Text style={styles.sectionTitle}>Active MixMind Sessions</Text>
            
            {mockSessions.map((session) => (
              <View key={session.id} style={[styles.sessionItem, { backgroundColor: '#0b0f12', borderColor: '#1f2937' }]}>
                <View style={styles.sessionHeader}>
                  <Text style={styles.sessionId}>Session #{session.id}</Text>
                  <View style={[styles.sessionStatus, { backgroundColor: getStatusColor(session.status) + '20', borderColor: getStatusColor(session.status) }]}>
                    <Text style={[styles.sessionStatusText, { color: getStatusColor(session.status) }]}>{session.status}</Text>
                  </View>
                </View>
                
                <View style={styles.sessionDetails}>
                  <Text style={styles.sessionDetail}>User: {session.userId}</Text>
                  <Text style={styles.sessionDetail}>Duration: {formatDuration(session.duration)}</Text>
                  <Text style={styles.sessionDetail}>Tracks: {session.tracksCount}</Text>
                  {session.satisfaction > 0 && (
                    <Text style={styles.sessionDetail}>Satisfaction: {session.satisfaction}/5.0</Text>
                  )}
                </View>

                <View style={styles.sessionActions}>
                  <Pressable style={styles.sessionActionBtn} testID={`view-session-${session.id}`}>
                    <Play color="#3b82f6" size={14} />
                    <Text style={styles.sessionActionText}>View</Text>
                  </Pressable>
                  {session.status === 'active' && (
                    <Pressable style={styles.sessionActionBtn} testID={`pause-session-${session.id}`}>
                      <Pause color="#f59e0b" size={14} />
                      <Text style={styles.sessionActionText}>Pause</Text>
                    </Pressable>
                  )}
                </View>
              </View>
            ))}
          </View>
        )}

        {/* AI Models Tab */}
        {selectedTab === 'models' && (
          <View style={[styles.modelsContainer, { backgroundColor: '#111315', borderColor: '#1f2937' }]}>
            <Text style={styles.sectionTitle}>AI Model Management</Text>
            
            <View style={styles.modelItem}>
              <View style={styles.modelHeader}>
                <Brain color="#22c55e" size={18} />
                <Text style={styles.modelName}>MixMind Core v2.1</Text>
                <View style={[styles.modelStatus, { backgroundColor: '#22c55e20', borderColor: '#22c55e' }]}>
                  <Text style={[styles.modelStatusText, { color: '#22c55e' }]}>Active</Text>
                </View>
              </View>
              <Text style={styles.modelDescription}>Primary AI model for music recommendation and mixing</Text>
              <View style={styles.modelStats}>
                <Text style={styles.modelStat}>Accuracy: 94.2%</Text>
                <Text style={styles.modelStat}>Latency: 120ms</Text>
                <Text style={styles.modelStat}>Memory: 2.1GB</Text>
              </View>
            </View>

            <View style={styles.modelItem}>
              <View style={styles.modelHeader}>
                <Brain color="#3b82f6" size={18} />
                <Text style={styles.modelName}>Genre Classifier v1.8</Text>
                <View style={[styles.modelStatus, { backgroundColor: '#3b82f620', borderColor: '#3b82f6' }]}>
                  <Text style={[styles.modelStatusText, { color: '#3b82f6' }]}>Standby</Text>
                </View>
              </View>
              <Text style={styles.modelDescription}>Specialized model for genre detection and classification</Text>
              <View style={styles.modelStats}>
                <Text style={styles.modelStat}>Accuracy: 91.8%</Text>
                <Text style={styles.modelStat}>Latency: 80ms</Text>
                <Text style={styles.modelStat}>Memory: 1.4GB</Text>
              </View>
            </View>

            <View style={styles.modelItem}>
              <View style={styles.modelHeader}>
                <Brain color="#f59e0b" size={18} />
                <Text style={styles.modelName}>Mood Analyzer v1.3</Text>
                <View style={[styles.modelStatus, { backgroundColor: '#f59e0b20', borderColor: '#f59e0b' }]}>
                  <Text style={[styles.modelStatusText, { color: '#f59e0b' }]}>Training</Text>
                </View>
              </View>
              <Text style={styles.modelDescription}>Analyzes emotional content and mood of tracks</Text>
              <View style={styles.modelStats}>
                <Text style={styles.modelStat}>Accuracy: 87.3%</Text>
                <Text style={styles.modelStat}>Latency: 200ms</Text>
                <Text style={styles.modelStat}>Memory: 1.8GB</Text>
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
  statChange: { color: '#22c55e', fontSize: 12, marginTop: 2 },
  healthContainer: { padding: 16, borderRadius: 12, borderWidth: 1, marginBottom: 16 },
  healthGrid: { gap: 12 },
  healthItem: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, backgroundColor: '#0b0f12', borderRadius: 8 },
  healthLabel: { color: '#cbd5e1', flex: 1 },
  healthStatus: { color: '#fff', fontWeight: '500' as const, width: 80 },
  healthBar: { width: '100%', height: 4, borderRadius: 2, maxWidth: 60 },
  configContainer: { padding: 16, borderRadius: 12, borderWidth: 1, marginBottom: 16 },
  configSection: { marginBottom: 24 },
  configSectionTitle: { color: '#22c55e', fontSize: 14, fontWeight: '600' as const, marginBottom: 12 },
  configItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  configLabel: { color: '#cbd5e1', flex: 1, marginRight: 12 },
  configInput: { color: '#fff', backgroundColor: '#0b0f12', borderColor: '#1f2937', borderWidth: 1, borderRadius: 6, paddingHorizontal: 12, paddingVertical: 8, width: 120, textAlign: 'right' as const },
  configActions: { flexDirection: 'row', gap: 12, marginTop: 16 },
  saveButton: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#22c55e', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8, flex: 1 },
  saveButtonText: { color: '#fff', fontWeight: '600' as const },
  resetButton: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#374151', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8, flex: 1 },
  resetButtonText: { color: '#cbd5e1', fontWeight: '600' as const },
  sessionsContainer: { padding: 16, borderRadius: 12, borderWidth: 1, marginBottom: 16 },
  sessionItem: { marginBottom: 12, borderWidth: 1, borderRadius: 12, padding: 16 },
  sessionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  sessionId: { color: '#fff', fontWeight: '600' as const },
  sessionStatus: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4, borderWidth: 1 },
  sessionStatusText: { fontSize: 11, fontWeight: '500' as const, textTransform: 'capitalize' as const },
  sessionDetails: { marginBottom: 12, gap: 4 },
  sessionDetail: { color: '#94a3b8', fontSize: 12 },
  sessionActions: { flexDirection: 'row', gap: 8 },
  sessionActionBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6, backgroundColor: '#111827' },
  sessionActionText: { color: '#cbd5e1', fontSize: 12 },
  modelsContainer: { padding: 16, borderRadius: 12, borderWidth: 1, marginBottom: 16 },
  modelItem: { marginBottom: 16, padding: 16, backgroundColor: '#0b0f12', borderRadius: 10, borderWidth: 1, borderColor: '#1f2937' },
  modelHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  modelName: { color: '#fff', fontWeight: '600' as const, flex: 1 },
  modelStatus: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4, borderWidth: 1 },
  modelStatusText: { fontSize: 11, fontWeight: '500' as const },
  modelDescription: { color: '#94a3b8', fontSize: 12, marginBottom: 8 },
  modelStats: { flexDirection: 'row', gap: 16 },
  modelStat: { color: '#cbd5e1', fontSize: 11 },
});