import { useCallback, useEffect, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';
import type { Track } from '@/types';

export type DownloadStatus = 'queued' | 'downloading' | 'paused' | 'completed' | 'error' | 'canceled';

export interface DownloadItem {
  id: string;
  track: Track;
  progress: number;
  status: DownloadStatus;
  localUri?: string;
  error?: string;
  createdAt: number;
  updatedAt: number;
}

interface OfflineState {
  downloads: Record<string, DownloadItem>;
  queue: string[];
  activeId: string | null;
  isOnline: boolean;
  isRestoring: boolean;
  requestDownload: (track: Track) => void;
  removeDownload: (id: string) => void;
  pauseDownload: (id: string) => void;
  resumeDownload: (id: string) => void;
  cancelDownload: (id: string) => void;
  clearAllDownloads: () => void;
  getIsDownloaded: (id: string) => boolean;
}

const STORAGE_KEY = 'offline_downloads_v1';

export const [OfflineProvider, useOffline] = createContextHook<OfflineState>(() => {
  const [downloads, setDownloads] = useState<Record<string, DownloadItem>>({});
  const [queue, setQueue] = useState<string[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [isRestoring, setIsRestoring] = useState<boolean>(true);
  const progressTimers = useRef<Record<string, ReturnType<typeof setInterval>>>({});

  useEffect(() => {
    void restore();
    if (typeof window !== 'undefined' && typeof navigator !== 'undefined') {
      const handler = () => setIsOnline(navigator.onLine);
      window.addEventListener('online', handler);
      window.addEventListener('offline', handler);
      setIsOnline(navigator.onLine);
      return () => {
        window.removeEventListener('online', handler);
        window.removeEventListener('offline', handler);
      };
    }
  }, []);

  const persist = useCallback(async (next: Record<string, DownloadItem>) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch (e) {
      console.log('[Offline] persist error', e);
    }
  }, []);

  const restore = useCallback(async () => {
    try {
      setIsRestoring(true);
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Record<string, DownloadItem>;
        setDownloads(parsed);
        const q = Object.values(parsed)
          .filter((d) => d.status === 'queued' || d.status === 'downloading' || d.status === 'paused')
          .map((d) => d.id);
        setQueue(q);
      }
    } catch (e) {
      console.log('[Offline] restore error', e);
    } finally {
      setIsRestoring(false);
    }
  }, []);

  const startNextIfIdle = useCallback(() => {
    if (activeId || queue.length === 0) return;
    const nextId = queue[0];
    setActiveId(nextId);
    const item = downloads[nextId];
    if (!item) return;
    setDownloads((prev) => ({
      ...prev,
      [nextId]: { ...item, status: 'downloading', updatedAt: Date.now() },
    }));
    simulateDownload(item.id);
  }, [activeId, queue, downloads]);

  useEffect(() => {
    startNextIfIdle();
  }, [queue, activeId, downloads, startNextIfIdle]);

  const upsert = useCallback((item: DownloadItem) => {
    setDownloads((prev) => {
      const next = { ...prev, [item.id]: item };
      void persist(next);
      return next;
    });
  }, [persist]);

  const simulateDownload = useCallback((id: string) => {
    const tickMs = 300;
    const totalTicks = 100;
    clearInterval(progressTimers.current[id]);
    progressTimers.current[id] = setInterval(() => {
      setDownloads((prev) => {
        const current = prev[id];
        if (!current) return prev;
        if (current.status !== 'downloading' && current.status !== 'queued') return prev;
        const nextProgress = Math.min(1, (current.progress ?? 0) + 1 / totalTicks);
        const updated: DownloadItem = {
          ...current,
          progress: nextProgress,
          status: nextProgress >= 1 ? 'completed' : 'downloading',
          localUri: nextProgress >= 1 ? (current.track.audioUrl ?? current.track.videoUrl ?? current.track.localUri) : current.localUri,
          updatedAt: Date.now(),
        };
        const next = { ...prev, [id]: updated };
        if (nextProgress >= 1) {
          clearInterval(progressTimers.current[id]);
          setActiveId(null);
          setQueue((q) => q.filter((x) => x !== id));
        }
        void persist(next);
        return next;
      });
    }, tickMs);
  }, [persist]);

  const requestDownload = useCallback((track: Track) => {
    const id = track.id;
    setDownloads((prev) => {
      if (prev[id]?.status === 'completed') return prev;
      const now = Date.now();
      const item: DownloadItem = {
        id,
        track: { ...track, isDownloaded: false },
        progress: 0,
        status: 'queued',
        createdAt: now,
        updatedAt: now,
      };
      const next = { ...prev, [id]: item };
      void persist(next);
      return next;
    });
    setQueue((q) => (q.includes(id) ? q : [...q, id]));
  }, [persist]);

  const pauseDownload = useCallback((id: string) => {
    clearInterval(progressTimers.current[id]);
    setDownloads((prev) => {
      const current = prev[id];
      if (!current) return prev;
      const updated: DownloadItem = { ...current, status: 'paused', updatedAt: Date.now() };
      const next = { ...prev, [id]: updated };
      void persist(next);
      return next;
    });
    setActiveId((a) => (a === id ? null : a));
  }, [persist]);

  const resumeDownload = useCallback((id: string) => {
    setDownloads((prev) => {
      const current = prev[id];
      if (!current) return prev;
      const updated: DownloadItem = { ...current, status: 'downloading', updatedAt: Date.now() };
      const next = { ...prev, [id]: updated };
      void persist(next);
      return next;
    });
    setQueue((q) => (q.includes(id) ? q : [...q, id]));
    if (!activeId) simulateDownload(id);
  }, [persist, activeId, simulateDownload]);

  const cancelDownload = useCallback((id: string) => {
    clearInterval(progressTimers.current[id]);
    setDownloads((prev) => {
      const current = prev[id];
      if (!current) return prev;
      const updated: DownloadItem = { ...current, status: 'canceled', updatedAt: Date.now(), progress: 0 };
      const next = { ...prev, [id]: updated };
      void persist(next);
      return next;
    });
    setQueue((q) => q.filter((x) => x !== id));
    setActiveId((a) => (a === id ? null : a));
  }, [persist]);

  const removeDownload = useCallback((id: string) => {
    clearInterval(progressTimers.current[id]);
    setDownloads((prev) => {
      const next = { ...prev } as Record<string, DownloadItem>;
      delete next[id];
      void persist(next);
      return next;
    });
    setQueue((q) => q.filter((x) => x !== id));
    setActiveId((a) => (a === id ? null : a));
  }, [persist]);

  const clearAllDownloads = useCallback(() => {
    Object.keys(progressTimers.current).forEach((k) => clearInterval(progressTimers.current[k]));
    setDownloads({});
    setQueue([]);
    setActiveId(null);
    void AsyncStorage.removeItem(STORAGE_KEY);
  }, []);

  const getIsDownloaded = useCallback((id: string) => downloads[id]?.status === 'completed', [downloads]);

  return {
    downloads,
    queue,
    activeId,
    isOnline,
    isRestoring,
    requestDownload,
    removeDownload,
    pauseDownload,
    resumeDownload,
    cancelDownload,
    clearAllDownloads,
    getIsDownloaded,
  };
});