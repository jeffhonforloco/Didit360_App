import React, { memo } from 'react';
import { StyleSheet, TextInput, TextInputProps, View } from 'react-native';
import { palette, radii, spacing, typography } from '@/constants/tokens';

interface Props extends TextInputProps {
  label?: string;
  error?: string;
  testID?: string;
}

const TextFieldComponent: React.FC<Props> = ({ label, error, style, testID, ...rest }) => {
  return (
    <View testID={testID ?? 'text-field'} style={styles.container}>
      <TextInput
        placeholderTextColor={palette.dark.textMuted}
        style={[styles.input, style]}
        {...rest}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { width: '100%' },
  input: {
    backgroundColor: palette.dark.surface,
    color: palette.dark.text,
    borderColor: palette.dark.border,
    borderWidth: 1,
    borderRadius: radii.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    fontSize: typography.sizes.md,
    fontFamily: typography.fontFamily,
  }
});

export const TextField = memo(TextFieldComponent);
export default TextField;
