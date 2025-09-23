import React, { memo } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import SliderNative from '@react-native-community/slider';

export interface SliderCompatProps {
  minimumValue: number;
  maximumValue: number;
  step?: number;
  value: number;
  onValueChange?: (v: number) => void;
  minimumTrackTintColor?: string;
  maximumTrackTintColor?: string;
  thumbTintColor?: string;
  style?: object;
  testID?: string;
}

function SliderWeb({ minimumValue, maximumValue, step = 1, value, onValueChange, style, testID, minimumTrackTintColor, maximumTrackTintColor, thumbTintColor }: SliderCompatProps) {
  return (
    <View style={[styles.webContainer, style]} testID={testID}>
      {React.createElement('input', {
        type: 'range',
        min: minimumValue,
        max: maximumValue,
        step,
        value,
        onChange: (e: any) => {
          const v = Number(e?.target?.value ?? value);
          if (typeof onValueChange === 'function') onValueChange(v);
        },
        style: {
          width: '100%',
          WebkitAppearance: 'none',
          background: 'transparent',
          outline: 'none',
        },
      })}
      {/* simple color bar behind is omitted for simplicity */}
    </View>
  );
}

function SliderCompat(props: SliderCompatProps) {
  if (Platform.OS === 'web') return <SliderWeb {...props} />;
  return <SliderNative {...props} />;
}

export default memo(SliderCompat);

const styles = StyleSheet.create({
  webContainer: {
    width: 160,
    height: 30,
    justifyContent: 'center',
  },
});
