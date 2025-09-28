import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Platform,
  PanResponder,
  useWindowDimensions,
} from "react-native";
import SafeImage from "@/components/SafeImage";
import { Play, Pause, SkipForward, Video, X, Volume2, VolumeX } from "lucide-react-native";
import { router, usePathname } from "expo-router";
import { usePlayer } from "@/contexts/PlayerContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { audioEngine, Progress } from "@/lib/AudioEngine";
import { searchArtists, popularArtists } from "@/data/mockData";

export function MiniPlayer() {
  const { currentTrack, isPlaying, togglePlayPause, skipNext, stopPlayer } = usePlayer();
  const insets = useSafeAreaInsets();
  const pathname = usePathname();
  const { width } = useWindowDimensions();
  const [progress, setProgress] = useState<number>(0);
  const [positionMs, setPositionMs] = useState<number>(0);
  const [durationMs, setDurationMs] = useState<number>(0);
  const [volume, setVolume] = useState<number>(1.0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragProgress, setDragProgress] = useState<number>(0);

  // Memoize progress update callback for better performance
  const updateProgress = useCallback((p: Progress) => {
    if (!isDragging) {
      setPositionMs(p.position);
      setDurationMs(p.duration);
      const pct = p.duration > 0 ? p.position / p.duration : 0;
      setProgress(Math.max(0, Math.min(1, pct)));
    }
  }, [isDragging]);

  useEffect(() => {
    const unsubscribe = audioEngine.subscribeProgress(updateProgress);
    return unsubscribe;
  }, [updateProgress]);

  // Initialize volume from audio engine
  useEffect(() => {
    const currentVolume = audioEngine.getVolume();
    setVolume(currentVolume);
    setIsMuted(currentVolume === 0);
  }, []);

  // Memoize control handlers for better performance
  const handlePlayPause = useCallback(async () => {
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

  const handleSkipNext = useCallback(async () => {
    console.log('[MiniPlayer] ===== SKIP NEXT BUTTON PRESSED =====');
    
    // Check if we have a valid track
    if (!currentTrack) {
      console.log('[MiniPlayer] ❌ No current track available for skip');
      return;
    }
    
    try {
      await skipNext();
      console.log('[MiniPlayer] ✅ skipNext completed successfully');
    } catch (error) {
      console.log('[MiniPlayer] ❌ skipNext failed:', error);
    }
  }, [skipNext, currentTrack]);

  const handleStop = useCallback(async () => {
    console.log('[MiniPlayer] ===== STOP BUTTON PRESSED =====');
    try {
      await stopPlayer();
      console.log('[MiniPlayer] ✅ stopPlayer completed successfully');
    } catch (error) {
      console.log('[MiniPlayer] ❌ stopPlayer failed:', error);
    }
  }, [stopPlayer]);

  // Handle volume control
  const handleVolumeChange = useCallback((newVolume: number) => {
    if (typeof newVolume !== 'number' || newVolume < 0 || newVolume > 1) return;
    console.log('[MiniPlayer] Setting volume to:', newVolume);
    
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
    
    // Apply volume to audio engine for non-video tracks
    if (currentTrack && currentTrack.type !== 'video' && !currentTrack.isVideo) {
      audioEngine.setVolume(newVolume).catch((err: unknown) => console.log('[MiniPlayer] volume error', err));
    }
  }, [currentTrack]);

  const toggleMute = useCallback(() => {
    console.log('[MiniPlayer] Toggle mute - current state:', { isMuted, volume });
    if (isMuted || volume === 0) {
      // Unmute: restore to 0.5 or previous volume
      const newVolume = 0.5;
      handleVolumeChange(newVolume);
    } else {
      // Mute: set volume to 0
      handleVolumeChange(0);
    }
  }, [isMuted, volume, handleVolumeChange]);

  // Handle progress bar seeking
  const handleSeek = useCallback((locationX: number) => {
    if (!currentTrack || currentTrack.type === 'video' || currentTrack.isVideo) return;
    
    const containerWidth = 200; // Approximate progress bar width
    const newProgress = Math.max(0, Math.min(1, locationX / containerWidth));
    const target = Math.floor(newProgress * (durationMs || 0));
    
    console.log('[MiniPlayer] Seeking to:', target, 'ms, progress:', newProgress);
    
    // Update progress immediately for responsive UI
    setProgress(newProgress);
    setPositionMs(target);
    
    // Perform the actual seek
    audioEngine.seekTo(target).catch((err: unknown) => console.log('[MiniPlayer] seek error', err));
  }, [currentTrack, durationMs]);

  // Create pan responder for progress slider
  const progressPanResponder = useMemo(() => PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: (evt) => {
      if (currentTrack && (currentTrack.type === 'video' || currentTrack.isVideo)) return;
      console.log('[MiniPlayer] Progress pan responder grant');
      setIsDragging(true);
      const { locationX } = evt.nativeEvent;
      const containerWidth = 200;
      const newProgress = Math.max(0, Math.min(1, locationX / containerWidth));
      setDragProgress(newProgress);
    },
    onPanResponderMove: (evt) => {
      if (currentTrack && (currentTrack.type === 'video' || currentTrack.isVideo)) return;
      const { locationX } = evt.nativeEvent;
      const containerWidth = 200;
      const newProgress = Math.max(0, Math.min(1, locationX / containerWidth));
      setDragProgress(newProgress);
    },
    onPanResponderRelease: (evt) => {
      if (currentTrack && (currentTrack.type === 'video' || currentTrack.isVideo)) return;
      console.log('[MiniPlayer] Progress pan responder release');
      const { locationX } = evt.nativeEvent;
      const containerWidth = 200;
      const newProgress = Math.max(0, Math.min(1, locationX / containerWidth));
      const target = Math.floor(newProgress * (durationMs || 0));
      
      // Update progress and position
      setProgress(newProgress);
      setPositionMs(target);
      setIsDragging(false);
      
      // Perform the actual seek
      audioEngine.seekTo(target).catch((err: unknown) => console.log('[MiniPlayer] drag seek error', err));
    },
    onPanResponderTerminate: () => {
      setIsDragging(false);
    },
  }), [currentTrack, durationMs]);

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
    <View
      style={[styles.container, { bottom: tabBarHeight }]}
      testID="mini-player"
      accessibilityRole="summary"
    >
      <TouchableOpacity
        style={styles.leftArea}
        activeOpacity={0.95}
        onPress={handlePress}
        testID="mini-open"
        accessibilityLabel="Open player"
        accessibilityRole="button"
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
          <View 
            style={styles.progressBarContainer}
            {...progressPanResponder.panHandlers}
          >
            <TouchableOpacity 
              style={styles.progressBarTouchArea}
              activeOpacity={1}
              onPress={(e) => {
                const { locationX } = e.nativeEvent;
                handleSeek(locationX);
              }}
              disabled={currentTrack.type === 'video' || currentTrack.isVideo}
            >
              <View style={styles.barTrack}>
                <View 
                  style={[styles.barProgress, { width: `${(isDragging ? dragProgress : progress) * 100}%` }]} 
                  testID="mini-progress" 
                />
                <View 
                  style={[styles.progressThumb, { left: `${(isDragging ? dragProgress : progress) * 100}%` }]} 
                />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>

      <View style={styles.controls}>
        {/* Volume Control for Audio Tracks */}
        {currentTrack && currentTrack.type !== 'video' && !currentTrack.isVideo && (
          <TouchableOpacity
            style={styles.controlButton}
            onPress={toggleMute}
            testID="mini-volume"
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            accessible={true}
            accessibilityLabel={isMuted ? "Unmute" : "Mute"}
            accessibilityRole="button"
          >
            {isMuted ? (
              <VolumeX size={18} color="#FF0080" />
            ) : (
              <Volume2 size={18} color="#FFF" />
            )}
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[styles.controlButton, styles.playButton]}
          onPress={handlePlayPause}
          testID="mini-toggle"
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          activeOpacity={0.6}
          delayPressIn={0}
          delayPressOut={50}
          disabled={!currentTrack}
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
          disabled={!currentTrack}
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
      </View>
    </View>
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  leftArea: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
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
    marginRight: 8,
  },
  progressBarContainer: {
    marginTop: 6,
    height: 20,
    justifyContent: 'center',
  },
  progressBarTouchArea: {
    height: 20,
    justifyContent: 'center',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 4,
  },
  barTrack: {
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 2,
    overflow: 'hidden',
    position: 'relative',
  },
  barProgress: {
    height: '100%',
    backgroundColor: '#FF0080',
  },
  progressThumb: {
    position: 'absolute',
    top: -2,
    width: 7,
    height: 7,
    backgroundColor: '#FF0080',
    borderRadius: 3.5,
    marginLeft: -3.5,
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