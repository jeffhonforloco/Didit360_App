import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  FlatList,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import {
  ArrowLeft,
  Search,
  MoreVertical,
} from "lucide-react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useLibrary } from "@/contexts/LibraryContext";
import { usePlayer } from "@/contexts/PlayerContext";
import type { Playlist } from "@/types";

export default function PlaylistScreen() {
  const { playlistId } = useLocalSearchParams<{ playlistId?: string }>();
  const { playlists, createPlaylist } = useLibrary();
  const { playTrack } = usePlayer();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [newPlaylistName, setNewPlaylistName] = useState<string>("");

  const currentPlaylist = playlistId ? playlists.find(p => p.id === playlistId) : null;
  const displayPlaylists = currentPlaylist ? [currentPlaylist] : playlists;

  const filteredPlaylists = displayPlaylists.filter(playlist =>
    playlist.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreatePlaylist = () => {
    if (newPlaylistName.trim()) {
      createPlaylist(newPlaylistName.trim(), []);
      setNewPlaylistName("");
      setShowCreateModal(false);
    }
  };

  const renderPlaylistItem = ({ item }: { item: Playlist }) => (
    <TouchableOpacity
      style={styles.playlistItem}
      onPress={() => {
        if (item.tracks.length > 0) {
          playTrack(item.tracks[0]);
        }
      }}
      activeOpacity={0.8}
    >
      <View style={styles.playlistArtwork}>
        <Text style={styles.playlistInitial}>
          {item.name.charAt(0).toUpperCase()}
        </Text>
      </View>
      <View style={styles.playlistInfo}>
        <Text style={styles.playlistTitle} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.playlistSubtitle} numberOfLines={1}>
          {item.tracks.length} songs
        </Text>
      </View>
      <TouchableOpacity style={styles.playlistMore}>
        <MoreVertical size={20} color="#999" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <LinearGradient
      colors={["#1A1A1A", "#0A0A0A"]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft size={28} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Playlist</Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Search size={20} color="#999" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search"
              placeholderTextColor="#999"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        {!currentPlaylist && (
          <View style={styles.createButtonContainer}>
            <TouchableOpacity
              style={styles.createButton}
              onPress={() => setShowCreateModal(true)}
              activeOpacity={0.8}
            >
              <Text style={styles.createButtonText}>Add New Playlist</Text>
            </TouchableOpacity>
          </View>
        )}

        <FlatList
          data={filteredPlaylists}
          renderItem={renderPlaylistItem}
          keyExtractor={(item) => item.id}
          style={styles.playlistList}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.playlistContent}
        />
      </SafeAreaView>

      <Modal
        visible={showCreateModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowCreateModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>CREATE PLAYLIST</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Enter your playlist name"
              placeholderTextColor="#999"
              value={newPlaylistName}
              onChangeText={setNewPlaylistName}
              autoFocus
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setShowCreateModal(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonPrimary]}
                onPress={handleCreatePlaylist}
              >
                <Text style={[styles.modalButtonText, styles.modalButtonTextPrimary]}>
                  OK
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFF",
  },
  placeholder: {
    width: 28,
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2A2A2A",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#FFF",
  },
  createButtonContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  createButton: {
    backgroundColor: "#8B1538",
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: "center",
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFF",
  },
  playlistList: {
    flex: 1,
  },
  playlistContent: {
    paddingBottom: 120,
  },
  playlistItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  playlistArtwork: {
    width: 56,
    height: 56,
    borderRadius: 8,
    backgroundColor: "#8B1538",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  playlistInitial: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FFF",
  },
  playlistInfo: {
    flex: 1,
  },
  playlistTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFF",
    marginBottom: 4,
  },
  playlistSubtitle: {
    fontSize: 14,
    color: "#999",
  },
  playlistMore: {
    padding: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#2A2A2A",
    borderRadius: 12,
    padding: 24,
    width: "80%",
    maxWidth: 320,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFF",
    textAlign: "center",
    marginBottom: 20,
  },
  modalInput: {
    backgroundColor: "#1A1A1A",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: "#FFF",
    marginBottom: 24,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    marginHorizontal: 8,
    borderRadius: 8,
  },
  modalButtonPrimary: {
    backgroundColor: "#8B1538",
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#999",
  },
  modalButtonTextPrimary: {
    color: "#FFF",
  },
});