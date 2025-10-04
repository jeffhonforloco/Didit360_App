import { publicProcedure } from "../../../create-context";
import { z } from "zod";

export const getAlbumsProcedure = publicProcedure
  .input(
    z.object({
      limit: z.number().optional().default(20),
      offset: z.number().optional().default(0),
      artistId: z.string().optional(),
      genre: z.string().optional(),
    })
  )
  .query(async ({ input }) => {
    console.log("[albums] Getting albums", input);

    const mockAlbums = [
      {
        id: "album-1",
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
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "album-2",
        title: "Urban Dreams",
        artistId: "artist-2",
        artistName: "Neon Lights",
        releaseDate: "2024-02-20",
        genre: "Synthwave",
        trackCount: 10,
        duration: 2400000,
        coverImage: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800",
        label: "Synth Records",
        upc: "210987654321",
        type: "album",
        popularity: 92,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "album-3",
        title: "Nature Sounds",
        artistId: "artist-3",
        artistName: "Ambient Collective",
        releaseDate: "2024-03-10",
        genre: "Ambient",
        trackCount: 8,
        duration: 3200000,
        coverImage: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800",
        label: "Ambient Music",
        upc: "112233445566",
        type: "album",
        popularity: 75,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    let filteredAlbums = mockAlbums;

    if (input.artistId) {
      filteredAlbums = filteredAlbums.filter((a) => a.artistId === input.artistId);
    }
    if (input.genre) {
      filteredAlbums = filteredAlbums.filter((a) => a.genre === input.genre);
    }

    const paginatedAlbums = filteredAlbums.slice(
      input.offset,
      input.offset + input.limit
    );

    return {
      albums: paginatedAlbums,
      total: filteredAlbums.length,
      limit: input.limit,
      offset: input.offset,
    };
  });
