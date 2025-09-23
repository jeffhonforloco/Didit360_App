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
import { ArrowLeft, Search } from "lucide-react-native";
import { router, Stack } from "expo-router";
import { usePlayer } from "@/contexts/PlayerContext";
import { popularArtists } from "@/data/mockData";

interface Artist {
  id: string;
  name: string;
  image: string;
  followers: string;
  verified: boolean;
}

export default function PopularArtistsScreen() {
  const { width } = useWindowDimensions();
  const { playTrack } = usePlayer();
  const CARD_WIDTH = (width - 60) / 2;

  const renderArtistItem = ({ item }: { item: Artist }) => (
    <TouchableOpacity
      style={[styles.artistCard, { width: CARD_WIDTH }]}
      onPress={() => console.log("Artist selected:", item.name)}
      activeOpacity={0.8}
      testID={`artist-${item.id}`}
    >
      <Image source={{ uri: item.image }} style={[styles.artistImage, { width: CARD_WIDTH, height: CARD_WIDTH }]} />
      <View style={styles.artistInfo}>
        <Text style={styles.artistName} numberOfLines={1}>
          {item.name}
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
          headerTitle: "Popular Artists",
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
          data={popularArtists}
          renderItem={renderArtistItem}
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
  artistCard: {
    marginBottom: 8,
  },
  artistImage: {
    borderRadius: 70,
    marginBottom: 12,
  },
  artistInfo: {
    alignItems: "center",
    paddingHorizontal: 4,
  },
  artistName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFF",
    textAlign: "center",
  },
});