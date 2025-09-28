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
  private hasUserInteracted = false;

  constructor(options: { uri: string }) {
    console.log('[WebAudioPlayer] Creating audio element for:', options.uri);
    
    try {
      this.audio = new Audio(options.uri);
      if (this.audio) {
        this.audio.preload = 'auto';
        this.audio.crossOrigin = 'anonymous';
        
        // Set up user interaction detection for autoplay policy
        this.setupUserInteractionDetection();
        
        this.audio.addEventListener('error', (e) => {
          console.log('[WebAudioPlayer] Audio error:', e);
          console.log('[WebAudioPlayer] Audio error details:', {
            error: this.audio?.error,
            networkState: this.audio?.networkState,
            readyState: this.audio?.readyState,
            src: this.audio?.src
          });
        });
        this.audio.addEventListener('canplaythrough', () => {
          console.log('[WebAudioPlayer] Can play through');
        });
        this.audio.addEventListener('loadstart', () => {
          console.log('[WebAudioPlayer] Load started');
        });
        this.audio.addEventListener('loadeddata', () => {
          console.log('[WebAudioPlayer] Data loaded');
        });
        this.audio.addEventListener('loadedmetadata', () => {
          console.log('[WebAudioPlayer] Metadata loaded, duration:', this.audio?.duration);
        });
        this.audio.addEventListener('play', () => {
          console.log('[WebAudioPlayer] Play event fired');
        });
        this.audio.addEventListener('playing', () => {
          console.log('[WebAudioPlayer] Playing event fired');
        });
        this.audio.addEventListener('pause', () => {
          console.log('[WebAudioPlayer] Pause event fired');
        });
        this.audio.addEventListener('ended', () => {
          console.log('[WebAudioPlayer] Ended event fired');
        });
        
        console.log('[WebAudioPlayer] Audio element created successfully');
      } else {
        console.error('[WebAudioPlayer] Failed to create audio element');
      }
    } catch (error) {
      console.error('[WebAudioPlayer] Error creating audio element:', error);
      throw error;
    }
  }

  private setupUserInteractionDetection() {
    if (typeof window !== 'undefined') {
      const handleUserInteraction = () => {
        this.hasUserInteracted = true;
        console.log('[WebAudioPlayer] User interaction detected');
        // Try to unlock audio context
        this.unlockAudioContext();
        // Remove listeners after first interaction
        this.removeInteractionListeners();
      };
      
      // Store reference to handler for cleanup
      this.interactionHandler = handleUserInteraction;
      
      // Use capture phase to ensure we catch the interaction
      const events = ['click', 'touchstart', 'touchend', 'keydown', 'pointerdown', 'mousedown'];
      events.forEach(event => {
        document.addEventListener(event, handleUserInteraction, { once: false, capture: true });
      });
      
      // Also detect any user interaction immediately if possible
      if (document.hasFocus && document.hasFocus()) {
        this.hasUserInteracted = true;
        this.unlockAudioContext();
      }
    }
  }

  private interactionHandler: (() => void) | null = null;

  private removeInteractionListeners() {
    if (typeof window !== 'undefined' && this.interactionHandler) {
      const events = ['click', 'touchstart', 'touchend', 'keydown', 'pointerdown', 'mousedown'];
      events.forEach(event => {
        document.removeEventListener(event, this.interactionHandler!, { capture: true });
      });
      this.interactionHandler = null;
    }
  }

  private unlockAudioContext() {
    if (this.audio && typeof window !== 'undefined') {
      // Create a silent audio context to unlock web audio
      try {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContext) {
          const audioContext = new AudioContext();
          const buffer = audioContext.createBuffer(1, 1, 22050);
          const source = audioContext.createBufferSource();
          source.buffer = buffer;
          source.connect(audioContext.destination);
          source.start(0);
          console.log('[WebAudioPlayer] Audio context unlocked');
        }
      } catch (e) {
        console.log('[WebAudioPlayer] Audio context unlock failed:', e);
      }
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
        console.log('[WebAudioPlayer] Attempting to play audio...');
        console.log('[WebAudioPlayer] Audio state before play:', {
          readyState: this.audio.readyState,
          networkState: this.audio.networkState,
          paused: this.audio.paused,
          currentTime: this.audio.currentTime,
          duration: this.audio.duration,
          src: this.audio.src,
          volume: this.audio.volume,
          hasUserInteracted: this.hasUserInteracted
        });
        
        // Ensure volume is set properly
        if (this.audio.volume === 0) {
          console.log('[WebAudioPlayer] Volume was 0, setting to 1');
          this.audio.volume = 1;
        }
        
        // Force user interaction detection if not already detected
        if (!this.hasUserInteracted) {
          this.hasUserInteracted = true;
          this.unlockAudioContext();
        }
        
        // Reset audio element if it's in an error state
        if (this.audio.error) {
          console.log('[WebAudioPlayer] Audio element has error, attempting to reload');
          const currentSrc = this.audio.src;
          this.audio.load();
          if (this.audio.src !== currentSrc) {
            this.audio.src = currentSrc;
          }
        }
        
        // Wait for audio to be ready if needed
        if (this.audio.readyState < 2) {
          console.log('[WebAudioPlayer] Waiting for audio to be ready...');
          await new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
              reject(new Error('Audio load timeout'));
            }, 15000); // Increased timeout
            
            const onCanPlay = () => {
              clearTimeout(timeout);
              this.audio?.removeEventListener('canplay', onCanPlay);
              this.audio?.removeEventListener('canplaythrough', onCanPlay);
              this.audio?.removeEventListener('loadeddata', onCanPlay);
              this.audio?.removeEventListener('error', onError);
              resolve(void 0);
            };
            
            const onError = (e: Event) => {
              clearTimeout(timeout);
              this.audio?.removeEventListener('canplay', onCanPlay);
              this.audio?.removeEventListener('canplaythrough', onCanPlay);
              this.audio?.removeEventListener('loadeddata', onCanPlay);
              this.audio?.removeEventListener('error', onError);
              reject(e);
            };
            
            // Listen to multiple ready events
            this.audio?.addEventListener('canplay', onCanPlay, { once: true });
            this.audio?.addEventListener('canplaythrough', onCanPlay, { once: true });
            this.audio?.addEventListener('loadeddata', onCanPlay, { once: true });
            this.audio?.addEventListener('error', onError, { once: true });
            
            // Check if already ready
            if (this.audio && this.audio.readyState >= 2) {
              onCanPlay();
            }
          });
        }
        
        // Direct play attempt with better error handling
        const playPromise = this.audio.play();
        if (playPromise !== undefined) {
          await playPromise;
        }
        
        console.log('[WebAudioPlayer] Play successful, final state:', {
          paused: this.audio.paused,
          volume: this.audio.volume,
          currentTime: this.audio.currentTime
        });
      } catch (e) {
        console.log('[WebAudioPlayer] Play failed:', e);
        console.log('[WebAudioPlayer] Audio state after error:', {
          readyState: this.audio?.readyState,
          networkState: this.audio?.networkState,
          error: this.audio?.error
        });
        
        // If it's an autoplay policy error, try to handle it gracefully
        if (e instanceof Error && (e.name === 'NotAllowedError' || e.name === 'AbortError')) {
          console.log('[WebAudioPlayer] Autoplay was prevented. Waiting for user interaction.');
          // Set up interaction detection if not already done
          if (!this.hasUserInteracted) {
            this.setupUserInteractionDetection();
          }
          // Don't throw for autoplay errors - just log them
          return;
        }
        
        throw e;
      }
    }
  }

  pause() {
    if (this.audio) {
      console.log('[WebAudioPlayer] Pausing audio');
      this.audio.pause();
      console.log('[WebAudioPlayer] Audio paused, state:', {
        paused: this.audio.paused,
        currentTime: this.audio.currentTime
      });
    }
  }

  remove() {
    if (this.audio) {
      this.audio.pause();
      this.audio.src = '';
      this.audio = null;
    }
    this.removeInteractionListeners();
  }
}

