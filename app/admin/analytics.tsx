import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { 
  BarChart3, TrendingUp, Users, Music, Video, Headphones, 
  BookOpen, DollarSign, Globe, Calendar, Download, Play,
  Eye, Heart, Share2, MessageSquare, Clock, Zap
} from 'lucide-react-native';
import { trpc } from '@/lib/trpc';

export default function AdminAnalytics() {
  const [selectedPeriod, setSelectedPeriod] = useState<string>('7d');
  const [selectedMetric, setSelectedMetric] = useState<string>('streams');
  
  const { data: analytics, isLoading, error } = trpc.admin.analytics.getAnalytics.useQuery({
    period: selectedPeriod as any,
    metric: selectedMetric as any,
  });
  
  if (isLoading) {
    return (
      <AdminLayout title="Analytics & Reports">
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: '#fff' }}>Loading analytics...</Text>
        </View>
      </AdminLayout>
    );
  }
  
  if (error) {
    return (
      <AdminLayout title="Analytics & Reports">
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: '#ef4444' }}>Error loading analytics: {error.message}</Text>
        </View>
      </AdminLayout>
    );
  }

  const periods = [
    { key: '24h', label: '24 Hours' },
    { key: '7d', label: '7 Days' },
    { key: '30d', label: '30 Days' },
    { key: '90d', label: '90 Days' },
    { key: '1y', label: '1 Year' }
  ];

  const metrics = [
    { key: 'streams', label: 'Streams', icon: Play, color: '#22c55e' },
    { key: 'users', label: 'Active Users', icon: Users, color: '#3b82f6' },
    { key: 'revenue', label: 'Revenue', icon: DollarSign, color: '#f59e0b' },
    { key: 'engagement', label: 'Engagement', icon: Heart, color: '#ef4444' }
  ];

  return (
    <AdminLayout title="Analytics & Reports">
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} testID="admin-analytics">
        {/* Time Period Selector */}
        <View style={[styles.periodContainer, { backgroundColor: '#111315', borderColor: '#1f2937' }]}>
          <Text style={styles.sectionTitle}>Time Period</Text>
          <View style={styles.periodButtons}>
            {periods.map(period => (
              <Pressable
                key={period.key}
                style={[styles.periodButton, selectedPeriod === period.key && styles.periodButtonActive]}
                onPress={() => setSelectedPeriod(period.key)}
                testID={`period-${period.key}`}
              >
                <Text style={[styles.periodButtonText, selectedPeriod === period.key && styles.periodButtonTextActive]}>
                  {period.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Key Metrics Overview */}
        <View style={[styles.metricsContainer, { backgroundColor: '#111315', borderColor: '#1f2937' }]}>
          <Text style={styles.sectionTitle}>Key Metrics ({selectedPeriod})</Text>
          <View style={styles.metricsGrid}>
            <View style={styles.metricCard}>
              <Play color="#22c55e" size={24} />
              <Text style={styles.metricValue}>{analytics?.keyMetrics.totalStreams.value}</Text>
              <Text style={styles.metricLabel}>Total Streams</Text>
              <Text style={styles.metricChange}>{analytics?.keyMetrics.totalStreams.change}</Text>
            </View>
            <View style={styles.metricCard}>
              <Users color="#3b82f6" size={24} />
              <Text style={styles.metricValue}>{analytics?.keyMetrics.activeUsers.value}</Text>
              <Text style={styles.metricLabel}>Active Users</Text>
              <Text style={styles.metricChange}>{analytics?.keyMetrics.activeUsers.change}</Text>
            </View>
            <View style={styles.metricCard}>
              <DollarSign color="#f59e0b" size={24} />
              <Text style={styles.metricValue}>{analytics?.keyMetrics.revenue.value}</Text>
              <Text style={styles.metricLabel}>Revenue</Text>
              <Text style={styles.metricChange}>{analytics?.keyMetrics.revenue.change}</Text>
            </View>
            <View style={styles.metricCard}>
              <Clock color="#8b5cf6" size={24} />
              <Text style={styles.metricValue}>{analytics?.keyMetrics.avgSession.value}</Text>
              <Text style={styles.metricLabel}>Avg. Session</Text>
              <Text style={styles.metricChange}>{analytics?.keyMetrics.avgSession.change}</Text>
            </View>
          </View>
        </View>

        {/* Content Performance */}
        <View style={[styles.contentContainer, { backgroundColor: '#111315', borderColor: '#1f2937' }]}>
          <Text style={styles.sectionTitle}>Content Performance</Text>
          <View style={styles.contentGrid}>
            <View style={styles.contentCard}>
              <Music color="#3b82f6" size={20} />
              <View style={styles.contentStats}>
                <Text style={styles.contentValue}>{analytics?.contentPerformance.audioTracks.count}</Text>
                <Text style={styles.contentLabel}>Audio Tracks</Text>
                <Text style={styles.contentMetric}>{analytics?.contentPerformance.audioTracks.streams}</Text>
              </View>
            </View>
            <View style={styles.contentCard}>
              <Video color="#ef4444" size={20} />
              <View style={styles.contentStats}>
                <Text style={styles.contentValue}>{analytics?.contentPerformance.videos.count}</Text>
                <Text style={styles.contentLabel}>Videos</Text>
                <Text style={styles.contentMetric}>{analytics?.contentPerformance.videos.views}</Text>
              </View>
            </View>
            <View style={styles.contentCard}>
              <Headphones color="#22c55e" size={20} />
              <View style={styles.contentStats}>
                <Text style={styles.contentValue}>{analytics?.contentPerformance.podcasts.count}</Text>
                <Text style={styles.contentLabel}>Podcasts</Text>
                <Text style={styles.contentMetric}>{analytics?.contentPerformance.podcasts.listens}</Text>
              </View>
            </View>
            <View style={styles.contentCard}>
              <BookOpen color="#8b5cf6" size={20} />
              <View style={styles.contentStats}>
                <Text style={styles.contentValue}>{analytics?.contentPerformance.audiobooks.count}</Text>
                <Text style={styles.contentLabel}>Audiobooks</Text>
                <Text style={styles.contentMetric}>{analytics?.contentPerformance.audiobooks.hours}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Geographic Distribution */}
        <View style={[styles.geoContainer, { backgroundColor: '#111315', borderColor: '#1f2937' }]}>
          <Text style={styles.sectionTitle}>Geographic Distribution</Text>
          <View style={styles.geoList}>
            <View style={styles.geoItem}>
              <Text style={styles.geoCountry}>🇺🇸 United States</Text>
              <Text style={styles.geoPercentage}>28.4%</Text>
              <Text style={styles.geoUsers}>680K users</Text>
            </View>
            <View style={styles.geoItem}>
              <Text style={styles.geoCountry}>🇬🇧 United Kingdom</Text>
              <Text style={styles.geoPercentage}>15.2%</Text>
              <Text style={styles.geoUsers}>365K users</Text>
            </View>
            <View style={styles.geoItem}>
              <Text style={styles.geoCountry}>🇨🇦 Canada</Text>
              <Text style={styles.geoPercentage}>12.8%</Text>
              <Text style={styles.geoUsers}>307K users</Text>
            </View>
            <View style={styles.geoItem}>
              <Text style={styles.geoCountry}>🇦🇺 Australia</Text>
              <Text style={styles.geoPercentage}>9.6%</Text>
              <Text style={styles.geoUsers}>230K users</Text>
            </View>
            <View style={styles.geoItem}>
              <Text style={styles.geoCountry}>🇩🇪 Germany</Text>
              <Text style={styles.geoPercentage}>8.3%</Text>
              <Text style={styles.geoUsers}>199K users</Text>
            </View>
          </View>
        </View>

        {/* User Engagement */}
        <View style={[styles.engagementContainer, { backgroundColor: '#111315', borderColor: '#1f2937' }]}>
          <Text style={styles.sectionTitle}>User Engagement</Text>
          <View style={styles.engagementGrid}>
            <View style={styles.engagementCard}>
              <Heart color="#ef4444" size={18} />
              <Text style={styles.engagementValue}>12.4M</Text>
              <Text style={styles.engagementLabel}>Likes</Text>
            </View>
            <View style={styles.engagementCard}>
              <Share2 color="#3b82f6" size={18} />
              <Text style={styles.engagementValue}>3.2M</Text>
              <Text style={styles.engagementLabel}>Shares</Text>
            </View>
            <View style={styles.engagementCard}>
              <MessageSquare color="#22c55e" size={18} />
              <Text style={styles.engagementValue}>890K</Text>
              <Text style={styles.engagementLabel}>Comments</Text>
            </View>
            <View style={styles.engagementCard}>
              <Download color="#f59e0b" size={18} />
              <Text style={styles.engagementValue}>567K</Text>
              <Text style={styles.engagementLabel}>Downloads</Text>
            </View>
          </View>
        </View>

        {/* Top Performing Content */}
        <View style={[styles.topContentContainer, { backgroundColor: '#111315', borderColor: '#1f2937' }]}>
          <Text style={styles.sectionTitle}>Top Performing Content</Text>
          <View style={styles.topContentList}>
            <View style={styles.topContentItem}>
              <Text style={styles.topContentRank}>#1</Text>
              <View style={styles.topContentInfo}>
                <Text style={styles.topContentTitle}>Midnight Dreams</Text>
                <Text style={styles.topContentArtist}>by Luna Rodriguez</Text>
              </View>
              <Text style={styles.topContentStreams}>2.4M streams</Text>
            </View>
            <View style={styles.topContentItem}>
              <Text style={styles.topContentRank}>#2</Text>
              <View style={styles.topContentInfo}>
                <Text style={styles.topContentTitle}>Electric Nights</Text>
                <Text style={styles.topContentArtist}>by Neon Pulse</Text>
              </View>
              <Text style={styles.topContentStreams}>1.8M streams</Text>
            </View>
            <View style={styles.topContentItem}>
              <Text style={styles.topContentRank}>#3</Text>
              <View style={styles.topContentInfo}>
                <Text style={styles.topContentTitle}>Ocean Waves</Text>
                <Text style={styles.topContentArtist}>by Calm Sounds</Text>
              </View>
              <Text style={styles.topContentStreams}>1.5M streams</Text>
            </View>
          </View>
        </View>

        {/* MixMind AI DJ Analytics */}
        <View style={[styles.mixmindContainer, { backgroundColor: '#111315', borderColor: '#1f2937' }]}>
          <View style={styles.mixmindHeader}>
            <Zap color="#f59e0b" size={20} />
            <Text style={styles.sectionTitle}>MixMind AI DJ Analytics</Text>
          </View>
          <View style={styles.mixmindStats}>
            <View style={styles.mixmindStat}>
              <Text style={styles.mixmindValue}>12.8K</Text>
              <Text style={styles.mixmindLabel}>Sessions Created</Text>
            </View>
            <View style={styles.mixmindStat}>
              <Text style={styles.mixmindValue}>4.2h</Text>
              <Text style={styles.mixmindLabel}>Avg. Session Length</Text>
            </View>
            <View style={styles.mixmindStat}>
              <Text style={styles.mixmindValue}>89%</Text>
              <Text style={styles.mixmindLabel}>User Satisfaction</Text>
            </View>
            <View style={styles.mixmindStat}>
              <Text style={styles.mixmindValue}>234K</Text>
              <Text style={styles.mixmindLabel}>Total Listens</Text>
            </View>
          </View>
        </View>

        {/* Revenue Breakdown */}
        <View style={[styles.revenueContainer, { backgroundColor: '#111315', borderColor: '#1f2937' }]}>
          <Text style={styles.sectionTitle}>Revenue Breakdown</Text>
          <View style={styles.revenueList}>
            <View style={styles.revenueItem}>
              <Text style={styles.revenueSource}>Premium Subscriptions</Text>
              <Text style={styles.revenueAmount}>$847K (68%)</Text>
            </View>
            <View style={styles.revenueItem}>
              <Text style={styles.revenueSource}>Advertising</Text>
              <Text style={styles.revenueAmount}>$234K (19%)</Text>
            </View>
            <View style={styles.revenueItem}>
              <Text style={styles.revenueSource}>Creator Tips</Text>
              <Text style={styles.revenueAmount}>$89K (7%)</Text>
            </View>
            <View style={styles.revenueItem}>
              <Text style={styles.revenueSource}>Merchandise</Text>
              <Text style={styles.revenueAmount}>$45K (4%)</Text>
            </View>
            <View style={styles.revenueItem}>
              <Text style={styles.revenueSource}>Other</Text>
              <Text style={styles.revenueAmount}>$23K (2%)</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </AdminLayout>
  );
}

