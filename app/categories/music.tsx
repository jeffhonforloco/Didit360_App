import React, { useState, useMemo } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { 
  ArrowLeft, 
  Play, 
  Heart,
  MoreVertical,
  TrendingUp,
  Clock,
  Music2,
  Sparkles,
  Radio,
  ListMusic,
} from "lucide-react-native";
import { router } from "expo-router";
import { usePlayer } from "@/contexts/PlayerContext";
import { 
  featuredContent, 
  topCharts, 
  newReleases, 
  trendingNow, 
  genres,
  popularArtists,
} from "@/data/mockData";
import type { Track } from "@/types";
import { LinearGradient } from "expo-linear-gradient";

const HERO_HEIGHT = 240;

type TabType = "all" | "trending" | "new" | "charts";

export default function MusicCategoryScreen() {
  const { playTrack, currentTrack } = usePlayer();
  const [selectedTab, setSelectedTab] = useState<TabType>("all");
  const [likedTracks, setLikedTracks] = useState<Set<string>>(new Set());

  const musicTracks = useMemo(() => {
    const allTracks = [
      ...featuredContent.filter(t => t.type === "song"),
      ...topCharts,
      ...newReleases.filter(t => t.type === "song"),
      ...trendingNow.filter(t => t.type === "song"),
    ];

    switch (selectedTab) {
      case "trending":
        return trendingNow.filter(t => t.type === "song");
      case "new":
        return newReleases.filter(t => t.type === "song");
      case "charts":
        return topCharts;
      default:
        return allTracks;
    }
  }, [selectedTab]);

  const toggleLike = (trackId: string) => {
    setLikedTracks(prev => {
      const newSet = new Set(prev);
      if (newSet.has(trackId)) {
        newSet.delete(trackId);
      } else {
        newSet.add(trackId);
      }
      return newSet;
    });
  };

  const renderHeroSection = () => {
    const heroTrack = featuredContent[0];
    if (!heroTrack) return null;

    return (
      <TouchableOpacity
        style={styles.heroContainer}
        onPress={() => playTrack(heroTrack)}
        activeOpacity={0.9}
        testID="hero-track"
      >
        <Image 
          source={{ uri: heroTrack.artwork }} 
          style={styles.heroImage}
          resizeMode="cover"
        />
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.4)", "rgba(11,10,20,0.95)"]}
          style={styles.heroGradient}
        >
          <View style={styles.heroContent}>
            <View style={styles.heroTag}>
              <Sparkles size={14} color="#FFD700" />
              <Text style={styles.heroTagText}>Featured Now</Text>
            </View>
            <Text style={styles.heroTitle} numberOfLines={2}>
              {heroTrack.title}
            </Text>
            <Text style={styles.heroArtist} numberOfLines={1}>
              {heroTrack.artist}
            </Text>
            <View style={styles.heroActions}>
              <TouchableOpacity 
                style={styles.heroPlayButton}
                onPress={() => playTrack(heroTrack)}
              >
                <Play size={20} color="#000" fill="#000" />
                <Text style={styles.heroPlayText}>Play Now</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.heroLikeButton}
                onPress={() => toggleLike(heroTrack.id)}
              >
                <Heart 
                  size={20} 
                  color={likedTracks.has(heroTrack.id) ? "#FF0080" : "#FFF"}
                  fill={likedTracks.has(heroTrack.id) ? "#FF0080" : "transparent"}
                />
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  const renderQuickActions = () => (
    <View style={styles.quickActions}>
      <TouchableOpacity 
        style={styles.quickActionCard}
        onPress={() => router.push("/playlists")}
      >
        <View style={[styles.quickActionIcon, { backgroundColor: "#8B5CF6" }]}>
          <ListMusic size={20} color="#FFF" />
        </View>
        <Text style={styles.quickActionText}>Playlists</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.quickActionCard}
        onPress={() => router.push("/categories/artists")}
      >
        <View style={[styles.quickActionIcon, { backgroundColor: "#EC4899" }]}>
          <Music2 size={20} color="#FFF" />
        </View>
        <Text style={styles.quickActionText}>Artists</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.quickActionCard}
        onPress={() => router.push("/albums")}
      >
        <View style={[styles.quickActionIcon, { backgroundColor: "#F59E0B" }]}>
          <Radio size={20} color="#FFF" />
        </View>
        <Text style={styles.quickActionText}>Albums</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.quickActionCard}
        onPress={() => router.push("/history")}
      >
        <View style={[styles.quickActionIcon, { backgroundColor: "#10B981" }]}>
          <Clock size={20} color="#FFF" />
        </View>
        <Text style={styles.quickActionText}>Recent</Text>
      </TouchableOpacity>
    </View>
  );

  const renderTabs = () => (
    <View style={styles.tabsContainer}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabsContent}
      >
        {[
          { id: "all" as TabType, label: "All Music", icon: Music2 },
          { id: "trending" as TabType, label: "Trending", icon: TrendingUp },
          { id: "new" as TabType, label: "New Releases", icon: Sparkles },
          { id: "charts" as TabType, label: "Top Charts", icon: TrendingUp },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = selectedTab === tab.id;
          return (
            <TouchableOpacity
              key={tab.id}
              style={[
                styles.tab,
                isActive && styles.tabActive,
              ]}
              onPress={() => setSelectedTab(tab.id)}
              testID={`tab-${tab.id}`}
            >
              <Icon 
                size={16} 
                color={isActive ? "#FF0080" : "#999"} 
              />
              <Text style={[
                styles.tabText,
                isActive && styles.tabTextActive,
              ]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );

  const renderTrackCard = ({ item, index }: { item: Track; index: number }) => {
    const isPlaying = currentTrack?.id === item.id;
    const isLiked = likedTracks.has(item.id);

    return (
      <TouchableOpacity
        style={[
          styles.trackCard,
          index % 2 === 0 && styles.trackCardLeft,
        ]}
        onPress={() => playTrack(item)}
        activeOpacity={0.8}
        testID={`track-${item.id}`}
      >
        <View style={styles.trackCardImageContainer}>
          <Image 
            source={{ uri: item.artwork }} 
            style={styles.trackCardImage} 
          />
          {isPlaying && (
            <View style={styles.playingIndicator}>
              <View style={styles.playingBar} />
              <View style={[styles.playingBar, styles.playingBar2]} />
              <View style={[styles.playingBar, styles.playingBar3]} />
            </View>
          )}
          <TouchableOpacity 
            style={styles.trackCardPlayButton}
            onPress={() => playTrack(item)}
          >
            <Play size={18} color="#FFF" fill="#FFF" />
          </TouchableOpacity>
        </View>
        <View style={styles.trackCardContent}>
          <Text style={styles.trackCardTitle} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={styles.trackCardArtist} numberOfLines={1}>
            {item.artist}
          </Text>
          <View style={styles.trackCardFooter}>
            <TouchableOpacity 
              onPress={() => toggleLike(item.id)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Heart 
                size={16} 
                color={isLiked ? "#FF0080" : "#666"}
                fill={isLiked ? "#FF0080" : "transparent"}
              />
            </TouchableOpacity>
            <TouchableOpacity
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <MoreVertical size={16} color="#666" />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderGenreCard = ({ item }: { item: string }) => {
    const genreColors: Record<string, readonly [string, string]> = {
      "Pop": ["#FF6B6B", "#FF8E53"] as const,
      "Rock": ["#4ECDC4", "#44A08D"] as const,
      "Hip-Hop": ["#F7971E", "#FFD200"] as const,
      "Electronic": ["#667eea", "#764ba2"] as const,
      "Jazz": ["#f093fb", "#f5576c"] as const,
      "Classical": ["#4facfe", "#00f2fe"] as const,
      "R&B": ["#fa709a", "#fee140"] as const,
      "Country": ["#30cfd0", "#330867"] as const,
    };

    const colors = genreColors[item] || (["#667eea", "#764ba2"] as const);

    return (
      <TouchableOpacity
        style={styles.genreCard}
        onPress={() => router.push(`/genre/${item}`)}
        activeOpacity={0.8}
        testID={`genre-${item}`}
      >
        <LinearGradient
          colors={colors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.genreGradient}
        >
          <Text style={styles.genreCardText}>{item}</Text>
          <Music2 size={32} color="rgba(255,255,255,0.3)" style={styles.genreIcon} />
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  const renderArtistCard = ({ item }: { item: typeof popularArtists[0] }) => (
    <TouchableOpacity
      style={styles.artistCard}
      onPress={() => router.push(`/artist/${item.id}`)}
      activeOpacity={0.8}
      testID={`artist-${item.id}`}
    >
      <Image source={{ uri: item.image }} style={styles.artistImage} />
      <Text style={styles.artistName} numberOfLines={1}>
        {item.name}
      </Text>
      <Text style={styles.artistFollowers} numberOfLines={1}>
        {item.followers} followers
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          testID="back-button"
        >
          <ArrowLeft size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.title}>Music</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {renderHeroSection()}
        {renderQuickActions()}

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Browse Genres</Text>
            <TouchableOpacity onPress={() => router.push("/categories/genres")}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={genres.slice(0, 8)}
            renderItem={renderGenreCard}
            keyExtractor={(item) => `genre-${item}`}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
          />
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Popular Artists</Text>
            <TouchableOpacity onPress={() => router.push("/categories/artists")}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={popularArtists.slice(0, 6)}
            renderItem={renderArtistCard}
            keyExtractor={(item) => `artist-${item.id}`}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
          />
        </View>

        {renderTabs()}

        <View style={styles.tracksGrid}>
          <FlatList
            data={musicTracks}
            renderItem={renderTrackCard}
            keyExtractor={(item, index) => `track-${item.id}-${index}`}
            numColumns={2}
            scrollEnabled={false}
            columnWrapperStyle={styles.trackRow}
            contentContainerStyle={styles.tracksGridContent}
          />
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B0A14",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "700" as const,
    color: "#FFF",
    letterSpacing: 0.5,
  },
  placeholder: {
    width: 40,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  heroContainer: {
    height: HERO_HEIGHT,
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#1A1A1A",
  },
  heroImage: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  heroGradient: {
    flex: 1,
    justifyContent: "flex-end",
    padding: 20,
  },
  heroContent: {
    gap: 8,
  },
  heroTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    alignSelf: "flex-start",
    backgroundColor: "rgba(255,215,0,0.2)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,215,0,0.3)",
  },
  heroTagText: {
    fontSize: 12,
    fontWeight: "600" as const,
    color: "#FFD700",
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: "800" as const,
    color: "#FFF",
    marginTop: 4,
  },
  heroArtist: {
    fontSize: 16,
    color: "rgba(255,255,255,0.8)",
    fontWeight: "500" as const,
  },
  heroActions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  heroPlayButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#FFF",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
  },
  heroPlayText: {
    fontSize: 15,
    fontWeight: "700" as const,
    color: "#000",
  },
  heroLikeButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  quickActions: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginTop: 24,
    gap: 12,
  },
  quickActionCard: {
    flex: 1,
    alignItems: "center",
    gap: 8,
  },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
  },
  quickActionText: {
    fontSize: 12,
    fontWeight: "600" as const,
    color: "#FFF",
  },
  section: {
    marginTop: 32,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700" as const,
    color: "#FFF",
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: "#FF0080",
  },
  horizontalList: {
    paddingHorizontal: 20,
    gap: 12,
  },
  genreCard: {
    width: 140,
    height: 100,
    borderRadius: 12,
    overflow: "hidden",
  },
  genreGradient: {
    flex: 1,
    padding: 16,
    justifyContent: "space-between",
  },
  genreCardText: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: "#FFF",
  },
  genreIcon: {
    position: "absolute",
    right: -8,
    bottom: -8,
    transform: [{ rotate: "-15deg" }],
  },
  artistCard: {
    width: 120,
    alignItems: "center",
    gap: 8,
  },
  artistImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#1A1A1A",
  },
  artistName: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: "#FFF",
    textAlign: "center",
  },
  artistFollowers: {
    fontSize: 12,
    color: "#999",
    textAlign: "center",
  },
  tabsContainer: {
    marginTop: 24,
  },
  tabsContent: {
    paddingHorizontal: 20,
    gap: 8,
  },
  tab: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.05)",
  },
  tabActive: {
    backgroundColor: "rgba(255,0,128,0.15)",
    borderWidth: 1,
    borderColor: "rgba(255,0,128,0.3)",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: "#999",
  },
  tabTextActive: {
    color: "#FF0080",
  },
  tracksGrid: {
    marginTop: 20,
  },
  tracksGridContent: {
    paddingHorizontal: 20,
  },
  trackRow: {
    gap: 12,
    marginBottom: 12,
  },
  trackCard: {
    flex: 1,
    backgroundColor: "#17162A",
    borderRadius: 12,
    overflow: "hidden",
  },
  trackCardLeft: {
    marginRight: 6,
  },
  trackCardImageContainer: {
    width: "100%",
    aspectRatio: 1,
    position: "relative",
  },
  trackCardImage: {
    width: "100%",
    height: "100%",
    backgroundColor: "#1A1A1A",
  },
  playingIndicator: {
    position: "absolute",
    top: 12,
    left: 12,
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 3,
    backgroundColor: "rgba(255,0,128,0.9)",
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
  },
  playingBar: {
    width: 3,
    height: 12,
    backgroundColor: "#FFF",
    borderRadius: 2,
  },
  playingBar2: {
    height: 8,
  },
  playingBar3: {
    height: 14,
  },
  trackCardPlayButton: {
    position: "absolute",
    bottom: 12,
    right: 12,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FF0080",
    justifyContent: "center",
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#FF0080",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  trackCardContent: {
    padding: 12,
    gap: 4,
  },
  trackCardTitle: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: "#FFF",
  },
  trackCardArtist: {
    fontSize: 12,
    color: "#999",
  },
  trackCardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
});