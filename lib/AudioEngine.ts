import { Audio, AVPlaybackStatus, AVPlaybackStatusSuccess, InterruptionModeAndroid, InterruptionModeIOS } from 'expo-av';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Track } from '@/types';

type Playable = {
  sound: Audio.Sound | null;
  track: Track | null;
  uri: string | null;
};

export type Progress = { position: number; duration: number; buffered: number };

type EngineState = 'idle' | 'loading' | 'playing' | 'paused' | 'stopped' | 'error';

export type AudioEngineEvents = {
  onTrackStart?: (track: Track) => void;
  onTrackEnd?: (track: Track) => void;
  onError?: (error: unknown) => void;
  onStateChange?: (state: EngineState) => void;
  onProgress?: (p: Progress) => void;
};

const fallbackUris: Record<Track['type'], string> = {
  song: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  podcast: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3',
  audiobook: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3',
  video: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
};

export class AudioEngine {
  private a: Playable = { sound: null, track: null, uri: null };
  private b: Playable = { sound: null, track: null, uri: null };
  private active: 'a' | 'b' = 'a';
  private state: EngineState = 'idle';
  private crossfadeDurationMs = 6000;
  private gapless = true;
  private contentPrefs: Record<Track['type'], { crossfadeMs: number; gapless: boolean }> = {
    song: { crossfadeMs: 6000, gapless: true },
    podcast: { crossfadeMs: 0, gapless: false },
    audiobook: { crossfadeMs: 0, gapless: false },
    video: { crossfadeMs: 0, gapless: false },
  };
  private events: AudioEngineEvents = {};
  private nextTrack: Track | null = null;
  private fadeTimer: null | ReturnType<typeof setInterval> = null;
  private endSub: any = null;
  private isFading = false;
  private progressListeners = new Set<(p: Progress) => void>();

