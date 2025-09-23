import React, { useState, useCallback, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Clock,
  Play,
  Heart,
  Share2,
  Download,
  BarChart3,
  Award,
  Calendar,
  Music,
  Headphones,
  TrendingUp,
  Users,
  Activity,
  Filter,
  Search,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useMixMind } from '@/contexts/MixMindContext';
import { usePlayer } from '@/contexts/PlayerContext';

type FilterType = 'all' | 'liked' | 'shared' | 'recent';
type SortType = 'newest' | 'oldest' | 'most_played' | 'highest_rated';

export default function MixMindHistoryScreen() {
  const { width } = useWindowDimensions();
  const [filter, setFilter] = useState<FilterType>('all');
  const [sortBy, setSortBy] = useState<SortType>('newest');
  const [showStats, setShowStats] = useState(false);
  
  const { 
    history, 
    currentSet, 
    likeSet, 
    shareSet, 
    exportSet,
    settings 
  } = useMixMind();
  const { playTrack } = usePlayer();

  const filteredSets = useMemo(() => {
    let sets = [...history.sets];
    
    // Apply filters
    switch (filter) {
      case 'liked':
        sets = sets.filter(set => history.likedSets.includes(set.id));
        break;
      case 'shared':
        sets = sets.filter(set => history.sharedSets.includes(set.id));
        break;
      case 'recent':
        sets = sets.filter(set => {
          const daysSinceCreated = (Date.now() - set.createdAt.getTime()) / (1000 * 60 * 60 * 24);
          return daysSinceCreated <= 7;
        });
        break;
    }
    
    // Apply sorting
    switch (sortBy) {
      case 'oldest':
        sets.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
        break;
      case 'most_played':
        sets.sort((a, b) => (b.plays || 0) - (a.plays || 0));
        break;
      case 'highest_rated':
        sets.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      default: // newest
        sets.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }
    
    return sets;
  }, [history.sets, history.likedSets, history.sharedSets, filter, sortBy]);

  const handlePlaySet = useCallback((set: any) => {
    if (set.tracks && set.tracks.length > 0) {
      playTrack(set.tracks[0]);
    }
  }, [playTrack]);

  const handleSetAction = useCallback(async (setId: string, action: 'like' | 'share' | 'export') => {
    switch (action) {
      case 'like':
        await likeSet(setId);
        break;
      case 'share':
        await shareSet(setId, 'twitter');
        break;
      case 'export':
        await exportSet(setId, 'mp3', 'high');
        break;
    }
  }, [likeSet, shareSet, exportSet]);

  const formatDate = useCallback((date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  }, []);

  const renderSetItem = useCallback(({ item: set }: { item: any }) => (
    <View style={styles.setCard}>
      <View style={styles.setHeader}>
        <View style={styles.setInfo}>
          <Text style={styles.setTitle} numberOfLines={1}>{set.title}</Text>
          <Text style={styles.setDate}>{formatDate(set.createdAt)}</Text>
          <View style={styles.setMeta}>
            <View style={styles.metaItem}>
              <Clock size={12} color="#666" />
              <Text style={styles.metaText}>{Math.round(set.totalDuration / 60)}min</Text>
            </View>
            <View style={styles.metaItem}>
              <Music size={12} color="#666" />
              <Text style={styles.metaText}>{set.tracks.length} tracks</Text>
            </View>
            <View style={styles.metaItem}>
              <BarChart3 size={12} color="#666" />
              <Text style={styles.metaText}>{Math.round(set.averageEnergy * 100)}%</Text>
            </View>
          </View>
        </View>
        <TouchableOpacity
          style={styles.playButton}
          onPress={() => handlePlaySet(set)}
        >
          <Play size={16} color="#000" fill="#000" />
        </TouchableOpacity>
      </View>
      
      <Text style={styles.setDescription} numberOfLines={2}>
        {set.description}
      </Text>
      
      <View style={styles.setActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleSetAction(set.id, 'like')}
        >
          <Heart 
            size={16} 
            color={history.likedSets.includes(set.id) ? '#FF0080' : '#666'}
            fill={history.likedSets.includes(set.id) ? '#FF0080' : 'transparent'}
          />
          <Text style={styles.actionText}>{set.likes || 0}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleSetAction(set.id, 'share')}
        >
          <Share2 size={16} color="#8B5CF6" />
          <Text style={styles.actionText}>{set.shares || 0}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleSetAction(set.id, 'export')}
        >
          <Download size={16} color="#00D4AA" />
        </TouchableOpacity>
      </View>
    </View>
  ), [handlePlaySet, handleSetAction, formatDate, history.likedSets]);

  const StatCard = ({ icon: Icon, title, value, subtitle, color }: any) => (
    <View style={[styles.statCard, { borderColor: color }]}>
      <Icon size={24} color={color} />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statTitle}>{title}</Text>
      {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.title}>MixMind History</Text>
        <TouchableOpacity onPress={() => setShowStats(!showStats)}>
          <BarChart3 size={24} color={showStats ? '#FF0080' : '#666'} />
        </TouchableOpacity>
      </View>

      {showStats && (
        <View style={styles.statsSection}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <StatCard
              icon={Music}
              title="Total Sets"
              value={history.totalSetsGenerated}
              color="#FF0080"
            />
            <StatCard
              icon={Clock}
              title="Listening Time"
              value={`${Math.floor(history.statistics.totalListeningHours)}h`}
              subtitle={`${Math.floor(history.statistics.averageSetLength)}min avg`}
              color="#8B5CF6"
            />
            <StatCard
              icon={Heart}
              title="Total Likes"
              value={history.statistics.totalLikes}
              color="#FF6B6B"
            />
            <StatCard
              icon={Users}
              title="Collaborations"
              value={history.statistics.totalCollaborations}
              color="#667eea"
            />
            <StatCard
              icon={Award}
              title="Achievements"
              value={history.achievements.length}
              color="#F59E0B"
            />
          </ScrollView>
        </View>
      )}

      <View style={styles.filtersSection}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {(['all', 'liked', 'shared', 'recent'] as FilterType[]).map((filterOption) => (
            <TouchableOpacity
              key={filterOption}
              style={[
                styles.filterChip,
                filter === filterOption && styles.filterChipActive
              ]}
              onPress={() => setFilter(filterOption)}
            >
              <Text style={[
                styles.filterText,
                filter === filterOption && styles.filterTextActive
              ]}>
                {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.sortSection}>
        <Text style={styles.sortLabel}>Sort by:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {(['newest', 'oldest', 'most_played', 'highest_rated'] as SortType[]).map((sortOption) => (
            <TouchableOpacity
              key={sortOption}
              style={[
                styles.sortChip,
                sortBy === sortOption && styles.sortChipActive
              ]}
              onPress={() => setSortBy(sortOption)}
            >
              <Text style={[
                styles.sortText,
                sortBy === sortOption && styles.sortTextActive
              ]}>
                {sortOption.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {filteredSets.length === 0 ? (
        <View style={styles.emptyState}>
          <Music size={48} color="#333" />
          <Text style={styles.emptyTitle}>No sets found</Text>
          <Text style={styles.emptyDescription}>
            {filter === 'all' 
              ? 'Create your first mix to see it here'
              : `No ${filter} sets found. Try a different filter.`
            }
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredSets}
          renderItem={renderSetItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.setsList}
          showsVerticalScrollIndicator={false}
        />
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
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
  },
  statsSection: {
    paddingVertical: 20,
  },
  statCard: {
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    padding: 20,
    marginLeft: 20,
    alignItems: 'center',
    minWidth: 120,
    borderWidth: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    marginTop: 8,
  },
  statTitle: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
    textAlign: 'center',
  },
  statSubtitle: {
    fontSize: 10,
    color: '#666',
    marginTop: 2,
    textAlign: 'center',
  },
  filtersSection: {
    paddingVertical: 16,
  },
  filterChip: {
    backgroundColor: '#1A1A1A',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginLeft: 20,
    borderWidth: 1,
    borderColor: '#333',
  },
  filterChipActive: {
    backgroundColor: '#FF0080',
    borderColor: '#FF0080',
  },
  filterText: {
    fontSize: 14,
    color: '#999',
    fontWeight: '500',
  },
  filterTextActive: {
    color: '#FFF',
    fontWeight: '600',
  },
  sortSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  sortLabel: {
    fontSize: 14,
    color: '#999',
    marginRight: 12,
  },
  sortChip: {
    backgroundColor: '#151515',
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  sortChipActive: {
    backgroundColor: '#2A2A2A',
    borderColor: '#FF0080',
  },
  sortText: {
    fontSize: 12,
    color: '#666',
  },
  sortTextActive: {
    color: '#FF0080',
    fontWeight: '600',
  },
  setsList: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  setCard: {
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  setHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  setInfo: {
    flex: 1,
    marginRight: 16,
  },
  setTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFF',
    marginBottom: 4,
  },
  setDate: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  setMeta: {
    flexDirection: 'row',
    gap: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 11,
    color: '#666',
  },
  playButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  setDescription: {
    fontSize: 14,
    color: '#AAA',
    lineHeight: 20,
    marginBottom: 16,
  },
  setActions: {
    flexDirection: 'row',
    gap: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionText: {
    fontSize: 12,
    color: '#666',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFF',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
});