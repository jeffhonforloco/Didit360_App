import { z } from "zod";
import { publicProcedure } from "@/backend/trpc/create-context";
import { generateJSON, generateEmbedding } from "@/backend/services/openai";

export const collaborativeFilteringProcedure = publicProcedure
  .input(
    z.object({
      userId: z.string(),
      userProfile: z.object({
        listeningHistory: z.array(z.string()),
        favoriteGenres: z.array(z.string()),
        favoriteArtists: z.array(z.string()),
        skipPatterns: z.array(z.string()).optional(),
        playlistHistory: z.array(z.string()).optional(),
      }),
      similarUsers: z.array(
        z.object({
          userId: z.string(),
          similarity: z.number(),
          listeningHistory: z.array(z.string()),
          favoriteGenres: z.array(z.string()),
        })
      ).optional(),
      limit: z.number().min(1).max(100).default(30),
    })
  )
  .query(async ({ input }) => {
    console.log('[AI] Generating collaborative filtering recommendations for user:', input.userId);
    
    try {
      const systemPrompt = `You are an expert in collaborative filtering and recommendation systems. You analyze user behavior patterns, find similar users, and make predictions about what users will enjoy based on collective intelligence. You understand:
- User similarity metrics
- Taste clustering
- Discovery vs exploitation balance
- Cold start problems
- Diversity in recommendations
- Serendipity and novelty`;
      
      const similarUsersInfo = input.similarUsers && input.similarUsers.length > 0
        ? `SIMILAR USERS:
${input.similarUsers.map((u, i) => `
User ${i + 1} (${(u.similarity * 100).toFixed(0)}% similar):
- Listening History: ${u.listeningHistory.slice(0, 5).join(', ')}${u.listeningHistory.length > 5 ? '...' : ''}
- Favorite Genres: ${u.favoriteGenres.join(', ')}
`).join('\n')}`
        : 'No similar users data available';
      
      const userPrompt = `Generate collaborative filtering recommendations:

USER PROFILE:
User ID: ${input.userId}
Listening History: ${input.userProfile.listeningHistory.slice(0, 10).join(', ')}${input.userProfile.listeningHistory.length > 10 ? '...' : ''}
Favorite Genres: ${input.userProfile.favoriteGenres.join(', ')}
Favorite Artists: ${input.userProfile.favoriteArtists.join(', ')}
${input.userProfile.skipPatterns && input.userProfile.skipPatterns.length > 0 ? `Skip Patterns: ${input.userProfile.skipPatterns.join(', ')}` : ''}

${similarUsersInfo}

Based on collaborative filtering principles:
1. Find patterns in similar users' preferences
2. Identify tracks the user hasn't heard but similar users love
3. Balance familiarity with discovery
4. Avoid tracks similar to skip patterns
5. Ensure diversity in recommendations

Generate ${input.limit} recommendations. Return JSON:
{
  "recommendations": [
    {
      "id": "track_id",
      "title": "Track Name",
      "artist": "Artist Name",
      "genre": "Genre",
      "year": 2024,
      "collaborativeScore": 0.85,
      "similarUserCount": 5,
      "discoveryScore": 0.6,
      "reason": "Why recommended based on collaborative filtering",
      "similarUsersWhoLiked": ["user_id_1", "user_id_2"],
      "confidence": 0.9
    }
  ],
  "insights": {
    "userCluster": "Description of user's taste cluster",
    "similarityPatterns": "Common patterns with similar users",
    "discoveryOpportunities": "Areas for musical exploration",
    "tasteEvolution": "Predicted taste evolution"
  },
  "similarUserInsights": [
    {
      "userId": "user_id",
      "commonTracks": 15,
      "uniqueRecommendations": 8,
      "tasteOverlap": 0.75
    }
  ]
}`;
      
      const result = await generateJSON<{
        recommendations?: Array<{
          id: string;
          title: string;
          artist: string;
          genre?: string;
          year?: number;
          collaborativeScore?: number;
          similarUserCount?: number;
          discoveryScore?: number;
          reason?: string;
          similarUsersWhoLiked?: string[];
          confidence?: number;
        }>;
        insights?: {
          userCluster?: string;
          similarityPatterns?: string;
          discoveryOpportunities?: string;
          tasteEvolution?: string;
        };
        similarUserInsights?: Array<{
          userId: string;
          commonTracks?: number;
          uniqueRecommendations?: number;
          tasteOverlap?: number;
        }>;
      }>(
        [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        { temperature: 0.7 }
      );
      
      console.log('[AI] Collaborative filtering generated:', result.recommendations?.length || 0, 'recommendations');
      return {
        success: true,
        userId: input.userId,
        ...result,
      };
    } catch (error) {
      console.error('[AI] Collaborative filtering error:', error);
      return {
        success: false,
        userId: input.userId,
        recommendations: [],
        error: error instanceof Error ? error.message : 'Failed to generate collaborative recommendations',
      };
    }
  });

export const findSimilarUsersProcedure = publicProcedure
  .input(
    z.object({
      userId: z.string(),
      userTasteProfile: z.string(),
      limit: z.number().min(1).max(50).default(10),
    })
  )
  .query(async ({ input }) => {
    console.log('[AI] Finding similar users for:', input.userId);
    
    try {
      const embedding = await generateEmbedding(input.userTasteProfile);
      
      console.log('[AI] Generated taste embedding, length:', embedding.length);
      
      return {
        success: true,
        userId: input.userId,
        embedding,
        similarUsers: [],
        message: 'Embedding generated. In production, this would query a vector database to find similar users.',
      };
    } catch (error) {
      console.error('[AI] Find similar users error:', error);
      return {
        success: false,
        userId: input.userId,
        error: error instanceof Error ? error.message : 'Failed to find similar users',
      };
    }
  });
