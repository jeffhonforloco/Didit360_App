import React, { useState, useMemo } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  FlatList,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft, Play, Music2, Video, TrendingUp, Clock, Sparkles } from "lucide-react-native";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { allTracks } from "@/data/mockData";
import { usePlayer } from "@/contexts/PlayerContext";
import type { Track } from "@/types";

type FilterType = "all" | "songs" | "videos" | "podcasts" | "audiobooks";
type SortType = "newest" | "popular" | "alphabetical";

export default function NewReleasesScreen() {
  const { playTrack } = usePlayer();
  const [filter, setFilter] = useState<FilterType>("all");
  const [sortBy, setSortBy] = useState<SortType>("newest");

  const allNewReleases = useMemo(() => {
    return allTracks.slice(0, 50);
  }, []);

  const filteredReleases = useMemo(() => {
    let filtered = allNewReleases.filter((track) => {
      if (filter === "all") return true;
      if (filter === "songs") return track.type === "song";
      if (filter === "videos") return track.type === "video" || track.isVideo;
      if (filter === "podcasts") return track.type === "podcast";
      if (filter === "audiobooks") return track.type === "audiobook";
      return true;
    });

    if (sortBy === "alphabetical") {
      filtered = [...filtered].sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === "popular") {
      filtered = [...filtered].reverse();
    }

    return filtered;
  }, [allNewReleases, filter, sortBy]);

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

  const renderFilterChip = (value: FilterType, label: string, icon?: React.ReactNode) => (
    <TouchableOpacity
      style={[styles.filterButton, filter === value && styles.filterButtonActive]}
      onPress={() => setFilter(value)}
    >
      {icon ? <View>{icon}</View> : null}
      <Text style={[styles.filterText, filter === value && styles.filterTextActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  const renderSortChip = (value: SortType, label: string, icon?: React.ReactNode) => (
    <TouchableOpacity
      style={[styles.sortButton, sortBy === value && styles.sortButtonActive]}
      onPress={() => setSortBy(value)}
    >
      {icon ? <View>{icon}</View> : null}
      <Text style={[styles.sortText, sortBy === value && styles.sortTextActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  const getStats = () => {
    const songs = filteredReleases.filter(t => t.type === "song").length;
    const videos = filteredReleases.filter(t => t.type === "video" || t.isVideo).length;
    const podcasts = filteredReleases.filter(t => t.type === "podcast").length;
    const audiobooks = filteredReleases.filter(t => t.type === "audiobook").length;
    return { songs, videos, podcasts, audiobooks, total: filteredReleases.length };
  };

  const stats = getStats();

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
          <Sparkles size={20} color="#1DB954" />
          <Text style={styles.descriptionText}>
            Fresh tracks and videos just dropped. Be the first to discover what&apos;s new.
          </Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{stats.total}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{stats.songs}</Text>
            <Text style={styles.statLabel}>Songs</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{stats.videos}</Text>
            <Text style={styles.statLabel}>Videos</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{stats.podcasts}</Text>
            <Text style={styles.statLabel}>Podcasts</Text>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Filter by Type</Text>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterContainer}
        >
          {renderFilterChip("all", "All")}
          {renderFilterChip("songs", "Songs", <Music2 size={16} color={filter === "songs" ? "#FFF" : "#B3B3B3"} />)}
          {renderFilterChip("videos", "Videos", <Video size={16} color={filter === "videos" ? "#FFF" : "#B3B3B3"} />)}
          {renderFilterChip("podcasts", "Podcasts")}
          {renderFilterChip("audiobooks", "Audiobooks")}
        </ScrollView>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Sort by</Text>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.sortContainer}
        >
          {renderSortChip("newest", "Newest", <Clock size={14} color={sortBy === "newest" ? "#FFF" : "#999"} />)}
          {renderSortChip("popular", "Popular", <TrendingUp size={14} color={sortBy === "popular" ? "#FFF" : "#999"} />)}
          {renderSortChip("alphabetical", "A-Z")}
        </ScrollView>
      </LinearGradient>

      <FlatList
        data={filteredReleases}
        renderItem={renderTrack}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No releases found</Text>
            <Text style={styles.emptySubtext}>Try adjusting your filters</Text>
          </View>
        }
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
    paddingBottom: 16,
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
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 16,
    gap: 8,
  },
  descriptionText: {
    flex: 1,
    fontSize: 14,
    color: "#E0E0E0",
    lineHeight: 20,
  },
  statsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginHorizontal: 20,
    marginBottom: 16,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "800",
    color: "#1DB954",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#B3B3B3",
    fontWeight: "600",
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  sectionHeader: {
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFF",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  filterContainer: {
    paddingHorizontal: 20,
    paddingBottom: 12,
    gap: 10,
  },
  sortContainer: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    gap: 10,
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    gap: 6,
  },
  filterButtonActive: {
    backgroundColor: "#1DB954",
    borderColor: "#1DB954",
  },
  filterText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#B3B3B3",
  },
  filterTextActive: {
    color: "#FFF",
  },
  sortButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    gap: 6,
  },
  sortButtonActive: {
    backgroundColor: "rgba(29, 185, 84, 0.2)",
    borderColor: "#1DB954",
  },
  sortText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#999",
  },
  sortTextActive: {
    color: "#1DB954",
  },
  listContent: {
    paddingTop: 16,
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFF",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#999",
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
