import React, { useState, useMemo } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
  TextInput,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft, Search, Filter, Star, Clock, BookOpen, Play, Heart, Download, TrendingUp } from "lucide-react-native";
import { router } from "expo-router";
import {
  audiobookCategories,
  recommendedAudiobooks,
  bestSellerAudiobooks,
  newReleaseAudiobooks,
  audiobooks,
} from "@/data/mockData";
import type { Track } from "@/types";
import { usePlayer } from "@/contexts/PlayerContext";

const { width } = Dimensions.get("window");

export default function AudiobooksScreen() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'title' | 'author' | 'duration' | 'rating'>('title');
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const { playTrack } = usePlayer();

  // Combine all audiobooks for comprehensive display
  const allAudiobooks = useMemo(() => {
    const combined = [
      ...recommendedAudiobooks,
      ...bestSellerAudiobooks,
      ...newReleaseAudiobooks,
      ...audiobooks,
    ];
    // Remove duplicates based on id
    const unique = combined.filter((book, index, self) => 
      index === self.findIndex(b => b.id === book.id)
    );
    return unique;
  }, []);

  // Filter and search audiobooks
  const filteredAudiobooks = useMemo(() => {
    let filtered = allAudiobooks;

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(book => 
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.artist.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply category filter
    if (selectedCategory) {
      // For demo purposes, we'll filter by genre in description or title
      filtered = filtered.filter(book => 
        book.description?.toLowerCase().includes(selectedCategory.toLowerCase()) ||
        book.title.toLowerCase().includes(selectedCategory.toLowerCase())
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'author':
          return a.artist.localeCompare(b.artist);
        case 'duration':
          return (b.duration || 0) - (a.duration || 0);
        case 'rating':
          return Math.random() - 0.5; // Random for demo
        default:
          return 0;
      }
    });

    return filtered;
  }, [allAudiobooks, searchQuery, selectedCategory, sortBy]);

  const handleAudiobookPress = (audiobook: Track) => {
    router.push(`/audiobook/${audiobook.id}`);
  };

  const handlePlayAudiobook = (audiobook: Track) => {
    if (!audiobook?.id?.trim()) return;
    playTrack(audiobook);
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const getRating = () => {
    return (Math.random() * 2 + 3).toFixed(1); // Random rating between 3.0-5.0
  };

  const renderCategory = ({ item }: { item: { id: string; title: string; color: string } }) => (
    <TouchableOpacity
      style={[
        styles.categoryCard, 
        { backgroundColor: selectedCategory === item.id ? '#C53030' : item.color },
        selectedCategory === item.id && styles.selectedCategory
      ]}
      onPress={() => setSelectedCategory(selectedCategory === item.id ? null : item.id)}
      activeOpacity={0.8}
      testID={`category-${item.id}`}
    >
      <Text style={[styles.categoryText, selectedCategory === item.id && styles.selectedCategoryText]}>
        {item.title}
      </Text>
    </TouchableOpacity>
  );

  const renderFeaturedBook = ({ item }: { item: Track }) => (
    <TouchableOpacity
      style={styles.featuredCard}
      onPress={() => handleAudiobookPress(item)}
      activeOpacity={0.8}
      testID={`featured-${item.id}`}
    >
      <Image source={{ uri: item.artwork }} style={styles.featuredImage} />
      <View style={styles.featuredOverlay}>
        <TouchableOpacity 
          style={styles.playButton}
          onPress={() => handlePlayAudiobook(item)}
        >
          <Play size={16} color="#FFF" fill="#FFF" />
        </TouchableOpacity>
      </View>
      <View style={styles.featuredInfo}>
        <Text style={styles.featuredTitle} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.featuredAuthor} numberOfLines={1}>{item.artist}</Text>
        <View style={styles.featuredMeta}>
          <View style={styles.ratingContainer}>
            <Star size={12} color="#FFD700" fill="#FFD700" />
            <Text style={styles.ratingText}>{getRating()}</Text>
          </View>
          <View style={styles.durationContainer}>
            <Clock size={12} color="#999" />
            <Text style={styles.durationText}>{formatDuration(item.duration || 0)}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );



  const renderListBook = ({ item }: { item: Track }) => (
    <TouchableOpacity
      style={styles.listCard}
      onPress={() => handleAudiobookPress(item)}
      activeOpacity={0.8}
      testID={`list-${item.id}`}
    >
      <Image source={{ uri: item.artwork }} style={styles.listImage} />
      <View style={styles.listInfo}>
        <Text style={styles.listTitle} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.listAuthor} numberOfLines={1}>{item.artist}</Text>
        <View style={styles.listMeta}>
          <View style={styles.ratingContainer}>
            <Star size={12} color="#FFD700" fill="#FFD700" />
            <Text style={styles.listRating}>{getRating()}</Text>
          </View>
          <Text style={styles.listDuration}>{formatDuration(item.duration || 0)}</Text>
        </View>
        {item.description && (
          <Text style={styles.listDescription} numberOfLines={2}>{item.description}</Text>
        )}
      </View>
      <TouchableOpacity 
        style={styles.listPlayButton}
        onPress={() => handlePlayAudiobook(item)}
      >
        <Play size={16} color="#C53030" fill="#C53030" />
      </TouchableOpacity>
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
        <Text style={styles.title}>Auralora (Audiobooks)</Text>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowFilters(!showFilters)}
          testID="filter-button"
        >
          <Filter size={20} color="#FFF" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={20} color="#999" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search audiobooks..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
            testID="search-input"
          />
        </View>
      </View>

      {/* Filters */}
      {showFilters && (
        <View style={styles.filtersContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <TouchableOpacity
              style={[styles.sortButton, sortBy === 'title' && styles.activeSortButton]}
              onPress={() => setSortBy('title')}
            >
              <Text style={[styles.sortButtonText, sortBy === 'title' && styles.activeSortButtonText]}>Title</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.sortButton, sortBy === 'author' && styles.activeSortButton]}
              onPress={() => setSortBy('author')}
            >
              <Text style={[styles.sortButtonText, sortBy === 'author' && styles.activeSortButtonText]}>Author</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.sortButton, sortBy === 'duration' && styles.activeSortButton]}
              onPress={() => setSortBy('duration')}
            >
              <Text style={[styles.sortButtonText, sortBy === 'duration' && styles.activeSortButtonText]}>Duration</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.sortButton, sortBy === 'rating' && styles.activeSortButton]}
              onPress={() => setSortBy('rating')}
            >
              <Text style={[styles.sortButtonText, sortBy === 'rating' && styles.activeSortButtonText]}>Rating</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      )}

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Categories */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Categories</Text>
            <TouchableOpacity onPress={() => setSelectedCategory(null)}>
              <Text style={styles.clearText}>Clear</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={audiobookCategories}
            renderItem={renderCategory}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesList}
          />
        </View>

        {/* Featured Audiobooks */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured</Text>
            <View style={styles.statsContainer}>
              <BookOpen size={16} color="#999" />
              <Text style={styles.statsText}>{recommendedAudiobooks.length} books</Text>
            </View>
          </View>
          <FlatList
            data={recommendedAudiobooks}
            renderItem={renderFeaturedBook}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.featuredList}
          />
        </View>

        {/* Best Sellers */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Best Sellers</Text>
            <View style={styles.statsContainer}>
              <TrendingUp size={16} color="#C53030" />
              <Text style={styles.statsText}>{bestSellerAudiobooks.length} trending</Text>
            </View>
          </View>
          <FlatList
            data={bestSellerAudiobooks}
            renderItem={renderFeaturedBook}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.featuredList}
          />
        </View>

        {/* New Releases */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>New Releases</Text>
            <View style={styles.statsContainer}>
              <Clock size={16} color="#38A169" />
              <Text style={styles.statsText}>{newReleaseAudiobooks.length} new</Text>
            </View>
          </View>
          <FlatList
            data={newReleaseAudiobooks}
            renderItem={renderFeaturedBook}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.featuredList}
          />
        </View>

        {/* All Audiobooks Grid */}
        <View style={[styles.section, { paddingBottom: 120 }]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {searchQuery || selectedCategory ? 'Search Results' : 'All Audiobooks'}
            </Text>
            <Text style={styles.countText}>{filteredAudiobooks.length} books</Text>
          </View>
          
          {filteredAudiobooks.length === 0 ? (
            <View style={styles.emptyState}>
              <BookOpen size={48} color="#666" />
              <Text style={styles.emptyStateTitle}>No audiobooks found</Text>
              <Text style={styles.emptyStateText}>
                {searchQuery ? 'Try adjusting your search terms' : 'No audiobooks match your filters'}
              </Text>
            </View>
          ) : (
            <FlatList
              data={filteredAudiobooks}
              renderItem={renderListBook}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              contentContainerStyle={styles.listContainer}
            />
          )}
        </View>
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
    backgroundColor: "#1A1A1A",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "700" as const,
    color: "#FFF",
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#1A1A1A",
    justifyContent: "center",
    alignItems: "center",
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingBottom: 16,
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
  filtersContainer: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  sortButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#1A1A1A",
    marginRight: 12,
  },
  activeSortButton: {
    backgroundColor: "#C53030",
  },
  sortButtonText: {
    color: "#999",
    fontSize: 14,
    fontWeight: "600" as const,
  },
  activeSortButtonText: {
    color: "#FFF",
  },
  section: {
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: "#FFF",
  },
  clearText: {
    fontSize: 14,
    color: "#C53030",
    fontWeight: "600" as const,
  },
  countText: {
    fontSize: 14,
    color: "#999",
    fontWeight: "500" as const,
  },
  statsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  statsText: {
    fontSize: 14,
    color: "#999",
    marginLeft: 6,
  },
  categoriesList: {
    paddingHorizontal: 20,
  },
  categoryCard: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    marginRight: 12,
  },
  selectedCategory: {
    borderWidth: 2,
    borderColor: "#FFF",
  },
  categoryText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "600" as const,
  },
  selectedCategoryText: {
    fontWeight: "700" as const,
  },
  featuredList: {
    paddingHorizontal: 20,
  },
  featuredCard: {
    marginRight: 16,
    width: 160,
  },
  featuredImage: {
    width: 160,
    height: 220,
    borderRadius: 12,
  },
  featuredOverlay: {
    position: "absolute",
    top: 8,
    right: 8,
  },
  playButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(197, 48, 48, 0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  featuredInfo: {
    marginTop: 12,
  },
  featuredTitle: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "700" as const,
    marginBottom: 4,
  },
  featuredAuthor: {
    color: "#999",
    fontSize: 12,
    marginBottom: 8,
  },
  featuredMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    color: "#FFD700",
    fontSize: 12,
    marginLeft: 4,
    fontWeight: "600" as const,
  },
  durationContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  durationText: {
    color: "#999",
    fontSize: 12,
    marginLeft: 4,
  },
  listContainer: {
    paddingHorizontal: 20,
  },
  listCard: {
    flexDirection: "row",
    backgroundColor: "#1A1A1A",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: "center",
  },
  listImage: {
    width: 60,
    height: 80,
    borderRadius: 8,
    marginRight: 16,
  },
  listInfo: {
    flex: 1,
  },
  listTitle: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "700" as const,
    marginBottom: 4,
  },
  listAuthor: {
    color: "#999",
    fontSize: 14,
    marginBottom: 6,
  },
  listMeta: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  listRating: {
    color: "#FFD700",
    fontSize: 12,
    marginLeft: 4,
    marginRight: 12,
    fontWeight: "600" as const,
  },
  listDuration: {
    color: "#999",
    fontSize: 12,
  },
  listDescription: {
    color: "#CCC",
    fontSize: 12,
    lineHeight: 16,
  },
  listPlayButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(197, 48, 48, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 12,
  },

  emptyState: {
    alignItems: "center",
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyStateTitle: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "700" as const,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    color: "#999",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
});