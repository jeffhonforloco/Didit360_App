import { z } from "zod";
import { publicProcedure } from "@/backend/trpc/create-context";
import { catalogService, TrackSchema } from "@/backend/services/catalog";

export const getTrackProcedure = publicProcedure
  .input(z.object({ id: z.string() }))
  .output(TrackSchema.nullable())
  .query(async ({ input }) => {
    console.log(`[catalog] Getting track: ${input.id}`);
    
    const track = await catalogService.getTrack(input.id);
    if (!track) {
      console.log(`[catalog] Track not found: ${input.id}`);
      return null;
    }
    
    return track;
  });
