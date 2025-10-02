import React, { useState, useMemo } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
  useWindowDimensions,
} from "react-native";
import { 
  ArrowLeft, 
  Search, 
  Play, 
  Headphones, 
  Book, 
  Mic, 
  TrendingUp,
  Flame,
  Music,
  Video,
  Radio,
  BookOpen,
} from "lucide-react-native";
import { router, Stack } from "expo-router";
import { usePlayer } from "@/contexts/PlayerContext";
import { trendingNow } from "@/data/mockData";
import type { Track } from "@/types";

type FilterType = "all" | "song" | "video" | "podcast" | "audiobook";

export default function TrendingNowScreen() {
  const { width } = useWindowDimensions();
  const { playTrack } = usePlayer();
  const [selectedFilter, setSelectedFilter] = useState<FilterType>("all");
  const CARD_WIDTH = (width - 60) / 2;

  const filters: { type: FilterType; label: string; icon: React.ReactNode }[] = [
    { type: "all", label: "All", icon: <TrendingUp size={16} color="#FFF" /> },
    { type: "song", label: "Music", icon: <Music size={16} color="#FFF" /> },
    { type: "video", label: "Videos", icon: <Video size={16} color="#FFF" /> },
    { type: "podcast", label: "Podcasts", icon: <Radio size={16} color="#FFF" /> },
    { type: "audiobook", label: "Audiobooks", icon: <BookOpen size={16} color="#FFF" /> },
  ];

  const filteredContent = useMemo(() => {
    if (selectedFilter === "all") return trendingNow;
    return trendingNow.filter((item) => item.type === selectedFilter);
  }, [selectedFilter]);

  const getContentTypeIcon = (type: Track['type']) => {
    switch (type) {
      case 'video':
        return <Play size={16} color="#FFF" />;
      case 'podcast':
        return <Mic size={16} color="#FFF" />;
      case 'audiobook':
        return <Book size={16} color="#FFF" />;
      default:
        return <Headphones size={16} color="#FFF" />;
    }
  };

  const getContentTypeLabel = (type: Track['type']) => {
    switch (type) {
      case 'video':
        return 'Video';
      case 'podcast':
        return 'Podcast';
      case 'audiobook':
        return 'Audiobook';
      default:
        return 'Music';
    }
  };

  const formatDuration = (seconds: number) => {
    if (seconds >= 3600) {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      return `${hours}h ${minutes}m`;
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const renderTrendingItem = ({ item, index }: { item: Track; index: number }) => (
    <TouchableOpacity
      style={[styles.trendingCard, { width: CARD_WIDTH }]}
      onPress={() => {
        console.log(`Playing trending ${item.type}: ${item.title}`);
        if (item.type === 'video' || item.isVideo) {
          console.log(`Opening video player for: ${item.title}`);
          playTrack(item);
        } else if (item.type === 'podcast') {
          router.push(`/podcast-player?id=${item.id}`);
        } else if (item.type === 'audiobook') {
          router.push(`/audiobook/${item.id}`);
        } else {
          playTrack(item);
          router.push('/player');
        }
      }}
      activeOpacity={0.8}
      testID={`trending-${item.id}`}
    >
      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: item.artwork }} 
          style={[styles.cardImage, { width: CARD_WIDTH, height: CARD_WIDTH }]} 
        />
        <View style={styles.trendingBadge}>
          <Flame size={12} color="#FF6B6B" />
          <Text style={styles.trendingBadgeText}>#{index + 1}</Text>
        </View>
        <View style={styles.contentTypeOverlay}>
          <View style={styles.contentTypeBadge}>
            {getContentTypeIcon(item.type)}
            <Text style={styles.contentTypeText}>
              {getContentTypeLabel(item.type)}
            </Text>
          </View>
        </View>
        <View style={styles.durationOverlay}>
          <Text style={styles.durationText}>
            {formatDuration(item.duration)}
          </Text>
        </View>
        <View style={styles.playOverlay}>
          <View style={styles.playButton}>
            <Play size={24} color="#FFF" fill="#FFF" />
          </View>
        </View>
      </View>
      <View style={styles.cardInfo}>
        <Text style={styles.cardTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.cardArtist} numberOfLines={1}>
          {item.artist}
        </Text>
        {item.description && (
          <Text style={styles.cardDescription} numberOfLines={1}>
            {item.description}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerStyle: { backgroundColor: "#0B0A14" },
          headerTintColor: "#FFF",
          headerTitle: "Trending Now",
          headerTitleStyle: {
            fontSize: 20,
            fontWeight: "700",
          },
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
              <ArrowLeft size={24} color="#FFF" />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity onPress={() => router.push('/search')} style={styles.headerButton}>
              <Search size={24} color="#FFF" />
            </TouchableOpacity>
          ),
        }}
      />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.headerIcon}>
            <TrendingUp size={32} color="#FF6B6B" />
          </View>
          <Text style={styles.headerTitle}>What&apos;s Hot Right Now</Text>
          <Text style={styles.headerSubtitle}>
            Discover the most popular content across all categories
          </Text>
        </View>

        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterContainer}
        >
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter.type}
              style={[
                styles.filterButton,
                selectedFilter === filter.type && styles.filterButtonActive,
              ]}
              onPress={() => setSelectedFilter(filter.type)}
              activeOpacity={0.7}
            >
              {filter.icon}
              <Text
                style={[
                  styles.filterText,
                  selectedFilter === filter.type && styles.filterTextActive,
                ]}
              >
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{filteredContent.length}</Text>
            <Text style={styles.statLabel}>Trending Items</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>24h</Text>
            <Text style={styles.statLabel}>Updated</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>🔥</Text>
            <Text style={styles.statLabel}>Hot</Text>
          </View>
        </View>

        <View style={styles.gridContainer}>
          <FlatList
            data={filteredContent}
            renderItem={renderTrendingItem}
            keyExtractor={(item) => `${item.id}-${selectedFilter}`}
            numColumns={2}
            columnWrapperStyle={styles.row}
            scrollEnabled={false}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <TrendingUp size={48} color="#666" />
                <Text style={styles.emptyText}>No trending content found</Text>
                <Text style={styles.emptySubtext}>Try selecting a different filter</Text>
              </View>
            }
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B0A14",
  },
  headerButton: {
    padding: 8,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 20,
    alignItems: "center",
  },
  headerIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "rgba(255, 107, 107, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#FFF",
    marginBottom: 8,
    textAlign: "center",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
    lineHeight: 20,
  },
  filterContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    gap: 6,
  },
  filterButtonActive: {
    backgroundColor: "#FF6B6B",
    borderColor: "#FF6B6B",
  },
  filterText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#999",
  },
  filterTextActive: {
    color: "#FFF",
  },
  statsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    marginHorizontal: 20,
    marginBottom: 24,
    padding: 16,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "800",
    color: "#FF6B6B",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#999",
    fontWeight: "500",
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  gridContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  row: {
    justifyContent: "space-between",
    marginBottom: 24,
  },
  trendingCard: {
    marginBottom: 8,
  },
  imageContainer: {
    position: "relative",
    marginBottom: 12,
    borderRadius: 12,
    overflow: "hidden",
  },
  cardImage: {
    borderRadius: 12,
  },
  trendingBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.9)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
    borderWidth: 1,
    borderColor: "#FF6B6B",
  },
  trendingBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#FFF",
  },
  contentTypeOverlay: {
    position: "absolute",
    top: 8,
    left: 8,
  },
  contentTypeBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  contentTypeText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#FFF",
  },
  durationOverlay: {
    position: "absolute",
    bottom: 8,
    right: 8,
  },
  durationText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#FFF",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  playOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    opacity: 0,
  },
  playButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255, 107, 107, 0.9)",
    alignItems: "center",
    justifyContent: "center",
  },
  cardInfo: {
    paddingHorizontal: 4,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFF",
    marginBottom: 4,
    lineHeight: 18,
  },
  cardArtist: {
    fontSize: 12,
    color: "#999",
    marginBottom: 2,
  },
  cardDescription: {
    fontSize: 10,
    color: "#666",
    fontStyle: "italic",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#999",
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#666",
  },
});