import React, { useCallback, useState } from "react";
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
import { useSafeAreaInsets } from "react-native-safe-area-context";
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
  Shuffle,
  BarChart3,
  Share2,
  Download,
  StopCircle,
  Volume2,
} from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { usePlayer } from "@/contexts/PlayerContext";
import { useMixMind } from "@/contexts/MixMindContext";


const presetMoods = [
  { id: "energetic", label: "Energetic", emoji: "⚡", gradient: ["#FF6B6B", "#FF8E53"] },
  { id: "chill", label: "Chill", emoji: "😌", gradient: ["#4ECDC4", "#44A08D"] },
  { id: "focus", label: "Focus", emoji: "🎯", gradient: ["#667eea", "#764ba2"] },
  { id: "party", label: "Party", emoji: "🎉", gradient: ["#f093fb", "#f5576c"] },
  { id: "romantic", label: "Romantic", emoji: "💕", gradient: ["#ffecd2", "#fcb69f"] },
  { id: "workout", label: "Workout", emoji: "💪", gradient: ["#FF0080", "#7928CA"] },
] as const;



export default function MixMindScreen() {
  // Always call hooks in the same order - no conditional hooks
  const insets = useSafeAreaInsets();
  const [prompt, setPrompt] = useState<string>("");
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const { playTrack } = usePlayer();
  
  // Get MixMind context
  const { 
    currentSet, 
    isGenerating, 
    history, 
    generateSet, 
    addFavoritePrompt,
    settings,
    isRecording,
    startVoiceInput,
    stopVoiceInput,
  } = useMixMind();

  const buildPrompt = useCallback(() => {
    const moodText = selectedMood ? `${presetMoods.find((m) => m.id === selectedMood)?.label ?? ""} mood` : "";
    const base = [prompt, moodText].filter(Boolean).join(". ");
    return base.trim();
  }, [prompt, selectedMood]);
  


  const handleGenerate = useCallback(async () => {
    try {
      if (!prompt && !selectedMood) return;
      
      const finalPrompt = buildPrompt();
      console.log("[MixMind] Generating with", { prompt: finalPrompt, settings });
      
      const result = await generateSet(finalPrompt);
      if (!result) {
        console.log("Couldn't generate your mix right now. Please try again.");
      }
    } catch (error) {
      console.error("[MixMind] Generation error", error);
    }
  }, [prompt, selectedMood, buildPrompt, generateSet, settings]);

  const handlePlaySet = useCallback(() => {
    if (currentSet && currentSet.tracks.length > 0) {
      console.log("[MixMind] Playing first track of set", currentSet.tracks[0]);
      playTrack(currentSet.tracks[0] as unknown as any);
    }
  }, [currentSet, playTrack]);

  const handleQuickAction = useCallback(async (actionId: string) => {
    try {
      switch (actionId) {
        case "voice":
          if (isRecording) {
            const transcript = await stopVoiceInput();
            if (transcript) {
              setPrompt(transcript);
            }
          } else {
            await startVoiceInput();
          }
          break;
        case "shuffle":
          setPrompt("Surprise me with something amazing");
          setSelectedMood(presetMoods[Math.floor(Math.random() * presetMoods.length)].id);
          break;
        case "history":
          router.push("/mixmind-history");
          break;
        case "settings":
          router.push("/ai-dj-setup");
          break;
      }
    } catch (error) {
      console.error('[MixMind] Quick action error:', error);
    }
  }, [isRecording, stopVoiceInput, startVoiceInput]);

  const handleShare = useCallback(() => {
    if (currentSet) {
      console.log('[MixMind] Sharing set:', currentSet.title);
      // In a real app, this would open a share dialog
    }
  }, [currentSet]);

  const handleDownload = useCallback(() => {
    if (currentSet) {
      console.log('[MixMind] Downloading set:', currentSet.title);
      // In a real app, this would start a download
    }
  }, [currentSet]);



  const formatDuration = useCallback((seconds: number) => {
    if (!seconds || seconds < 0) return '0:00';
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

        {/* Simplified Hero Card */}
        <LinearGradient
          colors={["#FF0080", "#8B5CF6"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroCard}
        >
          <Sparkles size={48} color="#FFF" />
          <Text style={styles.heroTitle}>AI Music Curator</Text>
          <Text style={styles.heroDescription}>
            Tell me what you want to hear, and I&apos;ll create the perfect mix for you.
          </Text>
        </LinearGradient>

        {/* Voice Input Button */}
        <View style={styles.voiceSection}>
          <TouchableOpacity
            style={[
              styles.voiceButton,
              isRecording && styles.voiceButtonActive
            ]}
            onPress={() => handleQuickAction('voice')}
            testID="mixmind-voice-button"
          >
            {isRecording ? (
              <>
                <StopCircle size={32} color="#FFF" />
                <Text style={styles.voiceButtonText}>Stop Recording</Text>
                <Text style={styles.voiceButtonSubtext}>Tap to finish</Text>
              </>
            ) : (
              <>
                <Mic size={32} color="#FFF" />
                <Text style={styles.voiceButtonText}>Voice Prompt</Text>
                <Text style={styles.voiceButtonSubtext}>Tap and speak</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsSection}>
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity
              style={styles.quickActionCard}
              onPress={() => handleQuickAction('shuffle')}
              testID="mixmind-quick-shuffle"
            >
              <Shuffle size={24} color="#4ECDC4" />
              <Text style={styles.quickActionLabel}>Surprise Me</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.quickActionCard}
              onPress={() => handleQuickAction('history')}
              testID="mixmind-quick-history"
            >
              <History size={24} color="#667eea" />
              <Text style={styles.quickActionLabel}>History</Text>
            </TouchableOpacity>
          </View>
        </View>

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

        {/* Quick Suggestions */}
        <View style={styles.suggestionsSection}>
          <Text style={styles.sectionTitle}>Quick Ideas</Text>
          <View style={styles.suggestionGrid}>
            {[
              "Energetic workout mix",
              "Chill study vibes",
              "Party dance hits",
              "Romantic dinner music",
              "Focus deep work",
              "Road trip classics"
            ].map((suggestion, index) => {
              const sanitizedSuggestion = suggestion.trim();
              if (!sanitizedSuggestion || sanitizedSuggestion.length > 100) return null;
              
              return (
                <TouchableOpacity
                  key={`suggestion-${sanitizedSuggestion.slice(0, 10)}`}
                  style={styles.suggestionChip}
                  onPress={() => setPrompt(sanitizedSuggestion)}
                  testID={`mixmind-suggestion-${index}`}
                >
                  <Text style={styles.suggestionText}>{sanitizedSuggestion}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Generate Button */}
        <TouchableOpacity
          style={[styles.generateButton, isGenerating && styles.generateButtonDisabled]}
          onPress={handleGenerate}
          disabled={isGenerating || (!prompt && !selectedMood)}
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
                  <View style={styles.metaItem}>
                    <Volume2 size={14} color="#999" />
                    <Text style={styles.metaText}>
                      {Math.round(currentSet.averageBPM)} BPM
                    </Text>
                  </View>
                </View>
              </View>
              <TouchableOpacity 
                style={styles.likeButton}
                onPress={() => console.log('Like set')}
                testID="mixmind-like"
              >
                <Heart 
                  size={20} 
                  color={history.likedSets.includes(currentSet.id) ? "#FF0080" : "#666"}
                  fill={history.likedSets.includes(currentSet.id) ? "#FF0080" : "transparent"}
                />
              </TouchableOpacity>
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
                style={styles.actionButton} 
                onPress={handleShare}
                testID="mixmind-share"
              >
                <Share2 size={18} color="#8B5CF6" />
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.actionButton} 
                onPress={handleDownload}
                testID="mixmind-export"
              >
                <Download size={18} color="#00D4AA" />
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

        {/* Settings Button */}
        <TouchableOpacity 
          style={styles.settingsButton} 
          onPress={() => router.push("/ai-dj-setup")}
          testID="mixmind-settings"
        >
          <Settings size={18} color="#666" />
          <Text style={styles.settingsButtonText}>Settings</Text>
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
    position: "relative",
  },
  quickActionCardActive: {
    backgroundColor: "#2A1A2A",
    borderColor: "#FF0080",
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
  likeButton: {
    padding: 8,
  },
  actionButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#2A2A2A",
    justifyContent: "center",
    alignItems: "center",
  },
  voiceSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
    alignItems: "center",
  },
  voiceButton: {
    backgroundColor: "#FF0080",
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 32,
    alignItems: "center",
    minWidth: 200,
  },
  voiceButtonActive: {
    backgroundColor: "#FF4081",
  },
  voiceButtonText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFF",
    marginTop: 8,
  },
  voiceButtonSubtext: {
    fontSize: 14,
    color: "#FFF",
    opacity: 0.8,
    marginTop: 4,
  },
  suggestionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  settingsButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    marginBottom: 120,
    gap: 8,
  },
  settingsButtonText: {
    fontSize: 14,
    color: "#666",
  },
});