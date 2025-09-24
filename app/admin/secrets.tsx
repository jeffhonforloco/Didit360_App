import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable } from 'react-native';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useSecrets } from '@/contexts/SecretsContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function AdminSecrets() {
  const insets = useSafeAreaInsets();
  const { list, setSecret, deleteSecret, hasSecureStorage } = useSecrets();
  const [k, setK] = useState<string>('');
  const [v, setV] = useState<string>('');

  return (
    <AdminLayout title="Secure Keys">
      <Text style={styles.hint} testID="secure-hint">{hasSecureStorage ? 'SecureStore enabled (iOS/Android)' : 'Web: Stored in AsyncStorage (development only)'}</Text>
      <View style={styles.row}>
        <TextInput placeholder="Key name (ex: NGC_API_KEY)" placeholderTextColor="#94a3b8" value={k} onChangeText={setK} style={styles.input} testID="key-name" />
        <TextInput placeholder="Paste secret value" placeholderTextColor="#94a3b8" value={v} onChangeText={setV} style={styles.input} secureTextEntry testID="key-value" />
        <Pressable
          onPress={async () => {
            const key = (k ?? '').trim();
            const val = (v ?? '').trim();
            if (!key || !val) return;
            console.log('[AdminSecrets] Saving key', key);
            await setSecret(key, val, 'video');
            setK('');
            setV('');
          }}
          style={styles.save}
          testID="save-secret"
        >
          <Text style={styles.saveText}>Save</Text>
        </Pressable>
      </View>
      {list.map((it) => (
        <View key={it.key} style={styles.item} testID={`secret-${it.key}`}>
          <Text style={styles.key}>{it.key}</Text>
          <Text style={styles.scope}>{it.scope}</Text>
          <Pressable onPress={() => deleteSecret(it.key)} style={styles.delete} testID={`delete-${it.key}`}>
            <Text style={styles.deleteText}>Delete</Text>
          </Pressable>
        </View>
      ))}
    </AdminLayout>
  );
}

const styles = StyleSheet.create({
  hint: { color: '#94a3b8', marginBottom: 8 },
  row: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  input: { flex: 1, backgroundColor: '#0b0f12', color: '#e5e7eb', borderColor: '#1f2937', borderWidth: 1, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10 },
  save: { backgroundColor: '#22c55e', paddingHorizontal: 16, justifyContent: 'center', borderRadius: 10 },
  saveText: { color: '#fff', fontWeight: '600' as const },
  item: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#0b0f12', borderColor: '#1f2937', borderWidth: 1, padding: 12, borderRadius: 10, marginBottom: 8 },
  key: { color: '#fff' },
  scope: { color: '#cbd5e1' },
  delete: { padding: 8, backgroundColor: '#111827', borderRadius: 8 },
  deleteText: { color: '#fca5a5' },
});
