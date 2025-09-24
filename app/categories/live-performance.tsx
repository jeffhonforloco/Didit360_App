import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft, Play } from "lucide-react-native";
import { router } from "expo-router";
import { usePlayer } from "@/contexts/PlayerContext";
import { topCharts } from "@/data/mockData";
import type { Track } from "@/types";

export default function LivePerformanceScreen() {
  const { playTrack } = usePlayer();

  const renderTrack = ({ item }: { item: Track }) => {
    // Mark live performance tracks as video content
    const liveTrack: Track = {
      ...item,
      isVideo: true,
      type: "video",
      description: "Live Performance",
      videoUrl: item.videoUrl || "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
    };
    
    return (
      <TouchableOpacity
        style={styles.trackCard}
        onPress={() => playTrack(liveTrack)}
        activeOpacity={0.8}
        testID={`track-${item.id}`}
      >
        <Image source={{ uri: item.artwork }} style={styles.trackImage} />
        <View style={styles.trackInfo}>
          <Text style={styles.trackTitle} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={styles.trackArtist} numberOfLines={1}>
            {item.artist}
          </Text>
          <Text style={styles.liveLabel}>Live Performance</Text>
        </View>
        <TouchableOpacity style={styles.playButton} onPress={() => playTrack(liveTrack)}>
          <Play size={16} color="#000" fill="#FFF" />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          testID="back-button"
        >
          <ArrowLeft size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.title}>Live Performance</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <FlatList
          data={topCharts}
          renderItem={renderTrack}
          keyExtractor={(item) => `live-${item.id}`}
          scrollEnabled={false}
          contentContainerStyle={styles.list}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B0A14",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#1A1A1A",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFF",
  },
  placeholder: {
    width: 40,
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  trackCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1A1A1A",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  trackImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  trackInfo: {
    flex: 1,
  },
  trackTitle: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  trackArtist: {
    color: "#999",
    fontSize: 14,
    marginBottom: 2,
  },
  liveLabel: {
    color: "#FF0080",
    fontSize: 12,
    fontWeight: "600",
  },
  playButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
  },
});