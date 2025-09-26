import { Platform } from 'react-native';
import type { Track } from '@/types';

// Cross-platform audio player abstraction
// Web: HTMLAudioElement
// Native: expo-av Audio.Sound

type AudioPlayerLike = {
  volume: number;
  loop: boolean;
  currentTime: number;
  duration: number;
  paused: boolean;
  play(): Promise<void>;
  pause(): void;
  remove(): void;
};

class WebAudioPlayer implements AudioPlayerLike {
  private audio: HTMLAudioElement | null = null;

  constructor(options: { uri: string }) {
    this.audio = new Audio(options.uri);
    if (this.audio) {
      this.audio.preload = 'auto';
      this.audio.crossOrigin = 'anonymous';
      this.audio.addEventListener('error', (e) => {
        console.log('[WebAudioPlayer] Audio error:', e);
      });
      this.audio.addEventListener('canplaythrough', () => {
        console.log('[WebAudioPlayer] Can play through');
      });
    }
  }

  get volume() { return this.audio?.volume || 0; }
  set volume(val: number) { if (this.audio) this.audio.volume = Math.max(0, Math.min(1, val)); }

  get loop() { return this.audio?.loop || false; }
  set loop(val: boolean) { if (this.audio) this.audio.loop = val; }

  get currentTime() { return this.audio?.currentTime || 0; }
  set currentTime(val: number) { if (this.audio) this.audio.currentTime = val; }

  get duration() { return this.audio?.duration || 0; }
  get paused() { return this.audio?.paused ?? true; }

  async play() {
    if (this.audio) {
      try {
        await this.audio.play();
      } catch (e) {
        console.log('[WebAudioPlayer] Play error:', e);
        throw e;
      }
    }
  }

  pause() {
    if (this.audio) {
      this.audio.pause();
    }
  }

  remove() {
    if (this.audio) {
      this.audio.pause();
      this.audio.src = '';
      this.audio = null;
    }
  }
}

let AvAudio: typeof import('expo-av').Audio | null = null;
let AvSound: typeof import('expo-av').Audio.Sound | null = null;

class NativeAudioPlayer implements AudioPlayerLike {
  private sound: import('expo-av').Audio.Sound | null = null;
  private status: import('expo-av').AVPlaybackStatus | null = null;

  constructor(options: { uri: string }) {
    // Lazy import to avoid crashing on web
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const av = require('expo-av') as typeof import('expo-av');
    AvAudio = av.Audio;
    AvSound = av.Audio.Sound;
    this.create(options.uri).catch((e: unknown) => {
      console.log('[NativeAudioPlayer] create error', e);
    });
  }

  private async create(uri: string) {
    if (!AvSound || !AvAudio) return;
    try {
      await AvAudio.setAudioModeAsync({
        allowsRecordingIOS: false,
        staysActiveInBackground: true,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        interruptionModeAndroid: 1,
        interruptionModeIOS: 1,
      });
      const { sound } = await AvSound.createAsync({ uri }, { volume: 1, shouldPlay: false, isLooping: false });
      this.sound = sound;
      sound.setOnPlaybackStatusUpdate((st) => {
        this.status = st;
      });
    } catch (e) {
      console.log('[NativeAudioPlayer] createAsync error', e);
      throw e;
    }
  }

  get volume() {
    if (!this.sound) return 0;
    const st = this.status as import('expo-av').AVPlaybackStatusSuccess | null;
    return st?.volume ?? 1;
  }
  set volume(val: number) {
    if (this.sound) this.sound.setVolumeAsync(Math.max(0, Math.min(1, val))).catch((e) => console.log('[NativeAudioPlayer] setVolume error', e));
  }

  get loop() {
    const st = this.status as import('expo-av').AVPlaybackStatusSuccess | null;
    return st?.isLooping ?? false;
  }
  set loop(val: boolean) {
    if (this.sound) this.sound.setIsLoopingAsync(val).catch((e) => console.log('[NativeAudioPlayer] setLoop error', e));
  }

  get currentTime() {
    const st = this.status as import('expo-av').AVPlaybackStatusSuccess | null;
    return ((st?.positionMillis ?? 0) / 1000) || 0;
  }
  set currentTime(val: number) {
    if (this.sound) this.sound.setPositionAsync(Math.max(0, Math.floor(val * 1000))).catch((e) => console.log('[NativeAudioPlayer] seek error', e));
  }

  get duration() {
    const st = this.status as import('expo-av').AVPlaybackStatusSuccess | null;
    return ((st?.durationMillis ?? 0) / 1000) || 0;
  }

  get paused() {
    const st = this.status as import('expo-av').AVPlaybackStatusSuccess | null;
    return !(st?.isPlaying ?? false);
  }

