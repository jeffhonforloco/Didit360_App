import { publicProcedure } from "../../../create-context";
import { z } from "zod";

export const createAlbumProcedure = publicProcedure
  .input(
    z.object({
      title: z.string(),
      artistId: z.string(),
      releaseDate: z.string(),
      genre: z.string(),
      coverImage: z.string().optional(),
      label: z.string().optional(),
      upc: z.string().optional(),
      type: z.enum(["album", "single", "ep"]).optional().default("album"),
      description: z.string().optional(),
    })
  )
  .mutation(async ({ input }) => {
    console.log("[albums] Creating album", input);

    const newAlbum = {
      id: `album-${Date.now()}`,
      title: input.title,
      artistId: input.artistId,
      artistName: "Artist Name",
      releaseDate: input.releaseDate,
      genre: input.genre,
      trackCount: 0,
      duration: 0,
      coverImage: input.coverImage || "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800",
      label: input.label,
      upc: input.upc,
      type: input.type,
      popularity: 0,
      description: input.description,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return {
      success: true,
      album: newAlbum,
    };
  });
