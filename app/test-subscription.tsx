import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import {
  ArrowLeft,
  Check,
  X,
  Zap,
  Music,
  Lock,
  Unlock,
  SkipForward,
  Play,
} from "lucide-react-native";
import { router } from "expo-router";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { usePlayer } from "@/contexts/PlayerContext";
import { allTracks } from "@/data/mockData";

export default function TestSubscriptionScreen() {
  const subscription = useSubscription();
  const player = usePlayer();
  const [testResults, setTestResults] = useState<string[]>([]);

  const addResult = (result: string) => {
    setTestResults((prev) => [...prev, result]);
  };

  const clearResults = () => {
    setTestResults([]);
  };

  const testAdSystem = () => {
    clearResults();
    addResult("🧪 Testing Ad System...");
    
    if (subscription.tier === "free") {
      addResult(`✅ User is on free tier`);
      addResult(`⏱️ Last ad: ${new Date(subscription.lastAdTimestamp).toLocaleTimeString()}`);
      addResult(`📊 Ad frequency: ${subscription.getAdFrequency() / 1000}s`);
      
      if (subscription.shouldShowAd()) {
        addResult(`✅ Ad should be shown now`);
      } else {
        const timeUntilAd = subscription.getAdFrequency() - (Date.now() - subscription.lastAdTimestamp);
        addResult(`⏳ Next ad in: ${Math.ceil(timeUntilAd / 1000)}s`);
      }
    } else {
      addResult(`✅ User is on ${subscription.tier} tier - No ads!`);
    }
  };

  const testSkipLimit = () => {
    clearResults();
    addResult("🧪 Testing Skip Limit...");
    
    if (subscription.tier === "free") {
      addResult(`✅ User is on free tier`);
      addResult(`⏭️ Skips used: ${subscription.skipCount}/6`);
      
      if (subscription.canSkip()) {
        addResult(`✅ User can skip (${6 - subscription.skipCount} remaining)`);
      } else {
        addResult(`❌ Skip limit reached!`);
      }
    } else {
      addResult(`✅ User is on ${subscription.tier} tier - Unlimited skips!`);
    }
  };

  const testDJInstinct = () => {
    clearResults();
    addResult("🧪 Testing DJ Instinct Access...");
    
    const hasAccess = subscription.canAccessFeature("djInstinct");
    
    if (hasAccess) {
      addResult(`✅ DJ Instinct is UNLOCKED`);
      addResult(`🎧 User can access all DJ features`);
    } else {
      addResult(`🔒 DJ Instinct is LOCKED`);
      addResult(`💎 Upgrade to Premium to unlock`);
    }
  };

  const testPersonalization = () => {
    clearResults();
    addResult("🧪 Testing Personalization Access...");
    
    const hasAccess = subscription.canAccessFeature("personalization");
    
    if (hasAccess) {
      addResult(`✅ Personalization is UNLOCKED`);
      addResult(`🎨 User can customize everything`);
    } else {
      addResult(`🔒 Personalization is LOCKED`);
      addResult(`💎 Upgrade to Premium to unlock`);
    }
  };

  const testDownloads = () => {
    clearResults();
    addResult("🧪 Testing Download Access...");
    
    const hasAccess = subscription.canAccessFeature("offlineDownloads");
    
    if (hasAccess) {
      addResult(`✅ Downloads are UNLOCKED`);
      addResult(`📥 Unlimited offline downloads`);
    } else {
      addResult(`🔒 Downloads are LOCKED`);
      addResult(`💎 Upgrade to Premium to unlock`);
    }
  };

  const simulateSkip = () => {
    clearResults();
    addResult("🧪 Simulating Skip...");
    
    if (subscription.tier === "free") {
      if (subscription.canSkip()) {
        subscription.recordSkip();
        addResult(`✅ Skip recorded`);
        addResult(`⏭️ Skips used: ${subscription.skipCount}/6`);
        addResult(`📊 Remaining: ${6 - subscription.skipCount}`);
      } else {
        addResult(`❌ Skip limit reached!`);
        addResult(`💎 Upgrade for unlimited skips`);
      }
    } else {
      addResult(`✅ Unlimited skips on ${subscription.tier} tier`);
    }
  };

  const simulateAd = () => {
    clearResults();
    addResult("🧪 Simulating Ad View...");
    
    if (subscription.tier === "free") {
      subscription.recordAdView();
      addResult(`✅ Ad view recorded`);
      addResult(`⏱️ Next ad in: ${subscription.getAdFrequency() / 1000}s`);
    } else {
      addResult(`✅ No ads on ${subscription.tier} tier`);
    }
  };

  const testUpgradeFlow = () => {
    clearResults();
    addResult("🧪 Testing Upgrade Flow...");
    addResult(`📊 Current tier: ${subscription.tier}`);
    addResult(`✅ Opening subscription page...`);
    
    setTimeout(() => {
      router.push("/subscription" as any);
    }, 500);
  };

  const testPlayWithAd = () => {
    clearResults();
    addResult("🧪 Testing Play with Ad Check...");
    
    if (allTracks.length > 0) {
      const track = allTracks[0];
      addResult(`🎵 Playing: ${track.title}`);
      
      if (subscription.shouldShowAd()) {
        addResult(`📺 Ad will be shown`);
      } else {
        addResult(`✅ No ad needed yet`);
      }
      
      player.playTrack(track);
    } else {
      addResult(`❌ No tracks available`);
    }
  };

  const resetDailyLimits = () => {
    clearResults();
    addResult("🧪 Resetting Daily Limits...");
    subscription.resetDailyLimits();
    addResult(`✅ Skip count reset to 0`);
    addResult(`✅ Stream count reset to 0`);
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#1A0B2E", "#16213E", "#0B0A14"]}
        style={styles.gradient}
      >
        <SafeAreaView style={styles.safeArea} edges={["top"]}>
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backButton}
            >
              <ArrowLeft size={24} color="#FFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Subscription Test</Text>
            <View style={styles.placeholder} />
          </View>

          <ScrollView
            style={styles.content}
            showsVerticalScrollIndicator={false}
          >
            {/* Current Status */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Current Status</Text>
              <View style={styles.statusCard}>
                <View style={styles.statusRow}>
                  <Text style={styles.statusLabel}>Tier:</Text>
                  <Text style={[styles.statusValue, styles.tierValue]}>
                    {subscription.tier.toUpperCase()}
                  </Text>
                </View>
                <View style={styles.statusRow}>
                  <Text style={styles.statusLabel}>Ad-Free:</Text>
                  {subscription.features.adFree ? (
                    <Check size={20} color="#00FF88" />
                  ) : (
                    <X size={20} color="#FF4444" />
                  )}
                </View>
                <View style={styles.statusRow}>
                  <Text style={styles.statusLabel}>DJ Instinct:</Text>
                  {subscription.features.djInstinct ? (
                    <Unlock size={20} color="#00FF88" />
                  ) : (
                    <Lock size={20} color="#FF4444" />
                  )}
                </View>
                <View style={styles.statusRow}>
                  <Text style={styles.statusLabel}>Personalization:</Text>
                  {subscription.features.personalization ? (
                    <Unlock size={20} color="#00FF88" />
                  ) : (
                    <Lock size={20} color="#FF4444" />
                  )}
                </View>
                <View style={styles.statusRow}>
                  <Text style={styles.statusLabel}>Skip Count:</Text>
                  <Text style={styles.statusValue}>
                    {subscription.skipCount}
                    {subscription.features.skipLimit !== null
                      ? `/${subscription.features.skipLimit}`
                      : " (Unlimited)"}
                  </Text>
                </View>
              </View>
            </View>

            {/* Feature Tests */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Feature Tests</Text>
              <View style={styles.buttonGrid}>
                <TouchableOpacity
                  style={styles.testButton}
                  onPress={testAdSystem}
                >
                  <Music size={20} color="#FFF" />
                  <Text style={styles.testButtonText}>Test Ads</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.testButton}
                  onPress={testSkipLimit}
                >
                  <SkipForward size={20} color="#FFF" />
                  <Text style={styles.testButtonText}>Test Skips</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.testButton}
                  onPress={testDJInstinct}
                >
                  <Lock size={20} color="#FFF" />
                  <Text style={styles.testButtonText}>Test DJ</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.testButton}
                  onPress={testPersonalization}
                >
                  <Zap size={20} color="#FFF" />
                  <Text style={styles.testButtonText}>Test Custom</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.testButton}
                  onPress={testDownloads}
                >
                  <Music size={20} color="#FFF" />
                  <Text style={styles.testButtonText}>Test Downloads</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.testButton}
                  onPress={testUpgradeFlow}
                >
                  <Zap size={20} color="#FFF" />
                  <Text style={styles.testButtonText}>Test Upgrade</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Action Tests */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Action Tests</Text>
              <View style={styles.buttonGrid}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={simulateSkip}
                >
                  <SkipForward size={20} color="#FFF" />
                  <Text style={styles.testButtonText}>Simulate Skip</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={simulateAd}
                >
                  <Play size={20} color="#FFF" />
                  <Text style={styles.testButtonText}>Simulate Ad</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={testPlayWithAd}
                >
                  <Music size={20} color="#FFF" />
                  <Text style={styles.testButtonText}>Play Track</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={resetDailyLimits}
                >
                  <Zap size={20} color="#FFF" />
                  <Text style={styles.testButtonText}>Reset Limits</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Tier Switching */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Quick Tier Switch</Text>
              <View style={styles.buttonGrid}>
                <TouchableOpacity
                  style={[
                    styles.tierButton,
                    subscription.tier === "free" && styles.tierButtonActive,
                  ]}
                  onPress={() => subscription.upgradeTier("free")}
                >
                  <Text style={styles.tierButtonText}>Free</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.tierButton,
                    subscription.tier === "premium" && styles.tierButtonActive,
                  ]}
                  onPress={() => subscription.upgradeTier("premium")}
                >
                  <Text style={styles.tierButtonText}>Premium</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.tierButton,
                    subscription.tier === "pro" && styles.tierButtonActive,
                  ]}
                  onPress={() => subscription.upgradeTier("pro")}
                >
                  <Text style={styles.tierButtonText}>Pro</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Test Results */}
            {testResults.length > 0 && (
              <View style={styles.section}>
                <View style={styles.resultsHeader}>
                  <Text style={styles.sectionTitle}>Test Results</Text>
                  <TouchableOpacity onPress={clearResults}>
                    <Text style={styles.clearButton}>Clear</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.resultsCard}>
                  {testResults.map((result, index) => (
                    <Text key={index} style={styles.resultText}>
                      {result}
                    </Text>
                  ))}
                </View>
              </View>
            )}

            <View style={{ height: 40 }} />
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B0A14",
  },
  gradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFF",
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#FFF",
    marginBottom: 16,
  },
  statusCard: {
    backgroundColor: "#1A1A1A",
    borderRadius: 16,
    padding: 20,
    gap: 16,
  },
  statusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statusLabel: {
    fontSize: 15,
    color: "#999",
    fontWeight: "600",
  },
  statusValue: {
    fontSize: 15,
    color: "#FFF",
    fontWeight: "700",
  },
  tierValue: {
    color: "#FF0080",
  },
  buttonGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  testButton: {
    flex: 1,
    minWidth: "45%",
    backgroundColor: "#8B5CF6",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    gap: 8,
  },
  actionButton: {
    flex: 1,
    minWidth: "45%",
    backgroundColor: "#FF0080",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    gap: 8,
  },
  tierButton: {
    flex: 1,
    backgroundColor: "#333",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "transparent",
  },
  tierButtonActive: {
    borderColor: "#FF0080",
    backgroundColor: "rgba(255, 0, 128, 0.2)",
  },
  tierButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFF",
  },
  testButtonText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#FFF",
  },
  resultsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  clearButton: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FF0080",
  },
  resultsCard: {
    backgroundColor: "#1A1A1A",
    borderRadius: 16,
    padding: 20,
    gap: 8,
  },
  resultText: {
    fontSize: 13,
    color: "#FFF",
    fontFamily: "monospace",
    lineHeight: 20,
  },
});
