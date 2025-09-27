import React, { useState, useCallback, useEffect, useRef } from "react";
import createContextHook from "@nkzw/create-context-hook";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Track } from "@/types";
import { allTracks } from "@/data/mockData";
import { router } from "expo-router";
import { useUser } from "@/contexts/UserContext";
import { audioEngine } from "@/lib/AudioEngine";

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
}

export const [PlayerProvider, usePlayer] = createContextHook<PlayerState>(() => {
  const userContext = useUser();
  const profile = userContext?.profile || null;
  const settings = userContext?.settings || {
    crossfadeSeconds: 6,
    gaplessPlayback: true,
  };
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [queue, setQueue] = useState<Track[]>([]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const guestTimerRef = useRef<null | ReturnType<typeof setTimeout>>(null);
  const GUEST_LIMIT_MS = 180000;

  useEffect(() => {
    loadLastPlayed();
    // Initialize audio engine early
    audioEngine.configure().catch((e) => console.log('[Player] Audio engine init error', e));
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
          audioEngine.pause().catch((e) => console.log('[Player] guest pause error', e));
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

  const playTrack = useCallback((track: Track) => {
    console.log("[Player] Playing track:", track.title, "Type:", track.type, "IsVideo:", track.isVideo);
    
    // Immediate UI updates for responsiveness
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
        audioEngine
          .loadAndPlay(track, similarTracks[0])
          .catch((e) => console.log('[Player] audio load error', e));
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

  const togglePlayPause = useCallback(() => {
    // Immediate UI feedback
    setIsPlaying((prev) => {
      const next = !prev;
      
      // Handle audio engine asynchronously to not block UI
      setTimeout(() => {
        try {
          const t = currentTrack;
          if (t && t.type !== 'video' && !t.isVideo) {
            if (next) {
              audioEngine.play().catch((e) => console.log('[Player] play() error', e));
            } else {
              audioEngine.pause().catch((e) => console.log('[Player] pause() error', e));
            }
          }
        } catch (e) {
          console.log('[Player] toggle error', e);
        }
      }, 0);
      
      return next;
    });
    
    startGuestTimer();
  }, [startGuestTimer, currentTrack]);

  const skipNext = useCallback(() => {
    if (queue.length > 0) {
      const nextTrack = queue[0];
      const remaining = queue.slice(1);
      
      // Immediate UI updates
      setCurrentTrack(nextTrack);
      setQueue(remaining);
      
      // Handle audio and storage asynchronously
      setTimeout(() => {
        saveLastPlayed(nextTrack);
        const t = nextTrack;
        if (t.type !== 'video' && !t.isVideo) {
          audioEngine
            .crossfadeToNext(t)
            .catch((e) => console.log('[Player] crossfade error', e));
        }
      }, 0);
      
      startGuestTimer();
    }
  }, [queue, startGuestTimer]);

  const skipPrevious = useCallback(() => {
    console.log("Skip to previous track");
    startGuestTimer();
  }, [startGuestTimer]);

  const addToQueue = useCallback((track: Track) => {
    setQueue((prev) => [...prev, track]);
  }, []);

  const clearQueue = useCallback(() => {
    setQueue([]);
  }, []);

  const stopPlayer = useCallback(async () => {
    console.log("[Player] Stopping player and clearing state");
    try {
      await audioEngine.stop();
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

  useEffect(() => {
    audioEngine.setEvents({
      onTrackStart: (t) => {
        console.log('[AudioEngine] started', t.title);
        // Immediate UI update
        setCurrentTrack((prev) => {
          if (!prev || prev.id !== t.id) return t;
          return prev;
        });
        
        // Handle queue and preloading asynchronously
        setTimeout(() => {
          setQueue((prev) => {
            if (prev.length > 0 && prev[0].id === t.id) {
              const remaining = prev.slice(1);
              if (remaining[0]) {
                audioEngine.preload(remaining[0]).catch((e) => console.log('[Player] preload next after start error', e));
              }
              saveLastPlayed(t);
              return remaining;
            }
            if (prev[0]) {
              // ensure next is preloaded
              audioEngine.preload(prev[0]).catch((e) => console.log('[Player] preload next ensure error', e));
            }
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
      onError: (e) => console.log('[AudioEngine] error', e),
    });
    
    // Configure audio engine preferences
    const crossfadeMs = (settings.crossfadeSeconds ?? 0) * 1000;
    audioEngine.setContentPrefs('song', { crossfadeMs, gapless: settings.gaplessPlayback });
    audioEngine.setContentPrefs('podcast', { crossfadeMs: 0, gapless: false });
    audioEngine.setContentPrefs('audiobook', { crossfadeMs: 0, gapless: false });
    audioEngine.setContentPrefs('video', { crossfadeMs: 0, gapless: false });
  }, [queue, settings.crossfadeSeconds, settings.gaplessPlayback]);

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
  };
});