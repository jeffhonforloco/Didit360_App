import { z } from "zod";
import { publicProcedure } from "@/backend/trpc/create-context";
import type { CatalogTrack } from "@/types/catalog";

// Track schema matching CatalogTrack type
const TrackSchema = z.object({
  id: z.string(),
  canonical_id: z.string(),
  isrc: z.string().optional(),
  title: z.string(),
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
  artists: z.array(z.any()).optional(),
  release: z.any().optional(),
  audio_features: z.any().optional(),
});

export const getTrackProcedure = publicProcedure
  .input(z.object({ id: z.string() }))
  .output(TrackSchema.nullable())
  .query(async ({ input }): Promise<CatalogTrack | null> => {
    console.log(`[catalog] Getting track: ${input.id}`);
    
    // Mock track data
    if (input.id === 'track-1' || input.id === '1') {
      const track: CatalogTrack = {
        id: '1',
        canonical_id: 'track:sunset',
        isrc: 'USRC17607839',
        title: 'Sunset Dreams',
        release_id: 'release-1',
        duration_ms: 240000,
        explicit: false,
        track_no: 1,
        disc_no: 1,
        preview_uri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
        stream_uri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
        media_type: 'audio',
        genres: ['synthwave', 'electronic'],
        external_ids: { spotify: 'spotify:track:123' },
        metadata: { mood: 'chill', energy: 'medium' },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        version: 1,
        etag: '"abc123"',
        is_active: true,
        quality_score: 0.85,
        artists: [
          {
            id: 'artist-1',
            canonical_id: 'artist:synthwave-master',
            name: 'Synthwave Master',
            genres: ['synthwave', 'electronic'],
            images: [
              {
                id: 'img-1',
                entity_type: 'artist',
                entity_id: 'artist-1',
                purpose: 'profile',
                uri: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop',
                created_at: new Date().toISOString(),
              }
            ],
            external_ids: {},
            metadata: {},
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            version: 1,
            is_active: true,
            quality_score: 0.9,
          }
        ],
        release: {
          id: 'release-1',
          canonical_id: 'release:neon-nights',
          title: 'Neon Nights',
          release_type: 'album',
          cover_uri: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=400&fit=crop',
          genres: ['synthwave', 'electronic'],
          territories: ['US', 'CA', 'GB'],
          external_ids: {},
          metadata: {},
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          version: 1,
          is_active: true,
          quality_score: 0.85,
        },
      };
      return track;
    }
    
    console.log(`[catalog] Track not found: ${input.id}`);
    return null;
  });
