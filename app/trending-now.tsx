import React from "react";
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
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ArrowLeft, Search, Play, Headphones, Book, Mic } from "lucide-react-native";
import { router } from "expo-router";
import { Stack } from "expo-router";
import { usePlayer } from "@/contexts/PlayerContext";
import { trendingNow } from "@/data/mockData";
import type { Track } from "@/types";

export default function TrendingNowScreen() {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const { playTrack } = usePlayer();
  const CARD_WIDTH = (width - 60) / 2;

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
          router.push('/player');
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
            fontSize: 18,
            fontWeight: "600",
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
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <FlatList
          data={trendingNow}
          renderItem={renderTrendingItem}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.row}
          scrollEnabled={false}
          contentContainerStyle={styles.gridContainer}
        />
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
  scrollContent: {
    paddingTop: 20,
  },
  gridContainer: {
    paddingHorizontal: 20,
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
  },
  cardImage: {
    borderRadius: 12,
  },
  contentTypeOverlay: {
    position: "absolute",
    top: 8,
    left: 8,
  },
  contentTypeBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
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
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
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
});