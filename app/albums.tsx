import React, { useState, useCallback, useMemo } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  Alert,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, router } from "expo-router";
import { 
  ArrowLeft, 
  Search, 
  MoreVertical, 
  Shuffle, 
  Plus, 
  Download, 
  Trash2, 
  User, 
  Share,
  Play,
  Grid3x3,
  List,
  SortAsc,
} from "lucide-react-native";
import { usePlayer } from "@/contexts/PlayerContext";
import { useUser } from "@/contexts/UserContext";
import { featuredContent, topCharts, newReleases } from "@/data/mockData";
import type { Track } from "@/types";

const { width } = Dimensions.get("window");
const GRID_SPACING = 16;
const GRID_COLUMNS = 2;
const CARD_WIDTH = (width - GRID_SPACING * (GRID_COLUMNS + 1)) / GRID_COLUMNS;

type Album = {
  id: string;
  title: string;
  artist: string;
  year: string;
  artwork: string;
  tracks: Track[];
};

type SortOption = "recent" | "alpha" | "artist" | "year";
type ViewMode = "grid" | "list";

export default function AlbumsScreen() {
  const { playTrack } = usePlayer();
  const { settings } = useUser();
  const accentColor = settings?.accentColor ?? "#E91E63";

  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>("recent");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [showSortModal, setShowSortModal] = useState(false);

  const albums = useMemo<Album[]>(() => {
    const albumMap: Record<string, Album> = {};
    const allTracks = [...featuredContent, ...topCharts, ...newReleases];
    
    allTracks.forEach((track) => {
      const albumKey = track.album || `${track.artist}-${track.title.split(' ')[0]}`;
      if (!albumMap[albumKey]) {
        albumMap[albumKey] = {
          id: albumKey,
          title: track.album || `${track.title.split(' ')[0]} Album`,
          artist: track.artist,
          year: "2024",
          artwork: track.artwork,
          tracks: []
        };
      }
      albumMap[albumKey].tracks.push(track);
    });
    
    const albumList = Object.values(albumMap);
    
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
    router.push(`/album/${album.id}`);
  }, []);

  const handlePlayAlbum = useCallback((album: Album, e?: any) => {
    e?.stopPropagation?.();
    if (album.tracks.length > 0) {
      playTrack(album.tracks[0]);
    }
  }, [playTrack]);

  const handleMorePress = useCallback((album: Album, e?: any) => {
    e?.stopPropagation?.();
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

  const renderGridAlbum = (album: Album, index: number) => (
    <TouchableOpacity
      key={album.id}
      style={styles.gridCard}
      onPress={() => handleAlbumPress(album)}
      activeOpacity={0.7}
      testID={`album-${album.id}`}
    >
      <View style={styles.gridArtworkWrap}>
        <Image source={{ uri: album.artwork }} style={styles.gridArtwork} />
        <View style={styles.gridOverlay}>
          <TouchableOpacity
            style={[styles.playIconButton, { backgroundColor: accentColor }]}
            onPress={(e) => handlePlayAlbum(album, e)}
            testID={`play-${album.id}`}
          >
            <Play size={20} color="#FFF" fill="#FFF" />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.gridInfo}>
        <Text style={styles.gridTitle} numberOfLines={1}>
          {album.title}
        </Text>
        <Text style={styles.gridArtist} numberOfLines={1}>
          {album.artist}
        </Text>
        <Text style={styles.gridMeta}>
          {album.tracks.length} {album.tracks.length === 1 ? 'song' : 'songs'} • {album.year}
        </Text>
      </View>
      <TouchableOpacity
        style={styles.gridMoreButton}
        onPress={(e) => handleMorePress(album, e)}
        testID={`more-${album.id}`}
      >
        <MoreVertical size={18} color="#9CA3AF" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderListAlbum = (album: Album, index: number) => (
    <TouchableOpacity
      key={album.id}
      style={styles.listCard}
      onPress={() => handleAlbumPress(album)}
      activeOpacity={0.7}
      testID={`album-${album.id}`}
    >
      <View style={styles.listArtworkWrap}>
        <Image source={{ uri: album.artwork }} style={styles.listArtwork} />
      </View>
      <View style={styles.listInfo}>
        <Text style={styles.listTitle} numberOfLines={1}>
          {album.title}
        </Text>
        <Text style={styles.listArtist} numberOfLines={1}>
          {album.artist}
        </Text>
        <Text style={styles.listMeta}>
          {album.tracks.length} songs • {album.year}
        </Text>
      </View>
      <TouchableOpacity
        style={[styles.listPlayButton, { backgroundColor: accentColor }]}
        onPress={(e) => handlePlayAlbum(album, e)}
        testID={`play-${album.id}`}
      >
        <Play size={16} color="#FFF" fill="#FFF" />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.listMoreButton}
        onPress={(e) => handleMorePress(album, e)}
        testID={`more-${album.id}`}
      >
        <MoreVertical size={18} color="#9CA3AF" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const currentSort = sortOptions.find(s => s.id === sortBy)?.label || "Recently Added";

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          testID="back-button"
        >
          <ArrowLeft size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.title}>Albums</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={styles.iconButton} 
            testID="search-button"
            onPress={() => router.push('/search')}
          >
            <Search size={22} color="#FFF" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.iconButton}
            onPress={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
            testID="view-mode-button"
          >
            {viewMode === "grid" ? (
              <List size={22} color="#FFF" />
            ) : (
              <Grid3x3 size={22} color="#FFF" />
            )}
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.statsBar}>
        <Text style={styles.statsText}>
          {albums.length} {albums.length === 1 ? 'album' : 'albums'}
        </Text>
        <TouchableOpacity
          style={styles.sortButton}
          onPress={() => setShowSortModal(true)}
          testID="sort-button"
        >
          <SortAsc size={16} color={accentColor} />
          <Text style={[styles.sortText, { color: accentColor }]}>{currentSort}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {viewMode === "grid" ? (
          <View style={styles.gridContainer}>
            {albums.map((album, index) => renderGridAlbum(album, index))}
          </View>
        ) : (
          <View style={styles.listContainer}>
            {albums.map((album, index) => renderListAlbum(album, index))}
          </View>
        )}
      </ScrollView>

      <Modal
        visible={showSortModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSortModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowSortModal(false)}
        >
          <View style={styles.sortModal}>
            <Text style={styles.sortModalTitle}>Sort by</Text>
            {sortOptions.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={styles.sortOption}
                onPress={() => {
                  setSortBy(option.id);
                  setShowSortModal(false);
                }}
                testID={`sort-${option.id}`}
              >
                <Text
                  style={[
                    styles.sortOptionText,
                    sortBy === option.id && { color: accentColor, fontWeight: "700" as const },
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      <Modal
        visible={selectedAlbum !== null}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedAlbum(null)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setSelectedAlbum(null)}
        >
          <View style={styles.contextMenu}>
            {selectedAlbum && (
              <View style={styles.contextHeader}>
                <Image source={{ uri: selectedAlbum.artwork }} style={styles.contextArtwork} />
                <View style={styles.contextHeaderInfo}>
                  <Text style={styles.contextTitle} numberOfLines={1}>
                    {selectedAlbum.title}
                  </Text>
                  <Text style={styles.contextArtist} numberOfLines={1}>
                    {selectedAlbum.artist}
                  </Text>
                </View>
              </View>
            )}
            
            <View style={styles.menuDivider} />
            
            <TouchableOpacity style={styles.menuItem} onPress={handleShufflePlay}>
              <Shuffle size={22} color="#FFF" />
              <Text style={styles.menuText}>Shuffle Play</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.menuItem} onPress={handleAddToPlaylist}>
              <Plus size={22} color="#FFF" />
              <Text style={styles.menuText}>Add to Playlist</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.menuItem} onPress={handleDownload}>
              <Download size={22} color="#FFF" />
              <Text style={styles.menuText}>Download Album</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.menuItem} onPress={handleViewArtist}>
              <User size={22} color="#FFF" />
              <Text style={styles.menuText}>View Artist</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.menuItem} onPress={handleShare}>
              <Share size={22} color="#FFF" />
              <Text style={styles.menuText}>Share Album</Text>
            </TouchableOpacity>
            
            <View style={styles.menuDivider} />
            
            <TouchableOpacity style={styles.menuItem} onPress={handleRemoveFromLibrary}>
              <Trash2 size={22} color="#EF4444" />
              <Text style={[styles.menuText, { color: "#EF4444" }]}>Remove from Library</Text>
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
  statsBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#0F0F0F",
  },
  statsText: {
    color: "#9CA3AF",
    fontSize: 14,
    fontWeight: "600" as const,
  },
  sortButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: "#1A1A1A",
  },
  sortText: {
    fontSize: 14,
    fontWeight: "600" as const,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: GRID_SPACING / 2,
    paddingTop: GRID_SPACING,
  },
  gridCard: {
    width: CARD_WIDTH,
    marginHorizontal: GRID_SPACING / 2,
    marginBottom: GRID_SPACING,
  },
  gridArtworkWrap: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#1A1A1A",
    position: "relative",
  },
  gridArtwork: {
    width: "100%",
    height: "100%",
  },
  gridOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    justifyContent: "center",
    alignItems: "center",
    opacity: 0,
  },
  playIconButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  gridInfo: {
    paddingTop: 12,
    paddingBottom: 4,
  },
  gridTitle: {
    color: "#FFF",
    fontSize: 15,
    fontWeight: "700" as const,
    marginBottom: 4,
  },
  gridArtist: {
    color: "#9CA3AF",
    fontSize: 13,
    fontWeight: "500" as const,
    marginBottom: 2,
  },
  gridMeta: {
    color: "#6B7280",
    fontSize: 12,
    fontWeight: "500" as const,
  },
  gridMoreButton: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  listCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#111113",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#1F1F1F",
  },
  listArtworkWrap: {
    width: 64,
    height: 64,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#1A1A1A",
    marginRight: 12,
  },
  listArtwork: {
    width: "100%",
    height: "100%",
  },
  listInfo: {
    flex: 1,
    paddingRight: 8,
  },
  listTitle: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "700" as const,
    marginBottom: 4,
  },
  listArtist: {
    color: "#9CA3AF",
    fontSize: 14,
    fontWeight: "500" as const,
    marginBottom: 2,
  },
  listMeta: {
    color: "#6B7280",
    fontSize: 12,
    fontWeight: "500" as const,
  },
  listPlayButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  listMoreButton: {
    padding: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.85)",
    justifyContent: "flex-end",
  },
  sortModal: {
    backgroundColor: "#1A1A1A",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 24,
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  sortModalTitle: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: "700" as const,
    marginBottom: 20,
  },
  sortOption: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#2A2A2A",
  },
  sortOptionText: {
    color: "#9CA3AF",
    fontSize: 16,
    fontWeight: "600" as const,
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