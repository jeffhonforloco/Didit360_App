import React from "react";
import { StyleSheet, Text, View, ImageBackground, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { usePlayer } from "@/contexts/PlayerContext";
import { ChevronDown, Share2 } from "lucide-react-native";
import { router } from "expo-router";

export default function LyricsScreen() {
  const { currentTrack } = usePlayer();

  if (!currentTrack) {
    router.back();
    return null;
  }

  return (
    <View style={styles.container}>
      <ImageBackground
        source={{ uri: currentTrack.artwork }}
        style={styles.bg}
        blurRadius={30}
        resizeMode="cover"
      >
        <SafeAreaView style={styles.overlay} edges={["top"]}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} testID="lyrics-back">
              <ChevronDown size={28} color="#FFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle} numberOfLines={1}>Lyrics</Text>
            <TouchableOpacity>
              <Share2 size={22} color="#FFF" />
            </TouchableOpacity>
          </View>

          <ScrollView
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.songMeta}>
              <Text style={styles.songTitle} numberOfLines={1}>{currentTrack.title}</Text>
              <Text style={styles.songArtist} numberOfLines={1}>{currentTrack.artist}</Text>
            </View>

            {/* Mock lyrics to match visuals; replace with synced lyrics when available */}
            {LYRICS.map((line, idx) => (
              <Text
                key={`${idx}-${line}`}
                style={[styles.line, idx === 4 ? styles.lineActive : undefined]}
                accessibilityLabel={`lyrics-line-${idx}`}
              >
                {line}
              </Text>
            ))}

            <View style={{ height: 120 }} />
          </ScrollView>
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
}

const LYRICS: string[] = [
  "In a deep neon city, under violet skies",
  "Echoes of the midnight, where the daylight dies",
  "Footsteps in the rhythm, hearts begin to move",
  "Shadows turn to color, finding out the groove",
  "Come to me, come to me, closer than before",
  "Feel the spark between us, brighter at the core",
  "Every beat is falling right into its place",
  "Running with the starlight, chasing outer space",
];

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  bg: { flex: 1 },
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.45)" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  headerTitle: { color: "#FFF", fontSize: 16, fontWeight: "700" },
  content: { paddingHorizontal: 24, paddingTop: 20 },
  songMeta: { alignItems: "center", marginBottom: 24 },
  songTitle: { color: "#FFF", fontSize: 22, fontWeight: "800", marginBottom: 6 },
  songArtist: { color: "#D1D5DB", fontSize: 14, fontWeight: "600" },
  line: {
    color: "#E5E7EB",
    fontSize: 18,
    lineHeight: 28,
    textAlign: "center",
    marginBottom: 14,
    opacity: 0.7,
  },
  lineActive: { color: "#FFFFFF", opacity: 1, fontWeight: "800" },
});
