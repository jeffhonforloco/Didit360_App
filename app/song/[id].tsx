import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Modal,
  Platform,
  Share as RNShare,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, MoreHorizontal, Heart, Play, Plus, Share2, Download, Facebook, Twitter, Link } from 'lucide-react-native';
import { usePlayer } from '@/contexts/PlayerContext';
import { allTracks } from '@/data/mockData';
import type { Track } from '@/types';
import { trpc } from '@/lib/trpc';
import { useUser } from '@/contexts/UserContext';

export default function SongDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { playTrack } = usePlayer();
  const { settings } = useUser();
  const [showShareModal, setShowShareModal] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const trackQuery = trpc.catalog.getTrack.useQuery({ id: id ?? '' }, { enabled: !!id });
  const rightsQuery = trpc.catalog.rights.isStreamable.useQuery(
    { entityType: 'track', id: id ?? '', country: 'US', explicitOk: settings.explicitContent },
    { enabled: !!id }
  );

  const isLoading = trackQuery.isLoading || rightsQuery.isLoading;
  const error = trackQuery.error || rightsQuery.error;
  const song = trackQuery.data;

  if (isLoading) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}> 
        <Text style={styles.errorText} testID="track-loading">Loading…</Text>
      </View>
    );
  }

  if (error || !song) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText} testID="track-error">Unable to load track</Text>
      </View>
    );
  }

  const artistName = song.artists?.[0]?.name || 'Unknown Artist';
  const albumTitle = song.release?.title;
  const artwork = song.release?.cover_uri || 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=400&fit=crop';
  const duration = song.duration_ms ? Math.floor(song.duration_ms / 1000) : 180;

  const moreLikeThis = allTracks
    .filter(track => track.artist.toLowerCase().includes(artistName.toLowerCase()) && track.id !== String(song.id))
    .slice(0, 3);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleShare = async (platform?: string) => {
    console.log(`[Song] Sharing to ${platform || 'default'}:`, song?.title);
    
    if (Platform.OS === 'web') {
      if (platform === 'copy') {
        navigator.clipboard.writeText(`Check out ${song?.title} by ${artistName} on our app!`);
        console.log('Link copied to clipboard');
      }
    } else {
      try {
        await RNShare.share({
          message: `Check out ${song?.title} by ${artistName} on our app!`,
          title: song?.title,
        });
      } catch (error) {
        console.log('Share error:', error);
      }
    }
    
    setShowShareModal(false);
  };

  const handleDownload = () => {
    console.log('[Song] Downloading:', song?.title);
  };

  const handleAddToPlaylist = () => {
    console.log('[Song] Adding to playlist:', song?.title);
  };

  const renderSimilarSong = ({ item }: { item: Track }) => (
    <TouchableOpacity
      style={styles.similarSong}
      onPress={() => playTrack(item)}
      activeOpacity={0.8}
    >
      <Image source={{ uri: item.artwork }} style={styles.similarImage} />
      <View style={styles.similarInfo}>
        <Text style={styles.similarTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.similarArtist} numberOfLines={1}>
          {item.artist}
        </Text>
      </View>
      <TouchableOpacity style={styles.similarPlayButton}>
        <Play size={16} color="#E91E63" fill="#E91E63" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.moreButton}>
        <MoreHorizontal size={20} color="#999" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#FFF" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.moreButton}>
          <MoreHorizontal size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.artworkContainer}>
            <Image source={{ uri: artwork }} style={styles.artwork} />
          </View>
          
          <Text style={styles.title}>{song.title}</Text>
          <Text style={styles.artist}>{artistName}{albumTitle ? `, ${albumTitle}` : ''}</Text>
          <Text style={styles.metadata}>
            Track | {formatDuration(duration)} mins
          </Text>

          {rightsQuery.data && !rightsQuery.data.streamable && (
            <View style={styles.blockBanner} testID="not-streamable">
              <Text style={styles.blockText}>Not streamable in your region or settings</Text>
            </View>
          )}

          <View style={styles.actions}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => setIsFavorite(!isFavorite)}
            >
              <Heart size={24} color="#FFF" fill={isFavorite ? "#E91E63" : "none"} />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={handleAddToPlaylist}
            >
              <Plus size={24} color="#FFF" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => setShowShareModal(true)}
            >
              <Share2 size={24} color="#FFF" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={handleDownload}
            >
              <Download size={24} color="#FFF" />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.playButton, rightsQuery.data && !rightsQuery.data.streamable ? { opacity: 0.4 } : null]}
              disabled={rightsQuery.data ? !rightsQuery.data.streamable : true}
              onPress={() => {
                const trackForPlayer: Track = {
                  id: String(song.id),
                  title: song.title,
                  artist: artistName,
                  artwork: artwork,
                  duration: duration,
                  type: 'song',
                };
                playTrack(trackForPlayer);
              }}
              testID="play-track"
            >
              <Play size={20} color="#FFF" fill="#FFF" />
              <Text style={styles.playText}>Play</Text>
            </TouchableOpacity>
          </View>

          {moreLikeThis.length > 0 && (
            <View style={styles.moreLikeThis}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>More Like This</Text>
                <TouchableOpacity>
                  <Text style={styles.seeAll}>See All</Text>
                </TouchableOpacity>
              </View>
              <FlatList
                data={moreLikeThis}
                renderItem={renderSimilarSong}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
              />
            </View>
          )}
        </View>
      </ScrollView>

      {/* Share Modal */}
      <Modal
        visible={showShareModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowShareModal(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowShareModal(false)}
        >
          <TouchableOpacity 
            style={styles.shareModal}
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
          >
            <Text style={styles.shareTitle}>SHARE SONG</Text>
            
            <TouchableOpacity 
              style={styles.shareOption}
              onPress={() => handleShare('facebook')}
            >
              <View style={styles.shareIconContainer}>
                <Facebook size={24} color="#1877F2" />
              </View>
              <Text style={styles.shareOptionText}>Facebook</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.shareOption}
              onPress={() => handleShare('twitter')}
            >
              <View style={styles.shareIconContainer}>
                <Twitter size={24} color="#1DA1F2" />
              </View>
              <Text style={styles.shareOptionText}>Twitter</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.shareOption}
              onPress={() => handleShare('copy')}
            >
              <View style={styles.shareIconContainer}>
                <Link size={24} color="#999" />
              </View>
              <Text style={styles.shareOptionText}>Copy Link</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowShareModal(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
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
  },
  backButton: {
    padding: 8,
  },
  moreButton: {
    padding: 8,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  artworkContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  artwork: {
    width: 280,
    height: 280,
    borderRadius: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  artist: {
    fontSize: 18,
    color: '#999',
    textAlign: 'center',
    marginBottom: 4,
  },
  metadata: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 40,
  },
  actionButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E91E63',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    gap: 8,
  },
  playText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  moreLikeThis: {
    marginTop: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
  },
  seeAll: {
    fontSize: 14,
    color: '#E91E63',
    fontWeight: '500',
  },
  similarSong: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  similarImage: {
    width: 56,
    height: 56,
    borderRadius: 8,
    marginRight: 12,
  },
  similarInfo: {
    flex: 1,
  },
  similarTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
    marginBottom: 4,
  },
  similarArtist: {
    fontSize: 14,
    color: '#999',
  },
  similarPlayButton: {
    marginRight: 12,
  },
  errorText: {
    color: '#FFF',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 100,
  },
  blockBanner: {
    marginTop: 12,
    marginBottom: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: 'rgba(239,68,68,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.35)'
  },
  blockText: {
    color: '#FECACA',
    fontSize: 14,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'flex-end',
  },
  shareModal: {
    backgroundColor: '#2A2A2A',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  shareTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
    textAlign: 'center',
    marginBottom: 30,
  },
  shareOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },
  shareIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  shareOptionText: {
    fontSize: 16,
    color: '#FFF',
    fontWeight: '500',
  },
  cancelButton: {
    marginTop: 20,
    paddingVertical: 16,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#999',
    fontWeight: '600',
  },
});