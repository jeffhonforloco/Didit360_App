import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  FlatList,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ArrowLeft,
  MoreVertical,
  Play,
  Heart,
  Plus,
  Share2,
  Bell,
  Download,
} from "lucide-react-native";
import { router, useLocalSearchParams } from "expo-router";
import { usePlayer } from "@/contexts/PlayerContext";
import { podcastShows, allPodcastEpisodes } from "@/data/mockData";
import type { Track } from "@/types";

export default function PodcastShowScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { playTrack } = usePlayer();
  const [isFollowing, setIsFollowing] = useState(false);

  const show = podcastShows?.find(s => s.id === id);
  const episodes = allPodcastEpisodes?.filter(ep => ep.artist === show?.host) || [];
  
  console.log('[PodcastShowScreen] Rendering:', {
    id,
    show: show?.title || 'Not found',
    episodesCount: episodes.length,
    platform: Platform.OS
  });

  if (!show) {
    router.back();
    return null;
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    return `${mins} mins`;
  };

  const renderEpisode = ({ item }: { item: Track }) => (
    <TouchableOpacity
      style={styles.episodeItem}
      onPress={() => router.push(`/podcast-player?trackId=${item.id}`)}
      activeOpacity={0.8}
    >
      <Image source={{ uri: item.artwork }} style={styles.episodeImage} />
      <View style={styles.episodeInfo}>
        <Text style={styles.episodeTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.episodeArtist} numberOfLines={1}>
          {item.artist} | {formatDuration(item.duration)}
        </Text>
        <View style={styles.episodeActions}>
          <TouchableOpacity style={styles.actionButton}>
            <Heart size={16} color="#999" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Plus size={16} color="#999" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Download size={16} color="#999" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <MoreVertical size={16} color="#999" />
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity
        style={styles.playButton}
        onPress={(e) => {
          e.stopPropagation();
          playTrack(item);
        }}
      >
        <Play size={20} color="#E91E63" fill="#E91E63" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft size={24} color="#FFF" />
          </TouchableOpacity>
          <TouchableOpacity>
            <MoreVertical size={24} color="#FFF" />
          </TouchableOpacity>
        </View>

        {/* Show Info */}
        <View style={styles.showInfo}>
          <Image source={{ uri: show.artwork }} style={styles.showImage} />
          <Text style={styles.showTitle}>{show.title}</Text>
          <Text style={styles.showHost}>{show.host}</Text>
          
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.followButton, isFollowing && styles.followingButton]}
              onPress={() => setIsFollowing(!isFollowing)}
            >
              <Text style={[styles.followButtonText, isFollowing && styles.followingButtonText]}>
                {isFollowing ? 'Following' : 'Follow'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <Bell size={20} color="#FFF" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <Share2 size={20} color="#FFF" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <MoreVertical size={20} color="#FFF" />
            </TouchableOpacity>
          </View>

          <Text style={styles.showDescription}>
            {show.description}
          </Text>
        </View>

        {/* Episodes Section */}
        <View style={styles.episodesSection}>
          <View style={styles.episodesHeader}>
            <Text style={styles.episodesTitle}>Episodes</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={episodes}
            renderItem={renderEpisode}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={() => (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No episodes available</Text>
                <Text style={styles.emptySubtext}>Check back later for new episodes</Text>
              </View>
            )}
          />
        </View>

        <View style={styles.bottomSpacer} />
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
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  showInfo: {
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  showImage: {
    width: 200,
    height: 200,
    borderRadius: 12,
    marginBottom: 20,
  },
  showTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FFF",
    textAlign: "center",
    marginBottom: 8,
  },
  showHost: {
    fontSize: 16,
    color: "#999",
    marginBottom: 24,
  },
  actionButtons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 24,
  },
  followButton: {
    backgroundColor: "#E91E63",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  followingButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#E91E63",
  },
  followButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
  followingButtonText: {
    color: "#E91E63",
  },
  iconButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  showDescription: {
    fontSize: 16,
    color: "#CCC",
    lineHeight: 24,
    textAlign: "center",
  },
  episodesSection: {
    paddingHorizontal: 20,
  },
  episodesHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  episodesTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#FFF",
  },
  seeAllText: {
    fontSize: 16,
    color: "#E91E63",
    fontWeight: "500",
  },
  episodeItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 12,
    gap: 12,
  },
  episodeImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  episodeInfo: {
    flex: 1,
  },
  episodeTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFF",
    marginBottom: 4,
    lineHeight: 22,
  },
  episodeArtist: {
    fontSize: 14,
    color: "#999",
    marginBottom: 12,
  },
  episodeActions: {
    flexDirection: "row",
    gap: 16,
  },
  actionButton: {
    padding: 4,
  },
  playButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(233, 30, 99, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  bottomSpacer: {
    height: 100,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 8,
  },
  emptySubtext: {
    color: "#999",
    fontSize: 14,
    textAlign: "center",
  },
});