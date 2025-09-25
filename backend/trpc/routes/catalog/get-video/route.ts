import { z } from "zod";
import { publicProcedure } from "@/backend/trpc/create-context";
import { catalogService, VideoSchema as CatalogVideoSchema } from "@/backend/services/catalog";

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
    
    const video = await catalogService.getVideo(input.id);
    if (video) {
      // Convert catalog video to legacy format
      return {
        id: String(video.id),
        title: video.title,
        artist: "Unknown", // TODO: Get from artist relationship
        artwork: video.preview_uri || "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800",
        duration: video.duration_ms ? Math.floor(video.duration_ms / 1000) : 180,
        type: "video" as const,
        videoUrl: video.stream_uri || "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
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
