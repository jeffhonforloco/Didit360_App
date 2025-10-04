# Catalog Integration Guide

## Problem Summary

When trying to replace dummy mock images with real data from the backend catalog APIs, you encountered type mismatches between:

1. **UI/Mock Data Types** (`@/types/index.ts`) - Simple, flat structure
2. **Catalog API Types** (`@/types/catalog.ts`) - Complex, normalized structure

## Type Differences

### Mock Data (UI Types)
```typescript
interface Track {
  id: string;              // Simple string ID
  title: string;
  artist: string;          // Single artist name as string
  artwork: string;         // Direct image URL
  audioUrl?: string;       // Direct audio URL
  duration: number;        // Duration in seconds
  type: "song" | "podcast" | "audiobook" | "video";
}
```

### Catalog Data (Backend Types)
```typescript
interface CatalogTrack {
  id: number;              // Numeric database ID
  canonical_id: string;    // Unique canonical identifier
  title: string;
  artists?: Artist[];      // Array of artist objects
  release?: Release;       // Release object with cover_uri
  stream_uri?: string;     // Streaming URL
  preview_uri?: string;    // Preview URL
  duration_ms?: number;    // Duration in milliseconds
  media_type: 'audio';     // Literal type
  // ... many more fields
}
```

## Solution: Catalog Adapter

Created `lib/catalog-adapter.ts` to bridge the two type systems:

```typescript
import { catalogTrackToUITrack } from '@/lib/catalog-adapter';

// In your component:
const trackQuery = trpc.catalog.getTrack.useQuery({ id });
const catalogTrack = trackQuery.data;
const uiTrack = catalogTrack ? catalogTrackToUITrack(catalogTrack) : null;

// Now uiTrack has the correct UI type and can be used everywhere
```

## Available Adapter Functions

1. **catalogTrackToUITrack** - Converts CatalogTrack → UITrack
2. **videoToUITrack** - Converts Video → UITrack
3. **episodeToUITrack** - Converts Episode → UITrack
4. **audiobookToUITrack** - Converts Audiobook → UITrack
5. **artistToSearchResult** - Converts Artist → SearchResult
6. **releaseToAlbum** - Converts Release → Album

## How to Use Real Data

### Step 1: Query the Catalog API
```typescript
import { trpc } from '@/lib/trpc';
import { catalogTrackToUITrack } from '@/lib/catalog-adapter';

const trackQuery = trpc.catalog.getTrack.useQuery({ id: 'track-1' });
```

### Step 2: Convert to UI Type
```typescript
const catalogTrack = trackQuery.data;
const track = catalogTrack ? catalogTrackToUITrack(catalogTrack) : null;
```

### Step 3: Use in UI
```typescript
if (track) {
  return (
    <Image source={{ uri: track.artwork }} />
    <Text>{track.title}</Text>
    <Text>{track.artist}</Text>
  );
}
```

## Example: Song Detail Screen

See `app/song/[id].tsx` for a complete example of:
- Querying catalog data
- Converting to UI types
- Checking streaming rights
- Displaying in UI

## Common Pitfalls

### 1. Type Mismatch Errors
**Error**: `Type 'string' is not assignable to type '"audio"'`

**Solution**: Use `as const` for literal types:
```typescript
media_type: 'audio' as const,  // ✅ Correct
media_type: 'audio',           // ❌ Wrong
```

### 2. Missing Fields
**Error**: `Property 'artwork' does not exist on type 'CatalogTrack'`

**Solution**: Use the adapter to map fields correctly:
```typescript
// ❌ Wrong - CatalogTrack doesn't have 'artwork'
<Image source={{ uri: catalogTrack.artwork }} />

// ✅ Correct - Use adapter
const track = catalogTrackToUITrack(catalogTrack);
<Image source={{ uri: track.artwork }} />
```

### 3. Duration Conversion
**Error**: Duration shows wrong values

**Solution**: Catalog uses milliseconds, UI uses seconds:
```typescript
// Adapter handles this automatically:
duration: catalogTrack.duration_ms ? Math.floor(catalogTrack.duration_ms / 1000) : 0
```

## Testing with Mock Data

The backend currently returns mock data. To test:

1. Navigate to `/song/track-1` - Should load successfully
2. Check console for `[catalog] Getting track: track-1`
3. Verify image, title, and duration display correctly

## Next Steps

1. **Implement Real Backend**: Replace mock data in `backend/services/catalog.ts` with actual database queries
2. **Add More Tracks**: Expand the mock data map with more test tracks
3. **Implement Search**: Use `trpc.catalog.search` with the adapter for search results
4. **Add Caching**: Use React Query's caching features for better performance

## API Routes Available

- `trpc.catalog.getTrack` - Get single track
- `trpc.catalog.getVideo` - Get single video
- `trpc.catalog.getArtist` - Get artist details
- `trpc.catalog.getRelease` - Get album/release
- `trpc.catalog.search` - Search catalog
- `trpc.catalog.rights.isStreamable` - Check streaming rights
- `trpc.catalog.updates` - Get catalog updates feed

All routes return catalog types that need to be converted using the adapter before use in UI.
