import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  Alert,
  ActivityIndicator,
  RefreshControl,
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
  TrendingUp,
  Filter,
  X,
  BookOpen,
} from "lucide-react-native";
import { usePlayer } from "@/contexts/PlayerContext";
import { useUser } from "@/contexts/UserContext";
import { useLibrary } from "@/contexts/LibraryContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
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

interface HistoryEntry {
  track: Track;
  playedAt: Date;
  playCount: number;
  lastPosition?: number;
  completed: boolean;
}

interface GroupedHistory {
  date: string;
  entries: HistoryEntry[];
}

type SortOption = "recent" | "frequent" | "duration" | "alphabetical";
type FilterOption = "all" | "songs" | "podcasts" | "videos" | "audiobooks";

const HISTORY_STORAGE_KEY = "listening_history";
const MAX_HISTORY_ITEMS = 500;

export default function HistoryScreen() {
  const [activeFilter, setActiveFilter] = useState<FilterOption>("all");
  const [sortBy, setSortBy] = useState<SortOption>("recent");
  const [selectedEntry, setSelectedEntry] = useState<HistoryEntry | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showSortModal, setShowSortModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  const { playTrack } = usePlayer();
  const { settings, profile } = useUser();
  const { isFavorite, toggleFavorite } = useLibrary();
  const subscription = useSubscription();
  const accentColor = settings?.accentColor ?? "#E91E63";

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = useCallback(async () => {
    try {
      setIsLoading(true);
      const stored = await AsyncStorage.getItem(HISTORY_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as HistoryEntry[];
        const withDates = parsed.map(entry => ({
          ...entry,
          playedAt: new Date(entry.playedAt),
        }));
        setHistory(withDates);
      }
    } catch (error) {
      console.error("[History] Load error:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveHistory = useCallback(async (newHistory: HistoryEntry[]) => {
    try {
      const limited = newHistory.slice(0, MAX_HISTORY_ITEMS);
      await AsyncStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(limited));
    } catch (error) {
      console.error("[History] Save error:", error);
    }
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadHistory();
    setRefreshing(false);
  }, [loadHistory]);

  const filteredHistory = history.filter(entry => {
    if (activeFilter === "all") return true;
    if (activeFilter === "songs") return entry.track.type === "song";
    if (activeFilter === "podcasts") return entry.track.type === "podcast";
    if (activeFilter === "videos") return entry.track.type === "video" || entry.track.isVideo;
    if (activeFilter === "audiobooks") return entry.track.type === "audiobook";
    return true;
  }).filter(entry => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      entry.track.title.toLowerCase().includes(query) ||
      entry.track.artist.toLowerCase().includes(query) ||
      entry.track.album?.toLowerCase().includes(query)
    );
  });

  const sortedHistory = [...filteredHistory].sort((a, b) => {
    switch (sortBy) {
      case "recent":
        return b.playedAt.getTime() - a.playedAt.getTime();
      case "frequent":
        return b.playCount - a.playCount;
      case "duration":
        return b.track.duration - a.track.duration;
      case "alphabetical":
        return a.track.title.localeCompare(b.track.title);
      default:
        return 0;
    }
  });

  const groupedHistory: GroupedHistory[] = [];
  sortedHistory.forEach(entry => {
    const dateStr = formatDate(entry.playedAt);
    let group = groupedHistory.find(g => g.date === dateStr);
    if (!group) {
      group = { date: dateStr, entries: [] };
      groupedHistory.push(group);
    }
    group.entries.push(entry);
  });

  const stats = {
    totalPlays: history.length,
    totalDuration: history.reduce((sum, e) => sum + e.track.duration, 0),
    uniqueTracks: new Set(history.map(e => e.track.id)).size,
    mostPlayed: history.reduce((acc, e) => {
      if (!acc || e.playCount > acc.playCount) return e;
      return acc;
    }, null as HistoryEntry | null),
  };

  const handlePlayTrack = useCallback((track: Track) => {
    playTrack(track);
  }, [playTrack]);

  const handleMorePress = useCallback((entry: HistoryEntry) => {
    setSelectedEntry(entry);
  }, []);

  const handleAddToPlaylist = useCallback(() => {
    if (selectedEntry) {
      if (subscription.tier === "free") {
        Alert.alert(
          "Premium Feature",
          "Custom playlists are available for Premium users. Upgrade to create and manage your own playlists.",
          [
            { text: "Cancel", style: "cancel" },
            { text: "Upgrade", onPress: () => router.push("/subscription" as any) },
          ]
        );
        setSelectedEntry(null);
        return;
      }
      Alert.alert("Add to Playlist", `"${selectedEntry.track.title}" added to playlist`);
      setSelectedEntry(null);
    }
  }, [selectedEntry, subscription]);

  const handleDownload = useCallback(() => {
    if (selectedEntry) {
      if (!subscription.features.offlineDownloads) {
        Alert.alert(
          "Premium Feature",
          "Offline downloads are available for Premium users. Upgrade to download and listen offline.",
          [
            { text: "Cancel", style: "cancel" },
            { text: "Upgrade", onPress: () => router.push("/subscription" as any) },
          ]
        );
        setSelectedEntry(null);
        return;
      }
      Alert.alert("Download", `Downloading "${selectedEntry.track.title}"`);
      setSelectedEntry(null);
    }
  }, [selectedEntry, subscription]);

  const handleShare = useCallback(() => {
    if (selectedEntry) {
      Alert.alert("Share", `Sharing "${selectedEntry.track.title}"`);
      setSelectedEntry(null);
    }
  }, [selectedEntry]);

  const handleRemoveFromHistory = useCallback(() => {
    if (selectedEntry) {
      Alert.alert(
        "Remove from History",
        `Remove "${selectedEntry.track.title}" from your history?`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Remove",
            style: "destructive",
            onPress: () => {
              const updated = history.filter(e => 
                !(e.track.id === selectedEntry.track.id && 
                  e.playedAt.getTime() === selectedEntry.playedAt.getTime())
              );
              setHistory(updated);
              saveHistory(updated);
              setSelectedEntry(null);
            }
          }
        ]
      );
    }
  }, [selectedEntry, history, saveHistory]);

  const handleClearHistory = useCallback(() => {
    Alert.alert(
      "Clear History",
      "Are you sure you want to clear all your listening history? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear All",
          style: "destructive",
          onPress: async () => {
            setHistory([]);
            await AsyncStorage.removeItem(HISTORY_STORAGE_KEY);
          }
        }
      ]
    );
  }, []);

  const getTrackIcon = (track: Track) => {
    if (track.type === "video" || track.isVideo) return <Video size={16} color={accentColor} />;
    if (track.type === "podcast") return <Mic size={16} color={accentColor} />;
    if (track.type === "audiobook") return <BookOpen size={16} color={accentColor} />;
    return <Music size={16} color={accentColor} />;
  };

  const formatTotalDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
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
        <Text style={styles.title}>Recently Played</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={styles.iconButton}
            onPress={() => setShowSortModal(true)}
            testID="sort-button"
          >
            <Filter size={22} color="white" />
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

      {!profile && (
        <View style={styles.guestBanner}>
          <Text style={styles.guestBannerText}>
            Sign in to save your listening history across devices
          </Text>
          <TouchableOpacity
            style={[styles.guestBannerButton, { backgroundColor: accentColor }]}
            onPress={() => router.push("/auth" as any)}
          >
            <Text style={styles.guestBannerButtonText}>Sign In</Text>
          </TouchableOpacity>
        </View>
      )}

      {history.length > 0 && (
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <TrendingUp size={20} color={accentColor} />
            <Text style={styles.statValue}>{stats.totalPlays}</Text>
            <Text style={styles.statLabel}>Total Plays</Text>
          </View>
          <View style={styles.statCard}>
            <Clock size={20} color={accentColor} />
            <Text style={styles.statValue}>{formatTotalDuration(stats.totalDuration)}</Text>
            <Text style={styles.statLabel}>Listening Time</Text>
          </View>
          <View style={styles.statCard}>
            <Music size={20} color={accentColor} />
            <Text style={styles.statValue}>{stats.uniqueTracks}</Text>
            <Text style={styles.statLabel}>Unique Tracks</Text>
          </View>
        </View>
      )}

      <View style={styles.tabContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabScroll}
        >
          <TouchableOpacity
            style={[
              styles.tab,
              activeFilter === "all" && { backgroundColor: accentColor },
            ]}
            onPress={() => setActiveFilter("all")}
            testID="all-tab"
          >
            <Clock size={18} color={activeFilter === "all" ? "#FFF" : "#9CA3AF"} />
            <Text
              style={[
                styles.tabText,
                activeFilter === "all" && { color: "#FFF" },
              ]}
            >
              All
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.tab,
              activeFilter === "songs" && { backgroundColor: accentColor },
            ]}
            onPress={() => setActiveFilter("songs")}
            testID="songs-tab"
          >
            <Music size={18} color={activeFilter === "songs" ? "#FFF" : "#9CA3AF"} />
            <Text
              style={[
                styles.tabText,
                activeFilter === "songs" && { color: "#FFF" },
              ]}
            >
              Songs
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.tab,
              activeFilter === "podcasts" && { backgroundColor: accentColor },
            ]}
            onPress={() => setActiveFilter("podcasts")}
            testID="podcasts-tab"
          >
            <Mic size={18} color={activeFilter === "podcasts" ? "#FFF" : "#9CA3AF"} />
            <Text
              style={[
                styles.tabText,
                activeFilter === "podcasts" && { color: "#FFF" },
              ]}
            >
              Podcasts
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.tab,
              activeFilter === "videos" && { backgroundColor: accentColor },
            ]}
            onPress={() => setActiveFilter("videos")}
            testID="videos-tab"
          >
            <Video size={18} color={activeFilter === "videos" ? "#FFF" : "#9CA3AF"} />
            <Text
              style={[
                styles.tabText,
                activeFilter === "videos" && { color: "#FFF" },
              ]}
            >
              Videos
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.tab,
              activeFilter === "audiobooks" && { backgroundColor: accentColor },
            ]}
            onPress={() => setActiveFilter("audiobooks")}
            testID="audiobooks-tab"
          >
            <BookOpen size={18} color={activeFilter === "audiobooks" ? "#FFF" : "#9CA3AF"} />
            <Text
              style={[
                styles.tabText,
                activeFilter === "audiobooks" && { color: "#FFF" },
              ]}
            >
              Audiobooks
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={accentColor} />
          <Text style={styles.loadingText}>Loading history...</Text>
        </View>
      ) : (
        <ScrollView 
          style={styles.content} 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={accentColor}
              colors={[accentColor]}
            />
          }
        >
          {groupedHistory.map((group, groupIndex) => (
            <View key={`group-${groupIndex}`} style={styles.historyGroup}>
              <View style={styles.dateHeader}>
                <Calendar size={16} color="#9CA3AF" />
                <Text style={styles.dateText}>{group.date}</Text>
                <Text style={styles.dateCount}>({group.entries.length})</Text>
              </View>
              
              {group.entries.map((entry, entryIndex) => (
                <TouchableOpacity
                  key={`${entry.track.id}-${entryIndex}`}
                  style={styles.trackCard}
                  onPress={() => handlePlayTrack(entry.track)}
                  activeOpacity={0.7}
                  testID={`track-${entry.track.id}`}
                >
                  <View style={styles.trackArtworkWrap}>
                    <Image source={{ uri: entry.track.artwork }} style={styles.trackArtwork} />
                    {(entry.track.type === "video" || entry.track.isVideo) && (
                      <View style={styles.videoOverlay}>
                        <Video size={20} color="#FFF" />
                      </View>
                    )}
                    {entry.playCount > 1 && (
                      <View style={[styles.playCountBadge, { backgroundColor: accentColor }]}>
                        <Text style={styles.playCountText}>{entry.playCount}×</Text>
                      </View>
                    )}
                  </View>
                  
                  <View style={styles.trackInfo}>
                    <View style={styles.trackTitleRow}>
                      {getTrackIcon(entry.track)}
                      <Text style={styles.trackTitle} numberOfLines={1}>
                        {entry.track.title}
                      </Text>
                    </View>
                    <Text style={styles.trackArtist} numberOfLines={1}>
                      {entry.track.artist}
                    </Text>
                    <Text style={styles.trackMeta}>
                      {formatDuration(entry.track.duration)} • {entry.playedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                  </View>
                  
                  <View style={styles.trackActions}>
                    <TouchableOpacity
                      style={styles.favoriteButton}
                      onPress={(e) => {
                        e.stopPropagation();
                        toggleFavorite(entry.track);
                      }}
                      testID={`favorite-${entry.track.id}`}
                    >
                      <Heart 
                        size={20} 
                        color={isFavorite(entry.track.id) ? accentColor : "#6B7280"} 
                        fill={isFavorite(entry.track.id) ? accentColor : "none"}
                      />
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                      style={[styles.playButton, { backgroundColor: accentColor }]}
                      onPress={(e) => {
                        e.stopPropagation();
                        handlePlayTrack(entry.track);
                      }}
                      testID={`play-${entry.track.id}`}
                    >
                      <Play size={16} color="#FFF" fill="#FFF" />
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                      style={styles.moreButton}
                      onPress={(e) => {
                        e.stopPropagation();
                        handleMorePress(entry);
                      }}
                      testID={`more-${entry.track.id}`}
                    >
                      <MoreVertical size={18} color="#9CA3AF" />
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          ))}
          
          {sortedHistory.length === 0 && !isLoading && (
            <View style={styles.emptyState}>
              <Clock size={64} color="#3A3A3A" />
              <Text style={styles.emptyTitle}>No History Yet</Text>
              <Text style={styles.emptyText}>
                {searchQuery 
                  ? "No tracks match your search"
                  : "Your listening history will appear here"}
              </Text>
              {!searchQuery && (
                <TouchableOpacity
                  style={[styles.emptyButton, { backgroundColor: accentColor }]}
                  onPress={() => router.push("/" as any)}
                >
                  <Text style={styles.emptyButtonText}>Explore Music</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </ScrollView>
      )}

      <Modal
        visible={selectedEntry !== null}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedEntry(null)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setSelectedEntry(null)}
        >
          <View style={styles.contextMenu}>
            {selectedEntry && (
              <View style={styles.contextHeader}>
                <Image source={{ uri: selectedEntry.track.artwork }} style={styles.contextArtwork} />
                <View style={styles.contextHeaderInfo}>
                  <Text style={styles.contextTitle} numberOfLines={1}>
                    {selectedEntry.track.title}
                  </Text>
                  <Text style={styles.contextArtist} numberOfLines={1}>
                    {selectedEntry.track.artist}
                  </Text>
                  {selectedEntry.playCount > 1 && (
                    <Text style={styles.contextMeta}>
                      Played {selectedEntry.playCount} times
                    </Text>
                  )}
                </View>
              </View>
            )}
            
            <View style={styles.menuDivider} />
            
            <TouchableOpacity 
              style={styles.menuItem} 
              onPress={() => {
                if (selectedEntry) {
                  toggleFavorite(selectedEntry.track);
                  setSelectedEntry(null);
                }
              }}
            >
              <Heart 
                size={22} 
                color={selectedEntry && isFavorite(selectedEntry.track.id) ? accentColor : "#FFF"} 
                fill={selectedEntry && isFavorite(selectedEntry.track.id) ? accentColor : "none"}
              />
              <Text style={styles.menuText}>
                {selectedEntry && isFavorite(selectedEntry.track.id) ? "Remove from Favorites" : "Add to Favorites"}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.menuItem} onPress={handleAddToPlaylist}>
              <Plus size={22} color="#FFF" />
              <Text style={styles.menuText}>Add to Playlist</Text>
              {subscription.tier === "free" && (
                <View style={styles.premiumBadge}>
                  <Text style={styles.premiumBadgeText}>Premium</Text>
                </View>
              )}
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.menuItem} onPress={handleDownload}>
              <Download size={22} color="#FFF" />
              <Text style={styles.menuText}>Download</Text>
              {!subscription.features.offlineDownloads && (
                <View style={styles.premiumBadge}>
                  <Text style={styles.premiumBadgeText}>Premium</Text>
                </View>
              )}
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

      <Modal
        visible={showSortModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowSortModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowSortModal(false)}
        >
          <View style={styles.sortMenu}>
            <View style={styles.sortHeader}>
              <Text style={styles.sortTitle}>Sort & Filter</Text>
              <TouchableOpacity onPress={() => setShowSortModal(false)}>
                <X size={24} color="#FFF" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.menuDivider} />
            
            <Text style={styles.sortSectionTitle}>Sort By</Text>
            
            <TouchableOpacity
              style={styles.sortOption}
              onPress={() => {
                setSortBy("recent");
                setShowSortModal(false);
              }}
            >
              <Clock size={20} color={sortBy === "recent" ? accentColor : "#FFF"} />
              <Text style={[styles.sortOptionText, sortBy === "recent" && { color: accentColor }]}>
                Most Recent
              </Text>
              {sortBy === "recent" && (
                <View style={[styles.checkmark, { backgroundColor: accentColor }]} />
              )}
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.sortOption}
              onPress={() => {
                setSortBy("frequent");
                setShowSortModal(false);
              }}
            >
              <TrendingUp size={20} color={sortBy === "frequent" ? accentColor : "#FFF"} />
              <Text style={[styles.sortOptionText, sortBy === "frequent" && { color: accentColor }]}>
                Most Played
              </Text>
              {sortBy === "frequent" && (
                <View style={[styles.checkmark, { backgroundColor: accentColor }]} />
              )}
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.sortOption}
              onPress={() => {
                setSortBy("duration");
                setShowSortModal(false);
              }}
            >
              <Clock size={20} color={sortBy === "duration" ? accentColor : "#FFF"} />
              <Text style={[styles.sortOptionText, sortBy === "duration" && { color: accentColor }]}>
                Longest Duration
              </Text>
              {sortBy === "duration" && (
                <View style={[styles.checkmark, { backgroundColor: accentColor }]} />
              )}
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.sortOption}
              onPress={() => {
                setSortBy("alphabetical");
                setShowSortModal(false);
              }}
            >
              <Music size={20} color={sortBy === "alphabetical" ? accentColor : "#FFF"} />
              <Text style={[styles.sortOptionText, sortBy === "alphabetical" && { color: accentColor }]}>
                A-Z
              </Text>
              {sortBy === "alphabetical" && (
                <View style={[styles.checkmark, { backgroundColor: accentColor }]} />
              )}
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
    marginBottom: 24,
  },
  emptyButton: {
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 24,
  },
  emptyButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "700" as const,
  },
  guestBanner: {
    backgroundColor: "#1A1A1A",
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#2A2A2A",
  },
  guestBannerText: {
    color: "#9CA3AF",
    fontSize: 13,
    flex: 1,
    marginRight: 12,
  },
  guestBannerButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  guestBannerButtonText: {
    color: "#FFF",
    fontSize: 13,
    fontWeight: "700" as const,
  },
  statsContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
    backgroundColor: "#0F0F0F",
    borderBottomWidth: 1,
    borderBottomColor: "#1A1A1A",
  },
  statCard: {
    flex: 1,
    backgroundColor: "#1A1A1A",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    gap: 4,
  },
  statValue: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "700" as const,
    marginTop: 4,
  },
  statLabel: {
    color: "#6B7280",
    fontSize: 11,
    fontWeight: "500" as const,
    textAlign: "center",
  },
  dateCount: {
    color: "#6B7280",
    fontSize: 12,
    fontWeight: "500" as const,
    marginLeft: 4,
  },
  playCountBadge: {
    position: "absolute",
    top: 4,
    right: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  playCountText: {
    color: "#FFF",
    fontSize: 10,
    fontWeight: "700" as const,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  loadingText: {
    color: "#9CA3AF",
    fontSize: 14,
  },
  contextMeta: {
    color: "#6B7280",
    fontSize: 12,
    marginTop: 4,
  },
  premiumBadge: {
    backgroundColor: "#FFA500",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginLeft: "auto",
  },
  premiumBadgeText: {
    color: "#FFF",
    fontSize: 10,
    fontWeight: "700" as const,
  },
  sortMenu: {
    backgroundColor: "#1A1A1A",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 40,
    maxHeight: "70%",
  },
  sortHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
  },
  sortTitle: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: "700" as const,
  },
  sortSectionTitle: {
    color: "#9CA3AF",
    fontSize: 12,
    fontWeight: "700" as const,
    textTransform: "uppercase",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  sortOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 14,
    gap: 16,
  },
  sortOptionText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600" as const,
    flex: 1,
  },
  checkmark: {
    width: 20,
    height: 20,
    borderRadius: 10,
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
