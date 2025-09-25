import { useState, useCallback, useEffect, useMemo } from "react";
import createContextHook from "@nkzw/create-context-hook";
import type { Track } from "@/types";
import { usePlayer } from "@/contexts/PlayerContext";

export type DJInstinctMode = "automix" | "livePrompt" | "party";
export type TransitionStyle = "fade" | "echo" | "cut" | "drop";

interface MixHistoryItem {
  id: string;
  track: Track;
  timestamp: number;
  transition: TransitionStyle;
  energy: number;
}

interface PartyVote {
  id: string;
  label: string;
  count: number;
  trackId?: string;
}

interface DJInstinctState {
  active: boolean;
  mode: DJInstinctMode;
  energy: number;
  transition: TransitionStyle;
  prompt: string;
  nowPlaying: Track | null;
  queuePreview: Track[];
  party: {
    sessionId: string | null;
    votes: PartyVote[];
  };
  mixHistory: MixHistoryItem[];
  loading: boolean;
  
  // Actions
  setActive: (active: boolean) => void;
  setMode: (mode: DJInstinctMode) => void;
  setEnergy: (energy: number) => void;
  setTransition: (transition: TransitionStyle) => void;
  setPrompt: (prompt: string) => void;
  startAutoMix: () => Promise<void>;
  startLivePrompt: () => Promise<void>;
  startPartySession: () => Promise<void>;
  saveMix: () => Promise<void>;
  updateParams: () => Promise<void>;
}

export const [DJInstinctProvider, useDJInstinct] = createContextHook<DJInstinctState>(() => {
  const { currentTrack, queue } = usePlayer();
  const [active, setActive] = useState<boolean>(false);
  const [mode, setMode] = useState<DJInstinctMode>("automix");
  const [energy, setEnergy] = useState<number>(50);
  const [transition, setTransition] = useState<TransitionStyle>("fade");
  const [prompt, setPrompt] = useState<string>("");
  const [nowPlaying, setNowPlaying] = useState<Track | null>(null);
  const [queuePreview, setQueuePreview] = useState<Track[]>([]);
  const [party, setParty] = useState<{ sessionId: string | null; votes: PartyVote[] }>({
    sessionId: null,
    votes: []
  });
  const [mixHistory, setMixHistory] = useState<MixHistoryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (currentTrack && active) {
      setNowPlaying(currentTrack);
      setQueuePreview(queue.slice(0, 5));
    }
  }, [currentTrack, queue, active]);

  const loadMixHistory = useCallback(async () => {
    try {
      // In a real app, this would load from persistent storage
      console.log('[DJInstinct] Loading mix history');
    } catch (error) {
      console.error('[DJInstinct] Error loading mix history:', error);
    }
  }, []);

  const saveMixHistory = useCallback(async (history: MixHistoryItem[]) => {
    if (!history || !Array.isArray(history)) return;
    try {
      // In a real app, this would save to persistent storage
      console.log('[DJInstinct] Saving mix history with', history.length, 'items');
    } catch (error) {
      console.error('[DJInstinct] Error saving mix history:', error);
    }
  }, []);

  const addToMixHistory = useCallback((track: Track) => {
    const historyItem: MixHistoryItem = {
      id: `${Date.now()}_${track.id}`,
      track,
      timestamp: Date.now(),
      transition,
      energy
    };
    
    setMixHistory(prev => {
      const updated = [...prev, historyItem];
      saveMixHistory(updated);
      return updated;
    });
  }, [transition, energy, saveMixHistory]);

  const startAutoMix = useCallback(async () => {
    console.log('[DJInstinct] Starting AutoMix with energy:', energy, 'transition:', transition);
    setLoading(true);
    
    try {
      // Simulate AI processing
      await new Promise(resolve => {
        if (typeof resolve === 'function') {
          setTimeout(resolve, 1500);
        }
      });
      
      if (currentTrack) {
        addToMixHistory(currentTrack);
      }
      
      // Generate queue based on current track and energy level
      const enhancedQueue = queue.map(track => ({
        ...track,
        djInstinctEnhanced: true,
        energyLevel: energy
      }));
      
      setQueuePreview(enhancedQueue.slice(0, 5));
      console.log('[DJInstinct] AutoMix started successfully');
    } catch (error) {
      console.error('[DJInstinct] AutoMix error:', error);
    } finally {
      setLoading(false);
    }
  }, [energy, transition, currentTrack, queue, addToMixHistory]);

  const startLivePrompt = useCallback(async () => {
    console.log('[DJInstinct] Starting Live Prompt with prompt:', prompt);
    setLoading(true);
    
    try {
      // Simulate AI processing of prompt
      await new Promise(resolve => {
        if (typeof resolve === 'function') {
          setTimeout(resolve, 2000);
        }
      });
      
      if (currentTrack) {
        addToMixHistory(currentTrack);
      }
      
      // Generate tracks based on prompt
      const promptLower = prompt.toLowerCase().trim();
      const promptBasedQueue = promptLower ? queue.filter(track => {
        return track.title.toLowerCase().includes(promptLower) ||
               track.artist.toLowerCase().includes(promptLower) ||
               track.album?.toLowerCase().includes(promptLower);
      }).slice(0, 5) : queue.slice(0, 5);
      
      setQueuePreview(promptBasedQueue);
      console.log('[DJInstinct] Live Prompt started successfully');
    } catch (error) {
      console.error('[DJInstinct] Live Prompt error:', error);
    } finally {
      setLoading(false);
    }
  }, [prompt, currentTrack, queue, addToMixHistory]);

  const startPartySession = useCallback(async () => {
    console.log('[DJInstinct] Starting Party Session');
    setLoading(true);
    
    try {
      // Generate session ID
      const sessionId = `party_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Initialize with some sample votes
      const initialVotes: PartyVote[] = [
        { id: '1', label: 'More Energy! 🔥', count: 0 },
        { id: '2', label: 'Chill Vibes 😌', count: 0 },
        { id: '3', label: 'Hip Hop 🎤', count: 0 },
        { id: '4', label: 'Electronic 🎧', count: 0 }
      ];
      
      setParty({ sessionId, votes: initialVotes });
      console.log('[DJInstinct] Party Session started:', sessionId);
    } catch (error) {
      console.error('[DJInstinct] Party Session error:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateParams = useCallback(async () => {
    console.log('[DJInstinct] Updating params - energy:', energy, 'transition:', transition);
    // In a real app, this would send params to the backend
  }, [energy, transition]);

  const saveMix = useCallback(async () => {
    console.log('[DJInstinct] Saving mix with', mixHistory.length, 'tracks');
    try {
      await saveMixHistory(mixHistory);
      console.log('[DJInstinct] Mix saved successfully');
    } catch (error) {
      console.error('[DJInstinct] Save mix error:', error);
    }
  }, [mixHistory, saveMixHistory]);

  useEffect(() => {
    loadMixHistory();
  }, [loadMixHistory]);

  return {
    active,
    mode,
    energy,
    transition,
    prompt,
    nowPlaying,
    queuePreview,
    party,
    mixHistory,
    loading,
    setActive,
    setMode,
    setEnergy,
    setTransition,
    setPrompt,
    startAutoMix,
    startLivePrompt,
    startPartySession,
    saveMix,
    updateParams
  };
});