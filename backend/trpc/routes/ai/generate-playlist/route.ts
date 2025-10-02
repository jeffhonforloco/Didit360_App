import { z } from "zod";
import { publicProcedure } from "@/backend/trpc/create-context";
import { generateJSON } from "@/backend/services/openai";

export const generatePlaylistProcedure = publicProcedure
  .input(
    z.object({
      prompt: z.string(),
      mood: z.string().optional(),
      genres: z.array(z.string()).optional(),
      energy: z.number().min(0).max(1).optional(),
      duration: z.number().optional(),
      trackCount: z.number().min(5).max(100).default(20),
    })
  )
  .mutation(async ({ input }) => {
    console.log('[AI] Generating playlist with prompt:', input.prompt);
    
    try {
      const systemPrompt = `You are an expert music curator and playlist creator. You understand music theory, genre relationships, energy flow, and how to create cohesive playlists that tell a story or match a specific vibe.`;
      
      const userPrompt = `Create a playlist based on this prompt: "${input.prompt}"
${input.mood ? `Mood: ${input.mood}` : ''}
${input.genres && input.genres.length > 0 ? `Genres: ${input.genres.join(', ')}` : ''}
${input.energy !== undefined ? `Energy Level: ${input.energy * 100}%` : ''}
${input.duration ? `Target Duration: ${input.duration} minutes` : ''}
Track Count: ${input.trackCount}

Create a cohesive playlist with smooth transitions and good energy flow. Return JSON:
{
  "title": "Playlist Title",
  "description": "Brief description of the playlist",
  "tracks": [
    {
      "id": "track_id",
      "title": "Track Name",
      "artist": "Artist Name",
      "album": "Album Name",
      "genre": "Genre",
      "mood": "Mood",
      "energy": 0.75,
      "bpm": 128,
      "key": "Am",
      "duration": 240,
      "reason": "Why this track fits the playlist"
    }
  ],
  "totalDuration": 3600,
  "averageEnergy": 0.7,
  "tags": ["tag1", "tag2"]
}`;
      
      const result = await generateJSON<{
        title: string;
        description: string;
        tracks: {
          id: string;
          title: string;
          artist: string;
          album?: string;
          genre?: string;
          mood?: string;
          energy?: number;
          bpm?: number;
          key?: string;
          duration?: number;
          reason?: string;
        }[];
        totalDuration?: number;
        averageEnergy?: number;
        tags?: string[];
      }>([
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ]);
      
      console.log(`[AI] Generated playlist "${result.title}" with ${result.tracks?.length || 0} tracks`);
      return {
        success: true,
        playlist: result,
      };
    } catch (error) {
      console.error('[AI] Playlist generation error:', error);
      return {
        success: false,
        playlist: null,
        error: error instanceof Error ? error.message : 'Failed to generate playlist',
      };
    }
  });
