import { publicProcedure } from "../../../create-context";
import { z } from "zod";

export const updateArtistProcedure = publicProcedure
  .input(
    z.object({
      id: z.string(),
      name: z.string().optional(),
      bio: z.string().optional(),
      genre: z.string().optional(),
      image: z.string().optional(),
      bannerImage: z.string().optional(),
      verified: z.boolean().optional(),
      socialLinks: z
        .object({
          instagram: z.string().optional(),
          twitter: z.string().optional(),
          spotify: z.string().optional(),
          website: z.string().optional(),
        })
        .optional(),
    })
  )
  .mutation(async ({ input }) => {
    console.log("[artists] Updating artist", input);

    const updatedArtist = {
      id: input.id,
      name: input.name || "Updated Artist",
      bio: input.bio || "Updated bio",
      genre: input.genre || "Electronic",
      image: input.image || "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800",
      bannerImage: input.bannerImage,
      verified: input.verified ?? false,
      followers: 125000,
      monthlyListeners: 450000,
      albumCount: 5,
      trackCount: 48,
      popularity: 88,
      socialLinks: input.socialLinks || {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return {
      success: true,
      artist: updatedArtist,
    };
  });
