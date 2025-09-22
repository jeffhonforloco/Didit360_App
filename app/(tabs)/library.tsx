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
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Plus,
  Download,
  Heart,
  Clock,
  Grid3X3,
  List as ListIcon,
  ChevronDown,
  Search,
  MoreHorizontal,
  Play,
} from "lucide-react-native";
import { useLibrary } from "@/contexts/LibraryContext";
import { usePlayer } from "@/contexts/PlayerContext";
import type { Track, Playlist } from "@/types";

 type FilterId = "all" | "playlists" | "songs" | "podcasts" | "audiobooks";
 type ViewMode = "grid" | "list";
 type SortId = "recent" | "alpha" | "creator";

 type ModernItem = {
  kind: "playlist" | "track";
  id: string;
  title: string;
  subtitle: string;
  artwork: string;
  track?: Track;
  playlist?: Playlist;
};

export default function LibraryScreen() {
  const [filter, setFilter] = useState<FilterId>("all");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [sort, setSort] = useState<SortId>("recent");
  const [query, setQuery] = useState<string>("");
  const { playlists, favorites, downloads, recentlyPlayed } = useLibrary();
  const { playTrack } = usePlayer();

  const filters: Array<{ id: FilterId; label: string }> = [
    { id: "all", label: "All" },
    { id: "playlists", label: "Playlists" },
    { id: "songs", label: "Songs" },
    { id: "podcasts", label: "Podcasts" },
    { id: "audiobooks", label: "Audiobooks" },
  ];

  const sorters: Array<{ id: SortId; label: string }> = [
    { id: "recent", label: "Recent" },
    { id: "alpha", label: "A–Z" },
    { id: "creator", label: "Creator" },
  ];

  const items = useMemo<ModernItem[]>(() => {
    console.log("[Library] computing items", { filter, q: query, sort });
    const base: ModernItem[] = [];
    if (filter === "all" || filter === "playlists") {
      playlists.forEach((pl) => {
        base.push({
          kind: "playlist",
          id: pl.id,
          title: pl.name,
          subtitle: `${pl.tracks.length} tracks`,
          artwork: pl.tracks[0]?.artwork ?? "https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=400&auto=format&fit=crop",
          playlist: pl,
        });
      });
    }
    if (filter === "all" || filter === "songs") {
      favorites.forEach((t) => {
        base.push({
          kind: "track",
          id: t.id,
          title: t.title,
          subtitle: t.artist,
          artwork: t.artwork,
          track: t,
        });
      });
    }
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
      // keep insertion order but lightly promote recentlyPlayed
      const recentIds = new Set(recentlyPlayed.map((t) => t.id));
      sorted.sort((a, b) => Number(recentIds.has(b.id)) - Number(recentIds.has(a.id)));
    }
    return sorted;
  }, [filter, playlists, favorites, query, sort, recentlyPlayed]);

  const renderFilter = useCallback(({ item }: { item: { id: FilterId; label: string } }) => (
    <TouchableOpacity
      testID={`filter-${item.id}`}
      style={[styles.filterChip, filter === item.id ? styles.filterChipActive : undefined]}
      onPress={() => setFilter(item.id)}
      accessibilityRole="button"
      accessibilityLabel={`Filter ${item.label}`}
      activeOpacity={0.8}
    >
      <Text style={[styles.filterText, filter === item.id ? styles.filterTextActive : undefined]}>
        {item.label}
      </Text>
    </TouchableOpacity>
  ), [filter]);

  const renderCard = useCallback(({ item }: { item: ModernItem }) => (
    <TouchableOpacity
      testID={`card-${item.kind}-${item.id}`}
      style={viewMode === "grid" ? styles.card : styles.row}
      onPress={() => {
        if (item.kind === "track" && item.track) {
          console.log("[Library] play track", item.track.id);
          playTrack(item.track);
        }
      }}
      activeOpacity={0.9}
    >
      <View style={viewMode === "grid" ? styles.cardArtWrap : styles.rowArtWrap}>
        <Image source={{ uri: item.artwork }} style={viewMode === "grid" ? styles.cardArt : styles.rowArt} />
        {item.kind === "track" && (
          <View style={styles.playBadge}>
            <Play size={14} color="#0B0B0C" />
          </View>
        )}
      </View>
      <View style={viewMode === "grid" ? styles.cardMeta : styles.rowMeta}>
        <Text style={styles.itemTitle} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.itemSubtitle} numberOfLines={1}>{item.subtitle}</Text>
      </View>
      <TouchableOpacity style={styles.moreBtn} onPress={() => console.log("[Library] more", item.id)}>
        <MoreHorizontal size={18} color="#9CA3AF" />
      </TouchableOpacity>
    </TouchableOpacity>
  ), [playTrack, viewMode]);

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.title}>Your Library</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => console.log("[Library] add new")}
          testID="add-button"
          accessibilityRole="button"
        >
          <Plus size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchRow}>
        <View style={styles.searchBox}>
          <Search size={18} color="#9CA3AF" />
          <TextInput
            testID="library-search"
            style={styles.searchInput}
            placeholder="Search your library"
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
            console.log("[Library] sort", next.id);
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

      <FlatList
        data={filters}
        renderItem={renderFilter}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterList}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.quickAccess}>
          <TouchableOpacity style={styles.quickItem} testID="liked-songs">
            <View style={[styles.quickIcon, { backgroundColor: "#FF0080" }]}>
              <Heart size={20} color="#FFF" />
            </View>
            <Text style={styles.quickLabel}>Liked Songs</Text>
            <Text style={styles.quickCount}>{favorites.length} songs</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.quickItem} testID="downloads">
            <View style={[styles.quickIcon, { backgroundColor: "#8B5CF6" }]}>
              <Download size={20} color="#FFF" />
            </View>
            <Text style={styles.quickLabel}>Downloads</Text>
            <Text style={styles.quickCount}>{downloads.length} items</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.quickItem} testID="recently-played">
            <View style={[styles.quickIcon, { backgroundColor: "#3B82F6" }]}>
              <Clock size={20} color="#FFF" />
            </View>
            <Text style={styles.quickLabel}>Recently Played</Text>
            <Text style={styles.quickCount}>{recentlyPlayed.length} items</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>All Items</Text>
          <FlatList
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: 0.2,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#18181B",
    justifyContent: "center",
    alignItems: "center",
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
  filterList: {
    paddingHorizontal: 20,
    paddingBottom: 6,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: "#18181B",
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#1F2937",
  },
  filterChipActive: {
    backgroundColor: "#6EE7B7",
    borderColor: "#6EE7B7",
  },
  filterText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#9CA3AF",
  },
  filterTextActive: {
    color: "#0B0B0C",
  },
  quickAccess: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  quickItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#111113",
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#1F2937",
  },
  quickIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  quickLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  quickCount: {
    fontSize: 13,
    color: "#9CA3AF",
  },
  section: {
    paddingHorizontal: 20,
    paddingTop: 18,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#FFFFFF",
    marginBottom: 12,
    letterSpacing: 0.2,
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