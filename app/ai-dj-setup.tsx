import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Switch,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { X, Clock, Zap, Globe, Mic, Users, Activity, Share2, Radio, Headphones, Music2, Crosshair } from "lucide-react-native";
import { router } from "expo-router";
import Slider from "@react-native-community/slider";
import { useMixMind } from "@/contexts/MixMindContext";

export default function MixMindSetupScreen() {
  const { settings, saveSettings } = useMixMind();
  const [duration, setDuration] = useState(settings.duration);
  const [energy, setEnergy] = useState(settings.energy);
  const [diversity, setDiversity] = useState(settings.diversity);
  const [explicitContent, setExplicitContent] = useState(settings.explicitContent);
  const [includeNewReleases, setIncludeNewReleases] = useState(settings.includeNewReleases);
  const [includeClassics, setIncludeClassics] = useState(settings.includeClassics);
  const [smartTransitions, setSmartTransitions] = useState(settings.smartTransitions);
  const [adaptiveEQ, setAdaptiveEQ] = useState(settings.adaptiveEQ);
  const [voicePrompts, setVoicePrompts] = useState(settings.voicePrompts);
  // New advanced settings
  const [crossfadeTime, setCrossfadeTime] = useState(settings.crossfadeTime);
  const [keyMatching, setKeyMatching] = useState(settings.keyMatching);
  const [moodProgression, setMoodProgression] = useState(settings.moodProgression);
  const [collaborativeMode, setCollaborativeMode] = useState(settings.collaborativeMode);
  const [realTimeAnalysis, setRealTimeAnalysis] = useState(settings.realTimeAnalysis);
  const [socialSharing, setSocialSharing] = useState(settings.socialSharing);
  const [liveMode, setLiveMode] = useState(settings.liveMode);
  const [beatMatching, setBeatMatching] = useState(settings.beatMatching);
  const [harmonicMixing, setHarmonicMixing] = useState(settings.harmonicMixing);
  const [energyProgression, setEnergyProgression] = useState(settings.energyProgression);
  const [genreBlending, setGenreBlending] = useState(settings.genreBlending);
  const [vintageMode, setVintageMode] = useState(settings.vintageMode);
  const [radioMode, setRadioMode] = useState(settings.radioMode);
  const [partyMode, setPartyMode] = useState(settings.partyMode);

  useEffect(() => {
    setDuration(settings.duration);
    setEnergy(settings.energy);
    setDiversity(settings.diversity);
    setExplicitContent(settings.explicitContent);
    setIncludeNewReleases(settings.includeNewReleases);
    setIncludeClassics(settings.includeClassics);
    setSmartTransitions(settings.smartTransitions);
    setAdaptiveEQ(settings.adaptiveEQ);
    setVoicePrompts(settings.voicePrompts);
    // Update new settings
    setCrossfadeTime(settings.crossfadeTime);
    setKeyMatching(settings.keyMatching);
    setMoodProgression(settings.moodProgression);
    setCollaborativeMode(settings.collaborativeMode);
    setRealTimeAnalysis(settings.realTimeAnalysis);
    setSocialSharing(settings.socialSharing);
    setLiveMode(settings.liveMode);
    setBeatMatching(settings.beatMatching);
    setHarmonicMixing(settings.harmonicMixing);
    setEnergyProgression(settings.energyProgression);
    setGenreBlending(settings.genreBlending);
    setVintageMode(settings.vintageMode);
    setRadioMode(settings.radioMode);
    setPartyMode(settings.partyMode);
  }, [settings]);

  const handleSave = async () => {
    await saveSettings({
      duration,
      energy,
      diversity,
      explicitContent,
      includeNewReleases,
      includeClassics,
      smartTransitions,
      adaptiveEQ,
      voicePrompts,
      // New advanced settings
      crossfadeTime,
      keyMatching,
      moodProgression,
      collaborativeMode,
      realTimeAnalysis,
      socialSharing,
      liveMode,
      beatMatching,
      harmonicMixing,
      energyProgression,
      genreBlending,
      vintageMode,
      radioMode,
      partyMode,
    });
    router.back();
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.title}>MixMind Settings</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <X size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Clock size={20} color="#FF0080" />
            <Text style={styles.sectionTitle}>Set Duration</Text>
          </View>
          <Text style={styles.sliderValue}>{duration} minutes</Text>
          <Slider
            style={styles.slider}
            value={duration}
            onValueChange={setDuration}
            minimumValue={15}
            maximumValue={120}
            step={15}
            minimumTrackTintColor="#FF0080"
            maximumTrackTintColor="#333"
            thumbTintColor="#FF0080"
          />
          <View style={styles.sliderLabels}>
            <Text style={styles.sliderLabel}>15 min</Text>
            <Text style={styles.sliderLabel}>120 min</Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Zap size={20} color="#8B5CF6" />
            <Text style={styles.sectionTitle}>Energy Level</Text>
          </View>
          <Text style={styles.sliderValue}>
            {energy < 0.3 ? "Low" : energy < 0.7 ? "Medium" : "High"}
          </Text>
          <Slider
            style={styles.slider}
            value={energy}
            onValueChange={setEnergy}
            minimumValue={0}
            maximumValue={1}
            minimumTrackTintColor="#8B5CF6"
            maximumTrackTintColor="#333"
            thumbTintColor="#8B5CF6"
          />
          <View style={styles.sliderLabels}>
            <Text style={styles.sliderLabel}>Chill</Text>
            <Text style={styles.sliderLabel}>Intense</Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Globe size={20} color="#3B82F6" />
            <Text style={styles.sectionTitle}>Musical Diversity</Text>
          </View>
          <Text style={styles.sliderValue}>
            {diversity < 0.3 ? "Similar" : diversity < 0.7 ? "Balanced" : "Diverse"}
          </Text>
          <Slider
            style={styles.slider}
            value={diversity}
            onValueChange={setDiversity}
            minimumValue={0}
            maximumValue={1}
            minimumTrackTintColor="#3B82F6"
            maximumTrackTintColor="#333"
            thumbTintColor="#3B82F6"
          />
          <View style={styles.sliderLabels}>
            <Text style={styles.sliderLabel}>Similar</Text>
            <Text style={styles.sliderLabel}>Diverse</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Content Preferences</Text>
          
          <View style={styles.toggle}>
            <Text style={styles.toggleLabel}>Allow Explicit Content</Text>
            <Switch
              value={explicitContent}
              onValueChange={setExplicitContent}
              trackColor={{ false: "#333", true: "#FF0080" }}
              thumbColor={Platform.OS === "ios" ? "#FFF" : explicitContent ? "#FFF" : "#999"}
            />
          </View>

          <View style={styles.toggle}>
            <Text style={styles.toggleLabel}>Include New Releases</Text>
            <Switch
              value={includeNewReleases}
              onValueChange={setIncludeNewReleases}
              trackColor={{ false: "#333", true: "#FF0080" }}
              thumbColor={Platform.OS === "ios" ? "#FFF" : includeNewReleases ? "#FFF" : "#999"}
            />
          </View>

          <View style={styles.toggle}>
            <Text style={styles.toggleLabel}>Include Classics</Text>
            <Switch
              value={includeClassics}
              onValueChange={setIncludeClassics}
              trackColor={{ false: "#333", true: "#FF0080" }}
              thumbColor={Platform.OS === "ios" ? "#FFF" : includeClassics ? "#FFF" : "#999"}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>AI Features</Text>
          
          <View style={styles.toggle}>
            <View style={styles.toggleInfo}>
              <Text style={styles.toggleLabel}>Smart Transitions</Text>
              <Text style={styles.toggleDescription}>AI-powered harmonic mixing and BPM matching</Text>
            </View>
            <Switch
              value={smartTransitions}
              onValueChange={setSmartTransitions}
              trackColor={{ false: "#333", true: "#FF0080" }}
              thumbColor={Platform.OS === "ios" ? "#FFF" : smartTransitions ? "#FFF" : "#999"}
            />
          </View>

          <View style={styles.toggle}>
            <View style={styles.toggleInfo}>
              <Text style={styles.toggleLabel}>Adaptive EQ</Text>
              <Text style={styles.toggleDescription}>Automatically adjust EQ for optimal sound</Text>
            </View>
            <Switch
              value={adaptiveEQ}
              onValueChange={setAdaptiveEQ}
              trackColor={{ false: "#333", true: "#FF0080" }}
              thumbColor={Platform.OS === "ios" ? "#FFF" : adaptiveEQ ? "#FFF" : "#999"}
            />
          </View>

          <View style={styles.toggle}>
            <View style={styles.toggleInfo}>
              <Text style={styles.toggleLabel}>Voice Prompts</Text>
              <Text style={styles.toggleDescription}>Enable voice input for creating mixes</Text>
            </View>
            <Switch
              value={voicePrompts}
              onValueChange={setVoicePrompts}
              trackColor={{ false: "#333", true: "#FF0080" }}
              thumbColor={Platform.OS === "ios" ? "#FFF" : voicePrompts ? "#FFF" : "#999"}
            />
          </View>

          <View style={styles.toggle}>
            <View style={styles.toggleInfo}>
              <Text style={styles.toggleLabel}>Real-time Analysis</Text>
              <Text style={styles.toggleDescription}>Analyze tracks and provide recommendations</Text>
            </View>
            <Switch
              value={realTimeAnalysis}
              onValueChange={setRealTimeAnalysis}
              trackColor={{ false: "#333", true: "#FF0080" }}
              thumbColor={Platform.OS === "ios" ? "#FFF" : realTimeAnalysis ? "#FFF" : "#999"}
            />
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Crosshair size={20} color="#8B5CF6" />
            <Text style={styles.sectionTitle}>Crossfade Time</Text>
          </View>
          <Text style={styles.sliderValue}>{crossfadeTime} seconds</Text>
          <Slider
            style={styles.slider}
            value={crossfadeTime}
            onValueChange={setCrossfadeTime}
            minimumValue={2}
            maximumValue={20}
            step={1}
            minimumTrackTintColor="#8B5CF6"
            maximumTrackTintColor="#333"
            thumbTintColor="#8B5CF6"
          />
          <View style={styles.sliderLabels}>
            <Text style={styles.sliderLabel}>2s</Text>
            <Text style={styles.sliderLabel}>20s</Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Music2 size={20} color="#00D4AA" />
            <Text style={styles.sectionTitle}>Genre Blending</Text>
          </View>
          <Text style={styles.sliderValue}>
            {genreBlending < 0.3 ? "Minimal" : genreBlending < 0.7 ? "Moderate" : "Maximum"}
          </Text>
          <Slider
            style={styles.slider}
            value={genreBlending}
            onValueChange={setGenreBlending}
            minimumValue={0}
            maximumValue={1}
            minimumTrackTintColor="#00D4AA"
            maximumTrackTintColor="#333"
            thumbTintColor="#00D4AA"
          />
          <View style={styles.sliderLabels}>
            <Text style={styles.sliderLabel}>Pure</Text>
            <Text style={styles.sliderLabel}>Mixed</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mixing Techniques</Text>
          
          <View style={styles.toggle}>
            <View style={styles.toggleInfo}>
              <Text style={styles.toggleLabel}>Key Matching</Text>
              <Text style={styles.toggleDescription}>Match tracks by musical key for harmony</Text>
            </View>
            <Switch
              value={keyMatching}
              onValueChange={setKeyMatching}
              trackColor={{ false: "#333", true: "#FF0080" }}
              thumbColor={Platform.OS === "ios" ? "#FFF" : keyMatching ? "#FFF" : "#999"}
            />
          </View>

          <View style={styles.toggle}>
            <View style={styles.toggleInfo}>
              <Text style={styles.toggleLabel}>Beat Matching</Text>
              <Text style={styles.toggleDescription}>Sync BPM for seamless transitions</Text>
            </View>
            <Switch
              value={beatMatching}
              onValueChange={setBeatMatching}
              trackColor={{ false: "#333", true: "#FF0080" }}
              thumbColor={Platform.OS === "ios" ? "#FFF" : beatMatching ? "#FFF" : "#999"}
            />
          </View>

          <View style={styles.toggle}>
            <View style={styles.toggleInfo}>
              <Text style={styles.toggleLabel}>Harmonic Mixing</Text>
              <Text style={styles.toggleDescription}>Use Camelot wheel for perfect mixes</Text>
            </View>
            <Switch
              value={harmonicMixing}
              onValueChange={setHarmonicMixing}
              trackColor={{ false: "#333", true: "#FF0080" }}
              thumbColor={Platform.OS === "ios" ? "#FFF" : harmonicMixing ? "#FFF" : "#999"}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Social & Collaboration</Text>
          
          <View style={styles.toggle}>
            <View style={styles.toggleInfo}>
              <Text style={styles.toggleLabel}>Collaborative Mode</Text>
              <Text style={styles.toggleDescription}>Allow others to join your mixing sessions</Text>
            </View>
            <Switch
              value={collaborativeMode}
              onValueChange={setCollaborativeMode}
              trackColor={{ false: "#333", true: "#FF0080" }}
              thumbColor={Platform.OS === "ios" ? "#FFF" : collaborativeMode ? "#FFF" : "#999"}
            />
          </View>

          <View style={styles.toggle}>
            <View style={styles.toggleInfo}>
              <Text style={styles.toggleLabel}>Social Sharing</Text>
              <Text style={styles.toggleDescription}>Share your mixes on social platforms</Text>
            </View>
            <Switch
              value={socialSharing}
              onValueChange={setSocialSharing}
              trackColor={{ false: "#333", true: "#FF0080" }}
              thumbColor={Platform.OS === "ios" ? "#FFF" : socialSharing ? "#FFF" : "#999"}
            />
          </View>

          <View style={styles.toggle}>
            <View style={styles.toggleInfo}>
              <Text style={styles.toggleLabel}>Live Mode</Text>
              <Text style={styles.toggleDescription}>Stream your mixes live to listeners</Text>
            </View>
            <Switch
              value={liveMode}
              onValueChange={setLiveMode}
              trackColor={{ false: "#333", true: "#FF0080" }}
              thumbColor={Platform.OS === "ios" ? "#FFF" : liveMode ? "#FFF" : "#999"}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Specialized Modes</Text>
          
          <View style={styles.toggle}>
            <View style={styles.toggleInfo}>
              <Text style={styles.toggleLabel}>Vintage Mode</Text>
              <Text style={styles.toggleDescription}>Focus on classic and retro tracks</Text>
            </View>
            <Switch
              value={vintageMode}
              onValueChange={setVintageMode}
              trackColor={{ false: "#333", true: "#FF0080" }}
              thumbColor={Platform.OS === "ios" ? "#FFF" : vintageMode ? "#FFF" : "#999"}
            />
          </View>

          <View style={styles.toggle}>
            <View style={styles.toggleInfo}>
              <Text style={styles.toggleLabel}>Radio Mode</Text>
              <Text style={styles.toggleDescription}>Create radio-style mixes with jingles</Text>
            </View>
            <Switch
              value={radioMode}
              onValueChange={setRadioMode}
              trackColor={{ false: "#333", true: "#FF0080" }}
              thumbColor={Platform.OS === "ios" ? "#FFF" : radioMode ? "#FFF" : "#999"}
            />
          </View>

          <View style={styles.toggle}>
            <View style={styles.toggleInfo}>
              <Text style={styles.toggleLabel}>Party Mode</Text>
              <Text style={styles.toggleDescription}>High-energy tracks for celebrations</Text>
            </View>
            <Switch
              value={partyMode}
              onValueChange={setPartyMode}
              trackColor={{ false: "#333", true: "#FF0080" }}
              thumbColor={Platform.OS === "ios" ? "#FFF" : partyMode ? "#FFF" : "#999"}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Energy Progression</Text>
          <View style={styles.progressionOptions}>
            {(['steady', 'build', 'drop', 'wave'] as const).map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.progressionOption,
                  energyProgression === option && styles.progressionOptionActive
                ]}
                onPress={() => setEnergyProgression(option)}
              >
                <Text style={[
                  styles.progressionOptionText,
                  energyProgression === option && styles.progressionOptionTextActive
                ]}>
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mood Progression</Text>
          <View style={styles.progressionOptions}>
            {(['linear', 'wave', 'peak', 'valley'] as const).map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.progressionOption,
                  moodProgression === option && styles.progressionOptionActive
                ]}
                onPress={() => setMoodProgression(option)}
              >
                <Text style={[
                  styles.progressionOptionText,
                  moodProgression === option && styles.progressionOptionTextActive
                ]}>
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSave}
        >
          <Text style={styles.saveButtonText}>Save Settings</Text>
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFF",
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#1A1A1A",
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFF",
    marginLeft: 12,
  },
  sliderValue: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FFF",
    textAlign: "center",
    marginBottom: 16,
  },
  slider: {
    width: "100%",
    height: 40,
  },
  sliderLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: -8,
  },
  sliderLabel: {
    fontSize: 12,
    color: "#666",
  },
  toggle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  toggleLabel: {
    fontSize: 16,
    color: "#FFF",
  },
  toggleInfo: {
    flex: 1,
    marginRight: 16,
  },
  toggleDescription: {
    fontSize: 13,
    color: "#999",
    marginTop: 2,
  },
  saveButton: {
    backgroundColor: "#FF0080",
    marginHorizontal: 20,
    marginVertical: 32,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFF",
  },
  progressionOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  progressionOption: {
    backgroundColor: "#1A1A1A",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#333",
  },
  progressionOptionActive: {
    backgroundColor: "#FF0080",
    borderColor: "#FF0080",
  },
  progressionOptionText: {
    fontSize: 14,
    color: "#999",
    fontWeight: "500",
  },
  progressionOptionTextActive: {
    color: "#FFF",
    fontWeight: "600",
  },
});