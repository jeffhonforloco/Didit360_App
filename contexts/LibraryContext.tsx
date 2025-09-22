import React, { useState, useCallback, useEffect } from "react";
import createContextHook from "@nkzw/create-context-hook";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Track, Playlist } from "@/types";

interface LibraryState {
  playlists: Playlist[];
  favorites: Track[];
  downloads: Track[];
  recentlyPlayed: Track[];
  createPlaylist: (name: string, tracks: Track[]) => void;
  addToPlaylist: (playlistId: string, track: Track) => void;
  toggleFavorite: (track: Track) => void;
  isFavorite: (trackId: string) => boolean;
  addToDownloads: (track: Track) => void;
  removeFromDownloads: (trackId: string) => void;
  addToRecentlyPlayed: (track: Track) => void;
}

export const [LibraryProvider, useLibrary] = createContextHook<LibraryState>(() => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [favorites, setFavorites] = useState<Track[]>([]);
  const [downloads, setDownloads] = useState<Track[]>([]);
  const [recentlyPlayed, setRecentlyPlayed] = useState<Track[]>([]);

  useEffect(() => {
    loadLibraryData();
  }, []);

  const loadLibraryData = async () => {
    try {
      const [playlistsData, favoritesData, downloadsData, recentData] = await Promise.all([
        AsyncStorage.getItem("playlists"),
        AsyncStorage.getItem("favorites"),
        AsyncStorage.getItem("downloads"),
        AsyncStorage.getItem("recentlyPlayed"),
      ]);

      if (playlistsData) setPlaylists(JSON.parse(playlistsData));
      if (favoritesData) setFavorites(JSON.parse(favoritesData));
      if (downloadsData) setDownloads(JSON.parse(downloadsData));
      if (recentData) setRecentlyPlayed(JSON.parse(recentData));
    } catch (error) {
      console.error("Error loading library data:", error);
    }
  };

  const saveLibraryData = async (key: string, data: any) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error(`Error saving ${key}:`, error);
    }
  };

  const createPlaylist = useCallback((name: string, tracks: Track[]) => {
    const newPlaylist: Playlist = {
      id: Date.now().toString(),
      name,
      tracks,
      createdAt: new Date().toISOString(),
    };
    const updated = [...playlists, newPlaylist];
    setPlaylists(updated);
    saveLibraryData("playlists", updated);
  }, [playlists]);

  const addToPlaylist = useCallback((playlistId: string, track: Track) => {
    const updated = playlists.map(playlist => {
      if (playlist.id === playlistId) {
        return { ...playlist, tracks: [...playlist.tracks, track] };
      }
      return playlist;
    });
    setPlaylists(updated);
    saveLibraryData("playlists", updated);
  }, [playlists]);

  const toggleFavorite = useCallback((track: Track) => {
    const isFav = favorites.some(t => t.id === track.id);
    let updated: Track[];
    
    if (isFav) {
      updated = favorites.filter(t => t.id !== track.id);
    } else {
      updated = [...favorites, track];
    }
    
    setFavorites(updated);
    saveLibraryData("favorites", updated);
  }, [favorites]);

  const isFavorite = useCallback((trackId: string) => {
    return favorites.some(t => t.id === trackId);
  }, [favorites]);

  const addToDownloads = useCallback((track: Track) => {
    if (!downloads.some(t => t.id === track.id)) {
      const updated = [...downloads, track];
      setDownloads(updated);
      saveLibraryData("downloads", updated);
    }
  }, [downloads]);

  const removeFromDownloads = useCallback((trackId: string) => {
    const updated = downloads.filter(t => t.id !== trackId);
    setDownloads(updated);
    saveLibraryData("downloads", updated);
  }, [downloads]);

  const addToRecentlyPlayed = useCallback((track: Track) => {
    const filtered = recentlyPlayed.filter(t => t.id !== track.id);
    const updated = [track, ...filtered].slice(0, 20);
    setRecentlyPlayed(updated);
    saveLibraryData("recentlyPlayed", updated);
  }, [recentlyPlayed]);

  return {
    playlists,
    favorites,
    downloads,
    recentlyPlayed,
    createPlaylist,
    addToPlaylist,
    toggleFavorite,
    isFavorite,
    addToDownloads,
    removeFromDownloads,
    addToRecentlyPlayed,
  };
});