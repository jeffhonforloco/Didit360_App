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
import { X, Clock, Zap, Globe } from "lucide-react-native";
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
});