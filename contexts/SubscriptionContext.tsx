import { useState, useEffect, useCallback } from "react";
import createContextHook from "@nkzw/create-context-hook";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useUser } from "./UserContext";

export type SubscriptionTier = "free" | "premium" | "pro";

export interface SubscriptionFeatures {
  unlimitedStreaming: boolean;
  adFree: boolean;
  highQualityAudio: boolean;
  offlineDownloads: boolean;
  djInstinct: boolean;
  personalization: boolean;
  customPlaylists: boolean;
  skipLimit: number | null;
  maxDownloads: number | null;
  videoStreaming: boolean;
  podcastAccess: boolean;
  audiobookAccess: boolean;
}

export interface SubscriptionState {
  tier: SubscriptionTier;
  features: SubscriptionFeatures;
  isLoading: boolean;
  canAccessFeature: (feature: keyof SubscriptionFeatures) => boolean;
  upgradeTier: (tier: SubscriptionTier) => Promise<void>;
  showUpgradePrompt: (feature: string) => void;
  getAdFrequency: () => number;
  shouldShowAd: () => boolean;
  recordAdView: () => void;
  lastAdTimestamp: number;
  streamCount: number;
  skipCount: number;
  canSkip: () => boolean;
  recordSkip: () => void;
  resetDailyLimits: () => void;
}

const TIER_FEATURES: Record<SubscriptionTier, SubscriptionFeatures> = {
  free: {
    unlimitedStreaming: false,
    adFree: false,
    highQualityAudio: false,
    offlineDownloads: false,
    djInstinct: false,
    personalization: false,
    customPlaylists: false,
    skipLimit: 6,
    maxDownloads: 0,
    videoStreaming: true,
    podcastAccess: true,
    audiobookAccess: true,
  },
  premium: {
    unlimitedStreaming: true,
    adFree: true,
    highQualityAudio: true,
    offlineDownloads: true,
    djInstinct: true,
    personalization: true,
    customPlaylists: true,
    skipLimit: null,
    maxDownloads: null,
    videoStreaming: true,
    podcastAccess: true,
    audiobookAccess: true,
  },
  pro: {
    unlimitedStreaming: true,
    adFree: true,
    highQualityAudio: true,
    offlineDownloads: true,
    djInstinct: true,
    personalization: true,
    customPlaylists: true,
    skipLimit: null,
    maxDownloads: null,
    videoStreaming: true,
    podcastAccess: true,
    audiobookAccess: true,
  },
};

const STORAGE_KEY = "subscription_data";
const AD_FREQUENCY_FREE = 180000;
const DAILY_SKIP_LIMIT_FREE = 6;

export const [SubscriptionProvider, useSubscription] = createContextHook<SubscriptionState>(() => {
  const { profile } = useUser();
  const [tier, setTier] = useState<SubscriptionTier>("free");
  const [isLoading, setIsLoading] = useState(true);
  const [lastAdTimestamp, setLastAdTimestamp] = useState(0);
  const [streamCount, setStreamCount] = useState(0);
  const [skipCount, setSkipCount] = useState(0);
  const [lastResetDate, setLastResetDate] = useState(new Date().toDateString());

  useEffect(() => {
    loadSubscriptionData();
  }, [profile]);

  useEffect(() => {
    const checkDailyReset = () => {
      const today = new Date().toDateString();
      if (today !== lastResetDate) {
        resetDailyLimits();
      }
    };

    checkDailyReset();
    const interval = setInterval(checkDailyReset, 60000);
    return () => clearInterval(interval);
  }, [lastResetDate]);

  const loadSubscriptionData = useCallback(async () => {
    try {
      setIsLoading(true);
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        setTier(data.tier || "free");
        setLastAdTimestamp(data.lastAdTimestamp || 0);
        setStreamCount(data.streamCount || 0);
        setSkipCount(data.skipCount || 0);
        setLastResetDate(data.lastResetDate || new Date().toDateString());
      }
      
      if (!profile) {
        setTier("free");
      }
    } catch (error) {
      console.error("[Subscription] Load error:", error);
      setTier("free");
    } finally {
      setIsLoading(false);
    }
  }, [profile]);

  const saveSubscriptionData = useCallback(async (data: Partial<{
    tier: SubscriptionTier;
    lastAdTimestamp: number;
    streamCount: number;
    skipCount: number;
    lastResetDate: string;
  }>) => {
    try {
      const current = await AsyncStorage.getItem(STORAGE_KEY);
      const parsed = current ? JSON.parse(current) : {};
      const updated = { ...parsed, ...data };
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error("[Subscription] Save error:", error);
    }
  }, []);

  const features = TIER_FEATURES[tier];

  const canAccessFeature = useCallback((feature: keyof SubscriptionFeatures): boolean => {
    return features[feature] === true || features[feature] === null;
  }, [features]);

  const upgradeTier = useCallback(async (newTier: SubscriptionTier) => {
    console.log("[Subscription] Upgrading to:", newTier);
    setTier(newTier);
    await saveSubscriptionData({ tier: newTier });
  }, [saveSubscriptionData]);

  const showUpgradePrompt = useCallback((feature: string) => {
    console.log("[Subscription] Upgrade prompt for:", feature);
  }, []);

  const getAdFrequency = useCallback((): number => {
    if (tier !== "free") return 0;
    return AD_FREQUENCY_FREE;
  }, [tier]);

  const shouldShowAd = useCallback((): boolean => {
    if (tier !== "free") return false;
    const now = Date.now();
    const timeSinceLastAd = now - lastAdTimestamp;
    return timeSinceLastAd >= AD_FREQUENCY_FREE;
  }, [tier, lastAdTimestamp]);

  const recordAdView = useCallback(() => {
    const now = Date.now();
    setLastAdTimestamp(now);
    saveSubscriptionData({ lastAdTimestamp: now });
  }, [saveSubscriptionData]);

  const canSkip = useCallback((): boolean => {
    if (tier !== "free") return true;
    return skipCount < DAILY_SKIP_LIMIT_FREE;
  }, [tier, skipCount]);

  const recordSkip = useCallback(() => {
    if (tier === "free") {
      const newCount = skipCount + 1;
      setSkipCount(newCount);
      saveSubscriptionData({ skipCount: newCount });
    }
  }, [tier, skipCount, saveSubscriptionData]);

  const resetDailyLimits = useCallback(() => {
    const today = new Date().toDateString();
    setSkipCount(0);
    setStreamCount(0);
    setLastResetDate(today);
    saveSubscriptionData({
      skipCount: 0,
      streamCount: 0,
      lastResetDate: today,
    });
  }, [saveSubscriptionData]);

  return {
    tier,
    features,
    isLoading,
    canAccessFeature,
    upgradeTier,
    showUpgradePrompt,
    getAdFrequency,
    shouldShowAd,
    recordAdView,
    lastAdTimestamp,
    streamCount,
    skipCount,
    canSkip,
    recordSkip,
    resetDailyLimits,
  };
});
