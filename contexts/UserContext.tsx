import React, { useCallback, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import createContextHook from "@nkzw/create-context-hook";

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

export const [UserProvider, useUser] = createContextHook<UserState>(() => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    void load();
  }, []);

  const load = async () => {
    try {
      setIsLoading(true);
      const [p, s] = await Promise.all([
        AsyncStorage.getItem(PROFILE_KEY),
        AsyncStorage.getItem(SETTINGS_KEY),
      ]);
      if (p) {
        setProfile(JSON.parse(p));
      } else {
        // No profile exists - user is not signed in
        setProfile(null);
      }
      if (s) setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(s) });
    } catch (err) {
      console.error("[UserContext] load error", err);
    } finally {
      setIsLoading(false);
    }
  };

  const persist = async (key: string, value: unknown) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      console.error(`[UserContext] persist ${key} error`, err);
    }
  };

  const updateProfile = useCallback(async (patch: Partial<UserProfile>) => {
    console.log('[UserContext] updateProfile called with patch:', patch);
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
      console.log('[UserContext] Removing profile from AsyncStorage');
      await Promise.all([
        AsyncStorage.removeItem(PROFILE_KEY),
        AsyncStorage.removeItem(PASSWORD_KEY), // Also clear password
      ]);
      console.log('[UserContext] Profile and password removed from AsyncStorage, setting profile to null');
      setProfile(null);
      console.log('[UserContext] signOut completed - profile set to null');
      // Note: Library data will be cleared automatically when profile changes
    } catch (err) {
      console.error("[UserContext] signOut error", err);
      throw err; // Re-throw the error so the caller can handle it
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
  };
});