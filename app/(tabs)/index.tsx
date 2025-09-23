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
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Play, MoreVertical, Bell, Search, ChevronRight, Settings as SettingsIcon } from "lucide-react-native";
import { usePlayer } from "@/contexts/PlayerContext";
import { router } from "expo-router";
import { featuredContent, recentlyPlayed, topCharts, newReleases, podcasts, audiobooks, genres, trendingNow, browseCategories } from "@/data/mockData";
import type { Track } from "@/types";
import type { CategoryItem } from "@/data/mockData";
import { useUser } from "@/contexts/UserContext";



export default function HomeScreen() {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const CARD_WIDTH = width * 0.4;
  const SMALL_CARD = width * 0.32;
  const { playTrack } = usePlayer();
  const { profile } = useUser();

  const favoriteArtists = useMemo(() => {
    const byArtist: Record<string, Track> = {};
    [...featuredContent, ...topCharts, ...newReleases].forEach((t) => {
      if (!byArtist[t.artist]) byArtist[t.artist] = t;
    });
    return Object.values(byArtist).slice(0, 8);
  }, []);



  const renderHeader = useCallback(() => (
    <View style={[styles.header, { paddingTop: 20 + insets.top }]}> 
      <View style={styles.headerLeft}>
        {profile && (
          <Image
            source={{ uri: profile.avatarUrl ?? "https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=200&auto=format&fit=crop" }}
            style={styles.avatar}
          />
        )}
        <View>
          <Text style={styles.subtleText}>{profile ? "Welcome back" : "Welcome"} 👋</Text>
          <Text style={styles.headerName} numberOfLines={1}>{profile ? (profile.displayName || profile.email) : "Guest"}</Text>
        </View>
      </View>
      <View style={styles.headerRight}>
        <TouchableOpacity testID="search-button" accessibilityRole="button" onPress={() => router.push('/search')}> 
          <Search color="#FFF" size={20} />
        </TouchableOpacity>
        {profile ? (
          <>
            <TouchableOpacity style={styles.iconSpacer} testID="bell-button" accessibilityRole="button" onPress={() => console.log("Bell pressed")}> 
              <Bell color="#FFF" size={20} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconSpacer} testID="settings-button" accessibilityRole="button" accessibilityLabel="Open settings" onPress={() => router.push('/settings')}> 
              <SettingsIcon color="#FFF" size={20} />
            </TouchableOpacity>
          </>
        ) : null}
      </View>
    </View>
  ), [insets.top, profile]);

  const renderSectionHeader = useCallback((title: string, testID: string, route?: string) => {
    const handleSeeAll = () => {
      if (route) {
        router.push(route as any);
      } else {
        // Handle specific cases for the new screens
        switch (title) {
          case "Trending Now":
            router.push("/trending-now");
            break;
          case "Popular Artists":
            router.push("/popular-artists");
            break;
          case "Recent Podcast":
            router.push("/podcasts-full");
            break;
          case "Browse Categories":
            router.push("/browse-categories");
            break;
          default:
            console.log("See all:", title);
        }
      }
    };

    return (
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <TouchableOpacity 
          style={styles.seeAll} 
          onPress={handleSeeAll}
          testID={`${testID}-see-all`}
        >
          <Text style={styles.seeAllText}>See All</Text>
          <ChevronRight color="#B3B3B3" size={16} />
        </TouchableOpacity>
      </View>
    );
  }, []);

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

  const renderCategory = useCallback(({ item }: { item: CategoryItem }) => {
    const handleCategoryPress = () => {
      if (item.route) {
        router.push(item.route as any);
      } else {
        console.log("Category", item.title);
      }
    };

    return (
      <TouchableOpacity 
        style={styles.categoryTile} 
        onPress={handleCategoryPress} 
        activeOpacity={0.85} 
        testID={`category-${item.id}`}
      >
        <LinearGradient 
          colors={item.colors} 
          start={{ x: 0, y: 0 }} 
          end={{ x: 1, y: 1 }} 
          style={styles.categoryGradient}
        >
          {item.image && (
            <Image 
              source={{ uri: item.image }} 
              style={styles.categoryImage} 
            />
          )}
          <View style={styles.categoryContent}>
            <Text style={styles.categoryText}>{item.title}</Text>
            {item.description && (
              <Text style={styles.categoryDescription} numberOfLines={2}>
                {item.description}
              </Text>
            )}
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  }, []);

  const renderGenre = useCallback(({ item }: { item: string }) => (
    <TouchableOpacity style={styles.genrePill} onPress={() => console.log("Genre", item)} testID={`genre-${item}`}>
      <Text style={styles.genreText}>{item}</Text>
    </TouchableOpacity>
  ), []);

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} testID="home-scroll">
        {renderHeader()}
        {!profile && (
          <View style={styles.guestBanner}>
            <Text style={styles.guestText}>You are listening as a guest. Enjoy a few minutes, then create an account to continue.</Text>
            <TouchableOpacity style={styles.guestBtn} onPress={() => router.push('/auth')}>
              <Text style={styles.guestBtnText}>Sign up free</Text>
            </TouchableOpacity>
          </View>
        )}

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
          {renderSectionHeader("Trending Now", "trending-now")}
          <FlatList
            data={trendingNow.slice(0, 6)}
            renderItem={renderCard}
            keyExtractor={(item) => `trending-${item.id}`}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
          />
        </View>

        <View style={styles.section}>
          {renderSectionHeader("Popular Artists", "popular-artists")}
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
          {renderSectionHeader("Browse Categories", "browse-categories")}
          <FlatList
            data={browseCategories.slice(0, 6)}
            renderItem={renderCategory}
            keyExtractor={(item) => item.id}
            numColumns={2}
            columnWrapperStyle={styles.categoryRow}
            scrollEnabled={false}
            contentContainerStyle={styles.categoriesContainer}
          />
        </View>

        <View style={styles.section}>
          {renderSectionHeader("Live Performance", "live-performance", "/categories/live-performance")}
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
          {renderSectionHeader("Your Top Mix", "top-mix", "/categories/top-mix")}
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
          {renderSectionHeader("Recently Added", "recently-added", "/categories/recently-added")}
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
          {renderSectionHeader("Trending Videos", "trending-videos", "/categories/trending-videos")}
          <FlatList
            data={featuredContent}
            renderItem={renderCard}
            keyExtractor={(item) => `trending-${item.id}`}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
          />
        </View>

        <View style={styles.section}>
          {renderSectionHeader("Most Viewed", "most-viewed", "/categories/most-viewed")}
          <FlatList
            data={topCharts}
            renderItem={renderCard}
            keyExtractor={(item) => `most-${item.id}`}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
          />
        </View>

        <View style={styles.section}>
          {renderSectionHeader("Browse Genres", "browse-genres", "/categories/genres")}
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
          {renderSectionHeader("Recent Podcast", "recent-podcast", "/categories/podcasts")}
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
          {renderSectionHeader("Latest Books", "latest-books", "/categories/audiobooks")}
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
    paddingHorizontal: 4,
    justifyContent: "space-between",
    marginBottom: 16,
  },
  categoryTile: {
    flex: 1,
    marginHorizontal: 4,
    height: 140,
  },
  categoryGradient: {
    flex: 1,
    borderRadius: 16,
    overflow: "hidden",
    position: "relative",
  },
  categoryImage: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.3,
  },
  categoryContent: {
    flex: 1,
    justifyContent: "flex-end",
    padding: 16,
  },
  categoryText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
  },
  categoryDescription: {
    color: "#E0E0E0",
    fontSize: 12,
    lineHeight: 16,
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
  guestBanner: { marginHorizontal: 20, backgroundColor: "#111113", borderRadius: 12, borderWidth: 1, borderColor: "#1F2937", padding: 12, marginTop: 8 },
  guestText: { color: "#E5E7EB", fontSize: 12, marginBottom: 8 },
  guestBtn: { backgroundColor: "#FF0080", height: 36, borderRadius: 10, alignItems: "center", justifyContent: "center", alignSelf: "flex-start", paddingHorizontal: 14 },
  guestBtnText: { color: "#0B0B0C", fontWeight: "800" },
});