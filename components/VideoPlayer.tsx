import React, { useState, useRef } from "react";
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
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
} from "lucide-react-native";
import type { Track } from "@/types";

interface VideoPlayerProps {
  track: Track;
  isPlaying: boolean;
  onPlayPause: () => void;
  style?: any;
}

export function VideoPlayer({ track, isPlaying, onPlayPause, style }: VideoPlayerProps) {
  const videoRef = useRef<Video>(null);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showControls, setShowControls] = useState<boolean>(true);
  const handlePlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    if (status.isLoaded) {
      console.log('[VideoPlayer] Playback status: loaded');
      if ('isFullscreen' in status && typeof status.isFullscreen === 'boolean') {
        setIsFullscreen(status.isFullscreen);
      }
    } else {
      console.log('[VideoPlayer] Playback status: loading');
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (videoRef.current) {
      videoRef.current.setIsMutedAsync(!isMuted);
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
    setShowControls(!showControls);
    if (showControls) {
      setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
  };

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
              onPress={toggleMute}
            >
              {isMuted ? (
                <VolumeX size={24} color="#FFF" />
              ) : (
                <Volume2 size={24} color="#FFF" />
              )}
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
    justifyContent: "flex-start",
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
});

export default VideoPlayer;