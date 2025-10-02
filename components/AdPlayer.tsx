import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Modal, TouchableOpacity, ActivityIndicator } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { X, Volume2, VolumeX, Zap } from "lucide-react-native";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { router } from "expo-router";

interface AdPlayerProps {
  visible: boolean;
  onClose: () => void;
  onComplete: () => void;
}

const AD_DURATION = 15;

export default function AdPlayer({ visible, onClose, onComplete }: AdPlayerProps) {
  const [countdown, setCountdown] = useState(AD_DURATION);
  const [muted, setMuted] = useState(false);
  const { recordAdView } = useSubscription();

  useEffect(() => {
    if (visible) {
      setCountdown(AD_DURATION);
      recordAdView();
      
      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setTimeout(() => {
              onComplete();
            }, 500);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [visible, onComplete, recordAdView]);

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={() => {}}
    >
      <View style={styles.overlay}>
        <LinearGradient
          colors={["#1A0B2E", "#16213E", "#0B0A14"]}
          style={styles.container}
        >
          <View style={styles.header}>
            <View style={styles.adBadge}>
              <Text style={styles.adBadgeText}>AD</Text>
            </View>
            <TouchableOpacity
              style={styles.muteButton}
              onPress={() => setMuted(!muted)}
            >
              {muted ? (
                <VolumeX size={20} color="#FFF" />
              ) : (
                <Volume2 size={20} color="#FFF" />
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            <View style={styles.iconContainer}>
              <Zap size={64} color="#FF0080" />
            </View>
            
            <Text style={styles.title}>Upgrade to Premium</Text>
            <Text style={styles.description}>
              Enjoy ad-free listening, unlimited skips, offline downloads, and more!
            </Text>

            <View style={styles.features}>
              <View style={styles.featureItem}>
                <View style={styles.featureDot} />
                <Text style={styles.featureText}>No ads, ever</Text>
              </View>
              <View style={styles.featureItem}>
                <View style={styles.featureDot} />
                <Text style={styles.featureText}>Unlimited skips</Text>
              </View>
              <View style={styles.featureItem}>
                <View style={styles.featureDot} />
                <Text style={styles.featureText}>Offline downloads</Text>
              </View>
              <View style={styles.featureItem}>
                <View style={styles.featureDot} />
                <Text style={styles.featureText}>High quality audio</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.upgradeButton}
              onPress={() => {
                onClose();
                router.push("/subscription" as any);
              }}
            >
              <LinearGradient
                colors={["#FF0080", "#8B5CF6"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.upgradeGradient}
              >
                <Text style={styles.upgradeButtonText}>Upgrade Now</Text>
                <Zap size={20} color="#FFF" fill="#FFF" />
              </LinearGradient>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <View style={styles.countdownContainer}>
              <ActivityIndicator color="#FF0080" />
              <Text style={styles.countdownText}>
                Continue in {countdown}s
              </Text>
            </View>
            {countdown === 0 && (
              <TouchableOpacity
                style={styles.closeButton}
                onPress={onClose}
              >
                <X size={24} color="#FFF" />
              </TouchableOpacity>
            )}
          </View>
        </LinearGradient>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.95)",
  },
  container: {
    flex: 1,
    justifyContent: "space-between",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  adBadge: {
    backgroundColor: "#FFD700",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  adBadgeText: {
    fontSize: 12,
    fontWeight: "800",
    color: "#000",
  },
  muteButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(255, 0, 128, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 32,
    borderWidth: 2,
    borderColor: "rgba(255, 0, 128, 0.3)",
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#FFF",
    marginBottom: 16,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    color: "#CCC",
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 24,
  },
  features: {
    width: "100%",
    marginBottom: 32,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  featureDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FF0080",
    marginRight: 12,
  },
  featureText: {
    fontSize: 15,
    color: "#FFF",
    fontWeight: "600",
  },
  upgradeButton: {
    width: "100%",
    borderRadius: 16,
    overflow: "hidden",
  },
  upgradeGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 18,
    gap: 8,
  },
  upgradeButtonText: {
    fontSize: 18,
    fontWeight: "800",
    color: "#FFF",
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    alignItems: "center",
  },
  countdownContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },
  countdownText: {
    fontSize: 14,
    color: "#999",
    fontWeight: "600",
  },
  closeButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
});
