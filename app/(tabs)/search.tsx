import React, { useState, useRef, useCallback } from "react";
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
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from 'expo-router';
import { Search, X, MoreHorizontal, Play, Heart, Plus, Download, User, Disc, Share2, Ban } from "lucide-react-native";
import { usePlayer } from "@/contexts/PlayerContext";
import { useSearch } from "@/contexts/SearchContext";
import { allTracks, searchArtists, searchAlbums } from "@/data/mockData";
import type { Track } from "@/types";

const browseCategories = [
  { name: "Charts", color: "#10B981", image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=100&h=100&fit=crop" },
  { name: "Podcasts", color: "#8B5CF6", image: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=100&h=100&fit=crop" },
  { name: "New Releases", color: "#F59E0B", image: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=100&h=100&fit=crop" },
  { name: "Only You", color: "#3B82F6", image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=100&h=100&fit=crop" },
  { name: "Pop", color: "#EC4899", image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=100&h=100&fit=crop" },
  { name: "K-Pop", color: "#F97316", image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=100&h=100&fit=crop" },
  { name: "Rock", color: "#10B981", image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=100&h=100&fit=crop" },
  { name: "Hip-Hop", color: "#6B7280", image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=100&h=100&fit=crop" },
  { name: "Jazz", color: "#6B7280", image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=100&h=100&fit=crop" },
  { name: "Romance", color: "#06B6D4", image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=100&h=100&fit=crop" },
];

type FilterTab = 'Top' | 'Songs' | 'Artists' | 'Albums';

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

  const menuItems = [
    { icon: Heart, label: 'Like', onPress: () => console.log('Like', track.title) },
    { icon: Plus, label: 'Add to Playlist', onPress: () => console.log('Add to Playlist', track.title) },
    { icon: Ban, label: "Don't Play This", onPress: () => console.log("Don't Play This", track.title) },
    { icon: Download, label: 'Download', onPress: () => console.log('Download', track.title) },
    { icon: User, label: 'View Artist', onPress: () => console.log('View Artist', track.artist) },
    { icon: Disc, label: 'Go to Album', onPress: () => console.log('Go to Album', track.album) },
    { icon: Share2, label: 'Share', onPress: () => console.log('Share', track.title) },
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
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
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<FilterTab>('Top');
  const [contextMenu, setContextMenu] = useState<{
    visible: boolean;
    track: Track | null;
    position: { x: number; y: number };
  }>({ visible: false, track: null, position: { x: 0, y: 0 } });
  const { playTrack } = usePlayer();
  const { recentSearches, addToSearchHistory, removeFromSearchHistory, clearSearchHistory } = useSearch();
  const insets = useSafeAreaInsets();
  const searchInputRef = useRef<TextInput>(null);

  const filteredTracks = allTracks.filter(
    (track) =>
      track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      track.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
      track.album?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredArtists = searchArtists.filter(
    (artist) =>
      artist.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredAlbums = searchAlbums.filter(
    (album) =>
      album.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      album.artist.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getFilteredResults = () => {
    switch (activeFilter) {
      case 'Songs':
        return filteredTracks.filter(track => track.type === 'song');
      case 'Artists':
        return filteredArtists;
      case 'Albums':
        return filteredAlbums;
      default:
        return [...filteredTracks, ...filteredArtists, ...filteredAlbums].slice(0, 10);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      addToSearchHistory(query.trim());
    }
  };

  const handleRecentSearchPress = (query: string) => {
    setSearchQuery(query);
    searchInputRef.current?.focus();
  };

  const showContextMenu = useCallback((track: Track, event: any) => {
    const { pageX, pageY } = event.nativeEvent;
    setContextMenu({
      visible: true,
      track,
      position: { x: pageX, y: pageY },
    });
  }, []);

  const hideContextMenu = useCallback(() => {
    setContextMenu({ visible: false, track: null, position: { x: 0, y: 0 } });
  }, []);

  const renderCategory = ({ item }: { item: typeof browseCategories[0] }) => (
    <TouchableOpacity
      style={[styles.categoryCard, { backgroundColor: item.color }]}
      activeOpacity={0.8}
    >
      <Text style={styles.categoryText}>{item.name}</Text>
      <Image source={{ uri: item.image }} style={styles.categoryImage} />
    </TouchableOpacity>
  );

  const renderSearchResult = ({ item }: { item: Track | typeof searchArtists[0] | typeof searchAlbums[0] }) => {
    if ('type' in item && item.type === 'artist') {
      return (
        <TouchableOpacity
          style={styles.searchResult}
          onPress={() => router.push(`/artist/${item.id}`)}
          activeOpacity={0.8}
        >
          <Image source={{ uri: item.image }} style={[styles.resultImage, styles.artistImage]} />
          <View style={styles.resultInfo}>
            <View style={styles.artistHeader}>
              <Text style={styles.resultTitle} numberOfLines={1}>
                {item.name}
              </Text>
              {item.verified && (
                <View style={styles.verifiedBadge}>
                  <Text style={styles.verifiedText}>✓</Text>
                </View>
              )}
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

    if ('type' in item && item.type === 'album') {
      const album = item as typeof searchAlbums[0];
      return (
        <TouchableOpacity
          style={styles.searchResult}
          onPress={() => router.push(`/album/${album.id}`)}
          activeOpacity={0.8}
        >
          <Image source={{ uri: album.artwork }} style={styles.resultImage} />
          <View style={styles.resultInfo}>
            <Text style={styles.resultTitle} numberOfLines={1}>
              {album.title}
            </Text>
            <Text style={styles.resultArtist} numberOfLines={1}>
              {album.artist} • {album.year}
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
        onPress={() => router.push(`/song/${track.id}`)}
        activeOpacity={0.8}
      >
        <View style={styles.resultImageContainer}>
          <Image source={{ uri: track.artwork }} style={styles.resultImage} />
          <TouchableOpacity 
            style={styles.playButton}
            onPress={(e) => {
              e.stopPropagation();
              playTrack(track);
            }}
          >
            <Play size={16} color="#FFF" fill="#FFF" />
          </TouchableOpacity>
        </View>
        <View style={styles.resultInfo}>
          <Text style={styles.resultTitle} numberOfLines={1}>
            {track.title}
          </Text>
          <Text style={styles.resultArtist} numberOfLines={1}>
            {track.type === "song"
              ? `${track.artist} • Song`
              : track.type === "podcast"
              ? `${track.artist} • Podcast`
              : `${track.artist} • Audiobook`}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.moreButton}
          onPress={(event) => showContextMenu(track, event)}
        >
          <MoreHorizontal size={20} color="#999" />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  const renderRecentSearch = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={styles.recentSearchItem}
      onPress={() => handleRecentSearchPress(item)}
      activeOpacity={0.8}
    >
      <Text style={styles.recentSearchText} numberOfLines={1}>
        {item}
      </Text>
      <TouchableOpacity
        style={styles.removeSearchButton}
        onPress={() => removeFromSearchHistory(item)}
      >
        <X size={16} color="#666" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderNotFound = () => (
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
      <Text style={styles.notFoundTitle}>Not Found</Text>
      <Text style={styles.notFoundDescription}>
        Sorry, the keyword you entered cannot be found, please check again or search with another keyword.
      </Text>
    </View>
  );

  const renderFilterTabs = () => (
    <View style={styles.filterTabs}>
      {(['Top', 'Songs', 'Artists', 'Albums'] as FilterTab[]).map((filter) => (
        <TouchableOpacity
          key={filter}
          style={[
            styles.filterTab,
            activeFilter === filter && styles.activeFilterTab,
          ]}
          onPress={() => setActiveFilter(filter)}
        >
          <Text
            style={[
              styles.filterTabText,
              activeFilter === filter && styles.activeFilterTabText,
            ]}
          >
            {filter}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>Search</Text>
          <TouchableOpacity>
            <MoreHorizontal size={24} color="#FFF" />
          </TouchableOpacity>
        </View>
        <View style={styles.searchBar}>
          <Search size={20} color="#999" />
          <TextInput
            ref={searchInputRef}
            style={styles.searchInput}
            placeholder="Artists, Songs, Podcasts, & More"
            placeholderTextColor="#666"
            value={searchQuery}
            onChangeText={handleSearch}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <X size={20} color="#999" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {searchQuery.length > 0 ? (
          <View style={styles.results}>
            {renderFilterTabs()}
            {(() => {
              const results = getFilteredResults();
              if (results.length === 0) {
                return renderNotFound();
              }
              return (
                <FlatList
                  data={results}
                  renderItem={renderSearchResult}
                  keyExtractor={(item) => 'id' in item ? item.id : (item as typeof searchArtists[0]).name}
                  scrollEnabled={false}
                  style={styles.resultsList}
                />
              );
            })()
            }
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
                  renderItem={renderRecentSearch}
                  keyExtractor={(item, index) => `${item}-${index}`}
                  scrollEnabled={false}
                />
              </View>
            )}
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
      
      {contextMenu.visible && contextMenu.track && (
        <ContextMenu
          visible={contextMenu.visible}
          onClose={hideContextMenu}
          track={contextMenu.track}
          position={contextMenu.position}
        />
      )}
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
    overflow: 'hidden',
  },
  categoryText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFF",
  },
  categoryImage: {
    position: 'absolute',
    bottom: -10,
    right: -10,
    width: 60,
    height: 60,
    borderRadius: 8,
    transform: [{ rotate: '15deg' }],
  },
  // Context Menu Styles
  contextMenuOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contextMenu: {
    position: 'absolute',
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    paddingVertical: 8,
    minWidth: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  contextMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  contextMenuText: {
    color: '#FFF',
    fontSize: 16,
    marginLeft: 12,
  },
  // Filter Tabs
  filterTabs: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 8,
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#333',
  },
  activeFilterTab: {
    backgroundColor: '#E91E63',
    borderColor: '#E91E63',
  },
  filterTabText: {
    color: '#999',
    fontSize: 14,
    fontWeight: '500',
  },
  activeFilterTabText: {
    color: '#FFF',
  },
  // Artist Results
  artistImage: {
    borderRadius: 28,
  },
  artistHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  verifiedBadge: {
    backgroundColor: '#1DB954',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  verifiedText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  followButton: {
    backgroundColor: '#E91E63',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  followButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  // Track Results
  resultImageContainer: {
    position: 'relative',
    marginRight: 12,
  },
  playButton: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0,
  },
  moreButton: {
    padding: 8,
  },
  resultsList: {
    marginTop: 16,
  },
  // Recent Searches
  recentSearches: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  recentSearchesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  recentSearchesTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFF',
  },
  clearAllText: {
    color: '#E91E63',
    fontSize: 14,
    fontWeight: '500',
  },
  recentSearchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  recentSearchText: {
    color: '#FFF',
    fontSize: 16,
    flex: 1,
  },
  removeSearchButton: {
    padding: 4,
  },
  // Not Found
  notFoundContainer: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  notFoundIllustration: {
    position: 'relative',
    marginBottom: 24,
  },
  notFoundCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#E91E63',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notFoundEmoji: {
    fontSize: 48,
  },
  notFoundPerson: {
    position: 'absolute',
    bottom: -20,
    right: -30,
  },
  personBody: {
    width: 30,
    height: 40,
    backgroundColor: '#4A5568',
    borderRadius: 15,
  },
  personHead: {
    width: 20,
    height: 20,
    backgroundColor: '#F7FAFC',
    borderRadius: 10,
    marginTop: -5,
    marginLeft: 5,
  },
  notFoundTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 12,
  },
  notFoundDescription: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    lineHeight: 24,
  },
});