let AvAudio: typeof import('expo-av').Audio | null = null;
let AvSound: typeof import('expo-av').Audio.Sound | null = null;

class NativeAudioPlayer implements AudioPlayerLike {
  private sound: import('expo-av').Audio.Sound | null = null;
  private status: import('expo-av').AVPlaybackStatus | null = null;
  private readyPromise: Promise<void>;
  private readyResolved = false;

  constructor(options: { uri: string }) {
    const av = require('expo-av') as typeof import('expo-av');
    AvAudio = av.Audio;
    AvSound = av.Audio.Sound;
    this.readyPromise = this.create(options.uri).catch((e: unknown) => {
      console.log('[NativeAudioPlayer] create error', e);
      throw e;
    });
  }

  private async ensureReady() {
    if (this.readyResolved && this.sound) return;
    try {
      await this.readyPromise;
    } catch (e) {
      console.log('[NativeAudioPlayer] ensureReady error', e);
    }
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
      this.readyResolved = true;
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
    if (!this.sound) return;
    this.sound.setVolumeAsync(Math.max(0, Math.min(1, val))).catch((e) => console.log('[NativeAudioPlayer] setVolume error', e));
  }

  get loop() {
    const st = this.status as import('expo-av').AVPlaybackStatusSuccess | null;
    return st?.isLooping ?? false;
  }
  set loop(val: boolean) {
    if (!this.sound) return;
    this.sound.setIsLoopingAsync(val).catch((e) => console.log('[NativeAudioPlayer] setLoop error', e));
  }

