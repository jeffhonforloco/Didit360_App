import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Modal,
  TextInput,
} from "react-native";
import { Stack, router } from "expo-router";
import { ArrowLeft, Search, MoreHorizontal, Plus, Heart, ChevronDown } from "lucide-react-native";
import { useUser } from "@/contexts/UserContext";
import { userPlaylists, playlistSongCounts } from "@/data/mockData";
import type { Playlist } from "@/types";

interface PlaylistItemProps {
  playlist: Playlist;
  songCount: number;
  onPress: () => void;
}

function PlaylistItem({ playlist, songCount, onPress }: PlaylistItemProps) {
  const isLikedSongs = playlist.name === "Your Likes";
  
  return (
    <TouchableOpacity
      style={styles.playlistItem}
      onPress={onPress}
      testID={`playlist-${playlist.id}`}
    >
      <View style={styles.playlistArtwork}>
        {isLikedSongs ? (
          <View style={[styles.likedSongsIcon, { backgroundColor: "#FF0080" }]}>
            <Heart size={24} color="white" fill="white" />
          </View>
        ) : (
          <Image 
            source={{ uri: playlist.tracks[0]?.artwork || "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop" }} 
            style={styles.playlistImage} 
          />
        )}
      </View>
      <View style={styles.playlistInfo}>
        <Text style={styles.playlistName} numberOfLines={1}>
          {playlist.name}
        </Text>
        <Text style={styles.playlistDetails} numberOfLines={1}>
          {songCount} songs
        </Text>
      </View>
      <TouchableOpacity style={styles.moreButton} testID={`more-playlist-${playlist.id}`}>
        <MoreHorizontal size={20} color="#666" />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

interface NewPlaylistModalProps {
  visible: boolean;
  onClose: () => void;
  onCreate: (name: string, isPublic: boolean) => void;
}

function NewPlaylistModal({ visible, onClose, onCreate }: NewPlaylistModalProps) {
  const [playlistName, setPlaylistName] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const { settings } = useUser();
  const accentColor = settings?.accentColor ?? "#FF0080";

  const handleCreate = () => {
    if (playlistName.trim()) {
      onCreate(playlistName.trim(), isPublic);
      setPlaylistName("");
      onClose();
    }
  };

  const handleCancel = () => {
    setPlaylistName("");
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>New Playlist</Text>
          
          <View style={styles.suggestionContainer}>
            <TouchableOpacity 
              style={styles.suggestionItem}
              onPress={() => setPlaylistName("Most Popular Songs")}
            >
              <Text style={styles.suggestionText}>Most Popular Songs</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.suggestionItem}
              onPress={() => setPlaylistName("Most Popular Songs Latest Releases and Updates")}
            >
              <Text style={styles.suggestionText}>Most Popular Songs Latest Releases and Updates</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.visibilityContainer}>
            <TouchableOpacity 
              style={styles.visibilityOption}
              onPress={() => setIsPublic(!isPublic)}
            >
              <View style={styles.visibilityIcon}>
                <Text style={styles.visibilityIconText}>👁</Text>
              </View>
              <Text style={styles.visibilityText}>Public</Text>
              <ChevronDown size={16} color="#666" />
            </TouchableOpacity>
          </View>

          <View style={styles.modalActions}>
            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={handleCancel}
              testID="cancel-button"
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.createButton, { backgroundColor: accentColor }]}
              onPress={handleCreate}
              testID="create-button"
            >
              <Text style={styles.createButtonText}>Create</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

export default function PlaylistsScreen() {
  const [sortBy, setSortBy] = useState("Recently Added");
  const [showNewPlaylistModal, setShowNewPlaylistModal] = useState(false);
  const { settings } = useUser();
  const accentColor = settings?.accentColor ?? "#FF0080";

  const handlePlaylistPress = (playlist: Playlist) => {
    console.log("Opening playlist:", playlist.name);
    router.push(`/playlist?id=${playlist.id}`);
  };

  const handleCreatePlaylist = (name: string, isPublic: boolean) => {
    console.log("Creating playlist:", name, "Public:", isPublic);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
          testID="back-button"
        >
          <ArrowLeft size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Playlists</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerButton} testID="search-button">
            <Search size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton} testID="more-button">
            <MoreHorizontal size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.sortContainer}>
        <Text style={styles.sortLabel}>Sort by</Text>
        <TouchableOpacity style={styles.sortButton}>
          <Text style={[styles.sortText, { color: accentColor }]}>{sortBy}</Text>
          <ChevronDown size={16} color={accentColor} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <TouchableOpacity
          style={styles.addPlaylistItem}
          onPress={() => setShowNewPlaylistModal(true)}
          testID="add-playlist-button"
        >
          <View style={[styles.addPlaylistIcon, { backgroundColor: accentColor }]}>
            <Plus size={24} color="white" />
          </View>
          <Text style={styles.addPlaylistText}>Add New Playlist</Text>
        </TouchableOpacity>

        {userPlaylists.map((playlist) => (
          <PlaylistItem
            key={playlist.id}
            playlist={playlist}
            songCount={playlistSongCounts[playlist.id] || playlist.tracks.length}
            onPress={() => handlePlaylistPress(playlist)}
          />
        ))}
      </ScrollView>

      <NewPlaylistModal
        visible={showNewPlaylistModal}
        onClose={() => setShowNewPlaylistModal(false)}
        onCreate={handleCreatePlaylist}
      />
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
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "white",
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerButton: {
    padding: 8,
    marginLeft: 8,
  },
  sortContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#1A1A1A",
  },
  sortLabel: {
    fontSize: 16,
    color: "#666",
  },
  sortButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  sortText: {
    fontSize: 16,
    fontWeight: "600",
    marginRight: 4,
  },
  content: {
    flex: 1,
  },
  addPlaylistItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#1A1A1A",
  },
  addPlaylistIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  addPlaylistText: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
  },
  playlistItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#1A1A1A",
  },
  playlistArtwork: {
    width: 60,
    height: 60,
    marginRight: 12,
  },
  likedSongsIcon: {
    width: 60,
    height: 60,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  playlistImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  playlistInfo: {
    flex: 1,
  },
  playlistName: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
    marginBottom: 4,
  },
  playlistDetails: {
    fontSize: 14,
    color: "#666",
  },
  moreButton: {
    padding: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#1A1A1A",
    borderRadius: 12,
    padding: 24,
    width: "90%",
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "white",
    textAlign: "center",
    marginBottom: 24,
  },
  suggestionContainer: {
    marginBottom: 24,
  },
  suggestionItem: {
    backgroundColor: "#2A2A2A",
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  suggestionText: {
    fontSize: 16,
    color: "white",
  },
  visibilityContainer: {
    marginBottom: 24,
  },
  visibilityOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#2A2A2A",
    borderRadius: 8,
  },
  visibilityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#3A3A3A",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  visibilityIconText: {
    fontSize: 16,
  },
  visibilityText: {
    flex: 1,
    fontSize: 16,
    color: "white",
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cancelButton: {
    flex: 1,
    padding: 16,
    borderRadius: 25,
    backgroundColor: "#2A2A2A",
    marginRight: 8,
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
  },
  createButton: {
    flex: 1,
    padding: 16,
    borderRadius: 25,
    marginLeft: 8,
    alignItems: "center",
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
  },
});