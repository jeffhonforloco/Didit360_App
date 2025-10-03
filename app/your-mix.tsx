import React, { useState, useCallback, useMemo } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  ScrollView,
} from "react-native";
import { Stack, router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Play,
  Heart,
  MoreVertical,
  Shuffle,
  Clock,
  Music2,
  TrendingUp,
  Sparkles,
  User,
  ArrowLeft,
  Lock,
  Crown,
} from "lucide-react-native";
import SafeImage from "@/components/SafeImage";
import { usePlayer } from "@/contexts/PlayerContext";
import { useLibrary } from "@/contexts/LibraryContext";
import { useUser } from "@/contexts/UserContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import type { Track } from "@/types";
import { allTracks, popularArtists } from "@/data/mockData";

export default function YourMixScreen() {
  const insets = useSafeAreaInsets();
  const { playTrack, currentTrack } = usePlayer();
  const { favorites, isFavorite, toggleFavorite, recentlyPlayed } = useLibrary();
  const { tier, canAccessFeature } = useSubscription();
  const { profile } = useUser();
  const [selectedFilter, setSelectedFilter] = useState<"all" | "recent" | "favorites">("all");

  const isPremium = tier === "premium" || tier === "pro";
  const canAccessYourMix = profile && canAccessFeature("personalization");

  const yourMixTracks = useMemo(() => {
    if (!isPremium) {
      return allTracks.filter(t => t.type === "song").slice(0, 20);
    }

    const recentArtists = recentlyPlayed
      .filter(t => t.type === "song")
      .map(t => t.artist)
      .slice(0, 5);

    const recentGenres = recentlyPlayed
      .filter(t => t.type === "song" && t.album)
      .map(t => t.album)
      .slice(0, 3);

    const personalizedTracks = allTracks.filter(track => {
      if (track.type !== "song") return false;
      
      const matchesArtist = recentArtists.includes(track.artist);
      const matchesGenre = track.album && recentGenres.includes(track.album);
      const isFav = favorites.some(f => f.id === track.id);
      
      return matchesArtist || matchesGenre || isFav;
    });

    const uniqueTracks = Array.from(
      new Map(personalizedTracks.map(t => [t.id, t])).values()
    );

    if (uniqueTracks.length < 20) {
      const additionalTracks = allTracks
        .filter(t => t.type === "song" && !uniqueTracks.some(ut => ut.id === t.id))
        .slice(0, 20 - uniqueTracks.length);
      return [...uniqueTracks, ...additionalTracks];
    }

    return uniqueTracks.slice(0, 50);
  }, [recentlyPlayed, favorites, isPremium]);

  const filteredTracks = useMemo(() => {
    switch (selectedFilter) {
      case "recent":
        return yourMixTracks.filter(track =>
          recentlyPlayed.some(r => r.id === track.id)
        );
      case "favorites":
        return yourMixTracks.filter(track => isFavorite(track.id));
      default:
        return yourMixTracks;
    }
  }, [selectedFilter, yourMixTracks, recentlyPlayed, isFavorite]);

  const mixStats = useMemo(() => {
    const totalDuration = filteredTracks.reduce((sum, track) => sum + track.duration, 0);
    const hours = Math.floor(totalDuration / 3600);
    const minutes = Math.floor((totalDuration % 3600) / 60);
    
    const uniqueArtists = new Set(filteredTracks.map(t => t.artist)).size;
    
    return {
      trackCount: filteredTracks.length,
      duration: hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`,
      artists: uniqueArtists,
    };
  }, [filteredTracks]);

  const topArtistsInMix = useMemo(() => {
    const artistCounts = filteredTracks.reduce((acc, track) => {
      acc[track.artist] = (acc[track.artist] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const sortedArtists = Object.entries(artistCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 6);

    return sortedArtists.map(([artistName, count]) => {
      const artistData = popularArtists.find(a => a.name === artistName);
      return {
        name: artistName,
        trackCount: count,
        image: artistData?.image || "https://via.placeholder.com/150",
        id: artistData?.id || artistName,
      };
    });
  }, [filteredTracks]);

  const handlePlayAll = useCallback(() => {
    if (filteredTracks.length > 0) {
      playTrack(filteredTracks[0]);
    }
  }, [filteredTracks, playTrack]);

  const handleShuffle = useCallback(() => {
    if (filteredTracks.length > 0) {
      const randomIndex = Math.floor(Math.random() * filteredTracks.length);
      playTrack(filteredTracks[randomIndex]);
    }
  }, [filteredTracks, playTrack]);

  const renderHeader = useCallback(() => (
    <View style={styles.headerContainer}>
      <LinearGradient
        colors={["#667eea", "#764ba2", "#0B0A14"]}
        locations={[0, 0.5, 1]}
        style={styles.headerGradient}
      >
        <View style={styles.headerContent}>
          <View style={styles.headerTop}>
            <View style={styles.headerTitleContainer}>
              <Sparkles size={28} color="#FFD700" />
              <Text style={styles.headerTitle}>Your Mix</Text>
            </View>
            {!isPremium && (
              <TouchableOpacity
                style={styles.upgradeButton}
                onPress={() => router.push("/subscription")}
              >
                <Text style={styles.upgradeButtonText}>Upgrade</Text>
              </TouchableOpacity>
            )}
          </View>

          <Text style={styles.headerSubtitle}>
            {isPremium
              ? "Personalized just for you based on your listening habits"
              : "Discover great music • Upgrade for personalized mixes"}
          </Text>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Music2 size={16} color="#CCC" />
              <Text style={styles.statText}>{mixStats.trackCount} songs</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Clock size={16} color="#CCC" />
              <Text style={styles.statText}>{mixStats.duration}</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <User size={16} color="#CCC" />
              <Text style={styles.statText}>{mixStats.artists} artists</Text>
            </View>
          </View>

          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.playButton}
              onPress={handlePlayAll}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={["#FF0080", "#8B5CF6"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.playButtonGradient}
              >
                <Play size={24} color="#FFF" fill="#FFF" />
                <Text style={styles.playButtonText}>Play All</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.shuffleButton}
              onPress={handleShuffle}
              activeOpacity={0.8}
            >
              <Shuffle size={20} color="#FFF" />
              <Text style={styles.shuffleButtonText}>Shuffle</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.filterContainer}>
            {(["all", "recent", "favorites"] as const).map((filter) => (
              <TouchableOpacity
                key={filter}
                style={[
                  styles.filterChip,
                  selectedFilter === filter && styles.filterChipActive,
                ]}
                onPress={() => setSelectedFilter(filter)}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    selectedFilter === filter && styles.filterChipTextActive,
                  ]}
                >
                  {filter === "all" ? "All" : filter === "recent" ? "Recent" : "Favorites"}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </LinearGradient>

      {topArtistsInMix.length > 0 && (
        <View style={styles.topArtistsSection}>
          <View style={styles.sectionHeader}>
            <TrendingUp size={20} color="#FF0080" />
            <Text style={styles.sectionTitle}>Top Artists in Your Mix</Text>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.artistsList}
          >
            {topArtistsInMix.map((artist) => (
              <TouchableOpacity
                key={artist.id}
                style={styles.artistCard}
                onPress={() => router.push(`/artist/${artist.id}` as any)}
                activeOpacity={0.8}
              >
                <SafeImage uri={artist.image} style={styles.artistImage} />
                <Text style={styles.artistName} numberOfLines={1}>
                  {artist.name}
                </Text>
                <Text style={styles.artistTrackCount}>
                  {artist.trackCount} {artist.trackCount === 1 ? "song" : "songs"}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      <View style={styles.tracksHeader}>
        <Text style={styles.tracksHeaderTitle}>Tracks</Text>
        <Text style={styles.tracksHeaderCount}>{filteredTracks.length}</Text>
      </View>
    </View>
  ), [
    isPremium,
    mixStats,
    selectedFilter,
    topArtistsInMix,
    filteredTracks.length,
    handlePlayAll,
    handleShuffle,
  ]);

  const renderTrack = useCallback(
    ({ item, index }: { item: Track; index: number }) => {
      const isPlaying = currentTrack?.id === item.id;
      const isFav = isFavorite(item.id);

      return (
        <TouchableOpacity
          style={[styles.trackItem, isPlaying && styles.trackItemPlaying]}
          onPress={() => playTrack(item)}
          activeOpacity={0.7}
        >
          <View style={styles.trackLeft}>
            <Text style={[styles.trackNumber, isPlaying && styles.trackNumberPlaying]}>
              {index + 1}
            </Text>
            <SafeImage uri={item.artwork} style={styles.trackArtwork} />
            <View style={styles.trackInfo}>
              <Text
                style={[styles.trackTitle, isPlaying && styles.trackTitlePlaying]}
                numberOfLines={1}
              >
                {item.title}
              </Text>
              <Text style={styles.trackArtist} numberOfLines={1}>
                {item.artist}
              </Text>
            </View>
          </View>

          <View style={styles.trackRight}>
            <TouchableOpacity
              style={styles.trackAction}
              onPress={() => toggleFavorite(item)}
            >
              <Heart
                size={20}
                color={isFav ? "#FF0080" : "#666"}
                fill={isFav ? "#FF0080" : "transparent"}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.trackAction}>
              <MoreVertical size={20} color="#666" />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      );
    },
    [currentTrack, isFavorite, playTrack, toggleFavorite]
  );

  if (!canAccessYourMix) {
    return (
      <View style={styles.container}>
        <Stack.Screen
          options={{
            headerShown: false,
          }}
        />

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.8}
        >
          <ArrowLeft size={24} color="#FFF" />
        </TouchableOpacity>

        <LinearGradient
          colors={["#667eea", "#764ba2", "#0B0A14"]}
          locations={[0, 0.3, 1]}
          style={styles.lockedContainer}
        >
          <View style={styles.lockedContent}>
            <View style={styles.lockedIconContainer}>
              <Lock size={64} color="#FFF" strokeWidth={1.5} />
              <View style={styles.crownBadge}>
                <Crown size={24} color="#FFD700" fill="#FFD700" />
              </View>
            </View>

            <Text style={styles.lockedTitle}>Your Mix is Premium Only</Text>
            <Text style={styles.lockedDescription}>
              Your Mix uses AI-powered personalization and DJ Instinct features to create a unique listening experience tailored just for you.
            </Text>

            <View style={styles.featuresList}>
              <View style={styles.featureItem}>
                <Sparkles size={20} color="#FFD700" />
                <Text style={styles.featureText}>AI-powered personalization</Text>
              </View>
              <View style={styles.featureItem}>
                <Music2 size={20} color="#FFD700" />
                <Text style={styles.featureText}>DJ Instinct integration</Text>
              </View>
              <View style={styles.featureItem}>
                <TrendingUp size={20} color="#FFD700" />
                <Text style={styles.featureText}>Smart recommendations</Text>
              </View>
              <View style={styles.featureItem}>
                <Heart size={20} color="#FFD700" />
                <Text style={styles.featureText}>Personalized playlists</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.upgradeButtonLarge}
              onPress={() => router.push("/subscription")}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={["#FF0080", "#8B5CF6"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.upgradeButtonGradient}
              >
                <Crown size={24} color="#FFF" fill="#FFF" />
                <Text style={styles.upgradeButtonLargeText}>Upgrade to Premium</Text>
              </LinearGradient>
            </TouchableOpacity>

            {!profile && (
              <View style={styles.guestNotice}>
                <Text style={styles.guestNoticeText}>
                  Not signed in? Create an account to unlock premium features
                </Text>
                <TouchableOpacity
                  style={styles.signInButton}
                  onPress={() => router.push("/auth")}
                  activeOpacity={0.8}
                >
                  <Text style={styles.signInButtonText}>Sign In / Sign Up</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </LinearGradient>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.back()}
        activeOpacity={0.8}
      >
        <ArrowLeft size={24} color="#FFF" />
      </TouchableOpacity>

      <FlatList
        data={filteredTracks}
        renderItem={renderTrack}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: 100 + insets.bottom },
        ]}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B0A14",
  },
  listContent: {
    flexGrow: 1,
  },
  headerContainer: {
    marginBottom: 16,
  },
  headerGradient: {
    paddingTop: 60,
    paddingBottom: 24,
  },
  headerContent: {
    paddingHorizontal: 20,
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  headerTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "800",
    color: "#FFF",
  },
  upgradeButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  upgradeButtonText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "700",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#CCC",
    marginBottom: 20,
    lineHeight: 20,
  },
  statsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  statText: {
    fontSize: 13,
    color: "#CCC",
    fontWeight: "600",
  },
  statDivider: {
    width: 1,
    height: 16,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    marginHorizontal: 12,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },
  playButton: {
    flex: 1,
    borderRadius: 28,
    overflow: "hidden",
  },
  playButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    gap: 8,
  },
  playButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "700",
  },
  shuffleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 28,
    gap: 8,
  },
  shuffleButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "700",
  },
  filterContainer: {
    flexDirection: "row",
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  filterChipActive: {
    backgroundColor: "#FF0080",
  },
  filterChipText: {
    color: "#CCC",
    fontSize: 14,
    fontWeight: "600",
  },
  filterChipTextActive: {
    color: "#FFF",
  },
  topArtistsSection: {
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFF",
  },
  artistsList: {
    paddingHorizontal: 20,
  },
  artistCard: {
    width: 100,
    marginRight: 16,
    alignItems: "center",
  },
  artistImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  artistName: {
    fontSize: 13,
    fontWeight: "700",
    color: "#FFF",
    textAlign: "center",
    marginBottom: 2,
  },
  artistTrackCount: {
    fontSize: 11,
    color: "#999",
    textAlign: "center",
  },
  tracksHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  tracksHeaderTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFF",
  },
  tracksHeaderCount: {
    fontSize: 14,
    color: "#999",
    fontWeight: "600",
  },
  trackItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  trackItemPlaying: {
    backgroundColor: "rgba(255, 0, 128, 0.1)",
  },
  trackLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 12,
  },
  trackNumber: {
    fontSize: 14,
    color: "#666",
    fontWeight: "600",
    width: 24,
    textAlign: "center",
  },
  trackNumberPlaying: {
    color: "#FF0080",
  },
  trackArtwork: {
    width: 48,
    height: 48,
    borderRadius: 8,
  },
  trackInfo: {
    flex: 1,
  },
  trackTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#FFF",
    marginBottom: 4,
  },
  trackTitlePlaying: {
    color: "#FF0080",
  },
  trackArtist: {
    fontSize: 13,
    color: "#999",
  },
  trackRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  trackAction: {
    padding: 8,
  },
  backButton: {
    position: "absolute",
    top: 60,
    left: 20,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  lockedContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  lockedContent: {
    alignItems: "center",
    maxWidth: 400,
  },
  lockedIconContainer: {
    position: "relative",
    marginBottom: 32,
  },
  crownBadge: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    borderRadius: 20,
    padding: 8,
    borderWidth: 2,
    borderColor: "#FFD700",
  },
  lockedTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#FFF",
    textAlign: "center",
    marginBottom: 16,
  },
  lockedDescription: {
    fontSize: 16,
    color: "#CCC",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 32,
  },
  featuresList: {
    width: "100%",
    marginBottom: 32,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    marginBottom: 12,
  },
  featureText: {
    fontSize: 15,
    color: "#FFF",
    fontWeight: "600",
  },
  upgradeButtonLarge: {
    width: "100%",
    borderRadius: 28,
    overflow: "hidden",
    marginBottom: 24,
  },
  upgradeButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 18,
    gap: 12,
  },
  upgradeButtonLargeText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "700",
  },
  guestNotice: {
    width: "100%",
    padding: 20,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    alignItems: "center",
  },
  guestNoticeText: {
    fontSize: 14,
    color: "#CCC",
    textAlign: "center",
    marginBottom: 16,
    lineHeight: 20,
  },
  signInButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 24,
  },
  signInButtonText: {
    color: "#FFF",
    fontSize: 15,
    fontWeight: "700",
  },
});
