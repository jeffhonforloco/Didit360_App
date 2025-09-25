import { Platform } from 'react-native';
import type { Track } from '@/types';

// Fallback to HTML5 Audio for now until expo-audio is properly configured
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

class SimpleAudioPlayer implements AudioPlayerLike {
  private audio: HTMLAudioElement | null = null;
  
  constructor(options: { uri: string }) {
    if (Platform.OS === 'web') {
      this.audio = new Audio(options.uri);
      if (this.audio) {
        // Optimize for faster loading and playback
        this.audio.preload = 'auto';
        this.audio.crossOrigin = 'anonymous';
        
        // Add error handling
        this.audio.addEventListener('error', (e) => {
          console.log('[SimpleAudioPlayer] Audio error:', e);
        });
        
        // Add loading optimization
        this.audio.addEventListener('canplaythrough', () => {
          console.log('[SimpleAudioPlayer] Can play through');
        });
      }
    }
  }
  
  get volume() { return this.audio?.volume || 0; }
  set volume(val: number) { if (this.audio) this.audio.volume = val; }
  
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
        console.log('[SimpleAudioPlayer] Play error:', e);
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
      // expo-audio handles audio mode configuration automatically
      await this.loadPersistedPrefs();
      this.isConfigured = true;
      this.startProgressTracking();
    } catch (e) {
      console.log('[AudioEngine] configure error', e);
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
          
          // Auto-crossfade logic
          const remaining = durationMs > 0 ? Math.max(0, durationMs - position) : Number.MAX_SAFE_INTEGER;
          const shouldAutoFade = this.crossfadeDurationMs > 0 && !!this.nextTrack && !this.isFading && remaining <= (this.crossfadeDurationMs + 200);
          if (shouldAutoFade && this.nextTrack) {
            this.crossfadeToNext(this.nextTrack).catch((e) => console.log('[AudioEngine] auto-crossfade error', e));
          }
          
          // Check if track ended
          if (durationMs > 0 && position >= durationMs - 100) {
            if (this.events.onTrackEnd && active.track) this.events.onTrackEnd(active.track);
          }
        } catch (e) {
          console.log('[AudioEngine] progress tracking error', e);
        }
      }
    }, 50); // Reduced from 100ms to 50ms for more responsive updates
  }

  setEvents(events: AudioEngineEvents) {
    this.events = events;
  }

  private async loadPersistedPrefs() {
    // Skip storage for now - use defaults
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

  private attachEndListener(sound: AudioPlayerLike, track: Track) {
    if (this.endSub) {
      clearInterval(this.endSub);
      this.endSub = null;
    }
    
    // The global progress tracking will handle this now
    // Just store reference for cleanup
    this.endSub = track;
  }

  async loadAndPlay(track: Track, preloadNext?: Track) {
    console.log('[AudioEngine] loadAndPlay', track.title);
    await this.configure();
    this.setState('loading');
    
    // Immediate UI feedback
    if (this.events.onTrackStart) {
      // Fire immediately for responsive UI
      setTimeout(() => this.events.onTrackStart?.(track), 0);
    }
    
    try {
      const uri = this.trackToUri(track);
      const prefs = this.contentPrefs[track.type];
      this.setCrossfade(prefs.crossfadeMs);
      this.setGapless(prefs.gapless);
      const active = this.getActive();
      await this.unload(active);
      
      // Create and configure sound with optimized settings
      const sound = new SimpleAudioPlayer({ uri });
      sound.volume = 1.0;
      sound.loop = false;
      
      // Preload for faster start
      if (Platform.OS === 'web' && sound instanceof SimpleAudioPlayer) {
        const audio = (sound as any).audio as HTMLAudioElement;
        if (audio) {
          audio.preload = 'auto';
          audio.crossOrigin = 'anonymous';
        }
      }
      
      try {
        await sound.play();
        active.sound = sound;
      } catch (e1) {
        console.log('[AudioEngine] primary load failed, trying fallback', e1);
        const fallback = fallbackUris[track.type] ?? uri;
        const fallbackSound = new SimpleAudioPlayer({ uri: fallback });
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
      
      // Preload next track immediately for seamless transitions
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
    const sound = new SimpleAudioPlayer({ uri });
    try {
      sound.volume = 0.0;
      sound.loop = false;
      // Don't play yet, just prepare
      inactive.sound = sound;
    } catch (e1) {
      console.log('[AudioEngine] preload primary failed, trying fallback', e1);
      const fallback = fallbackUris[track.type] ?? uri;
      const fallbackSound = new SimpleAudioPlayer({ uri: fallback });
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
        // Try to recover
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
        active.sound.currentTime = Math.max(0, Math.floor(ms / 1000)); // Convert to seconds
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

  async getStatus(): Promise<{ currentTime: number; duration: number; isPlaying: boolean } | null> {
    const active = this.getActive();
    try {
      if (active.sound) {
        return {
          currentTime: active.sound.currentTime || 0,
          duration: active.sound.duration || 0,
          isPlaying: !active.sound.paused
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
