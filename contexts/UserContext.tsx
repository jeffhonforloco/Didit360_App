import { useCallback, useEffect, useState } from "react";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import createContextHook from "@nkzw/create-context-hook";
import { router } from "expo-router";

export type StreamQuality = 'low' | 'normal' | 'high';
export type DownloadQuality = 'normal' | 'high';
export type AppLanguage = 'en' | 'fr' | 'es' | 'pt';
export type AccentColor = '#FF0080' | '#8B5CF6' | '#3B82F6' | '#10B981' | '#F59E0B' | '#EF4444';

export type AppSettings = {
  autoplay: boolean;
  notifications: boolean;
  highQualityStreaming: boolean;
  downloadOverCellular: boolean;
  explicitContent: boolean;
  theme: 'light' | 'dark' | 'system';
  dataSaver: boolean;
  streamQuality: StreamQuality;
  downloadQuality: DownloadQuality;
  crossfadeSeconds: number;
  showLyrics: boolean;
  language: AppLanguage;
  analytics: boolean;
  gaplessPlayback: boolean;
  normalizeVolume: boolean;
  accentColor: AccentColor;
  connectToDevices: boolean;
  showLocalDeviceOnly: boolean;
  carMode: boolean;
  biometricLock: boolean;
  cellularDataLimitMB: number;
};

export type UserProfile = {
  displayName: string;
  email: string;
  avatarUrl?: string | null;
};

interface UserState {
  profile: UserProfile | null;
  settings: AppSettings;
  isLoading: boolean;
  updateProfile: (patch: Partial<UserProfile>) => Promise<void>;
  updateSetting: <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => Promise<void>;
  resetSettings: () => Promise<void>;
  changePassword: (current: string, next: string) => Promise<void>;
  signOut: () => Promise<void>;
  clearStorage: () => Promise<void>;
  isSignedIn: boolean;
}

const DEFAULT_SETTINGS: AppSettings = {
  autoplay: true,
  notifications: true,
  highQualityStreaming: true,
  downloadOverCellular: false,
  explicitContent: true,
  theme: 'dark',
  dataSaver: false,
  streamQuality: 'high',
  downloadQuality: 'high',
  crossfadeSeconds: 6,
  showLyrics: true,
  language: 'en',
  analytics: true,
  gaplessPlayback: true,
  normalizeVolume: true,
  accentColor: '#FF0080',
  connectToDevices: false,
  showLocalDeviceOnly: false,
  carMode: false,
  biometricLock: false,
  cellularDataLimitMB: 500,
};

const PROFILE_KEY = "user_profile";
const SETTINGS_KEY = "user_settings";
const PASSWORD_KEY = "user_password";
const SIGNED_OUT_KEY = "user_signed_out";

// Custom hook for sign out with navigation
export const useSignOut = () => {
  const { signOut } = useUser();
  
  const signOutWithNavigation = useCallback(async () => {
    console.log('[useSignOut] Starting sign out process');
    try {
      // First clear the user data
      await signOut();
      console.log('[useSignOut] Sign out completed, profile should be null now');
      
      // Small delay to ensure state updates are processed
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Navigate to home screen
      console.log('[useSignOut] Navigating to home screen');
      router.dismissAll();
      
      // Use push to home tab instead of replace
      if (router.canGoBack()) {
        router.back();
      }
      
      // Force navigate to home tab
      setTimeout(() => {
        router.push('/' as any);
      }, 100);
      
    } catch (error) {
      console.error('[useSignOut] Sign out error:', error);
      // Even if there's an error, try to navigate away
      router.dismissAll();
      setTimeout(() => {
        router.push('/' as any);
      }, 100);
    }
  }, [signOut]);
  
  return signOutWithNavigation;
};

