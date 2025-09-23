import React, { useState, useCallback, useMemo } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
  Modal,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { 
  ArrowLeft, 
  Search, 
  MoreHorizontal, 
  Shuffle, 
  Play,
  Plus, 
  Download, 
  Trash2, 
  User, 
  Share,
  ChevronDown,
  Heart
} from "lucide-react-native";
import { router } from "expo-router";
import { usePlayer } from "@/contexts/PlayerContext";
import { useLibrary } from "@/contexts/LibraryContext";
import { featuredContent, topCharts, newReleases } from "@/data/mockData";
import type { Track } from "@/types";

type SortOption = "recent" | "alpha" | "artist" | "duration";

export default function SongsScreen() {
  const { playTrack } = usePlayer();
  const { favorites } = useLibrary();
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>("recent");

  const songs = useMemo<Track[]>(() => {
    const allSongs = [...featuredContent, ...topCharts, ...newReleases, ...favorites];
    const uniqueSongs = allSongs.filter((song, index, self) => 
      index === self.findIndex(s => s.id === song.id)
    );
    
    // Sort songs
    switch (sortBy) {
      case "alpha":
        return uniqueSongs.sort((a, b) => a.title.localeCompare(b.title));
      case "artist":
        return uniqueSongs.sort((a, b) => a.artist.localeCompare(b.artist));
      case "duration":
        return uniqueSongs.sort((a, b) => (b.duration || 0) - (a.duration || 0));
      default:
        return uniqueSongs;
    }
  }, [sortBy, favorites]);

  const sortOptions = [
    { id: "recent" as const, label: "Recently Downloaded" },
    { id: "alpha" as const, label: "A-Z" },
    { id: "artist" as const, label: "Artist" },
    { id: "duration" as const, label: "Duration" },
  ];

  const handleSongPress = useCallback((track: Track) => {
    playTrack(track);
  }, [playTrack]);

  const handleMorePress = useCallback((track: Track) => {
    setSelectedTrack(track);
  }, []);

  const handleShuffleAll = useCallback(() => {
    if (songs.length > 0) {
      const shuffled = [...songs].sort(() => Math.random() - 0.5);
      playTrack(shuffled[0]);
    }
  }, [songs, playTrack]);

  const handlePlayAll = useCallback(() => {
    if (songs.length > 0) {
      playTrack(songs[0]);
    }
  }, [songs, playTrack]);

  const handleAddToPlaylist = useCallback(() => {
    if (selectedTrack) {
      Alert.alert("Add to Playlist", "Song added to your playlist");
      setSelectedTrack(null);
    }
  }, [selectedTrack]);

  const handleDownload = useCallback(() => {
    if (selectedTrack) {
      Alert.alert("Download", "Song download started");
      setSelectedTrack(null);
    }
  }, [selectedTrack]);

  const handleRemoveFromLibrary = useCallback(() => {
    if (selectedTrack) {
      Alert.alert(
        "Remove from Library",
        `Remove "${selectedTrack.title}" from your library?`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Remove",
            style: "destructive",
            onPress: () => {
              setSelectedTrack(null);
            }
          }
        ]
      );
    }
  }, [selectedTrack]);

  const handleViewArtist = useCallback(() => {
    if (selectedTrack) {
      router.push(`/artist/${selectedTrack.artist}`);
      setSelectedTrack(null);
    }
  }, [selectedTrack]);

  const handleShare = useCallback(() => {
    if (selectedTrack) {
      Alert.alert("Share", `Sharing "${selectedTrack.title}" by ${selectedTrack.artist}`);
      setSelectedTrack(null);
    }
  }, [selectedTrack]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const renderSong = useCallback(({ item }: { item: Track }) => (
    <TouchableOpacity
      style={styles.songCard}
      onPress={() => handleSongPress(item)}
      activeOpacity={0.8}
      testID={`song-${item.id}`}
    >
      <View style={styles.songArtWrap}>
        <Image source={{ uri: item.artwork }} style={styles.songArt} />
      </View>
      <View style={styles.songInfo}>
        <Text style={styles.songTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.songArtist} numberOfLines={1}>
          {item.artist} | {formatDuration(item.duration || 180)}
        </Text>
      </View>
      <View style={styles.songActions}>
        <TouchableOpacity style={styles.playButton}>
          <Play size={16} color="#E91E63" fill="#E91E63" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.moreButton}
          onPress={() => handleMorePress(item)}
          testID={`more-${item.id}`}
        >
          <MoreHorizontal size={18} color="#9CA3AF" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  ), [handleSongPress, handleMorePress]);

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
        <Text style={styles.title}>Songs</Text>
        <TouchableOpacity style={styles.searchButton} testID="search-button">
          <Search size={24} color="#FFF" />
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

      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.shuffleButton]}
          onPress={handleShuffleAll}
          testID="shuffle-button"
        >
          <Shuffle size={18} color="#FFF" />
          <Text style={styles.actionButtonText}>Shuffle</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, styles.playButton]}
          onPress={handlePlayAll}
          testID="play-button"
        >
          <Play size={18} color="#FFF" fill="#FFF" />
          <Text style={styles.actionButtonText}>Play</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <FlatList
          data={songs}
          renderItem={renderSong}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          contentContainerStyle={styles.songsList}
        />
      </ScrollView>

      <Modal
        visible={selectedTrack !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedTrack(null)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setSelectedTrack(null)}
        >
          <View style={styles.contextMenu}>
            <TouchableOpacity style={styles.menuItem} onPress={handleAddToPlaylist}>
              <Plus size={20} color="#FFF" />
              <Text style={styles.menuText}>Add to Playlist</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.menuItem} onPress={handleDownload}>
              <Download size={20} color="#FFF" />
              <Text style={styles.menuText}>Download</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.menuItem} onPress={handleRemoveFromLibrary}>
              <Trash2 size={20} color="#FFF" />
              <Text style={styles.menuText}>Remove From Library</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.menuItem} onPress={handleViewArtist}>
              <User size={20} color="#FFF" />
              <Text style={styles.menuText}>View Artist</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.menuItem} onPress={handleShare}>
              <Share size={20} color="#FFF" />
              <Text style={styles.menuText}>Share</Text>
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
  actionButtons: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 24,
    gap: 8,
  },
  shuffleButton: {
    backgroundColor: "#E91E63",
  },
  playButton: {
    backgroundColor: "#6B7280",
  },
  actionButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "700",
  },
  songsList: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  songCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#111113",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#1F2937",
  },
  songArtWrap: {
    width: 56,
    height: 56,
    borderRadius: 8,
    overflow: "hidden",
    marginRight: 12,
  },
  songArt: {
    width: "100%",
    height: "100%",
  },
  songInfo: {
    flex: 1,
    paddingRight: 12,
  },
  songTitle: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
  },
  songArtist: {
    color: "#9CA3AF",
    fontSize: 13,
    fontWeight: "600",
  },
  songActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  moreButton: {
    padding: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  contextMenu: {
    backgroundColor: "#1A1A1A",
    borderRadius: 16,
    paddingVertical: 8,
    minWidth: 200,
    borderWidth: 1,
    borderColor: "#2A2A2A",
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
    fontWeight: "600",
  },
});