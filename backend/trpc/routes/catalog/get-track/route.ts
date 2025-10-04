import { z } from "zod";
import { publicProcedure } from "@/backend/trpc/create-context";
import type { CatalogTrack } from "@/types/catalog";
import { catalogService } from "@/backend/services/catalog";

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
  artists: z.array(z.object({
    id: z.string(),
    canonical_id: z.string(),
    name: z.string(),
    genres: z.array(z.string()),
    images: z.array(z.object({
      id: z.string(),
      entity_type: z.string(),
      entity_id: z.string(),
      purpose: z.string(),
      uri: z.string(),
      created_at: z.string(),
    })),
    external_ids: z.record(z.string(), z.string()),
    metadata: z.record(z.string(), z.any()),
    created_at: z.string(),
    updated_at: z.string(),
    version: z.number(),
    is_active: z.boolean(),
    quality_score: z.number(),
  })).optional(),
  release: z.object({
    id: z.string(),
    canonical_id: z.string(),
    title: z.string(),
    release_type: z.string(),
    cover_uri: z.string().optional(),
    genres: z.array(z.string()),
    territories: z.array(z.string()),
    external_ids: z.record(z.string(), z.string()),
    metadata: z.record(z.string(), z.any()),
    created_at: z.string(),
    updated_at: z.string(),
    version: z.number(),
    is_active: z.boolean(),
    quality_score: z.number(),
  }).optional(),
  audio_features: z.any().optional(),
});

export const getTrackProcedure = publicProcedure
  .input(z.object({ id: z.string() }))
  .output(TrackSchema.nullable())
  .query(async ({ input }): Promise<CatalogTrack | null> => {
    console.log(`[catalog] Getting track: ${input.id}`);
    
    try {
      const track = await catalogService.getTrack(input.id);
      
      if (!track) {
        console.log(`[catalog] Track not found: ${input.id}`);
        return null;
      }

      const catalogTrack: CatalogTrack = {
        id: track.canonical_id,
        canonical_id: track.canonical_id,
        isrc: track.isrc,
        title: track.title,
        release_id: track.release_id?.toString(),
        duration_ms: track.duration_ms,
        explicit: track.explicit,
        track_no: track.track_no,
        disc_no: track.disc_no,
        preview_uri: track.preview_uri,
        stream_uri: track.stream_uri,
        media_type: 'audio',
        genres: track.genres,
        external_ids: track.external_ids,
        metadata: track.metadata,
        created_at: track.created_at,
        updated_at: track.updated_at,
        version: track.version,
        etag: track.etag,
        is_active: track.is_active,
        quality_score: track.quality_score,
        artists: track.metadata.artist ? [{
          id: `artist-${track.id}`,
          canonical_id: `artist:${track.metadata.artist.toLowerCase().replace(/\s+/g, '-')}`,
          name: track.metadata.artist,
          genres: track.genres,
          images: [{
            id: `img-${track.id}`,
            entity_type: 'artist' as const,
            entity_id: `artist-${track.id}`,
            purpose: 'profile' as const,
            uri: track.metadata.artwork || '',
            created_at: track.created_at,
          }],
          external_ids: {},
          metadata: {},
          created_at: track.created_at,
          updated_at: track.updated_at,
          version: 1,
          is_active: true,
          quality_score: 0.9,
        }] : undefined,
        release: track.metadata.album ? {
          id: `release-${track.id}`,
          canonical_id: `release:${track.metadata.album.toLowerCase().replace(/\s+/g, '-')}`,
          title: track.metadata.album,
          release_type: 'album' as const,
          cover_uri: track.metadata.artwork || '',
          genres: track.genres,
          territories: ['US', 'CA', 'GB'],
          external_ids: {},
          metadata: {},
          created_at: track.created_at,
          updated_at: track.updated_at,
          version: 1,
          is_active: true,
          quality_score: 0.85,
        } : undefined,
      };
      
      return catalogTrack;
    } catch (error) {
      console.error('[catalog] Error getting track:', error);
      return null;
    }
  });