  async play() {
    if (!this.sound) throw new Error('Sound not initialized');
    try {
      await this.sound.playAsync();
    } catch (e) {
      console.log('[NativeAudioPlayer] play error', e);
      throw e;
    }
  }

  pause() {
    if (!this.sound) return;
    this.sound.pauseAsync().catch((e) => console.log('[NativeAudioPlayer] pause error', e));
  }

  remove() {
    if (!this.sound) return;
    try {
      this.sound.stopAsync().catch(() => {});
      this.sound.unloadAsync().catch(() => {});
    } catch {}
    this.sound = null;
    this.status = null;
  }
}

type Playable = {
  sound: AudioPlayerLike | null;
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
  private progressInterval: ReturnType<typeof setInterval> | null = null;
  private isConfigured = false;

  async configure() {
    if (this.isConfigured) return;
    try {
      await this.loadPersistedPrefs();
      if (Platform.OS !== 'web') {
        try {
          // Ensure mode is configured on native
          // eslint-disable-next-line @typescript-eslint/no-var-requires
          const av = require('expo-av') as typeof import('expo-av');
          if (av?.Audio?.setAudioModeAsync) {
            await av.Audio.setAudioModeAsync({
              allowsRecordingIOS: false,
              staysActiveInBackground: true,
              playsInSilentModeIOS: true,
              shouldDuckAndroid: true,
              interruptionModeAndroid: 1,
              interruptionModeIOS: 1,
            });
          }
        } catch (audioError) {
          console.log('[AudioEngine] Audio mode setup error:', audioError);
        }
      }
      this.isConfigured = true;
      this.startProgressTracking();
    } catch (e) {
      console.log('[AudioEngine] configure error', e);
      // Mark as configured even if there's an error to prevent infinite retries
      this.isConfigured = true;
    }
  }

  private startProgressTracking() {
    if (this.progressInterval) return;
    this.progressInterval = setInterval(() => {
      const active = this.getActive();
      if (active.sound && active.track) {
        try {
          const currentTime = active.sound.currentTime || 0;
          const duration = active.sound.duration || 0;
          const position = currentTime * 1000;
          const durationMs = duration * 1000;
          const buffered = durationMs;
          const progress = { position, duration: durationMs, buffered };
          if (this.events.onProgress) this.events.onProgress(progress);
          this.progressListeners.forEach((cb) => cb(progress));
          const remaining = durationMs > 0 ? Math.max(0, durationMs - position) : Number.MAX_SAFE_INTEGER;
          const shouldAutoFade = this.crossfadeDurationMs > 0 && !!this.nextTrack && !this.isFading && remaining <= (this.crossfadeDurationMs + 200);
          if (shouldAutoFade && this.nextTrack) {
            this.crossfadeToNext(this.nextTrack).catch((e) => console.log('[AudioEngine] auto-crossfade error', e));
          }
          if (durationMs > 0 && position >= durationMs - 100) {
            if (this.events.onTrackEnd && active.track) this.events.onTrackEnd(active.track);
          }
        } catch (e) {
          console.log('[AudioEngine] progress tracking error', e);
        }
      }
    }, 50);
  }

  setEvents(events: AudioEngineEvents) {
    this.events = events;
  }

  private async loadPersistedPrefs() {
    console.log('[AudioEngine] Using default preferences');
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
    console.log('[AudioEngine] Updated prefs for', type, this.contentPrefs[type]);
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

  private async createPlayer(uri: string): Promise<AudioPlayerLike> {
    if (Platform.OS === 'web') {
      return new WebAudioPlayer({ uri });
    }
    return new NativeAudioPlayer({ uri });
  }

  private async unload(playable: Playable) {
    try {
      if (playable.sound) {
        playable.sound.pause();
        playable.sound.remove();
      }
    } catch (e) {
      console.log('[AudioEngine] unload error', e);
    } finally {
      playable.sound = null;
      playable.track = null;
      playable.uri = null;
    }
  }

  private attachEndListener(_sound: AudioPlayerLike, track: Track) {
    if (this.endSub) {
      clearInterval(this.endSub);
      this.endSub = null;
    }
    this.endSub = track;
  }

  async loadAndPlay(track: Track, preloadNext?: Track) {
    console.log('[AudioEngine] loadAndPlay', track.title);
    await this.configure();
    this.setState('loading');
    if (this.events.onTrackStart) {
      setTimeout(() => this.events.onTrackStart?.(track), 0);
    }
    try {
      const uri = this.trackToUri(track);
      const prefs = this.contentPrefs[track.type];
      this.setCrossfade(prefs.crossfadeMs);
      this.setGapless(prefs.gapless);
      const active = this.getActive();
      await this.unload(active);
      const sound = await this.createPlayer(uri);
      sound.volume = 1.0;
      sound.loop = false;
      try {
        await sound.play();
        active.sound = sound;
      } catch (e1) {
        console.log('[AudioEngine] primary load failed, trying fallback', e1);
        const fallback = fallbackUris[track.type] ?? uri;
        const fallbackSound = await this.createPlayer(fallback);
        fallbackSound.volume = 1.0;
        fallbackSound.loop = false;
        await fallbackSound.play();
        sound.remove();
        active.sound = fallbackSound;
      }
      active.track = track;
      active.uri = uri;
      this.attachEndListener(active.sound, track);
      this.setState('playing');
      if (preloadNext) {
        setTimeout(() => {
          this.preload(preloadNext).catch((e) => console.log('[AudioEngine] preload error', e));
        }, 100);
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
    const sound = await this.createPlayer(uri);
    try {
      sound.volume = 0.0;
      sound.loop = false;
      inactive.sound = sound;
    } catch (e1) {
      console.log('[AudioEngine] preload primary failed, trying fallback', e1);
      const fallback = fallbackUris[track.type] ?? uri;
      const fallbackSound = await this.createPlayer(fallback);
      fallbackSound.volume = 0.0;
      fallbackSound.loop = false;
      sound.remove();
      inactive.sound = fallbackSound;
    }
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
        to.sound.volume = 1;
        await to.sound.play();
        if (from.sound) from.sound.pause();
      } catch (e) {
        console.log('[AudioEngine] instant switch error', e);
      }
      this.active = this.active === 'a' ? 'b' : 'a';
      if (this.events.onTrackStart && to.track) this.events.onTrackStart(to.track);
      return;
    }

    this.isFading = true;
    to.sound.volume = 0;
    await to.sound.play();
    const steps = 24;
    const stepMs = Math.max(16, Math.floor(this.crossfadeDurationMs / steps));
    let i = 0;
    this.clearFade();
    this.isFading = true;
    this.fadeTimer = setInterval(async () => {
      i += 1;
      const t = Math.min(1, i / steps);
      try {
        if (from.sound) from.sound.volume = 1 - t;
        if (to.sound) to.sound.volume = t;
      } catch (e) {
        console.log('[AudioEngine] fade error', e);
      }
      if (i >= steps) {
        this.clearFade();
        try {
          if (from.sound) from.sound.pause();
        } catch {}
        this.active = this.active === 'a' ? 'b' : 'a';
        if (this.events.onTrackStart && to.track) this.events.onTrackStart(to.track);
      }
    }, stepMs);
  }

  async play() {
    const active = this.getActive();
    if (active.sound) {
      try {
        await active.sound.play();
        this.setState('playing');
      } catch (e) {
        console.log('[AudioEngine] play error', e);
        if (active.track) {
          this.recoverFromError(active.track);
        }
      }
    }
  }

  async pause() {
    const active = this.getActive();
    if (active.sound) {
      try {
        active.sound.pause();
        this.setState('paused');
      } catch (e) {
        console.log('[AudioEngine] pause error', e);
      }
    }
  }

  async stop() {
    this.clearFade();
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
      this.progressInterval = null;
    }
    if (this.endSub) {
      if (typeof this.endSub === 'number') {
        clearInterval(this.endSub);
      }
      this.endSub = null;
    }
    await this.unload(this.a);
    await this.unload(this.b);
    this.setState('stopped');
    this.isConfigured = false;
  }

  async seekTo(ms: number) {
    const active = this.getActive();
    if (active.sound) {
      try {
        active.sound.currentTime = Math.max(0, Math.floor(ms / 1000));
      } catch (e) {
        console.log('[AudioEngine] seek error', e);
      }
    }
  }

  async setVolume(volume: number) {
    const normalizedVolume = Math.max(0, Math.min(1, volume));
    const active = this.getActive();
    if (active.sound) {
      try {
        active.sound.volume = normalizedVolume;
      } catch (e) {
        console.log('[AudioEngine] setVolume error', e);
      }
    }
  }

  getVolume(): number {
    const active = this.getActive();
    if (active.sound) {
      try {
        return active.sound.volume;
      } catch (e) {
        console.log('[AudioEngine] getVolume error', e);
      }
    }
    return 1.0;
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

  async getStatus(): Promise<{ currentTime: number; duration: number; isPlaying: boolean } | null> {
    const active = this.getActive();
    try {
      if (active.sound) {
        return {
          currentTime: active.sound.currentTime || 0,
          duration: active.sound.duration || 0,
          isPlaying: !active.sound.paused,
        };
      }
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
