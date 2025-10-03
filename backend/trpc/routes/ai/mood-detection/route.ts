import { z } from "zod";
import { publicProcedure } from "@/backend/trpc/create-context";
import { generateJSON } from "@/backend/services/openai";

export const moodDetectionProcedure = publicProcedure
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
        liveness: z.number().optional(),
        speechiness: z.number().optional(),
        loudness: z.number().optional(),
      }).optional(),
    })
  )
  .mutation(async ({ input }) => {
    console.log('[AI] Detecting mood for track:', input.title);
    
    try {
      const systemPrompt = `You are an expert music analyst specializing in mood detection and emotional analysis. You understand:
- Musical elements (tempo, key, harmony, rhythm)
- Lyrical themes and emotional content
- Audio features and their psychological impact
- Cultural and contextual factors
- Emotional taxonomy and mood classification

Analyze tracks and provide detailed mood profiles.`;
      
      const userPrompt = `Analyze the mood and emotional characteristics of this track:

TRACK INFO:
Title: "${input.title}"
Artist: ${input.artist}
${input.genre ? `Genre: ${input.genre}` : ''}

${input.audioFeatures ? `AUDIO FEATURES:
BPM: ${input.audioFeatures.bpm || 'Unknown'}
Key: ${input.audioFeatures.key || 'Unknown'}
Energy: ${input.audioFeatures.energy !== undefined ? (input.audioFeatures.energy * 100).toFixed(0) + '%' : 'Unknown'}
Danceability: ${input.audioFeatures.danceability !== undefined ? (input.audioFeatures.danceability * 100).toFixed(0) + '%' : 'Unknown'}
Valence: ${input.audioFeatures.valence !== undefined ? (input.audioFeatures.valence * 100).toFixed(0) + '%' : 'Unknown'}
Acousticness: ${input.audioFeatures.acousticness !== undefined ? (input.audioFeatures.acousticness * 100).toFixed(0) + '%' : 'Unknown'}
Instrumentalness: ${input.audioFeatures.instrumentalness !== undefined ? (input.audioFeatures.instrumentalness * 100).toFixed(0) + '%' : 'Unknown'}` : ''}

${input.lyrics ? `LYRICS EXCERPT:
${input.lyrics.slice(0, 500)}...` : ''}

Provide a comprehensive mood analysis. Return JSON:
{
  "primaryMood": "happy|sad|energetic|calm|angry|romantic|melancholic|euphoric|anxious|peaceful",
  "secondaryMoods": ["mood1", "mood2"],
  "emotionalIntensity": 0.75,
  "emotionalValence": 0.6,
  "arousalLevel": 0.8,
  "moodTags": ["uplifting", "nostalgic", "dreamy"],
  "emotionalJourney": "Description of emotional progression",
  "listeningContexts": ["workout", "party", "relaxation", "focus"],
  "timeOfDay": ["morning", "evening"],
  "activities": ["driving", "studying", "dancing"],
  "seasons": ["summer", "spring"],
  "weather": ["sunny", "rainy"],
  "emotionalProfile": {
    "joy": 0.7,
    "sadness": 0.2,
    "anger": 0.1,
    "fear": 0.0,
    "surprise": 0.3,
    "disgust": 0.0,
    "trust": 0.6,
    "anticipation": 0.5
  },
  "musicalCharacteristics": {
    "tempo": "fast|medium|slow",
    "dynamics": "loud|moderate|soft",
    "texture": "dense|moderate|sparse",
    "complexity": "complex|moderate|simple"
  },
  "culturalContext": "Description of cultural/contextual factors",
  "therapeuticUses": ["stress relief", "motivation", "sleep aid"],
  "similarMoodTracks": ["track_id_1", "track_id_2"],
  "analysis": "Detailed mood analysis explanation"
}`;
      
      const result = await generateJSON<{
        primaryMood: string;
        secondaryMoods?: string[];
        emotionalIntensity?: number;
        emotionalValence?: number;
        arousalLevel?: number;
        moodTags?: string[];
        emotionalJourney?: string;
        listeningContexts?: string[];
        timeOfDay?: string[];
        activities?: string[];
        seasons?: string[];
        weather?: string[];
        emotionalProfile?: {
          joy?: number;
          sadness?: number;
          anger?: number;
          fear?: number;
          surprise?: number;
          disgust?: number;
          trust?: number;
          anticipation?: number;
        };
        musicalCharacteristics?: {
          tempo?: string;
          dynamics?: string;
          texture?: string;
          complexity?: string;
        };
        culturalContext?: string;
        therapeuticUses?: string[];
        similarMoodTracks?: string[];
        analysis?: string;
      }>(
        [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        { temperature: 0.7 }
      );
      
      console.log('[AI] Mood detection completed:', result.primaryMood);
      return {
        success: true,
        trackId: input.trackId,
        ...result,
      };
    } catch (error) {
      console.error('[AI] Mood detection error:', error);
      return {
        success: false,
        trackId: input.trackId,
        primaryMood: 'unknown',
        error: error instanceof Error ? error.message : 'Failed to detect mood',
      };
    }
  });
