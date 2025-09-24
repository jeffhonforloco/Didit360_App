import React, { useState, useRef, useCallback, useMemo } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
  Modal,
  Pressable,
  Animated,
  Keyboard,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import {
  Search as SearchIcon,
  X,
  MoreHorizontal,
  Play,
  Heart,
  Plus,
  Download,
  User,
  Disc,
  Share2,
  Ban,
  Mic,
  Music2,
} from "lucide-react-native";
import { usePlayer } from "@/contexts/PlayerContext";
import { useSearch } from "@/contexts/SearchContext";
import {
  allTracks,
  searchArtists,
  searchAlbums,
  podcastShows,
  allPodcastEpisodes,
} from "@/data/mockData";
import type { Track } from "@/types";
import { trpc, trpcClient } from "@/lib/trpc";

const browseCategories: Array<{ name: string; color: string; image: string; route?: string }> = [
  {
    name: "Charts",
    color: "#10B981",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=100&h=100&fit=crop",
    route: "/trending-now",
  },
  {
    name: "Podcasts",
    color: "#8B5CF6",
    image: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=100&h=100&fit=crop",
    route: "/podcasts",
  },
  {
    name: "New Releases",
    color: "#F59E0B",
    image: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=100&h=100&fit=crop",
    route: "/recently-added",
  },
  {
    name: "Only You",
    color: "#3B82F6",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=100&h=100&fit=crop",
  },
  {
    name: "Pop",
    color: "#EC4899",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=100&h=100&fit=crop",
    route: "/categories/genres",
  },
  {
    name: "K‑Pop",
    color: "#F97316",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=100&h=100&fit=crop",
    route: "/categories/genres",
  },
  {
    name: "Rock",
    color: "#10B981",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=100&h=100&fit=crop",
    route: "/categories/genres",
  },
  {
    name: "Hip‑Hop",
    color: "#6B7280",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=100&h=100&fit=crop",
    route: "/categories/genres",
  },
  {
    name: "Jazz",
    color: "#6B7280",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=100&h=100&fit=crop",
    route: "/categories/genres",
  },
  {
    name: "Romance",
    color: "#06B6D4",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=100&h=100&fit=crop",
    route: "/categories/genres",
  },
];

