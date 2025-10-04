import { publicProcedure } from "../../../create-context";
import { z } from "zod";

export const getAlbumProcedure = publicProcedure
  .input(
    z.object({
      id: z.string(),
    })
  )
  .query(async ({ input }) => {
    console.log("[albums] Getting album", input.id);

    const mockAlbum = {
      id: input.id,
      title: "Neon Nights",
      artistId: "artist-1",
      artistName: "Electronic Waves",
      releaseDate: "2024-01-15",
      genre: "Electronic",
      trackCount: 12,
      duration: 2880000,
      coverImage: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800",
      label: "Indie Records",
      upc: "123456789012",
      type: "album",
      popularity: 88,
      description: "A journey through electronic soundscapes",
      tracks: [
        {
          id: "track-1",
          title: "Sunset Dreams",
          trackNumber: 1,
          duration: 240000,
          explicit: false,
        },
        {
          id: "track-2",
          title: "Midnight City",
          trackNumber: 2,
          duration: 300000,
          explicit: false,
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return mockAlbum;
  });
