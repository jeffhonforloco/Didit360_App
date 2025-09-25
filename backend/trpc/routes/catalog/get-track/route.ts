import { z } from "zod";
import { publicProcedure } from "../../../create-context";
import { catalogService, TrackSchema } from "@/backend/services/catalog";

// Convert Track schema to API response format
const ApiTrackSchema = TrackSchema.extend({
  id: z.string().transform(String),
  release_id: z.number().optional().transform(val => val ? String(val) : undefined),
});

export const getTrackProcedure = publicProcedure
  .input(z.object({ id: z.string() }))
  .output(ApiTrackSchema.nullable())
  .query(async ({ input }) => {
    console.log(`[catalog] Getting track: ${input.id}`);
    
    const track = await catalogService.getTrack(input.id);
    if (!track) {
      console.log(`[catalog] Track not found: ${input.id}`);
      return null;
    }
    
    // Convert to API format
    return {
      ...track,
      id: String(track.id),
      release_id: track.release_id ? String(track.release_id) : undefined,
    };
  });
