import React, { useCallback, useMemo, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
  TextInput,
  useWindowDimensions,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ArrowLeft,
  Play,
  Video as VideoIcon,
  Mic2,
  Sparkles,
  Filter,
  ListPlus,
  Search,
  ChevronRight,
  BookOpenCheck,
  Heart,
  TrendingUp,
  Star,
  PlayCircle,
  Settings,
  Bookmark,
  Eye,
  Zap,
} from "lucide-react-native";
import { router } from "expo-router";
import { usePlayer } from "@/contexts/PlayerContext";
import {
  podcasts,
  allPodcastEpisodes,
  podcastCategories,
  popularPodcasts,
  videoTracks,
  popularPodcastArtists,
} from "@/data/mockData";
import type { Track } from "@/types";
import ErrorBoundary from "@/components/ErrorBoundary";
import { generateText, generateObject } from "@rork/toolkit-sdk";
import { z } from "zod";

interface GeneratedMixItem {
  id: string;
  title: string;
  reason: string;
}

interface GeneratedMix {
  topic: string;
  mood: string;
  items: GeneratedMixItem[];
}

interface PodcastRecommendation {
  title: string;
  host: string;
  category: string;
  reason: string;
  estimatedDuration: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

interface PodcastAnalysis {
  keyTopics: string[];
  sentiment: 'positive' | 'neutral' | 'negative';
  complexity: number;
  targetAudience: string;
  mainTakeaways: string[];
}

type MediaKind = "all" | "audio" | "video";
type SortBy = "trending" | "recent" | "popular" | "duration" | "rating";
type ViewMode = "grid" | "list";

type Summaries = Record<string, string>;
type Bookmarks = Record<string, boolean>;
type Likes = Record<string, boolean>;
type PlaybackSpeeds = Record<string, number>;
type WatchProgress = Record<string, number>;

export default function PodcastsScreen() {
  const { width } = useWindowDimensions();
  const { playTrack } = usePlayer();
  
  console.log('[PodcastsScreen] Component mounted with data:', {
    podcasts: podcasts?.length || 0,
    allPodcastEpisodes: allPodcastEpisodes?.length || 0,
    podcastCategories: podcastCategories?.length || 0,
    popularPodcasts: popularPodcasts?.length || 0,
    popularPodcastArtists: popularPodcastArtists?.length || 0,
    width,
    platform: Platform.OS
  });

  // Search and filtering
  const [query, setQuery] = useState<string>("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [mediaKind, setMediaKind] = useState<MediaKind>("all");
  const [sortBy, setSortBy] = useState<SortBy>("trending");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  // AI features
  const [aiTopic, setAiTopic] = useState<string>("");
  const [aiLoading, setAiLoading] = useState<boolean>(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [generated, setGenerated] = useState<GeneratedMix | null>(null);
  const [recommendations, setRecommendations] = useState<PodcastRecommendation[]>([]);
  const [recLoading, setRecLoading] = useState<boolean>(false);

  // Content analysis
  const [summaries, setSummaries] = useState<Summaries>({});
  const [analyses, setAnalyses] = useState<Record<string, PodcastAnalysis>>({});
  const [sumLoadingId, setSumLoadingId] = useState<string | null>(null);
  const [analysisLoadingId, setAnalysisLoadingId] = useState<string | null>(null);

  // User interactions
  const [bookmarks, setBookmarks] = useState<Bookmarks>({});
  const [likes, setLikes] = useState<Likes>({});

  // Advanced features
  const [showAdvancedFilters, setShowAdvancedFilters] = useState<boolean>(false);
  const [minDuration] = useState<number>(0);
  const [maxDuration] = useState<number>(7200); // 2 hours
  const [selectedLanguages] = useState<string[]>([]);
  const [selectedDifficulty] = useState<string[]>([]);

  const listCols = useMemo(() => {
    if (viewMode === "list") return 1;
    return width >= 900 ? 3 : width >= 600 ? 2 : 1;
  }, [width, viewMode]);

  const baseData: Track[] = useMemo(() => {
    // Enhanced podcast data with video podcasts
    const audioPodcasts = [...podcasts, ...allPodcastEpisodes, ...popularPodcasts];
    const videoPodcasts = [
      {
        id: "vp1",
        title: "The Joe Rogan Experience - Elon Musk",
        artist: "Joe Rogan",
        artwork: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
        duration: 10800, // 3 hours
        type: "podcast" as const,
        isVideo: true,
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        description: "Elon Musk discusses Tesla, SpaceX, and the future of technology",
        category: "Technology",
        language: "English",
        difficulty: "intermediate" as const,
        rating: 4.8,
        viewCount: 15000000,
        publishedAt: "2024-01-15",
      },
      {
        id: "vp2",
        title: "TED Talk: The Power of Vulnerability",
        artist: "Brené Brown",
        artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
        duration: 1200, // 20 minutes
        type: "podcast" as const,
        isVideo: true,
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        description: "A powerful talk about vulnerability and human connection",
        category: "Psychology",
        language: "English",
        difficulty: "beginner" as const,
        rating: 4.9,
        viewCount: 25000000,
        publishedAt: "2024-02-01",
      },
      {
        id: "vp3",
        title: "African Tech Entrepreneurs Panel",
        artist: "TechCrunch Africa",
        artwork: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=400&fit=crop",
        duration: 5400, // 90 minutes
        type: "podcast" as const,
        isVideo: true,
        videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
        description: "Leading African entrepreneurs discuss the future of tech in Africa",
        category: "Business",
        language: "English",
        difficulty: "advanced" as const,
        rating: 4.7,
        viewCount: 500000,
        publishedAt: "2024-01-20",
      },
    ];

    let data: Track[] = [];
    switch (mediaKind) {
      case "audio":
        data = audioPodcasts;
        break;
      case "video":
        data = videoPodcasts;
        break;
      default:
        data = [...audioPodcasts, ...videoPodcasts];
    }

    // Apply sorting
    return data.sort((a, b) => {
      switch (sortBy) {
        case "recent":
          return new Date((b as any).publishedAt || '2024-01-01').getTime() - 
                 new Date((a as any).publishedAt || '2024-01-01').getTime();
        case "popular":
          return ((b as any).viewCount || 0) - ((a as any).viewCount || 0);
        case "duration":
          return a.duration - b.duration;
        case "rating":
          return ((b as any).rating || 0) - ((a as any).rating || 0);
        default: // trending
          return Math.random() - 0.5;
      }
    });
  }, [mediaKind, sortBy]);

  const filteredData = useMemo(() => {
    const q = query.trim().toLowerCase();
    return baseData.filter((t) => {
      const matchesQuery = q
        ? (t.title?.toLowerCase().includes(q) ||
            t.artist?.toLowerCase().includes(q) ||
            ("description" in t && (t as any).description?.toLowerCase().includes(q)) ||
            ("category" in t && (t as any).category?.toLowerCase().includes(q)))
        : true;
      const matchesCategory = activeCategory
        ? t.artist?.toLowerCase().includes(activeCategory.toLowerCase()) ||
          t.title?.toLowerCase().includes(activeCategory.toLowerCase()) ||
          ("category" in t && (t as any).category?.toLowerCase().includes(activeCategory.toLowerCase()))
        : true;
      const matchesDuration = t.duration >= minDuration && t.duration <= maxDuration;
      const matchesLanguage = selectedLanguages.length === 0 || 
        ("language" in t && selectedLanguages.includes((t as any).language));
      const matchesDifficulty = selectedDifficulty.length === 0 || 
        ("difficulty" in t && selectedDifficulty.includes((t as any).difficulty));
      
      return matchesQuery && matchesCategory && matchesDuration && matchesLanguage && matchesDifficulty;
    });
  }, [baseData, query, activeCategory, minDuration, maxDuration, selectedLanguages, selectedDifficulty]);

  const onPlay = useCallback(
    (item: Track) => {
      try {
        playTrack(item);
      } catch (e) {
        console.log("[Podcasts] play error", e);
      }
    },
    [playTrack]
  );

  const runAIMix = useCallback(async () => {
    const raw = aiTopic.trim();
    if (!raw) return;
    const topic = raw.slice(0, 100);
    setAiLoading(true);
    setAiError(null);
    try {
      const jsonStr = await generateText({
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: `Create a concise JSON only response for a podcast mix. {"topic": string, "mood": string, "items": [{"title": string, "reason": string}]}. Use 8 items. Topic: ${topic}` },
            ],
          },
        ],
      });
      let parsed: GeneratedMix | null = null;
      try {
        parsed = JSON.parse(jsonStr) as GeneratedMix;
      } catch {
        parsed = {
          topic,
          mood: "curated",
          items: [],
        };
      }

      const safeItems = Array.isArray(parsed.items) ? parsed.items : [];
      const catalog: Track[] = [...podcasts, ...allPodcastEpisodes, ...popularPodcasts, ...videoTracks];
      const selected: GeneratedMixItem[] = [];
      safeItems.forEach((it, idx) => {
        if (!it?.title) return;
        const found = catalog.find(
          (t) =>
            t.title.toLowerCase().includes(it.title.toLowerCase()) ||
            t.artist.toLowerCase().includes(it.title.toLowerCase())
        );
        if (found) {
          selected.push({ id: found.id, title: found.title, reason: (it.reason || `Pick #${idx + 1}`).slice(0, 120) });
        }
      });

      const fallback = catalog.slice(0, Math.max(0, 8 - selected.length)).map((t, i) => ({
        id: t.id,
        title: t.title,
        reason: `Related to ${topic} (${i + 1})`,
      }));

      const final: GeneratedMix = {
        topic: parsed.topic || topic,
        mood: parsed.mood || "informative",
        items: [...selected, ...fallback].slice(0, 8),
      };
      setGenerated(final);
    } catch (e: any) {
      console.log("[Podcasts] AI mix error", e);
      setAiError("Could not generate mix. Try a simpler topic.");
    } finally {
      setAiLoading(false);
    }
  }, [aiTopic]);

  const summarize = useCallback(
    async (item: Track) => {
      if (!item) return;
      setSumLoadingId(item.id);
      try {
        const base = item.title + ". " + (item.artist || "");
        const desc = (item as any).description || "";
        const text = await generateText({
          messages: [
            { role: "user", content: [{ type: "text", text: `Summarize this podcast in 2 sentences: ${base}. ${desc}` }] },
          ],
        });
        setSummaries((prev) => ({ ...prev, [item.id]: text }));
      } catch (e) {
        console.log("[Podcasts] summarize error", e);
        setSummaries((prev) => ({ ...prev, [item.id]: "Summary unavailable." }));
      } finally {
        setSumLoadingId(null);
      }
    },
    []
  );

  const analyzeContent = useCallback(
    async (item: Track) => {
      if (!item) return;
      setAnalysisLoadingId(item.id);
      try {
        const base = item.title + ". " + (item.artist || "");
        const desc = (item as any).description || "";
        const analysisSchema = z.object({
          keyTopics: z.array(z.string()).describe("Main topics discussed"),
          sentiment: z.enum(["positive", "neutral", "negative"]).describe("Overall sentiment"),
          complexity: z.number().min(1).max(10).describe("Content complexity 1-10"),
          targetAudience: z.string().describe("Target audience description"),
          mainTakeaways: z.array(z.string()).describe("Key takeaways")
        });
        
        const analysis = await generateObject({
          messages: [
            { role: "user", content: [{ type: "text", text: `Analyze this podcast content: ${base}. ${desc}. Provide key topics, sentiment, complexity level, target audience, and main takeaways.` }] },
          ],
          schema: analysisSchema,
        });
        
        setAnalyses((prev) => ({ ...prev, [item.id]: analysis }));
      } catch (e) {
        console.log("[Podcasts] analysis error", e);
      } finally {
        setAnalysisLoadingId(null);
      }
    },
    []
  );

  const generateRecommendations = useCallback(
    async (userInterests: string) => {
      if (!userInterests.trim()) return;
      setRecLoading(true);
      try {
        const recSchema = z.object({
          recommendations: z.array(z.object({
            title: z.string(),
            host: z.string(),
            category: z.string(),
            reason: z.string(),
            estimatedDuration: z.number(),
            difficulty: z.enum(["beginner", "intermediate", "advanced"])
          }))
        });
        
        const result = await generateObject({
          messages: [
            { role: "user", content: [{ type: "text", text: `Based on interests: ${userInterests}, recommend 5 podcasts with title, host, category, reason, estimated duration in minutes, and difficulty level.` }] },
          ],
          schema: recSchema,
        });
        
        setRecommendations(result.recommendations);
      } catch (e) {
        console.log("[Podcasts] recommendations error", e);
      } finally {
        setRecLoading(false);
      }
    },
    []
  );

  const toggleBookmark = useCallback((itemId: string) => {
    setBookmarks(prev => ({ ...prev, [itemId]: !prev[itemId] }));
  }, []);

  const toggleLike = useCallback((itemId: string) => {
    setLikes(prev => ({ ...prev, [itemId]: !prev[itemId] }));
  }, []);

  const formatDuration = useCallback((seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  }, []);

  const formatViewCount = useCallback((count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M views`;
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K views`;
    }
    return `${count} views`;
  }, []);

  const renderCard = useCallback(
    ({ item }: { item: Track }) => {
      const isVideoContent = (item as any).isVideo || item.type === "video";
      const itemRating = (item as any).rating;
      const itemViewCount = (item as any).viewCount;
      const itemCategory = (item as any).category;
      const itemDifficulty = (item as any).difficulty;
      const isBookmarked = bookmarks[item.id];
      const isLiked = likes[item.id];
      const hasAnalysis = analyses[item.id];
      
      return (
        <TouchableOpacity
          style={[styles.card, viewMode === "list" ? styles.cardList : null]}
          onPress={() => onPlay(item)}
          activeOpacity={0.85}
          testID={`podcast-card-${item.id}`}
        >
          <View style={styles.cardImageContainer}>
            <Image source={{ uri: item.artwork }} style={styles.cardImage} />
            {isVideoContent && (
              <View style={styles.videoOverlay}>
                <PlayCircle size={24} color="#FFF" />
              </View>
            )}
            {itemRating && (
              <View style={styles.ratingBadge}>
                <Star size={10} color="#FFC107" fill="#FFC107" />
                <Text style={styles.ratingText}>{itemRating.toFixed(1)}</Text>
              </View>
            )}
          </View>
          
          <View style={styles.cardMeta}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle} numberOfLines={2}>
                {item.title}
              </Text>
              <View style={styles.cardActions}>
                <TouchableOpacity
                  onPress={() => toggleBookmark(item.id)}
                  style={styles.actionBtn}
                  testID={`bookmark-${item.id}`}
                >
                  <Bookmark size={16} color={isBookmarked ? "#FFC107" : "#6B7280"} fill={isBookmarked ? "#FFC107" : "none"} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => toggleLike(item.id)}
                  style={styles.actionBtn}
                  testID={`like-${item.id}`}
                >
                  <Heart size={16} color={isLiked ? "#EF4444" : "#6B7280"} fill={isLiked ? "#EF4444" : "none"} />
                </TouchableOpacity>
              </View>
            </View>
            
            <Text style={styles.cardArtist} numberOfLines={1}>
              {item.artist}
            </Text>
            
            <View style={styles.metaRow}>
              <Text style={styles.duration}>{formatDuration(item.duration)}</Text>
              {itemCategory && (
                <View style={styles.categoryPill}>
                  <Text style={styles.categoryText}>{itemCategory}</Text>
                </View>
              )}
              {itemDifficulty && (
                <View style={[styles.difficultyPill, 
                  itemDifficulty === "beginner" ? styles.difficultyBeginner :
                  itemDifficulty === "intermediate" ? styles.difficultyIntermediate :
                  styles.difficultyAdvanced
                ]}>
                  <Text style={styles.difficultyText}>{itemDifficulty}</Text>
                </View>
              )}
            </View>
            
            {itemViewCount && (
              <View style={styles.statsRow}>
                <Eye size={12} color="#6B7280" />
                <Text style={styles.viewCount}>{formatViewCount(itemViewCount)}</Text>
              </View>
            )}
            
            <View style={styles.badgeRow}>
              <View style={[styles.badge, isVideoContent ? styles.badgeVideo : styles.badgeAudio]}>
                {isVideoContent ? (
                  <VideoIcon size={12} color="#0B0A14" />
                ) : (
                  <Mic2 size={12} color="#0B0A14" />
                )}
                <Text style={styles.badgeText}>{isVideoContent ? "Video" : "Audio"}</Text>
              </View>
              <TouchableOpacity
                style={styles.playPill}
                onPress={() => onPlay(item)}
                testID={`play-${item.id}`}
              >
                <Play size={14} color="#000" />
                <Text style={styles.playPillText}>Play</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.aiActionsRow}>
              <TouchableOpacity
                onPress={() => summarize(item)}
                style={styles.aiAction}
                testID={`summarize-${item.id}`}
              >
                <Sparkles size={14} color="#9AE6B4" />
                <Text style={styles.aiActionText}>
                  {sumLoadingId === item.id ? "Summarizing..." : summaries[item.id] ? "Re-summarize" : "AI Summary"}
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={() => analyzeContent(item)}
                style={styles.aiAction}
                testID={`analyze-${item.id}`}
              >
                <Zap size={14} color="#A78BFA" />
                <Text style={styles.aiActionText}>
                  {analysisLoadingId === item.id ? "Analyzing..." : hasAnalysis ? "Re-analyze" : "AI Analyze"}
                </Text>
              </TouchableOpacity>
            </View>
            
            {!!summaries[item.id] && (
              <View style={styles.summaryContainer}>
                <Text style={styles.summaryLabel}>AI Summary:</Text>
                <Text style={styles.summaryText} numberOfLines={3}>
                  {summaries[item.id]}
                </Text>
              </View>
            )}
            
            {!!hasAnalysis && (
              <View style={styles.analysisContainer}>
                <Text style={styles.analysisLabel}>AI Analysis:</Text>
                <View style={styles.topicsRow}>
                  {hasAnalysis.keyTopics.slice(0, 3).map((topic) => (
                    <View key={topic} style={styles.topicTag}>
                      <Text style={styles.topicText}>{topic}</Text>
                    </View>
                  ))}
                </View>
                <Text style={styles.complexityText}>Complexity: {hasAnalysis.complexity}/10</Text>
                <Text style={styles.audienceText}>For: {hasAnalysis.targetAudience}</Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      );
    },
    [onPlay, summaries, sumLoadingId, summarize, analyzeContent, analyses, analysisLoadingId, 
     bookmarks, likes, toggleBookmark, toggleLike, formatDuration, formatViewCount, viewMode]
  );

  const keyExtractor = useCallback((t: Track) => `${t.type}-${t.id}`, []);

  const CategoryChip = useCallback(
    ({ id, title, color }: { id: string; title: string; color: string }) => (
      <TouchableOpacity
        key={id}
        onPress={() => setActiveCategory((prev) => (prev === title ? null : title))}
        style={[styles.chip, { borderColor: color }, activeCategory === title ? { backgroundColor: color } : null]}
        testID={`chip-${id}`}
      >
        <Text style={[styles.chipText, activeCategory === title ? { color: "#0B0A14" } : null]}>{title}</Text>
      </TouchableOpacity>
    ),
    [activeCategory]
  );

  return (
    <ErrorBoundary>
      <SafeAreaView style={styles.container} edges={["top"]}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            testID="back-button"
          >
            <ArrowLeft size={24} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.title}>VoxSaga (Podcasts)</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.searchRow}>
            <View style={styles.searchBox}>
              <Search size={16} color="#999" />
              <TextInput
                placeholder="Search topics, shows, hosts..."
                placeholderTextColor="#777"
                style={styles.searchInput}
                value={query}
                onChangeText={setQuery}
                autoCorrect={false}
                testID="search-input"
              />
            </View>
            <TouchableOpacity
              style={styles.filterBtn}
              onPress={() => setShowAdvancedFilters(!showAdvancedFilters)}
              testID="advanced-filters"
            >
              <Settings size={16} color="#9CA3AF" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.controlsRow}>
            <View style={styles.mediaToggle}>
              {(["all", "audio", "video"] as MediaKind[]).map((mk) => (
                <TouchableOpacity
                  key={mk}
                  onPress={() => setMediaKind(mk)}
                  style={[styles.toggleBtn, mediaKind === mk ? styles.toggleBtnActive : null]}
                  testID={`toggle-${mk}`}
                >
                  <Text style={styles.toggleText}>{mk.toUpperCase()}</Text>
                </TouchableOpacity>
              ))}
            </View>
            
            <View style={styles.sortToggle}>
              {(["trending", "recent", "popular", "rating"] as SortBy[]).map((sort) => (
                <TouchableOpacity
                  key={sort}
                  onPress={() => setSortBy(sort)}
                  style={[styles.sortBtn, sortBy === sort ? styles.sortBtnActive : null]}
                  testID={`sort-${sort}`}
                >
                  <Text style={styles.sortText}>{sort}</Text>
                </TouchableOpacity>
              ))}
            </View>
            
            <View style={styles.viewToggle}>
              <TouchableOpacity
                onPress={() => setViewMode("grid")}
                style={[styles.viewBtn, viewMode === "grid" ? styles.viewBtnActive : null]}
                testID="view-grid"
              >
                <Text style={styles.viewText}>Grid</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setViewMode("list")}
                style={[styles.viewBtn, viewMode === "list" ? styles.viewBtnActive : null]}
                testID="view-list"
              >
                <Text style={styles.viewText}>List</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleRow}>
              <Filter size={16} color="#9CA3AF" />
              <Text style={styles.sectionTitle}>Browse by Category</Text>
            </View>
            <View style={styles.categoriesRow}>
              {podcastCategories.map((c) => (
                <CategoryChip key={c.id} id={c.id} title={c.title} color={c.color} />
              ))}
            </View>
          </View>

          <View style={styles.aiBox}>
            <View style={styles.aiHeader}>
              <View style={styles.aiLeft}>
                <Sparkles size={18} color="#A78BFA" />
                <Text style={styles.aiTitle}>AI-Powered Features</Text>
              </View>
            </View>
            
            <View style={styles.aiSection}>
              <Text style={styles.aiSectionTitle}>Generate Podcast Mix</Text>
              <View style={styles.aiPromptRow}>
                <TextInput
                  placeholder="e.g. African tech startups, wellness, true crime in Lagos..."
                  placeholderTextColor="#9CA3AF"
                  value={aiTopic}
                  onChangeText={setAiTopic}
                  style={styles.aiInput}
                  autoCorrect={false}
                  testID="ai-topic-input"
                />
                <TouchableOpacity
                  onPress={runAIMix}
                  disabled={!aiTopic.trim() || aiLoading}
                  style={[styles.aiBtn, (!aiTopic.trim() || aiLoading) ? styles.aiBtnDisabled : null]}
                  testID="ai-generate"
                >
                  <ListPlus size={16} color="#0B0A14" />
                  <Text style={styles.aiBtnText}>{aiLoading ? "Generating..." : "Generate"}</Text>
                </TouchableOpacity>
              </View>
              {!!aiError && <Text style={styles.aiError}>{aiError}</Text>}
              {!!generated && (
                <View style={styles.aiResults}>
                  <View style={styles.aiResultsHeader}>
                    <Text style={styles.aiResultsTitle}>{generated.topic}</Text>
                    <View style={styles.moodPill}>
                      <Text style={styles.moodPillText}>{generated.mood}</Text>
                    </View>
                  </View>
                  {generated.items.map((g) => (
                    <TouchableOpacity
                      key={g.id}
                      onPress={() => {
                        const pick = baseData.find((t) => t.id === g.id);
                        if (pick) onPlay(pick);
                      }}
                      style={styles.aiResultRow}
                      testID={`ai-item-${g.id}`}
                    >
                      <BookOpenCheck size={16} color="#93C5FD" />
                      <Text style={styles.aiItemText} numberOfLines={1}>{g.title}</Text>
                      <ChevronRight size={16} color="#6B7280" />
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
            
            <View style={styles.aiSection}>
              <Text style={styles.aiSectionTitle}>Personal Recommendations</Text>
              <View style={styles.aiPromptRow}>
                <TextInput
                  placeholder="Tell us your interests: technology, business, health..."
                  placeholderTextColor="#9CA3AF"
                  value={aiTopic}
                  onChangeText={setAiTopic}
                  style={styles.aiInput}
                  autoCorrect={false}
                  testID="ai-interests-input"
                />
                <TouchableOpacity
                  onPress={() => generateRecommendations(aiTopic)}
                  disabled={!aiTopic.trim() || recLoading}
                  style={[styles.aiBtn, (!aiTopic.trim() || recLoading) ? styles.aiBtnDisabled : null]}
                  testID="ai-recommend"
                >
                  <TrendingUp size={16} color="#0B0A14" />
                  <Text style={styles.aiBtnText}>{recLoading ? "Finding..." : "Recommend"}</Text>
                </TouchableOpacity>
              </View>
              {recommendations.length > 0 && (
                <View style={styles.recommendationsContainer}>
                  {recommendations.map((rec) => (
                    <View key={rec.title} style={styles.recommendationCard}>
                      <Text style={styles.recTitle}>{rec.title}</Text>
                      <Text style={styles.recHost}>by {rec.host}</Text>
                      <View style={styles.recMeta}>
                        <View style={styles.recCategory}>
                          <Text style={styles.recCategoryText}>{rec.category}</Text>
                        </View>
                        <Text style={styles.recDuration}>{rec.estimatedDuration}min</Text>
                        <View style={[styles.recDifficulty, 
                          rec.difficulty === "beginner" ? styles.difficultyBeginner :
                          rec.difficulty === "intermediate" ? styles.difficultyIntermediate :
                          styles.difficultyAdvanced
                        ]}>
                          <Text style={styles.recDifficultyText}>{rec.difficulty}</Text>
                        </View>
                      </View>
                      <Text style={styles.recReason}>{rec.reason}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          </View>

          <View style={styles.sectionHeaderCompact}>
            <View style={styles.sectionTitleRow}>
              <Text style={styles.sectionTitle}>VoxSaga (Podcasts) ({filteredData.length})</Text>
              <View style={styles.sectionStats}>
                <Text style={styles.statsText}>{mediaKind} • {sortBy}</Text>
              </View>
            </View>
          </View>

          <FlatList
            data={filteredData}
            renderItem={renderCard}
            keyExtractor={keyExtractor}
            numColumns={listCols}
            scrollEnabled={false}
            contentContainerStyle={styles.list}
            ListEmptyComponent={() => (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No podcasts found</Text>
                <Text style={styles.emptySubtext}>
                  Try adjusting your filters or search terms
                </Text>
              </View>
            )}
          />

          <View style={styles.sectionHeaderCompact}>
            <Text style={styles.sectionTitle}>Popular Hosts</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hostsRow}>
            {popularPodcastArtists.map((a) => (
              <View key={a.id} style={styles.hostCard}>
                <Image source={{ uri: a.image }} style={styles.hostImage} />
                <Text style={styles.hostName} numberOfLines={1}>{a.name}</Text>
                <Text style={styles.hostCategory}>{a.category}</Text>
              </View>
            ))}
          </ScrollView>
        </ScrollView>
      </SafeAreaView>
    </ErrorBoundary>
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
    paddingBottom: 12,
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
  placeholder: { width: 40 },

  searchRow: {
    paddingHorizontal: 16,
    gap: 12,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#131320",
    borderColor: "#1F2937",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  searchInput: {
    flex: 1,
    color: "#FFF",
    fontSize: 14,
  },
  mediaToggle: {
    flexDirection: "row",
    gap: 8,
  },
  toggleBtn: {
    flex: 1,
    backgroundColor: "#111827",
    borderColor: "#1F2937",
    borderWidth: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  toggleBtnActive: {
    backgroundColor: "#FFFFFF",
  },
  toggleText: {
    color: "#FFF",
    fontWeight: "700",
    letterSpacing: 0.5,
  },

  sectionHeader: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  sectionHeaderCompact: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 8,
  },
  sectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    color: "#E5E7EB",
    fontWeight: "700",
    fontSize: 16,
  },
  categoriesRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    backgroundColor: "#0B0A14",
  },
  chipText: {
    color: "#E5E7EB",
    fontWeight: "600",
    fontSize: 12,
  },

  aiBox: {
    marginTop: 16,
    marginHorizontal: 16,
    backgroundColor: "#0F172A",
    borderWidth: 1,
    borderColor: "#1F2937",
    borderRadius: 16,
    padding: 12,
    gap: 10,
  },
  aiLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  aiTitle: {
    color: "#E9D5FF",
    fontWeight: "700",
  },
  aiPromptRow: {
    flexDirection: "row",
    gap: 8,
  },
  aiInput: {
    flex: 1,
    backgroundColor: "#0B0A14",
    borderWidth: 1,
    borderColor: "#1F2937",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === "web" ? 10 : 12,
    color: "#FFF",
    fontSize: 14,
  },
  aiBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#A7F3D0",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  aiBtnDisabled: {
    opacity: 0.5,
  },
  aiBtnText: {
    color: "#0B0A14",
    fontWeight: "700",
  },
  aiError: {
    color: "#FCA5A5",
    fontSize: 12,
  },
  aiResults: {
    backgroundColor: "#0B0A14",
    borderWidth: 1,
    borderColor: "#1F2937",
    borderRadius: 12,
    padding: 10,
    gap: 6,
  },
  aiResultsHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  aiResultsTitle: {
    color: "#F3F4F6",
    fontWeight: "700",
    fontSize: 14,
  },
  moodPill: {
    backgroundColor: "#DBEAFE",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  moodPillText: {
    color: "#1E3A8A",
    fontWeight: "700",
    fontSize: 12,
  },
  aiResultRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 6,
  },
  aiItemText: {
    color: "#D1D5DB",
    flex: 1,
  },

  list: {
    paddingHorizontal: 12,
    paddingBottom: 120,
    gap: 12,
  },
  card: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#111827",
    borderRadius: 12,
    padding: 12,
    margin: 4,
    borderWidth: 1,
    borderColor: "#1F2937",
  },
  cardImage: {
    width: 68,
    height: 68,
    borderRadius: 8,
    marginRight: 12,
  },
  cardMeta: {
    flex: 1,
  },
  cardTitle: {
    color: "#FFF",
    fontSize: 15,
    fontWeight: "700",
  },
  cardArtist: {
    color: "#9CA3AF",
    fontSize: 12,
    marginTop: 2,
    marginBottom: 8,
  },
  badgeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  badgeAudio: {
    backgroundColor: "#86EFAC",
  },
  badgeVideo: {
    backgroundColor: "#93C5FD",
  },
  badgeText: {
    color: "#0B0A14",
    fontWeight: "700",
    fontSize: 11,
  },
  playPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  playPillText: {
    color: "#000",
    fontWeight: "700",
    fontSize: 12,
  },
  summarize: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 6,
  },
  summarizeText: {
    color: "#9AE6B4",
    fontSize: 12,
    fontWeight: "700",
  },
  summaryText: {
    color: "#D1FAE5",
    fontSize: 12,
    marginTop: 6,
  },

  hostsRow: {
    paddingHorizontal: 12,
    gap: 12,
  },
  hostCard: {
    width: 140,
    backgroundColor: "#0F172A",
    borderWidth: 1,
    borderColor: "#1F2937",
    borderRadius: 12,
    padding: 10,
  },
  hostImage: {
    width: "100%",
    height: 96,
    borderRadius: 8,
    marginBottom: 8,
  },
  hostName: {
    color: "#F3F4F6",
    fontWeight: "700",
  },
  hostCategory: {
    color: "#93C5FD",
    fontSize: 12,
    marginTop: 2,
  },

  // New styles for enhanced features
  filterBtn: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#111827",
    borderColor: "#1F2937",
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 8,
  },
  emptySubtext: {
    color: "#999",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
  controlsRow: {
    paddingHorizontal: 16,
    paddingTop: 12,
    gap: 12,
  },
  sortToggle: {
    flexDirection: "row",
    gap: 4,
    flex: 1,
  },
  sortBtn: {
    flex: 1,
    backgroundColor: "#111827",
    borderColor: "#1F2937",
    borderWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 8,
    alignItems: "center",
  },
  sortBtnActive: {
    backgroundColor: "#A78BFA",
  },
  sortText: {
    color: "#FFF",
    fontWeight: "600",
    fontSize: 11,
  },
  viewToggle: {
    flexDirection: "row",
    gap: 4,
  },
  viewBtn: {
    backgroundColor: "#111827",
    borderColor: "#1F2937",
    borderWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  viewBtnActive: {
    backgroundColor: "#10B981",
  },
  viewText: {
    color: "#FFF",
    fontWeight: "600",
    fontSize: 11,
  },
  sectionStats: {
    marginLeft: "auto",
  },
  statsText: {
    color: "#6B7280",
    fontSize: 12,
    fontWeight: "500",
  },

  // Enhanced card styles
  cardList: {
    flexDirection: "column",
    margin: 2,
  },
  cardImageContainer: {
    position: "relative",
  },
  videoOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  ratingBadge: {
    position: "absolute",
    top: 4,
    right: 4,
    backgroundColor: "rgba(0,0,0,0.7)",
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  ratingText: {
    color: "#FFF",
    fontSize: 10,
    fontWeight: "600",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  cardActions: {
    flexDirection: "row",
    gap: 8,
  },
  actionBtn: {
    padding: 4,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },
  duration: {
    color: "#9CA3AF",
    fontSize: 11,
    fontWeight: "500",
  },
  categoryPill: {
    backgroundColor: "#1F2937",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  categoryText: {
    color: "#93C5FD",
    fontSize: 10,
    fontWeight: "600",
  },
  difficultyPill: {
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  difficultyBeginner: {
    backgroundColor: "#10B981",
  },
  difficultyIntermediate: {
    backgroundColor: "#F59E0B",
  },
  difficultyAdvanced: {
    backgroundColor: "#EF4444",
  },
  difficultyText: {
    color: "#FFF",
    fontSize: 10,
    fontWeight: "600",
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 6,
  },
  viewCount: {
    color: "#6B7280",
    fontSize: 11,
    fontWeight: "500",
  },
  aiActionsRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  aiAction: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingVertical: 4,
  },
  aiActionText: {
    color: "#9AE6B4",
    fontSize: 11,
    fontWeight: "600",
  },
  summaryContainer: {
    marginTop: 8,
    padding: 8,
    backgroundColor: "#0F172A",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#1F2937",
  },
  summaryLabel: {
    color: "#9AE6B4",
    fontSize: 11,
    fontWeight: "700",
    marginBottom: 4,
  },
  analysisContainer: {
    marginTop: 8,
    padding: 8,
    backgroundColor: "#0F172A",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#1F2937",
  },
  analysisLabel: {
    color: "#A78BFA",
    fontSize: 11,
    fontWeight: "700",
    marginBottom: 4,
  },
  topicsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
    marginBottom: 4,
  },
  topicTag: {
    backgroundColor: "#1F2937",
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  topicText: {
    color: "#93C5FD",
    fontSize: 9,
    fontWeight: "600",
  },
  complexityText: {
    color: "#D1D5DB",
    fontSize: 10,
    marginBottom: 2,
  },
  audienceText: {
    color: "#D1D5DB",
    fontSize: 10,
  },

  // AI features styles
  aiHeader: {
    marginBottom: 8,
  },
  aiSection: {
    marginBottom: 16,
  },
  aiSectionTitle: {
    color: "#E9D5FF",
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 8,
  },
  recommendationsContainer: {
    marginTop: 12,
    gap: 8,
  },
  recommendationCard: {
    backgroundColor: "#0B0A14",
    borderWidth: 1,
    borderColor: "#1F2937",
    borderRadius: 10,
    padding: 10,
  },
  recTitle: {
    color: "#F3F4F6",
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 2,
  },
  recHost: {
    color: "#9CA3AF",
    fontSize: 12,
    marginBottom: 6,
  },
  recMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },
  recCategory: {
    backgroundColor: "#1F2937",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  recCategoryText: {
    color: "#93C5FD",
    fontSize: 10,
    fontWeight: "600",
  },
  recDuration: {
    color: "#9CA3AF",
    fontSize: 11,
    fontWeight: "500",
  },
  recDifficulty: {
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  recDifficultyText: {
    color: "#FFF",
    fontSize: 10,
    fontWeight: "600",
  },
  recReason: {
    color: "#D1D5DB",
    fontSize: 11,
    lineHeight: 16,
  },
});
