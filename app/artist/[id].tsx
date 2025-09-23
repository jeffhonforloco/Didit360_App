import React, { useState } from 'react';
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
import { ArrowLeft, MoreHorizontal, Play } from 'lucide-react-native';
import { usePlayer } from '@/contexts/PlayerContext';
import { allTracks, searchArtists } from '@/data/mockData';
import type { Track } from '@/types';

export default function ArtistDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { playTrack } = usePlayer();
  const [isFollowing, setIsFollowing] = useState(false);
  
  const artist = searchArtists.find(a => a.id === id);
  
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



  const renderSong = ({ item }: { item: Track }) => (
    <TouchableOpacity
      style={styles.songItem}
      onPress={() => playTrack(item)}
      activeOpacity={0.8}
    >
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
              <TouchableOpacity style={styles.moreButton}>
                <MoreHorizontal size={24} color="#FFF" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.playButton}>
                <Play size={20} color="#FFF" fill="#FFF" />
              </TouchableOpacity>
            </View>
          </View>

          {artistSongs.length > 0 && (
            <View style={styles.popularSongs}>
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
    gap: 16,
  },
  followButton: {
    backgroundColor: '#E91E63',
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 20,
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
  playButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E91E63',
    justifyContent: 'center',
    alignItems: 'center',
  },
  popularSongs: {
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
    paddingVertical: 8,
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
});