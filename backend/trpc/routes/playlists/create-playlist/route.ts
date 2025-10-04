import { publicProcedure } from "../../../create-context";
import { z } from "zod";

export const createPlaylistProcedure = publicProcedure
  .input(
    z.object({
      name: z.string(),
      description: z.string().optional(),
      userId: z.string(),
      isPublic: z.boolean().optional().default(true),
      coverImage: z.string().optional(),
    })
  )
  .mutation(async ({ input }) => {
    console.log("[playlists] Creating playlist", input);

    const newPlaylist = {
      id: `playlist-${Date.now()}`,
      name: input.name,
      description: input.description || "",
      userId: input.userId,
      isPublic: input.isPublic,
      trackCount: 0,
      duration: 0,
      coverImage: input.coverImage || "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return {
      success: true,
      playlist: newPlaylist,
    };
  });
