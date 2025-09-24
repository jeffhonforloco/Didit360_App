import { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform, Dimensions, AppState, AppStateStatus } from 'react-native';
import createContextHook from '@nkzw/create-context-hook';

export type Theme = 'light' | 'dark' | 'system';
export type AnimationSpeed = 'slow' | 'normal' | 'fast' | 'disabled';
export type HapticFeedback = 'none' | 'light' | 'medium' | 'heavy';
export type FontSize = 'small' | 'normal' | 'large' | 'extra-large';
export type ReducedMotion = 'auto' | 'reduce' | 'no-preference';

export interface AccessibilitySettings {
  screenReader: boolean;
  highContrast: boolean;
  largeText: boolean;
  reduceMotion: ReducedMotion;
  voiceOver: boolean;
  boldText: boolean;
  buttonShapes: boolean;
  reduceTransparency: boolean;
  increaseContrast: boolean;
  differentiateWithoutColor: boolean;
  onOffLabels: boolean;
  videoAutoplay: boolean;
}

export interface PerformanceSettings {
  enableAnimations: boolean;
  animationSpeed: AnimationSpeed;
  enableHaptics: boolean;
  hapticStrength: HapticFeedback;
  enableBlur: boolean;
  enableShadows: boolean;
  imageQuality: 'low' | 'medium' | 'high';
  cacheSize: number; // MB
  preloadImages: boolean;
  enableGestures: boolean;
  smoothScrolling: boolean;
  enableParallax: boolean;
}

export interface UXSettings {
  theme: Theme;
  fontSize: FontSize;
  compactMode: boolean;
  showTutorials: boolean;
  enableSwipeGestures: boolean;
  enablePullToRefresh: boolean;
  enableInfiniteScroll: boolean;
  showProgressIndicators: boolean;
  enableSmartSuggestions: boolean;
  enableContextualHelp: boolean;
  enableQuickActions: boolean;
  enableShortcuts: boolean;
  showBreadcrumbs: boolean;
  enableSearch: boolean;
  enableFilters: boolean;
  enableSorting: boolean;
  showMetadata: boolean;
  enablePreview: boolean;
  enableBulkActions: boolean;
  enableUndo: boolean;
}

export interface DeviceInfo {
  platform: string;
  version: string;
  screenWidth: number;
  screenHeight: number;
  isTablet: boolean;
  hasNotch: boolean;
  orientation: 'portrait' | 'landscape';
  pixelRatio: number;
  fontScale: number;
}

export interface PerformanceMetrics {
  appStartTime: number;
  screenLoadTimes: Record<string, number>;
  memoryUsage: number;
  crashCount: number;
  errorCount: number;
  networkRequests: number;
  cacheHitRate: number;
  batteryLevel?: number;
  isLowPowerMode?: boolean;
}

export interface UserBehavior {
  sessionDuration: number;
  screensVisited: string[];
  actionsPerformed: string[];
  searchQueries: string[];
  preferences: Record<string, any>;
  lastActiveTime: number;
  totalSessions: number;
  averageSessionDuration: number;
}

interface UXState {
  accessibility: AccessibilitySettings;
  performance: PerformanceSettings;
  ux: UXSettings;
  deviceInfo: DeviceInfo;
  metrics: PerformanceMetrics;
  behavior: UserBehavior;
  isLoading: boolean;
  
  // Methods
  updateAccessibilitySettings: (settings: Partial<AccessibilitySettings>) => Promise<void>;
  updatePerformanceSettings: (settings: Partial<PerformanceSettings>) => Promise<void>;
  updateUXSettings: (settings: Partial<UXSettings>) => Promise<void>;
  trackScreenLoad: (screenName: string, loadTime: number) => void;
  trackUserAction: (action: string) => void;
  trackSearchQuery: (query: string) => void;
  updatePreference: (key: string, value: any) => void;
  getOptimalSettings: () => Promise<Partial<PerformanceSettings>>;
  exportAnalytics: () => Promise<string>;
  resetAllSettings: () => Promise<void>;
  detectSystemPreferences: () => Promise<void>;
  optimizeForDevice: () => Promise<void>;
}

const DEFAULT_ACCESSIBILITY: AccessibilitySettings = {
  screenReader: false,
  highContrast: false,
  largeText: false,
  reduceMotion: 'auto',
  voiceOver: false,
  boldText: false,
  buttonShapes: false,
  reduceTransparency: false,
  increaseContrast: false,
  differentiateWithoutColor: false,
  onOffLabels: false,
  videoAutoplay: true,
};

const DEFAULT_PERFORMANCE: PerformanceSettings = {
  enableAnimations: true,
  animationSpeed: 'normal',
  enableHaptics: true,
  hapticStrength: 'medium',
  enableBlur: true,
  enableShadows: true,
  imageQuality: 'high',
  cacheSize: 100,
  preloadImages: true,
  enableGestures: true,
  smoothScrolling: true,
  enableParallax: true,
};

