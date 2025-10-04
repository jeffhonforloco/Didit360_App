# Environment Variables Setup Guide

This guide explains how to configure environment variables for the Didit360 music streaming application.

## Quick Start

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and add your API keys

3. Restart your development server

## Environment Variables

### OpenAI API (Required for AI Features)

```env
EXPO_PUBLIC_OPENAI_API_KEY=sk-your-key-here
```

**Used for:**
- Voice assistant
- Smart recommendations
- Mood detection
- Lyrics analysis
- Audio transcription
- Playlist generation

**Get your key:**
1. Visit https://platform.openai.com/api-keys
2. Create a new API key
3. Copy and paste into your `.env` file

**Cost:** Pay-as-you-go pricing. See https://openai.com/pricing

---

### Catalog API (Optional)

```env
EXPO_PUBLIC_CATALOG_API_URL=https://api.your-catalog.com
EXPO_PUBLIC_CATALOG_API_KEY=your-key-here
```

**Used for:**
- Track metadata retrieval
- Artist information
- Album details
- Video content
- Podcast episodes
- Audiobook data

**If not configured:** The app will use mock data with sample tracks

**API Endpoints Expected:**
- `GET /tracks/{id}` - Get track by ID
- `GET /artists/{id}` - Get artist by ID
- `GET /releases/{id}` - Get album/release by ID
- `GET /videos/{id}` - Get video by ID
- `GET /podcasts/{id}` - Get podcast by ID
- `GET /episodes/{id}` - Get episode by ID
- `GET /search?q={query}&type={type}` - Search content
- `GET /updates?since={timestamp}` - Get content updates
- `GET /rights/check?entity_type={type}&entity_id={id}` - Check streaming rights

---

### Ingest API (Optional)

```env
EXPO_PUBLIC_INGEST_API_URL=https://api.your-ingest.com
EXPO_PUBLIC_INGEST_API_KEY=your-key-here
```

**Used for:**
- DDEX content ingestion
- RSS feed processing (podcasts)
- MusicBrainz metadata import
- Content synchronization

**If not configured:** Ingest features will use mock processing

**API Endpoints Expected:**
- `POST /jobs` - Create ingest job
- `GET /jobs/{id}` - Get job status
- `POST /jobs/{id}/process` - Process job
- `POST /ddex/releases` - Process DDEX release
- `POST /rss/feeds` - Process RSS feed
- `POST /musicbrainz/artists` - Process MusicBrainz artist

---

### Enrichment API (Optional)

```env
EXPO_PUBLIC_ENRICHMENT_API_URL=https://api.your-enrichment.com
EXPO_PUBLIC_ENRICHMENT_API_KEY=your-key-here
```

**Used for:**
- Audio feature extraction (tempo, key, energy, etc.)
- Genre classification
- Mood analysis
- Similarity search
- Content embeddings

**If not configured:** Enrichment features will use mock analysis

**API Endpoints Expected:**
- `POST /audio/analyze` - Analyze audio file
- `POST /audio/features` - Extract audio features
- `POST /genre/classify` - Classify genre
- `POST /mood/analyze` - Analyze mood
- `POST /embeddings` - Generate embeddings
- `GET /similarity/tracks/{id}` - Find similar tracks

---

### News API (Optional)

```env
EXPO_PUBLIC_NEWS_API_KEY=your-key-here
```

**Used for:**
- Music news feed
- Artist news
- Industry updates

**Get your key:**
1. Visit https://newsapi.org/
2. Sign up for a free account
3. Copy your API key

**If not configured:** News features will show placeholder content

---

## Client vs Server Variables

### Client-Side Variables (EXPO_PUBLIC_*)

Variables prefixed with `EXPO_PUBLIC_` are:
- Accessible in React components
- Bundled with your app
- Visible in the client code
- Should be used for public APIs only

Example:
```typescript
const apiKey = process.env.EXPO_PUBLIC_OPENAI_API_KEY;
```

### Server-Side Variables

Variables without `EXPO_PUBLIC_` prefix are:
- Only accessible in backend code
- Not bundled with the app
- Hidden from client
- Should be used for sensitive keys

Example:
```typescript
// In backend/services/openai.ts
const apiKey = process.env.OPENAI_API_KEY || process.env.EXPO_PUBLIC_OPENAI_API_KEY;
```

---

## Fallback Behavior

The app is designed to work without external APIs:

| Service | Without API | With API |
|---------|-------------|----------|
| Catalog | Mock tracks with sample data | Real music catalog |
| Ingest | Mock job processing | Real content ingestion |
| Enrichment | Random audio features | Real audio analysis |
| OpenAI | Error messages | Full AI features |
| News | Placeholder content | Real news articles |

---

## Security Best Practices

1. **Never commit `.env` to git**
   - Already in `.gitignore`
   - Use `.env.example` for documentation

2. **Use different keys for development and production**
   ```env
   # Development
   EXPO_PUBLIC_OPENAI_API_KEY=sk-dev-key
   
   # Production
   EXPO_PUBLIC_OPENAI_API_KEY=sk-prod-key
   ```

3. **Rotate keys regularly**
   - Change keys every 90 days
   - Immediately rotate if compromised

4. **Use server-side keys when possible**
   - Keep sensitive operations on backend
   - Only expose public APIs to client

5. **Monitor API usage**
   - Set up billing alerts
   - Track usage patterns
   - Implement rate limiting

---

## Testing Configuration

To test if your environment variables are loaded:

1. Check console logs on app start:
   ```
   [catalog] Using real API service
   [ingest] Using mock service (no API credentials configured)
   [enrichment] Using mock service (no API credentials configured)
   [OpenAI] Client initialized successfully
   ```

2. Test API calls:
   - Try searching for music
   - Use voice assistant
   - Check if real data loads

---

## Troubleshooting

### Variables not loading

1. Restart your development server after changing `.env`
2. Clear Metro bundler cache:
   ```bash
   npx expo start -c
   ```

### API errors

1. Check API key is correct
2. Verify API URL is accessible
3. Check console for error messages
4. Ensure API key has proper permissions

### Mock data still showing

1. Verify environment variables are set
2. Check console logs for service initialization
3. Ensure API endpoints match expected format

---

## Example Configuration

### Minimal Setup (AI Features Only)

```env
EXPO_PUBLIC_OPENAI_API_KEY=sk-your-key-here
```

### Full Setup (All Features)

```env
EXPO_PUBLIC_OPENAI_API_KEY=sk-your-key-here
EXPO_PUBLIC_CATALOG_API_URL=https://api.catalog.com
EXPO_PUBLIC_CATALOG_API_KEY=catalog-key
EXPO_PUBLIC_INGEST_API_URL=https://api.ingest.com
EXPO_PUBLIC_INGEST_API_KEY=ingest-key
EXPO_PUBLIC_ENRICHMENT_API_URL=https://api.enrichment.com
EXPO_PUBLIC_ENRICHMENT_API_KEY=enrichment-key
EXPO_PUBLIC_NEWS_API_KEY=news-key
```

---

## Support

If you need help with environment configuration:
1. Check console logs for specific errors
2. Verify API endpoints are accessible
3. Test API keys with curl or Postman
4. Review API documentation for your services
