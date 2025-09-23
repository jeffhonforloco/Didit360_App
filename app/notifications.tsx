import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ArrowLeft, Clock, Play, MoreHorizontal, Heart, Plus } from 'lucide-react-native';
import { usePlayer } from '@/contexts/PlayerContext';
import { allTracks, allPodcastEpisodes } from '@/data/mockData';
import type { Track } from '@/types';

type NotificationTab = 'Songs' | 'Podcasts';

interface NotificationItem {
  id: string;
  title: string;
  artist: string;
  artwork: string;
  duration: number;
  type: 'song' | 'podcast';
  releaseDate: string;
  isNew: boolean;
  category?: string;
}

const mockNotifications: NotificationItem[] = [
  {
    id: '1',
    title: 'BREAK MY SOUL',
    artist: 'Beyonce',
    artwork: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop',
    duration: 264,
    type: 'song',
    releaseDate: 'Today',
    isNew: true,
    category: 'Album'
  },
  {
    id: '2',
    title: 'Disaster',
    artist: 'Conan Gray',
    artwork: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400&h=400&fit=crop',
    duration: 238,
    type: 'song',
    releaseDate: 'Today',
    isNew: true,
    category: 'Single'
  },
  {
    id: '3',
    title: 'HANDSOME',
    artist: 'Warren Hue',
    artwork: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop',
    duration: 285,
    type: 'song',
    releaseDate: 'Today',
    isNew: true,
    category: 'Single'
  },
  {
    id: '4',
    title: 'Sharks',
    artist: 'Imagine Dragons',
    artwork: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400&h=400&fit=crop',
    duration: 323,
    type: 'song',
    releaseDate: 'Yesterday',
    isNew: false,
    category: 'Single'
  },
];

const mockPodcastNotifications: NotificationItem[] = [
  {
    id: '1',
    title: '837: Tristan Harris | Reclaiming Our Future with ...',
    artist: 'Apple Talk',
    artwork: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=400&h=400&fit=crop',
    duration: 2900,
    type: 'podcast',
    releaseDate: 'Today',
    isNew: true,
    category: '48:20 mins'
  },
  {
    id: '2',
    title: '593: Dallas Taylor | The Psychology of Sound Design',
    artist: 'What a Day',
    artwork: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=400&h=400&fit=crop',
    duration: 3382,
    type: 'podcast',
    releaseDate: 'Today',
    isNew: true,
    category: '56:42 mins'
  },
  {
    id: '3',
    title: '690: Jane McGonigal | How to See the Future and Be Ready...',
    artist: 'The Jordan Harbinger',
    artwork: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=400&h=400&fit=crop',
    duration: 2729,
    type: 'podcast',
    releaseDate: 'Today',
    isNew: true,
    category: '45:49 mins'
  },
  {
    id: '4',
    title: '621: Reid Hoffman | Surprising Entrepreneurial Truths',
    artist: 'Invest Like The Best',
    artwork: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=400&h=400&fit=crop',
    duration: 3140,
    type: 'podcast',
    releaseDate: 'Yesterday',
    isNew: false,
    category: '52:20 mins'
  },
];

