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
import { searchArtists, popularArtists } from "@/data/mockData";

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
  const handlePlayPause = useCallback(async (e: any) => {
    e?.stopPropagation?.();
    console.log('[MiniPlayer] ===== PLAY/PAUSE BUTTON PRESSED =====');
    console.log('[MiniPlayer] Current state - isPlaying:', isPlaying, 'currentTrack:', currentTrack?.title);
    console.log('[MiniPlayer] Current track details:', {
      id: currentTrack?.id,
      title: currentTrack?.title,
      audioUrl: currentTrack?.audioUrl,
      type: currentTrack?.type,
      isVideo: currentTrack?.isVideo
    });
    
    // Check if we have a valid track
    if (!currentTrack) {
      console.log('[MiniPlayer] ❌ No current track available');
      return;
    }
    
    console.log('[MiniPlayer] 🎯 Calling togglePlayPause - BEFORE');
    console.log('[MiniPlayer] Button state before toggle:', { isPlaying });
    
    try {
      await togglePlayPause();
      console.log('[MiniPlayer] ✅ togglePlayPause completed successfully');
    } catch (error) {
      console.log('[MiniPlayer] ❌ togglePlayPause failed:', error);
    }
    
    console.log('[MiniPlayer] 🎯 togglePlayPause call finished - AFTER');
  }, [togglePlayPause, isPlaying, currentTrack]);

  const handleSkipNext = useCallback(async (e: any) => {
    e?.stopPropagation?.();
    console.log('[MiniPlayer] ===== SKIP NEXT BUTTON PRESSED =====');
    try {
      await skipNext();
      console.log('[MiniPlayer] ✅ skipNext completed successfully');
    } catch (error) {
      console.log('[MiniPlayer] ❌ skipNext failed:', error);
    }
  }, [skipNext]);

  const handleStop = useCallback(async (e: any) => {
    e?.stopPropagation?.();
    console.log('[MiniPlayer] ===== STOP BUTTON PRESSED =====');
    try {
      await stopPlayer();
      console.log('[MiniPlayer] ✅ stopPlayer completed successfully');
    } catch (error) {
      console.log('[MiniPlayer] ❌ stopPlayer failed:', error);
    }
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

  const artworkUri = useMemo(() => {
    const trackArt = currentTrack?.artwork?.trim();
    if (trackArt && trackArt.length > 0) return trackArt;
    const artistName = currentTrack?.artist?.trim().toLowerCase();
    if (!artistName) return undefined;
    const fromSearch = searchArtists.find((a) => a.name?.toLowerCase?.() === artistName);
    if (fromSearch?.image) return fromSearch.image;
    const fromPopular = popularArtists.find((a) => a.name?.toLowerCase?.() === artistName);
    if (fromPopular?.image) return fromPopular.image;
    return undefined;
  }, [currentTrack]);

  // Hide MiniPlayer when full player is open or no track is loaded
  if (!currentTrack || pathname === '/player') {
    console.log('[MiniPlayer] Hidden - currentTrack:', !!currentTrack, 'pathname:', pathname);
    return null;
  }

  console.log('[MiniPlayer] Rendering - Track:', currentTrack.title, 'isPlaying:', isPlaying, 'Type:', currentTrack.type, 'isVideo:', currentTrack.isVideo);

  return (
    <TouchableOpacity
      style={[styles.container, { bottom: tabBarHeight }]}
      activeOpacity={0.95}
      onPress={handlePress}
      testID="mini-player"
    >
      <View style={styles.artworkContainer}>
        <SafeImage
          uri={artworkUri}
          style={styles.artwork}
          testID="mini-artwork"
          accessibilityLabel="Track artwork"
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
        style={[styles.controlButton, styles.playButton]}
        onPress={handlePlayPause}
        testID="mini-toggle"
        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        activeOpacity={0.6}
        delayPressIn={0}
        delayPressOut={50}
        disabled={false}
        accessible={true}
        accessibilityLabel={isPlaying ? "Pause" : "Play"}
        accessibilityRole="button"
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
        accessible={true}
        accessibilityLabel="Skip to next track"
        accessibilityRole="button"
      >
        <SkipForward size={20} color="#FFF" fill="#FFF" />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.controlButton}
        onPress={handleStop}
        testID="mini-close"
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        accessible={true}
        accessibilityLabel="Stop and close player"
        accessibilityRole="button"
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
  playButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
});