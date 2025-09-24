import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Platform,
} from "react-native";
import { Play, Pause, SkipForward, Video, X } from "lucide-react-native";
import { router, usePathname } from "expo-router";
import { usePlayer } from "@/contexts/PlayerContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { audioEngine, Progress } from "@/lib/AudioEngine";

export function MiniPlayer() {
  const { currentTrack, isPlaying, togglePlayPause, skipNext, stopPlayer } = usePlayer();
  const insets = useSafeAreaInsets();
  const pathname = usePathname();
  const [progress, setProgress] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  void duration;

  useEffect(() => {
    const unsubscribe = audioEngine.subscribeProgress((p: Progress) => {
      const d = p.duration > 0 ? p.duration : 0;
      setDuration(d);
      const pct = d > 0 ? p.position / d : 0;
      setProgress(Math.max(0, Math.min(1, pct)));
    });
    return () => {
      unsubscribe();
    };
  }, []);

  // Hide MiniPlayer when full player is open or no track is loaded
  if (!currentTrack || pathname === '/player') return null;

  const tabBarHeight = Platform.OS === "ios" ? 80 + insets.bottom : 60;

  return (
    <TouchableOpacity
      style={[styles.container, { bottom: tabBarHeight }]}
      activeOpacity={0.95}
      onPress={() => router.push("/player")}
      testID="mini-player"
    >
      <View style={styles.artworkContainer}>
        <Image source={{ uri: currentTrack.artwork }} style={styles.artwork} />
        {(currentTrack.isVideo || currentTrack.type === "video") && (
          <View style={styles.videoIndicator}>
            <Video size={12} color="#FFF" />
          </View>
        )}
      </View>
      
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1} testID="mini-title">
          {currentTrack.title}
        </Text>
        <Text style={styles.artist} numberOfLines={1} testID="mini-artist">
          {currentTrack.artist}
        </Text>
        <View style={styles.barTrack}>
          <View style={[styles.barProgress, { width: `${progress * 100}%` }]} testID="mini-progress" />
        </View>
      </View>

      <TouchableOpacity
        style={styles.controlButton}
        onPress={(e) => {
          e.stopPropagation();
          togglePlayPause();
        }}
        testID="mini-toggle"
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
        testID="mini-next"
      >
        <SkipForward size={20} color="#FFF" fill="#FFF" />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.controlButton}
        onPress={(e) => {
          e.stopPropagation();
          stopPlayer();
        }}
        testID="mini-close"
      >
        <X size={18} color="#999" />
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
  artworkContainer: {
    position: "relative",
    marginRight: 12,
  },
  artwork: {
    width: 44,
    height: 44,
    borderRadius: 6,
  },
  videoIndicator: {
    position: "absolute",
    top: 4,
    right: 4,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    borderRadius: 8,
    padding: 2,
  },
  info: {
    flex: 1,
  },
  barTrack: {
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 2,
    overflow: 'hidden',
    marginTop: 6,
  },
  barProgress: {
    height: '100%',
    backgroundColor: '#FF0080',
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