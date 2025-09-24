import React, { useCallback, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as LocalAuthentication from 'expo-local-authentication';
import { Platform } from 'react-native';
import createContextHook from '@nkzw/create-context-hook';

export type SecurityLevel = 'low' | 'medium' | 'high' | 'maximum';
export type AuthMethod = 'none' | 'pin' | 'biometric' | 'both';
export type SessionTimeout = 'never' | '5min' | '15min' | '30min' | '1hour' | '4hours';

export interface SecuritySettings {
  authMethod: AuthMethod;
  sessionTimeout: SessionTimeout;
  autoLockEnabled: boolean;
  biometricEnabled: boolean;
  pinEnabled: boolean;
  securityLevel: SecurityLevel;
  encryptData: boolean;
  requireAuthForSensitive: boolean;
  logSecurityEvents: boolean;
  allowScreenshots: boolean;
  allowScreenRecording: boolean;
  hideInAppSwitcher: boolean;
  wipeDataAfterFailedAttempts: boolean;
  maxFailedAttempts: number;
  twoFactorEnabled: boolean;
  deviceTrustEnabled: boolean;
  locationBasedSecurity: boolean;
  networkSecurityEnabled: boolean;
}

export interface SecurityEvent {
  id: string;
  type: 'login' | 'logout' | 'failed_auth' | 'settings_change' | 'data_access' | 'suspicious_activity';
  timestamp: number;
  details: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  location?: string;
  deviceInfo?: string;
}

export interface SessionInfo {
  id: string;
  startTime: number;
  lastActivity: number;
  isActive: boolean;
  deviceInfo: string;
  location?: string;
}

interface SecurityState {
  settings: SecuritySettings;
  isAuthenticated: boolean;
  isLocked: boolean;
  biometricAvailable: boolean;
  biometricType: LocalAuthentication.AuthenticationType[];
  securityEvents: SecurityEvent[];
  activeSessions: SessionInfo[];
  currentSession: SessionInfo | null;
  failedAttempts: number;
  lastActivity: number;
  
  // Methods
  authenticate: (method?: AuthMethod) => Promise<boolean>;
  lock: () => Promise<void>;
  unlock: (method?: AuthMethod) => Promise<boolean>;
  updateSecuritySettings: (settings: Partial<SecuritySettings>) => Promise<void>;
  logSecurityEvent: (event: Omit<SecurityEvent, 'id' | 'timestamp'>) => Promise<void>;
  clearSecurityEvents: () => Promise<void>;
  checkBiometricAvailability: () => Promise<void>;
  setupPin: (pin: string) => Promise<void>;
  verifyPin: (pin: string) => Promise<boolean>;
  changePin: (oldPin: string, newPin: string) => Promise<void>;
  enableTwoFactor: () => Promise<string>; // Returns backup codes
  verifyTwoFactor: (code: string) => Promise<boolean>;
  createSession: () => Promise<SessionInfo>;
  endSession: (sessionId: string) => Promise<void>;
  endAllSessions: () => Promise<void>;
  updateActivity: () => void;
  checkSessionTimeout: () => boolean;
  wipeAllData: () => Promise<void>;
  exportSecurityReport: () => Promise<string>;
}

const DEFAULT_SECURITY_SETTINGS: SecuritySettings = {
  authMethod: 'none',
  sessionTimeout: '30min',
  autoLockEnabled: false,
  biometricEnabled: false,
  pinEnabled: false,
  securityLevel: 'medium',
  encryptData: false,
  requireAuthForSensitive: false,
  logSecurityEvents: true,
  allowScreenshots: true,
  allowScreenRecording: true,
  hideInAppSwitcher: false,
  wipeDataAfterFailedAttempts: false,
  maxFailedAttempts: 5,
  twoFactorEnabled: false,
  deviceTrustEnabled: false,
  locationBasedSecurity: false,
  networkSecurityEnabled: false,
};

const SECURITY_STORAGE_KEY = 'security_settings';
const SECURITY_EVENTS_KEY = 'security_events';
const SESSIONS_KEY = 'active_sessions';
const PIN_KEY = 'security_pin';
const TWO_FACTOR_KEY = 'two_factor_secret';

const generateId = () => Math.random().toString(36).substr(2, 9);

const getDeviceInfo = () => {
  let version = 'unknown';
  try {
    if (Platform.Version !== undefined && Platform.Version !== null) {
      version = typeof Platform.Version === 'string' ? Platform.Version : String(Platform.Version);
    }
  } catch (error) {
    console.warn('[SecurityContext] Failed to get platform version:', error);
    version = 'unknown';
  }
  return `${Platform.OS} ${version}`;
};

const getSessionTimeout = (timeout: SessionTimeout): number => {
  switch (timeout) {
    case 'never': return 0;
    case '5min': return 5 * 60 * 1000;
    case '15min': return 15 * 60 * 1000;
    case '30min': return 30 * 60 * 1000;
    case '1hour': return 60 * 60 * 1000;
    case '4hours': return 4 * 60 * 60 * 1000;
    default: return 30 * 60 * 1000;
  }
};

export const [SecurityProvider, useSecurity] = createContextHook<SecurityState>(() => {
  const [settings, setSettings] = useState<SecuritySettings>(DEFAULT_SECURITY_SETTINGS);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [biometricAvailable, setBiometricAvailable] = useState<boolean>(false);
  const [biometricType, setBiometricType] = useState<LocalAuthentication.AuthenticationType[]>([]);
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([]);
  const [activeSessions, setActiveSessions] = useState<SessionInfo[]>([]);
  const [currentSession, setCurrentSession] = useState<SessionInfo | null>(null);
  const [failedAttempts, setFailedAttempts] = useState<number>(0);
  const [lastActivity, setLastActivity] = useState<number>(Date.now());

  useEffect(() => {
    void loadSecurityData();
    void checkBiometricAvailability();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (checkSessionTimeout()) {
        void lock();
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [settings.sessionTimeout, lastActivity]);

  const loadSecurityData = async () => {
    try {
      const [settingsData, eventsData, sessionsData] = await Promise.all([
        AsyncStorage.getItem(SECURITY_STORAGE_KEY),
        AsyncStorage.getItem(SECURITY_EVENTS_KEY),
        AsyncStorage.getItem(SESSIONS_KEY),
      ]);

      if (settingsData) {
        setSettings({ ...DEFAULT_SECURITY_SETTINGS, ...JSON.parse(settingsData) });
      }
      if (eventsData) {
        setSecurityEvents(JSON.parse(eventsData));
      }
      if (sessionsData) {
        setActiveSessions(JSON.parse(sessionsData));
      }
    } catch (error) {
      console.error('[SecurityContext] Failed to load security data:', error);
    }
  };

  const saveSecurityData = async (key: string, data: any) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error(`[SecurityContext] Failed to save ${key}:`, error);
    }
  };

  const checkBiometricAvailability = useCallback(async () => {
    if (Platform.OS === 'web') {
      setBiometricAvailable(false);
      return;
    }

    try {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
      
      setBiometricAvailable(compatible && enrolled);
      setBiometricType(types);
    } catch (error) {
      console.error('[SecurityContext] Biometric check failed:', error);
      setBiometricAvailable(false);
    }
  }, []);

  const authenticate = useCallback(async (method?: AuthMethod): Promise<boolean> => {
    const authMethod = method || settings.authMethod;
    
    if (authMethod === 'none') {
      setIsAuthenticated(true);
      setIsLocked(false);
      return true;
    }

    try {
      let success = false;

      if (authMethod === 'biometric' || authMethod === 'both') {
        if (biometricAvailable && Platform.OS !== 'web') {
          const result = await LocalAuthentication.authenticateAsync({
            promptMessage: 'Authenticate to access your music',
            cancelLabel: 'Cancel',
            fallbackLabel: 'Use PIN',
          });
          success = result.success;
        }
      }

      if (!success && (authMethod === 'pin' || authMethod === 'both')) {
        // PIN authentication would be handled by UI component
        // This is just the verification logic
        success = true; // Placeholder - actual PIN verification happens in UI
      }

      if (success) {
        setIsAuthenticated(true);
        setIsLocked(false);
        setFailedAttempts(0);
        updateActivity();
        await logSecurityEvent({
          type: 'login',
          details: `Successful authentication using ${authMethod}`,
          severity: 'low',
        });
        await createSession();
      } else {
        const newFailedAttempts = failedAttempts + 1;
        setFailedAttempts(newFailedAttempts);
        
        await logSecurityEvent({
          type: 'failed_auth',
          details: `Failed authentication attempt (${newFailedAttempts}/${settings.maxFailedAttempts})`,
          severity: newFailedAttempts >= settings.maxFailedAttempts ? 'critical' : 'medium',
        });

        if (settings.wipeDataAfterFailedAttempts && newFailedAttempts >= settings.maxFailedAttempts) {
          await wipeAllData();
        }
      }

      return success;
    } catch (error) {
      console.error('[SecurityContext] Authentication failed:', error);
      return false;
    }
  }, [settings, biometricAvailable, failedAttempts]);

  const lock = useCallback(async () => {
    setIsLocked(true);
    setIsAuthenticated(false);
    await logSecurityEvent({
      type: 'logout',
      details: 'App locked',
      severity: 'low',
    });
  }, []);

  const unlock = useCallback(async (method?: AuthMethod): Promise<boolean> => {
    return await authenticate(method);
  }, [authenticate]);

  const updateSecuritySettings = useCallback(async (newSettings: Partial<SecuritySettings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    await saveSecurityData(SECURITY_STORAGE_KEY, updatedSettings);
    
    await logSecurityEvent({
      type: 'settings_change',
      details: `Security settings updated: ${Object.keys(newSettings).join(', ')}`,
      severity: 'medium',
    });
  }, [settings]);

  const logSecurityEvent = useCallback(async (event: Omit<SecurityEvent, 'id' | 'timestamp'>) => {
    if (!settings.logSecurityEvents) return;

    const newEvent: SecurityEvent = {
      ...event,
      id: generateId(),
      timestamp: Date.now(),
    };

    const updatedEvents = [newEvent, ...securityEvents].slice(0, 1000); // Keep last 1000 events
    setSecurityEvents(updatedEvents);
    await saveSecurityData(SECURITY_EVENTS_KEY, updatedEvents);
  }, [settings.logSecurityEvents, securityEvents]);

  const clearSecurityEvents = useCallback(async () => {
    setSecurityEvents([]);
    await AsyncStorage.removeItem(SECURITY_EVENTS_KEY);
  }, []);

  const setupPin = useCallback(async (pin: string) => {
    if (pin.length < 4) {
      throw new Error('PIN must be at least 4 digits');
    }
    await AsyncStorage.setItem(PIN_KEY, pin);
    await updateSecuritySettings({ pinEnabled: true });
  }, [updateSecuritySettings]);

  const verifyPin = useCallback(async (pin: string): Promise<boolean> => {
    try {
      const storedPin = await AsyncStorage.getItem(PIN_KEY);
      return storedPin === pin;
    } catch (error) {
      console.error('[SecurityContext] PIN verification failed:', error);
      return false;
    }
  }, []);

  const changePin = useCallback(async (oldPin: string, newPin: string) => {
    const isValid = await verifyPin(oldPin);
    if (!isValid) {
      throw new Error('Current PIN is incorrect');
    }
    await setupPin(newPin);
  }, [verifyPin, setupPin]);

  const enableTwoFactor = useCallback(async (): Promise<string> => {
    // Generate a simple backup code for demo purposes
    const backupCode = Math.random().toString(36).substr(2, 12).toUpperCase();
    await AsyncStorage.setItem(TWO_FACTOR_KEY, backupCode);
    await updateSecuritySettings({ twoFactorEnabled: true });
    return backupCode;
  }, [updateSecuritySettings]);

  const verifyTwoFactor = useCallback(async (code: string): Promise<boolean> => {
    try {
      const storedCode = await AsyncStorage.getItem(TWO_FACTOR_KEY);
      return storedCode === code.toUpperCase();
    } catch (error) {
      console.error('[SecurityContext] 2FA verification failed:', error);
      return false;
    }
  }, []);

  const createSession = useCallback(async (): Promise<SessionInfo> => {
    const session: SessionInfo = {
      id: generateId(),
      startTime: Date.now(),
      lastActivity: Date.now(),
      isActive: true,
      deviceInfo: getDeviceInfo(),
    };

    setCurrentSession(session);
    const updatedSessions = [...activeSessions, session];
    setActiveSessions(updatedSessions);
    await saveSecurityData(SESSIONS_KEY, updatedSessions);
    
    return session;
  }, [activeSessions]);

  const endSession = useCallback(async (sessionId: string) => {
    const updatedSessions = activeSessions.filter(s => s.id !== sessionId);
    setActiveSessions(updatedSessions);
    await saveSecurityData(SESSIONS_KEY, updatedSessions);
    
    if (currentSession?.id === sessionId) {
      setCurrentSession(null);
      await lock();
    }
  }, [activeSessions, currentSession, lock]);

  const endAllSessions = useCallback(async () => {
    setActiveSessions([]);
    setCurrentSession(null);
    await AsyncStorage.removeItem(SESSIONS_KEY);
    await lock();
  }, [lock]);

  const updateActivity = useCallback(() => {
    const now = Date.now();
    setLastActivity(now);
    
    if (currentSession) {
      const updatedSession = { ...currentSession, lastActivity: now };
      setCurrentSession(updatedSession);
      
      const updatedSessions = activeSessions.map(s => 
        s.id === currentSession.id ? updatedSession : s
      );
      setActiveSessions(updatedSessions);
      void saveSecurityData(SESSIONS_KEY, updatedSessions);
    }
  }, [currentSession, activeSessions]);

  const checkSessionTimeout = useCallback((): boolean => {
    if (settings.sessionTimeout === 'never' || !isAuthenticated) {
      return false;
    }

    const timeoutMs = getSessionTimeout(settings.sessionTimeout);
    const timeSinceActivity = Date.now() - lastActivity;
    
    return timeSinceActivity > timeoutMs;
  }, [settings.sessionTimeout, isAuthenticated, lastActivity]);

  const wipeAllData = useCallback(async () => {
    try {
      await AsyncStorage.clear();
      setSettings(DEFAULT_SECURITY_SETTINGS);
      setSecurityEvents([]);
      setActiveSessions([]);
      setCurrentSession(null);
      setIsAuthenticated(false);
      setIsLocked(true);
      setFailedAttempts(0);
      
      console.log('[SecurityContext] All data wiped due to security policy');
    } catch (error) {
      console.error('[SecurityContext] Failed to wipe data:', error);
    }
  }, []);

  const exportSecurityReport = useCallback(async (): Promise<string> => {
    const report = {
      timestamp: new Date().toISOString(),
      settings,
      events: securityEvents.slice(0, 100), // Last 100 events
      sessions: activeSessions,
      deviceInfo: getDeviceInfo(),
      biometricAvailable,
      biometricType,
    };
    
    return JSON.stringify(report, null, 2);
  }, [settings, securityEvents, activeSessions, biometricAvailable, biometricType]);

  return {
    settings,
    isAuthenticated,
    isLocked,
    biometricAvailable,
    biometricType,
    securityEvents,
    activeSessions,
    currentSession,
    failedAttempts,
    lastActivity,
    authenticate,
    lock,
    unlock,
    updateSecuritySettings,
    logSecurityEvent,
    clearSecurityEvents,
    checkBiometricAvailability,
    setupPin,
    verifyPin,
    changePin,
    enableTwoFactor,
    verifyTwoFactor,
    createSession,
    endSession,
    endAllSessions,
    updateActivity,
    checkSessionTimeout,
    wipeAllData,
    exportSecurityReport,
  };
});