export default function NotificationsScreen() {
  const [activeTab, setActiveTab] = useState<NotificationTab>('Songs');
  const { playTrack } = usePlayer();
  const insets = useSafeAreaInsets();

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getNotifications = () => {
    return activeTab === 'Songs' ? mockNotifications : mockPodcastNotifications;
  };

  const groupNotificationsByDate = (notifications: NotificationItem[]) => {
    const grouped: { [key: string]: NotificationItem[] } = {};
    notifications.forEach(notification => {
      const date = notification.releaseDate;
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(notification);
    });
    return grouped;
  };

  const renderNotificationItem = ({ item }: { item: NotificationItem }) => (
    <TouchableOpacity
      style={styles.notificationItem}
      onPress={() => {
        if (item.type === 'song') {
          const track = allTracks.find(t => t.title === item.title) || {
            id: item.id,
            title: item.title,
            artist: item.artist,
            artwork: item.artwork,
            duration: item.duration,
            type: 'song' as const,
            url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
          };
          playTrack(track);
        } else {
          router.push(`/podcast-episode/${item.id}`);
        }
      }}
      activeOpacity={0.8}
    >
      <Image source={{ uri: item.artwork }} style={styles.notificationImage} />
      <View style={styles.notificationContent}>
        <View style={styles.notificationHeader}>
          <Text style={styles.releaseDate}>{item.releaseDate}</Text>
          <Text style={styles.duration}>
            {item.type === 'song' ? formatDuration(item.duration) : item.category}
          </Text>
        </View>
        <Text style={styles.notificationTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <View style={styles.notificationMeta}>
          <Text style={styles.notificationArtist}>{item.artist}</Text>
          <Text style={styles.separator}>|</Text>
          <Text style={styles.notificationCategory}>{item.category}</Text>
        </View>
      </View>
      <View style={styles.notificationActions}>
        <TouchableOpacity
          style={styles.playButton}
          onPress={(e) => {
            e.stopPropagation();
            if (item.type === 'song') {
              const track = allTracks.find(t => t.title === item.title) || {
                id: item.id,
                title: item.title,
                artist: item.artist,
                artwork: item.artwork,
                duration: item.duration,
                type: 'song' as const,
                url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
              };
              playTrack(track);
            }
          }}
        >
          <Play size={16} color="#FFF" fill="#FFF" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.moreButton}>
          <MoreHorizontal size={20} color="#999" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const renderDateSection = (date: string, notifications: NotificationItem[]) => (
    <View key={date} style={styles.dateSection}>
      {date !== 'Today' && (
        <Text style={styles.dateSectionTitle}>{date}</Text>
      )}
      <FlatList
        data={notifications}
        renderItem={renderNotificationItem}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
      />
    </View>
  );

  const notifications = getNotifications();
  const groupedNotifications = groupNotificationsByDate(notifications);

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
        <View style={styles.headerTop}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Notification</Text>
          <TouchableOpacity style={styles.clockButton}>
            <Clock size={24} color="#FFF" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === 'Songs' && styles.activeTab,
            ]}
            onPress={() => setActiveTab('Songs')}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'Songs' && styles.activeTabText,
              ]}
            >
              Songs
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === 'Podcasts' && styles.activeTab,
            ]}
            onPress={() => setActiveTab('Podcasts')}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'Podcasts' && styles.activeTabText,
              ]}
            >
              Podcasts
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {activeTab === 'Songs' ? 'New Music Release Today' : 'New Podcasts Release Today'}
          </Text>
        </View>
        
        {Object.entries(groupedNotifications).map(([date, items]) =>
          renderDateSection(date, items)
        )}
        
        <View style={styles.bottomPadding} />
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
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFF',
  },
  clockButton: {
    padding: 4,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#1A1A1A',
    borderRadius: 8,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 6,
  },
  activeTab: {
    backgroundColor: '#0A0A0A',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
  },
  activeTabText: {
    color: '#E91E63',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFF',
  },
  dateSection: {
    marginBottom: 24,
  },
  dateSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFF',
    marginBottom: 16,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
  },
  notificationImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  notificationContent: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 8,
  },
  releaseDate: {
    fontSize: 12,
    color: '#999',
  },
  duration: {
    fontSize: 12,
    color: '#999',
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
    marginBottom: 4,
    lineHeight: 20,
  },
  notificationMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  notificationArtist: {
    fontSize: 14,
    color: '#999',
  },
  separator: {
    fontSize: 14,
    color: '#999',
  },
  notificationCategory: {
    fontSize: 14,
    color: '#999',
  },
  notificationActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  playButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E91E63',
    justifyContent: 'center',
    alignItems: 'center',
  },
  moreButton: {
    padding: 4,
  },
  bottomPadding: {
    height: 120,
  },
});