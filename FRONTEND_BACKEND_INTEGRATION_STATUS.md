# Frontend-Backend Integration Status

## Current Issue

The frontend is **NOT using real backend data** because:

### 1. Data Format Mismatch

**Backend Returns:**
```typescript
// trpc.tracks.getTracks.useQuery()
{
  tracks: Track[],  // ← Array is nested here
  total: number,
  limit: number,
  offset: number
}

// trpc.artists.getArtists.useQuery()
{
  artists: Artist[],  // ← Array is nested here
  total: number,
  limit: number,
  offset: number
}

// trpc.catalog.getFeatured.useQuery()
{
  items: {id, type, score}[],  // ← Only IDs, not full objects
  algorithm: {...},
  lastUpdated: number
}
```

**Frontend Expects:**
```typescript
Track[]  // Direct array
Artist[]  // Direct array
```

### 2. Missing Data Extraction

The frontend code does:
```typescript
const tracksQuery = trpc.tracks.getTracks.useQuery({ limit: 100 });
const allTracks = tracksQuery.data || [];  // ❌ WRONG

// tracksQuery.data is { tracks: [...], total, limit, offset }
// NOT an array!
```

**Should be:**
```typescript
const allTracks = tracksQuery.data?.tracks || [];  // ✅ CORRECT
```

### 3. Type Mismatch

Backend track format:
```typescript
{
  id: string,
  title: string,
  artistId: string,
  artistName: string,
  albumId: string,
  albumName: string,
  duration: number,  // milliseconds
  coverImage: string,
  streamUrl: string,
  // ...
}
```

Frontend expects:
```typescript
{
  id: string,
  title: string,
  artist: string,  // ← Different field name
  album: string,   // ← Different field name
  artwork: string,  // ← Different field name
  duration: number,  // seconds, not milliseconds
  type: 'song' | 'video' | 'podcast' | 'audiobook',
  audioUrl: string,  // ← Different field name
  // ...
}
```

## Solution

### Step 1: Extract Data from API Responses

```typescript
// ❌ WRONG
const allTracks = tracksQuery.data || [];

// ✅ CORRECT
const allTracks = tracksQuery.data?.tracks || [];
const allArtists = artistsQuery.data?.artists || [];
```

### Step 2: Convert Backend Format to UI Format

Create adapter functions:

```typescript
function backendTrackToUITrack(backendTrack: BackendTrack): Track {
  return {
    id: backendTrack.id,
    title: backendTrack.title,
    artist: backendTrack.artistName,
    album: backendTrack.albumName,
    artwork: backendTrack.coverImage,
    duration: Math.floor(backendTrack.duration / 1000), // ms to seconds
    type: 'song',
    audioUrl: backendTrack.streamUrl,
  };
}

// Use it:
const uiTracks = (tracksQuery.data?.tracks || []).map(backendTrackToUITrack);
```

### Step 3: Update All Screens

Files that need updating:
- ✅ `app/song/[id].tsx` - Already uses backend
- ❌ `app/(tabs)/index.tsx` - Uses mock data
- ❌ `app/artist/[id].tsx` - Uses mock data
- ❌ `app/album/[id].tsx` - Uses mock data
- ⚠️ `app/(tabs)/search.tsx` - Partially uses backend

## Quick Fix

Replace in `app/(tabs)/index.tsx`:

```typescript
// Line 46-48: Extract arrays from API responses
const allTracks = (tracksQuery.data?.tracks || []).map(t => ({
  ...t,
  artist: t.artistName,
  album: t.albumName,
  artwork: t.coverImage,
  duration: Math.floor(t.duration / 1000),
  type: 'song' as const,
  audioUrl: t.streamUrl,
}));

const allArtists = (artistsQuery.data?.artists || []).map(a => ({
  id: a.id,
  name: a.name,
  image: a.image,
  followers: `${(a.followers / 1000).toFixed(0)}K`,
  verified: a.verified,
}));

const featured = featuredQuery.data?.items || [];
```

## Why This Matters

Without these fixes:
- `allTracks.filter()` fails because `allTracks` is an object, not an array
- `allArtists.slice()` fails for the same reason
- The app shows **NO DATA** from the backend
- Everything falls back to mock data

With these fixes:
- Backend data flows to the frontend
- Real tracks, artists, and albums display
- Mock data is no longer needed
