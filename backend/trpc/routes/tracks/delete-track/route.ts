import { publicProcedure } from "../../../create-context";
import { z } from "zod";

export const deleteTrackProcedure = publicProcedure
  .input(
    z.object({
      id: z.string(),
    })
  )
  .mutation(async ({ input }) => {
    console.log("[tracks] Deleting track", input.id);

    return {
      success: true,
      message: `Track ${input.id} deleted successfully`,
    };
  });
