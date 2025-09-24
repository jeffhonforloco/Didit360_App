import React, { ReactNode, useMemo } from 'react';
import { View, StyleSheet, Platform, Pressable, Text } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { 
  Bell, User2, LayoutDashboard, Users, Library, Radio, Palette, DollarSign, 
  ShieldCheck, HelpCircle, Settings, BarChart3, Zap, Database, 
  MessageSquare, FileText, Shield, Activity, Globe, Headphones,
  Video, BookOpen, Music, AlertTriangle, Key
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

  const items: Item[] = useMemo(() => [
    { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, href: '/admin' },
    { key: 'users', label: 'User Management', icon: Users, href: '/admin/users' },
    { key: 'content', label: 'Content Management', icon: Library, href: '/admin/content' },
    { key: 'moderation', label: 'Content Moderation', icon: Shield, href: '/admin/moderation' },
    { key: 'analytics', label: 'Analytics & Reports', icon: BarChart3, href: '/admin/analytics' },
    { key: 'mixmind', label: 'MixMind AI DJ', icon: Zap, href: '/admin/mixmind' },
    { key: 'ingest', label: 'Content Ingestion', icon: Database, href: '/admin/ingest' },
    { key: 'partners', label: 'Partner Management', icon: Globe, href: '/admin/partners' },
    { key: 'revenue', label: 'Revenue & Finance', icon: DollarSign, href: '/admin/revenue' },
    { key: 'system', label: 'System Health', icon: Activity, href: '/admin/system' },
    { key: 'audit', label: 'Audit & Logs', icon: FileText, href: '/admin/audit' },
    { key: 'secrets', label: 'API Keys & Secrets', icon: Key, href: '/admin/secrets' },
    { key: 'support', label: 'Support & Tickets', icon: HelpCircle, href: '/admin/support' },
    { key: 'settings', label: 'Platform Settings', icon: Settings, href: '/admin/settings' },
  ], []);

  return (
    <View style={[styles.root, { backgroundColor: colors.background, paddingTop: insets.top, paddingBottom: insets.bottom }]} testID="admin-layout">
      <View style={[styles.sidebar, { backgroundColor: '#111315', paddingTop: 8 + insets.top }]} testID="admin-sidebar">
        {items.map((it) => {
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
              <Icon color={active ? '#22c55e' : '#cbd5e1'} size={18} />
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
  sidebar: { width: 220, paddingVertical: 12, borderRightWidth: Platform.OS === 'web' ? 1 : 0, borderRightColor: '#1f2937' },
  navItem: { flexDirection: 'row' as const, alignItems: 'center', gap: 10, paddingVertical: 12, paddingHorizontal: 14, position: 'relative' as const },
  navActive: { backgroundColor: '#0f172a' },
  navText: { fontSize: 13, fontWeight: '500' as const },
  activeBar: { position: 'absolute' as const, left: 0, top: 8, bottom: 8, width: 3, backgroundColor: '#22c55e', borderRadius: 2 },
  content: { flex: 1, padding: 16 },
  topBar: { flexDirection: 'row' as const, justifyContent: 'space-between', alignItems: 'center' },
  title: { color: '#fff', fontSize: 18, fontWeight: '600' as const },
  topRight: { flexDirection: 'row' as const, alignItems: 'center', gap: 12 },
  children: { flex: 1, marginTop: 16 },
});
