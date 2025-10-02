import { useCallback, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import createContextHook from "@nkzw/create-context-hook";
import { router } from "expo-router";
import { trpcClient } from "@/lib/trpc";

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
  id: string;
  displayName: string;
  email: string;
  avatarUrl?: string | null;
  createdAt: string;
};

interface UserState {
  profile: UserProfile | null;
  settings: AppSettings;
  isLoading: boolean;
  token: string | null;
  updateProfile: (patch: Partial<Omit<UserProfile, 'id' | 'createdAt'>>) => Promise<void>;
  updateSetting: <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => Promise<void>;
  resetSettings: () => Promise<void>;
  changePassword: (current: string, next: string) => Promise<void>;
  signOut: () => Promise<void>;
  clearStorage: () => Promise<void>;
  isSignedIn: boolean;
  signUp: (email: string, password: string, displayName: string, avatarUrl?: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
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
const TOKEN_KEY = "user_token";
const REFRESH_TOKEN_KEY = "user_refresh_token";

export const useSignOut = () => {
  const { signOut } = useUser();
  
  const signOutWithNavigation = useCallback(async () => {
    console.log('[useSignOut] Starting sign out process');
    try {
      await signOut();
      console.log('[useSignOut] Sign out completed');
      
      await new Promise(resolve => setTimeout(resolve, 100));
      
      console.log('[useSignOut] Navigating to home screen');
      router.dismissAll();
      
      if (router.canGoBack()) {
        router.back();
      }
      
      setTimeout(() => {
        router.push('/' as any);
      }, 100);
      
    } catch (error) {
      console.error('[useSignOut] Sign out error:', error);
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
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [token, setToken] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      console.log('[UserContext] load - starting load process');
      setIsLoading(true);
      
      const [p, s, t] = await Promise.all([
        AsyncStorage.getItem(PROFILE_KEY),
        AsyncStorage.getItem(SETTINGS_KEY),
        AsyncStorage.getItem(TOKEN_KEY),
      ]);
      
      console.log('[UserContext] load - profile exists:', !!p, 'token exists:', !!t);
      
      if (p && t) {
        console.log('[UserContext] load - setting profile and token from storage');
        setProfile(JSON.parse(p));
        setToken(t);
      } else {
        console.log('[UserContext] load - no profile or token, keeping null');
        setProfile(null);
        setToken(null);
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
      setProfile(null);
      setToken(null);
      setSettings({ ...DEFAULT_SETTINGS });
    } finally {
      console.log('[UserContext] load - setting isLoading to false');
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    console.log('[UserContext] useEffect - starting load');
    void load();
    
    const timeout = setTimeout(() => {
      console.log('[UserContext] Load timeout - forcing isLoading to false');
      setIsLoading(false);
    }, 5000);
    
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

  const signUp = useCallback(async (email: string, password: string, displayName: string, avatarUrl?: string) => {
    console.log('[UserContext] signUp called');
    try {
      const result = await trpcClient.auth.signup.mutate({
        email,
        password,
        displayName,
        avatarUrl: avatarUrl || null,
      });

      console.log('[UserContext] signUp successful:', result.user.id);
      
      setProfile(result.user);
      setToken(result.token);
      
      await Promise.all([
        persist(PROFILE_KEY, result.user),
        persist(TOKEN_KEY, result.token),
        persist(REFRESH_TOKEN_KEY, result.refreshToken),
      ]);
      
      console.log('[UserContext] signUp - profile and tokens saved');
    } catch (error) {
      console.error('[UserContext] signUp error:', error);
      throw error;
    }
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    console.log('[UserContext] signIn called');
    try {
      const result = await trpcClient.auth.signin.mutate({
        email,
        password,
      });

      console.log('[UserContext] signIn successful:', result.user.id);
      
      setProfile(result.user);
      setToken(result.token);
      
      await Promise.all([
        persist(PROFILE_KEY, result.user),
        persist(TOKEN_KEY, result.token),
        persist(REFRESH_TOKEN_KEY, result.refreshToken),
      ]);
      
      console.log('[UserContext] signIn - profile and tokens saved');
    } catch (error) {
      console.error('[UserContext] signIn error:', error);
      throw error;
    }
  }, []);

  const updateProfile = useCallback(async (patch: Partial<Omit<UserProfile, 'id' | 'createdAt'>>) => {
    console.log('[UserContext] updateProfile called with patch:', patch);
    
    if (!token) {
      console.error('[UserContext] updateProfile - no token available');
      throw new Error('Not authenticated');
    }

    try {
      const result = await trpcClient.auth.updateProfile.mutate({
        token,
        displayName: patch.displayName,
        avatarUrl: patch.avatarUrl,
      });

      console.log('[UserContext] updateProfile successful');
      
      setProfile(prev => {
        if (!prev) return null;
        const next = { ...prev, ...result.user };
        void persist(PROFILE_KEY, next);
        return next;
      });
    } catch (error) {
      console.error('[UserContext] updateProfile error:', error);
      throw error;
    }
  }, [token]);

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
      if (!next || next.length < 6) throw new Error('Password must be at least 6 characters');
      console.log('[UserContext] changePassword - password validation passed');
    } catch (err) {
      throw err;
    }
  }, []);

  const signOut = useCallback(async () => {
    console.log('[UserContext] signOut called');
    try {
      if (token) {
        await trpcClient.auth.signout.mutate({ token });
      }
      
      console.log('[UserContext] Setting profile and token to null');
      setProfile(null);
      setToken(null);
      
      await Promise.all([
        AsyncStorage.removeItem(PROFILE_KEY),
        AsyncStorage.removeItem(TOKEN_KEY),
        AsyncStorage.removeItem(REFRESH_TOKEN_KEY),
      ]);
      
      console.log('[UserContext] signOut completed successfully');
    } catch (err) {
      console.error("[UserContext] signOut error", err);
      setProfile(null);
      setToken(null);
      console.log('[UserContext] signOut completed despite error');
    }
  }, [token]);

  const clearStorage = useCallback(async () => {
    try {
      await AsyncStorage.clear();
      setProfile(null);
      setToken(null);
      setSettings(DEFAULT_SETTINGS);
    } catch (err) {
      console.error('[UserContext] clearStorage error', err);
    }
  }, []);

  const isSignedIn = profile !== null && token !== null;

  return {
    profile,
    settings,
    isLoading,
    token,
    updateProfile,
    updateSetting,
    resetSettings,
    changePassword,
    signOut,
    clearStorage,
    isSignedIn,
    signUp,
    signIn,
  };
});
