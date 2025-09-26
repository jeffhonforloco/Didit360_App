import React, { useState } from 'react';
import { Image, ImageProps, View, StyleSheet, Text } from 'react-native';

type SafeImageProps = ImageProps & {
  uri?: string | null;
  fallback?: string;
  showBorder?: boolean;
  size?: number;
  placeholder?: string;
};

// Default fallback image URL
const DEFAULT_FALLBACK = 'https://r2-pub.rork.com/generated-images/738567b8-2390-49c1-97c2-36cd3a3b7f18.png';

const SafeImage: React.FC<SafeImageProps> = ({
  uri,
  fallback = DEFAULT_FALLBACK,
  showBorder = false,
  size = 50,
  placeholder = '👤',
  style,
  ...props
}) => {
  const [hasError, setHasError] = useState(false);
  const [fallbackError, setFallbackError] = useState(false);
  const isValidUri = (url: string | null | undefined): url is string => {
    return url != null && typeof url === 'string' && url.trim().length > 0;
  };
  
  const isValid = isValidUri(uri) && !hasError;
  const canUseFallback = isValidUri(fallback) && !fallbackError;

  const handleError = () => {
    console.log('SafeImage: Failed to load image:', uri);
    setHasError(true);
  };

  const handleFallbackError = () => {
    console.log('SafeImage: Failed to load fallback image:', fallback);
    setFallbackError(true);
  };

  // Show placeholder if no valid URI and no fallback available
  if (!isValid && !canUseFallback) {
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

  // Use fallback if main image failed but fallback is available
  if (!isValid && canUseFallback) {
    return (
      <View style={[showBorder && styles.debug]}>
        <Image
          source={{ uri: fallback! }}
          style={style}
          onError={handleFallbackError}
          {...props}
        />
      </View>
    );
  }

  // Use main image
  return (
    <View style={[showBorder && styles.debug]}>
      <Image
        source={{ uri: uri! }}
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