import OpenAI from 'openai';

let openaiClient: OpenAI | null = null;

export function getOpenAIClient(): OpenAI {
  if (!openaiClient) {
    const apiKey = process.env.EXPO_PUBLIC_OPENAI_API_KEY || process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      console.error('[OpenAI] API key not found in environment variables');
      throw new Error('OpenAI API key is not configured. Please add EXPO_PUBLIC_OPENAI_API_KEY to your environment variables.');
    }
    
    openaiClient = new OpenAI({
      apiKey,
    });
    
    console.log('[OpenAI] Client initialized successfully');
  }
  
  return openaiClient;
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export async function generateChatCompletion(
  messages: ChatMessage[],
  options?: {
    model?: string;
    temperature?: number;
    maxTokens?: number;
    stream?: boolean;
  }
): Promise<string> {
  try {
    const client = getOpenAIClient();
    
    const response = await client.chat.completions.create({
      model: options?.model || 'gpt-4o-mini',
      messages,
      temperature: options?.temperature ?? 0.7,
      max_tokens: options?.maxTokens ?? 2000,
      stream: false,
    });
    
    const content = response.choices[0]?.message?.content || '';
    console.log('[OpenAI] Chat completion generated successfully');
    return content;
  } catch (error) {
    console.error('[OpenAI] Chat completion error:', error);
    throw error;
  }
}

export async function generateStreamingChatCompletion(
  messages: ChatMessage[],
  onChunk: (chunk: string) => void,
  options?: {
    model?: string;
    temperature?: number;
    maxTokens?: number;
  }
): Promise<void> {
  try {
    const client = getOpenAIClient();
    
    const stream = await client.chat.completions.create({
      model: options?.model || 'gpt-4o-mini',
      messages,
      temperature: options?.temperature ?? 0.7,
      max_tokens: options?.maxTokens ?? 2000,
      stream: true,
    });
    
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || '';
      if (content) {
        onChunk(content);
      }
    }
    
    console.log('[OpenAI] Streaming chat completion finished');
  } catch (error) {
    console.error('[OpenAI] Streaming chat completion error:', error);
    throw error;
  }
}

export async function generateJSON<T = any>(
  messages: ChatMessage[],
  options?: {
    model?: string;
    temperature?: number;
  }
): Promise<T> {
  try {
    const client = getOpenAIClient();
    
    const response = await client.chat.completions.create({
      model: options?.model || 'gpt-4o-mini',
      messages,
      temperature: options?.temperature ?? 0.7,
      response_format: { type: 'json_object' },
    });
    
    const content = response.choices[0]?.message?.content || '{}';
    const parsed = JSON.parse(content);
    console.log('[OpenAI] JSON generation successful');
    return parsed as T;
  } catch (error) {
    console.error('[OpenAI] JSON generation error:', error);
    throw error;
  }
}

export async function transcribeAudio(
  audioFile: File | Blob,
  options?: {
    language?: string;
    prompt?: string;
  }
): Promise<{ text: string; language: string }> {
  try {
    const client = getOpenAIClient();
    
    const response = await client.audio.transcriptions.create({
      file: audioFile as any,
      model: 'whisper-1',
      language: options?.language,
      prompt: options?.prompt,
    });
    
    console.log('[OpenAI] Audio transcription successful');
    return {
      text: response.text,
      language: options?.language || 'en',
    };
  } catch (error) {
    console.error('[OpenAI] Audio transcription error:', error);
    throw error;
  }
}

export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const client = getOpenAIClient();
    
    const response = await client.embeddings.create({
      model: 'text-embedding-3-small',
      input: text,
    });
    
    console.log('[OpenAI] Embedding generated successfully');
    return response.data[0].embedding;
  } catch (error) {
    console.error('[OpenAI] Embedding generation error:', error);
    throw error;
  }
}

export async function moderateContent(text: string): Promise<{
  flagged: boolean;
  categories: Record<string, boolean>;
}> {
  try {
    const client = getOpenAIClient();
    
    const response = await client.moderations.create({
      input: text,
    });
    
    const result = response.results[0];
    console.log('[OpenAI] Content moderation completed');
    return {
      flagged: result.flagged,
      categories: Object.entries(result.categories).reduce((acc, [key, value]) => {
        acc[key] = value;
        return acc;
      }, {} as Record<string, boolean>),
    };
  } catch (error) {
    console.error('[OpenAI] Content moderation error:', error);
    throw error;
  }
}
