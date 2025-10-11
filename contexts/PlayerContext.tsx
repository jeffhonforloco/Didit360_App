import React, { useState, useCallback, useEffect, useRef } from "react";
import createContextHook from "@nkzw/create-context-hook";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Track } from "@/types";
import { allTracks } from "@/data/mockData";
import { router } from "expo-router";
import { useUser } from "@/contexts/UserContext";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { simpleAudioEngine } from "@/lib/AudioEngineSimple";
import { trpcClient } from "@/lib/trpc";

interface HistoryEntry {
  track: Track;
  playedAt: Date;
  playCount: number;
  lastPosition?: number;
  completed: boolean;
}

const HISTORY_STORAGE_KEY = "listening_history";
const MAX_HISTORY_ITEMS = 500;

interface PlayerState {
  currentTrack: Track | null;
  queue: Track[];
  isPlaying: boolean;
  playTrack: (track: Track) => void;
  togglePlayPause: () => void;
  skipNext: () => void;
  skipPrevious: () => void;
  addToQueue: (track: Track) => void;
  clearQueue: () => void;
  stopPlayer: () => void;
  showAdModal: boolean;
  closeAdModal: () => void;
}

export const [PlayerProvider, usePlayer] = createContextHook<PlayerState>(() => {
  const userContext = useUser();
  const profile = userContext?.profile || null;
  const settings = userContext?.settings || {
    crossfadeSeconds: 6,
    gaplessPlayback: true,
  };
  const subscription = useSubscription();
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [queue, setQueue] = useState<Track[]>([]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [showAdModal, setShowAdModal] = useState<boolean>(false);
  const guestTimerRef = useRef<null | ReturnType<typeof setTimeout>>(null);
  const GUEST_LIMIT_MS = 180000;

  useEffect(() => {
    loadLastPlayed();
    // Initialize audio engine in background
    setTimeout(() => {
      simpleAudioEngine.configure().catch((e) => console.log('[Player] Audio engine init error', e));
      simpleAudioEngine.setVolume(1.0).catch((e) => console.log('[Player] Initial volume set error', e));
    }, 100);
  }, []);

  useEffect(() => {
    if (profile && guestTimerRef.current) {
      clearTimeout(guestTimerRef.current);
      guestTimerRef.current = null;
    }
  }, [profile]);

  const startGuestTimer = useCallback(() => {
    if (profile || guestTimerRef.current) return;
    guestTimerRef.current = setTimeout(() => {
      console.log("[Player] Guest time limit reached. Pausing and prompting sign up.");
      setIsPlaying(false);
      try {
        const t = currentTrack;
        if (t && t.type !== 'video' && !t.isVideo) {
          simpleAudioEngine.pause().catch((e) => console.log('[Player] guest pause error', e));
        }
      } catch {}
      try {
        router.push("/auth");
      } catch (e) {
        console.error("[Player] navigate auth error", e);
      }
    }, GUEST_LIMIT_MS);
  }, [profile, currentTrack]);

  const loadLastPlayed = useCallback(async () => {
    try {
      const lastPlayed = await AsyncStorage.getItem("lastPlayedTrack");
      if (lastPlayed) {
        const track = JSON.parse(lastPlayed) as Track;
        setCurrentTrack(track);
      }
    } catch (error) {
      console.error("Error loading last played track:", error);
    }
  }, []);

  const saveLastPlayed = useCallback(async (track: Track) => {
    try {
      await AsyncStorage.setItem("lastPlayedTrack", JSON.stringify(track));
    } catch (error) {
      console.error("Error saving last played track:", error);
    }
  }, []);

  const addToHistory = useCallback(async (track: Track) => {
    try {
      const stored = await AsyncStorage.getItem(HISTORY_STORAGE_KEY);
      const history: HistoryEntry[] = stored ? JSON.parse(stored) : [];
      
      const existingIndex = history.findIndex(e => e.track.id === track.id);
      
      if (existingIndex >= 0) {
        const existing = history[existingIndex];
        history.splice(existingIndex, 1);
        history.unshift({
          ...existing,
          playedAt: new Date(),
          playCount: existing.playCount + 1,
        });
      } else {
        history.unshift({
          track,
          playedAt: new Date(),
          playCount: 1,
          completed: false,
        });
      }
      
      const limited = history.slice(0, MAX_HISTORY_ITEMS);
      await AsyncStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(limited));
      console.log("[Player] Added to history:", track.title);
    } catch (error) {
      console.error("[Player] History save error:", error);
    }
  }, []);

  const playTrack = useCallback((track: Track) => {
    console.log("[Player] Playing track:", track.title, "Type:", track.type, "IsVideo:", track.isVideo);
    
    trpcClient.catalog.trackStream.mutate({
      id: track.id,
      type: track.type as 'song' | 'video' | 'podcast' | 'audiobook',
    }).catch((e: unknown) => console.log('[Player] Stream tracking error:', e));
    
    addToHistory(track);
    
    setCurrentTrack(track);
    setIsPlaying(true);
    
    // Generate queue asynchronously to not block UI
    setTimeout(() => {
      const similarTracks = allTracks
        .filter((t) => t.id !== track.id && t.type === track.type)
        .slice(0, 10);
      setQueue(similarTracks);
      
      // Start audio playback
      if (track.type !== 'video' && !track.isVideo) {
        console.log('[Player] Starting audio playback for:', track.title, 'audioUrl:', track.audioUrl);
        simpleAudioEngine
          .loadAndPlay(track)
          .then(() => {
            console.log('[Player] Audio load and play successful');
            // Ensure volume is set after successful load
            simpleAudioEngine.setVolume(1.0).catch((e) => console.log('[Player] post-load volume error', e));
          })
          .catch((e) => console.log('[Player] audio load error', e));
      } else {
        console.log('[Player] Skipping audio playback for video track:', track.title);
      }
    }, 0);
    
    // Save to storage asynchronously
    saveLastPlayed(track);
    startGuestTimer();
    
    // Navigate for video content
    if (track.type === "video" || track.isVideo === true) {
      console.log("[Player] Video content detected, navigating to player");
      setTimeout(() => {
        try {
          router.push("/player");
        } catch (e) {
          console.error("[Player] Navigation error:", e);
        }
      }, 0);
    }
  }, [startGuestTimer]);

  const togglePlayPause = useCallback(async () => {
    console.log('[Player] ===== TOGGLE PLAY/PAUSE CALLED =====');
    console.log('[Player] Current state:', {
      currentTrack: currentTrack?.title,
      isPlaying,
      trackType: currentTrack?.type,
      isVideo: currentTrack?.isVideo,
      audioUrl: currentTrack?.audioUrl
    });
    
    // Check if we have a current track
    if (!currentTrack) {
      console.log('[Player] ❌ No current track, cannot toggle play/pause');
      return;
    }
    
    // Handle video tracks differently - just toggle the UI state
    if (currentTrack.type === 'video' || currentTrack.isVideo || currentTrack.videoUrl) {
      console.log('[Player] 🎥 Video track detected, toggling UI state only');
      setIsPlaying(!isPlaying);
      startGuestTimer();
      return;
    }
    
    // Ensure audio engine is configured
    try {
      await simpleAudioEngine.configure();
    } catch (e) {
      console.log('[Player] Audio engine configuration error:', e);
    }
    
    const targetState = !isPlaying;
    console.log('[Player] 🔄 Target state:', targetState);
    
    // Update UI state immediately for better responsiveness
    setIsPlaying(targetState);
    
    try {
      if (targetState) {
        console.log('[Player] ▶️ Attempting to PLAY audio...');
        
        // Check if audio engine has a track loaded
        const currentEngineTrack = simpleAudioEngine.getCurrentTrack();
        console.log('[Player] Current engine track:', currentEngineTrack?.title);
        
        if (!currentEngineTrack || currentEngineTrack.id !== currentTrack.id) {
          console.log('[Player] 📥 Track not loaded in engine, loading now...');
          await simpleAudioEngine.loadAndPlay(currentTrack);
          console.log('[Player] ✅ Track loaded and playing successfully');
        } else {
          console.log('[Player] 🎯 Track already loaded, calling play()');
          await simpleAudioEngine.play();
          console.log('[Player] ✅ play() successful');
          // Ensure volume is properly set after play
          const currentVolume = simpleAudioEngine.getVolume();
          if (currentVolume === 0) {
            await simpleAudioEngine.setVolume(1.0);
            console.log('[Player] 🔊 Volume restored to 1.0');
          }
        }
      } else {
        console.log('[Player] ⏸️ Calling simpleAudioEngine.pause()');
        await simpleAudioEngine.pause();
        console.log('[Player] ✅ pause() successful');
      }
    } catch (error) {
      console.log('[Player] ❌ Toggle error:', error);
      // Revert UI state on error
      setIsPlaying(!targetState);
      console.log('[Player] ❌ Reverted UI state due to error');
    }
    
    startGuestTimer();
    console.log('[Player] ===== TOGGLE PLAY/PAUSE FINISHED =====');
  }, [startGuestTimer, currentTrack, isPlaying]);

  const skipNext = useCallback(async () => {
    console.log('[Player] ===== SKIP NEXT CALLED =====');
    console.log('[Player] Queue length:', queue.length);
    
    // Check skip limit for free users
    if (subscription.tier === 'free' && !subscription.canSkip()) {
      console.log('[Player] Skip limit reached for free user');
      router.push('/subscription' as any);
      return;
    }
    
    // Record skip for free users
    if (subscription.tier === 'free') {
      subscription.recordSkip();
    }
    
    // Check if ad should be shown
    if (subscription.shouldShowAd()) {
      console.log('[Player] Showing ad before skip');
      setShowAdModal(true);
      return;
    }
    
    if (queue.length > 0) {
      const nextTrack = queue[0];
      const remaining = queue.slice(1);
      
      console.log('[Player] Skipping to:', nextTrack.title);
      
      // Immediate UI updates
      setCurrentTrack(nextTrack);
      setQueue(remaining);
      setIsPlaying(true); // Assume we'll be playing the next track
      
      // Handle audio and storage
      try {
        await saveLastPlayed(nextTrack);
        
        if (nextTrack.type !== 'video' && !nextTrack.isVideo) {
          console.log('[Player] Loading and playing next audio track');
          await simpleAudioEngine.loadAndPlay(nextTrack);
          console.log('[Player] ✅ Next track loaded and playing');
        } else {
          console.log('[Player] Video track, navigating to player');
          setTimeout(() => {
            try {
              router.push("/player");
            } catch (e) {
              console.error("[Player] Navigation error:", e);
            }
          }, 0);
        }
      } catch (e) {
        console.log('[Player] ❌ Skip next error:', e);
        // Revert state on error
        setIsPlaying(false);
      }
      
      startGuestTimer();
    } else {
      console.log('[Player] No tracks in queue to skip to');
      // Generate a new queue if empty
      const similarTracks = allTracks
        .filter((t) => t.id !== currentTrack?.id && t.type === currentTrack?.type)
        .slice(0, 10);
      
      if (similarTracks.length > 0) {
        const nextTrack = similarTracks[0];
        const newQueue = similarTracks.slice(1);
        
        console.log('[Player] Generated new queue, skipping to:', nextTrack.title);
        
        setCurrentTrack(nextTrack);
        setQueue(newQueue);
        setIsPlaying(true);
        
        try {
          await saveLastPlayed(nextTrack);
          
          if (nextTrack.type !== 'video' && !nextTrack.isVideo) {
            await simpleAudioEngine.loadAndPlay(nextTrack);
            console.log('[Player] ✅ New track loaded and playing');
          } else {
            setTimeout(() => {
              try {
                router.push("/player");
              } catch (e) {
                console.error("[Player] Navigation error:", e);
              }
            }, 0);
          }
        } catch (e) {
          console.log('[Player] ❌ Skip to generated track error:', e);
          setIsPlaying(false);
        }
        
        startGuestTimer();
      } else {
        console.log('[Player] No similar tracks available');
      }
    }
    
    console.log('[Player] ===== SKIP NEXT FINISHED =====');
  }, [queue, startGuestTimer, saveLastPlayed, currentTrack, subscription]);

  const skipPrevious = useCallback(async () => {
    console.log('[Player] ===== SKIP PREVIOUS CALLED =====');
    
    // For now, we'll implement a simple previous track logic
    // In a real app, you'd maintain a history of played tracks
    if (currentTrack) {
      // Find a track from the same type to go back to
      const similarTracks = allTracks.filter((t) => 
        t.id !== currentTrack.id && 
        t.type === currentTrack.type
      );
      
      if (similarTracks.length > 0) {
        // Get a random previous track for now
        const previousTrack = similarTracks[Math.floor(Math.random() * similarTracks.length)];
        
        console.log('[Player] Skipping to previous:', previousTrack.title);
        
        // Immediate UI updates
        setCurrentTrack(previousTrack);
        setIsPlaying(true);
        
        // Generate new queue with similar tracks
        const newQueue = similarTracks
          .filter(t => t.id !== previousTrack.id)
          .slice(0, 10);
        setQueue(newQueue);
        
        // Handle audio and storage
        try {
          await saveLastPlayed(previousTrack);
          
          if (previousTrack.type !== 'video' && !previousTrack.isVideo) {
            console.log('[Player] Loading and playing previous track');
            await simpleAudioEngine.loadAndPlay(previousTrack);
            console.log('[Player] ✅ Previous track loaded and playing');
          } else {
            console.log('[Player] Video track, navigating to player');
            setTimeout(() => {
              try {
                router.push("/player");
              } catch (e) {
                console.error("[Player] Navigation error:", e);
              }
            }, 0);
          }
        } catch (e) {
          console.log('[Player] ❌ Skip previous error:', e);
          setIsPlaying(false);
        }
        
        startGuestTimer();
      } else {
        console.log('[Player] No previous tracks available');
      }
    } else {
      console.log('[Player] No current track to skip from');
    }
    
    console.log('[Player] ===== SKIP PREVIOUS FINISHED =====');
  }, [currentTrack, startGuestTimer, saveLastPlayed]);

  const addToQueue = useCallback((track: Track) => {
    setQueue((prev) => [...prev, track]);
  }, []);

  const clearQueue = useCallback(() => {
    setQueue([]);
  }, []);

  const stopPlayer = useCallback(async () => {
    console.log("[Player] Stopping player and clearing state");
    try {
      await simpleAudioEngine.stop();
    } catch (e) {
      console.log('[Player] engine stop error', e);
    }
    setCurrentTrack(null);
    setQueue([]);
    setIsPlaying(false);
    if (guestTimerRef.current) {
      clearTimeout(guestTimerRef.current);
      guestTimerRef.current = null;
    }
    try {
      await AsyncStorage.removeItem("lastPlayedTrack");
    } catch (error) {
      console.error("Error clearing last played track:", error);
    }
  }, []);
  
  const closeAdModal = useCallback(() => {
    setShowAdModal(false);
  }, []);

  useEffect(() => {
    simpleAudioEngine.setEvents({
      onTrackStart: (t) => {
        console.log('[AudioEngine] started', t.title);
        // Immediate UI update
        setCurrentTrack((prev) => {
          if (!prev || prev.id !== t.id) return t;
          return prev;
        });
        setIsPlaying(true); // Ensure UI state matches audio engine
        
        // Ensure volume is set when track starts
        simpleAudioEngine.setVolume(1.0).catch((e) => console.log('[Player] track start volume error', e));
        
        // Handle queue and preloading asynchronously
        setTimeout(() => {
          setQueue((prev) => {
            if (prev.length > 0 && prev[0].id === t.id) {
              const remaining = prev.slice(1);
              // Note: Simplified audio engine doesn't have preload functionality
              // This is handled by the loadAndPlay method
              saveLastPlayed(t);
              return remaining;
            }
            // Note: Simplified audio engine doesn't have preload functionality
            return prev;
          });
        }, 0);
      },
      onTrackEnd: (t) => {
        console.log('[AudioEngine] ended', t.title);
        if (queue.length > 0) {
          const nxt = queue[0];
          // Immediate UI updates
          setCurrentTrack(nxt);
          setQueue((prev) => prev.slice(1));
          // Async storage
          setTimeout(() => saveLastPlayed(nxt), 0);
        } else if (GUEST_LIMIT_MS > 0) {
          setIsPlaying(false);
        }
      },
      onError: (e) => {
        console.log('[AudioEngine] error', e);
        setIsPlaying(false); // Stop playing on error
      },
      onStateChange: (state) => {
        console.log('[AudioEngine] state changed to:', state);
        // Sync UI state with audio engine state, but only for non-video tracks
        const track = simpleAudioEngine.getCurrentTrack();
        if (track && track.type !== 'video' && !track.isVideo && !track.videoUrl) {
          // Only update UI state if the engine track matches our current track
          if (currentTrack && track.id === currentTrack.id) {
            if (state === 'playing') {
              console.log('[AudioEngine] Setting UI to playing state');
              setIsPlaying(true);
            } else if (state === 'paused' || state === 'stopped') {
              console.log('[AudioEngine] Setting UI to paused state');
              setIsPlaying(false);
            } else if (state === 'error') {
              console.log('[AudioEngine] Setting UI to paused state due to error');
              setIsPlaying(false);
            }
          }
        }
      },
    });
    
    // Configure audio engine preferences
    const crossfadeMs = (settings.crossfadeSeconds ?? 0) * 1000;
    // Note: Simplified audio engine doesn't have content preferences
    // These settings are handled by the audio engine internally
  }, [queue, settings.crossfadeSeconds, settings.gaplessPlayback, currentTrack]);

  return {
    currentTrack,
    queue,
    isPlaying,
    playTrack,
    togglePlayPause,
    skipNext,
    skipPrevious,
    addToQueue,
    clearQueue,
    stopPlayer,
    showAdModal,
    closeAdModal,
  };
});