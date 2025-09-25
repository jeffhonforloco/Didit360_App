import React, { useState, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Radio,
  Users,
  Play,
  Pause,
  SkipForward,
  Volume2,
  Mic,
  MicOff,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useMixMind } from '@/contexts/MixMindContext';
import { usePlayer } from '@/contexts/PlayerContext';

export default function MixMindLiveScreen() {
  // Always call hooks in the same order
  const [isLive, setIsLive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [listeners, setListeners] = useState(0);
  
  const mixMindContext = useMixMind();
  const playerContext = usePlayer();
  
  // Destructure after hook calls to ensure stable hook order
  const { currentSet, startCollaboration } = mixMindContext;
  const { isPlaying, currentTrack, togglePlayPause, skipNext } = playerContext;

  const handleStartLive = useCallback(async () => {
    try {
      if (!isLive) {
        const sessionId = await startCollaboration('user-123');
        if (sessionId) {
          setIsLive(true);
          setListeners(1);
          console.log('[MixMind] Started live session:', sessionId);
        }
      } else {
        setIsLive(false);
        setListeners(0);
        console.log('[MixMind] Stopped live session');
      }
    } catch (error) {
      console.error('[MixMind] Live session error:', error);
    }
  }, [isLive, startCollaboration]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color="#FFF" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.title}>Live Session</Text>
          {isLive && (
            <View style={styles.liveIndicator}>
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>LIVE</Text>
            </View>
          )}
        </View>
        <View style={styles.headerRight}>
          {isLive && (
            <View style={styles.listenersCount}>
              <Users size={16} color="#FFF" />
              <Text style={styles.listenersText}>{listeners}</Text>
            </View>
          )}
        </View>
      </View>

      {!isLive ? (
        <View style={styles.startLiveSection}>
          <LinearGradient
            colors={['#FF0080', '#8B5CF6']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.startLiveCard}
          >
            <Radio size={64} color="#FFF" />
            <Text style={styles.startLiveTitle}>Start Live Session</Text>
            <Text style={styles.startLiveDescription}>
              Share your music taste with others in real-time. 
              Stream your current mix and interact with listeners.
            </Text>
            <TouchableOpacity
              style={styles.startLiveButton}
              onPress={handleStartLive}
            >
              <Text style={styles.startLiveButtonText}>Go Live</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      ) : (
        <View style={styles.liveContent}>
          {/* Live Stats */}
          <View style={styles.liveStats}>
            <View style={styles.statItem}>
              <Users size={20} color="#667eea" />
              <Text style={styles.statValue}>{listeners}</Text>
              <Text style={styles.statLabel}>Listeners</Text>
            </View>
            <View style={styles.statItem}>
              <Radio size={20} color="#FF0080" />
              <Text style={styles.statValue}>Live</Text>
              <Text style={styles.statLabel}>Status</Text>
            </View>
            <View style={styles.statItem}>
              <Volume2 size={20} color="#00D4AA" />
              <Text style={styles.statValue}>{currentSet?.tracks.length || 0}</Text>
              <Text style={styles.statLabel}>Tracks</Text>
            </View>
          </View>

          {/* Current Track */}
          {currentTrack && (
            <View style={styles.currentTrackSection}>
              <LinearGradient
                colors={['#1A1A1A', '#2A2A2A']}
                style={styles.currentTrackCard}
              >
                <View style={styles.trackInfo}>
                  <Text style={styles.nowPlayingLabel}>NOW PLAYING</Text>
                  <Text style={styles.trackTitle} numberOfLines={1}>
                    {currentTrack.title}
                  </Text>
                  <Text style={styles.trackArtist} numberOfLines={1}>
                    {currentTrack.artist}
                  </Text>
                </View>
                <View style={styles.trackControls}>
                  <TouchableOpacity
                    style={styles.controlButton}
                    onPress={() => setIsMuted(!isMuted)}
                  >
                    {isMuted ? (
                      <MicOff size={20} color="#FF6B6B" />
                    ) : (
                      <Mic size={20} color="#00D4AA" />
                    )}
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.controlButton}
                    onPress={togglePlayPause}
                  >
                    {isPlaying ? (
                      <Pause size={20} color="#FFF" />
                    ) : (
                      <Play size={20} color="#FFF" />
                    )}
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.controlButton}
                    onPress={skipNext}
                  >
                    <SkipForward size={20} color="#FFF" />
                  </TouchableOpacity>
                </View>
              </LinearGradient>
            </View>
          )}

          {/* Live Actions */}
          <View style={styles.liveActions}>
            <TouchableOpacity
              style={styles.endLiveButton}
              onPress={handleStartLive}
            >
              <Text style={styles.endLiveButtonText}>End Live Session</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1A1A1A',
  },
  headerCenter: {
    alignItems: 'center',
  },
  headerRight: {
    minWidth: 60,
    alignItems: 'flex-end',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 6,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF0080',
  },
  liveText: {
    fontSize: 12,
    color: '#FF0080',
    fontWeight: 'bold',
  },
  listenersCount: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  listenersText: {
    fontSize: 14,
    color: '#FFF',
    fontWeight: '600',
  },
  startLiveSection: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  startLiveCard: {
    borderRadius: 24,
    padding: 40,
    alignItems: 'center',
  },
  startLiveTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
    marginTop: 20,
    marginBottom: 16,
    textAlign: 'center',
  },
  startLiveDescription: {
    fontSize: 16,
    color: '#FFF',
    textAlign: 'center',
    opacity: 0.9,
    lineHeight: 24,
    marginBottom: 32,
  },
  startLiveButton: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    paddingVertical: 16,
    paddingHorizontal: 40,
  },
  startLiveButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF0080',
  },
  liveContent: {
    flex: 1,
    paddingTop: 20,
  },
  liveStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  statItem: {
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    padding: 20,
    minWidth: 100,
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#999',
  },
  currentTrackSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  currentTrackCard: {
    borderRadius: 20,
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
  },
  trackInfo: {
    flex: 1,
  },
  nowPlayingLabel: {
    fontSize: 10,
    color: '#FF0080',
    fontWeight: 'bold',
    marginBottom: 8,
    letterSpacing: 1,
  },
  trackTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFF',
    marginBottom: 4,
  },
  trackArtist: {
    fontSize: 16,
    color: '#999',
  },
  trackControls: {
    flexDirection: 'row',
    gap: 16,
  },
  controlButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#2A2A2A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  liveActions: {
    paddingHorizontal: 20,
    marginTop: 'auto',
    paddingBottom: 40,
  },
  endLiveButton: {
    backgroundColor: '#FF3B30',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  endLiveButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFF',
  },
});