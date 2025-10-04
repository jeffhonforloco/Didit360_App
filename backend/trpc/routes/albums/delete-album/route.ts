import { publicProcedure } from "../../../create-context";
import { z } from "zod";

export const deleteAlbumProcedure = publicProcedure
  .input(
    z.object({
      id: z.string(),
    })
  )
  .mutation(async ({ input }) => {
    console.log("[albums] Deleting album", input.id);

    return {
      success: true,
      message: `Album ${input.id} deleted successfully`,
    };
  });