  get currentTime() {
    const st = this.status as import('expo-av').AVPlaybackStatusSuccess | null;
    return ((st?.positionMillis ?? 0) / 1000) || 0;
  }
  set currentTime(val: number) {
    if (!this.sound) return;
    this.sound.setPositionAsync(Math.max(0, Math.floor(val * 1000))).catch((e) => console.log('[NativeAudioPlayer] seek error', e));
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
    await this.ensureReady();
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
    this.readyResolved = false;
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
    console.log('[AudioEngine] Starting configuration...');
    try {
      await this.loadPersistedPrefs();
      if (Platform.OS !== 'web') {
        try {
          // Ensure mode is configured on native
          // eslint-disable-next-line @typescript-eslint/no-var-requires
          const av = require('expo-av') as typeof import('expo-av');
          if (av?.Audio?.setAudioModeAsync) {
            console.log('[AudioEngine] Setting audio mode for native platform');
            await av.Audio.setAudioModeAsync({
              allowsRecordingIOS: false,
              staysActiveInBackground: true,
              playsInSilentModeIOS: true,
              shouldDuckAndroid: true,
              interruptionModeAndroid: 1,
              interruptionModeIOS: 1,
            });
            console.log('[AudioEngine] Audio mode configured successfully');
          }
        } catch (audioError) {
          console.log('[AudioEngine] Audio mode setup error:', audioError);
        }
      } else {
        console.log('[AudioEngine] Web platform detected, setting up web audio context');
        // Initialize web audio context early and set up user interaction detection
        if (typeof window !== 'undefined') {
          try {
            const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
            if (AudioContext) {
              const audioContext = new AudioContext();
              if (audioContext.state === 'suspended') {
                console.log('[AudioEngine] Audio context suspended, setting up user interaction detection');
                // Set up global user interaction detection for web
                this.setupWebUserInteraction();
              }
            }
          } catch (e) {
            console.log('[AudioEngine] Web audio context setup error:', e);
          }
        }
      }
      this.isConfigured = true;
      this.startProgressTracking();
      console.log('[AudioEngine] Configuration completed successfully');
    } catch (e) {
      console.log('[AudioEngine] configure error', e);
      // Mark as configured even if there's an error to prevent infinite retries
      this.isConfigured = true;
    }
  }

