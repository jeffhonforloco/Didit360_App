import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Platform,
} from "react-native";
import { Play, Pause, SkipForward } from "lucide-react-native";
import { router, usePathname } from "expo-router";
import { usePlayer } from "@/contexts/PlayerContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function MiniPlayer() {
  const { currentTrack, isPlaying, togglePlayPause, skipNext } = usePlayer();
  const insets = useSafeAreaInsets();
  const pathname = usePathname();

  // Hide MiniPlayer when full player is open
  if (!currentTrack || pathname === '/player') return null;

  const tabBarHeight = Platform.OS === "ios" ? 80 + insets.bottom : 60;

  return (
    <TouchableOpacity
      style={[styles.container, { bottom: tabBarHeight }]}
      activeOpacity={0.95}
      onPress={() => router.push("/player")}
    >
      <Image source={{ uri: currentTrack.artwork }} style={styles.artwork} />
      
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>
          {currentTrack.title}
        </Text>
        <Text style={styles.artist} numberOfLines={1}>
          {currentTrack.artist}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.controlButton}
        onPress={(e) => {
          e.stopPropagation();
          togglePlayPause();
        }}
      >
        {isPlaying ? (
          <Pause size={24} color="#FFF" fill="#FFF" />
        ) : (
          <Play size={24} color="#FFF" fill="#FFF" />
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.controlButton}
        onPress={(e) => {
          e.stopPropagation();
          skipNext();
        }}
      >
        <SkipForward size={20} color="#FFF" fill="#FFF" />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 8,
    right: 8,
    height: 60,
    backgroundColor: "#1A1A1A",
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: "#2A2A2A",
  },
  artwork: {
    width: 44,
    height: 44,
    borderRadius: 6,
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFF",
    marginBottom: 2,
  },
  artist: {
    fontSize: 12,
    color: "#999",
  },
  controlButton: {
    padding: 8,
    marginLeft: 4,
  },
});