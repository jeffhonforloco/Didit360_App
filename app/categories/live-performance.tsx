import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft, Play, Radio, Calendar, MapPin, Users, Filter } from "lucide-react-native";
import { router } from "expo-router";
import { usePlayer } from "@/contexts/PlayerContext";
import { livePerformanceVideos } from "@/data/mockData";
import type { Track } from "@/types";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");

type FilterType = "all" | "concerts" | "festivals" | "acoustic" | "virtual";

interface LiveCategory {
  id: string;
  title: string;
  icon: string;
  gradient: readonly [string, string];
}

const categories: LiveCategory[] = [
  { id: "concerts", title: "Concerts", icon: "🎸", gradient: ["#FF6B6B", "#FF8E53"] as const },
  { id: "festivals", title: "Festivals", icon: "🎪", gradient: ["#4FACFE", "#00F2FE"] as const },
  { id: "acoustic", title: "Acoustic", icon: "🎵", gradient: ["#43E97B", "#38F9D7"] as const },
  { id: "virtual", title: "Virtual", icon: "🌐", gradient: ["#FA709A", "#FEE140"] as const },
];

const upcomingEvents = [
  {
    id: "e1",
    title: "Summer Music Festival 2025",
    artist: "Various Artists",
    date: "July 15-17, 2025",
    location: "Central Park, NYC",
    attendees: "50K+",
    image: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800&h=400&fit=crop",
  },
  {
    id: "e2",
    title: "Luna Echo World Tour",
    artist: "Luna Echo",
    date: "August 20, 2025",
    location: "Madison Square Garden",
    attendees: "20K",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=400&fit=crop",
  },
];

