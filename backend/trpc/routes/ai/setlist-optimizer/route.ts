import { z } from "zod";
import { publicProcedure } from "@/backend/trpc/create-context";
import { generateJSON } from "@/backend/services/openai";

export const optimizeSetlistProcedure = publicProcedure
  .input(
    z.object({
      tracks: z.array(
        z.object({
          id: z.string(),
          title: z.string(),
          artist: z.string(),
          bpm: z.number().optional(),
          key: z.string().optional(),
          energy: z.number().optional(),
          genre: z.string().optional(),
          duration: z.number().optional(),
        })
      ),
      venue: z.object({
        type: z.enum(['club', 'festival', 'bar', 'wedding', 'private_party', 'concert', 'radio']),
        capacity: z.number().optional(),
        acoustics: z.enum(['excellent', 'good', 'average', 'poor']).optional(),
      }),
      audience: z.object({
        size: z.number().optional(),
        ageRange: z.string().optional(),
        energyLevel: z.number().min(0).max(1).optional(),
        musicalKnowledge: z.enum(['casual', 'enthusiast', 'expert']).optional(),
        demographics: z.string().optional(),
      }).optional(),
      setDuration: z.number().min(30).max(480),
      objectives: z.array(
        z.enum(['maximize_energy', 'smooth_flow', 'harmonic_mixing', 'genre_diversity', 'crowd_engagement', 'build_tension', 'storytelling'])
      ).optional(),
      constraints: z.object({
        mustInclude: z.array(z.string()).optional(),
        mustAvoid: z.array(z.string()).optional(),
        maxBPMChange: z.number().optional(),
        keyCompatibility: z.boolean().optional(),
      }).optional(),
    })
  )
  .mutation(async ({ input }) => {
    console.log('[AI] Optimizing setlist for', input.venue.type, 'with', input.tracks.length, 'tracks');
    
    try {
      const systemPrompt = `You are an expert DJ and music programmer with deep knowledge of:
- Harmonic mixing and key compatibility (Camelot Wheel)
- BPM transitions and energy flow
- Crowd psychology and energy management
- Genre blending and programming
- Peak time theory and set structure
- Venue acoustics and sound design
- Reading the room and adaptation

Create optimized setlists that maximize impact and flow.`;
      
      const tracksInfo = input.tracks.map((t, i) => 
        `${i + 1}. "${t.title}" by ${t.artist}${t.bpm ? ` (${t.bpm} BPM)` : ''}${t.key ? ` [${t.key}]` : ''}${t.energy !== undefined ? ` E:${(t.energy * 100).toFixed(0)}%` : ''}${t.genre ? ` {${t.genre}}` : ''}`
      ).join('\n');
      
      const userPrompt = `Optimize this setlist:

AVAILABLE TRACKS (${input.tracks.length}):
${tracksInfo}

VENUE:
Type: ${input.venue.type}
${input.venue.capacity ? `Capacity: ${input.venue.capacity}` : ''}
${input.venue.acoustics ? `Acoustics: ${input.venue.acoustics}` : ''}

${input.audience ? `AUDIENCE:
${input.audience.size ? `Size: ${input.audience.size}` : ''}
${input.audience.ageRange ? `Age Range: ${input.audience.ageRange}` : ''}
${input.audience.energyLevel !== undefined ? `Energy Level: ${(input.audience.energyLevel * 100).toFixed(0)}%` : ''}
${input.audience.musicalKnowledge ? `Musical Knowledge: ${input.audience.musicalKnowledge}` : ''}
${input.audience.demographics ? `Demographics: ${input.audience.demographics}` : ''}` : ''}

SET DURATION: ${input.setDuration} minutes

${input.objectives && input.objectives.length > 0 ? `OBJECTIVES: ${input.objectives.join(', ')}` : ''}

${input.constraints ? `CONSTRAINTS:
${input.constraints.mustInclude && input.constraints.mustInclude.length > 0 ? `Must Include: ${input.constraints.mustInclude.join(', ')}` : ''}
${input.constraints.mustAvoid && input.constraints.mustAvoid.length > 0 ? `Must Avoid: ${input.constraints.mustAvoid.join(', ')}` : ''}
${input.constraints.maxBPMChange ? `Max BPM Change: ±${input.constraints.maxBPMChange}` : ''}
${input.constraints.keyCompatibility ? 'Require key compatibility' : ''}` : ''}

Create an optimized setlist with:
1. Perfect energy flow and progression
2. Harmonic mixing where possible
3. Smooth BPM transitions
4. Strategic peak moments
5. Appropriate pacing for venue/audience
6. Genre transitions that make sense
7. Storytelling and emotional journey

Return JSON:
{
  "setlist": [
    {
      "position": 1,
      "trackId": "track_id",
      "title": "Track Name",
      "artist": "Artist Name",
      "startTime": 0,
      "duration": 240,
      "bpm": 128,
      "key": "Am",
      "energy": 0.75,
      "transitionType": "fade|beatmatch|echo|cut|drop",
      "transitionDuration": 8,
      "mixPoint": "breakdown|drop|intro|outro",
      "reason": "Why this track at this position",
      "crowdImpact": "Expected crowd reaction",
      "technicalNotes": "DJ notes for mixing"
    }
  ],
  "analysis": {
    "totalDuration": 120,
    "averageBPM": 125,
    "bpmRange": [110, 135],
    "energyProgression": [0.5, 0.6, 0.7, 0.8, 0.9, 0.85, 0.7],
    "keyProgression": ["Am", "C", "G", "Em"],
    "genreDistribution": {"House": 5, "Techno": 3, "Electronic": 2},
    "peakMoments": [
      {
        "time": 45,
        "track": "Track Name",
        "reason": "Energy peak"
      }
    ],
    "structure": "warm_up -> build -> peak -> cool_down",
    "harmonicFlow": 0.85,
    "transitionQuality": 0.9,
    "crowdEngagement": 0.88
  },
  "alternatives": [
    {
      "name": "Alternative approach",
      "description": "Different programming strategy",
      "keyDifferences": ["difference1", "difference2"]
    }
  ],
  "recommendations": [
    "Recommendation 1",
    "Recommendation 2"
  ]
}`;
      
      const result = await generateJSON<{
        setlist?: Array<{
          position: number;
          trackId: string;
          title: string;
          artist: string;
          startTime?: number;
          duration?: number;
          bpm?: number;
          key?: string;
          energy?: number;
          transitionType?: string;
          transitionDuration?: number;
          mixPoint?: string;
          reason?: string;
          crowdImpact?: string;
          technicalNotes?: string;
        }>;
        analysis?: {
          totalDuration?: number;
          averageBPM?: number;
          bpmRange?: [number, number];
          energyProgression?: number[];
          keyProgression?: string[];
          genreDistribution?: Record<string, number>;
          peakMoments?: Array<{
            time: number;
            track: string;
            reason: string;
          }>;
          structure?: string;
          harmonicFlow?: number;
          transitionQuality?: number;
          crowdEngagement?: number;
        };
        alternatives?: Array<{
          name: string;
          description: string;
          keyDifferences?: string[];
        }>;
        recommendations?: string[];
      }>(
        [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        { temperature: 0.7 }
      );
      
      console.log('[AI] Setlist optimized:', result.setlist?.length || 0, 'tracks');
      return {
        success: true,
        ...result,
      };
    } catch (error) {
      console.error('[AI] Setlist optimization error:', error);
      return {
        success: false,
        setlist: [],
        error: error instanceof Error ? error.message : 'Failed to optimize setlist',
      };
    }
  });

export const analyzeSetProcedure = publicProcedure
  .input(
    z.object({
      setlist: z.array(
        z.object({
          trackId: z.string(),
          title: z.string(),
          artist: z.string(),
          bpm: z.number().optional(),
          key: z.string().optional(),
          energy: z.number().optional(),
          position: z.number(),
        })
      ),
    })
  )
  .query(async ({ input }) => {
    console.log('[AI] Analyzing setlist with', input.setlist.length, 'tracks');
    
    try {
      const systemPrompt = `You are an expert DJ analyst. Evaluate setlists for flow, energy management, harmonic mixing, and overall quality.`;
      
      const setlistInfo = input.setlist
        .sort((a, b) => a.position - b.position)
        .map(t => `${t.position}. "${t.title}" by ${t.artist}${t.bpm ? ` (${t.bpm} BPM)` : ''}${t.key ? ` [${t.key}]` : ''}${t.energy !== undefined ? ` E:${(t.energy * 100).toFixed(0)}%` : ''}`)
        .join('\n');
      
      const userPrompt = `Analyze this setlist:

${setlistInfo}

Evaluate:
1. Energy flow and progression
2. BPM transitions
3. Harmonic mixing
4. Genre coherence
5. Pacing and structure
6. Peak moments
7. Overall quality

Return JSON with detailed analysis and scores (0-1 scale).`;
      
      const result = await generateJSON<{
        scores?: {
          energyFlow?: number;
          bpmTransitions?: number;
          harmonicMixing?: number;
          genreCoherence?: number;
          pacing?: number;
          overall?: number;
        };
        strengths?: string[];
        weaknesses?: string[];
        suggestions?: string[];
        analysis?: string;
      }>(
        [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        { temperature: 0.5 }
      );
      
      console.log('[AI] Set analysis completed');
      return {
        success: true,
        ...result,
      };
    } catch (error) {
      console.error('[AI] Set analysis error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to analyze set',
      };
    }
  });
