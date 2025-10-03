import { z } from "zod";
import { publicProcedure } from "@/backend/trpc/create-context";
import { generateJSON } from "@/backend/services/openai";

export const voiceCommandProcedure = publicProcedure
  .input(
    z.object({
      command: z.string(),
      context: z.object({
        currentTrack: z.object({
          id: z.string(),
          title: z.string(),
          artist: z.string(),
        }).optional(),
        isPlaying: z.boolean().optional(),
        volume: z.number().optional(),
        queueLength: z.number().optional(),
        currentPlaylist: z.string().optional(),
      }).optional(),
    })
  )
  .mutation(async ({ input }) => {
    console.log('[AI] Processing voice command:', input.command);
    
    try {
      const systemPrompt = `You are a voice-controlled DJ assistant. You understand natural language commands for music control and respond with structured actions. You can:
- Play/pause/skip tracks
- Adjust volume
- Search for music
- Create playlists
- Change mood/energy
- Get recommendations
- Control DJ features
- Answer music questions

Parse commands and return structured actions.`;
      
      const contextInfo = input.context ? `
CURRENT CONTEXT:
${input.context.currentTrack ? `Now Playing: "${input.context.currentTrack.title}" by ${input.context.currentTrack.artist}` : 'Nothing playing'}
${input.context.isPlaying !== undefined ? `Status: ${input.context.isPlaying ? 'Playing' : 'Paused'}` : ''}
${input.context.volume !== undefined ? `Volume: ${input.context.volume}%` : ''}
${input.context.queueLength !== undefined ? `Queue: ${input.context.queueLength} tracks` : ''}
${input.context.currentPlaylist ? `Playlist: ${input.context.currentPlaylist}` : ''}
` : '';
      
      const userPrompt = `Parse this voice command: "${input.command}"
${contextInfo}

Determine the user's intent and return structured actions. Return JSON:
{
  "intent": "play|pause|skip|search|volume|playlist|mood|recommendation|question|dj_control|unknown",
  "confidence": 0.95,
  "actions": [
    {
      "type": "play|pause|skip|search|volume|add_to_queue|create_playlist|change_mood|get_recommendations",
      "parameters": {
        "query": "search query",
        "trackId": "track_id",
        "volume": 75,
        "direction": "up|down|next|previous",
        "mood": "energetic",
        "energy": 0.8,
        "genre": "electronic",
        "playlistName": "My Playlist"
      }
    }
  ],
  "response": "Natural language response to user",
  "needsConfirmation": false,
  "clarificationNeeded": false,
  "clarificationQuestion": "What did you mean by...?",
  "suggestions": ["Alternative action 1", "Alternative action 2"]
}`;
      
      const result = await generateJSON<{
        intent: string;
        confidence?: number;
        actions?: Array<{
          type: string;
          parameters?: Record<string, any>;
        }>;
        response?: string;
        needsConfirmation?: boolean;
        clarificationNeeded?: boolean;
        clarificationQuestion?: string;
        suggestions?: string[];
      }>(
        [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        { temperature: 0.3 }
      );
      
      console.log('[AI] Voice command processed:', result.intent);
      return {
        success: true,
        command: input.command,
        ...result,
      };
    } catch (error) {
      console.error('[AI] Voice command error:', error);
      return {
        success: false,
        command: input.command,
        intent: 'unknown',
        response: "I'm sorry, I didn't understand that command. Could you try again?",
        error: error instanceof Error ? error.message : 'Failed to process command',
      };
    }
  });

export const conversationProcedure = publicProcedure
  .input(
    z.object({
      messages: z.array(
        z.object({
          role: z.enum(['user', 'assistant']),
          content: z.string(),
        })
      ),
      context: z.object({
        userName: z.string().optional(),
        musicPreferences: z.array(z.string()).optional(),
        currentMood: z.string().optional(),
      }).optional(),
    })
  )
  .mutation(async ({ input }) => {
    console.log('[AI] Processing conversation with', input.messages.length, 'messages');
    
    try {
      const systemPrompt = `You are a friendly, knowledgeable AI DJ assistant named "DJ Instinct". You help users discover music, create playlists, and control their listening experience. You have personality, enthusiasm for music, and deep knowledge across all genres. You're conversational, helpful, and can discuss music theory, history, and culture.

${input.context?.userName ? `The user's name is ${input.context.userName}.` : ''}
${input.context?.musicPreferences && input.context.musicPreferences.length > 0 ? `They enjoy: ${input.context.musicPreferences.join(', ')}.` : ''}
${input.context?.currentMood ? `Their current mood is: ${input.context.currentMood}.` : ''}

Be natural, engaging, and helpful. Use music knowledge to enhance conversations.`;
      
      const messages = [
        { role: 'system' as const, content: systemPrompt },
        ...input.messages.map(m => ({
          role: m.role === 'user' ? 'user' as const : 'assistant' as const,
          content: m.content,
        })),
      ];
      
      const result = await generateJSON<{
        response: string;
        suggestedActions?: Array<{
          type: string;
          label: string;
          parameters?: Record<string, any>;
        }>;
        musicRecommendations?: Array<{
          title: string;
          artist: string;
          reason: string;
        }>;
        mood?: string;
        topics?: string[];
      }>(
        messages,
        { temperature: 0.8 }
      );
      
      console.log('[AI] Conversation response generated');
      return {
        success: true,
        ...result,
      };
    } catch (error) {
      console.error('[AI] Conversation error:', error);
      return {
        success: false,
        response: "I'm having trouble processing that right now. Could you try again?",
        error: error instanceof Error ? error.message : 'Failed to process conversation',
      };
    }
  });
