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
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft, Search, Filter, MoreHorizontal } from "lucide-react-native";
import { router, Stack } from "expo-router";
import { usePlayer } from "@/contexts/PlayerContext";
import { popularPodcasts, popularPodcastArtists, podcastCategories } from "@/data/mockData";
import type { Track } from "@/types";

interface PodcastArtist {
  id: string;
  name: string;
  image: string;
  category: string;
}

interface PodcastCategory {
  id: string;
  title: string;
  color: string;
  image: string;
}

export default function PodcastsScreen() {
  const { width } = useWindowDimensions();
  const { playTrack } = usePlayer();
  const CARD_WIDTH = Math.max(150, (width - 60) / 2);
  
  console.log('[PodcastsScreen] Rendering with data:', {
    popularPodcasts: popularPodcasts?.length || 0,
    popularPodcastArtists: popularPodcastArtists?.length || 0,
    podcastCategories: podcastCategories?.length || 0,
    width,
    platform: Platform.OS
  });

  const renderPodcastItem = ({ item }: { item: Track }) => (
    <TouchableOpacity
      style={[styles.podcastCard, { width: width - 40 }]}
      onPress={() => playTrack(item)}
      activeOpacity={0.8}
      testID={`podcast-${item.id}`}
    >
      <Image source={{ uri: item.artwork }} style={styles.podcastImage} />
      <View style={styles.podcastInfo}>
        <Text style={styles.podcastTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.podcastArtist} numberOfLines={1}>
          {item.artist}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderPodcastArtist = ({ item }: { item: PodcastArtist }) => (
    <TouchableOpacity
      style={[styles.artistCard, { width: CARD_WIDTH }]}
      onPress={() => console.log("Podcast artist selected:", item.name)}
      activeOpacity={0.8}
      testID={`podcast-artist-${item.id}`}
    >
      <Image source={{ uri: item.image }} style={[styles.artistImage, { width: CARD_WIDTH, height: CARD_WIDTH * 0.7 }]} />
      <View style={styles.artistInfo}>
        <Text style={styles.artistName} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.artistCategory} numberOfLines={1}>
          {item.category}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderCategory = ({ item }: { item: PodcastCategory }) => (
    <TouchableOpacity
      style={[styles.categoryCard, { width: CARD_WIDTH, backgroundColor: item.color }]}
      onPress={() => console.log("Category selected:", item.title)}
      activeOpacity={0.8}
      testID={`category-${item.id}`}
    >
      <Text style={styles.categoryTitle}>{item.title}</Text>
      <Image source={{ uri: item.image }} style={styles.categoryImage} />
    </TouchableOpacity>
  );

  const renderSectionHeader = (title: string, showSeeAll: boolean = true) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {showSeeAll && (
        <TouchableOpacity onPress={() => console.log("See all:", title)}>
          <Text style={styles.seeAllText}>See All</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={Platform.OS === 'web' ? [] : ['top']}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerStyle: { backgroundColor: "#0B0A14" },
          headerTintColor: "#FFF",
          headerTitle: "Podcasts",
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
            <View style={styles.headerRightContainer}>
              <TouchableOpacity onPress={() => router.push('/search')} style={styles.headerButton}>
                <Search size={24} color="#FFF" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => console.log("Filter pressed")} style={styles.headerButton}>
                <Filter size={24} color="#FFF" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => console.log("More pressed")} style={styles.headerButton}>
                <MoreHorizontal size={24} color="#FFF" />
              </TouchableOpacity>
            </View>
          ),
        }}
      />
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {renderSectionHeader("Popular Podcasts")}
        <FlatList
          data={popularPodcasts || []}
          renderItem={renderPodcastItem}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalList}
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No podcasts available</Text>
            </View>
          )}
        />

        {renderSectionHeader("Popular Artists")}
        <FlatList
          data={popularPodcastArtists || []}
          renderItem={renderPodcastArtist}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.row}
          scrollEnabled={false}
          contentContainerStyle={styles.gridContainer}
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No podcast artists available</Text>
            </View>
          )}
        />

        {renderSectionHeader("Categories")}
        <FlatList
          data={podcastCategories || []}
          renderItem={renderCategory}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.row}
          scrollEnabled={false}
          contentContainerStyle={[styles.gridContainer, { marginBottom: 100 }]}
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No categories available</Text>
            </View>
          )}
        />
      </ScrollView>
    </SafeAreaView>
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
  headerRightContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  scrollContent: {
    paddingTop: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 16,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFF",
  },
  seeAllText: {
    fontSize: 14,
    color: "#1DB954",
    fontWeight: "600",
  },
  horizontalList: {
    paddingHorizontal: 20,
  },
  gridContainer: {
    paddingHorizontal: 20,
  },
  row: {
    justifyContent: "space-between",
    marginBottom: 20,
  },
  podcastCard: {
    flexDirection: "row",
    backgroundColor: "#1A1A1A",
    borderRadius: 12,
    padding: 12,
    marginRight: 16,
    alignItems: "center",
  },
  podcastImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  podcastInfo: {
    flex: 1,
  },
  podcastTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFF",
    marginBottom: 4,
    lineHeight: 18,
  },
  podcastArtist: {
    fontSize: 12,
    color: "#999",
  },
  artistCard: {
    marginBottom: 8,
  },
  artistImage: {
    borderRadius: 12,
    marginBottom: 8,
  },
  artistInfo: {
    paddingHorizontal: 4,
  },
  artistName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFF",
    marginBottom: 2,
  },
  artistCategory: {
    fontSize: 12,
    color: "#999",
  },
  categoryCard: {
    height: 100,
    borderRadius: 12,
    padding: 16,
    justifyContent: "space-between",
    position: "relative",
    overflow: "hidden",
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFF",
  },
  categoryImage: {
    position: "absolute",
    bottom: -10,
    right: -10,
    width: 60,
    height: 60,
    borderRadius: 8,
    opacity: 0.7,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
    minWidth: 200,
  },
  emptyText: {
    color: "#999",
    fontSize: 16,
    textAlign: "center",
  },
});