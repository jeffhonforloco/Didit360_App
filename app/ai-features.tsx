import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { router, Stack } from "expo-router";
import {
  Sparkles,
  Brain,
  Mic,
  Zap,
  Heart,
  Search,
  Radio,
  BarChart3,
  Wand2,
  Target,
  Users,
  ChevronRight,
} from "lucide-react-native";

const aiFeatures = [
  {
    id: "smart-recommendations",
    title: "Smart Recommendations",
    description: "AI analyzes your listening history and context to suggest perfect tracks",
    icon: <Brain size={28} color="#FF0080" />,
    gradient: ["#FF0080", "#FF8C00"] as const,
    route: "/your-mix",
    features: [
      "Deep listening history analysis",
      "Context-aware suggestions (time, mood, weather)",
      "70% familiarity, 30% discovery balance",
      "Confidence scores and reasoning",
    ],
  },
  {
    id: "mood-detection",
    title: "AI Mood Detection",
    description: "Comprehensive emotional analysis from audio features and lyrics",
    icon: <Heart size={28} color="#8B5CF6" />,
    gradient: ["#8B5CF6", "#EC4899"] as const,
    route: "/ai-dj",
    features: [
      "Multi-dimensional mood profiling",
      "8-emotion analysis (joy, sadness, anger, etc.)",
      "Listening context suggestions",
      "Therapeutic use recommendations",
    ],
  },
  {
    id: "voice-assistant",
    title: "Voice DJ Assistant",
    description: "Natural language voice control and music conversations",
    icon: <Mic size={28} color="#00D4AA" />,
    gradient: ["#00D4AA", "#00C6FF"] as const,
    route: "/voice-assistant-settings",
    features: [
      "Natural language understanding",
      "Intent detection (play, pause, search, etc.)",
      "Multi-turn conversations",
      "Music knowledge and recommendations",
    ],
  },
  {
    id: "dj-instinct",
    title: "DJ Instinct",
    description: "AI DJ that creates seamless mixes with human-like intuition",
    icon: <Radio size={28} color="#F59E0B" />,
    gradient: ["#F59E0B", "#EF4444"] as const,
    route: "/ai-dj",
    features: [
      "Harmonic mixing (Camelot Wheel)",
      "BPM transition optimization",
      "Energy flow management",
      "Peak moment planning",
    ],
  },
  {
    id: "contextual-discovery",
    title: "Contextual Discovery",
    description: "Music discovery based on time, weather, activity, and location",
    icon: <Target size={28} color="#667eea" />,
    gradient: ["#667eea", "#764ba2"] as const,
    route: "/browse-categories",
    features: [
      "Multi-factor context analysis",
      "Circadian rhythm consideration",
      "Weather-mood associations",
      "Activity-appropriate selection",
    ],
  },
  {
    id: "lyrics-analysis",
    title: "Lyrics Analysis",
    description: "Deep analysis of themes, literary devices, and emotional tone",
    icon: <Wand2 size={28} color="#F7971E" />,
    gradient: ["#F7971E", "#FFD200"] as const,
    route: "/lyrics",
    features: [
      "Theme and motif identification",
      "Literary device detection",
      "Emotional tone analysis",
      "Cultural reference identification",
    ],
  },
  {
    id: "collaborative-filtering",
    title: "Collaborative Filtering",
    description: "Recommendations based on users with similar taste",
    icon: <Users size={28} color="#11998e" />,
    gradient: ["#11998e", "#38ef7d"] as const,
    route: "/your-mix",
    features: [
      "User similarity analysis",
      "Taste clustering",
      "Discovery vs exploitation balance",
      "Skip pattern avoidance",
    ],
  },
  {
    id: "similarity-search",
    title: "Music Similarity Search",
    description: "Find similar tracks using AI embeddings and semantic search",
    icon: <Search size={28} color="#6A85F1" />,
    gradient: ["#6A85F1", "#B892FF"] as const,
    route: "/search",
    features: [
      "Vector embeddings for tracks",
      "Multi-dimensional similarity",
      "Semantic search capabilities",
      "Filter support (genre, BPM, energy)",
    ],
  },
  {
    id: "setlist-optimizer",
    title: "DJ Setlist Optimizer",
    description: "Optimize track order for perfect DJ sets",
    icon: <BarChart3 size={28} color="#FF6B6B" />,
    gradient: ["#FF6B6B", "#FF8E53"] as const,
    route: "/dj-instinct",
    features: [
      "Harmonic mixing optimization",
      "BPM transition planning",
      "Energy flow management",
      "Venue and audience consideration",
    ],
  },
];

const quickActions = [
  {
    id: "try-voice",
    title: "Try Voice Control",
    icon: <Mic size={20} color="#FFF" />,
    gradient: ["#00D4AA", "#00C6FF"] as const,
    route: "/ai-dj",
  },
  {
    id: "smart-mix",
    title: "Get Smart Mix",
    icon: <Sparkles size={20} color="#FFF" />,
    gradient: ["#FF0080", "#FF8C00"] as const,
    route: "/your-mix",
  },
  {
    id: "dj-live",
    title: "DJ Instinct Live",
    icon: <Radio size={20} color="#FFF" />,
    gradient: ["#F59E0B", "#EF4444"] as const,
    route: "/dj-instinct/live",
  },
  {
    id: "discover",
    title: "Contextual Discovery",
    icon: <Target size={20} color="#FFF" />,
    gradient: ["#667eea", "#764ba2"] as const,
    route: "/browse-categories",
  },
];

