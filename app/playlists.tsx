import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  TextInput,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, router } from "expo-router";
import { 
  ArrowLeft, 
  Search, 
  MoreVertical, 
  Plus, 
  Heart, 
  SortAsc,
  Play,
  Grid3x3,
  List,
  Lock,
  Globe,
  Music,
} from "lucide-react-native";
import { useUser } from "@/contexts/UserContext";
import { useLibrary } from "@/contexts/LibraryContext";
import { userPlaylists, playlistSongCounts } from "@/data/mockData";
import type { Playlist } from "@/types";

const { width } = Dimensions.get("window");
const GRID_SPACING = 16;
const GRID_COLUMNS = 2;
const CARD_WIDTH = (width - GRID_SPACING * (GRID_COLUMNS + 1)) / GRID_COLUMNS;

type SortOption = "recent" | "alpha" | "songs";
type ViewMode = "grid" | "list";

export default function PlaylistsScreen() {
  const { settings } = useUser();
  const { playlists: libraryPlaylists } = useLibrary();
  const accentColor = settings?.accentColor ?? "#E91E63";

  const [sortBy, setSortBy] = useState<SortOption>("recent");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [showNewPlaylistModal, setShowNewPlaylistModal] = useState(false);
  const [showSortModal, setShowSortModal] = useState(false);
  const [playlistName, setPlaylistName] = useState("");
  const [isPublic, setIsPublic] = useState(true);

  const allPlaylists = [...userPlaylists, ...libraryPlaylists];

  const sortedPlaylists = [...allPlaylists].sort((a, b) => {
    switch (sortBy) {
      case "alpha":
        return a.name.localeCompare(b.name);
      case "songs":
        return (playlistSongCounts[b.id] || b.tracks.length) - (playlistSongCounts[a.id] || a.tracks.length);
      default:
        return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
    }
  });

  const sortOptions = [
    { id: "recent" as const, label: "Recently Added" },
    { id: "alpha" as const, label: "A-Z" },
    { id: "songs" as const, label: "Most Songs" },
  ];

  const handlePlaylistPress = useCallback((playlist: Playlist) => {
    router.push(`/playlist?id=${playlist.id}`);
  }, []);

  const handleCreatePlaylist = useCallback(() => {
    if (playlistName.trim()) {
      console.log("Creating playlist:", playlistName, "Public:", isPublic);
      setPlaylistName("");
      setShowNewPlaylistModal(false);
    }
  }, [playlistName, isPublic]);

  const renderGridPlaylist = (playlist: Playlist, index: number) => {
    const isLikedSongs = playlist.name === "Your Likes";
    const songCount = playlistSongCounts[playlist.id] || playlist.tracks.length;

    return (
      <TouchableOpacity
        key={playlist.id}
        style={styles.gridCard}
        onPress={() => handlePlaylistPress(playlist)}
        activeOpacity={0.7}
        testID={`playlist-${playlist.id}`}
      >
        <View style={styles.gridArtworkWrap}>
          {isLikedSongs ? (
            <View style={[styles.likedSongsIcon, { backgroundColor: accentColor }]}>
              <Heart size={40} color="white" fill="white" />
            </View>
          ) : playlist.tracks[0]?.artwork ? (
            <Image 
              source={{ uri: playlist.tracks[0].artwork }} 
              style={styles.gridArtwork} 
            />
          ) : (
            <View style={styles.placeholderArtwork}>
              <Music size={40} color="#6B7280" />
            </View>
          )}
          <View style={styles.gridOverlay}>
            <TouchableOpacity
              style={[styles.playIconButton, { backgroundColor: accentColor }]}
              onPress={(e) => {
                e.stopPropagation();
                handlePlaylistPress(playlist);
              }}
              testID={`play-${playlist.id}`}
            >
              <Play size={20} color="#FFF" fill="#FFF" />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.gridInfo}>
          <Text style={styles.gridTitle} numberOfLines={1}>
            {playlist.name}
          </Text>
          <Text style={styles.gridMeta}>
            {songCount} {songCount === 1 ? 'song' : 'songs'}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderListPlaylist = (playlist: Playlist, index: number) => {
    const isLikedSongs = playlist.name === "Your Likes";
    const songCount = playlistSongCounts[playlist.id] || playlist.tracks.length;

    return (
      <TouchableOpacity
        key={playlist.id}
        style={styles.listCard}
        onPress={() => handlePlaylistPress(playlist)}
        activeOpacity={0.7}
        testID={`playlist-${playlist.id}`}
      >
        <View style={styles.listArtworkWrap}>
          {isLikedSongs ? (
            <View style={[styles.likedSongsIcon, { backgroundColor: accentColor }]}>
              <Heart size={24} color="white" fill="white" />
            </View>
          ) : playlist.tracks[0]?.artwork ? (
            <Image 
              source={{ uri: playlist.tracks[0].artwork }} 
              style={styles.listArtwork} 
            />
          ) : (
            <View style={styles.placeholderArtwork}>
              <Music size={24} color="#6B7280" />
            </View>
          )}
        </View>
        <View style={styles.listInfo}>
          <Text style={styles.listTitle} numberOfLines={1}>
            {playlist.name}
          </Text>
          <Text style={styles.listMeta}>
            {songCount} {songCount === 1 ? 'song' : 'songs'}
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.listPlayButton, { backgroundColor: accentColor }]}
          onPress={(e) => {
            e.stopPropagation();
            handlePlaylistPress(playlist);
          }}
          testID={`play-${playlist.id}`}
        >
          <Play size={16} color="#FFF" fill="#FFF" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.listMoreButton}
          testID={`more-playlist-${playlist.id}`}
        >
          <MoreVertical size={18} color="#9CA3AF" />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  const currentSort = sortOptions.find(s => s.id === sortBy)?.label || "Recently Added";

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
        <Text style={styles.title}>Playlists</Text>
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
            onPress={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
            testID="view-mode-button"
          >
            {viewMode === "grid" ? (
              <List size={22} color="white" />
            ) : (
              <Grid3x3 size={22} color="white" />
            )}
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.statsBar}>
        <Text style={styles.statsText}>
          {sortedPlaylists.length} {sortedPlaylists.length === 1 ? 'playlist' : 'playlists'}
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
            <TouchableOpacity
              style={styles.addPlaylistCard}
              onPress={() => setShowNewPlaylistModal(true)}
              testID="add-playlist-button"
            >
              <View style={[styles.addPlaylistIcon, { backgroundColor: accentColor }]}>
                <Plus size={32} color="white" />
              </View>
              <Text style={styles.addPlaylistText}>New Playlist</Text>
            </TouchableOpacity>
            
            {sortedPlaylists.map((playlist, index) => renderGridPlaylist(playlist, index))}
          </View>
        ) : (
          <View style={styles.listContainer}>
            <TouchableOpacity
              style={styles.addPlaylistListCard}
              onPress={() => setShowNewPlaylistModal(true)}
              testID="add-playlist-button"
            >
              <View style={[styles.addPlaylistIconSmall, { backgroundColor: accentColor }]}>
                <Plus size={24} color="white" />
              </View>
              <Text style={styles.addPlaylistTextSmall}>Create New Playlist</Text>
            </TouchableOpacity>

            {sortedPlaylists.map((playlist, index) => renderListPlaylist(playlist, index))}
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
        visible={showNewPlaylistModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowNewPlaylistModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowNewPlaylistModal(false)}
        >
          <View style={styles.createModal}>
            <Text style={styles.createModalTitle}>New Playlist</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Playlist name"
              placeholderTextColor="#6B7280"
              value={playlistName}
              onChangeText={setPlaylistName}
              autoFocus
              testID="playlist-name-input"
            />

            <View style={styles.visibilityContainer}>
              <Text style={styles.visibilityLabel}>Privacy</Text>
              <View style={styles.visibilityOptions}>
                <TouchableOpacity
                  style={[
                    styles.visibilityOption,
                    isPublic && { backgroundColor: accentColor, borderColor: accentColor },
                  ]}
                  onPress={() => setIsPublic(true)}
                  testID="public-option"
                >
                  <Globe size={18} color={isPublic ? "#FFF" : "#9CA3AF"} />
                  <Text style={[styles.visibilityOptionText, isPublic && { color: "#FFF" }]}>
                    Public
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.visibilityOption,
                    !isPublic && { backgroundColor: accentColor, borderColor: accentColor },
                  ]}
                  onPress={() => setIsPublic(false)}
                  testID="private-option"
                >
                  <Lock size={18} color={!isPublic ? "#FFF" : "#9CA3AF"} />
                  <Text style={[styles.visibilityOptionText, !isPublic && { color: "#FFF" }]}>
                    Private
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => {
                  setPlaylistName("");
                  setShowNewPlaylistModal(false);
                }}
                testID="cancel-button"
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[
                  styles.createButton, 
                  { backgroundColor: accentColor },
                  !playlistName.trim() && { opacity: 0.5 },
                ]}
                onPress={handleCreatePlaylist}
                disabled={!playlistName.trim()}
                testID="create-button"
              >
                <Text style={styles.createButtonText}>Create</Text>
              </TouchableOpacity>
            </View>
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
  addPlaylistCard: {
    width: CARD_WIDTH,
    marginHorizontal: GRID_SPACING / 2,
    marginBottom: GRID_SPACING,
    alignItems: "center",
  },
  addPlaylistIcon: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  addPlaylistText: {
    color: "#FFF",
    fontSize: 15,
    fontWeight: "700" as const,
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
  likedSongsIcon: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderArtwork: {
    width: "100%",
    height: "100%",
    backgroundColor: "#1A1A1A",
    justifyContent: "center",
    alignItems: "center",
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
  gridMeta: {
    color: "#9CA3AF",
    fontSize: 13,
    fontWeight: "500" as const,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  addPlaylistListCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#111113",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "#2A2A2A",
  },
  addPlaylistIconSmall: {
    width: 56,
    height: 56,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  addPlaylistTextSmall: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "700" as const,
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
    width: 56,
    height: 56,
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
  listMeta: {
    color: "#9CA3AF",
    fontSize: 13,
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
  createModal: {
    backgroundColor: "#1A1A1A",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 24,
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  createModalTitle: {
    color: "#FFF",
    fontSize: 24,
    fontWeight: "700" as const,
    marginBottom: 24,
    textAlign: "center",
  },
  input: {
    backgroundColor: "#2A2A2A",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: "#FFF",
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#3A3A3A",
  },
  visibilityContainer: {
    marginBottom: 24,
  },
  visibilityLabel: {
    color: "#9CA3AF",
    fontSize: 14,
    fontWeight: "600" as const,
    marginBottom: 12,
  },
  visibilityOptions: {
    flexDirection: "row",
    gap: 12,
  },
  visibilityOption: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: "#2A2A2A",
    borderWidth: 2,
    borderColor: "#2A2A2A",
  },
  visibilityOptionText: {
    color: "#9CA3AF",
    fontSize: 14,
    fontWeight: "600" as const,
  },
  modalActions: {
    flexDirection: "row",
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#2A2A2A",
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: "#FFF",
  },
  createButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: "#FFF",
  },
});
