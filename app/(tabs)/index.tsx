import React, { useCallback, useMemo } from "react";
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
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Play, MoreVertical, Bell, Search, ChevronRight, Settings as SettingsIcon } from "lucide-react-native";
import { usePlayer } from "@/contexts/PlayerContext";
import { router } from "expo-router";
import { featuredContent, recentlyPlayed, topCharts, newReleases, podcasts, audiobooks, genres } from "@/data/mockData";
import type { Track } from "@/types";

interface CategoryTile {
  id: string;
  title: string;
  colors?: readonly [string, string];
  image?: string;
}

interface SimpleItem {
  id: string;
  title: string;
  subtitle?: string;
  image: string;
}

export default function HomeScreen() {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const CARD_WIDTH = width * 0.4;
  const SMALL_CARD = width * 0.32;
  const { playTrack } = usePlayer();

  const favoriteArtists = useMemo(() => {
    const byArtist: Record<string, Track> = {};
    [...featuredContent, ...topCharts, ...newReleases].forEach((t) => {
      if (!byArtist[t.artist]) byArtist[t.artist] = t;
    });
    return Object.values(byArtist).slice(0, 8);
  }, []);

  const categories: CategoryTile[] = useMemo(
    () => [
      { id: "c1", title: "Podcasts", image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&q=80&auto=format&fit=crop" },
      { id: "c2", title: "Audio Book", image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&q=80&auto=format&fit=crop" },
      { id: "c3", title: "AI creations", image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80&auto=format&fit=crop" },
      { id: "c4", title: "NFT", image: "https://images.unsplash.com/photo-1639322537504-6427a16b0a28?w=800&q=80&auto=format&fit=crop" },
    ],
    []
  );

  const renderHeader = useCallback(() => (
    <View style={[styles.header, { paddingTop: 20 + insets.top }]}> 
      <View style={styles.headerLeft}>
        <Image
          source={{ uri: "https://i.pravatar.cc/100?img=12" }}
          style={styles.avatar}
        />
        <View>
          <Text style={styles.subtleText}>Good Morning 👋</Text>
          <Text style={styles.headerName} numberOfLines={1}>Andrew Ainsley</Text>
        </View>
      </View>
      <View style={styles.headerRight}>
        <TouchableOpacity testID="search-button" accessibilityRole="button" onPress={() => console.log("Search pressed")}> 
          <Search color="#FFF" size={20} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconSpacer} testID="bell-button" accessibilityRole="button" onPress={() => console.log("Bell pressed")}> 
          <Bell color="#FFF" size={20} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconSpacer} testID="settings-button" accessibilityRole="button" accessibilityLabel="Open settings" onPress={() => router.push('/settings')}> 
          <SettingsIcon color="#FFF" size={20} />
        </TouchableOpacity>
      </View>
    </View>
  ), [insets.top]);

  const renderSectionHeader = useCallback((title: string, testID: string) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <TouchableOpacity style={styles.seeAll} onPress={() => console.log("See all:", title)} testID={`${testID}-see-all`}>
        <Text style={styles.seeAllText}>See All</Text>
        <ChevronRight color="#B3B3B3" size={16} />
      </TouchableOpacity>
    </View>
  ), []);

  const renderFeaturedItem = useCallback(({ item }: { item: Track }) => (
    <TouchableOpacity
      style={[styles.featuredCard, { width: width - 40 }]}
      onPress={() => playTrack(item)}
      activeOpacity={0.8}
      testID={`featured-${item.id}`}
    >
      <LinearGradient
        colors={["#FF0080", "#8B5CF6"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.featuredGradient}
      >
        <Image source={{ uri: item.artwork }} style={styles.featuredImage} />
        <View style={styles.featuredOverlay}>
          <Text style={styles.featuredTitle} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={styles.featuredArtist} numberOfLines={1}>
            {item.artist}
          </Text>
          <TouchableOpacity style={styles.playButton} onPress={() => playTrack(item)} testID={`featured-play-${item.id}`}>
            <Play size={20} color="#000" fill="#FFF" />
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  ), [playTrack, width]);

  const renderCard = useCallback(({ item }: { item: Track }) => (
    <TouchableOpacity
      style={[styles.card, { width: CARD_WIDTH }]}
      onPress={() => playTrack(item)}
      activeOpacity={0.8}
      testID={`card-${item.id}`}
    >
      <Image 
        source={{ uri: item.artwork }} 
        style={[styles.cardImage, { width: CARD_WIDTH, height: CARD_WIDTH }]} 
      />
      <Text style={styles.cardTitle} numberOfLines={1}>
        {item.title}
      </Text>
      <Text style={styles.cardArtist} numberOfLines={1}>
        {item.artist}
      </Text>
    </TouchableOpacity>
  ), [CARD_WIDTH, playTrack]);

  const renderSmallCard = useCallback(({ item }: { item: Track }) => (
    <TouchableOpacity
      style={[styles.card, { width: SMALL_CARD }]}
      onPress={() => playTrack(item)}
      activeOpacity={0.8}
      testID={`small-card-${item.id}`}
    >
      <Image 
        source={{ uri: item.artwork }} 
        style={[styles.cardImage, { width: SMALL_CARD, height: SMALL_CARD }]} 
      />
      <Text style={styles.cardTitle} numberOfLines={1}>
        {item.title}
      </Text>
      <Text style={styles.cardArtist} numberOfLines={1}>
        {item.artist}
      </Text>
    </TouchableOpacity>
  ), [SMALL_CARD, playTrack]);

  const renderRecentItem = useCallback(({ item }: { item: Track }) => (
    <TouchableOpacity
      style={styles.recentItem}
      onPress={() => playTrack(item)}
      activeOpacity={0.8}
      testID={`recent-${item.id}`}
    >
      <Image source={{ uri: item.artwork }} style={styles.recentImage} />
      <View style={styles.recentInfo}>
        <Text style={styles.recentTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.recentArtist} numberOfLines={1}>
          {item.artist}
        </Text>
      </View>
      <TouchableOpacity style={styles.moreButton} onPress={() => console.log("More pressed", item.id)}>
        <MoreVertical size={20} color="#666" />
      </TouchableOpacity>
    </TouchableOpacity>
  ), [playTrack]);

  const renderFavoriteArtist = useCallback(({ item }: { item: Track }) => (
    <TouchableOpacity style={styles.artistCard} onPress={() => playTrack(item)} activeOpacity={0.9} testID={`artist-${item.artist}`}>
      <Image source={{ uri: item.artwork }} style={styles.artistImage} />
      <Text style={styles.artistName} numberOfLines={1}>{item.artist}</Text>
    </TouchableOpacity>
  ), [playTrack]);

  const renderCategory = useCallback(({ item }: { item: CategoryTile }) => (
    <TouchableOpacity style={styles.categoryTile} onPress={() => console.log("Category", item.title)} activeOpacity={0.85} testID={`category-${item.id}`}>
      {item.image ? (
        <Image source={{ uri: item.image }} style={styles.categoryImage} />
      ) : (
        <LinearGradient colors={item.colors ?? ["#333333", "#111111"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.categoryGradient} />
      )}
      <View style={styles.categoryLabelWrap}>
        <Text style={styles.categoryText}>{item.title}</Text>
      </View>
    </TouchableOpacity>
  ), []);

  const renderGenre = useCallback(({ item }: { item: string }) => (
    <TouchableOpacity style={styles.genrePill} onPress={() => console.log("Genre", item)} testID={`genre-${item}`}>
      <Text style={styles.genreText}>{item}</Text>
    </TouchableOpacity>
  ), []);

  const aiCreations: SimpleItem[] = useMemo(() => [
    { id: "ai1", title: "Save Your Tears", subtitle: "The Weeknd & Ari", image: "https://images.unsplash.com/photo-1542206395-9feb3edaa68a?w=1000&q=80&auto=format&fit=crop" },
    { id: "ai2", title: "Without You", subtitle: "The Kid LAROI", image: "https://images.unsplash.com/photo-1520975922284-4b9a1b4805bf?w=1000&q=80&auto=format&fit=crop" },
    { id: "ai3", title: "Synth Girl", subtitle: "Neon Dreams", image: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=1000&q=80&auto=format&fit=crop" },
  ], []);

  const recentNFTs: SimpleItem[] = useMemo(() => [
    { id: "n1", title: "Save Your Tears", subtitle: "The Weeknd & Ari", image: "https://images.unsplash.com/photo-1608889175123-8f25e1df238a?w=1000&q=80&auto=format&fit=crop" },
    { id: "n2", title: "Shades of Love", subtitle: "Ania Szarmach", image: "https://images.unsplash.com/photo-1618172193763-c511deb635ca?w=1000&q=80&auto=format&fit=crop" },
    { id: "n3", title: "Cyber Kid", subtitle: "3D Artist", image: "https://images.unsplash.com/photo-1606112219348-204d7d8b94ee?w=1000&q=80&auto=format&fit=crop" },
  ], []);

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} testID="home-scroll">
        {renderHeader()}

        <View style={styles.section}>
          <FlatList
            data={featuredContent}
            renderItem={renderFeaturedItem}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
            pagingEnabled
            snapToInterval={width - 40}
            decelerationRate="fast"
          />
        </View>

        <View style={styles.section}>
          {renderSectionHeader("Favorite Artists", "favorite-artists")}
          <FlatList
            data={favoriteArtists}
            renderItem={renderFavoriteArtist}
            keyExtractor={(item) => `fav-${item.id}`}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
          />
        </View>

        <View style={styles.section}>
          {renderSectionHeader("Browse", "browse-categories")}
          <FlatList
            data={categories}
            renderItem={renderCategory}
            keyExtractor={(item) => item.id}
            numColumns={2}
            columnWrapperStyle={styles.categoryRow}
            scrollEnabled={false}
            contentContainerStyle={styles.categoriesContainer}
          />
        </View>

        <View style={styles.section}>
          {renderSectionHeader("Live Performance", "live-performance")}
          <FlatList
            data={topCharts.slice(0, 6)}
            renderItem={renderSmallCard}
            keyExtractor={(item) => `live-${item.id}`}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
          />
        </View>

        <View style={styles.section}>
          {renderSectionHeader("Your Top Mix", "top-mix")}
          <FlatList
            data={newReleases.slice(0, 6)}
            renderItem={renderSmallCard}
            keyExtractor={(item) => `mix-${item.id}`}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
          />
        </View>

        <View style={styles.section}>
          {renderSectionHeader("Recently Added", "recently-added")}
          <FlatList
            data={recentlyPlayed}
            renderItem={renderCard}
            keyExtractor={(item) => `recently-${item.id}`}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
          />
        </View>

        <View style={styles.section}>
          {renderSectionHeader("AI Creations", "ai-creations")}
          <FlatList
            data={aiCreations}
            renderItem={({ item }) => (
              <View style={[styles.simpleCard, { width: CARD_WIDTH }]}> 
                <Image source={{ uri: item.image }} style={[styles.cardImage, { width: CARD_WIDTH, height: CARD_WIDTH }]} />
                <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
                {item.subtitle ? <Text style={styles.cardArtist} numberOfLines={1}>{item.subtitle}</Text> : null}
              </View>
            )}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
          />
        </View>

        <View style={styles.section}>
          {renderSectionHeader("Recent NFT's", "recent-nfts")}
          <FlatList
            data={recentNFTs}
            renderItem={({ item }) => (
              <View style={[styles.simpleCard, { width: CARD_WIDTH }]}> 
                <Image source={{ uri: item.image }} style={[styles.cardImage, { width: CARD_WIDTH, height: CARD_WIDTH }]} />
                <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
                {item.subtitle ? <Text style={styles.cardArtist} numberOfLines={1}>{item.subtitle}</Text> : null}
              </View>
            )}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
          />
        </View>

        <View style={styles.section}>
          {renderSectionHeader("Browse Genres", "browse-genres")}
          <FlatList
            data={genres}
            renderItem={renderGenre}
            keyExtractor={(item) => `genre-${item}`}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={[styles.horizontalList, styles.genreList]}
          />
        </View>

        <View style={styles.section}>
          {renderSectionHeader("Recent Podcast", "recent-podcast")}
          <FlatList
            data={podcasts}
            renderItem={renderCard}
            keyExtractor={(item) => `pod-${item.id}`}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
          />
        </View>

        <View style={[styles.section, { marginBottom: 120 }]}> 
          {renderSectionHeader("Latest Books", "latest-books")}
          <FlatList
            data={audiobooks}
            renderItem={renderCard}
            keyExtractor={(item) => `ab-${item.id}`}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
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
  header: {
    paddingHorizontal: 20,
    paddingBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconSpacer: {
    marginLeft: 16,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    marginRight: 12,
  },
  subtleText: {
    fontSize: 12,
    color: "#B3B3B3",
    marginBottom: 2,
  },
  headerName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
    maxWidth: 200,
  },
  logoImage: {
    width: 40,
    height: 40,
    borderRadius: 8,
    marginBottom: 8,
  },
  section: {
    marginTop: 24,
  },
  sectionHeader: {
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFF",
  },
  seeAll: {
    flexDirection: "row",
    alignItems: "center",
  },
  seeAllText: {
    fontSize: 13,
    color: "#B3B3B3",
    marginRight: 6,
  },
  horizontalList: {
    paddingHorizontal: 20,
  },
  featuredCard: {
    height: 200,
    marginRight: 16,
  },
  featuredGradient: {
    flex: 1,
    borderRadius: 16,
    padding: 2,
  },
  featuredImage: {
    flex: 1,
    borderRadius: 14,
  },
  featuredOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    borderBottomLeftRadius: 14,
    borderBottomRightRadius: 14,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  featuredTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFF",
    marginBottom: 4,
  },
  featuredArtist: {
    fontSize: 14,
    color: "#CCC",
  },
  playButton: {
    position: "absolute",
    right: 16,
    bottom: 16,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    marginRight: 16,
  },
  cardImage: {
    borderRadius: 12,
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFF",
    marginBottom: 4,
  },
  cardArtist: {
    fontSize: 12,
    color: "#999",
  },
  recentItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  recentImage: {
    width: 48,
    height: 48,
    borderRadius: 8,
    marginRight: 12,
  },
  recentInfo: {
    flex: 1,
  },
  recentTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFF",
    marginBottom: 2,
  },
  recentArtist: {
    fontSize: 12,
    color: "#999",
  },
  moreButton: {
    padding: 8,
  },
  artistCard: {
    width: 140,
    marginRight: 16,
  },
  artistImage: {
    width: 140,
    height: 140,
    borderRadius: 12,
    marginBottom: 8,
  },
  artistName: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "600",
  },
  categoriesContainer: {
    paddingHorizontal: 16,
  },
  categoryRow: {
    paddingHorizontal: 12,
    justifyContent: "space-between",
    marginBottom: 12,
  },
  categoryTile: {
    flex: 1,
    marginHorizontal: 8,
    height: 110,
    borderRadius: 12,
    overflow: "hidden",
  },
  categoryGradient: {
    flex: 1,
    borderRadius: 12,
  },
  categoryImage: {
    width: "100%",
    height: "100%",
  },
  categoryLabelWrap: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-end",
    padding: 12,
    backgroundColor: "rgba(0,0,0,0.25)",
  },
  categoryText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "700",
  },
  genreList: {
    paddingVertical: 8,
  },
  genrePill: {
    backgroundColor: "#17162A",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    marginRight: 10,
  },
  genreText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "600",
  },
  simpleCard: {
    marginRight: 16,
  },
});