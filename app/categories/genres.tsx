import React, { useState, useMemo } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  FlatList,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft, Search, X } from "lucide-react-native";
import { router } from "expo-router";
import { allGenres, genresData } from "@/data/genresData";



export default function GenresScreen() {
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredGenres = useMemo(() => {
    if (!searchQuery.trim()) {
      return allGenres;
    }
    const query = searchQuery.toLowerCase().trim();
    return allGenres.filter((genre) => {
      const genreInfo = genresData[genre];
      return (
        genreInfo.name.toLowerCase().includes(query) ||
        genreInfo.description.toLowerCase().includes(query) ||
        genreInfo.subgenres.some((sub) => sub.toLowerCase().includes(query))
      );
    });
  }, [searchQuery]);

  const renderGenre = ({ item }: { item: string }) => {
    const genreInfo = genresData[item];
    return (
      <TouchableOpacity
        style={[
          styles.genreCard,
          { backgroundColor: genreInfo.color },
        ]}
        activeOpacity={0.8}
        testID={`genre-${item}`}
        onPress={() => router.push(`/genre/${encodeURIComponent(item)}` as any)}
      >
        <View style={styles.genreCardContent}>
          <Text style={styles.genreText}>{genreInfo.name}</Text>
          <Text style={styles.genreSubtext} numberOfLines={2}>
            {genreInfo.description}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

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
        <Text style={styles.title}>Browse Genres</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.description}>
          <Text style={styles.descriptionText}>
            Explore music by genre. Discover new artists, tracks, and playlists across all your favorite styles.
          </Text>
        </View>

        <View style={styles.searchContainer}>
          <View style={styles.searchInputWrapper}>
            <Search size={20} color="#888" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search genres..."
              placeholderTextColor="#888"
              value={searchQuery}
              onChangeText={setSearchQuery}
              testID="genre-search-input"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity
                onPress={() => setSearchQuery("")}
                style={styles.clearButton}
                testID="clear-search-button"
              >
                <X size={18} color="#888" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {filteredGenres.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              No genres found matching &quot;{searchQuery}&quot;
            </Text>
          </View>
        ) : (
          <FlatList
            data={filteredGenres}
            renderItem={renderGenre}
            keyExtractor={(item) => `genre-${item}`}
            numColumns={2}
            columnWrapperStyle={styles.row}
            scrollEnabled={false}
            contentContainerStyle={styles.grid}
          />
        )}
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
    fontWeight: "700",
    color: "#FFF",
  },
  placeholder: {
    width: 40,
  },
  grid: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  row: {
    justifyContent: "space-between",
  },
  description: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  descriptionText: {
    fontSize: 14,
    color: "#B3B3B3",
    lineHeight: 20,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  searchInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1A1A1A",
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 48,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#FFF",
    paddingVertical: 0,
  },
  clearButton: {
    padding: 4,
    marginLeft: 8,
  },
  emptyState: {
    paddingHorizontal: 20,
    paddingVertical: 40,
    alignItems: "center",
  },
  emptyStateText: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
  },
  genreCard: {
    width: "48%",
    minHeight: 140,
    borderRadius: 12,
    marginBottom: 16,
    overflow: "hidden",
  },
  genreCardContent: {
    flex: 1,
    padding: 16,
    justifyContent: "flex-end",
  },
  genreText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFF",
    marginBottom: 4,
  },
  genreSubtext: {
    fontSize: 11,
    color: "rgba(255, 255, 255, 0.8)",
    lineHeight: 14,
  },
});