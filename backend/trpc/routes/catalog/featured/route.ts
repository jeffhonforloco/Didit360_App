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
    limit: z.number().optional(),
    type: z.enum(['song', 'video', 'podcast', 'audiobook', 'all']).optional(),
  }).optional())
  .query(async ({ input }) => {
    const limit = input?.limit ?? 10;
    const type = input?.type ?? 'all';
    const now = Date.now();
    
    const allMetrics = Array.from(metricsStore.values());
    
    const filteredMetrics = type === 'all' 
      ? allMetrics 
      : allMetrics.filter(m => m.type === type);
    
    const scoredItems = filteredMetrics.map(metrics => ({
      ...metrics,
      score: calculateFeaturedScore(metrics, now),
    }));
    
    scoredItems.sort((a, b) => b.score - a.score);
    
    const topItems = scoredItems.slice(0, limit);
    
    return {
      items: topItems.map(item => ({
        id: item.id,
        type: item.type,
        score: item.score,
      })),
      algorithm: {
        weights: {
          velocity: 0.4,
          recentStreams: 0.35,
          totalStreams: 0.25,
        },
        decayHalfLife: 24,
      },
      lastUpdated: now,
    };
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