const styles = StyleSheet.create({
  periodContainer: { padding: 16, borderRadius: 12, borderWidth: 1, marginBottom: 16 },
  sectionTitle: { color: '#fff', fontSize: 16, fontWeight: '600' as const, marginBottom: 12 },
  periodButtons: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  periodButton: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8, backgroundColor: '#0b0f12', borderWidth: 1, borderColor: '#1f2937' },
  periodButtonActive: { backgroundColor: '#22c55e', borderColor: '#22c55e' },
  periodButtonText: { color: '#cbd5e1', fontSize: 14 },
  periodButtonTextActive: { color: '#fff' },
  metricsContainer: { padding: 16, borderRadius: 12, borderWidth: 1, marginBottom: 16 },
  metricsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  metricCard: { flex: 1, minWidth: 140, alignItems: 'center', padding: 16, backgroundColor: '#0b0f12', borderRadius: 10, borderWidth: 1, borderColor: '#1f2937' },
  metricValue: { color: '#fff', fontSize: 24, fontWeight: '700' as const, marginTop: 8 },
  metricLabel: { color: '#94a3b8', fontSize: 12, marginTop: 4 },
  metricChange: { color: '#22c55e', fontSize: 12, marginTop: 2 },
  contentContainer: { padding: 16, borderRadius: 12, borderWidth: 1, marginBottom: 16 },
  contentGrid: { gap: 12 },
  contentCard: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, backgroundColor: '#0b0f12', borderRadius: 8, borderWidth: 1, borderColor: '#1f2937' },
  contentStats: { flex: 1 },
  contentValue: { color: '#fff', fontSize: 18, fontWeight: '600' as const },
  contentLabel: { color: '#94a3b8', fontSize: 12 },
  contentMetric: { color: '#cbd5e1', fontSize: 12, marginTop: 2 },
  geoContainer: { padding: 16, borderRadius: 12, borderWidth: 1, marginBottom: 16 },
  geoList: { gap: 8 },
  geoItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 12, backgroundColor: '#0b0f12', borderRadius: 8 },
  geoCountry: { color: '#fff', flex: 1 },
  geoPercentage: { color: '#22c55e', fontWeight: '600' as const, width: 60, textAlign: 'right' as const },
  geoUsers: { color: '#94a3b8', fontSize: 12, width: 80, textAlign: 'right' as const },
  engagementContainer: { padding: 16, borderRadius: 12, borderWidth: 1, marginBottom: 16 },
  engagementGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  engagementCard: { flex: 1, minWidth: 100, alignItems: 'center', padding: 12, backgroundColor: '#0b0f12', borderRadius: 8, borderWidth: 1, borderColor: '#1f2937' },
  engagementValue: { color: '#fff', fontSize: 16, fontWeight: '600' as const, marginTop: 6 },
  engagementLabel: { color: '#94a3b8', fontSize: 11, marginTop: 2 },
  topContentContainer: { padding: 16, borderRadius: 12, borderWidth: 1, marginBottom: 16 },
  topContentList: { gap: 8 },
  topContentItem: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, backgroundColor: '#0b0f12', borderRadius: 8 },
  topContentRank: { color: '#f59e0b', fontWeight: '700' as const, width: 30 },
  topContentInfo: { flex: 1 },
  topContentTitle: { color: '#fff', fontWeight: '600' as const },
  topContentArtist: { color: '#94a3b8', fontSize: 12 },
  topContentStreams: { color: '#22c55e', fontSize: 12, fontWeight: '500' as const },
  mixmindContainer: { padding: 16, borderRadius: 12, borderWidth: 1, marginBottom: 16 },
  mixmindHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  mixmindStats: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  mixmindStat: { flex: 1, minWidth: 100, alignItems: 'center', padding: 12, backgroundColor: '#0b0f12', borderRadius: 8, borderWidth: 1, borderColor: '#1f2937' },
  mixmindValue: { color: '#fff', fontSize: 18, fontWeight: '600' as const },
  mixmindLabel: { color: '#94a3b8', fontSize: 11, marginTop: 2, textAlign: 'center' as const },
  revenueContainer: { padding: 16, borderRadius: 12, borderWidth: 1, marginBottom: 16 },
  revenueList: { gap: 8 },
  revenueItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 12, backgroundColor: '#0b0f12', borderRadius: 8 },
  revenueSource: { color: '#cbd5e1', flex: 1 },
  revenueAmount: { color: '#22c55e', fontWeight: '600' as const },
});