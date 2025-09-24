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
  voicePrompts: false,
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

export const [MixMindProvider, useMixMind] = createContextHook(() => {
  // Mock storage functions for now - will be replaced with proper storage provider
  const mockStorage = useMemo(() => ({
    getItem: async (key: string) => {
      // Mock implementation - replace with actual storage
      if (!key.trim() || key.length > 100) return null;
      return null;
    },
    setItem: async (key: string, value: string) => {
      // Mock implementation - replace with actual storage
      if (!key.trim() || key.length > 100) return;
      if (!value.trim() || value.length > 10000) return;
      console.log(`[MixMind] Would store ${key}:`, value.slice(0, 100));
    },
  }), []);

  const [settings, setSettings] = useState<MixMindSettings>(defaultSettings);
  const [history, setHistory] = useState<MixMindHistory>({
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
  });
  const [currentSet, setCurrentSet] = useState<GeneratedSet | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [recentPrompts, setRecentPrompts] = useState<string[]>([]);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [voiceSession, setVoiceSession] = useState<VoiceSession | null>(null);
  const [collaborationSession, setCollaborationSession] = useState<CollaborationSession | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [liveListeners, setLiveListeners] = useState<number>(0);
  const [currentMood, setCurrentMood] = useState<string>('');
  const [energyFlow, setEnergyFlow] = useState<number[]>([]);
  const [recommendations, setRecommendations] = useState<GeneratedTrack[]>([]);
  const [isLive, setIsLive] = useState<boolean>(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [trackQueue, setTrackQueue] = useState<GeneratedTrack[]>([]);
  const [currentAnalysis, setCurrentAnalysis] = useState<any>(null);
  const [socialFeed, setSocialFeed] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);

  // Voice Input Feature
  const startVoiceInput = useCallback(async (): Promise<boolean> => {
    try {
      if (!settings.voicePrompts) {
        console.log('[MixMind] Voice prompts disabled in settings');
        return false;
      }
      
      setIsRecording(true);
      const sessionId = `voice-${Date.now()}`;
      
      // Mock voice recording - in real implementation, use expo-av
      console.log('[MixMind] Starting voice recording...');
      
      // Simulate recording session
      const mockSession: VoiceSession = {
        id: sessionId,
        transcript: '',
        confidence: 0,
        language: 'en',
        timestamp: new Date(),
        processed: false,
      };
      
      setVoiceSession(mockSession);
      return true;
    } catch (error) {
      console.error('[MixMind] Voice input error:', error);
      setIsRecording(false);
      return false;
    }
  }, [settings.voicePrompts]);

  const stopVoiceInput = useCallback(async (): Promise<string | null> => {
    try {
      if (!voiceSession) return null;
      
      setIsRecording(false);
      
      // Mock transcription - in real implementation, use speech-to-text API
      const mockTranscript = 'Create an energetic Afrobeats mix for my workout';
      const confidence = 0.95;
      
      const updatedSession: VoiceSession = {
        ...voiceSession,
        transcript: mockTranscript,
        confidence,
        processed: true,
        resultingPrompt: mockTranscript,
      };
      
      setVoiceSession(updatedSession);
      
      // Add to voice sessions history
      const updatedHistory = {
        ...history,
        voiceSessions: [updatedSession, ...history.voiceSessions].slice(0, 20),
      };
      setHistory(updatedHistory);
      
      return mockTranscript;
    } catch (error) {
      console.error('[MixMind] Voice processing error:', error);
      setIsRecording(false);
      return null;
    }
  }, [voiceSession, history]);

  // Real-time Analysis Feature
  const analyzeCurrentSet = useCallback(async (set: GeneratedSet) => {
    if (!settings.realTimeAnalysis) return;
    
    setIsAnalyzing(true);
    try {
      // Mock analysis - in real implementation, analyze audio features
      const analysis = {
        energyFlow: set.energyProgression,
        keyCompatibility: calculateKeyCompatibility(set.keyProgression),
        transitionPoints: findOptimalTransitions(set.tracks),
        moodProgression: analyzeMoodProgression(set.tracks),
        danceabilityScore: set.danceabilityScore,
        recommendations: await generateRecommendations(set),
      };
      
      setCurrentAnalysis(analysis);
      setEnergyFlow(analysis.energyFlow);
      setRecommendations(analysis.recommendations);
      
    } catch (error) {
      console.error('[MixMind] Analysis error:', error);
    } finally {
      setIsAnalyzing(false);
    }
  }, [settings.realTimeAnalysis]);

  // Collaboration Features
  const startCollaboration = useCallback(async (hostId: string): Promise<string | null> => {
    try {
      const sessionId = `collab-${Date.now()}`;
      const session: CollaborationSession = {
        id: sessionId,
        hostId,
        participants: [hostId],
        isLive: true,
        startTime: new Date(),
        chatMessages: [],
        trackQueue: [],
        votingEnabled: true,
        currentVotes: {},
      };
      
      setCollaborationSession(session);
      setIsLive(true);
      
      return sessionId;
    } catch (error) {
      console.error('[MixMind] Collaboration start error:', error);
      return null;
    }
  }, []);

  const joinCollaboration = useCallback(async (sessionId: string, userId: string): Promise<boolean> => {
    try {
      if (!collaborationSession || collaborationSession.id !== sessionId) {
        console.error('[MixMind] Collaboration session not found');
        return false;
      }
      
      const updatedSession = {
        ...collaborationSession,
        participants: [...collaborationSession.participants, userId],
      };
      
      setCollaborationSession(updatedSession);
      setLiveListeners(updatedSession.participants.length);
      
      return true;
    } catch (error) {
      console.error('[MixMind] Join collaboration error:', error);
      return false;
    }
  }, [collaborationSession]);

  const sendChatMessage = useCallback(async (message: string, userId: string, username: string) => {
    if (!collaborationSession) return;
    
    const chatMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      userId,
      username,
      message: message.trim(),
      timestamp: new Date(),
      type: 'text',
    };
    
    const updatedMessages = [...chatMessages, chatMessage];
    setChatMessages(updatedMessages);
    
    const updatedSession = {
      ...collaborationSession,
      chatMessages: updatedMessages,
    };
    setCollaborationSession(updatedSession);
  }, [collaborationSession, chatMessages]);

  // Export Features
  const exportSet = useCallback(async (setId: string, format: 'mp3' | 'wav' | 'flac' | 'playlist' | 'json', quality: 'low' | 'medium' | 'high' | 'lossless' = 'medium'): Promise<string | null> => {
    try {
      const set = history.sets.find(s => s.id === setId);
      if (!set) return null;
      
      // Mock export - in real implementation, generate actual files
      const exportRecord: ExportRecord = {
        id: `export-${Date.now()}`,
        setId,
        format,
        quality,
        timestamp: new Date(),
        fileSize: Math.floor(Math.random() * 100000000), // Mock file size
        downloadUrl: `https://example.com/exports/${setId}.${format}`,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      };
      
      const updatedHistory = {
        ...history,
        exportHistory: [exportRecord, ...history.exportHistory],
      };
      setHistory(updatedHistory);
      
      return exportRecord.downloadUrl || null;
    } catch (error) {
      console.error('[MixMind] Export error:', error);
      return null;
    }
  }, [history]);

  // Social Features
  const shareSet = useCallback(async (setId: string, platform: string): Promise<boolean> => {
    try {
      if (!settings.socialSharing) return false;
      
      const set = history.sets.find(s => s.id === setId);
      if (!set) return false;
      
      // Mock sharing - in real implementation, integrate with social platforms
      const activity: SocialActivity = {
        id: `share-${Date.now()}`,
        type: 'share',
        targetId: setId,
        targetType: 'set',
        timestamp: new Date(),
        metadata: { platform },
      };
      
      const updatedHistory = {
        ...history,
        socialActivity: [activity, ...history.socialActivity],
        statistics: {
          ...history.statistics,
          totalShares: history.statistics.totalShares + 1,
        },
      };
      setHistory(updatedHistory);
      
      return true;
    } catch (error) {
      console.error('[MixMind] Share error:', error);
      return false;
    }
  }, [settings.socialSharing, history]);

  const likeSet = useCallback(async (setId: string): Promise<boolean> => {
    try {
      const isAlreadyLiked = history.likedSets.includes(setId);
      
      const updatedLikedSets = isAlreadyLiked 
        ? history.likedSets.filter(id => id !== setId)
        : [...history.likedSets, setId];
      
      const activity: SocialActivity = {
        id: `like-${Date.now()}`,
        type: 'like',
        targetId: setId,
        targetType: 'set',
        timestamp: new Date(),
      };
      
      const updatedHistory = {
        ...history,
        likedSets: updatedLikedSets,
        socialActivity: isAlreadyLiked ? history.socialActivity : [activity, ...history.socialActivity],
        statistics: {
          ...history.statistics,
          totalLikes: isAlreadyLiked ? history.statistics.totalLikes - 1 : history.statistics.totalLikes + 1,
        },
      };
      setHistory(updatedHistory);
      
      return !isAlreadyLiked;
    } catch (error) {
      console.error('[MixMind] Like error:', error);
      return false;
    }
  }, [history]);

  // Achievement System
  const checkAchievements = useCallback(async () => {
    const newAchievements: Achievement[] = [];
    
    // Check for various achievements
    if (history.totalSetsGenerated >= 10 && !history.achievements.find(a => a.id === 'first_ten')) {
      newAchievements.push({
        id: 'first_ten',
        title: 'Mix Master',
        description: 'Created your first 10 sets',
        icon: '🎵',
        unlockedAt: new Date(),
        category: 'creation',
        rarity: 'common',
      });
    }
    
    if (history.statistics.totalListeningHours >= 100 && !history.achievements.find(a => a.id === 'century_listener')) {
      newAchievements.push({
        id: 'century_listener',
        title: 'Century Listener',
        description: 'Listened to 100+ hours of music',
        icon: '🎧',
        unlockedAt: new Date(),
        category: 'listening',
        rarity: 'rare',
      });
    }
    
    if (newAchievements.length > 0) {
      const updatedHistory = {
        ...history,
        achievements: [...history.achievements, ...newAchievements],
      };
      setHistory(updatedHistory);
    }
  }, [history]);

  // Helper functions
  const calculateKeyCompatibility = (keys: string[]): number => {
    // Mock implementation - calculate harmonic compatibility
    return Math.random() * 0.3 + 0.7; // 0.7-1.0 range
  };

  const findOptimalTransitions = (tracks: GeneratedTrack[]): number[] => {
    // Mock implementation - find best transition points
    return tracks.map(() => Math.random() * 30 + 15); // 15-45 second range
  };

  const analyzeMoodProgression = (tracks: GeneratedTrack[]): string[] => {
    // Mock implementation - analyze mood changes
    const moods = ['energetic', 'chill', 'uplifting', 'intense', 'mellow'];
    return tracks.map(() => moods[Math.floor(Math.random() * moods.length)]);
  };

  const generateRecommendations = async (set: GeneratedSet): Promise<GeneratedTrack[]> => {
    // Mock implementation - generate track recommendations
    return [
      {
        id: `rec-${Date.now()}-1`,
        title: 'Recommended Track 1',
        artist: 'AI Recommendation',
        artwork: `https://picsum.photos/400/400?random=${Date.now()}`,
        duration: 180,
        genre: set.tracks[0]?.genre || 'Electronic',
        energy: set.averageEnergy,
        bpm: set.averageBPM,
        key: set.keyProgression[0] || 'C',
      },
    ];
  };

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

  return useMemo(() => ({
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
    voiceSession,
    startVoiceInput,
    stopVoiceInput,
    
    // Analysis features
    isAnalyzing,
    currentAnalysis,
    energyFlow,
    recommendations,
    analyzeCurrentSet,
    
    // Collaboration features
    collaborationSession,
    isLive,
    liveListeners,
    chatMessages,
    trackQueue,
    startCollaboration,
    joinCollaboration,
    sendChatMessage,
    
    // Social features
    socialFeed,
    shareSet,
    likeSet,
    
    // Export features
    exportSet,
    
    // Achievement system
    checkAchievements,
    
    // Utility states
    currentMood,
    notifications,
  }), [
    // Core dependencies
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
    
    // Voice dependencies
    isRecording,
    voiceSession,
    startVoiceInput,
    stopVoiceInput,
    
    // Analysis dependencies
    isAnalyzing,
    currentAnalysis,
    energyFlow,
    recommendations,
    analyzeCurrentSet,
    
    // Collaboration dependencies
    collaborationSession,
    isLive,
    liveListeners,
    chatMessages,
    trackQueue,
    startCollaboration,
    joinCollaboration,
    sendChatMessage,
    
    // Social dependencies
    socialFeed,
    shareSet,
    likeSet,
    
    // Export dependencies
    exportSet,
    
    // Achievement dependencies
    checkAchievements,
    
    // Utility dependencies
    currentMood,
    notifications,
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