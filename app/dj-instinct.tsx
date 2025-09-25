import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
  FlatList,
  Image,
  useWindowDimensions,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import {
  ArrowLeft,
  Headphones,
  Sliders,
  Mic,
  Users,
  Play,
  Pause,
  Save,
  Share2,
  FileText,
  QrCode,
  Volume2,
} from "lucide-react-native";
import { router } from "expo-router";
import { useDJInstinct, type DJInstinctMode, type TransitionStyle } from "@/contexts/DJInstinctContext";
import { usePlayer } from "@/contexts/PlayerContext";
import type { Track } from "@/types";

const TRANSITION_OPTIONS: { value: TransitionStyle; label: string }[] = [
  { value: "fade", label: "Fade" },
  { value: "echo", label: "Echo" },
  { value: "cut", label: "Cut" },
  { value: "drop", label: "Drop" },
];

export default function DJInstinctScreen() {
  const { width } = useWindowDimensions();
  const { currentTrack, isPlaying, togglePlayPause } = usePlayer();
  const {
    active,
    mode,
    energy,
    transition,
    prompt,
    nowPlaying,
    queuePreview,
    party,
    mixHistory,
    loading,
    setMode,
    setEnergy,
    setTransition,
    setPrompt,
    startAutoMix,
    startLivePrompt,
    startPartySession,
    saveMix,
    updateParams,
  } = useDJInstinct();

  const [showShareModal, setShowShareModal] = useState(false);
  const [showRecapModal, setShowRecapModal] = useState(false);

  const handleModeChange = (newMode: DJInstinctMode) => {
    console.log('[DJInstinct] Mode changed to:', newMode);
    setMode(newMode);
  };

  const handleEnergyChange = (value: number) => {
    setEnergy(value);
    updateParams();
  };

  const handleTransitionChange = (value: TransitionStyle) => {
    setTransition(value);
    updateParams();
  };

  const handleStartSet = async () => {
    switch (mode) {
      case "automix":
        await startAutoMix();
        break;
      case "livePrompt":
        await startLivePrompt();
        break;
      case "party":
        await startPartySession();
        break;
    }
  };

  const renderTrackItem = ({ item }: { item: Track }) => (
    <View style={styles.trackItem}>
      <Image source={{ uri: item.artwork }} style={styles.trackImage} />
      <View style={styles.trackInfo}>
        <Text style={styles.trackTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.trackArtist} numberOfLines={1}>
          {item.artist}
        </Text>
      </View>
    </View>
  );

  const renderVoteItem = ({ item }: { item: any }) => (
    <View style={styles.voteItem}>
      <Text style={styles.voteLabel}>{item.label}</Text>
      <Text style={styles.voteCount}>{item.count} votes</Text>
    </View>
  );

  const renderMixHistoryItem = ({ item }: { item: any }) => (
    <View style={styles.historyItem}>
      <View style={styles.historyTime}>
        <Text style={styles.historyTimeText}>
          {new Date(item.timestamp).toLocaleTimeString()}
        </Text>
      </View>
      <View style={styles.historyTrack}>
        <Text style={styles.historyTitle}>{item.track.title}</Text>
        <Text style={styles.historyArtist}>{item.track.artist}</Text>
        <Text style={styles.historyTransition}>
          {item.transition} • Energy: {item.energy}%
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#1A1A1A", "#0A0A0A"]}
        style={styles.gradient}
      >
        <SafeAreaView style={styles.safeArea} edges={["top"]}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.canGoBack() ? router.back() : router.replace('/(tabs)/')}>
              <ArrowLeft size={28} color="#FFF" />
            </TouchableOpacity>
            <View style={styles.headerTitle}>
              <Headphones size={24} color="#FF0080" />
              <Text style={styles.title}>DJ Instinct</Text>
            </View>
            <View style={styles.spacer} />
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* Subtitle */}
            <Text style={styles.subtitle}>The AI that feels the music</Text>

            {/* Mode Tabs */}
            <View style={styles.modeTabs}>
              {[
                { key: "automix", label: "AutoMix", icon: Sliders },
                { key: "livePrompt", label: "Live Prompt", icon: Mic },
                { key: "party", label: "Party Mode", icon: Users },
              ].map(({ key, label, icon: Icon }) => (
                <TouchableOpacity
                  key={key}
                  style={[
                    styles.modeTab,
                    mode === key && styles.modeTabActive,
                  ]}
                  onPress={() => handleModeChange(key as DJInstinctMode)}
                >
                  <Icon
                    size={20}
                    color={mode === key ? "#FFF" : "#999"}
                  />
                  <Text
                    style={[
                      styles.modeTabText,
                      mode === key && styles.modeTabTextActive,
                    ]}
                  >
                    {label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Control Strip */}
            <View style={styles.controlStrip}>
              {/* Energy Slider */}
              <View style={styles.controlItem}>
                <Text style={styles.controlLabel}>Energy</Text>
                <View style={styles.sliderContainer}>
                  <TouchableOpacity
                    style={styles.slider}
                    onPress={(e) => {
                      const { locationX } = e.nativeEvent;
                      const containerWidth = (width - 80) / 3;
                      const newEnergy = Math.round((locationX / containerWidth) * 100);
                      handleEnergyChange(Math.max(0, Math.min(100, newEnergy)));
                    }}
                  >
                    <View style={styles.sliderTrack}>
                      <View
                        style={[
                          styles.sliderProgress,
                          { width: `${energy}%` },
                        ]}
                      />
                      <View
                        style={[
                          styles.sliderThumb,
                          { left: `${energy}%` },
                        ]}
                      />
                    </View>
                  </TouchableOpacity>
                  <Text style={styles.sliderValue}>{energy}%</Text>
                </View>
              </View>

              {/* Transition Select */}
              <View style={styles.controlItem}>
                <Text style={styles.controlLabel}>Transition</Text>
                <View style={styles.transitionContainer}>
                  {TRANSITION_OPTIONS.map((option) => (
                    <TouchableOpacity
                      key={option.value}
                      style={[
                        styles.transitionOption,
                        transition === option.value && styles.transitionOptionActive,
                      ]}
                      onPress={() => handleTransitionChange(option.value)}
                    >
                      <Text
                        style={[
                          styles.transitionText,
                          transition === option.value && styles.transitionTextActive,
                        ]}
                      >
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Instinct Badge */}
              <View style={styles.controlItem}>
                <View style={styles.instinctBadge}>
                  <View style={styles.pulseDot} />
                  <Text style={styles.instinctText}>Mixed by DJ Instinct</Text>
                </View>
              </View>
            </View>

            {/* Mode-specific Content */}
            {mode === "livePrompt" && (
              <View style={styles.modeContent}>
                <Text style={styles.modeTitle}>Guide the vibe</Text>
                <View style={styles.promptContainer}>
                  <TextInput
                    style={styles.promptInput}
                    placeholder="e.g. Afrobeats energy, Sunset chill, 90s throwback"
                    placeholderTextColor="#666"
                    value={prompt}
                    onChangeText={setPrompt}
                    multiline
                  />
                  <TouchableOpacity style={styles.micButton}>
                    <Mic size={20} color="#FF0080" />
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {mode === "party" && party.sessionId && (
              <View style={styles.modeContent}>
                <Text style={styles.modeTitle}>Party Session Active</Text>
                <View style={styles.partyInfo}>
                  <View style={styles.qrContainer}>
                    <QrCode size={80} color="#FF0080" />
                    <Text style={styles.qrText}>
                      Scan to join voting
                    </Text>
                  </View>
                  <View style={styles.sessionInfo}>
                    <Text style={styles.sessionId}>
                      Session: {party.sessionId.slice(-8)}
                    </Text>
                    <Text style={styles.sessionUrl}>
                      {Platform.OS === 'web' ? window.location.origin : 'didit360.com'}/join/{party.sessionId}
                    </Text>
                  </View>
                </View>
                
                {party.votes.length > 0 && (
                  <View style={styles.votingBoard}>
                    <Text style={styles.votingTitle}>Live Votes</Text>
                    <FlatList
                      data={party.votes}
                      renderItem={renderVoteItem}
                      keyExtractor={(item) => item.id}
                      scrollEnabled={false}
                    />
                  </View>
                )}
              </View>
            )}

            {/* Now Playing Card */}
            {(nowPlaying || currentTrack) && (
              <View style={styles.nowPlayingCard}>
                <Text style={styles.cardTitle}>Now Playing</Text>
                <View style={styles.nowPlayingContent}>
                  <Image
                    source={{ uri: (nowPlaying || currentTrack)?.artwork }}
                    style={styles.nowPlayingImage}
                  />
                  <View style={styles.nowPlayingInfo}>
                    <Text style={styles.nowPlayingTitle}>
                      {(nowPlaying || currentTrack)?.title}
                    </Text>
                    <Text style={styles.nowPlayingArtist}>
                      {(nowPlaying || currentTrack)?.artist}
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
                
                {/* Beat Visualizer Placeholder */}
                <View style={styles.visualizer}>
                  <View style={styles.visualizerBar} />
                  <View style={[styles.visualizerBar, { height: 20 }]} />
                  <View style={[styles.visualizerBar, { height: 35 }]} />
                  <View style={[styles.visualizerBar, { height: 15 }]} />
                  <View style={[styles.visualizerBar, { height: 28 }]} />
                  <View style={[styles.visualizerBar, { height: 40 }]} />
                  <View style={[styles.visualizerBar, { height: 22 }]} />
                  <View style={[styles.visualizerBar, { height: 18 }]} />
                </View>
              </View>
            )}

            {/* Queue Preview */}
            {queuePreview.length > 0 && (
              <View style={styles.queueCard}>
                <Text style={styles.cardTitle}>Up Next (Instinct)</Text>
                <FlatList
                  data={queuePreview}
                  renderItem={renderTrackItem}
                  keyExtractor={(item) => item.id}
                  scrollEnabled={false}
                />
              </View>
            )}

            {/* Action Bar */}
            <View style={styles.actionBar}>
              <TouchableOpacity
                style={[styles.actionButton, loading && styles.actionButtonDisabled]}
                onPress={handleStartSet}
                disabled={loading}
              >
                {loading ? (
                  <Volume2 size={20} color="#999" />
                ) : (
                  <Play size={20} color="#FFF" />
                )}
                <Text style={[styles.actionButtonText, loading && styles.actionButtonTextDisabled]}>
                  {loading ? "Starting..." : "Start Set"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionButton} onPress={saveMix}>
                <Save size={20} color="#FFF" />
                <Text style={styles.actionButtonText}>Save Mix</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => setShowShareModal(true)}
              >
                <Share2 size={20} color="#FFF" />
                <Text style={styles.actionButtonText}>Share</Text>
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

      {/* Share Modal */}
      <Modal
        visible={showShareModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowShareModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.shareModal}>
            <Text style={styles.shareTitle}>Share your mix</Text>
            <TouchableOpacity style={styles.shareOption}>
              <Text style={styles.shareOptionText}>Didit360 link</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.shareOption}>
              <Text style={styles.shareOptionText}>Instagram story</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.shareOption}>
              <Text style={styles.shareOptionText}>TikTok clip</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowShareModal(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Recap Modal */}
      <Modal
        visible={showRecapModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowRecapModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.recapModal}>
            <Text style={styles.recapTitle}>Mix Recap</Text>
            {mixHistory.length > 0 ? (
              <FlatList
                data={mixHistory}
                renderItem={renderMixHistoryItem}
                keyExtractor={(item) => item.id}
                style={styles.historyList}
              />
            ) : (
              <Text style={styles.emptyText}>No mix history yet</Text>
            )}
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowRecapModal(false)}
            >
              <Text style={styles.cancelButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  spacer: {
    width: 28,
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
  modeTabs: {
    flexDirection: "row",
    backgroundColor: "#1A1A1A",
    borderRadius: 12,
    padding: 4,
    marginBottom: 30,
  },
  modeTab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    gap: 6,
  },
  modeTabActive: {
    backgroundColor: "#FF0080",
  },
  modeTabText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#999",
  },
  modeTabTextActive: {
    color: "#FFF",
  },
  controlStrip: {
    backgroundColor: "#1A1A1A",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    gap: 16,
  },
  controlItem: {
    gap: 8,
  },
  controlLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFF",
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
    backgroundColor: "#FF0080",
    borderRadius: 2,
  },
  sliderThumb: {
    position: "absolute",
    top: -6,
    width: 16,
    height: 16,
    backgroundColor: "#FF0080",
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
    backgroundColor: "#FF0080",
  },
  transitionText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#999",
  },
  transitionTextActive: {
    color: "#FFF",
  },
  instinctBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "rgba(255, 0, 128, 0.1)",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 0, 128, 0.3)",
  },
  pulseDot: {
    width: 8,
    height: 8,
    backgroundColor: "#FF0080",
    borderRadius: 4,
  },
  instinctText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#FF0080",
  },
  modeContent: {
    backgroundColor: "#1A1A1A",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  modeTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFF",
    marginBottom: 12,
  },
  promptContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 12,
  },
  promptInput: {
    flex: 1,
    backgroundColor: "#333",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    color: "#FFF",
    fontSize: 16,
    minHeight: 48,
    textAlignVertical: "top",
  },
  micButton: {
    width: 48,
    height: 48,
    backgroundColor: "rgba(255, 0, 128, 0.1)",
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 0, 128, 0.3)",
  },
  partyInfo: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 20,
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
  sessionInfo: {
    flex: 1,
    gap: 4,
  },
  sessionId: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFF",
  },
  sessionUrl: {
    fontSize: 12,
    color: "#999",
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
  },
  votingBoard: {
    gap: 12,
  },
  votingTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFF",
  },
  voteItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#333",
    borderRadius: 8,
  },
  voteLabel: {
    fontSize: 14,
    color: "#FFF",
  },
  voteCount: {
    fontSize: 12,
    color: "#999",
    fontWeight: "600",
  },
  nowPlayingCard: {
    backgroundColor: "#1A1A1A",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFF",
    marginBottom: 12,
  },
  nowPlayingContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
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
    backgroundColor: "#FF0080",
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  visualizer: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
    gap: 2,
    height: 50,
  },
  visualizerBar: {
    width: 3,
    height: 25,
    backgroundColor: "#FF0080",
    borderRadius: 1.5,
  },
  queueCard: {
    backgroundColor: "#1A1A1A",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  trackItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 8,
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
  actionBar: {
    flexDirection: "row",
    gap: 12,
    paddingBottom: 40,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 12,
    backgroundColor: "#FF0080",
    borderRadius: 8,
  },
  actionButtonDisabled: {
    backgroundColor: "#333",
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFF",
  },
  actionButtonTextDisabled: {
    color: "#999",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    justifyContent: "flex-end",
  },
  shareModal: {
    backgroundColor: "#2A2A2A",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  shareTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFF",
    textAlign: "center",
    marginBottom: 20,
  },
  shareOption: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  shareOptionText: {
    fontSize: 16,
    color: "#FFF",
  },
  cancelButton: {
    marginTop: 20,
    paddingVertical: 16,
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 16,
    color: "#999",
    fontWeight: "600",
  },
  recapModal: {
    backgroundColor: "#2A2A2A",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingBottom: 40,
    paddingHorizontal: 20,
    maxHeight: "80%",
  },
  recapTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFF",
    textAlign: "center",
    marginBottom: 20,
  },
  historyList: {
    maxHeight: 400,
  },
  historyItem: {
    flexDirection: "row",
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  historyTime: {
    width: 60,
  },
  historyTimeText: {
    fontSize: 12,
    color: "#999",
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
  },
  historyTrack: {
    flex: 1,
  },
  historyTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFF",
    marginBottom: 2,
  },
  historyArtist: {
    fontSize: 12,
    color: "#999",
    marginBottom: 2,
  },
  historyTransition: {
    fontSize: 11,
    color: "#666",
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    paddingVertical: 40,
  },
});