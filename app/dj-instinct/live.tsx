import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  TextInput,
  FlatList,
  Image,
  Switch,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import {
  ArrowLeft,
  Headphones,
  Play,
  Pause,
  AlertTriangle,
  QrCode,
  Save,
  Settings,
  Volume2,
  Zap,
  Shield,
  Cast,
  FileText,
} from "lucide-react-native";
import { router } from "expo-router";
import { useDJInstinct, type TransitionStyle, type Mood, type ExplicitFilter } from "@/contexts/DJInstinctContext";
import { usePlayer } from "@/contexts/PlayerContext";
import type { Track } from "@/types";

const TRANSITION_OPTIONS: { value: TransitionStyle; label: string }[] = [
  { value: "fade", label: "Fade" },
  { value: "echo", label: "Echo" },
  { value: "cut", label: "Cut" },
  { value: "drop", label: "Drop" },
];

const MOOD_OPTIONS: { value: Mood; label: string; emoji: string }[] = [
  { value: "chill", label: "Chill", emoji: "😌" },
  { value: "groove", label: "Groove", emoji: "🎵" },
  { value: "hype", label: "Hype", emoji: "🔥" },
  { value: "ecstatic", label: "Ecstatic", emoji: "🚀" },
];

const EXPLICIT_OPTIONS: { value: ExplicitFilter; label: string }[] = [
  { value: "off", label: "Off" },
  { value: "moderate", label: "Moderate" },
  { value: "strict", label: "Strict" },
];

