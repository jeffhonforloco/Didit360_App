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
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, MoreHorizontal, Play, Shuffle, Share2, Bell, BellOff } from 'lucide-react-native';
import { usePlayer } from '@/contexts/PlayerContext';
import { allTracks, searchArtists, popularArtists, searchAlbums } from '@/data/mockData';
import type { Track } from '@/types';

export default function ArtistDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { playTrack } = usePlayer();
  const [isFollowing, setIsFollowing] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  
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
      <TouchableOpacity style={styles.songPlayButton}>
        <Play size={16} color="#E91E63" fill="#E91E63" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.moreButton}>
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
        <TouchableOpacity style={styles.moreButton}>
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
              <TouchableOpacity style={styles.iconButton}>
                <Share2 size={24} color="#FFF" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton}>
                <MoreHorizontal size={24} color="#FFF" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.playControls}>
              <TouchableOpacity style={styles.shuffleButton}>
                <Shuffle size={20} color="#FFF" />
                <Text style={styles.shuffleText}>Shuffle</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.playAllButton}>
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
});