export default function AIFeaturesScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Stack.Screen
        options={{
          title: "AI Features",
          headerShown: true,
          headerStyle: { backgroundColor: "#0A0A0A" },
          headerTintColor: "#FFF",
          headerTitleStyle: { fontWeight: "bold" },
        }}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={["#1A0B2E", "#16213E", "#0B0A14"]}
          locations={[0, 0.3, 1]}
          style={styles.backgroundGradient}
        />

        {/* Hero Section */}
        <View style={styles.hero}>
          <View style={styles.heroIconContainer}>
            <Sparkles size={48} color="#FF0080" />
          </View>
          <Text style={styles.heroTitle}>AI-Powered Music Experience</Text>
          <Text style={styles.heroDescription}>
            Discover 15+ advanced AI features that understand your taste, mood, and context to deliver the perfect music experience
          </Text>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsSection}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            {quickActions.map((action) => (
              <TouchableOpacity
                key={action.id}
                style={styles.quickActionCard}
                onPress={() => router.push(action.route as any)}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={action.gradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.quickActionGradient}
                >
                  {action.icon}
                  <Text style={styles.quickActionTitle}>{action.title}</Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* AI Features List */}
        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>All AI Features</Text>
          {aiFeatures.map((feature, index) => (
            <TouchableOpacity
              key={feature.id}
              style={styles.featureCard}
              onPress={() => router.push(feature.route as any)}
              activeOpacity={0.9}
            >
              <LinearGradient
                colors={[feature.gradient[0], feature.gradient[1], "transparent"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.featureGradientBorder}
              >
                <View style={styles.featureContent}>
                  <View style={styles.featureHeader}>
                    <View style={styles.featureIconContainer}>
                      {feature.icon}
                    </View>
                    <View style={styles.featureTitleContainer}>
                      <Text style={styles.featureTitle}>{feature.title}</Text>
                      <Text style={styles.featureDescription}>
                        {feature.description}
                      </Text>
                    </View>
                    <ChevronRight size={20} color="#666" />
                  </View>

                  <View style={styles.featuresList}>
                    {feature.features.map((item, idx) => (
                      <View key={idx} style={styles.featureItem}>
                        <View style={styles.featureBullet} />
                        <Text style={styles.featureItemText}>{item}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>

        {/* Stats Section */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Powered by OpenAI</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>15+</Text>
              <Text style={styles.statLabel}>AI Features</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>1-3s</Text>
              <Text style={styles.statLabel}>Response Time</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>85-95%</Text>
              <Text style={styles.statLabel}>Accuracy</Text>
            </View>
          </View>
        </View>

        {/* Models Used */}
        <View style={styles.modelsSection}>
          <Text style={styles.sectionTitle}>AI Models</Text>
          <View style={styles.modelsList}>
            <View style={styles.modelCard}>
              <Zap size={20} color="#FF0080" />
              <View style={styles.modelInfo}>
                <Text style={styles.modelName}>GPT-4o-mini</Text>
                <Text style={styles.modelDescription}>
                  Fast text generation and analysis
                </Text>
              </View>
            </View>
            <View style={styles.modelCard}>
              <Mic size={20} color="#00D4AA" />
              <View style={styles.modelInfo}>
                <Text style={styles.modelName}>Whisper-1</Text>
                <Text style={styles.modelDescription}>
                  Audio transcription and voice control
                </Text>
              </View>
            </View>
            <View style={styles.modelCard}>
              <Search size={20} color="#8B5CF6" />
              <View style={styles.modelInfo}>
                <Text style={styles.modelName}>text-embedding-3-small</Text>
                <Text style={styles.modelDescription}>
                  Vector embeddings for similarity search
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A0A0A",
  },
  backgroundGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 400,
  },
  hero: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 32,
    alignItems: "center",
  },
  heroIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255, 0, 128, 0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#FFF",
    textAlign: "center",
    marginBottom: 12,
  },
  heroDescription: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  quickActionsSection: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#FFF",
    marginBottom: 16,
  },
  quickActionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  quickActionCard: {
    width: "48%",
    borderRadius: 16,
    overflow: "hidden",
  },
  quickActionGradient: {
    padding: 20,
    alignItems: "center",
    gap: 12,
  },
  quickActionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFF",
    textAlign: "center",
  },
  featuresSection: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  featureCard: {
    marginBottom: 16,
    borderRadius: 20,
    overflow: "hidden",
  },
  featureGradientBorder: {
    padding: 2,
  },
  featureContent: {
    backgroundColor: "#1A1A1A",
    borderRadius: 18,
    padding: 20,
  },
  featureHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  featureIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  featureTitleContainer: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFF",
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: "#999",
    lineHeight: 20,
  },
  featuresList: {
    gap: 8,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  featureBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#FF0080",
    marginTop: 6,
  },
  featureItemText: {
    flex: 1,
    fontSize: 13,
    color: "#CCC",
    lineHeight: 20,
  },
  statsSection: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  statsGrid: {
    flexDirection: "row",
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#1A1A1A",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#2A2A2A",
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "800",
    color: "#FF0080",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#999",
    textAlign: "center",
  },
  modelsSection: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  modelsList: {
    gap: 12,
  },
  modelCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1A1A1A",
    borderRadius: 16,
    padding: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: "#2A2A2A",
  },
  modelInfo: {
    flex: 1,
  },
  modelName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFF",
    marginBottom: 4,
  },
  modelDescription: {
    fontSize: 13,
    color: "#999",
  },
});