export const [UserProvider, useUser] = createContextHook<UserState>(() => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [settings, setSettings] = useState<AppSettings>(() => ({ ...DEFAULT_SETTINGS }));
  const [isLoading, setIsLoading] = useState<boolean>(false); // Start with false to prevent blocking

  const load = useCallback(async () => {
    try {
      console.log('[UserContext] load - starting load process');
      setIsLoading(true);
      
      const [p, s, signedOut] = await Promise.all([
        AsyncStorage.getItem(PROFILE_KEY),
        AsyncStorage.getItem(SETTINGS_KEY),
        AsyncStorage.getItem(SIGNED_OUT_KEY),
      ]);
      
      console.log('[UserContext] load - profile exists:', !!p);
      console.log('[UserContext] load - signed out flag:', signedOut);
      
      // Only set profile if we have one and user hasn't explicitly signed out
      if (p && signedOut !== 'true') {
        console.log('[UserContext] load - setting profile from storage');
        setProfile(JSON.parse(p));
      } else {
        console.log('[UserContext] load - no profile or user signed out, keeping profile null');
        setProfile(null);
      }
      
      if (s) {
        console.log('[UserContext] load - loading settings from storage');
        setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(s) });
      } else {
        console.log('[UserContext] load - using default settings');
        setSettings({ ...DEFAULT_SETTINGS });
      }
      
      console.log('[UserContext] load - completed successfully');
    } catch (err) {
      console.error("[UserContext] load error", err);
      // Set defaults on error
      setProfile(null);
      setSettings({ ...DEFAULT_SETTINGS });
    } finally {
      console.log('[UserContext] load - setting isLoading to false');
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // On web, defer loading to avoid blocking hydration
    if (typeof window !== 'undefined' && Platform.OS === 'web') {
      // Use requestAnimationFrame to defer after hydration
      requestAnimationFrame(() => {
        console.log('[UserContext] useEffect - starting load (deferred for web)');
        void load();
      });
    } else {
      // On native, load immediately
      console.log('[UserContext] useEffect - starting load');
      void load();
    }
    
    // Fallback timeout to prevent infinite loading
    const timeout = setTimeout(() => {
      console.log('[UserContext] Load timeout - forcing isLoading to false');
      setIsLoading(false);
    }, 5000); // 5 second timeout
    
    return () => {
      clearTimeout(timeout);
    };
  }, [load]);

  const persist = async (key: string, value: unknown) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      console.error(`[UserContext] persist ${key} error`, err);
    }
  };

  const updateProfile = useCallback(async (patch: Partial<UserProfile>) => {
    console.log('[UserContext] updateProfile called with patch:', patch);
    // Clear the signed out flag when updating profile (user is signing in)
    await AsyncStorage.removeItem(SIGNED_OUT_KEY);
    
    setProfile(prev => {
      const next = { ...(prev ?? { displayName: "", email: "", avatarUrl: null }), ...patch };
      console.log('[UserContext] updateProfile - prev profile:', prev);
      console.log('[UserContext] updateProfile - next profile:', next);
      void persist(PROFILE_KEY, next);
      return next;
    });
  }, []);

  const updateSetting = useCallback(async <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    setSettings(prev => {
      const next = { ...prev, [key]: value } as AppSettings;
      void persist(SETTINGS_KEY, next);
      return next;
    });
  }, []);

  const resetSettings = useCallback(async () => {
    try {
      setSettings(DEFAULT_SETTINGS);
      await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(DEFAULT_SETTINGS));
    } catch (err) {
      console.error("[UserContext] resetSettings error", err);
    }
  }, []);

  const changePassword = useCallback(async (current: string, next: string) => {
    try {
      const stored = (await AsyncStorage.getItem(PASSWORD_KEY)) ?? '';
      const ok = !stored || stored === current;
      if (!ok) throw new Error('Current password is incorrect');
      if (!next || next.length < 6) throw new Error('Password must be at least 6 characters');
      await AsyncStorage.setItem(PASSWORD_KEY, next);
    } catch (err) {
      throw err;
    }
  }, []);

  const signOut = useCallback(async () => {
    console.log('[UserContext] signOut called');
    try {
      console.log('[UserContext] Setting signed out flag and removing profile from AsyncStorage');
      
      // First set profile to null immediately for UI responsiveness
      setProfile(null);
      console.log('[UserContext] Profile set to null immediately');
      
      // Call backend signout if we have a token
      try {
        const token = await AsyncStorage.getItem('auth_token');
        if (token) {
          // Note: In a real app, you'd call the backend signout endpoint here
          // For now, we'll just clear local storage
          console.log('[UserContext] Would call backend signout with token');
        }
      } catch (backendError) {
        console.log('[UserContext] Backend signout failed, continuing with local cleanup:', backendError);
      }
      
      // Then clear storage - clear everything to ensure clean state
      await Promise.all([
        AsyncStorage.setItem(SIGNED_OUT_KEY, 'true'), // Mark as signed out
        AsyncStorage.removeItem(PROFILE_KEY),
        AsyncStorage.removeItem(PASSWORD_KEY), // Also clear password
        AsyncStorage.removeItem('auth_token'), // Clear auth token
        AsyncStorage.removeItem('refresh_token'), // Clear refresh token
      ]);
      console.log('[UserContext] Profile and tokens removed from AsyncStorage');
      console.log('[UserContext] signOut completed successfully');
      
    } catch (err) {
      console.error("[UserContext] signOut error", err);
      // If storage operations fail, still keep profile as null since user intended to sign out
      setProfile(null);
      // Don't throw the error - we want sign out to succeed even if storage fails
      console.log('[UserContext] signOut completed despite storage error');
    }
  }, []);

  const clearStorage = useCallback(async () => {
    try {
      await AsyncStorage.clear();
      setProfile(null);
      setSettings(DEFAULT_SETTINGS);
    } catch (err) {
      console.error('[UserContext] clearStorage error', err);
    }
  }, []);

  const isSignedIn = profile !== null;

  return {
    profile,
    settings,
    isLoading,
    updateProfile,
    updateSetting,
    resetSettings,
    changePassword,
    signOut,
    clearStorage,
    isSignedIn,
  };
});