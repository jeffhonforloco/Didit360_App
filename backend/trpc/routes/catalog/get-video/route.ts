import { z } from "zod";
import { publicProcedure } from "../../../create-context";

const VideoSchema = z.object({
  id: z.string(),
  title: z.string(),
  artist: z.string().optional(),
  artwork: z.string().url().optional(),
  duration: z.number().optional(),
  type: z.literal("video"),
  videoUrl: z.string().url().optional(),
});

export const getVideoProcedure = publicProcedure
  .input(z.object({ id: z.string() }))
  .output(VideoSchema)
  .query(async ({ input }) => {
    return {
      id: input.id,
      title: "Unknown Video",
      artist: "Unknown",
      artwork: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800",
      duration: 180,
      type: "video",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    };
  });
