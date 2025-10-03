import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Platform,
  Animated,
} from "react-native";
import SafeImage from "@/components/SafeImage";
import { Play, Pause, SkipForward, Video, X, Volume2, VolumeX } from "lucide-react-native";
import { router, usePathname } from "expo-router";
import { usePlayer } from "@/contexts/PlayerContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { audioEngine, Progress } from "@/lib/AudioEngine";
import { searchArtists, popularArtists } from "@/data/mockData";
import AdPlayer from "@/components/AdPlayer";

export function MiniPlayer() {
  const { currentTrack, isPlaying, togglePlayPause, skipNext, stopPlayer, showAdModal, closeAdModal } = usePlayer();
  const insets = useSafeAreaInsets();
  const pathname = usePathname();

  const [progress, setProgress] = useState<number>(0);
  const [positionMs, setPositionMs] = useState<number>(0);
  const [durationMs, setDurationMs] = useState<number>(0);
  const [volume, setVolume] = useState<number>(1.0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [buttonPressed, setButtonPressed] = useState<string | null>(null);
  const scaleAnim = useState(new Animated.Value(1))[0];

  const updateProgress = useCallback((p: Progress) => {
    setPositionMs(p.position);
    setDurationMs(p.duration);
    const pct = p.duration > 0 ? p.position / p.duration : 0;
    setProgress(Math.max(0, Math.min(1, pct)));
  }, []);

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

  const animateButton = useCallback((buttonId: string) => {
    setButtonPressed(buttonId);
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.85,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => setButtonPressed(null));
  }, [scaleAnim]);

  const handlePlayPause = useCallback(async () => {
    console.log('[MiniPlayer] ===== PLAY/PAUSE BUTTON PRESSED =====');
    
    if (!currentTrack) {
      console.log('[MiniPlayer] ❌ No current track available');
      return;
    }
    
    animateButton('play-pause');
    
    try {
      await togglePlayPause();
      console.log('[MiniPlayer] ✅ togglePlayPause completed');
    } catch (error) {
      console.log('[MiniPlayer] ❌ togglePlayPause failed:', error);
    }
  }, [togglePlayPause, currentTrack, animateButton]);

  const handleSkipNext = useCallback(async () => {
    console.log('[MiniPlayer] ===== SKIP NEXT BUTTON PRESSED =====');
    
    if (!currentTrack) {
      console.log('[MiniPlayer] ❌ No current track available for skip');
      return;
    }
    
    animateButton('skip-next');
    
    try {
      await skipNext();
      console.log('[MiniPlayer] ✅ skipNext completed');
    } catch (error) {
      console.log('[MiniPlayer] ❌ skipNext failed:', error);
    }
  }, [skipNext, currentTrack, animateButton]);

  const handleStop = useCallback(async () => {
    console.log('[MiniPlayer] ===== STOP BUTTON PRESSED =====');
    
    animateButton('stop');
    
    try {
      await stopPlayer();
      console.log('[MiniPlayer] ✅ stopPlayer completed');
    } catch (error) {
      console.log('[MiniPlayer] ❌ stopPlayer failed:', error);
    }
  }, [stopPlayer, animateButton]);

  const handleVolumeChange = useCallback(async (newVolume: number) => {
    if (typeof newVolume !== 'number' || newVolume < 0 || newVolume > 1) return;
    console.log('[MiniPlayer] Setting volume to:', newVolume);
    
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
    
    if (currentTrack && currentTrack.type !== 'video' && !currentTrack.isVideo) {
      try {
        await audioEngine.setVolume(newVolume);
        console.log('[MiniPlayer] ✅ Volume set successfully to:', newVolume);
      } catch (err) {
        console.log('[MiniPlayer] ❌ Volume set error:', err);
      }
    }
  }, [currentTrack]);

  const toggleMute = useCallback(async () => {
    console.log('[MiniPlayer] Toggle mute - current state:', { isMuted, volume });
    
    animateButton('volume');
    
    if (isMuted || volume === 0) {
      const newVolume = 0.7;
      await handleVolumeChange(newVolume);
    } else {
      await handleVolumeChange(0);
    }
  }, [isMuted, volume, handleVolumeChange, animateButton]);

  const handleSeek = useCallback(async (locationX: number, containerWidth: number) => {
    if (!currentTrack || currentTrack.type === 'video' || currentTrack.isVideo) return;
    
    const newProgress = Math.max(0, Math.min(1, locationX / containerWidth));
    const target = Math.floor(newProgress * (durationMs || 0));
    
    console.log('[MiniPlayer] Seeking to:', target, 'ms, progress:', newProgress);
    
    setProgress(newProgress);
    setPositionMs(target);
    
    try {
      await audioEngine.seekTo(target);
      console.log('[MiniPlayer] ✅ Seek successful to:', target, 'ms');
    } catch (err) {
      console.log('[MiniPlayer] ❌ Seek error:', err);
      const currentProgress = durationMs > 0 ? positionMs / durationMs : 0;
      setProgress(currentProgress);
    }
  }, [currentTrack, durationMs, positionMs]);

  const formatTime = useCallback((ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }, []);

  const handlePress = useCallback(() => {
    router.push("/player");
  }, []);

  // Memoize computed values
  const isTabRoute = useMemo(() => {
    // Check if current route is within tabs
    return pathname.startsWith('/(tabs)') || 
           pathname === '/' || 
           pathname === '/search' || 
           pathname === '/library' || 
           pathname === '/news' || 
           pathname === '/ai-dj' || 
           pathname === '/profile';
  }, [pathname]);

  // Routes that should show MiniPlayer at bottom without tab bar offset
  const isFullScreenRoute = useMemo(() => {
    return pathname.startsWith('/artist/') ||
           pathname.startsWith('/album/') ||
           pathname.startsWith('/song/') ||
           pathname.startsWith('/playlist') ||
           pathname.startsWith('/genre/') ||
           pathname.startsWith('/audiobook/') ||
           pathname.startsWith('/podcast-show/') ||
           pathname.startsWith('/podcast-episode/') ||
           pathname.startsWith('/profile/') ||
           pathname === '/trending-now' ||
           pathname === '/popular-artists' ||
           pathname === '/new-releases' ||
           pathname === '/music-videos' ||
           pathname === '/top-charts' ||
           pathname === '/your-mix' ||
           pathname === '/history' ||
           pathname === '/playlists' ||
           pathname === '/downloads' ||
           pathname === '/podcasts' ||
           pathname === '/albums' ||
           pathname === '/songs' ||
           pathname === '/artists' ||
           pathname === '/audiobooks' ||
           pathname === '/browse-categories' ||
           pathname.startsWith('/categories/');
  }, [pathname]);

  const tabBarHeight = useMemo(() => {
    if (isFullScreenRoute) {
      // Full screen routes: position at bottom with safe area only
      return insets.bottom + 8;
    }
    if (!isTabRoute) {
      // Other non-tab routes: position at bottom with safe area
      return insets.bottom + 8;
    }
    // Tab routes: account for tab bar height
    return Platform.OS === "ios" ? 80 + insets.bottom : 60;
  }, [insets.bottom, isTabRoute, isFullScreenRoute]);

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

  if (!currentTrack || pathname === '/player') {
    return null;
  }

  return (
    <>
      <AdPlayer
        visible={showAdModal}
        onClose={closeAdModal}
        onComplete={closeAdModal}
      />
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
          <View style={styles.progressBarContainer}>
            <View 
              style={styles.progressBarTouchArea}
              onStartShouldSetResponder={() => true}
              onResponderRelease={(e) => {
                if (currentTrack.type === 'video' || currentTrack.isVideo) return;
                const { locationX } = e.nativeEvent;
                const layout = e.currentTarget as any;
                if (layout && layout.measure) {
                  layout.measure((_x: number, _y: number, width: number) => {
                    handleSeek(locationX, width);
                  });
                } else {
                  handleSeek(locationX, 200);
                }
              }}
              testID="mini-progress-bar"
            >
              <View style={styles.barTrack}>
                <View 
                  style={[styles.barProgress, { width: `${progress * 100}%` }]} 
                  testID="mini-progress" 
                />
                <View 
                  style={[styles.progressThumb, { left: `${progress * 100}%` }]} 
                />
              </View>
            </View>
            <View style={styles.timeContainer}>
              <Text style={styles.timeText}>{formatTime(positionMs)}</Text>
              <Text style={styles.timeText}>{formatTime(durationMs)}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>

      <View style={styles.controls}>
        {currentTrack && currentTrack.type !== 'video' && !currentTrack.isVideo && (
          <Animated.View style={{ transform: [{ scale: buttonPressed === 'volume' ? scaleAnim : 1 }] }}>
            <TouchableOpacity
              style={styles.controlButton}
              onPress={toggleMute}
              testID="mini-volume"
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              accessible={true}
              accessibilityLabel={isMuted ? "Unmute" : "Mute"}
              accessibilityRole="button"
            >
              {isMuted ? (
                <VolumeX size={20} color="#FF0080" />
              ) : (
                <Volume2 size={20} color="#FFF" />
              )}
            </TouchableOpacity>
          </Animated.View>
        )}

        <Animated.View style={{ transform: [{ scale: buttonPressed === 'play-pause' ? scaleAnim : 1 }] }}>
          <TouchableOpacity
            style={[styles.controlButton, styles.playButton]}
            onPress={handlePlayPause}
            testID="mini-toggle"
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            activeOpacity={0.7}
            disabled={!currentTrack}
            accessible={true}
            accessibilityLabel={isPlaying ? "Pause" : "Play"}
            accessibilityRole="button"
          >
            {isPlaying ? (
              <Pause size={26} color="#FFF" fill="#FFF" />
            ) : (
              <Play size={26} color="#FFF" fill="#FFF" />
            )}
          </TouchableOpacity>
        </Animated.View>

        <Animated.View style={{ transform: [{ scale: buttonPressed === 'skip-next' ? scaleAnim : 1 }] }}>
          <TouchableOpacity
            style={styles.controlButton}
            onPress={handleSkipNext}
            testID="mini-next"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            disabled={!currentTrack}
            accessible={true}
            accessibilityLabel="Skip to next track"
            accessibilityRole="button"
          >
            <SkipForward size={22} color="#FFF" fill="#FFF" />
          </TouchableOpacity>
        </Animated.View>

        <Animated.View style={{ transform: [{ scale: buttonPressed === 'stop' ? scaleAnim : 1 }] }}>
          <TouchableOpacity
            style={styles.controlButton}
            onPress={handleStop}
            testID="mini-close"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            accessible={true}
            accessibilityLabel="Stop and close player"
            accessibilityRole="button"
          >
            <X size={20} color="#999" />
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 8,
    right: 8,
    height: 72,
    backgroundColor: "#1A1A1A",
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#2A2A2A",
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
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
    marginRight: 12,
  },
  progressBarContainer: {
    marginTop: 4,
  },
  progressBarTouchArea: {
    height: 24,
    justifyContent: 'center',
    paddingVertical: 8,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  timeText: {
    fontSize: 10,
    color: '#666',
    fontWeight: '500' as const,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  barTrack: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 2,
    overflow: 'hidden',
    position: 'relative',
  },
  barProgress: {
    height: '100%',
    backgroundColor: '#FF0080',
    borderRadius: 2,
  },
  progressThumb: {
    position: 'absolute',
    top: -3,
    width: 10,
    height: 10,
    backgroundColor: '#FF0080',
    borderRadius: 5,
    marginLeft: -5,
    borderWidth: 2,
    borderColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
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
    padding: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: {
    backgroundColor: '#FF0080',
    borderRadius: 24,
    padding: 10,
    shadowColor: '#FF0080',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 4,
  },
});