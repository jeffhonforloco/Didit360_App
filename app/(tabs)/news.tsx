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
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ExternalLink, Newspaper, Clock, User, Tag, Download, X, Share2, Bookmark } from "lucide-react-native";
import * as WebBrowser from "expo-web-browser";
import { trpc } from "@/lib/trpc";
import { Stack } from "expo-router";

const CATEGORIES = ["All", "Celebrity", "Entertainment", "Trending News"];

export default function NewsScreen() {
  const insets = useSafeAreaInsets();
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [showDownloadBanner, setShowDownloadBanner] = useState<boolean>(true);

  const newsQuery = trpc.news.fetchNews.useQuery({
    limit: 50,
    category: selectedCategory === "All" ? undefined : selectedCategory,
  });

  const onRefresh = () => {
    newsQuery.refetch();
  };

  const openArticle = async (url: string) => {
    try {
      await WebBrowser.openBrowserAsync(url, {
        toolbarColor: '#0A0A0A',
        controlsColor: '#6EE7B7',
        presentationStyle: WebBrowser.WebBrowserPresentationStyle.PAGE_SHEET,
      });
    } catch (e) {
      console.error("[News] Error opening article", e);
      Linking.openURL(url);
    }
  };

  const openNewsApp = () => {
    const appUrl = Platform.select({
      ios: 'https://apps.apple.com/app/didit360news',
      android: 'https://play.google.com/store/apps/details?id=com.didit360news',
      default: 'https://www.didit360news.com/download',
    });
    Linking.openURL(appUrl);
  };

  const shareArticle = async (article: any) => {
    try {
      if (Platform.OS === 'web') {
        await navigator.share({
          title: article.title,
          text: article.excerpt,
          url: article.url,
        });
      } else {
        const { Share } = await import('react-native');
        await Share.share({
          message: `${article.title}\n\n${article.excerpt}\n\n${article.url}`,
          url: article.url,
        });
      }
    } catch (e) {
      console.log('[News] Share cancelled or failed', e);
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
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <View style={styles.headerTop}>
          <Newspaper size={28} color="#6EE7B7" />
          <Text style={styles.headerTitle}>Didit360 News</Text>
        </View>
        <Text style={styles.headerSubtitle}>Latest music industry updates</Text>
      </View>

      {showDownloadBanner && (
        <View style={styles.downloadBanner}>
          <TouchableOpacity
            style={styles.closeBanner}
            onPress={() => setShowDownloadBanner(false)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <X size={18} color="#9CA3AF" />
          </TouchableOpacity>
          <View style={styles.bannerContent}>
            <View style={styles.bannerIcon}>
              <Download size={24} color="#6EE7B7" />
            </View>
            <View style={styles.bannerText}>
              <Text style={styles.bannerTitle}>Get the Didit360 News App</Text>
              <Text style={styles.bannerSubtitle}>Stay updated with breaking music news</Text>
            </View>
            <TouchableOpacity
              style={styles.downloadButton}
              onPress={openNewsApp}
              activeOpacity={0.8}
            >
              <Text style={styles.downloadButtonText}>Download</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

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
            <View style={styles.errorIcon}>
              <Newspaper size={64} color="#374151" />
            </View>
            <Text style={styles.errorTitle}>Unable to Load News</Text>
            <Text style={styles.errorText}>Please check your connection and try again</Text>
            <TouchableOpacity style={styles.retryButton} onPress={onRefresh}>
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.openAppButton}
              onPress={openNewsApp}
              activeOpacity={0.8}
            >
              <Download size={16} color="#6EE7B7" />
              <Text style={styles.openAppButtonText}>Open Didit360 News App</Text>
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
                      <View style={styles.articleActions}>
                        <TouchableOpacity
                          onPress={() => shareArticle(article)}
                          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                        >
                          <Share2 size={14} color="#6B7280" />
                        </TouchableOpacity>
                        <TouchableOpacity
                          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                        >
                          <Bookmark size={14} color="#6B7280" />
                        </TouchableOpacity>
                        <ExternalLink size={14} color="#6EE7B7" />
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.bottomSection}>
              <TouchableOpacity
                style={styles.viewMoreButton}
                onPress={() => openArticle("https://www.didit360news.com")}
                activeOpacity={0.9}
              >
                <Text style={styles.viewMoreText}>View More on Didit360 News</Text>
                <ExternalLink size={16} color="#6EE7B7" />
              </TouchableOpacity>

              <View style={styles.appPromoCard}>
                <View style={styles.appPromoContent}>
                  <View style={styles.appPromoIcon}>
                    <Newspaper size={32} color="#6EE7B7" />
                  </View>
                  <View style={styles.appPromoText}>
                    <Text style={styles.appPromoTitle}>Get the Full Experience</Text>
                    <Text style={styles.appPromoSubtitle}>
                      Download Didit360 News for breaking alerts, personalized feeds, and offline reading
                    </Text>
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.appPromoButton}
                  onPress={openNewsApp}
                  activeOpacity={0.8}
                >
                  <Download size={18} color="#0B0B0C" />
                  <Text style={styles.appPromoButtonText}>Download App</Text>
                </TouchableOpacity>
              </View>
            </View>
          </>
        ) : (
          <View style={styles.emptyContainer}>
            <Newspaper size={48} color="#374151" />
            <Text style={styles.emptyText}>No news available</Text>
            <Text style={styles.emptySubtext}>Check back later for updates</Text>
          </View>
        )}
      </ScrollView>
    </View>
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
    paddingHorizontal: 40,
  },
  errorIcon: {
    marginBottom: 20,
    opacity: 0.5,
  },
  errorTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "700" as const,
    marginBottom: 8,
    textAlign: "center",
  },
  errorText: {
    color: "#9CA3AF",
    fontSize: 14,
    marginBottom: 24,
    textAlign: "center",
    lineHeight: 20,
  },
  retryButton: {
    paddingHorizontal: 32,
    paddingVertical: 14,
    backgroundColor: "#6EE7B7",
    borderRadius: 12,
    marginBottom: 12,
  },
  retryButtonText: {
    color: "#0B0B0C",
    fontSize: 15,
    fontWeight: "700" as const,
  },
  openAppButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: "#1F2937",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#374151",
  },
  openAppButtonText: {
    color: "#6EE7B7",
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
  articleActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
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
  downloadBanner: {
    marginHorizontal: 20,
    marginBottom: 12,
    backgroundColor: "#111113",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#1F2937",
    overflow: "hidden",
  },
  closeBanner: {
    position: "absolute",
    top: 12,
    right: 12,
    zIndex: 10,
    padding: 4,
  },
  bannerContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 12,
  },
  bannerIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#1F2937",
    justifyContent: "center",
    alignItems: "center",
  },
  bannerText: {
    flex: 1,
  },
  bannerTitle: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700" as const,
    marginBottom: 2,
  },
  bannerSubtitle: {
    color: "#9CA3AF",
    fontSize: 12,
  },
  downloadButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#6EE7B7",
    borderRadius: 8,
  },
  downloadButtonText: {
    color: "#0B0B0C",
    fontSize: 13,
    fontWeight: "700" as const,
  },
  bottomSection: {
    gap: 20,
  },
  appPromoCard: {
    marginHorizontal: 20,
    marginTop: 8,
    padding: 20,
    backgroundColor: "#111113",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#1F2937",
  },
  appPromoContent: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 16,
  },
  appPromoIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: "#1F2937",
    justifyContent: "center",
    alignItems: "center",
  },
  appPromoText: {
    flex: 1,
  },
  appPromoTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "800" as const,
    marginBottom: 6,
  },
  appPromoSubtitle: {
    color: "#9CA3AF",
    fontSize: 13,
    lineHeight: 18,
  },
  appPromoButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    backgroundColor: "#6EE7B7",
    borderRadius: 12,
  },
  appPromoButtonText: {
    color: "#0B0B0C",
    fontSize: 15,
    fontWeight: "800" as const,
  },
});
