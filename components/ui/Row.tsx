import React, { memo, ReactNode } from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';

interface Props extends ViewProps {
  children?: ReactNode;
  gap?: number;
}

const RowComponent: React.FC<Props> = ({ children, gap = 8, style, ...rest }) => {
  return (
    <View testID="row" style={[styles.row, { gap }, style]} {...rest}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' }
});

export const Row = memo(RowComponent);
export default Row;
