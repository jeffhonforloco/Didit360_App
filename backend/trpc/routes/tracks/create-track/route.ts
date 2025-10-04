import { publicProcedure } from "../../../create-context";
import { z } from "zod";

export const createTrackProcedure = publicProcedure
  .input(
    z.object({
      title: z.string(),
      artistId: z.string(),
      albumId: z.string().optional(),
      duration: z.number(),
      genre: z.string(),
      explicit: z.boolean().optional().default(false),
      isrc: z.string().optional(),
      releaseDate: z.string().optional(),
      coverImage: z.string().optional(),
      streamUrl: z.string(),
      previewUrl: z.string().optional(),
    })
  )
  .mutation(async ({ input }) => {
    console.log("[tracks] Creating track", input);

    const newTrack = {
      id: `track-${Date.now()}`,
      title: input.title,
      artistId: input.artistId,
      artistName: "Artist Name",
      albumId: input.albumId,
      albumName: input.albumId ? "Album Name" : undefined,
      duration: input.duration,
      genre: input.genre,
      explicit: input.explicit,
      isrc: input.isrc,
      releaseDate: input.releaseDate || new Date().toISOString(),
      coverImage: input.coverImage || "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800",
      streamUrl: input.streamUrl,
      previewUrl: input.previewUrl,
      popularity: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return {
      success: true,
      track: newTrack,
    };
  });
