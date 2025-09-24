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
  ImageBackground,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import {
  MoreVertical,
  Heart,
  Share2,
  SkipBack,
  SkipForward,
  Play,
  Pause,
  Shuffle,
  List,
  ArrowLeft,
  RotateCcw,
  Bell,
  Settings,
  Facebook,
  Twitter,
  Link,
  Download,
  BookOpen,
  Clock,
  Volume2,
} from "lucide-react-native";
import { router } from "expo-router";
import { usePlayer } from "@/contexts/PlayerContext";
import { useLibrary } from "@/contexts/LibraryContext";
import { VideoPlayer } from "@/components/VideoPlayer";
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
        <ImageBackground 
          source={{ uri: currentTrack.artwork }} 
          style={styles.detailsBackground}
          blurRadius={30}
          resizeMode="cover"
        >
          <LinearGradient
            colors={['rgba(0,0,0,0.4)', 'rgba(0,0,0,0.7)', 'rgba(0,0,0,0.9)']}
            style={styles.detailsOverlay}
          >
            <SafeAreaView style={styles.safeArea} edges={["top"]}>
              <View style={styles.detailsHeader}>
                <TouchableOpacity onPress={() => setCurrentView('player')}>
                  <ArrowLeft size={28} color="#FFF" />
                </TouchableOpacity>
                <View style={styles.progressIndicator}>
                  <View style={styles.progressDot} />
                  <View style={[styles.progressDot, styles.progressDotActive]} />
                  <View style={styles.progressDot} />
                </View>
                <View style={styles.spacer} />
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
        </ImageBackground>
      </View>
    );
  }

  // Determine content type
  const isVideoTrack = currentTrack.type === "video" || currentTrack.isVideo === true || currentTrack.videoUrl;
  const isAudiobookTrack = currentTrack.type === "audiobook";
  
  console.log("[Player] Content type check:", {
    title: currentTrack.title,
    type: currentTrack.type,
    isVideo: currentTrack.isVideo,
    hasVideoUrl: !!currentTrack.videoUrl,
    isVideoTrack,
    isAudiobookTrack
  });

  // Video Player Component - All live performance content should be video
  if (isVideoTrack) {
    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.safeArea} edges={["top"]}>
          <View style={styles.videoHeader}>
            <TouchableOpacity onPress={() => router.back()}>
              <ArrowLeft size={28} color="#FFF" />
            </TouchableOpacity>
            <Text style={styles.videoTitle} numberOfLines={1}>
              {currentTrack.title}
            </Text>
            <TouchableOpacity onPress={() => setShowShareModal(true)}>
              <MoreVertical size={24} color="#FFF" />
            </TouchableOpacity>
          </View>

          <View style={styles.videoPlayerContainer}>
            <VideoPlayer
              track={currentTrack}
              isPlaying={isPlaying}
              onPlayPause={togglePlayPause}
              style={styles.videoPlayer}
            />
          </View>

          <View style={styles.videoControlsContainer}>
            <View style={styles.videoProgressContainer}>
              <TouchableOpacity 
                style={styles.sliderContainer}
                activeOpacity={1}
                onPress={(e) => {
                  const { locationX } = e.nativeEvent;
                  const containerWidth = width - 40;
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
                <Text style={styles.time}>2:46</Text>
                <Text style={styles.time}>3:05</Text>
              </View>
            </View>

            <View style={styles.videoMainControls}>
              <TouchableOpacity onPress={skipPrevious} style={styles.controlButton}>
                <SkipBack size={28} color="#FFF" fill="#FFF" />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={togglePlayPause}
                style={styles.videoPlayButton}
              >
                {isPlaying ? (
                  <Pause size={32} color="#FFF" fill="#FFF" />
                ) : (
                  <Play size={32} color="#FFF" fill="#FFF" style={styles.playIcon} />
                )}
              </TouchableOpacity>

              <TouchableOpacity onPress={skipNext} style={styles.controlButton}>
                <SkipForward size={28} color="#FFF" fill="#FFF" />
              </TouchableOpacity>
            </View>

            <View style={styles.videoInfoSection}>
              <Text style={styles.videoTrackTitle} numberOfLines={2}>
                {currentTrack.title}
              </Text>
              <Text style={styles.videoArtist} numberOfLines={1}>
                {currentTrack.artist}
              </Text>
            </View>

            <View style={styles.videoActionRow}>
              <TouchableOpacity style={styles.actionIcon} onPress={() => setShowShareModal(true)}>
                <Share2 size={24} color="#FFF" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionIcon} onPress={() => setCurrentView('queue')}>
                <List size={24} color="#FFF" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionIcon} onPress={() => toggleFavorite(currentTrack)}>
                <Heart
                  size={24}
                  color={isLiked ? "#FF0080" : "#FFF"}
                  fill={isLiked ? "#FF0080" : "transparent"}
                />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionIcon} onPress={handleDownload}>
                <Download size={24} color="#FFF" />
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
              <Text style={styles.playlistModalTitle}>Add this video to My Playlist</Text>
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
              <Text style={styles.downloadText}>Downloading video...</Text>
            </View>
          </View>
        </Modal>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ImageBackground 
        source={{ uri: currentTrack.artwork }} 
        style={styles.playerBackground}
        blurRadius={30}
        resizeMode="cover"
      >
        <LinearGradient
          colors={['rgba(0,0,0,0.4)', 'rgba(0,0,0,0.7)', 'rgba(0,0,0,0.9)']}
          style={styles.playerOverlay}
        >
          <SafeAreaView style={styles.safeArea} edges={["top"]}>
            <View style={styles.header}>
              <TouchableOpacity onPress={() => router.back()}>
                <ArrowLeft size={28} color="#FFF" />
              </TouchableOpacity>
              <View style={styles.progressIndicator}>
                <View style={[styles.progressDot, styles.progressDotActive]} />
                <View style={styles.progressDot} />
                <View style={styles.progressDot} />
              </View>
              <TouchableOpacity>
                <MoreVertical size={24} color="#FFF" />
              </TouchableOpacity>
            </View>

            <View style={styles.artworkContainer}>
              <View style={styles.artworkWrapper}>
                <Image
                  source={{ uri: currentTrack.artwork }}
                  style={styles.artwork}
                />
              </View>
            </View>

            <View style={styles.infoContainer}>
              <View style={styles.titleSection}>
                <Text style={styles.title} numberOfLines={2}>
                  {currentTrack.title}
                </Text>
                <Text style={styles.artist} numberOfLines={1}>
                  {currentTrack.artist}
                </Text>
              </View>

              <View style={styles.actionRow}>
                <TouchableOpacity style={styles.actionIcon} onPress={() => setShowShareModal(true)}>
                  <Share2 size={24} color="#FFF" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionIcon} onPress={() => setCurrentView('queue')}>
                  <List size={24} color="#FFF" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionIcon} onPress={() => toggleFavorite(currentTrack)}>
                  <Heart
                    size={24}
                    color={isLiked ? "#FF0080" : "#FFF"}
                    fill={isLiked ? "#FF0080" : "transparent"}
                  />
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionIcon} onPress={handleDownload}>
                  <Download size={24} color="#FFF" />
                </TouchableOpacity>
              </View>

              <View style={styles.progressContainer}>
                <TouchableOpacity 
                  style={styles.sliderContainer}
                  activeOpacity={1}
                  onPress={(e) => {
                    const { locationX } = e.nativeEvent;
                    const containerWidth = width - 40;
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
                  <Text style={styles.time}>
                    {isAudiobookTrack ? "12:15" : "2:46"}
                  </Text>
                  <Text style={styles.time}>
                    {isAudiobookTrack ? "47:32" : "3:05"}
                  </Text>
                </View>
              </View>

              {isAudiobookTrack ? (
                <View style={styles.audiobookControls}>
                  <View style={styles.audiobookMainControls}>
                    <TouchableOpacity onPress={skipPrevious} style={styles.controlButton}>
                      <SkipBack size={32} color="#FFF" fill="#FFF" />
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={togglePlayPause}
                      style={styles.playButton}
                    >
                      {isPlaying ? (
                        <Pause size={36} color="#FFF" fill="#FFF" />
                      ) : (
                        <Play size={36} color="#FFF" fill="#FFF" style={styles.playIcon} />
                      )}
                    </TouchableOpacity>

                    <TouchableOpacity onPress={skipNext} style={styles.controlButton}>
                      <SkipForward size={32} color="#FFF" fill="#FFF" />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.audiobookSecondaryControls}>
                    <TouchableOpacity style={styles.audiobookControlButton}>
                      <BookOpen size={20} color="#FFF" />
                      <Text style={styles.audiobookControlText}>Bookmark</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.audiobookControlButton}>
                      <BookOpen size={20} color="#FFF" />
                      <Text style={styles.audiobookControlText}>Chapter 2</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.audiobookControlButton}>
                      <Clock size={20} color="#FFF" />
                      <Text style={styles.audiobookControlText}>Speed 1x</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.audiobookControlButton}>
                      <Volume2 size={20} color="#FFF" />
                      <Text style={styles.audiobookControlText}>Download</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <View style={styles.controls}>
                  <TouchableOpacity
                    onPress={() => setShuffle(!shuffle)}
                    style={styles.controlButton}
                  >
                    <Shuffle size={24} color={shuffle ? "#FF0080" : "#FFF"} />
                  </TouchableOpacity>

                  <TouchableOpacity onPress={skipPrevious} style={styles.controlButton}>
                    <SkipBack size={32} color="#FFF" fill="#FFF" />
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={togglePlayPause}
                    style={styles.playButton}
                  >
                    {isPlaying ? (
                      <Pause size={36} color="#FFF" fill="#FFF" />
                    ) : (
                      <Play size={36} color="#FFF" fill="#FFF" style={styles.playIcon} />
                    )}
                  </TouchableOpacity>

                  <TouchableOpacity onPress={skipNext} style={styles.controlButton}>
                    <SkipForward size={32} color="#FFF" fill="#FFF" />
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => setRepeat(!repeat)}
                    style={styles.controlButton}
                  >
                    <RotateCcw size={24} color={repeat ? "#FF0080" : "#FFF"} />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </SafeAreaView>
        </LinearGradient>
      </ImageBackground>

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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  safeArea: {
    flex: 1,
  },
  playerBackground: {
    flex: 1,
  },
  playerOverlay: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  progressIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginHorizontal: 4,
  },
  progressDotActive: {
    backgroundColor: '#FFF',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFF",
  },
  artworkContainer: {
    alignItems: "center",
    paddingHorizontal: 40,
    marginTop: 40,
    marginBottom: 40,
  },
  artworkWrapper: {
    width: 280,
    height: 280,
    borderRadius: 140,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  artwork: {
    width: '100%',
    height: '100%',
  },
  videoHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  videoTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFF",
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 20,
  },
  videoPlayerContainer: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 0,
  },
  videoPlayer: {
    width: '100%',
    aspectRatio: 16/9,
    backgroundColor: '#000',
  },
  videoControlsContainer: {
    backgroundColor: 'rgba(0,0,0,0.95)',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  videoProgressContainer: {
    marginBottom: 20,
  },
  videoMainControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 40,
  },
  videoPlayButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#FF0080",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 30,
    shadowColor: '#FF0080',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  videoInfoSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  videoTrackTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFF",
    textAlign: 'center',
    marginBottom: 8,
  },
  videoArtist: {
    fontSize: 14,
    color: "rgba(255,255,255,0.7)",
    textAlign: 'center',
  },
  videoActionRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  infoContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  titleSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#FFF",
    textAlign: 'center',
    marginBottom: 8,
  },
  artist: {
    fontSize: 18,
    color: "rgba(255,255,255,0.7)",
    textAlign: 'center',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  actionIcon: {
    padding: 8,
  },
  progressContainer: {
    marginBottom: 40,
  },
  sliderContainer: {
    height: 40,
    justifyContent: 'center',
    paddingHorizontal: 0,
  },
  sliderTrack: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
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
    marginTop: 8,
  },
  time: {
    fontSize: 14,
    color: "rgba(255,255,255,0.7)",
    fontWeight: '500',
  },
  controls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  controlButton: {
    padding: 12,
  },
  playButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#FF0080",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: '#FF0080',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
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
    flex: 1,
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
  spacer: {
    width: 28,
  },
  audiobookControls: {
    alignItems: "center",
    marginBottom: 40,
  },
  audiobookMainControls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 30,
  },
  audiobookSecondaryControls: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 10,
  },
  audiobookControlButton: {
    alignItems: "center",
    padding: 8,
  },
  audiobookControlText: {
    color: "#FFF",
    fontSize: 12,
    marginTop: 4,
    fontWeight: "500",
  },
});