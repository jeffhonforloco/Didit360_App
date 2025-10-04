import type { Track as UITrack } from "@/types";
import type { 
  CatalogTrack, 
  Video, 
  Episode, 
  Audiobook,
  Artist,
  Release 
} from "@/types/catalog";

export function catalogTrackToUITrack(
  catalogTrack: CatalogTrack,
  artists?: Artist[],
  release?: Release
): UITrack {
  const trackArtists = artists || catalogTrack.artists || [];
  const trackRelease = release || catalogTrack.release;
  
  const artistNames = trackArtists.map(a => a.name).join(", ") || "Unknown Artist";
  const artwork = trackRelease?.cover_uri || 
    (trackArtists[0]?.images?.[0]?.uri) || 
    "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop";

  return {
    id: catalogTrack.canonical_id || catalogTrack.id,
    title: catalogTrack.title,
    artist: artistNames,
    album: trackRelease?.title,
    artwork,
    duration: catalogTrack.duration_ms ? Math.floor(catalogTrack.duration_ms / 1000) : 0,
    type: "song",
    audioUrl: catalogTrack.stream_uri || catalogTrack.preview_uri,
  };
}

export function videoToUITrack(
  video: Video,
  artists?: Artist[],
  release?: Release
): UITrack {
  const artistNames = artists?.map(a => a.name).join(", ") || "Unknown Artist";
  const artwork = release?.cover_uri || 
    (artists?.[0]?.images?.[0]?.uri) || 
    "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop";

  return {
    id: video.canonical_id || video.id.toString(),
    title: video.title,
    artist: artistNames,
    album: release?.title,
    artwork,
    duration: video.duration_ms ? Math.floor(video.duration_ms / 1000) : 0,
    type: "video",
    isVideo: true,
    videoUrl: video.stream_uri || video.preview_uri,
  };
}

export function episodeToUITrack(episode: Episode): UITrack {
  return {
    id: episode.canonical_id || episode.id.toString(),
    title: episode.title,
    artist: episode.podcast?.title || "Unknown Podcast",
    artwork: episode.podcast?.images?.[0]?.uri || 
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    duration: episode.duration_ms ? Math.floor(episode.duration_ms / 1000) : 0,
    type: "podcast",
    description: episode.description,
    audioUrl: episode.stream_uri || episode.audio_uri,
  };
}

export function audiobookToUITrack(audiobook: Audiobook): UITrack {
  return {
    id: audiobook.canonical_id || audiobook.id.toString(),
    title: audiobook.book?.title || "Unknown Book",
    artist: audiobook.book?.author || audiobook.narrator || "Unknown Author",
    artwork: audiobook.book?.cover_uri || 
      "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=600&fit=crop",
    duration: audiobook.duration_ms ? Math.floor(audiobook.duration_ms / 1000) : 0,
    type: "audiobook",
    description: audiobook.book?.description,
    audioUrl: audiobook.stream_uri || audiobook.audio_uri,
  };
}

export function artistToSearchResult(artist: Artist) {
  return {
    id: artist.canonical_id || artist.id.toString(),
    name: artist.name,
    image: artist.images?.[0]?.uri || 
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
    followers: "0",
    verified: artist.quality_score > 0.8,
    type: "artist" as const,
  };
}

export function releaseToAlbum(release: Release, artists?: Artist[]) {
  const artistNames = artists?.map(a => a.name).join(", ") || "Unknown Artist";
  
  return {
    id: release.canonical_id || release.id.toString(),
    title: release.title,
    artist: artistNames,
    year: release.date_released ? new Date(release.date_released).getFullYear().toString() : "",
    artwork: release.cover_uri || 
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
    type: "album" as const,
  };
}
