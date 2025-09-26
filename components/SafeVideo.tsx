import React from "react";
import { Video, VideoProps } from "expo-av";
import { View, Text, StyleSheet } from "react-native";

type Props = Omit<VideoProps, "source"> & {
  uri?: string | null;
  placeholder?: string;
};

export default function SafeVideo({ uri, placeholder = "📹", style, ...rest }: Props) {
  const isValid = typeof uri === "string" && uri.trim().length > 0;
  
  if (!isValid) {
    return (
      <View style={[styles.placeholder, style]}>
        <Text style={styles.placeholderText}>{placeholder}</Text>
        <Text style={styles.placeholderSubtext}>No video available</Text>
      </View>
    );
  }
  
  return <Video source={{ uri }} style={style} {...rest} />;
}

const styles = StyleSheet.create({
  placeholder: {
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 200,
    borderRadius: 8,
  },
  placeholderText: {
    fontSize: 32,
    marginBottom: 8,
  },
  placeholderSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});