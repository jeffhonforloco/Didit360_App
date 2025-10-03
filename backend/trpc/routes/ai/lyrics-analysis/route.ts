import { z } from "zod";
import { publicProcedure } from "@/backend/trpc/create-context";
import { generateJSON, generateChatCompletion } from "@/backend/services/openai";

export const lyricsAnalysisProcedure = publicProcedure
  .input(
    z.object({
      lyrics: z.string(),
      trackTitle: z.string().optional(),
      artist: z.string().optional(),
    })
  )
  .mutation(async ({ input }) => {
    console.log('[AI] Analyzing lyrics');
    
    try {
      const systemPrompt = `You are an expert in literary analysis, poetry, and songwriting. You analyze lyrics for:
- Themes and motifs
- Literary devices (metaphor, simile, alliteration, etc.)
- Emotional content and tone
- Narrative structure
- Cultural references
- Poetic techniques
- Songwriting craft`;
      
      const userPrompt = `Analyze these lyrics in detail:

${input.trackTitle && input.artist ? `Track: "${input.trackTitle}" by ${input.artist}\n` : ''}
LYRICS:
${input.lyrics}

Provide comprehensive analysis. Return JSON:
{
  "themes": ["love", "loss", "hope"],
  "mainTheme": "Primary theme description",
  "emotionalTone": "melancholic|uplifting|angry|peaceful|etc",
  "narrativePerspective": "first person|third person|etc",
  "literaryDevices": [
    {
      "device": "metaphor",
      "example": "Quote from lyrics",
      "explanation": "How it's used"
    }
  ],
  "culturalReferences": ["reference1", "reference2"],
  "keyPhrases": ["memorable phrase 1", "memorable phrase 2"],
  "structure": "verse-chorus|narrative|stream of consciousness|etc",
  "vocabulary": "simple|moderate|complex",
  "imagery": ["visual", "auditory", "tactile"],
  "mood": "Description of overall mood",
  "message": "Core message or meaning",
  "interpretation": "Detailed interpretation",
  "writingQuality": {
    "originality": 0.8,
    "emotionalImpact": 0.9,
    "poeticCraft": 0.7,
    "memorability": 0.85
  },
  "similarSongs": ["song1", "song2"],
  "analysis": "Full detailed analysis"
}`;
      
      const result = await generateJSON<{
        themes?: string[];
        mainTheme?: string;
        emotionalTone?: string;
        narrativePerspective?: string;
        literaryDevices?: Array<{
          device: string;
          example: string;
          explanation: string;
        }>;
        culturalReferences?: string[];
        keyPhrases?: string[];
        structure?: string;
        vocabulary?: string;
        imagery?: string[];
        mood?: string;
        message?: string;
        interpretation?: string;
        writingQuality?: {
          originality?: number;
          emotionalImpact?: number;
          poeticCraft?: number;
          memorability?: number;
        };
        similarSongs?: string[];
        analysis?: string;
      }>(
        [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        { temperature: 0.7 }
      );
      
      console.log('[AI] Lyrics analysis completed');
      return {
        success: true,
        ...result,
      };
    } catch (error) {
      console.error('[AI] Lyrics analysis error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to analyze lyrics',
      };
    }
  });

export const generateLyricsProcedure = publicProcedure
  .input(
    z.object({
      prompt: z.string(),
      style: z.string().optional(),
      mood: z.string().optional(),
      theme: z.string().optional(),
      genre: z.string().optional(),
      structure: z.enum(['verse-chorus', 'verse-chorus-bridge', 'freestyle', 'narrative']).optional(),
      length: z.enum(['short', 'medium', 'long']).default('medium'),
    })
  )
  .mutation(async ({ input }) => {
    console.log('[AI] Generating lyrics with prompt:', input.prompt);
    
    try {
      const systemPrompt = `You are a talented songwriter and lyricist. You create original, creative, and emotionally resonant lyrics across all genres. You understand:
- Song structure and flow
- Rhyme schemes and meter
- Emotional storytelling
- Genre conventions
- Poetic devices
- Memorable hooks and choruses`;
      
      const lengthGuide = {
        short: '2 verses, 1 chorus (8-12 lines total)',
        medium: '2 verses, 2 choruses, 1 bridge (16-24 lines)',
        long: '3 verses, 3 choruses, 1 bridge, 1 outro (24-32 lines)',
      };
      
      const userPrompt = `Write original song lyrics based on this prompt: "${input.prompt}"

${input.style ? `Style: ${input.style}` : ''}
${input.mood ? `Mood: ${input.mood}` : ''}
${input.theme ? `Theme: ${input.theme}` : ''}
${input.genre ? `Genre: ${input.genre}` : ''}
${input.structure ? `Structure: ${input.structure}` : ''}
Length: ${lengthGuide[input.length]}

Create compelling, original lyrics with:
- Strong imagery and metaphors
- Emotional depth
- Memorable hooks
- Natural flow and rhythm
- Appropriate rhyme scheme

Return the complete lyrics with clear section labels (Verse 1, Chorus, etc.)`;
      
      const lyrics = await generateChatCompletion(
        [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        { temperature: 0.9, maxTokens: 1000 }
      );
      
      console.log('[AI] Lyrics generation completed');
      return {
        success: true,
        lyrics,
        metadata: {
          prompt: input.prompt,
          style: input.style,
          mood: input.mood,
          theme: input.theme,
          genre: input.genre,
          structure: input.structure,
          length: input.length,
        },
      };
    } catch (error) {
      console.error('[AI] Lyrics generation error:', error);
      return {
        success: false,
        lyrics: '',
        error: error instanceof Error ? error.message : 'Failed to generate lyrics',
      };
    }
  });
