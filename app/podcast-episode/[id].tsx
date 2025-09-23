import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import {
  ArrowLeft,
  MoreVertical,
  Heart,
  Play,
  Pause,
  Share2,
} from "lucide-react-native";
import { router, useLocalSearchParams } from "expo-router";
import { usePlayer } from "@/contexts/PlayerContext";
import { useLibrary } from "@/contexts/LibraryContext";
import { allPodcastEpisodes } from "@/data/mockData";

export default function PodcastEpisodeScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { currentTrack, isPlaying, togglePlayPause, playTrack } = usePlayer();
  const { toggleFavorite, isFavorite } = useLibrary();

  const episode = allPodcastEpisodes.find(ep => ep.id === id) || currentTrack;

  if (!episode) {
    router.back();
    return null;
  }

  const isLiked = isFavorite(episode.id);

  const episodeDescription = "Shaquille O'Neal (@SHAQ) has been retired from basketball for years, but he's still got his irons in plenty of fires. Here, we'll discuss everything from superheroes to law enforcement to business to sports to podcasting to — yes — the Flat Earth Theory.\n\nWhat We Discuss with Shaquille O'Neal:\n\n• The real-world experience Shaq endured preparing for a political race in 2020\n• How Shaq assembled for a political race in 2020. The Panel to help manage not only his career but all his important life decisions — and how you can do the same.\n• Why Shaq doesn't consider himself a celebrity (and why that still isn't a good reason to bug him in the middle of dinner).\n• How Shaq manages his emotions so he stays non-reactive on and off the court.\n• Does Shaq really believe in the Flat Earth Theory?";

  return (
    <LinearGradient
      colors={["#1A1A2E", "#16213E", "#0F0F23"]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()}>
              <ArrowLeft size={24} color="#FFF" />
            </TouchableOpacity>
            <View style={styles.headerCenter}>
              <Text style={styles.headerSubtitle}>The Jordan Harbinger Show</Text>
              <Text style={styles.headerTitle}>Jordan Harbinger</Text>
            </View>
            <TouchableOpacity>
              <MoreVertical size={24} color="#FFF" />
            </TouchableOpacity>
          </View>

          {/* Episode Info */}
          <View style={styles.episodeInfo}>
            <Text style={styles.episodeDate}>1 day ago | 48:26 mins</Text>
            <Text style={styles.episodeTitle}>
              691: Shaquille O&apos;Neal | Circling Back on Flat Earth Theory
            </Text>
            
            <View style={styles.actionButtons}>
              <TouchableOpacity 
                style={styles.playButton}
                onPress={() => {
                  if (currentTrack?.id !== episode.id) {
                    playTrack(episode);
                  } else {
                    togglePlayPause();
                  }
                }}
              >
                {isPlaying && currentTrack?.id === episode.id ? (
                  <Pause size={24} color="#FFF" fill="#FFF" />
                ) : (
                  <Play size={24} color="#FFF" fill="#FFF" style={styles.playIcon} />
                )}
                <Text style={styles.playButtonText}>Play</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.iconButton}
                onPress={() => toggleFavorite(episode)}
              >
                <Heart
                  size={20}
                  color={isLiked ? "#FF0080" : "#FFF"}
                  fill={isLiked ? "#FF0080" : "transparent"}
                />
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.iconButton}>
                <Share2 size={20} color="#FFF" />
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.iconButton}>
                <MoreVertical size={20} color="#FFF" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Episode Description */}
          <View style={styles.descriptionSection}>
            <Text style={styles.descriptionText}>
              {episodeDescription}
            </Text>
          </View>

          <View style={styles.bottomSpacer} />
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerCenter: {
    alignItems: "center",
  },
  headerSubtitle: {
    fontSize: 12,
    color: "#999",
    marginBottom: 2,
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFF",
  },
  episodeInfo: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  episodeDate: {
    fontSize: 14,
    color: "#999",
    marginBottom: 12,
  },
  episodeTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FFF",
    lineHeight: 32,
    marginBottom: 24,
  },
  actionButtons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  playButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E91E63",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    gap: 8,
  },
  playIcon: {
    marginLeft: 2,
  },
  playButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
  iconButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  descriptionSection: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  descriptionText: {
    fontSize: 16,
    color: "#CCC",
    lineHeight: 24,
  },
  bottomSpacer: {
    height: 100,
  },
});