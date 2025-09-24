import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useTheme } from '@/components/ui/Theme';
import { 
  BarChart3, ShieldCheck, AlertTriangle, TrendingUp, Activity,
  Database, Zap, Clock, Globe, MessageSquare, FileText,
  CheckCircle, XCircle, AlertCircle, Users
} from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function TrustOpsDashboard() {
  const { colors } = useTheme();
  const router = useRouter();

  const quickActions = [
    { id: 'run-controls', label: 'Run Controls', icon: ShieldCheck, color: '#22c55e', route: '/admin/controls' },
    { id: 'review-findings', label: 'Review Findings', icon: AlertTriangle, color: '#ef4444', route: '/admin/controls' },
    { id: 'upload-evidence', label: 'Upload Evidence', icon: Database, color: '#3b82f6', route: '/admin/evidence' },
    { id: 'vendor-review', label: 'Vendor Review', icon: Globe, color: '#f59e0b', route: '/admin/vendors' },
  ];

  return (
    <AdminLayout title="TrustOps Dashboard">
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} testID="trustops-dashboard">
        {/* Overall Posture */}
        <View style={[styles.card, { backgroundColor: '#111315', borderColor: '#1f2937' }]} testID="overall-posture">
          <View style={styles.cardHeader}>
            <ShieldCheck color="#22c55e" size={18} />
            <Text style={styles.cardTitle}>Overall Security Posture</Text>
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

        {/* Quick Actions */}
        <View style={[styles.card, { backgroundColor: '#111315', borderColor: '#1f2937' }]} testID="quick-actions">
          <View style={styles.cardHeader}>
            <Zap color="#8b5cf6" size={18} />
            <Text style={styles.cardTitle}>Quick Actions</Text>
          </View>
          <View style={styles.actionsGrid}>
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Pressable
                  key={action.id}
                  style={({ pressed }) => [
                    styles.actionButton,
                    { backgroundColor: pressed ? '#1f2937' : '#0f172a' }
                  ]}
                  onPress={() => router.push(action.route as any)}
                  testID={`quick-action-${action.id}`}
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
});