import { publicProcedure } from "../../../create-context";
import { z } from "zod";

export const updateAlbumProcedure = publicProcedure
  .input(
    z.object({
      id: z.string(),
      title: z.string().optional(),
      artistId: z.string().optional(),
      releaseDate: z.string().optional(),
      genre: z.string().optional(),
      coverImage: z.string().optional(),
      label: z.string().optional(),
      upc: z.string().optional(),
      type: z.enum(["album", "single", "ep"]).optional(),
      description: z.string().optional(),
    })
  )
  .mutation(async ({ input }) => {
    console.log("[albums] Updating album", input);

    const updatedAlbum = {
      id: input.id,
      title: input.title || "Updated Album",
      artistId: input.artistId || "artist-1",
      artistName: "Artist Name",
      releaseDate: input.releaseDate || new Date().toISOString(),
      genre: input.genre || "Electronic",
      trackCount: 12,
      duration: 2880000,
      coverImage: input.coverImage || "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800",
      label: input.label,
      upc: input.upc,
      type: input.type || "album",
      popularity: 88,
      description: input.description,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return {
      success: true,
      album: updatedAlbum,
    };
  });
