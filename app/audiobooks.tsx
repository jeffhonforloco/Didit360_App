import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Image,
  StyleSheet,
  Dimensions,
  TextInput,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, router } from "expo-router";
import { ArrowLeft, Search, Filter, Star, Clock, BookOpen, Play, Pause } from "lucide-react-native";
import { usePlayer } from "@/contexts/PlayerContext";
import { useUser } from "@/contexts/UserContext";
import {
  audiobooks,
  audiobookCategories,
  recommendedAudiobooks,
  bestSellerAudiobooks,
  newReleaseAudiobooks,
  audiobookDetails,
} from "@/data/mockData";
import type { Track } from "@/types";



interface AudiobookCardProps {
  audiobook: Track;
  size?: "small" | "medium" | "large";
  showProgress?: boolean;
}

const AudiobookCard: React.FC<AudiobookCardProps> = ({ 
  audiobook, 
  size = "medium", 
  showProgress = false 
}) => {
  const { playTrack, currentTrack, isPlaying } = usePlayer();
  const isCurrentTrack = currentTrack?.id === audiobook.id;
  
  const { width } = Dimensions.get("window");
  const itemWidth = (width - 60) / 2;
  const largeItemWidth = width - 40;
  
  const cardWidth = size === "large" ? largeItemWidth : size === "small" ? 120 : itemWidth;
  const imageHeight = size === "large" ? 120 : size === "small" ? 160 : 200;
  
  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const handlePress = () => {
    if (isCurrentTrack && isPlaying) {
      // Navigate to audiobook player for detailed view
      router.push(`/audiobook/${audiobook.id}`);
    } else {
      playTrack(audiobook);
    }
  };

  const handlePlayPress = (e: any) => {
    e.stopPropagation();
    playTrack(audiobook);
  };

  return (
    <TouchableOpacity
      style={[styles.audiobookCard, { width: cardWidth }]}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <View style={[styles.audiobookImageContainer, { height: imageHeight }]}>
        <Image
          source={{ uri: audiobook.artwork }}
          style={[styles.audiobookImage, { height: imageHeight }]}
          resizeMode="cover"
        />
        
        {/* Play Button Overlay */}
        <TouchableOpacity
          style={styles.playButton}
          onPress={handlePlayPress}
          activeOpacity={0.8}
        >
          {isCurrentTrack && isPlaying ? (
            <Pause size={20} color="#FFFFFF" />
          ) : (
            <Play size={20} color="#FFFFFF" />
          )}
        </TouchableOpacity>
        
        {/* Progress Bar for currently playing */}
        {showProgress && isCurrentTrack && (
          <View style={styles.progressContainer}>
            <View style={[styles.progressBar, styles.progressBarWidth]} />
          </View>
        )}
      </View>
      
      <View style={styles.audiobookInfo}>
        <Text style={styles.audiobookTitle} numberOfLines={2}>
          {audiobook.title}
        </Text>
        <Text style={styles.audiobookAuthor} numberOfLines={1}>
          {audiobook.artist}
        </Text>
        
        {size !== "small" && (
          <View style={styles.audiobookMeta}>
            <View style={styles.metaItem}>
              <Clock size={12} color="#888" />
              <Text style={styles.metaText}>
                {formatDuration(audiobook.duration)}
              </Text>
            </View>
            
            {audiobookDetails[audiobook.id] && (
              <View style={styles.metaItem}>
                <Star size={12} color="#FFD700" />
                <Text style={styles.metaText}>
                  {audiobookDetails[audiobook.id].rating}
                </Text>
              </View>
            )}
          </View>
        )}
        
        {audiobook.description && size === "large" && (
          <Text style={styles.audiobookDescription} numberOfLines={2}>
            {audiobook.description}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

interface CategoryChipProps {
  category: { id: string; title: string; color: string };
  isSelected: boolean;
  onPress: () => void;
}

const CategoryChip: React.FC<CategoryChipProps> = ({ category, isSelected, onPress }) => (
  <TouchableOpacity
    style={[
      styles.categoryChip,
      isSelected && { backgroundColor: category.color },
    ]}
    onPress={onPress}
    activeOpacity={0.8}
  >
    <Text
      style={[
        styles.categoryChipText,
        isSelected && { color: "#FFFFFF" },
      ]}
    >
      {category.title}
    </Text>
  </TouchableOpacity>
);

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  onSeeAll?: () => void;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title, subtitle, onSeeAll }) => (
  <View style={styles.sectionHeader}>
    <View>
      <Text style={styles.sectionTitle}>{title}</Text>
      {subtitle && <Text style={styles.sectionSubtitle}>{subtitle}</Text>}
    </View>
    {onSeeAll && (
      <TouchableOpacity onPress={onSeeAll} activeOpacity={0.8}>
        <Text style={styles.seeAllText}>See All</Text>
      </TouchableOpacity>
    )}
  </View>
);

export default function AudiobooksScreen() {
  const { settings } = useUser();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [showFilters, setShowFilters] = useState<boolean>(false);
  
  const accentColor = settings?.accentColor ?? "#FF0080";
  
  // Filter audiobooks based on search and category
  const filteredAudiobooks = useMemo(() => {
    const filtered = [...audiobooks, ...recommendedAudiobooks, ...bestSellerAudiobooks, ...newReleaseAudiobooks];
    
    // Remove duplicates
    let uniqueAudiobooks = filtered.filter((book, index, self) => 
      index === self.findIndex(b => b.id === book.id)
    );
    
    if (searchQuery && searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      uniqueAudiobooks = uniqueAudiobooks.filter(
        (book) =>
          book.title.toLowerCase().includes(query) ||
          book.artist.toLowerCase().includes(query)
      );
    }
    
    if (selectedCategory !== "all") {
      // Filter by category if we had category data
      // For now, return all since we don't have category mapping
    }
    
    return uniqueAudiobooks;
  }, [searchQuery, selectedCategory]);
  
  const handleCategoryPress = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };
  
  const handleSearch = (text: string) => {
    if (text.length > 100) return;
    setSearchQuery(text.trim());
  };
  
  const renderAudiobookItem = ({ item }: { item: Track }) => (
    <AudiobookCard audiobook={item} size="medium" />
  );
  
  const renderFeaturedItem = ({ item }: { item: Track }) => (
    <AudiobookCard audiobook={item} size="large" showProgress />
  );
  
  const renderRecommendedItem = ({ item }: { item: Track }) => (
    <AudiobookCard audiobook={item} size="small" />
  );

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.8}
        >
          <ArrowLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Auralora (Audiobooks)</Text>
        
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowFilters(!showFilters)}
          activeOpacity={0.8}
        >
          <Filter size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={20} color="#888" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search audiobooks, authors..."
            placeholderTextColor="#888"
            value={searchQuery}
            onChangeText={handleSearch}
          />
        </View>
      </View>
      
      {/* Categories */}
      {showFilters && (
        <View style={styles.categoriesContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesContent}
          >
            <CategoryChip
              category={{ id: "all", title: "All", color: accentColor }}
              isSelected={selectedCategory === "all"}
              onPress={() => handleCategoryPress("all")}
            />
            {audiobookCategories.map((category) => (
              <CategoryChip
                key={category.id}
                category={category}
                isSelected={selectedCategory === category.id}
                onPress={() => handleCategoryPress(category.id)}
              />
            ))}
          </ScrollView>
        </View>
      )}
      
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Featured Audiobook */}
        {!searchQuery && (
          <View style={styles.section}>
            <SectionHeader
              title="Featured"
              subtitle="Editor's pick for you"
            />
            <FlatList
              data={bestSellerAudiobooks.slice(0, 3)}
              renderItem={renderFeaturedItem}
              keyExtractor={(item) => `featured-${item.id}`}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalList}
              ItemSeparatorComponent={() => <View style={styles.horizontalSeparator} />}
            />
          </View>
        )}
        
        {/* Recommended */}
        {!searchQuery && (
          <View style={styles.section}>
            <SectionHeader
              title="Recommended for You"
              subtitle="Based on your listening history"
              onSeeAll={() => console.log("See all recommended")}
            />
            <FlatList
              data={recommendedAudiobooks}
              renderItem={renderRecommendedItem}
              keyExtractor={(item) => `recommended-${item.id}`}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalList}
              ItemSeparatorComponent={() => <View style={styles.smallHorizontalSeparator} />}
            />
          </View>
        )}
        
        {/* New Releases */}
        {!searchQuery && (
          <View style={styles.section}>
            <SectionHeader
              title="New Releases"
              subtitle="Latest audiobooks"
              onSeeAll={() => console.log("See all new releases")}
            />
            <FlatList
              data={newReleaseAudiobooks}
              renderItem={renderRecommendedItem}
              keyExtractor={(item) => `new-${item.id}`}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalList}
              ItemSeparatorComponent={() => <View style={styles.smallHorizontalSeparator} />}
            />
          </View>
        )}
        
        {/* All Audiobooks / Search Results */}
        <View style={styles.section}>
          <SectionHeader
            title={searchQuery ? `Search Results (${filteredAudiobooks.length})` : "All Audiobooks"}
            subtitle={searchQuery ? `Results for "${searchQuery}"` : "Discover your next great listen"}
          />
          
          {filteredAudiobooks.length === 0 ? (
            <View style={styles.emptyState}>
              <BookOpen size={48} color="#666" />
              <Text style={styles.emptyStateTitle}>
                {searchQuery ? "No audiobooks found" : "No audiobooks available"}
              </Text>
              <Text style={styles.emptyStateSubtitle}>
                {searchQuery 
                  ? "Try adjusting your search terms" 
                  : "Check back later for new releases"}
              </Text>
            </View>
          ) : (
            <FlatList
              data={filteredAudiobooks}
              renderItem={renderAudiobookItem}
              keyExtractor={(item) => `all-${item.id}`}
              numColumns={2}
              scrollEnabled={false}
              contentContainerStyle={styles.gridList}
              columnWrapperStyle={styles.gridRow}
              ItemSeparatorComponent={() => <View style={styles.verticalSeparator} />}
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
    backgroundColor: "#0A0A0A",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#1A1A1A",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#1A1A1A",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#1A1A1A",
    alignItems: "center",
    justifyContent: "center",
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1A1A1A",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#FFFFFF",
    ...Platform.select({
      web: {
        outlineStyle: "none",
      },
    }),
  },
  categoriesContainer: {
    paddingVertical: 8,
  },
  categoriesContent: {
    paddingHorizontal: 20,
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#1A1A1A",
    borderWidth: 1,
    borderColor: "#333",
  },
  categoryChipText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: "#888",
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FF0080",
  },
  horizontalList: {
    paddingHorizontal: 20,
  },
  gridList: {
    paddingHorizontal: 20,
  },
  gridRow: {
    justifyContent: "space-between",
  },
  audiobookCard: {
    backgroundColor: "#1A1A1A",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 8,
  },
  audiobookImageContainer: {
    position: "relative",
    width: "100%",
  },
  audiobookImage: {
    width: "100%",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  playButton: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    alignItems: "center",
    justifyContent: "center",
  },
  progressContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#FF0080",
  },
  audiobookInfo: {
    padding: 12,
  },
  audiobookTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 4,
    lineHeight: 20,
  },
  audiobookAuthor: {
    fontSize: 14,
    color: "#888",
    marginBottom: 8,
  },
  audiobookMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 4,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: "#888",
  },
  audiobookDescription: {
    fontSize: 12,
    color: "#AAA",
    lineHeight: 16,
    marginTop: 4,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
    marginTop: 16,
    marginBottom: 8,
    textAlign: "center",
  },
  emptyStateSubtitle: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
    lineHeight: 20,
  },
  horizontalSeparator: {
    width: 16,
  },
  smallHorizontalSeparator: {
    width: 12,
  },
  verticalSeparator: {
    height: 20,
  },
  progressBarWidth: {
    width: '35%',
  },
});