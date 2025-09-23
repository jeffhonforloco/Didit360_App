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
  Alert,
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

interface AITrackResponse {
  id?: string;
  title?: string;
  artist?: string;
  artwork?: string;
}

interface AISetResponse {
  title?: string;
  description?: string;
  tracks?: AITrackResponse[];
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
  const [djStyle, setDjStyle] = useState<string>("");
  const { playTrack } = usePlayer();

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

  const callAIForSet = useCallback(async (): Promise<GeneratedSet | null> => {
    try {
      const finalPrompt = buildPrompt();
      console.log("[AI-DJ] callAIForSet prompt:", finalPrompt);
      const res = await fetch("https://toolkit.rork.com/text/llm/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content:
                "You are an expert DJ and music programmer. Return a tight JSON only. Include 8 tracks matching the vibe. Prefer clean titles. Schema: {title, description, tracks:[{title, artist, artwork}]}.",
            },
            {
              role: "user",
              content: `Create a DJ playlist with smooth transitions. ${finalPrompt}. Output JSON only. Use royalty-free placeholder artwork URLs from picsum.photos with different random params.`,
            },
          ],
        }),
      });

      if (!res.ok) {
        console.log("[AI-DJ] AI http error", res.status);
        return null;
      }
      const data = (await res.json()) as { completion?: string };
      const text = data?.completion ?? "";
      let parsed: AISetResponse | null = null;
      try {
        const jsonStart = text.indexOf("{");
        const jsonEnd = text.lastIndexOf("}");
        const jsonStr = jsonStart >= 0 && jsonEnd > jsonStart ? text.slice(jsonStart, jsonEnd + 1) : text;
        parsed = JSON.parse(jsonStr) as AISetResponse;
      } catch (e) {
        console.log("[AI-DJ] JSON parse error", e, text);
        return null;
      }

      const tracks: GeneratedTrack[] = (parsed?.tracks ?? []).slice(0, 10).map((t, i) => ({
        id: t?.id ?? `ai-${i + 1}`,
        title: t?.title ?? `Untitled ${i + 1}`,
        artist: t?.artist ?? "Unknown Artist",
        artwork:
          t?.artwork ?? `https://picsum.photos/400/400?random=${100 + i}&grayscale=0`,
      }));

      if (tracks.length === 0) return null;

      const set: GeneratedSet = {
        title: (parsed?.title ?? "AI Mix").toString(),
        description: (parsed?.description ?? finalPrompt).toString(),
        tracks,
      };
      return set;
    } catch (e) {
      console.log("[AI-DJ] callAIForSet error", e);
      return null;
    }
  }, [buildPrompt]);

  const handleGenerate = useCallback(async () => {
    try {
      if (!prompt && !selectedMood && !djStyle) return;
      console.log("[AI-DJ] Generating with", { prompt, selectedMood, djStyle });
      setIsGenerating(true);
      const aiSet = await callAIForSet();
      if (aiSet) {
        setGeneratedSet(aiSet);
        console.log("[AI-DJ] Generated set (AI)", aiSet);
      } else {
        const titleBase = selectedMood ? `${presetMoods.find((m) => m.id === selectedMood)?.label ?? "AI"} Mix` : "Custom AI Mix";
        const fallback: GeneratedSet = {
          title: titleBase,
          description: buildPrompt() || `Perfect for your ${selectedMood ?? "custom"} vibe` ,
          tracks: [
            { id: "ai-1", title: "Electric Dreams", artist: "Synthwave Collective", artwork: "https://picsum.photos/400/400?random=101" },
            { id: "ai-2", title: "Neon Nights", artist: "Digital Pulse", artwork: "https://picsum.photos/400/400?random=102" },
            { id: "ai-3", title: "Future Echoes", artist: "Cyber Symphony", artwork: "https://picsum.photos/400/400?random=103" },
            { id: "ai-4", title: "Velvet Transitions", artist: "Club Alchemy", artwork: "https://picsum.photos/400/400?random=104" },
            { id: "ai-5", title: "Groove Mosaic", artist: "Night Architects", artwork: "https://picsum.photos/400/400?random=105" },
          ],
        };
        setGeneratedSet(fallback);
        Alert.alert("AI DJ", "Couldn’t reach AI right now. Using a fallback mix.");
      }
      setIsGenerating(false);
    } catch (e) {
      console.error("[AI-DJ] Generation error", e);
      setIsGenerating(false);
    }
  }, [prompt, selectedMood, djStyle, callAIForSet, buildPrompt]);

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
          <Text style={styles.sectionTitle}>What’s your vibe?</Text>
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
          <View style={styles.djRow}>
            <Text style={styles.sectionTitleSmall}>Optional: DJ style</Text>
            <TextInput
              style={styles.promptInput}
              placeholder="e.g., like Black Coffee (deep, smooth transitions)"
              placeholderTextColor="#666"
              value={djStyle}
              onChangeText={setDjStyle}
              testID="ai-dj-style-input"
            />
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.suggestionRow}>
              {djStyleExamples.map((s, idx) => (
                <TouchableOpacity
                  key={`dj-${idx}`}
                  style={styles.suggestionChip}
                  onPress={() => setDjStyle(s)}
                  testID={`ai-dj-style-chip-${idx}`}
                >
                  <Text style={styles.suggestionText}>{s}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
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
          disabled={isGenerating || (!prompt && !selectedMood && !djStyle)}
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
  sectionTitleSmall: {
    fontSize: 14,
    fontWeight: "600",
    color: "#AAA",
    marginBottom: 8,
  },
  djRow: {
    marginTop: 12,
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
