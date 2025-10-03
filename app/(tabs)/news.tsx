import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  Linking,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ExternalLink, Newspaper, Clock, User, Tag } from "lucide-react-native";
import * as WebBrowser from "expo-web-browser";
import { trpc } from "@/lib/trpc";
import { Stack } from "expo-router";

const CATEGORIES = ["All", "Music", "Technology", "Events", "Industry", "Production"];

export default function NewsScreen() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const newsQuery = trpc.news.fetchNews.useQuery({
    limit: 50,
    category: selectedCategory === "All" ? undefined : selectedCategory,
  });

  const onRefresh = () => {
    newsQuery.refetch();
  };

  const openArticle = async (url: string) => {
    try {
      await WebBrowser.openBrowserAsync(url);
    } catch (e) {
      console.error("[News] Error opening article", e);
      Linking.openURL(url);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return "Just now";
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Newspaper size={28} color="#6EE7B7" />
          <Text style={styles.headerTitle}>Didit360 News</Text>
        </View>
        <Text style={styles.headerSubtitle}>Latest music industry updates</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
        contentContainerStyle={styles.categoriesContent}
      >
        {CATEGORIES.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryChip,
              selectedCategory === category && styles.categoryChipActive,
            ]}
            onPress={() => setSelectedCategory(category)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategory === category && styles.categoryTextActive,
              ]}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl
            refreshing={newsQuery.isRefetching}
            onRefresh={onRefresh}
            tintColor="#6EE7B7"
            colors={["#6EE7B7"]}
          />
        }
      >
        {newsQuery.isLoading && !newsQuery.data ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#6EE7B7" />
            <Text style={styles.loadingText}>Loading news...</Text>
          </View>
        ) : newsQuery.error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Failed to load news</Text>
            <TouchableOpacity style={styles.retryButton} onPress={onRefresh}>
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : newsQuery.data && newsQuery.data.length > 0 ? (
          <>
            {newsQuery.data[0] && (
              <TouchableOpacity
                style={styles.featuredCard}
                onPress={() => openArticle(newsQuery.data[0].url)}
                activeOpacity={0.9}
              >
                <Image
                  source={{ uri: newsQuery.data[0].imageUrl }}
                  style={styles.featuredImage}
                />
                <View style={styles.featuredOverlay} />
                <View style={styles.featuredContent}>
                  <View style={styles.featuredBadge}>
                    <Text style={styles.featuredBadgeText}>FEATURED</Text>
                  </View>
                  <Text style={styles.featuredTitle} numberOfLines={3}>
                    {newsQuery.data[0].title}
                  </Text>
                  <Text style={styles.featuredExcerpt} numberOfLines={2}>
                    {newsQuery.data[0].excerpt}
                  </Text>
                  <View style={styles.featuredMeta}>
                    <View style={styles.metaItem}>
                      <User size={12} color="#9CA3AF" />
                      <Text style={styles.metaText}>{newsQuery.data[0].author}</Text>
                    </View>
                    <View style={styles.metaItem}>
                      <Clock size={12} color="#9CA3AF" />
                      <Text style={styles.metaText}>
                        {formatDate(newsQuery.data[0].publishedAt)}
                      </Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            )}

            <View style={styles.articlesGrid}>
              {newsQuery.data.slice(1).map((article) => (
                <TouchableOpacity
                  key={article.id}
                  style={styles.articleCard}
                  onPress={() => openArticle(article.url)}
                  activeOpacity={0.9}
                >
                  <Image
                    source={{ uri: article.imageUrl }}
                    style={styles.articleImage}
                  />
                  <View style={styles.articleContent}>
                    <View style={styles.articleHeader}>
                      <View style={styles.categoryBadge}>
                        <Tag size={10} color="#6EE7B7" />
                        <Text style={styles.categoryBadgeText}>{article.category}</Text>
                      </View>
                      <Text style={styles.articleTime}>
                        {formatDate(article.publishedAt)}
                      </Text>
                    </View>
                    <Text style={styles.articleTitle} numberOfLines={2}>
                      {article.title}
                    </Text>
                    <Text style={styles.articleExcerpt} numberOfLines={2}>
                      {article.excerpt}
                    </Text>
                    <View style={styles.articleFooter}>
                      <View style={styles.authorContainer}>
                        <User size={12} color="#6B7280" />
                        <Text style={styles.authorText}>{article.author}</Text>
                      </View>
                      <ExternalLink size={14} color="#6EE7B7" />
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={styles.viewMoreButton}
              onPress={() => openArticle("https://www.didit360news.com")}
              activeOpacity={0.9}
            >
              <Text style={styles.viewMoreText}>View More on Didit360 News</Text>
              <ExternalLink size={16} color="#6EE7B7" />
            </TouchableOpacity>
          </>
        ) : (
          <View style={styles.emptyContainer}>
            <Newspaper size={48} color="#374151" />
            <Text style={styles.emptyText}>No news available</Text>
            <Text style={styles.emptySubtext}>Check back later for updates</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A0A0A",
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  headerTitle: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "800" as const,
  },
  headerSubtitle: {
    color: "#9CA3AF",
    fontSize: 14,
    marginTop: 4,
    marginLeft: 40,
  },
  categoriesContainer: {
    maxHeight: 50,
  },
  categoriesContent: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#1F2937",
    marginRight: 8,
  },
  categoryChipActive: {
    backgroundColor: "#6EE7B7",
  },
  categoryText: {
    color: "#9CA3AF",
    fontSize: 14,
    fontWeight: "600" as const,
  },
  categoryTextActive: {
    color: "#0B0B0C",
    fontWeight: "700" as const,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 100,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  loadingText: {
    color: "#9CA3AF",
    fontSize: 14,
    marginTop: 12,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  errorText: {
    color: "#EF4444",
    fontSize: 16,
    fontWeight: "600" as const,
    marginBottom: 16,
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: "#1F2937",
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600" as const,
  },
  featuredCard: {
    margin: 20,
    height: 320,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#111113",
  },
  featuredImage: {
    width: "100%",
    height: "100%",
  },
  featuredOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  featuredContent: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    padding: 20,
  },
  featuredBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#6EE7B7",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 12,
  },
  featuredBadgeText: {
    color: "#0B0B0C",
    fontSize: 11,
    fontWeight: "800" as const,
    letterSpacing: 0.5,
  },
  featuredTitle: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "800" as const,
    marginBottom: 8,
    lineHeight: 28,
  },
  featuredExcerpt: {
    color: "#D1D5DB",
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  featuredMeta: {
    flexDirection: "row",
    gap: 16,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  metaText: {
    color: "#9CA3AF",
    fontSize: 12,
  },
  articlesGrid: {
    paddingHorizontal: 20,
    gap: 16,
  },
  articleCard: {
    backgroundColor: "#111113",
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#1F2937",
    marginBottom: 16,
  },
  articleImage: {
    width: "100%",
    height: 180,
    backgroundColor: "#1F2937",
  },
  articleContent: {
    padding: 16,
  },
  articleHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  categoryBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#1F2937",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  categoryBadgeText: {
    color: "#6EE7B7",
    fontSize: 11,
    fontWeight: "700" as const,
  },
  articleTime: {
    color: "#6B7280",
    fontSize: 12,
  },
  articleTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700" as const,
    marginBottom: 8,
    lineHeight: 22,
  },
  articleExcerpt: {
    color: "#9CA3AF",
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 12,
  },
  articleFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#1F2937",
  },
  authorContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  authorText: {
    color: "#6B7280",
    fontSize: 12,
  },
  viewMoreButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginHorizontal: 20,
    marginTop: 20,
    paddingVertical: 16,
    backgroundColor: "#1F2937",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#374151",
  },
  viewMoreText: {
    color: "#6EE7B7",
    fontSize: 15,
    fontWeight: "700" as const,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 80,
  },
  emptyText: {
    color: "#9CA3AF",
    fontSize: 18,
    fontWeight: "600" as const,
    marginTop: 16,
  },
  emptySubtext: {
    color: "#6B7280",
    fontSize: 14,
    marginTop: 8,
  },
});
