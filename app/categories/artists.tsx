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
import { ArrowLeft } from "lucide-react-native";
import { router } from "expo-router";
import { usePlayer } from "@/contexts/PlayerContext";
import { featuredContent, topCharts, newReleases } from "@/data/mockData";
import type { Track } from "@/types";

export default function ArtistsScreen() {
  const { playTrack } = usePlayer();

  const favoriteArtists = React.useMemo(() => {
    const byArtist: Record<string, Track> = {};
    [...featuredContent, ...topCharts, ...newReleases].forEach((t) => {
      if (!byArtist[t.artist]) byArtist[t.artist] = t;
    });
    return Object.values(byArtist);
  }, []);

  const renderArtist = ({ item }: { item: Track }) => (
    <TouchableOpacity
      style={styles.artistCard}
      onPress={() => playTrack(item)}
      activeOpacity={0.8}
      testID={`artist-${item.artist}`}
    >
      <Image source={{ uri: item.artwork }} style={styles.artistImage} />
      <Text style={styles.artistName} numberOfLines={1}>
        {item.artist}
      </Text>
      <Text style={styles.artistInfo} numberOfLines={1}>
        Artist
      </Text>
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
        <Text style={styles.title}>Favorite Artists</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <FlatList
          data={favoriteArtists}
          renderItem={renderArtist}
          keyExtractor={(item) => `artist-${item.id}`}
          numColumns={2}
          columnWrapperStyle={styles.row}
          scrollEnabled={false}
          contentContainerStyle={styles.grid}
        />
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
  artistCard: {
    width: "48%",
    marginBottom: 20,
  },
  artistImage: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 12,
    marginBottom: 8,
  },
  artistName: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },
  artistInfo: {
    color: "#999",
    fontSize: 12,
  },
});