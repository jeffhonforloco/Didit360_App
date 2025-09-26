import React, { useState } from 'react';
import { Image, ImageProps, View, StyleSheet, Text } from 'react-native';

type SafeImageProps = ImageProps & {
  uri?: string | null;
  fallback?: string;
  showBorder?: boolean;
  size?: number;
  placeholder?: string;
};

// Default fallback image URL - using a more reliable source
const DEFAULT_FALLBACK = 'https://via.placeholder.com/400x400/2a2a2a/ffffff?text=🎵';

const SafeImage: React.FC<SafeImageProps> = ({
  uri,
  fallback = DEFAULT_FALLBACK,
  showBorder = false,
  size = 50,
  placeholder = '🎵',
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

  const handleError = (error: any) => {
    console.log('SafeImage: Failed to load image:', uri, 'Error:', error?.nativeEvent?.error || 'Unknown error');
    setHasError(true);
  };

  const handleLoad = () => {
    console.log('SafeImage: Successfully loaded image:', uri);
    setHasError(false);
  };

  const handleLoadStart = () => {
    console.log('SafeImage: Started loading image:', uri);
  };

  const handleFallbackError = (error: any) => {
    console.log('SafeImage: Failed to load fallback image:', fallback, 'Error:', error?.nativeEvent?.error || 'Unknown error');
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
          onLoad={() => console.log('SafeImage: Fallback loaded successfully')}
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
        onLoad={handleLoad}
        onLoadStart={handleLoadStart}
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
    backgroundColor: '#2a2a2a',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12
  },
  placeholderText: {
    fontSize: 20,
    color: '#666',
    fontWeight: 'bold'
  }
});

export default SafeImage;