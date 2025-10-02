import { useState, useCallback, useEffect } from "react";
import createContextHook from "@nkzw/create-context-hook";
import type { Track } from "@/types";
import { usePlayer } from "@/contexts/PlayerContext";
import { trpc } from "@/lib/trpc";
import type { LivePromptConfig as APILivePromptConfig, LiveParams as APILiveParams, SafetyUpdate as APISafetyUpdate, LiveStartResponse } from "@/types/live";

export type DJInstinctMode = "automix" | "livePrompt" | "party";
export type TransitionStyle = "fade" | "echo" | "cut" | "drop";
export type ExplicitFilter = "off" | "moderate" | "strict";
export type Mood = "chill" | "groove" | "hype" | "ecstatic";
export type CastStatus = "idle" | "pairing" | "casting" | "error";

interface LivePromptConfig {
  vibe: string;
  genres: string[];
  decades?: string[];
  regions?: string[];
  mood: Mood;
  energy: number;
  tempoRangeBPM: [number, number];
  transitionStyle: TransitionStyle;
  keyLock: boolean;
  doNotPlay: string[];
  explicitFilter: ExplicitFilter;
  durationMinutes: number;
}

interface LiveDJState {
  sessionId: string | null;
  promptConfig: LivePromptConfig;
  params: {
    energy: number;
    transitionStyle: TransitionStyle;
  };
  safeMode: boolean;
  castStatus: CastStatus;
  nowPlaying: Track | null;
  nextUp: Track[];
  mixHistory: MixHistoryItem[];
  loading: boolean;
}

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
  
  // Live DJ State
  liveDJ: LiveDJState;
  
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
  
  // Live DJ Actions
  setLiveDJPromptConfig: (config: Partial<LivePromptConfig>) => void;
  setLiveDJParams: (params: Partial<LiveDJState['params']>) => void;
  setLiveDJSafeMode: (safeMode: boolean) => void;
  startLiveDJ: () => Promise<void>;
  updateLiveDJParams: () => Promise<void>;
  startPairing: () => Promise<void>;
  emergencyFade: () => Promise<void>;
  saveLiveMix: () => Promise<void>;
  updateSafetySettings: () => Promise<void>;
}

