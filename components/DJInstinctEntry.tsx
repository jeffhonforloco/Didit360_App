import React from "react";
import { TouchableOpacity, Text, View, StyleSheet } from "react-native";
import { Headphones } from "lucide-react-native";
import { router } from "expo-router";
import { useDJInstinct } from "@/contexts/DJInstinctContext";

interface DJInstinctEntryProps {
  style?: any;
}

export function DJInstinctEntry({ style }: DJInstinctEntryProps) {
  const { setActive } = useDJInstinct();

  const handlePress = () => {
    console.log('[DJInstinct] Entry button pressed');
    setActive(true);
    router.push('/dj-instinct');
  };

  return (
    <TouchableOpacity 
      style={[styles.container, style]} 
      onPress={handlePress}
      activeOpacity={0.7}
      testID="dj-instinct-entry"
    >
      <View style={styles.iconContainer}>
        <Headphones size={20} color="#FF0080" />
      </View>
      <Text style={styles.label}>DJ Instinct</Text>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>NEW</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: 'rgba(255, 0, 128, 0.1)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 0, 128, 0.3)',
  },
  iconContainer: {
    marginRight: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF0080',
    marginRight: 6,
  },
  badge: {
    backgroundColor: '#FF0080',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFF',
  },
});