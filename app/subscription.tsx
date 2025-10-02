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
  Zap,
  Music,
  Download,
  Sparkles,
  Headphones,
  Star,
  Crown,
  Shield,
} from "lucide-react-native";
import { router } from "expo-router";
import { useSubscription } from "@/contexts/SubscriptionContext";

const PLANS = [
  {
    id: "premium",
    name: "Premium",
    price: "$9.99",
    period: "month",
    icon: Star,
    gradient: ["#667eea", "#764ba2"] as const,
    features: [
      "✨ Ad-free listening",
      "⏭️ Unlimited skips",
      "🎵 High quality audio",
      "📥 Unlimited offline downloads",
      "🎨 Full personalization",
      "🎯 Custom playlists",
      "🤖 AI recommendations",
      "🎧 DJ Instinct access",
    ],
    popular: true,
  },
  {
    id: "pro",
    name: "Pro",
    price: "$14.99",
    period: "month",
    icon: Crown,
    gradient: ["#FF0080", "#8B5CF6"] as const,
    features: [
      "✨ Everything in Premium",
      "🎛️ Advanced DJ controls",
      "🔊 Professional audio tools",
      "⚡ Early access to features",
      "👑 Priority support",
      "🎚️ Advanced EQ & effects",
      "📊 Detailed analytics",
      "🌟 Exclusive content",
    ],
    popular: false,
  },
];

