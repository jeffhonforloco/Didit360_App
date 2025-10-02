import React from "react";
import { TouchableOpacity, Text, View, StyleSheet, Alert } from "react-native";
import { Headphones, Lock } from "lucide-react-native";
import { router } from "expo-router";
import { useDJInstinct } from "@/contexts/DJInstinctContext";
import { useSubscription } from "@/contexts/SubscriptionContext";

interface DJInstinctEntryProps {
  style?: any;
}

export function DJInstinctEntry({ style }: DJInstinctEntryProps) {
  const { setActive } = useDJInstinct();
  const { tier, canAccessFeature } = useSubscription();
  const isLocked = !canAccessFeature('djInstinct');

  const handlePress = () => {
    console.log('[DJInstinct] Entry button pressed');
    
    if (isLocked) {
      Alert.alert(
        "Premium Feature",
        "DJ Instinct is available for Premium and Pro subscribers. Upgrade now to unlock AI-powered DJ features!",
        [
          { text: "Cancel", style: "cancel" },
          { 
            text: "Upgrade", 
            onPress: () => router.push('/subscription' as any)
          }
        ]
      );
      return;
    }
    
    setActive(true);
    router.push('/dj-instinct');
  };

  return (
    <TouchableOpacity 
      style={[styles.container, isLocked && styles.containerLocked, style]} 
      onPress={handlePress}
      activeOpacity={0.7}
      testID="dj-instinct-entry"
    >
      <View style={styles.iconContainer}>
        {isLocked ? (
          <Lock size={20} color="#999" />
        ) : (
          <Headphones size={20} color="#FF0080" />
        )}
      </View>
      <Text style={[styles.label, isLocked && styles.labelLocked]}>DJ Instinct</Text>
      {isLocked ? (
        <View style={styles.lockBadge}>
          <Text style={styles.lockBadgeText}>PREMIUM</Text>
        </View>
      ) : (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>NEW</Text>
        </View>
      )}
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
  containerLocked: {
    backgroundColor: 'rgba(153, 153, 153, 0.1)',
    borderColor: 'rgba(153, 153, 153, 0.3)',
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
  labelLocked: {
    color: '#999',
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
  lockBadge: {
    backgroundColor: '#666',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  lockBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFF',
  },
});