import React, { useState, useCallback, useEffect } from "react";
import createContextHook from "@nkzw/create-context-hook";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Track } from "@/types";
import { allTracks } from "@/data/mockData";

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
}

export const [PlayerProvider, usePlayer] = createContextHook<PlayerState>(() => {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [queue, setQueue] = useState<Track[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    loadLastPlayed();
  }, []);

  const loadLastPlayed = async () => {
    try {
      const lastPlayed = await AsyncStorage.getItem("lastPlayedTrack");
      if (lastPlayed) {
        const track = JSON.parse(lastPlayed);
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
    setCurrentTrack(track);
    setIsPlaying(true);
    saveLastPlayed(track);
    
    // Auto-queue similar tracks
    const similarTracks = allTracks
      .filter(t => t.id !== track.id && t.type === track.type)
      .slice(0, 10);
    setQueue(similarTracks);
  }, []);

  const togglePlayPause = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);

  const skipNext = useCallback(() => {
    if (queue.length > 0) {
      const nextTrack = queue[0];
      setCurrentTrack(nextTrack);
      setQueue(prev => prev.slice(1));
      saveLastPlayed(nextTrack);
    }
  }, [queue]);

  const skipPrevious = useCallback(() => {
    // In a real app, this would go to previous track in history
    console.log("Skip to previous track");
  }, []);

  const addToQueue = useCallback((track: Track) => {
    setQueue(prev => [...prev, track]);
  }, []);

  const clearQueue = useCallback(() => {
    setQueue([]);
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
  };
});