import { z } from "zod";
import { publicProcedure } from "@/backend/trpc/create-context";
import { generateEmbedding, generateJSON } from "@/backend/services/openai";

export const generateTrackEmbeddingProcedure = publicProcedure
  .input(
    z.object({
      trackId: z.string(),
      title: z.string(),
      artist: z.string(),
      genre: z.string().optional(),
      lyrics: z.string().optional(),
      audioFeatures: z.object({
        bpm: z.number().optional(),
        key: z.string().optional(),
        energy: z.number().optional(),
        danceability: z.number().optional(),
        valence: z.number().optional(),
        acousticness: z.number().optional(),
        instrumentalness: z.number().optional(),
      }).optional(),
      tags: z.array(z.string()).optional(),
      description: z.string().optional(),
    })
  )
  .mutation(async ({ input }) => {
    console.log('[AI] Generating embedding for track:', input.title);
    
    try {
      const trackDescription = `
Title: ${input.title}
Artist: ${input.artist}
${input.genre ? `Genre: ${input.genre}` : ''}
${input.description ? `Description: ${input.description}` : ''}
${input.tags && input.tags.length > 0 ? `Tags: ${input.tags.join(', ')}` : ''}
${input.audioFeatures ? `
Audio Features:
- BPM: ${input.audioFeatures.bpm || 'Unknown'}
- Key: ${input.audioFeatures.key || 'Unknown'}
- Energy: ${input.audioFeatures.energy !== undefined ? (input.audioFeatures.energy * 100).toFixed(0) + '%' : 'Unknown'}
- Danceability: ${input.audioFeatures.danceability !== undefined ? (input.audioFeatures.danceability * 100).toFixed(0) + '%' : 'Unknown'}
- Valence: ${input.audioFeatures.valence !== undefined ? (input.audioFeatures.valence * 100).toFixed(0) + '%' : 'Unknown'}
` : ''}
${input.lyrics ? `Lyrics excerpt: ${input.lyrics.slice(0, 200)}...` : ''}
`.trim();
      
      const embedding = await generateEmbedding(trackDescription);
      
      console.log('[AI] Track embedding generated, dimension:', embedding.length);
      return {
        success: true,
        trackId: input.trackId,
        embedding,
        dimension: embedding.length,
      };
    } catch (error) {
      console.error('[AI] Track embedding error:', error);
      return {
        success: false,
        trackId: input.trackId,
        embedding: [],
        error: error instanceof Error ? error.message : 'Failed to generate embedding',
      };
    }
  });

