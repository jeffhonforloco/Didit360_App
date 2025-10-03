import { z } from "zod";
import { publicProcedure } from "@/backend/trpc/create-context";
import { generateJSON } from "@/backend/services/openai";

export const contextualDiscoveryProcedure = publicProcedure
  .input(
    z.object({
      context: z.object({
        timeOfDay: z.enum(['early_morning', 'morning', 'midday', 'afternoon', 'evening', 'night', 'late_night']),
        dayOfWeek: z.enum(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']),
        weather: z.object({
          condition: z.enum(['sunny', 'cloudy', 'rainy', 'stormy', 'snowy', 'foggy', 'windy']),
          temperature: z.number().optional(),
          season: z.enum(['spring', 'summer', 'fall', 'winter']).optional(),
        }).optional(),
        activity: z.enum(['working', 'studying', 'exercising', 'commuting', 'cooking', 'relaxing', 'partying', 'sleeping', 'waking_up', 'dating', 'gaming', 'reading', 'cleaning', 'traveling']).optional(),
        location: z.enum(['home', 'office', 'gym', 'car', 'public_transport', 'outdoors', 'cafe', 'bar', 'club', 'restaurant']).optional(),
        mood: z.string().optional(),
        energy: z.number().min(0).max(1).optional(),
        socialContext: z.enum(['alone', 'with_partner', 'with_friends', 'with_family', 'in_public']).optional(),
      }),
      preferences: z.object({
        genres: z.array(z.string()).optional(),
        excludeGenres: z.array(z.string()).optional(),
        explicitContent: z.boolean().optional(),
        preferNewMusic: z.boolean().optional(),
        preferClassics: z.boolean().optional(),
      }).optional(),
      limit: z.number().min(1).max(50).default(20),
    })
  )
  .query(async ({ input }) => {
    console.log('[AI] Generating contextual music discovery');
    
    try {
      const systemPrompt = `You are an expert music curator with deep understanding of how context affects music preferences. You consider:
- Time of day and circadian rhythms
- Weather and seasonal moods
- Activities and their music needs
- Social contexts
- Environmental factors
- Cultural and psychological associations

Create perfectly matched playlists for any context.`;
      
      const userPrompt = `Create a contextual music discovery playlist:

CONTEXT:
Time: ${input.context.timeOfDay}
Day: ${input.context.dayOfWeek}
${input.context.weather ? `Weather: ${input.context.weather.condition}${input.context.weather.temperature ? ` (${input.context.weather.temperature}°)` : ''}${input.context.weather.season ? `, ${input.context.weather.season}` : ''}` : ''}
${input.context.activity ? `Activity: ${input.context.activity}` : ''}
${input.context.location ? `Location: ${input.context.location}` : ''}
${input.context.mood ? `Mood: ${input.context.mood}` : ''}
${input.context.energy !== undefined ? `Energy Level: ${(input.context.energy * 100).toFixed(0)}%` : ''}
${input.context.socialContext ? `Social: ${input.context.socialContext}` : ''}

${input.preferences ? `PREFERENCES:
${input.preferences.genres && input.preferences.genres.length > 0 ? `Preferred Genres: ${input.preferences.genres.join(', ')}` : ''}
${input.preferences.excludeGenres && input.preferences.excludeGenres.length > 0 ? `Exclude: ${input.preferences.excludeGenres.join(', ')}` : ''}
${input.preferences.explicitContent !== undefined ? `Explicit Content: ${input.preferences.explicitContent ? 'Allowed' : 'Not Allowed'}` : ''}
${input.preferences.preferNewMusic ? 'Prefer new releases' : ''}
${input.preferences.preferClassics ? 'Include classics' : ''}` : ''}

Generate ${input.limit} tracks that perfectly match this context. Consider:
- Appropriate energy and tempo for the time/activity
- Weather-mood associations
- Social appropriateness
- Activity requirements (focus, movement, relaxation)
- Cultural and psychological context

Return JSON:
{
  "playlist": {
    "title": "Context-appropriate playlist name",
    "description": "Why this playlist fits the context",
    "vibe": "Overall vibe description",
    "tracks": [
      {
        "id": "track_id",
        "title": "Track Name",
        "artist": "Artist Name",
        "album": "Album Name",
        "genre": "Genre",
        "year": 2024,
        "bpm": 128,
        "energy": 0.75,
        "mood": "uplifting",
        "contextFit": 0.95,
        "reason": "Why this track fits the context"
      }
    ]
  },
  "contextAnalysis": {
    "primaryFactors": ["factor1", "factor2"],
    "moodProfile": "Description of ideal mood",
    "energyProfile": "Description of ideal energy",
    "recommendations": "Overall curation strategy"
  },
  "alternatives": [
    {
      "title": "Alternative playlist name",
      "description": "Different approach to same context",
      "trackCount": 15
    }
  ]
}`;
      
      const result = await generateJSON<{
        playlist?: {
          title: string;
          description: string;
          vibe?: string;
          tracks: Array<{
            id: string;
            title: string;
            artist: string;
            album?: string;
            genre?: string;
            year?: number;
            bpm?: number;
            energy?: number;
            mood?: string;
            contextFit?: number;
            reason?: string;
          }>;
        };
        contextAnalysis?: {
          primaryFactors?: string[];
          moodProfile?: string;
          energyProfile?: string;
          recommendations?: string;
        };
        alternatives?: Array<{
          title: string;
          description: string;
          trackCount?: number;
        }>;
      }>(
        [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        { temperature: 0.8 }
      );
      
      console.log('[AI] Contextual discovery generated:', result.playlist?.tracks.length || 0, 'tracks');
      return {
        success: true,
        ...result,
        context: input.context,
      };
    } catch (error) {
      console.error('[AI] Contextual discovery error:', error);
      return {
        success: false,
        playlist: {
          title: 'Discovery Playlist',
          description: 'Curated for your context',
          tracks: [],
        },
        error: error instanceof Error ? error.message : 'Failed to generate contextual discovery',
      };
    }
  });
