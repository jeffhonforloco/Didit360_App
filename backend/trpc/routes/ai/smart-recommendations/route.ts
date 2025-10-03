import { z } from "zod";
import { publicProcedure } from "@/backend/trpc/create-context";
import { generateJSON } from "@/backend/services/openai";

export const smartRecommendationsProcedure = publicProcedure
  .input(
    z.object({
      userId: z.string(),
      listeningHistory: z.array(
        z.object({
          trackId: z.string(),
          title: z.string(),
          artist: z.string(),
          genre: z.string().optional(),
          playCount: z.number().optional(),
          lastPlayed: z.string().optional(),
          skipCount: z.number().optional(),
          completionRate: z.number().optional(),
        })
      ),
      timeOfDay: z.enum(['morning', 'afternoon', 'evening', 'night']).optional(),
      dayOfWeek: z.enum(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']).optional(),
      currentActivity: z.string().optional(),
      mood: z.string().optional(),
      weather: z.string().optional(),
      limit: z.number().min(1).max(100).default(20),
    })
  )
  .query(async ({ input }) => {
    console.log('[AI] Generating smart recommendations for user:', input.userId);
    
    try {
      const topTracks = input.listeningHistory
        .sort((a, b) => (b.playCount || 0) - (a.playCount || 0))
        .slice(0, 10);
      
      const recentTracks = input.listeningHistory
        .sort((a, b) => {
          const dateA = a.lastPlayed ? new Date(a.lastPlayed).getTime() : 0;
          const dateB = b.lastPlayed ? new Date(b.lastPlayed).getTime() : 0;
          return dateB - dateA;
        })
        .slice(0, 10);
      
      const genreDistribution: { [key: string]: number } = {};
      input.listeningHistory.forEach(track => {
        if (track.genre) {
          genreDistribution[track.genre] = (genreDistribution[track.genre] || 0) + 1;
        }
      });
      
      const topGenres = Object.entries(genreDistribution)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([genre]) => genre);
      
      const systemPrompt = `You are an advanced music recommendation AI with deep understanding of:
- Music theory, genres, and subgenres
- Listening patterns and user behavior
- Contextual factors (time, mood, activity, weather)
- Collaborative filtering and taste profiles
- Discovery vs familiarity balance

Analyze listening history and provide highly personalized recommendations.`;
      
      const userPrompt = `Analyze this user's listening history and provide ${input.limit} personalized recommendations:

TOP TRACKS (Most Played):
${topTracks.map(t => `- "${t.title}" by ${t.artist} (${t.genre || 'Unknown'}) - ${t.playCount || 0} plays`).join('\n')}

RECENT TRACKS:
${recentTracks.map(t => `- "${t.title}" by ${t.artist} (${t.genre || 'Unknown'})`).join('\n')}

TOP GENRES: ${topGenres.join(', ')}

CONTEXT:
${input.timeOfDay ? `Time: ${input.timeOfDay}` : ''}
${input.dayOfWeek ? `Day: ${input.dayOfWeek}` : ''}
${input.currentActivity ? `Activity: ${input.currentActivity}` : ''}
${input.mood ? `Mood: ${input.mood}` : ''}
${input.weather ? `Weather: ${input.weather}` : ''}

Provide recommendations that:
1. Match their taste profile (70% similar to history)
2. Introduce new discoveries (30% exploration)
3. Consider current context
4. Balance familiarity and novelty
5. Include reasoning for each recommendation

Return JSON:
{
  "recommendations": [
    {
      "id": "track_id",
      "title": "Track Name",
      "artist": "Artist Name",
      "album": "Album Name",
      "genre": "Genre",
      "subgenre": "Subgenre",
      "year": 2024,
      "bpm": 128,
      "key": "Am",
      "energy": 0.75,
      "danceability": 0.8,
      "valence": 0.6,
      "mood": "uplifting",
      "similarTo": ["track_id_1", "track_id_2"],
      "reason": "Why this track is recommended",
      "confidence": 0.85,
      "discoveryScore": 0.3,
      "contextMatch": 0.9
    }
  ],
  "insights": {
    "tasteProfile": "Description of user's taste",
    "listeningPatterns": "Observed patterns",
    "recommendations": "Overall recommendation strategy"
  }
}`;
      
      const result = await generateJSON<{
        recommendations: Array<{
          id: string;
          title: string;
          artist: string;
          album?: string;
          genre?: string;
          subgenre?: string;
          year?: number;
          bpm?: number;
          key?: string;
          energy?: number;
          danceability?: number;
          valence?: number;
          mood?: string;
          similarTo?: string[];
          reason?: string;
          confidence?: number;
          discoveryScore?: number;
          contextMatch?: number;
        }>;
        insights?: {
          tasteProfile?: string;
          listeningPatterns?: string;
          recommendations?: string;
        };
      }>(
        [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        { temperature: 0.8 }
      );
      
      console.log(`[AI] Generated ${result.recommendations?.length || 0} smart recommendations`);
      return {
        success: true,
        recommendations: result.recommendations || [],
        insights: result.insights || {},
        metadata: {
          topGenres,
          totalTracksAnalyzed: input.listeningHistory.length,
          contextFactors: {
            timeOfDay: input.timeOfDay,
            dayOfWeek: input.dayOfWeek,
            activity: input.currentActivity,
            mood: input.mood,
            weather: input.weather,
          },
        },
      };
    } catch (error) {
      console.error('[AI] Smart recommendations error:', error);
      return {
        success: false,
        recommendations: [],
        insights: {},
        metadata: {},
        error: error instanceof Error ? error.message : 'Failed to generate recommendations',
      };
    }
  });
