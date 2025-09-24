import React, { memo, ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { palette, spacing, typography } from '@/constants/tokens';

interface Props {
  title: string;
  right?: ReactNode;
  children?: ReactNode;
}

const SectionComponent: React.FC<Props> = ({ title, right, children }) => {
  return (
    <View testID="section" style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <View>{right}</View>
      </View>
      <View style={styles.content}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { gap: spacing.md },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  title: { color: palette.dark.text, fontSize: typography.sizes.lg, fontWeight: '700', fontFamily: typography.fontFamily },
  content: { gap: spacing.md }
});

export const Section = memo(SectionComponent);
export default Section;
