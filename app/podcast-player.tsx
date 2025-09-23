import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import {
  ArrowLeft,
  MoreVertical,
  Heart,
  X,
  SkipBack,
  SkipForward,
  Play,
  Pause,
  RotateCcw,
  Smartphone,
  Wifi,
  Volume2,
  Shuffle,

} from "lucide-react-native";
import { router, useLocalSearchParams } from "expo-router";
import { usePlayer } from "@/contexts/PlayerContext";
import { useLibrary } from "@/contexts/LibraryContext";
import { allTracks, podcastEpisodes } from "@/data/mockData";



export default function PodcastPlayerScreen() {
  const { width } = useWindowDimensions();
  const { trackId } = useLocalSearchParams<{ trackId: string }>();
  const { currentTrack, isPlaying, togglePlayPause, skipNext, skipPrevious } = usePlayer();
  const { toggleFavorite, isFavorite } = useLibrary();
  const [progress, setProgress] = useState(0.4);


  // Find the track if trackId is provided, otherwise use current track
  const track = trackId ? allTracks.find(t => t.id === trackId) || currentTrack : currentTrack;

  if (!track) {
    router.back();
    return null;
  }

  // Get podcast episode data if available
  const episodeData = podcastEpisodes[track.id];
  const lyrics = episodeData?.transcript?.split('\n') || [
    "Don't remind me",
    "I'm minding my own damn business",
    "Don't try to find me",
    "I'm better left alone than in this",
    "It doesn't surprise me",
    "Do you really think that I could care"
  ];
  const hostInfo = episodeData?.hostInfo;
  const liveEvents = episodeData?.liveEvents || [];

  const isLiked = isFavorite(track.id);
  const currentTime = Math.floor((track.duration * progress) / 60);
  const currentSeconds = Math.floor((track.duration * progress) % 60);
  const totalMinutes = Math.floor(track.duration / 60);
  const totalSeconds = track.duration % 60;

  const formatTime = (minutes: number, seconds: number) => {
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <LinearGradient
      colors={["#1A1A2E", "#16213E", "#0F0F23"]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()}>
              <ArrowLeft size={24} color="#FFF" />
            </TouchableOpacity>
            <View style={styles.headerCenter}>
              <Text style={styles.headerSubtitle}>Playing from Playlist</Text>
              <Text style={styles.headerTitle}>Mega Hit Mix</Text>
            </View>
            <TouchableOpacity>
              <MoreVertical size={24} color="#FFF" />
            </TouchableOpacity>
          </View>

          {/* Artwork */}
          <View style={styles.artworkContainer}>
            <Image
              source={{ uri: track.artwork }}
              style={[styles.artwork, { width: width - 120, height: width - 120 }]}
            />
          </View>

          {/* Track Info */}
          <View style={styles.trackInfo}>
            <View style={styles.titleRow}>
              <View style={styles.titleContainer}>
                <Text style={styles.title} numberOfLines={1}>
                  {track.title}
                </Text>
                <Text style={styles.artist} numberOfLines={1}>
                  {track.artist}
                </Text>
              </View>
              <TouchableOpacity onPress={() => toggleFavorite(track)}>
                <Heart
                  size={24}
                  color={isLiked ? "#FF0080" : "#FFF"}
                  fill={isLiked ? "#FF0080" : "transparent"}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            <TouchableOpacity 
              style={styles.sliderContainer}
              activeOpacity={1}
              onPress={(e) => {
                const { locationX } = e.nativeEvent;
                const containerWidth = width - 40;
                const newProgress = Math.max(0, Math.min(1, locationX / containerWidth));
                setProgress(newProgress);
              }}
            >
              <View style={styles.sliderTrack}>
                <View style={[styles.sliderProgress, { width: `${progress * 100}%` }]} />
                <View style={[styles.sliderThumb, { left: `${progress * 100}%` }]} />
              </View>
            </TouchableOpacity>
            <View style={styles.timeRow}>
              <Text style={styles.time}>{formatTime(currentTime, currentSeconds)}</Text>
              <Text style={styles.time}>{formatTime(totalMinutes, totalSeconds)}</Text>
            </View>
          </View>

          {/* Controls */}
          <View style={styles.controls}>
            <TouchableOpacity style={styles.controlButton}>
              <X size={20} color="#FFF" />
            </TouchableOpacity>

            <TouchableOpacity onPress={skipPrevious} style={styles.controlButton}>
              <SkipBack size={28} color="#FFF" fill="#FFF" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={togglePlayPause}
              style={styles.playButton}
            >
              {isPlaying ? (
                <Pause size={28} color="#FFF" fill="#FFF" />
              ) : (
                <Play size={28} color="#FFF" fill="#FFF" style={styles.playIcon} />
              )}
            </TouchableOpacity>

            <TouchableOpacity onPress={skipNext} style={styles.controlButton}>
              <SkipForward size={28} color="#FFF" fill="#FFF" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.controlButton}>
              <RotateCcw size={20} color="#FFF" />
            </TouchableOpacity>
          </View>

          {/* Device Info */}
          <View style={styles.deviceInfo}>
            <View style={styles.deviceRow}>
              <Smartphone size={16} color="#FFF" />
              <Text style={styles.deviceText}>Current device</Text>
              <Text style={styles.deviceSubtext}>This phone</Text>
            </View>
            <View style={styles.deviceActions}>
              <TouchableOpacity style={styles.deviceAction}>
                <Volume2 size={16} color="#FFF" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.deviceAction}>
                <Wifi size={16} color="#FFF" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Lyrics Section */}
          <View style={styles.lyricsSection}>
            <View style={styles.lyricsSectionHeader}>
              <View style={styles.lyricsHeaderLeft}>
                <Volume2 size={16} color="#FFF" />
                <Text style={styles.lyricsTitle}>Lyrics</Text>
              </View>
              <TouchableOpacity>
                <Shuffle size={16} color="#FFF" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.lyricsContainer}>
              {lyrics.map((line, index) => (
                <Text key={`lyrics-${index}-${line.slice(0, 10)}`} style={styles.lyricsLine}>
                  {line}
                </Text>
              ))}
            </View>
          </View>

          {/* Artist Info Section */}
          {hostInfo && (
            <View style={styles.artistSection}>
              <Text style={styles.sectionTitle}>About the artist</Text>
              <View style={styles.artistCard}>
                <Image source={{ uri: hostInfo.image }} style={styles.artistImage} />
                <View style={styles.artistInfo}>
                  <Text style={styles.artistName}>{hostInfo.name}</Text>
                  <Text style={styles.artistFollowers}>{hostInfo.followers}</Text>
                  <Text style={styles.artistDescription} numberOfLines={3}>
                    {hostInfo.bio} <Text style={styles.seeMore}>See more</Text>
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* Live Events Section */}
          {liveEvents.length > 0 && (
            <View style={styles.eventsSection}>
              <Text style={styles.sectionTitle}>Live events</Text>
              {liveEvents.map((event, index) => (
                <View key={`event-${index}-${event.title}`} style={styles.eventCard}>
                  <Image source={{ uri: event.image }} style={styles.eventImage} />
                  <View style={styles.eventInfo}>
                    <Text style={styles.eventTitle}>{event.title}</Text>
                    <Text style={styles.eventDate}>{event.date}</Text>
                    <TouchableOpacity style={styles.findTicketsButton}>
                      <Text style={styles.findTicketsText}>Find tickets</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          )}

          <View style={styles.bottomSpacer} />
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerCenter: {
    alignItems: "center",
  },
  headerSubtitle: {
    fontSize: 12,
    color: "#999",
    marginBottom: 2,
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFF",
  },
  artworkContainer: {
    alignItems: "center",
    paddingHorizontal: 60,
    marginTop: 20,
    marginBottom: 30,
  },
  artwork: {
    borderRadius: 12,
  },
  trackInfo: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#FFF",
    marginBottom: 4,
  },
  artist: {
    fontSize: 16,
    color: "#999",
  },
  progressContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sliderContainer: {
    height: 40,
    justifyContent: 'center',
  },
  sliderTrack: {
    height: 4,
    backgroundColor: '#333',
    borderRadius: 2,
    position: 'relative',
  },
  sliderProgress: {
    height: '100%',
    backgroundColor: '#FF0080',
    borderRadius: 2,
  },
  sliderThumb: {
    position: 'absolute',
    top: -6,
    width: 16,
    height: 16,
    backgroundColor: '#FF0080',
    borderRadius: 8,
    marginLeft: -8,
  },
  timeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  time: {
    fontSize: 12,
    color: "#999",
  },
  controls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  controlButton: {
    padding: 12,
    marginHorizontal: 16,
  },
  playButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#FF0080",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 20,
  },
  playIcon: {
    marginLeft: 2,
  },
  deviceInfo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginBottom: 20,
  },
  deviceRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  deviceText: {
    fontSize: 14,
    color: "#FFF",
    marginLeft: 8,
  },
  deviceSubtext: {
    fontSize: 12,
    color: "#999",
    marginLeft: 4,
  },
  deviceActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  deviceAction: {
    padding: 8,
    marginLeft: 8,
  },
  lyricsSection: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  lyricsSectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  lyricsHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  lyricsTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFF",
    marginLeft: 8,
  },
  lyricsContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 12,
    padding: 20,
  },
  lyricsLine: {
    fontSize: 16,
    color: "#FFF",
    lineHeight: 24,
    marginBottom: 8,
  },
  artistSection: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFF",
    marginBottom: 16,
  },
  artistCard: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
  },
  artistImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 16,
  },
  artistInfo: {
    flex: 1,
  },
  artistName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFF",
    marginBottom: 4,
  },
  artistFollowers: {
    fontSize: 12,
    color: "#999",
    marginBottom: 8,
  },
  artistDescription: {
    fontSize: 14,
    color: "#CCC",
    lineHeight: 20,
  },
  seeMore: {
    color: "#FF0080",
    fontWeight: "500",
  },
  eventsSection: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  eventCard: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    marginBottom: 12,
  },
  eventImage: {
    width: 80,
    height: 60,
    borderRadius: 8,
    marginRight: 16,
  },
  eventInfo: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFF",
    marginBottom: 4,
  },
  eventDate: {
    fontSize: 12,
    color: "#999",
    marginBottom: 12,
  },
  findTicketsButton: {
    alignSelf: "flex-start",
    paddingHorizontal: 16,
    paddingVertical: 6,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 16,
  },
  findTicketsText: {
    fontSize: 12,
    color: "#FFF",
    fontWeight: "500",
  },
  bottomSpacer: {
    height: 100,
  },
});