import React, { useState, useCallback, useMemo } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ArrowLeft,
  Search,
  MoreHorizontal,
  Play,
  Shuffle,
  Heart,
  Plus,
  X,
  Download,
  Pause,
  PlayCircle,
  Trash2,
  ChevronDown,
  RefreshCw,
  AlertTriangle
} from "lucide-react-native";
import { router } from "expo-router";
import { usePlayer } from "@/contexts/PlayerContext";
import { useOffline } from "@/contexts/OfflineContext";
import type { Track } from "@/types";

type SortOption = "recently-downloaded" | "alphabetical" | "artist";

export default function DownloadsScreen() {
  const [sortBy, setSortBy] = useState<SortOption>("recently-downloaded");
  const [showMenu, setShowMenu] = useState<string | null>(null);
  const { playTrack } = usePlayer();
  const { downloads, queue, requestDownload, removeDownload, pauseDownload, resumeDownload, cancelDownload, retryDownload } = useOffline();

  const allDownloadItems = useMemo(() => Object.values(downloads).sort((a, b) => b.updatedAt - a.updatedAt), [downloads]);
  const allDownloads: Track[] = useMemo(() => allDownloadItems.map((d) => ({ ...d.track, localUri: d.localUri, isDownloaded: d.status === 'completed' })), [allDownloadItems]);

  const sortedDownloads = [...allDownloads].sort((a, b) => {
    switch (sortBy) {
      case "alphabetical":
        return a.title.localeCompare(b.title);
      case "artist":
        return a.artist.localeCompare(b.artist);
      case "recently-downloaded":
      default:
        return 0;
    }
  });

  const handlePlayAll = () => {
    if (sortedDownloads.length > 0) {
      playTrack(sortedDownloads[0]);
    }
  };

  const handleSortChange = () => {
    const options: SortOption[] = ["recently-downloaded", "alphabetical", "artist"];
    const currentIndex = options.indexOf(sortBy);
    const nextIndex = (currentIndex + 1) % options.length;
    setSortBy(options[nextIndex]);
  };

  const getSortLabel = () => {
    switch (sortBy) {
      case "recently-downloaded":
        return "Recently Downloaded";
      case "alphabetical":
        return "A-Z";
      case "artist":
        return "Artist";
      default:
        return "Recently Downloaded";
    }
  };

  const StatusBadge = ({ status, progress }: { status?: string; progress: number }) => {
    if (!status) return null;
    const pct = Math.round(progress * 100);
    let text = "";
    let color = "#9CA3AF";
    switch (status) {
      case 'queued':
        text = 'Queued';
        color = '#9CA3AF';
        break;
      case 'downloading':
        text = `Downloading ${pct}%`;
        color = '#60A5FA';
        break;
      case 'paused':
        text = `Paused ${pct}%`;
        color = '#F59E0B';
        break;
      case 'completed':
        text = 'Available Offline';
        color = '#10B981';
        break;
      case 'error':
        text = 'Error';
        color = '#EF4444';
        break;
      case 'canceled':
        text = 'Canceled';
        color = '#9CA3AF';
        break;
      default:
        break;
    }
    return <Text style={[styles.statusBadge, { color }]}>{text}</Text>;
  };

  const renderTrackItem = useCallback(
    ({ item }: { item: Track }) => {
      const d = downloads[item.id];
      const progress = d?.progress ?? 0;
      const status = d?.status ?? undefined;
      const inQueue = queue.includes(item.id);
      const disabled = !!status && status !== 'completed';
      return (
        <TouchableOpacity
          style={styles.trackItem}
          onPress={() => !disabled && playTrack(item)}
          activeOpacity={0.8}
          disabled={disabled}
          testID={`download-item-${item.id}`}
        >
          <View style={styles.trackArtworkContainer}>
            <Image source={{ uri: item.artwork }} style={styles.trackArtwork} />
            <View style={[styles.trackPlayButton, disabled ? { opacity: 0.4 } : null]}>
              <Play size={12} color="#0B0B0C" fill="#0B0B0C" />
            </View>
          </View>
          
          <View style={styles.trackInfo}>
            <Text style={styles.trackTitle} numberOfLines={1}>
              {item.title}
            </Text>
            <Text style={styles.trackArtist} numberOfLines={1}>
              {item.artist}
            </Text>
            {status && status !== 'completed' && (
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${Math.round(progress * 100)}%` }]} />
              </View>
            )}
            <StatusBadge status={status} progress={progress} />
            {status === 'error' && d?.error ? (
              <View style={styles.errorRow}>
                <AlertTriangle size={14} color="#EF4444" />
                <Text style={styles.errorText} numberOfLines={1}>{d.error}</Text>
              </View>
            ) : null}
          </View>

          <View style={styles.rowActions}>
            {!status && (
              <TouchableOpacity onPress={() => requestDownload(item)} testID={`download-btn-${item.id}`} style={styles.iconBtn}>
                <Download size={18} color="#FFF" />
              </TouchableOpacity>
            )}
            {status === 'queued' && (
              <TouchableOpacity onPress={() => cancelDownload(item.id)} style={styles.iconBtn}>
                <X size={18} color="#FF6666" />
              </TouchableOpacity>
            )}
            {status === 'downloading' && (
              <TouchableOpacity onPress={() => pauseDownload(item.id)} style={styles.iconBtn}>
                <Pause size={18} color="#FFF" />
              </TouchableOpacity>
            )}
            {status === 'paused' && (
              <TouchableOpacity onPress={() => resumeDownload(item.id)} style={styles.iconBtn}>
                <PlayCircle size={18} color="#FFF" />
              </TouchableOpacity>
            )}
            {status === 'error' && (
              <TouchableOpacity onPress={() => retryDownload(item.id)} style={styles.iconBtn}>
                <RefreshCw size={18} color="#FFF" />
              </TouchableOpacity>
            )}
            {status === 'completed' && (
              <TouchableOpacity onPress={() => removeDownload(item.id)} style={styles.iconBtn}>
                <Trash2 size={18} color="#FF6666" />
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={styles.menuButton}
              onPress={() => setShowMenu(showMenu === item.id ? null : item.id)}
            >
              <MoreHorizontal size={20} color="#9CA3AF" />
            </TouchableOpacity>
          </View>

          {showMenu === item.id && (
            <View style={styles.contextMenu}>
              <TouchableOpacity style={styles.menuItem}>
                <Heart size={16} color="#FFF" />
                <Text style={styles.menuText}>Like</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem}>
                <Plus size={16} color="#FFF" />
                <Text style={styles.menuText}>Add to Playlist</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem}>
                <X size={16} color="#FFF" />
                <Text style={styles.menuText}>Don&apos;t Play This</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem} onPress={() => removeDownload(item.id)}>
                <X size={16} color="#FF4444" />
                <Text style={[styles.menuText, { color: "#FF4444" }]}>Remove Download</Text>
              </TouchableOpacity>
            </View>
          )}
        </TouchableOpacity>
      );
    },
    [playTrack, showMenu, downloads, queue, requestDownload, pauseDownload, resumeDownload, cancelDownload, removeDownload, retryDownload]
  );

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.title}>Downloads</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerButton}>
            <Search size={24} color="#FFF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <MoreHorizontal size={24} color="#FFF" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.sortContainer}>
        <Text style={styles.sortLabel}>Sort by</Text>
        <TouchableOpacity style={styles.sortButton} onPress={handleSortChange}>
          <Text style={styles.sortText}>{getSortLabel()}</Text>
          <ChevronDown size={16} color="#FF0080" />
        </TouchableOpacity>
      </View>

      <View style={styles.controlsContainer}>
        <TouchableOpacity style={styles.shuffleButton} onPress={handlePlayAll}>
          <Shuffle size={20} color="#FFF" />
          <Text style={styles.shuffleText}>Shuffle</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.playButton} onPress={handlePlayAll}>
          <Play size={20} color="#6B7280" fill="#6B7280" />
          <Text style={styles.playText}>Play</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={sortedDownloads}
        renderItem={renderTrackItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.tracksList}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Download size={40} color="#444" />
            <Text style={styles.emptyTitle}>No downloads yet</Text>
            <Text style={styles.emptySubtitle}>Save music, podcasts and audiobooks for offline listening.</Text>
          </View>
        }
      />
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
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFF",
    flex: 1,
    textAlign: "center",
    marginHorizontal: 16,
  },
  headerActions: {
    flexDirection: "row",
    gap: 8,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  sortContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  sortLabel: {
    fontSize: 16,
    color: "#FFF",
    fontWeight: "600",
  },
  sortButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  sortText: {
    fontSize: 16,
    color: "#FF0080",
    fontWeight: "600",
  },
  controlsContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 16,
  },
  shuffleButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FF0080",
    paddingVertical: 12,
    borderRadius: 25,
    gap: 8,
  },
  shuffleText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
  playButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1F2937",
    paddingVertical: 12,
    borderRadius: 25,
    gap: 8,
  },
  playText: {
    color: "#6B7280",
    fontSize: 16,
    fontWeight: "600",
  },
  tracksList: {
    paddingBottom: 100,
  },
  rowActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBtn: {
    padding: 8,
    marginHorizontal: 2,
  },
  progressBar: {
    marginTop: 6,
    height: 4,
    backgroundColor: '#2A2A2A',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: 4,
    backgroundColor: '#FF0080',
  },
  statusBadge: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: '600',
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    flexShrink: 1,
  },
  completedLabel: {
    marginTop: 6,
    color: '#10B981',
    fontSize: 12,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    gap: 8,
  },
  emptyTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '700',
    marginTop: 12,
  },
  emptySubtitle: {
    color: '#999',
    fontSize: 14,
  },
  trackItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    position: "relative",
  },
  trackArtworkContainer: {
    position: "relative",
    marginRight: 12,
  },
  trackArtwork: {
    width: 56,
    height: 56,
    borderRadius: 8,
  },
  trackPlayButton: {
    position: "absolute",
    bottom: 4,
    right: 4,
    backgroundColor: "#FF0080",
    borderRadius: 12,
    padding: 4,
  },
  trackInfo: {
    flex: 1,
    marginRight: 12,
  },
  trackTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFF",
    marginBottom: 4,
  },
  trackArtist: {
    fontSize: 14,
    color: "#9CA3AF",
  },
  menuButton: {
    padding: 8,
  },
  contextMenu: {
    position: "absolute",
    top: 60,
    right: 20,
    backgroundColor: "#1F2937",
    borderRadius: 12,
    paddingVertical: 8,
    minWidth: 200,
    zIndex: 1000,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  menuText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "500",
  },
});