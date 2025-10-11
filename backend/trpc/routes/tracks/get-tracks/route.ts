import { publicProcedure } from "../../../create-context";
import { z } from "zod";
import { databaseService } from "../../../services/database";

export const getTracksProcedure = publicProcedure
  .input(
    z.object({
      limit: z.number().optional().default(20),
      offset: z.number().optional().default(0),
      genre: z.string().optional(),
      artistId: z.string().optional(),
      albumId: z.string().optional(),
    })
  )
  .query(async ({ input }) => {
    console.log("[tracks] Getting tracks", input);

    try {
      // Use the enhanced database service
      const tracks = await databaseService.findTracks({
        limit: input.limit,
        offset: input.offset,
        genre: input.genre,
        artistId: input.artistId,
        albumId: input.albumId,
      });

      const total = await databaseService.count('tracks', {
        ...(input.genre && { genre: input.genre }),
        ...(input.artistId && { artistId: input.artistId }),
        ...(input.albumId && { albumId: input.albumId }),
      });

      return {
        tracks,
        total,
        limit: input.limit,
        offset: input.offset,
      };
    } catch (error) {
      console.error("[tracks] Error getting tracks:", error);
      throw new Error("Failed to fetch tracks");
    }
  });
