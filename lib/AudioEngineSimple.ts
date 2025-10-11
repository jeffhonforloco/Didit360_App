import { Platform } from 'react-native';
import type { Track } from '@/types';

// Simplified Audio Engine for better reliability
export interface Progress {
  position: number;
  duration: number;
}

export interface AudioEngineEvents {
  onTrackStart?: (track: Track) => void;
  onTrackEnd?: (track: Track) => void;
  onError?: (error: Error) => void;
  onStateChange?: (state: 'loading' | 'playing' | 'paused' | 'stopped') => void;
}

class SimpleAudioEngine {
  private audio: HTMLAudioElement | null = null;
  private currentTrack: Track | null = null;
  private isPlaying = false;
  private volume = 1.0;
  private events: AudioEngineEvents = {};
  private progressSubscribers: Set<(progress: Progress) => void> = new Set();
  private progressInterval: NodeJS.Timeout | null = null;

  constructor() {
    console.log('[SimpleAudioEngine] Initialized');
  }

  async configure(): Promise<void> {
    console.log('[SimpleAudioEngine] Configuring...');
    // No-op for web, but could be used for native setup
  }

  setEvents(events: AudioEngineEvents): void {
    this.events = events;
  }

  async setVolume(volume: number): Promise<void> {
    this.volume = Math.max(0, Math.min(1, volume));
    if (this.audio) {
      this.audio.volume = this.volume;
    }
    console.log('[SimpleAudioEngine] Volume set to:', this.volume);
  }

  getVolume(): number {
    return this.volume;
  }

  async loadAndPlay(track: Track): Promise<void> {
    console.log('[SimpleAudioEngine] Loading and playing:', track.title);
    
    try {
      // Clean up previous audio
      await this.cleanup();
      
      // Create new audio element
      this.audio = new Audio(track.audioUrl);
      this.currentTrack = track;
      
      // Set up event listeners
      this.setupEventListeners();
      
      // Set initial properties
      this.audio.volume = this.volume;
      this.audio.preload = 'auto';
      
      // Try to play
      await this.audio.play();
      this.isPlaying = true;
      
      // Start progress tracking
      this.startProgressTracking();
      
      // Notify listeners
      this.events.onTrackStart?.(track);
      this.events.onStateChange?.('playing');
      
      console.log('[SimpleAudioEngine] Successfully started playing:', track.title);
    } catch (error) {
      console.error('[SimpleAudioEngine] Error loading/playing:', error);
      this.events.onError?.(error as Error);
      this.events.onStateChange?.('stopped');
    }
  }

  async play(): Promise<void> {
    if (this.audio && this.audio.paused) {
      try {
        await this.audio.play();
        this.isPlaying = true;
        this.events.onStateChange?.('playing');
        console.log('[SimpleAudioEngine] Resumed playing');
      } catch (error) {
        console.error('[SimpleAudioEngine] Error resuming:', error);
        this.events.onError?.(error as Error);
      }
    }
  }

  async pause(): Promise<void> {
    if (this.audio && !this.audio.paused) {
      this.audio.pause();
      this.isPlaying = false;
      this.events.onStateChange?.('paused');
      console.log('[SimpleAudioEngine] Paused');
    }
  }

  async stop(): Promise<void> {
    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
      this.isPlaying = false;
      this.events.onStateChange?.('stopped');
      console.log('[SimpleAudioEngine] Stopped');
    }
  }

  async seekTo(positionMs: number): Promise<void> {
    if (this.audio) {
      this.audio.currentTime = positionMs / 1000; // Convert ms to seconds
      console.log('[SimpleAudioEngine] Seeked to:', positionMs, 'ms');
    }
  }

  private setupEventListeners(): void {
    if (!this.audio) return;

    this.audio.addEventListener('ended', () => {
      console.log('[SimpleAudioEngine] Track ended');
      this.isPlaying = false;
      this.events.onTrackEnd?.(this.currentTrack!);
      this.events.onStateChange?.('stopped');
    });

    this.audio.addEventListener('error', (e) => {
      console.error('[SimpleAudioEngine] Audio error:', e);
      this.events.onError?.(new Error('Audio playback error'));
      this.events.onStateChange?.('stopped');
    });

    this.audio.addEventListener('loadstart', () => {
      console.log('[SimpleAudioEngine] Load started');
      this.events.onStateChange?.('loading');
    });

    this.audio.addEventListener('canplay', () => {
      console.log('[SimpleAudioEngine] Can play');
    });

    this.audio.addEventListener('playing', () => {
      console.log('[SimpleAudioEngine] Playing');
      this.isPlaying = true;
      this.events.onStateChange?.('playing');
    });

    this.audio.addEventListener('pause', () => {
      console.log('[SimpleAudioEngine] Paused');
      this.isPlaying = false;
      this.events.onStateChange?.('paused');
    });
  }

  private startProgressTracking(): void {
    this.stopProgressTracking();
    
    this.progressInterval = setInterval(() => {
      if (this.audio && this.currentTrack) {
        const progress: Progress = {
          position: this.audio.currentTime * 1000, // Convert to ms
          duration: this.audio.duration * 1000 || 0, // Convert to ms
        };
        
        this.progressSubscribers.forEach(callback => callback(progress));
      }
    }, 100); // Update every 100ms
  }

  private stopProgressTracking(): void {
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
      this.progressInterval = null;
    }
  }

  subscribeProgress(callback: (progress: Progress) => void): () => void {
    this.progressSubscribers.add(callback);
    
    // Return unsubscribe function
    return () => {
      this.progressSubscribers.delete(callback);
    };
  }

  private async cleanup(): Promise<void> {
    this.stopProgressTracking();
    
    if (this.audio) {
      this.audio.pause();
      this.audio.remove();
      this.audio = null;
    }
    
    this.currentTrack = null;
    this.isPlaying = false;
  }

  async unload(): Promise<void> {
    await this.cleanup();
    console.log('[SimpleAudioEngine] Unloaded');
  }

  getCurrentTrack(): Track | null {
    return this.currentTrack;
  }

  getIsPlaying(): boolean {
    return this.isPlaying;
  }
}

// Export singleton instance
export const simpleAudioEngine = new SimpleAudioEngine();
