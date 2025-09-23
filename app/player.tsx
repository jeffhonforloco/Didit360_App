import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  useWindowDimensions,
  FlatList,
  ScrollView,
  Modal,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import {
  ChevronDown,
  MoreVertical,
  Heart,
  Share2,
  SkipBack,
  SkipForward,
  Play,
  Pause,
  Repeat,
  Shuffle,
  List,
  Mic2,
  ArrowLeft,
  RotateCcw,
  Bell,
  Settings,
  Facebook,
  Twitter,
  Link,
  Download,
  Plus,
} from "lucide-react-native";
import { router } from "expo-router";
import { usePlayer } from "@/contexts/PlayerContext";
import { useLibrary } from "@/contexts/LibraryContext";
import type { Track } from "@/types";


export default function PlayerScreen() {
  const { width } = useWindowDimensions();
  const { currentTrack, isPlaying, togglePlayPause, skipNext, skipPrevious, queue, playTrack } = usePlayer();
  const { toggleFavorite, isFavorite, playlists, addToPlaylist } = useLibrary();
  const [progress, setProgress] = useState(0.3);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const [currentView, setCurrentView] = useState<'player' | 'queue' | 'details'>('player');
  const [showShareModal, setShowShareModal] = useState(false);
  const [showAddToPlaylistModal, setShowAddToPlaylistModal] = useState(false);
  const [showDownloadProgress, setShowDownloadProgress] = useState(false);

  if (!currentTrack) {
    router.back();
    return null;
  }

  const isLiked = isFavorite(currentTrack.id);

  const handleShare = (platform: string) => {
    console.log(`Sharing to ${platform}:`, currentTrack.title);
    if (Platform.OS === 'web') {
      if (platform === 'copy') {
        navigator.clipboard.writeText(`Check out "${currentTrack.title}" by ${currentTrack.artist}`);
        console.log('Link copied to clipboard');
      }
    }
    setShowShareModal(false);
  };

  const handleDownload = () => {
    setShowDownloadProgress(true);
    setTimeout(() => {
      setShowDownloadProgress(false);
      console.log(`"${currentTrack.title}" has been downloaded`);
    }, 2000);
  };

  const handleAddToPlaylist = (playlistId: string) => {
    addToPlaylist(playlistId, currentTrack);
    setShowAddToPlaylistModal(false);
    console.log(`"${currentTrack.title}" added to playlist`);
  };

  const renderQueueItem = ({ item, index }: { item: Track; index: number }) => (
    <TouchableOpacity
      style={styles.queueItem}
      onPress={() => playTrack(item)}
      activeOpacity={0.8}
    >
      <Image source={{ uri: item.artwork }} style={styles.queueItemImage} />
      <View style={styles.queueItemInfo}>
        <Text style={styles.queueItemTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.queueItemArtist} numberOfLines={1}>
          {item.artist}
        </Text>
      </View>
      <TouchableOpacity style={styles.queueItemMore}>
        <MoreVertical size={20} color="#999" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderSuggestionItem = ({ item, index }: { item: Track; index: number }) => (
    <TouchableOpacity
      style={styles.suggestionItem}
      onPress={() => playTrack(item)}
      activeOpacity={0.8}
    >
      <View style={styles.suggestionNumber}>
        <Text style={styles.suggestionNumberText}>{String(index + 1).padStart(2, '0')}</Text>
      </View>
      <Image source={{ uri: item.artwork }} style={styles.suggestionImage} />
      <View style={styles.suggestionInfo}>
        <Text style={styles.suggestionTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.suggestionArtist} numberOfLines={1}>
          {item.artist}
        </Text>
      </View>
      <TouchableOpacity style={styles.suggestionMore}>
        <MoreVertical size={20} color="#999" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  if (currentView === 'queue') {
    return (
      <LinearGradient
        colors={["#1A1A1A", "#0A0A0A"]}
        style={styles.container}
      >
        <SafeAreaView style={styles.safeArea} edges={["top"]}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => setCurrentView('player')}>
              <ArrowLeft size={28} color="#FFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Music List</Text>
            <View style={styles.headerActions}>
              <TouchableOpacity style={styles.headerAction}>
                <RotateCcw size={24} color="#FFF" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerAction}>
                <Bell size={24} color="#FFF" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerAction}>
                <Settings size={24} color="#FFF" />
              </TouchableOpacity>
            </View>
          </View>
          
          <FlatList
            data={queue}
            renderItem={renderQueueItem}
            keyExtractor={(item) => item.id}
            style={styles.queueList}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.queueContent}
          />
        </SafeAreaView>
      </LinearGradient>
    );
  }

  if (currentView === 'details') {
    const suggestions = queue.slice(0, 3);
    
    return (
      <View style={styles.container}>
        <Image 
          source={{ uri: currentTrack.artwork }} 
          style={styles.detailsBackground}
          blurRadius={20}
        />
        <LinearGradient
          colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.8)', '#0A0A0A']}
          style={styles.detailsOverlay}
        >
          <SafeAreaView style={styles.safeArea} edges={["top"]}>
            <View style={styles.detailsHeader}>
              <TouchableOpacity onPress={() => setCurrentView('player')}>
                <ArrowLeft size={28} color="#FFF" />
              </TouchableOpacity>
            </View>
            
            <ScrollView 
              style={styles.detailsContent}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.detailsScrollContent}
            >
              <View style={styles.detailsInfo}>
                <Text style={styles.detailsTitle}>{currentTrack.title}</Text>
                <Text style={styles.detailsArtist}>{currentTrack.artist}</Text>
                <Text style={styles.detailsDescription}>
                  It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it
                </Text>
                <TouchableOpacity>
                  <Text style={styles.showMore}>Show more ⌄</Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.suggestionsSection}>
                <Text style={styles.suggestionsTitle}>Suggestion</Text>
                {suggestions.map((item, index) => (
                  <View key={item.id}>
                    {renderSuggestionItem({ item, index })}
                  </View>
                ))}
              </View>
            </ScrollView>
          </SafeAreaView>
        </LinearGradient>
      </View>
    );
  }

  return (
    <LinearGradient
      colors={["#1A1A1A", "#0A0A0A"]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <ChevronDown size={28} color="#FFF" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setCurrentView('details')}>
            <Text style={styles.headerTitle}>Now Playing</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <MoreVertical size={24} color="#FFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.artworkContainer}>
          <Image
            source={{ uri: currentTrack.artwork }}
            style={[styles.artwork, { width: width - 80, height: width - 80 }]}
          />
        </View>

        <View style={styles.infoContainer}>
          <View style={styles.titleRow}>
            <View style={styles.titleContainer}>
              <Text style={styles.title} numberOfLines={1}>
                {currentTrack.title}
              </Text>
              <Text style={styles.artist} numberOfLines={1}>
                {currentTrack.artist}
              </Text>
            </View>
            <View style={styles.titleActions}>
              <TouchableOpacity 
                style={styles.titleAction}
                onPress={() => setShowAddToPlaylistModal(true)}
              >
                <Plus size={20} color="#999" />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.titleAction}
                onPress={handleDownload}
              >
                <Download size={20} color="#999" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => toggleFavorite(currentTrack)}>
                <Heart
                  size={24}
                  color={isLiked ? "#FF0080" : "#FFF"}
                  fill={isLiked ? "#FF0080" : "transparent"}
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.progressContainer}>
            <TouchableOpacity 
              style={styles.sliderContainer}
              activeOpacity={1}
              onPress={(e) => {
                // Calculate progress based on touch position
                const { locationX } = e.nativeEvent;
                const containerWidth = width - 40; // Account for padding
                const newProgress = Math.max(0, Math.min(1, locationX / containerWidth));
                setProgress(newProgress);
              }}
            >
              <View style={styles.sliderTrack}>
                <View style={[styles.sliderProgress, { width: `${progress * 100}%` }]} />
                <View style={[styles.sliderThumb, { left: `${progress * 100}%` }]} />
              </View>
            </TouchableOpacity>
            <View style={styles.timeRow}>
              <Text style={styles.time}>1:23</Text>
              <Text style={styles.time}>3:45</Text>
            </View>
          </View>

          <View style={styles.controls}>
            <TouchableOpacity
              onPress={() => setShuffle(!shuffle)}
              style={styles.controlButton}
            >
              <Shuffle size={20} color={shuffle ? "#FF0080" : "#999"} />
            </TouchableOpacity>

            <TouchableOpacity onPress={skipPrevious} style={styles.controlButton}>
              <SkipBack size={32} color="#FFF" fill="#FFF" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={togglePlayPause}
              style={styles.playButton}
            >
              {isPlaying ? (
                <Pause size={32} color="#000" fill="#000" />
              ) : (
                <Play size={32} color="#000" fill="#000" style={styles.playIcon} />
              )}
            </TouchableOpacity>

            <TouchableOpacity onPress={skipNext} style={styles.controlButton}>
              <SkipForward size={32} color="#FFF" fill="#FFF" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setRepeat(!repeat)}
              style={styles.controlButton}
            >
              <Repeat size={20} color={repeat ? "#FF0080" : "#999"} />
            </TouchableOpacity>
          </View>

          <View style={styles.bottomActions}>
            <TouchableOpacity style={styles.actionButton} onPress={() => router.push("/lyrics")} testID="open-lyrics">
              <Mic2 size={20} color="#999" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={() => setShowShareModal(true)}>
              <Share2 size={20} color="#999" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.actionButton} 
              onPress={() => setCurrentView('queue')}
            >
              <List size={20} color="#999" />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>

      {/* Share Modal */}
      <Modal
        visible={showShareModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowShareModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.shareModal}>
            <Text style={styles.shareTitle}>SHARE TO</Text>
            
            <TouchableOpacity 
              style={styles.shareOption}
              onPress={() => handleShare('facebook')}
            >
              <View style={styles.shareIconContainer}>
                <Facebook size={24} color="#1877F2" />
              </View>
              <Text style={styles.shareOptionText}>Facebook</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.shareOption}
              onPress={() => handleShare('google')}
            >
              <View style={[styles.shareIconContainer, { backgroundColor: '#DB4437' }]}>
                <Text style={styles.googleIcon}>G+</Text>
              </View>
              <Text style={styles.shareOptionText}>Google +</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.shareOption}
              onPress={() => handleShare('twitter')}
            >
              <View style={styles.shareIconContainer}>
                <Twitter size={24} color="#1DA1F2" />
              </View>
              <Text style={styles.shareOptionText}>Twitter</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.shareOption}
              onPress={() => handleShare('copy')}
            >
              <View style={styles.shareIconContainer}>
                <Link size={24} color="#999" />
              </View>
              <Text style={styles.shareOptionText}>Copy Link</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Add to Playlist Modal */}
      <Modal
        visible={showAddToPlaylistModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowAddToPlaylistModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.playlistModal}>
            <Text style={styles.playlistModalTitle}>Add this song to My Playlist</Text>
            <FlatList
              data={playlists}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.playlistOption}
                  onPress={() => handleAddToPlaylist(item.id)}
                >
                  <Text style={styles.playlistOptionText}>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowAddToPlaylistModal(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Download Progress Modal */}
      <Modal
        visible={showDownloadProgress}
        transparent
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.downloadModal}>
            <Text style={styles.downloadText}>Downloading music for this song...</Text>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFF",
  },
  artworkContainer: {
    alignItems: "center",
    paddingHorizontal: 40,
    marginTop: 20,
  },
  artwork: {
    borderRadius: 8,
  },
  infoContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FFF",
    marginBottom: 4,
  },
  artist: {
    fontSize: 18,
    color: "#999",
  },
  progressContainer: {
    marginBottom: 32,
  },
  sliderContainer: {
    height: 40,
    justifyContent: 'center',
    paddingHorizontal: 0,
  },
  sliderTrack: {
    height: 4,
    backgroundColor: '#333',
    borderRadius: 2,
    position: 'relative',
  },
  sliderProgress: {
    height: '100%',
    backgroundColor: '#FF0080',
    borderRadius: 2,
  },
  sliderThumb: {
    position: 'absolute',
    top: -6,
    width: 16,
    height: 16,
    backgroundColor: '#FF0080',
    borderRadius: 8,
    marginLeft: -8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  timeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: -8,
  },
  time: {
    fontSize: 12,
    color: "#999",
  },
  controls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 32,
  },
  controlButton: {
    padding: 12,
    marginHorizontal: 12,
  },
  playButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 20,
  },
  bottomActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  actionButton: {
    padding: 12,
  },

  titleContainer: {
    flex: 1,
  },
  playIcon: {
    marginLeft: 4,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerAction: {
    marginLeft: 16,
  },
  queueList: {
    flex: 1,
  },
  queueContent: {
    paddingBottom: 120,
  },
  queueItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  queueItemImage: {
    width: 56,
    height: 56,
    borderRadius: 8,
    marginRight: 12,
  },
  queueItemInfo: {
    flex: 1,
  },
  queueItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
    marginBottom: 4,
  },
  queueItemArtist: {
    fontSize: 14,
    color: '#999',
  },
  queueItemMore: {
    padding: 8,
  },
  detailsBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  detailsOverlay: {
    flex: 1,
  },
  detailsHeader: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  detailsContent: {
    flex: 1,
  },
  detailsScrollContent: {
    paddingBottom: 120,
  },
  detailsInfo: {
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 40,
  },
  detailsTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 8,
  },
  detailsArtist: {
    fontSize: 18,
    color: '#999',
    marginBottom: 20,
  },
  detailsDescription: {
    fontSize: 16,
    color: '#CCC',
    lineHeight: 24,
    marginBottom: 8,
  },
  showMore: {
    fontSize: 16,
    color: '#999',
  },
  suggestionsSection: {
    paddingHorizontal: 20,
  },
  suggestionsTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFF',
    marginBottom: 20,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    marginBottom: 8,
  },
  suggestionNumber: {
    width: 32,
    alignItems: 'center',
    marginRight: 12,
  },
  suggestionNumberText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#999',
  },
  suggestionImage: {
    width: 48,
    height: 48,
    borderRadius: 6,
    marginRight: 12,
  },
  suggestionInfo: {
    flex: 1,
  },
  suggestionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
    marginBottom: 4,
  },
  suggestionArtist: {
    fontSize: 14,
    color: '#999',
  },
  suggestionMore: {
    padding: 8,
  },
  titleActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleAction: {
    padding: 8,
    marginRight: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'flex-end',
  },
  shareModal: {
    backgroundColor: '#2A2A2A',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  shareTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
    textAlign: 'center',
    marginBottom: 30,
  },
  shareOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },
  shareIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1877F2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  shareOptionText: {
    fontSize: 16,
    color: '#FFF',
    fontWeight: '500',
  },
  googleIcon: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFF',
  },
  playlistModal: {
    backgroundColor: '#2A2A2A',
    borderRadius: 12,
    padding: 20,
    margin: 20,
    maxHeight: '60%',
  },
  playlistModalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8B1538',
    textAlign: 'center',
    marginBottom: 20,
  },
  playlistOption: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  playlistOptionText: {
    fontSize: 16,
    color: '#FFF',
  },
  cancelButton: {
    marginTop: 20,
    paddingVertical: 16,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#999',
    fontWeight: '600',
  },
  downloadModal: {
    backgroundColor: '#8B1538',
    borderRadius: 12,
    padding: 20,
    margin: 20,
    alignItems: 'center',
  },
  downloadText: {
    fontSize: 16,
    color: '#FFF',
    textAlign: 'center',
  },
});