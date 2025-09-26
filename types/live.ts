export type TransitionStyle = 'fade' | 'echo' | 'cut' | 'drop';
export type ExplicitFilter = 'off' | 'moderate' | 'strict';
export type Mood = 'chill' | 'groove' | 'hype' | 'ecstatic';

export interface TrackLite {
  id: string;
  title: string;
  artist: string;
  bpm?: number;
  key?: string;
  durationSec?: number;
  artwork?: string;
}

export interface LivePromptConfig {
  vibe: string;
  genres: string[];
  decades?: string[];
  regions?: string[];
  mood?: Mood;
  energy?: number;
  tempoRangeBPM?: [number, number];
  transitionStyle?: TransitionStyle;
  keyLock?: boolean;
  doNotPlay?: string[];
  explicitFilter?: ExplicitFilter;
  durationMinutes: number;
}

export interface LiveStartResponse {
  sessionId: string;
  startedAt: string;
  castStatus: 'idle' | 'pairing' | 'casting';
  nowPlaying?: TrackLite;
  nextUp: TrackLite[];
}

export interface LiveParams {
  energy?: number;
  transitionStyle?: TransitionStyle;
}

export interface PairingResponse {
  sessionId: string;
  pairingUrl: string;
  expiresAt: string;
}

export interface SafetyUpdate {
  doNotPlay?: string[];
  explicitFilter?: ExplicitFilter;
  safeMode?: boolean;
}

export interface Health {
  latencyMs: number;
  bufferMs: number;
  droppedPkts: number;
  network: 'good' | 'fair' | 'poor';
}
