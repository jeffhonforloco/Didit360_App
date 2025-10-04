import { publicProcedure } from "../../../create-context";
import { z } from "zod";

interface StreamingMetrics {
  id: string;
  type: 'song' | 'video' | 'podcast' | 'audiobook';
  streams: number;
  recentStreams: number;
  velocity: number;
  lastUpdated: number;
}

const metricsStore = new Map<string, StreamingMetrics>();

function calculateFeaturedScore(metrics: StreamingMetrics, now: number): number {
  const ageHours = (now - metrics.lastUpdated) / (1000 * 60 * 60);
  const decayFactor = Math.exp(-ageHours / 24);
  
  const velocityScore = metrics.velocity * 0.4;
  const recentStreamsScore = (metrics.recentStreams / 1000) * 0.35;
  const totalStreamsScore = (metrics.streams / 10000) * 0.25;
  
  return (velocityScore + recentStreamsScore + totalStreamsScore) * decayFactor;
}

export const getFeaturedProcedure = publicProcedure
  .input(z.object({
    limit: z.number().optional().default(10),
    type: z.enum(['song', 'video', 'podcast', 'audiobook', 'all']).optional().default('all'),
  }).optional().default({ limit: 10, type: 'all' }))
  .query(async ({ input }) => {
    const limit = input.limit;
    
    const mockFeaturedTracks = [
      {
        id: "featured-1",
        title: "Neon Dreams",
        artist: "Synthwave Collective",
        album: "Retro Future",
        artwork: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800",
        duration: 245,
        type: "song" as const,
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
      },
      {
        id: "featured-2",
        title: "Electric Horizon",
        artist: "Digital Pulse",
        album: "Cyber City",
        artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800",
        duration: 198,
        type: "song" as const,
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
      },
      {
        id: "featured-3",
        title: "Midnight Drive",
        artist: "Neon Lights",
        album: "Urban Dreams",
        artwork: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800",
        duration: 210,
        type: "song" as const,
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
      },
      {
        id: "featured-4",
        title: "Cosmic Journey",
        artist: "Space Voyager",
        album: "Interstellar",
        artwork: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800",
        duration: 280,
        type: "song" as const,
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
      },
      {
        id: "featured-5",
        title: "Tokyo Nights",
        artist: "Urban Echo",
        album: "City Lights",
        artwork: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800",
        duration: 195,
        type: "song" as const,
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
      },
      {
        id: "featured-6",
        title: "Ocean Breeze",
        artist: "Coastal Vibes",
        album: "Seaside",
        artwork: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800",
        duration: 220,
        type: "song" as const,
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
      },
      {
        id: "featured-7",
        title: "Desert Storm",
        artist: "Sandstorm",
        album: "Dunes",
        artwork: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800",
        duration: 235,
        type: "song" as const,
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
      },
      {
        id: "featured-8",
        title: "Mountain Peak",
        artist: "Alpine Sound",
        album: "Summit",
        artwork: "https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=800",
        duration: 265,
        type: "song" as const,
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
      },
    ];
    
    return mockFeaturedTracks.slice(0, limit);
  });

export const trackStreamProcedure = publicProcedure
  .input(z.object({
    id: z.string(),
    type: z.enum(['song', 'video', 'podcast', 'audiobook']),
  }))
  .mutation(async ({ input }) => {
    const now = Date.now();
    const existing = metricsStore.get(input.id);
    
    if (existing) {
      const timeSinceLastStream = now - existing.lastUpdated;
      const hoursElapsed = timeSinceLastStream / (1000 * 60 * 60);
      
      const newVelocity = hoursElapsed > 0 
        ? (existing.recentStreams + 1) / hoursElapsed 
        : existing.velocity;
      
      metricsStore.set(input.id, {
        ...existing,
        streams: existing.streams + 1,
        recentStreams: existing.recentStreams + 1,
        velocity: newVelocity,
        lastUpdated: now,
      });
    } else {
      metricsStore.set(input.id, {
        id: input.id,
        type: input.type,
        streams: 1,
        recentStreams: 1,
        velocity: 1,
        lastUpdated: now,
      });
    }
    
    return { success: true };
  });

export const getMetricsProcedure = publicProcedure
  .input(z.object({
    id: z.string(),
  }))
  .query(async ({ input }) => {
    const metrics = metricsStore.get(input.id);
    
    if (!metrics) {
      return null;
    }
    
    const now = Date.now();
    const score = calculateFeaturedScore(metrics, now);
    
    return {
      ...metrics,
      score,
    };
  });

setInterval(() => {
  const now = Date.now();
  const oneHourAgo = now - (60 * 60 * 1000);
  
  for (const [id, metrics] of metricsStore.entries()) {
    if (metrics.lastUpdated < oneHourAgo) {
      metricsStore.set(id, {
        ...metrics,
        recentStreams: Math.floor(metrics.recentStreams * 0.9),
        velocity: metrics.velocity * 0.9,
      });
    }
  }
}, 5 * 60 * 1000);
