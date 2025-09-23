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
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Sparkles, Play, RefreshCw, Settings } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { usePlayer } from "@/contexts/PlayerContext";
import { aiDjPrompts, type AIDJPromptCategoryKey } from "@/data/aiDjPrompts";

interface GeneratedTrack {
  id: string;
  title: string;
  artist: string;
  artwork: string;
}

interface GeneratedSet {
  title: string;
  description: string;
  tracks: GeneratedTrack[];
}

const presetMoods = [
  { id: "energetic", label: "Energetic", emoji: "⚡" },
  { id: "chill", label: "Chill", emoji: "😌" },
  { id: "focus", label: "Focus", emoji: "🎯" },
  { id: "party", label: "Party", emoji: "🎉" },
  { id: "romantic", label: "Romantic", emoji: "💕" },
  { id: "workout", label: "Workout", emoji: "💪" },
] as const;

export default function AIDJScreen() {
  const [prompt, setPrompt] = useState<string>("");
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedSet, setGeneratedSet] = useState<GeneratedSet | null>(null);
  const { playTrack } = usePlayer();

  const suggestionCategories = useMemo(() => Object.keys(aiDjPrompts) as AIDJPromptCategoryKey[], []);

  const handleGenerate = useCallback(async () => {
    try {
      if (!prompt && !selectedMood) return;
      console.log("[AI-DJ] Generating with", { prompt, selectedMood });
      setIsGenerating(true);
      setTimeout(() => {
        const titleBase = selectedMood ? `${presetMoods.find((m) => m.id === selectedMood)?.label ?? "AI"} Mix` : "Custom AI Mix";
        const newSet: GeneratedSet = {
          title: titleBase,
          description: prompt || `Perfect for your ${selectedMood ?? "custom"} vibe` ,
          tracks: [
            { id: "ai-1", title: "Electric Dreams", artist: "Synthwave Collective", artwork: "https://picsum.photos/400/400?random=101" },
            { id: "ai-2", title: "Neon Nights", artist: "Digital Pulse", artwork: "https://picsum.photos/400/400?random=102" },
            { id: "ai-3", title: "Future Echoes", artist: "Cyber Symphony", artwork: "https://picsum.photos/400/400?random=103" },
          ],
        };
        setGeneratedSet(newSet);
        console.log("[AI-DJ] Generated set", newSet);
        setIsGenerating(false);
      }, 900);
    } catch (e) {
      console.error("[AI-DJ] Generation error", e);
      setIsGenerating(false);
    }
  }, [prompt, selectedMood]);

  const handlePlaySet = useCallback(() => {
    if (generatedSet && generatedSet.tracks.length > 0) {
      console.log("[AI-DJ] Playing first track of set", generatedSet.tracks[0]);
      playTrack(generatedSet.tracks[0] as unknown as any);
    }
  }, [generatedSet, playTrack]);

  const appendPrompt = useCallback((text: string) => {
    setPrompt((p) => (p ? `${p}\n${text}` : text));
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title} testID="ai-dj-title">AI DJ</Text>
          <Text style={styles.subtitle} testID="ai-dj-subtitle">Let AI create the perfect mix for you</Text>
        </View>

        <LinearGradient
          colors={["#FF0080", "#8B5CF6"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.aiCard}
        >
          <Sparkles size={48} color="#FFF" />
          <Text style={styles.aiTitle}>Intelligent Music Curation</Text>
          <Text style={styles.aiDescription}>
            Describe your mood, activity, or music preference and let our AI DJ create a personalized set just for you
          </Text>
        </LinearGradient>

        <View style={styles.promptSection}>
          <Text style={styles.sectionTitle}>Whats your vibe?</Text>
          <TextInput
            style={styles.promptInput}
            placeholder="e.g., Upbeat songs for a morning run..."
            placeholderTextColor="#666"
            value={prompt}
            onChangeText={setPrompt}
            multiline
            numberOfLines={3}
            testID="ai-dj-prompt-input"
          />
        </View>

        <View style={styles.suggestionsSection}>
          {suggestionCategories.map((cat) => {
            const items = aiDjPrompts[cat] ?? [];
            if (!items || items.length === 0) return null;
            const title = cat
              .replace(/_/g, " ")
              .replace(/\b\w/g, (m) => m.toUpperCase());
            return (
              <View key={cat} style={styles.suggestionBlock}>
                <Text style={styles.suggestionTitle}>{title}</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.suggestionRow}>
                  {items.map((s, idx) => (
                    <TouchableOpacity
                      key={`${cat}-${idx}`}
                      style={styles.suggestionChip}
                      onPress={() => {
                        const text = (s ?? "").toString().trim();
                        if (!text) return;
                        if (text.length > 280) return;
                        appendPrompt(text);
                      }}
                      testID={`ai-dj-chip-${cat}-${idx}`}
                    >
                      <Text style={styles.suggestionText}>{s}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            );
          })}
        </View>

        <View style={styles.moodSection}>
          <Text style={styles.sectionTitle}>Or choose a mood</Text>
          <View style={styles.moodGrid}>
            {presetMoods.map((mood) => (
              <TouchableOpacity
                key={mood.id}
                style={[styles.moodCard, selectedMood === mood.id && styles.moodCardActive]}
                onPress={() => setSelectedMood(mood.id)}
                testID={`ai-dj-mood-${mood.id}`}
              >
                <Text style={styles.moodEmoji}>{mood.emoji}</Text>
                <Text style={[styles.moodLabel, selectedMood === mood.id && styles.moodLabelActive]}>
                  {mood.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity
          style={[styles.generateButton, isGenerating && styles.generateButtonDisabled]}
          onPress={handleGenerate}
          disabled={isGenerating || (!prompt && !selectedMood)}
          testID="ai-dj-generate"
        >
          {isGenerating ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <>
              <Sparkles size={20} color="#FFF" />
              <Text style={styles.generateButtonText}>Generate Mix</Text>
            </>
          )}
        </TouchableOpacity>

        {generatedSet && (
          <View style={styles.resultSection} testID="ai-dj-result">
            <Text style={styles.resultTitle}>{generatedSet.title}</Text>
            <Text style={styles.resultDescription}>{generatedSet.description}</Text>

            <View style={styles.trackList}>
              {generatedSet.tracks.map((track, index) => (
                <View key={track.id} style={styles.trackItem}>
                  <Text style={styles.trackNumber}>{index + 1}</Text>
                  <Image source={{ uri: track.artwork }} style={styles.trackImage} />
                  <View style={styles.trackInfo}>
                    <Text style={styles.trackTitle}>{track.title}</Text>
                    <Text style={styles.trackArtist}>{track.artist}</Text>
                  </View>
                </View>
              ))}
            </View>

            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.playButton} onPress={handlePlaySet} testID="ai-dj-play">
                <Play size={20} color="#000" fill="#FFF" />
                <Text style={styles.playButtonText}>Play Mix</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.regenerateButton} onPress={handleGenerate} testID="ai-dj-regenerate">
                <RefreshCw size={20} color="#FFF" />
              </TouchableOpacity>
            </View>
          </View>
        )}

        <TouchableOpacity style={styles.advancedButton} onPress={() => router.push("/ai-dj-setup")}
          testID="ai-dj-advanced"
        >
          <Settings size={20} color="#999" />
          <Text style={styles.advancedButtonText}>Advanced Settings</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A0A0A",
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#999",
  },
  aiCard: {
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    marginBottom: 24,
  },
  aiTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFF",
    marginTop: 16,
    marginBottom: 8,
  },
  aiDescription: {
    fontSize: 14,
    color: "#FFF",
    textAlign: "center",
    opacity: 0.9,
    lineHeight: 20,
  },
  promptSection: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFF",
    marginBottom: 12,
  },
  promptInput: {
    backgroundColor: "#1A1A1A",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: "#FFF",
    minHeight: 80,
    textAlignVertical: "top",
  },
  suggestionsSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  suggestionBlock: {
    marginBottom: 16,
  },
  suggestionTitle: {
    color: "#AAA",
    fontSize: 13,
    marginBottom: 8,
    fontWeight: "600",
  },
  suggestionRow: {
    flexGrow: 0,
  },
  suggestionChip: {
    backgroundColor: "#151515",
    borderWidth: 1,
    borderColor: "#2A2A2A",
    paddingVertical: 10,
    paddingHorizontal: 12,
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
    justifyContent: "space-between",
  },
  moodCard: {
    width: "31%",
    backgroundColor: "#1A1A1A",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "transparent",
  },
  moodCardActive: {
    borderColor: "#FF0080",
    backgroundColor: "rgba(255, 0, 128, 0.1)",
  },
  moodEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  moodLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#999",
  },
  moodLabelActive: {
    color: "#FF0080",
  },
  generateButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FF0080",
    marginHorizontal: 20,
    borderRadius: 12,
    paddingVertical: 16,
    marginBottom: 24,
  },
  generateButtonDisabled: {
    opacity: 0.5,
  },
  generateButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFF",
    marginLeft: 8,
  },
  resultSection: {
    backgroundColor: "#1A1A1A",
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFF",
    marginBottom: 8,
  },
  resultDescription: {
    fontSize: 14,
    color: "#999",
    marginBottom: 20,
  },
  trackList: {
    marginBottom: 20,
  },
  trackItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  trackNumber: {
    fontSize: 14,
    color: "#666",
    width: 24,
  },
  trackImage: {
    width: 40,
    height: 40,
    borderRadius: 6,
    marginRight: 12,
  },
  trackInfo: {
    flex: 1,
  },
  trackTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFF",
    marginBottom: 2,
  },
  trackArtist: {
    fontSize: 12,
    color: "#999",
  },
  actionButtons: {
    flexDirection: "row",
    alignItems: "center",
  },
  playButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF",
    borderRadius: 24,
    paddingVertical: 12,
    marginRight: 12,
  },
  playButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000",
    marginLeft: 8,
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
  },
  advancedButtonText: {
    fontSize: 14,
    color: "#999",
    marginLeft: 8,
  },
});
