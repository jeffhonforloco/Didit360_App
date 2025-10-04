import { publicProcedure } from "../../../create-context";
import { z } from "zod";

export const createArtistProcedure = publicProcedure
  .input(
    z.object({
      name: z.string(),
      bio: z.string().optional(),
      genre: z.string(),
      image: z.string().optional(),
      bannerImage: z.string().optional(),
      verified: z.boolean().optional().default(false),
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
    console.log("[artists] Creating artist", input);

    const newArtist = {
      id: `artist-${Date.now()}`,
      name: input.name,
      bio: input.bio || "",
      genre: input.genre,
      image: input.image || "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800",
      bannerImage: input.bannerImage,
      verified: input.verified,
      followers: 0,
      monthlyListeners: 0,
      albumCount: 0,
      trackCount: 0,
      popularity: 0,
      socialLinks: input.socialLinks || {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return {
      success: true,
      artist: newArtist,
    };
  });
