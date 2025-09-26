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
import { generateText } from "@rork/toolkit-sdk";

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

type MediaKind = "all" | "audio" | "video";

type Summaries = Record<string, string>;

export default function PodcastsScreen() {
  const { width } = useWindowDimensions();
  const { playTrack } = usePlayer();

  const [query, setQuery] = useState<string>("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [mediaKind, setMediaKind] = useState<MediaKind>("all");
  const [aiTopic, setAiTopic] = useState<string>("");
  const [aiLoading, setAiLoading] = useState<boolean>(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [generated, setGenerated] = useState<GeneratedMix | null>(null);
  const [summaries, setSummaries] = useState<Summaries>({});
  const [sumLoadingId, setSumLoadingId] = useState<string | null>(null);

  const listCols = useMemo(() => (width >= 900 ? 3 : width >= 600 ? 2 : 1), [width]);

  const baseData: Track[] = useMemo(() => {
    const audioList = [...podcasts, ...allPodcastEpisodes, ...popularPodcasts];
    const videoList = [...videoTracks];
    switch (mediaKind) {
      case "audio":
        return audioList;
      case "video":
        return videoList;
      default:
        return [...audioList, ...videoList];
    }
  }, [mediaKind]);

  const filteredData = useMemo(() => {
    const q = query.trim().toLowerCase();
    return baseData.filter((t) => {
      const matchesQuery = q
        ? (t.title?.toLowerCase().includes(q) ||
            t.artist?.toLowerCase().includes(q) ||
            ("description" in t && (t as any).description?.toLowerCase().includes(q)))
        : true;
      const matchesCategory = activeCategory
        ? t.artist?.toLowerCase().includes(activeCategory.toLowerCase()) ||
          t.title?.toLowerCase().includes(activeCategory.toLowerCase())
        : true;
      return matchesQuery && matchesCategory;
    });
  }, [baseData, query, activeCategory]);

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

  const renderCard = useCallback(
    ({ item }: { item: Track }) => (
      <TouchableOpacity
        style={styles.card}
        onPress={() => onPlay(item)}
        activeOpacity={0.85}
        testID={`podcast-card-${item.id}`}
      >
        <Image source={{ uri: item.artwork }} style={styles.cardImage} />
        <View style={styles.cardMeta}>
          <Text style={styles.cardTitle} numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={styles.cardArtist} numberOfLines={1}>
            {item.artist}
          </Text>
          <View style={styles.badgeRow}>
            <View style={[styles.badge, item.type === "video" ? styles.badgeVideo : styles.badgeAudio]}>
              {item.type === "video" ? (
                <VideoIcon size={12} color="#0B0A14" />
              ) : (
                <Mic2 size={12} color="#0B0A14" />
              )}
              <Text style={styles.badgeText}>{item.type === "video" ? "Video" : "Audio"}</Text>
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
          <TouchableOpacity
            onPress={() => summarize(item)}
            style={styles.summarize}
            testID={`summarize-${item.id}`}
          >
            <Sparkles size={14} color="#9AE6B4" />
            <Text style={styles.summarizeText}>
              {sumLoadingId === item.id ? "Summarizing..." : summaries[item.id] ? "Re-summarize" : "AI Summarize"}
            </Text>
          </TouchableOpacity>
          {!!summaries[item.id] && (
            <Text style={styles.summaryText} numberOfLines={3}>
              {summaries[item.id]}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    ),
    [onPlay, summaries, sumLoadingId, summarize]
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
          <Text style={styles.title}>Podcasts</Text>
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
            <View style={styles.aiLeft}>
              <Sparkles size={18} color="#A78BFA" />
              <Text style={styles.aiTitle}>AI Podcast Mix</Text>
            </View>
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

          <View style={styles.sectionHeaderCompact}>
            <Text style={styles.sectionTitle}>Trending</Text>
          </View>

          <FlatList
            data={filteredData}
            renderItem={renderCard}
            keyExtractor={keyExtractor}
            numColumns={listCols}
            scrollEnabled={false}
            contentContainerStyle={styles.list}
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
});
