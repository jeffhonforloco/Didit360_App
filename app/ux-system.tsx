import React, { useState } from 'react';
import { Stack } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Section } from '@/components/ui/Section';
import { Row } from '@/components/ui/Row';
import { Spacer } from '@/components/ui/Spacer';
import { TextField } from '@/components/ui/TextField';
import { palette, spacing, typography } from '@/constants/tokens';

export default function UXSystemScreen() {
  const [value, setValue] = useState<string>('');
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }] }>
      <Stack.Screen options={{ title: 'UX System' }} />
      <ScrollView contentContainerStyle={styles.content} testID="ux-system-scroll">
        <Text style={styles.headline}>Components</Text>

        <Section title="Buttons" right={null}>
          <Row style={styles.btnRow}>
            <Button title="Primary" testID="btn-primary" />
            <Spacer horizontal size={12} />
            <Button title="Secondary" variant="secondary" testID="btn-secondary" />
            <Spacer horizontal size={12} />
            <Button title="Outline" variant="outline" testID="btn-outline" />
            <Spacer horizontal size={12} />
            <Button title="Ghost" variant="ghost" testID="btn-ghost" />
            <Spacer horizontal size={12} />
            <Button title="Danger" variant="danger" testID="btn-danger" />
          </Row>
        </Section>

        <Section title="Text Fields" right={null}>
          <Card>
            <TextField
              placeholder="Type something..."
              value={value}
              onChangeText={setValue}
              autoCapitalize="none"
              testID="tf-1"
            />
          </Card>
        </Section>

        <Section title="Cards" right={null}>
          <Row gap={16}>
            <Card style={styles.fullWidthCard}>
              <Text style={styles.paragraph}>This is a card. Use it to group related content with a subtle elevation.</Text>
            </Card>
          </Row>
        </Section>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: palette.dark.background },
  content: { padding: spacing.lg, gap: spacing.xxl },
  headline: { color: palette.dark.text, fontSize: typography.sizes.xl, fontWeight: '700', fontFamily: typography.fontFamily },
  paragraph: { color: palette.dark.text, fontSize: typography.sizes.md, fontFamily: typography.fontFamily },
  btnRow: { flexWrap: 'wrap' as const },
  fullWidthCard: { width: '100%' as const }
});
