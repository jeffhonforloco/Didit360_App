import { z } from "zod";
import { publicProcedure } from "@/backend/trpc/create-context";

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
    
    try {
      // Mock search implementation to avoid import issues
      const results = input.q ? [
        {
          id: 'track-1',
          type: input.type === 'all' ? 'track' : input.type,
          title: `Result for "${input.q}"`,
          artwork: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800',
          version: 1,
        },
        {
          id: 'track-2',
          type: input.type === 'all' ? 'track' : input.type,
          title: `Another result for "${input.q}"`,
          artwork: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800',
          version: 1,
        },
      ] : [];

      // Transform the results to match our schema
      const transformedResults: z.infer<typeof SearchResultSchema>[] = results.map(result => ({
        id: result.id,
        type: result.type as any,
        title: result.title,
        subtitle: undefined,
        artwork: result.artwork,
        version: result.version,
        relevance_score: 0.8,
        canonical_id: `${result.type}:${result.id}`,
        quality_score: 0.8,
      }));

      console.log(`[catalog] Found ${results.length} total results, returning ${transformedResults.length}`);
      return transformedResults;
    } catch (error) {
      console.error('[catalog] Search error:', error);
      // Return empty results on error
      return [];
    }
  });
