import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Image, Pressable } from 'react-native';
import { AdminLayout } from '@/components/admin/AdminLayout';

export default function AdminSettings() {
  const [fullName, setFullName] = useState<string>('Alexa Rowles');
  const [nick, setNick] = useState<string>('alexa');
  const [country, setCountry] = useState<string>('USA');
  const [language, setLanguage] = useState<string>('English');

  return (
    <AdminLayout title="Settings">
      <View style={styles.profile}>
        <Image source={{ uri: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&h=80&fit=crop' }} style={styles.avatar} />
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{fullName}</Text>
          <Text style={styles.email}>alexarowles@gmail.com</Text>
        </View>
        <Pressable style={styles.editBtn} onPress={() => console.log('[Settings] Edit pressed')} testID="edit-profile">
          <Text style={styles.editText}>Edit</Text>
        </Pressable>
      </View>

      <View style={styles.grid}>
        <TextInput value={fullName} onChangeText={setFullName} placeholder="Full Name" placeholderTextColor="#94a3b8" style={styles.input} />
        <TextInput value={nick} onChangeText={setNick} placeholder="Nick Name" placeholderTextColor="#94a3b8" style={styles.input} />
        <TextInput value={country} onChangeText={setCountry} placeholder="Country" placeholderTextColor="#94a3b8" style={styles.input} />
        <TextInput value={language} onChangeText={setLanguage} placeholder="Language" placeholderTextColor="#94a3b8" style={styles.input} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>My email address</Text>
        <View style={styles.emailRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.email}>alexarowles@gmail.com</Text>
            <Text style={styles.meta}>1 month ago</Text>
          </View>
          <Pressable style={styles.addEmail} onPress={() => console.log('[Settings] Add email pressed')} testID="add-email">
            <Text style={styles.addEmailText}>+ Add Email Address</Text>
          </Pressable>
        </View>
      </View>
    </AdminLayout>
  );
}

const styles = StyleSheet.create({
  profile: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#0b0f12', borderColor: '#1f2937', borderWidth: 1, borderRadius: 12, padding: 12, marginBottom: 12 },
  avatar: { width: 56, height: 56, borderRadius: 28 },
  name: { color: '#fff', fontWeight: '600' as const },
  email: { color: '#94a3b8' },
  editBtn: { backgroundColor: '#22c55e', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10 },
  editText: { color: '#fff', fontWeight: '600' as const },
  grid: { flexDirection: 'row', flexWrap: 'wrap' as const, gap: 8, marginBottom: 12 },
  input: { flexGrow: 1, flexBasis: '48%', backgroundColor: '#0b0f12', color: '#e5e7eb', borderColor: '#1f2937', borderWidth: 1, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10 },
  section: { backgroundColor: '#0b0f12', borderColor: '#1f2937', borderWidth: 1, borderRadius: 12, padding: 12 },
  sectionTitle: { color: '#fff', marginBottom: 8, fontWeight: '600' as const },
  emailRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  meta: { color: '#cbd5e1' },
  addEmail: { backgroundColor: '#0f172a', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10 },
  addEmailText: { color: '#22c55e', fontWeight: '600' as const },
});