const DEFAULT_UX: UXSettings = {
  theme: 'dark',
  fontSize: 'normal',
  compactMode: false,
  showTutorials: true,
  enableSwipeGestures: true,
  enablePullToRefresh: true,
  enableInfiniteScroll: true,
  showProgressIndicators: true,
  enableSmartSuggestions: true,
  enableContextualHelp: true,
  enableQuickActions: true,
  enableShortcuts: true,
  showBreadcrumbs: true,
  enableSearch: true,
  enableFilters: true,
  enableSorting: true,
  showMetadata: true,
  enablePreview: true,
  enableBulkActions: true,
  enableUndo: true,
};

const STORAGE_KEYS = {
  accessibility: 'ux_accessibility_settings',
  performance: 'ux_performance_settings',
  ux: 'ux_settings',
  metrics: 'ux_metrics',
  behavior: 'ux_behavior',
};

const getDeviceInfo = (): DeviceInfo => {
  const { width, height } = Dimensions.get('window');
  const isTablet = Math.min(width, height) >= 768;
  
  let version = 'unknown';
  try {
    if (Platform.Version) {
      version = typeof Platform.Version === 'string' ? Platform.Version : String(Platform.Version);
    }
  } catch (error) {
    console.warn('[UXContext] Failed to get platform version:', error);
    version = 'unknown';
  }
  
  return {
    platform: Platform.OS,
    version,
    screenWidth: width,
    screenHeight: height,
    isTablet,
    hasNotch: height >= 812 && Platform.OS === 'ios', // Rough estimation
    orientation: width > height ? 'landscape' : 'portrait',
    pixelRatio: Platform.select({ web: 1, default: 2 }),
    fontScale: Platform.select({ web: 1, default: 1 }),
  };
};

const getOptimalSettingsForDevice = (deviceInfo: DeviceInfo): Partial<PerformanceSettings> => {
  const isLowEndDevice = deviceInfo.screenWidth < 375 || deviceInfo.pixelRatio < 2;
  
  if (isLowEndDevice) {
    return {
      enableAnimations: false,
      animationSpeed: 'fast',
      enableBlur: false,
      enableShadows: false,
      imageQuality: 'medium',
      cacheSize: 50,
      preloadImages: false,
      enableParallax: false,
    };
  }
  
  return DEFAULT_PERFORMANCE;
};

