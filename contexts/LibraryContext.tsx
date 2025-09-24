import { useState, useCallback, useEffect } from "react";
import createContextHook from "@nkzw/create-context-hook";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Track, Playlist } from "@/types";
import { downloadedTracks, downloadedPodcasts, audiobooks } from "@/data/mockData";
import { useUser } from "@/contexts/UserContext";
import type { GeneratedSet } from "@/contexts/MixMindContext";

interface LibraryState {
  playlists: Playlist[];
  favorites: Track[];
  downloads: Track[];
  recentlyPlayed: Track[];
  audiobooks: Track[];
  podcasts: Track[];
  mixmindSets: GeneratedSet[];
  createPlaylist: (name: string, tracks: Track[]) => void;
  addToPlaylist: (playlistId: string, track: Track) => void;
  toggleFavorite: (track: Track) => void;
  isFavorite: (trackId: string) => boolean;
  addToDownloads: (track: Track) => void;
  removeFromDownloads: (trackId: string) => void;
  addToRecentlyPlayed: (track: Track) => void;
  addAudiobook: (audiobook: Track) => void;
  removeAudiobook: (audiobookId: string) => void;
  addPodcast: (podcast: Track) => void;
  removePodcast: (podcastId: string) => void;
  addMixMindSet: (set: GeneratedSet) => void;
  removeMixMindSet: (setId: string) => void;
  clearUserLibrary: () => void;
  getFilteredContent: (filter: string) => any[];
}

export const [LibraryProvider, useLibrary] = createContextHook<LibraryState>(() => {
  const { profile } = useUser();
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [favorites, setFavorites] = useState<Track[]>([]);
  const [downloads, setDownloads] = useState<Track[]>([]);
  const [recentlyPlayed, setRecentlyPlayed] = useState<Track[]>([]);
  const [userAudiobooks, setUserAudiobooks] = useState<Track[]>([]);
  const [userPodcasts, setUserPodcasts] = useState<Track[]>([]);
  const [mixmindSets, setMixmindSets] = useState<GeneratedSet[]>([]);

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
    setUserAudiobooks([]);
    setUserPodcasts([]);
    setMixmindSets([]);
  }, []);

  const loadLibraryData = useCallback(async () => {
    if (!profile?.email) return;
    
    try {
      const [
        playlistsData, 
        favoritesData, 
        downloadsData, 
        recentData,
        audiobooksData,
        podcastsData,
        mixmindData
      ] = await Promise.all([
        AsyncStorage.getItem(getUserKey("playlists")),
        AsyncStorage.getItem(getUserKey("favorites")),
        AsyncStorage.getItem(getUserKey("downloads")),
        AsyncStorage.getItem(getUserKey("recentlyPlayed")),
        AsyncStorage.getItem(getUserKey("audiobooks")),
        AsyncStorage.getItem(getUserKey("podcasts")),
        AsyncStorage.getItem(getUserKey("mixmind_sets")),
      ]);

      if (playlistsData) setPlaylists(JSON.parse(playlistsData));
      if (favoritesData) setFavorites(JSON.parse(favoritesData));
      if (downloadsData) setDownloads(JSON.parse(downloadsData));
      if (recentData) setRecentlyPlayed(JSON.parse(recentData));
      if (audiobooksData) setUserAudiobooks(JSON.parse(audiobooksData));
      if (podcastsData) setUserPodcasts(JSON.parse(podcastsData));
      if (mixmindData) setMixmindSets(JSON.parse(mixmindData));
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
    // Initialize with mock data if empty
    if (downloads.length === 0 && profile?.email) {
      const mockDownloads = [...downloadedTracks, ...downloadedPodcasts];
      setDownloads(mockDownloads);
      saveLibraryData("downloads", mockDownloads);
    }
    
    if (userAudiobooks.length === 0 && profile?.email) {
      setUserAudiobooks(audiobooks);
      saveLibraryData("audiobooks", audiobooks);
    }
  }, [downloads.length, userAudiobooks.length, profile?.email, saveLibraryData]);

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

  const addAudiobook = useCallback((audiobook: Track) => {
    if (!userAudiobooks.some(a => a.id === audiobook.id)) {
      const updated = [...userAudiobooks, audiobook];
      setUserAudiobooks(updated);
      saveLibraryData("audiobooks", updated);
    }
  }, [userAudiobooks, saveLibraryData]);

  const removeAudiobook = useCallback((audiobookId: string) => {
    const updated = userAudiobooks.filter(a => a.id !== audiobookId);
    setUserAudiobooks(updated);
    saveLibraryData("audiobooks", updated);
  }, [userAudiobooks, saveLibraryData]);

  const addPodcast = useCallback((podcast: Track) => {
    if (!userPodcasts.some(p => p.id === podcast.id)) {
      const updated = [...userPodcasts, podcast];
      setUserPodcasts(updated);
      saveLibraryData("podcasts", updated);
    }
  }, [userPodcasts, saveLibraryData]);

  const removePodcast = useCallback((podcastId: string) => {
    const updated = userPodcasts.filter(p => p.id !== podcastId);
    setUserPodcasts(updated);
    saveLibraryData("podcasts", updated);
  }, [userPodcasts, saveLibraryData]);

  const addMixMindSet = useCallback((set: GeneratedSet) => {
    if (!mixmindSets.some(s => s.id === set.id)) {
      const updated = [...mixmindSets, set];
      setMixmindSets(updated);
      saveLibraryData("mixmind_sets", updated);
    }
  }, [mixmindSets, saveLibraryData]);

  const removeMixMindSet = useCallback((setId: string) => {
    const updated = mixmindSets.filter(s => s.id !== setId);
    setMixmindSets(updated);
    saveLibraryData("mixmind_sets", updated);
  }, [mixmindSets, saveLibraryData]);

  const getFilteredContent = useCallback((filter: string) => {
    console.log("[Library] filtering content for:", filter);
    
    switch (filter) {
      case "all":
        return [
          ...playlists.map(p => ({ ...p, type: "playlist" })),
          ...favorites.map(t => ({ ...t, type: "track" })),
          ...userAudiobooks.map(a => ({ ...a, type: "audiobook" })),
          ...userPodcasts.map(p => ({ ...p, type: "podcast" })),
          ...mixmindSets.map(s => ({ ...s, type: "mixmind" })),
        ];
      case "playlists":
        return playlists.map(p => ({ ...p, type: "playlist" }));
      case "songs":
        return favorites.map(t => ({ ...t, type: "track" }));
      case "podcasts":
        return userPodcasts.map(p => ({ ...p, type: "podcast" }));
      case "audiobooks":
        return userAudiobooks.map(a => ({ ...a, type: "audiobook" }));
      case "mixmind":
        return mixmindSets.map(s => ({ ...s, type: "mixmind" }));
      default:
        return [];
    }
  }, [playlists, favorites, userAudiobooks, userPodcasts, mixmindSets]);

  return {
    playlists,
    favorites,
    downloads,
    recentlyPlayed,
    audiobooks: userAudiobooks,
    podcasts: userPodcasts,
    mixmindSets,
    createPlaylist,
    addToPlaylist,
    toggleFavorite,
    isFavorite,
    addToDownloads,
    removeFromDownloads,
    addToRecentlyPlayed,
    addAudiobook,
    removeAudiobook,
    addPodcast,
    removePodcast,
    addMixMindSet,
    removeMixMindSet,
    clearUserLibrary,
    getFilteredContent,
  };
});