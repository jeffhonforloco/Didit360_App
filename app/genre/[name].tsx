import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft, Play, MoreVertical, Music2, Disc3, ListMusic } from "lucide-react-native";
import { router, useLocalSearchParams } from "expo-router";
import { genresData } from "@/data/genresData";
import type { Track } from "@/types";



export default function GenreScreen() {
  const { name } = useLocalSearchParams<{ name: string }>();
  const genreName = Array.isArray(name) ? name[0] : name || "";
  const decodedGenreName = decodeURIComponent(genreName);
  const [activeTab, setActiveTab] = useState<"tracks" | "artists" | "playlists" | "albums">("tracks");
  
  const genreData = genresData[decodedGenreName];
  
  if (!genreData) {
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
          <Text style={styles.title}>Genre Not Found</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>This genre is not available.</Text>
        </View>
      </SafeAreaView>
    );
  }
  
  const tracks = genreData.tracks;
  const genreColor = genreData.color;

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const renderTrack = ({ item, index }: { item: Track; index: number }) => (
    <TouchableOpacity
      style={styles.trackItem}
      activeOpacity={0.7}
      testID={`track-${item.id}`}
      onPress={() => {
        console.log("Playing track:", item.title);
        // Navigate to player or start playback
      }}
    >
      <View style={styles.trackNumber}>
        <Text style={styles.trackNumberText}>{index + 1}</Text>
      </View>
      
      <Image source={{ uri: item.artwork }} style={styles.trackArtwork} />
      
      <View style={styles.trackInfo}>
        <Text style={styles.trackTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.trackArtist} numberOfLines={1}>
          {item.artist}
        </Text>
      </View>
      
      <Text style={styles.trackDuration}>
        {formatDuration(item.duration)}
      </Text>
      
      <TouchableOpacity style={styles.moreButton} testID={`more-${item.id}`}>
        <MoreVertical size={20} color="#B3B3B3" />
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
        <Text style={styles.title}>{decodedGenreName}</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Genre Header */}
        <View style={[styles.genreHeader, { backgroundColor: genreColor }]}>
          <View style={styles.genreHeaderContent}>
            <Text style={styles.genreTitle}>{genreData.name}</Text>
            <Text style={styles.genreDescription}>
              {genreData.description}
            </Text>
            
            <TouchableOpacity 
              style={styles.playAllButton}
              activeOpacity={0.8}
              testID="play-all-button"
              onPress={() => console.log("Playing all", decodedGenreName, "tracks")}
            >
              <Play size={20} color="#FFF" fill="#FFF" />
              <Text style={styles.playAllText}>Play All</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Subgenres */}
        <View style={styles.subgenresSection}>
          <Text style={styles.sectionTitle}>Subgenres</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.subgenresContainer}>
              {genreData.subgenres.map((subgenre, index) => (
                <View key={index} style={styles.subgenreChip}>
                  <Text style={styles.subgenreText}>{subgenre}</Text>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Top Artists */}
        <View style={styles.artistsSection}>
          <Text style={styles.sectionTitle}>Top Artists</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.artistsContainer}>
              {genreData.topArtists.map((artist) => (
                <TouchableOpacity
                  key={artist.id}
                  style={styles.artistCard}
                  activeOpacity={0.7}
                  onPress={() => console.log("Navigate to artist:", artist.name)}
                >
                  <Image source={{ uri: artist.image }} style={styles.artistImage} />
                  <Text style={styles.artistName} numberOfLines={1}>{artist.name}</Text>
                  <Text style={styles.artistFollowers}>{artist.followers}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === "tracks" && styles.activeTab]}
            onPress={() => setActiveTab("tracks")}
          >
            <Music2 size={18} color={activeTab === "tracks" ? genreColor : "#B3B3B3"} />
            <Text style={[styles.tabText, activeTab === "tracks" && { color: genreColor }]}>
              Tracks
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === "playlists" && styles.activeTab]}
            onPress={() => setActiveTab("playlists")}
          >
            <ListMusic size={18} color={activeTab === "playlists" ? genreColor : "#B3B3B3"} />
            <Text style={[styles.tabText, activeTab === "playlists" && { color: genreColor }]}>
              Playlists
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === "albums" && styles.activeTab]}
            onPress={() => setActiveTab("albums")}
          >
            <Disc3 size={18} color={activeTab === "albums" ? genreColor : "#B3B3B3"} />
            <Text style={[styles.tabText, activeTab === "albums" && { color: genreColor }]}>
              Albums
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content based on active tab */}
        <View style={styles.contentSection}>
          {activeTab === "tracks" && (
            <View>
              <Text style={styles.contentTitle}>Popular Tracks</Text>
              <FlatList
                data={tracks}
                renderItem={renderTrack}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
                contentContainerStyle={styles.tracksList}
              />
            </View>
          )}

          {activeTab === "playlists" && (
            <View>
              <Text style={styles.contentTitle}>Featured Playlists</Text>
              <View style={styles.playlistsGrid}>
                {genreData.playlists.map((playlist) => (
                  <TouchableOpacity
                    key={playlist.id}
                    style={styles.playlistCard}
                    activeOpacity={0.7}
                    onPress={() => console.log("Open playlist:", playlist.name)}
                  >
                    <Image source={{ uri: playlist.artwork }} style={styles.playlistArtwork} />
                    <Text style={styles.playlistName} numberOfLines={2}>{playlist.name}</Text>
                    <Text style={styles.playlistDescription} numberOfLines={2}>
                      {playlist.description}
                    </Text>
                    <Text style={styles.playlistTrackCount}>{playlist.trackCount} tracks</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {activeTab === "albums" && (
            <View>
              <Text style={styles.contentTitle}>Popular Albums</Text>
              <View style={styles.albumsGrid}>
                {genreData.albums.map((album) => (
                  <TouchableOpacity
                    key={album.id}
                    style={styles.albumCard}
                    activeOpacity={0.7}
                    onPress={() => console.log("Open album:", album.title)}
                  >
                    <Image source={{ uri: album.artwork }} style={styles.albumArtwork} />
                    <Text style={styles.albumTitle} numberOfLines={2}>{album.title}</Text>
                    <Text style={styles.albumArtist} numberOfLines={1}>{album.artist}</Text>
                    <Text style={styles.albumYear}>{album.year}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
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
    fontWeight: "700",
    color: "#FFF",
  },
  placeholder: {
    width: 40,
  },
  genreHeader: {
    marginHorizontal: 20,
    borderRadius: 16,
    marginBottom: 24,
    overflow: "hidden",
  },
  genreHeaderContent: {
    padding: 24,
  },
  genreTitle: {
    fontSize: 32,
    fontWeight: "800",
    color: "#FFF",
    marginBottom: 4,
  },
  genreDescription: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.9)",
    marginBottom: 20,
    lineHeight: 20,
  },
  playAllButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    alignSelf: "flex-start",
  },
  playAllText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  subgenresSection: {
    marginBottom: 24,
  },
  subgenresContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 8,
  },
  subgenreChip: {
    backgroundColor: "#1A1A1A",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#333",
  },
  subgenreText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "500",
  },
  artistsSection: {
    marginBottom: 24,
  },
  artistsContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 16,
  },
  artistCard: {
    width: 120,
    alignItems: "center",
  },
  artistImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 8,
  },
  artistName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFF",
    textAlign: "center",
    marginBottom: 4,
  },
  artistFollowers: {
    fontSize: 12,
    color: "#B3B3B3",
    textAlign: "center",
  },
  tabsContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginBottom: 24,
    gap: 12,
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#1A1A1A",
    borderRadius: 8,
    gap: 8,
  },
  activeTab: {
    backgroundColor: "#2A2A2A",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#B3B3B3",
  },
  contentSection: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  contentTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFF",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFF",
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  playlistsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },
  playlistCard: {
    width: "48%",
  },
  playlistArtwork: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 8,
    marginBottom: 8,
  },
  playlistName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFF",
    marginBottom: 4,
  },
  playlistDescription: {
    fontSize: 12,
    color: "#B3B3B3",
    marginBottom: 4,
  },
  playlistTrackCount: {
    fontSize: 12,
    color: "#888",
  },
  albumsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },
  albumCard: {
    width: "48%",
  },
  albumArtwork: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 8,
    marginBottom: 8,
  },
  albumTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFF",
    marginBottom: 4,
  },
  albumArtist: {
    fontSize: 12,
    color: "#B3B3B3",
    marginBottom: 2,
  },
  albumYear: {
    fontSize: 12,
    color: "#888",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  errorText: {
    fontSize: 16,
    color: "#B3B3B3",
    textAlign: "center",
  },
  tracksList: {
    gap: 8,
  },
  trackItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 4,
  },
  trackNumber: {
    width: 24,
    alignItems: "center",
    marginRight: 16,
  },
  trackNumberText: {
    fontSize: 16,
    color: "#B3B3B3",
    fontWeight: "500",
  },
  trackArtwork: {
    width: 48,
    height: 48,
    borderRadius: 8,
    marginRight: 12,
  },
  trackInfo: {
    flex: 1,
    marginRight: 12,
  },
  trackTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFF",
    marginBottom: 2,
  },
  trackArtist: {
    fontSize: 14,
    color: "#B3B3B3",
  },
  trackDuration: {
    fontSize: 14,
    color: "#B3B3B3",
    marginRight: 12,
    minWidth: 40,
    textAlign: "right",
  },
  moreButton: {
    padding: 8,
  },
});