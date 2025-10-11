import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { AdminLayout } from '@/components/admin/AdminLayout';

import { 
  BarChart3, ShieldCheck, AlertTriangle, Activity,
  Database, Zap, Clock, Globe, FileText,
  CheckCircle, XCircle, AlertCircle, Users, Music, Video,
  Headphones, DollarSign, Eye
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { trpc } from '@/lib/trpc';
import { ConnectionStatus } from '@/components/ConnectionStatus';
import { AdminConnectionTest } from '@/components/AdminConnectionTest';


export default function AdminDashboard() {
  const router = useRouter();
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  
  const { data: stats, isLoading, error } = trpc.admin.dashboard.getStats.useQuery();
  
  // Test basic tRPC connection with query
  const [testResponse, setTestResponse] = useState<string | null>(null);
  const [shouldTestConnection, setShouldTestConnection] = useState<boolean>(true);
  
  const hiQuery = trpc.example.hiQuery.useQuery(
    { name: 'Admin Dashboard Connection Test' },
    { 
      enabled: shouldTestConnection,
      retry: 1,
      refetchOnWindowFocus: false,
      refetchOnMount: true
    }
  );
  
  // Handle query results
  useEffect(() => {
    if (hiQuery.data) {
      console.log('[AdminDashboard] Hi query success:', hiQuery.data);
      setTestResponse(hiQuery.data?.hello || 'Connected successfully');
    } else if (hiQuery.error) {
      console.error('[AdminDashboard] Hi query error:', hiQuery.error);
      setTestResponse(`Connection failed: ${hiQuery.error.message}`);
    }
  }, [hiQuery.data, hiQuery.error]);
  const [backendUrl, setBackendUrl] = useState<string>('');
  const [connectionDetails, setConnectionDetails] = useState<{
    backendConnected: boolean;
    adminConnected: boolean;
    lastTest: string;
    errors: string[];
  }>({ backendConnected: false, adminConnected: false, lastTest: '', errors: [] });
  
  // Test connection on mount
  useEffect(() => {
    const testConnection = async () => {
      const errors: string[] = [];
      let backendConnected = false;
      let adminConnected = false;
      
      // Get the backend URL being used
      try {
        const baseUrl = process.env.EXPO_PUBLIC_RORK_API_BASE_URL || 
          (typeof window !== 'undefined' && window.location ? 
            `${window.location.protocol}//${window.location.host}` : 
            'http://localhost:3000');
        setBackendUrl(`${baseUrl}/api/trpc`);
        console.log('[AdminDashboard] Using backend URL:', `${baseUrl}/api/trpc`);
      } catch (e) {
        console.warn('[AdminDashboard] Error getting backend URL:', e);
        errors.push(`URL detection error: ${e}`);
      }
      
      // Test basic tRPC connection
      try {
        setShouldTestConnection(true);
        // Wait a bit for the query to execute
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        if (hiQuery.data?.hello) {
          backendConnected = true;
        } else if (hiQuery.error) {
          errors.push(`tRPC connection error: ${hiQuery.error.message}`);
        }
      } catch (error) {
        errors.push(`tRPC connection error: ${error}`);
      }
      
      // Check if admin data is loading properly
      if (stats && !error) {
        adminConnected = true;
      } else if (error) {
        errors.push(`Admin data error: ${error}`);
      }
      
      setConnectionDetails({
        backendConnected,
        adminConnected,
        lastTest: new Date().toISOString(),
        errors
      });
    };
    
    testConnection();
  }, [hiQuery.data, hiQuery.error, stats, error]);
  
  // Update connection status based on query results
  useEffect(() => {
    if (stats && !error) {
      setConnectionStatus('connected');
    } else if (error) {
      setConnectionStatus('error');
    }
  }, [stats, error]);
  
  useEffect(() => {
    console.log('[AdminDashboard] Connection status:', connectionStatus);
    console.log('[AdminDashboard] Test response:', testResponse);
    console.log('[AdminDashboard] Stats data:', stats);
    console.log('[AdminDashboard] Error:', error);
  }, [connectionStatus, testResponse, stats, error]);
  
  if (isLoading) {
    return (
      <AdminLayout title="Didit360 Admin Dashboard">
        <AdminConnectionTest />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading dashboard...</Text>
        </View>
      </AdminLayout>
    );
  }
  
  if (error) {
    return (
      <AdminLayout title="Didit360 Admin Dashboard">
        <AdminConnectionTest />
        <View style={styles.loadingContainer}>
          <Text style={styles.errorText}>Error loading dashboard: {String((error as any)?.message || error)}</Text>
        </View>
      </AdminLayout>
    );
  }

  const platformActions = [
    { id: 'manage-users', label: 'Manage Users', icon: Users, color: '#3b82f6', route: '/admin/users' },
    { id: 'content-moderation', label: 'Content Moderation', icon: Eye, color: '#f59e0b', route: '/admin/moderation' },
    { id: 'analytics', label: 'View Analytics', icon: BarChart3, color: '#8b5cf6', route: '/admin/analytics' },
    { id: 'revenue', label: 'Revenue Reports', icon: DollarSign, color: '#22c55e', route: '/admin/revenue' },
  ];

  const trustOpsActions = [
    { id: 'run-controls', label: 'Run Controls', icon: ShieldCheck, color: '#22c55e', route: '/admin/controls' },
    { id: 'review-findings', label: 'Review Findings', icon: AlertTriangle, color: '#ef4444', route: '/admin/controls' },
    { id: 'upload-evidence', label: 'Upload Evidence', icon: Database, color: '#3b82f6', route: '/admin/evidence' },
    { id: 'vendor-review', label: 'Vendor Review', icon: Globe, color: '#f59e0b', route: '/admin/vendors' },
  ];

  return (
    <AdminLayout title="Didit360 Admin Dashboard">
      <AdminConnectionTest />
      <ScrollView contentContainerStyle={styles.scrollContent} testID="admin-dashboard">
        {/* Connection Status */}
        <ConnectionStatus showDetails={true} />
        {/* Platform Overview */}
        <View style={[styles.card, { backgroundColor: '#111315', borderColor: '#1f2937' }]} testID="platform-overview">
          <View style={styles.cardHeader}>
            <Music color="#22c55e" size={18} />
            <Text style={styles.cardTitle}>Platform Overview</Text>
          </View>
          <View style={styles.metricsGrid}>
            <View style={styles.metricItem}>
              <Users color="#3b82f6" size={16} />
              <Text style={[styles.metricValue, { color: '#3b82f6' }]}>{stats?.platform.activeUsers}</Text>
              <Text style={styles.metricLabel}>Active Users</Text>
            </View>
            <View style={styles.metricItem}>
              <Music color="#22c55e" size={16} />
              <Text style={styles.metricValue}>{stats?.platform.tracks}</Text>
              <Text style={styles.metricLabel}>Tracks</Text>
            </View>
            <View style={styles.metricItem}>
              <Video color="#8b5cf6" size={16} />
              <Text style={[styles.metricValue, { color: '#8b5cf6' }]}>{stats?.platform.videos}</Text>
              <Text style={styles.metricLabel}>Videos</Text>
            </View>
            <View style={styles.metricItem}>
              <Headphones color="#f59e0b" size={16} />
              <Text style={[styles.metricValue, { color: '#f59e0b' }]}>{stats?.platform.podcasts}</Text>
              <Text style={styles.metricLabel}>Podcasts</Text>
            </View>
          </View>
        </View>

        {/* Content Stats */}
        <View style={[styles.card, { backgroundColor: '#111315', borderColor: '#1f2937' }]} testID="content-stats">
          <View style={styles.cardHeader}>
            <BarChart3 color="#3b82f6" size={18} />
            <Text style={styles.cardTitle}>Content Performance</Text>
          </View>
          <View style={styles.contentStats}>
            <View style={styles.statRow}>
              <View style={[styles.frameworkDot, { backgroundColor: '#22c55e' }]} />
              <Text style={styles.statLabel}>Daily Streams</Text>
              <Text style={[styles.statValue, { color: '#22c55e' }]}>{stats?.content.dailyStreams}</Text>
            </View>
            <View style={styles.statRow}>
              <View style={[styles.frameworkDot, { backgroundColor: '#3b82f6' }]} />
              <Text style={styles.statLabel}>New Uploads (24h)</Text>
              <Text style={[styles.statValue, { color: '#3b82f6' }]}>{stats?.content.newUploads}</Text>
            </View>
            <View style={styles.statRow}>
              <View style={[styles.frameworkDot, { backgroundColor: '#f59e0b' }]} />
              <Text style={styles.statLabel}>Pending Moderation</Text>
              <Text style={[styles.statValue, { color: '#f59e0b' }]}>{stats?.content.pendingModeration}</Text>
            </View>
            <View style={styles.statRow}>
              <View style={[styles.frameworkDot, { backgroundColor: '#8b5cf6' }]} />
              <Text style={styles.statLabel}>Live Streams</Text>
              <Text style={[styles.statValue, { color: '#8b5cf6' }]}>{stats?.content.liveStreams}</Text>
            </View>
          </View>
        </View>

        {/* Revenue Overview */}
        <View style={[styles.card, { backgroundColor: '#111315', borderColor: '#1f2937' }]} testID="revenue-overview">
          <View style={styles.cardHeader}>
            <DollarSign color="#22c55e" size={18} />
            <Text style={styles.cardTitle}>Revenue Overview</Text>
          </View>
          <View style={styles.revenueStats}>
            <View style={styles.revenueItem}>
              <Text style={[styles.revenueValue, { color: '#22c55e' }]}>{stats?.revenue.monthly.value}</Text>
              <Text style={styles.revenueLabel}>Monthly Revenue</Text>
              <Text style={[styles.revenueChange, { color: '#22c55e' }]}>{stats?.revenue.monthly.change}</Text>
            </View>
            <View style={styles.revenueItem}>
              <Text style={styles.revenueValue}>{stats?.revenue.payouts.value}</Text>
              <Text style={styles.revenueLabel}>Creator Payouts</Text>
              <Text style={[styles.revenueChange, { color: '#22c55e' }]}>{stats?.revenue.payouts.change}</Text>
            </View>
          </View>
        </View>
        {/* Security Posture */}
        <View style={[styles.card, { backgroundColor: '#111315', borderColor: '#1f2937' }]} testID="security-posture">
          <View style={styles.cardHeader}>
            <ShieldCheck color="#22c55e" size={18} />
            <Text style={styles.cardTitle}>Security & Compliance Posture</Text>
          </View>
          <View style={styles.metricsGrid}>
            <View style={styles.metricItem}>
              <CheckCircle color="#22c55e" size={16} />
              <Text style={[styles.metricValue, { color: '#22c55e' }]}>87%</Text>
              <Text style={styles.metricLabel}>Compliance Score</Text>
            </View>
            <View style={styles.metricItem}>
              <Activity color="#3b82f6" size={16} />
              <Text style={styles.metricValue}>342</Text>
              <Text style={styles.metricLabel}>Active Controls</Text>
            </View>
            <View style={styles.metricItem}>
              <AlertTriangle color="#f59e0b" size={16} />
              <Text style={[styles.metricValue, { color: '#f59e0b' }]}>23</Text>
              <Text style={styles.metricLabel}>Open Findings</Text>
            </View>
            <View style={styles.metricItem}>
              <XCircle color="#ef4444" size={16} />
              <Text style={[styles.metricValue, { color: '#ef4444' }]}>7</Text>
              <Text style={styles.metricLabel}>Critical Issues</Text>
            </View>
          </View>
        </View>

        {/* Framework Coverage */}
        <View style={[styles.card, { backgroundColor: '#111315', borderColor: '#1f2937' }]} testID="framework-coverage">
          <View style={styles.cardHeader}>
            <FileText color="#3b82f6" size={18} />
            <Text style={styles.cardTitle}>Framework Coverage</Text>
          </View>
          <View style={styles.contentStats}>
            <View style={styles.statRow}>
              <View style={[styles.frameworkDot, { backgroundColor: '#22c55e' }]} />
              <Text style={styles.statLabel}>SOC 2 Type II</Text>
              <Text style={[styles.statValue, { color: '#22c55e' }]}>94%</Text>
            </View>
            <View style={styles.statRow}>
              <View style={[styles.frameworkDot, { backgroundColor: '#3b82f6' }]} />
              <Text style={styles.statLabel}>ISO 27001</Text>
              <Text style={[styles.statValue, { color: '#3b82f6' }]}>89%</Text>
            </View>
            <View style={styles.statRow}>
              <View style={[styles.frameworkDot, { backgroundColor: '#f59e0b' }]} />
              <Text style={styles.statLabel}>HIPAA Security Rule</Text>
              <Text style={[styles.statValue, { color: '#f59e0b' }]}>76%</Text>
            </View>
            <View style={styles.statRow}>
              <View style={[styles.frameworkDot, { backgroundColor: '#8b5cf6' }]} />
              <Text style={styles.statLabel}>GDPR</Text>
              <Text style={[styles.statValue, { color: '#8b5cf6' }]}>82%</Text>
            </View>
          </View>
        </View>

        {/* Control Status */}
        <View style={[styles.card, { backgroundColor: '#111315', borderColor: '#1f2937' }]} testID="control-status">
          <View style={styles.cardHeader}>
            <BarChart3 color="#22c55e" size={18} />
            <Text style={styles.cardTitle}>Control Status Overview</Text>
          </View>
          <View style={styles.controlStats}>
            <View style={styles.controlItem}>
              <View style={[styles.controlBar, { backgroundColor: '#22c55e', width: '70%' }]} />
              <Text style={styles.controlLabel}>Passing: 240</Text>
            </View>
            <View style={styles.controlItem}>
              <View style={[styles.controlBar, { backgroundColor: '#ef4444', width: '15%' }]} />
              <Text style={styles.controlLabel}>Failing: 52</Text>
            </View>
            <View style={styles.controlItem}>
              <View style={[styles.controlBar, { backgroundColor: '#94a3b8', width: '15%' }]} />
              <Text style={styles.controlLabel}>Skipped: 50</Text>
            </View>
          </View>
        </View>

        {/* Vendor Risk */}
        <View style={[styles.card, { backgroundColor: '#111315', borderColor: '#1f2937' }]} testID="vendor-risk">
          <View style={styles.cardHeader}>
            <Globe color="#f59e0b" size={18} />
            <Text style={styles.cardTitle}>Vendor Risk Distribution</Text>
          </View>
          <View style={styles.vendorGrid}>
            <View style={styles.vendorItem}>
              <View style={[styles.riskDot, { backgroundColor: '#22c55e' }]} />
              <Text style={styles.vendorLabel}>Low Risk</Text>
              <Text style={styles.vendorCount}>47</Text>
            </View>
            <View style={styles.vendorItem}>
              <View style={[styles.riskDot, { backgroundColor: '#f59e0b' }]} />
              <Text style={styles.vendorLabel}>Medium Risk</Text>
              <Text style={styles.vendorCount}>23</Text>
            </View>
            <View style={styles.vendorItem}>
              <View style={[styles.riskDot, { backgroundColor: '#ef4444' }]} />
              <Text style={styles.vendorLabel}>High Risk</Text>
              <Text style={styles.vendorCount}>8</Text>
            </View>
          </View>
        </View>

        {/* Platform Actions */}
        <View style={[styles.card, { backgroundColor: '#111315', borderColor: '#1f2937' }]} testID="platform-actions">
          <View style={styles.cardHeader}>
            <Zap color="#3b82f6" size={18} />
            <Text style={styles.cardTitle}>Platform Actions</Text>
          </View>
          <View style={styles.actionsGrid}>
            {platformActions.map((action) => {
              const Icon = action.icon;
              return (
                <Pressable
                  key={action.id}
                  style={({ pressed }) => [
                    styles.actionButton,
                    { backgroundColor: pressed ? '#1f2937' : '#0f172a' }
                  ]}
                  onPress={() => router.push(action.route as any)}
                  testID={`platform-action-${action.id}`}
                >
                  <Icon color={action.color} size={20} />
                  <Text style={styles.actionLabel}>{action.label}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* TrustOps Actions */}
        <View style={[styles.card, { backgroundColor: '#111315', borderColor: '#1f2937' }]} testID="trustops-actions">
          <View style={styles.cardHeader}>
            <ShieldCheck color="#22c55e" size={18} />
            <Text style={styles.cardTitle}>Security & Compliance Actions</Text>
          </View>
          <View style={styles.actionsGrid}>
            {trustOpsActions.map((action) => {
              const Icon = action.icon;
              return (
                <Pressable
                  key={action.id}
                  style={({ pressed }) => [
                    styles.actionButton,
                    { backgroundColor: pressed ? '#1f2937' : '#0f172a' }
                  ]}
                  onPress={() => router.push(action.route as any)}
                  testID={`trustops-action-${action.id}`}
                >
                  <Icon color={action.color} size={20} />
                  <Text style={styles.actionLabel}>{action.label}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Recent Evidence */}
        <View style={[styles.card, { backgroundColor: '#111315', borderColor: '#1f2937' }]} testID="recent-evidence">
          <View style={styles.cardHeader}>
            <Database color="#3b82f6" size={18} />
            <Text style={styles.cardTitle}>Recent Evidence</Text>
          </View>
          <View style={styles.evidenceItem}>
            <View style={[styles.evidenceDot, { backgroundColor: '#22c55e' }]} />
            <Text style={styles.evidenceText}>AWS CloudTrail logs uploaded</Text>
            <Text style={styles.evidenceTime}>5m ago</Text>
          </View>
          <View style={styles.evidenceItem}>
            <View style={[styles.evidenceDot, { backgroundColor: '#3b82f6' }]} />
            <Text style={styles.evidenceText}>SOC 2 audit report attached</Text>
            <Text style={styles.evidenceTime}>1h ago</Text>
          </View>
          <View style={styles.evidenceItem}>
            <View style={[styles.evidenceDot, { backgroundColor: '#f59e0b' }]} />
            <Text style={styles.evidenceText}>Penetration test results</Text>
            <Text style={styles.evidenceTime}>3h ago</Text>
          </View>
        </View>

        {/* Open Findings */}
        <View style={[styles.card, { backgroundColor: '#111315', borderColor: '#1f2937' }]} testID="open-findings">
          <View style={styles.cardHeader}>
            <AlertTriangle color="#ef4444" size={18} />
            <Text style={styles.cardTitle}>Critical Open Findings</Text>
          </View>
          <View style={styles.findingItem}>
            <AlertCircle color="#ef4444" size={14} />
            <Text style={styles.findingText}>MFA not enforced for admin accounts</Text>
            <Text style={styles.findingAge}>2d</Text>
          </View>
          <View style={styles.findingItem}>
            <AlertCircle color="#f59e0b" size={14} />
            <Text style={styles.findingText}>Encryption at rest not configured</Text>
            <Text style={styles.findingAge}>5d</Text>
          </View>
          <View style={styles.findingItem}>
            <AlertCircle color="#ef4444" size={14} />
            <Text style={styles.findingText}>Access logs retention policy missing</Text>
            <Text style={styles.findingAge}>1w</Text>
          </View>
        </View>

        {/* Upcoming Audits */}
        <View style={[styles.card, { backgroundColor: '#111315', borderColor: '#1f2937' }]} testID="upcoming-audits">
          <View style={styles.cardHeader}>
            <Clock color="#8b5cf6" size={18} />
            <Text style={styles.cardTitle}>Upcoming Audits & Expiries</Text>
          </View>
          <View style={styles.auditItem}>
            <View style={[styles.auditDot, { backgroundColor: '#f59e0b' }]} />
            <Text style={styles.auditText}>SOC 2 Type II audit renewal</Text>
            <Text style={styles.auditDate}>Mar 15</Text>
          </View>
          <View style={styles.auditItem}>
            <View style={[styles.auditDot, { backgroundColor: '#3b82f6' }]} />
            <Text style={styles.auditText}>ISO 27001 certificate expiry</Text>
            <Text style={styles.auditDate}>Jun 30</Text>
          </View>
          <View style={styles.auditItem}>
            <View style={[styles.auditDot, { backgroundColor: '#22c55e' }]} />
            <Text style={styles.auditText}>Quarterly security review</Text>
            <Text style={styles.auditDate}>Apr 1</Text>
          </View>
        </View>
      </ScrollView>
    </AdminLayout>
  );
}

const styles = StyleSheet.create({
  card: { padding: 16, borderRadius: 14, borderWidth: 1, marginBottom: 16 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  cardTitle: { color: '#fff', fontWeight: '600' as const },
  metricsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16 },
  metricItem: { alignItems: 'center', minWidth: 80 },
  metricValue: { color: '#fff', fontSize: 18, fontWeight: '700' as const, marginTop: 4 },
  metricLabel: { color: '#94a3b8', fontSize: 12, marginTop: 2 },
  contentStats: { gap: 8 },
  statRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  statLabel: { color: '#cbd5e1', flex: 1 },
  statValue: { color: '#fff', fontWeight: '600' as const },
  frameworkDot: { width: 8, height: 8, borderRadius: 4 },
  controlStats: { gap: 8 },
  controlItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  controlBar: { height: 6, borderRadius: 3 },
  controlLabel: { color: '#cbd5e1', fontSize: 13 },
  vendorGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16 },
  vendorItem: { flexDirection: 'row', alignItems: 'center', gap: 6, minWidth: 100 },
  riskDot: { width: 8, height: 8, borderRadius: 4 },
  vendorLabel: { color: '#cbd5e1', fontSize: 12, flex: 1 },
  vendorCount: { color: '#fff', fontSize: 12, fontWeight: '600' as const },
  revenueStats: { flexDirection: 'row', gap: 24 },
  revenueItem: { flex: 1 },
  revenueValue: { color: '#fff', fontSize: 24, fontWeight: '700' as const },
  revenueLabel: { color: '#94a3b8', fontSize: 12, marginTop: 4 },
  revenueChange: { fontSize: 12, fontWeight: '600' as const, marginTop: 2 },
  actionsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  actionButton: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 8, 
    padding: 12, 
    borderRadius: 10, 
    minWidth: 140,
    borderWidth: 1,
    borderColor: '#1f2937'
  },
  actionLabel: { color: '#fff', fontSize: 13, fontWeight: '500' as const },
  evidenceItem: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  evidenceDot: { width: 6, height: 6, borderRadius: 3 },
  evidenceText: { color: '#cbd5e1', flex: 1, fontSize: 13 },
  evidenceTime: { color: '#94a3b8', fontSize: 11 },
  findingItem: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  findingText: { color: '#cbd5e1', flex: 1, fontSize: 13 },
  findingAge: { color: '#94a3b8', fontSize: 11 },
  auditItem: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  auditDot: { width: 6, height: 6, borderRadius: 3 },
  auditText: { color: '#cbd5e1', flex: 1, fontSize: 13 },
  auditDate: { color: '#94a3b8', fontSize: 11 },

  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { color: '#fff' },
  errorText: { color: '#ef4444' },
  scrollContent: { paddingBottom: 40 },
});