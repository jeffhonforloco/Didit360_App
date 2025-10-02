# SEO Implementation Guide

## Overview

This document describes the comprehensive SEO, SGE (Search Generative Experience), and AI search detection implementation for Didit360.

## Features Implemented

### 1. Meta Tags & Social Sharing

#### Standard Meta Tags
- Title
- Description
- Keywords
- Author
- Robots directives
- Canonical URLs

#### Open Graph (Facebook, LinkedIn, WhatsApp)
- og:title
- og:description
- og:image (1200x630)
- og:url
- og:type (website, music.song, music.album, music.playlist, profile, article)
- og:audio (for music content)
- og:video (for video content)
- og:site_name
- og:locale

#### Twitter Cards
- twitter:card (summary_large_image)
- twitter:title
- twitter:description
- twitter:image
- twitter:site
- twitter:creator
- twitter:player (for audio/video)

#### Mobile & PWA
- theme-color
- apple-mobile-web-app-capable
- apple-mobile-web-app-status-bar-style
- apple-mobile-web-app-title
- application-name
- mobile-web-app-capable

### 2. Structured Data (Schema.org)

#### WebSite Schema
```json
{
  "@type": "WebSite",
  "name": "Didit360",
  "url": "https://rork.com",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://rork.com/search?q={search_term_string}"
  }
}
```

#### Organization Schema
```json
{
  "@type": "Organization",
  "name": "Didit360",
  "logo": "https://rork.com/icon.png",
  "sameAs": [
    "https://twitter.com/didit360",
    "https://facebook.com/didit360",
    "https://instagram.com/didit360"
  ]
}
```

#### WebApplication Schema
```json
{
  "@type": "WebApplication",
  "name": "Didit360",
  "applicationCategory": "MultimediaApplication",
  "operatingSystem": "iOS, Android, Web",
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "ratingCount": "15000"
  }
}
```

#### Music-Specific Schemas
- MusicRecording (for songs)
- MusicAlbum (for albums)
- MusicPlaylist (for playlists)
- Person (for artist profiles)

#### Breadcrumb Schema
Automatically generated for navigation paths.

### 3. AI Search Detection

Detects and logs visits from AI search bots:

#### Supported AI Bots
- **OpenAI**: GPTBot, ChatGPT-User
- **Google**: Google-Extended (Bard/Gemini)
- **Anthropic**: ClaudeBot, anthropic-ai
- **Perplexity**: PerplexityBot
- **Apple**: Applebot-Extended (Apple Intelligence)
- **Meta**: FacebookBot
- **Others**: Cohere, You.com, Diffbot, ByteDance, Common Crawl, Omgili, PetalBot

#### Detection API
```typescript
import { detectAISearchBot } from '@/lib/seo';

const detection = detectAISearchBot(userAgent);
// Returns: { isAI: boolean, bot?: string, type?: 'search' | 'crawler' | 'assistant' }
```

#### Backend Endpoint
```typescript
const result = await trpc.seo.detectBot.query({ userAgent });
```

### 4. Files Created

#### `/public/robots.txt`
- Allows all search engines
- Allows AI bots (GPTBot, ClaudeBot, etc.)
- Blocks admin and API routes
- Includes sitemap reference

#### `/public/sitemap.xml`
- Lists all major pages
- Includes priority and change frequency
- Updated: 2025-10-02

#### `/public/manifest.json`
- PWA manifest
- App icons and splash screens
- Shortcuts to key features
- Theme colors

#### `/public/.well-known/ai-plugin.json`
- AI plugin manifest for ChatGPT and other AI assistants
- Describes API capabilities
- Links to OpenAPI spec

#### `/public/openapi.json`
- OpenAPI 3.0 specification
- Documents public API endpoints
- Used by AI assistants to understand API

#### `/app/+html.tsx`
- Custom HTML wrapper for Expo Router
- Injects meta tags and structured data
- Includes AI-specific metadata

### 5. React Hooks

#### `useSEO(config)`
Updates meta tags dynamically on web:
```typescript
import { useSEO } from '@/hooks/useSEO';

useSEO({
  title: 'Song Title - Artist Name',
  description: 'Listen to this amazing song...',
  type: 'music.song',
  image: 'https://example.com/cover.jpg',
  audio: 'https://example.com/song.mp3'
});
```

#### `useAIBotDetection()`
Detects AI bots on the client side:
```typescript
import { useAIBotDetection } from '@/hooks/useSEO';

useAIBotDetection();
// Sets window.__AI_BOT_DETECTED = true if AI bot is detected
```

