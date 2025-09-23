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
import { audiobooks } from "@/data/mockData";
import type { Track } from "@/types";

export default function AudiobooksScreen() {
  const { playTrack } = usePlayer();

  const renderAudiobook = ({ item }: { item: Track }) => (
    <TouchableOpacity
      style={styles.audiobookCard}
      onPress={() => playTrack(item)}
      activeOpacity={0.8}
      testID={`audiobook-${item.id}`}
    >
      <Image source={{ uri: item.artwork }} style={styles.audiobookImage} />
      <View style={styles.audiobookInfo}>
        <Text style={styles.audiobookTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.audiobookAuthor} numberOfLines={1}>
          {item.artist}
        </Text>
        <Text style={styles.audiobookLabel}>Audiobook</Text>
      </View>
      <TouchableOpacity style={styles.playButton} onPress={() => playTrack(item)}>
        <Play size={16} color="#000" fill="#FFF" />
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
        <Text style={styles.title}>Latest Books</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <FlatList
          data={audiobooks}
          renderItem={renderAudiobook}
          keyExtractor={(item) => `audiobook-${item.id}`}
          scrollEnabled={false}
          contentContainerStyle={styles.list}
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
  list: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  audiobookCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1A1A1A",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  audiobookImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  audiobookInfo: {
    flex: 1,
  },
  audiobookTitle: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  audiobookAuthor: {
    color: "#999",
    fontSize: 14,
    marginBottom: 2,
  },
  audiobookLabel: {
    color: "#B892FF",
    fontSize: 12,
    fontWeight: "600",
  },
  playButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
  },
});