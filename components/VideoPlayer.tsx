import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Platform,
} from "react-native";
import { Video, ResizeMode, AVPlaybackStatus } from "expo-av";
import {
  Play,
  Pause,
  Maximize,
  Minimize,
  SkipBack,
  SkipForward,
} from "lucide-react-native";
import type { Track } from "@/types";

interface VideoPlayerProps {
  track: Track;
  isPlaying: boolean;
  onPlayPause: () => void;
  onProgressUpdate?: (progress: { position: number; duration: number }) => void;
  onSkipNext?: () => void;
  onSkipPrevious?: () => void;
  volume?: number;
  onVolumeChange?: (volume: number) => void;
  style?: any;
}

export function VideoPlayer({ track, isPlaying, onPlayPause, onProgressUpdate, onSkipNext, onSkipPrevious, volume = 1.0, onVolumeChange, style }: VideoPlayerProps) {
  const videoRef = useRef<Video>(null);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showControls, setShowControls] = useState<boolean>(true);
  const [controlsTimeout, setControlsTimeout] = useState<NodeJS.Timeout | null>(null);
  useEffect(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.playAsync();
      } else {
        videoRef.current.pauseAsync();
      }
    }
  }, [isPlaying]);

  useEffect(() => {
    if (videoRef.current && typeof volume === 'number') {
      videoRef.current.setVolumeAsync(volume);
    }
  }, [volume]);

  const handlePlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    if (status.isLoaded) {
      console.log('[VideoPlayer] Playback status: loaded');
      if ('isFullscreen' in status && typeof status.isFullscreen === 'boolean') {
        setIsFullscreen(status.isFullscreen);
      }
      
      if ('positionMillis' in status && 'durationMillis' in status && onProgressUpdate) {
        onProgressUpdate({
          position: status.positionMillis || 0,
          duration: status.durationMillis || 0
        });
      }
    } else {
      console.log('[VideoPlayer] Playback status: loading');
    }
  };

  const handleVolumeChange = (newVolume: number) => {
    // Validate input
    if (typeof newVolume !== 'number' || newVolume < 0 || newVolume > 1) {
      console.log('[VideoPlayer] Invalid volume value:', newVolume);
      return;
    }
    
    if (onVolumeChange) {
      onVolumeChange(newVolume);
    }
    if (videoRef.current) {
      videoRef.current.setVolumeAsync(newVolume);
    }
    // Update muted state based on volume
    if (newVolume === 0) {
      setIsMuted(true);
    } else if (isMuted && newVolume > 0) {
      setIsMuted(false);
    }
  };

  const toggleFullscreen = () => {
    if (Platform.OS === 'web') {
      console.log('Fullscreen not supported on web');
      return;
    }
    
    setIsFullscreen(!isFullscreen);
    if (videoRef.current) {
      try {
        if (!isFullscreen) {
          videoRef.current.presentFullscreenPlayer();
        } else {
          videoRef.current.dismissFullscreenPlayer();
        }
      } catch (error) {
        console.log('Fullscreen error:', error);
      }
    }
  };

  const toggleControls = () => {
    setShowControls(true);
    
    if (controlsTimeout) {
      clearTimeout(controlsTimeout);
    }
    
    const timeout = setTimeout(() => {
      setShowControls(false);
    }, 3000);
    
    setControlsTimeout(timeout);
  };

  useEffect(() => {
    return () => {
      if (controlsTimeout) {
        clearTimeout(controlsTimeout);
      }
    };
  }, [controlsTimeout]);

  // Use a fallback video URL if none is provided
  const videoUrl = track.videoUrl || "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";
  
  if (!videoUrl) {
    return (
      <View style={[styles.container, style]}>
        <View style={styles.placeholderContainer}>
          <Play size={48} color="#FFF" />
          <Text style={styles.placeholderText}>Video not available</Text>
        </View>
      </View>
    );
  }

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      activeOpacity={1}
      onPress={toggleControls}
    >
      <Video
        ref={videoRef}
        style={styles.video}
        source={{ uri: videoUrl }}
        useNativeControls={false}
        resizeMode={ResizeMode.CONTAIN}
        isLooping={false}
        shouldPlay={isPlaying}
        isMuted={isMuted}
        volume={volume}
        onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
      />
      
      {showControls && (
        <View style={styles.controlsOverlay}>
          <View style={styles.topControls}>
            {Platform.OS !== 'web' && (
              <TouchableOpacity
                style={styles.controlButton}
                onPress={toggleFullscreen}
              >
                {isFullscreen ? (
                  <Minimize size={24} color="#FFF" />
                ) : (
                  <Maximize size={24} color="#FFF" />
                )}
              </TouchableOpacity>
            )}
          </View>
          
          <View style={styles.centerControls}>
            <TouchableOpacity
              style={styles.playButton}
              onPress={onPlayPause}
            >
              {isPlaying ? (
                <Pause size={48} color="#FFF" fill="#FFF" />
              ) : (
                <Play size={48} color="#FFF" fill="#FFF" />
              )}
            </TouchableOpacity>
          </View>
          
          <View style={styles.bottomControls}>
            <TouchableOpacity
              style={styles.controlButton}
              onPress={() => {
                console.log('[VideoPlayer] Skip previous pressed');
                if (onSkipPrevious) {
                  onSkipPrevious();
                }
              }}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <SkipBack size={24} color="#FFF" fill="#FFF" />
            </TouchableOpacity>
            
            <View style={styles.volumeControlsContainer}>
              <TouchableOpacity 
                style={styles.volumeSlider}
                activeOpacity={1}
                onPress={(e: any) => {
                  if (!e?.nativeEvent?.locationX || typeof e.nativeEvent.locationX !== 'number') return;
                  const { locationX } = e.nativeEvent;
                  const newVolume = Math.max(0, Math.min(1, locationX / 120));
                  console.log('[VideoPlayer] Volume slider pressed, new volume:', newVolume);
                  handleVolumeChange(newVolume);
                }}
              >
                <View style={styles.volumeTrack}>
                  <View style={[styles.volumeProgress, { width: `${volume * 100}%` }]} />
                  <View style={[styles.volumeThumb, { left: `${volume * 100}%` }]} />
                </View>
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity
              style={styles.controlButton}
              onPress={() => {
                console.log('[VideoPlayer] Skip next pressed');
                if (onSkipNext) {
                  onSkipNext();
                }
              }}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <SkipForward size={24} color="#FFF" fill="#FFF" />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    width: "100%",
    height: "100%",
    backgroundColor: "#000",
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    width: "100%",
    height: "100%",
    backgroundColor: "#000",
  },
  controlsOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "space-between",
  },
  topControls: {
    flexDirection: "row",
    justifyContent: "flex-end",
    padding: 16,
  },
  centerControls: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  bottomControls: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  controlButton: {
    padding: 12,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  playButton: {
    padding: 20,
    backgroundColor: "rgba(255, 0, 128, 0.9)",
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.3)",
    shadowColor: '#FF0080',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
  },
  placeholderText: {
    color: '#FFF',
    fontSize: 16,
    marginTop: 12,
    fontWeight: '500',
  },
  volumeControlsContainer: {
    alignItems: 'center',
    position: 'relative',
    flex: 1,
    marginHorizontal: 20,
    justifyContent: 'center',
  },
  volumeSlider: {
    width: 120,
    height: 40,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 20,
    paddingHorizontal: 12,
  },
  volumeTrack: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 2,
    position: 'relative',
  },
  volumeProgress: {
    height: '100%',
    backgroundColor: '#FF0080',
    borderRadius: 2,
  },
  volumeThumb: {
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
});

export default VideoPlayer;