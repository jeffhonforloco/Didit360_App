import React, { memo } from 'react';
import { ActivityIndicator, GestureResponderEvent, Platform, Pressable, StyleSheet, Text, ViewStyle } from 'react-native';
import { palette, radii, spacing, typography, shadows } from '@/constants/tokens';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  title: string;
  onPress?: (event: GestureResponderEvent) => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  style?: ViewStyle;
  testID?: string;
}

const ButtonComponent: React.FC<ButtonProps> = ({
  title,
  onPress,
  disabled = false,
  loading = false,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  style,
  testID
}) => {
  const theme = palette.dark;

  const sizeStyles = sizes[size];
  const variantStyles = variants(theme)[variant];

  const containerStyles: ViewStyle = {
    ...styles.base,
    ...sizeStyles.container,
    ...variantStyles.container,
    ...(fullWidth ? { alignSelf: 'stretch' } : {}),
    ...(style ?? {})
  };

  const textStyles = [
    styles.text,
    sizeStyles.text,
    variantStyles.text
  ];

  return (
    <Pressable
      testID={testID ?? 'button'}
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || loading }}
      disabled={disabled || loading}
      onPress={onPress}
      style={({ pressed }) => [
        containerStyles,
        pressed && !disabled && !loading ? { opacity: 0.9 } : null
      ]}
    >
      {loading ? (
        <ActivityIndicator testID="button-loading" color={variantStyles.text.color as string} />
      ) : (
        <Text style={textStyles}>{title}</Text>
      )}
    </Pressable>
  );
};

const sizes: Record<ButtonSize, { container: ViewStyle; text: any }> = {
  sm: {
    container: { paddingVertical: spacing.xs, paddingHorizontal: spacing.md, borderRadius: radii.sm },
    text: { fontSize: typography.sizes.sm }
  },
  md: {
    container: { paddingVertical: spacing.sm, paddingHorizontal: spacing.lg, borderRadius: radii.md },
    text: { fontSize: typography.sizes.md }
  },
  lg: {
    container: { paddingVertical: spacing.md, paddingHorizontal: spacing.xxl, borderRadius: radii.lg },
    text: { fontSize: typography.sizes.lg }
  }
};

const variants = (theme: typeof palette.dark): Record<ButtonVariant, { container: ViewStyle; text: any }> => ({
  primary: {
    container: { backgroundColor: theme.primary, ...shadows.md },
    text: { color: theme.text, fontWeight: typography.weights.bold }
  },
  secondary: {
    container: { backgroundColor: theme.secondary, ...shadows.md },
    text: { color: '#0B0B10', fontWeight: typography.weights.bold }
  },
  outline: {
    container: { backgroundColor: 'transparent', borderWidth: 1, borderColor: theme.border },
    text: { color: theme.text }
  },
  ghost: {
    container: { backgroundColor: 'transparent' },
    text: { color: theme.textMuted }
  },
  danger: {
    container: { backgroundColor: theme.danger, ...shadows.md },
    text: { color: theme.text, fontWeight: typography.weights.bold }
  }
});

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm as number,
    ...(Platform.OS !== 'web' ? { } : {})
  },
  text: {
    fontFamily: typography.fontFamily,
  }
});

export const Button = memo(ButtonComponent);
export default Button;
