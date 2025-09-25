import { useState, useEffect, useCallback, useMemo } from 'react';
import { Platform } from 'react-native';
// import { AudioRecorder } from 'expo-audio'; // Disabled for now
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
  // New advanced features
  crossfadeTime: number;
  keyMatching: boolean;
  moodProgression: 'linear' | 'wave' | 'peak' | 'valley';
  collaborativeMode: boolean;
  realTimeAnalysis: boolean;
  autoSave: boolean;
  socialSharing: boolean;
  liveMode: boolean;
  beatMatching: boolean;
  harmonicMixing: boolean;
  tempoRange: { min: number; max: number };
  energyProgression: 'steady' | 'build' | 'drop' | 'wave';
  genreBlending: number; // 0-1 scale
  vintageMode: boolean;
  radioMode: boolean;
  partyMode: boolean;
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
  // Enhanced metadata
  camelotKey?: string;
  danceability?: number;
  valence?: number;
  acousticness?: number;
  instrumentalness?: number;
  liveness?: number;
  speechiness?: number;
  popularity?: number;
  releaseYear?: number;
  label?: string;
  isrc?: string;
  previewUrl?: string;
  spotifyId?: string;
  appleMusicId?: string;
  youtubeId?: string;
  soundcloudId?: string;
  tags?: string[];
  mood?: string;
  subgenre?: string;
  language?: string;
  explicit?: boolean;
  fadeInTime?: number;
  fadeOutTime?: number;
  cuePoint?: number;
  beatgridAnalyzed?: boolean;
  harmonicCompatibility?: string[];
  mixRating?: number;
  userRating?: number;
  playCount?: number;
  skipCount?: number;
  lastPlayed?: Date;
  addedAt?: Date;
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
  // Enhanced set metadata
  averageBPM: number;
  keyProgression: string[];
  genreDistribution: { [genre: string]: number };
  energyProgression: number[];
  moodJourney: string[];
  transitionQuality: number;
  harmonicFlow: number;
  danceabilityScore: number;
  cohesionScore: number;
  diversityScore: number;
  tags: string[];
  isPublic: boolean;
  likes: number;
  plays: number;
  shares: number;
  collaborators: string[];
  parentSetId?: string;
  version: number;
  exportFormats: string[];
  artwork?: string;
  color?: string;
  venue?: string;
  event?: string;
  weather?: string;
  timeOfDay?: string;
  audience?: string;
  equipment?: string;
  recordingUrl?: string;
  liveStreamUrl?: string;
  chatMessages?: ChatMessage[];
  analytics?: SetAnalytics;
  feedback?: SetFeedback[];
  remixes?: string[];
  influences?: string[];
  inspirations?: string[];
  notes?: string;
  rating?: number;
  difficulty?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  style?: string;
  subgenre?: string;
  region?: string;
  decade?: string;
  language?: string;
  instruments?: string[];
  vocals?: 'none' | 'minimal' | 'moderate' | 'heavy';
  tempo?: 'slow' | 'medium' | 'fast' | 'variable';
  structure?: 'intro-body-outro' | 'continuous' | 'segmented';
  mixType?: 'radio' | 'club' | 'festival' | 'intimate' | 'workout' | 'study';
}

export interface ChatMessage {
  id: string;
  userId: string;
  username: string;
  message: string;
  timestamp: Date;
  type: 'text' | 'emoji' | 'track_request' | 'system';
}

export interface SetAnalytics {
  totalPlays: number;
  uniqueListeners: number;
  averageListenTime: number;
  skipRate: number;
  completionRate: number;
  peakListeners: number;
  geographicData: { [country: string]: number };
  deviceData: { [device: string]: number };
  timeOfDayData: { [hour: string]: number };
  trackPopularity: { [trackId: string]: number };
  userEngagement: number;
  socialShares: number;
  downloads: number;
  bookmarks: number;
}

