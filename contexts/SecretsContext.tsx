import React, { useCallback, useMemo, useState } from 'react';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import createContextHook from '@nkzw/create-context-hook';

export type SecretScope = 'video' | 'audio' | 'search' | 'other';

export interface SecretItem {
  key: string;
  scope: SecretScope;
  updatedAt: number;
}

interface SecretsState {
  list: SecretItem[];
  getSecret: (key: string) => Promise<string | null>;
  setSecret: (key: string, value: string, scope?: SecretScope) => Promise<void>;
  deleteSecret: (key: string) => Promise<void>;
  hasSecureStorage: boolean;
}

const LIST_KEY = 'secrets:list:v1';

async function webSetItem(key: string, value: string): Promise<void> {
  await AsyncStorage.setItem(key, value);
}

async function webGetItem(key: string): Promise<string | null> {
  const v = await AsyncStorage.getItem(key);
  return v;
}

async function webDeleteItem(key: string): Promise<void> {
  await AsyncStorage.removeItem(key);
}

export const [SecretsProvider, useSecrets] = createContextHook<SecretsState>(() => {
  const [list, setList] = useState<SecretItem[]>([]);
  const [hasSecureStorage] = useState<boolean>(Platform.OS !== 'web');

  React.useEffect(() => {
    void (async () => {
      try {
        const raw = await AsyncStorage.getItem(LIST_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as SecretItem[];
          setList(parsed);
        }
      } catch (e) {
        console.error('[Secrets] load list failed', e);
      }
    })();
  }, []);

  const persistList = useCallback(async (items: SecretItem[]) => {
    setList(items);
    try {
      await AsyncStorage.setItem(LIST_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('[Secrets] save list failed', e);
    }
  }, []);

  const getSecret = useCallback(async (key: string): Promise<string | null> => {
    const k = (key ?? '').trim();
    if (!k || k.length > 128) return null;
    try {
      if (Platform.OS === 'web') {
        return await webGetItem(`secret:${k}`);
      }
      const v = await SecureStore.getItemAsync(`secret:${k}`);
      return v ?? null;
    } catch (e) {
      console.error('[Secrets] get failed', e);
      return null;
    }
  }, []);

  const setSecret = useCallback(async (key: string, value: string, scope: SecretScope = 'other') => {
    const k = (key ?? '').trim();
    const v = (value ?? '').toString();
    if (!k || k.length > 128) throw new Error('Invalid key');
    if (!v || v.length > 4096) throw new Error('Invalid value');
    try {
      if (Platform.OS === 'web') {
        await webSetItem(`secret:${k}`, v);
      } else {
        await SecureStore.setItemAsync(`secret:${k}`, v, { keychainAccessible: SecureStore.AFTER_FIRST_UNLOCK });
      }
      const existing = list.filter(i => i.key !== k);
      const updated = [...existing, { key: k, scope, updatedAt: Date.now() }];
      await persistList(updated);
    } catch (e) {
      console.error('[Secrets] set failed', e);
      throw e as Error;
    }
  }, [list, persistList]);

  const deleteSecret = useCallback(async (key: string) => {
    const k = (key ?? '').trim();
    if (!k || k.length > 128) return;
    try {
      if (Platform.OS === 'web') {
        await webDeleteItem(`secret:${k}`);
      } else {
        await SecureStore.deleteItemAsync(`secret:${k}`);
      }
      const updated = list.filter(i => i.key !== k);
      await persistList(updated);
    } catch (e) {
      console.error('[Secrets] delete failed', e);
      throw e as Error;
    }
  }, [list, persistList]);

  const value = useMemo<SecretsState>(() => ({ list, getSecret, setSecret, deleteSecret, hasSecureStorage }), [list, getSecret, setSecret, deleteSecret, hasSecureStorage]);
  return value;
});
