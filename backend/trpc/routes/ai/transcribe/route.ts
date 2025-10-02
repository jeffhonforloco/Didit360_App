import { z } from "zod";
import { publicProcedure } from "@/backend/trpc/create-context";
import { transcribeAudio } from "@/backend/services/openai";

export const transcribeProcedure = publicProcedure
  .input(
    z.object({
      audioData: z.string(),
      language: z.string().optional(),
      prompt: z.string().optional(),
    })
  )
  .mutation(async ({ input }) => {
    console.log('[AI] Transcribing audio');
    
    try {
      const base64Data = input.audioData.split(',')[1] || input.audioData;
      const audioBuffer = Buffer.from(base64Data, 'base64');
      const audioBlob = new Blob([audioBuffer], { type: 'audio/wav' });
      
      const result = await transcribeAudio(audioBlob as any, {
        language: input.language,
        prompt: input.prompt,
      });
      
      console.log('[AI] Transcription successful:', result.text);
      return {
        success: true,
        text: result.text,
        language: result.language,
      };
    } catch (error) {
      console.error('[AI] Transcription error:', error);
      return {
        success: false,
        text: '',
        language: 'en',
        error: error instanceof Error ? error.message : 'Transcription failed',
      };
    }
  });
