import { z } from "zod";
import { publicProcedure } from "@/backend/trpc/create-context";
import { generateJSON } from "@/backend/services/openai";

const liveStartSchema = z.object({
  vibe: z.string(),
  genres: z.array(z.string()),
  decades: z.array(z.string()).optional(),
  regions: z.array(z.string()).optional(),
  mood: z.enum(["chill", "groove", "hype", "ecstatic"]),
  energy: z.number().min(0).max(100),
  tempoRangeBPM: z.tuple([z.number(), z.number()]),
  transitionStyle: z.enum(["fade", "echo", "cut", "drop"]),
  keyLock: z.boolean(),
  doNotPlay: z.array(z.string()),
  explicitFilter: z.enum(["off", "moderate", "strict"]),
  durationMinutes: z.number().min(10).max(600),
});

export const liveStartProcedure = publicProcedure
  .input(liveStartSchema)
  .mutation(async ({ input }: { input: z.infer<typeof liveStartSchema> }) => {
    console.log('[Live DJ] Starting live session with config:', input);
    
    try {
      const sessionId = `live_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const systemPrompt = `You are DJ Instinct, a professional AI DJ with deep knowledge of music theory, mixing techniques, and crowd energy management. You create seamless live DJ sets with perfect transitions, harmonic mixing, and energy flow.`;
      
      const userPrompt = `Create a live DJ set with these parameters:
Vibe: ${input.vibe}
Genres: ${input.genres.join(', ')}
${input.decades && input.decades.length > 0 ? `Decades: ${input.decades.join(', ')}` : ''}
${input.regions && input.regions.length > 0 ? `Regions: ${input.regions.join(', ')}` : ''}
Mood: ${input.mood}
Energy Level: ${input.energy}%
Tempo Range: ${input.tempoRangeBPM[0]}-${input.tempoRangeBPM[1]} BPM
Transition Style: ${input.transitionStyle}
Key Lock: ${input.keyLock ? 'Yes' : 'No'}
${input.doNotPlay.length > 0 ? `Avoid: ${input.doNotPlay.join(', ')}` : ''}
Explicit Filter: ${input.explicitFilter}
Duration: ${input.durationMinutes} minutes

Generate the first 5 tracks for this live set. Return JSON:
{
  "nowPlaying": {
    "id": "track_id",
    "title": "Track Name",
    "artist": "Artist Name",
    "artwork": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800",
    "durationSec": 240,
    "bpm": 128,
    "key": "Am",
    "energy": 75
  },
  "nextUp": [
    {
      "id": "track_id",
      "title": "Track Name",
      "artist": "Artist Name",
      "artwork": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800",
      "durationSec": 240,
      "bpm": 128,
      "key": "Am",
      "energy": 75
    }
  ]
}`;
      
      const result = await generateJSON<{
        nowPlaying?: any;
        nextUp?: any[];
      }>([
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ]);
      
      return {
        success: true,
        sessionId,
        message: "Live DJ session started successfully",
        nowPlaying: result.nowPlaying || null,
        nextUp: result.nextUp || [],
        castStatus: 'idle',
        estimatedDuration: input.durationMinutes,
      };
    } catch (error) {
      console.error('[Live DJ] Start error:', error);
      throw new Error('Failed to start Live DJ session');
    }
  });