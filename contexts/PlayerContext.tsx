import React, { useState, useCallback, useEffect, useRef } from "react";
import createContextHook from "@nkzw/create-context-hook";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Track } from "@/types";
import { allTracks } from "@/data/mockData";
import { router } from "expo-router";
import { useUser } from "@/contexts/UserContext";

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
  const { profile } = useUser();
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
        router.push("/auth");
      } catch (e) {
        console.error("[Player] navigate auth error", e);
      }
    }, GUEST_LIMIT_MS);
  }, [profile]);

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
    setCurrentTrack(track);
    setIsPlaying(true);
    saveLastPlayed(track);

    const similarTracks = allTracks
      .filter((t) => t.id !== track.id && t.type === track.type)
      .slice(0, 10);
    setQueue(similarTracks);

    startGuestTimer();
    
    // Navigate to player screen immediately for video content
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
    setIsPlaying((prev) => !prev);
    startGuestTimer();
  }, [startGuestTimer]);

  const skipNext = useCallback(() => {
    if (queue.length > 0) {
      const nextTrack = queue[0];
      setCurrentTrack(nextTrack);
      setQueue((prev) => prev.slice(1));
      saveLastPlayed(nextTrack);
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