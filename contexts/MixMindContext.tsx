import { useState, useEffect, useCallback, useMemo } from 'react';
import createContextHook from '@nkzw/create-context-hook';

export interface MixMindSettings {
  duration: number;
  energy: number;
  diversity: number;
  explicitContent: boolean;
  includeNewReleases: boolean;
  includeClassics: boolean;
  preferredGenres: string[];
  excludedGenres: string[];
  favoriteArtists: string[];
  voicePrompts: boolean;
  smartTransitions: boolean;
  adaptiveEQ: boolean;
}

export interface GeneratedTrack {
  id: string;
  title: string;
  artist: string;
  artwork: string;
  duration?: number;
  genre?: string;
  energy?: number;
  bpm?: number;
  key?: string;
}

export interface GeneratedSet {
  id: string;
  title: string;
  description: string;
  tracks: GeneratedTrack[];
  createdAt: Date;
  prompt: string;
  settings: Partial<MixMindSettings>;
  totalDuration: number;
  averageEnergy: number;
}

export interface MixMindHistory {
  sets: GeneratedSet[];
  favoritePrompts: string[];
  totalSetsGenerated: number;
  totalListeningTime: number;
}

const defaultSettings: MixMindSettings = {
  duration: 30,
  energy: 0.5,
  diversity: 0.7,
  explicitContent: true,
  includeNewReleases: true,
  includeClassics: false,
  preferredGenres: [],
  excludedGenres: [],
  favoriteArtists: [],
  voicePrompts: false,
  smartTransitions: true,
  adaptiveEQ: false,
};

export const [MixMindProvider, useMixMind] = createContextHook(() => {
  // Mock storage functions for now - will be replaced with proper storage provider
  const mockStorage = useMemo(() => ({
    getItem: async (key: string) => {
      // Mock implementation - replace with actual storage
      return null;
    },
    setItem: async (key: string, value: string) => {
      // Mock implementation - replace with actual storage
      console.log(`[MixMind] Would store ${key}:`, value);
    },
  }), []);

  const [settings, setSettings] = useState<MixMindSettings>(defaultSettings);
  const [history, setHistory] = useState<MixMindHistory>({
    sets: [],
    favoritePrompts: [],
    totalSetsGenerated: 0,
    totalListeningTime: 0,
  });
  const [currentSet, setCurrentSet] = useState<GeneratedSet | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [recentPrompts, setRecentPrompts] = useState<string[]>([]);

  // Load settings and history from storage
  useEffect(() => {
    const loadData = async () => {
      try {
        const [storedSettings, storedHistory, storedPrompts] = await Promise.all([
          mockStorage.getItem('mixmind_settings'),
          mockStorage.getItem('mixmind_history'),
          mockStorage.getItem('mixmind_recent_prompts'),
        ]);

        if (storedSettings) {
          setSettings({ ...defaultSettings, ...JSON.parse(storedSettings) });
        }
        if (storedHistory) {
          setHistory(JSON.parse(storedHistory));
        }
        if (storedPrompts) {
          setRecentPrompts(JSON.parse(storedPrompts));
        }
      } catch (error) {
        console.error('[MixMind] Error loading data:', error);
      }
    };
    loadData();
  }, [mockStorage]);

  const saveSettings = useCallback(async (newSettings: Partial<MixMindSettings>) => {
    try {
      const updatedSettings = { ...settings, ...newSettings };
      setSettings(updatedSettings);
      await mockStorage.setItem('mixmind_settings', JSON.stringify(updatedSettings));
    } catch (error) {
      console.error('[MixMind] Error saving settings:', error);
    }
  }, [settings, mockStorage]);

  const addToHistory = useCallback(async (set: GeneratedSet) => {
    try {
      const updatedHistory = {
        ...history,
        sets: [set, ...history.sets].slice(0, 50), // Keep last 50 sets
        totalSetsGenerated: history.totalSetsGenerated + 1,
      };
      setHistory(updatedHistory);
      await mockStorage.setItem('mixmind_history', JSON.stringify(updatedHistory));
    } catch (error) {
      console.error('[MixMind] Error saving to history:', error);
    }
  }, [history, mockStorage]);

  const addRecentPrompt = useCallback(async (prompt: string) => {
    try {
      const trimmedPrompt = prompt.trim();
      if (!trimmedPrompt || trimmedPrompt.length > 200 || recentPrompts.includes(trimmedPrompt)) return;
      
      const updatedPrompts = [trimmedPrompt, ...recentPrompts].slice(0, 10);
      setRecentPrompts(updatedPrompts);
      await mockStorage.setItem('mixmind_recent_prompts', JSON.stringify(updatedPrompts));
    } catch (error) {
      console.error('[MixMind] Error saving recent prompt:', error);
    }
  }, [recentPrompts, mockStorage]);

  const addFavoritePrompt = useCallback(async (prompt: string) => {
    try {
      const trimmedPrompt = prompt.trim();
      if (!trimmedPrompt || trimmedPrompt.length > 200 || history.favoritePrompts.includes(trimmedPrompt)) return;
      
      const updatedHistory = {
        ...history,
        favoritePrompts: [...history.favoritePrompts, trimmedPrompt],
      };
      setHistory(updatedHistory);
      await mockStorage.setItem('mixmind_history', JSON.stringify(updatedHistory));
    } catch (error) {
      console.error('[MixMind] Error saving favorite prompt:', error);
    }
  }, [history, mockStorage]);

  const removeFavoritePrompt = useCallback(async (prompt: string) => {
    try {
      const updatedHistory = {
        ...history,
        favoritePrompts: history.favoritePrompts.filter(p => p !== prompt),
      };
      setHistory(updatedHistory);
      await mockStorage.setItem('mixmind_history', JSON.stringify(updatedHistory));
    } catch (error) {
      console.error('[MixMind] Error removing favorite prompt:', error);
    }
  }, [history, mockStorage]);

  const clearHistory = useCallback(async () => {
    try {
      const clearedHistory = {
        sets: [],
        favoritePrompts: [],
        totalSetsGenerated: 0,
        totalListeningTime: 0,
      };
      setHistory(clearedHistory);
      await mockStorage.setItem('mixmind_history', JSON.stringify(clearedHistory));
    } catch (error) {
      console.error('[MixMind] Error clearing history:', error);
    }
  }, [mockStorage]);

  const generateSet = useCallback(async (prompt: string, customSettings?: Partial<MixMindSettings>): Promise<GeneratedSet | null> => {
    // Input validation
    const sanitizedPrompt = prompt.trim();
    if (!sanitizedPrompt || sanitizedPrompt.length > 500) {
      console.error('[MixMind] Invalid prompt');
      return null;
    }
    
    setIsGenerating(true);
    try {
      const finalSettings = { ...settings, ...customSettings };
      
      // Add to recent prompts
      await addRecentPrompt(sanitizedPrompt);
      
      // Build AI prompt with settings
      const aiPrompt = buildAIPrompt(sanitizedPrompt, finalSettings);
      
      const response = await fetch('https://toolkit.rork.com/text/llm/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            {
              role: 'system',
              content: 'You are MixMind, an expert AI DJ and music curator. Create detailed JSON playlists with smooth transitions, BPM matching, and harmonic mixing. Include track metadata like BPM, key, energy level (0-1), and genre.',
            },
            {
              role: 'user',
              content: aiPrompt,
            },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      const parsedSet = parseAIResponse(data.completion, sanitizedPrompt, finalSettings);
      
      if (parsedSet) {
        setCurrentSet(parsedSet);
        await addToHistory(parsedSet);
        return parsedSet;
      }
      
      return null;
    } catch (error) {
      console.error('[MixMind] Generation error:', error);
      return null;
    } finally {
      setIsGenerating(false);
    }
  }, [settings, addRecentPrompt, addToHistory]);

  return useMemo(() => ({
    settings,
    history,
    currentSet,
    isGenerating,
    recentPrompts,
    saveSettings,
    addToHistory,
    addRecentPrompt,
    addFavoritePrompt,
    removeFavoritePrompt,
    clearHistory,
    generateSet,
    setCurrentSet,
  }), [
    settings,
    history,
    currentSet,
    isGenerating,
    recentPrompts,
    saveSettings,
    addToHistory,
    addRecentPrompt,
    addFavoritePrompt,
    removeFavoritePrompt,
    clearHistory,
    generateSet,
  ]);
});

