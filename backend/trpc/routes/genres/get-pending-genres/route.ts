import { z } from "zod";
import { publicProcedure } from "../../../create-context";

export const getPendingGenresProcedure = publicProcedure
  .input(
    z.object({
      limit: z.number().optional().default(50),
      offset: z.number().optional().default(0),
    })
  )
  .query(async ({ input, ctx }) => {
    console.log("[genres.getPendingGenres] Fetching pending genres", input);

    const pendingGenres: any[] = [];

    return {
      genres: pendingGenres,
      total: pendingGenres.length,
      limit: input.limit,
      offset: input.offset,
    };
  });
