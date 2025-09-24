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
import { useSafeAreaInsets } from "react-native-safe-area-context";
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
import { useUser } from "@/contexts/UserContext";
import { router } from "expo-router";
import type { Track, Playlist } from "@/types";

 type FilterId = "all" | "playlists" | "songs" | "podcasts" | "audiobooks" | "mixmind";
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

export default function LibraryScreen() {
  const insets = useSafeAreaInsets();
  const [filter, setFilter] = useState<FilterId>("all");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [sort, setSort] = useState<SortId>("recent");
  const [query, setQuery] = useState<string>("");
  const { playlists, favorites, downloads, recentlyPlayed, audiobooks, podcasts, mixmindSets, getFilteredContent } = useLibrary();
  const { playTrack } = usePlayer();
  const { profile } = useUser();

  const filters: { id: FilterId; label: string }[] = [
    { id: "all", label: "All" },
    { id: "playlists", label: "Playlists" },
    { id: "songs", label: "Songs" },
    { id: "podcasts", label: "Podcasts" },
    { id: "audiobooks", label: "Audiobooks" },
    { id: "mixmind", label: "MixMind" },
  ];

  const sorters: { id: SortId; label: string }[] = [
    { id: "recent", label: "Recent" },
    { id: "alpha", label: "A–Z" },
    { id: "creator", label: "Creator" },
  ];

  const items = useMemo<ModernItem[]>(() => {
    console.log("[Library] computing items", { filter, q: query, sort });
    
    const filteredContent = getFilteredContent(filter);
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
      // keep insertion order but lightly promote recentlyPlayed
      const recentIds = new Set(recentlyPlayed.map((t) => t.id));
      sorted.sort((a, b) => Number(recentIds.has(b.id)) - Number(recentIds.has(a.id)));
    }
    return sorted;
  }, [filter, query, sort, recentlyPlayed, getFilteredContent]);

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

  const renderCard = useCallback(({ item }: { item: ModernItem }) => {
    const handlePress = () => {
      console.log("[Library] item pressed", item.kind, item.id);
      
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
        <TouchableOpacity style={styles.moreBtn} onPress={() => console.log("[Library] more", item.id)}>
          <MoreHorizontal size={18} color="#9CA3AF" />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  }, [playTrack, viewMode, router]);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.title}>Your Library</Text>
          {profile?.displayName && (
            <Text style={styles.subtitle}>{profile.displayName}&apos;s personal collection</Text>
          )}
        </View>
        <TouchableOpacity 
          style={styles.addButton} 
          onPress={() => router.push("/playlists")}
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

          <TouchableOpacity 
            style={styles.quickItem} 
            testID="downloads"
            onPress={() => router.push("/downloads")}
          >
            <View style={[styles.quickIcon, { backgroundColor: "#8B5CF6" }]}>
              <Download size={20} color="#FFF" />
            </View>
            <Text style={styles.quickLabel}>Downloads</Text>
            <Text style={styles.quickCount}>{downloads.length} items</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.quickItem} 
            testID="recently-played"
            onPress={() => router.push("/history")}
          >
            <View style={[styles.quickIcon, { backgroundColor: "#3B82F6" }]}>
              <Clock size={20} color="#FFF" />
            </View>
            <Text style={styles.quickLabel}>Recently Played</Text>
            <Text style={styles.quickCount}>{recentlyPlayed.length} items</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Your History</Text>
            <TouchableOpacity onPress={() => router.push("/history")}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.historyScroll}>
            {recentlyPlayed.slice(0, 5).map((track, index) => (
              <TouchableOpacity
                key={track.id}
                style={styles.historyItem}
                onPress={() => {
                  if (track?.id && track?.title) {
                    playTrack(track);
                  }
                }}
              >
                <Image source={{ uri: track.artwork }} style={styles.historyArtwork} />
                <Text style={styles.historyTitle} numberOfLines={2}>
                  {track.title}
                </Text>
                <Text style={styles.historyArtist} numberOfLines={1}>
                  {track.artist}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Podcasts</Text>
            <TouchableOpacity onPress={() => router.push("/podcasts")}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.historyScroll}>
            {podcasts.slice(0, 5).map((podcast, index) => (
              <TouchableOpacity
                key={podcast.id}
                style={styles.historyItem}
                onPress={() => router.push(`/podcast-episode/${podcast.id}`)}
              >
                <Image source={{ uri: podcast.artwork }} style={styles.historyArtwork} />
                <Text style={styles.historyTitle} numberOfLines={2}>
                  {podcast.title}
                </Text>
                <Text style={styles.historyArtist} numberOfLines={1}>
                  {podcast.artist}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Audiobooks</Text>
            <TouchableOpacity onPress={() => router.push("/categories/audiobooks")}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.historyScroll}>
            {audiobooks.slice(0, 5).map((audiobook, index) => (
              <TouchableOpacity
                key={audiobook.id}
                style={styles.historyItem}
                onPress={() => router.push(`/audiobook/${audiobook.id}`)}
              >
                <Image source={{ uri: audiobook.artwork }} style={styles.historyArtwork} />
                <Text style={styles.historyTitle} numberOfLines={2}>
                  {audiobook.title}
                </Text>
                <Text style={styles.historyArtist} numberOfLines={1}>
                  {audiobook.artist}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>MixMind Sets</Text>
            <TouchableOpacity onPress={() => router.push("/mixmind-history")}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          {mixmindSets.length > 0 ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.historyScroll}>
              {mixmindSets.slice(0, 5).map((set, index) => (
                <TouchableOpacity
                  key={set.id}
                  style={styles.historyItem}
                  onPress={() => router.push(`/mixmind-live?setId=${set.id}`)}
                >
                  <Image 
                    source={{ uri: set.artwork || "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop" }} 
                    style={styles.historyArtwork} 
                  />
                  <Text style={styles.historyTitle} numberOfLines={2}>
                    {set.title}
                  </Text>
                  <Text style={styles.historyArtist} numberOfLines={1}>
                    {set.tracks?.length || 0} tracks • {Math.round(set.totalDuration / 60)}min
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          ) : (
            <TouchableOpacity 
              style={styles.podcastPreview}
              onPress={() => router.push("/ai-dj-setup")}
            >
              <Text style={styles.podcastPreviewText}>Create your first AI-generated mix with MixMind. Tap to get started!</Text>
            </TouchableOpacity>
          )}
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
    </View>
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
    alignItems: "flex-start",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
  },
  headerLeft: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: 0.2,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#9CA3AF",
    marginTop: 2,
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
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: 0.2,
  },
  seeAllText: {
    fontSize: 14,
    color: "#E91E63",
    fontWeight: "600",
  },
  historyScroll: {
    marginBottom: 20,
  },
  historyItem: {
    width: 120,
    marginRight: 16,
  },
  historyArtwork: {
    width: 120,
    height: 120,
    borderRadius: 12,
    marginBottom: 8,
  },
  historyTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 4,
    lineHeight: 18,
  },
  historyArtist: {
    fontSize: 12,
    color: "#9CA3AF",
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
  podcastPreview: {
    backgroundColor: "#111113",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#1F2937",
  },
  podcastPreviewText: {
    color: "#9CA3AF",
    fontSize: 14,
    lineHeight: 20,
  },
});