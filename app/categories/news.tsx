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
import { ArrowLeft, Play, Clock } from "lucide-react-native";
import { router } from "expo-router";
import { usePlayer } from "@/contexts/PlayerContext";
import { 
  whatADayEpisodes, 
  hiddenBrainEpisodes, 
  jordanHarbingerEpisodes,
  twentyThousandHertzEpisodes 
} from "@/data/mockData";
import type { Track } from "@/types";

export default function NewsCategoryScreen() {
  const { playTrack } = usePlayer();

  const newsAndTalkShows = React.useMemo(() => [
    ...whatADayEpisodes,
    ...hiddenBrainEpisodes,
    ...jordanHarbingerEpisodes,
    ...twentyThousandHertzEpisodes,
  ], []);

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    return `${minutes} min`;
  };

  const renderNewsItem = ({ item }: { item: Track }) => (
    <TouchableOpacity
      style={styles.newsItem}
      onPress={() => playTrack(item)}
      activeOpacity={0.8}
      testID={`news-${item.id}`}
    >
      <Image source={{ uri: item.artwork }} style={styles.newsImage} />
      <View style={styles.newsContent}>
        <Text style={styles.newsTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.newsHost} numberOfLines={1}>
          {item.artist}
        </Text>
        <View style={styles.newsMetadata}>
          <Clock size={12} color="#999" />
          <Text style={styles.newsDuration}>
            {formatDuration(item.duration)}
          </Text>
        </View>
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

  const renderFeaturedNews = ({ item }: { item: Track }) => (
    <TouchableOpacity
      style={styles.featuredCard}
      onPress={() => playTrack(item)}
      activeOpacity={0.8}
      testID={`featured-${item.id}`}
    >
      <Image source={{ uri: item.artwork }} style={styles.featuredImage} />
      <View style={styles.featuredOverlay}>
        <Text style={styles.featuredTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.featuredHost} numberOfLines={1}>
          {item.artist}
        </Text>
        <View style={styles.featuredMetadata}>
          <Clock size={12} color="#CCC" />
          <Text style={styles.featuredDuration}>
            {formatDuration(item.duration)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const newsCategories = [
    "Breaking News",
    "Politics", 
    "World News",
    "Business",
    "Technology",
    "Science",
    "Health",
    "Sports"
  ];

  const renderCategory = ({ item }: { item: string }) => (
    <TouchableOpacity 
      style={styles.categoryPill} 
      onPress={() => console.log("Category", item)} 
      testID={`category-${item}`}
    >
      <Text style={styles.categoryText}>{item}</Text>
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
        <Text style={styles.title}>News & Talk</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.description}>
          <Text style={styles.descriptionText}>
            Stay informed with the latest news, current events, and thought-provoking discussions.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Featured Today</Text>
          <FlatList
            data={newsAndTalkShows.slice(0, 3)}
            renderItem={renderFeaturedNews}
            keyExtractor={(item) => `featured-${item.id}`}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Browse Topics</Text>
          <FlatList
            data={newsCategories}
            renderItem={renderCategory}
            keyExtractor={(item) => `category-${item}`}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={[styles.horizontalList, styles.categoryList]}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Latest Episodes</Text>
          <FlatList
            data={newsAndTalkShows}
            renderItem={renderNewsItem}
            keyExtractor={(item) => `news-${item.id}`}
            scrollEnabled={false}
            contentContainerStyle={styles.newsList}
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
  description: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  descriptionText: {
    fontSize: 14,
    color: "#B3B3B3",
    lineHeight: 20,
    textAlign: "center",
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
    width: 280,
    height: 160,
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
    padding: 16,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },
  featuredTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFF",
    marginBottom: 4,
    lineHeight: 18,
  },
  featuredHost: {
    fontSize: 12,
    color: "#CCC",
    marginBottom: 6,
  },
  featuredMetadata: {
    flexDirection: "row",
    alignItems: "center",
  },
  featuredDuration: {
    fontSize: 11,
    color: "#CCC",
    marginLeft: 4,
  },
  categoryList: {
    paddingVertical: 8,
  },
  categoryPill: {
    backgroundColor: "#11998E",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    marginRight: 10,
  },
  categoryText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "600",
  },
  newsList: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  newsItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#1A1A1A",
  },
  newsImage: {
    width: 64,
    height: 64,
    borderRadius: 8,
    marginRight: 12,
  },
  newsContent: {
    flex: 1,
  },
  newsTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#FFF",
    marginBottom: 4,
    lineHeight: 20,
  },
  newsHost: {
    fontSize: 13,
    color: "#11998E",
    marginBottom: 6,
  },
  newsMetadata: {
    flexDirection: "row",
    alignItems: "center",
  },
  newsDuration: {
    fontSize: 12,
    color: "#999",
    marginLeft: 4,
  },
  playButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#11998E",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 12,
  },
});