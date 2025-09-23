import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from "react-native";
import { Stack, router, useLocalSearchParams } from "expo-router";
import { ArrowLeft, Search, MoreHorizontal, Play, Shuffle, Share } from "lucide-react-native";
import { usePlayer } from "@/contexts/PlayerContext";
import { useUser } from "@/contexts/UserContext";
import { userPlaylists, playlistSongCounts } from "@/data/mockData";
import type { Track } from "@/types";

interface TrackItemProps {
  track: Track;
  index: number;
  onPlay: (track: Track) => void;
}

function TrackItem({ track, index, onPlay }: TrackItemProps) {
  const { settings } = useUser();
  const accentColor = settings?.accentColor ?? "#FF0080";

  return (
    <TouchableOpacity
      style={styles.trackItem}
      onPress={() => onPlay(track)}
      testID={`track-${track.id}`}
    >
      <Image source={{ uri: track.artwork }} style={styles.trackArtwork} />
      <View style={styles.trackInfo}>
        <Text style={styles.trackTitle} numberOfLines={1}>
          {track.title}
        </Text>
        <Text style={styles.trackArtist} numberOfLines={1}>
          {track.artist}
        </Text>
      </View>
      <View style={styles.trackActions}>
        <TouchableOpacity
          style={[styles.playButton, { backgroundColor: accentColor }]}
          onPress={() => onPlay(track)}
          testID={`play-${track.id}`}
        >
          <Play size={16} color="white" fill="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.moreButton} testID={`more-${track.id}`}>
          <MoreHorizontal size={20} color="#666" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

export default function PlaylistScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { playTrack } = usePlayer();
  const { settings } = useUser();
  const accentColor = settings?.accentColor ?? "#FF0080";

  const playlist = userPlaylists.find(p => p.id === id);
  const songCount = playlistSongCounts[id || ""] || playlist?.tracks.length || 0;

  if (!playlist) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen options={{ headerShown: false }} />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Playlist not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const handlePlayTrack = (track: Track) => {
    console.log("Playing track:", track.title);
    playTrack(track);
  };

  const handlePlayAll = () => {
    if (playlist.tracks.length > 0) {
      console.log("Playing all tracks from playlist:", playlist.name);
      playTrack(playlist.tracks[0]);
    }
  };

  const handleShuffle = () => {
    if (playlist.tracks.length > 0) {
      console.log("Shuffling playlist:", playlist.name);
      const randomIndex = Math.floor(Math.random() * playlist.tracks.length);
      playTrack(playlist.tracks[randomIndex]);
    }
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
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerButton} testID="search-button">
            <Search size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.playlistHeader}>
          <Image 
            source={{ 
              uri: playlist.tracks[0]?.artwork || "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop" 
            }} 
            style={styles.playlistArtwork} 
          />
          <Text style={styles.playlistTitle}>{playlist.name}</Text>
          <Text style={styles.playlistSubtitle}>
            Playlist | {songCount} songs
          </Text>
          
          <View style={styles.playlistActions}>
            <TouchableOpacity style={styles.actionButton} testID="like-button">
              <Text style={styles.actionIcon}>♡</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} testID="download-button">
              <Text style={styles.actionIcon}>⬇</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} testID="share-button">
              <Share size={20} color="white" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.moreButton} testID="more-playlist-button">
              <MoreHorizontal size={20} color="white" />
            </TouchableOpacity>
          </View>

          <View style={styles.playButtons}>
            <TouchableOpacity
              style={[styles.shuffleButton, { backgroundColor: accentColor }]}
              onPress={handleShuffle}
              testID="shuffle-button"
            >
              <Shuffle size={20} color="white" />
              <Text style={styles.shuffleButtonText}>Shuffle</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.playAllButton}
              onPress={handlePlayAll}
              testID="play-all-button"
            >
              <Play size={20} color="white" fill="white" />
              <Text style={styles.playAllButtonText}>Play</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.tracksContainer}>
          {playlist.tracks.map((track, index) => (
            <TrackItem
              key={track.id}
              track={track}
              index={index}
              onPlay={handlePlayTrack}
            />
          ))}
        </View>
      </ScrollView>
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
  },
  backButton: {
    padding: 8,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerButton: {
    padding: 8,
    marginLeft: 8,
  },
  content: {
    flex: 1,
  },
  playlistHeader: {
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  playlistArtwork: {
    width: 200,
    height: 200,
    borderRadius: 12,
    marginBottom: 16,
  },
  playlistTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    marginBottom: 8,
  },
  playlistSubtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 24,
  },
  playlistActions: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  actionButton: {
    padding: 12,
    marginHorizontal: 8,
  },
  actionIcon: {
    fontSize: 20,
    color: "white",
  },
  moreButton: {
    padding: 12,
    marginHorizontal: 8,
  },
  playButtons: {
    flexDirection: "row",
    width: "100%",
    marginBottom: 16,
  },
  shuffleButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 25,
    marginRight: 8,
  },
  shuffleButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
    marginLeft: 8,
  },
  playAllButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 25,
    backgroundColor: "#2A2A2A",
    marginLeft: 8,
  },
  playAllButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
    marginLeft: 8,
  },
  tracksContainer: {
    paddingHorizontal: 16,
  },
  trackItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#1A1A1A",
  },
  trackArtwork: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 12,
  },
  trackInfo: {
    flex: 1,
  },
  trackTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
    marginBottom: 4,
  },
  trackArtist: {
    fontSize: 14,
    color: "#666",
  },
  trackActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  playButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  errorContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  errorText: {
    fontSize: 18,
    color: "#666",
  },
});