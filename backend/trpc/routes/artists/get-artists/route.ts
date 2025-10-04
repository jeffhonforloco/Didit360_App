import { publicProcedure } from "../../../create-context";
import { z } from "zod";

export const getArtistsProcedure = publicProcedure
  .input(
    z.object({
      limit: z.number().optional().default(20),
      offset: z.number().optional().default(0),
      genre: z.string().optional(),
    })
  )
  .query(async ({ input }) => {
    console.log("[artists] Getting artists", input);

    const mockArtists = [
      {
        id: "artist-1",
        name: "Electronic Waves",
        bio: "Electronic music producer and DJ",
        genre: "Electronic",
        image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800",
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
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "artist-2",
        name: "Neon Lights",
        bio: "Synthwave artist from Los Angeles",
        genre: "Synthwave",
        image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800",
        verified: true,
        followers: 98000,
        monthlyListeners: 320000,
        albumCount: 3,
        trackCount: 32,
        popularity: 92,
        socialLinks: {
          instagram: "https://instagram.com/neonlights",
          twitter: "https://twitter.com/neonlights",
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "artist-3",
        name: "Ambient Collective",
        bio: "Creating peaceful soundscapes",
        genre: "Ambient",
        image: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800",
        verified: false,
        followers: 45000,
        monthlyListeners: 180000,
        albumCount: 7,
        trackCount: 56,
        popularity: 75,
        socialLinks: {
          spotify: "https://open.spotify.com/artist/789",
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    let filteredArtists = mockArtists;

    if (input.genre) {
      filteredArtists = filteredArtists.filter((a) => a.genre === input.genre);
    }

    const paginatedArtists = filteredArtists.slice(
      input.offset,
      input.offset + input.limit
    );

    return {
      artists: paginatedArtists,
      total: filteredArtists.length,
      limit: input.limit,
      offset: input.offset,
    };
  });
