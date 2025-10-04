import { publicProcedure } from "../../../create-context";
import { z } from "zod";

export const deletePlaylistProcedure = publicProcedure
  .input(
    z.object({
      id: z.string(),
    })
  )
  .mutation(async ({ input }) => {
    console.log("[playlists] Deleting playlist", input.id);

    return {
      success: true,
      message: `Playlist ${input.id} deleted successfully`,
    };
  });