  async configure() {
    try {
      if (Platform.OS !== 'web') {
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          allowsRecordingIOS: false,
          staysActiveInBackground: true,
          interruptionModeIOS: InterruptionModeIOS.DuckOthers,
          shouldDuckAndroid: true,
          interruptionModeAndroid: InterruptionModeAndroid.DuckOthers,
          playThroughEarpieceAndroid: false,
        });
      }
      await this.loadPersistedPrefs();
    } catch (e) {
      console.log('[AudioEngine] configure error', e);
    }
  }

  setEvents(events: AudioEngineEvents) {
    this.events = events;
  }

  private async loadPersistedPrefs() {
    const types: Track['type'][] = ['song', 'podcast', 'audiobook', 'video'];
    for (const t of types) {
      try {
        const v = await AsyncStorage.getItem(`audioPrefs:${t}` as const);
        if (v) {
          const p = JSON.parse(v) as { crossfadeMs: number; gapless: boolean };
          if (typeof p.crossfadeMs === 'number' && typeof p.gapless === 'boolean') {
            this.contentPrefs[t] = { crossfadeMs: Math.max(0, p.crossfadeMs), gapless: p.gapless };
          }
        }
      } catch (e) {
        console.log('[AudioEngine] load prefs error', e);
      }
    }
  }

  setCrossfade(ms: number) {
    this.crossfadeDurationMs = Math.max(0, ms);
  }

  setGapless(enabled: boolean) {
    this.gapless = enabled;
  }

  async setContentPrefs(type: Track['type'], prefs: { crossfadeMs?: number; gapless?: boolean }) {
    const current = this.contentPrefs[type];
    this.contentPrefs[type] = {
      crossfadeMs: Math.max(0, prefs.crossfadeMs ?? current.crossfadeMs),
      gapless: prefs.gapless ?? current.gapless,
    };
    try {
      await AsyncStorage.setItem(`audioPrefs:${type}` as const, JSON.stringify(this.contentPrefs[type]));
    } catch (e) {
      console.log('[AudioEngine] persist prefs error', e);
    }
  }

  private getActive(): Playable {
    return this[this.active];
  }

  private getInactive(): Playable {
    return this[this.active === 'a' ? 'b' : 'a'];
  }

  private setState(s: EngineState) {
    this.state = s;
    if (this.events.onStateChange) this.events.onStateChange(s);
  }

  private trackToUri(track: Track): string {
    if (track.localUri) return track.localUri;
    if (track.isVideo && track.videoUrl) return track.videoUrl;
    if (track.videoUrl && track.type === 'video') return track.videoUrl;
    if (track.audioUrl) return track.audioUrl;
    return fallbackUris[track.type] ?? fallbackUris.song;
  }

  private async unload(playable: Playable) {
    try {
      if (playable.sound) {
        await playable.sound.unloadAsync();
      }
    } catch (e) {
      console.log('[AudioEngine] unload error', e);
    } finally {
      playable.sound = null;
      playable.track = null;
      playable.uri = null;
    }
  }

  private attachEndListener(sound: Audio.Sound, track: Track) {
    if (this.endSub) {
      sound.setOnPlaybackStatusUpdate(null);
      this.endSub = null;
    }
    sound.setOnPlaybackStatusUpdate((status: AVPlaybackStatus) => {
      if (!('isLoaded' in status) || !status.isLoaded) {
        if ('error' in status && status.error) {
          console.log('[AudioEngine] playback status error', status.error);
          this.recoverFromError(track).catch((e) => console.log('[AudioEngine] recover error', e));
        }
        return;
      }
      const s = status as AVPlaybackStatusSuccess;
      try {
        const duration = s.durationMillis ?? 0;
        const position = s.positionMillis ?? 0;
        const buffered = s.playableDurationMillis ?? 0;
        if (this.events.onProgress) this.events.onProgress({ position, duration, buffered });
        this.progressListeners.forEach((cb) => cb({ position, duration, buffered }));
        const remaining = duration > 0 ? Math.max(0, duration - position) : Number.MAX_SAFE_INTEGER;
        const shouldAutoFade = this.crossfadeDurationMs > 0 && !!this.nextTrack && !this.isFading && remaining <= (this.crossfadeDurationMs + 200);
        if (shouldAutoFade && this.nextTrack) {
          this.crossfadeToNext(this.nextTrack).catch((e) => console.log('[AudioEngine] auto-crossfade error', e));
        }
      } catch (e) {
        console.log('[AudioEngine] status handler error', e);
      }
      if (s.didJustFinish) {
        if (this.events.onTrackEnd && track) this.events.onTrackEnd(track);
      }
    });
  }

  async loadAndPlay(track: Track, preloadNext?: Track) {
    console.log('[AudioEngine] loadAndPlay', track.title);
    await this.configure();
    this.setState('loading');
    try {
      const uri = this.trackToUri(track);
      const prefs = this.contentPrefs[track.type];
      this.setCrossfade(prefs.crossfadeMs);
      this.setGapless(prefs.gapless);
      const active = this.getActive();
      await this.unload(active);
      const sound = new Audio.Sound();
      try {
        await sound.loadAsync({ uri }, { shouldPlay: true, volume: 1.0, isLooping: false }, true);
      } catch (e1) {
        console.log('[AudioEngine] primary load failed, trying fallback', e1);
        const fallback = fallbackUris[track.type] ?? uri;
        await sound.loadAsync({ uri: fallback }, { shouldPlay: true, volume: 1.0, isLooping: false }, true);
      }
      active.sound = sound;
      active.track = track;
      active.uri = uri;
      this.attachEndListener(sound, track);
      this.setState('playing');
      if (this.events.onTrackStart) this.events.onTrackStart(track);
      if (preloadNext) {
        this.preload(preloadNext).catch((e) => console.log('[AudioEngine] preload error', e));
      }
    } catch (e) {
      console.log('[AudioEngine] loadAndPlay error', e);
      this.setState('error');
      if (this.events.onError) this.events.onError(e);
    }
  }

  async preload(track: Track) {
    this.nextTrack = track;
    const uri = this.trackToUri(track);
    const inactive = this.getInactive();
    await this.unload(inactive);
    const sound = new Audio.Sound();
    try {
      await sound.loadAsync({ uri }, { shouldPlay: false, volume: 0.0, isLooping: false }, true);
    } catch (e1) {
      console.log('[AudioEngine] preload primary failed, trying fallback', e1);
      const fallback = fallbackUris[track.type] ?? uri;
      await sound.loadAsync({ uri: fallback }, { shouldPlay: false, volume: 0.0, isLooping: false }, true);
    }
    inactive.sound = sound;
    inactive.track = track;
    inactive.uri = uri;
  }

  private clearFade() {
    if (this.fadeTimer) {
      clearInterval(this.fadeTimer);
      this.fadeTimer = null;
    }
    this.isFading = false;
  }

  async crossfadeToNext(next: Track) {
    console.log('[AudioEngine] crossfadeToNext', next.title);
    const from = this.getActive();
    const prefs = this.contentPrefs[next.type];
    this.setCrossfade(prefs.crossfadeMs);
    this.setGapless(prefs.gapless);
    await this.preload(next);
    const to = this.getInactive();
    if (!to.sound) return;

    if (this.crossfadeDurationMs <= 0) {
      try {
        await to.sound.setVolumeAsync(1);
        await to.sound.playAsync();
        if (from.sound) await from.sound.stopAsync();
      } catch (e) {
        console.log('[AudioEngine] instant switch error', e);
      }
      this.active = this.active === 'a' ? 'b' : 'a';
      if (this.events.onTrackStart && to.track) this.events.onTrackStart(to.track);
      return;
    }

    this.isFading = true;
    await to.sound.setVolumeAsync(0);
    await to.sound.playAsync();
    const steps = 24;
    const stepMs = Math.max(16, Math.floor(this.crossfadeDurationMs / steps));
    let i = 0;
    this.clearFade();
    this.isFading = true;
    this.fadeTimer = setInterval(async () => {
      i += 1;
      const t = Math.min(1, i / steps);
      try {
        if (from.sound) await from.sound.setVolumeAsync(1 - t);
        if (to.sound) await to.sound.setVolumeAsync(t);
      } catch (e) {
        console.log('[AudioEngine] fade error', e);
      }
      if (i >= steps) {
        this.clearFade();
        try {
          if (from.sound) await from.sound.stopAsync();
        } catch {}
        this.active = this.active === 'a' ? 'b' : 'a';
        if (this.events.onTrackStart && to.track) this.events.onTrackStart(to.track);
      }
    }, stepMs);
  }

  async play() {
    const active = this.getActive();
    if (active.sound) {
      await active.sound.playAsync();
      this.setState('playing');
    }
  }

  async pause() {
    const active = this.getActive();
    if (active.sound) {
      await active.sound.pauseAsync();
      this.setState('paused');
    }
  }

  async stop() {
    this.clearFade();
    await this.unload(this.a);
    await this.unload(this.b);
    this.setState('stopped');
  }

  async seekTo(ms: number) {
    const active = this.getActive();
    if (active.sound) {
      try {
        await active.sound.setPositionAsync(Math.max(0, Math.floor(ms)));
      } catch (e) {
        console.log('[AudioEngine] seek error', e);
      }
    }
  }

  subscribeProgress(cb: (p: Progress) => void) {
    this.progressListeners.add(cb);
    return () => {
      this.progressListeners.delete(cb);
    };
  }

  getCurrentTrack() {
    const active = this.getActive();
    return active.track;
  }

  async getStatus(): Promise<AVPlaybackStatus | null> {
    const active = this.getActive();
    try {
      if (active.sound) return await active.sound.getStatusAsync();
    } catch (e) {
      console.log('[AudioEngine] getStatus error', e);
    }
    return null;
  }

  private async recoverFromError(track: Track) {
    try {
      const active = this.getActive();
      if (active.track && track.id === active.track.id) {
        await this.loadAndPlay(track, this.nextTrack ?? undefined);
      }
    } catch (e) {
      console.log('[AudioEngine] recoverFromError failed', e);
    }
  }
}

export const audioEngine = new AudioEngine();
