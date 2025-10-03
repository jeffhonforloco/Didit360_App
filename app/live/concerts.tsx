import React from "react";
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
import { ArrowLeft, Play, Radio, Calendar, MapPin, Users } from "lucide-react-native";
import { router } from "expo-router";
import { usePlayer } from "@/contexts/PlayerContext";
import { livePerformanceVideos } from "@/data/mockData";
import type { Track } from "@/types";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");

const upcomingConcerts = [
  {
    id: "c1",
    title: "Luna Echo World Tour",
    artist: "Luna Echo",
    date: "August 20, 2025",
    location: "Madison Square Garden, NYC",
    attendees: "20K",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=400&fit=crop",
  },
  {
    id: "c2",
    title: "Neon Dreams Live",
    artist: "Neon Dreams",
    date: "September 5, 2025",
    location: "The Forum, LA",
    attendees: "18K",
    image: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&h=400&fit=crop",
  },
  {
    id: "c3",
    title: "Electric Pulse Concert",
    artist: "Electric Pulse",
    date: "October 12, 2025",
    location: "O2 Arena, London",
    attendees: "15K",
    image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&h=400&fit=crop",
  },
];

export default function ConcertsScreen() {
  const { playTrack } = usePlayer();

  const concertVideos = livePerformanceVideos.filter(
    (video) =>
      video.title.toLowerCase().includes("concert") ||
      video.title.toLowerCase().includes("live at")
  );

  const renderConcertEvent = (event: typeof upcomingConcerts[0]) => (
    <TouchableOpacity
      key={event.id}
      style={styles.eventCard}
      activeOpacity={0.9}
      testID={`concert-${event.id}`}
    >
      <Image source={{ uri: event.image }} style={styles.eventImage} />
      <LinearGradient
        colors={["transparent", "rgba(0,0,0,0.9)"]}
        style={styles.eventGradient}
      >
        <View style={styles.liveIndicator}>
          <Radio size={12} color="#FFF" />
          <Text style={styles.liveText}>UPCOMING</Text>
        </View>
        <Text style={styles.eventTitle}>{event.title}</Text>
        <Text style={styles.eventArtist}>{event.artist}</Text>
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
        <Text style={styles.headerTitle}>🎸 Concerts</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upcoming Concerts</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.eventsScroll}
          >
            {upcomingConcerts.map(renderConcertEvent)}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Concert Recordings</Text>
            <Text style={styles.sectionCount}>{concertVideos.length} videos</Text>
          </View>

          <View style={styles.performancesGrid}>
            {concertVideos.map(renderPerformance)}
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
  placeholder: {
    width: 40,
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
  eventsScroll: {
    paddingHorizontal: 20,
    gap: 16,
  },
  eventCard: {
    width: width - 40,
    height: 240,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#1A1A1A",
  },
  eventImage: {
    width: "100%",
    height: "100%",
  },
  eventGradient: {
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
    backgroundColor: "rgba(255, 107, 107, 0.9)",
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
  eventTitle: {
    fontSize: 24,
    fontWeight: "700" as const,
    color: "#FFF",
    marginBottom: 4,
  },
  eventArtist: {
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
