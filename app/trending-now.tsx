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
import { ArrowLeft, Search } from "lucide-react-native";
import { router } from "expo-router";
import { Stack } from "expo-router";
import { usePlayer } from "@/contexts/PlayerContext";
import { trendingNow } from "@/data/mockData";
import type { Track } from "@/types";

export default function TrendingNowScreen() {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const { playTrack } = usePlayer();
  const CARD_WIDTH = (width - 60) / 2;

  const renderTrendingItem = ({ item, index }: { item: Track; index: number }) => (
    <TouchableOpacity
      style={[styles.trendingCard, { width: CARD_WIDTH }]}
      onPress={() => playTrack(item)}
      activeOpacity={0.8}
      testID={`trending-${item.id}`}
    >
      <Image source={{ uri: item.artwork }} style={[styles.cardImage, { width: CARD_WIDTH, height: CARD_WIDTH }]} />
      <View style={styles.cardInfo}>
        <Text style={styles.cardTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.cardArtist} numberOfLines={1}>
          {item.artist}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerStyle: { backgroundColor: "#0B0A14" },
          headerTintColor: "#FFF",
          headerTitle: "Trending Now",
          headerTitleStyle: {
            fontSize: 18,
            fontWeight: "600",
          },
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
              <ArrowLeft size={24} color="#FFF" />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity onPress={() => router.push('/search')} style={styles.headerButton}>
              <Search size={24} color="#FFF" />
            </TouchableOpacity>
          ),
        }}
      />
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <FlatList
          data={trendingNow}
          renderItem={renderTrendingItem}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.row}
          scrollEnabled={false}
          contentContainerStyle={styles.gridContainer}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B0A14",
  },
  headerButton: {
    padding: 8,
  },
  scrollContent: {
    paddingTop: 20,
  },
  gridContainer: {
    paddingHorizontal: 20,
  },
  row: {
    justifyContent: "space-between",
    marginBottom: 24,
  },
  trendingCard: {
    marginBottom: 8,
  },
  cardImage: {
    borderRadius: 12,
    marginBottom: 12,
  },
  cardInfo: {
    paddingHorizontal: 4,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFF",
    marginBottom: 4,
    lineHeight: 18,
  },
  cardArtist: {
    fontSize: 12,
    color: "#999",
  },
});