export const findSimilarTracksProcedure = publicProcedure
  .input(
    z.object({
      trackId: z.string(),
      trackEmbedding: z.array(z.number()).optional(),
      trackInfo: z.object({
        title: z.string(),
        artist: z.string(),
        genre: z.string().optional(),
        bpm: z.number().optional(),
        key: z.string().optional(),
        energy: z.number().optional(),
        mood: z.string().optional(),
      }).optional(),
      limit: z.number().min(1).max(100).default(20),
      filters: z.object({
        genres: z.array(z.string()).optional(),
        excludeGenres: z.array(z.string()).optional(),
        bpmRange: z.tuple([z.number(), z.number()]).optional(),
        energyRange: z.tuple([z.number(), z.number()]).optional(),
        yearRange: z.tuple([z.number(), z.number()]).optional(),
      }).optional(),
    })
  )
  .query(async ({ input }) => {
    console.log('[AI] Finding similar tracks for:', input.trackId);
    
    try {
      const systemPrompt = `You are an expert in music similarity and recommendation. You understand:
- Musical similarity across multiple dimensions
- Genre relationships and crossover
- Audio feature similarity
- Mood and vibe matching
- Contextual similarity
- Temporal and cultural factors

Generate similar track recommendations.`;
      
      const userPrompt = `Find tracks similar to:

${input.trackInfo ? `
Track: "${input.trackInfo.title}" by ${input.trackInfo.artist}
${input.trackInfo.genre ? `Genre: ${input.trackInfo.genre}` : ''}
${input.trackInfo.bpm ? `BPM: ${input.trackInfo.bpm}` : ''}
${input.trackInfo.key ? `Key: ${input.trackInfo.key}` : ''}
${input.trackInfo.energy !== undefined ? `Energy: ${(input.trackInfo.energy * 100).toFixed(0)}%` : ''}
${input.trackInfo.mood ? `Mood: ${input.trackInfo.mood}` : ''}
` : `Track ID: ${input.trackId}`}

${input.filters ? `
FILTERS:
${input.filters.genres && input.filters.genres.length > 0 ? `Include Genres: ${input.filters.genres.join(', ')}` : ''}
${input.filters.excludeGenres && input.filters.excludeGenres.length > 0 ? `Exclude Genres: ${input.filters.excludeGenres.join(', ')}` : ''}
${input.filters.bpmRange ? `BPM Range: ${input.filters.bpmRange[0]}-${input.filters.bpmRange[1]}` : ''}
${input.filters.energyRange ? `Energy Range: ${(input.filters.energyRange[0] * 100).toFixed(0)}-${(input.filters.energyRange[1] * 100).toFixed(0)}%` : ''}
${input.filters.yearRange ? `Year Range: ${input.filters.yearRange[0]}-${input.filters.yearRange[1]}` : ''}
` : ''}

Find ${input.limit} similar tracks considering:
1. Musical characteristics (tempo, key, energy)
2. Genre and style similarity
3. Mood and vibe
4. Production style
5. Era and cultural context
6. Listening context

Return JSON:
{
  "similarTracks": [
    {
      "id": "track_id",
      "title": "Track Name",
      "artist": "Artist Name",
      "album": "Album Name",
      "genre": "Genre",
      "year": 2024,
      "bpm": 128,
      "key": "Am",
      "energy": 0.75,
      "mood": "uplifting",
      "similarityScore": 0.92,
      "similarityReasons": [
        "Similar BPM and energy",
        "Matching mood and vibe",
        "Genre crossover"
      ],
      "dimensions": {
        "musical": 0.95,
        "mood": 0.90,
        "genre": 0.88,
        "production": 0.85,
        "era": 0.80
      }
    }
  ],
  "analysis": {
    "primarySimilarityFactors": ["factor1", "factor2"],
    "genreCluster": "Description of genre relationships",
    "moodProfile": "Shared mood characteristics",
    "recommendations": "How to use these similar tracks"
  }
}`;
      
      const result = await generateJSON<{
        similarTracks?: Array<{
          id: string;
          title: string;
          artist: string;
          album?: string;
          genre?: string;
          year?: number;
          bpm?: number;
          key?: string;
          energy?: number;
          mood?: string;
          similarityScore?: number;
          similarityReasons?: string[];
          dimensions?: {
            musical?: number;
            mood?: number;
            genre?: number;
            production?: number;
            era?: number;
          };
        }>;
        analysis?: {
          primarySimilarityFactors?: string[];
          genreCluster?: string;
          moodProfile?: string;
          recommendations?: string;
        };
      }>(
        [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        { temperature: 0.7 }
      );
      
      console.log('[AI] Found', result.similarTracks?.length || 0, 'similar tracks');
      return {
        success: true,
        trackId: input.trackId,
        ...result,
      };
    } catch (error) {
      console.error('[AI] Similar tracks error:', error);
      return {
        success: false,
        trackId: input.trackId,
        similarTracks: [],
        error: error instanceof Error ? error.message : 'Failed to find similar tracks',
      };
    }
  });

export const semanticSearchProcedure = publicProcedure
  .input(
    z.object({
      query: z.string(),
      searchType: z.enum(['tracks', 'artists', 'albums', 'playlists', 'all']).default('tracks'),
      limit: z.number().min(1).max(100).default(20),
      filters: z.object({
        genres: z.array(z.string()).optional(),
        yearRange: z.tuple([z.number(), z.number()]).optional(),
        mood: z.string().optional(),
        energy: z.number().optional(),
      }).optional(),
    })
  )
  .query(async ({ input }) => {
    console.log('[AI] Semantic search for:', input.query);
    
    try {
      const queryEmbedding = await generateEmbedding(input.query);
      
      console.log('[AI] Query embedding generated, dimension:', queryEmbedding.length);
      
      const systemPrompt = `You are a semantic music search engine. You understand natural language queries and find music that matches the intent, mood, and context of the query.`;
      
      const userPrompt = `Semantic search query: "${input.query}"

Search Type: ${input.searchType}
${input.filters ? `
Filters:
${input.filters.genres && input.filters.genres.length > 0 ? `Genres: ${input.filters.genres.join(', ')}` : ''}
${input.filters.yearRange ? `Years: ${input.filters.yearRange[0]}-${input.filters.yearRange[1]}` : ''}
${input.filters.mood ? `Mood: ${input.filters.mood}` : ''}
${input.filters.energy !== undefined ? `Energy: ${(input.filters.energy * 100).toFixed(0)}%` : ''}
` : ''}

Interpret the query and find ${input.limit} matching results. Return JSON:
{
  "results": [
    {
      "id": "result_id",
      "type": "track|artist|album|playlist",
      "title": "Result Name",
      "artist": "Artist Name",
      "relevanceScore": 0.95,
      "matchReason": "Why this matches the query",
      "metadata": {}
    }
  ],
  "queryInterpretation": {
    "intent": "What the user is looking for",
    "mood": "Detected mood",
    "context": "Detected context",
    "keywords": ["keyword1", "keyword2"]
  }
}`;
      
      const result = await generateJSON<{
        results?: Array<{
          id: string;
          type: string;
          title: string;
          artist?: string;
          relevanceScore?: number;
          matchReason?: string;
          metadata?: Record<string, any>;
        }>;
        queryInterpretation?: {
          intent?: string;
          mood?: string;
          context?: string;
          keywords?: string[];
        };
      }>(
        [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        { temperature: 0.6 }
      );
      
      console.log('[AI] Semantic search found', result.results?.length || 0, 'results');
      return {
        success: true,
        query: input.query,
        queryEmbedding,
        ...result,
      };
    } catch (error) {
      console.error('[AI] Semantic search error:', error);
      return {
        success: false,
        query: input.query,
        results: [],
        error: error instanceof Error ? error.message : 'Failed to perform semantic search',
      };
    }
  });
