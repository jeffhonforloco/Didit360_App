import React, { memo, ReactNode } from 'react';
import { Pressable, StyleSheet, View, ViewStyle } from 'react-native';
import { palette, radii, shadows, spacing } from '@/constants/tokens';

interface CardProps {
  children?: ReactNode;
  onPress?: () => void;
  elevated?: boolean;
  style?: ViewStyle;
  testID?: string;
}

const CardComponent: React.FC<CardProps> = ({ children, onPress, elevated = true, style, testID }) => {
  if (onPress) {
    return (
      <Pressable onPress={onPress} style={({ pressed }) => [styles.wrapper, pressed ? { opacity: 0.96 } : null]}>
        <View testID={testID ?? 'card'} style={[styles.card, elevated ? styles.elevated : null, style]}>
          {children}
        </View>
      </Pressable>
    );
  }

  return (
    <View testID={testID ?? 'card'} style={[styles.card, elevated ? styles.elevated : null, style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: { borderRadius: radii.lg },
  card: {
    backgroundColor: palette.dark.card,
    borderRadius: radii.lg,
    borderColor: palette.dark.border,
    borderWidth: 1,
    padding: spacing.lg,
  },
  elevated: {
    ...shadows.md,
  }
});

export const Card = memo(CardComponent);
export default Card;