export default function LiveDJScreen() {
  const { currentTrack, isPlaying, togglePlayPause } = usePlayer();
  const {
    liveDJ,
    setLiveDJPromptConfig,
    setLiveDJParams,
    setLiveDJSafeMode,
    startLiveDJ,
    updateLiveDJParams,
    startPairing,
    emergencyFade,
    saveLiveMix,
  } = useDJInstinct();

  const [showRecapModal, setShowRecapModal] = useState(false);
  const [genreInput, setGenreInput] = useState("");
  const [noPlayInput, setNoPlayInput] = useState("");

  const handleVibeChange = (vibe: string) => {
    setLiveDJPromptConfig({ vibe });
  };

  const handleEnergyChange = (energy: number) => {
    setLiveDJParams({ energy });
    updateLiveDJParams();
  };

  const handleTransitionChange = (transitionStyle: TransitionStyle) => {
    setLiveDJParams({ transitionStyle });
    updateLiveDJParams();
  };

  const handleMoodChange = (mood: Mood) => {
    setLiveDJPromptConfig({ mood });
  };

  const handleExplicitFilterChange = (explicitFilter: ExplicitFilter) => {
    setLiveDJPromptConfig({ explicitFilter });
  };

  const handleDurationChange = (durationMinutes: number) => {
    setLiveDJPromptConfig({ durationMinutes });
  };

  const addGenre = () => {
    if (genreInput.trim()) {
      const newGenres = [...liveDJ.promptConfig.genres, genreInput.trim()];
      setLiveDJPromptConfig({ genres: newGenres });
      setGenreInput("");
    }
  };

  const removeGenre = (index: number) => {
    const newGenres = liveDJ.promptConfig.genres.filter((_, i) => i !== index);
    setLiveDJPromptConfig({ genres: newGenres });
  };

  const addNoPlay = () => {
    if (noPlayInput.trim()) {
      const newNoPlay = [...liveDJ.promptConfig.doNotPlay, noPlayInput.trim()];
      setLiveDJPromptConfig({ doNotPlay: newNoPlay });
      setNoPlayInput("");
    }
  };

  const removeNoPlay = (index: number) => {
    const newNoPlay = liveDJ.promptConfig.doNotPlay.filter((_, i) => i !== index);
    setLiveDJPromptConfig({ doNotPlay: newNoPlay });
  };

  const renderTrackItem = ({ item }: { item: Track }) => (
    <View style={styles.trackItem}>
      <Image source={{ uri: item.artwork }} style={styles.trackImage} />
      <View style={styles.trackInfo}>
        <Text style={styles.trackTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.trackArtist} numberOfLines={1}>
          {item.artist} • {item.duration || "3:45"}
        </Text>
      </View>
      <Text style={styles.trackBPM}>128 BPM</Text>
    </View>
  );

  const getCastStatusColor = () => {
    switch (liveDJ.castStatus) {
      case "casting": return "#00FF88";
      case "pairing": return "#FF6B35";
      case "error": return "#FF4444";
      default: return "#666";
    }
  };

  const getCastStatusText = () => {
    switch (liveDJ.castStatus) {
      case "casting": return "Live";
      case "pairing": return "Pairing...";
      case "error": return "Error";
      default: return "Offline";
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#1A1A1A", "#0A0A0A"]}
        style={styles.gradient}
      >
        <SafeAreaView style={styles.safeArea} edges={["top"]}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.canGoBack() ? router.back() : router.replace('/dj-instinct')}>
              <ArrowLeft size={28} color="#FFF" />
            </TouchableOpacity>
            <View style={styles.headerTitle}>
              <Headphones size={24} color="#FF6B35" />
              <Text style={styles.title}>Live DJ</Text>
            </View>
            <View style={styles.castStatus}>
              <View style={[styles.castDot, { backgroundColor: getCastStatusColor() }]} />
              <Text style={[styles.castText, { color: getCastStatusColor() }]}>
                {getCastStatusText()}
              </Text>
            </View>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* Subtitle */}
            <Text style={styles.subtitle}>Professional event mixing</Text>

            {/* Prompt Configuration */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Set Configuration</Text>
              
              {/* Vibe Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Vibe Description</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="e.g. Afrobeats energy, Sunset house, 90s throwbacks"
                  placeholderTextColor="#666"
                  value={liveDJ.promptConfig.vibe}
                  onChangeText={handleVibeChange}
                  multiline
                />
              </View>

              {/* Genres */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Genres</Text>
                <View style={styles.tagsContainer}>
                  {liveDJ.promptConfig.genres.map((genre, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.tag}
                      onPress={() => removeGenre(index)}
                    >
                      <Text style={styles.tagText}>{genre}</Text>
                      <Text style={styles.tagRemove}>×</Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <View style={styles.addTagContainer}>
                  <TextInput
                    style={styles.tagInput}
                    placeholder="Add genre"
                    placeholderTextColor="#666"
                    value={genreInput}
                    onChangeText={setGenreInput}
                    onSubmitEditing={addGenre}
                  />
                  <TouchableOpacity style={styles.addButton} onPress={addGenre}>
                    <Text style={styles.addButtonText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Mood */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Mood</Text>
                <View style={styles.optionsContainer}>
                  {MOOD_OPTIONS.map((option) => (
                    <TouchableOpacity
                      key={option.value}
                      style={[
                        styles.optionButton,
                        liveDJ.promptConfig.mood === option.value && styles.optionButtonActive,
                      ]}
                      onPress={() => handleMoodChange(option.value)}
                    >
                      <Text style={styles.optionEmoji}>{option.emoji}</Text>
                      <Text
                        style={[
                          styles.optionText,
                          liveDJ.promptConfig.mood === option.value && styles.optionTextActive,
                        ]}
                      >
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Duration */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Duration (minutes)</Text>
                <View style={styles.durationContainer}>
                  {[60, 120, 180, 240].map((duration) => (
                    <TouchableOpacity
                      key={duration}
                      style={[
                        styles.durationButton,
                        liveDJ.promptConfig.durationMinutes === duration && styles.durationButtonActive,
                      ]}
                      onPress={() => handleDurationChange(duration)}
                    >
                      <Text
                        style={[
                          styles.durationText,
                          liveDJ.promptConfig.durationMinutes === duration && styles.durationTextActive,
                        ]}
                      >
                        {duration}m
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>

            {/* Controls */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Live Controls</Text>
              
              {/* Energy Slider */}
              <View style={styles.controlItem}>
                <Text style={styles.controlLabel}>Energy Level</Text>
                <View style={styles.sliderContainer}>
                  <TouchableOpacity
                    style={styles.slider}
                    onPress={(e) => {
                      const { locationX } = e.nativeEvent;
                      const containerWidth = 280;
                      const newEnergy = Math.round((locationX / containerWidth) * 100);
                      handleEnergyChange(Math.max(0, Math.min(100, newEnergy)));
                    }}
                  >
                    <View style={styles.sliderTrack}>
                      <View
                        style={[
                          styles.sliderProgress,
                          { width: `${liveDJ.params.energy}%` },
                        ]}
                      />
                      <View
                        style={[
                          styles.sliderThumb,
                          { left: `${liveDJ.params.energy}%` },
                        ]}
                      />
                    </View>
                  </TouchableOpacity>
                  <Text style={styles.sliderValue}>{liveDJ.params.energy}%</Text>
                </View>
              </View>

              {/* Transition Style */}
              <View style={styles.controlItem}>
                <Text style={styles.controlLabel}>Transition Style</Text>
                <View style={styles.transitionContainer}>
                  {TRANSITION_OPTIONS.map((option) => (
                    <TouchableOpacity
                      key={option.value}
                      style={[
                        styles.transitionOption,
                        liveDJ.params.transitionStyle === option.value && styles.transitionOptionActive,
                      ]}
                      onPress={() => handleTransitionChange(option.value)}
                    >
                      <Text
                        style={[
                          styles.transitionText,
                          liveDJ.params.transitionStyle === option.value && styles.transitionTextActive,
                        ]}
                      >
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Safe Mode Toggle */}
              <View style={styles.controlItem}>
                <View style={styles.toggleContainer}>
                  <View style={styles.toggleInfo}>
                    <Shield size={20} color={liveDJ.safeMode ? "#00FF88" : "#666"} />
                    <Text style={styles.controlLabel}>Safe Mode</Text>
                  </View>
                  <Switch
                    value={liveDJ.safeMode}
                    onValueChange={setLiveDJSafeMode}
                    trackColor={{ false: "#333", true: "#00FF88" }}
                    thumbColor={liveDJ.safeMode ? "#FFF" : "#999"}
                  />
                </View>
                <Text style={styles.toggleDescription}>
                  Enforces explicit content filtering and no-play list
                </Text>
              </View>
            </View>

            {/* Safety Settings */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Safety & Operator Controls</Text>
              
              {/* Explicit Filter */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Explicit Content Filter</Text>
                <View style={styles.optionsContainer}>
                  {EXPLICIT_OPTIONS.map((option) => (
                    <TouchableOpacity
                      key={option.value}
                      style={[
                        styles.optionButton,
                        liveDJ.promptConfig.explicitFilter === option.value && styles.optionButtonActive,
                      ]}
                      onPress={() => handleExplicitFilterChange(option.value)}
                    >
                      <Text
                        style={[
                          styles.optionText,
                          liveDJ.promptConfig.explicitFilter === option.value && styles.optionTextActive,
                        ]}
                      >
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* No-Play List */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Do Not Play</Text>
                <View style={styles.tagsContainer}>
                  {liveDJ.promptConfig.doNotPlay.map((item, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[styles.tag, styles.noPlayTag]}
                      onPress={() => removeNoPlay(index)}
                    >
                      <Text style={styles.tagText}>{item}</Text>
                      <Text style={styles.tagRemove}>×</Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <View style={styles.addTagContainer}>
                  <TextInput
                    style={styles.tagInput}
                    placeholder="Add artist, song, or keyword"
                    placeholderTextColor="#666"
                    value={noPlayInput}
                    onChangeText={setNoPlayInput}
                    onSubmitEditing={addNoPlay}
                  />
                  <TouchableOpacity style={styles.addButton} onPress={addNoPlay}>
                    <Text style={styles.addButtonText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Emergency Fade */}
              <TouchableOpacity style={styles.emergencyButton} onPress={emergencyFade}>
                <AlertTriangle size={20} color="#FFF" />
                <Text style={styles.emergencyText}>Emergency Fade</Text>
              </TouchableOpacity>
            </View>

            {/* Casting */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Device Casting</Text>
              
              <TouchableOpacity style={styles.pairButton} onPress={startPairing}>
                <Cast size={20} color="#FF6B35" />
                <Text style={styles.pairButtonText}>Pair Device</Text>
              </TouchableOpacity>

              {liveDJ.sessionId && (
                <View style={styles.qrContainer}>
                  <QrCode size={80} color="#FF6B35" />
                  <Text style={styles.qrText}>
                    Scan to connect audio output
                  </Text>
                  <Text style={styles.sessionUrl}>
                    {Platform.OS === 'web' ? window.location.origin : 'didit360.com'}/pair?session={liveDJ.sessionId}
                  </Text>
                </View>
              )}
            </View>

            {/* Now Playing */}
            {(liveDJ.nowPlaying || currentTrack) && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Now Playing</Text>
                <View style={styles.nowPlayingCard}>
                  <View style={styles.nowPlayingContent}>
                    <Image
                      source={{ uri: (liveDJ.nowPlaying || currentTrack)?.artwork }}
                      style={styles.nowPlayingImage}
                    />
                    <View style={styles.nowPlayingInfo}>
                      <Text style={styles.nowPlayingTitle}>
                        {(liveDJ.nowPlaying || currentTrack)?.title}
                      </Text>
                      <Text style={styles.nowPlayingArtist}>
                        {(liveDJ.nowPlaying || currentTrack)?.artist}
                      </Text>
                    </View>
                    <TouchableOpacity
                      style={styles.playButton}
                      onPress={togglePlayPause}
                    >
                      {isPlaying ? (
                        <Pause size={24} color="#FFF" fill="#FFF" />
                      ) : (
                        <Play size={24} color="#FFF" fill="#FFF" />
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}

            {/* Next Up */}
            {liveDJ.nextUp.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Next Up</Text>
                <FlatList
                  data={liveDJ.nextUp}
                  renderItem={renderTrackItem}
                  keyExtractor={(item) => item.id}
                  scrollEnabled={false}
                  style={styles.nextUpList}
                />
              </View>
            )}

            {/* Action Buttons */}
            <View style={styles.actionBar}>
              <TouchableOpacity
                style={[
                  styles.goLiveButton,
                  liveDJ.loading && styles.goLiveButtonDisabled,
                ]}
                onPress={startLiveDJ}
                disabled={liveDJ.loading}
              >
                {liveDJ.loading ? (
                  <Volume2 size={20} color="#999" />
                ) : (
                  <Zap size={20} color="#FFF" />
                )}
                <Text
                  style={[
                    styles.goLiveButtonText,
                    liveDJ.loading && styles.goLiveButtonTextDisabled,
                  ]}
                >
                  {liveDJ.loading ? "Starting..." : "Go Live"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionButton} onPress={saveLiveMix}>
                <Save size={20} color="#FFF" />
                <Text style={styles.actionButtonText}>Save Mix</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => setShowRecapModal(true)}
              >
                <FileText size={20} color="#FFF" />
                <Text style={styles.actionButtonText}>Recap</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
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
  headerTitle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFF",
  },
  castStatus: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  castDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  castText: {
    fontSize: 12,
    fontWeight: "600",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  subtitle: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
    marginBottom: 30,
    fontStyle: "italic",
  },
  section: {
    backgroundColor: "#1A1A1A",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFF",
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFF",
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: "#333",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    color: "#FFF",
    fontSize: 16,
    minHeight: 48,
    textAlignVertical: "top",
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 8,
  },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FF6B35",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  noPlayTag: {
    backgroundColor: "#FF4444",
  },
  tagText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#FFF",
  },
  tagRemove: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFF",
  },
  addTagContainer: {
    flexDirection: "row",
    gap: 8,
  },
  tagInput: {
    flex: 1,
    backgroundColor: "#333",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: "#FFF",
    fontSize: 14,
  },
  addButton: {
    width: 40,
    height: 40,
    backgroundColor: "#FF6B35",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFF",
  },
  optionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  optionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#333",
    borderRadius: 20,
    gap: 6,
  },
  optionButtonActive: {
    backgroundColor: "#FF6B35",
  },
  optionEmoji: {
    fontSize: 16,
  },
  optionText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#999",
  },
  optionTextActive: {
    color: "#FFF",
  },
  durationContainer: {
    flexDirection: "row",
    gap: 8,
  },
  durationButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#333",
    borderRadius: 20,
  },
  durationButtonActive: {
    backgroundColor: "#FF6B35",
  },
  durationText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#999",
  },
  durationTextActive: {
    color: "#FFF",
  },
  controlItem: {
    marginBottom: 16,
  },
  controlLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFF",
    marginBottom: 8,
  },
  sliderContainer: {
    gap: 8,
  },
  slider: {
    height: 40,
    justifyContent: "center",
  },
  sliderTrack: {
    height: 4,
    backgroundColor: "#333",
    borderRadius: 2,
    position: "relative",
  },
  sliderProgress: {
    height: "100%",
    backgroundColor: "#FF6B35",
    borderRadius: 2,
  },
  sliderThumb: {
    position: "absolute",
    top: -6,
    width: 16,
    height: 16,
    backgroundColor: "#FF6B35",
    borderRadius: 8,
    marginLeft: -8,
  },
  sliderValue: {
    fontSize: 12,
    color: "#999",
    textAlign: "center",
  },
  transitionContainer: {
    flexDirection: "row",
    gap: 8,
  },
  transitionOption: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#333",
    borderRadius: 16,
  },
  transitionOptionActive: {
    backgroundColor: "#FF6B35",
  },
  transitionText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#999",
  },
  transitionTextActive: {
    color: "#FFF",
  },
  toggleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  toggleInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  toggleDescription: {
    fontSize: 12,
    color: "#666",
  },
  emergencyButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
    backgroundColor: "#FF4444",
    borderRadius: 8,
    marginTop: 8,
  },
  emergencyText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFF",
  },
  pairButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
    backgroundColor: "rgba(255, 107, 53, 0.1)",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(255, 107, 53, 0.3)",
    marginBottom: 16,
  },
  pairButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FF6B35",
  },
  qrContainer: {
    alignItems: "center",
    gap: 8,
  },
  qrText: {
    fontSize: 12,
    color: "#999",
    textAlign: "center",
  },
  sessionUrl: {
    fontSize: 10,
    color: "#666",
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
    textAlign: "center",
  },
  nowPlayingCard: {
    backgroundColor: "#333",
    borderRadius: 8,
    padding: 12,
  },
  nowPlayingContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  nowPlayingImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  nowPlayingInfo: {
    flex: 1,
  },
  nowPlayingTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFF",
    marginBottom: 4,
  },
  nowPlayingArtist: {
    fontSize: 14,
    color: "#999",
  },
  playButton: {
    width: 48,
    height: 48,
    backgroundColor: "#FF6B35",
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  nextUpList: {
    backgroundColor: "#333",
    borderRadius: 8,
    padding: 8,
  },
  trackItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  trackImage: {
    width: 40,
    height: 40,
    borderRadius: 6,
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
  trackBPM: {
    fontSize: 12,
    color: "#666",
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
  },
  actionBar: {
    flexDirection: "row",
    gap: 12,
    paddingBottom: 40,
  },
  goLiveButton: {
    flex: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 16,
    backgroundColor: "#FF6B35",
    borderRadius: 8,
  },
  goLiveButtonDisabled: {
    backgroundColor: "#333",
  },
  goLiveButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFF",
  },
  goLiveButtonTextDisabled: {
    color: "#999",
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 12,
    backgroundColor: "#333",
    borderRadius: 8,
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#FFF",
  },
});