import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  FlatList,
  useWindowDimensions,
  Modal,
  Platform,
  Share,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, MoreHorizontal, Play, Shuffle, Share2, Bell, BellOff, Download, List, Heart, Facebook, Twitter, Link } from 'lucide-react-native';
import { usePlayer } from '@/contexts/PlayerContext';
import { useLibrary } from '@/contexts/LibraryContext';
import { allTracks, searchArtists, popularArtists, searchAlbums } from '@/data/mockData';
import type { Track } from '@/types';

export default function ArtistDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { playTrack } = usePlayer();
  const { toggleFavorite, isFavorite } = useLibrary();
  const [isFollowing, setIsFollowing] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showOptionsModal, setShowOptionsModal] = useState(false);
  
  const artist = searchArtists.find(a => a.id === id) || popularArtists.find(a => a.id === id);
  
  if (!artist) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Artist not found</Text>
      </View>
    );
  }

  const artistSongs = allTracks.filter(track => 
    track.artist.toLowerCase().includes(artist.name.toLowerCase())
  ).slice(0, 10);

  const artistAlbums = searchAlbums.filter(album => 
    album.artist.toLowerCase().includes(artist.name.toLowerCase())
  );

  const relatedArtists = popularArtists.filter(a => a.id !== artist.id).slice(0, 6);

  const ALBUM_WIDTH = (width - 60) / 2;

  const handleShuffle = () => {
    console.log('[Artist] Shuffle all songs');
    if (artistSongs.length > 0) {
      const shuffled = [...artistSongs].sort(() => Math.random() - 0.5);
      playTrack(shuffled[0]);
    }
  };

  const handlePlayAll = () => {
    console.log('[Artist] Play all songs');
    if (artistSongs.length > 0) {
      playTrack(artistSongs[0]);
    }
  };

  const handleShare = async (platform?: string) => {
    console.log(`[Artist] Sharing to ${platform || 'default'}:`, artist.name);
    
    if (Platform.OS === 'web') {
      if (platform === 'copy') {
        navigator.clipboard.writeText(`Check out ${artist.name} on our app!`);
        console.log('Link copied to clipboard');
      }
    } else {
      try {
        await Share.share({
          message: `Check out ${artist.name} on our app!`,
          title: artist.name,
        });
      } catch (error) {
        console.log('Share error:', error);
      }
    }
    
    setShowShareModal(false);
  };

  const renderSong = ({ item, index }: { item: Track; index: number }) => (
    <TouchableOpacity
      style={styles.songItem}
      onPress={() => playTrack(item)}
      activeOpacity={0.8}
    >
      <Text style={styles.songNumber}>{index + 1}</Text>
      <Image source={{ uri: item.artwork }} style={styles.songImage} />
      <View style={styles.songInfo}>
        <Text style={styles.songTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.songArtist} numberOfLines={1}>
          {item.artist}
        </Text>
      </View>
      <TouchableOpacity 
        style={styles.songPlayButton}
        onPress={() => playTrack(item)}
      >
        <Play size={16} color="#E91E63" fill="#E91E63" />
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.moreButton}
        onPress={() => {
          console.log('[Artist] Song options for:', item.title);
        }}
      >
        <MoreHorizontal size={20} color="#999" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderAlbum = ({ item }: { item: typeof artistAlbums[0] }) => (
    <TouchableOpacity
      style={[styles.albumCard, { width: ALBUM_WIDTH }]}
      onPress={() => router.push(`/album/${item.id}`)}
      activeOpacity={0.8}
    >
      <Image source={{ uri: item.artwork }} style={[styles.albumImage, { width: ALBUM_WIDTH, height: ALBUM_WIDTH }]} />
      <Text style={styles.albumTitle} numberOfLines={1}>
        {item.title}
      </Text>
      <Text style={styles.albumYear}>{item.year}</Text>
    </TouchableOpacity>
  );

  const renderRelatedArtist = ({ item }: { item: typeof relatedArtists[0] }) => (
    <TouchableOpacity
      style={styles.relatedArtistCard}
      onPress={() => router.push(`/artist/${item.id}`)}
      activeOpacity={0.8}
    >
      <Image source={{ uri: item.image }} style={styles.relatedArtistImage} />
      <Text style={styles.relatedArtistName} numberOfLines={1}>
        {item.name}
      </Text>
      <Text style={styles.relatedArtistFollowers}>{item.followers}</Text>
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
        <TouchableOpacity 
          style={styles.moreButton}
          onPress={() => setShowOptionsModal(true)}
        >
          <MoreHorizontal size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.artistHeader}>
            <Image source={{ uri: artist.image }} style={styles.artistImage} />
            <Text style={styles.artistName}>{artist.name}</Text>
            <Text style={styles.monthlyListeners}>
              {artist.followers} monthly listeners
            </Text>
            
            <View style={styles.artistActions}>
              <TouchableOpacity
                style={[
                  styles.followButton,
                  isFollowing && styles.followingButton
                ]}
                onPress={() => setIsFollowing(!isFollowing)}
              >
                <Text style={[
                  styles.followButtonText,
                  isFollowing && styles.followingButtonText
                ]}>
                  {isFollowing ? 'Following' : 'Follow'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.iconButton}
                onPress={() => setNotificationsEnabled(!notificationsEnabled)}
              >
                {notificationsEnabled ? (
                  <Bell size={24} color="#E91E63" fill="#E91E63" />
                ) : (
                  <BellOff size={24} color="#FFF" />
                )}
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.iconButton}
                onPress={() => setShowShareModal(true)}
              >
                <Share2 size={24} color="#FFF" />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.iconButton}
                onPress={() => setShowOptionsModal(true)}
              >
                <MoreHorizontal size={24} color="#FFF" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.playControls}>
              <TouchableOpacity 
                style={styles.shuffleButton}
                onPress={handleShuffle}
                activeOpacity={0.8}
              >
                <Shuffle size={20} color="#FFF" />
                <Text style={styles.shuffleText}>Shuffle</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.playAllButton}
                onPress={handlePlayAll}
                activeOpacity={0.8}
              >
                <Play size={20} color="#FFF" fill="#FFF" />
                <Text style={styles.playAllText}>Play</Text>
              </TouchableOpacity>
            </View>
          </View>

          {artistSongs.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Popular Songs</Text>
                <TouchableOpacity>
                  <Text style={styles.seeAll}>See All</Text>
                </TouchableOpacity>
              </View>
              <FlatList
                data={artistSongs}
                renderItem={renderSong}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
              />
            </View>
          )}

          {artistAlbums.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Albums</Text>
                <TouchableOpacity>
                  <Text style={styles.seeAll}>See All</Text>
                </TouchableOpacity>
              </View>
              <FlatList
                data={artistAlbums}
                renderItem={renderAlbum}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.albumsList}
              />
            </View>
          )}

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>About</Text>
            </View>
            <Text style={styles.aboutText}>
              {artist.name} is one of the most influential artists in modern music. 
              With {artist.followers} monthly listeners, they continue to shape the sound of contemporary music.
            </Text>
          </View>

          {relatedArtists.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Fans Also Like</Text>
                <TouchableOpacity>
                  <Text style={styles.seeAll}>See All</Text>
                </TouchableOpacity>
              </View>
              <FlatList
                data={relatedArtists}
                renderItem={renderRelatedArtist}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.relatedArtistsList}
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
            <Text style={styles.shareTitle}>SHARE ARTIST</Text>
            
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

      {/* Options Modal */}
      <Modal
        visible={showOptionsModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowOptionsModal(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowOptionsModal(false)}
        >
          <TouchableOpacity 
            style={styles.shareModal}
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
          >
            <Text style={styles.shareTitle}>OPTIONS</Text>
            
            <TouchableOpacity 
              style={styles.shareOption}
              onPress={() => {
                setShowOptionsModal(false);
                setShowShareModal(true);
              }}
            >
              <View style={styles.shareIconContainer}>
                <Share2 size={24} color="#FFF" />
              </View>
              <Text style={styles.shareOptionText}>Share Artist</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.shareOption}
              onPress={() => {
                console.log('[Artist] Download all songs');
                setShowOptionsModal(false);
              }}
            >
              <View style={styles.shareIconContainer}>
                <Download size={24} color="#FFF" />
              </View>
              <Text style={styles.shareOptionText}>Download All</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.shareOption}
              onPress={() => {
                console.log('[Artist] View queue');
                setShowOptionsModal(false);
              }}
            >
              <View style={styles.shareIconContainer}>
                <List size={24} color="#FFF" />
              </View>
              <Text style={styles.shareOptionText}>View Queue</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowOptionsModal(false)}
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
  artistHeader: {
    alignItems: 'center',
    marginBottom: 40,
  },
  artistImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
    marginBottom: 20,
  },
  artistName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 8,
  },
  monthlyListeners: {
    fontSize: 16,
    color: '#999',
    marginBottom: 24,
  },
  artistActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  followButton: {
    backgroundColor: '#E91E63',
    paddingHorizontal: 32,
    paddingVertical: 10,
    borderRadius: 24,
  },
  followingButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#E91E63',
  },
  followButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  followingButtonText: {
    color: '#E91E63',
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playControls: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  shuffleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 12,
    borderRadius: 24,
    gap: 8,
  },
  shuffleText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  playAllButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E91E63',
    paddingVertical: 12,
    borderRadius: 24,
    gap: 8,
  },
  playAllText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  section: {
    marginTop: 32,
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
  songItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  songNumber: {
    fontSize: 16,
    color: '#999',
    width: 24,
    marginRight: 12,
  },
  songImage: {
    width: 56,
    height: 56,
    borderRadius: 8,
    marginRight: 12,
  },
  songInfo: {
    flex: 1,
  },
  songTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
    marginBottom: 4,
  },
  songArtist: {
    fontSize: 14,
    color: '#999',
  },
  songPlayButton: {
    marginRight: 12,
  },
  errorText: {
    color: '#FFF',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 100,
  },
  albumsList: {
    gap: 16,
  },
  albumCard: {
    marginBottom: 8,
  },
  albumImage: {
    borderRadius: 8,
    marginBottom: 8,
  },
  albumTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFF',
    marginBottom: 4,
  },
  albumYear: {
    fontSize: 12,
    color: '#999',
  },
  aboutText: {
    fontSize: 14,
    color: '#CCC',
    lineHeight: 22,
  },
  relatedArtistsList: {
    gap: 16,
  },
  relatedArtistCard: {
    width: 120,
    alignItems: 'center',
  },
  relatedArtistImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 8,
  },
  relatedArtistName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFF',
    textAlign: 'center',
    marginBottom: 4,
  },
  relatedArtistFollowers: {
    fontSize: 12,
    color: '#999',
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