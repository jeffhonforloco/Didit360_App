import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Search, X, MoreHorizontal } from "lucide-react-native";
import { usePlayer } from "@/contexts/PlayerContext";
import { allTracks } from "@/data/mockData";
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

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const { playTrack } = usePlayer();
  const insets = useSafeAreaInsets();

  const filteredTracks = allTracks.filter(
    (track) =>
      track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      track.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
      track.album?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderCategory = ({ item }: { item: typeof browseCategories[0] }) => (
    <TouchableOpacity
      style={[styles.categoryCard, { backgroundColor: item.color }]}
      activeOpacity={0.8}
    >
      <Text style={styles.categoryText}>{item.name}</Text>
      <Image source={{ uri: item.image }} style={styles.categoryImage} />
    </TouchableOpacity>
  );

  const renderSearchResult = ({ item }: { item: Track }) => (
    <TouchableOpacity
      style={styles.searchResult}
      onPress={() => playTrack(item)}
      activeOpacity={0.8}
    >
      <Image source={{ uri: item.artwork }} style={styles.resultImage} />
      <View style={styles.resultInfo}>
        <Text style={styles.resultTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.resultArtist} numberOfLines={1}>
          {item.type === "song"
            ? `${item.artist} • ${item.album || "Single"}`
            : item.type === "podcast"
            ? `Podcast • ${item.artist}`
            : `Audiobook • ${item.artist}`}
        </Text>
      </View>
    </TouchableOpacity>
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
            style={styles.searchInput}
            placeholder="Artists, Songs, Podcasts, & More"
            placeholderTextColor="#666"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
            autoCorrect={false}
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
            <Text style={styles.resultsTitle}>
              {filteredTracks.length} Results
            </Text>
            <FlatList
              data={filteredTracks}
              renderItem={renderSearchResult}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
            />
          </View>
        ) : (
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
        )}
      </ScrollView>
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
});