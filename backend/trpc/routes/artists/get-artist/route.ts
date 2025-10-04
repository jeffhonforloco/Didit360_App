import { publicProcedure } from "../../../create-context";
import { z } from "zod";

export const getArtistByIdProcedure = publicProcedure
  .input(
    z.object({
      id: z.string(),
    })
  )
  .query(async ({ input }) => {
    console.log("[artists] Getting artist", input.id);

    const mockArtist = {
      id: input.id,
      name: "Electronic Waves",
      bio: "Electronic music producer and DJ from Berlin. Known for creating atmospheric soundscapes and energetic beats.",
      genre: "Electronic",
      image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800",
      bannerImage: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1200",
      verified: true,
      followers: 125000,
      monthlyListeners: 450000,
      albumCount: 5,
      trackCount: 48,
      popularity: 88,
      socialLinks: {
        instagram: "https://instagram.com/electronicwaves",
        twitter: "https://twitter.com/electronicwaves",
        spotify: "https://open.spotify.com/artist/123",
        website: "https://electronicwaves.com",
      },
      topTracks: [
        {
          id: "track-1",
          title: "Sunset Dreams",
          plays: 2500000,
          coverImage: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800",
        },
        {
          id: "track-2",
          title: "Midnight City",
          plays: 1800000,
          coverImage: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800",
        },
      ],
      albums: [
        {
          id: "album-1",
          title: "Neon Nights",
          releaseDate: "2024-01-15",
          coverImage: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800",
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return mockArtist;
  });
