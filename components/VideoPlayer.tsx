import React, { useState, useRef } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
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
    console.log('[VideoPlayer] Playback status:', status.isLoaded ? 'loaded' : 'loading');
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (videoRef.current) {
      videoRef.current.setIsMutedAsync(!isMuted);
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    if (videoRef.current) {
      if (!isFullscreen) {
        videoRef.current.presentFullscreenPlayer();
      } else {
        videoRef.current.dismissFullscreenPlayer();
      }
    }
  };

  const toggleControls = () => {
    setShowControls(!showControls);
    if (!showControls) {
      setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
  };

  if (!track.videoUrl) {
    return null;
  }

  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity
        style={styles.videoContainer}
        activeOpacity={1}
        onPress={toggleControls}
      >
        <Video
          ref={videoRef}
          style={styles.video}
          source={{ uri: track.videoUrl }}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#000",
    borderRadius: 12,
    overflow: "hidden",
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  videoContainer: {
    position: "relative",
    width: "100%",
    aspectRatio: 16 / 9,
    minHeight: 200,
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
});

export default VideoPlayer;