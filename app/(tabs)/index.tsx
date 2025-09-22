import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Play, MoreVertical } from "lucide-react-native";
import { usePlayer } from "@/contexts/PlayerContext";
import { featuredContent, recentlyPlayed, topCharts, newReleases, podcasts, audiobooks } from "@/data/mockData";
import type { Track } from "@/types";

export default function HomeScreen() {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const CARD_WIDTH = width * 0.4;
  const { playTrack } = usePlayer();

  const renderFeaturedItem = ({ item }: { item: Track }) => (
    <TouchableOpacity
      style={[styles.featuredCard, { width: width - 40 }]}
      onPress={() => playTrack(item)}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={["#FF0080", "#8B5CF6"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.featuredGradient}
      >
        <Image source={{ uri: item.artwork }} style={styles.featuredImage} />
        <View style={styles.featuredOverlay}>
          <Text style={styles.featuredTitle} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={styles.featuredArtist} numberOfLines={1}>
            {item.artist}
          </Text>
          <TouchableOpacity style={styles.playButton}>
            <Play size={20} color="#000" fill="#FFF" />
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  const renderCard = ({ item }: { item: Track }) => (
    <TouchableOpacity
      style={[styles.card, { width: CARD_WIDTH }]}
      onPress={() => playTrack(item)}
      activeOpacity={0.8}
    >
      <Image 
        source={{ uri: item.artwork }} 
        style={[styles.cardImage, { width: CARD_WIDTH, height: CARD_WIDTH }]} 
      />
      <Text style={styles.cardTitle} numberOfLines={1}>
        {item.title}
      </Text>
      <Text style={styles.cardArtist} numberOfLines={1}>
        {item.artist}
      </Text>
    </TouchableOpacity>
  );

  const renderRecentItem = ({ item }: { item: Track }) => (
    <TouchableOpacity
      style={styles.recentItem}
      onPress={() => playTrack(item)}
      activeOpacity={0.8}
    >
      <Image source={{ uri: item.artwork }} style={styles.recentImage} />
      <View style={styles.recentInfo}>
        <Text style={styles.recentTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.recentArtist} numberOfLines={1}>
          {item.artist}
        </Text>
      </View>
      <TouchableOpacity style={styles.moreButton}>
        <MoreVertical size={20} color="#666" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={[styles.header, { paddingTop: 20 + insets.top }]}>
          <Image
            source={{ uri: "https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/g7ru96a03yi3watz8pn4f" }}
            style={styles.logoImage}
            resizeMode="contain"
            accessibilityLabel="Didit360 logo"
            testID="header-logo"
          />
        </View>

        <View style={styles.section}>
          <FlatList
            data={featuredContent}
            renderItem={renderFeaturedItem}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
            pagingEnabled
            snapToInterval={width - 40}
            decelerationRate="fast"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recently Played</Text>
          <FlatList
            data={recentlyPlayed}
            renderItem={renderRecentItem}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Top Charts</Text>
          <FlatList
            data={topCharts}
            renderItem={renderCard}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>New Releases</Text>
          <FlatList
            data={newReleases}
            renderItem={renderCard}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Voxsaga Podcasts</Text>
          <FlatList
            data={podcasts}
            renderItem={renderCard}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
          />
        </View>

        <View style={[styles.section, { marginBottom: 120 }]}>
          <Text style={styles.sectionTitle}>Auralora Audiobooks</Text>
          <FlatList
            data={audiobooks}
            renderItem={renderCard}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
          />
        </View>
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
    paddingBottom: 10,
  },
  logo: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FF0080",
    marginBottom: 8,
  },
  logoImage: {
    width: 40,
    height: 40,
    borderRadius: 8,
    marginBottom: 8,
  },
  greeting: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FFF",
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFF",
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  horizontalList: {
    paddingHorizontal: 20,
  },
  featuredCard: {
    height: 200,
    marginRight: 16,
  },
  featuredGradient: {
    flex: 1,
    borderRadius: 16,
    padding: 2,
  },
  featuredImage: {
    flex: 1,
    borderRadius: 14,
  },
  featuredOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    borderBottomLeftRadius: 14,
    borderBottomRightRadius: 14,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  featuredTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFF",
    marginBottom: 4,
  },
  featuredArtist: {
    fontSize: 14,
    color: "#CCC",
  },
  playButton: {
    position: "absolute",
    right: 16,
    bottom: 16,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    marginRight: 16,
  },
  cardImage: {
    borderRadius: 12,
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFF",
    marginBottom: 4,
  },
  cardArtist: {
    fontSize: 12,
    color: "#999",
  },
  recentItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  recentImage: {
    width: 48,
    height: 48,
    borderRadius: 8,
    marginRight: 12,
  },
  recentInfo: {
    flex: 1,
  },
  recentTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFF",
    marginBottom: 2,
  },
  recentArtist: {
    fontSize: 12,
    color: "#999",
  },
  moreButton: {
    padding: 8,
  },
});