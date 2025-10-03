import React, { useState, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  FlatList,
  ScrollView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ArrowLeft,
  Search,
  MoreHorizontal,
  Play,
  Heart,
  Plus,
  X,
  ChevronDown,
} from "lucide-react-native";
import { router } from "expo-router";
import { usePlayer } from "@/contexts/PlayerContext";
import { likedPodcasts, queuePodcasts, downloadedPodcasts } from "@/data/mockData";
import type { Track } from "@/types";

type TabId = "your-likes" | "queue" | "downloaded";
type SortOption = "recently-added" | "alphabetical" | "artist";

const formatDuration = (seconds: number): string => {
  if (seconds >= 3600) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}:${minutes.toString().padStart(2, "0")} hrs`;
  }
  const minutes = Math.floor(seconds / 60);
  return `${minutes} mins`;
};

export default function PodcastsScreen() {
  const [activeTab, setActiveTab] = useState<TabId>("your-likes");
  const [sortBy, setSortBy] = useState<SortOption>("recently-added");
  const [showMenu, setShowMenu] = useState<string | null>(null);
  const { playTrack } = usePlayer();
  
  console.log('[PodcastsScreen] Rendering with data:', {
    likedPodcasts: likedPodcasts?.length || 0,
    queuePodcasts: queuePodcasts?.length || 0,
    downloadedPodcasts: downloadedPodcasts?.length || 0,
    activeTab,
    platform: Platform.OS
  });

  const tabs = [
    { id: "your-likes" as TabId, label: "Your Likes" },
    { id: "queue" as TabId, label: "Queue" },
    { id: "downloaded" as TabId, label: "Downloaded" },
  ];

  const getCurrentData = (): Track[] => {
    switch (activeTab) {
      case "your-likes":
        return likedPodcasts || [];
      case "queue":
        return queuePodcasts || [];
      case "downloaded":
        return downloadedPodcasts || [];
      default:
        return likedPodcasts || [];
    }
  };

  const sortedData = [...getCurrentData()].sort((a, b) => {
    switch (sortBy) {
      case "alphabetical":
        return a.title.localeCompare(b.title);
      case "artist":
        return a.artist.localeCompare(b.artist);
      case "recently-added":
      default:
        return 0;
    }
  });

  const handleSortChange = () => {
    const options: SortOption[] = ["recently-added", "alphabetical", "artist"];
    const currentIndex = options.indexOf(sortBy);
    const nextIndex = (currentIndex + 1) % options.length;
    setSortBy(options[nextIndex]);
  };

  const getSortLabel = () => {
    switch (sortBy) {
      case "recently-added":
        return "Recently Added";
      case "alphabetical":
        return "A-Z";
      case "artist":
        return "Artist";
      default:
        return "Recently Added";
    }
  };

  const renderPodcastItem = useCallback(
    ({ item }: { item: Track }) => (
      <TouchableOpacity
        style={styles.podcastItem}
        onPress={() => playTrack(item)}
        activeOpacity={0.8}
      >
        <View style={styles.podcastArtworkContainer}>
          <Image source={{ uri: item.artwork }} style={styles.podcastArtwork} />
        </View>
        
        <View style={styles.podcastInfo}>
          <Text style={styles.podcastTitle} numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={styles.podcastArtist} numberOfLines={1}>
            {item.artist}
          </Text>
          <Text style={styles.podcastDuration}>
            {formatDuration(item.duration)}
          </Text>
        </View>

        <View style={styles.podcastActions}>
          <TouchableOpacity style={styles.actionButton}>
            <Heart size={20} color="#FF0080" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Plus size={20} color="#9CA3AF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <X size={20} color="#9CA3AF" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => setShowMenu(showMenu === item.id ? null : item.id)}
          >
            <MoreHorizontal size={20} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.playButton} onPress={() => playTrack(item)}>
          <Play size={16} color="#FFF" fill="#FFF" />
        </TouchableOpacity>

        {showMenu === item.id && (
          <View style={styles.contextMenu}>
            <TouchableOpacity style={styles.menuItem}>
              <Heart size={16} color="#FFF" />
              <Text style={styles.menuText}>Like</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem}>
              <Plus size={16} color="#FFF" />
              <Text style={styles.menuText}>Add to Playlist</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem}>
              <X size={16} color="#FFF" />
              <Text style={styles.menuText}>Don&apos;t Play This</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem}>
              <MoreHorizontal size={16} color="#FFF" />
              <Text style={styles.menuText}>View Show</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem}>
              <MoreHorizontal size={16} color="#FFF" />
              <Text style={styles.menuText}>Share</Text>
            </TouchableOpacity>
          </View>
        )}
      </TouchableOpacity>
    ),
    [playTrack, showMenu]
  );

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.title}>VoxSaga</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerButton}>
            <Search size={24} color="#FFF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <MoreHorizontal size={24} color="#FFF" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsContainer}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[
              styles.tab,
              activeTab === tab.id && styles.activeTab,
            ]}
            onPress={() => setActiveTab(tab.id)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab.id && styles.activeTabText,
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.sortContainer}>
        <Text style={styles.sortLabel}>Sort by</Text>
        <TouchableOpacity style={styles.sortButton} onPress={handleSortChange}>
          <Text style={styles.sortText}>{getSortLabel()}</Text>
          <ChevronDown size={16} color="#FF0080" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={sortedData}
        renderItem={renderPodcastItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.podcastsList}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {activeTab === "your-likes" ? "No liked podcasts yet" :
               activeTab === "queue" ? "No podcasts in queue" :
               "No downloaded podcasts"}
            </Text>
            <Text style={styles.emptySubtext}>
              {activeTab === "your-likes" ? "Like some podcasts to see them here" :
               activeTab === "queue" ? "Add podcasts to your queue" :
               "Download podcasts for offline listening"}
            </Text>
          </View>
        )}
      />
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
    paddingVertical: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFF",
    flex: 1,
    textAlign: "center",
    marginHorizontal: 16,
  },
  headerActions: {
    flexDirection: "row",
    gap: 8,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  tabsContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: "#1F2937",
    borderWidth: 1,
    borderColor: "#374151",
  },
  activeTab: {
    backgroundColor: "#FF0080",
    borderColor: "#FF0080",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#9CA3AF",
  },
  activeTabText: {
    color: "#FFF",
  },
  sortContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  sortLabel: {
    fontSize: 16,
    color: "#FFF",
    fontWeight: "600",
  },
  sortButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  sortText: {
    fontSize: 16,
    color: "#FF0080",
    fontWeight: "600",
  },
  podcastsList: {
    paddingBottom: 100,
  },
  podcastItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    position: "relative",
  },
  podcastArtworkContainer: {
    marginRight: 12,
  },
  podcastArtwork: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  podcastInfo: {
    flex: 1,
    marginRight: 12,
  },
  podcastTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFF",
    marginBottom: 4,
    lineHeight: 20,
  },
  podcastArtist: {
    fontSize: 14,
    color: "#9CA3AF",
    marginBottom: 4,
  },
  podcastDuration: {
    fontSize: 12,
    color: "#6B7280",
  },
  podcastActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginRight: 12,
  },
  actionButton: {
    padding: 4,
  },
  menuButton: {
    padding: 4,
  },
  playButton: {
    backgroundColor: "#FF0080",
    borderRadius: 20,
    padding: 8,
  },
  contextMenu: {
    position: "absolute",
    top: 60,
    right: 20,
    backgroundColor: "#1F2937",
    borderRadius: 12,
    paddingVertical: 8,
    minWidth: 200,
    zIndex: 1000,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  menuText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "500",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 8,
  },
  emptySubtext: {
    color: "#999",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
});