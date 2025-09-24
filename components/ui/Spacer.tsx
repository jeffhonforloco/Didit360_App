import React, { memo } from 'react';
import { View } from 'react-native';

interface Props { size?: number; horizontal?: boolean }

const SpacerComponent: React.FC<Props> = ({ size = 8, horizontal = false }) => (
  <View testID="spacer" style={horizontal ? { width: size } : { height: size }} />
);

export const Spacer = memo(SpacerComponent);
export default Spacer;
