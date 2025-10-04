import { publicProcedure } from "../../../create-context";
import { z } from "zod";

export const updatePlaylistProcedure = publicProcedure
  .input(
    z.object({
      id: z.string(),
      name: z.string().optional(),
      description: z.string().optional(),
      isPublic: z.boolean().optional(),
      coverImage: z.string().optional(),
    })
  )
  .mutation(async ({ input }) => {
    console.log("[playlists] Updating playlist", input);

    const updatedPlaylist = {
      id: input.id,
      name: input.name || "Updated Playlist",
      description: input.description || "Updated description",
      userId: "user-1",
      isPublic: input.isPublic ?? true,
      trackCount: 25,
      duration: 5400000,
      coverImage: input.coverImage || "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return {
      success: true,
      playlist: updatedPlaylist,
    };
  });
