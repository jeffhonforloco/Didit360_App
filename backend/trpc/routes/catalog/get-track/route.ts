import { z } from "zod";
import { publicProcedure } from "../../../create-context";

// Enhanced catalog track schema
const CatalogTrackSchema = z.object({
  id: z.string(),
  canonical_id: z.string(),
  title: z.string(),
  isrc: z.string().optional(),
  release_id: z.string().optional(),
  duration_ms: z.number().optional(),
  explicit: z.boolean(),
  track_no: z.number().optional(),
  disc_no: z.number(),
  preview_uri: z.string().optional(),
  stream_uri: z.string().optional(),
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

// Mock data for now - in production this would query the database
const mockTracks = new Map([
  ['track-1', {
    id: 'track-1',
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
  }],
  ['track-2', {
    id: 'track-2',
    canonical_id: 'track:get-lucky',
    title: 'Get Lucky',
    duration_ms: 367000,
    explicit: false,
    track_no: 8,
    disc_no: 1,
    preview_uri: 'https://example.com/preview/get-lucky.mp3',
    media_type: 'audio' as const,
    genres: ['electronic', 'disco'],
    external_ids: {},
    metadata: {},
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    version: 1,
    etag: '"def456"',
    is_active: true,
    quality_score: 0.9,
  }],
]);

export const getTrackProcedure = publicProcedure
  .input(z.object({ id: z.string() }))
  .output(CatalogTrackSchema.nullable())
  .query(async ({ input }) => {
    console.log(`[catalog] Getting track: ${input.id}`);
    
    const track = mockTracks.get(input.id);
    if (!track) {
      console.log(`[catalog] Track not found: ${input.id}`);
      return null;
    }
    
    return track;
  });
