import { z } from "zod";
import { publicProcedure } from "@/backend/trpc/create-context";
import { generateJSON } from "@/backend/services/openai";

export const recommendationsProcedure = publicProcedure
  .input(
    z.object({
      userId: z.string().optional(),
      currentTrack: z.object({
        id: z.string(),
        title: z.string(),
        artist: z.string(),
        genre: z.string().optional(),
        mood: z.string().optional(),
      }).optional(),
      listeningHistory: z.array(z.string()).optional(),
      preferences: z.object({
        genres: z.array(z.string()).optional(),
        moods: z.array(z.string()).optional(),
        energy: z.number().optional(),
      }).optional(),
      limit: z.number().min(1).max(50).default(10),
    })
  )
  .query(async ({ input }) => {
    console.log('[AI] Generating recommendations for user:', input.userId);
    
    try {
      const systemPrompt = `You are a music recommendation AI with deep knowledge of music across all genres, eras, and cultures. You understand musical relationships, mood, energy, and listener preferences.`;
      
      const userPrompt = `Generate ${input.limit} music recommendations based on:\n${input.currentTrack ? `Current Track: "${input.currentTrack.title}" by ${input.currentTrack.artist}${input.currentTrack.genre ? ` (${input.currentTrack.genre})` : ''}` : ''}\n${input.preferences?.genres && input.preferences.genres.length > 0 ? `Preferred Genres: ${input.preferences.genres.join(', ')}` : ''}\n${input.preferences?.moods && input.preferences.moods.length > 0 ? `Preferred Moods: ${input.preferences.moods.join(', ')}` : ''}\n${input.preferences?.energy !== undefined ? `Energy Level: ${input.preferences.energy * 100}%` : ''}\n${input.listeningHistory && input.listeningHistory.length > 0 ? `Recently Played: ${input.listeningHistory.slice(0, 5).join(', ')}` : ''}\n\nReturn JSON:\n{\n  "recommendations": [\n    {\n      "id": "track_id",\n      "title": "Track Name",\n      "artist": "Artist Name",\n      "genre": "Genre",\n      "mood": "Mood",\n      "energy": 0.75,\n      "reason": "Why this track is recommended",\n      "similarity": 0.85\n    }\n  ]\n}`;
      
      const result = await generateJSON<{
        recommendations: Array<{
          id: string;
          title: string;
          artist: string;
          genre?: string;
          mood?: string;
          energy?: number;
          reason?: string;
          similarity?: number;
        }>;
      }>([
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ]);
      
      console.log(`[AI] Generated ${result.recommendations?.length || 0} recommendations`);
      return {
        success: true,
        recommendations: result.recommendations || [],
      };
    } catch (error) {
      console.error('[AI] Recommendations error:', error);
      return {
        success: false,
        recommendations: [],
        error: error instanceof Error ? error.message : 'Failed to generate recommendations',
      };
    }
  });