export const [UXProvider, useUX] = createContextHook<UXState>(() => {
  const [accessibility, setAccessibility] = useState<AccessibilitySettings>(DEFAULT_ACCESSIBILITY);
  const [performance, setPerformance] = useState<PerformanceSettings>(DEFAULT_PERFORMANCE);
  const [ux, setUX] = useState<UXSettings>(DEFAULT_UX);
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>(getDeviceInfo());
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    appStartTime: Date.now(),
    screenLoadTimes: {},
    memoryUsage: 0,
    crashCount: 0,
    errorCount: 0,
    networkRequests: 0,
    cacheHitRate: 0,
  });
  const [behavior, setBehavior] = useState<UserBehavior>({
    sessionDuration: 0,
    screensVisited: [],
    actionsPerformed: [],
    searchQueries: [],
    preferences: {},
    lastActiveTime: Date.now(),
    totalSessions: 0,
    averageSessionDuration: 0,
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    void loadSettings();
    void detectSystemPreferences();
    
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDeviceInfo(prev => ({
        ...prev,
        screenWidth: window.width,
        screenHeight: window.height,
        orientation: window.width > window.height ? 'landscape' : 'portrait',
      }));
    });

    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active') {
        setBehavior(prev => ({
          ...prev,
          lastActiveTime: Date.now(),
          totalSessions: prev.totalSessions + 1,
        }));
      }
    };

    const appStateSubscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription?.remove();
      appStateSubscription.remove();
    };
  }, []);

  const loadSettings = async () => {
    try {
      setIsLoading(true);
      const [accessibilityData, performanceData, uxData, metricsData, behaviorData] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.accessibility),
        AsyncStorage.getItem(STORAGE_KEYS.performance),
        AsyncStorage.getItem(STORAGE_KEYS.ux),
        AsyncStorage.getItem(STORAGE_KEYS.metrics),
        AsyncStorage.getItem(STORAGE_KEYS.behavior),
      ]);

      if (accessibilityData) {
        setAccessibility({ ...DEFAULT_ACCESSIBILITY, ...JSON.parse(accessibilityData) });
      }
      if (performanceData) {
        setPerformance({ ...DEFAULT_PERFORMANCE, ...JSON.parse(performanceData) });
      }
      if (uxData) {
        setUX({ ...DEFAULT_UX, ...JSON.parse(uxData) });
      }
      if (metricsData) {
        setMetrics(prev => ({ ...prev, ...JSON.parse(metricsData) }));
      }
      if (behaviorData) {
        setBehavior(prev => ({ ...prev, ...JSON.parse(behaviorData) }));
      }
    } catch (error) {
      console.error('[UXContext] Failed to load settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveSettings = async (key: string, data: any) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error(`[UXContext] Failed to save ${key}:`, error);
    }
  };

  const updateAccessibilitySettings = useCallback(async (newSettings: Partial<AccessibilitySettings>) => {
    const updated = { ...accessibility, ...newSettings };
    setAccessibility(updated);
    await saveSettings(STORAGE_KEYS.accessibility, updated);
  }, [accessibility]);

  const updatePerformanceSettings = useCallback(async (newSettings: Partial<PerformanceSettings>) => {
    const updated = { ...performance, ...newSettings };
    setPerformance(updated);
    await saveSettings(STORAGE_KEYS.performance, updated);
  }, [performance]);

  const updateUXSettings = useCallback(async (newSettings: Partial<UXSettings>) => {
    const updated = { ...ux, ...newSettings };
    setUX(updated);
    await saveSettings(STORAGE_KEYS.ux, updated);
  }, [ux]);

  const trackScreenLoad = useCallback((screenName: string, loadTime: number) => {
    setMetrics(prev => {
      const updated = {
        ...prev,
        screenLoadTimes: {
          ...prev.screenLoadTimes,
          [screenName]: loadTime,
        },
      };
      void saveSettings(STORAGE_KEYS.metrics, updated);
      return updated;
    });
  }, []);

  const trackUserAction = useCallback((action: string) => {
    setBehavior(prev => {
      const updated = {
        ...prev,
        actionsPerformed: [...prev.actionsPerformed, action].slice(-100), // Keep last 100
      };
      void saveSettings(STORAGE_KEYS.behavior, updated);
      return updated;
    });
  }, []);

  const trackSearchQuery = useCallback((query: string) => {
    setBehavior(prev => {
      const updated = {
        ...prev,
        searchQueries: [...prev.searchQueries, query].slice(-50), // Keep last 50
      };
      void saveSettings(STORAGE_KEYS.behavior, updated);
      return updated;
    });
  }, []);

  const updatePreference = useCallback((key: string, value: any) => {
    setBehavior(prev => {
      const updated = {
        ...prev,
        preferences: {
          ...prev.preferences,
          [key]: value,
        },
      };
      void saveSettings(STORAGE_KEYS.behavior, updated);
      return updated;
    });
  }, []);

  const getOptimalSettings = useCallback(async (): Promise<Partial<PerformanceSettings>> => {
    return getOptimalSettingsForDevice(deviceInfo);
  }, [deviceInfo]);

  const exportAnalytics = useCallback(async (): Promise<string> => {
    const analytics = {
      timestamp: new Date().toISOString(),
      deviceInfo,
      settings: { accessibility, performance, ux },
      metrics,
      behavior,
    };
    
    return JSON.stringify(analytics, null, 2);
  }, [deviceInfo, accessibility, performance, ux, metrics, behavior]);

  const resetAllSettings = useCallback(async () => {
    try {
      setAccessibility(DEFAULT_ACCESSIBILITY);
      setPerformance(DEFAULT_PERFORMANCE);
      setUX(DEFAULT_UX);
      
      await Promise.all([
        AsyncStorage.removeItem(STORAGE_KEYS.accessibility),
        AsyncStorage.removeItem(STORAGE_KEYS.performance),
        AsyncStorage.removeItem(STORAGE_KEYS.ux),
      ]);
    } catch (error) {
      console.error('[UXContext] Failed to reset settings:', error);
    }
  }, []);

  const detectSystemPreferences = useCallback(async () => {
    if (Platform.OS === 'web') return;
    
    // This would typically use system APIs to detect preferences
    // For now, we'll use some basic detection
    const systemSettings: Partial<AccessibilitySettings> = {};
    
    // Update accessibility settings based on system preferences
    await updateAccessibilitySettings(systemSettings);
  }, [updateAccessibilitySettings]);

  const optimizeForDevice = useCallback(async () => {
    const optimalSettings = await getOptimalSettings();
    await updatePerformanceSettings(optimalSettings);
  }, [getOptimalSettings, updatePerformanceSettings]);

  return {
    accessibility,
    performance,
    ux,
    deviceInfo,
    metrics,
    behavior,
    isLoading,
    updateAccessibilitySettings,
    updatePerformanceSettings,
    updateUXSettings,
    trackScreenLoad,
    trackUserAction,
    trackSearchQuery,
    updatePreference,
    getOptimalSettings,
    exportAnalytics,
    resetAllSettings,
    detectSystemPreferences,
    optimizeForDevice,
  };
});