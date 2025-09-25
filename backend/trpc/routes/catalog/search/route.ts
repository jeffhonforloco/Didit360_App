import { z } from "zod";
import { publicProcedure } from "../../../create-context";

// Enhanced search result schema
const SearchResultSchema = z.object({
  id: z.string(),
  type: z.enum([
    "track",
    "video",
    "artist",
    "release",
    "podcast",
    "episode",
    "audiobook",
    "book",
    "image",
  ]),
  title: z.string(),
  subtitle: z.string().optional(),
  artwork: z.string().url().optional(),
  version: z.number(),
  relevance_score: z.number().optional(),
  canonical_id: z.string(),
  quality_score: z.number(),
});

// Mock catalog data
const mockCatalog = {
  artists: [
    {
      id: 'artist-1',
      canonical_id: 'artist:the-midnight',
      name: 'The Midnight',
      genres: ['synthwave', 'electronic', 'retrowave'],
      quality_score: 0.9,
      version: 1,
    },
    {
      id: 'artist-2',
      canonical_id: 'artist:daft-punk',
      name: 'Daft Punk',
      genres: ['electronic', 'house', 'disco'],
      quality_score: 0.95,
      version: 1,
    },
  ],
  tracks: [
    {
      id: 'track-1',
      canonical_id: 'track:sunset',
      title: 'Sunset',
      genres: ['synthwave', 'electronic'],
      quality_score: 0.8,
      version: 1,
    },
    {
      id: 'track-2',
      canonical_id: 'track:get-lucky',
      title: 'Get Lucky',
      genres: ['electronic', 'disco'],
      quality_score: 0.9,
      version: 1,
    },
  ],
  releases: [
    {
      id: 'release-1',
      canonical_id: 'release:endless-summer',
      title: 'Endless Summer',
      genres: ['synthwave', 'electronic'],
      quality_score: 0.85,
      version: 1,
    },
  ],
};

export const searchProcedure = publicProcedure
  .input(
    z.object({
      q: z.string().min(1),
      type: z
        .enum([
          "track",
          "video",
          "artist",
          "release",
          "podcast",
          "episode",
          "audiobook",
          "book",
          "image",
          "all",
        ])
        .default("all"),
      limit: z.number().int().min(1).max(50).default(20),
      offset: z.number().int().min(0).default(0),
    })
  )
  .output(z.array(SearchResultSchema))
  .query(async ({ input }) => {
    console.log(`[catalog] Searching for: "${input.q}" type: ${input.type}`);
    
    const q = input.q.trim().toLowerCase();
    const results: Array<z.infer<typeof SearchResultSchema>> = [];

    // Search artists
    if (input.type === 'all' || input.type === 'artist') {
      for (const artist of mockCatalog.artists) {
        const searchableText = [
          artist.name,
          ...artist.genres,
          artist.canonical_id,
        ].join(' ').toLowerCase();
        
        if (searchableText.includes(q)) {
          results.push({
            id: artist.id,
            type: 'artist',
            title: artist.name,
            subtitle: 'Artist',
            artwork: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400',
            version: artist.version,
            relevance_score: 0.8,
            canonical_id: artist.canonical_id,
            quality_score: artist.quality_score,
          });
        }
      }
    }

    // Search tracks
    if (input.type === 'all' || input.type === 'track') {
      for (const track of mockCatalog.tracks) {
        const searchableText = [
          track.title,
          ...track.genres,
          track.canonical_id,
        ].join(' ').toLowerCase();
        
        if (searchableText.includes(q)) {
          results.push({
            id: track.id,
            type: 'track',
            title: track.title,
            subtitle: 'Track',
            artwork: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400',
            version: track.version,
            relevance_score: 0.7,
            canonical_id: track.canonical_id,
            quality_score: track.quality_score,
          });
        }
      }
    }

    // Search releases
    if (input.type === 'all' || input.type === 'release') {
      for (const release of mockCatalog.releases) {
        const searchableText = [
          release.title,
          ...release.genres,
          release.canonical_id,
        ].join(' ').toLowerCase();
        
        if (searchableText.includes(q)) {
          results.push({
            id: release.id,
            type: 'release',
            title: release.title,
            subtitle: 'Album',
            artwork: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400',
            version: release.version,
            relevance_score: 0.75,
            canonical_id: release.canonical_id,
            quality_score: release.quality_score,
          });
        }
      }
    }

    // Sort by relevance and quality, then apply pagination
    const sortedResults = results
      .sort((a, b) => {
        const scoreA = (a.relevance_score || 0) * 0.6 + a.quality_score * 0.4;
        const scoreB = (b.relevance_score || 0) * 0.6 + b.quality_score * 0.4;
        return scoreB - scoreA;
      })
      .slice(input.offset, input.offset + input.limit);

    console.log(`[catalog] Found ${results.length} results, returning ${sortedResults.length}`);
    return sortedResults;
  });
