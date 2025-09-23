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
import { LinearGradient } from "expo-linear-gradient";
import { browseCategories } from "@/data/mockData";
import type { CategoryItem } from "@/data/mockData";

export default function BrowseCategoriesScreen() {
  const renderCategory = ({ item }: { item: CategoryItem }) => {
    const handleCategoryPress = () => {
      if (item.route) {
        router.push(item.route as any);
      } else {
        console.log("Category", item.title);
      }
    };

    return (
      <TouchableOpacity 
        style={styles.categoryTile} 
        onPress={handleCategoryPress} 
        activeOpacity={0.85} 
        testID={`category-${item.id}`}
      >
        <LinearGradient 
          colors={item.colors} 
          start={{ x: 0, y: 0 }} 
          end={{ x: 1, y: 1 }} 
          style={styles.categoryGradient}
        >
          {item.image && (
            <Image 
              source={{ uri: item.image }} 
              style={styles.categoryImage} 
            />
          )}
          <View style={styles.categoryContent}>
            <Text style={styles.categoryText}>{item.title}</Text>
            {item.description && (
              <Text style={styles.categoryDescription} numberOfLines={3}>
                {item.description}
              </Text>
            )}
          </View>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

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
        <Text style={styles.title}>Browse Categories</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.description}>
          <Text style={styles.descriptionText}>
            Discover content across all categories. From music and podcasts to audiobooks and live performances.
          </Text>
        </View>

        <FlatList
          data={browseCategories}
          renderItem={renderCategory}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.row}
          scrollEnabled={false}
          contentContainerStyle={styles.grid}
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
  description: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  descriptionText: {
    fontSize: 16,
    color: "#B3B3B3",
    lineHeight: 24,
    textAlign: "center",
  },
  grid: {
    paddingHorizontal: 16,
    paddingBottom: 120,
  },
  row: {
    justifyContent: "space-between",
    marginBottom: 20,
  },
  categoryTile: {
    width: "48%",
    height: 160,
  },
  categoryGradient: {
    flex: 1,
    borderRadius: 16,
    overflow: "hidden",
    position: "relative",
  },
  categoryImage: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.3,
  },
  categoryContent: {
    flex: 1,
    justifyContent: "flex-end",
    padding: 16,
  },
  categoryText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 6,
  },
  categoryDescription: {
    color: "#E0E0E0",
    fontSize: 13,
    lineHeight: 18,
  },
});