### 6. React Components

#### `<PageSEO />`
Declarative SEO component:
```typescript
import { PageSEO } from '@/components/SEOHead';

<PageSEO
  title="My Page"
  description="Page description"
  type="article"
  keywords={['music', 'streaming']}
/>
```

#### `<SEOHead />`
Wrapper component with children:
```typescript
import { SEOHead } from '@/components/SEOHead';

<SEOHead title="My Page" description="Description">
  <YourContent />
</SEOHead>
```

## Usage Examples

### Home Page
```typescript
<PageSEO
  title="Didit360 - Your Ultimate Music Streaming Experience"
  description="Stream millions of songs, discover new artists..."
  type="website"
/>
```

### Song Page
```typescript
<PageSEO
  title={`${song.title} - ${song.artist}`}
  description={`Listen to ${song.title} by ${song.artist}...`}
  type="music.song"
  image={song.coverUrl}
  audio={song.streamUrl}
/>
```

### Artist Page
```typescript
<PageSEO
  title={`${artist.name} - Artist Profile`}
  description={artist.bio}
  type="profile"
  image={artist.photoUrl}
/>
```

### Album Page
```typescript
<PageSEO
  title={`${album.title} - ${album.artist}`}
  description={`${album.trackCount} songs from ${album.artist}...`}
  type="music.album"
  image={album.coverUrl}
/>
```

## Testing

### Test Your Implementation

1. **Google Rich Results Test**
   - https://search.google.com/test/rich-results
   - Validates structured data

2. **Facebook Sharing Debugger**
   - https://developers.facebook.com/tools/debug/
   - Tests Open Graph tags

3. **Twitter Card Validator**
   - https://cards-dev.twitter.com/validator
   - Validates Twitter Cards

4. **LinkedIn Post Inspector**
   - https://www.linkedin.com/post-inspector/
   - Tests LinkedIn sharing

5. **Schema.org Validator**
   - https://validator.schema.org/
   - Validates JSON-LD structured data

### Test Page

Visit `/seo-test` to see:
- All implemented features
- Live AI bot detection
- User agent analysis
- Feature checklist

## SGE Optimization

### What is SGE?

Search Generative Experience (SGE) is Google's AI-powered search that generates answers using AI. Our implementation optimizes for SGE by:

1. **Rich Structured Data**: Comprehensive Schema.org markup
2. **Semantic HTML**: Clear content hierarchy
3. **AI-Friendly Metadata**: Custom AI metadata tags
4. **OpenAPI Spec**: Machine-readable API documentation
5. **AI Plugin Manifest**: ChatGPT and AI assistant integration

### AI-Specific Meta Tags

```html
<meta name="ai-content-declaration" content="This is a music streaming platform..." />
<meta name="ai:purpose" content="Music streaming, discovery, and recommendations" />
<meta name="ai:category" content="Entertainment, Music, Audio" />
<meta name="ai:features" content="Music streaming, Playlists, AI DJ, Podcasts..." />
```

## Backend Integration

### tRPC Endpoints

#### Detect Bot
```typescript
const detection = await trpc.seo.detectBot.query({
  userAgent: 'Mozilla/5.0 ...'
});
```

#### Generate Meta Tags
```typescript
const meta = await trpc.seo.generateMeta.query({
  title: 'My Page',
  description: 'Description',
  type: 'music.song'
});
```

## Best Practices

1. **Always set canonical URLs** to avoid duplicate content
2. **Use high-quality images** (1200x630 for OG images)
3. **Keep descriptions under 160 characters** for search snippets
4. **Update sitemap.xml** when adding new pages
5. **Test on multiple platforms** (Google, Facebook, Twitter, LinkedIn)
6. **Monitor AI bot traffic** using the detection API
7. **Use specific schema types** for music content
8. **Include audio/video URLs** in meta tags when available

## Performance

- Meta tags are injected at build time (SSG)
- No runtime overhead for static pages
- Client-side updates only when needed
- Minimal JavaScript for bot detection

## Browser Support

- All modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Social media in-app browsers
- AI bot crawlers

## Future Enhancements

- [ ] Dynamic sitemap generation from database
- [ ] Automatic OG image generation
- [ ] A/B testing for meta descriptions
- [ ] Analytics integration for AI bot traffic
- [ ] Automatic schema validation
- [ ] Multi-language support

## Support

For questions or issues, contact: support@didit360.com

## License

Proprietary - Didit360 © 2025