export default function LivePerformanceScreen() {
  const { playTrack } = usePlayer();
  const [selectedFilter, setSelectedFilter] = useState<FilterType>("all");

  const filteredVideos = livePerformanceVideos.filter((video) => {
    if (selectedFilter === "all") return true;
    if (selectedFilter === "concerts") return video.title.toLowerCase().includes("concert") || video.title.toLowerCase().includes("live at");
    if (selectedFilter === "festivals") return video.title.toLowerCase().includes("festival");
    if (selectedFilter === "acoustic") return video.title.toLowerCase().includes("acoustic") || video.title.toLowerCase().includes("unplugged");
    if (selectedFilter === "virtual") return video.title.toLowerCase().includes("virtual");
    return true;
  });

  const renderFeaturedEvent = (event: typeof upcomingEvents[0]) => (
    <TouchableOpacity
      key={event.id}
      style={styles.featuredCard}
      activeOpacity={0.9}
      testID={`event-${event.id}`}
    >
      <Image source={{ uri: event.image }} style={styles.featuredImage} />
      <LinearGradient
        colors={["transparent", "rgba(0,0,0,0.9)"]}
        style={styles.featuredGradient}
      >
        <View style={styles.liveIndicator}>
          <Radio size={12} color="#FFF" />
          <Text style={styles.liveText}>UPCOMING</Text>
        </View>
        <Text style={styles.featuredTitle}>{event.title}</Text>
        <Text style={styles.featuredArtist}>{event.artist}</Text>
        <View style={styles.eventDetails}>
          <View style={styles.eventDetail}>
            <Calendar size={14} color="#999" />
            <Text style={styles.eventDetailText}>{event.date}</Text>
          </View>
          <View style={styles.eventDetail}>
            <MapPin size={14} color="#999" />
            <Text style={styles.eventDetailText}>{event.location}</Text>
          </View>
          <View style={styles.eventDetail}>
            <Users size={14} color="#999" />
            <Text style={styles.eventDetailText}>{event.attendees}</Text>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  const renderCategory = (category: LiveCategory) => (
    <TouchableOpacity
      key={category.id}
      style={styles.categoryCard}
      activeOpacity={0.8}
      testID={`category-${category.id}`}
    >
      <LinearGradient
        colors={category.gradient as [string, string]}
        style={styles.categoryGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text style={styles.categoryIcon}>{category.icon}</Text>
        <Text style={styles.categoryTitle}>{category.title}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );

  const renderPerformance = (item: Track) => (
    <TouchableOpacity
      key={item.id}
      style={styles.performanceCard}
      onPress={() => playTrack(item)}
      activeOpacity={0.8}
      testID={`performance-${item.id}`}
    >
      <View style={styles.performanceImageContainer}>
        <Image source={{ uri: item.artwork }} style={styles.performanceImage} />
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.7)"]}
          style={styles.performanceGradient}
        >
          <View style={styles.playOverlay}>
            <View style={styles.playIconContainer}>
              <Play size={24} color="#FFF" fill="#FFF" />
            </View>
          </View>
        </LinearGradient>
        <View style={styles.liveBadge}>
          <Radio size={10} color="#FFF" />
          <Text style={styles.liveBadgeText}>LIVE</Text>
        </View>
      </View>
      <View style={styles.performanceInfo}>
        <Text style={styles.performanceTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.performanceArtist} numberOfLines={1}>
          {item.artist}
        </Text>
        <View style={styles.performanceStats}>
          <View style={styles.stat}>
            <Users size={12} color="#666" />
            <Text style={styles.statText}>{Math.floor(Math.random() * 500 + 100)}K views</Text>
          </View>
          <Text style={styles.statDot}>•</Text>
          <Text style={styles.statText}>{Math.floor(item.duration / 60)} min</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderFilterButton = (filter: FilterType, label: string) => (
    <TouchableOpacity
      key={filter}
      style={[
        styles.filterButton,
        selectedFilter === filter && styles.filterButtonActive,
      ]}
      onPress={() => setSelectedFilter(filter)}
      activeOpacity={0.7}
      testID={`filter-${filter}`}
    >
      <Text
        style={[
          styles.filterButtonText,
          selectedFilter === filter && styles.filterButtonTextActive,
        ]}
      >
        {label}
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
        <Text style={styles.headerTitle}>Live Performance</Text>
        <TouchableOpacity style={styles.filterIcon} testID="filter-button">
          <Filter size={20} color="#FFF" />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Featured Events</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.featuredScroll}
          >
            {upcomingEvents.map(renderFeaturedEvent)}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Browse by Type</Text>
          <View style={styles.categoriesGrid}>
            {categories.map(renderCategory)}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>All Performances</Text>
            <Text style={styles.sectionCount}>{filteredVideos.length} videos</Text>
          </View>
          
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filtersScroll}
          >
            {renderFilterButton("all", "All")}
            {renderFilterButton("concerts", "Concerts")}
            {renderFilterButton("festivals", "Festivals")}
            {renderFilterButton("acoustic", "Acoustic")}
            {renderFilterButton("virtual", "Virtual")}
          </ScrollView>

          <View style={styles.performancesGrid}>
            {filteredVideos.map(renderPerformance)}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#1A1A1A",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#1A1A1A",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700" as const,
    color: "#FFF",
  },
  filterIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#1A1A1A",
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContent: {
    paddingBottom: 120,
  },
  section: {
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "700" as const,
    color: "#FFF",
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionCount: {
    fontSize: 14,
    color: "#666",
  },
  featuredScroll: {
    paddingHorizontal: 20,
    gap: 16,
  },
  featuredCard: {
    width: width - 40,
    height: 240,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#1A1A1A",
  },
  featuredImage: {
    width: "100%",
    height: "100%",
  },
  featuredGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    justifyContent: "flex-end",
  },
  liveIndicator: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(255, 0, 128, 0.9)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: "flex-start",
    marginBottom: 12,
  },
  liveText: {
    color: "#FFF",
    fontSize: 11,
    fontWeight: "700" as const,
    letterSpacing: 1,
  },
  featuredTitle: {
    fontSize: 24,
    fontWeight: "700" as const,
    color: "#FFF",
    marginBottom: 4,
  },
  featuredArtist: {
    fontSize: 16,
    color: "#CCC",
    marginBottom: 12,
  },
  eventDetails: {
    gap: 8,
  },
  eventDetail: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  eventDetailText: {
    fontSize: 13,
    color: "#999",
  },
  categoriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 20,
    gap: 12,
  },
  categoryCard: {
    width: (width - 64) / 2,
    height: 100,
    borderRadius: 12,
    overflow: "hidden",
  },
  categoryGradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  categoryIcon: {
    fontSize: 32,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: "600" as const,
    color: "#FFF",
  },
  filtersScroll: {
    paddingHorizontal: 20,
    gap: 8,
    marginBottom: 16,
  },
  filterButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: "#1A1A1A",
    borderWidth: 1,
    borderColor: "#2A2A2A",
  },
  filterButtonActive: {
    backgroundColor: "#FF0080",
    borderColor: "#FF0080",
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: "#999",
  },
  filterButtonTextActive: {
    color: "#FFF",
  },
  performancesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 20,
    gap: 12,
  },
  performanceCard: {
    width: (width - 52) / 2,
    marginBottom: 8,
  },
  performanceImageContainer: {
    width: "100%",
    aspectRatio: 16 / 9,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#1A1A1A",
    position: "relative",
  },
  performanceImage: {
    width: "100%",
    height: "100%",
  },
  performanceGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  playOverlay: {
    justifyContent: "center",
    alignItems: "center",
  },
  playIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  liveBadge: {
    position: "absolute",
    top: 8,
    left: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(255, 0, 0, 0.9)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  liveBadgeText: {
    color: "#FFF",
    fontSize: 10,
    fontWeight: "700" as const,
    letterSpacing: 0.5,
  },
  performanceInfo: {
    marginTop: 8,
  },
  performanceTitle: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: "#FFF",
    marginBottom: 4,
    lineHeight: 18,
  },
  performanceArtist: {
    fontSize: 13,
    color: "#999",
    marginBottom: 6,
  },
  performanceStats: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  stat: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  statText: {
    fontSize: 11,
    color: "#666",
  },
  statDot: {
    fontSize: 11,
    color: "#666",
  },
});