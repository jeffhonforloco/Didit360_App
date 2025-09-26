import React, { useState } from 'react';
import { Image, ImageProps, View, StyleSheet, Text } from 'react-native';

type SafeImageProps = ImageProps & {
  uri?: string | null;
  fallback?: any;
  showBorder?: boolean;
  size?: number;
};

const SafeImage: React.FC<SafeImageProps> = ({
  uri,
  fallback,
  showBorder = false,
  size = 50,
  style,
  ...props
}) => {
  const [hasError, setHasError] = useState(false);
  const isValid = uri && uri.trim().length > 0 && !hasError;

  const handleError = () => {
    setHasError(true);
  };

  if (!isValid && !fallback) {
    return (
      <View style={[
        styles.placeholder,
        { width: size, height: size },
        style,
        showBorder && styles.debug
      ]}>
        <Text style={styles.placeholderText}>♪</Text>
      </View>
    );
  }

  return (
    <View style={[showBorder && styles.debug]}>
      <Image
        source={isValid ? { uri } : fallback}
        style={style}
        onError={handleError}
        {...props}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  debug: {
    borderWidth: 1,
    borderColor: 'red'
  },
  placeholder: {
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4
  },
  placeholderText: {
    fontSize: 20,
    color: '#999',
    fontWeight: 'bold'
  }
});

export default SafeImage;