import React, { useCallback, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import createContextHook from "@nkzw/create-context-hook";

export type AppSettings = {
  autoplay: boolean;
  notifications: boolean;
  highQualityStreaming: boolean;
  downloadOverCellular: boolean;
  explicitContent: boolean;
  theme: 'light' | 'dark' | 'system';
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
  changePassword: (current: string, next: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const DEFAULT_SETTINGS: AppSettings = {
  autoplay: true,
  notifications: true,
  highQualityStreaming: true,
  downloadOverCellular: false,
  explicitContent: true,
  theme: 'dark',
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
      if (p) setProfile(JSON.parse(p));
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
    setProfile(prev => {
      const next = { ...(prev ?? { displayName: "", email: "", avatarUrl: null }), ...patch };
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
    try {
      await Promise.all([
        AsyncStorage.removeItem(PROFILE_KEY),
      ]);
      setProfile(null);
    } catch (err) {
      console.error("[UserContext] signOut error", err);
    }
  }, []);

  return {
    profile,
    settings,
    isLoading,
    updateProfile,
    updateSetting,
    changePassword,
    signOut,
  };
});