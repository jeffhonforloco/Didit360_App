import React, { useRef, useEffect, useImperativeHandle, forwardRef } from "react";
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

export interface VideoPlayerRef {
  seekTo: (positionMs: number) => Promise<void>;
  skipForward: (seconds?: number) => Promise<void>;
  skipBackward: (seconds?: number) => Promise<void>;
}

export const VideoPlayer = forwardRef<VideoPlayerRef, VideoPlayerProps>(function VideoPlayer({ track, isPlaying, onPlayPause, onProgressUpdate, volume = 1.0, style }, ref) {
  const videoRef = useRef<Video>(null);
  const currentPositionRef = useRef<number>(0);
  const currentDurationRef = useRef<number>(0);
  const lastReportedPlayingState = useRef<boolean>(isPlaying);

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
      videoRef.current.setVolumeAsync(volume).then(() => {
        console.log('[VideoPlayer] Volume successfully set to:', volume);
      }).catch((err) => {
        console.log('[VideoPlayer] Error setting volume:', err);
      });
    }
  }, [volume]);

  const handlePlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    if (status.isLoaded) {
      console.log('[VideoPlayer] Playback status: loaded, isPlaying:', status.isPlaying);
      
      if ('positionMillis' in status && 'durationMillis' in status) {
        currentPositionRef.current = status.positionMillis || 0;
        currentDurationRef.current = status.durationMillis || 0;
        
        if (onProgressUpdate) {
          onProgressUpdate({
            position: status.positionMillis || 0,
            duration: status.durationMillis || 0
          });
        }
      }
      
      // Handle play/pause state changes
      if ('isPlaying' in status) {
        // Only call onPlayPause if the video's playing state differs from what we last reported
        // This prevents infinite loops while still syncing state changes
        if (status.isPlaying !== lastReportedPlayingState.current) {
          console.log('[VideoPlayer] Video playback state changed:', status.isPlaying, 'last reported:', lastReportedPlayingState.current);
          lastReportedPlayingState.current = status.isPlaying;
          if (onPlayPause) {
            onPlayPause();
          }
        }
      }
    } else {
      console.log('[VideoPlayer] Playback status: loading');
    }
  };

  useImperativeHandle(ref, () => ({
    seekTo: async (positionMs: number) => {
      if (videoRef.current) {
        console.log('[VideoPlayer] Seeking to:', positionMs, 'ms');
        try {
          await videoRef.current.setPositionAsync(positionMs);
        } catch (error) {
          console.log('[VideoPlayer] Seek error:', error);
        }
      }
    },
    skipForward: async (seconds = 10) => {
      if (videoRef.current) {
        const newPosition = Math.min(
          currentPositionRef.current + (seconds * 1000),
          currentDurationRef.current
        );
        console.log('[VideoPlayer] Skipping forward to:', newPosition, 'ms');
        try {
          await videoRef.current.setPositionAsync(newPosition);
        } catch (error) {
          console.log('[VideoPlayer] Skip forward error:', error);
        }
      }
    },
    skipBackward: async (seconds = 10) => {
      if (videoRef.current) {
        const newPosition = Math.max(
          currentPositionRef.current - (seconds * 1000),
          0
        );
        console.log('[VideoPlayer] Skipping backward to:', newPosition, 'ms');
        try {
          await videoRef.current.setPositionAsync(newPosition);
        } catch (error) {
          console.log('[VideoPlayer] Skip backward error:', error);
        }
      }
    },
  }), []);

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
        isMuted={volume === 0}
        volume={volume}
        onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
        onLoad={() => {
          console.log('[VideoPlayer] Video loaded successfully');
        }}
        onError={(error) => {
          console.log('[VideoPlayer] Video error:', error);
        }}
      />
    </View>
  );
});

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