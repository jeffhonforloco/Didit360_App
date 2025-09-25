import React, { useMemo, useState, useCallback } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ArrowLeft,
  Search,
  Grid3X3,
  List as ListIcon,
  ChevronDown,
  MoreHorizontal,
  Play,
} from "lucide-react-native";
import { useLibrary } from "@/contexts/LibraryContext";
import { usePlayer } from "@/contexts/PlayerContext";
import { router } from "expo-router";
import type { Track, Playlist } from "@/types";

type ViewMode = "grid" | "list";
type SortId = "recent" | "alpha" | "creator";

type ModernItem = {
  kind: "playlist" | "track" | "audiobook" | "podcast" | "mixmind";
  id: string;
  title: string;
  subtitle: string;
  artwork: string;
  track?: Track;
  playlist?: Playlist;
  audiobook?: Track;
  podcast?: Track;
  mixmindSet?: any;
  type?: string;
};

export default function LibraryAllScreen() {
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [sort, setSort] = useState<SortId>("recent");
  const [query, setQuery] = useState<string>("");
  const { playlists, favorites, downloads, recentlyPlayed, audiobooks, podcasts, mixmindSets, getFilteredContent } = useLibrary();
  const { playTrack } = usePlayer();

  const sorters: { id: SortId; label: string }[] = [
    { id: "recent", label: "Recent" },
    { id: "alpha", label: "A–Z" },
    { id: "creator", label: "Creator" },
  ];

  const items = useMemo<ModernItem[]>(() => {
    console.log("[LibraryAll] computing items", { q: query, sort });
    
    const filteredContent = getFilteredContent("all");
    const base: ModernItem[] = [];
    
    filteredContent.forEach((item) => {
      if (item.type === "playlist") {
        base.push({
          kind: "playlist",
          id: item.id,
          title: item.name,
          subtitle: `${item.tracks?.length || 0} tracks`,
          artwork: item.tracks?.[0]?.artwork ?? "https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=400&auto=format&fit=crop",
          playlist: item,
          type: "playlist",
        });
      } else if (item.type === "track") {
        base.push({
          kind: "track",
          id: item.id,
          title: item.title,
          subtitle: item.artist,
          artwork: item.artwork,
          track: item,
          type: "track",
        });
      } else if (item.type === "audiobook") {
        base.push({
          kind: "audiobook",
          id: item.id,
          title: item.title,
          subtitle: item.artist,
          artwork: item.artwork,
          audiobook: item,
          type: "audiobook",
        });
      } else if (item.type === "podcast") {
        base.push({
          kind: "podcast",
          id: item.id,
          title: item.title,
          subtitle: item.artist,
          artwork: item.artwork,
          podcast: item,
          type: "podcast",
        });
      } else if (item.type === "mixmind") {
        base.push({
          kind: "mixmind",
          id: item.id,
          title: item.title,
          subtitle: `${item.tracks?.length || 0} tracks • ${Math.round(item.totalDuration / 60)}min`,
          artwork: item.artwork || "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
          mixmindSet: item,
          type: "mixmind",
        });
      }
    });
    
    const q = query.trim().toLowerCase();
    const filtered = q
      ? base.filter((i) =>
          i.title.toLowerCase().includes(q) || i.subtitle.toLowerCase().includes(q)
        )
      : base;

    const sorted = [...filtered];
    if (sort === "alpha") sorted.sort((a, b) => a.title.localeCompare(b.title));
    if (sort === "creator") sorted.sort((a, b) => a.subtitle.localeCompare(b.subtitle));
    if (sort === "recent") {
      const recentIds = new Set(recentlyPlayed.map((t) => t.id));
      sorted.sort((a, b) => Number(recentIds.has(b.id)) - Number(recentIds.has(a.id)));
    }
    return sorted;
  }, [query, sort, recentlyPlayed, getFilteredContent]);

  const renderCard = useCallback(({ item }: { item: ModernItem }) => {
    const handlePress = () => {
      console.log("[LibraryAll] item pressed", item.kind, item.id);
      
      if (item.kind === "track" && item.track) {
        playTrack(item.track);
      } else if (item.kind === "audiobook" && item.audiobook) {
        router.push(`/audiobook/${item.audiobook.id}`);
      } else if (item.kind === "podcast" && item.podcast) {
        router.push(`/podcast-episode/${item.podcast.id}`);
      } else if (item.kind === "playlist" && item.playlist) {
        router.push(`/playlist?id=${item.playlist.id}`);
      } else if (item.kind === "mixmind" && item.mixmindSet) {
        router.push(`/mixmind-live?setId=${item.mixmindSet.id}`);
      }
    };
    
    const getIcon = () => {
      switch (item.kind) {
        case "track":
          return <Play size={14} color="#0B0B0C" />;
        case "audiobook":
          return <Play size={14} color="#0B0B0C" />;
        case "podcast":
          return <Play size={14} color="#0B0B0C" />;
        case "mixmind":
          return <Play size={14} color="#0B0B0C" />;
        default:
          return null;
      }
    };
    
    return (
      <TouchableOpacity
        testID={`card-${item.kind}-${item.id}`}
        style={viewMode === "grid" ? styles.card : styles.row}
        onPress={handlePress}
        activeOpacity={0.9}
      >
        <View style={viewMode === "grid" ? styles.cardArtWrap : styles.rowArtWrap}>
          <Image source={{ uri: item.artwork }} style={viewMode === "grid" ? styles.cardArt : styles.rowArt} />
          {getIcon() && (
            <View style={styles.playBadge}>
              {getIcon()}
            </View>
          )}
        </View>
        <View style={viewMode === "grid" ? styles.cardMeta : styles.rowMeta}>
          <Text style={styles.itemTitle} numberOfLines={1}>{item.title}</Text>
          <Text style={styles.itemSubtitle} numberOfLines={1}>{item.subtitle}</Text>
        </View>
        <TouchableOpacity style={styles.moreBtn} onPress={() => console.log("[LibraryAll] more", item.id)}>
          <MoreHorizontal size={18} color="#9CA3AF" />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  }, [playTrack, viewMode, router]);

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
        <Text style={styles.title}>All Items</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.searchRow}>
        <View style={styles.searchBox}>
          <Search size={18} color="#9CA3AF" />
          <TextInput
            testID="library-search"
            style={styles.searchInput}
            placeholder="Search all items"
            placeholderTextColor="#6B7280"
            value={query}
            onChangeText={setQuery}
            returnKeyType="search"
          />
        </View>
        <TouchableOpacity
          testID="sort-button"
          style={styles.sortBtn}
          onPress={() => {
            const idx = sorters.findIndex((s) => s.id === sort);
            const next = sorters[(idx + 1) % sorters.length];
            console.log("[LibraryAll] sort", next.id);
            setSort(next.id);
          }}
        >
          <Text style={styles.sortText}>{sorters.find((s) => s.id === sort)?.label ?? "Sort"}</Text>
          <ChevronDown size={16} color="#FFF" />
        </TouchableOpacity>
        <View style={styles.viewToggle}>
          <TouchableOpacity
            testID="toggle-grid"
            style={[styles.toggleBtn, viewMode === "grid" ? styles.toggleActive : undefined]}
            onPress={() => setViewMode("grid")}
          >
            <Grid3X3 size={18} color={viewMode === "grid" ? "#0B0B0C" : "#9CA3AF"} />
          </TouchableOpacity>
          <TouchableOpacity
            testID="toggle-list"
            style={[styles.toggleBtn, viewMode === "list" ? styles.toggleActive : undefined]}
            onPress={() => setViewMode("list")}
          >
            <ListIcon size={18} color={viewMode === "list" ? "#0B0B0C" : "#9CA3AF"} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        style={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>All Items ({items.length})</Text>
          <FlatList
            key={viewMode}
            data={items}
            renderItem={renderCard}
            keyExtractor={(it) => `${viewMode}-${it.kind}-${it.id}`}
            scrollEnabled={false}
            numColumns={viewMode === "grid" ? 2 : 1}
            columnWrapperStyle={viewMode === "grid" ? styles.gridRow : undefined}
            contentContainerStyle={{ paddingBottom: 120 }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B0B0C",
  },
  scrollContent: {
    flex: 1,
  },
  scrollContainer: {
    paddingBottom: 120,
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
    backgroundColor: "#18181B",
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
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    gap: 12 as unknown as number,
    paddingBottom: 12,
  },
  searchBox: {
    flex: 1,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#111113",
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 8 as unknown as number,
    borderWidth: 1,
    borderColor: "#1F2937",
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: "#FFFFFF",
  },
  sortBtn: {
    height: 40,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: "#111113",
    borderWidth: 1,
    borderColor: "#1F2937",
    flexDirection: "row",
    alignItems: "center",
    gap: 6 as unknown as number,
  },
  sortText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "600",
  },
  viewToggle: {
    flexDirection: "row",
    marginLeft: 8,
    backgroundColor: "#111113",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#1F2937",
  },
  toggleBtn: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  toggleActive: {
    backgroundColor: "#6EE7B7",
  },
  section: {
    paddingHorizontal: 20,
    paddingTop: 18,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: 0.2,
    marginBottom: 16,
  },
  gridRow: {
    justifyContent: "space-between",
  },
  card: {
    width: "48%",
    backgroundColor: "#0F0F10",
    borderRadius: 14,
    padding: 10,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#1F2937",
  },
  cardArtWrap: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#18181B",
    marginBottom: 10,
  },
  cardArt: {
    width: "100%",
    height: "100%",
  },
  cardMeta: {
    gap: 2 as unknown as number,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0F0F10",
    borderRadius: 12,
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#1F2937",
  },
  rowArtWrap: {
    width: 56,
    height: 56,
    borderRadius: 10,
    overflow: "hidden",
    marginRight: 12,
    backgroundColor: "#18181B",
  },
  rowArt: {
    width: "100%",
    height: "100%",
  },
  rowMeta: {
    flex: 1,
    paddingRight: 28,
  },
  itemTitle: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },
  itemSubtitle: {
    color: "#9CA3AF",
    fontSize: 13,
    fontWeight: "600",
  },
  moreBtn: {
    position: "absolute",
    right: 8,
    top: 8,
    padding: 6,
    borderRadius: 9999,
  },
  playBadge: {
    position: "absolute",
    right: 6,
    bottom: 6,
    backgroundColor: "#6EE7B7",
    borderRadius: 9999,
    padding: 6,
  },
});