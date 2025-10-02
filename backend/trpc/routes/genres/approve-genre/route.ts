import { z } from "zod";
import { publicProcedure } from "../../../create-context";

export const approveGenreProcedure = publicProcedure
  .input(
    z.object({
      genre_id: z.string(),
      approved: z.boolean(),
      approved_by: z.string(),
      color: z.string().optional(),
      parent_genre_ids: z.array(z.string()).optional(),
    })
  )
  .mutation(async ({ input, ctx }) => {
    console.log("[genres.approveGenre] Approving genre", input);

    return {
      success: true,
      genre_id: input.genre_id,
      is_approved: input.approved,
      approved_at: new Date().toISOString(),
      approved_by: input.approved_by,
    };
  });
