import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TextInput } from 'react-native';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Search as SearchIcon, MoreVertical } from 'lucide-react-native';
import { recentlyAddedContent } from '@/data/mockData';

interface Item { id: string; title: string; artist?: string; type: string; duration?: number; artwork?: string }

export default function AdminContent() {
  const [search, setSearch] = useState<string>('');
  const items: Item[] = useMemo(() => recentlyAddedContent.map(i => ({ id: i.id, title: i.title, artist: i.artist, type: i.type, duration: i.duration, artwork: i.artwork })), []);
  const filtered = useMemo(() => items.filter(i => i.title.toLowerCase().includes(search.toLowerCase())), [items, search]);

  return (
    <AdminLayout title="Content Management">
      <View style={styles.searchBar} testID="content-search">
        <SearchIcon color="#cbd5e1" size={16} />
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search"
          placeholderTextColor="#94a3b8"
          style={styles.input}
          testID="content-search-input"
        />
      </View>
      <FlatList
        data={filtered}
        keyExtractor={(i) => i.id}
        contentContainerStyle={{ paddingBottom: 40 }}
        renderItem={({ item }) => (
          <View style={styles.row} testID={`content-${item.id}`}>
            <Image source={{ uri: item.artwork ?? 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=60&h=60&fit=crop' }} style={styles.art} />
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.sub} numberOfLines={1}>{item.artist ?? 'Unknown'}</Text>
            </View>
            <Text style={styles.meta}>{item.type}</Text>
            <Text style={styles.meta}>{item.duration ? Math.round(item.duration / 60) + 'm' : '-'}</Text>
            <MoreVertical color="#cbd5e1" size={16} />
          </View>
        )}
      />
    </AdminLayout>
  );
}

const styles = StyleSheet.create({
  searchBar: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#0b0f12', borderColor: '#1f2937', borderWidth: 1, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, marginBottom: 12 },
  input: { flex: 1, color: '#e5e7eb' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, borderRadius: 12, borderWidth: 1, borderColor: '#1f2937', backgroundColor: '#0b0f12', marginBottom: 8 },
  art: { width: 44, height: 44, borderRadius: 8 },
  title: { color: '#fff', fontWeight: '600' as const },
  sub: { color: '#94a3b8', marginTop: 2 },
  meta: { color: '#cbd5e1', width: 60, textTransform: 'capitalize' as const },
});
