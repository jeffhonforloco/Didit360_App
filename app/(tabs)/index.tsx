import React, { useCallback, useMemo, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  useWindowDimensions,
  Animated,
} from "react-native";
import SafeImage from "@/components/SafeImage";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Play, MoreVertical, Bell, Search, ChevronRight, Settings as SettingsIcon, TrendingUp, Sparkles, Music2, Headphones, Mic2, BookOpen, Heart, Compass, Music, Mic } from "lucide-react-native";
import { usePlayer } from "@/contexts/PlayerContext";
import { router } from "expo-router";
import { featuredContent, recentlyPlayed, topCharts, newReleases, podcasts, audiobooks, genres, trendingNow, browseCategories, livePerformanceVideos, trendingVideos, popularArtists } from "@/data/mockData";
import type { Track } from "@/types";
import type { CategoryItem } from "@/data/mockData";
import { useUser } from "@/contexts/UserContext";



function getTimeGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export default function HomeScreen() {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const CARD_WIDTH = width * 0.42;
  const SMALL_CARD = width * 0.35;
  const { playTrack } = usePlayer();
  const { profile, isLoading } = useUser();
  const [scrollY] = useState(new Animated.Value(0));
  const [headerBgColor] = useState(new Animated.Value(0));

  const quickAccessItems = useMemo(() => [
    { id: '1', title: 'Liked Songs', icon: 'heart', gradient: ['#FF0080', '#FF8C00'] as const, route: '/library-all' },
    { id: '2', title: 'Your Mix', icon: 'music', gradient: ['#667eea', '#764ba2'] as const, route: '/categories/top-mix' },
    { id: '3', title: 'Discover', icon: 'compass', gradient: ['#11998e', '#38ef7d'] as const, route: '/browse-categories' },
    { id: '4', title: 'Podcasts', icon: 'mic', gradient: ['#F7971E', '#FFD200'] as const, route: '/categories/podcasts' },
  ], []);



  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 150],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const headerScale = scrollY.interpolate({
    inputRange: [0, 150],
    outputRange: [1, 0.95],
    extrapolate: 'clamp',
  });

  const renderHeader = useCallback(() => (
    <Animated.View style={[styles.header, { 
      paddingTop: 12 + insets.top, 
      backgroundColor: headerOpacity.interpolate({
        inputRange: [0, 1],
        outputRange: ['rgba(11, 10, 20, 0)', 'rgba(11, 10, 20, 0.98)']
      }),
      transform: [{ scale: headerScale }]
    }]}> 
      <View style={styles.headerLeft}>
        {profile && (
          <SafeImage
            uri={profile.avatarUrl}
            style={styles.avatar}
          />
        )}
        <View>
          <Text style={styles.subtleText}>{profile ? "Welcome back" : "Welcome"} 👋</Text>
          <Text style={styles.headerName} numberOfLines={1}>{profile ? (profile.displayName || profile.email) : "Guest"}</Text>
        </View>
      </View>
      <View style={styles.headerRight}>
        <TouchableOpacity testID="search-button" accessibilityRole="button" onPress={() => router.push('/search')} style={styles.headerIcon}> 
          <Search color="#FFF" size={22} />
        </TouchableOpacity>
        {profile ? (
          <>
            <TouchableOpacity testID="bell-button" accessibilityRole="button" onPress={() => router.push('/notifications')} style={styles.headerIcon}> 
              <Bell color="#FFF" size={22} />
            </TouchableOpacity>
            <TouchableOpacity testID="settings-button" accessibilityRole="button" accessibilityLabel="Open settings" onPress={() => router.push('/settings')} style={styles.headerIcon}> 
              <SettingsIcon color="#FFF" size={22} />
            </TouchableOpacity>
          </>
        ) : null}
      </View>
    </Animated.View>
  ), [insets.top, profile, headerOpacity, headerScale]);

  const renderSectionHeader = useCallback((title: string, subtitle: string, testID: string, route?: string, icon?: React.ReactNode) => {
    const handleSeeAll = () => {
      if (route) {
        router.push(route as any);
      } else {
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
        <View style={styles.sectionHeaderLeft}>
          {icon && <View style={styles.sectionIcon}><Text>{icon}</Text></View>}
          <View>
            <Text style={styles.sectionTitle}>{title}</Text>
            {subtitle && <Text style={styles.sectionSubtitle}>{subtitle}</Text>}
          </View>
        </View>
        <TouchableOpacity 
          style={styles.seeAll} 
          onPress={handleSeeAll}
          testID={`${testID}-see-all`}
        >
          <Text style={styles.seeAllText}>See All</Text>
          <ChevronRight color="#FF0080" size={18} />
        </TouchableOpacity>
      </View>
    );
  }, []);

  const renderHeroItem = useCallback(({ item, index }: { item: Track; index: number }) => (
    <TouchableOpacity
      style={[styles.heroCard, { width: width - 32 }]}
      onPress={() => playTrack(item)}
      activeOpacity={0.9}
      testID={`hero-${item.id}`}
    >
      <SafeImage uri={item.artwork} style={styles.heroImage} />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.4)', 'rgba(0,0,0,0.9)']}
        style={styles.heroGradient}
      >
        <View style={styles.heroContent}>
          <View style={styles.heroTag}>
            <Sparkles size={14} color="#FFD700" />
            <Text style={styles.heroTagText}>Featured</Text>
          </View>
          <Text style={styles.heroTitle} numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={styles.heroArtist} numberOfLines={1}>
            {item.artist}
          </Text>
          <TouchableOpacity style={styles.heroPlayButton} onPress={() => playTrack(item)} testID={`hero-play-${item.id}`}>
            <Play size={24} color="#000" fill="#FFF" />
            <Text style={styles.heroPlayText}>Play Now</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  ), [playTrack, width]);

  const renderQuickAccess = useCallback(() => (
    <View style={styles.quickAccessContainer}>
      {quickAccessItems.map((item, index) => (
        <TouchableOpacity
          key={item.id}
          style={styles.quickAccessItem}
          onPress={() => router.push(item.route as any)}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={item.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.quickAccessGradient}
          >
            <Text style={styles.quickAccessTitle} numberOfLines={1}>{item.title}</Text>
          </LinearGradient>
        </TouchableOpacity>
      ))}
    </View>
  ), [quickAccessItems]);

  const renderCard = useCallback(({ item }: { item: Track }) => (
    <TouchableOpacity
      style={[styles.card, { width: CARD_WIDTH }]}
      onPress={() => playTrack(item)}
      activeOpacity={0.85}
      testID={`card-${item.id}`}
    >
      <View style={styles.cardImageContainer}>
        <SafeImage 
          uri={item.artwork} 
          style={[styles.cardImage, { width: CARD_WIDTH, height: CARD_WIDTH }]} 
        />
        <View style={styles.cardPlayOverlay}>
          <View style={styles.cardPlayButton}>
            <Play size={20} color="#000" fill="#FFF" />
          </View>
        </View>
      </View>
      <Text style={styles.cardTitle} numberOfLines={2}>
        {item.title}
      </Text>
      <Text style={styles.cardArtist} numberOfLines={1}>
        {item.artist}
      </Text>
    </TouchableOpacity>
  ), [CARD_WIDTH, playTrack]);

  const renderSmartCard = useCallback(({ item }: { item: Track }) => {
    const handlePress = () => {
      console.log(`Playing ${item.type}: ${item.title}`);
      if (item.type === 'video' || item.isVideo) {
        console.log(`Opening video player for: ${item.title}`);
        playTrack(item);
        // Video will automatically navigate to player via PlayerContext
      } else if (item.type === 'podcast') {
        router.push(`/podcast-player?id=${item.id}`);
      } else if (item.type === 'audiobook') {
        router.push(`/audiobook/${item.id}`);
      } else {
        playTrack(item);
      }
    };

    return (
      <TouchableOpacity
        style={[styles.card, { width: CARD_WIDTH }]}
        onPress={handlePress}
        activeOpacity={0.8}
        testID={`smart-card-${item.id}`}
      >
        <SafeImage 
          uri={item.artwork} 
          style={[styles.cardImage, { width: CARD_WIDTH, height: CARD_WIDTH }]} 
        />
        {(item.type === 'video' || item.isVideo) && (
          <View style={styles.videoIndicator}>
            <Play size={16} color="#FFF" fill="#FFF" />
          </View>
        )}
        <Text style={styles.cardTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.cardArtist} numberOfLines={1}>
          {item.artist}
        </Text>
      </TouchableOpacity>
    );
  }, [CARD_WIDTH, playTrack]);

  const renderVideoCard = useCallback(({ item }: { item: Track }) => (
    <TouchableOpacity
      style={[styles.card, { width: CARD_WIDTH }]}
      onPress={() => {
        console.log(`Opening video: ${item.title}`);
        playTrack(item);
        // Video will automatically navigate to player via PlayerContext
      }}
      activeOpacity={0.8}
      testID={`video-card-${item.id}`}
    >
      <SafeImage 
        uri={item.artwork} 
        style={[styles.cardImage, { width: CARD_WIDTH, height: CARD_WIDTH }]} 
      />
      <View style={styles.videoIndicator}>
        <Play size={16} color="#FFF" fill="#FFF" />
      </View>
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
      <SafeImage 
        uri={item.artwork} 
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
      <SafeImage uri={item.artwork} style={styles.recentImage} />
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

  const renderArtist = useCallback(({ item }: { item: typeof popularArtists[0] }) => (
    <TouchableOpacity 
      style={styles.artistCard} 
      onPress={() => router.push(`/artist/${item.id}` as any)} 
      activeOpacity={0.85} 
      testID={`artist-${item.id}`}
    >
      <View style={styles.artistImageContainer}>
        <SafeImage uri={item.image} style={styles.artistImage} />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.6)']}
          style={styles.artistGradient}
        />
      </View>
      <Text style={styles.artistName} numberOfLines={1}>{item.name}</Text>
      <Text style={styles.artistFollowers} numberOfLines={1}>{item.followers} followers</Text>
    </TouchableOpacity>
  ), []);

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
            <SafeImage 
              uri={item.image} 
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
    <TouchableOpacity 
      style={styles.genrePill} 
      onPress={() => router.push(`/genre/${encodeURIComponent(item)}` as any)} 
      testID={`genre-${item}`}
    >
      <Text style={styles.genreText}>{item}</Text>
    </TouchableOpacity>
  ), []);

  console.log('[HomeScreen] Rendering - profile:', !!profile, 'isLoading:', isLoading, 'width:', width);

  // Add error boundary for the home screen
  if (width === 0) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: '#FFF', fontSize: 16 }}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.outerContainer}>
      <View style={styles.container}>
        {renderHeader()}
        <Animated.ScrollView 
        showsVerticalScrollIndicator={false} 
        testID="home-scroll"
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        <View style={[styles.topSection, { paddingTop: insets.top }]}>
          <LinearGradient
            colors={['#FF0080', '#7928CA', '#1A0B2E']}
            locations={[0, 0.5, 1]}
            style={styles.topGradient}
          />
          <View style={styles.topContent}>
            <View style={styles.greetingSection}>
              <Text style={styles.timeGreeting}>{getTimeGreeting()}</Text>
              <Text style={styles.userName}>{profile ? (profile.displayName || profile.email.split('@')[0]) : "Guest"}</Text>
            </View>
            
            {!profile && (
              <View style={styles.guestBannerTop}>
                <Sparkles size={18} color="#FFD700" />
                <View style={styles.guestBannerContent}>
                  <Text style={styles.guestTextTop}>Unlock unlimited music</Text>
                </View>
                <TouchableOpacity style={styles.guestBtnTop} onPress={() => router.push('/auth')}>
                  <Text style={styles.guestBtnTextTop}>Sign Up</Text>
                </TouchableOpacity>
              </View>
            )}

            <View style={styles.quickAccessTop}>
              {quickAccessItems.slice(0, 4).map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.quickAccessItemTop}
                  onPress={() => router.push(item.route as any)}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={['rgba(255, 255, 255, 0.25)', 'rgba(255, 255, 255, 0.1)']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.quickAccessGradientTop}
                  >
                    <Text style={styles.quickAccessTitleTop} numberOfLines={1}>{item.title}</Text>
                  </LinearGradient>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.heroSection}>
          <FlatList
            data={featuredContent.slice(0, 5)}
            renderItem={renderHeroItem}
            keyExtractor={(item) => `hero-${item.id}`}
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToInterval={width - 32 + 16}
            decelerationRate="fast"
            contentContainerStyle={styles.heroList}
            pagingEnabled={false}
          />
        </View>

        <View style={styles.section}>
          {renderSectionHeader("Trending Now", "What&apos;s hot right now", "trending-now", "/trending-now", <TrendingUp size={20} color="#FF0080" />)}
          <FlatList
            data={trendingNow.slice(0, 8)}
            renderItem={renderSmartCard}
            keyExtractor={(item) => `trending-${item.id}`}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
          />
        </View>

        <View style={styles.section}>
          {renderSectionHeader("Popular Artists", "Top artists you&apos;ll love", "popular-artists", "/popular-artists", <Mic2 size={20} color="#8B5CF6" />)}
          <FlatList
            data={popularArtists.slice(0, 8)}
            renderItem={renderArtist}
            keyExtractor={(item) => `artist-${item.id}`}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
          />
        </View>

        <View style={styles.section}>
          {renderSectionHeader("Browse All", "Explore by category", "browse-categories", "/browse-categories")}
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
          {renderSectionHeader("New Releases", "Fresh tracks for you", "new-releases", "/categories/recently-added", <Music2 size={20} color="#00C6FF" />)}
          <FlatList
            data={newReleases.slice(0, 8)}
            renderItem={renderCard}
            keyExtractor={(item) => `new-${item.id}`}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
          />
        </View>

        <View style={styles.section}>
          {renderSectionHeader("Top Charts", "Most played this week", "top-charts", "/categories/top-mix")}
          <FlatList
            data={topCharts.slice(0, 8)}
            renderItem={renderCard}
            keyExtractor={(item) => `chart-${item.id}`}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
          />
        </View>

        <View style={styles.section}>
          {renderSectionHeader("Live Performances", "Experience the energy", "live-performance", "/categories/live-performance")}
          <FlatList
            data={livePerformanceVideos.slice(0, 6)}
            renderItem={renderVideoCard}
            keyExtractor={(item) => `live-${item.id}`}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
          />
        </View>

        <View style={styles.section}>
          {renderSectionHeader("Trending Videos", "Most watched music videos", "trending-videos", "/categories/trending-videos")}
          <FlatList
            data={trendingVideos.slice(0, 8)}
            renderItem={renderVideoCard}
            keyExtractor={(item) => `trending-video-${item.id}`}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
          />
        </View>

        <View style={styles.section}>
          {renderSectionHeader("Podcasts", "Listen to your favorite shows", "podcasts", "/categories/podcasts", <Headphones size={20} color="#F7971E" />)}
          <FlatList
            data={podcasts.slice(0, 8)}
            renderItem={renderCard}
            keyExtractor={(item) => `pod-${item.id}`}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
          />
        </View>

        <View style={styles.section}>
          {renderSectionHeader("Audiobooks", "Immerse in great stories", "audiobooks", "/categories/audiobooks", <BookOpen size={20} color="#6A85F1" />)}
          <FlatList
            data={audiobooks.slice(0, 8)}
            renderItem={renderCard}
            keyExtractor={(item) => `ab-${item.id}`}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
          />
        </View>

        <View style={styles.section}>
          {renderSectionHeader("Genres", "Find your sound", "genres", "/categories/genres")}
          <FlatList
            data={genres.slice(0, 12)}
            renderItem={renderGenre}
            keyExtractor={(item) => `genre-${item}`}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={[styles.horizontalList, styles.genreList]}
          />
        </View>

        <View style={[styles.section, { marginBottom: 120 }]}> 
          {renderSectionHeader("Recently Played", "Pick up where you left off", "recent")}
          <FlatList
            data={recentlyPlayed.slice(0, 8)}
            renderItem={renderCard}
            keyExtractor={(item) => `recent-${item.id}`}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
          />
        </View>
      </Animated.ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: "#0B0A14",
  },
  container: {
    flex: 1,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    paddingHorizontal: 20,
    paddingBottom: 12,
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
    gap: 12,
  },
  headerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: '#FF0080',
  },
  subtleText: {
    fontSize: 12,
    color: "#B3B3B3",
    marginBottom: 2,
  },
  headerName: {
    fontSize: 20,
    fontWeight: "800",
    color: "#FFFFFF",
    maxWidth: 200,
  },
  topSection: {
    paddingTop: 80,
    paddingBottom: 24,
    position: 'relative',
  },
  topGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  topContent: {
    paddingHorizontal: 20,
    gap: 20,
  },
  greetingSection: {
    marginTop: 12,
  },
  timeGreeting: {
    fontSize: 16,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 4,
  },
  userName: {
    fontSize: 32,
    fontWeight: '900',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  guestBannerTop: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  guestTextTop: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '700',
  },
  guestBtnTop: {
    backgroundColor: '#FFF',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 24,
  },
  guestBtnTextTop: {
    color: '#000',
    fontWeight: '800',
    fontSize: 13,
  },
  quickAccessTop: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickAccessItemTop: {
    flex: 1,
    minWidth: '47%',
    height: 56,
    borderRadius: 12,
    overflow: 'hidden',
  },
  quickAccessGradientTop: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
  },
  quickAccessTitleTop: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '800',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  heroSection: {
    marginTop: 24,
    marginBottom: 8,
  },
  heroList: {
    paddingHorizontal: 16,
    gap: 16,
  },
  heroCard: {
    height: 280,
    borderRadius: 20,
    overflow: 'hidden',
    marginRight: 16,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '70%',
    justifyContent: 'flex-end',
    padding: 20,
  },
  heroContent: {
    gap: 8,
  },
  heroTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  heroTagText: {
    color: '#FFD700',
    fontSize: 12,
    fontWeight: '700',
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FFF',
    marginTop: 4,
  },
  heroArtist: {
    fontSize: 16,
    color: '#E0E0E0',
    fontWeight: '600',
  },
  heroPlayButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFF',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 30,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  heroPlayText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '800',
  },
  quickAccessContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 12,
    marginTop: 20,
    marginBottom: 8,
  },
  quickAccessItem: {
    flex: 1,
    minWidth: '47%',
    height: 60,
    borderRadius: 12,
    overflow: 'hidden',
  },
  quickAccessGradient: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  quickAccessTitle: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '700',
  },
  logoImage: {
    width: 40,
    height: 40,
    borderRadius: 8,
    marginBottom: 8,
  },
  section: {
    marginTop: 32,
  },
  sectionHeader: {
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  sectionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  sectionIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#FFF",
  },
  sectionSubtitle: {
    fontSize: 13,
    color: '#999',
    marginTop: 2,
  },
  seeAll: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  seeAllText: {
    fontSize: 14,
    color: "#FF0080",
    fontWeight: '700',
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
  cardImageContainer: {
    position: 'relative',
    marginBottom: 10,
  },
  cardImage: {
    borderRadius: 14,
  },
  cardPlayOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0,
  },
  cardPlayButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FFF",
    marginBottom: 4,
  },
  cardArtist: {
    fontSize: 13,
    color: "#999",
    fontWeight: '500',
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
    width: 150,
    marginRight: 16,
  },
  artistImageContainer: {
    position: 'relative',
    marginBottom: 10,
  },
  artistImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  artistGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
    borderBottomLeftRadius: 75,
    borderBottomRightRadius: 75,
  },
  artistName: {
    color: "#FFF",
    fontSize: 15,
    fontWeight: "700",
    textAlign: 'center',
  },
  artistFollowers: {
    color: '#999',
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 2,
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
    height: 120,
  },
  categoryGradient: {
    flex: 1,
    borderRadius: 18,
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
    fontSize: 17,
    fontWeight: "800",
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
    backgroundColor: "#1A1A2E",
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 24,
    marginRight: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  genreText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
  guestBanner: {
    marginHorizontal: 16,
    marginTop: 80,
    marginBottom: 8,
    backgroundColor: 'rgba(255, 0, 128, 0.1)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 0, 128, 0.3)',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  guestBannerContent: {
    flex: 1,
  },
  guestText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '700',
  },
  guestSubtext: {
    color: '#CCC',
    fontSize: 12,
    marginTop: 2,
  },
  guestBtn: {
    backgroundColor: '#FF0080',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 24,
  },
  guestBtnText: {
    color: '#FFF',
    fontWeight: '800',
    fontSize: 14,
  },
  videoIndicator: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },

});