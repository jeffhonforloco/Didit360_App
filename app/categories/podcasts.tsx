import React, { useCallback, useMemo, useState } from 'react';
import { Image, FlatList, Platform, StyleSheet, Text, TouchableOpacity, View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Play, Plus, List, Grid3X3, Download, Heart, ChevronDown } from 'lucide-react-native';
import { router } from 'expo-router';
import { usePlayer } from '@/contexts/PlayerContext';
import type { Track } from '@/types';
import { podcasts as podcastShowsSimple, popularPodcasts, historyPodcasts, downloadedPodcasts, likedPodcasts, podcastCategories, allPodcastEpisodes } from '@/data/mockData';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Section } from '@/components/ui/Section';
import { TextField } from '@/components/ui/TextField';
import ErrorBoundary from '@/components/ErrorBoundary';

const fontWeight700 = '700' as const;

type SortKey = 'recent' | 'longest' | 'shortest' | 'alpha';

type ViewMode = 'list' | 'grid';

export default function PodcastsScreen() {
  const { playTrack, addToQueue } = usePlayer();

  const [query, setQuery] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortKey>('recent');
  const [viewMode, setViewMode] = useState<ViewMode>('list');

  const categories = useMemo(() => [{ id: 'all', title: 'All', color: '#6B7280' }, ...podcastCategories], []);

  const filteredEpisodes = useMemo<Track[]>(() => {
    console.log('[Podcasts] computing filtered episodes', { query, activeCategory, sortBy });
    let items = allPodcastEpisodes;

    if (activeCategory !== 'all') {
      items = items.filter((t) => t.description?.toLowerCase().includes(activeCategory.toLowerCase()) || t.artist.toLowerCase().includes(activeCategory.toLowerCase()));
    }

    if (query.trim().length > 0) {
      const q = query.trim().toLowerCase();
      items = items.filter((t) => t.title.toLowerCase().includes(q) || t.artist.toLowerCase().includes(q));
    }

    const sorted = [...items];
    switch (sortBy) {
      case 'alpha':
        sorted.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'longest':
        sorted.sort((a, b) => (b.duration ?? 0) - (a.duration ?? 0));
        break;
      case 'shortest':
        sorted.sort((a, b) => (a.duration ?? 0) - (b.duration ?? 0));
        break;
      case 'recent':
      default:
        // keep original order which mocks recency
        break;
    }
    return sorted;
  }, [query, activeCategory, sortBy]);

  const onPlay = useCallback((t: Track) => {
    console.log('[Podcasts] play', t.id);
    playTrack(t);
  }, [playTrack]);

  const onQueue = useCallback((t: Track) => {
    console.log('[Podcasts] queue', t.id);
    addToQueue(t);
  }, [addToQueue]);

  const EpisodeRow = useCallback(({ item }: { item: Track }) => (
    <TouchableOpacity
      testID={`episode-${item.id}`}
      style={styles.episodeRow}
      onPress={() => onPlay(item)}
      activeOpacity={0.85}
    >
      <Image source={{ uri: item.artwork }} style={styles.art} />
      <View style={styles.meta}>
        <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.artist} numberOfLines={1}>{item.artist}</Text>
        <Text style={styles.badge}>Podcast • {formatDuration(item.duration)}</Text>
      </View>
      <View style={styles.rowActions}>
        <TouchableOpacity onPress={() => onQueue(item)} style={styles.iconBtn} testID={`queue-${item.id}`}>
          <Plus size={18} color="#FFF" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onPlay(item)} style={styles.playBtn} testID={`play-${item.id}`}>
          <Play size={16} color="#000" fill="#FFF" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  ), [onPlay, onQueue]);

  const EpisodeTile = useCallback(({ item }: { item: Track }) => (
    <Card testID={`tile-${item.id}`} onPress={() => onPlay(item)} style={styles.tile}>
      <Image source={{ uri: item.artwork }} style={styles.tileArt} />
      <Text style={styles.tileTitle} numberOfLines={2}>{item.title}</Text>
      <Text style={styles.tileArtist} numberOfLines={1}>{item.artist}</Text>
      <View style={styles.tileActions}>
        <TouchableOpacity onPress={() => onQueue(item)} style={styles.iconBtnSm}>
          <Plus size={16} color="#FFF" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onPlay(item)} style={styles.playBtnSm}>
          <Play size={14} color="#000" fill="#FFF" />
        </TouchableOpacity>
      </View>
    </Card>
  ), [onPlay, onQueue]);

  const renderEpisode = useCallback(({ item }: { item: Track }) => (
    viewMode === 'list' ? <EpisodeRow item={item} /> : <EpisodeTile item={item} />
  ), [viewMode, EpisodeRow, EpisodeTile]);

  return (
    <ErrorBoundary>
      <SafeAreaView style={styles.container} edges={['top']}>        
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            testID="back-button"
          >
            <ArrowLeft size={24} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Podcasts</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity
              onPress={() => setViewMode((m) => (m === 'list' ? 'grid' : 'list'))}
              style={styles.toggleBtn}
              testID="toggle-view"
            >
              {viewMode === 'list' ? <Grid3X3 size={18} color="#FFF" /> : <List size={18} color="#FFF" />}
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <View style={styles.searchRow}>
            <TextField
              testID="podcast-search"
              placeholder="Search podcasts, shows, topics"
              value={query}
              onChangeText={setQuery}
            />
            <View style={styles.sortMenu}>
              <TouchableOpacity style={styles.sortBtn} onPress={() => cycleSort(setSortBy, sortBy)} testID="sort-btn">
                <Text style={styles.sortText}>Sort: {labelForSort(sortBy)}</Text>
                <ChevronDown size={16} color="#9CA3AF" />
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catRow}>
            {categories.map((c) => (
              <TouchableOpacity
                key={c.id}
                testID={`cat-${c.id}`}
                style={[styles.chip, activeCategory === c.id ? { backgroundColor: '#111827', borderColor: c.color } : null]}
                onPress={() => setActiveCategory(c.id)}
              >
                <Text style={[styles.chipText, activeCategory === c.id ? { color: '#FFF' } : null]}>{c.title}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <Section title="Continue Listening">
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={historyPodcasts}
              keyExtractor={(i) => i.id}
              renderItem={({ item }) => (
                <Card style={styles.contCard} onPress={() => onPlay(item)}>
                  <Image source={{ uri: item.artwork }} style={styles.contArt} />
                  <Text style={styles.contTitle} numberOfLines={2}>{item.title}</Text>
                  <Text style={styles.contArtist} numberOfLines={1}>{item.artist}</Text>
                </Card>
              )}
            />
          </Section>

          <Section title="Popular Episodes" right={<Button title="See all" variant="ghost" size="sm" onPress={() => console.log('see all popular')} />}>          
            {viewMode === 'list' ? (
              <FlatList
                data={popularPodcasts}
                keyExtractor={(i) => i.id}
                scrollEnabled={false}
                renderItem={renderEpisode}
              />
            ) : (
              <View style={styles.gridWrap}>
                {popularPodcasts.map((i) => (
                  <EpisodeTile key={i.id} item={i} />
                ))}
              </View>
            )}
          </Section>

          <Section title="All Episodes">
            {viewMode === 'list' ? (
              <FlatList
                data={filteredEpisodes}
                keyExtractor={(i) => i.id}
                scrollEnabled={false}
                renderItem={renderEpisode}
              />
            ) : (
              <View style={styles.gridWrap}>
                {filteredEpisodes.map((i) => (
                  <EpisodeTile key={i.id} item={i} />
                ))}
              </View>
            )}
          </Section>

          <Section title="Your Library">
            <View style={styles.libraryRow}>
              <Card style={styles.libraryCard} onPress={() => console.log('downloads')}>
                <Download size={18} color="#FFF" />
                <Text style={styles.libraryText}>Downloads ({downloadedPodcasts.length})</Text>
              </Card>
              <Card style={styles.libraryCard} onPress={() => console.log('liked')}>
                <Heart size={18} color="#EF4444" />
                <Text style={styles.libraryText}>Liked ({likedPodcasts.length})</Text>
              </Card>
            </View>
          </Section>

          <Section title="Featured Shows">
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={podcastShowsSimple}
              keyExtractor={(i) => i.id}
              renderItem={({ item }) => (
                <Card style={styles.showCard} onPress={() => router.push(`/podcast-show/${item.id}`)}>
                  <Image source={{ uri: item.artwork }} style={styles.showArt} />
                  <Text style={styles.showTitle} numberOfLines={2}>{item.title}</Text>
                  <Text style={styles.showHost} numberOfLines={1}>{item.artist}</Text>
                </Card>
              )}
            />
          </Section>
        </ScrollView>
      </SafeAreaView>
    </ErrorBoundary>
  );
}

function cycleSort(setter: (v: SortKey) => void, current: SortKey) {
  const order: SortKey[] = ['recent', 'alpha', 'longest', 'shortest'];
  const idx = order.indexOf(current);
  const next = order[(idx + 1) % order.length];
  console.log('[Podcasts] sort change', current, '->', next);
  setter(next);
}

function labelForSort(s: SortKey): string {
  switch (s) {
    case 'recent': return 'Recent';
    case 'alpha': return 'A–Z';
    case 'longest': return 'Longest';
    case 'shortest': return 'Shortest';
    default: return 'Recent';
  }
}

function formatDuration(sec?: number): string {
  const total = Math.max(0, sec ?? 0);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0B0A14' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 20, paddingBottom: 16 },
  backButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#1A1A1A', justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 20, fontWeight: fontWeight700, color: '#FFF' },
  headerActions: { width: 40, alignItems: 'flex-end' },
  toggleBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#111827', justifyContent: 'center', alignItems: 'center' },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 140, gap: 24 as number },

  searchRow: { flexDirection: 'row', alignItems: 'center', gap: 12 as number },
  sortMenu: { marginLeft: 8 },
  sortBtn: { flexDirection: 'row', alignItems: 'center', gap: 6 as number, borderWidth: 1, borderColor: '#262626', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 },
  sortText: { color: '#9CA3AF' },

  catRow: { gap: 8 as number, paddingVertical: 8 },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 18, backgroundColor: '#0F172A', borderWidth: 1, borderColor: '#0F172A', marginRight: 8 },
  chipText: { color: '#9CA3AF', fontWeight: fontWeight700 },

  episodeRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#111827', borderRadius: 12, padding: 12, marginBottom: 10 },
  art: { width: 64, height: 64, borderRadius: 8, marginRight: 12 },
  meta: { flex: 1 },
  title: { color: '#FFF', fontSize: 16, fontWeight: '600' },
  artist: { color: '#9CA3AF', fontSize: 13, marginTop: 2 },
  badge: { color: '#60A5FA', fontSize: 12, marginTop: 4 },
  rowActions: { flexDirection: 'row', alignItems: 'center', gap: 8 as number },
  iconBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#1F2937', alignItems: 'center', justifyContent: 'center' },
  playBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#FFF', alignItems: 'center', justifyContent: 'center' },

  gridWrap: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  tile: { width: '48%' as unknown as number, padding: 10 },
  tileArt: { width: '100%' as unknown as number, aspectRatio: 1, borderRadius: 12, marginBottom: 8 },
  tileTitle: { color: '#FFF', fontSize: 14, fontWeight: '600' },
  tileArtist: { color: '#9CA3AF', fontSize: 12, marginTop: 2 },
  tileActions: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 },
  iconBtnSm: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#1F2937', alignItems: 'center', justifyContent: 'center' },
  playBtnSm: { width: 34, height: 34, borderRadius: 17, backgroundColor: '#FFF', alignItems: 'center', justifyContent: 'center' },

  contCard: { width: 160, marginRight: 12 },
  contArt: { width: 140, height: 140, borderRadius: 12, marginBottom: 8 },
  contTitle: { color: '#FFF', fontSize: 14, fontWeight: '600' },
  contArtist: { color: '#9CA3AF', fontSize: 12 },

  libraryRow: { flexDirection: 'row', gap: 12 as number },
  libraryCard: { flexDirection: 'row', alignItems: 'center', gap: 8 as number },
  libraryText: { color: '#FFF' },

  showCard: { width: 160, marginRight: 12 },
  showArt: { width: 140, height: 140, borderRadius: 12, marginBottom: 8 },
  showTitle: { color: '#FFF', fontSize: 14, fontWeight: '600' },
  showHost: { color: '#9CA3AF', fontSize: 12 },
});