export interface SetFeedback {
  id: string;
  userId: string;
  username: string;
  rating: number;
  comment?: string;
  timestamp: Date;
  helpful: number;
  trackSpecific?: { [trackId: string]: number };
}

export interface VoiceSession {
  id: string;
  transcript: string;
  confidence: number;
  language: string;
  timestamp: Date;
  processed: boolean;
  resultingPrompt?: string;
}

export interface CollaborationSession {
  id: string;
  hostId: string;
  participants: string[];
  currentSet?: GeneratedSet;
  isLive: boolean;
  startTime: Date;
  endTime?: Date;
  chatMessages: ChatMessage[];
  trackQueue: GeneratedTrack[];
  votingEnabled: boolean;
  currentVotes: { [trackId: string]: number };
}

export interface MixMindHistory {
  sets: GeneratedSet[];
  favoritePrompts: string[];
  totalSetsGenerated: number;
  totalListeningTime: number;
  // Enhanced history features
  voiceSessions: VoiceSession[];
  collaborationSessions: CollaborationSession[];
  sharedSets: string[];
  likedSets: string[];
  followedDJs: string[];
  achievements: Achievement[];
  streaks: { [type: string]: number };
  preferences: UserPreferences;
  statistics: UserStatistics;
  socialActivity: SocialActivity[];
  exportHistory: ExportRecord[];
  feedbackGiven: SetFeedback[];
  reportedIssues: IssueReport[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: Date;
  category: 'creation' | 'listening' | 'social' | 'technical';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  progress?: number;
  maxProgress?: number;
}

export interface UserPreferences {
  favoriteGenres: string[];
  favoriteArtists: string[];
  favoriteDecades: string[];
  favoriteRegions: string[];
  preferredLanguages: string[];
  avoidedGenres: string[];
  avoidedArtists: string[];
  energyPreference: number;
  diversityPreference: number;
  tempoPreference: { min: number; max: number };
  moodPreferences: string[];
  timeOfDayPreferences: { [time: string]: string[] };
  activityPreferences: { [activity: string]: string[] };
  socialPreferences: {
    allowCollaboration: boolean;
    allowPublicSets: boolean;
    allowComments: boolean;
    allowSharing: boolean;
  };
}

export interface UserStatistics {
  totalSetsCreated: number;
  totalListeningHours: number;
  favoriteGenre: string;
  averageSetLength: number;
  mostActiveTimeOfDay: string;
  longestStreak: number;
  currentStreak: number;
  totalShares: number;
  totalLikes: number;
  totalCollaborations: number;
  averageSetRating: number;
  topArtists: { [artist: string]: number };
  topGenres: { [genre: string]: number };
  monthlyStats: { [month: string]: any };
  yearlyStats: { [year: string]: any };
}

export interface SocialActivity {
  id: string;
  type: 'like' | 'share' | 'comment' | 'follow' | 'collaborate';
  targetId: string;
  targetType: 'set' | 'user' | 'comment';
  timestamp: Date;
  metadata?: any;
}

export interface ExportRecord {
  id: string;
  setId: string;
  format: 'mp3' | 'wav' | 'flac' | 'playlist' | 'json';
  quality: 'low' | 'medium' | 'high' | 'lossless';
  timestamp: Date;
  fileSize: number;
  downloadUrl?: string;
  expiresAt?: Date;
}

export interface IssueReport {
  id: string;
  type: 'bug' | 'feature_request' | 'content_issue' | 'performance';
  title: string;
  description: string;
  timestamp: Date;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  attachments?: string[];
  userAgent?: string;
  deviceInfo?: any;
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
  voicePrompts: true,
  smartTransitions: true,
  adaptiveEQ: false,
  // New advanced features defaults
  crossfadeTime: 8,
  keyMatching: true,
  moodProgression: 'linear',
  collaborativeMode: false,
  realTimeAnalysis: true,
  autoSave: true,
  socialSharing: false,
  liveMode: false,
  beatMatching: true,
  harmonicMixing: true,
  tempoRange: { min: 80, max: 140 },
  energyProgression: 'build',
  genreBlending: 0.3,
  vintageMode: false,
  radioMode: false,
  partyMode: false,
};

const defaultHistory: MixMindHistory = {
  sets: [],
  favoritePrompts: [],
  totalSetsGenerated: 0,
  totalListeningTime: 0,
  voiceSessions: [],
  collaborationSessions: [],
  sharedSets: [],
  likedSets: [],
  followedDJs: [],
  achievements: [],
  streaks: {},
  preferences: {
    favoriteGenres: [],
    favoriteArtists: [],
    favoriteDecades: [],
    favoriteRegions: [],
    preferredLanguages: ['en'],
    avoidedGenres: [],
    avoidedArtists: [],
    energyPreference: 0.5,
    diversityPreference: 0.7,
    tempoPreference: { min: 80, max: 140 },
    moodPreferences: [],
    timeOfDayPreferences: {},
    activityPreferences: {},
    socialPreferences: {
      allowCollaboration: true,
      allowPublicSets: false,
      allowComments: true,
      allowSharing: true,
    },
  },
  statistics: {
    totalSetsCreated: 0,
    totalListeningHours: 0,
    favoriteGenre: '',
    averageSetLength: 30,
    mostActiveTimeOfDay: '',
    longestStreak: 0,
    currentStreak: 0,
    totalShares: 0,
    totalLikes: 0,
    totalCollaborations: 0,
    averageSetRating: 0,
    topArtists: {},
    topGenres: {},
    monthlyStats: {},
    yearlyStats: {},
  },
  socialActivity: [],
  exportHistory: [],
  feedbackGiven: [],
  reportedIssues: [],
};

export const [MixMindProvider, useMixMind] = createContextHook(() => {
  // Always call hooks in the same order - no conditional hooks
  const [settings, setSettings] = useState<MixMindSettings>(defaultSettings);
  const [history, setHistory] = useState<MixMindHistory>(defaultHistory);
  const [currentSet, setCurrentSet] = useState<GeneratedSet | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [recentPrompts, setRecentPrompts] = useState<string[]>([]);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recording, setRecording] = useState<any | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);

