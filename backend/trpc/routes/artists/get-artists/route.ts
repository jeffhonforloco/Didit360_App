import { publicProcedure } from "../../../create-context";
import { z } from "zod";
import { databaseService } from "../../../services/database";

export const getArtistsProcedure = publicProcedure
  .input(
    z.object({
      limit: z.number().optional().default(20),
      offset: z.number().optional().default(0),
      genre: z.string().optional(),
    })
  )
  .query(async ({ input }) => {
    console.log("[artists] Getting artists", input);

    try {
      // Use the enhanced database service
      const artists = await databaseService.findArtists({
        limit: input.limit,
        offset: input.offset,
        genre: input.genre,
      });

      const total = await databaseService.count('artists', {
        ...(input.genre && { genre: input.genre }),
      });

      return {
        artists,
        total,
        limit: input.limit,
        offset: input.offset,
      };
    } catch (error) {
      console.error("[artists] Error getting artists:", error);
      throw new Error("Failed to fetch artists");
    }
  });
