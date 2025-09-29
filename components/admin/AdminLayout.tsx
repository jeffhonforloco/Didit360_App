import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Settings } from 'lucide-react-native';

interface AdminLayoutProps {
  title: string;
  children: React.ReactNode;
}

export function AdminLayout({ title, children }: AdminLayoutProps) {
  const insets = useSafeAreaInsets();
  
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Settings color="#fff" size={24} />
          <Text style={styles.headerTitle}>{title}</Text>
        </View>
      </View>
      <View style={styles.content}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0A14',
  },
  header: {
    backgroundColor: '#111315',
    borderBottomWidth: 1,
    borderBottomColor: '#1f2937',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600' as const,
  },
  content: {
    flex: 1,
    padding: 16,
  },
});
