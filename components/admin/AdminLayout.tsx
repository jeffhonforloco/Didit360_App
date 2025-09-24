import React, { ReactNode, useMemo } from 'react';
import { View, StyleSheet, Platform, Pressable, Text } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { 
  Bell, User2, LayoutDashboard, Users, Library, Radio, Palette, DollarSign, 
  ShieldCheck, HelpCircle, Settings, BarChart3, Zap, Database, 
  MessageSquare, FileText, Shield, Activity, Globe, Headphones,
  Video, BookOpen, Music, AlertTriangle, Key, Upload, Mic, 
  TrendingUp, Eye, Gavel, LifeBuoy, Lock
} from 'lucide-react-native';
import { useTheme } from '@/components/ui/Theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface Item {
  key: string;
  label: string;
  icon: React.ComponentType<{ color?: string; size?: number }>;
  href: string;
}

export function AdminLayout({ title, children }: { title: string; children: ReactNode }) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const pathname = usePathname();

  const platformItems: Item[] = useMemo(() => [
    { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, href: '/admin' },
    { key: 'users', label: 'Users & Orgs', icon: Users, href: '/admin/users' },
    { key: 'content', label: 'Content Management', icon: Library, href: '/admin/content' },
    { key: 'moderation', label: 'Content Moderation', icon: Gavel, href: '/admin/moderation' },
    { key: 'analytics', label: 'Analytics & Insights', icon: BarChart3, href: '/admin/analytics' },
    { key: 'mixmind', label: 'MixMind AI DJ', icon: Radio, href: '/admin/mixmind' },
    { key: 'ingest', label: 'Content Ingestion', icon: Upload, href: '/admin/ingest' },
    { key: 'revenue', label: 'Revenue & Payouts', icon: DollarSign, href: '/admin/revenue' },
    { key: 'live', label: 'Live Streaming', icon: Video, href: '/admin/live' },
    { key: 'genres', label: 'Genres & Categories', icon: Music, href: '/admin/genres' },
    { key: 'video-api-keys', label: 'Video API Keys', icon: Key, href: '/admin/video-api-keys' },
    { key: 'secrets', label: 'Platform Secrets', icon: Lock, href: '/admin/secrets' },
    { key: 'support', label: 'Support Center', icon: LifeBuoy, href: '/admin/support' },
  ], []);

  const trustOpsItems: Item[] = useMemo(() => [
    { key: 'controls', label: 'Security Controls', icon: ShieldCheck, href: '/admin/controls' },
    { key: 'frameworks', label: 'Compliance Frameworks', icon: FileText, href: '/admin/frameworks' },
    { key: 'evidence', label: 'Evidence Library', icon: Database, href: '/admin/evidence' },
    { key: 'vendors', label: 'Vendor Risk', icon: Globe, href: '/admin/vendors' },
    { key: 'questionnaires', label: 'Questionnaires', icon: MessageSquare, href: '/admin/questionnaires' },
    { key: 'trust-center', label: 'Trust Center', icon: Shield, href: '/admin/trust-center' },
    { key: 'policies', label: 'Policies & Training', icon: BookOpen, href: '/admin/policies' },
    { key: 'training', label: 'Security Training', icon: BookOpen, href: '/admin/training' },
    { key: 'integrations', label: 'Security Integrations', icon: Zap, href: '/admin/integrations' },
    { key: 'audits', label: 'Audits & Reports', icon: BarChart3, href: '/admin/audits' },
    { key: 'audit-log', label: 'Audit Log', icon: Activity, href: '/admin/audit-log' },
  ], []);

  const systemItems: Item[] = useMemo(() => [
    { key: 'settings', label: 'System Settings', icon: Settings, href: '/admin/settings' },
  ], []);

  return (
    <View style={[styles.root, { backgroundColor: colors.background, paddingTop: insets.top, paddingBottom: insets.bottom }]} testID="admin-layout">
      <View style={[styles.sidebar, { backgroundColor: '#111315', paddingTop: 8 + insets.top }]} testID="admin-sidebar">
        {/* Platform Operations */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Platform Operations</Text>
        </View>
        {platformItems.map((it) => {
          const active = pathname === it.href || (it.href === '/admin' && (pathname === '/admin/index' || pathname === '/admin'));
          const Icon = it.icon;
          return (
            <Pressable
              key={it.key}
              onPress={() => router.replace(it.href as any)}
              style={({ pressed }) => [
                styles.navItem,
                active ? styles.navActive : null,
                pressed ? { opacity: 0.7 } : null,
              ]}
              testID={`admin-nav-${it.key}`}
            >
              <Icon color={active ? '#22c55e' : '#cbd5e1'} size={16} />
              <Text style={[styles.navText, { color: active ? '#fff' : '#cbd5e1' }]}>{it.label}</Text>
              {active ? <View style={styles.activeBar} /> : null}
            </Pressable>
          );
        })}

        {/* Security & Compliance */}
        <View style={[styles.sectionHeader, { marginTop: 20 }]}>
          <Text style={styles.sectionTitle}>Security & Compliance</Text>
        </View>
        {trustOpsItems.map((it) => {
          const active = pathname === it.href;
          const Icon = it.icon;
          return (
            <Pressable
              key={it.key}
              onPress={() => router.replace(it.href as any)}
              style={({ pressed }) => [
                styles.navItem,
                active ? styles.navActive : null,
                pressed ? { opacity: 0.7 } : null,
              ]}
              testID={`admin-nav-${it.key}`}
            >
              <Icon color={active ? '#22c55e' : '#cbd5e1'} size={16} />
              <Text style={[styles.navText, { color: active ? '#fff' : '#cbd5e1' }]}>{it.label}</Text>
              {active ? <View style={styles.activeBar} /> : null}
            </Pressable>
          );
        })}

        {/* System */}
        <View style={[styles.sectionHeader, { marginTop: 20 }]}>
          <Text style={styles.sectionTitle}>System</Text>
        </View>
        {systemItems.map((it) => {
          const active = pathname === it.href;
          const Icon = it.icon;
          return (
            <Pressable
              key={it.key}
              onPress={() => router.replace(it.href as any)}
              style={({ pressed }) => [
                styles.navItem,
                active ? styles.navActive : null,
                pressed ? { opacity: 0.7 } : null,
              ]}
              testID={`admin-nav-${it.key}`}
            >
              <Icon color={active ? '#22c55e' : '#cbd5e1'} size={16} />
              <Text style={[styles.navText, { color: active ? '#fff' : '#cbd5e1' }]}>{it.label}</Text>
              {active ? <View style={styles.activeBar} /> : null}
            </Pressable>
          );
        })}
      </View>
      <View style={[styles.content, { paddingBottom: 16 + insets.bottom }]} testID="admin-content">
        <View style={styles.topBar} testID="admin-topbar">
          <Text style={styles.title}>{title}</Text>
          <View style={styles.topRight}>
            <Bell color="#cbd5e1" size={18} />
            <User2 color="#cbd5e1" size={18} />
          </View>
        </View>
        <View style={styles.children}>{children}</View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, flexDirection: 'row' as const },
  sidebar: { width: 240, paddingVertical: 12, borderRightWidth: Platform.OS === 'web' ? 1 : 0, borderRightColor: '#1f2937' },
  sectionHeader: { paddingHorizontal: 14, paddingVertical: 8 },
  sectionTitle: { color: '#6b7280', fontSize: 11, fontWeight: '600' as const, textTransform: 'uppercase' as const, letterSpacing: 0.5 },
  navItem: { flexDirection: 'row' as const, alignItems: 'center', gap: 10, paddingVertical: 10, paddingHorizontal: 14, position: 'relative' as const },
  navActive: { backgroundColor: '#0f172a' },
  navText: { fontSize: 12, fontWeight: '500' as const },
  activeBar: { position: 'absolute' as const, left: 0, top: 6, bottom: 6, width: 3, backgroundColor: '#22c55e', borderRadius: 2 },
  content: { flex: 1, padding: 16 },
  topBar: { flexDirection: 'row' as const, justifyContent: 'space-between', alignItems: 'center' },
  title: { color: '#fff', fontSize: 18, fontWeight: '600' as const },
  topRight: { flexDirection: 'row' as const, alignItems: 'center', gap: 12 },
  children: { flex: 1, marginTop: 16 },
});
