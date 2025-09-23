import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, MoreHorizontal, Heart, Play, Plus } from 'lucide-react-native';
import { usePlayer } from '@/contexts/PlayerContext';
import { allTracks } from '@/data/mockData';
import type { Track } from '@/types';

// Mock album data
const albums = [
  {
    id: 'sweetener',
    title: 'Sweetener',
    artist: 'Ariana Grande',
    year: '2018',
    artwork: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop',
  },
  {
    id: 'dangerous-woman',
    title: 'Dangerous Woman',
    artist: 'Ariana Grande',
    year: '2016',
    artwork: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop',
  },
  {
    id: 'yours-truly',
    title: 'Yours Truly',
    artist: 'Ariana Grande',
    year: '2013',
    artwork: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop',
  },
  {
    id: 'my-everything',
    title: 'My Everything',
    artist: 'Ariana Grande',
    year: '2014',
    artwork: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop',
  },
];

export default function AlbumDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { playTrack } = usePlayer();
  
  const album = albums.find(a => a.id === id);
  
  if (!album) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Album not found</Text>
      </View>
    );
  }

  const albumSongs = allTracks.filter(track => 
    track.artist.toLowerCase().includes(album.artist.toLowerCase())
  ).slice(0, 8);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const renderSong = ({ item, index }: { item: Track; index: number }) => (
    <TouchableOpacity
      style={styles.songItem}
      onPress={() => playTrack(item)}
      activeOpacity={0.8}
    >
      <Text style={styles.songNumber}>{(index + 1).toString()}</Text>
      <View style={styles.songInfo}>
        <Text style={styles.songTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.songArtist} numberOfLines={1}>
          {item.artist}
        </Text>
      </View>
      <Text style={styles.songDuration}>{formatDuration(item.duration)}</Text>
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
          <View style={styles.albumHeader}>
            <Image source={{ uri: album.artwork }} style={styles.albumArtwork} />
            <Text style={styles.albumTitle}>{album.title}</Text>
            <Text style={styles.albumArtist}>{album.artist}</Text>
            <Text style={styles.albumYear}>Album | {album.year}</Text>
            
            <View style={styles.actions}>
              <TouchableOpacity style={styles.actionButton}>
                <Heart size={24} color="#FFF" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Plus size={24} color="#FFF" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <MoreHorizontal size={24} color="#FFF" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.playButton}
                onPress={() => albumSongs.length > 0 && playTrack(albumSongs[0])}
              >
                <Play size={20} color="#FFF" fill="#FFF" />
                <Text style={styles.playText}>Play</Text>
              </TouchableOpacity>
            </View>
          </View>

          {albumSongs.length > 0 && (
            <View style={styles.songs}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Songs</Text>
                <TouchableOpacity>
                  <Text style={styles.seeAll}>See All</Text>
                </TouchableOpacity>
              </View>
              <FlatList
                data={albumSongs}
                renderItem={renderSong}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
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
  albumHeader: {
    alignItems: 'center',
    marginBottom: 40,
  },
  albumArtwork: {
    width: 280,
    height: 280,
    borderRadius: 16,
    marginBottom: 20,
  },
  albumTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  albumArtist: {
    fontSize: 18,
    color: '#999',
    textAlign: 'center',
    marginBottom: 4,
  },
  albumYear: {
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
  songs: {
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
  songItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  songNumber: {
    fontSize: 16,
    color: '#999',
    width: 24,
    textAlign: 'center',
    marginRight: 16,
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
  songDuration: {
    fontSize: 14,
    color: '#999',
    marginRight: 12,
  },
  errorText: {
    color: '#FFF',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 100,
  },
});