function buildAIPrompt(userPrompt: string, settings: MixMindSettings): string {
  const parts = [
    `Create a ${settings.duration}-minute DJ set: ${userPrompt}`,
    `Energy level: ${settings.energy < 0.3 ? 'Low/Chill' : settings.energy < 0.7 ? 'Medium' : 'High/Intense'}`,
    `Diversity: ${settings.diversity < 0.3 ? 'Similar tracks' : settings.diversity < 0.7 ? 'Balanced variety' : 'Highly diverse'}`,
  ];

  if (!settings.explicitContent) {
    parts.push('No explicit content');
  }

  if (settings.includeNewReleases) {
    parts.push('Include recent releases (2023-2024)');
  }

  if (settings.includeClassics) {
    parts.push('Include classic tracks');
  }

  if (settings.preferredGenres.length > 0) {
    parts.push(`Preferred genres: ${settings.preferredGenres.join(', ')}`);
  }

  if (settings.excludedGenres.length > 0) {
    parts.push(`Avoid genres: ${settings.excludedGenres.join(', ')}`);
  }

  if (settings.smartTransitions) {
    parts.push('Focus on harmonic mixing and smooth BPM transitions');
  }

  parts.push('Return JSON: {title, description, tracks: [{title, artist, artwork, duration, genre, energy, bpm, key}]}');
  parts.push('Use placeholder artwork from picsum.photos with different random IDs');

  return parts.join('. ');
}

function parseAIResponse(completion: string, originalPrompt: string, settings: MixMindSettings): GeneratedSet | null {
  try {
    const jsonStart = completion.indexOf('{');
    const jsonEnd = completion.lastIndexOf('}');
    if (jsonStart === -1 || jsonEnd === -1) return null;
    
    const jsonStr = completion.slice(jsonStart, jsonEnd + 1);
    const parsed = JSON.parse(jsonStr);
    
    const tracks: GeneratedTrack[] = (parsed.tracks || []).map((track: any, index: number) => ({
      id: track.id || `mixmind-${Date.now()}-${index}`,
      title: track.title || `Track ${index + 1}`,
      artist: track.artist || 'Unknown Artist',
      artwork: track.artwork || `https://picsum.photos/400/400?random=${Date.now() + index}`,
      duration: track.duration || 180,
      genre: track.genre || 'Unknown',
      energy: track.energy || Math.random(),
      bpm: track.bpm || 120,
      key: track.key || 'C',
    }));

    const totalDuration = tracks.reduce((sum, track) => sum + (track.duration || 180), 0);
    const averageEnergy = tracks.reduce((sum, track) => sum + (track.energy || 0.5), 0) / tracks.length;

    return {
      id: `set-${Date.now()}`,
      title: parsed.title || 'MixMind Set',
      description: parsed.description || originalPrompt,
      tracks,
      createdAt: new Date(),
      prompt: originalPrompt,
      settings,
      totalDuration,
      averageEnergy,
    };
  } catch (error) {
    console.error('[MixMind] Parse error:', error);
    return null;
  }
}