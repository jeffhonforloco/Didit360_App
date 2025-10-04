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
import { trpc } from '@/lib/trpc';
import { useUser } from '@/contexts/UserContext';
import { catalogTrackToUITrack } from '@/lib/catalog-adapter';

export default function SongDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { playTrack } = usePlayer();
  const { settings } = useUser();
  const trackQuery = trpc.catalog.getTrack.useQuery({ id: id ?? '' }, { enabled: !!id });
  const rightsQuery = trpc.catalog.rights.isStreamable.useQuery(
    { entityType: 'track', id: id ?? '', country: 'US', explicitOk: settings.explicitContent },
    { enabled: !!id }
  );

  const isLoading = trackQuery.isLoading || rightsQuery.isLoading;
  const error = trackQuery.error || rightsQuery.error;
  
  const catalogTrack = trackQuery.data;
  const song = catalogTrack ? catalogTrackToUITrack(catalogTrack) : null;

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

  const moreLikeThis = allTracks
    .filter(track => track.artist === song.artist && track.id !== song.id)
    .slice(0, 3);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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
            <Image source={{ uri: song.artwork }} style={styles.artwork} />
          </View>
          
          <Text style={styles.title}>{song.title}</Text>
          <Text style={styles.artist}>{song.artist}{song.album ? `, ${song.album}` : ''}</Text>
          <Text style={styles.metadata}>
            {song.type === 'song' ? 'Song' : song.type === 'podcast' ? 'Podcast' : 'Audiobook'} | {formatDuration(song.duration)} mins
          </Text>

          {rightsQuery.data && !rightsQuery.data.streamable && (
            <View style={styles.blockBanner} testID="not-streamable">
              <Text style={styles.blockText}>Not streamable in your region or settings</Text>
            </View>
          )}

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
              style={[styles.playButton, rightsQuery.data && !rightsQuery.data.streamable ? { opacity: 0.4 } : null]}
              disabled={rightsQuery.data ? !rightsQuery.data.streamable : true}
              onPress={() => playTrack(song)}
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
});