import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useTheme } from '@/components/ui/Theme';
import { 
  BarChart3, Users, Music, Video, Headphones, BookOpen, 
  DollarSign, AlertTriangle, TrendingUp, Activity,
  Radio, Zap, Shield, Clock, Globe, MessageSquare
} from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function AdminDashboard() {
  const { colors } = useTheme();
  const router = useRouter();

  const quickActions = [
    { label: 'Review Content', icon: Shield, color: '#f59e0b', route: '/admin/content' },
    { label: 'User Reports', icon: AlertTriangle, color: '#ef4444', route: '/admin/users' },
    { label: 'Revenue Analytics', icon: DollarSign, color: '#22c55e', route: '/admin/revenue' },
    { label: 'System Health', icon: Activity, color: '#3b82f6', route: '/admin/settings' },
  ];

  return (
    <AdminLayout title="Dashboard">
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} testID="admin-dashboard">
        {/* Platform Overview */}
        <View style={[styles.card, { backgroundColor: '#111315', borderColor: '#1f2937' }]} testID="platform-overview">
          <View style={styles.cardHeader}>
            <BarChart3 color="#22c55e" size={18} />
            <Text style={styles.cardTitle}>Platform Overview</Text>
          </View>
          <View style={styles.metricsGrid}>
            <View style={styles.metricItem}>
              <Users color="#3b82f6" size={16} />
              <Text style={styles.metricValue}>2.4M</Text>
              <Text style={styles.metricLabel}>Total Users</Text>
            </View>
            <View style={styles.metricItem}>
              <Activity color="#22c55e" size={16} />
              <Text style={styles.metricValue}>847K</Text>
              <Text style={styles.metricLabel}>Active Today</Text>
            </View>
            <View style={styles.metricItem}>
              <TrendingUp color="#f59e0b" size={16} />
              <Text style={styles.metricValue}>+12.4%</Text>
              <Text style={styles.metricLabel}>Growth</Text>
            </View>
            <View style={styles.metricItem}>
              <Globe color="#8b5cf6" size={16} />
              <Text style={styles.metricValue}>127</Text>
              <Text style={styles.metricLabel}>Countries</Text>
            </View>
          </View>
        </View>

        {/* Content Statistics */}
        <View style={[styles.card, { backgroundColor: '#111315', borderColor: '#1f2937' }]} testID="content-stats">
          <View style={styles.cardHeader}>
            <Music color="#f59e0b" size={18} />
            <Text style={styles.cardTitle}>Content Library</Text>
          </View>
          <View style={styles.contentStats}>
            <View style={styles.statRow}>
              <Music color="#3b82f6" size={14} />
              <Text style={styles.statLabel}>Audio Tracks</Text>
              <Text style={styles.statValue}>1.2M</Text>
            </View>
            <View style={styles.statRow}>
              <Video color="#ef4444" size={14} />
              <Text style={styles.statLabel}>Videos</Text>
              <Text style={styles.statValue}>340K</Text>
            </View>
            <View style={styles.statRow}>
              <Headphones color="#22c55e" size={14} />
              <Text style={styles.statLabel}>Podcasts</Text>
              <Text style={styles.statValue}>89K</Text>
            </View>
            <View style={styles.statRow}>
              <BookOpen color="#8b5cf6" size={14} />
              <Text style={styles.statLabel}>Audiobooks</Text>
              <Text style={styles.statValue}>45K</Text>
            </View>
            <View style={styles.statRow}>
              <Radio color="#f59e0b" size={14} />
              <Text style={styles.statLabel}>MixMind Sessions</Text>
              <Text style={styles.statValue}>12.8K</Text>
            </View>
          </View>
        </View>

        {/* Real-time Activity */}
        <View style={[styles.card, { backgroundColor: '#111315', borderColor: '#1f2937' }]} testID="realtime-activity">
          <View style={styles.cardHeader}>
            <Zap color="#22c55e" size={18} />
            <Text style={styles.cardTitle}>Real-time Activity</Text>
          </View>
          <Text style={styles.metric}>🎵 Streams per minute: 4,829</Text>
          <Text style={styles.metric}>📤 Uploads today: 1,247</Text>
          <Text style={styles.metric}>⚠️ Content pending review: 47</Text>
          <Text style={styles.metric}>🚫 Moderation actions: 23</Text>
          <Text style={styles.metric}>💰 Revenue today: $18,429</Text>
        </View>

        {/* System Health */}
        <View style={[styles.card, { backgroundColor: '#111315', borderColor: '#1f2937' }]} testID="system-health">
          <View style={styles.cardHeader}>
            <Activity color="#3b82f6" size={18} />
            <Text style={styles.cardTitle}>System Health</Text>
          </View>
          <View style={styles.healthGrid}>
            <View style={styles.healthItem}>
              <View style={[styles.healthDot, { backgroundColor: '#22c55e' }]} />
              <Text style={styles.healthLabel}>API Services</Text>
              <Text style={styles.healthStatus}>99.9%</Text>
            </View>
            <View style={styles.healthItem}>
              <View style={[styles.healthDot, { backgroundColor: '#22c55e' }]} />
              <Text style={styles.healthLabel}>CDN</Text>
              <Text style={styles.healthStatus}>100%</Text>
            </View>
            <View style={styles.healthItem}>
              <View style={[styles.healthDot, { backgroundColor: '#f59e0b' }]} />
              <Text style={styles.healthLabel}>Database</Text>
              <Text style={styles.healthStatus}>97.2%</Text>
            </View>
            <View style={styles.healthItem}>
              <View style={[styles.healthDot, { backgroundColor: '#22c55e' }]} />
              <Text style={styles.healthLabel}>Storage</Text>
              <Text style={styles.healthStatus}>99.1%</Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={[styles.card, { backgroundColor: '#111315', borderColor: '#1f2937' }]} testID="quick-actions">
          <View style={styles.cardHeader}>
            <Clock color="#8b5cf6" size={18} />
            <Text style={styles.cardTitle}>Quick Actions</Text>
          </View>
          <View style={styles.actionsGrid}>
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Pressable
                  key={index}
                  style={({ pressed }) => [
                    styles.actionButton,
                    { backgroundColor: pressed ? '#1f2937' : '#0f172a' }
                  ]}
                  onPress={() => router.push(action.route as any)}
                  testID={`quick-action-${index}`}
                >
                  <Icon color={action.color} size={20} />
                  <Text style={styles.actionLabel}>{action.label}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Recent Alerts */}
        <View style={[styles.card, { backgroundColor: '#111315', borderColor: '#1f2937' }]} testID="recent-alerts">
          <View style={styles.cardHeader}>
            <MessageSquare color="#ef4444" size={18} />
            <Text style={styles.cardTitle}>Recent Alerts</Text>
          </View>
          <View style={styles.alertItem}>
            <View style={[styles.alertDot, { backgroundColor: '#ef4444' }]} />
            <Text style={styles.alertText}>High CPU usage detected on media-prep service</Text>
            <Text style={styles.alertTime}>2m ago</Text>
          </View>
          <View style={styles.alertItem}>
            <View style={[styles.alertDot, { backgroundColor: '#f59e0b' }]} />
            <Text style={styles.alertText}>47 content items pending moderation review</Text>
            <Text style={styles.alertTime}>15m ago</Text>
          </View>
          <View style={styles.alertItem}>
            <View style={[styles.alertDot, { backgroundColor: '#22c55e' }]} />
            <Text style={styles.alertText}>Daily backup completed successfully</Text>
            <Text style={styles.alertTime}>1h ago</Text>
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
  metric: { color: '#cbd5e1', marginTop: 4 },
  metricsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16 },
  metricItem: { alignItems: 'center', minWidth: 80 },
  metricValue: { color: '#fff', fontSize: 18, fontWeight: '700' as const, marginTop: 4 },
  metricLabel: { color: '#94a3b8', fontSize: 12, marginTop: 2 },
  contentStats: { gap: 8 },
  statRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  statLabel: { color: '#cbd5e1', flex: 1 },
  statValue: { color: '#fff', fontWeight: '600' as const },
  healthGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16 },
  healthItem: { flexDirection: 'row', alignItems: 'center', gap: 6, minWidth: 120 },
  healthDot: { width: 8, height: 8, borderRadius: 4 },
  healthLabel: { color: '#cbd5e1', fontSize: 12, flex: 1 },
  healthStatus: { color: '#fff', fontSize: 12, fontWeight: '600' as const },
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
  alertItem: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  alertDot: { width: 6, height: 6, borderRadius: 3 },
  alertText: { color: '#cbd5e1', flex: 1, fontSize: 13 },
  alertTime: { color: '#94a3b8', fontSize: 11 },
});
