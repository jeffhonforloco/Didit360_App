import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft, Play, Music2, Video } from "lucide-react-native";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { newReleases } from "@/data/mockData";
import { usePlayer } from "@/contexts/PlayerContext";
import type { Track } from "@/types";

export default function NewReleasesScreen() {
  const { playTrack } = usePlayer();
  const [filter, setFilter] = useState<"all" | "songs" | "videos">("all");

  const filteredReleases = newReleases.filter((track) => {
    if (filter === "all") return true;
    if (filter === "songs") return track.type === "song";
    if (filter === "videos") return track.type === "video" || track.isVideo;
    return true;
  });

  const handleTrackPress = (track: Track) => {
    if (track.type === "video" || track.isVideo) {
      router.push(`/song/${track.id}`);
    } else {
      playTrack(track);
    }
  };

  const renderTrack = ({ item, index }: { item: Track; index: number }) => {
    const isVideo = item.type === "video" || item.isVideo;

    return (
      <TouchableOpacity
        style={styles.trackItem}
        onPress={() => handleTrackPress(item)}
        activeOpacity={0.7}
        testID={`track-${item.id}`}
      >
        <View style={styles.trackNumber}>
          <Text style={styles.trackNumberText}>{index + 1}</Text>
        </View>

        <View style={styles.artworkContainer}>
          <Image source={{ uri: item.artwork }} style={styles.artwork} />
          {isVideo && (
            <View style={styles.videoOverlay}>
              <Video size={20} color="#FFF" />
            </View>
          )}
        </View>

        <View style={styles.trackInfo}>
          <Text style={styles.trackTitle} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={styles.trackArtist} numberOfLines={1}>
            {item.artist}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.playButton}
          onPress={() => handleTrackPress(item)}
        >
          <Play size={20} color="#FFF" fill="#FFF" />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <LinearGradient
        colors={["#1DB954", "#0B0A14"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 0.3 }}
        style={styles.gradient}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            testID="back-button"
          >
            <ArrowLeft size={24} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.title}>New Releases</Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.description}>
          <Text style={styles.descriptionText}>
            Fresh tracks and videos just dropped. Be the first to discover what&apos;s new.
          </Text>
        </View>

        <View style={styles.filterContainer}>
          <TouchableOpacity
            style={[styles.filterButton, filter === "all" && styles.filterButtonActive]}
            onPress={() => setFilter("all")}
          >
            <Text style={[styles.filterText, filter === "all" && styles.filterTextActive]}>
              All
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterButton, filter === "songs" && styles.filterButtonActive]}
            onPress={() => setFilter("songs")}
          >
            <Music2 size={16} color={filter === "songs" ? "#FFF" : "#B3B3B3"} />
            <Text style={[styles.filterText, filter === "songs" && styles.filterTextActive]}>
              Songs
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.filterButton, filter === "videos" && styles.filterButtonActive]}
            onPress={() => setFilter("videos")}
          >
            <Video size={16} color={filter === "videos" ? "#FFF" : "#B3B3B3"} />
            <Text style={[styles.filterText, filter === "videos" && styles.filterTextActive]}>
              Videos
            </Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <FlatList
        data={filteredReleases}
        renderItem={renderTrack}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B0A14",
  },
  gradient: {
    paddingBottom: 20,
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
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FFF",
  },
  placeholder: {
    width: 40,
  },
  description: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  descriptionText: {
    fontSize: 15,
    color: "#E0E0E0",
    lineHeight: 22,
    textAlign: "center",
  },
  filterContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 12,
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    gap: 6,
  },
  filterButtonActive: {
    backgroundColor: "#1DB954",
  },
  filterText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#B3B3B3",
  },
  filterTextActive: {
    color: "#FFF",
  },
  listContent: {
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  trackItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 12,
  },
  trackNumber: {
    width: 24,
    alignItems: "center",
  },
  trackNumberText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#B3B3B3",
  },
  artworkContainer: {
    position: "relative",
  },
  artwork: {
    width: 56,
    height: 56,
    borderRadius: 8,
  },
  videoOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  trackInfo: {
    flex: 1,
  },
  trackTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFF",
    marginBottom: 4,
  },
  trackArtist: {
    fontSize: 14,
    color: "#B3B3B3",
  },
  playButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#1DB954",
    justifyContent: "center",
    alignItems: "center",
  },
});
