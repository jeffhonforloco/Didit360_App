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
  Plus, 
  Download, 
  Trash2, 
  User, 
  Share,
  ChevronDown
} from "lucide-react-native";
import { router } from "expo-router";
import { usePlayer } from "@/contexts/PlayerContext";

import { featuredContent, topCharts, newReleases } from "@/data/mockData";
import type { Track } from "@/types";

type Album = {
  id: string;
  title: string;
  artist: string;
  year: string;
  artwork: string;
  tracks: Track[];
};

type SortOption = "recent" | "alpha" | "artist" | "year";

export default function AlbumsScreen() {
  const { playTrack } = usePlayer();

  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>("recent");

  const albums = useMemo<Album[]>(() => {
    const albumMap: Record<string, Album> = {};
    const allTracks = [...featuredContent, ...topCharts, ...newReleases];
    
    allTracks.forEach((track) => {
      const albumKey = `${track.artist}-${track.title.split(' ')[0]}`;
      if (!albumMap[albumKey]) {
        albumMap[albumKey] = {
          id: albumKey,
          title: `${track.title.split(' ')[0]} Album`,
          artist: track.artist,
          year: "2022",
          artwork: track.artwork,
          tracks: []
        };
      }
      albumMap[albumKey].tracks.push(track);
    });
    
    const albumList = Object.values(albumMap);
    
    // Sort albums
    switch (sortBy) {
      case "alpha":
        return albumList.sort((a, b) => a.title.localeCompare(b.title));
      case "artist":
        return albumList.sort((a, b) => a.artist.localeCompare(b.artist));
      case "year":
        return albumList.sort((a, b) => b.year.localeCompare(a.year));
      default:
        return albumList;
    }
  }, [sortBy]);

  const sortOptions = [
    { id: "recent" as const, label: "Recently Added" },
    { id: "alpha" as const, label: "A-Z" },
    { id: "artist" as const, label: "Artist" },
    { id: "year" as const, label: "Year" },
  ];

  const handleAlbumPress = useCallback((album: Album) => {
    if (album.tracks.length > 0) {
      playTrack(album.tracks[0]);
    }
  }, [playTrack]);

  const handleMorePress = useCallback((album: Album) => {
    setSelectedAlbum(album);
  }, []);

  const handleShufflePlay = useCallback(() => {
    if (selectedAlbum && selectedAlbum.tracks.length > 0) {
      const shuffled = [...selectedAlbum.tracks].sort(() => Math.random() - 0.5);
      playTrack(shuffled[0]);
      setSelectedAlbum(null);
    }
  }, [selectedAlbum, playTrack]);

  const handleAddToPlaylist = useCallback(() => {
    if (selectedAlbum) {
      Alert.alert("Add to Playlist", "Album added to your playlist");
      setSelectedAlbum(null);
    }
  }, [selectedAlbum]);

  const handleDownload = useCallback(() => {
    if (selectedAlbum) {
      Alert.alert("Download", "Album download started");
      setSelectedAlbum(null);
    }
  }, [selectedAlbum]);

  const handleRemoveFromLibrary = useCallback(() => {
    if (selectedAlbum) {
      Alert.alert(
        "Remove from Library",
        `Remove "${selectedAlbum.title}" from your library?`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Remove",
            style: "destructive",
            onPress: () => {
              setSelectedAlbum(null);
            }
          }
        ]
      );
    }
  }, [selectedAlbum]);

  const handleViewArtist = useCallback(() => {
    if (selectedAlbum) {
      router.push(`/artist/${selectedAlbum.artist}`);
      setSelectedAlbum(null);
    }
  }, [selectedAlbum]);

  const handleShare = useCallback(() => {
    if (selectedAlbum) {
      Alert.alert("Share", `Sharing "${selectedAlbum.title}" by ${selectedAlbum.artist}`);
      setSelectedAlbum(null);
    }
  }, [selectedAlbum]);

  const renderAlbum = useCallback(({ item }: { item: Album }) => (
    <TouchableOpacity
      style={styles.albumCard}
      onPress={() => handleAlbumPress(item)}
      activeOpacity={0.8}
      testID={`album-${item.id}`}
    >
      <View style={styles.albumArtWrap}>
        <Image source={{ uri: item.artwork }} style={styles.albumArt} />
      </View>
      <View style={styles.albumInfo}>
        <Text style={styles.albumTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.albumArtist} numberOfLines={1}>
          {item.artist} | {item.year}
        </Text>
      </View>
      <TouchableOpacity
        style={styles.moreButton}
        onPress={() => handleMorePress(item)}
        testID={`more-${item.id}`}
      >
        <MoreHorizontal size={18} color="#9CA3AF" />
      </TouchableOpacity>
    </TouchableOpacity>
  ), [handleAlbumPress, handleMorePress]);

  const currentSort = sortOptions.find(s => s.id === sortBy)?.label || "Recently Added";

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
        <Text style={styles.title}>Albums</Text>
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

      <ScrollView showsVerticalScrollIndicator={false}>
        <FlatList
          data={albums}
          renderItem={renderAlbum}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          contentContainerStyle={styles.albumsList}
        />
      </ScrollView>

      <Modal
        visible={selectedAlbum !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedAlbum(null)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setSelectedAlbum(null)}
        >
          <View style={styles.contextMenu}>
            <TouchableOpacity style={styles.menuItem} onPress={handleShufflePlay}>
              <Shuffle size={20} color="#FFF" />
              <Text style={styles.menuText}>Shuffle Play</Text>
            </TouchableOpacity>
            
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
  albumsList: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  albumCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#111113",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#1F2937",
  },
  albumArtWrap: {
    width: 56,
    height: 56,
    borderRadius: 8,
    overflow: "hidden",
    marginRight: 12,
  },
  albumArt: {
    width: "100%",
    height: "100%",
  },
  albumInfo: {
    flex: 1,
    paddingRight: 12,
  },
  albumTitle: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
  },
  albumArtist: {
    color: "#9CA3AF",
    fontSize: 13,
    fontWeight: "600",
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