const audiobookCategories: Array<{ name: string; color: string; image: string }> = [
  { name: "Fiction", color: "#10B981", image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=100&h=100&fit=crop" },
  { name: "Non‑fiction", color: "#8B5CF6", image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=100&h=100&fit=crop" },
  { name: "Mystery", color: "#F59E0B", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop" },
  { name: "Sci‑Fi", color: "#3B82F6", image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=100&h=100&fit=crop" },
  { name: "Fantasy", color: "#EC4899", image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=100&h=100&fit=crop" },
  { name: "Biography", color: "#F97316", image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=100&h=100&fit=crop" },
  { name: "History", color: "#10B981", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop" },
  { name: "Self‑Help", color: "#6B7280", image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=100&h=100&fit=crop" },
  { name: "Business", color: "#6B7280", image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=100&h=100&fit=crop" },
  { name: "Kids", color: "#06B6D4", image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=100&h=100&fit=crop" },
];

type FilterTab = "Top" | "Songs" | "Artists" | "Albums" | "Podcasts" | "Playlists" | "Profiles";

interface ContextMenuProps {
  visible: boolean;
  onClose: () => void;
  track: Track;
  position: { x: number; y: number };
}

function ContextMenu({ visible, onClose, track, position }: ContextMenuProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.8,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, fadeAnim, scaleAnim]);

  const menuItems = track.type === "podcast"
    ? [
        { icon: Heart, label: "Mark as Played", onPress: () => console.log("Mark as Played", track.title) },
        { icon: User, label: "Go to Podcast", onPress: () => console.log("Go to Podcast", track.artist) },
        { icon: Share2, label: "Share", onPress: () => console.log("Share", track.title) },
      ]
    : [
        { icon: Heart, label: "Like", onPress: () => console.log("Like", track.title) },
        { icon: Plus, label: "Add to Playlist", onPress: () => console.log("Add to Playlist", track.title) },
        { icon: Ban, label: "Don't Play This", onPress: () => console.log("Don't Play This", track.title) },
        { icon: Download, label: "Download", onPress: () => console.log("Download", track.title) },
        { icon: User, label: "View Artist", onPress: () => console.log("View Artist", track.artist) },
        { icon: Disc, label: "Go to Album", onPress: () => console.log("Go to Album", track.album) },
        { icon: Share2, label: "Share", onPress: () => console.log("Share", track.title) },
      ];

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <Pressable style={styles.contextMenuOverlay} onPress={onClose}>
        <Animated.View
          style={[
            styles.contextMenu,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
              top: Math.min(position.y, 400),
              left: Math.max(20, Math.min(position.x - 100, 300)),
            },
          ]}
        >
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.contextMenuItem}
              onPress={() => {
                item.onPress();
                onClose();
              }}
            >
              <item.icon size={20} color="#FFF" />
              <Text style={styles.contextMenuText}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </Animated.View>
      </Pressable>
    </Modal>
  );
}

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeFilter, setActiveFilter] = useState<FilterTab>("Top");
  const [debouncedQuery, setDebouncedQuery] = useState<string>("");
  const [isSearchFocused, setIsSearchFocused] = useState<boolean>(false);
  const [contextMenu, setContextMenu] = useState<{
    visible: boolean;
    track: Track | null;
    position: { x: number; y: number };
  }>({ visible: false, track: null, position: { x: 0, y: 0 } });
  const { playTrack } = usePlayer();
  const { recentSearches, addToSearchHistory, removeFromSearchHistory, clearSearchHistory } = useSearch();
  const insets = useSafeAreaInsets();
  const searchInputRef = useRef<TextInput>(null);

  React.useEffect(() => {
    const id = setTimeout(() => {
      setDebouncedQuery(searchQuery.trim());
    }, 250);
    return () => clearTimeout(id);
  }, [searchQuery]);

  const filteredTracks = allTracks.filter(
    (track) =>
      track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      track.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (track.album?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
  );

  const filteredArtists = searchArtists.filter((artist) => artist.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const filteredAlbums = searchAlbums.filter(
    (album) => album.title.toLowerCase().includes(searchQuery.toLowerCase()) || album.artist.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredPodcasts = [...allPodcastEpisodes, ...podcastShows].filter((item) => {
    if ("title" in item) {
      const anyItem = item as unknown as { title?: string; host?: string; artist?: string };
      return (
        (anyItem.title?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
        (anyItem.host?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
        (anyItem.artist?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
      );
    }
    return false;
  });

  const getFilteredResults = () => {
    switch (activeFilter) {
      case "Songs":
        return filteredTracks.filter((track) => track.type === "song");
      case "Artists":
        return filteredArtists;
      case "Albums":
        return filteredAlbums;
      case "Podcasts":
        return filteredPodcasts;
      case "Playlists":
        return [];
      case "Profiles":
        return filteredArtists;
      default:
        return [...filteredTracks, ...filteredArtists, ...filteredAlbums, ...filteredPodcasts].slice(0, 10);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleRecentSearchPress = (query: string) => {
    setSearchQuery(query);
    setIsSearchFocused(false);
    Keyboard.dismiss();
  };

  const showContextMenu = useCallback((track: Track, event: { nativeEvent: { pageX: number; pageY: number } }) => {
    const { pageX, pageY } = event.nativeEvent;
    setContextMenu({ visible: true, track, position: { x: pageX, y: pageY } });
  }, []);

  const hideContextMenu = useCallback(() => {
    setContextMenu({ visible: false, track: null, position: { x: 0, y: 0 } });
  }, []);

  const navigateCategory = useCallback((route?: string) => {
    if (!route) {
      console.log("[Search] Category tapped without route – no navigation");
      return;
    }
    router.push(route as never);
  }, []);

  const renderCategory = ({ item }: { item: (typeof browseCategories)[number] }) => (
    <TouchableOpacity
      style={[styles.categoryCard, { backgroundColor: item.color }]}
      activeOpacity={0.8}
      onPress={() => navigateCategory(item.route)}
      testID={`browse-${item.name}`}
    >
      <Text style={styles.categoryText}>{item.name}</Text>
      <Image source={{ uri: item.image }} style={styles.categoryImage} />
    </TouchableOpacity>
  );

  const renderAudiobookCategory = ({ item }: { item: (typeof audiobookCategories)[number] }) => (
    <TouchableOpacity
      style={[styles.audiobookCard, { backgroundColor: item.color }]}
      activeOpacity={0.8}
      onPress={() => console.log("[Search] Audiobook category", item.name)}
      testID={`ab-${item.name}`}
    >
      <Text style={styles.audiobookText}>{item.name}</Text>
      <Image source={{ uri: item.image }} style={styles.audiobookImage} />
    </TouchableOpacity>
  );

  const backendType = useMemo(() => {
    switch (activeFilter) {
      case "Songs":
        return "track" as const;
      case "Artists":
        return "artist" as const;
      case "Albums":
        return "release" as const;
      case "Podcasts":
        return "podcast" as const;
      default:
        return "all" as const;
    }
  }, [activeFilter]);

  const backendResults = trpc.catalog.search.useQuery(
    { q: debouncedQuery || "", type: backendType, limit: 20 },
    { enabled: debouncedQuery.length > 0 }
  );

  const isUsingBackend = useMemo(() => debouncedQuery.length > 0, [debouncedQuery]);

  const typePill = (label: string) => (
    <View style={styles.typePill}>
      <Music2 color="#0A0A0A" size={12} />
      <Text style={styles.typePillText}>{label}</Text>
    </View>
  );

  const renderLocalResult = ({ item }: { item: Track | (typeof searchArtists)[number] | (typeof searchAlbums)[number] | (typeof podcastShows)[number] }) => {
    if ("name" in item && "image" in item) {
      const artist = item as (typeof searchArtists)[number];
      return (
        <TouchableOpacity style={styles.searchResult} onPress={() => router.push(`/profile/${artist.id}` as never)} activeOpacity={0.8} testID={`artist-${artist.id}`}>
          <Image source={{ uri: artist.image }} style={[styles.resultImage, styles.artistImage]} />
          <View style={styles.resultInfo}>
            <View style={styles.artistHeader}>
              <Text style={styles.resultTitle} numberOfLines={1}>
                {artist.name}
              </Text>
              {artist.verified ? (
                <View style={styles.verifiedBadge}>
                  <Text style={styles.verifiedText}>✓</Text>
                </View>
              ) : null}
            </View>
            <Text style={styles.resultArtist} numberOfLines={1}>
              Artist
            </Text>
          </View>
          <TouchableOpacity style={styles.followButton}>
            <Text style={styles.followButtonText}>Follow</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      );
    }

    if ("type" in item && (item as { type?: string }).type === "album") {
      const album = item as (typeof searchAlbums)[number];
      return (
        <TouchableOpacity style={styles.searchResult} onPress={() => router.push(`/album/${album.id}` as never)} activeOpacity={0.8} testID={`album-${album.id}`}>
          <Image source={{ uri: album.artwork }} style={styles.resultImage} />
          <View style={styles.resultInfo}>
            <Text style={styles.resultTitle} numberOfLines={1}>
              {album.title}
            </Text>
            <Text style={styles.resultArtist} numberOfLines={1}>
              {album.artist} • Album • {album.year}
            </Text>
          </View>
          <TouchableOpacity style={styles.moreButton}>
            <MoreHorizontal size={20} color="#999" />
          </TouchableOpacity>
        </TouchableOpacity>
      );
    }

    if ("host" in item) {
      const show = item as (typeof podcastShows)[number];
      return (
        <TouchableOpacity style={styles.searchResult} onPress={() => router.push(`/podcast-show/${show.id}` as never)} activeOpacity={0.8} testID={`podcast-${show.id}`}>
          <Image source={{ uri: show.artwork }} style={styles.resultImage} />
          <View style={styles.resultInfo}>
            <Text style={styles.resultTitle} numberOfLines={1}>
              {show.title}
            </Text>
            <Text style={styles.resultArtist} numberOfLines={1}>
              {show.host} • Podcast
            </Text>
          </View>
          <TouchableOpacity style={styles.moreButton}>
            <MoreHorizontal size={20} color="#999" />
          </TouchableOpacity>
        </TouchableOpacity>
      );
    }

    const track = item as Track;
    return (
      <TouchableOpacity
        style={styles.searchResult}
        onPress={async () => {
          try {
            const rights = await trpcClient.catalog.rights.isStreamable.query({ entityType: "track", id: track.id, country: "US", explicitOk: true });
            if ((rights as { streamable?: boolean }).streamable) {
              playTrack(track);
              router.push(`/song/${track.id}` as never);
            } else {
              console.log("[Search] Track not streamable", (rights as { reasons?: string[] }).reasons ?? []);
              alert("This track is not streamable in your region or settings.");
            }
          } catch (e) {
            console.log("[Search] rights check error", e);
            alert("Unable to verify streamability. Please try again.");
          }
        }}
        activeOpacity={0.8}
        testID={`track-${track.id}`}
      >
        <View style={styles.resultImageContainer}>
          <Image source={{ uri: track.artwork }} style={styles.resultImage} />
          <TouchableOpacity
            style={styles.fabPlay}
            onPress={async (e) => {
              e.stopPropagation();
              try {
                const rights = await trpcClient.catalog.rights.isStreamable.query({ entityType: "track", id: track.id, country: "US", explicitOk: true });
                if ((rights as { streamable?: boolean }).streamable) {
                  playTrack(track);
                } else {
                  console.log("[Search] Track not streamable", (rights as { reasons?: string[] }).reasons ?? []);
                  alert("This track is not streamable in your region or settings.");
                }
              } catch (err) {
                console.log("[Search] rights check error", err);
                alert("Unable to verify streamability.");
              }
            }}
            accessibilityLabel={`Play ${track.title}`}
          >
            <Play size={16} color="#0A0A0A" />
          </TouchableOpacity>
        </View>
        <View style={styles.resultInfo}>
          <Text style={styles.resultTitle} numberOfLines={1}>
            {track.title}
          </Text>
          <View style={styles.inlineRow}>
            <Text style={styles.resultArtist} numberOfLines={1}>
              {track.artist}
            </Text>
            {typePill(track.type === "song" ? "Song" : track.type === "podcast" ? "Podcast" : "Audiobook")}
          </View>
        </View>
        <TouchableOpacity style={styles.moreButton} onPress={(event) => showContextMenu(track, event as unknown as { nativeEvent: { pageX: number; pageY: number } })}>
          <MoreHorizontal size={20} color="#999" />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  const prettyType = useCallback((t: string) => {
    switch (t) {
      case "track":
        return "Song";
      case "release":
        return "Album";
      case "artist":
        return "Artist";
      case "video":
        return "Video";
      case "podcast":
        return "Podcast";
      case "episode":
        return "Episode";
      case "audiobook":
        return "Audiobook";
      case "book":
        return "Book";
      default:
        return t;
    }
  }, []);

  const renderBackendItem = ({
    item,
  }: {
    item: { id: string; type: string; title: string; subtitle?: string; artwork?: string };
  }) => {
    return (
      <TouchableOpacity
        style={styles.searchResult}
        testID={`result-${item.type}-${item.id}`}
        onPress={() => {
          if (item.type === "track") router.push(`/song/${item.id}` as never);
          else if (item.type === "artist") router.push(`/profile/${item.id}` as never);
          else if (item.type === "release") router.push(`/album/${item.id}` as never);
          else if (item.type === "podcast") router.push(`/podcast-show/${item.id}` as never);
          else if (item.type === "episode") router.push(`/podcast-episode/${item.id}` as never);
          else console.log("[Search] Unsupported navigate for type", item.type);
        }}
        activeOpacity={0.8}
      >
        {item.artwork ? (
          <Image source={{ uri: item.artwork }} style={styles.resultImage} />
        ) : (
          <View style={[styles.resultImage, styles.fallbackArt]}>
            <Text style={{ color: "#666" }}>{prettyType(item.type)}</Text>
          </View>
        )}
        <View style={styles.resultInfo}>
          <View style={styles.artistHeader}>
            <Text style={styles.resultTitle} numberOfLines={1}>
              {item.title}
            </Text>
            {typePill(prettyType(item.type))}
          </View>
          {item.subtitle ? (
            <Text style={styles.resultArtist} numberOfLines={1}>
              {item.subtitle}
            </Text>
          ) : null}
        </View>
        <TouchableOpacity style={styles.moreButton}>
          <MoreHorizontal size={20} color="#999" />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container} testID="search-screen">
      <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>Search</Text>
          <TouchableOpacity onPress={() => router.push("/settings" as never)} testID="search-settings">
            <MoreHorizontal size={24} color="#FFF" />
          </TouchableOpacity>
        </View>
        <View style={[styles.searchBar, isSearchFocused && styles.searchBarFocused]}>
          <SearchIcon size={20} color="#999" />
          <TextInput
            ref={searchInputRef}
            style={styles.searchInput}
            placeholder={"Search artists, songs, albums, podcasts…"}
            placeholderTextColor="#666"
            value={searchQuery}
            onChangeText={handleSearch}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            onSubmitEditing={() => {
              const q = searchQuery.trim();
              if (q.length > 0) {
                addToSearchHistory(q);
              }
            }}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="search"
            testID="search-input"
          />
          {searchQuery.length > 0 ? (
            <TouchableOpacity onPress={() => setSearchQuery("")} accessibilityLabel="Clear search" testID="clear-search">
              <X size={20} color="#999" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.micButton} onPress={() => console.log("[Search] Voice search", Platform.OS)} testID="voice-search">
              <Mic size={20} color="#999" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {searchQuery.length > 0 ? (
          <View style={styles.results}>
            <View style={styles.filterTabs}>
              {(["Top", "Songs", "Artists", "Albums", "Podcasts", "Playlists", "Profiles"] as FilterTab[]).map((filter) => (
                <TouchableOpacity
                  key={filter}
                  style={[styles.filterTab, activeFilter === filter && styles.activeFilterTab]}
                  onPress={() => setActiveFilter(filter)}
                  testID={`filter-${filter}`}
                >
                  <Text style={[styles.filterTabText, activeFilter === filter && styles.activeFilterTabText]}>
                    {filter}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {(() => {
              if (isUsingBackend) {
                if (backendResults.isLoading) {
                  return (
                    <Text style={styles.resultsTitle} testID="search-loading">
                      Searching…
                    </Text>
                  );
                }
                if (backendResults.error) {
                  return (
                    <Text style={styles.resultsTitle} testID="search-error">
                      Search error
                    </Text>
                  );
                }
                const data = (backendResults.data ?? []) as Array<{
                  id: string;
                  type: string;
                  title: string;
                  subtitle?: string;
                  artwork?: string;
                }>;
                if (data.length === 0) {
                  return (
                    <View style={styles.marginTop16}>{renderNotFound()}</View>
                  );
                }
                return (
                  <FlatList
                    data={data}
                    keyExtractor={(item) => `${item.type}-${item.id}`}
                    scrollEnabled={false}
                    style={styles.resultsList}
                    renderItem={renderBackendItem}
                  />
                );
              }
              const results = getFilteredResults() as Array<unknown>;
              if (results.length === 0) {
                return renderNotFound();
              }
              return (
                <FlatList
                  data={results}
                  renderItem={renderLocalResult as unknown as ({ item }: { item: unknown }) => React.ReactElement}
                  keyExtractor={(item) => {
                    if (typeof item === "object" && item && "id" in (item as Record<string, unknown>)) return String((item as Record<string, unknown>)["id"]);
                    if (typeof item === "object" && item && "name" in (item as Record<string, unknown>)) return String((item as Record<string, unknown>)["name"]);
                    return String(Math.random());
                  }}
                  scrollEnabled={false}
                  style={styles.resultsList}
                />
              );
            })()}
          </View>
        ) : isSearchFocused && recentSearches.length > 0 ? (
          <View style={styles.recentSearches}>
            <View style={styles.recentSearchesHeader}>
              <Text style={styles.recentSearchesTitle}>Recent Searches</Text>
              <TouchableOpacity onPress={clearSearchHistory} testID="clear-all-searches">
                <Text style={styles.clearAllText}>Clear All</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={recentSearches}
              renderItem={({ item }: { item: string }) => (
                <TouchableOpacity style={styles.recentSearchItem} onPress={() => handleRecentSearchPress(item)} activeOpacity={0.8}>
                  <Text style={styles.recentSearchText} numberOfLines={1}>
                    {item}
                  </Text>
                  <TouchableOpacity style={styles.removeSearchButton} onPress={() => removeFromSearchHistory(item)}>
                    <X size={16} color="#666" />
                  </TouchableOpacity>
                </TouchableOpacity>
              )}
              keyExtractor={(item, index) => `${item}-${index}`}
              scrollEnabled={false}
            />
          </View>
        ) : (
          <View>
            {recentSearches.length > 0 && (
              <View style={styles.recentSearches}>
                <View style={styles.recentSearchesHeader}>
                  <Text style={styles.recentSearchesTitle}>Recent Searches</Text>
                  <TouchableOpacity onPress={clearSearchHistory}>
                    <Text style={styles.clearAllText}>Clear All</Text>
                  </TouchableOpacity>
                </View>
                <FlatList
                  data={recentSearches}
                  renderItem={({ item }: { item: string }) => (
                    <TouchableOpacity style={styles.recentSearchItem} onPress={() => handleRecentSearchPress(item)} activeOpacity={0.8}>
                      <Text style={styles.recentSearchText} numberOfLines={1}>
                        {item}
                      </Text>
                      <TouchableOpacity style={styles.removeSearchButton} onPress={() => removeFromSearchHistory(item)}>
                        <X size={16} color="#666" />
                      </TouchableOpacity>
                    </TouchableOpacity>
                  )}
                  keyExtractor={(item, index) => `${item}-${index}`}
                  scrollEnabled={false}
                />
              </View>
            )}
            <View style={styles.browse}>
              <Text style={styles.browseTitle}>Browse All Audiobooks</Text>
              <FlatList
                data={audiobookCategories}
                renderItem={renderAudiobookCategory}
                keyExtractor={(item, index) => `${item.name}-${index}`}
                numColumns={2}
                columnWrapperStyle={styles.categoryRow}
                scrollEnabled={false}
              />
            </View>
            <View style={styles.browse}>
              <Text style={styles.browseTitle}>Browse All</Text>
              <FlatList
                data={browseCategories}
                renderItem={renderCategory}
                keyExtractor={(item) => item.name}
                numColumns={2}
                columnWrapperStyle={styles.categoryRow}
                scrollEnabled={false}
              />
            </View>
          </View>
        )}
      </ScrollView>

      {contextMenu.visible && contextMenu.track ? (
        <ContextMenu visible={contextMenu.visible} onClose={hideContextMenu} track={contextMenu.track} position={contextMenu.position} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A0A0A",
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFF",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1A1A1A",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 2,
    borderColor: "transparent",
  },
  searchBarFocused: {
    borderColor: "#E91E63",
    backgroundColor: "#0A0A0A",
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: "#FFF",
  },
  results: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 120,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFF",
    marginBottom: 16,
  },
  searchResult: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  resultImage: {
    width: 56,
    height: 56,
    borderRadius: 8,
    marginRight: 12,
  },
  fallbackArt: {
    backgroundColor: "#222",
    justifyContent: "center",
    alignItems: "center",
  },
  resultInfo: {
    flex: 1,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFF",
    marginBottom: 4,
  },
  resultArtist: {
    fontSize: 14,
    color: "#999",
  },
  inlineRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  browse: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 120,
  },
  browseTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFF",
    marginBottom: 16,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  categoryRow: {
    justifyContent: "space-between",
  },
  categoryCard: {
    flex: 0.48,
    height: 100,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    justifyContent: "space-between",
    overflow: "hidden",
  },
  categoryText: {
    fontSize: 18,
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
    transform: [{ rotate: "15deg" }],
  },
  audiobookCard: {
    flex: 0.48,
    height: 120,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    justifyContent: "space-between",
    overflow: "hidden",
  },
  audiobookText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFF",
    zIndex: 2,
  },
  audiobookImage: {
    position: "absolute",
    bottom: -15,
    right: -15,
    width: 80,
    height: 80,
    borderRadius: 12,
    transform: [{ rotate: "12deg" }],
  },
  contextMenuOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  contextMenu: {
    position: "absolute",
    backgroundColor: "#1A1A1A",
    borderRadius: 12,
    paddingVertical: 8,
    minWidth: 200,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  contextMenuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  contextMenuText: {
    color: "#FFF",
    fontSize: 16,
    marginLeft: 12,
  },
  filterTabs: {
    flexDirection: "row",
    marginBottom: 20,
    gap: 8,
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#333",
  },
  activeFilterTab: {
    backgroundColor: "#E91E63",
    borderColor: "#E91E63",
  },
  filterTabText: {
    color: "#999",
    fontSize: 14,
    fontWeight: "500",
  },
  activeFilterTabText: {
    color: "#FFF",
  },
  artistImage: {
    borderRadius: 28,
  },
  artistHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  verifiedBadge: {
    backgroundColor: "#1DB954",
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  verifiedText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "bold",
  },
  followButton: {
    backgroundColor: "#E91E63",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  followButtonText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "600",
  },
  resultImageContainer: {
    position: "relative",
    marginRight: 12,
  },
  fabPlay: {
    position: "absolute",
    right: -6,
    bottom: -6,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#E91E63",
    justifyContent: "center",
    alignItems: "center",
  },
  moreButton: {
    padding: 8,
  },
  resultsList: {
    marginTop: 16,
  },
  marginTop16: {
    marginTop: 16,
  },
  recentSearches: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  recentSearchesHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  recentSearchesTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFF",
  },
  clearAllText: {
    color: "#E91E63",
    fontSize: 14,
    fontWeight: "500",
  },
  recentSearchItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
  },
  recentSearchText: {
    color: "#FFF",
    fontSize: 16,
    flex: 1,
  },
  removeSearchButton: {
    padding: 4,
  },
  notFoundContainer: {
    alignItems: "center",
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  notFoundIllustration: {
    position: "relative",
    marginBottom: 24,
  },
  notFoundCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#E91E63",
    justifyContent: "center",
    alignItems: "center",
  },
  notFoundEmoji: {
    fontSize: 48,
  },
  notFoundPerson: {
    position: "absolute",
    bottom: -20,
    right: -30,
  },
  personBody: {
    width: 30,
    height: 40,
    backgroundColor: "#4A5568",
    borderRadius: 15,
  },
  personHead: {
    width: 20,
    height: 20,
    backgroundColor: "#F7FAFC",
    borderRadius: 10,
    marginTop: -5,
    marginLeft: 5,
  },
  notFoundTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 12,
  },
  notFoundDescription: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
    lineHeight: 24,
  },
  typePill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: 8,
    gap: 4,
  },
  typePillText: {
    color: "#0A0A0A",
    fontSize: 11,
    fontWeight: "700",
  },
  micButton: {
    padding: 4,
  },
});

function renderNotFound() {
  return (
    <View style={styles.notFoundContainer}>
      <View style={styles.notFoundIllustration}>
        <View style={styles.notFoundCircle}>
          <Text style={styles.notFoundEmoji}>😞</Text>
        </View>
        <View style={styles.notFoundPerson}>
          <View style={styles.personBody} />
          <View style={styles.personHead} />
        </View>
      </View>
      <Text style={styles.notFoundTitle}>No results</Text>
      <Text style={styles.notFoundDescription}>
        Try a different keyword, or browse categories below.
      </Text>
    </View>
  );
}
