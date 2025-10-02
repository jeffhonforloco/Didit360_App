import React, { useState, useMemo } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft, Search, TrendingUp, Star, Music2, Users } from "lucide-react-native";
import { router } from "expo-router";
import { searchArtists, allTracks } from "@/data/mockData";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 60) / 2;

interface Artist {
  id: string;
  name: string;
  image: string;
  followers: string;
  verified: boolean;
  genre?: string;
  monthlyListeners?: string;
}

const FILTER_OPTIONS = [
  { id: "all", label: "All Artists", icon: Users },
  { id: "trending", label: "Trending", icon: TrendingUp },
  { id: "popular", label: "Popular", icon: Star },
  { id: "following", label: "Following", icon: Music2 },
] as const;

export default function ArtistsScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<string>("all");

  const allArtists = useMemo(() => {
    const artistMap = new Map<string, Artist>();
    
    searchArtists.forEach((artist) => {
      if (!artistMap.has(artist.id)) {
        artistMap.set(artist.id, {
          id: artist.id,
          name: artist.name,
          image: artist.image,
          followers: artist.followers,
          verified: artist.verified,
          monthlyListeners: artist.followers,
        });
      }
    });

    allTracks.forEach((track) => {
      const artistId = `artist-${track.artist.toLowerCase().replace(/\s+/g, "-")}`;
      if (!artistMap.has(artistId)) {
        artistMap.set(artistId, {
          id: artistId,
          name: track.artist,
          image: track.artwork || "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
          followers: `${Math.floor(Math.random() * 50 + 10)}M`,
          verified: Math.random() > 0.3,
          monthlyListeners: `${Math.floor(Math.random() * 80 + 20)}M`,
        });
      }
    });

    return Array.from(artistMap.values());
  }, []);

  const filteredArtists = useMemo(() => {
    let filtered = allArtists;

    if (searchQuery) {
      filtered = filtered.filter((artist) =>
        artist.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedFilter === "trending") {
      filtered = filtered.slice(0, 12);
    } else if (selectedFilter === "popular") {
      filtered = [...filtered].sort((a, b) => {
        const aFollowers = parseFloat(a.followers.replace(/[^0-9.]/g, ""));
        const bFollowers = parseFloat(b.followers.replace(/[^0-9.]/g, ""));
        return bFollowers - aFollowers;
      });
    } else if (selectedFilter === "following") {
      filtered = filtered.filter((artist) => artist.verified).slice(0, 8);
    }

    return filtered;
  }, [allArtists, searchQuery, selectedFilter]);

  const featuredArtists = useMemo(() => {
    return allArtists.slice(0, 3);
  }, [allArtists]);

  const renderArtistCard = (artist: Artist) => (
    <TouchableOpacity
      key={artist.id}
      style={styles.artistCard}
      onPress={() => router.push(`/artist/${artist.id}`)}
      activeOpacity={0.8}
      testID={`artist-${artist.id}`}
    >
      <Image source={{ uri: artist.image }} style={styles.artistImage} />
      <View style={styles.artistInfo}>
        <Text style={styles.artistName} numberOfLines={1}>
          {artist.name}
        </Text>
        <Text style={styles.artistFollowers} numberOfLines={1}>
          {artist.monthlyListeners || artist.followers} listeners
        </Text>
      </View>
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
        <Text style={styles.title}>Artists</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Search size={20} color="#999" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search artists..."
              placeholderTextColor="#999"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterContainer}
        >
          {FILTER_OPTIONS.map((filter) => {
            const Icon = filter.icon;
            const isSelected = selectedFilter === filter.id;
            return (
              <TouchableOpacity
                key={filter.id}
                style={[
                  styles.filterChip,
                  isSelected && styles.filterChipActive,
                ]}
                onPress={() => setSelectedFilter(filter.id)}
                activeOpacity={0.7}
              >
                <Icon
                  size={16}
                  color={isSelected ? "#FFF" : "#999"}
                  style={styles.filterIcon}
                />
                <Text
                  style={[
                    styles.filterText,
                    isSelected && styles.filterTextActive,
                  ]}
                >
                  {filter.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {!searchQuery && selectedFilter === "all" && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Featured Artists</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.featuredContainer}
            >
              {featuredArtists.map((artist) => (
                <TouchableOpacity
                  key={artist.id}
                  style={styles.featuredCard}
                  onPress={() => router.push(`/artist/${artist.id}`)}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={["#E91E63", "#9C27B0"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.featuredGradient}
                  >
                    <Image
                      source={{ uri: artist.image }}
                      style={styles.featuredImage}
                    />
                    <View style={styles.featuredInfo}>
                      <Text style={styles.featuredName} numberOfLines={1}>
                        {artist.name}
                      </Text>
                      <Text style={styles.featuredFollowers} numberOfLines={1}>
                        {artist.monthlyListeners || artist.followers} listeners
                      </Text>
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {selectedFilter === "all"
              ? "All Artists"
              : FILTER_OPTIONS.find((f) => f.id === selectedFilter)?.label}
          </Text>
          <Text style={styles.sectionSubtitle}>
            {filteredArtists.length} {filteredArtists.length === 1 ? "artist" : "artists"}
          </Text>
        </View>

        <View style={styles.grid}>
          {filteredArtists.map((artist) => renderArtistCard(artist))}
        </View>

        {filteredArtists.length === 0 && (
          <View style={styles.emptyState}>
            <Music2 size={64} color="#333" />
            <Text style={styles.emptyText}>No artists found</Text>
            <Text style={styles.emptySubtext}>
              Try adjusting your search or filters
            </Text>
          </View>
        )}

        <View style={styles.bottomSpacer} />
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
    paddingTop: 16,
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
    fontSize: 24,
    fontWeight: "700" as const,
    color: "#FFF",
  },
  placeholder: {
    width: 40,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
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
    color: "#FFF",
    fontSize: 16,
  },
  filterContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 12,
  },
  filterChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1A1A1A",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 8,
  },
  filterChipActive: {
    backgroundColor: "#E91E63",
  },
  filterIcon: {
    marginRight: 4,
  },
  filterText: {
    color: "#999",
    fontSize: 14,
    fontWeight: "600" as const,
  },
  filterTextActive: {
    color: "#FFF",
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "700" as const,
    color: "#FFF",
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: "#999",
  },
  featuredContainer: {
    paddingHorizontal: 20,
    gap: 16,
  },
  featuredCard: {
    width: 280,
    height: 160,
    borderRadius: 16,
    overflow: "hidden",
  },
  featuredGradient: {
    flex: 1,
    padding: 20,
    justifyContent: "space-between",
  },
  featuredImage: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.3,
  },
  featuredInfo: {
    marginTop: "auto",
  },
  featuredName: {
    fontSize: 24,
    fontWeight: "700" as const,
    color: "#FFF",
    marginBottom: 4,
  },
  featuredFollowers: {
    fontSize: 14,
    color: "#FFF",
    opacity: 0.8,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 20,
    gap: 16,
  },
  artistCard: {
    width: CARD_WIDTH,
    marginBottom: 8,
  },
  artistImage: {
    width: CARD_WIDTH,
    height: CARD_WIDTH,
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: "#1A1A1A",
  },
  artistInfo: {
    gap: 4,
  },
  artistName: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600" as const,
  },
  artistFollowers: {
    color: "#999",
    fontSize: 13,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: "600" as const,
    color: "#FFF",
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
  },
  bottomSpacer: {
    height: 40,
  },
});