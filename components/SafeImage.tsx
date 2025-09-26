import React, { useState } from 'react';
import { Image, ImageProps, View, StyleSheet, Text } from 'react-native';

type SafeImageProps = ImageProps & {
  uri?: string | null;
  fallback?: any;
  showBorder?: boolean;
  size?: number;
  placeholder?: string;
};

const SafeImage: React.FC<SafeImageProps> = ({
  uri,
  fallback,
  showBorder = false,
  size = 50,
  placeholder = '👤',
  style,
  ...props
}) => {
  const [hasError, setHasError] = useState(false);
  const isValid = uri && uri.trim().length > 0 && !hasError;

  const handleError = () => {
    console.log('SafeImage: Failed to load image:', uri);
    setHasError(true);
  };

  // If no valid URI and no fallback, show placeholder
  if (!isValid && !fallback) {
    const dimensions = StyleSheet.flatten(style);
    const width = dimensions?.width || size;
    const height = dimensions?.height || size;
    const borderRadius = dimensions?.borderRadius || 0;
    
    return (
      <View style={[
        styles.placeholder,
        { width, height, borderRadius },
        style,
        showBorder && styles.debug
      ]}>
        <Text style={[styles.placeholderText, { fontSize: Math.min(width as number, height as number) * 0.4 }]}>
          {placeholder}
        </Text>
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