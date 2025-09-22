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
import { SafeAreaView } from "react-native-safe-area-context";
import { Search, X } from "lucide-react-native";
import { usePlayer } from "@/contexts/PlayerContext";
import { allTracks, genres } from "@/data/mockData";
import type { Track } from "@/types";

const genreColors = [
  "#FF0080",
  "#8B5CF6",
  "#3B82F6",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#EC4899",
  "#6366F1",
];

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const { playTrack } = usePlayer();

  const filteredTracks = allTracks.filter(
    (track) =>
      track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      track.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
      track.album?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderGenre = ({ item, index }: { item: string; index: number }) => (
    <TouchableOpacity
      style={[
        styles.genreCard,
        { backgroundColor: genreColors[index % genreColors.length] },
      ]}
      activeOpacity={0.8}
    >
      <Text style={styles.genreText}>{item}</Text>
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
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.title}>Search</Text>
        <View style={styles.searchBar}>
          <Search size={20} color="#999" />
          <TextInput
            style={styles.searchInput}
            placeholder="What do you want to listen to?"
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
              data={genres}
              renderItem={renderGenre}
              keyExtractor={(item) => item}
              numColumns={2}
              columnWrapperStyle={styles.genreRow}
              scrollEnabled={false}
            />
          </View>
        )}
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
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 16,
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
  genreRow: {
    justifyContent: "space-between",
  },
  genreCard: {
    flex: 0.48,
    height: 100,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    justifyContent: "flex-end",
  },
  genreText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFF",
  },
});