  // Mock storage functions - stable reference to prevent dependency issues
  const mockStorage = useMemo(() => ({
    getItem: async (key: string) => {
      if (!key?.trim() || key.length > 100) return null;
      return null;
    },
    setItem: async (key: string, value: string) => {
      if (!key?.trim() || key.length > 100) return;
      if (!value?.trim() || value.length > 10000) return;
      console.log(`[MixMind] Would store ${key}:`, value.slice(0, 100));
    },
  }), []);

  // Voice Input Feature - Fixed to prevent hook order issues
  const startVoiceInput = useCallback(async (): Promise<boolean> => {
    try {
      if (!settings?.voicePrompts) {
        console.log('[MixMind] Voice prompts disabled in settings');
        return false;
      }
      
      setIsRecording(true);
      console.log('[MixMind] Starting voice recording...');
      
      if (Platform.OS === 'web') {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          const recorder = new MediaRecorder(stream);
          const chunks: Blob[] = [];
          
          recorder.ondataavailable = (event) => {
            if (event.data && event.data.size > 0) {
              chunks.push(event.data);
            }
          };
          
          recorder.start();
          setMediaRecorder(recorder);
          setAudioChunks(chunks);
          return true;
        } catch (webError) {
          console.error('[MixMind] Web audio error:', webError);
          setIsRecording(false);
          return false;
        }
      } else {
        console.log('[MixMind] Mobile voice recording not yet implemented');
        setIsRecording(false);
        return false;
      }
    } catch (error) {
      console.error('[MixMind] Voice input error:', error);
      setIsRecording(false);
      return false;
    }
  }, [settings?.voicePrompts]);

  const stopVoiceInput = useCallback(async (): Promise<string | null> => {
    try {
      setIsRecording(false);
      
      if (Platform.OS === 'web' && mediaRecorder && mediaRecorder.state === 'recording') {
        return new Promise((resolve) => {
          if (!mediaRecorder) {
            resolve(null);
            return;
          }
          
          mediaRecorder.onstop = async () => {
            try {
              const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
              const formData = new FormData();
              formData.append('audio', audioBlob, 'recording.wav');
              
              const response = await fetch('https://toolkit.rork.com/stt/transcribe/', {
                method: 'POST',
                body: formData,
              });
              
              if (response.ok) {
                const data = await response.json();
                console.log('[MixMind] Transcription:', data.text);
                resolve(data.text || null);
              } else {
                console.error('[MixMind] Transcription failed:', response.status);
                resolve(null);
              }
              
              // Clean up
              if (mediaRecorder?.stream) {
                mediaRecorder.stream.getTracks().forEach(track => track.stop());
              }
              setMediaRecorder(null);
              setAudioChunks([]);
            } catch (error) {
              console.error('[MixMind] Web transcription error:', error);
              resolve(null);
            }
          };
          
          mediaRecorder.stop();
        });
      } else if (Platform.OS !== 'web' && recording) {
        console.log('[MixMind] Mobile voice recording stop not yet implemented');
        setRecording(null);
        return null;
      }
      
      return null;
    } catch (error) {
      console.error('[MixMind] Voice processing error:', error);
      setIsRecording(false);
      setRecording(null);
      setMediaRecorder(null);
      return null;
    }
  }, [mediaRecorder, audioChunks, recording]);

  // Simplified analysis feature
  const analyzeCurrentSet = useCallback(async (set: GeneratedSet) => {
    console.log('[MixMind] Analyzing set:', set.title);
    // In a real implementation, this would analyze the set
  }, []);

  // Simplified collaboration features
  const startCollaboration = useCallback(async (hostId: string): Promise<string | null> => {
    console.log('[MixMind] Starting collaboration for host:', hostId);
    // In a real implementation, this would start a collaboration session
    return `collab-${Date.now()}`;
  }, []);

  const joinCollaboration = useCallback(async (sessionId: string, userId: string): Promise<boolean> => {
    console.log('[MixMind] Joining collaboration:', sessionId, userId);
    // In a real implementation, this would join a collaboration session
    return true;
  }, []);

  const sendChatMessage = useCallback(async (message: string, userId: string, username: string) => {
    const sanitizedMessage = message.trim();
    const sanitizedUserId = userId.trim();
    const sanitizedUsername = username.trim();
    
    if (!sanitizedMessage || sanitizedMessage.length > 500) return;
    if (!sanitizedUserId || sanitizedUserId.length > 50) return;
    if (!sanitizedUsername || sanitizedUsername.length > 50) return;
    
    console.log('[MixMind] Sending chat message:', sanitizedMessage, sanitizedUserId, sanitizedUsername);
    // In a real implementation, this would send a chat message
  }, []);

  // Simplified export feature
  const exportSet = useCallback(async (setId: string, format: 'mp3' | 'wav' | 'flac' | 'playlist' | 'json', quality: 'low' | 'medium' | 'high' | 'lossless' = 'medium'): Promise<string | null> => {
    const sanitizedSetId = setId.trim();
    const sanitizedFormat = format.trim();
    
    if (!sanitizedSetId || sanitizedSetId.length > 50) return null;
    if (!sanitizedFormat || sanitizedFormat.length > 20) return null;
    
    console.log('[MixMind] Exporting set:', sanitizedSetId, sanitizedFormat, quality);
    // In a real implementation, this would export the set
    return `https://example.com/exports/${sanitizedSetId}.${sanitizedFormat}`;
  }, []);

  // Simplified social features
  const shareSet = useCallback(async (setId: string, platform: string): Promise<boolean> => {
    const sanitizedSetId = setId.trim();
    const sanitizedPlatform = platform.trim();
    
    if (!sanitizedSetId || sanitizedSetId.length > 50) return false;
    if (!sanitizedPlatform || sanitizedPlatform.length > 30) return false;
    
    console.log('[MixMind] Sharing set:', sanitizedSetId, 'on', sanitizedPlatform);
    // In a real implementation, this would share the set
    return true;
  }, []);

  const likeSet = useCallback(async (setId: string): Promise<boolean> => {
    try {
      const isAlreadyLiked = history.likedSets.includes(setId);
      
      const updatedLikedSets = isAlreadyLiked 
        ? history.likedSets.filter(id => id !== setId)
        : [...history.likedSets, setId];
      
      const updatedHistory = {
        ...history,
        likedSets: updatedLikedSets,
      };
      setHistory(updatedHistory);
      
      return !isAlreadyLiked;
    } catch (error) {
      console.error('[MixMind] Like error:', error);
      return false;
    }
  }, [history]);

  // Simplified achievement system
  const checkAchievements = useCallback(async () => {
    console.log('[MixMind] Checking achievements...');
    // In a real implementation, this would check and unlock achievements
  }, []);



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
    void loadData();
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
      const clearedHistory: MixMindHistory = {
        sets: [],
        favoritePrompts: [],
        totalSetsGenerated: 0,
        totalListeningTime: 0,
        voiceSessions: [],
        collaborationSessions: [],
        sharedSets: [],
        likedSets: [],
        followedDJs: [],
        achievements: [],
        streaks: {},
        preferences: history.preferences, // Keep existing preferences
        statistics: {
          ...history.statistics,
          totalSetsCreated: 0,
          totalListeningHours: 0,
        },
        socialActivity: [],
        exportHistory: [],
        feedbackGiven: [],
        reportedIssues: [],
      };
      setHistory(clearedHistory);
      await mockStorage.setItem('mixmind_history', JSON.stringify(clearedHistory));
    } catch (error) {
      console.error('[MixMind] Error clearing history:', error);
    }
  }, [mockStorage, history.preferences, history.statistics]);

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

  // Return stable context value - avoid recreating on every render
  const contextValue = useMemo(() => ({
    // Core features
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
    
    // Voice features
    isRecording,
    startVoiceInput,
    stopVoiceInput,
    
    // Analysis features
    analyzeCurrentSet,
    
    // Collaboration features
    startCollaboration,
    joinCollaboration,
    sendChatMessage,
    
    // Social features
    shareSet,
    likeSet,
    
    // Export features
    exportSet,
    
    // Achievement system
    checkAchievements,
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
    isRecording,
    startVoiceInput,
    stopVoiceInput,
    analyzeCurrentSet,
    startCollaboration,
    joinCollaboration,
    sendChatMessage,
    shareSet,
    likeSet,
    exportSet,
    checkAchievements,
  ]);
  
  return contextValue;
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
    const averageBPM = tracks.reduce((sum, track) => sum + (track.bpm || 120), 0) / tracks.length;
    
    // Calculate enhanced metadata
    const keyProgression = tracks.map(track => track.key || 'C');
    const genreDistribution: { [genre: string]: number } = {};
    tracks.forEach(track => {
      const genre = track.genre || 'Unknown';
      genreDistribution[genre] = (genreDistribution[genre] || 0) + 1;
    });
    
    const energyProgression = tracks.map(track => track.energy || 0.5);
    const moodJourney = tracks.map(track => track.mood || 'neutral');
    
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
      averageBPM,
      keyProgression,
      genreDistribution,
      energyProgression,
      moodJourney,
      transitionQuality: 0.8,
      harmonicFlow: 0.7,
      danceabilityScore: averageEnergy,
      cohesionScore: 0.75,
      diversityScore: settings.diversity || 0.7,
      tags: [],
      isPublic: false,
      likes: 0,
      plays: 0,
      shares: 0,
      collaborators: [],
      version: 1,
      exportFormats: ['mp3', 'playlist'],
      difficulty: 'intermediate',
      mixType: 'radio',
    };
  } catch (error) {
    console.error('[MixMind] Parse error:', error);
    return null;
  }
}