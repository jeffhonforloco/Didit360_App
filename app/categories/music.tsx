import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft, Play } from "lucide-react-native";
import { router } from "expo-router";
import { usePlayer } from "@/contexts/PlayerContext";
import { featuredContent, topCharts, newReleases, trendingNow, genres } from "@/data/mockData";
import type { Track } from "@/types";

export default function MusicCategoryScreen() {
  const { playTrack } = usePlayer();

  const allMusicTracks = React.useMemo(() => [
    ...featuredContent,
    ...topCharts,
    ...newReleases,
    ...trendingNow,
  ], []);

  const renderTrack = ({ item }: { item: Track }) => (
    <TouchableOpacity
      style={styles.trackItem}
      onPress={() => playTrack(item)}
      activeOpacity={0.8}
      testID={`track-${item.id}`}
    >
      <Image source={{ uri: item.artwork }} style={styles.trackImage} />
      <View style={styles.trackInfo}>
        <Text style={styles.trackTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.trackArtist} numberOfLines={1}>
          {item.artist}
        </Text>
      </View>
      <TouchableOpacity 
        style={styles.playButton} 
        onPress={() => playTrack(item)}
        testID={`play-${item.id}`}
      >
        <Play size={16} color="#FFF" fill="#FFF" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderGenre = ({ item }: { item: string }) => (
    <TouchableOpacity 
      style={styles.genrePill} 
      onPress={() => console.log("Genre", item)} 
      testID={`genre-${item}`}
    >
      <Text style={styles.genreText}>{item}</Text>
    </TouchableOpacity>
  );

  const renderFeaturedTrack = ({ item }: { item: Track }) => (
    <TouchableOpacity
      style={styles.featuredCard}
      onPress={() => playTrack(item)}
      activeOpacity={0.8}
      testID={`featured-${item.id}`}
    >
      <Image source={{ uri: item.artwork }} style={styles.featuredImage} />
      <View style={styles.featuredOverlay}>
        <Text style={styles.featuredTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.featuredArtist} numberOfLines={1}>
          {item.artist}
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
        <Text style={styles.title}>Music</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Featured Music</Text>
          <FlatList
            data={featuredContent}
            renderItem={renderFeaturedTrack}
            keyExtractor={(item) => `featured-${item.id}`}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Browse by Genre</Text>
          <FlatList
            data={genres}
            renderItem={renderGenre}
            keyExtractor={(item) => `genre-${item}`}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={[styles.horizontalList, styles.genreList]}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>All Music</Text>
          <FlatList
            data={allMusicTracks}
            renderItem={renderTrack}
            keyExtractor={(item) => `music-${item.id}`}
            scrollEnabled={false}
            contentContainerStyle={styles.tracksList}
          />
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
    fontWeight: "700",
    color: "#FFF",
  },
  placeholder: {
    width: 40,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFF",
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  horizontalList: {
    paddingHorizontal: 20,
  },
  featuredCard: {
    width: 200,
    height: 200,
    marginRight: 16,
    borderRadius: 12,
    overflow: "hidden",
    position: "relative",
  },
  featuredImage: {
    width: "100%",
    height: "100%",
  },
  featuredOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  featuredTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFF",
    marginBottom: 2,
  },
  featuredArtist: {
    fontSize: 12,
    color: "#CCC",
  },
  genreList: {
    paddingVertical: 8,
  },
  genrePill: {
    backgroundColor: "#17162A",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    marginRight: 10,
  },
  genreText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "600",
  },
  tracksList: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  trackItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  trackImage: {
    width: 56,
    height: 56,
    borderRadius: 8,
    marginRight: 12,
  },
  trackInfo: {
    flex: 1,
  },
  trackTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFF",
    marginBottom: 4,
  },
  trackArtist: {
    fontSize: 14,
    color: "#999",
  },
  playButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#FF0080",
    justifyContent: "center",
    alignItems: "center",
  },
});