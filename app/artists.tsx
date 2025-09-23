import React, { useState, useMemo, useCallback } from "react";
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
import { ArrowLeft, Search, ChevronDown } from "lucide-react-native";
import { router } from "expo-router";
import { usePlayer } from "@/contexts/PlayerContext";
import { featuredContent, topCharts, newReleases, allPodcastEpisodes } from "@/data/mockData";
import type { Track } from "@/types";

type TabType = "singers" | "podcasters";
type SortOption = "recent" | "alpha" | "songs";

type Artist = {
  id: string;
  name: string;
  artwork: string;
  songCount: number;
  type: "singer" | "podcaster";
};

export default function ArtistsScreen() {
  const { playTrack } = usePlayer();
  const [activeTab, setActiveTab] = useState<TabType>("singers");
  const [sortBy, setSortBy] = useState<SortOption>("recent");

  const artists = useMemo<Artist[]>(() => {
    const byArtist: Record<string, Artist> = {};
    
    // Process songs
    [...featuredContent, ...topCharts, ...newReleases].forEach((track) => {
      if (!byArtist[track.artist]) {
        byArtist[track.artist] = {
          id: track.artist,
          name: track.artist,
          artwork: track.artwork,
          songCount: 0,
          type: "singer"
        };
      }
      byArtist[track.artist].songCount++;
    });
    
    // Process podcasts
    allPodcastEpisodes.forEach((episode) => {
      if (!byArtist[episode.artist]) {
        byArtist[episode.artist] = {
          id: episode.artist,
          name: episode.artist,
          artwork: episode.artwork,
          songCount: 0,
          type: "podcaster"
        };
      }
      byArtist[episode.artist].songCount++;
    });
    
    const artistList = Object.values(byArtist);
    const filtered = artistList.filter(artist => 
      activeTab === "singers" ? artist.type === "singer" : artist.type === "podcaster"
    );
    
    // Sort artists
    switch (sortBy) {
      case "alpha":
        return filtered.sort((a, b) => a.name.localeCompare(b.name));
      case "songs":
        return filtered.sort((a, b) => b.songCount - a.songCount);
      default:
        return filtered;
    }
  }, [activeTab, sortBy]);

  const sortOptions = [
    { id: "recent" as const, label: "Recently Downloaded" },
    { id: "alpha" as const, label: "A-Z" },
    { id: "songs" as const, label: "Songs" },
  ];

  const handleArtistPress = useCallback((artist: Artist) => {
    router.push(`/artist/${artist.id}`);
  }, []);

  const renderArtist = useCallback(({ item }: { item: Artist }) => (
    <TouchableOpacity
      style={styles.artistCard}
      onPress={() => handleArtistPress(item)}
      activeOpacity={0.8}
      testID={`artist-${item.id}`}
    >
      <View style={styles.artistImageWrap}>
        <Image source={{ uri: item.artwork }} style={styles.artistImage} />
      </View>
      <Text style={styles.artistName} numberOfLines={1}>
        {item.name}
      </Text>
      <Text style={styles.artistInfo} numberOfLines={1}>
        {item.songCount} {item.type === "podcaster" ? "Episodes" : "Songs"}
      </Text>
    </TouchableOpacity>
  ), [handleArtistPress]);

  const currentSort = sortOptions.find(s => s.id === sortBy)?.label || "Recently Downloaded";

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
        <Text style={styles.title}>Artists</Text>
        <TouchableOpacity style={styles.searchButton} testID="search-button">
          <Search size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "singers" && styles.activeTab]}
          onPress={() => setActiveTab("singers")}
          testID="singers-tab"
        >
          <Text style={[styles.tabText, activeTab === "singers" && styles.activeTabText]}>
            Singers
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "podcasters" && styles.activeTab]}
          onPress={() => setActiveTab("podcasters")}
          testID="podcasters-tab"
        >
          <Text style={[styles.tabText, activeTab === "podcasters" && styles.activeTabText]}>
            Podcasters
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.sortRow}>
        <Text style={styles.sortLabel}>Sort by</Text>
        <TouchableOpacity
          style={styles.sortButton}
          onPress={() => {
            const currentIndex = sortOptions.findIndex(s => s.id === sortBy);
            const nextIndex = (currentIndex + 1) % sortOptions.length;
            setSortBy(sortOptions[nextIndex].id);
          }}
          testID="sort-button"
        >
          <Text style={styles.sortText}>{currentSort}</Text>
          <ChevronDown size={16} color="#E91E63" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <FlatList
          data={artists}
          renderItem={renderArtist}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.row}
          scrollEnabled={false}
          contentContainerStyle={styles.grid}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B0B0C",
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
    backgroundColor: "#18181B",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFF",
  },
  searchButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#18181B",
    justifyContent: "center",
    alignItems: "center",
  },
  tabsContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  activeTab: {
    borderBottomColor: "#E91E63",
  },
  tabText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#9CA3AF",
  },
  activeTabText: {
    color: "#FFF",
  },
  sortRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  sortLabel: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
  sortButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  sortText: {
    color: "#E91E63",
    fontSize: 14,
    fontWeight: "600",
  },
  grid: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  row: {
    justifyContent: "space-between",
  },
  artistCard: {
    width: "48%",
    marginBottom: 20,
    alignItems: "center",
  },
  artistImageWrap: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 50,
    overflow: "hidden",
    marginBottom: 8,
  },
  artistImage: {
    width: "100%",
    height: "100%",
  },
  artistName: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
    textAlign: "center",
  },
  artistInfo: {
    color: "#9CA3AF",
    fontSize: 12,
    textAlign: "center",
  },
});