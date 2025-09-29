import { z } from "zod";
import { publicProcedure } from "@/backend/trpc/create-context";
import { catalogService } from "@/backend/services/catalog";

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
      // Use the catalog service for search
      const searchResults = await catalogService.search(
        input.q,
        input.type === 'all' ? undefined : input.type,
        input.limit,
        input.offset
      );

      // Transform the results to match our schema
      const transformedResults: z.infer<typeof SearchResultSchema>[] = searchResults.results.map(result => ({
        id: result.id,
        type: result.type as any, // Type assertion since we know it matches our enum
        title: result.title,
        subtitle: result.subtitle,
        artwork: result.artwork,
        version: result.version,
        relevance_score: 0.8, // Default relevance score
        canonical_id: `${result.type}:${result.id}`, // Generate canonical_id
        quality_score: 0.8, // Default quality score
      }));

      console.log(`[catalog] Found ${searchResults.total} total results, returning ${transformedResults.length}`);
      return transformedResults;
    } catch (error) {
      console.error('[catalog] Search error:', error);
      // Return empty results on error
      return [];
    }
  });