  private setupWebUserInteraction() {
    if (typeof window !== 'undefined' && Platform.OS === 'web') {
      const handleFirstInteraction = () => {
        console.log('[AudioEngine] First user interaction detected on web');
        // Try to resume any suspended audio contexts
        try {
          const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
          if (AudioContext) {
            const audioContext = new AudioContext();
            if (audioContext.state === 'suspended') {
              audioContext.resume().then(() => {
                console.log('[AudioEngine] Audio context resumed successfully');
              }).catch((e) => {
                console.log('[AudioEngine] Failed to resume audio context:', e);
              });
            }
          }
        } catch (e) {
          console.log('[AudioEngine] Error handling web user interaction:', e);
        }
        
        // Remove listeners after first interaction
        const events = ['click', 'touchstart', 'keydown', 'mousedown'];
        events.forEach(event => {
          document.removeEventListener(event, handleFirstInteraction, { capture: true });
        });
      };
      
      // Add global interaction listeners
      const events = ['click', 'touchstart', 'keydown', 'mousedown'];
      events.forEach(event => {
        document.addEventListener(event, handleFirstInteraction, { once: true, capture: true });
      });
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
    console.log('[AudioEngine] trackToUri called with:', {
      id: track.id,
      title: track.title,
      type: track.type,
      audioUrl: track.audioUrl,
      localUri: track.localUri,
      isVideo: track.isVideo,
      videoUrl: track.videoUrl
    });
    
    if (track.localUri) {
      console.log('[AudioEngine] Using localUri:', track.localUri);
      return track.localUri;
    }
    if (track.isVideo && track.videoUrl) {
      console.log('[AudioEngine] Using videoUrl for video track:', track.videoUrl);
      return track.videoUrl;
    }
    if (track.videoUrl && track.type === 'video') {
      console.log('[AudioEngine] Using videoUrl for video type:', track.videoUrl);
      return track.videoUrl;
    }
    if (track.audioUrl) {
      console.log('[AudioEngine] Using audioUrl:', track.audioUrl);
      return track.audioUrl;
    }
    
    const fallback = fallbackUris[track.type] ?? fallbackUris.song;
    console.log('[AudioEngine] Using fallback URI:', fallback, 'for type:', track.type);
    return fallback;
  }

  private async createPlayer(uri: string): Promise<AudioPlayerLike> {
    console.log('[AudioEngine] Creating player for platform:', Platform.OS, 'URI:', uri);
    if (Platform.OS === 'web') {
      const player = new WebAudioPlayer({ uri });
      console.log('[AudioEngine] Web audio player created');
      return player;
    }
    const player = new NativeAudioPlayer({ uri });
    console.log('[AudioEngine] Native audio player created');
    return player;
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
    console.log('[AudioEngine] ===== LOAD AND PLAY =====');
    console.log('[AudioEngine] Track:', track.title, 'Type:', track.type);
    console.log('[AudioEngine] Track details:', {
      id: track.id,
      audioUrl: track.audioUrl,
      localUri: track.localUri,
      isVideo: track.isVideo
    });
    
    await this.configure();
    this.setState('loading');
    
    try {
      const uri = this.trackToUri(track);
      console.log('[AudioEngine] Using URI:', uri);
      
      // Validate URI
      if (!uri || uri.trim() === '') {
        throw new Error('Invalid or empty URI');
      }
      
      const prefs = this.contentPrefs[track.type];
      this.setCrossfade(prefs.crossfadeMs);
      this.setGapless(prefs.gapless);
      const active = this.getActive();
      await this.unload(active);
      
      console.log('[AudioEngine] Creating player for URI:', uri);
      const sound = await this.createPlayer(uri);
      
      if (!sound) {
        throw new Error('Failed to create audio player');
      }
      
      sound.volume = 1.0;
      sound.loop = false;
      
      // Set the sound first, then try to play
      active.sound = sound;
      active.track = track;
      active.uri = uri;
      
      console.log('[AudioEngine] Player created, attempting to play...');
      
      try {
        await sound.play();
        console.log('[AudioEngine] ✅ Audio playback started successfully');
      } catch (e1) {
        console.log('[AudioEngine] ❌ Primary play failed, trying fallback:', e1);
        const fallback = fallbackUris[track.type] ?? fallbackUris.song;
        console.log('[AudioEngine] Using fallback URI:', fallback);
        
        // Clean up the failed sound
        try {
          sound.remove();
        } catch (cleanupError) {
          console.log('[AudioEngine] Error cleaning up failed sound:', cleanupError);
        }
        
        const fallbackSound = await this.createPlayer(fallback);
        fallbackSound.volume = 1.0;
        fallbackSound.loop = false;
        
        // Update active with fallback
        active.sound = fallbackSound;
        active.uri = fallback;
        
        console.log('[AudioEngine] Attempting to play fallback audio...');
        await fallbackSound.play();
        console.log('[AudioEngine] ✅ Fallback audio playback started successfully');
      }
      
      this.attachEndListener(active.sound, track);
      this.setState('playing');
      
      // Fire onTrackStart after successful play
      if (this.events.onTrackStart) {
        setTimeout(() => this.events.onTrackStart?.(track), 0);
      }
      
      if (preloadNext) {
        setTimeout(() => {
          this.preload(preloadNext).catch((e) => console.log('[AudioEngine] preload error', e));
        }, 100);
      }
      
      console.log('[AudioEngine] ===== LOAD AND PLAY COMPLETED =====');
    } catch (e) {
      console.log('[AudioEngine] ❌ loadAndPlay error:', e);
      this.setState('error');
      if (this.events.onError) this.events.onError(e);
      throw e; // Re-throw to let caller handle
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
    console.log('[AudioEngine] ===== PLAY() CALLED =====');
    const active = this.getActive();
    console.log('[AudioEngine] Active sound exists:', !!active.sound);
    console.log('[AudioEngine] Active track:', active.track?.title);
    console.log('[AudioEngine] Current state:', this.state);
    
    if (active.sound) {
      try {
        console.log('[AudioEngine] ▶️ Attempting to play audio...');
        console.log('[AudioEngine] Sound state before play:', {
          paused: active.sound.paused,
          volume: active.sound.volume,
          currentTime: active.sound.currentTime,
          duration: active.sound.duration
        });
        
        await active.sound.play();
        this.setState('playing');
        
        console.log('[AudioEngine] ✅ play() successful');
        console.log('[AudioEngine] Sound state after play:', {
          paused: active.sound.paused,
          volume: active.sound.volume,
          currentTime: active.sound.currentTime
        });
      } catch (e) {
        console.log('[AudioEngine] ❌ play error', e);
        this.setState('error');
        if (this.events.onError) this.events.onError(e);
        if (active.track) {
          // Try to recover by reloading the track
          setTimeout(() => {
            this.recoverFromError(active.track!).catch((err) => {
              console.log('[AudioEngine] recovery failed', err);
            });
          }, 1000);
        }
      }
    } else {
      console.log('[AudioEngine] ❌ play() called but no active sound');
      console.log('[AudioEngine] Active playable state:', {
        sound: !!active.sound,
        track: active.track?.title,
        uri: active.uri
      });
    }
    console.log('[AudioEngine] ===== PLAY() FINISHED =====');
  }

  async pause() {
    console.log('[AudioEngine] ===== PAUSE() CALLED =====');
    const active = this.getActive();
    console.log('[AudioEngine] Active sound exists:', !!active.sound);
    console.log('[AudioEngine] Active track:', active.track?.title);
    console.log('[AudioEngine] Current state:', this.state);
    
    if (active.sound) {
      try {
        console.log('[AudioEngine] ⏸️ Attempting to pause audio...');
        console.log('[AudioEngine] Sound state before pause:', {
          paused: active.sound.paused,
          volume: active.sound.volume,
          currentTime: active.sound.currentTime
        });
        
        active.sound.pause();
        this.setState('paused');
        
        console.log('[AudioEngine] ✅ pause() successful');
        console.log('[AudioEngine] Sound state after pause:', {
          paused: active.sound.paused,
          currentTime: active.sound.currentTime
        });
      } catch (e) {
        console.log('[AudioEngine] ❌ pause error', e);
      }
    } else {
      console.log('[AudioEngine] ❌ pause() called but no active sound');
      console.log('[AudioEngine] Active playable state:', {
        sound: !!active.sound,
        track: active.track?.title,
        uri: active.uri
      });
    }
    console.log('[AudioEngine] ===== PAUSE() FINISHED =====');
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
    console.log('[AudioEngine] setVolume called with:', normalizedVolume);
    const active = this.getActive();
    if (active.sound) {
      try {
        active.sound.volume = normalizedVolume;
        console.log('[AudioEngine] Volume set successfully to:', normalizedVolume);
        
        // Also set volume on inactive sound if it exists (for crossfading)
        const inactive = this.getInactive();
        if (inactive.sound && !this.isFading) {
          inactive.sound.volume = normalizedVolume;
        }
      } catch (e) {
        console.log('[AudioEngine] setVolume error', e);
      }
    } else {
      console.log('[AudioEngine] setVolume called but no active sound');
    }
  }

  getVolume(): number {
    const active = this.getActive();
    if (active.sound) {
      try {
        const currentVolume = active.sound.volume;
        console.log('[AudioEngine] getVolume returning:', currentVolume);
        return currentVolume;
      } catch (e) {
        console.log('[AudioEngine] getVolume error', e);
      }
    }
    console.log('[AudioEngine] getVolume returning default: 1.0');
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