export const [DJInstinctProvider, useDJInstinct] = createContextHook<DJInstinctState>(() => {
  const trpcClient = trpc.useUtils().client;
  const { currentTrack, queue, playTrack } = usePlayer();
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
  
  // Live DJ State
  const apiBase = '/api/dj-instinct';

  const [liveDJ, setLiveDJ] = useState<LiveDJState>({
    sessionId: null,
    promptConfig: {
      vibe: "",
      genres: [],
      decades: [],
      regions: [],
      mood: "groove",
      energy: 65,
      tempoRangeBPM: [96, 128],
      transitionStyle: "fade",
      keyLock: true,
      doNotPlay: [],
      explicitFilter: "moderate",
      durationMinutes: 120
    },
    params: {
      energy: 65,
      transitionStyle: "fade"
    },
    safeMode: true,
    castStatus: "idle",
    nowPlaying: null,
    nextUp: [],
    mixHistory: [],
    loading: false
  });

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
  
  // Live DJ Actions
  const setLiveDJPromptConfig = useCallback((config: Partial<LivePromptConfig>) => {
    setLiveDJ(prev => ({
      ...prev,
      promptConfig: { ...prev.promptConfig, ...config }
    }));
  }, []);
  
  const setLiveDJParams = useCallback((params: Partial<LiveDJState['params']>) => {
    setLiveDJ(prev => ({
      ...prev,
      params: { ...prev.params, ...params }
    }));
  }, []);
  
  const setLiveDJSafeMode = useCallback((safeMode: boolean) => {
    setLiveDJ(prev => ({ ...prev, safeMode }));
  }, []);
  
  const startLiveDJ = useCallback(async () => {
    console.log('[DJInstinct] Starting Live DJ with config:', liveDJ.promptConfig);
    setLiveDJ(prev => ({ ...prev, loading: true }));

    try {
      const payload: APILivePromptConfig = {
        vibe: liveDJ.promptConfig.vibe,
        genres: liveDJ.promptConfig.genres,
        decades: liveDJ.promptConfig.decades,
        regions: liveDJ.promptConfig.regions,
        mood: liveDJ.promptConfig.mood,
        energy: liveDJ.promptConfig.energy,
        tempoRangeBPM: liveDJ.promptConfig.tempoRangeBPM,
        transitionStyle: liveDJ.promptConfig.transitionStyle,
        keyLock: liveDJ.promptConfig.keyLock,
        doNotPlay: liveDJ.promptConfig.doNotPlay,
        explicitFilter: liveDJ.promptConfig.explicitFilter,
        durationMinutes: liveDJ.promptConfig.durationMinutes,
      };

      const res = await fetch(`${apiBase}/live/start`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`start failed: ${res.status}`);
      const data = (await res.json()) as LiveStartResponse;

      const nextUpTracks: Track[] = (data.nextUp ?? []).map((t) => ({
        id: t.id,
        title: t.title,
        artist: t.artist,
        artwork: t.artwork ?? 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800',
        duration: t.durationSec ?? 0,
        type: 'song',
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
      }));

      const nowTrack: Track | null = data.nowPlaying
        ? {
            id: data.nowPlaying.id,
            title: data.nowPlaying.title,
            artist: data.nowPlaying.artist,
            artwork: data.nowPlaying.artwork ?? 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800',
            duration: data.nowPlaying.durationSec ?? 0,
            type: 'song',
            audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
          }
        : currentTrack ?? null;

      setLiveDJ(prev => ({
        ...prev,
        sessionId: data.sessionId,
        nowPlaying: nowTrack,
        nextUp: nextUpTracks,
        castStatus: data.castStatus ?? prev.castStatus,
        loading: false,
      }));
      
      console.log('[DJInstinct] Live DJ started successfully with session:', data.sessionId);
      
      if (nowTrack && !currentTrack) {
        console.log('[DJInstinct] Auto-playing track:', nowTrack.title);
        playTrack(nowTrack);
      }
    } catch (error) {
      console.error('[DJInstinct] Live DJ start error:', error);
      setLiveDJ(prev => ({ ...prev, loading: false, castStatus: "error" }));
    }
  }, [liveDJ.promptConfig, apiBase, currentTrack, playTrack]);
  
  const updateLiveDJParams = useCallback(async () => {
    console.log('[DJInstinct] Updating Live DJ params:', liveDJ.params);
    try {
      const payload: APILiveParams = { ...liveDJ.params };
      const res = await fetch(`${apiBase}/live/params`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`params failed: ${res.status}`);
      console.log('[DJInstinct] Live DJ params updated successfully');
    } catch (error) {
      console.error('[DJInstinct] Live DJ params update error:', error);
    }
  }, [liveDJ.params, apiBase]);
  
  const startPairing = useCallback(async () => {
    console.log('[DJInstinct] Starting device pairing');
    setLiveDJ(prev => ({ ...prev, castStatus: "pairing" }));

    try {
      const res = await fetch(`${apiBase}/live/pair/start`, { method: 'POST' });
      if (!res.ok) throw new Error(`pair failed: ${res.status}`);
      const data = (await res.json()) as { sessionId: string };
      setLiveDJ(prev => ({ ...prev, sessionId: data.sessionId, castStatus: "casting" }));
      console.log('[DJInstinct] Pairing started with session:', data.sessionId);
    } catch (error) {
      console.error('[DJInstinct] Pairing error:', error);
      setLiveDJ(prev => ({ ...prev, castStatus: "error" }));
    }
  }, [apiBase]);
  
  const emergencyFade = useCallback(async () => {
    console.log('[DJInstinct] Emergency fade triggered');
    try {
      const res = await fetch(`${apiBase}/live/emergency/fade`, { method: 'POST' });
      if (!res.ok) throw new Error(`emergency failed: ${res.status}`);
      console.log('[DJInstinct] Emergency fade executed successfully');
    } catch (error) {
      console.error('[DJInstinct] Emergency fade error:', error);
    }
  }, [apiBase]);
  
  const saveLiveMix = useCallback(async () => {
    console.log('[DJInstinct] Saving live mix with', liveDJ.mixHistory.length, 'tracks');
    try {
      await saveMixHistory(liveDJ.mixHistory);
      console.log('[DJInstinct] Live mix saved successfully');
    } catch (error) {
      console.error('[DJInstinct] Save live mix error:', error);
    }
  }, [liveDJ.mixHistory, saveMixHistory]);
  
  // Add safety settings update function
  const updateSafetySettings = useCallback(async () => {
    try {
      const payload: APISafetyUpdate = {
        doNotPlay: liveDJ.promptConfig.doNotPlay,
        explicitFilter: liveDJ.promptConfig.explicitFilter,
        safeMode: liveDJ.safeMode,
      };
      const res = await fetch(`${apiBase}/live/safety`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`safety failed: ${res.status}`);
      console.log('[DJInstinct] Safety settings updated successfully');
    } catch (error) {
      console.error('[DJInstinct] Safety settings update error:', error);
    }
  }, [liveDJ.promptConfig.doNotPlay, liveDJ.promptConfig.explicitFilter, liveDJ.safeMode, apiBase]);

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
    liveDJ,
    setActive,
    setMode,
    setEnergy,
    setTransition,
    setPrompt,
    startAutoMix,
    startLivePrompt,
    startPartySession,
    saveMix,
    updateParams,
    setLiveDJPromptConfig,
    setLiveDJParams,
    setLiveDJSafeMode,
    startLiveDJ,
    updateLiveDJParams,
    startPairing,
    emergencyFade,
    saveLiveMix,
    updateSafetySettings
  };
});