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
import { Play, ArrowLeft, TrendingUp, MoreVertical, Heart } from "lucide-react-native";
import { usePlayer } from "@/contexts/PlayerContext";
import { router } from "expo-router";
import { topCharts, allTracks } from "@/data/mockData";
import type { Track } from "@/types";

export default function TopChartsScreen() {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const CARD_WIDTH = width * 0.44;
  const { playTrack, currentTrack } = usePlayer();
  const [selectedPeriod, setSelectedPeriod] = useState<"today" | "week" | "month" | "all">("week");

  const periods = [
    { id: "today" as const, label: "Today" },
    { id: "week" as const, label: "This Week" },
    { id: "month" as const, label: "This Month" },
    { id: "all" as const, label: "All Time" },
  ];

  const getChartsData = () => {
    switch (selectedPeriod) {
      case "today":
        return topCharts.slice(0, 10);
      case "week":
        return [...topCharts, ...allTracks.filter(t => t.type === "song").slice(0, 10)];
      case "month":
        return [...topCharts, ...allTracks.filter(t => t.type === "song").slice(0, 15)];
      case "all":
        return [...topCharts, ...allTracks.filter(t => t.type === "song").slice(0, 20)];
      default:
        return topCharts;
    }
  };

  const chartsData = getChartsData();

  const renderChartItem = ({ item, index }: { item: Track; index: number }) => {
    const isPlaying = currentTrack?.id === item.id;
    const rank = index + 1;
    const rankChange = Math.floor(Math.random() * 10) - 5;

    return (
      <TouchableOpacity
        style={[styles.chartItem, isPlaying && styles.chartItemPlaying]}
        onPress={() => playTrack(item)}
        activeOpacity={0.8}
        testID={`chart-item-${item.id}`}
      >
        <View style={styles.rankContainer}>
          <Text style={[styles.rankNumber, rank <= 3 && styles.rankNumberTop]}>
            {rank}
          </Text>
          {rankChange !== 0 && (
            <View style={[styles.rankChange, rankChange > 0 && styles.rankChangeUp]}>
              <TrendingUp
                size={12}
                color={rankChange > 0 ? "#00FF88" : "#FF4444"}
                style={rankChange < 0 && { transform: [{ rotate: "180deg" }] }}
              />
              <Text
                style={[
                  styles.rankChangeText,
                  rankChange > 0 ? styles.rankChangeTextUp : styles.rankChangeTextDown,
                ]}
              >
                {Math.abs(rankChange)}
              </Text>
            </View>
          )}
        </View>

        <SafeImage uri={item.artwork} style={styles.chartImage} />

        <View style={styles.chartInfo}>
          <Text style={styles.chartTitle} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={styles.chartArtist} numberOfLines={1}>
            {item.artist}
          </Text>
          <View style={styles.chartStats}>
            <Text style={styles.chartPlays}>
              {(Math.random() * 10 + 1).toFixed(1)}M plays
            </Text>
          </View>
        </View>

        <TouchableOpacity style={styles.likeButton} testID={`like-${item.id}`}>
          <Heart size={20} color="#999" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.moreButton} testID={`more-${item.id}`}>
          <MoreVertical size={20} color="#999" />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  const renderTopCard = ({ item, index }: { item: Track; index: number }) => (
    <TouchableOpacity
      style={[styles.topCard, { width: CARD_WIDTH }]}
      onPress={() => playTrack(item)}
      activeOpacity={0.8}
      testID={`top-card-${item.id}`}
    >
      <View style={styles.topCardImageContainer}>
        <SafeImage
          uri={item.artwork}
          style={[styles.topCardImage, { width: CARD_WIDTH, height: CARD_WIDTH }]}
        />
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.9)"]}
          style={styles.topCardGradient}
        />
        <View style={styles.topRankBadge}>
          <Text style={styles.topRankText}>#{index + 1}</Text>
        </View>
        <View style={styles.topCardPlayButton}>
          <Play size={24} color="#000" fill="#FFF" />
        </View>
      </View>
      <Text style={styles.topCardTitle} numberOfLines={2}>
        {item.title}
      </Text>
      <Text style={styles.topCardArtist} numberOfLines={1}>
        {item.artist}
      </Text>
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
          <Text style={styles.headerTitle}>Top Charts</Text>
          <View style={styles.backButton} />
        </View>

        <View style={styles.periodsContainer}>
          {periods.map((period) => (
            <TouchableOpacity
              key={period.id}
              style={[styles.periodTab, selectedPeriod === period.id && styles.periodTabActive]}
              onPress={() => setSelectedPeriod(period.id)}
              testID={`period-${period.id}`}
            >
              <Text
                style={[
                  styles.periodText,
                  selectedPeriod === period.id && styles.periodTextActive,
                ]}
              >
                {period.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <FlatList
          data={chartsData}
          renderItem={renderChartItem}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View style={styles.topSection}>
              <View style={styles.sectionHeader}>
                <TrendingUp size={20} color="#FF0080" />
                <Text style={styles.sectionTitle}>Top 3 This {selectedPeriod === "today" ? "Day" : selectedPeriod === "week" ? "Week" : selectedPeriod === "month" ? "Month" : "Time"}</Text>
              </View>
              <FlatList
                data={chartsData.slice(0, 3)}
                renderItem={renderTopCard}
                keyExtractor={(item) => `top-${item.id}`}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.topCardsContainer}
              />
              <View style={styles.divider} />
              <Text style={styles.fullChartTitle}>Full Chart</Text>
            </View>
          }
          contentContainerStyle={[styles.listContent, { paddingBottom: 120 }]}
        />
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
  periodsContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 12,
  },
  periodTab: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 24,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  periodTabActive: {
    backgroundColor: "#FF0080",
  },
  periodText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#999",
  },
  periodTextActive: {
    color: "#FFF",
  },
  listContent: {
    paddingHorizontal: 20,
  },
  topSection: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#FFF",
  },
  topCardsContainer: {
    gap: 16,
    marginBottom: 24,
  },
  topCard: {
    marginRight: 16,
  },
  topCardImageContainer: {
    position: "relative",
    marginBottom: 10,
    borderRadius: 14,
    overflow: "hidden",
  },
  topCardImage: {
    borderRadius: 14,
  },
  topCardGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "50%",
  },
  topRankBadge: {
    position: "absolute",
    top: 12,
    left: 12,
    backgroundColor: "#FF0080",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  topRankText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "800",
  },
  topCardPlayButton: {
    position: "absolute",
    bottom: 12,
    right: 12,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#FFF",
    alignItems: "center",
    justifyContent: "center",
  },
  topCardTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FFF",
    marginBottom: 4,
  },
  topCardArtist: {
    fontSize: 13,
    color: "#999",
    fontWeight: "500",
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    marginVertical: 20,
  },
  fullChartTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#FFF",
    marginBottom: 16,
  },
  chartItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  chartItemPlaying: {
    backgroundColor: "rgba(255, 0, 128, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(255, 0, 128, 0.3)",
  },
  rankContainer: {
    width: 50,
    alignItems: "center",
    marginRight: 12,
  },
  rankNumber: {
    fontSize: 20,
    fontWeight: "800",
    color: "#999",
    marginBottom: 4,
  },
  rankNumberTop: {
    color: "#FF0080",
  },
  rankChange: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  rankChangeUp: {
    opacity: 1,
  },
  rankChangeText: {
    fontSize: 10,
    fontWeight: "700",
  },
  rankChangeTextUp: {
    color: "#00FF88",
  },
  rankChangeTextDown: {
    color: "#FF4444",
  },
  chartImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  chartInfo: {
    flex: 1,
  },
  chartTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FFF",
    marginBottom: 4,
  },
  chartArtist: {
    fontSize: 13,
    color: "#999",
    fontWeight: "500",
    marginBottom: 4,
  },
  chartStats: {
    flexDirection: "row",
    alignItems: "center",
  },
  chartPlays: {
    fontSize: 12,
    color: "#666",
    fontWeight: "600",
  },
  likeButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 4,
  },
  moreButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
});
