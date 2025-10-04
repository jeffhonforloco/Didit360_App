import { publicProcedure } from "../../../create-context";
import { z } from "zod";

export const getTrackByIdProcedure = publicProcedure
  .input(
    z.object({
      id: z.string(),
    })
  )
  .query(async ({ input }) => {
    console.log("[tracks] Getting track", input.id);

    const mockTrack = {
      id: input.id,
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
      lyrics: "Sample lyrics for the track...",
      credits: [
        { role: "Producer", name: "John Doe" },
        { role: "Mixer", name: "Jane Smith" },
      ],
      audioFeatures: {
        tempo: 128,
        key: "C",
        energy: 0.8,
        danceability: 0.7,
        valence: 0.6,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return mockTrack;
  });
