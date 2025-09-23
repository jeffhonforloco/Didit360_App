import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  FlatList,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ArrowLeft,
  MoreHorizontal,
  Heart,
  Plus,
  Play,
} from "lucide-react-native";
import { router, useLocalSearchParams } from "expo-router";
import { usePlayer } from "@/contexts/PlayerContext";
import { allTracks } from "@/data/mockData";
import type { Track } from "@/types";

export default function PlaylistScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { playTrack } = usePlayer();
  const [isLiked, setIsLiked] = useState(false);

  // Mock playlist data - in real app this would come from API
  const playlist = {
    id: id || '1',
    title: 'Ariana Grande - Top Greatest Hits',
    artist: 'Theresa Wilona',
    type: 'Playlist',
    year: '2022',
    artwork: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop',
    tracks: allTracks.slice(0, 10)
  };

  const handlePlayAll = () => {
    if (playlist.tracks.length > 0) {
      playTrack(playlist.tracks[0]);
    }
  };

  const renderTrack = ({ item }: { item: Track }) => (
    <TouchableOpacity
      style={styles.trackItem}
      onPress={() => playTrack(item)}
      activeOpacity={0.8}
    >
      <Image source={{ uri: item.artwork }} style={styles.trackArtwork} />
      <View style={styles.trackInfo}>
        <Text style={styles.trackTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.trackArtist} numberOfLines={1}>
          {item.artist}
        </Text>
      </View>
      <TouchableOpacity style={styles.playButton}>
        <Play size={16} color="#E91E63" fill="#E91E63" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.moreButton}>
        <MoreHorizontal size={20} color="#999" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft size={24} color="#FFF" />
          </TouchableOpacity>
          <TouchableOpacity>
            <MoreHorizontal size={24} color="#FFF" />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.playlistHeader}>
            <Image source={{ uri: playlist.artwork }} style={styles.playlistArtwork} />
            <Text style={styles.playlistTitle}>{playlist.title}</Text>
            <Text style={styles.playlistMeta}>by {playlist.artist}</Text>
            <Text style={styles.playlistInfo}>{playlist.type} | {playlist.year}</Text>
            
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={styles.likeButton}
                onPress={() => setIsLiked(!isLiked)}
              >
                <Heart size={24} color={isLiked ? "#E91E63" : "#FFF"} fill={isLiked ? "#E91E63" : "none"} />
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.addButton}>
                <Plus size={24} color="#FFF" />
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.moreActionButton}>
                <MoreHorizontal size={24} color="#FFF" />
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.playAllButton} onPress={handlePlayAll}>
                <Play size={20} color="#FFF" fill="#FFF" />
                <Text style={styles.playAllText}>Play</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.songsSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Songs</Text>
              <TouchableOpacity>
                <Text style={styles.seeAllText}>See All</Text>
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={playlist.tracks}
              renderItem={renderTrack}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              contentContainerStyle={styles.tracksList}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A0A0A",
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
  playlistHeader: {
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  playlistArtwork: {
    width: 200,
    height: 200,
    borderRadius: 16,
    marginBottom: 20,
  },
  playlistTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFF",
    textAlign: "center",
    marginBottom: 8,
  },
  playlistMeta: {
    fontSize: 16,
    color: "#999",
    marginBottom: 4,
  },
  playlistInfo: {
    fontSize: 14,
    color: "#999",
    marginBottom: 24,
  },
  actionButtons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  likeButton: {
    padding: 8,
  },
  addButton: {
    padding: 8,
  },
  moreActionButton: {
    padding: 8,
  },
  playAllButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E91E63",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    gap: 8,
  },
  playAllText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
  songsSection: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFF",
  },
  seeAllText: {
    fontSize: 14,
    color: "#E91E63",
    fontWeight: "600",
  },
  tracksList: {
    gap: 8,
  },
  trackItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  trackArtwork: {
    width: 48,
    height: 48,
    borderRadius: 8,
    marginRight: 12,
  },
  trackInfo: {
    flex: 1,
  },
  trackTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFF",
    marginBottom: 4,
  },
  trackArtist: {
    fontSize: 14,
    color: "#999",
  },
  playButton: {
    padding: 8,
    marginRight: 8,
  },
  moreButton: {
    padding: 8,
  },
});