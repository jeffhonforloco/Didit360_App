import { z } from "zod";
import { publicProcedure } from "@/backend/trpc/create-context";
import type { CatalogTrack } from "@/types/catalog";
import { allTracks } from "@/data/mockData";

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
    
    const uiTrack = allTracks.find(t => t.id === input.id && (t.type === 'song' || t.type === 'podcast' || t.type === 'audiobook'));
    
    if (!uiTrack) {
      console.log(`[catalog] Track not found: ${input.id}`);
      return null;
    }

    const track: CatalogTrack = {
      id: uiTrack.id,
      canonical_id: `track:${uiTrack.id}`,
      isrc: `ISRC${uiTrack.id.toUpperCase()}`,
      title: uiTrack.title,
      release_id: uiTrack.album ? `release-${uiTrack.id}` : undefined,
      duration_ms: uiTrack.duration * 1000,
      explicit: false,
      track_no: 1,
      disc_no: 1,
      preview_uri: uiTrack.audioUrl || 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
      stream_uri: uiTrack.audioUrl || 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
      media_type: 'audio',
      genres: ['pop', 'electronic'],
      external_ids: {},
      metadata: {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      version: 1,
      etag: `"${uiTrack.id}"`,
      is_active: true,
      quality_score: 0.85,
      artists: [
        {
          id: `artist-${uiTrack.id}`,
          canonical_id: `artist:${uiTrack.artist.toLowerCase().replace(/\s+/g, '-')}`,
          name: uiTrack.artist,
          genres: ['pop', 'electronic'],
          images: [
            {
              id: `img-${uiTrack.id}`,
              entity_type: 'artist' as const,
              entity_id: `artist-${uiTrack.id}`,
              purpose: 'profile' as const,
              uri: uiTrack.artwork,
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
      release: uiTrack.album ? {
        id: `release-${uiTrack.id}`,
        canonical_id: `release:${uiTrack.album.toLowerCase().replace(/\s+/g, '-')}`,
        title: uiTrack.album,
        release_type: 'album' as const,
        cover_uri: uiTrack.artwork,
        genres: ['pop', 'electronic'],
        territories: ['US', 'CA', 'GB'],
        external_ids: {},
        metadata: {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        version: 1,
        is_active: true,
        quality_score: 0.85,
      } : undefined,
    };
    
    return track;
  });
