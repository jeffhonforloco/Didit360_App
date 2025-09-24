import { z } from "zod";
import { publicProcedure } from "../../../create-context";

const TrackSchema = z.object({
  id: z.string(),
  title: z.string(),
  artist: z.string(),
  album: z.string().optional(),
  artwork: z.string().url(),
  duration: z.number(),
  type: z.enum(["song", "podcast", "audiobook", "video"]),
  description: z.string().optional(),
  videoUrl: z.string().url().optional(),
  isVideo: z.boolean().optional(),
});

export const getTrackProcedure = publicProcedure
  .input(z.object({ id: z.string() }))
  .output(TrackSchema)
  .query(async ({ input }) => {
    return {
      id: input.id,
      title: "Unknown",
      artist: "Unknown",
      artwork: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800",
      duration: 180,
      type: "song",
    };
  });
