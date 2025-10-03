import React, { useCallback, useMemo, useState, useEffect } from "react";
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
import { Play, MoreVertical, Bell, Search, ChevronRight, Settings as SettingsIcon, TrendingUp, Sparkles, Music2, Headphones, Mic2, BookOpen, Video, Radio, Clock, Flame, Star, Zap, Heart, PlayCircle } from "lucide-react-native";
import { usePlayer } from "@/contexts/PlayerContext";
import { router } from "expo-router";
import { recentlyPlayed, topCharts, newReleases, podcasts, audiobooks, genres, trendingNow, browseCategories, livePerformanceVideos, trendingVideos, popularArtists, allTracks } from "@/data/mockData";
import type { Track } from "@/types";
import type { CategoryItem } from "@/data/mockData";
import { useUser } from "@/contexts/UserContext";
import { useLibrary } from "@/contexts/LibraryContext";
import { trpc } from "@/lib/trpc";



export default function HomeScreen() {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const CARD_WIDTH = width * 0.42;
  const SMALL_CARD = width * 0.35;
  const { playTrack, currentTrack } = usePlayer();
  const { profile, isLoading } = useUser();
  const { recentlyPlayed: userRecentlyPlayed } = useLibrary();
  const [scrollY] = useState(new Animated.Value(0));
  const [personalizedSections, setPersonalizedSections] = useState<any[]>([]);
  
  const auraloraQuery = trpc.auralora.fetchAudiobooks.useQuery(
    { limit: 12 },
    { 
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
      retry: false,
    }
  );

  const voxsagaQuery = trpc.voxsaga.fetchPodcasts.useQuery(
    { limit: 12 },
    { 
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
      retry: false,
    }
  );

  useEffect(() => {
    if (auraloraQuery.error) {
      console.log('[Home] Auralora query error (using fallback):', auraloraQuery.error.message);
    }
    if (voxsagaQuery.error) {
      console.log('[Home] VoxSaga query error (using fallback):', voxsagaQuery.error.message);
    }
  }, [auraloraQuery.error, voxsagaQuery.error]);

  useEffect(() => {
    const generatePersonalizedContent = () => {
      const sections: any[] = [];
      
      if (!currentTrack) {
        sections.push(
          { type: 'trending', title: 'Trending Now', subtitle: "What's hot right now", data: trendingNow.slice(0, 8), icon: <TrendingUp size={20} color="#FF0080" /> },
          { type: 'artists', title: 'Popular Artists', subtitle: "Top artists you'll love", data: popularArtists.slice(0, 8), icon: <Mic2 size={20} color="#8B5CF6" /> },
          { type: 'new', title: 'New Releases', subtitle: 'Fresh tracks for you', data: newReleases.slice(0, 8), icon: <Music2 size={20} color="#00C6FF" />, route: '/new-releases' },
          { type: 'videos', title: 'Music Videos', subtitle: 'Watch the visuals', data: trendingVideos.slice(0, 6), icon: <Video size={20} color="#F59E0B" /> },
          { type: 'charts', title: 'Top Charts', subtitle: 'Most played this week', data: topCharts.slice(0, 8), icon: <Flame size={20} color="#EF4444" /> },
        );
        return sections;
      }

      const trackType = currentTrack.type;
      const trackGenre = currentTrack.album || '';
      const trackArtist = currentTrack.artist || '';

      if (trackType === 'song') {
        const similarSongs = allTracks.filter(t => 
          t.type === 'song' && 
          t.id !== currentTrack.id &&
          (t.artist === trackArtist || t.album === trackGenre)
        ).slice(0, 8);
        
        if (similarSongs.length > 0) {
          sections.push({
            type: 'similar',
            title: `More like ${currentTrack.title}`,
            subtitle: `Similar songs you might enjoy`,
            data: similarSongs,
            icon: <Music2 size={20} color="#FF0080" />
          });
        }

        const sameArtist = allTracks.filter(t => 
          t.type === 'song' && 
          t.artist === trackArtist && 
          t.id !== currentTrack.id
        ).slice(0, 8);
        
        if (sameArtist.length > 0) {
          sections.push({
            type: 'artist',
            title: `More from ${trackArtist}`,
            subtitle: 'Explore their discography',
            data: sameArtist,
            icon: <Mic2 size={20} color="#8B5CF6" />
          });
        }

        sections.push(
          { type: 'videos', title: 'Music Videos', subtitle: 'Watch the visuals', data: trendingVideos.slice(0, 6), icon: <Video size={20} color="#F59E0B" /> },
          { type: 'charts', title: 'Top Charts', subtitle: 'Most played this week', data: topCharts.slice(0, 8), icon: <Flame size={20} color="#EF4444" /> },
        );
      } else if (trackType === 'video' || currentTrack.isVideo) {
        const moreVideos = allTracks.filter(t => 
          (t.type === 'video' || t.isVideo) && 
          t.id !== currentTrack.id
        ).slice(0, 8);
        
        sections.push(
          { type: 'videos', title: 'More Music Videos', subtitle: 'Keep watching', data: moreVideos, icon: <Video size={20} color="#FF0080" /> },
          { type: 'live', title: 'Live Performances', subtitle: 'Experience the energy', data: livePerformanceVideos.slice(0, 6), icon: <Radio size={20} color="#F59E0B" /> },
          { type: 'trending-videos', title: 'Trending Videos', subtitle: 'Most watched', data: trendingVideos.slice(0, 8), icon: <TrendingUp size={20} color="#8B5CF6" /> },
        );

        const musicTracks = allTracks.filter(t => t.type === 'song').slice(0, 8);
        sections.push({ type: 'music', title: 'Listen to Music', subtitle: 'Switch to audio', data: musicTracks, icon: <Music2 size={20} color="#00C6FF" /> });
      } else if (trackType === 'podcast') {
        const morePodcasts = allTracks.filter(t => 
          t.type === 'podcast' && 
          t.id !== currentTrack.id
        ).slice(0, 8);
        
        sections.push(
          { type: 'podcasts', title: 'More Podcasts', subtitle: 'Continue listening', data: morePodcasts, icon: <Headphones size={20} color="#FF0080" /> },
          { type: 'trending', title: 'Trending Episodes', subtitle: 'Popular right now', data: trendingNow.filter(t => t.type === 'podcast').slice(0, 8), icon: <TrendingUp size={20} color="#F7971E" /> },
        );

        const musicTracks = allTracks.filter(t => t.type === 'song').slice(0, 8);
        sections.push({ type: 'music', title: 'Discover Music', subtitle: 'Take a break from podcasts', data: musicTracks, icon: <Music2 size={20} color="#00C6FF" /> });
      } else if (trackType === 'audiobook') {
        const moreAudiobooks = allTracks.filter(t => 
          t.type === 'audiobook' && 
          t.id !== currentTrack.id
        ).slice(0, 8);
        
        sections.push(
          { type: 'audiobooks', title: 'More Audiobooks', subtitle: 'Continue your journey', data: moreAudiobooks, icon: <BookOpen size={20} color="#FF0080" /> },
          { type: 'trending', title: 'Popular Stories', subtitle: 'Trending audiobooks', data: trendingNow.filter(t => t.type === 'audiobook').slice(0, 8), icon: <TrendingUp size={20} color="#6A85F1" /> },
        );

        const musicTracks = allTracks.filter(t => t.type === 'song').slice(0, 8);
        sections.push({ type: 'music', title: 'Listen to Music', subtitle: 'Take a music break', data: musicTracks, icon: <Music2 size={20} color="#00C6FF" /> });
      }

      if (userRecentlyPlayed.length > 0) {
        sections.push({
          type: 'recent',
          title: 'Recently Played',
          subtitle: 'Pick up where you left off',
          data: userRecentlyPlayed.slice(0, 8)
        });
      }

      return sections;
    };

    setTimeout(() => {
      setPersonalizedSections(generatePersonalizedContent());
    }, 0);
  }, [currentTrack, userRecentlyPlayed]);

  const quickAccessItems = useMemo(() => {
    const baseItems: Array<{ id: string; title: string; icon: string; gradient: readonly [string, string]; route: string }> = [
      { id: '1', title: 'Liked Songs', icon: 'heart', gradient: ['#FF0080', '#FF8C00'] as const, route: '/library-all' },
      { id: '2', title: 'Your Mix', icon: 'music', gradient: ['#667eea', '#764ba2'] as const, route: '/your-mix' },
      { id: '3', title: 'Discover', icon: 'compass', gradient: ['#11998e', '#38ef7d'] as const, route: '/browse-categories' },
    ];

    if (currentTrack) {
      if (currentTrack.type === 'song') {
        baseItems.push({ id: '4', title: 'Music Videos', icon: 'video', gradient: ['#F59E0B', '#EF4444'] as const, route: '/categories/trending-videos' });
      } else if (currentTrack.type === 'video' || currentTrack.isVideo) {
        baseItems.push({ id: '4', title: 'Live Shows', icon: 'radio', gradient: ['#8B5CF6', '#EC4899'] as const, route: '/categories/live-performance' });
      } else if (currentTrack.type === 'podcast') {
        baseItems.push({ id: '4', title: 'Podcasts', icon: 'mic', gradient: ['#F7971E', '#FFD200'] as const, route: '/categories/podcasts' });
      } else if (currentTrack.type === 'audiobook') {
        baseItems.push({ id: '4', title: 'Audiobooks', icon: 'book', gradient: ['#6A85F1', '#B892FF'] as const, route: '/categories/audiobooks' });
      }
    } else {
      baseItems.push({ id: '4', title: 'Podcasts', icon: 'mic', gradient: ['#F7971E', '#FFD200'] as const, route: '/categories/podcasts' });
    }

    return baseItems;
  }, [currentTrack]);



  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const renderHeader = useCallback(() => (
    <Animated.View style={[styles.header, { paddingTop: 12 + insets.top, backgroundColor: headerOpacity.interpolate({
      inputRange: [0, 1],
      outputRange: ['rgba(11, 10, 20, 0)', 'rgba(11, 10, 20, 0.98)']
    }) }]}> 
      <View style={styles.headerLeft}>
        {profile && (
          <View style={styles.avatarContainer}>
            <SafeImage
              uri={profile.avatarUrl}
              style={styles.avatar}
            />
            <View style={styles.avatarBadge}>
              <View style={styles.avatarBadgeDot} />
            </View>
          </View>
        )}
        <View>
          <Text style={styles.subtleText}>{profile ? "Welcome back" : "Welcome"}</Text>
          <Text style={styles.headerName} numberOfLines={1}>{profile ? (profile.displayName || profile.email) : "Guest"}</Text>
        </View>
      </View>
      <View style={styles.headerRight}>
        <TouchableOpacity testID="search-button" accessibilityRole="button" onPress={() => router.push('/search')} style={styles.headerIcon}> 
          <Search color="#FFF" size={20} />
        </TouchableOpacity>
        {profile ? (
          <>
            <TouchableOpacity testID="bell-button" accessibilityRole="button" onPress={() => router.push('/notifications')} style={styles.headerIcon}> 
              <Bell color="#FFF" size={20} />
            </TouchableOpacity>
            <TouchableOpacity testID="settings-button" accessibilityRole="button" accessibilityLabel="Open settings" onPress={() => router.push('/settings')} style={styles.headerIcon}> 
              <SettingsIcon color="#FFF" size={20} />
            </TouchableOpacity>
          </>
        ) : null}
      </View>
    </Animated.View>
  ), [insets.top, profile, headerOpacity]);

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
          case "Music Videos":
            router.push("/music-videos");
            break;
          case "Top Charts":
            router.push("/top-charts");
            break;
          case "Recently Played":
            router.push("/history");
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



  const renderQuickAccess = useCallback(() => (
    <View style={styles.quickAccessContainer}>
      {quickAccessItems.map((item, index) => (
        <TouchableOpacity
          key={item.id}
          style={styles.quickAccessItem}
          onPress={() => router.push(item.route as any)}
          activeOpacity={0.85}
        >
          <LinearGradient
            colors={item.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.quickAccessGradient}
          >
            <View style={styles.quickAccessContent}>
              <Text style={styles.quickAccessTitle} numberOfLines={1}>{item.title}</Text>
              <View style={styles.quickAccessIcon}>
                <PlayCircle size={18} color="rgba(255,255,255,0.9)" />
              </View>
            </View>
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
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.8)']}
          style={styles.cardGradientOverlay}
        />
        <View style={styles.cardPlayOverlay}>
          <View style={styles.cardPlayButton}>
            <Play size={22} color="#000" fill="#FFF" />
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
          colors={['transparent', 'rgba(0,0,0,0.7)']}
          style={styles.artistGradient}
        />
        {item.verified && (
          <View style={styles.verifiedBadge}>
            <Star size={14} color="#FFD700" fill="#FFD700" />
          </View>
        )}
      </View>
      <Text style={styles.artistName} numberOfLines={1}>{item.name}</Text>
      <View style={styles.artistFollowersContainer}>
        <Heart size={12} color="#FF0080" />
        <Text style={styles.artistFollowers} numberOfLines={1}>{item.followers}</Text>
      </View>
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
      <LinearGradient
        colors={['#1A0B2E', '#16213E', '#0B0A14']}
        locations={[0, 0.3, 1]}
        style={styles.backgroundGradient}
      />
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
        {!profile && (
          <TouchableOpacity 
            style={styles.guestBanner}
            onPress={() => router.push('/auth')}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={['rgba(255, 0, 128, 0.15)', 'rgba(139, 92, 246, 0.15)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.guestBannerGradient}
            >
              <View style={styles.guestBannerIconContainer}>
                <Sparkles size={24} color="#FF0080" />
              </View>
              <View style={styles.guestBannerContent}>
                <Text style={styles.guestText}>You&apos;re listening as a guest</Text>
                <Text style={styles.guestSubtext}>Sign up to unlock unlimited music & features</Text>
              </View>
              <View style={styles.guestBtnContainer}>
                <LinearGradient
                  colors={['#FF0080', '#8B5CF6']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.guestBtnGradient}
                >
                  <Text style={styles.guestBtnText}>Sign Up</Text>
                  <Zap size={16} color="#FFF" fill="#FFF" />
                </LinearGradient>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        )}

        {renderQuickAccess()}

        {currentTrack && (
          <TouchableOpacity 
            style={styles.nowPlayingBanner}
            onPress={() => router.push('/player')}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={['rgba(255, 0, 128, 0.25)', 'rgba(139, 92, 246, 0.25)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.nowPlayingGradient}
            >
              <View style={styles.nowPlayingArtwork}>
                <SafeImage uri={currentTrack.artwork} style={styles.nowPlayingArtworkImage} />
                <View style={styles.nowPlayingPulse}>
                  <Flame size={16} color="#FF0080" />
                </View>
              </View>
              <View style={styles.nowPlayingContent}>
                <View style={styles.nowPlayingLabelContainer}>
                  <View style={styles.nowPlayingDot} />
                  <Text style={styles.nowPlayingLabel}>NOW PLAYING</Text>
                </View>
                <Text style={styles.nowPlayingTitle} numberOfLines={1}>{currentTrack.title}</Text>
                <Text style={styles.nowPlayingArtist} numberOfLines={1}>{currentTrack.artist}</Text>
              </View>
              <View style={styles.nowPlayingAction}>
                <ChevronRight size={20} color="#FF0080" />
              </View>
            </LinearGradient>
          </TouchableOpacity>
        )}

        {personalizedSections.map((section, index) => (
          <View key={`section-${section.type}-${index}`} style={styles.section}>
            {renderSectionHeader(section.title, section.subtitle, `section-${index}`, section.route, section.icon)}
            <FlatList
              data={section.data}
              renderItem={section.type === 'artists' ? renderArtist as any : (section.type === 'videos' || section.type === 'live' || section.type === 'trending-videos') ? renderVideoCard : renderSmartCard}
              keyExtractor={(item: any, idx: number) => `${section.type}-${item.id || idx}-${index}`}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalList}
            />
          </View>
        ))}

        <View style={styles.section}>
          {renderSectionHeader("Auralora", "Discover amazing audiobooks from Auralora.com", "auralora-audiobooks", "/categories/audiobooks", <BookOpen size={20} color="#6A85F1" />)}
          {auraloraQuery.isLoading ? (
            <View style={[styles.horizontalList, { paddingVertical: 20 }]}>
              <Text style={{ color: '#999', fontSize: 14 }}>Loading audiobooks from Auralora...</Text>
            </View>
          ) : auraloraQuery.error ? (
            <FlatList
              data={audiobooks.slice(0, 8)}
              renderItem={renderSmartCard}
              keyExtractor={(item, idx) => `audiobook-fallback-${item.id || idx}`}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalList}
            />
          ) : (
            <FlatList
              data={auraloraQuery.data?.audiobooks.slice(0, 8) || audiobooks.slice(0, 8)}
              renderItem={renderSmartCard}
              keyExtractor={(item, idx) => `audiobook-${item.id || idx}`}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalList}
            />
          )}
        </View>

        <View style={styles.section}>
          {renderSectionHeader("VoxSaga", "Discover amazing podcasts from Voxsaga.com", "voxsaga-podcasts", "/categories/podcasts", <Headphones size={20} color="#F7971E" />)}
          {voxsagaQuery.isLoading ? (
            <View style={[styles.horizontalList, { paddingVertical: 20 }]}>
              <Text style={{ color: '#999', fontSize: 14 }}>Loading podcasts from VoxSaga...</Text>
            </View>
          ) : voxsagaQuery.error ? (
            <FlatList
              data={podcasts.slice(0, 8)}
              renderItem={renderSmartCard}
              keyExtractor={(item, idx) => `podcast-fallback-${item.id || idx}`}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalList}
            />
          ) : (
            <FlatList
              data={voxsagaQuery.data?.podcasts.slice(0, 8) || podcasts.slice(0, 8)}
              renderItem={renderSmartCard}
              keyExtractor={(item, idx) => `podcast-${item.id || idx}`}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalList}
            />
          )}
        </View>

        <View style={styles.section}>
          {renderSectionHeader("Browse All", "Explore by category", "browse-categories", "/browse-categories")}
          <FlatList
            data={browseCategories.slice(0, 6)}
            renderItem={renderCategory}
            keyExtractor={(item, idx) => `category-${item.id || idx}`}
            numColumns={2}
            columnWrapperStyle={styles.categoryRow}
            scrollEnabled={false}
            contentContainerStyle={styles.categoriesContainer}
          />
        </View>

        <View style={styles.section}>
          {renderSectionHeader("Genres", "Find your sound", "genres", "/categories/genres")}
          <FlatList
            data={genres.slice(0, 12)}
            renderItem={renderGenre}
            keyExtractor={(item, idx) => `genre-${item}-${idx}`}
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
            keyExtractor={(item, idx) => `recent-${item.id || idx}`}
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
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 400,
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
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 0, 128, 0.3)',
  },
  guestBannerContent: {
    flex: 1,
    minWidth: 0,
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
  guestBtnContainer: {
    borderRadius: 24,
    overflow: 'hidden',
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
  nowPlayingBanner: {
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    borderRadius: 16,
    overflow: 'hidden',
  },
  nowPlayingGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
  },
  nowPlayingContent: {
    flex: 1,
  },
  nowPlayingLabel: {
    fontSize: 11,
    color: '#999',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  nowPlayingTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFF',
    marginTop: 4,
  },
  nowPlayingArtist: {
    fontSize: 13,
    color: '#CCC',
    marginTop: 2,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatarBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#0B0A14',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarBadgeDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#00FF88',
  },
  quickAccessContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  quickAccessIcon: {
    opacity: 0.8,
  },
  cardGradientOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '40%',
    borderBottomLeftRadius: 14,
    borderBottomRightRadius: 14,
  },
  verifiedBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  artistFollowersContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    marginTop: 4,
  },
  guestBannerGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  guestBannerIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 0, 128, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  guestBtnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 24,
    gap: 6,
  },
  nowPlayingArtwork: {
    position: 'relative',
    width: 56,
    height: 56,
  },
  nowPlayingArtworkImage: {
    width: 56,
    height: 56,
    borderRadius: 12,
  },
  nowPlayingPulse: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 0, 128, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nowPlayingLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  nowPlayingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FF0080',
  },
  nowPlayingAction: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});