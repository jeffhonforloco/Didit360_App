import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from "react-native";
import { Stack, router } from "expo-router";
import { ArrowLeft, Search, MoreHorizontal, Play } from "lucide-react-native";
import { usePlayer } from "@/contexts/PlayerContext";
import { useUser } from "@/contexts/UserContext";
import { historyTracks, historyPodcasts } from "@/data/mockData";
import type { Track } from "@/types";

function formatDuration(seconds: number): string {
  if (seconds >= 3600) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}:${minutes.toString().padStart(2, "0")} mins`;
  }
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

interface TrackItemProps {
  track: Track;
  onPlay: (track: Track) => void;
}

function TrackItem({ track, onPlay }: TrackItemProps) {
  const { settings } = useUser();
  const accentColor = settings?.accentColor ?? "#FF0080";

  return (
    <TouchableOpacity
      style={styles.trackItem}
      onPress={() => onPlay(track)}
      testID={`track-${track.id}`}
    >
      <Image source={{ uri: track.artwork }} style={styles.trackArtwork} />
      <View style={styles.trackInfo}>
        <Text style={styles.trackTitle} numberOfLines={1}>
          {track.title}
        </Text>
        <Text style={styles.trackArtist} numberOfLines={1}>
          {track.artist}
        </Text>
      </View>
      <View style={styles.trackActions}>
        <TouchableOpacity
          style={[styles.playButton, { backgroundColor: accentColor }]}
          onPress={() => onPlay(track)}
          testID={`play-${track.id}`}
        >
          <Play size={16} color="white" fill="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.moreButton} testID={`more-${track.id}`}>
          <MoreHorizontal size={20} color="#666" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

interface PodcastItemProps {
  podcast: Track;
  onPlay: (track: Track) => void;
}

function PodcastItem({ podcast, onPlay }: PodcastItemProps) {
  const { settings } = useUser();
  const accentColor = settings?.accentColor ?? "#FF0080";

  return (
    <TouchableOpacity
      style={styles.podcastItem}
      onPress={() => onPlay(podcast)}
      testID={`podcast-${podcast.id}`}
    >
      <Image source={{ uri: podcast.artwork }} style={styles.podcastArtwork} />
      <View style={styles.podcastInfo}>
        <Text style={styles.podcastTitle} numberOfLines={2}>
          {podcast.title}
        </Text>
        <Text style={styles.podcastArtist} numberOfLines={1}>
          {podcast.artist} | {formatDuration(podcast.duration)}
        </Text>
        <View style={styles.podcastActions}>
          <TouchableOpacity style={styles.podcastActionButton}>
            <Text style={[styles.podcastActionText, { color: accentColor }]}>
              ♥
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.podcastActionButton}>
            <Text style={styles.podcastActionText}>⚡</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.podcastActionButton}>
            <Text style={styles.podcastActionText}>⏰</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.moreButton}>
            <MoreHorizontal size={16} color="#666" />
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity
        style={[styles.playButton, { backgroundColor: accentColor }]}
        onPress={() => onPlay(podcast)}
        testID={`play-podcast-${podcast.id}`}
      >
        <Play size={16} color="white" fill="white" />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

export default function HistoryScreen() {
  const [activeTab, setActiveTab] = useState<"Songs" | "Podcasts">("Songs");
  const { playTrack } = usePlayer();
  const { settings } = useUser();
  const accentColor = settings?.accentColor ?? "#FF0080";

  const handlePlayTrack = (track: Track) => {
    console.log("Playing track:", track.title);
    playTrack(track);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
          testID="back-button"
        >
          <ArrowLeft size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>History</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerButton} testID="search-button">
            <Search size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton} testID="more-button">
            <MoreHorizontal size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === "Songs" && {
              borderBottomColor: accentColor,
              borderBottomWidth: 2,
            },
          ]}
          onPress={() => setActiveTab("Songs")}
          testID="songs-tab"
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "Songs" && { color: accentColor },
            ]}
          >
            Songs
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === "Podcasts" && {
              borderBottomColor: accentColor,
              borderBottomWidth: 2,
            },
          ]}
          onPress={() => setActiveTab("Podcasts")}
          testID="podcasts-tab"
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "Podcasts" && { color: "#666" },
            ]}
          >
            Podcasts
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === "Songs" ? (
          <View style={styles.tracksContainer}>
            {historyTracks.map((track) => (
              <TrackItem
                key={track.id}
                track={track}
                onPlay={handlePlayTrack}
              />
            ))}
          </View>
        ) : (
          <View style={styles.podcastsContainer}>
            {historyPodcasts.map((podcast) => (
              <PodcastItem
                key={podcast.id}
                podcast={podcast}
                onPlay={handlePlayTrack}
              />
            ))}
          </View>
        )}
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
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#1A1A1A",
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "white",
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerButton: {
    padding: 8,
    marginLeft: 8,
  },
  tabContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#1A1A1A",
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: "center",
  },
  tabText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
  },
  content: {
    flex: 1,
  },
  tracksContainer: {
    padding: 16,
  },
  trackItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#1A1A1A",
  },
  trackArtwork: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 12,
  },
  trackInfo: {
    flex: 1,
  },
  trackTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
    marginBottom: 4,
  },
  trackArtist: {
    fontSize: 14,
    color: "#666",
  },
  trackActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  playButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  moreButton: {
    padding: 8,
  },
  podcastsContainer: {
    padding: 16,
  },
  podcastItem: {
    flexDirection: "row",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#1A1A1A",
  },
  podcastArtwork: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  podcastInfo: {
    flex: 1,
    marginRight: 12,
  },
  podcastTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
    marginBottom: 4,
    lineHeight: 20,
  },
  podcastArtist: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  podcastActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  podcastActionButton: {
    marginRight: 16,
  },
  podcastActionText: {
    fontSize: 16,
    color: "#666",
  },
});