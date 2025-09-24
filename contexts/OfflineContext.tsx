import { Platform } from 'react-native';
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
  bytesWritten?: number;
  totalBytes?: number;
  attempts?: number;
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
  retryDownload: (id: string) => void;
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

  const nativeResumables = useRef<Record<string, any>>({});
  const abortControllers = useRef<Record<string, AbortController>>({});
  const fileSystemRef = useRef<any>(null);

  useEffect(() => {
    const loadFS = async () => {
      try {
        const mod = await import('expo-file-system');
        fileSystemRef.current = mod;
      } catch (e) {
        fileSystemRef.current = null;
      }
    };
    void loadFS();
  }, []);

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
          .filter((d) => d.status === 'queued' || d.status === 'downloading' || d.status === 'paused' || d.status === 'error')
          .map((d) => d.id);
        setQueue(q);
      }
    } catch (e) {
      console.log('[Offline] restore error', e);
    } finally {
      setIsRestoring(false);
    }
  }, []);

  const upsert = useCallback((item: DownloadItem) => {
    setDownloads((prev) => {
      const next = { ...prev, [item.id]: item };
      void persist(next);
      return next;
    });
  }, [persist]);

  const startNextIfIdle = useCallback(() => {
    if (activeId || queue.length === 0) return;
    const nextId = queue[0];
    const item = downloads[nextId];
    if (!item) return;
    setActiveId(nextId);
    const updated: DownloadItem = { ...item, status: 'downloading', updatedAt: Date.now(), attempts: (item.attempts ?? 0) + 1 };
    upsert(updated);
    void startDownload(nextId, updated.track);
  }, [activeId, queue, downloads, upsert]);

  useEffect(() => {
    startNextIfIdle();
  }, [queue, activeId, downloads, startNextIfIdle]);

  const finishAndDequeue = useCallback((id: string) => {
    setActiveId(null);
    setQueue((q) => q.filter((x) => x !== id));
  }, []);

  const startDownload = useCallback(async (id: string, track: Track) => {
    const uri = track.audioUrl ?? track.videoUrl ?? track.localUri ?? '';
    if (!uri) {
      setDownloads((prev) => {
        const cur = prev[id];
        if (!cur) return prev;
        const updated: DownloadItem = { ...cur, status: 'error', error: 'No media URL', updatedAt: Date.now() };
        const next = { ...prev, [id]: updated };
        void persist(next);
        return next;
      });
      finishAndDequeue(id);
      return;
    }

    if (Platform.OS !== 'web' && fileSystemRef.current?.createDownloadResumable) {
      try {
        const FileSystem = fileSystemRef.current;
        const fileName = `${id}-${Date.now()}.mp4`;
        const fileUri = FileSystem.documentDirectory + fileName;
        const resumable = FileSystem.createDownloadResumable(
          uri,
          fileUri,
          {},
          (progress: { totalBytesWritten: number; totalBytesExpectedToWrite: number }) => {
            const { totalBytesWritten, totalBytesExpectedToWrite } = progress;
            const ratio = totalBytesExpectedToWrite > 0 ? totalBytesWritten / totalBytesExpectedToWrite : 0;
            setDownloads((prev) => {
              const cur = prev[id];
              if (!cur) return prev;
              const updated: DownloadItem = {
                ...cur,
                progress: Math.max(0, Math.min(1, ratio)),
                bytesWritten: totalBytesWritten,
                totalBytes: totalBytesExpectedToWrite,
                updatedAt: Date.now(),
              };
              const next = { ...prev, [id]: updated };
              void persist(next);
              return next;
            });
          }
        );
        nativeResumables.current[id] = resumable;
        const result = await resumable.downloadAsync();
        const localUri = result?.uri ?? fileUri;
        setDownloads((prev) => {
          const cur = prev[id];
          if (!cur) return prev;
          const updated: DownloadItem = { ...cur, status: 'completed', progress: 1, localUri, updatedAt: Date.now() };
          const next = { ...prev, [id]: updated };
          void persist(next);
          return next;
        });
        finishAndDequeue(id);
      } catch (e: unknown) {
        setDownloads((prev) => {
          const cur = prev[id];
          if (!cur) return prev;
          const updated: DownloadItem = { ...cur, status: 'error', error: String(e), updatedAt: Date.now() };
          const next = { ...prev, [id]: updated };
          void persist(next);
          return next;
        });
        finishAndDequeue(id);
      }
      return;
    }

    if (Platform.OS === 'web') {
      try {
        const controller = new AbortController();
        abortControllers.current[id] = controller;
        const res = await fetch(uri, { signal: controller.signal });
        if (!res.ok || !res.body) throw new Error(`HTTP ${res.status}`);
        const contentLength = Number(res.headers.get('content-length') ?? '0');
        const reader = res.body.getReader();
        const chunks: Uint8Array[] = [];
        let received = 0;
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          if (value) {
            chunks.push(value);
            received += value.byteLength;
            const ratio = contentLength > 0 ? received / contentLength : 0;
            setDownloads((prev) => {
              const cur = prev[id];
              if (!cur) return prev;
              const updated: DownloadItem = {
                ...cur,
                progress: Math.max(0, Math.min(1, ratio)),
                bytesWritten: received,
                totalBytes: contentLength || undefined,
                updatedAt: Date.now(),
              };
              const next = { ...prev, [id]: updated };
              void persist(next);
              return next;
            });
          }
        }
        const blob = new Blob(chunks);
        const objectUrl = URL.createObjectURL(blob);
        setDownloads((prev) => {
          const cur = prev[id];
          if (!cur) return prev;
          const updated: DownloadItem = { ...cur, status: 'completed', progress: 1, localUri: objectUrl, updatedAt: Date.now() };
          const next = { ...prev, [id]: updated };
          void persist(next);
          return next;
        });
        finishAndDequeue(id);
      } catch (e: unknown) {
        if ((e as any)?.name === 'AbortError') {
          setDownloads((prev) => {
            const cur = prev[id];
            if (!cur) return prev;
            const updated: DownloadItem = { ...cur, status: 'paused', updatedAt: Date.now() };
            const next = { ...prev, [id]: updated };
            void persist(next);
            return next;
          });
        } else {
          setDownloads((prev) => {
            const cur = prev[id];
            if (!cur) return prev;
            const updated: DownloadItem = { ...cur, status: 'error', error: String(e), updatedAt: Date.now() };
            const next = { ...prev, [id]: updated };
            void persist(next);
            return next;
          });
        }
        finishAndDequeue(id);
      } finally {
        delete abortControllers.current[id];
      }
      return;
    }

    setDownloads((prev) => {
      const cur = prev[id];
      if (!cur) return prev;
      const updated: DownloadItem = { ...cur, status: 'error', error: 'FileSystem unavailable', updatedAt: Date.now() };
      const next = { ...prev, [id]: updated };
      void persist(next);
      return next;
    });
    finishAndDequeue(id);
  }, [finishAndDequeue, persist]);

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
        attempts: 0,
      };
      const next = { ...prev, [id]: item };
      void persist(next);
      return next;
    });
    setQueue((q) => (q.includes(id) ? q : [...q, id]));
  }, [persist]);

  const pauseDownload = useCallback((id: string) => {
    if (Platform.OS !== 'web') {
      const resumable = nativeResumables.current[id];
      if (resumable?.pauseAsync) {
        void resumable.pauseAsync();
      }
    } else {
      const ctr = abortControllers.current[id];
      if (ctr) ctr.abort();
    }
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
    if (Platform.OS !== 'web') {
      const resumable = nativeResumables.current[id];
      if (resumable?.resumeAsync) {
        void resumable.resumeAsync().then((result: any) => {
          if (result?.uri) {
            setDownloads((prev) => {
              const cur = prev[id];
              if (!cur) return prev;
              const updated: DownloadItem = { ...cur, status: 'completed', progress: 1, localUri: result.uri, updatedAt: Date.now() };
              const next = { ...prev, [id]: updated };
              void persist(next);
              return next;
            });
            setActiveId(null);
            setQueue((q) => q.filter((x) => x !== id));
          }
        }).catch(() => {
          setDownloads((prev) => {
            const cur = prev[id];
            if (!cur) return prev;
            const updated: DownloadItem = { ...cur, status: 'error', updatedAt: Date.now(), error: 'Resume failed' };
            const next = { ...prev, [id]: updated };
            void persist(next);
            return next;
          });
          setActiveId(null);
          setQueue((q) => q.filter((x) => x !== id));
        });
        setDownloads((prev) => {
          const current = prev[id];
          if (!current) return prev;
          const updated: DownloadItem = { ...current, status: 'downloading', updatedAt: Date.now() };
          const next = { ...prev, [id]: updated };
          void persist(next);
          return next;
        });
        return;
      }
    }
    setDownloads((prev) => {
      const current = prev[id];
      if (!current) return prev;
      const updated: DownloadItem = { ...current, status: 'downloading', updatedAt: Date.now() };
      const next = { ...prev, [id]: updated };
      void persist(next);
      return next;
    });
    setQueue((q) => (q.includes(id) ? q : [...q, id]));
    if (!activeId) void startDownload(id, downloads[id]?.track as Track);
  }, [persist, activeId, startDownload, downloads]);

  const cancelDownload = useCallback((id: string) => {
    if (Platform.OS !== 'web') {
      const resumable = nativeResumables.current[id];
      if (resumable?.pauseAsync) {
        void resumable.pauseAsync();
      }
      delete nativeResumables.current[id];
    } else {
      const ctr = abortControllers.current[id];
      if (ctr) ctr.abort();
      delete abortControllers.current[id];
    }
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

  const retryDownload = useCallback((id: string) => {
    setDownloads((prev) => {
      const current = prev[id];
      if (!current) return prev;
      const now = Date.now();
      const updated: DownloadItem = { ...current, status: 'queued', error: undefined, updatedAt: now };
      const next = { ...prev, [id]: updated };
      void persist(next);
      return next;
    });
    setQueue((q) => (q.includes(id) ? q : [...q, id]));
  }, [persist]);

  const removeDownload = useCallback((id: string) => {
    if (Platform.OS !== 'web') {
      const resumable = nativeResumables.current[id];
      if (resumable?.pauseAsync) void resumable.pauseAsync();
      delete nativeResumables.current[id];
      const FileSystem = fileSystemRef.current;
      const localUri = downloads[id]?.localUri;
      if (FileSystem?.deleteAsync && localUri) {
        void FileSystem.deleteAsync(localUri, { idempotent: true }).catch(() => {});
      }
    } else {
      const ctr = abortControllers.current[id];
      if (ctr) ctr.abort();
      delete abortControllers.current[id];
      const localUri = downloads[id]?.localUri;
      if (localUri && localUri.startsWith('blob:')) {
        try { URL.revokeObjectURL(localUri); } catch {}
      }
    }
    setDownloads((prev) => {
      const next = { ...prev } as Record<string, DownloadItem>;
      delete next[id];
      void persist(next);
      return next;
    });
    setQueue((q) => q.filter((x) => x !== id));
    setActiveId((a) => (a === id ? null : a));
  }, [persist, downloads]);

  const clearAllDownloads = useCallback(() => {
    if (Platform.OS !== 'web') {
      Object.values(nativeResumables.current).forEach((r: any) => { if (r?.pauseAsync) void r.pauseAsync(); });
    } else {
      Object.values(abortControllers.current).forEach((c) => { try { c.abort(); } catch {} });
    }
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
    retryDownload,
    clearAllDownloads,
    getIsDownloaded,
  };
});