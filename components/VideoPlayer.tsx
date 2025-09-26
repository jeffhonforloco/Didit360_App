import React, { useRef, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Video, ResizeMode, AVPlaybackStatus } from "expo-av";
import {
  Play,
} from "lucide-react-native";
import type { Track } from "@/types";

interface VideoPlayerProps {
  track: Track;
  isPlaying: boolean;
  onPlayPause: () => void;
  onProgressUpdate?: (progress: { position: number; duration: number }) => void;
  volume?: number;
  style?: any;
}

export function VideoPlayer({ track, isPlaying, onPlayPause, onProgressUpdate, volume = 1.0, style }: VideoPlayerProps) {
  const videoRef = useRef<Video>(null);

  useEffect(() => {
    if (videoRef.current) {
      if (isPlaying) {
        console.log('[VideoPlayer] Playing video');
        videoRef.current.playAsync();
      } else {
        console.log('[VideoPlayer] Pausing video');
        videoRef.current.pauseAsync();
      }
    }
  }, [isPlaying]);

  useEffect(() => {
    if (videoRef.current && typeof volume === 'number') {
      console.log('[VideoPlayer] Setting video volume to:', volume);
      videoRef.current.setVolumeAsync(volume).catch((err) => {
        console.log('[VideoPlayer] Error setting volume:', err);
      });
    }
  }, [volume]);

  const handlePlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    if (status.isLoaded) {
      console.log('[VideoPlayer] Playback status: loaded');
      
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
    <View style={[styles.container, style]}>
      <Video
        ref={videoRef}
        style={styles.video}
        source={{ uri: videoUrl }}
        useNativeControls={false}
        resizeMode={ResizeMode.CONTAIN}
        isLooping={false}
        shouldPlay={isPlaying}
        isMuted={false}
        volume={volume}
        onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
      />
    </View>
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