export default function SubscriptionScreen() {
  const { tier, upgradeTier } = useSubscription();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubscribe = async () => {
    if (!selectedPlan) {
      Alert.alert("Select a Plan", "Please select a subscription plan to continue.");
      return;
    }

    setIsProcessing(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      await upgradeTier(selectedPlan as "premium" | "pro");
      
      Alert.alert(
        "Success!",
        `You've successfully upgraded to ${selectedPlan === "premium" ? "Premium" : "Pro"}!`,
        [
          {
            text: "OK",
            onPress: () => router.back(),
          },
        ]
      );
    } catch (err) {
      console.error('[Subscription] Error:', err);
      Alert.alert("Error", "Failed to process subscription. Please try again.");
    } finally {
      setIsProcessing(false);
    }
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
            <Text style={styles.headerTitle}>Choose Your Plan</Text>
            <View style={styles.placeholder} />
          </View>

          <ScrollView
            style={styles.content}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.hero}>
              <View style={styles.heroIcon}>
                <Zap size={48} color="#FF0080" />
              </View>
              <Text style={styles.heroTitle}>Unlock Premium Features</Text>
              <Text style={styles.heroSubtitle}>
                Get the most out of your music experience
              </Text>
            </View>

            {tier !== "free" && (
              <View style={styles.currentPlanBanner}>
                <Shield size={20} color="#00FF88" />
                <Text style={styles.currentPlanText}>
                  Current Plan: {tier === "premium" ? "Premium" : "Pro"}
                </Text>
              </View>
            )}

            <View style={styles.plansContainer}>
              {PLANS.map((plan) => {
                const Icon = plan.icon;
                const isSelected = selectedPlan === plan.id;
                const isCurrent = tier === plan.id;

                return (
                  <TouchableOpacity
                    key={plan.id}
                    style={[
                      styles.planCard,
                      isSelected && styles.planCardSelected,
                      isCurrent && styles.planCardCurrent,
                    ]}
                    onPress={() => !isCurrent && setSelectedPlan(plan.id)}
                    disabled={isCurrent}
                  >
                    <LinearGradient
                      colors={
                        isSelected || isCurrent
                          ? plan.gradient
                          : ["transparent", "transparent"]
                      }
                      style={styles.planGradient}
                    >
                      <View style={styles.planHeader}>
                        <View style={styles.planIconContainer}>
                          <Icon size={32} color="#FFF" />
                        </View>
                        {plan.popular && (
                          <View style={styles.popularBadge}>
                            <Text style={styles.popularText}>POPULAR</Text>
                          </View>
                        )}
                        {isCurrent && (
                          <View style={styles.currentBadge}>
                            <Text style={styles.currentText}>CURRENT</Text>
                          </View>
                        )}
                      </View>

                      <Text style={styles.planName}>{plan.name}</Text>
                      <View style={styles.priceContainer}>
                        <Text style={styles.planPrice}>{plan.price}</Text>
                        <Text style={styles.planPeriod}>/{plan.period}</Text>
                      </View>

                      <View style={styles.featuresContainer}>
                        {plan.features.map((feature, index) => (
                          <View key={index} style={styles.featureItem}>
                            <Check size={16} color="#00FF88" />
                            <Text style={styles.featureText}>{feature}</Text>
                          </View>
                        ))}
                      </View>

                      {isSelected && !isCurrent && (
                        <View style={styles.selectedIndicator}>
                          <Check size={20} color="#FFF" />
                        </View>
                      )}
                    </LinearGradient>
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={styles.comparisonSection}>
              <Text style={styles.comparisonTitle}>Free vs Premium</Text>
              <View style={styles.comparisonTable}>
                <View style={styles.comparisonRow}>
                  <Text style={styles.comparisonFeature}>Ads</Text>
                  <Text style={styles.comparisonFree}>❌ With Ads</Text>
                  <Text style={styles.comparisonPaid}>✅ Ad-Free</Text>
                </View>
                <View style={styles.comparisonRow}>
                  <Text style={styles.comparisonFeature}>Skips</Text>
                  <Text style={styles.comparisonFree}>⚠️ 6 per hour</Text>
                  <Text style={styles.comparisonPaid}>✅ Unlimited</Text>
                </View>
                <View style={styles.comparisonRow}>
                  <Text style={styles.comparisonFeature}>Downloads</Text>
                  <Text style={styles.comparisonFree}>❌ None</Text>
                  <Text style={styles.comparisonPaid}>✅ Unlimited</Text>
                </View>
                <View style={styles.comparisonRow}>
                  <Text style={styles.comparisonFeature}>Audio Quality</Text>
                  <Text style={styles.comparisonFree}>⚠️ Standard</Text>
                  <Text style={styles.comparisonPaid}>✅ High Quality</Text>
                </View>
                <View style={styles.comparisonRow}>
                  <Text style={styles.comparisonFeature}>DJ Instinct</Text>
                  <Text style={styles.comparisonFree}>❌ Locked</Text>
                  <Text style={styles.comparisonPaid}>✅ Full Access</Text>
                </View>
                <View style={styles.comparisonRow}>
                  <Text style={styles.comparisonFeature}>Personalization</Text>
                  <Text style={styles.comparisonFree}>❌ Limited</Text>
                  <Text style={styles.comparisonPaid}>✅ Full Control</Text>
                </View>
              </View>
            </View>

            <View style={styles.benefitsSection}>
              <Text style={styles.benefitsTitle}>Premium Benefits</Text>
              <View style={styles.benefitsList}>
                <View style={styles.benefitItem}>
                  <Music size={24} color="#FF0080" />
                  <View style={styles.benefitContent}>
                    <Text style={styles.benefitTitle}>Zero Interruptions</Text>
                    <Text style={styles.benefitDescription}>
                      No ads ever. Pure, uninterrupted music experience
                    </Text>
                  </View>
                </View>

                <View style={styles.benefitItem}>
                  <Download size={24} color="#8B5CF6" />
                  <View style={styles.benefitContent}>
                    <Text style={styles.benefitTitle}>Unlimited Downloads</Text>
                    <Text style={styles.benefitDescription}>
                      Download as many tracks as you want for offline listening
                    </Text>
                  </View>
                </View>

                <View style={styles.benefitItem}>
                  <Sparkles size={24} color="#FFD700" />
                  <View style={styles.benefitContent}>
                    <Text style={styles.benefitTitle}>Full Personalization</Text>
                    <Text style={styles.benefitDescription}>
                      Customize everything - playlists, themes, recommendations
                    </Text>
                  </View>
                </View>

                <View style={styles.benefitItem}>
                  <Headphones size={24} color="#00D4AA" />
                  <View style={styles.benefitContent}>
                    <Text style={styles.benefitTitle}>DJ Instinct AI</Text>
                    <Text style={styles.benefitDescription}>
                      Professional AI mixing, live sessions, and party mode
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.footer}>
              <Text style={styles.footerText}>
                Cancel anytime. No commitments.
              </Text>
            </View>
          </ScrollView>

          {tier === "free" && (
            <View style={styles.bottomBar}>
              <TouchableOpacity
                style={[
                  styles.subscribeButton,
                  (!selectedPlan || isProcessing) && styles.subscribeButtonDisabled,
                ]}
                onPress={handleSubscribe}
                disabled={!selectedPlan || isProcessing}
              >
                <LinearGradient
                  colors={
                    selectedPlan && !isProcessing
                      ? ["#FF0080", "#8B5CF6"] as const
                      : ["#333", "#333"] as const
                  }
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.subscribeGradient}
                >
                  <Text style={styles.subscribeButtonText}>
                    {isProcessing
                      ? "Processing..."
                      : selectedPlan
                      ? `Subscribe to ${PLANS.find((p) => p.id === selectedPlan)?.name}`
                      : "Select a Plan"}
                  </Text>
                  {!isProcessing && <Zap size={20} color="#FFF" fill="#FFF" />}
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}
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
  },
  hero: {
    alignItems: "center",
    paddingVertical: 32,
    paddingHorizontal: 20,
  },
  heroIcon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "rgba(255, 0, 128, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
    borderWidth: 2,
    borderColor: "rgba(255, 0, 128, 0.3)",
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#FFF",
    marginBottom: 12,
    textAlign: "center",
  },
  heroSubtitle: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
  },
  currentPlanBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginHorizontal: 20,
    marginBottom: 24,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: "rgba(0, 255, 136, 0.1)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(0, 255, 136, 0.3)",
  },
  currentPlanText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#00FF88",
  },
  plansContainer: {
    paddingHorizontal: 20,
    gap: 16,
    marginBottom: 32,
  },
  planCard: {
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  planCardSelected: {
    borderColor: "#FF0080",
  },
  planCardCurrent: {
    borderColor: "#00FF88",
    opacity: 0.7,
  },
  planGradient: {
    padding: 24,
    backgroundColor: "#1A1A1A",
  },
  planHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  planIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  popularBadge: {
    backgroundColor: "#FFD700",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  popularText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#000",
  },
  currentBadge: {
    backgroundColor: "#00FF88",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  currentText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#000",
  },
  planName: {
    fontSize: 24,
    fontWeight: "800",
    color: "#FFF",
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: 24,
  },
  planPrice: {
    fontSize: 36,
    fontWeight: "900",
    color: "#FFF",
  },
  planPeriod: {
    fontSize: 16,
    color: "#999",
    marginLeft: 4,
  },
  featuresContainer: {
    gap: 12,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  featureText: {
    fontSize: 15,
    color: "#FFF",
    fontWeight: "500",
  },
  selectedIndicator: {
    position: "absolute",
    top: 24,
    right: 24,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#FF0080",
    justifyContent: "center",
    alignItems: "center",
  },
  benefitsSection: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  benefitsTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#FFF",
    marginBottom: 20,
  },
  benefitsList: {
    gap: 20,
  },
  benefitItem: {
    flexDirection: "row",
    gap: 16,
  },
  benefitContent: {
    flex: 1,
  },
  benefitTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFF",
    marginBottom: 4,
  },
  benefitDescription: {
    fontSize: 14,
    color: "#999",
    lineHeight: 20,
  },
  comparisonSection: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  comparisonTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#FFF",
    marginBottom: 20,
  },
  comparisonTable: {
    backgroundColor: "#1A1A1A",
    borderRadius: 16,
    padding: 16,
    gap: 16,
  },
  comparisonRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  comparisonFeature: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
    color: "#FFF",
  },
  comparisonFree: {
    flex: 1,
    fontSize: 13,
    color: "#999",
    textAlign: "center",
  },
  comparisonPaid: {
    flex: 1,
    fontSize: 13,
    color: "#00FF88",
    fontWeight: "600",
    textAlign: "center",
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 120,
    alignItems: "center",
  },
  footerText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  bottomBar: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.1)",
  },
  subscribeButton: {
    borderRadius: 16,
    overflow: "hidden",
  },
  subscribeButtonDisabled: {
    opacity: 0.5,
  },
  subscribeGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 18,
    gap: 8,
  },
  subscribeButtonText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#FFF",
  },
});
