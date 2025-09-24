import { useState, useCallback, useEffect } from "react";
import createContextHook from "@nkzw/create-context-hook";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Track, Playlist } from "@/types";
import { downloadedTracks, downloadedPodcasts } from "@/data/mockData";
import { useUser } from "@/contexts/UserContext";

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
  clearUserLibrary: () => void;
}

export const [LibraryProvider, useLibrary] = createContextHook<LibraryState>(() => {
  const { profile } = useUser();
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [favorites, setFavorites] = useState<Track[]>([]);
  const [downloads, setDownloads] = useState<Track[]>([]);
  const [recentlyPlayed, setRecentlyPlayed] = useState<Track[]>([]);

  const getUserKey = useCallback((key: string) => {
    const sanitizedKey = key?.trim();
    if (!sanitizedKey || sanitizedKey.length > 100) return "";
    if (!profile?.email) return sanitizedKey;
    return `${profile.email}_${sanitizedKey}`;
  }, [profile?.email]);

  const saveLibraryData = useCallback(async (key: string, data: any) => {
    const sanitizedKey = key?.trim();
    if (!profile?.email || !sanitizedKey || sanitizedKey.length > 100) return;
    if (!data) return;
    
    try {
      await AsyncStorage.setItem(getUserKey(sanitizedKey), JSON.stringify(data));
    } catch (error) {
      console.error(`Error saving ${sanitizedKey}:`, error);
    }
  }, [profile?.email, getUserKey]);

  const clearUserLibrary = useCallback(() => {
    setPlaylists([]);
    setFavorites([]);
    setDownloads([]);
    setRecentlyPlayed([]);
  }, []);

  const loadLibraryData = useCallback(async () => {
    if (!profile?.email) return;
    
    try {
      const [playlistsData, favoritesData, downloadsData, recentData] = await Promise.all([
        AsyncStorage.getItem(getUserKey("playlists")),
        AsyncStorage.getItem(getUserKey("favorites")),
        AsyncStorage.getItem(getUserKey("downloads")),
        AsyncStorage.getItem(getUserKey("recentlyPlayed")),
      ]);

      if (playlistsData) setPlaylists(JSON.parse(playlistsData));
      if (favoritesData) setFavorites(JSON.parse(favoritesData));
      if (downloadsData) setDownloads(JSON.parse(downloadsData));
      if (recentData) setRecentlyPlayed(JSON.parse(recentData));
    } catch (error) {
      console.error("Error loading library data:", error);
    }
  }, [profile?.email, getUserKey]);

  useEffect(() => {
    if (profile?.email) {
      loadLibraryData();
    } else {
      // Clear library data when user signs out
      clearUserLibrary();
    }
  }, [profile?.email, loadLibraryData]);

  useEffect(() => {
    // Initialize with mock downloads data if empty
    if (downloads.length === 0 && profile?.email) {
      const mockDownloads = [...downloadedTracks, ...downloadedPodcasts];
      setDownloads(mockDownloads);
      saveLibraryData("downloads", mockDownloads);
    }
  }, [downloads.length, profile?.email, saveLibraryData]);

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
  }, [playlists, saveLibraryData]);

  const addToPlaylist = useCallback((playlistId: string, track: Track) => {
    const updated = playlists.map(playlist => {
      if (playlist.id === playlistId) {
        return { ...playlist, tracks: [...playlist.tracks, track] };
      }
      return playlist;
    });
    setPlaylists(updated);
    saveLibraryData("playlists", updated);
  }, [playlists, saveLibraryData]);

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
  }, [favorites, saveLibraryData]);

  const isFavorite = useCallback((trackId: string) => {
    return favorites.some(t => t.id === trackId);
  }, [favorites]);

  const addToDownloads = useCallback((track: Track) => {
    if (!downloads.some(t => t.id === track.id)) {
      const updated = [...downloads, track];
      setDownloads(updated);
      saveLibraryData("downloads", updated);
    }
  }, [downloads, saveLibraryData]);

  const removeFromDownloads = useCallback((trackId: string) => {
    const updated = downloads.filter(t => t.id !== trackId);
    setDownloads(updated);
    saveLibraryData("downloads", updated);
  }, [downloads, saveLibraryData]);

  const addToRecentlyPlayed = useCallback((track: Track) => {
    const filtered = recentlyPlayed.filter(t => t.id !== track.id);
    const updated = [track, ...filtered].slice(0, 20);
    setRecentlyPlayed(updated);
    saveLibraryData("recentlyPlayed", updated);
  }, [recentlyPlayed, saveLibraryData]);



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
    clearUserLibrary,
  };
});