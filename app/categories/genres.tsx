import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft } from "lucide-react-native";
import { router } from "expo-router";
import { genres } from "@/data/mockData";

const genreColors = [
  "#FF0080",
  "#8B5CF6", 
  "#3B82F6",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#EC4899",
  "#6366F1",
];

export default function GenresScreen() {
  const renderGenre = ({ item, index }: { item: string; index: number }) => (
    <TouchableOpacity
      style={[
        styles.genreCard,
        { backgroundColor: genreColors[index % genreColors.length] },
      ]}
      activeOpacity={0.8}
      testID={`genre-${item}`}
      onPress={() => console.log("Genre selected:", item)}
    >
      <Text style={styles.genreText}>{item}</Text>
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
        <Text style={styles.title}>Browse Genres</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <FlatList
          data={genres}
          renderItem={renderGenre}
          keyExtractor={(item) => `genre-${item}`}
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
  grid: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  row: {
    justifyContent: "space-between",
  },
  genreCard: {
    width: "48%",
    height: 120,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    justifyContent: "flex-end",
  },
  genreText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFF",
  },
});