import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, Pressable, LayoutAnimation, Platform } from 'react-native';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { HelpCircle, ChevronDown, ChevronUp, MessageSquare } from 'lucide-react-native';

interface FaqItem { id: string; q: string; a: string }

export default function AdminSupport() {
  const faqs: FaqItem[] = useMemo(() => [
    { id: '1', q: 'What color should you choose as a primary?', a: 'Choose a primary that offers sufficient contrast with the background. For Didit360 we recommend #22c55e for calls-to-action and #0b0f12 backgrounds.' },
    { id: '2', q: 'How do I invite a new admin?', a: 'Navigate to User Management → Add and set role to admin. An email invitation is sent with time-limited token.' },
    { id: '3', q: 'How do I price an album?', a: 'Open Revenue & Finance, tap Add Pricing, select the album and artist, then set the regional price ladders.' },
  ], []);

  const [openId, setOpenId] = useState<string | null>(faqs[0]?.id ?? null);

  const toggle = (id: string) => {
    if (Platform.OS !== 'web') LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <AdminLayout title="Support & Communication">
      <View style={styles.card} testID="faq-card">
        <View style={styles.headerRow}>
          <HelpCircle color="#22c55e" size={18} />
          <Text style={styles.header}>Frequently Asked Questions</Text>
        </View>
        {faqs.map((f) => {
          const open = f.id === openId;
          return (
            <View key={f.id} style={[styles.faqRow, open ? styles.faqOpen : null]} testID={`faq-${f.id}`}>
              <Pressable style={styles.faqHeader} onPress={() => toggle(f.id)}>
                <Text style={styles.faqQ}>{f.q}</Text>
                {open ? <ChevronUp color="#22c55e" size={16} /> : <ChevronDown color="#cbd5e1" size={16} />}
              </Pressable>
              {open ? <Text style={styles.faqA}>{f.a}</Text> : null}
            </View>
          );
        })}
      </View>

      <View style={styles.card} testID="assist-card">
        <Text style={styles.header}>Technical Assistance</Text>
        <Text style={styles.copy}>Contact our support engineers for ingestion errors, catalog mismatches, rights gating, or billing issues. We reply within 24 hours on weekdays.</Text>
        <Pressable
          onPress={() => console.log('[Support] Contact pressed')}
          testID="contact-support"
          style={styles.cta}
        >
          <MessageSquare color="#fff" size={16} />
          <Text style={styles.ctaText}>Contact Now</Text>
        </Pressable>
      </View>
    </AdminLayout>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#0b0f12', borderColor: '#1f2937', borderWidth: 1, borderRadius: 12, padding: 16, marginBottom: 12 },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  header: { color: '#fff', fontWeight: '600' as const },
  copy: { color: '#cbd5e1', marginTop: 6 },
  faqRow: { borderColor: '#1f2937', borderWidth: 1, borderRadius: 10, marginBottom: 8, overflow: 'hidden' as const },
  faqOpen: { borderColor: '#22c55e' },
  faqHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12, paddingVertical: 10, backgroundColor: '#111315' },
  faqQ: { color: '#e5e7eb' },
  faqA: { color: '#94a3b8', paddingHorizontal: 12, paddingVertical: 10, backgroundColor: '#0b0f12' },
  cta: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#22c55e', paddingVertical: 10, paddingHorizontal: 14, borderRadius: 10, marginTop: 12, alignSelf: 'flex-start' as const },
  ctaText: { color: '#fff', fontWeight: '600' as const },
});