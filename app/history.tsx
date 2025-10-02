import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, router } from "expo-router";
import { 
  ArrowLeft, 
  Search, 
  MoreVertical, 
  Play, 
  Trash2,
  Clock,
  Calendar,
  Music,
  Mic,
  Video,
  Heart,
  Plus,
  Download,
  Share,
} from "lucide-react-native";
import { usePlayer } from "@/contexts/PlayerContext";
import { useUser } from "@/contexts/UserContext";
import { useLibrary } from "@/contexts/LibraryContext";
import { historyTracks, historyPodcasts } from "@/data/mockData";
import type { Track } from "@/types";

function formatDuration(seconds: number): string {
  if (seconds >= 3600) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  }
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

function formatDate(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
  return date.toLocaleDateString();
}

interface GroupedHistory {
  date: string;
  tracks: (Track & { playedAt: Date })[];
}

export default function HistoryScreen() {
  const [activeTab, setActiveTab] = useState<"all" | "songs" | "podcasts" | "videos">("all");
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);
  const { playTrack } = usePlayer();
  const { settings } = useUser();
  const { isFavorite, toggleFavorite } = useLibrary();
  const accentColor = settings?.accentColor ?? "#E91E63";

  const allHistory = [
    ...historyTracks.map(t => ({ ...t, playedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000) })),
    ...historyPodcasts.map(t => ({ ...t, playedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000) })),
  ].sort((a, b) => b.playedAt.getTime() - a.playedAt.getTime());

  const filteredHistory = allHistory.filter(track => {
    if (activeTab === "all") return true;
    if (activeTab === "songs") return track.type === "song";
    if (activeTab === "podcasts") return track.type === "podcast";
    if (activeTab === "videos") return track.type === "video" || track.isVideo;
    return true;
  });

  const groupedHistory: GroupedHistory[] = [];
  filteredHistory.forEach(track => {
    const dateStr = formatDate(track.playedAt);
    let group = groupedHistory.find(g => g.date === dateStr);
    if (!group) {
      group = { date: dateStr, tracks: [] };
      groupedHistory.push(group);
    }
    group.tracks.push(track);
  });

  const handlePlayTrack = useCallback((track: Track) => {
    playTrack(track);
  }, [playTrack]);

  const handleMorePress = useCallback((track: Track) => {
    setSelectedTrack(track);
  }, []);

  const handleAddToPlaylist = useCallback(() => {
    if (selectedTrack) {
      Alert.alert("Add to Playlist", `"${selectedTrack.title}" added to playlist`);
      setSelectedTrack(null);
    }
  }, [selectedTrack]);

  const handleDownload = useCallback(() => {
    if (selectedTrack) {
      Alert.alert("Download", `Downloading "${selectedTrack.title}"`);
      setSelectedTrack(null);
    }
  }, [selectedTrack]);

  const handleShare = useCallback(() => {
    if (selectedTrack) {
      Alert.alert("Share", `Sharing "${selectedTrack.title}"`);
      setSelectedTrack(null);
    }
  }, [selectedTrack]);

  const handleRemoveFromHistory = useCallback(() => {
    if (selectedTrack) {
      Alert.alert(
        "Remove from History",
        `Remove "${selectedTrack.title}" from your history?`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Remove",
            style: "destructive",
            onPress: () => {
              console.log("Removing from history:", selectedTrack.id);
              setSelectedTrack(null);
            }
          }
        ]
      );
    }
  }, [selectedTrack]);

  const handleClearHistory = useCallback(() => {
    Alert.alert(
      "Clear History",
      "Are you sure you want to clear all your listening history?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear All",
          style: "destructive",
          onPress: () => {
            console.log("Clearing all history");
          }
        }
      ]
    );
  }, []);

  const getTrackIcon = (track: Track) => {
    if (track.type === "video" || track.isVideo) return <Video size={16} color={accentColor} />;
    if (track.type === "podcast") return <Mic size={16} color={accentColor} />;
    return <Music size={16} color={accentColor} />;
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
          testID="back-button"
        >
          <ArrowLeft size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>History</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={styles.iconButton} 
            testID="search-button"
            onPress={() => router.push('/search')}
          >
            <Search size={22} color="white" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.iconButton}
            onPress={handleClearHistory}
            testID="clear-button"
          >
            <Trash2 size={22} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.tabContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabScroll}
        >
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === "all" && { backgroundColor: accentColor },
            ]}
            onPress={() => setActiveTab("all")}
            testID="all-tab"
          >
            <Clock size={18} color={activeTab === "all" ? "#FFF" : "#9CA3AF"} />
            <Text
              style={[
                styles.tabText,
                activeTab === "all" && { color: "#FFF" },
              ]}
            >
              All
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === "songs" && { backgroundColor: accentColor },
            ]}
            onPress={() => setActiveTab("songs")}
            testID="songs-tab"
          >
            <Music size={18} color={activeTab === "songs" ? "#FFF" : "#9CA3AF"} />
            <Text
              style={[
                styles.tabText,
                activeTab === "songs" && { color: "#FFF" },
              ]}
            >
              Songs
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === "podcasts" && { backgroundColor: accentColor },
            ]}
            onPress={() => setActiveTab("podcasts")}
            testID="podcasts-tab"
          >
            <Mic size={18} color={activeTab === "podcasts" ? "#FFF" : "#9CA3AF"} />
            <Text
              style={[
                styles.tabText,
                activeTab === "podcasts" && { color: "#FFF" },
              ]}
            >
              Podcasts
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === "videos" && { backgroundColor: accentColor },
            ]}
            onPress={() => setActiveTab("videos")}
            testID="videos-tab"
          >
            <Video size={18} color={activeTab === "videos" ? "#FFF" : "#9CA3AF"} />
            <Text
              style={[
                styles.tabText,
                activeTab === "videos" && { color: "#FFF" },
              ]}
            >
              Videos
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {groupedHistory.map((group, groupIndex) => (
          <View key={`group-${groupIndex}`} style={styles.historyGroup}>
            <View style={styles.dateHeader}>
              <Calendar size={16} color="#9CA3AF" />
              <Text style={styles.dateText}>{group.date}</Text>
            </View>
            
            {group.tracks.map((track, trackIndex) => (
              <TouchableOpacity
                key={`${track.id}-${trackIndex}`}
                style={styles.trackCard}
                onPress={() => handlePlayTrack(track)}
                activeOpacity={0.7}
                testID={`track-${track.id}`}
              >
                <View style={styles.trackArtworkWrap}>
                  <Image source={{ uri: track.artwork }} style={styles.trackArtwork} />
                  {(track.type === "video" || track.isVideo) && (
                    <View style={styles.videoOverlay}>
                      <Video size={20} color="#FFF" />
                    </View>
                  )}
                </View>
                
                <View style={styles.trackInfo}>
                  <View style={styles.trackTitleRow}>
                    {getTrackIcon(track)}
                    <Text style={styles.trackTitle} numberOfLines={1}>
                      {track.title}
                    </Text>
                  </View>
                  <Text style={styles.trackArtist} numberOfLines={1}>
                    {track.artist}
                  </Text>
                  <Text style={styles.trackMeta}>
                    {formatDuration(track.duration)} • {track.playedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Text>
                </View>
                
                <View style={styles.trackActions}>
                  <TouchableOpacity
                    style={styles.favoriteButton}
                    onPress={(e) => {
                      e.stopPropagation();
                      toggleFavorite(track);
                    }}
                    testID={`favorite-${track.id}`}
                  >
                    <Heart 
                      size={20} 
                      color={isFavorite(track.id) ? accentColor : "#6B7280"} 
                      fill={isFavorite(track.id) ? accentColor : "none"}
                    />
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[styles.playButton, { backgroundColor: accentColor }]}
                    onPress={(e) => {
                      e.stopPropagation();
                      handlePlayTrack(track);
                    }}
                    testID={`play-${track.id}`}
                  >
                    <Play size={16} color="#FFF" fill="#FFF" />
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={styles.moreButton}
                    onPress={(e) => {
                      e.stopPropagation();
                      handleMorePress(track);
                    }}
                    testID={`more-${track.id}`}
                  >
                    <MoreVertical size={18} color="#9CA3AF" />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ))}
        
        {filteredHistory.length === 0 && (
          <View style={styles.emptyState}>
            <Clock size={64} color="#3A3A3A" />
            <Text style={styles.emptyTitle}>No History Yet</Text>
            <Text style={styles.emptyText}>
              Your listening history will appear here
            </Text>
          </View>
        )}
      </ScrollView>

      <Modal
        visible={selectedTrack !== null}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedTrack(null)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setSelectedTrack(null)}
        >
          <View style={styles.contextMenu}>
            {selectedTrack && (
              <View style={styles.contextHeader}>
                <Image source={{ uri: selectedTrack.artwork }} style={styles.contextArtwork} />
                <View style={styles.contextHeaderInfo}>
                  <Text style={styles.contextTitle} numberOfLines={1}>
                    {selectedTrack.title}
                  </Text>
                  <Text style={styles.contextArtist} numberOfLines={1}>
                    {selectedTrack.artist}
                  </Text>
                </View>
              </View>
            )}
            
            <View style={styles.menuDivider} />
            
            <TouchableOpacity 
              style={styles.menuItem} 
              onPress={() => {
                if (selectedTrack) {
                  toggleFavorite(selectedTrack);
                  setSelectedTrack(null);
                }
              }}
            >
              <Heart 
                size={22} 
                color={selectedTrack && isFavorite(selectedTrack.id) ? accentColor : "#FFF"} 
                fill={selectedTrack && isFavorite(selectedTrack.id) ? accentColor : "none"}
              />
              <Text style={styles.menuText}>
                {selectedTrack && isFavorite(selectedTrack.id) ? "Remove from Favorites" : "Add to Favorites"}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.menuItem} onPress={handleAddToPlaylist}>
              <Plus size={22} color="#FFF" />
              <Text style={styles.menuText}>Add to Playlist</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.menuItem} onPress={handleDownload}>
              <Download size={22} color="#FFF" />
              <Text style={styles.menuText}>Download</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.menuItem} onPress={handleShare}>
              <Share size={22} color="#FFF" />
              <Text style={styles.menuText}>Share</Text>
            </TouchableOpacity>
            
            <View style={styles.menuDivider} />
            
            <TouchableOpacity style={styles.menuItem} onPress={handleRemoveFromHistory}>
              <Trash2 size={22} color="#EF4444" />
              <Text style={[styles.menuText, { color: "#EF4444" }]}>Remove from History</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
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
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#1A1A1A",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "700" as const,
    color: "#FFF",
    flex: 1,
    textAlign: "center",
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#1A1A1A",
    justifyContent: "center",
    alignItems: "center",
  },
  tabContainer: {
    borderBottomWidth: 1,
    borderBottomColor: "#1A1A1A",
    backgroundColor: "#0F0F0F",
  },
  tabScroll: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  tab: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#1A1A1A",
    marginRight: 8,
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: "#9CA3AF",
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  historyGroup: {
    marginBottom: 24,
  },
  dateHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#0F0F0F",
  },
  dateText: {
    color: "#9CA3AF",
    fontSize: 14,
    fontWeight: "700" as const,
    textTransform: "uppercase",
  },
  trackCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#1A1A1A",
  },
  trackArtworkWrap: {
    width: 64,
    height: 64,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#1A1A1A",
    marginRight: 12,
    position: "relative",
  },
  trackArtwork: {
    width: "100%",
    height: "100%",
  },
  videoOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  trackInfo: {
    flex: 1,
    paddingRight: 8,
  },
  trackTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 4,
  },
  trackTitle: {
    color: "#FFF",
    fontSize: 15,
    fontWeight: "700" as const,
    flex: 1,
  },
  trackArtist: {
    color: "#9CA3AF",
    fontSize: 13,
    fontWeight: "500" as const,
    marginBottom: 2,
  },
  trackMeta: {
    color: "#6B7280",
    fontSize: 12,
    fontWeight: "500" as const,
  },
  trackActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  favoriteButton: {
    padding: 8,
  },
  playButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  moreButton: {
    padding: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 80,
  },
  emptyTitle: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: "700" as const,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    color: "#6B7280",
    fontSize: 14,
    textAlign: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.85)",
    justifyContent: "flex-end",
  },
  contextMenu: {
    backgroundColor: "#1A1A1A",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 40,
    maxHeight: "80%",
  },
  contextHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
  },
  contextArtwork: {
    width: 64,
    height: 64,
    borderRadius: 8,
    marginRight: 16,
  },
  contextHeaderInfo: {
    flex: 1,
  },
  contextTitle: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "700" as const,
    marginBottom: 4,
  },
  contextArtist: {
    color: "#9CA3AF",
    fontSize: 14,
    fontWeight: "500" as const,
  },
  menuDivider: {
    height: 1,
    backgroundColor: "#2A2A2A",
    marginVertical: 8,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 14,
    gap: 16,
  },
  menuText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600" as const,
  },
});
