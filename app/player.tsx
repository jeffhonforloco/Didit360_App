import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import {
  ChevronDown,
  MoreVertical,
  Heart,
  Share2,
  SkipBack,
  SkipForward,
  Play,
  Pause,
  Repeat,
  Shuffle,
  List,
} from "lucide-react-native";
import { router } from "expo-router";
import { usePlayer } from "@/contexts/PlayerContext";
import { useLibrary } from "@/contexts/LibraryContext";


export default function PlayerScreen() {
  const { width } = useWindowDimensions();
  const { currentTrack, isPlaying, togglePlayPause, skipNext, skipPrevious } = usePlayer();
  const { toggleFavorite, isFavorite } = useLibrary();
  const [progress, setProgress] = useState(0.3);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);

  if (!currentTrack) {
    router.back();
    return null;
  }

  const isLiked = isFavorite(currentTrack.id);

  return (
    <LinearGradient
      colors={["#1A1A1A", "#0A0A0A"]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <ChevronDown size={28} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Now Playing</Text>
          <TouchableOpacity>
            <MoreVertical size={24} color="#FFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.artworkContainer}>
          <Image
            source={{ uri: currentTrack.artwork }}
            style={[styles.artwork, { width: width - 80, height: width - 80 }]}
          />
        </View>

        <View style={styles.infoContainer}>
          <View style={styles.titleRow}>
            <View style={styles.titleContainer}>
              <Text style={styles.title} numberOfLines={1}>
                {currentTrack.title}
              </Text>
              <Text style={styles.artist} numberOfLines={1}>
                {currentTrack.artist}
              </Text>
            </View>
            <TouchableOpacity onPress={() => toggleFavorite(currentTrack)}>
              <Heart
                size={24}
                color={isLiked ? "#FF0080" : "#FFF"}
                fill={isLiked ? "#FF0080" : "transparent"}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.progressContainer}>
            <TouchableOpacity 
              style={styles.sliderContainer}
              activeOpacity={1}
              onPress={(e) => {
                // Calculate progress based on touch position
                const { locationX } = e.nativeEvent;
                const containerWidth = width - 40; // Account for padding
                const newProgress = Math.max(0, Math.min(1, locationX / containerWidth));
                setProgress(newProgress);
              }}
            >
              <View style={styles.sliderTrack}>
                <View style={[styles.sliderProgress, { width: `${progress * 100}%` }]} />
                <View style={[styles.sliderThumb, { left: `${progress * 100}%` }]} />
              </View>
            </TouchableOpacity>
            <View style={styles.timeRow}>
              <Text style={styles.time}>1:23</Text>
              <Text style={styles.time}>3:45</Text>
            </View>
          </View>

          <View style={styles.controls}>
            <TouchableOpacity
              onPress={() => setShuffle(!shuffle)}
              style={styles.controlButton}
            >
              <Shuffle size={20} color={shuffle ? "#FF0080" : "#999"} />
            </TouchableOpacity>

            <TouchableOpacity onPress={skipPrevious} style={styles.controlButton}>
              <SkipBack size={32} color="#FFF" fill="#FFF" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={togglePlayPause}
              style={styles.playButton}
            >
              {isPlaying ? (
                <Pause size={32} color="#000" fill="#000" />
              ) : (
                <Play size={32} color="#000" fill="#000" style={styles.playIcon} />
              )}
            </TouchableOpacity>

            <TouchableOpacity onPress={skipNext} style={styles.controlButton}>
              <SkipForward size={32} color="#FFF" fill="#FFF" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setRepeat(!repeat)}
              style={styles.controlButton}
            >
              <Repeat size={20} color={repeat ? "#FF0080" : "#999"} />
            </TouchableOpacity>
          </View>

          <View style={styles.bottomActions}>
            <TouchableOpacity style={styles.actionButton}>
              <Share2 size={20} color="#999" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <List size={20} color="#999" />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
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
    fontSize: 16,
    fontWeight: "600",
    color: "#FFF",
  },
  artworkContainer: {
    alignItems: "center",
    paddingHorizontal: 40,
    marginTop: 20,
  },
  artwork: {
    borderRadius: 8,
  },
  infoContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FFF",
    marginBottom: 4,
  },
  artist: {
    fontSize: 18,
    color: "#999",
  },
  progressContainer: {
    marginBottom: 32,
  },
  sliderContainer: {
    height: 40,
    justifyContent: 'center',
    paddingHorizontal: 0,
  },
  sliderTrack: {
    height: 4,
    backgroundColor: '#333',
    borderRadius: 2,
    position: 'relative',
  },
  sliderProgress: {
    height: '100%',
    backgroundColor: '#FF0080',
    borderRadius: 2,
  },
  sliderThumb: {
    position: 'absolute',
    top: -6,
    width: 16,
    height: 16,
    backgroundColor: '#FF0080',
    borderRadius: 8,
    marginLeft: -8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  timeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: -8,
  },
  time: {
    fontSize: 12,
    color: "#999",
  },
  controls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 32,
  },
  controlButton: {
    padding: 12,
    marginHorizontal: 12,
  },
  playButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 20,
  },
  bottomActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  actionButton: {
    padding: 12,
  },

  titleContainer: {
    flex: 1,
  },
  playIcon: {
    marginLeft: 4,
  },
});