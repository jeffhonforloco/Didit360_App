import { publicProcedure } from "../../../create-context";
import { z } from "zod";

export const getTracksProcedure = publicProcedure
  .input(
    z.object({
      limit: z.number().optional().default(20),
      offset: z.number().optional().default(0),
      genre: z.string().optional(),
      artistId: z.string().optional(),
      albumId: z.string().optional(),
    })
  )
  .query(async ({ input }) => {
    console.log("[tracks] Getting tracks", input);

    const mockTracks = [
      {
        id: "track-1",
        title: "Sunset Dreams",
        artistId: "artist-1",
        artistName: "Electronic Waves",
        albumId: "album-1",
        albumName: "Neon Nights",
        duration: 240000,
        genre: "Electronic",
        explicit: false,
        isrc: "USRC12345678",
        releaseDate: "2024-01-15",
        coverImage: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800",
        streamUrl: "https://example.com/stream/track-1.mp3",
        previewUrl: "https://example.com/preview/track-1.mp3",
        popularity: 85,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "track-2",
        title: "Midnight City",
        artistId: "artist-2",
        artistName: "Neon Lights",
        albumId: "album-2",
        albumName: "Urban Dreams",
        duration: 300000,
        genre: "Synthwave",
        explicit: false,
        isrc: "USRC87654321",
        releaseDate: "2024-02-20",
        coverImage: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800",
        streamUrl: "https://example.com/stream/track-2.mp3",
        previewUrl: "https://example.com/preview/track-2.mp3",
        popularity: 92,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "track-3",
        title: "Ocean Waves",
        artistId: "artist-3",
        artistName: "Ambient Collective",
        albumId: "album-3",
        albumName: "Nature Sounds",
        duration: 360000,
        genre: "Ambient",
        explicit: false,
        isrc: "USRC11223344",
        releaseDate: "2024-03-10",
        coverImage: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800",
        streamUrl: "https://example.com/stream/track-3.mp3",
        previewUrl: "https://example.com/preview/track-3.mp3",
        popularity: 78,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    let filteredTracks = mockTracks;

    if (input.genre) {
      filteredTracks = filteredTracks.filter((t) => t.genre === input.genre);
    }
    if (input.artistId) {
      filteredTracks = filteredTracks.filter((t) => t.artistId === input.artistId);
    }
    if (input.albumId) {
      filteredTracks = filteredTracks.filter((t) => t.albumId === input.albumId);
    }

    const paginatedTracks = filteredTracks.slice(
      input.offset,
      input.offset + input.limit
    );

    return {
      tracks: paginatedTracks,
      total: filteredTracks.length,
      limit: input.limit,
      offset: input.offset,
    };
  });
