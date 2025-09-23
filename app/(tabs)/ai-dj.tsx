import React, { useCallback, useMemo, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  ActivityIndicator,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { 
  Sparkles, 
  Play, 
  RefreshCw, 
  Settings, 
  History, 
  Heart, 
  Mic, 
  Zap,
  Music,
  Clock,
  TrendingUp,
  Shuffle,
  BarChart3,
  Headphones
} from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { usePlayer } from "@/contexts/PlayerContext";
import { useMixMind } from "@/contexts/MixMindContext";
import { aiDjPrompts, type AIDJPromptCategoryKey } from "@/data/aiDjPrompts";



const presetMoods = [
  { id: "energetic", label: "Energetic", emoji: "⚡", gradient: ["#FF6B6B", "#FF8E53"] },
  { id: "chill", label: "Chill", emoji: "😌", gradient: ["#4ECDC4", "#44A08D"] },
  { id: "focus", label: "Focus", emoji: "🎯", gradient: ["#667eea", "#764ba2"] },
  { id: "party", label: "Party", emoji: "🎉", gradient: ["#f093fb", "#f5576c"] },
  { id: "romantic", label: "Romantic", emoji: "💕", gradient: ["#ffecd2", "#fcb69f"] },
  { id: "workout", label: "Workout", emoji: "💪", gradient: ["#FF0080", "#7928CA"] },
] as const;

const quickActions = [
  { id: "voice", icon: Mic, label: "Voice Prompt", color: "#FF6B6B" },
  { id: "shuffle", icon: Shuffle, label: "Surprise Me", color: "#4ECDC4" },
  { id: "trending", icon: TrendingUp, label: "What's Hot", color: "#667eea" },
  { id: "history", icon: History, label: "My History", color: "#f093fb" },
];

export default function MixMindScreen() {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const [prompt, setPrompt] = useState<string>("");
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [djStyle, setDjStyle] = useState<string>("");
  const { playTrack } = usePlayer();
  const { 
    currentSet, 
    isGenerating, 
    history, 
    recentPrompts, 
    generateSet, 
    addFavoritePrompt,
    settings 
  } = useMixMind();

  const suggestionCategories = useMemo(() => Object.keys(aiDjPrompts) as AIDJPromptCategoryKey[], []);

  const djStyleExamples = useMemo(
    () => [
      "like Black Coffee (deep, smooth transitions)",
      "like Peggy Gou (groovy, retro house)",
      "like David Guetta (festival big-room)",
      "like Amelie Lens (driving techno)",
      "like Kaytranada (bounce, soulful edits)",
      "like DJ Snake (global bass energy)",
    ],
    [],
  );

  const buildPrompt = useCallback(() => {
    const moodText = selectedMood ? `${presetMoods.find((m) => m.id === selectedMood)?.label ?? ""} mood` : "";
    const base = [prompt, moodText].filter(Boolean).join(". ");
    const withDj = djStyle.trim() ? `${base}. DJ style: ${djStyle.trim()}` : base;
    return withDj.trim();
  }, [prompt, selectedMood, djStyle]);

  const handleGenerate = useCallback(async () => {
    try {
      if (!prompt && !selectedMood && !djStyle) return;
      
      const finalPrompt = buildPrompt();
      console.log("[MixMind] Generating with", { prompt: finalPrompt, settings });
      
      const result = await generateSet(finalPrompt);
      if (!result) {
        console.log("Couldn't generate your mix right now. Please try again.");
      }
    } catch (error) {
      console.error("[MixMind] Generation error", error);
    }
  }, [prompt, selectedMood, djStyle, buildPrompt, generateSet, settings]);

  const handlePlaySet = useCallback(() => {
    if (currentSet && currentSet.tracks.length > 0) {
      console.log("[MixMind] Playing first track of set", currentSet.tracks[0]);
      playTrack(currentSet.tracks[0] as unknown as any);
    }
  }, [currentSet, playTrack]);

  const handleQuickAction = useCallback((actionId: string) => {
    switch (actionId) {
      case "voice":
        console.log("Voice input coming soon!");
        break;
      case "shuffle":
        setPrompt("Surprise me with something amazing");
        setSelectedMood(presetMoods[Math.floor(Math.random() * presetMoods.length)].id);
        break;
      case "trending":
        setPrompt("Latest trending hits and viral sounds");
        break;
      case "history":
        console.log("History feature coming soon!");
        break;
    }
  }, []);

  const appendPrompt = useCallback((text: string) => {
    setPrompt((p) => (p ? `${p}\n${text}` : text));
  }, []);

  const formatDuration = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title} testID="mixmind-title">MixMind</Text>
            <Text style={styles.subtitle} testID="mixmind-subtitle">
              Your AI-powered music curator
            </Text>
          </View>
          <View style={styles.headerStats}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{history.totalSetsGenerated}</Text>
              <Text style={styles.statLabel}>Sets</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{Math.floor(history.totalListeningTime / 60)}</Text>
              <Text style={styles.statLabel}>Hours</Text>
            </View>
          </View>
        </View>

        {/* Hero Card */}
        <LinearGradient
          colors={["#FF0080", "#8B5CF6", "#3B82F6"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroCard}
        >
          <Sparkles size={56} color="#FFF" />
          <Text style={styles.heroTitle}>Intelligent Music Curation</Text>
          <Text style={styles.heroDescription}>
            Describe your vibe, and I&apos;ll craft the perfect mix with seamless transitions, 
            harmonic mixing, and tracks that flow together beautifully.
          </Text>
          <View style={styles.heroFeatures}>
            <View style={styles.featureItem}>
              <Music size={16} color="#FFF" />
              <Text style={styles.featureText}>Smart Transitions</Text>
            </View>
            <View style={styles.featureItem}>
              <BarChart3 size={16} color="#FFF" />
              <Text style={styles.featureText}>BPM Matching</Text>
            </View>
            <View style={styles.featureItem}>
              <Headphones size={16} color="#FFF" />
              <Text style={styles.featureText}>Harmonic Mixing</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Quick Actions */}
        <View style={styles.quickActionsSection}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            {quickActions.map((action) => (
              <TouchableOpacity
                key={action.id}
                style={[styles.quickActionCard, { borderColor: action.color }]}
                onPress={() => handleQuickAction(action.id)}
                testID={`mixmind-quick-${action.id}`}
              >
                <action.icon size={24} color={action.color} />
                <Text style={styles.quickActionLabel}>{action.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Recent Prompts */}
        {recentPrompts.length > 0 && (
          <View style={styles.recentSection}>
            <Text style={styles.sectionTitle}>Recent Prompts</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {recentPrompts.slice(0, 5).map((recentPrompt) => (
                <TouchableOpacity
                  key={recentPrompt}
                  style={styles.recentPromptChip}
                  onPress={() => {
                    const sanitized = recentPrompt.trim();
                    if (sanitized && sanitized.length <= 500) {
                      setPrompt(sanitized);
                    }
                  }}
                  testID={`mixmind-recent-${recentPrompt.slice(0, 10)}`}
                >
                  <Text style={styles.recentPromptText} numberOfLines={2}>
                    {recentPrompt}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Main Prompt Input */}
        <View style={styles.promptSection}>
          <Text style={styles.sectionTitle}>What&apos;s your vibe?</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.promptInput}
              placeholder="e.g., Upbeat Afrobeats for a sunset workout session..."
              placeholderTextColor="#666"
              value={prompt}
              onChangeText={setPrompt}
              multiline
              numberOfLines={3}
              testID="mixmind-prompt-input"
            />
            {prompt.length > 0 && (
              <TouchableOpacity
                style={styles.favoriteButton}
                onPress={() => addFavoritePrompt(prompt)}
                testID="mixmind-favorite-prompt"
              >
                <Heart size={20} color="#FF0080" />
              </TouchableOpacity>
            )}
          </View>
          
          {/* DJ Style Input */}
          <View style={styles.djStyleSection}>
            <Text style={styles.sectionTitleSmall}>DJ Style (Optional)</Text>
            <TextInput
              style={styles.djStyleInput}
              placeholder="e.g., like Black Coffee (deep, smooth transitions)"
              placeholderTextColor="#666"
              value={djStyle}
              onChangeText={setDjStyle}
              testID="mixmind-style-input"
            />
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.suggestionRow}>
              {djStyleExamples.map((style, idx) => (
                <TouchableOpacity
                  key={`dj-${idx}`}
                  style={styles.suggestionChip}
                  onPress={() => {
                    const sanitized = style.trim();
                    if (sanitized && sanitized.length <= 200) {
                      setDjStyle(sanitized);
                    }
                  }}
                  testID={`mixmind-style-chip-${idx}`}
                >
                  <Text style={styles.suggestionText}>{style}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>

        {/* Mood Selection */}
        <View style={styles.moodSection}>
          <Text style={styles.sectionTitle}>Choose a Mood</Text>
          <View style={styles.moodGrid}>
            {presetMoods.map((mood) => (
              <TouchableOpacity
                key={mood.id}
                style={[styles.moodCard, selectedMood === mood.id && styles.moodCardActive]}
                onPress={() => setSelectedMood(selectedMood === mood.id ? null : mood.id)}
                testID={`mixmind-mood-${mood.id}`}
              >
                <LinearGradient
                  colors={selectedMood === mood.id ? mood.gradient : ["transparent", "transparent"]}
                  style={styles.moodGradient}
                >
                  <Text style={styles.moodEmoji}>{mood.emoji}</Text>
                  <Text style={[styles.moodLabel, selectedMood === mood.id && styles.moodLabelActive]}>
                    {mood.label}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* AI Suggestions */}
        <View style={styles.suggestionsSection}>
          <Text style={styles.sectionTitle}>AI Suggestions</Text>
          {suggestionCategories.slice(0, 3).map((cat) => {
            const items = aiDjPrompts[cat] ?? [];
            if (!items || items.length === 0) return null;
            const title = cat
              .replace(/_/g, " ")
              .replace(/\b\w/g, (m) => m.toUpperCase());
            return (
              <View key={cat} style={styles.suggestionBlock}>
                <Text style={styles.suggestionTitle}>{title}</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.suggestionRow}>
                  {items.slice(0, 5).map((suggestion, idx) => (
                    <TouchableOpacity
                      key={`${cat}-${idx}`}
                      style={styles.suggestionChip}
                      onPress={() => {
                        const text = (suggestion ?? "").toString().trim();
                        if (!text || text.length > 280) return;
                        appendPrompt(text);
                      }}
                      testID={`mixmind-chip-${cat}-${idx}`}
                    >
                      <Text style={styles.suggestionText}>{suggestion}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            );
          })}
        </View>

        {/* Generate Button */}
        <TouchableOpacity
          style={[styles.generateButton, isGenerating && styles.generateButtonDisabled]}
          onPress={handleGenerate}
          disabled={isGenerating || (!prompt && !selectedMood && !djStyle)}
          testID="mixmind-generate"
        >
          {isGenerating ? (
            <>
              <ActivityIndicator color="#FFF" />
              <Text style={styles.generateButtonText}>Creating Your Mix...</Text>
            </>
          ) : (
            <>
              <Zap size={20} color="#FFF" />
              <Text style={styles.generateButtonText}>Generate Mix</Text>
            </>
          )}
        </TouchableOpacity>

        {/* Generated Set Results */}
        {currentSet && (
          <View style={styles.resultSection} testID="mixmind-result">
            <View style={styles.resultHeader}>
              <View style={styles.resultTitleContainer}>
                <Text style={styles.resultTitle}>{currentSet.title}</Text>
                <View style={styles.resultMeta}>
                  <View style={styles.metaItem}>
                    <Clock size={14} color="#999" />
                    <Text style={styles.metaText}>
                      {Math.round(currentSet.totalDuration / 60)}min
                    </Text>
                  </View>
                  <View style={styles.metaItem}>
                    <BarChart3 size={14} color="#999" />
                    <Text style={styles.metaText}>
                      {Math.round(currentSet.averageEnergy * 100)}% Energy
                    </Text>
                  </View>
                  <View style={styles.metaItem}>
                    <Music size={14} color="#999" />
                    <Text style={styles.metaText}>
                      {currentSet.tracks.length} Tracks
                    </Text>
                  </View>
                </View>
              </View>
            </View>
            
            <Text style={styles.resultDescription}>{currentSet.description}</Text>

            <View style={styles.trackList}>
              {currentSet.tracks.slice(0, 6).map((track, index) => (
                <View key={track.id} style={styles.trackItem}>
                  <Text style={styles.trackNumber}>{index + 1}</Text>
                  <Image source={{ uri: track.artwork }} style={styles.trackImage} />
                  <View style={styles.trackInfo}>
                    <Text style={styles.trackTitle} numberOfLines={1}>{track.title}</Text>
                    <Text style={styles.trackArtist} numberOfLines={1}>{track.artist}</Text>
                    <View style={styles.trackMeta}>
                      {track.bpm && (
                        <Text style={styles.trackMetaText}>{track.bpm} BPM</Text>
                      )}
                      {track.key && (
                        <Text style={styles.trackMetaText}>{track.key}</Text>
                      )}
                      {track.genre && (
                        <Text style={styles.trackMetaText}>{track.genre}</Text>
                      )}
                    </View>
                  </View>
                  {track.duration && (
                    <Text style={styles.trackDuration}>
                      {formatDuration(track.duration)}
                    </Text>
                  )}
                </View>
              ))}
              {currentSet.tracks.length > 6 && (
                <Text style={styles.moreTracksText}>
                  +{currentSet.tracks.length - 6} more tracks
                </Text>
              )}
            </View>

            <View style={styles.actionButtons}>
              <TouchableOpacity 
                style={styles.playButton} 
                onPress={handlePlaySet} 
                testID="mixmind-play"
              >
                <Play size={20} color="#000" fill="#000" />
                <Text style={styles.playButtonText}>Play Mix</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.regenerateButton} 
                onPress={handleGenerate} 
                testID="mixmind-regenerate"
              >
                <RefreshCw size={20} color="#FFF" />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Advanced Settings Button */}
        <TouchableOpacity 
          style={styles.advancedButton} 
          onPress={() => router.push("/ai-dj-setup")}
          testID="mixmind-advanced"
        >
          <Settings size={20} color="#999" />
          <Text style={styles.advancedButtonText}>Advanced Settings</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A0A0A",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: "#999",
  },
  headerStats: {
    flexDirection: "row",
    gap: 16,
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FF0080",
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
  },
  heroCard: {
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    marginBottom: 24,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#FFF",
    marginTop: 16,
    marginBottom: 12,
    textAlign: "center",
  },
  heroDescription: {
    fontSize: 15,
    color: "#FFF",
    textAlign: "center",
    opacity: 0.9,
    lineHeight: 22,
    marginBottom: 20,
  },
  heroFeatures: {
    flexDirection: "row",
    gap: 20,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  featureText: {
    fontSize: 12,
    color: "#FFF",
    fontWeight: "600",
  },
  quickActionsSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  quickActionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  quickActionCard: {
    width: "48%",
    backgroundColor: "#1A1A1A",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#2A2A2A",
  },
  quickActionLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFF",
    marginTop: 8,
  },
  recentSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  recentPromptChip: {
    backgroundColor: "#1A1A1A",
    borderRadius: 12,
    padding: 12,
    marginRight: 12,
    maxWidth: 200,
    borderWidth: 1,
    borderColor: "#FF0080",
  },
  recentPromptText: {
    fontSize: 13,
    color: "#FF0080",
    fontWeight: "500",
  },
  promptSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFF",
    marginBottom: 16,
  },
  sectionTitleSmall: {
    fontSize: 14,
    fontWeight: "600",
    color: "#AAA",
    marginBottom: 8,
  },
  inputContainer: {
    position: "relative",
  },
  promptInput: {
    backgroundColor: "#1A1A1A",
    borderRadius: 16,
    padding: 20,
    fontSize: 16,
    color: "#FFF",
    minHeight: 100,
    textAlignVertical: "top",
    borderWidth: 1,
    borderColor: "#2A2A2A",
  },
  favoriteButton: {
    position: "absolute",
    top: 16,
    right: 16,
    padding: 8,
  },
  djStyleSection: {
    marginTop: 20,
  },
  djStyleInput: {
    backgroundColor: "#1A1A1A",
    borderRadius: 12,
    padding: 16,
    fontSize: 14,
    color: "#FFF",
    borderWidth: 1,
    borderColor: "#2A2A2A",
    marginBottom: 12,
  },
  suggestionRow: {
    flexGrow: 0,
  },
  suggestionChip: {
    backgroundColor: "#151515",
    borderWidth: 1,
    borderColor: "#2A2A2A",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    marginRight: 8,
  },
  suggestionText: {
    color: "#DDD",
    fontSize: 13,
  },
  moodSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  moodGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  moodCard: {
    width: "31%",
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "transparent",
  },
  moodCardActive: {
    borderColor: "#FF0080",
  },
  moodGradient: {
    padding: 16,
    alignItems: "center",
    backgroundColor: "#1A1A1A",
  },
  moodEmoji: {
    fontSize: 28,
    marginBottom: 8,
  },
  moodLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#999",
  },
  moodLabelActive: {
    color: "#FFF",
  },
  suggestionsSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  suggestionBlock: {
    marginBottom: 20,
  },
  suggestionTitle: {
    color: "#AAA",
    fontSize: 14,
    marginBottom: 12,
    fontWeight: "600",
  },
  generateButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FF0080",
    marginHorizontal: 20,
    borderRadius: 16,
    paddingVertical: 18,
    marginBottom: 24,
    gap: 8,
  },
  generateButtonDisabled: {
    opacity: 0.5,
  },
  generateButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFF",
  },
  resultSection: {
    backgroundColor: "#1A1A1A",
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#2A2A2A",
  },
  resultHeader: {
    marginBottom: 16,
  },
  resultTitleContainer: {
    marginBottom: 12,
  },
  resultTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#FFF",
    marginBottom: 8,
  },
  resultMeta: {
    flexDirection: "row",
    gap: 16,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: "#999",
  },
  resultDescription: {
    fontSize: 14,
    color: "#AAA",
    marginBottom: 24,
    lineHeight: 20,
  },
  trackList: {
    marginBottom: 24,
  },
  trackItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 12,
  },
  trackNumber: {
    fontSize: 14,
    color: "#666",
    width: 20,
    textAlign: "center",
  },
  trackImage: {
    width: 48,
    height: 48,
    borderRadius: 8,
  },
  trackInfo: {
    flex: 1,
  },
  trackTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#FFF",
    marginBottom: 4,
  },
  trackArtist: {
    fontSize: 13,
    color: "#999",
    marginBottom: 4,
  },
  trackMeta: {
    flexDirection: "row",
    gap: 8,
  },
  trackMetaText: {
    fontSize: 11,
    color: "#666",
    backgroundColor: "#2A2A2A",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  trackDuration: {
    fontSize: 12,
    color: "#666",
  },
  moreTracksText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    fontStyle: "italic",
    marginTop: 8,
  },
  actionButtons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  playButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF",
    borderRadius: 24,
    paddingVertical: 14,
    gap: 8,
  },
  playButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000",
  },
  regenerateButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#333",
    justifyContent: "center",
    alignItems: "center",
  },
  advancedButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    marginBottom: 120,
    gap: 8,
  },
  advancedButtonText: {
    fontSize: 14,
    color: "#999",
  },
});