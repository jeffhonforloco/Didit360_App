import { publicProcedure } from "../../../create-context";
import { z } from "zod";

export const updateTrackProcedure = publicProcedure
  .input(
    z.object({
      id: z.string(),
      title: z.string().optional(),
      artistId: z.string().optional(),
      albumId: z.string().optional(),
      duration: z.number().optional(),
      genre: z.string().optional(),
      explicit: z.boolean().optional(),
      isrc: z.string().optional(),
      releaseDate: z.string().optional(),
      coverImage: z.string().optional(),
      streamUrl: z.string().optional(),
      previewUrl: z.string().optional(),
    })
  )
  .mutation(async ({ input }) => {
    console.log("[tracks] Updating track", input);

    const updatedTrack = {
      id: input.id,
      title: input.title || "Updated Track",
      artistId: input.artistId || "artist-1",
      artistName: "Artist Name",
      albumId: input.albumId,
      albumName: input.albumId ? "Album Name" : undefined,
      duration: input.duration || 240000,
      genre: input.genre || "Electronic",
      explicit: input.explicit ?? false,
      isrc: input.isrc,
      releaseDate: input.releaseDate || new Date().toISOString(),
      coverImage: input.coverImage || "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800",
      streamUrl: input.streamUrl || "https://example.com/stream/track.mp3",
      previewUrl: input.previewUrl,
      popularity: 85,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return {
      success: true,
      track: updatedTrack,
    };
  });
