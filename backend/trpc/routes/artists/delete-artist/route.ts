import { publicProcedure } from "../../../create-context";
import { z } from "zod";

export const deleteArtistProcedure = publicProcedure
  .input(
    z.object({
      id: z.string(),
    })
  )
  .mutation(async ({ input }) => {
    console.log("[artists] Deleting artist", input.id);

    return {
      success: true,
      message: `Artist ${input.id} deleted successfully`,
    };
  });
