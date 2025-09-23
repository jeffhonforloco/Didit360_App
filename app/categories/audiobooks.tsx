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
import { ArrowLeft } from "lucide-react-native";
import { router } from "expo-router";
import {
  audiobookCategories,
  recommendedAudiobooks,
  bestSellerAudiobooks,
  newReleaseAudiobooks,
} from "@/data/mockData";
import type { Track } from "@/types";

export default function AudiobooksScreen() {
  const handleAudiobookPress = (audiobook: Track) => {
    router.push(`/audiobook/${audiobook.id}`);
  };

  const renderCategory = ({ item }: { item: { id: string; title: string; color: string } }) => (
    <TouchableOpacity
      style={[styles.categoryCard, { backgroundColor: item.color }]}
      activeOpacity={0.8}
      testID={`category-${item.id}`}
    >
      <Text style={styles.categoryText}>{item.title}</Text>
    </TouchableOpacity>
  );

  const renderRecommendedBook = ({ item }: { item: Track }) => (
    <TouchableOpacity
      style={styles.recommendedCard}
      onPress={() => handleAudiobookPress(item)}
      activeOpacity={0.8}
      testID={`recommended-${item.id}`}
    >
      <Image source={{ uri: item.artwork }} style={styles.recommendedImage} />
    </TouchableOpacity>
  );

  const renderBestSellerBook = ({ item }: { item: Track }) => (
    <TouchableOpacity
      style={styles.bestSellerCard}
      onPress={() => handleAudiobookPress(item)}
      activeOpacity={0.8}
      testID={`bestseller-${item.id}`}
    >
      <Image source={{ uri: item.artwork }} style={styles.bestSellerImage} />
      <View style={styles.bestSellerInfo}>
        <Text style={styles.bestSellerTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.bestSellerAuthor} numberOfLines={1}>
          {item.artist}
        </Text>
        <View style={styles.ratingContainer}>
          <Text style={styles.ratingStars}>★★★★☆</Text>
        </View>
        <Text style={styles.listenersText}>{item.description}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderNewReleaseBook = ({ item }: { item: Track }) => (
    <TouchableOpacity
      style={styles.newReleaseCard}
      onPress={() => handleAudiobookPress(item)}
      activeOpacity={0.8}
      testID={`newrelease-${item.id}`}
    >
      <Image source={{ uri: item.artwork }} style={styles.newReleaseImage} />
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
        <Text style={styles.title}>Audio Books</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Categories */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Categories</Text>
            <TouchableOpacity>
              <Text style={styles.seeMoreText}>See more</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={audiobookCategories}
            renderItem={renderCategory}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesList}
          />
        </View>

        {/* Recommended For You */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recommended For You</Text>
            <TouchableOpacity>
              <Text style={styles.seeMoreText}>See more</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={recommendedAudiobooks}
            renderItem={renderRecommendedBook}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.recommendedList}
          />
        </View>

        {/* Best Seller */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Best Seller</Text>
            <TouchableOpacity>
              <Text style={styles.seeMoreText}>See more</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={bestSellerAudiobooks}
            renderItem={renderBestSellerBook}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            contentContainerStyle={styles.bestSellerList}
          />
        </View>

        {/* New Releases */}
        <View style={[styles.section, { paddingBottom: 120 }]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>New Releases</Text>
            <TouchableOpacity>
              <Text style={styles.seeMoreText}>See more</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={newReleaseAudiobooks}
            renderItem={renderNewReleaseBook}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.newReleasesList}
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
  section: {
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFF",
  },
  seeMoreText: {
    fontSize: 14,
    color: "#C53030",
    fontWeight: "600",
  },
  categoriesList: {
    paddingHorizontal: 20,
  },
  categoryCard: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    marginRight: 12,
  },
  categoryText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "600",
  },
  recommendedList: {
    paddingHorizontal: 20,
  },
  recommendedCard: {
    marginRight: 16,
  },
  recommendedImage: {
    width: 140,
    height: 200,
    borderRadius: 12,
  },
  bestSellerList: {
    paddingHorizontal: 20,
  },
  bestSellerCard: {
    flexDirection: "row",
    backgroundColor: "#C53030",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: "center",
  },
  bestSellerImage: {
    width: 60,
    height: 80,
    borderRadius: 8,
    marginRight: 16,
  },
  bestSellerInfo: {
    flex: 1,
  },
  bestSellerTitle: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
  },
  bestSellerAuthor: {
    color: "#FFF",
    fontSize: 14,
    opacity: 0.8,
    marginBottom: 8,
  },
  ratingContainer: {
    marginBottom: 4,
  },
  ratingStars: {
    color: "#FFD700",
    fontSize: 14,
  },
  listenersText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "600",
  },
  newReleasesList: {
    paddingHorizontal: 20,
  },
  newReleaseCard: {
    marginRight: 16,
  },
  newReleaseImage: {
    width: 120,
    height: 160,
    borderRadius: 12,
  },
});