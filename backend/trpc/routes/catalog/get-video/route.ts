import { z } from "zod";
import { publicProcedure } from "@/backend/trpc/create-context";

// Legacy API format for compatibility
const LegacyVideoSchema = z.object({
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
  .output(LegacyVideoSchema)
  .query(async ({ input }) => {
    console.log(`[catalog] Getting video: ${input.id}`);
    
    // Mock video data
    if (input.id === 'video-1') {
      return {
        id: input.id,
        title: 'Sunset (Music Video)',
        artist: 'AI Artist',
        artwork: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800',
        duration: 240,
        type: 'video' as const,
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      };
    }
    
    // Fallback for unknown videos
    return {
      id: input.id,
      title: "Unknown Video",
      artist: "Unknown",
      artwork: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800",
      duration: 180,
      type: "video" as const,
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    };
  });
