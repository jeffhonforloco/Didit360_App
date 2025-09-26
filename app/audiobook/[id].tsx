import React, { useState } from "react";
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
import { ArrowLeft, Play, BookOpen, Star, MoreHorizontal } from "lucide-react-native";
import { router, useLocalSearchParams } from "expo-router";
import { usePlayer } from "@/contexts/PlayerContext";
import { audiobookDetails, audiobooks } from "@/data/mockData";
import type { AudiobookDetails } from "@/data/mockData";

const { width } = Dimensions.get("window");

export default function AudiobookDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { playTrack } = usePlayer();
  const [isReading, setIsReading] = useState(false);

  console.log('Audiobook ID from params:', id);
  console.log('Available audiobook IDs:', audiobooks.map(book => book.id));
  console.log('Available detail IDs:', Object.keys(audiobookDetails));

  const audiobook = audiobooks.find((book) => book.id === id);
  const details: AudiobookDetails | undefined = id ? audiobookDetails[id] : undefined;

  console.log('Found audiobook:', audiobook);
  console.log('Found details:', details);

  if (!audiobook || !details) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            testID="back-button"
          >
            <ArrowLeft size={24} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.title}>Audiobook</Text>
          <View style={styles.moreButton} />
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Audiobook not found</Text>
          <Text style={styles.errorSubtext}>ID: {id}</Text>
          <Text style={styles.errorSubtext}>Available IDs: {audiobooks.map(book => book.id).join(', ')}</Text>
          
          <View style={styles.availableBooks}>
            <Text style={styles.availableBooksTitle}>Available Audiobooks:</Text>
            {audiobooks.slice(0, 3).map((book) => (
              <TouchableOpacity
                key={book.id}
                style={styles.bookOption}
                onPress={() => router.replace(`/audiobook/${book.id}`)}
              >
                <Text style={styles.bookOptionText}>{book.title} (ID: {book.id})</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </SafeAreaView>
    );
  }

  const handlePlayAudio = () => {
    playTrack(audiobook);
    router.push("/player");
  };

  const handleReadBook = () => {
    setIsReading(true);
  };

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          size={16}
          color={i <= rating ? "#FF6B35" : "#666"}
          fill={i <= rating ? "#FF6B35" : "transparent"}
        />
      );
    }
    return stars;
  };

  if (isReading && details.content) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <View style={styles.readingHeader}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setIsReading(false)}
            testID="back-button"
          >
            <ArrowLeft size={24} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.readingTitle}>{details.title}</Text>
          <TouchableOpacity style={styles.moreButton}>
            <MoreHorizontal size={24} color="#FFF" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.readingContent} showsVerticalScrollIndicator={false}>
          <Text style={styles.contentText}>{details.content}</Text>
        </ScrollView>

        <View style={styles.readingFooter}>
          <Text style={styles.pageInfo}>67 of 278</Text>
          <TouchableOpacity style={styles.bookmarkButton}>
            <BookOpen size={24} color="#FFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.progressBar}>
          <View style={[styles.progress, { width: "24%" }]} />
        </View>
      </SafeAreaView>
    );
  }

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
        <Text style={styles.title}>{details.title}</Text>
        <TouchableOpacity style={styles.moreButton}>
          <MoreHorizontal size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.bookCover}>
          <Image source={{ uri: details.artwork }} style={styles.coverImage} />
        </View>

        <View style={styles.bookInfo}>
          <Text style={styles.bookTitle}>{details.title}</Text>
          <Text style={styles.bookAuthor}>{details.author}</Text>

          <View style={styles.ratingContainer}>
            <View style={styles.stars}>{renderStars(details.rating)}</View>
            <Text style={styles.ratingText}>{details.rating.toFixed(1)}</Text>
          </View>

          <View style={styles.genreContainer}>
            {details.genres.map((genre, index) => (
              <View key={index} style={styles.genreTag}>
                <Text style={styles.genreText}>{genre}</Text>
              </View>
            ))}
          </View>

          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={styles.playButton}
              onPress={handlePlayAudio}
              testID="play-audio-button"
            >
              <Play size={20} color="#FFF" fill="#FFF" />
              <Text style={styles.playButtonText}>Play Audio</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.readButton}
              onPress={handleReadBook}
              testID="read-book-button"
            >
              <BookOpen size={20} color="#FFF" />
              <Text style={styles.readButtonText}>Read Book</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.summarySection}>
            <Text style={styles.summaryTitle}>Summary</Text>
            <Text style={styles.summaryText}>{details.summary}</Text>
          </View>
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
    fontSize: 18,
    fontWeight: "700",
    color: "#FFF",
    flex: 1,
    textAlign: "center",
    marginHorizontal: 16,
  },
  moreButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#1A1A1A",
    justifyContent: "center",
    alignItems: "center",
  },
  bookCover: {
    alignItems: "center",
    paddingVertical: 20,
  },
  coverImage: {
    width: width * 0.6,
    height: width * 0.9,
    borderRadius: 12,
  },
  bookInfo: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  bookTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FFF",
    textAlign: "center",
    marginBottom: 8,
  },
  bookAuthor: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
    marginBottom: 16,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  stars: {
    flexDirection: "row",
    marginRight: 8,
  },
  ratingText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFF",
  },
  genreContainer: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
    marginBottom: 30,
  },
  genreTag: {
    backgroundColor: "#1A1A1A",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 4,
    marginVertical: 4,
    borderWidth: 1,
    borderColor: "#333",
  },
  genreText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "500",
  },
  actionButtons: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 30,
  },
  playButton: {
    flex: 1,
    backgroundColor: "#C53030",
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  playButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
  readButton: {
    flex: 1,
    backgroundColor: "transparent",
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: "#FFF",
  },
  readButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
  summarySection: {
    marginTop: 10,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFF",
    marginBottom: 12,
  },
  summaryText: {
    fontSize: 16,
    color: "#CCC",
    lineHeight: 24,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  errorText: {
    color: "#FFF",
    fontSize: 18,
    textAlign: "center",
    marginBottom: 10,
  },
  errorSubtext: {
    color: "#999",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 5,
  },
  availableBooks: {
    marginTop: 20,
    width: "100%",
  },
  availableBooksTitle: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 10,
  },
  bookOption: {
    backgroundColor: "#1A1A1A",
    borderRadius: 8,
    padding: 12,
    marginVertical: 4,
    borderWidth: 1,
    borderColor: "#333",
  },
  bookOptionText: {
    color: "#FFF",
    fontSize: 14,
    textAlign: "center",
  },
  // Reading mode styles
  readingHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#1A1A1A",
  },
  readingTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFF",
    flex: 1,
    textAlign: "center",
    marginHorizontal: 16,
  },
  readingContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  contentText: {
    fontSize: 16,
    color: "#FFF",
    lineHeight: 28,
    paddingBottom: 100,
  },
  readingFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: "#1A1A1A",
  },
  pageInfo: {
    fontSize: 14,
    color: "#999",
  },
  bookmarkButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#1A1A1A",
    justifyContent: "center",
    alignItems: "center",
  },
  progressBar: {
    height: 4,
    backgroundColor: "#1A1A1A",
  },
  progress: {
    height: "100%",
    backgroundColor: "#FFF",
  },
});