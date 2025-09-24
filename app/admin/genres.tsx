import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, TextInput } from 'react-native';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { genres as genreList } from '@/data/mockData';
import { PencilLine, Plus } from 'lucide-react-native';

export default function AdminGenres() {
  const [genres, setGenres] = useState<string[]>(genreList);
  const [newGenre, setNewGenre] = useState<string>('');

  const add = () => {
    const g = newGenre.trim();
    if (!g) return;
    if (g.length > 40) return;
    setGenres((prev) => [...prev, g]);
    setNewGenre('');
  };

  return (
    <AdminLayout title="Genre Customization">
      <View style={styles.addRow}>
        <TextInput
          placeholder="Add Genre"
          placeholderTextColor="#94a3b8"
          value={newGenre}
          onChangeText={setNewGenre}
          style={styles.input}
        />
        <Pressable onPress={add} style={styles.addBtn} testID="add-genre">
          <Plus color="#fff" size={16} />
        </Pressable>
      </View>
      <FlatList
        data={genres}
        keyExtractor={(i, idx) => `${i}-${idx}`}
        contentContainerStyle={{ paddingBottom: 40 }}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.genre}>{item}</Text>
            <Pressable style={styles.edit}><PencilLine color="#cbd5e1" size={16} /></Pressable>
          </View>
        )}
      />
    </AdminLayout>
  );
}

const styles = StyleSheet.create({
  addRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  input: { flex: 1, backgroundColor: '#0b0f12', color: '#e5e7eb', borderColor: '#1f2937', borderWidth: 1, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10 },
  addBtn: { backgroundColor: '#22c55e', padding: 10, borderRadius: 10 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#0b0f12', borderColor: '#1f2937', borderWidth: 1, padding: 12, borderRadius: 10, marginBottom: 8 },
  genre: { color: '#fff' },
  edit: { padding: 8, backgroundColor: '#111827', borderRadius: 8 },
});
