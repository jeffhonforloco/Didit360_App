import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Platform,
} from "react-native";
import SafeImage from "@/components/SafeImage";
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

  // Memoize progress update callback for better performance
  const updateProgress = useCallback((p: Progress) => {
    const d = p.duration > 0 ? p.duration : 0;
    setDuration(d);
    const pct = d > 0 ? p.position / d : 0;
    setProgress(Math.max(0, Math.min(1, pct)));
  }, []);

  useEffect(() => {
    const unsubscribe = audioEngine.subscribeProgress(updateProgress);
    return unsubscribe;
  }, [updateProgress]);

  // Memoize control handlers for better performance
  const handlePlayPause = useCallback((e: any) => {
    e.stopPropagation();
    togglePlayPause();
  }, [togglePlayPause]);

  const handleSkipNext = useCallback((e: any) => {
    e.stopPropagation();
    skipNext();
  }, [skipNext]);

  const handleStop = useCallback((e: any) => {
    e.stopPropagation();
    stopPlayer();
  }, [stopPlayer]);

  const handlePress = useCallback(() => {
    router.push("/player");
  }, []);

  // Memoize computed values
  const tabBarHeight = useMemo(() => {
    return Platform.OS === "ios" ? 80 + insets.bottom : 60;
  }, [insets.bottom]);

  const isVideoTrack = useMemo(() => {
    return currentTrack?.isVideo || currentTrack?.type === "video";
  }, [currentTrack]);

  // Hide MiniPlayer when full player is open or no track is loaded
  if (!currentTrack || pathname === '/player') return null;

  return (
    <TouchableOpacity
      style={[styles.container, { bottom: tabBarHeight }]}
      activeOpacity={0.95}
      onPress={handlePress}
      testID="mini-player"
    >
      <View style={styles.artworkContainer}>
        <SafeImage 
          uri={currentTrack.artwork} 
          style={styles.artwork}
        />
        {isVideoTrack && (
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
          <View 
            style={[styles.barProgress, { width: `${progress * 100}%` }]} 
            testID="mini-progress" 
          />
        </View>
      </View>

      <TouchableOpacity
        style={styles.controlButton}
        onPress={handlePlayPause}
        testID="mini-toggle"
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        {isPlaying ? (
          <Pause size={24} color="#FFF" fill="#FFF" />
        ) : (
          <Play size={24} color="#FFF" fill="#FFF" />
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.controlButton}
        onPress={handleSkipNext}
        testID="mini-next"
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <SkipForward size={20} color="#FFF" fill="#FFF" />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.controlButton}
        onPress={handleStop}
        testID="mini-close"
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
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
    // Add shadow for better visual separation
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
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