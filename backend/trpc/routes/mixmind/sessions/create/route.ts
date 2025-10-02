import { z } from "zod";
import { publicProcedure } from "../../../../create-context";
import { generateJSON } from "@/backend/services/openai";

export const mixmindCreateSessionProcedure = publicProcedure
  .input(
    z.object({
      seed: z.array(z.string()).optional(),
      mood: z.string().optional(),
      tempoTarget: z.number().optional(),
      limit: z.number().int().min(1).max(100).default(20),
      prompt: z.string().optional(),
      energy: z.number().min(0).max(1).optional(),
      diversity: z.number().min(0).max(1).optional(),
      duration: z.number().optional(),
    })
  )
  .output(
    z.object({
      id: z.string(),
      tracks: z.array(
        z.object({ 
          id: z.string(), 
          startMs: z.number(), 
          endMs: z.number(),
          title: z.string().optional(),
          artist: z.string().optional(),
          bpm: z.number().optional(),
          key: z.string().optional(),
          energy: z.number().optional(),
        })
      ),
    })
  )
  .mutation(async ({ input }) => {
    const id = `mix_${Date.now()}`;
    console.log("[MixMind] Creating session", id, input);
    
    try {
      const systemPrompt = `You are MixMind, an expert AI DJ and music curator. Create detailed JSON playlists with smooth transitions, BPM matching, and harmonic mixing. You understand music theory, energy flow, and how to create perfect mixes for any occasion.`;
      
      const userPrompt = `Create a DJ mix with the following parameters:
${input.prompt ? `Prompt: ${input.prompt}` : ''}
${input.mood ? `Mood: ${input.mood}` : ''}
${input.energy !== undefined ? `Energy Level: ${input.energy * 100}%` : ''}
${input.diversity !== undefined ? `Diversity: ${input.diversity * 100}%` : ''}
${input.duration ? `Duration: ${input.duration} minutes` : ''}
${input.tempoTarget ? `Target BPM: ${input.tempoTarget}` : ''}
${input.seed && input.seed.length > 0 ? `Seed tracks: ${input.seed.join(', ')}` : ''}

Generate ${input.limit} tracks with smooth transitions. Return JSON with this structure:
{
  "tracks": [
    {
      "id": "unique_id",
      "title": "Track Name",
      "artist": "Artist Name",
      "bpm": 128,
      "key": "Am",
      "energy": 0.75,
      "startMs": 0,
      "endMs": 240000
    }
  ]
}`;
      
      const result = await generateJSON<{ tracks: any[] }>([
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ]);
      
      const tracks = (result.tracks || []).map((track: any, index: number) => ({
        id: track.id || `track_${Date.now()}_${index}`,
        title: track.title || `Track ${index + 1}`,
        artist: track.artist || 'Unknown Artist',
        bpm: track.bpm || 120,
        key: track.key || 'C',
        energy: track.energy || 0.5,
        startMs: track.startMs || 0,
        endMs: track.endMs || 240000,
      }));
      
      console.log(`[MixMind] Generated ${tracks.length} tracks for session ${id}`);
      return { id, tracks };
    } catch (error) {
      console.error('[MixMind] Error creating session:', error);
      return { id, tracks: [] };
    }
  });
