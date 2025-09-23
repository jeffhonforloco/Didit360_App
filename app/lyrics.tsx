import React from "react";
import { StyleSheet, Text, View, ImageBackground, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { usePlayer } from "@/contexts/PlayerContext";
import { ArrowLeft, SkipBack, SkipForward, Play, Pause, RotateCcw } from "lucide-react-native";
import { router } from "expo-router";

export default function LyricsScreen() {
  const { currentTrack, isPlaying, togglePlayPause, skipNext, skipPrevious } = usePlayer();

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
        <LinearGradient
          colors={['rgba(0,0,0,0.4)', 'rgba(0,0,0,0.7)', 'rgba(0,0,0,0.9)']}
          style={styles.overlay}
        >
          <SafeAreaView style={styles.safeArea} edges={["top"]}>
            <View style={styles.header}>
              <TouchableOpacity onPress={() => router.back()} testID="lyrics-back">
                <ArrowLeft size={28} color="#FFF" />
              </TouchableOpacity>
              <View style={styles.progressIndicator}>
                <View style={styles.progressDot} />
                <View style={styles.progressDot} />
                <View style={[styles.progressDot, styles.progressDotActive]} />
              </View>
              <View style={styles.spacer} />
            </View>

            <ScrollView
              contentContainerStyle={styles.content}
              showsVerticalScrollIndicator={false}
            >
              <Text style={styles.headerTitle}>Lyrics</Text>
              
              {LYRICS.map((line, idx) => (
                <Text
                  key={`${idx}-${line}`}
                  style={[styles.line, idx === 4 ? styles.lineActive : undefined]}
                  accessibilityLabel={`lyrics-line-${idx}`}
                >
                  {line}
                </Text>
              ))}

              <View style={styles.spacingBottom} />
            </ScrollView>
            
            <View style={styles.bottomControls}>
              <View style={styles.progressContainer}>
                <View style={styles.sliderTrack}>
                  <View style={[styles.sliderProgress, { width: '80%' }]} />
                  <View style={[styles.sliderThumb, { left: '80%' }]} />
                </View>
                <View style={styles.timeRow}>
                  <Text style={styles.time}>2:46</Text>
                  <Text style={styles.time}>3:05</Text>
                </View>
              </View>
              
              <View style={styles.controls}>
                <TouchableOpacity style={styles.controlButton}>
                  <RotateCcw size={24} color="#FFF" />
                </TouchableOpacity>
                
                <TouchableOpacity onPress={skipPrevious} style={styles.controlButton}>
                  <SkipBack size={32} color="#FFF" fill="#FFF" />
                </TouchableOpacity>
                
                <TouchableOpacity
                  onPress={togglePlayPause}
                  style={styles.playButton}
                >
                  {isPlaying ? (
                    <Pause size={36} color="#FFF" fill="#FFF" />
                  ) : (
                    <Play size={36} color="#FFF" fill="#FFF" style={styles.playIcon} />
                  )}
                </TouchableOpacity>
                
                <TouchableOpacity onPress={skipNext} style={styles.controlButton}>
                  <SkipForward size={32} color="#FFF" fill="#FFF" />
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.controlButton}>
                  <RotateCcw size={24} color="#FFF" />
                </TouchableOpacity>
              </View>
            </View>
          </SafeAreaView>
        </LinearGradient>
      </ImageBackground>
    </View>
  );
}

const LYRICS: string[] = [
  "It is a long established fact that a reader",
  "will be distracted by the readable content",
  "of a page when looking at its layout. The",
  "point of using Lorem Ipsum is that it It is a",
  "long established fact that a It is a long",
  "established fact that a reader will be distis",
  "that it reader will be distracted by the",
  "readable content of a page when looking",
  "at its layout. The point of using Lorem",
  "Ipsum is that it",
];

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#000" 
  },
  bg: { 
    flex: 1 
  },
  overlay: { 
    flex: 1 
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  progressIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginHorizontal: 4,
  },
  progressDotActive: {
    backgroundColor: '#FFF',
  },
  spacer: {
    width: 28,
  },
  headerTitle: { 
    color: "#FFF", 
    fontSize: 20, 
    fontWeight: "700",
    textAlign: 'center',
    marginBottom: 40,
  },
  content: { 
    paddingHorizontal: 24, 
    paddingTop: 20,
    flex: 1,
  },
  line: {
    color: "#E5E7EB",
    fontSize: 18,
    lineHeight: 28,
    textAlign: "center",
    marginBottom: 14,
    opacity: 0.7,
  },
  lineActive: { 
    color: "#FFFFFF", 
    opacity: 1, 
    fontWeight: "800" 
  },
  spacingBottom: {
    height: 200,
  },
  bottomControls: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  progressContainer: {
    marginBottom: 20,
  },
  sliderTrack: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
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
    fontSize: 14,
    color: "rgba(255,255,255,0.7)",
    fontWeight: '500',
  },
  controls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  controlButton: {
    padding: 12,
  },
  playButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#FF0080",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: '#FF0080',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  playIcon: {
    marginLeft: 4,
  },
});
