# OpenAI Integration for Didit360

This document describes the comprehensive OpenAI integration across all AI features in Didit360.

## Environment Setup

Add your OpenAI API key to your environment variables:

```bash
# .env or .env.local
EXPO_PUBLIC_OPENAI_API_KEY=sk-your-api-key-here
# or
OPENAI_API_KEY=sk-your-api-key-here
```

The system will check both `EXPO_PUBLIC_OPENAI_API_KEY` and `OPENAI_API_KEY` environment variables.

## Architecture

### Core Service: `backend/services/openai.ts`

This centralized service provides all OpenAI functionality:

- **`getOpenAIClient()`** - Singleton client initialization
- **`generateChatCompletion()`** - Standard chat completions
- **`generateStreamingChatCompletion()`** - Streaming responses
- **`generateJSON()`** - Structured JSON responses
- **`transcribeAudio()`** - Whisper audio transcription
- **`generateEmbedding()`** - Text embeddings
- **`moderateContent()`** - Content moderation

## AI Features Integration

### 1. MixMind (AI DJ)

**Location:** `backend/trpc/routes/mixmind/sessions/create/route.ts`

**Functionality:**
- Generates personalized DJ mixes based on user prompts
- Uses GPT-4o-mini for intelligent track selection
- Considers mood, energy, diversity, tempo, and genre preferences
- Returns structured JSON with track metadata (BPM, key, energy)

**Usage:**
```typescript
const result = await trpc.mixmind.createSession.mutate({
  prompt: "Energetic workout mix",
  mood: "hype",
  energy: 0.8,
  duration: 60,
  limit: 20
});
```

### 2. DJ Instinct Live

**Location:** `backend/trpc/routes/dj-instinct/live/start/route.ts`

**Functionality:**
- Creates live DJ sets with real-time mixing
- Supports advanced parameters (vibe, genres, decades, regions)
- Harmonic mixing with key lock and tempo matching
- Transition styles (fade, echo, cut, drop)
- Explicit content filtering

**Usage:**
```typescript
const session = await trpc.djInstinct.live.start.mutate({
  vibe: "Sunset beach party",
  genres: ["Afrobeats", "House"],
  mood: "groove",
  energy: 65,
  tempoRangeBPM: [96, 128],
  transitionStyle: "fade",
  keyLock: true,
  explicitFilter: "moderate",
  durationMinutes: 120
});
```

### 3. Voice Transcription

**Location:** `backend/trpc/routes/ai/transcribe/route.ts`

**Functionality:**
- Converts audio to text using Whisper
- Supports multiple languages
- Optional prompt for context
- Used in voice-controlled DJ features

**Usage:**
```typescript
const result = await trpc.ai.transcribe.mutate({
  audioData: base64AudioData,
  language: "en",
  prompt: "Music-related commands"
});
```

### 4. AI Recommendations

**Location:** `backend/trpc/routes/ai/recommendations/route.ts`

**Functionality:**
- Personalized music recommendations
- Based on listening history and preferences
- Considers current track, mood, and energy
- Provides similarity scores and reasoning

**Usage:**
```typescript
const recommendations = await trpc.ai.recommendations.query({
  currentTrack: {
    id: "track_123",
    title: "Song Name",
    artist: "Artist Name",
    genre: "Electronic"
  },
  preferences: {
    genres: ["Electronic", "House"],
    energy: 0.7
  },
  limit: 10
});
```

### 5. AI Playlist Generation

**Location:** `backend/trpc/routes/ai/generate-playlist/route.ts`

**Functionality:**
- Creates complete playlists from text prompts
- Considers mood, genres, energy, and duration
- Generates cohesive track sequences
- Includes metadata and reasoning

**Usage:**
```typescript
const playlist = await trpc.ai.generatePlaylist.mutate({
  prompt: "Chill study vibes for late night coding",
  mood: "focus",
  genres: ["Lo-fi", "Ambient"],
  energy: 0.3,
  trackCount: 25
});
```

## Frontend Integration

### MixMind Context

The `contexts/MixMindContext.tsx` uses the OpenAI-powered backend for:
- Mix generation via `generateSet()`
- Voice input transcription
- Real-time analysis

### DJ Instinct Context

The `contexts/DJInstinctContext.tsx` integrates with:
- Live DJ session creation
- Parameter updates
- Safety controls

## Models Used

- **GPT-4o-mini** - Primary model for all text generation (cost-effective, fast)
- **Whisper-1** - Audio transcription
- **text-embedding-3-small** - Text embeddings (future use)

## Error Handling

All AI routes include comprehensive error handling:
- Graceful fallbacks to mock data
- Detailed error logging
- User-friendly error messages
- Timeout protection

## Best Practices

1. **Rate Limiting**: Implement rate limiting on AI endpoints
2. **Caching**: Cache common prompts and responses
3. **Monitoring**: Log all AI requests for debugging
4. **Cost Control**: Set usage limits and alerts
5. **Fallbacks**: Always provide fallback data

## Future Enhancements

- [ ] Streaming responses for real-time DJ mixing
- [ ] Fine-tuned models for music-specific tasks
- [ ] Multi-modal inputs (images, audio analysis)
- [ ] Collaborative filtering with embeddings
- [ ] A/B testing different prompts
- [ ] User feedback loop for improvements

## Testing

Test the integration:

```bash
# Set your API key
export EXPO_PUBLIC_OPENAI_API_KEY=sk-your-key

# Start the development server
bun run start
```

Navigate to the AI DJ tab and try:
1. Voice input for mix generation
2. Text prompts for playlists
3. Live DJ session creation
4. Recommendations based on current track

## Troubleshooting

### API Key Not Found
- Ensure environment variable is set correctly
- Restart the development server after adding the key
- Check both `EXPO_PUBLIC_OPENAI_API_KEY` and `OPENAI_API_KEY`

### Rate Limits
- OpenAI has rate limits based on your tier
- Implement exponential backoff
- Consider caching responses

### Slow Responses
- Use streaming for better UX
- Reduce max_tokens if possible
- Consider using gpt-3.5-turbo for faster responses

## Security

- Never expose API keys in client-side code
- All OpenAI calls are server-side only
- Implement authentication for AI endpoints
- Sanitize user inputs before sending to OpenAI
- Monitor for abuse and unusual patterns

## Cost Optimization

- Use gpt-4o-mini instead of gpt-4 (60x cheaper)
- Cache common responses
- Implement request deduplication
- Set reasonable max_tokens limits
- Monitor usage with OpenAI dashboard

## Support

For issues or questions:
1. Check OpenAI status page
2. Review error logs in console
3. Test with simple prompts first
4. Verify API key permissions
