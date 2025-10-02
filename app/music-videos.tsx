import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  useWindowDimensions,
} from "react-native";
import SafeImage from "@/components/SafeImage";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Play, ArrowLeft, Grid, List } from "lucide-react-native";
import { usePlayer } from "@/contexts/PlayerContext";
import { router } from "expo-router";
import { trendingVideos, mostViewedVideos, livePerformanceVideos } from "@/data/mockData";
import type { Track } from "@/types";

export default function MusicVideosScreen() {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const CARD_WIDTH = width * 0.44;
  const { playTrack } = usePlayer();
  const [selectedTab, setSelectedTab] = useState<"trending" | "most-viewed" | "live">("trending");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const tabs = [
    { id: "trending" as const, label: "Trending", data: trendingVideos },
    { id: "most-viewed" as const, label: "Most Viewed", data: mostViewedVideos },
    { id: "live" as const, label: "Live Performances", data: livePerformanceVideos },
  ];

  const currentData = tabs.find((tab) => tab.id === selectedTab)?.data || [];

  const renderVideoCard = ({ item }: { item: Track }) => (
    <TouchableOpacity
      style={[styles.card, { width: CARD_WIDTH }]}
      onPress={() => {
        console.log(`Opening video: ${item.title}`);
        playTrack(item);
      }}
      activeOpacity={0.8}
      testID={`video-card-${item.id}`}
    >
      <View style={styles.cardImageContainer}>
        <SafeImage
          uri={item.artwork}
          style={[styles.cardImage, { width: CARD_WIDTH, height: CARD_WIDTH * 0.75 }]}
        />
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.8)"]}
          style={styles.cardGradient}
        />
        <View style={styles.videoIndicator}>
          <Play size={20} color="#FFF" fill="#FFF" />
        </View>
        {item.duration && (
          <View style={styles.durationBadge}>
            <Text style={styles.durationText}>
              {Math.floor(item.duration / 60)}:{String(item.duration % 60).padStart(2, "0")}
            </Text>
          </View>
        )}
      </View>
      <Text style={styles.cardTitle} numberOfLines={2}>
        {item.title}
      </Text>
      <Text style={styles.cardArtist} numberOfLines={1}>
        {item.artist}
      </Text>
    </TouchableOpacity>
  );

  const renderVideoListItem = ({ item }: { item: Track }) => (
    <TouchableOpacity
      style={styles.listItem}
      onPress={() => {
        console.log(`Opening video: ${item.title}`);
        playTrack(item);
      }}
      activeOpacity={0.8}
      testID={`video-list-${item.id}`}
    >
      <View style={styles.listImageContainer}>
        <SafeImage uri={item.artwork} style={styles.listImage} />
        <View style={styles.listPlayIcon}>
          <Play size={16} color="#FFF" fill="#FFF" />
        </View>
      </View>
      <View style={styles.listInfo}>
        <Text style={styles.listTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.listArtist} numberOfLines={1}>
          {item.artist}
        </Text>
        {item.duration && (
          <Text style={styles.listDuration}>
            {Math.floor(item.duration / 60)}:{String(item.duration % 60).padStart(2, "0")}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.outerContainer}>
      <LinearGradient
        colors={["#1A0B2E", "#16213E", "#0B0A14"]}
        locations={[0, 0.3, 1]}
        style={styles.backgroundGradient}
      />
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            testID="back-button"
          >
            <ArrowLeft color="#FFF" size={24} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Music Videos</Text>
          <TouchableOpacity
            style={styles.viewModeButton}
            onPress={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
            testID="view-mode-button"
          >
            {viewMode === "grid" ? (
              <List color="#FFF" size={24} />
            ) : (
              <Grid color="#FFF" size={24} />
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.tabsContainer}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.id}
              style={[styles.tab, selectedTab === tab.id && styles.tabActive]}
              onPress={() => setSelectedTab(tab.id)}
              testID={`tab-${tab.id}`}
            >
              <Text
                style={[styles.tabText, selectedTab === tab.id && styles.tabTextActive]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.statsContainer}>
          <Text style={styles.statsText}>{currentData.length} Videos</Text>
        </View>

        {viewMode === "grid" ? (
          <FlatList
            key="grid"
            data={currentData}
            renderItem={renderVideoCard}
            keyExtractor={(item) => item.id}
            numColumns={2}
            columnWrapperStyle={styles.row}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[styles.listContent, { paddingBottom: 120 }]}
          />
        ) : (
          <FlatList
            key="list"
            data={currentData}
            renderItem={renderVideoListItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[styles.listContent, { paddingBottom: 120 }]}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: "#0B0A14",
  },
  container: {
    flex: 1,
  },
  backgroundGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 400,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#FFF",
    flex: 1,
    textAlign: "center",
  },
  viewModeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  tabsContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginBottom: 16,
    gap: 12,
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 24,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  tabActive: {
    backgroundColor: "#FF0080",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#999",
  },
  tabTextActive: {
    color: "#FFF",
  },
  statsContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  statsText: {
    fontSize: 14,
    color: "#999",
    fontWeight: "600",
  },
  listContent: {
    paddingHorizontal: 20,
  },
  row: {
    justifyContent: "space-between",
    marginBottom: 20,
  },
  card: {
    marginBottom: 20,
  },
  cardImageContainer: {
    position: "relative",
    marginBottom: 10,
    borderRadius: 14,
    overflow: "hidden",
  },
  cardImage: {
    borderRadius: 14,
  },
  cardGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "40%",
  },
  videoIndicator: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -20 }, { translateY: -20 }],
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 0, 128, 0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  durationBadge: {
    position: "absolute",
    bottom: 8,
    right: 8,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  durationText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "700",
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FFF",
    marginBottom: 4,
  },
  cardArtist: {
    fontSize: 13,
    color: "#999",
    fontWeight: "500",
  },
  listItem: {
    flexDirection: "row",
    marginBottom: 16,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 12,
    padding: 12,
  },
  listImageContainer: {
    position: "relative",
    marginRight: 12,
  },
  listImage: {
    width: 100,
    height: 75,
    borderRadius: 8,
  },
  listPlayIcon: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -12 }, { translateY: -12 }],
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgba(255, 0, 128, 0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  listInfo: {
    flex: 1,
    justifyContent: "center",
  },
  listTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FFF",
    marginBottom: 4,
  },
  listArtist: {
    fontSize: 13,
    color: "#999",
    fontWeight: "500",
    marginBottom: 4,
  },
  listDuration: {
    fontSize: 12,
    color: "#666",
    fontWeight: "600",
  },
});
