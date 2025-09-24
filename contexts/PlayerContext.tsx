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
  const { profile, settings } = useUser();
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [queue, setQueue] = useState<Track[]>([]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const guestTimerRef = useRef<null | ReturnType<typeof setTimeout>>(null);
  const GUEST_LIMIT_MS = 180000;

  useEffect(() => {
    loadLastPlayed();
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

  const loadLastPlayed = async () => {
    try {
      const lastPlayed = await AsyncStorage.getItem("lastPlayedTrack");
      if (lastPlayed) {
        const track = JSON.parse(lastPlayed) as Track;
        setCurrentTrack(track);
      }
    } catch (error) {
      console.error("Error loading last played track:", error);
    }
  };

  const saveLastPlayed = async (track: Track) => {
    try {
      await AsyncStorage.setItem("lastPlayedTrack", JSON.stringify(track));
    } catch (error) {
      console.error("Error saving last played track:", error);
    }
  };

  const playTrack = useCallback((track: Track) => {
    console.log("[Player] Playing track:", track.title, "Type:", track.type, "IsVideo:", track.isVideo);
    const similarTracks = allTracks
      .filter((t) => t.id !== track.id && t.type === track.type)
      .slice(0, 10);
    setQueue(similarTracks);
    setCurrentTrack(track);
    setIsPlaying(true);
    saveLastPlayed(track);

    if (track.type !== 'video' && !track.isVideo) {
      audioEngine
        .loadAndPlay(track, similarTracks[0])
        .catch((e) => console.log('[Player] audio load error', e));
    }

    startGuestTimer();
    
    if (track.type === "video" || track.isVideo === true) {
      console.log("[Player] Video content detected, navigating to player");
      try {
        router.push("/player");
      } catch (e) {
        console.error("[Player] Navigation error:", e);
      }
    }
  }, [startGuestTimer]);

  const togglePlayPause = useCallback(() => {
    setIsPlaying((prev) => {
      const next = !prev;
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
      return next;
    });
    startGuestTimer();
  }, [startGuestTimer, currentTrack]);

  const skipNext = useCallback(() => {
    if (queue.length > 0) {
      const nextTrack = queue[0];
      const remaining = queue.slice(1);
      setCurrentTrack(nextTrack);
      setQueue(remaining);
      saveLastPlayed(nextTrack);
      const t = nextTrack;
      if (t.type !== 'video' && !t.isVideo) {
        audioEngine
          .crossfadeToNext(t)
          .catch((e) => console.log('[Player] crossfade error', e));
      }
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
        setCurrentTrack((prev) => {
          if (!prev || prev.id !== t.id) return t;
          return prev;
        });
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
      },
      onTrackEnd: (t) => {
        console.log('[AudioEngine] ended', t.title);
        if (queue.length > 0) {
          const nxt = queue[0];
          setCurrentTrack(nxt);
          setQueue((prev) => prev.slice(1));
          saveLastPlayed(nxt);
        } else if (GUEST_LIMIT_MS > 0) {
          setIsPlaying(false);
        }
      },
      onError: (e) => console.log('[AudioEngine] error', e),
    });
    audioEngine.setContentPrefs('song', { crossfadeMs: (settings.crossfadeSeconds ?? 0) * 1000, gapless: settings.gaplessPlayback });
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