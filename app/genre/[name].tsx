import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft, Play, MoreVertical } from "lucide-react-native";
import { router, useLocalSearchParams } from "expo-router";
import { allTracks } from "@/data/mockData";
import type { Track } from "@/types";

const genreColors: Record<string, string> = {
  "Pop": "#FF0080",
  "Rock": "#8B5CF6",
  "Hip-Hop": "#3B82F6",
  "Electronic": "#10B981",
  "Jazz": "#F59E0B",
  "Classical": "#EF4444",
  "R&B": "#EC4899",
  "Country": "#6366F1",
  "Latin": "#F97316",
  "Indie": "#06B6D4",
  "Metal": "#DC2626",
  "Reggae": "#16A34A",
  "Afro Beat": "#EA580C",
  "Afro Beats": "#D97706",
  "High Life": "#CA8A04",
};

// Mock function to filter tracks by genre
const getTracksByGenre = (genreName: string): Track[] => {
  // For demo purposes, return a subset of tracks
  // In a real app, tracks would have genre metadata
  const genreTrackMap: Record<string, Track[]> = {
    "Pop": allTracks.filter(track => 
      track.artist?.includes("Ariana Grande") || 
      track.artist?.includes("Katy Perry") ||
      track.title?.includes("Firework") ||
      track.title?.includes("7 rings")
    ).slice(0, 10),
    "Rock": allTracks.filter(track => 
      track.title?.includes("Thunder") ||
      track.title?.includes("Mountain") ||
      track.artist?.includes("Lightning Strike")
    ).slice(0, 8),
    "Hip-Hop": allTracks.filter(track => 
      track.title?.includes("Starboy") ||
      track.artist?.includes("The Weeknd") ||
      track.title?.includes("Blinding Lights")
    ).slice(0, 12),
    "Electronic": allTracks.filter(track => 
      track.title?.includes("Electric") ||
      track.title?.includes("Future Bass") ||
      track.artist?.includes("Neon Waves")
    ).slice(0, 9),
    "Jazz": allTracks.filter(track => 
      track.title?.includes("Jazz") ||
      track.artist?.includes("Blue Note")
    ).slice(0, 6),
  };

  return genreTrackMap[genreName] || allTracks.slice(0, 8);
};

export default function GenreScreen() {
  const { name } = useLocalSearchParams<{ name: string }>();
  const genreName = Array.isArray(name) ? name[0] : name || "";
  const decodedGenreName = decodeURIComponent(genreName);
  
  const tracks = getTracksByGenre(decodedGenreName);
  const genreColor = genreColors[decodedGenreName] || "#8B5CF6";

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const renderTrack = ({ item, index }: { item: Track; index: number }) => (
    <TouchableOpacity
      style={styles.trackItem}
      activeOpacity={0.7}
      testID={`track-${item.id}`}
      onPress={() => {
        console.log("Playing track:", item.title);
        // Navigate to player or start playback
      }}
    >
      <View style={styles.trackNumber}>
        <Text style={styles.trackNumberText}>{index + 1}</Text>
      </View>
      
      <Image source={{ uri: item.artwork }} style={styles.trackArtwork} />
      
      <View style={styles.trackInfo}>
        <Text style={styles.trackTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.trackArtist} numberOfLines={1}>
          {item.artist}
        </Text>
      </View>
      
      <Text style={styles.trackDuration}>
        {formatDuration(item.duration)}
      </Text>
      
      <TouchableOpacity style={styles.moreButton} testID={`more-${item.id}`}>
        <MoreVertical size={20} color="#B3B3B3" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

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
        <Text style={styles.title}>{decodedGenreName}</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Genre Header */}
        <View style={[styles.genreHeader, { backgroundColor: genreColor }]}>
          <View style={styles.genreHeaderContent}>
            <Text style={styles.genreTitle}>{decodedGenreName}</Text>
            <Text style={styles.genreSubtitle}>
              {tracks.length} {tracks.length === 1 ? 'track' : 'tracks'}
            </Text>
            
            <TouchableOpacity 
              style={styles.playAllButton}
              activeOpacity={0.8}
              testID="play-all-button"
              onPress={() => console.log("Playing all", decodedGenreName, "tracks")}
            >
              <Play size={20} color="#FFF" fill="#FFF" />
              <Text style={styles.playAllText}>Play All</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Tracks List */}
        <View style={styles.tracksSection}>
          <Text style={styles.sectionTitle}>Popular in {decodedGenreName}</Text>
          
          <FlatList
            data={tracks}
            renderItem={renderTrack}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            contentContainerStyle={styles.tracksList}
          />
        </View>
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
  genreHeader: {
    marginHorizontal: 20,
    borderRadius: 16,
    marginBottom: 24,
    overflow: "hidden",
  },
  genreHeaderContent: {
    padding: 24,
  },
  genreTitle: {
    fontSize: 32,
    fontWeight: "800",
    color: "#FFF",
    marginBottom: 4,
  },
  genreSubtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
    marginBottom: 20,
  },
  playAllButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    alignSelf: "flex-start",
  },
  playAllText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  tracksSection: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#FFF",
    marginBottom: 16,
  },
  tracksList: {
    gap: 8,
  },
  trackItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 4,
  },
  trackNumber: {
    width: 24,
    alignItems: "center",
    marginRight: 16,
  },
  trackNumberText: {
    fontSize: 16,
    color: "#B3B3B3",
    fontWeight: "500",
  },
  trackArtwork: {
    width: 48,
    height: 48,
    borderRadius: 8,
    marginRight: 12,
  },
  trackInfo: {
    flex: 1,
    marginRight: 12,
  },
  trackTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFF",
    marginBottom: 2,
  },
  trackArtist: {
    fontSize: 14,
    color: "#B3B3B3",
  },
  trackDuration: {
    fontSize: 14,
    color: "#B3B3B3",
    marginRight: 12,
    minWidth: 40,
    textAlign: "right",
  },
  moreButton: {
    padding: 8,
  },
});