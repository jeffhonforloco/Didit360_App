import { z } from "zod";
import { publicProcedure } from "@/backend/trpc/create-context";

// Mock track schema for now
const TrackSchema = z.object({
  id: z.number(),
  canonical_id: z.string(),
  title: z.string(),
  duration_ms: z.number().optional(),
  explicit: z.boolean(),
  track_no: z.number().optional(),
  disc_no: z.number(),
  preview_uri: z.string().optional(),
  media_type: z.literal('audio'),
  genres: z.array(z.string()),
  external_ids: z.record(z.string(), z.string()),
  metadata: z.record(z.string(), z.any()),
  created_at: z.string(),
  updated_at: z.string(),
  version: z.number(),
  etag: z.string().optional(),
  is_active: z.boolean(),
  quality_score: z.number(),
});

export const getTrackProcedure = publicProcedure
  .input(z.object({ id: z.string() }))
  .output(TrackSchema.nullable())
  .query(async ({ input }) => {
    console.log(`[catalog] Getting track: ${input.id}`);
    
    // Mock track data
    if (input.id === 'track-1') {
      return {
        id: 1,
        canonical_id: 'track:sunset',
        title: 'Sunset',
        duration_ms: 240000,
        explicit: false,
        track_no: 1,
        disc_no: 1,
        preview_uri: 'https://example.com/preview/sunset.mp3',
        media_type: 'audio' as const,
        genres: ['synthwave', 'electronic'],
        external_ids: {},
        metadata: {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        version: 1,
        etag: '"abc123"',
        is_active: true,
        quality_score: 0.8,
      };
    }
    
    console.log(`[catalog] Track not found: ${input.id}`);
    return null;
  });
