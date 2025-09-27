import React, { useEffect, useMemo, useState, useCallback, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  useWindowDimensions,
  FlatList,
  ScrollView,
  Modal,
  Platform,
  ImageBackground,
} from "react-native";
import SafeImage from "@/components/SafeImage";
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
  VolumeX,
} from "lucide-react-native";
import { router, useLocalSearchParams } from "expo-router";
import { usePlayer } from "@/contexts/PlayerContext";
import { useLibrary } from "@/contexts/LibraryContext";
import { VideoPlayer, VideoPlayerRef } from "@/components/VideoPlayer";
import { DJInstinctEntry } from "@/components/DJInstinctEntry";
import SliderCompat from "@/components/SliderCompat";
import type { Track } from "@/types";
import { audioEngine, Progress } from "@/lib/AudioEngine";


export default function PlayerScreen() {
  const { width } = useWindowDimensions();
  const { id, type } = useLocalSearchParams<{ id?: string; type?: string }>();
  const { currentTrack, isPlaying, togglePlayPause, skipNext, skipPrevious, queue, playTrack } = usePlayer();
  const { toggleFavorite, isFavorite, playlists, addToPlaylist } = useLibrary();
  const [progress, setProgress] = useState<number>(0);
  const [positionMs, setPositionMs] = useState<number>(0);
  const [durationMs, setDurationMs] = useState<number>(0);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const [currentView, setCurrentView] = useState<'player' | 'queue' | 'details'>('player');
  const [showShareModal, setShowShareModal] = useState(false);
  const [showAddToPlaylistModal, setShowAddToPlaylistModal] = useState(false);
  const [showDownloadProgress, setShowDownloadProgress] = useState(false);
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  const [volume, setVolume] = useState<number>(1.0);
  const [previousVolume, setPreviousVolume] = useState<number>(1.0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const videoPlayerRef = useRef<VideoPlayerRef>(null);

  // Memoize progress update callback for better performance
  const updateProgress = useCallback((p: Progress) => {
    setPositionMs(p.position);
    setDurationMs(p.duration);
    const pct = p.duration > 0 ? p.position / p.duration : 0;
    setProgress(Math.max(0, Math.min(1, pct)));
  }, []);

  useEffect(() => {
    const unsub = audioEngine.subscribeProgress(updateProgress);
    return unsub;
  }, [updateProgress]);

  // Handle direct navigation with URL parameters
  useEffect(() => {
    if (id && !currentTrack) {
      console.log('[Player] Loading track from URL params:', { id, type });
      // Import all mock data to find the track
      import('@/data/mockData').then((mockData) => {
        const allTracks = [
          ...mockData.featuredContent,
          ...mockData.trendingVideos,
          ...mockData.livePerformanceVideos,
          ...mockData.mostViewedVideos,
          ...mockData.trendingNow,
          ...mockData.newReleases,
          ...mockData.topCharts,
          ...mockData.podcasts,
          ...mockData.audiobooks,
        ];
        const track = allTracks.find(t => t.id === id);
        if (track) {
          console.log('[Player] Found track:', track.title, 'type:', track.type);
          playTrack(track);
        } else {
          console.log('[Player] Track not found with id:', id);
          router.back();
        }
      }).catch((e) => {
        console.log('[Player] Error loading track data:', e);
        router.back();
      });
    }
  }, [id, type, currentTrack, playTrack]);

  // Ensure engine has something loaded when entering screen directly
  useEffect(() => {
    try {
      if (currentTrack && currentTrack.type !== 'video' && !currentTrack.isVideo) {
        const active = audioEngine.getCurrentTrack();
        if (!active || active.id !== currentTrack.id) {
          console.log('[Player] Ensuring audio is loaded for', currentTrack.title);
          const next = queue?.[0];
          audioEngine.loadAndPlay(currentTrack, next).catch((e) => console.log('[Player] ensure load error', e));
        }
      }
    } catch (e) {
      console.log('[Player] ensure engine error', e);
    }
  }, [currentTrack, queue]);

  // Memoize time formatting for better performance
  const elapsed = useMemo(() => formatMs(positionMs), [positionMs]);
  const total = useMemo(() => formatMs(durationMs), [durationMs]);

  // Memoize control handlers
  const handlePlayPause = useCallback(() => {
    console.log('[Player] handlePlayPause called, isPlaying:', isPlaying);
    console.log('[Player] Current track:', currentTrack?.title, 'Type:', currentTrack?.type);
    
    // Skip video tracks - they handle their own playback
    if (currentTrack && (currentTrack.type === 'video' || currentTrack.isVideo)) {
      console.log('[Player] Video track detected, skipping audio toggle');
      return;
    }
    
    // For web, ensure user interaction is properly handled
    if (Platform.OS === 'web' && currentTrack && currentTrack.type !== 'video' && !currentTrack.isVideo) {
      if (!isPlaying) {
        console.log('[Player] Web platform - attempting direct audio engine play');
        // Try direct audio engine play first to capture user interaction
        audioEngine.play().then(() => {
          console.log('[Player] Direct audio engine play successful');
        }).catch((e) => {
          console.log('[Player] Direct audio engine play failed, using toggle:', e);
          togglePlayPause();
        });
      } else {
        console.log('[Player] Web platform - calling togglePlayPause for pause');
        togglePlayPause();
      }
    } else {
      console.log('[Player] Native platform or no track - calling togglePlayPause');
      togglePlayPause();
    }
  }, [togglePlayPause, isPlaying, currentTrack]);

  const handleSkipNext = useCallback(() => {
    console.log('[Player] handleSkipNext called');
    console.log('[Player] Current track:', currentTrack?.title, 'Type:', currentTrack?.type);
    
    if (currentTrack && (currentTrack.type === 'video' || currentTrack.isVideo || currentTrack.videoUrl)) {
      console.log('[Player] Video track - skipping forward 10 seconds');
      // For video, skip forward 10 seconds
      if (videoPlayerRef.current) {
        videoPlayerRef.current.skipForward(10).catch((err: unknown) => console.log('[Player] video skip forward error', err));
      }
    } else {
      console.log('[Player] Audio track - calling skipNext');
      skipNext();
    }
  }, [skipNext, currentTrack]);

  const handleSkipPrevious = useCallback(() => {
    console.log('[Player] handleSkipPrevious called');
    console.log('[Player] Current track:', currentTrack?.title, 'Type:', currentTrack?.type);
    
    if (currentTrack && (currentTrack.type === 'video' || currentTrack.isVideo || currentTrack.videoUrl)) {
      console.log('[Player] Video track - skipping backward 10 seconds');
      // For video, skip backward 10 seconds
      if (videoPlayerRef.current) {
        videoPlayerRef.current.skipBackward(10).catch((err: unknown) => console.log('[Player] video skip backward error', err));
      }
    } else {
      console.log('[Player] Audio track - calling skipPrevious');
      skipPrevious();
    }
  }, [skipPrevious, currentTrack]);

  const handleSeek = useCallback((e: any) => {
    if (!e?.nativeEvent?.locationX || typeof e.nativeEvent.locationX !== 'number') return;
    const { locationX } = e.nativeEvent;
    const containerWidth = width - 40;
    const newProgress = Math.max(0, Math.min(1, locationX / containerWidth));
    setProgress(newProgress);
    const target = Math.floor(newProgress * (durationMs || 0));
    audioEngine.seekTo(target).catch((err: unknown) => console.log('[Player] seek error', err));
  }, [width, durationMs]);

  const handleVideoSeek = useCallback((e: any) => {
    if (!e?.nativeEvent?.locationX || typeof e.nativeEvent.locationX !== 'number') return;
    const { locationX } = e.nativeEvent;
    const containerWidth = width - 40;
    const newProgress = Math.max(0, Math.min(1, locationX / containerWidth));
    setProgress(newProgress);
    const target = Math.floor(newProgress * (durationMs || 0));
    console.log('[Player] Video seek to:', target, 'ms');
    if (videoPlayerRef.current) {
      videoPlayerRef.current.seekTo(target).catch((err: unknown) => console.log('[Player] video seek error', err));
    }
  }, [width, durationMs]);

  const handleVolumeChange = useCallback((newVolume: number) => {
    if (typeof newVolume !== 'number' || newVolume < 0 || newVolume > 1) return;
    console.log('[Player] Setting volume to:', newVolume);
    
    // Store previous volume if we're not muting
    if (newVolume > 0 && volume !== newVolume) {
      setPreviousVolume(newVolume);
    }
    
    setVolume(newVolume);
    
    // If volume is set to 0, consider it muted
    setIsMuted(newVolume === 0);
    
    // Handle volume for both audio and video
    if (currentTrack) {
      if (currentTrack.type === 'video' || currentTrack.isVideo || currentTrack.videoUrl) {
        // For video tracks, the volume will be passed to VideoPlayer component
        console.log('[Player] Video volume updated to:', newVolume);
        // The VideoPlayer component will handle the volume change via props
      } else {
        // For audio tracks, use audio engine
        const active = audioEngine.getCurrentTrack();
        if (active) {
          audioEngine.setVolume(newVolume).catch((err: unknown) => console.log('[Player] audio volume error', err));
        }
      }
    }
  }, [currentTrack, volume]);

  const toggleVolumeSlider = useCallback(() => {
    setShowVolumeSlider(!showVolumeSlider);
  }, [showVolumeSlider]);

  const toggleMute = useCallback(() => {
    console.log('[Player] Toggle mute - current state:', { isMuted, volume, previousVolume });
    if (isMuted || volume === 0) {
      // Unmute: restore previous volume or set to 0.5 if it was 0
      const newVolume = previousVolume > 0 ? previousVolume : 0.5;
      console.log('[Player] Unmuting to volume:', newVolume);
      handleVolumeChange(newVolume);
    } else {
      // Mute: set volume to 0
      console.log('[Player] Muting volume');
      handleVolumeChange(0);
    }
  }, [isMuted, volume, previousVolume, handleVolumeChange]);

  const renderQueueItem = useCallback(({ item, index }: { item: Track; index: number }) => (
    <TouchableOpacity
      style={styles.queueItem}
      onPress={() => playTrack(item)}
      activeOpacity={0.8}
    >
      <SafeImage uri={item.artwork} style={styles.queueItemImage} />
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
  ), [playTrack]);

  const renderSuggestionItem = useCallback(({ item, index }: { item: Track; index: number }) => (
    <TouchableOpacity
      style={styles.suggestionItem}
      onPress={() => playTrack(item)}
      activeOpacity={0.8}
    >
      <View style={styles.suggestionNumber}>
        <Text style={styles.suggestionNumberText}>{String(index + 1).padStart(2, '0')}</Text>
      </View>
      <SafeImage uri={item.artwork} style={styles.suggestionImage} />
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
  ), [playTrack]);

  if (!currentTrack) {
    router.replace('/(tabs)/');
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
            removeClippedSubviews={true}
            maxToRenderPerBatch={10}
            windowSize={10}
            initialNumToRender={8}
            getItemLayout={(data, index) => ({
              length: 80,
              offset: 80 * index,
              index,
            })}
          />
        </SafeAreaView>
      </LinearGradient>
    );
  }

  if (currentView === 'details') {
    const suggestions = queue.slice(0, 3);
    
    return (
      <View style={styles.container}>
        {currentTrack.artwork?.trim() ? (
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
        ) : (
          <View style={[styles.detailsBackground, { backgroundColor: '#1A1A1A' }]}>
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
          </View>
        )}
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
            <TouchableOpacity onPress={() => router.canGoBack() ? router.back() : router.replace('/(tabs)/')}>
              <ArrowLeft size={28} color="#FFF" />
            </TouchableOpacity>
            <Text style={styles.videoTitle} numberOfLines={1}>
              {currentTrack.title}
            </Text>
            <TouchableOpacity 
              onPress={() => {
                console.log('[Player] Video options menu button pressed');
                setShowShareModal(true);
              }}
              style={styles.headerOptionsButton}
              activeOpacity={0.7}
            >
              <MoreVertical size={24} color="#FF0080" />
            </TouchableOpacity>
          </View>

          <View style={styles.videoPlayerContainer}>
            <VideoPlayer
              ref={videoPlayerRef}
              track={currentTrack}
              isPlaying={isPlaying}
              onPlayPause={handlePlayPause}
              onProgressUpdate={({ position, duration }) => updateProgress({ position, duration, buffered: duration })}
              volume={volume}
              style={styles.videoPlayer}
            />
          </View>

          <View style={styles.videoControlsContainer}>
            <View style={styles.videoProgressContainer}>
              <TouchableOpacity 
                style={styles.sliderContainer}
                activeOpacity={1}
                onPress={handleVideoSeek}
              >
                <View style={styles.sliderTrack}>
                  <View style={[styles.sliderProgress, { width: `${progress * 100}%` }]} />
                  <View style={[styles.sliderThumb, { left: `${progress * 100}%` }]} />
                </View>
              </TouchableOpacity>
              <View style={styles.timeRow}>
                <Text style={styles.time}>{elapsed}</Text>
                <Text style={styles.time}>{total}</Text>
              </View>
            </View>

            <View style={styles.volumeContainer}>
              <View style={styles.volumeControls}>
                <TouchableOpacity 
                  style={styles.volumeButton}
                  onPress={toggleMute}
                  hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                >
                  {isMuted ? (
                    <VolumeX size={24} color="#FF0080" />
                  ) : (
                    <Volume2 size={24} color="#FFF" />
                  )}
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.volumeSliderToggle}
                  onPress={toggleVolumeSlider}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Text style={styles.volumeSliderToggleText}>{showVolumeSlider ? '−' : '+'}</Text>
                </TouchableOpacity>
              </View>
              {showVolumeSlider && (
                <View style={styles.volumeSliderContainer}>
                  <SliderCompat
                    minimumValue={0}
                    maximumValue={1}
                    step={0.01}
                    value={volume}
                    onValueChange={handleVolumeChange}
                    minimumTrackTintColor="#FF0080"
                    maximumTrackTintColor="rgba(255,255,255,0.2)"
                    thumbTintColor="#FF0080"
                    style={styles.volumeSlider}
                    testID="video-volume-slider"
                  />
                </View>
              )}
            </View>

            <View style={styles.videoMainControls}>
              <TouchableOpacity 
                onPress={handleSkipPrevious} 
                style={styles.controlButton}
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              >
                <SkipBack size={28} color="#FFF" fill="#FFF" />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handlePlayPause}
                style={styles.videoPlayButton}
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                activeOpacity={0.8}
              >
                {isPlaying ? (
                  <Pause size={32} color="#FFF" fill="#FFF" />
                ) : (
                  <Play size={32} color="#FFF" fill="#FFF" style={styles.playIcon} />
                )}
              </TouchableOpacity>

              <TouchableOpacity 
                onPress={handleSkipNext} 
                style={styles.controlButton}
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
              >
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
          <TouchableOpacity 
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setShowShareModal(false)}
          >
            <TouchableOpacity 
              style={styles.shareModal}
              activeOpacity={1}
              onPress={(e) => e.stopPropagation()}
            >
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
              
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowShareModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          </TouchableOpacity>
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
      {currentTrack.artwork?.trim() ? (
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
              <TouchableOpacity onPress={() => router.canGoBack() ? router.back() : router.replace('/(tabs)/')}>
                <ArrowLeft size={28} color="#FFF" />
              </TouchableOpacity>
              <View style={styles.progressIndicator}>
                <View style={[styles.progressDot, styles.progressDotActive]} />
                <View style={styles.progressDot} />
                <View style={styles.progressDot} />
              </View>
              <View style={styles.headerActions}>
                {currentTrack.type !== "podcast" && currentTrack.type !== "audiobook" && (
                  <DJInstinctEntry style={styles.djInstinctEntry} />
                )}
                <TouchableOpacity 
                  onPress={() => {
                    console.log('[Player] Options menu button pressed');
                    setShowOptionsMenu(true);
                  }}
                  style={styles.headerOptionsButton}
                  activeOpacity={0.7}
                >
                  <MoreVertical size={24} color="#FF0080" />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.artworkContainer}>
              <View style={styles.artworkWrapper}>
                <SafeImage
                  uri={currentTrack.artwork}
                  style={styles.artwork}
                  accessibilityLabel="Track artwork"
                  testID="player-artwork"
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
                  onPress={handleSeek}
                >
                  <View style={styles.sliderTrack}>
                    <View style={[styles.sliderProgress, { width: `${progress * 100}%` }]} />
                    <View style={[styles.sliderThumb, { left: `${progress * 100}%` }]} />
                  </View>
                </TouchableOpacity>
                <View style={styles.timeRow}>
                  <Text style={styles.time}>{elapsed}</Text>
                  <Text style={styles.time}>{total}</Text>
                </View>
              </View>

              <View style={styles.volumeContainer}>
                <View style={styles.volumeControls}>
                  <TouchableOpacity 
                    style={styles.volumeButton}
                    onPress={toggleMute}
                    hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                  >
                    {isMuted ? (
                      <VolumeX size={24} color="#FF0080" />
                    ) : (
                      <Volume2 size={24} color="#FFF" />
                    )}
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.volumeSliderToggle}
                    onPress={toggleVolumeSlider}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Text style={styles.volumeSliderToggleText}>{showVolumeSlider ? '−' : '+'}</Text>
                  </TouchableOpacity>
                </View>
                {showVolumeSlider && (
                  <View style={styles.volumeSliderContainer}>
                    <SliderCompat
                      minimumValue={0}
                      maximumValue={1}
                      step={0.01}
                      value={volume}
                      onValueChange={handleVolumeChange}
                      minimumTrackTintColor="#FF0080"
                      maximumTrackTintColor="rgba(255,255,255,0.2)"
                      thumbTintColor="#FF0080"
                      style={styles.volumeSlider}
                      testID="audio-volume-slider"
                    />
                  </View>
                )}
              </View>

              {isAudiobookTrack ? (
                <View style={styles.audiobookControls}>
                  <View style={styles.audiobookMainControls}>
                    <TouchableOpacity 
                      onPress={handleSkipPrevious} 
                      style={styles.controlButton}
                      hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                    >
                      <SkipBack size={32} color="#FFF" fill="#FFF" />
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={handlePlayPause}
                      style={styles.playButton}
                      hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                      activeOpacity={0.8}
                    >
                      {isPlaying ? (
                        <Pause size={36} color="#FFF" fill="#FFF" />
                      ) : (
                        <Play size={36} color="#FFF" fill="#FFF" style={styles.playIcon} />
                      )}
                    </TouchableOpacity>

                    <TouchableOpacity 
                      onPress={handleSkipNext} 
                      style={styles.controlButton}
                      hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                    >
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

                  <TouchableOpacity 
                    onPress={handleSkipPrevious} 
                    style={styles.controlButton}
                    hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                  >
                    <SkipBack size={32} color="#FFF" fill="#FFF" />
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={handlePlayPause}
                    style={styles.playButton}
                    hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                    activeOpacity={0.8}
                  >
                    {isPlaying ? (
                      <Pause size={36} color="#FFF" fill="#FFF" />
                    ) : (
                      <Play size={36} color="#FFF" fill="#FFF" style={styles.playIcon} />
                    )}
                  </TouchableOpacity>

                  <TouchableOpacity 
                    onPress={handleSkipNext} 
                    style={styles.controlButton}
                    hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                  >
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
      ) : (
        <View style={[styles.playerBackground, { backgroundColor: '#1A1A1A' }]}>
          <LinearGradient
            colors={['rgba(0,0,0,0.4)', 'rgba(0,0,0,0.7)', 'rgba(0,0,0,0.9)']}
            style={styles.playerOverlay}
          >
            <SafeAreaView style={styles.safeArea} edges={["top"]}>
              <View style={styles.header}>
                <TouchableOpacity onPress={() => router.canGoBack() ? router.back() : router.replace('/(tabs)/')}>
                  <ArrowLeft size={28} color="#FFF" />
                </TouchableOpacity>
                <View style={styles.progressIndicator}>
                  <View style={[styles.progressDot, styles.progressDotActive]} />
                  <View style={styles.progressDot} />
                  <View style={styles.progressDot} />
                </View>
                <View style={styles.headerActions}>
                  {currentTrack.type !== "podcast" && currentTrack.type !== "audiobook" && (
                    <DJInstinctEntry style={styles.djInstinctEntry} />
                  )}
                  <TouchableOpacity 
                    onPress={() => {
                      console.log('[Player] Options menu button pressed');
                      setShowOptionsMenu(true);
                    }}
                    style={styles.headerOptionsButton}
                    activeOpacity={0.7}
                  >
                    <MoreVertical size={24} color="#FF0080" />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.artworkContainer}>
                <View style={styles.artworkWrapper}>
                  <SafeImage
                    uri={currentTrack.artwork}
                    style={styles.artwork}
                  accessibilityLabel="Track artwork"
                  testID="player-artwork"
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
                    onPress={handleSeek}
                  >
                    <View style={styles.sliderTrack}>
                      <View style={[styles.sliderProgress, { width: `${progress * 100}%` }]} />
                      <View style={[styles.sliderThumb, { left: `${progress * 100}%` }]} />
                    </View>
                  </TouchableOpacity>
                  <View style={styles.timeRow}>
                    <Text style={styles.time}>{elapsed}</Text>
                    <Text style={styles.time}>{total}</Text>
                  </View>
                </View>

                <View style={styles.volumeContainer}>
                  <TouchableOpacity 
                    style={styles.volumeButton}
                    onPress={toggleVolumeSlider}
                    hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                  >
                    <Volume2 size={24} color="#FFF" />
                  </TouchableOpacity>
                  {showVolumeSlider && (
                    <View style={styles.volumeSliderContainer}>
                      <SliderCompat
                        minimumValue={0}
                        maximumValue={1}
                        step={0.01}
                        value={volume}
                        onValueChange={handleVolumeChange}
                        minimumTrackTintColor="#FF0080"
                        maximumTrackTintColor="rgba(255,255,255,0.2)"
                        thumbTintColor="#FF0080"
                        style={styles.volumeSlider}
                        testID="audio-volume-slider-2"
                      />
                    </View>
                  )}
                </View>

                {isAudiobookTrack ? (
                  <View style={styles.audiobookControls}>
                    <View style={styles.audiobookMainControls}>
                      <TouchableOpacity 
                        onPress={handleSkipPrevious} 
                        style={styles.controlButton}
                        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                      >
                        <SkipBack size={32} color="#FFF" fill="#FFF" />
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={handlePlayPause}
                        style={styles.playButton}
                        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                        activeOpacity={0.8}
                      >
                        {isPlaying ? (
                          <Pause size={36} color="#FFF" fill="#FFF" />
                        ) : (
                          <Play size={36} color="#FFF" fill="#FFF" style={styles.playIcon} />
                        )}
                      </TouchableOpacity>

                      <TouchableOpacity 
                        onPress={handleSkipNext} 
                        style={styles.controlButton}
                        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                      >
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

                    <TouchableOpacity 
                      onPress={handleSkipPrevious} 
                      style={styles.controlButton}
                      hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                    >
                      <SkipBack size={32} color="#FFF" fill="#FFF" />
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={handlePlayPause}
                      style={styles.playButton}
                      hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                      activeOpacity={0.8}
                    >
                      {isPlaying ? (
                        <Pause size={36} color="#FFF" fill="#FFF" />
                      ) : (
                        <Play size={36} color="#FFF" fill="#FFF" style={styles.playIcon} />
                      )}
                    </TouchableOpacity>

                    <TouchableOpacity 
                      onPress={handleSkipNext} 
                      style={styles.controlButton}
                      hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                    >
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
        </View>
      )}

      {/* Share Modal */}
      <Modal
        visible={showShareModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowShareModal(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowShareModal(false)}
        >
          <TouchableOpacity 
            style={styles.shareModal}
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
          >
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
            
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowShareModal(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </TouchableOpacity>
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

      {/* Options Menu Modal */}
      <Modal
        visible={showOptionsMenu}
        transparent
        animationType="slide"
        onRequestClose={() => setShowOptionsMenu(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.optionsModal}>
            <Text style={styles.optionsTitle}>OPTIONS</Text>
            
            <TouchableOpacity 
              style={styles.optionItem}
              onPress={() => {
                setShowOptionsMenu(false);
                setShowAddToPlaylistModal(true);
              }}
            >
              <List size={24} color="#FFF" />
              <Text style={styles.optionText}>Add to Playlist</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.optionItem}
              onPress={() => {
                setShowOptionsMenu(false);
                setShowShareModal(true);
              }}
            >
              <Share2 size={24} color="#FFF" />
              <Text style={styles.optionText}>Share</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.optionItem}
              onPress={() => {
                setShowOptionsMenu(false);
                handleDownload();
              }}
            >
              <Download size={24} color="#FFF" />
              <Text style={styles.optionText}>Download</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.optionItem}
              onPress={() => {
                setShowOptionsMenu(false);
                setCurrentView('details');
              }}
            >
              <BookOpen size={24} color="#FFF" />
              <Text style={styles.optionText}>Song Details</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.optionItem}
              onPress={() => {
                setShowOptionsMenu(false);
                setCurrentView('queue');
              }}
            >
              <List size={24} color="#FFF" />
              <Text style={styles.optionText}>View Queue</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowOptionsMenu(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

function formatMs(ms: number): string {
  if (!ms || ms < 0) return '0:00';
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  safeArea: {
    flex: 1,
    justifyContent: 'space-between',
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
    backgroundColor: 'rgba(255,255,255,0.6)',
    marginHorizontal: 4,
  },
  progressDotActive: {
    backgroundColor: '#FF0080',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFF",
  },
  artworkContainer: {
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 30,
    flex: 1,
    justifyContent: 'center',
  },
  artworkWrapper: {
    width: '90%',
    aspectRatio: 1,
    maxWidth: 350,
    maxHeight: 350,
    borderRadius: 12,
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
    paddingHorizontal: 20,
    paddingBottom: 40,
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
    marginBottom: 60,
    minHeight: 100,
  },
  controlButton: {
    padding: 12,
    minWidth: 56,
    minHeight: 56,
    justifyContent: 'center',
    alignItems: 'center',
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
  optionsModal: {
    backgroundColor: '#2A2A2A',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  optionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
    textAlign: 'center',
    marginBottom: 30,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },
  optionText: {
    fontSize: 16,
    color: '#FFF',
    fontWeight: '500',
    marginLeft: 16,
  },
  optionsButton: {
    padding: 8,
    minWidth: 40,
    minHeight: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  headerOptionsButton: {
    padding: 8,
    minWidth: 40,
    minHeight: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  djInstinctEntry: {
    marginRight: 4,
  },
  volumeContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  volumeControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  volumeButton: {
    padding: 12,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  volumeSliderToggle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  volumeSliderToggleText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
  },
  volumeSliderContainer: {
    marginTop: 12,
    alignItems: 'center',
  },
  volumeSlider: {
    width: 120,
    height: 40,
  },
});